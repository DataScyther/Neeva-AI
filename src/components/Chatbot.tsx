import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from './AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  suggestions?: string[];
}

export function Chatbot() {
  const { state, dispatch } = useAppContext();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickSuggestions = [
    "I'm feeling anxious today",
    "Help me with breathing exercises",
    "I can't sleep well"
  ];

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety')) {
      return "I understand you're feeling anxious. Let's try a simple breathing exercise together. Take a deep breath in for 4 counts, hold for 7, and exhale for 8. 🌬️";
    }
    if (lowerMessage.includes('breath') || lowerMessage.includes('breathing')) {
      return "Great choice! Breathing exercises are excellent for managing stress. Let's start with the 4-7-8 technique. 🧘‍♀️";
    }
    if (lowerMessage.includes('sleep') || lowerMessage.includes('tired')) {
      return "Sleep troubles can really affect our wellbeing. Try creating a bedtime routine and avoiding screens before bed. 🌙";
    }
    
    return "I'm here to support you on your mental health journey. What's on your mind today? 💙";
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.chatHistory, isTyping]);

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
        content: `Hello ${state.user?.name}! I'm your AI wellness companion. How are you feeling today? ✨`,
        isUser: false,
        timestamp: new Date()
      };
      
      setTimeout(() => {
        dispatch({ type: 'ADD_CHAT_MESSAGE', payload: welcomeMessage });
      }, 500);
    }
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto p-4">
      <Card className="flex-1 flex flex-col shadow-lg border-0 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <CardTitle className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold">Neeva Wellness Companion</span>
              <p className="text-sm font-normal opacity-90">Your AI-powered mental health assistant</p>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-4 bg-gradient-to-b from-white to-gray-50">
          <div className="flex-1 space-y-6 mb-4 overflow-y-auto max-h-96 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thumb-rounded-full">
            {state.chatHistory.map((msg, index) => (
              <div
                key={msg.id}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-[85%] ${msg.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    msg.isUser 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                      : 'bg-gradient-to-r from-purple-500 to-purple-600'
                  }`}>
                    {msg.isUser ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>
                  
                  {/* Message bubble */}
                  <div className={`relative rounded-2xl p-4 shadow-sm transition-all duration-300 ${
                    msg.isUser 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md' 
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <div className={`text-xs mt-2 ${
                      msg.isUser ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-gray-200 rounded-bl-md shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {state.chatHistory.length <= 1 && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
                Quick suggestions to get started:
              </h3>
              <div className="flex flex-wrap gap-2">
                {quickSuggestions.map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80 px-3 py-1.5 text-sm rounded-full transition-all duration-200 hover:scale-105 bg-white border border-gray-200 shadow-sm"
                    onClick={() => sendMessage(suggestion)}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share what's on your mind..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              disabled={isTyping}
              className="flex-1 h-12 rounded-full border-2 border-gray-200 focus:border-blue-400 focus:ring-0 transition-all"
            />
            <Button 
              onClick={() => sendMessage()} 
              disabled={!message.trim() || isTyping}
              className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Custom styles for animations and scrollbar */}
      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}