'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type ChatSender = 'user' | 'agent';

interface ChatMessage {
  id: string;
  text: string;
  sender: ChatSender;
  timestamp: string; // ISO
}

const GENERIC_CONNECTION_ERROR = 'خطا در ارتباط، لطفاً بعداً تلاش کنید.';

interface SupportChatResponse {
  ChatId?: string;
  ModelMessage?: string | null;
  ErrorMessage?: string | null;
  IsSuccess?: boolean;
  // پشتیبانی از حالت camelCase هم (اگر بک‌اند تغییر کند)
  chatId?: string;
  modelMessage?: string | null;
  errorMessage?: string | null;
  isSuccess?: boolean;
}

type GuestConversationRole = 'user' | 'assistant' | 0 | 1;

interface ConversationDTO {
  UserId?: string;
  ChatId?: string;
  Message?: string;
  Role?: GuestConversationRole;
  // camelCase fallback
  userId?: string;
  chatId?: string;
  message?: string;
  role?: GuestConversationRole;
}

interface GetChatConversationResponse {
  Conversations?: ConversationDTO[];
  Message?: string;
  IsSuccess?: boolean;
  ChatId?: string;
  // camelCase fallback
  conversations?: ConversationDTO[];
  message?: string;
  isSuccess?: boolean;
  chatId?: string;
}

function getResponseField<T>(
  data: SupportChatResponse,
  pascal: keyof SupportChatResponse,
  camel: keyof SupportChatResponse
): T | undefined {
  return (data[pascal] as T | undefined) ?? (data[camel] as T | undefined);
}

function pick<T>(obj: Record<string, unknown> | undefined, keys: string[]): T | undefined {
  if (!obj) return undefined;
  for (const k of keys) {
    if (k in obj) return obj[k] as T;
  }
  return undefined;
}

function normalizeRole(role: GuestConversationRole | undefined): ChatSender {
  if (role === 'user' || role === 0) return 'user';
  return 'agent';
}

function renderBoldMarkdown(text: string): React.ReactNode {
  // پشتیبانی خیلی سبک از **bold**
  // بدون dangerouslySetInnerHTML (امن)
  const parts: React.ReactNode[] = [];
  const re = /\*\*(.+?)\*\*/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    const start = match.index;
    const end = re.lastIndex;
    const before = text.slice(lastIndex, start);
    if (before) parts.push(before);

    const boldText = match[1] ?? '';
    if (boldText) {
      parts.push(<strong key={`b-${start}-${end}`}>{boldText}</strong>);
    }

    lastIndex = end;
  }

  const rest = text.slice(lastIndex);
  if (rest) parts.push(rest);

  // اگر هیچ matchی نبود، همون متن ساده را برگردان
  return parts.length > 0 ? parts : text;
}

export default function SupportChatClient() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      text: 'سلام! پیام خود را بنویسید تا پشتیبانی پاسخ دهد.',
      sender: 'agent',
      timestamp: new Date().toISOString(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isOnline] = useState(true);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const shouldAutoScrollRef = useRef(true);

  // فقط هنگام ورود به صفحه / رفرش / برگشت دوباره به صفحه چت
  // conversation را از get_chat می‌گیریم.
  useEffect(() => {
    const supportBase = process.env.NEXT_PUBLIC_SUPPORT_API_BASE_URL;
    const controller = new AbortController();

    const load = async () => {
      setIsLoadingHistory(true);
      try {
        if (!supportBase) {
          toast({
            title: 'تنظیمات ناقص',
            description: 'VITE_SUPPORT_API_BASE_URL در env لود نشده است. لطفاً dev server را ریستارت کنید.',
            variant: 'destructive',
          });
          return;
        }

        const base = supportBase.replace(/\/+$/, '');
        const candidates = [`${base}/api/Support/get_chat`, `${base}/api/Chat/get_chat`];

        let res: Response | null = null;
        for (const url of candidates) {
          res = await fetch(url, {
            method: 'GET',
            headers: {
              // بعضی بک‌اندها (یا فیلترها) حتی برای GET هم Content-Type را enforce می‌کنند
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            credentials: 'include',
            signal: controller.signal,
          });

          if (res.status === 404) continue;
          break;
        }

        if (!res) return;

        const data = (await res.json()) as unknown as GetChatConversationResponse;
        const ok = Boolean(
          (data as unknown as { IsSuccess?: boolean; isSuccess?: boolean }).IsSuccess ??
            (data as unknown as { IsSuccess?: boolean; isSuccess?: boolean }).isSuccess
        );

        if (!res.ok || !ok) {
          // تاریخچه برای UX حیاتی نیست؛ فقط اگر خطا واضح بود یک پیام سبک بده
          return;
        }

        const convObj = data as unknown as { Conversations?: ConversationDTO[]; conversations?: ConversationDTO[] };
        const conversations = (convObj.Conversations ?? convObj.conversations) as ConversationDTO[] | undefined;
        const items = Array.isArray(conversations) ? conversations : [];

        if (items.length === 0) return;

        const mapped: ChatMessage[] = items
          .map((c, idx) => {
            const rec = c as unknown as Record<string, unknown>;
            const text = pick<string>(rec, ['Message', 'message']) || '';
            const role = pick<GuestConversationRole>(rec, ['Role', 'role']);
            if (!text) return null;
            return {
              id: `h-${Date.now()}-${idx}`,
              text,
              sender: normalizeRole(role),
              // بک‌اند timestamp نمی‌دهد؛ برای نمایش، ترتیب را حفظ می‌کنیم
              timestamp: new Date().toISOString(),
            } as ChatMessage;
          })
          .filter(Boolean) as ChatMessage[];

        if (mapped.length > 0) {
          setMessages(mapped);
        }
      } catch {
      } finally {
        setIsLoadingHistory(false);
      }
    };

    void load();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    // فقط اگر کاربر نزدیک پایین باشد auto-scroll می‌کنیم
    if (!shouldAutoScrollRef.current) return;
    // نکته: scrollIntoView ممکن است کل صفحه را هم اسکرول کند؛
    // برای جلوگیری، مستقیم خود container را اسکرول می‌کنیم.
    const raf = requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (!el) return;
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    });
    return () => cancelAnimationFrame(raf);
  }, [messages.length, isSending]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    // اگر نزدیک پایین بود، اجازه auto-scroll بده
    shouldAutoScrollRef.current = distanceToBottom < 120;
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isSending) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      text,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      const supportBase = process.env.NEXT_PUBLIC_SUPPORT_API_BASE_URL;
      const directUrl = supportBase ? `${supportBase.replace(/\/+$/, '')}/api/Support/chat` : null;

      const res = await fetch(directUrl || '/api/support/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        // اگر مستقیم به بک‌اند پشتیبانی می‌زنیم، بدنه باید PascalCase باشد
        body: JSON.stringify(directUrl ? { Message: text } : { message: text }),
      });

      let data: SupportChatResponse | null = null;
      try {
        data = (await res.json()) as SupportChatResponse;
      } catch {
        data = null;
      }

      const isSuccess = Boolean(data ? getResponseField<boolean>(data, 'IsSuccess', 'isSuccess') : false);
      const chatId = (data ? getResponseField<string>(data, 'ChatId', 'chatId') : '') || '';
      const modelMessage = data ? getResponseField<string | null>(data, 'ModelMessage', 'modelMessage') : null;

      if (!res.ok || !isSuccess) {
        toast({
          title: 'خطا',
          description: GENERIC_CONNECTION_ERROR,
          variant: 'destructive',
        });
        setMessages((prev) => [
          ...prev,
          {
            id: `e-${Date.now()}`,
            text: GENERIC_CONNECTION_ERROR,
            sender: 'agent',
            timestamp: new Date().toISOString(),
          },
        ]);
        return;
      }

      // کوکی support_session به صورت HttpOnly داخل route `/api/support/chat` ست می‌شود
      // اگر مستقیم به بک‌اند می‌زنید، خود بک‌اند Set-Cookie می‌دهد (در صورت تنظیم صحیح CORS/SSL)
      void chatId;

      if (modelMessage) {
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            text: modelMessage,
            sender: 'agent',
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch {
      toast({ title: 'خطا', description: GENERIC_CONNECTION_ERROR, variant: 'destructive' });
      setMessages((prev) => [
        ...prev,
        {
          id: `x-${Date.now()}`,
          text: GENERIC_CONNECTION_ERROR,
          sender: 'agent',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">چت پشتیبانی</CardTitle>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={isOnline ? 'text-green-600 border-green-600' : 'text-gray-400 border-gray-400'}
                >
                  {isOnline ? 'آنلاین' : 'آفلاین'}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div
                ref={scrollRef}
                onScroll={onScroll}
                className="h-[55vh] md:h-[60vh] overflow-y-auto p-4 space-y-3 bg-white"
              >
                {isLoadingHistory && (
                  <div className="flex justify-center">
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      در حال بارگذاری گفتگو…
                    </div>
                  </div>
                )}
                {messages.map((m) => {
                  const isUser = m.sender === 'user';
                  return (
                    <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        <div className="whitespace-pre-wrap break-words">{renderBoldMarkdown(m.text)}</div>
                        <div className={`mt-1 text-[11px] opacity-70 ${isUser ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                          {new Date(m.timestamp).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {isSending && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm bg-muted flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      در حال پاسخ…
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>

              <div className="border-t p-4 bg-background">
                <div className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="پیام خود را بنویسید…"
                    className="min-h-[44px] max-h-[140px] resize-none"
                    disabled={!isOnline || isSending}
                    rows={1}
                  />
                  <Button
                    onClick={() => void sendMessage()}
                    disabled={!input.trim() || !isOnline || isSending}
                    size="icon"
                    className="h-11 w-11 shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                {!isOnline && (
                  <p className="text-xs text-muted-foreground mt-2">
                    پشتیبانی در حال حاضر آفلاین است.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}


