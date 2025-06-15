
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatInterfaceProps {
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ isMinimized, onToggleMinimize }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm Nutri-AI, your nutrition assistant. I can help you with meal planning, nutrition questions, and recipe suggestions. How can I assist you today?",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    const apiMessages = newMessages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }));

    try {
      const { data, error } = await supabase.functions.invoke('nutrition-api', {
        body: {
          action: 'chatWithGroq',
          messages: apiMessages,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.assistantMessage || "I'm not sure how to respond to that. Could you try asking in a different way?",
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (err) {
      console.error("Error calling Groq function:", err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting to my brain right now. Please try again in a moment.",
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggleMinimize}
          className="rounded-full w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-xl transition-all duration-300 animate-bounce hover:animate-none hover:scale-110"
        >
          <Bot className="h-8 w-8 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-[600px] z-50 flex flex-col shadow-2xl border-0 bg-white animate-scale-in">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 bg-white/20 animate-fade-in">
            <AvatarFallback className="text-white bg-transparent">
              <Bot className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <h3 className="font-semibold">Nutri-AI Assistant</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              <p className="text-xs text-green-100">Online & Ready</p>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleMinimize}
          className="h-8 w-8 text-white hover:bg-white/20 transition-colors animate-fade-in"
          style={{ animationDelay: '200ms' }}
        >
          <Minimize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-gray-50 to-white" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex gap-3 animate-fade-in ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {message.sender === 'assistant' && (
                <Avatar className="h-8 w-8 bg-gradient-to-r from-green-600 to-blue-600 mt-1 shadow-md">
                  <AvatarFallback className="text-white bg-transparent">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-md transition-all duration-200 hover:shadow-lg ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
                    : 'bg-white text-gray-900 border border-gray-100'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className={`text-xs mt-2 ${
                  message.sender === 'user' ? 'text-green-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {message.sender === 'user' && (
                <Avatar className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 mt-1 shadow-md">
                  <AvatarFallback className="text-white bg-transparent">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 animate-fade-in">
              <Avatar className="h-8 w-8 bg-gradient-to-r from-green-600 to-blue-600 mt-1">
                <AvatarFallback className="text-white bg-transparent">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-white rounded-2xl px-4 py-3 shadow-md border border-gray-100">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t p-4 bg-white rounded-b-lg">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about nutrition, recipes, or meal planning..."
              className="resize-none border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-xl transition-all duration-200"
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-xl px-4 py-2 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Ask me anything about nutrition and healthy eating!
        </p>
      </div>
    </Card>
  );
};
