
import { useState, useCallback, useEffect } from 'react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export const useChat = () => {
  const [isChatMinimized, setIsChatMinimized] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);

  const toggleChatMinimize = useCallback(() => {
    setIsChatMinimized(prev => !prev);
  }, []);

  const addMessage = useCallback((content: string, sender: 'user' | 'assistant') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  // Listen for global chat toggle events
  useEffect(() => {
    const handleToggleChat = () => {
      toggleChatMinimize();
    };

    window.addEventListener('toggle-chat', handleToggleChat);
    return () => window.removeEventListener('toggle-chat', handleToggleChat);
  }, [toggleChatMinimize]);

  return {
    isChatMinimized,
    toggleChatMinimize,
    messages,
    addMessage
  };
};
