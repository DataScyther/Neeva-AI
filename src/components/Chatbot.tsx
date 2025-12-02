import { useState, useEffect, useRef, useCallback } from "react";
import { useAppContext } from "./AppContext";
import { callGemini, convertChatHistoryToGemini, GeminiError } from "../utils/gemini";
import { measurePerformance, triggerHapticFeedback, isMobileDevice } from "../utils/mobile-optimizations";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Bot, User, Send } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { motion } from "framer-motion";

export function Chatbot() {
    const { state, dispatch } = useAppContext();
    const [message, setMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [rateLimitUntil, setRateLimitUntil] = useState<number | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    };

    useEffect(() => {
        scrollToBottom();
    }, [state.chatHistory, isTyping]);

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

    const quickSuggestions = [
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
    ];

    const getAIResponse = useCallback(async (userMessage: string): Promise<string> => {
        const perf = measurePerformance('ai-response');
        perf.start();

        try {
            // API calls are now handled through secure backend proxy (/api/chat)
            // No frontend API key needed - all authentication happens server-side

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
            // Only log non-expected errors
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

        // Check if rate limited
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

        // Haptic feedback for mobile
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
        setMessage("");
        setIsTyping(true);

        // Use requestAnimationFrame for smooth UI update
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
                setIsTyping(false);
            } catch (error) {
                console.error('Error getting AI response:', error);

                // Handle rate limit errors specifically
                if (error instanceof GeminiError && error.statusCode === 429) {
                    // Set rate limit for 60 seconds
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
                }
                setIsTyping(false);
            }
        });
    }, [message, getAIResponse, dispatch, rateLimitUntil]);

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
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-purple-900 dark:via-blue-900 dark:to-cyan-900">
            <div className="max-w-5xl mx-auto p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8"
                >
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-lg">
                            <Bot className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Neeva AI Companion
                        </h1>
                    </div>
                    <p className="text-lg text-muted-foreground">
                        Your safe space for support, guidance, and growth 🌱
                    </p>
                </motion.div>

                <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardContent className="p-0">
                        {/* Messages Area */}
                        <div className="h-[60vh] overflow-y-auto p-6 space-y-6">
                            {state.chatHistory.map((msg, index) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.4,
                                        delay: index * 0.1,
                                    }}
                                    className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`flex items-start space-x-3 max-w-[85%] ${msg.isUser ? "flex-row-reverse space-x-reverse" : ""}`}
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            className={`p-3 rounded-2xl shadow-lg ${msg.isUser
                                                ? "bg-gradient-to-r from-blue-500 to-purple-500"
                                                : "bg-gradient-to-r from-violet-500 to-purple-500"
                                                }`}
                                        >
                                            {msg.isUser ? (
                                                <User className="w-5 h-5 text-white" />
                                            ) : (
                                                <Bot className="w-5 h-5 text-white" />
                                            )}
                                        </motion.div>

                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            className={`p-4 rounded-3xl shadow-lg ${msg.isUser
                                                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                                                : "bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600"
                                                }`}
                                        >
                                            <div className={`leading-relaxed ${msg.isUser ? "text-white" : "text-gray-800 dark:text-gray-200"}`}>
                                                {msg.isUser ? (
                                                    <p>{msg.content}</p>
                                                ) : (
                                                    <ReactMarkdown
                                                        components={{
                                                            p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
                                                            ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-3 space-y-1" {...props} />,
                                                            ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-3 space-y-1" {...props} />,
                                                            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                                            h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-2 mt-4 first:mt-0" {...props} />,
                                                            h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-2 mt-3 first:mt-0" {...props} />,
                                                            h3: ({ node, ...props }) => <h3 className="text-base font-bold mb-2 mt-3 first:mt-0" {...props} />,
                                                            strong: ({ node, ...props }) => <strong className="font-bold text-indigo-600 dark:text-indigo-400" {...props} />,
                                                            em: ({ node, ...props }) => <em className="italic" {...props} />,
                                                            blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-indigo-300 pl-4 italic my-3" {...props} />,
                                                            code: ({ node, ...props }) => <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 text-sm font-mono" {...props} />,
                                                        }}
                                                    >
                                                        {msg.content}
                                                    </ReactMarkdown>
                                                )}
                                            </div>
                                            <p
                                                className={`text-xs mt-2 ${msg.isUser
                                                    ? "text-white/70"
                                                    : "text-muted-foreground"
                                                    }`}
                                            >
                                                {new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(new Date(msg.timestamp))}
                                            </p>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Suggestions - Always available even during rate limits */}
                        {state.chatHistory.length <= 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="px-6 pb-4"
                            >
                                <p className="text-sm font-medium mb-3 text-center">
                                    ✨ Try one of these conversation starters:
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    {quickSuggestions.map((suggestion, index) => (
                                        <motion.button
                                            key={index}
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`p-4 rounded-2xl bg-gradient-to-r ${suggestion.color} text-white shadow-lg hover:shadow-xl transition-all duration-300`}
                                            onClick={() =>
                                                sendMessage(suggestion.text)
                                            }
                                        >
                                            <div className="flex items-center space-x-2">
                                                <span className="text-xl">
                                                    {suggestion.emoji}
                                                </span>
                                                <span className="text-sm font-medium">
                                                    {suggestion.text}
                                                </span>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Input Area */}
                        <div className="p-5 bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 border-t border-slate-200/40 dark:border-slate-700/60">
                            <div className="max-w-3xl mx-auto">
                                <div className="border-input bg-background/90 dark:bg-slate-950/70 rounded-3xl border shadow-[0_18px_45px_rgba(15,23,42,0.25)] p-3 sm:p-4">
                                    <div className="flex items-end gap-3">
                                        <div className="flex-1 relative">
                                            <Textarea
                                                ref={textareaRef}
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                placeholder="Share what's on your mind... 💭"
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" && !e.shiftKey) {
                                                        e.preventDefault();
                                                        sendMessage();
                                                    }
                                                }}
                                                disabled={isTyping || (rateLimitUntil !== null && Date.now() < rateLimitUntil)}
                                                className="text-primary min-h-[44px] max-h-60 w-full resize-none border-none bg-transparent shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400 pr-10"
                                                rows={1}
                                            />
                                            {rateLimitUntil && Date.now() < rateLimitUntil && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="absolute -top-8 left-0 right-0 text-center"
                                                >
                                                    <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-full text-sm">
                                                        <span>⏳ Rate limited</span>
                                                        <span className="font-medium">
                                                            {Math.ceil((rateLimitUntil - Date.now()) / 1000)}s
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                        <motion.div
                                            whileHover={{ scale: rateLimitUntil && Date.now() < rateLimitUntil ? 1 : 1.05 }}
                                            whileTap={{ scale: rateLimitUntil && Date.now() < rateLimitUntil ? 1 : 0.95 }}
                                        >
                                            <Button
                                                onClick={() => sendMessage()}
                                                disabled={!message.trim() || isTyping || (rateLimitUntil !== null && Date.now() < rateLimitUntil)}
                                                className={`h-11 w-11 rounded-2xl shadow-[0_16px_40px_rgba(88,28,135,0.45)] ${rateLimitUntil && Date.now() < rateLimitUntil
                                                    ? "bg-gray-400 cursor-not-allowed"
                                                    : "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                                                    }`}
                                            >
                                                {rateLimitUntil && Date.now() < rateLimitUntil ? (
                                                    <span className="text-white text-xs">⏳</span>
                                                ) : (
                                                    <Send className="w-5 h-5" />
                                                )}
                                            </Button>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
