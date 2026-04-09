import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useAppContext } from "./AppContext";
import { useUserId } from "../hooks/useAuthSelectors";
import { callGemini, convertChatHistoryToGemini, GeminiError } from "../utils/gemini";
import { saveChatMessage } from "../lib/db";
import { measurePerformance, triggerHapticFeedback, isMobileDevice } from "../utils/mobile-optimizations";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { User, Send, Mic, Paperclip, Bookmark } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { motion } from "framer-motion";
import { NeevaOrb } from "./NeevaOrb";

// Static data moved outside component
const QUICK_SUGGESTIONS = [
    {
        text: "I'm feeling anxious today",
        emoji: "😰",
        color: "from-red-400 to-pink-400",
    },
    {
        text: "Help me with breathing exercises",
        emoji: "🫁",
        color: "from-blue-400 to-cyan-400",
    },
    {
        text: "I can't sleep well",
        emoji: "😴",
        color: "from-indigo-400 to-purple-400",
    },
    {
        text: "I need motivation",
        emoji: "💪",
        color: "from-orange-400 to-yellow-400",
    },
] as const;

// Hoisted Intl.DateTimeFormat formatter
const TIME_FORMATTER = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' });

export function Chatbot() {
    const { state, dispatch } = useAppContext();
    const userId = useUserId();
    const [message, setMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [rateLimitUntil, setRateLimitUntil] = useState<number | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [isBookmarked, setIsBookmarked] = useState(false);

    // Extract conversation title from first user message
    const conversationTitle = useMemo(() => {
        const firstUserMsg = state.chatHistory.find((msg) => msg.isUser);
        if (!firstUserMsg) return "Chat";
        const text = firstUserMsg.content;
        return text.length > 30 ? text.slice(0, 30) + "…" : text;
    }, [state.chatHistory]);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [state.chatHistory, isTyping, scrollToBottom]);

    useEffect(() => {
        if (!textareaRef.current) return;
        const el = textareaRef.current;
        el.style.height = "auto";
        const maxHeight = 240;
        el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
    }, [message]);

    // Clear rate limit after timeout
    useEffect(() => {
        if (rateLimitUntil) {
            const timer = setTimeout(() => {
                setRateLimitUntil(null);
            }, rateLimitUntil - Date.now());

            return () => clearTimeout(timer);
        }
    }, [rateLimitUntil]);

    const getAIResponse = useCallback(async (userMessage: string): Promise<string> => {
        const perf = measurePerformance('ai-response');
        perf.start();

        try {
            const chatHistory = convertChatHistoryToGemini(
                state.chatHistory.filter(
                    (msg) => !msg.isUser || msg.content !== userMessage,
                ),
            );
            const messages = [
                ...chatHistory,
                { role: "user" as const, parts: [{ text: userMessage }] },
            ];
            const response = await callGemini(messages);

            const duration = perf.end();
            console.log(`AI response generated in ${duration}ms`);

            return response;
        } catch (error: any) {
            if (error instanceof GeminiError && !error.statusCode) {
                console.error("Gemini configuration error:", error.message);
            } else {
                console.error("AI API Error:", error);
            }
            const lowerMessage = userMessage.toLowerCase();

            if (error instanceof GeminiError) {
                if (error.statusCode === 401) {
                    return "⚠️ Authentication failed. The backend API key needs to be configured. For local development, make sure you're running 'vercel dev' instead of 'npm run dev'.";
                }
                if (error.statusCode === 403) {
                    return "⚠️ Access forbidden. The API key may not have permission to access this model.";
                }
                if (error.statusCode === 429) {
                    return "⏳ I'm receiving a lot of requests right now. Please wait a moment and try again.";
                }
                if (error.statusCode === 404 || error.statusCode === 500) {
                    return "⚠️ Backend service unavailable. For local testing, run 'vercel dev' to start the backend functions.";
                }
                return `⚠️ ${error.message}`;
            }

            return getFallbackResponse(lowerMessage);
        }
    }, [state.chatHistory]);

    const getFallbackResponse = useCallback((lowerMessage: string): string => {
        if (lowerMessage.includes("anxious") || lowerMessage.includes("anxiety")) {
            return "Try the 4-7-8 breathing technique: breathe in for 4, hold for 7, exhale for 8. 🌱";
        }
        if (lowerMessage.includes("sleep") || lowerMessage.includes("tired")) {
            return "Create a calming bedtime routine and avoid screens before sleep. 🌙";
        }
        if (lowerMessage.includes("sad") || lowerMessage.includes("down")) {
            return "Your feelings are valid. Try gentle movement or call a friend. 💙";
        }
        return "I'm here to listen and support you through this. 💜";
    }, []);

    const sendMessage = useCallback(async (messageText?: string) => {
        const textToSend = messageText || message;
        if (!textToSend.trim()) return;

        if (rateLimitUntil && Date.now() < rateLimitUntil) {
            const remainingTime = Math.ceil((rateLimitUntil - Date.now()) / 1000);
            dispatch({
                type: "ADD_CHAT_MESSAGE",
                payload: {
                    id: Date.now().toString(),
                    content: `⏳ Please wait ${remainingTime} seconds before sending another message to avoid rate limits.`,
                    isUser: false,
                    timestamp: new Date(),
                },
            });
            return;
        }

        if (isMobileDevice()) {
            triggerHapticFeedback('light');
        }

        const userMessage = {
            id: Date.now().toString(),
            content: textToSend,
            isUser: true,
            timestamp: new Date(),
        };

        dispatch({
            type: "ADD_CHAT_MESSAGE",
            payload: userMessage,
        });

        if (userId) {
            saveChatMessage(userId, userMessage).catch(error => {
                console.error('Failed to save chat message:', error);
            });
        }
        setMessage("");
        setIsTyping(true);

        requestAnimationFrame(async () => {
            try {
                const aiResponseContent = await getAIResponse(textToSend);
                const aiResponse = {
                    id: (Date.now() + 1).toString(),
                    content: aiResponseContent,
                    isUser: false,
                    timestamp: new Date(),
                };

                dispatch({
                    type: "ADD_CHAT_MESSAGE",
                    payload: aiResponse,
                });

                if (userId) {
                    saveChatMessage(userId, aiResponse);
                }
                setIsTyping(false);
            } catch (error) {
                console.error('Error getting AI response:', error);

                if (error instanceof GeminiError && error.statusCode === 429) {
                    setRateLimitUntil(Date.now() + 60000);

                    const rateLimitResponse = {
                        id: (Date.now() + 1).toString(),
                        content: "⏳ I've hit my usage limit for now. Please wait about a minute before trying again. In the meantime, feel free to use the quick suggestion buttons below! 💜",
                        isUser: false,
                        timestamp: new Date(),
                    };

                    dispatch({
                        type: "ADD_CHAT_MESSAGE",
                        payload: rateLimitResponse,
                    });
                    if (userId) {
                        saveChatMessage(userId, rateLimitResponse);
                    }
                } else {
                    const fallbackResponse = {
                        id: (Date.now() + 1).toString(),
                        content: "I'm having trouble responding right now. Please try again in a moment. 💙",
                        isUser: false,
                        timestamp: new Date(),
                    };

                    dispatch({
                        type: "ADD_CHAT_MESSAGE",
                        payload: fallbackResponse,
                    });
                    if (userId) {
                        saveChatMessage(userId, fallbackResponse).catch(error => {
                            console.error('Failed to save fallback message:', error);
                        });
                    }
                }
                setIsTyping(false);
            }
        });
    }, [message, getAIResponse, dispatch, rateLimitUntil, userId]);

    useEffect(() => {
        if (state.chatHistory.length === 0) {
            const welcomeMessage = {
                id: "welcome",
                content: `Hello ${state.user?.name || 'there'}! 👋 I'm Neeva, your AI mental health companion. How are you feeling today? I'm here to listen and support you. 💜`,
                isUser: false,
                timestamp: new Date(),
            };

            setTimeout(() => {
                dispatch({
                    type: "ADD_CHAT_MESSAGE",
                    payload: welcomeMessage,
                });
            }, 500);
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-purple-900 dark:via-blue-900 dark:to-cyan-900 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-3xl"
            >
                <Card className="border-0 shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md overflow-hidden flex flex-col" style={{ height: "min(85vh, 780px)" }}>
                    {/* ===== HEADER ===== */}
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-700/60 bg-white/60 dark:bg-slate-800/60">
                        <div className="flex items-center space-x-3">
                            <NeevaOrb size="sm" />
                            <div>
                                <h2 className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                                    {conversationTitle}
                                </h2>
                                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                                    {state.chatHistory.length} message{state.chatHistory.length !== 1 ? "s" : ""}
                                </p>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsBookmarked(!isBookmarked)}
                            className={`p-2 rounded-full transition-colors ${isBookmarked
                                    ? "bg-amber-100 dark:bg-amber-900/30"
                                    : "hover:bg-slate-100 dark:hover:bg-slate-700"
                                }`}
                        >
                            <Bookmark
                                className={`w-4 h-4 ${isBookmarked
                                        ? "text-amber-500 fill-amber-500"
                                        : "text-slate-400"
                                    }`}
                            />
                        </motion.button>
                    </div>

                    <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
                        {/* ===== MESSAGES ===== */}
                        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                            {state.chatHistory.map((msg, index) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`flex items-start space-x-2.5 max-w-[80%] ${msg.isUser ? "flex-row-reverse space-x-reverse" : ""}`}
                                    >
                                        {msg.isUser ? (
                                            <div className="flex-shrink-0 p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 shadow-sm mt-1">
                                                <User className="w-3.5 h-3.5 text-white" />
                                            </div>
                                        ) : (
                                            <NeevaOrb size="sm" className="mt-1" />
                                        )}

                                        <div
                                            className={`rounded-2xl shadow-sm overflow-hidden ${msg.isUser
                                                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                                                : "bg-slate-50 dark:bg-slate-700/80 border border-slate-100 dark:border-slate-600"
                                                }`}
                                        >
                                            {!msg.isUser && (
                                                <p className="text-[10px] font-semibold text-purple-500/80 dark:text-purple-400/80 px-3 pt-2 pb-0">
                                                    Neeva
                                                </p>
                                            )}
                                            <div className={`px-3.5 pt-1.5 pb-1 leading-relaxed break-words overflow-wrap-anywhere ${msg.isUser ? "text-white" : "text-slate-700 dark:text-slate-200"}`}>
                                                {msg.isUser ? (
                                                    <p className="break-words text-[14.5px]">{msg.content}</p>
                                                ) : (
                                                    <div className="text-[14.5px]">
                                                        <ReactMarkdown
                                                            components={{
                                                                p: ({ node, ...props }) => <p className="mb-2.5 last:mb-0 break-words" {...props} />,
                                                                ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2.5 space-y-0.5 break-words" {...props} />,
                                                                ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2.5 space-y-0.5 break-words" {...props} />,
                                                                li: ({ node, ...props }) => <li className="mb-0.5 break-words" {...props} />,
                                                                h1: ({ node, ...props }) => <h1 className="text-base font-bold mb-1.5 mt-3 first:mt-0 break-words" {...props} />,
                                                                h2: ({ node, ...props }) => <h2 className="text-sm font-bold mb-1.5 mt-2.5 first:mt-0 break-words" {...props} />,
                                                                h3: ({ node, ...props }) => <h3 className="text-[13px] font-bold mb-1.5 mt-2 first:mt-0 break-words" {...props} />,
                                                                strong: ({ node, ...props }) => <strong className="font-semibold text-indigo-600 dark:text-indigo-400 break-words" {...props} />,
                                                                em: ({ node, ...props }) => <em className="italic break-words" {...props} />,
                                                                blockquote: ({ node, ...props }) => <blockquote className="border-l-2 border-indigo-200 dark:border-indigo-600 pl-3 italic my-2 break-words" {...props} />,
                                                                code: ({ node, ...props }) => <code className="bg-slate-100 dark:bg-slate-600 rounded px-1 py-0.5 text-xs font-mono break-all" {...props} />,
                                                                a: ({ node, ...props }) => <a className="text-blue-500 underline break-all" {...props} />,
                                                            }}
                                                        >
                                                            {msg.content}
                                                        </ReactMarkdown>
                                                    </div>
                                                )}
                                            </div>
                                            <p className={`text-[10px] px-3 pb-2 pt-0.5 ${msg.isUser ? "text-white/50" : "text-slate-400 dark:text-slate-500"}`}>
                                                {TIME_FORMATTER.format(new Date(msg.timestamp))}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Typing indicator */}
                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-start"
                                >
                                    <div className="flex items-start space-x-2.5 max-w-[80%]">
                                        <NeevaOrb size="sm" className="mt-1" />
                                        <div className="rounded-2xl bg-slate-50 dark:bg-slate-700/80 border border-slate-100 dark:border-slate-600 px-4 py-3">
                                            <div className="flex space-x-1.5">
                                                <motion.div
                                                    animate={{ y: [0, -4, 0] }}
                                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                                    className="w-2 h-2 rounded-full bg-purple-400"
                                                />
                                                <motion.div
                                                    animate={{ y: [0, -4, 0] }}
                                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                                                    className="w-2 h-2 rounded-full bg-purple-400"
                                                />
                                                <motion.div
                                                    animate={{ y: [0, -4, 0] }}
                                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                                                    className="w-2 h-2 rounded-full bg-purple-400"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* ===== QUICK SUGGESTIONS ===== */}
                        {state.chatHistory.length <= 1 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="px-5 pb-3"
                            >
                                <p className="text-[10px] font-medium mb-2 text-center text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                    Quick starters
                                </p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {QUICK_SUGGESTIONS.map((suggestion, index) => (
                                        <motion.button
                                            key={index}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r ${suggestion.color} text-white text-xs font-medium shadow-sm hover:shadow-md transition-all`}
                                            onClick={() => sendMessage(suggestion.text)}
                                        >
                                            <span>{suggestion.emoji}</span>
                                            <span>{suggestion.text}</span>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* ===== INPUT ===== */}
                        <div className="px-5 pb-5 pt-3 bg-gradient-to-t from-slate-50/80 via-transparent to-transparent dark:from-slate-900/80">
                            <div className="bg-white dark:bg-slate-700/80 rounded-2xl border border-slate-200 dark:border-slate-600 shadow-sm p-2.5">
                                <div className="flex items-end gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors flex-shrink-0"
                                        onClick={() => { /* TODO: file upload */ }}
                                    >
                                        <Paperclip className="w-4 h-4" />
                                    </motion.button>

                                    <div className="flex-1 min-w-0">
                                        <Textarea
                                            ref={textareaRef}
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Share what's on your mind..."
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault();
                                                    sendMessage();
                                                }
                                            }}
                                            disabled={isTyping || (rateLimitUntil !== null && Date.now() < rateLimitUntil)}
                                            className="text-sm min-h-[36px] max-h-32 w-full resize-none border-none bg-transparent shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-0"
                                            rows={1}
                                        />
                                        {rateLimitUntil && Date.now() < rateLimitUntil && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 4 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-[10px] font-medium"
                                            >
                                                <span>⏳</span>
                                                <span>{Math.ceil((rateLimitUntil - Date.now()) / 1000)}s</span>
                                            </motion.div>
                                        )}
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-sm hover:shadow-md transition-all flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                                        disabled={isTyping || (rateLimitUntil !== null && Date.now() < rateLimitUntil)}
                                        onClick={() => { /* TODO: voice input */ }}
                                    >
                                        <Mic className="w-4 h-4" />
                                    </motion.button>

                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            onClick={() => sendMessage()}
                                            disabled={!message.trim() || isTyping || (rateLimitUntil !== null && Date.now() < rateLimitUntil)}
                                            className={`h-9 w-9 rounded-xl shadow-sm ${rateLimitUntil && Date.now() < rateLimitUntil
                                                    ? "bg-slate-300 dark:bg-slate-600 cursor-not-allowed"
                                                    : "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                                                }`}
                                        >
                                            <Send className="w-4 h-4" />
                                        </Button>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
