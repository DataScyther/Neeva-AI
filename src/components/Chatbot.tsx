import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useAppContext } from "./AppContext";
import { useUserId } from "../hooks/useAuthSelectors";
import { useAppStore } from "../store/useAppStore";
import { AIError, streamAIChat } from "../utils/ai-service";
import { detectCrisisSignals, detectMood, getTimeOfDay } from "../prompts/mentalWellnessPrompt";
import { saveChatMessage } from "../lib/db";
import { measurePerformance, triggerHapticFeedback, isMobileDevice } from "../utils/mobile-optimizations";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
    User, Send, Paperclip, X, Bookmark, FileText, Loader2,
    Sparkles, Heart, Brain, ChevronDown, ChevronUp
} from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from "framer-motion";


import "../styles/chatbot-premium.css";

/* ─── Static data ───────────────────────────────────────────── */

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
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-600 via-violet-600 to-blue-600 flex items-center justify-center shadow-xl"
            >
                <Sparkles className="w-8 h-8 text-white" />
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

/* ─── Reasoning block — shows Nemotron's thinking process ──── */
function ReasoningBlock({ reasoning }: { reasoning: string }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const previewLength = 200;
    const isLong = reasoning.length > previewLength;

    return (
        <div className="chatbot-reasoning-block">
            <button
                className="chatbot-reasoning-header"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="chatbot-reasoning-header-left">
                    <Brain className="w-3 h-3" />
                    <span>Neeva's Thinking</span>
                </div>
                {isLong && (
                    isExpanded
                        ? <ChevronUp className="w-3 h-3 text-slate-400" />
                        : <ChevronDown className="w-3 h-3 text-slate-400" />
                )}
            </button>
            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="chatbot-reasoning-body"
                    >
                        <ReactMarkdown components={{
                            p: ({ node, ...p }) => <p className="mb-1.5 last:mb-0 text-[11px] leading-relaxed" {...p} />,
                            strong: ({ node, ...p }) => <strong className="font-semibold" {...p} />,
                            ul: ({ node, ...p }) => <ul className="list-disc pl-3 mb-1 space-y-0.5 text-[11px]" {...p} />,
                            ol: ({ node, ...p }) => <ol className="list-decimal pl-3 mb-1 space-y-0.5 text-[11px]" {...p} />,
                            li: ({ node, ...p }) => <li className="mb-0.5" {...p} />,
                            code: ({ node, ...p }) => <code className="bg-black/5 dark:bg-white/10 rounded px-1 py-0.5 text-[10px] font-mono" {...p} />,
                        }}>{reasoning}</ReactMarkdown>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
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
    const [inputFocused, setInputFocused] = useState(false);
    const [showCrisisBanner, setShowCrisisBanner] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

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

    const appendChatMessageContent = useAppStore((s) => s.appendChatMessageContent);

    /* ── Stream AI response ── */
    const streamAIResponse = useCallback(
        async (opts: { userMessage: string; assistantMessageId: string }) => {
            const perf = measurePerformance('ai-response');
            perf.start();

            const history = state.chatHistory
                .filter((m) => !m.isUser || m.content !== opts.userMessage)
                .map((m) => ({
                    role: m.isUser ? ('user' as const) : ('assistant' as const),
                    content: m.content,
                }));

            let assembled = '';

            for await (const chunk of streamAIChat({
                text: opts.userMessage,
                uid: userId || '',
                history,
            })) {
                if (chunk.contentDelta) {
                    assembled += chunk.contentDelta;
                    appendChatMessageContent(opts.assistantMessageId, chunk.contentDelta);
                }
                if (chunk.done) break;
            }

            perf.end();
            return assembled;
        },
        [appendChatMessageContent, state.chatHistory, userId]
    );

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

        // Client-side crisis detection — show safety banner immediately
        if (detectCrisisSignals(content)) {
            setShowCrisisBanner(true);
            console.log('[Neeva Safety] Crisis signal detected — banner shown, AI will activate crisis protocol');
        }

        // Track mood for session context
        const mood = detectMood(content);
        if (mood !== 'neutral') {
            try { localStorage.setItem('neeva_last_mood', mood); } catch { /* silent */ }
        }

        const userMsg = { id: Date.now().toString(), content, isUser: true, timestamp: new Date() };
        dispatch({ type: "ADD_CHAT_MESSAGE", payload: userMsg });
        if (userId) saveChatMessage(userId, userMsg).catch(() => { });

        setMessage("");
        setAttachedFile(null);
        setIsTyping(true);

        // Track session count for returning-user personalization
        try {
            const count = parseInt(localStorage.getItem('neeva_session_count') || '0', 10);
            localStorage.setItem('neeva_session_count', String(count + 1));
        } catch { /* silent */ }

        requestAnimationFrame(async () => {
            const assistantId = (Date.now() + 1).toString();
            const aiMsg = {
                id: assistantId,
                content: '',
                isUser: false,
                timestamp: new Date(),
            };

            // Insert assistant message immediately for smooth streaming UX
            dispatch({ type: "ADD_CHAT_MESSAGE", payload: aiMsg });

            try {
                const finalContent = await streamAIResponse({
                    userMessage: content,
                    assistantMessageId: assistantId,
                });

                const finalMsg = {
                    ...aiMsg,
                    content: finalContent,
                };

                if (userId) saveChatMessage(userId, finalMsg);

                if (showCrisisBanner) {
                    setTimeout(() => setShowCrisisBanner(false), 30000);
                }
            } catch (err: any) {
                if (err instanceof AIError && err.statusCode === 429) {
                    setRateLimitUntil(Date.now() + 60000);
                    const rl = {
                        id: assistantId,
                        content: "⏳ I've hit my usage limit for now. Please wait about a minute before trying again. 💜",
                        isUser: false,
                        timestamp: new Date(),
                    };
                    // Overwrite local assistant message by adding deltas won't help; just persist fallback
                    dispatch({ type: "ADD_CHAT_MESSAGE", payload: rl });
                    if (userId) saveChatMessage(userId, rl);
                } else {
                    const fb = {
                        id: assistantId,
                        content: "I'm having trouble responding right now. Please try again in a moment. 💙",
                        isUser: false,
                        timestamp: new Date(),
                    };
                    dispatch({ type: "ADD_CHAT_MESSAGE", payload: fb });
                }
            }

            setIsTyping(false);
        });
    }, [message, attachedFile, dispatch, rateLimitUntil, userId, showCrisisBanner, streamAIResponse]);

    /* ── Welcome message — time-of-day aware ── */
    const welcomeSentRef = useRef(false);
    useEffect(() => {
        let t: NodeJS.Timeout;
        if (state.chatHistory.length === 0 && !state.isLoading && !welcomeSentRef.current) {
            welcomeSentRef.current = true;
            const name = state.user?.name || 'there';
            const tod = getTimeOfDay();
            const greetings: Record<string, string> = {
                morning: `Good morning, ${name}! ☀️ I'm **Neeva**, your wellness companion. How are you starting your day? I'm here to listen, support, or just chat — whatever you need. 💜`,
                afternoon: `Hey ${name}! 🌤️ I'm **Neeva**, your wellness companion. How's your afternoon going? Whether you want to talk something through or just decompress, I'm here. 💜`,
                evening: `Good evening, ${name}! 🌅 I'm **Neeva**, your wellness companion. How was your day? I'm here to listen, reflect, or help you wind down. 💜`,
                night: `Hey ${name} 🌙 I'm **Neeva**, your wellness companion. Late nights can bring a lot of thoughts — I'm here if you want to talk, vent, or just have some company. 💜`,
            };
            // Store user name for system prompt personalization
            if (state.user?.name) {
                try { localStorage.setItem('neeva_user_name', state.user.name); } catch { /* silent */ }
            }
            t = setTimeout(() => {
                dispatch({
                    type: "ADD_CHAT_MESSAGE",
                    payload: { id: "welcome", content: greetings[tod], isUser: false, timestamp: new Date() }
                });
            }, 500);
        }
        return () => {
            if (t) clearTimeout(t);
        };
    }, [state.chatHistory.length, state.isLoading, state.user?.name, dispatch]);

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
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-fuchsia-600 via-violet-600 to-blue-600 flex items-center justify-center">
                                <Sparkles className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="chatbot-status-dot" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-[14px] font-bold bg-gradient-to-r from-fuchsia-700 via-violet-600 to-blue-600 dark:from-pink-400 dark:via-violet-400 dark:to-blue-400 bg-clip-text text-transparent truncate leading-tight" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
                                Neeva AI
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

                {/* ═══ CRISIS SAFETY BANNER ═══ */}
                <AnimatePresence>
                    {showCrisisBanner && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="crisis-safety-banner"
                            style={{
                                background: 'linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(220,38,38,0.08) 100%)',
                                borderBottom: '1px solid rgba(239,68,68,0.2)',
                                padding: '10px 16px',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '10px',
                                fontSize: '12px',
                                lineHeight: '1.5',
                                color: 'var(--text-primary, #1e293b)',
                            }}
                        >
                            <Heart className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                            <div style={{ flex: 1 }}>
                                <strong style={{ color: '#dc2626' }}>You matter.</strong>{' '}
                                If you're in crisis, please reach out:
                                {' '}<strong>988 Suicide & Crisis Lifeline</strong> (call/text 988)
                                {' '}· <strong>Crisis Text Line</strong> (text HOME to 741741)
                            </div>
                            <button
                                onClick={() => setShowCrisisBanner(false)}
                                style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    padding: '2px', color: '#94a3b8', flexShrink: 0,
                                }}
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

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
                                        <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                                    </div>
                                )}

                                {/* Bubble */}
                                <div className={`chatbot-bubble ${msg.isUser ? 'chatbot-bubble--user' : 'chatbot-bubble--ai'}`}>
                                    {!msg.isUser && (
                                        <span className="chatbot-bubble-label">Neeva</span>
                                    )}

                                    {/* Reasoning Section — visible for AI messages with reasoning */}
                                    {!msg.isUser && msg.reasoning && (
                                        <ReasoningBlock reasoning={msg.reasoning} />
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

                    {/* Typing / Reasoning indicator */}
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
                                        <motion.div
                                            animate={{ rotate: [0, 15, -15, 0] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        >
                                            <Brain className="w-3.5 h-3.5 text-purple-500" />
                                        </motion.div>
                                    </div>
                                    <div className="chatbot-bubble chatbot-bubble--ai chatbot-bubble--typing">
                                        <span className="chatbot-bubble-label">Neeva</span>
                                        <div className="chatbot-reasoning-indicator">
                                            <motion.div
                                                className="chatbot-reasoning-pulse"
                                                animate={{ opacity: [0.4, 1, 0.4], scale: [0.95, 1.05, 0.95] }}
                                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                            >
                                                <Brain className="w-3 h-3" />
                                            </motion.div>
                                            <div className="chatbot-reasoning-text">
                                                <span className="chatbot-reasoning-label">reasoning deeply</span>
                                                <div className="chatbot-typing-dots" style={{ marginLeft: 4 }}>
                                                    {[0, 1, 2].map(i => (
                                                        <motion.span
                                                            key={i}
                                                            animate={{ y: [0, -4, 0], opacity: [0.3, 1, 0.3] }}
                                                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }}
                                                            className="chatbot-typing-dot"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[9px] text-slate-400 mt-1">this may take a moment — Neeva is thinking carefully</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>


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
                    {/* Input capsule */}
                    <div className={`chatbot-input-capsule ${inputFocused ? 'chatbot-input-capsule--focused' : ''}`}>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="chatbot-input-action"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isInputDisabled}
                            title="Attach a file"
                        >
                            <Paperclip className="w-[15px] h-[15px]" />
                        </motion.button>

                        <div className="flex-1 min-w-0">
                            <Textarea
                                ref={textareaRef}
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder="Share what's on your mind…"
                                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                                onFocus={() => setInputFocused(true)}
                                onBlur={() => setInputFocused(false)}
                                disabled={isInputDisabled}
                                className="chatbot-textarea"
                                rows={1}
                            />
                        </div>

                        {/* Action buttons — send appears when has content */}
                        <div className="flex items-center gap-1.5">
                            {/* Send button — visible when there's content */}
                            {hasContent && (
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
