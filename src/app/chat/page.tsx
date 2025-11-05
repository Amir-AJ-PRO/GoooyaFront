'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Bot, 
  User,
  Home,
  DollarSign,
  Phone,
  Calendar,
  MapPin,
  Users,
  Plus,
  MessageSquare,
  Trash2,
  Menu
} from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  lastMessageAt: Date;
}

export default function Chat() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'جستجوی آپارتمان در تهران',
      messages: [
        {
          id: '1',
          text: 'سلام! من دستیار هوشمند گویا هستم. چطور می‌تونم کمکتون کنم؟',
          sender: 'ai',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
        },
        {
          id: '2',
          text: 'دنبال آپارتمان 3 خوابه در تهران می‌گردم',
          sender: 'user',
          timestamp: new Date(Date.now() - 1000 * 60 * 29),
        },
        {
          id: '3',
          text: 'عالی! چه منطقه‌ای از تهران مد نظرتون هست؟',
          sender: 'ai',
          timestamp: new Date(Date.now() - 1000 * 60 * 28),
        }
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 60),
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 28),
    },
    {
      id: '2',
      title: 'قیمت ویلا در شمال',
      messages: [
        {
          id: '1',
          text: 'سلام! من دستیار هوشمند گویا هستم. چطور می‌تونم کمکتون کنم؟',
          sender: 'ai',
          timestamp: new Date(Date.now() - 1000 * 60 * 120),
        },
        {
          id: '2',
          text: 'قیمت ویلا در شمال چقدره؟',
          sender: 'user',
          timestamp: new Date(Date.now() - 1000 * 60 * 119),
        }
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 240),
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 119),
    }
  ]);
  
  const [activeSessionId, setActiveSessionId] = useState<string>('1');
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [activeSession?.messages.length]);

  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('ملک') || message.includes('خانه') || message.includes('آپارتمان')) {
      return 'برای جستجوی ملک، می‌تونید از فیلترهای پیشرفته استفاده کنید. چه نوع ملکی مد نظرتون هست؟';
    }
    
    if (message.includes('قیمت') || message.includes('هزینه')) {
      return 'قیمت‌ها بسته به عوامل مختلفی مثل موقعیت، متراژ، امکانات و شرایط بازار تعیین می‌شه. برای برآورد دقیق‌تر، اطلاعات بیشتری نیاز دارم.';
    }
    
    if (message.includes('کجا') || message.includes('محل') || message.includes('منطقه')) {
      return 'ما املاک در تمام مناطق ایران داریم. می‌تونید روی نقشه ببینید یا منطقه مورد نظرتون رو مشخص کنید.';
    }
    
    if (message.includes('تماس') || message.includes('شماره') || message.includes('آدرس')) {
      return 'برای تماس مستقیم با مشاوران ما، می‌تونید از شماره 021-12345678 استفاده کنید یا از طریق صفحه پشتیبانی درخواست بدید.';
    }
    
    if (message.includes('قرار') || message.includes('ملاقات') || message.includes('بازدید')) {
      return 'برای تعیین قرار ملاقات، می‌تونید با مشاوران ما تماس بگیرید یا از طریق پنل کاربری درخواست بازدید بذارید.';
    }
    
    return 'متوجه نشدم. می‌تونید سوالتون رو واضح‌تر بپرسید؟ یا از دکمه‌های پایین استفاده کنید.';
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !activeSession) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setSessions(prev => prev.map(session => {
      if (session.id === activeSessionId) {
        return {
          ...session,
          messages: [...session.messages, userMessage],
          lastMessageAt: new Date(),
        };
      }
      return session;
    }));

    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputValue),
        sender: 'ai',
        timestamp: new Date(),
      };

      setSessions(prev => prev.map(session => {
        if (session.id === activeSessionId) {
          return {
            ...session,
            messages: [...session.messages, aiResponse],
            lastMessageAt: new Date(),
          };
        }
        return session;
      }));
      
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const createNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'گفتگوی جدید',
      messages: [
        {
          id: '1',
          text: 'سلام! من دستیار هوشمند گویا هستم. چطور می‌تونم کمکتون کنم؟',
          sender: 'ai',
          timestamp: new Date(),
        }
      ],
      createdAt: new Date(),
      lastMessageAt: new Date(),
    };

    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const deleteChat = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (activeSessionId === sessionId && sessions.length > 1) {
      const remainingSessions = sessions.filter(s => s.id !== sessionId);
      setActiveSessionId(remainingSessions[0].id);
    }
  };

  const quickActions = [
    { text: 'جستجوی ملک', icon: Home },
    { text: 'قیمت‌ها', icon: DollarSign },
    { text: 'تماس با ما', icon: Phone },
    { text: 'قرار ملاقات', icon: Calendar },
    { text: 'مشاهده نقشه', icon: MapPin },
  ];

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'الان';
    if (minutes < 60) return `${minutes} دقیقه پیش`;
    if (hours < 24) return `${hours} ساعت پیش`;
    if (days < 7) return `${days} روز پیش`;
    return date.toLocaleDateString('fa-IR');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        <div className="h-[calc(100vh-4rem)] max-w-7xl mx-auto px-2 md:px-4 py-2 md:py-4 flex flex-col">
          {/* Header */}
          <div className="mb-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="lg:hidden h-8 w-8 p-0"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <Menu className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900">گویا AI</h1>
                  <p className="text-xs md:text-sm text-gray-600">دستیار هوشمند املاک</p>
                </div>
              </div>
              <Link href="/support">
                <Button variant="outline" size="sm" className="gap-1 h-8 text-xs">
                  <Users className="h-3 w-3" />
                  <span className="hidden sm:inline">پشتیبان انسانی</span>
                  <span className="sm:hidden">پشتیبان</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Main Content with Sidebar */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-3 min-h-0 relative">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
              <div 
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
            
            {/* Chat History Sidebar */}
            <div className={`${
              sidebarOpen ? 'fixed inset-y-0 left-0 w-72 z-50 shadow-xl' : 'hidden'
            } lg:relative lg:flex lg:col-span-1 flex-col overflow-hidden bg-white lg:bg-transparent`}>
              <Card className="flex-1 flex flex-col overflow-hidden">
                <CardHeader className="flex-shrink-0 py-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">تاریخچه چت‌ها</CardTitle>
                    <Button size="sm" onClick={createNewChat} className="h-7 w-7 p-0">
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-0 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="p-2 space-y-2">
                      {sessions.map((session) => (
                        <div
                          key={session.id}
                          className={`relative group p-3 rounded-lg cursor-pointer transition-colors ${
                            activeSessionId === session.id 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                          onClick={() => {
                            setActiveSessionId(session.id);
                            setSidebarOpen(false);
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <MessageSquare className="h-4 w-4 flex-shrink-0" />
                                <h3 className="font-medium text-sm truncate">{session.title}</h3>
                              </div>
                              <div className="flex items-center gap-2 text-xs opacity-80">
                                <span>{session.messages.length} پیام</span>
                                <span>•</span>
                                <span>{formatDate(session.lastMessageAt)}</span>
                              </div>
                            </div>
                            {sessions.length > 1 && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className={`h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                                  activeSessionId === session.id ? 'hover:bg-primary-foreground/20' : ''
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteChat(session.id);
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Chat Area */}
            <div className="col-span-1 lg:col-span-3 flex flex-col overflow-hidden h-full">
              <Card className="flex-1 flex flex-col overflow-hidden h-full">
                {/* Chat Header */}
                <CardHeader className="border-b flex-shrink-0 py-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{activeSession?.title || 'گویا AI'}</h3>
                        <p className="text-xs text-gray-500">
                          {activeSession?.messages.length} پیام
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600 text-xs h-5">
                      آنلاین
                    </Badge>
                  </div>
                </CardHeader>

                {/* Messages Area */}
                <CardContent className="flex-1 flex flex-col overflow-hidden p-0 min-h-0">
                  <div className="flex-1 overflow-y-auto p-3 md:p-4 min-h-0">
                    <div className="space-y-3 md:space-y-4">
                      {activeSession?.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex items-start gap-2 max-w-[85%] md:max-w-[75%]`}>
                            {message.sender === 'ai' && (
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Bot className="h-4 w-4 text-primary" />
                              </div>
                            )}
                            
                            <div
                              className={`rounded-lg px-4 py-3 ${
                                message.sender === 'user'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <p className="text-sm leading-relaxed break-words">{message.text}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {message.timestamp.toLocaleTimeString('fa-IR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>

                            {message.sender === 'user' && (
                              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                <User className="h-4 w-4 text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="flex items-start gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Bot className="h-4 w-4 text-primary" />
                            </div>
                            <div className="bg-gray-100 rounded-lg px-4 py-3">
                              <div className="flex gap-1">
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
                  </div>

                  {/* Quick Actions */}
                  <div className="flex-shrink-0 px-3 md:px-4 py-2 border-t bg-gray-50 overflow-x-auto">
                    <div className="flex gap-1.5 min-w-max">
                      {quickActions.map((action, index) => {
                        const Icon = action.icon;
                        return (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => setInputValue(action.text)}
                            className="text-xs h-7 px-2 whitespace-nowrap"
                          >
                            <Icon className="h-3 w-3 ml-1" />
                            {action.text}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Input Area */}
                  <div className="flex-shrink-0 px-3 md:px-4 py-3 border-t bg-white">
                    <div className="flex gap-2">
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="پیام خود را بنویسید..."
                        className="flex-1 h-10 md:h-11"
                        disabled={isTyping}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isTyping}
                        size="icon"
                        className="h-10 w-10 md:h-11 md:w-11 flex-shrink-0"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
