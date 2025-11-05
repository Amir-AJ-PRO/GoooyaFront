'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'agent';
  timestamp: Date;
  type?: 'text' | 'property' | 'contact' | 'appointment' | 'search';
  data?: any;
  sessionId?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  status: 'active' | 'waiting' | 'resolved';
  messages: ChatMessage[];
}

interface ChatContextType {
  sessions: ChatSession[];
  activeSession: string | null;
  isWidgetOpen: boolean;
  isWidgetMinimized: boolean;
  unreadCount: number;
  
  // Actions
  setActiveSession: (sessionId: string) => void;
  toggleWidget: () => void;
  minimizeWidget: () => void;
  sendMessage: (text: string, sessionId?: string) => void;
  createSession: (title: string) => string;
  markAsRead: (sessionId: string) => void;
  resolveSession: (sessionId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [isWidgetMinimized, setIsWidgetMinimized] = useState(false);

  // Initialize with default session
  useEffect(() => {
    const defaultSession: ChatSession = {
      id: 'default',
      title: 'گویا چت',
      lastMessage: 'سلام! چطور می‌تونم کمکتون کنم؟',
      timestamp: new Date(),
      unreadCount: 0,
      status: 'active',
      messages: [
        {
          id: '1',
          text: 'سلام! من دستیار هوشمند گویا هستم. چطور می‌تونم کمکتون کنم؟',
          sender: 'ai',
          timestamp: new Date(),
          type: 'text',
          sessionId: 'default'
        }
      ]
    };
    
    setSessions([defaultSession]);
    setActiveSession('default');
  }, []);

  const unreadCount = sessions.reduce((total, session) => total + session.unreadCount, 0);

  const generateAIResponse = (userMessage: string): ChatMessage => {
    const message = userMessage.toLowerCase();
    
    // Property search responses
    if (message.includes('ملک') || message.includes('خانه') || message.includes('آپارتمان')) {
      return {
        id: Date.now().toString(),
        text: 'برای جستجوی ملک، می‌تونید از صفحه املاک استفاده کنید یا بگید چه نوع ملکی می‌خواید. مثلاً: "آپارتمان 3 خوابه در تهران"',
        sender: 'ai',
        timestamp: new Date(),
        type: 'search',
        data: {
          suggestions: [
            'آپارتمان 3 خوابه در تهران',
            'ویلا در شمال',
            'تاون‌هاوس مدرن',
            'ملک تجاری'
          ]
        }
      };
    }
    
    // Price inquiries
    if (message.includes('قیمت') || message.includes('هزینه')) {
      return {
        id: Date.now().toString(),
        text: 'قیمت‌ها بسته به نوع ملک، موقعیت و متراژ متفاوته. برای اطلاعات دقیق‌تر، می‌تونید فیلترهای قیمت رو در صفحه املاک تنظیم کنید.',
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };
    }
    
    // Location inquiries
    if (message.includes('کجا') || message.includes('محل') || message.includes('منطقه')) {
      return {
        id: Date.now().toString(),
        text: 'ما املاک در تمام مناطق ایران داریم. می‌تونید روی نقشه ببینید یا منطقه مورد نظرتون رو بگید تا ملک‌های اونجا رو نشون بدم.',
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };
    }
    
    // Contact information
    if (message.includes('تماس') || message.includes('شماره') || message.includes('آدرس')) {
      return {
        id: Date.now().toString(),
        text: 'برای تماس مستقیم، می‌تونید از شماره 021-12345678 استفاده کنید یا ایمیل info@gooya.ir بفرستید.',
        sender: 'ai',
        timestamp: new Date(),
        type: 'contact',
        data: {
          contacts: [
            { type: 'phone', value: '021-12345678' },
            { type: 'email', value: 'info@gooya.ir' }
          ]
        }
      };
    }
    
    // Appointment booking
    if (message.includes('قرار') || message.includes('ملاقات') || message.includes('بازدید')) {
      return {
        id: Date.now().toString(),
        text: 'برای تعیین قرار ملاقات، می‌تونید با مشاوران ما تماس بگیرید یا از طریق پنل کاربری درخواست بازدید بذارید.',
        sender: 'ai',
        timestamp: new Date(),
        type: 'appointment'
      };
    }
    
    // General help
    if (message.includes('کمک') || message.includes('راهنما')) {
      return {
        id: Date.now().toString(),
        text: 'من اینجا هستم تا کمکتون کنم! می‌تونید درباره املاک، قیمت‌ها، مناطق مختلف یا هر سوال دیگه‌ای بپرسید.',
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };
    }
    
    // Default response
    return {
      id: Date.now().toString(),
      text: 'متوجه نشدم. می‌تونید سوالتون رو واضح‌تر بپرسید؟ یا از منوهای پایین استفاده کنید.',
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    };
  };

  const sendMessage = (text: string, sessionId?: string) => {
    const targetSessionId = sessionId || activeSession || 'default';
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
      sessionId: targetSessionId
    };

    setSessions(prev => prev.map(session => {
      if (session.id === targetSessionId) {
        const updatedMessages = [...session.messages, userMessage];
        return {
          ...session,
          messages: updatedMessages,
          lastMessage: text,
          timestamp: new Date(),
          unreadCount: session.id === activeSession ? 0 : session.unreadCount + 1
        };
      }
      return session;
    }));

    // Generate AI response after a delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(text);
      aiResponse.sessionId = targetSessionId;

      setSessions(prev => prev.map(session => {
        if (session.id === targetSessionId) {
          const updatedMessages = [...session.messages, aiResponse];
          return {
            ...session,
            messages: updatedMessages,
            lastMessage: aiResponse.text,
            timestamp: new Date(),
            unreadCount: session.id === activeSession ? 0 : session.unreadCount + 1
          };
        }
        return session;
      }));
    }, 1000 + Math.random() * 1000);
  };

  const createSession = (title: string): string => {
    const newSessionId = Date.now().toString();
    const newSession: ChatSession = {
      id: newSessionId,
      title,
      lastMessage: 'گفتگوی جدید شروع شد',
      timestamp: new Date(),
      unreadCount: 0,
      status: 'active',
      messages: []
    };

    setSessions(prev => [newSession, ...prev]);
    setActiveSession(newSessionId);
    return newSessionId;
  };

  const markAsRead = (sessionId: string) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, unreadCount: 0 }
        : session
    ));
  };

  const resolveSession = (sessionId: string) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, status: 'resolved' as const }
        : session
    ));
  };

  const toggleWidget = () => {
    setIsWidgetOpen(prev => !prev);
    if (!isWidgetOpen) {
      setIsWidgetMinimized(false);
    }
  };

  const minimizeWidget = () => {
    setIsWidgetMinimized(prev => !prev);
  };

  const value = {
    sessions,
    activeSession,
    isWidgetOpen,
    isWidgetMinimized,
    unreadCount,
    setActiveSession,
    toggleWidget,
    minimizeWidget,
    sendMessage,
    createSession,
    markAsRead,
    resolveSession
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
