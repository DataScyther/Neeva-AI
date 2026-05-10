import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from './AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Bookmark, MoreHorizontal, Paperclip, Send,
  Home, MessageCircle, Plus, Brain, User as UserIcon,
  Wind, Book, Heart
} from 'lucide-react';

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  suggestions?: string[];
}

const LotusIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2v20" />
    <path d="M12 22c5-1.5 8-6 8-11s-3-9-8-9" />
    <path d="M12 22c-5-1.5-8-6-8-11s3-9 8-9" />
    <path d="M12 11c3-1 5-4 5-8" />
    <path d="M12 11c-3-1-5-4-5-8" />
  </svg>
);

export function Chatbot() {
  const { state, dispatch } = useAppContext();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickSuggestions = [
    { text: "Let's breathe", icon: <Wind className="w-4 h-4 mr-2 text-purple-500" /> },
    { text: "Talk more", icon: <Heart className="w-4 h-4 mr-2 text-pink-500" /> },
    { text: "Coping tips", icon: <LotusIcon className="w-4 h-4 mr-2 text-indigo-500" /> }
  ];

  const bottomActionCards = [
    { label: "Meditate", icon: <LotusIcon className="w-6 h-6 text-purple-600" />, bg: "bg-purple-100/50" },
    { label: "Breathing", icon: <Wind className="w-6 h-6 text-blue-500" />, bg: "bg-blue-100/50" },
    { label: "Journal", icon: <Book className="w-6 h-6 text-orange-500" />, bg: "bg-orange-100/50" },
    { label: "Mood", icon: <Heart className="w-6 h-6 text-pink-500" />, bg: "bg-pink-100/50" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.chatHistory, isTyping]);

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety')) {
      return "I'm sorry to hear that.\nAnxiety can be really overwhelming.\n\nWould you like to try a quick breathing exercise with me?";
    }
    return "I'm here to support you. Let's talk about what's on your mind.";
  };

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || message;
    if (!textToSend.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: textToSend,
      isUser: true,
      timestamp: new Date()
    };

    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMessage });
    setMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(textToSend),
        isUser: false,
        timestamp: new Date()
      };
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: aiResponse });
      setIsTyping(false);
    }, 1500);
  };

  useEffect(() => {
    if (state.chatHistory.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        content: `Hello! 👋 I'm Neeva.\n\nI'm here to listen and support you.\n\nHow are you feeling today?`,
        isUser: false,
        timestamp: new Date()
      };
      setTimeout(() => {
        dispatch({ type: 'ADD_CHAT_MESSAGE', payload: welcomeMessage });
      }, 500);
    }
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div 
      className="relative flex flex-col w-full h-[100dvh] overflow-hidden font-sans"
      style={{
        background: 'radial-gradient(circle at top, rgba(167,139,250,0.12), transparent 30%), linear-gradient(180deg, #F8F7FC 0%, #F3F1F9 100%)',
        fontFamily: "'Inter', 'SF Pro Display', sans-serif"
      }}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between px-5 pt-safe-top z-20 flex-shrink-0"
        style={{
          height: '92px',
          background: 'rgba(255,255,255,0.82)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          boxShadow: '0 10px 40px rgba(124,77,255,0.08)',
          borderRadius: '0 0 28px 28px'
        }}
      >
        <button 
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'dashboard' })}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100/50 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>

        <div className="flex flex-col items-center flex-1">
          <div className="relative">
            <div 
              className="w-[52px] h-[52px] rounded-full flex items-center justify-center bg-white shadow-sm relative z-10"
              style={{ boxShadow: '0 4px 12px rgba(124,77,255,0.15)' }}
            >
              <div 
                className="w-11 h-11 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #EBE6FF 0%, #F3F0FF 100%)' }}
              >
                 <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#7B4DFF"/>
                    <path d="M15.5 9.5C15.5 10.3284 14.8284 11 14 11C13.1716 11 12.5 10.3284 12.5 9.5C12.5 8.67157 13.1716 8 14 8C14.8284 8 15.5 8.67157 15.5 9.5Z" fill="#7B4DFF"/>
                    <path d="M8.5 9.5C8.5 10.3284 9.17157 11 10 11C10.8284 11 11.5 10.3284 11.5 9.5C11.5 8.67157 10.8284 8 10 8C9.17157 8 8.5 8.67157 8.5 9.5Z" fill="#7B4DFF"/>
                    <path d="M12 16C13.66 16 15.14 15.09 15.87 13.63L14.13 12.63C13.66 13.56 12.89 14 12 14C11.11 14 10.34 13.56 9.87 12.63L8.13 13.63C8.86 15.09 10.34 16 12 16Z" fill="#7B4DFF"/>
                 </svg>
              </div>
            </div>
            <div className="absolute inset-0 rounded-full scale-110" style={{ background: 'rgba(124,77,255,0.2)', filter: 'blur(4px)' }} />
          </div>
          <div className="flex items-center mt-1 space-x-1">
            <span className="text-[16px] font-semibold text-gray-900 leading-none">Neeva AI</span>
          </div>
          <div className="flex items-center space-x-1 mt-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-[13px] text-gray-500 leading-none">Online</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-100/50 transition-colors">
            <Bookmark className="w-6 h-6 text-purple-600" />
          </button>
          <button className="p-2 -mr-2 rounded-full hover:bg-gray-100/50 transition-colors">
            <MoreHorizontal className="w-6 h-6 text-gray-800" />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-4 scroll-smooth">
        <div className="flex justify-center mb-6">
          <div 
            className="px-4 py-2 rounded-full text-[13px] font-medium text-purple-600"
            style={{ background: 'rgba(167,139,250,0.12)' }}
          >
            Today
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {state.chatHistory.map((msg, index) => {
              const showAvatar = !msg.isUser && (index === 0 || state.chatHistory[index - 1].isUser);
              
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start items-end'}`}
                >
                  {showAvatar && (
                    <div className="w-8 h-8 rounded-full bg-white flex-shrink-0 mr-3 mb-2 flex items-center justify-center shadow-sm">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="#EBE6FF"/>
                        <path d="M12 16C13.66 16 15.14 15.09 15.87 13.63L14.13 12.63C13.66 13.56 12.89 14 12 14C11.11 14 10.34 13.56 9.87 12.63L8.13 13.63C8.86 15.09 10.34 16 12 16Z" fill="#7B4DFF"/>
                        <circle cx="9.5" cy="9.5" r="1.5" fill="#7B4DFF"/>
                        <circle cx="14.5" cy="9.5" r="1.5" fill="#7B4DFF"/>
                      </svg>
                    </div>
                  )}
                  {!showAvatar && !msg.isUser && <div className="w-11 flex-shrink-0" />}

                  <div 
                    className={`relative max-w-[78%] p-5 rounded-[28px] whitespace-pre-wrap leading-relaxed shadow-sm`}
                    style={{
                      ...(msg.isUser ? {
                        background: 'linear-gradient(135deg, #6D4AFF 0%, #8B5CF6 50%, #7C3AED 100%)',
                        color: 'white',
                        borderBottomRightRadius: '8px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
                      } : {
                        background: 'rgba(255,255,255,0.78)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        color: '#111827',
                        borderBottomLeftRadius: '8px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                        border: '1px solid rgba(255,255,255,0.6)'
                      })
                    }}
                  >
                    <p className="text-[16px] font-normal tracking-wide leading-[1.5]">{msg.content}</p>
                    <div 
                      className={`text-[13px] mt-2 flex items-center ${msg.isUser ? 'text-purple-200 justify-end' : 'text-gray-400'}`}
                    >
                      {formatTime(msg.timestamp)}
                      {msg.isUser && (
                        <svg className="w-3.5 h-3.5 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="flex justify-start items-end mt-4"
              >
                <div className="w-11 flex-shrink-0" />
                <div 
                  className="px-5 py-4 rounded-[28px] rounded-bl-lg"
                  style={{
                    background: 'rgba(255,255,255,0.78)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                    border: '1px solid rgba(255,255,255,0.6)'
                  }}
                >
                  <div className="flex space-x-1.5 items-center h-4">
                    <motion.div className="w-2 h-2 rounded-full bg-purple-400" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0 }} />
                    <motion.div className="w-2 h-2 rounded-full bg-purple-400" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.2 }} />
                    <motion.div className="w-2 h-2 rounded-full bg-purple-400" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.4 }} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Bottom Area Content */}
      <div className="w-full flex flex-col z-20 pb-safe-bottom" style={{ paddingBottom: '108px' }}>
        
        {/* Quick Action Buttons */}
        <div className="px-4 mb-4 flex space-x-3 overflow-x-auto no-scrollbar py-1">
          {quickSuggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(suggestion.text)}
              className="flex-shrink-0 flex items-center h-[52px] px-5 rounded-[18px] transition-colors whitespace-nowrap active:scale-95"
              style={{
                background: 'rgba(255,255,255,0.72)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1.5px solid rgba(124,77,255,0.25)',
                color: '#7B4DFF'
              }}
            >
              {suggestion.icon}
              <span className="font-semibold text-[16px]">{suggestion.text}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="px-4 mb-6 relative">
          <div 
            className="flex items-center w-full h-[74px] rounded-[28px] pl-5 pr-2 relative overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.82)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.06)',
              border: '1px solid rgba(255,255,255,0.5)'
            }}
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Message Neeva..."
              className="flex-1 bg-transparent border-none outline-none text-[16px] text-gray-800 placeholder-gray-400"
            />
            <button className="p-3 text-gray-400 hover:text-gray-600 transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
            <button
              onClick={() => sendMessage()}
              disabled={!message.trim() || isTyping}
              className="w-[56px] h-[56px] rounded-full flex items-center justify-center flex-shrink-0 transition-transform active:scale-90 disabled:opacity-50 disabled:active:scale-100 ml-1"
              style={{
                background: 'linear-gradient(135deg, #7B4DFF 0%, #B14DFF 100%)',
                boxShadow: '0 4px 15px rgba(124,77,255,0.3)'
              }}
            >
              <Send className="w-5 h-5 text-white ml-0.5" />
            </button>
          </div>
        </div>

        {/* Bottom Action Cards */}
        <div className="px-4 mb-2 flex justify-between space-x-2">
          {bottomActionCards.map((card, idx) => (
            <button
              key={idx}
              className="flex-1 flex flex-col items-center justify-center aspect-square max-h-[92px] rounded-[24px] active:scale-95 transition-transform"
              style={{
                background: 'rgba(255,255,255,0.6)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.4)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
              }}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1.5 ${card.bg}`}>
                {card.icon}
              </div>
              <span className="text-[13px] font-medium text-gray-800">{card.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Floating Bottom Navigation Dock */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 pb-safe-bottom pt-2"
        style={{
          height: '88px',
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTopLeftRadius: '34px',
          borderTopRightRadius: '34px',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.04)',
          borderTop: '1px solid rgba(255,255,255,0.6)'
        }}
      >
        <button className="flex flex-col items-center justify-center w-16 h-full text-gray-400 hover:text-purple-600 transition-colors">
          <Home className="w-6 h-6 mb-1" />
          <span className="text-[11px] font-medium">Home</span>
        </button>
        
        <button className="flex flex-col items-center justify-center w-16 h-full text-purple-600 transition-colors relative">
          <MessageCircle className="w-6 h-6 mb-1 fill-purple-100" />
          <span className="text-[11px] font-medium">Chat</span>
        </button>

        {/* Center Primary Action */}
        <div className="relative -top-6">
          <button 
            className="w-[72px] h-[72px] rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            style={{
              background: 'linear-gradient(135deg, #7B4DFF 0%, #B14DFF 100%)',
              boxShadow: '0 10px 25px rgba(124,77,255,0.4)'
            }}
          >
            <Plus className="w-8 h-8 text-white" />
          </button>
        </div>

        <button className="flex flex-col items-center justify-center w-16 h-full text-gray-400 hover:text-purple-600 transition-colors">
          <Brain className="w-6 h-6 mb-1" />
          <span className="text-[11px] font-medium">Tools</span>
        </button>
        
        <button className="flex flex-col items-center justify-center w-16 h-full text-gray-400 hover:text-purple-600 transition-colors">
          <UserIcon className="w-6 h-6 mb-1" />
          <span className="text-[11px] font-medium">You</span>
        </button>
      </div>

    </div>
  );
}