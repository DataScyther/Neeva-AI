import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useAppContext } from "./AppContext";
import { useUserId } from "../hooks/useAuthSelectors";
import { callGemini, convertChatHistoryToGemini, GeminiError } from "../utils/gemini";
import { saveChatMessage } from "../lib/db";
import { measurePerformance, triggerHapticFeedback, isMobileDevice } from "../utils/mobile-optimizations";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
    User, Send, Mic, MicOff, Paperclip, X, Bookmark, FileText, Loader2,
    Wind, Moon, Flame, Sparkles, Heart, ArrowRight
} from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from "framer-motion";
import { NeevaOrb } from "./NeevaOrb";

import "../styles/chatbot-premium.css";

/* ─── Static data ───────────────────────────────────────────── */
const QUICK_SUGGESTIONS = [
    { text: "I'm feeling anxious today", emoji: "😰", icon: Wind, bg: "linear-gradient(135deg, #f43f5e, #e11d48)", shadow: "0 4px 14px -3px rgba(244,63,94,0.35)" },
    { text: "Help me with breathing exercises", emoji: "🫁", icon: Wind, bg: "linear-gradient(135deg, #0ea5e9, #0891b2)", shadow: "0 4px 14px -3px rgba(14,165,233,0.35)" },
    { text: "I can't sleep well", emoji: "😴", icon: Moon, bg: "linear-gradient(135deg, #6366f1, #7c3aed)", shadow: "0 4px 14px -3px rgba(99,102,241,0.35)" },
    { text: "I need motivation", emoji: "💪", icon: Flame, bg: "linear-gradient(135deg, #f59e0b, #ea580c)", shadow: "0 4px 14px -3px rgba(245,158,11,0.35)" },
] as const;

const ALLOWED_MIME_TYPES = [
    "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",
    "application/pdf", "text/plain", "text/csv", "text/markdown", "application/json",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const TIME_FORMATTER = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' });

interface AttachedFile {
    name: string;
    type: string;
    size: number;
    previewUrl?: string;
}

/* ─── Floating orbs for animated background depth ───────────── */
function FloatingOrbs() {
    return (
        <div className="chatbot-orbs-container">
            <div className="chatbot-orb chatbot-orb-1" />
            <div className="chatbot-orb chatbot-orb-2" />
            <div className="chatbot-orb chatbot-orb-3" />
        </div>
    );
}

/* ─── Empty state when no messages yet ──────────────────────── */
function EmptyState({ userName }: { userName: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center justify-center py-12 px-6 text-center select-none"
        >
            <motion.div
                animate={{ scale: [1, 1.06, 1], rotate: [0, 2, -2, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
                <NeevaOrb size="lg" />
            </motion.div>
            <h3 className="mt-6 text-xl font-semibold bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-600 bg-clip-text text-transparent">
                Hey {userName}! 💜
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                I'm <span className="font-medium text-purple-500">Neeva</span>, your wellness companion.
                Share how you're feeling — I'm here to listen, anytime.
            </p>
        </motion.div>
    );
}

/* ─── Main Chatbot ──────────────────────────────────────────── */
export function Chatbot() {
    const { state, dispatch } = useAppContext();
    const userId = useUserId();

    const [message, setMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [rateLimitUntil, setRateLimitUntil] = useState<number | null>(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [speechSupported, setSpeechSupported] = useState(false);
    const [inputFocused, setInputFocused] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioStreamRef = useRef<MediaStream | null>(null);
    const [voiceStatus, setVoiceStatus] = useState<string>('');

    // Check if voice recording is supported (MediaRecorder + getUserMedia)
    useEffect(() => {
        const supported = !!(navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined');
        setSpeechSupported(supported);
        console.log('[Voice] MediaRecorder voice input supported:', supported);
    }, []);

    /* ── Transcribe audio using Gemini API ── */
    const transcribeAudio = useCallback(async (audioBlob: Blob): Promise<string> => {
        console.log('[Voice] Sending audio to Gemini for transcription…', {
            size: audioBlob.size, type: audioBlob.type
        });
        const arrayBuffer = await audioBlob.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        let binary = '';
        for (let i = 0; i < uint8Array.length; i++) {
            binary += String.fromCharCode(uint8Array[i]);
        }
        const base64Audio = btoa(binary);
        const mimeType = audioBlob.type || 'audio/webm';

        const DEV_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
        const DEV_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash';
        const DEV_BASE_URL = import.meta.env.VITE_GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta';

        const contents = [{
            role: 'user' as const,
            parts: [
                { inlineData: { mimeType, data: base64Audio } },
                { text: 'Transcribe this audio exactly as spoken, word for word. Return ONLY the transcribed text with no additional commentary, labels, or formatting. If the audio is silent or unclear, return an empty string.' }
            ]
        }];

        const url = import.meta.env.DEV && DEV_API_KEY
            ? `${DEV_BASE_URL}/models/${DEV_MODEL}:generateContent?key=${DEV_API_KEY}`
            : '/api/chat';

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `Transcription error: ${response.status}`);
        }

        const data = await response.json();
        return (data.candidates?.[0]?.content?.parts?.[0]?.text || '').trim();
    }, []);

    /* ── Derived state ── */
    const conversationTitle = useMemo(() => {
        const first = state.chatHistory.find(m => m.isUser);
        if (!first) return "Neeva Chat";
        return first.content.length > 30 ? first.content.slice(0, 30) + "…" : first.content;
    }, [state.chatHistory]);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => { scrollToBottom(); }, [state.chatHistory, isTyping, scrollToBottom]);

    useEffect(() => {
        if (!textareaRef.current) return;
        const el = textareaRef.current;
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    }, [message]);

    useEffect(() => {
        if (rateLimitUntil) {
            const t = setTimeout(() => setRateLimitUntil(null), rateLimitUntil - Date.now());
            return () => clearTimeout(t);
        }
    }, [rateLimitUntil]);

    /* ── AI response ── */
    const getAIResponse = useCallback(async (userMessage: string): Promise<string> => {
        const perf = measurePerformance('ai-response');
        perf.start();
        try {
            const history = convertChatHistoryToGemini(
                state.chatHistory.filter(m => !m.isUser || m.content !== userMessage)
            );
            const response = await callGemini([...history, { role: "user" as const, parts: [{ text: userMessage }] }]);
            const duration = perf.end();
            console.log(`AI response in ${duration}ms`);
            return response;
        } catch (err: any) {
            const lo = userMessage.toLowerCase();
            if (err instanceof GeminiError) {
                if (err.statusCode === 429) return "⏳ I'm receiving a lot of requests right now. Please wait a moment and try again.";
                if (err.statusCode === 401) return "⚠️ Authentication failed. Make sure you're running 'vercel dev' for local development.";
                if (err.statusCode === 403) return "⚠️ Access forbidden. The API key may not have permission.";
                if (err.statusCode === 404 || err.statusCode === 500) return "⚠️ Backend unavailable. Run 'vercel dev' to start backend functions.";
                return `⚠️ ${err.message}`;
            }
            if (lo.includes("anxi") || lo.includes("anxiety")) return "Try the 4-7-8 breathing technique: breathe in for 4, hold for 7, exhale for 8. 🌱";
            if (lo.includes("sleep") || lo.includes("tired")) return "Create a calming bedtime routine and avoid screens before sleep. 🌙";
            if (lo.includes("sad") || lo.includes("down")) return "Your feelings are valid. Try gentle movement or call a friend. 💙";
            return "I'm here to listen and support you through this. 💜";
        }
    }, [state.chatHistory]);

    /* ── Send message ── */
    const sendMessage = useCallback(async (textOverride?: string) => {
        const text = (textOverride || message).trim();
        if (!text && !attachedFile) return;
        if (rateLimitUntil && Date.now() < rateLimitUntil) {
            const sec = Math.ceil((rateLimitUntil - Date.now()) / 1000);
            dispatch({ type: "ADD_CHAT_MESSAGE", payload: { id: Date.now().toString(), content: `⏳ Please wait ${sec} seconds before sending another message.`, isUser: false, timestamp: new Date() } });
            return;
        }
        if (isMobileDevice()) triggerHapticFeedback('light');

        let content = text;
        if (attachedFile) {
            content += content ? `\n\n📎 [${attachedFile.type.startsWith('image/') ? 'Image' : 'File'}: ${attachedFile.name}]` : `📎 [${attachedFile.type.startsWith('image/') ? 'Image' : 'File'}: ${attachedFile.name}]`;
        }

        const userMsg = { id: Date.now().toString(), content, isUser: true, timestamp: new Date() };
        dispatch({ type: "ADD_CHAT_MESSAGE", payload: userMsg });
        if (userId) saveChatMessage(userId, userMsg).catch(() => { });

        setMessage("");
        setAttachedFile(null);
        setIsTyping(true);

        requestAnimationFrame(async () => {
            try {
                const aiText = await getAIResponse(content);
                const aiMsg = { id: (Date.now() + 1).toString(), content: aiText, isUser: false, timestamp: new Date() };
                dispatch({ type: "ADD_CHAT_MESSAGE", payload: aiMsg });
                if (userId) saveChatMessage(userId, aiMsg);
            } catch (err) {
                if (err instanceof GeminiError && err.statusCode === 429) {
                    setRateLimitUntil(Date.now() + 60000);
                    const rl = { id: (Date.now() + 1).toString(), content: "⏳ I've hit my usage limit for now. Please wait about a minute before trying again. 💜", isUser: false, timestamp: new Date() };
                    dispatch({ type: "ADD_CHAT_MESSAGE", payload: rl });
                    if (userId) saveChatMessage(userId, rl);
                } else {
                    const fb = { id: (Date.now() + 1).toString(), content: "I'm having trouble responding right now. Please try again in a moment. 💙", isUser: false, timestamp: new Date() };
                    dispatch({ type: "ADD_CHAT_MESSAGE", payload: fb });
                }
            }
            setIsTyping(false);
        });
    }, [message, attachedFile, getAIResponse, dispatch, rateLimitUntil, userId]);

    /* ── Welcome message ── */
    useEffect(() => {
        if (state.chatHistory.length === 0) {
            setTimeout(() => dispatch({
                type: "ADD_CHAT_MESSAGE",
                payload: { id: "welcome", content: `Hello ${state.user?.name || 'there'}! 👋 I'm Neeva, your AI mental health companion. How are you feeling today? I'm here to listen and support you. 💜`, isUser: false, timestamp: new Date() }
            }), 500);
        }
    }, []);

    /* ── File handling ── */
    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!ALLOWED_MIME_TYPES.includes(file.type)) { setMessage('⚠️ Unsupported file type.'); return; }
        if (file.size > MAX_FILE_SIZE) { setMessage(`⚠️ Max file size is ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB.`); return; }
        const reader = new FileReader();
        reader.onload = () => setAttachedFile({ name: file.name, type: file.type, size: file.size, previewUrl: file.type.startsWith('image/') ? (reader.result as string) : undefined });
        reader.readAsDataURL(file);
        e.target.value = '';
    }, []);

    /* ── Voice recording (MediaRecorder + Gemini transcription) ── */
    const toggleRecording = useCallback(async () => {
        if (isRecording) {
            // ─── STOP RECORDING ───
            console.log('[Voice] 🛑 User stopped recording');
            setVoiceStatus('⏳ Transcribing…');

            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.stop();
            }
            if (audioStreamRef.current) {
                audioStreamRef.current.getTracks().forEach(track => track.stop());
                audioStreamRef.current = null;
            }
            setIsRecording(false);
            return;
        }

        // ─── START RECORDING ───
        setVoiceStatus('🎤 Requesting mic…');
        console.log('[Voice] 🎤 Starting voice recording…');

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 48000 }
            });
            audioStreamRef.current = stream;
            console.log('[Voice] ✅ Mic access granted');

            // Pick best supported format
            let mimeType = 'audio/webm;codecs=opus';
            if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'audio/webm';
            if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'audio/mp4';
            if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = '';
            console.log('[Voice] 📼 Format:', mimeType || 'default');

            const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
            audioChunksRef.current = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    audioChunksRef.current.push(e.data);
                    console.log('[Voice] 📦 Chunk:', e.data.size, 'bytes');
                }
            };

            recorder.onstop = async () => {
                console.log('[Voice] 📼 Stopped, chunks:', audioChunksRef.current.length);
                if (audioChunksRef.current.length === 0) {
                    setVoiceStatus('⚠️ No audio captured');
                    setTimeout(() => setVoiceStatus(''), 2500);
                    return;
                }

                const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
                console.log('[Voice] 📼 Blob:', audioBlob.size, 'bytes');

                if (audioBlob.size < 1000) {
                    setVoiceStatus('⚠️ Too short — try speaking longer');
                    setTimeout(() => setVoiceStatus(''), 2500);
                    return;
                }

                setVoiceStatus('⏳ Transcribing your voice…');
                try {
                    const transcript = await transcribeAudio(audioBlob);
                    console.log('[Voice] ✅ Transcript:', transcript);
                    if (transcript && transcript.length > 0) {
                        setMessage(prev => prev ? prev + ' ' + transcript : transcript);
                        setVoiceStatus('✅ Transcribed — review & send');
                    } else {
                        setVoiceStatus('🔇 No speech detected — try again');
                    }
                } catch (err: any) {
                    console.error('[Voice] ❌ Transcription failed:', err);
                    setVoiceStatus('⚠️ Transcription failed — try again');
                }
                setTimeout(() => setVoiceStatus(''), 3000);
            };

            recorder.onerror = (event: any) => {
                console.error('[Voice] ❌ Recorder error:', event.error);
                setVoiceStatus('⚠️ Recording error');
                setIsRecording(false);
                stream.getTracks().forEach(t => t.stop());
            };

            recorder.start(1000);
            mediaRecorderRef.current = recorder;
            setIsRecording(true);
            setVoiceStatus('🎤 Recording — speak now…');
            setMessage('');
            if (isMobileDevice()) triggerHapticFeedback('light');
            console.log('[Voice] ✅ Recording started');

        } catch (err: any) {
            console.error('[Voice] ❌ Failed:', err);
            setVoiceStatus(
                err.name === 'NotAllowedError' ? '⚠️ Mic permission denied' :
                err.name === 'NotFoundError' ? '⚠️ No microphone found' :
                '⚠️ Could not start recording'
            );
            setIsRecording(false);
            setTimeout(() => setVoiceStatus(''), 3000);
        }
    }, [isRecording, transcribeAudio]);

    const isInputDisabled = isTyping || (rateLimitUntil !== null && Date.now() < rateLimitUntil);
    const hasContent = message.trim().length > 0 || attachedFile !== null;
    const showEmptyState = state.chatHistory.length <= 1;

    /* ─── RENDER ─────────────────────────────────────────────── */
    return (
        <div className="chatbot-shell">
            <input ref={fileInputRef} type="file" accept={ALLOWED_MIME_TYPES.join(',')} className="hidden" onChange={handleFileSelect} />
            <FloatingOrbs />

            <div className="chatbot-container">
                {/* ═══ HEADER — glassmorphic floating bar ═══ */}
                <motion.header
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="chatbot-header"
                >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="chatbot-header-orb">
                            <NeevaOrb size="sm" />
                            <span className="chatbot-status-dot" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-[13px] font-semibold text-slate-800 dark:text-white truncate leading-tight">
                                {conversationTitle}
                            </h2>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight mt-0.5">
                                {state.chatHistory.length} message{state.chatHistory.length !== 1 ? 's' : ''} · Online
                            </p>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.88 }}
                        onClick={() => setIsBookmarked(!isBookmarked)}
                        className={`chatbot-header-action ${isBookmarked ? 'chatbot-header-action--active' : ''}`}
                    >
                        <Bookmark className={`w-4 h-4 transition-colors ${isBookmarked ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                    </motion.button>
                </motion.header>

                {/* ═══ MESSAGES ═══ */}
                <div className="chatbot-messages">
                    {showEmptyState && <EmptyState userName={state.user?.name?.split(' ')[0] || 'there'} />}

                    {state.chatHistory.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className={`chatbot-msg-row ${msg.isUser ? 'chatbot-msg-row--user' : 'chatbot-msg-row--ai'}`}
                        >
                            <div className={`chatbot-msg-group ${msg.isUser ? 'chatbot-msg-group--user' : ''}`}>
                                {/* Avatar */}
                                {msg.isUser ? (
                                    <div className="chatbot-avatar chatbot-avatar--user">
                                        <User className="w-3.5 h-3.5 text-white" />
                                    </div>
                                ) : (
                                    <div className="chatbot-avatar chatbot-avatar--ai">
                                        <NeevaOrb size="sm" />
                                    </div>
                                )}

                                {/* Bubble */}
                                <div className={`chatbot-bubble ${msg.isUser ? 'chatbot-bubble--user' : 'chatbot-bubble--ai'}`}>
                                    {!msg.isUser && (
                                        <span className="chatbot-bubble-label">Neeva</span>
                                    )}
                                    <div className="chatbot-bubble-content">
                                        {msg.isUser ? (
                                            <p className="whitespace-pre-line">{msg.content}</p>
                                        ) : (
                                            <ReactMarkdown components={{
                                                p: ({ node, ...p }) => <p className="mb-2 last:mb-0" {...p} />,
                                                ul: ({ node, ...p }) => <ul className="list-disc pl-4 mb-2 space-y-0.5" {...p} />,
                                                ol: ({ node, ...p }) => <ol className="list-decimal pl-4 mb-2 space-y-0.5" {...p} />,
                                                li: ({ node, ...p }) => <li className="mb-0.5" {...p} />,
                                                h1: ({ node, ...p }) => <h1 className="font-bold text-base mb-1.5 mt-3 first:mt-0" {...p} />,
                                                h2: ({ node, ...p }) => <h2 className="font-bold text-sm mb-1.5 mt-2 first:mt-0" {...p} />,
                                                h3: ({ node, ...p }) => <h3 className="font-bold text-[13px] mb-1 mt-2 first:mt-0" {...p} />,
                                                strong: ({ node, ...p }) => <strong className="font-semibold text-purple-600 dark:text-purple-300" {...p} />,
                                                blockquote: ({ node, ...p }) => <blockquote className="border-l-2 border-purple-300 dark:border-purple-600 pl-3 italic my-1.5 text-slate-600 dark:text-slate-300" {...p} />,
                                                code: ({ node, ...p }) => <code className="bg-black/5 dark:bg-white/10 rounded-md px-1.5 py-0.5 text-xs font-mono" {...p} />,
                                                a: ({ node, ...p }) => <a className="text-purple-500 hover:text-purple-600 underline decoration-purple-300 underline-offset-2" {...p} />,
                                            }}>{msg.content}</ReactMarkdown>
                                        )}
                                    </div>
                                    <span className={`chatbot-bubble-time ${msg.isUser ? 'chatbot-bubble-time--user' : ''}`}>
                                        {TIME_FORMATTER.format(new Date(msg.timestamp))}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Typing indicator */}
                    <AnimatePresence>
                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                className="chatbot-msg-row chatbot-msg-row--ai"
                            >
                                <div className="chatbot-msg-group">
                                    <div className="chatbot-avatar chatbot-avatar--ai">
                                        <NeevaOrb size="sm" />
                                    </div>
                                    <div className="chatbot-bubble chatbot-bubble--ai chatbot-bubble--typing">
                                        <span className="chatbot-bubble-label">Neeva</span>
                                        <div className="chatbot-typing-dots">
                                            {[0, 1, 2].map(i => (
                                                <motion.span
                                                    key={i}
                                                    animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                                                    transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                                                    className="chatbot-typing-dot"
                                                />
                                            ))}
                                        </div>
                                        <span className="text-[9px] text-slate-400 mt-1">thinking…</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>

                {/* ═══ QUICK SUGGESTIONS — structured cards ═══ */}
                <AnimatePresence>
                    {showEmptyState && (
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 12 }}
                            transition={{ duration: 0.35, delay: 0.3 }}
                            className="chatbot-suggestions"
                        >
                            <p className="chatbot-suggestions-label">
                                <Sparkles className="w-3 h-3" /> Quick Starters
                            </p>
                            <div className="chatbot-suggestions-grid">
                                {QUICK_SUGGESTIONS.map((s, i) => {
                                    const Icon = s.icon;
                                    return (
                                        <motion.button
                                            key={i}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 + i * 0.08 }}
                                            whileHover={{ scale: 1.03, y: -2 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => sendMessage(s.text)}
                                            className="chatbot-suggestion-card"
                                            style={{ background: s.bg, boxShadow: s.shadow }}
                                        >
                                            <div className="chatbot-suggestion-icon">
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <span className="chatbot-suggestion-text">{s.text}</span>
                                            <ArrowRight className="w-3 h-3 opacity-50 flex-shrink-0" />
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ═══ INPUT BAR — floating capsule ═══ */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                    className="chatbot-input-area"
                >
                    {/* File chip */}
                    <AnimatePresence>
                        {attachedFile && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="chatbot-file-chip-wrapper"
                            >
                                <div className="chatbot-file-chip">
                                    {attachedFile.type.startsWith('image/')
                                        ? <img src={attachedFile.previewUrl} alt="" className="w-6 h-6 rounded-md object-cover" />
                                        : <FileText className="w-4 h-4 text-purple-500" />
                                    }
                                    <span className="text-xs text-slate-600 dark:text-slate-300 truncate max-w-[140px]">{attachedFile.name}</span>
                                    <button onClick={() => setAttachedFile(null)} className="p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                                        <X className="w-3 h-3 text-slate-400" />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Recording indicator */}
                    <AnimatePresence>
                        {isRecording && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="chatbot-recording">
                                <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-2 h-2 rounded-full bg-red-500" />
                                <span className="text-xs font-medium text-red-500">{voiceStatus || 'Listening…'}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Input capsule */}
                    <div className={`chatbot-input-capsule ${inputFocused ? 'chatbot-input-capsule--focused' : ''}`}>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="chatbot-input-action"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isInputDisabled || isRecording}
                            title="Attach a file"
                        >
                            <Paperclip className="w-[15px] h-[15px]" />
                        </motion.button>

                        <div className="flex-1 min-w-0">
                            <Textarea
                                ref={textareaRef}
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder={isRecording ? (voiceStatus || "Listening… speak now") : "Share what's on your mind…"}
                                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                                onFocus={() => setInputFocused(true)}
                                onBlur={() => setInputFocused(false)}
                                disabled={isInputDisabled}
                                className="chatbot-textarea"
                                rows={1}
                            />
                        </div>

                        {/* Action buttons — mic/stop stays visible during recording, send appears when not recording + has content */}
                        <div className="flex items-center gap-1.5">
                            {/* Mic / Stop button — always visible when recording, or when no content typed */}
                            {(isRecording || !hasContent) && (
                                <motion.button
                                    key="mic"
                                    initial={{ opacity: 0, scale: 0.7 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.15 }}
                                    whileHover={{ scale: 1.12 }}
                                    whileTap={{ scale: 0.88 }}
                                    className={`chatbot-input-send ${isRecording ? 'chatbot-input-send--recording' : ''}`}
                                    onClick={toggleRecording}
                                    disabled={isInputDisabled}
                                    title={isRecording ? "Stop recording" : "Voice input"}
                                >
                                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                </motion.button>
                            )}

                            {/* Send button — visible when there's content AND not actively recording */}
                            {hasContent && !isRecording && (
                                <motion.button
                                    key="send"
                                    initial={{ opacity: 0, scale: 0.7 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.15 }}
                                    whileHover={{ scale: 1.12 }}
                                    whileTap={{ scale: 0.88 }}
                                    className="chatbot-input-send"
                                    onClick={() => sendMessage()}
                                    disabled={isInputDisabled}
                                    title="Send message"
                                >
                                    {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                </motion.button>
                            )}
                        </div>
                    </div>

                    {/* Rate limit badge */}
                    <AnimatePresence>
                        {rateLimitUntil && Date.now() < rateLimitUntil && (
                            <motion.div
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="chatbot-ratelimit"
                            >
                                ⏳ {Math.ceil((rateLimitUntil - Date.now()) / 1000)}s cooldown
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}
