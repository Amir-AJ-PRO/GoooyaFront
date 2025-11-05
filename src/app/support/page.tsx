'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Send, 
  Plus, 
  Phone, 
  Mail, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
  messages: {
    id: string;
    text: string;
    sender: 'user' | 'support';
    timestamp: Date;
  }[];
}

export default function Support() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: '1',
      title: 'مشکل در فرآیند پرداخت',
      description: 'پرداخت من با خطا مواجه شد',
      status: 'in-progress',
      priority: 'high',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      updatedAt: new Date(Date.now() - 1000 * 60 * 30),
      messages: [
        {
          id: '1',
          text: 'سلام، من سعی کردم پرداخت انجام بدم ولی با خطا مواجه شدم',
          sender: 'user',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        },
        {
          id: '2',
          text: 'سلام، مشکل شما در حال بررسی است. لطفا شماره تراکنش را ارسال کنید.',
          sender: 'support',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
        }
      ]
    },
    {
      id: '2',
      title: 'سوال درباره خدمات مهندسی',
      description: 'می‌خواستم درباره خدمات ارزیابی اطلاعات بیشتری بگیرم',
      status: 'closed',
      priority: 'medium',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      messages: [
        {
          id: '1',
          text: 'خدمات ارزیابی شما چگونه است؟',
          sender: 'user',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
        },
        {
          id: '2',
          text: 'سلام، برای اطلاعات کامل به صفحه خدمات مهندسی مراجعه کنید یا با شماره 021-12345678 تماس بگیرید.',
          sender: 'support',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        }
      ]
    }
  ]);

  const [selectedTicket, setSelectedTicket] = useState<string | null>('1');
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  
  // New ticket form
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [newTicketDescription, setNewTicketDescription] = useState('');
  const [newTicketPriority, setNewTicketPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const activeTicket = tickets.find(t => t.id === selectedTicket);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" />در انتظار</Badge>;
      case 'in-progress':
        return <Badge className="gap-1 bg-blue-500"><AlertCircle className="h-3 w-3" />در حال بررسی</Badge>;
      case 'closed':
        return <Badge variant="secondary" className="gap-1"><CheckCircle className="h-3 w-3" />بسته شده</Badge>;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge variant="outline" className="border-green-500 text-green-600">کم</Badge>;
      case 'medium':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600">متوسط</Badge>;
      case 'high':
        return <Badge variant="outline" className="border-red-500 text-red-600">بالا</Badge>;
      default:
        return null;
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedTicket) return;

    const message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user' as const,
      timestamp: new Date(),
    };

    setTickets(prev => prev.map(ticket => {
      if (ticket.id === selectedTicket) {
        return {
          ...ticket,
          messages: [...ticket.messages, message],
          updatedAt: new Date(),
        };
      }
      return ticket;
    }));

    setNewMessage('');
    
    // Simulate support response
    setTimeout(() => {
      const supportMessage = {
        id: (Date.now() + 1).toString(),
        text: 'پیام شما دریافت شد. به زودی پاسخ داده می‌شود.',
        sender: 'support' as const,
        timestamp: new Date(),
      };

      setTickets(prev => prev.map(ticket => {
        if (ticket.id === selectedTicket) {
          return {
            ...ticket,
            messages: [...ticket.messages, supportMessage],
            updatedAt: new Date(),
          };
        }
        return ticket;
      }));
    }, 2000);
  };

  const handleCreateTicket = () => {
    if (!newTicketTitle.trim() || !newTicketDescription.trim()) {
      toast({
        title: 'خطا',
        description: 'لطفا تمام فیلدها را پر کنید',
        variant: 'destructive',
      });
      return;
    }

    const newTicket: Ticket = {
      id: Date.now().toString(),
      title: newTicketTitle,
      description: newTicketDescription,
      status: 'open',
      priority: newTicketPriority,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [
        {
          id: '1',
          text: newTicketDescription,
          sender: 'user',
          timestamp: new Date(),
        }
      ]
    };

    setTickets(prev => [newTicket, ...prev]);
    setSelectedTicket(newTicket.id);
    setShowNewTicket(false);
    setNewTicketTitle('');
    setNewTicketDescription('');
    setNewTicketPriority('medium');

    toast({
      title: 'موفق',
      description: 'تیکت شما با موفقیت ثبت شد',
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4">پشتیبانی و تیکت‌ها</h1>
              <p className="text-lg opacity-90">
                ما همیشه در کنار شما هستیم. سوالات و مشکلات خود را با ما در میان بگذارید
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-6 text-center">
                  <Phone className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">تماس تلفنی</h3>
                  <p className="text-sm text-muted-foreground" dir="ltr">021-12345678</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Mail className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">ایمیل</h3>
                  <p className="text-sm text-muted-foreground" dir="ltr">support@gooya.ir</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">ساعات کاری</h3>
                  <p className="text-sm text-muted-foreground">۹ صبح تا ۶ عصر</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Tickets Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tickets List */}
                <div className="lg:col-span-1">
                  <Card className="h-[600px] flex flex-col">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">تیکت‌های من</CardTitle>
                        <Button 
                          size="sm" 
                          onClick={() => setShowNewTicket(true)}
                          className="gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          تیکت جدید
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden p-0">
                      <ScrollArea className="h-full">
                        <div className="p-4 space-y-2">
                          {tickets.map((ticket) => (
                            <div
                              key={ticket.id}
                              className={`p-4 rounded-lg cursor-pointer transition-colors ${
                                selectedTicket === ticket.id 
                                  ? 'bg-primary/10 border-2 border-primary' 
                                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                              }`}
                              onClick={() => {
                                setSelectedTicket(ticket.id);
                                setShowNewTicket(false);
                              }}
                            >
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="font-semibold text-sm">{ticket.title}</h3>
                                {getStatusBadge(ticket.status)}
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                {ticket.description}
                              </p>
                              <div className="flex items-center justify-between text-xs">
                                {getPriorityBadge(ticket.priority)}
                                <span className="text-muted-foreground">
                                  {ticket.messages.length} پیام
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>

                {/* Ticket Detail / New Ticket Form */}
                <div className="lg:col-span-2">
                  <Card className="h-[600px] flex flex-col">
                    {showNewTicket ? (
                      <>
                        <CardHeader>
                          <CardTitle>تیکت جدید</CardTitle>
                          <CardDescription>اطلاعات تیکت خود را وارد کنید</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">عنوان</label>
                            <Input
                              value={newTicketTitle}
                              onChange={(e) => setNewTicketTitle(e.target.value)}
                              placeholder="عنوان تیکت را وارد کنید"
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium mb-2 block">اولویت</label>
                            <div className="flex gap-2">
                              {(['low', 'medium', 'high'] as const).map((priority) => (
                                <Button
                                  key={priority}
                                  variant={newTicketPriority === priority ? 'default' : 'outline'}
                                  onClick={() => setNewTicketPriority(priority)}
                                  size="sm"
                                >
                                  {priority === 'low' && 'کم'}
                                  {priority === 'medium' && 'متوسط'}
                                  {priority === 'high' && 'بالا'}
                                </Button>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium mb-2 block">توضیحات</label>
                            <Textarea
                              value={newTicketDescription}
                              onChange={(e) => setNewTicketDescription(e.target.value)}
                              placeholder="مشکل یا سوال خود را شرح دهید"
                              rows={10}
                            />
                          </div>
                          
                          <div className="flex gap-2">
                            <Button onClick={handleCreateTicket}>
                              ثبت تیکت
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setShowNewTicket(false)}
                            >
                              انصراف
                            </Button>
                          </div>
                        </CardContent>
                      </>
                    ) : activeTicket ? (
                      <>
                        <CardHeader className="border-b">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle>{activeTicket.title}</CardTitle>
                              <CardDescription className="mt-2">
                                {activeTicket.description}
                              </CardDescription>
                            </div>
                            <div className="flex gap-2">
                              {getStatusBadge(activeTicket.status)}
                              {getPriorityBadge(activeTicket.priority)}
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
                          <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4">
                              {activeTicket.messages.map((message) => (
                                <div
                                  key={message.id}
                                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                  <div
                                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                                      message.sender === 'user'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-gray-100 text-gray-900'
                                    }`}
                                  >
                                    <p className="text-sm">{message.text}</p>
                                    <p className="text-xs opacity-70 mt-1">
                                      {message.timestamp.toLocaleTimeString('fa-IR', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                          
                          {activeTicket.status !== 'closed' && (
                            <div className="p-4 border-t">
                              <div className="flex gap-2">
                                <Input
                                  value={newMessage}
                                  onChange={(e) => setNewMessage(e.target.value)}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') handleSendMessage();
                                  }}
                                  placeholder="پیام خود را بنویسید..."
                                />
                                <Button 
                                  onClick={handleSendMessage}
                                  disabled={!newMessage.trim()}
                                  size="icon"
                                >
                                  <Send className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>تیکتی انتخاب نشده</p>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
