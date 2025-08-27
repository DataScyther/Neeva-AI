import React, { useState, useEffect } from 'react';
import { useAppContext } from './AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Send, Bot, User } from 'lucide-react';

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

  const quickSuggestions = [
    "I'm feeling anxious today",
    "Help me with breathing exercises",
    "I can't sleep well"
  ];

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety')) {
      return "I understand you're feeling anxious. Let's try a simple breathing exercise together. Take a deep breath in for 4 counts, hold for 7, and exhale for 8.";
    }
    if (lowerMessage.includes('breath') || lowerMessage.includes('breathing')) {
      return "Great choice! Breathing exercises are excellent for managing stress. Let's start with the 4-7-8 technique.";
    }
    if (lowerMessage.includes('sleep') || lowerMessage.includes('tired')) {
      return "Sleep troubles can really affect our wellbeing. Try creating a bedtime routine and avoiding screens before bed.";
    }
    
    return "I'm here to support you on your mental health journey. What's on your mind today?";
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
        content: `Hello ${state.user?.name}! I'm your AI wellness companion. How are you feeling today?`,
        isUser: false,
        timestamp: new Date()
      };
      
      setTimeout(() => {
        dispatch({ type: 'ADD_CHAT_MESSAGE', payload: welcomeMessage });
      }, 500);
    }
  }, []);

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto p-4">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardTitle className="flex items-center space-x-2">
            <Bot className="w-6 h-6" />
            <span>AI Wellness Companion</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-4">
          <div className="flex-1 space-y-4 mb-4 overflow-y-auto max-h-96">
            {state.chatHistory.map((msg, index) => (
              <div
                key={msg.id}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${msg.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`p-2 rounded-full ${msg.isUser ? 'bg-blue-500' : 'bg-purple-500'}`}>
                    {msg.isUser ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  
                  <div className={`p-3 rounded-2xl ${
                    msg.isUser 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p>{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="p-2 rounded-full bg-purple-500">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animate-delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animate-delay-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {state.chatHistory.length <= 1 && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Quick suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {quickSuggestions.map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80"
                    onClick={() => sendMessage(suggestion)}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share what's on your mind..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              disabled={isTyping}
            />
            <Button 
              onClick={() => sendMessage()} 
              disabled={!message.trim() || isTyping}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}