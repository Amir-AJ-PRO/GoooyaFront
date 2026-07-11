"use client";

import React, { useState, useRef, useEffect, FormEvent } from "react";
import Image from "next/image";
import { ThreeDots } from "react-loader-spinner";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ─── CONFIG ───────────────────────────────────────────────────────────────────

// const API_BASE_URL = "http://127.0.0.1:8020";
const API_BASE_URL = "https://shahrgpt.goooya.ir";

const CHAT_STORAGE_KEY = "ai-widget-messages";
const MAX_HISTORY_ENTRIES = 5; // 5 user + 5 AI messages

interface Property {
  image_url?: string;
  title: string;
  price?: string | number;
  mortgage?: string | number;
  rent?: string | number;
  location?: string;
  measure?: string | number;
  rooms?: string | number;
  facilities?: string;
  agent?: string;
  agent_phonenumber?: string;
  property_url?: string;
}

interface Message {
  role: "user" | "ai";
  text: string;
  properties: Property[] | null;
}

interface HistoryEntry {
  user_input: string;
  agent_response: string;
}

const WELCOME_MESSAGE: Message = {
  role: "ai",
  text: "سلام، خوش اومدید. چطور می‌تونم کمکتون کنم؟",
  properties: null,
};

type RecommendationCategory = "property_search" | "context";

interface RecommendationPrompt {
  category: RecommendationCategory;
  label: string;
  text: string;
}

const RECOMMENDATION_PROMPTS: RecommendationPrompt[] = [
  {
    category: "property_search",
    label: "جستجوی ملک",
    text: "به دنبال آپارتمان دو خوابه برای اجاره در دماوند هستم",
  },
  {
    category: "context",
    label: "راهنما و اطلاعات",
    text: "پلتفرم گویا چه خدماتی در حوزه املاک ارائه می‌دهد؟",
  },
];

const isInitialChat = (msgs: Message[]): boolean =>
  msgs.length === 1 && msgs[0]?.role === "ai";

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const loadMessages = (): Message[] => {
  if (typeof window === "undefined") return [WELCOME_MESSAGE];

  try {
    const stored = sessionStorage.getItem(CHAT_STORAGE_KEY);
    if (!stored) return [WELCOME_MESSAGE];

    const parsed = JSON.parse(stored) as Message[];
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : [WELCOME_MESSAGE];
  } catch {
    return [WELCOME_MESSAGE];
  }
};

const saveMessages = (msgs: Message[]) => {
  try {
    sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(msgs));
  } catch {
    // quota exceeded or private browsing
  }
};

const buildHistory = (msgs: Message[]): HistoryEntry[] => {
  const history: HistoryEntry[] = [];
  let startIndex = msgs[0]?.role === "ai" ? 1 : 0;

  for (let i = startIndex; i < msgs.length; i += 2) {
    const userMsg = msgs[i];
    const aiMsg = msgs[i + 1];
    if (userMsg?.role === "user" && aiMsg?.role === "ai") {
      history.push({
        user_input: userMsg.text,
        agent_response: aiMsg.text,
      });
    }
  }

  return history.slice(-MAX_HISTORY_ENTRIES);
};

const formatPrice = (price?: string | number): string => {
  const num = parseInt(String(price ?? "0"));
  if (!num || num === 0) return "قیمت توافقی";
  if (num >= 1_000_000_000)
    return `${(num / 1_000_000_000).toFixed(1)} میلیارد تومان`;
  if (num >= 1_000_000)
    return `${(num / 1_000_000).toFixed(0)} میلیون تومان`;
  return `${num.toLocaleString("fa-IR")} تومان`;
};

const hasValue = (value?: string | number): boolean =>
  value !== undefined && value !== null && String(value).trim() !== "";

const PropertyPricing: React.FC<{ property: Property }> = ({ property }) => {
  const showMortgage = hasValue(property.mortgage);
  const showRent = hasValue(property.rent);

  if (showMortgage || showRent) {
    return (
      <div
        className={`mb-2 ${
          showMortgage && showRent ? "grid grid-cols-2 gap-2" : ""
        }`}
      >
        {showMortgage && (
          <div>
            <p className="text-[10px] text-gray-500 leading-tight">رهن</p>
            <p className="text-xs text-blue-700 font-semibold leading-snug">
              {formatPrice(property.mortgage)}
            </p>
          </div>
        )}
        {showRent && (
          <div>
            <p className="text-[10px] text-gray-500 leading-tight">
              اجاره (ماهانه)
            </p>
            <p className="text-xs text-blue-700 font-semibold leading-snug">
              {formatPrice(property.rent)}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <p className="text-xs text-blue-700 font-semibold mb-2">
      {formatPrice(property.price)}
    </p>
  );
};

// ─── PROPERTY SWIPER ──────────────────────────────────────────────────────────

interface PropertySwiperProps {
  properties: Property[];
}

const PropertySwiper: React.FC<PropertySwiperProps> = ({ properties }) => {
  const [current, setCurrent] = useState<number>(0);
  const navLockUntilRef = useRef(0);
  const total = properties.length;

  const navigate = (direction: 1 | -1) => (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const now = Date.now();
    if (now < navLockUntilRef.current) return;
    navLockUntilRef.current = now + 400;

    setCurrent((i) => (i + direction + total) % total);
  };

  const p = properties[current];

  const CardWrapper = p.property_url ? "a" : "div";
  const cardLinkProps = p.property_url
    ? {
        href: p.property_url,
        target: "_blank" as const,
        rel: "noopener noreferrer",
      }
    : {};

  return (
    <div
      dir="ltr"
      className="mt-2 flex w-full min-w-0 max-w-full items-center gap-1"
    >
      {total > 1 && (
        <button
          type="button"
          onClick={navigate(-1)}
          aria-label="ملک قبلی"
          className="shrink-0 touch-manipulation p-2 transition-transform duration-200 hover:scale-110"
        >
          <ChevronLeft className="pointer-events-none" />
        </button>
      )}

      <div className="relative min-w-0 flex-1">
        <CardWrapper
          {...cardLinkProps}
          className={`relative flex h-[clamp(300px,52svh,420px)] w-full min-w-0 flex-col overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm ${
            p.property_url
              ? "cursor-pointer transition-shadow hover:shadow-md"
              : ""
          }`}
        >
          <div className="relative min-h-0 w-full flex-1 overflow-hidden bg-gray-100">
            {p.image_url ? (
              <Image
                src={p.image_url}
                alt={p.title}
                fill
                className="object-contain"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                بدون تصویر
              </div>
            )}
          </div>

          <div className="flex w-full shrink-0 flex-col bg-white">
            <div
              className="min-w-0 max-h-[9.5rem] overflow-x-hidden overflow-y-auto p-3 text-right"
              dir="rtl"
            >
              <p className="mb-1 line-clamp-2 text-sm font-bold leading-snug text-gray-800">
                {p.title}
              </p>
              <PropertyPricing property={p} />

              <div className="mb-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600">
                {p.location && (
                  <span className="max-w-full break-words">📍 {p.location}</span>
                )}
                {p.measure && <span>📐 {p.measure} متر</span>}
                {p.rooms && <span>🛏 {p.rooms} خواب</span>}
              </div>

              {p.facilities && (
                <p className="mb-2 line-clamp-2 break-words text-xs text-gray-500">
                  امکانات: {p.facilities}
                </p>
              )}

              {p.agent && (
                <p className="break-words text-xs text-gray-500">
                  {p.agent}
                  {p.agent_phonenumber && ` · ${p.agent_phonenumber}`}
                </p>
              )}
            </div>

            {total > 1 && (
              <div
                dir="ltr"
                className="flex shrink-0 items-center justify-center border-t border-blue-50 bg-white py-2"
              >
                <span className="rounded-full bg-black/50 px-2.5 py-0.5 text-xs text-white">
                  {current + 1} / {total}
                </span>
              </div>
            )}
          </div>
        </CardWrapper>
      </div>

      {total > 1 && (
        <button
          type="button"
          onClick={navigate(1)}
          aria-label="ملک بعدی"
          className="shrink-0 touch-manipulation p-2 transition-transform duration-200 hover:scale-110"
        >
          <ChevronRight className="pointer-events-none" />
        </button>
      )}
    </div>
  );
};

// ─── AI WIDGET ────────────────────────────────────────────────────────────────

const ATTENTION_INITIAL_DELAY_MS = 10_000;
const ATTENTION_ANIMATION_MS = 900;

const AiWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAttention, setIsAttention] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [isStorageReady, setIsStorageReady] = useState(false);
  const [inputText, setInputText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const attentionDelayRef = useRef<number>(ATTENTION_INITIAL_DELAY_MS);
  const attentionTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setMessages(loadMessages());
    setIsStorageReady(true);
  }, []);

  useEffect(() => {
    if (!isStorageReady) return;
    saveMessages(messages);
  }, [messages, isStorageReady]);

  useEffect(() => {
    if (isOpen) {
      setIsAttention(false);
      attentionDelayRef.current = ATTENTION_INITIAL_DELAY_MS;
      if (attentionTimeoutRef.current !== null) {
        window.clearTimeout(attentionTimeoutRef.current);
        attentionTimeoutRef.current = null;
      }
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    attentionDelayRef.current = ATTENTION_INITIAL_DELAY_MS;

    const scheduleAttention = () => {
      attentionTimeoutRef.current = window.setTimeout(() => {
        setIsAttention(true);
        attentionDelayRef.current *= 2;
        scheduleAttention();
      }, attentionDelayRef.current);
    };

    scheduleAttention();

    return () => {
      if (attentionTimeoutRef.current !== null) {
        window.clearTimeout(attentionTimeoutRef.current);
        attentionTimeoutRef.current = null;
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isAttention) return;

    const timeoutId = window.setTimeout(() => {
      setIsAttention(false);
    }, ATTENTION_ANIMATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [isAttention]);

  const toggleChat = () => setIsOpen((o) => !o);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    const history = buildHistory(messages);

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userText, properties: null },
    ]);

    setInputText("");
    setIsLoading(true);
    setTimeout(scrollToBottom, 50);

    try {
      const response = await fetch(`${API_BASE_URL}/agent/response/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_input: userText,
          history,
        }),
      });

      if (!response.ok)
        throw new Error(`HTTP error ${response.status}`);

      const data: {
        explanation?: string;
        properties?: Property[];
      } = await response.json();

      const properties =
        data.properties && data.properties.length > 0
          ? data.properties
          : null;

      const explanation =
        data.explanation ||
        (properties
          ? "نتایج زیر برای شما پیدا شد:"
          : "پاسخی دریافت نشد.");

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: explanation, properties },
      ]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "متاسفانه خطایی رخ داده است.",
          properties: null,
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    await sendMessage(inputText.trim());
  };

  const handlePromptClick = (text: string) => {
    void sendMessage(text);
  };

  const showRecommendationPrompts =
    isInitialChat(messages) && !isLoading;

  return ( 
    <div className="absolute bottom-4 right-2 z-[9999] flex flex-col items-end font-sans sm:bottom-5 sm:right-5">
      {isOpen && (
        <div
          dir="rtl"
          className="fixed inset-0 flex flex-col overflow-hidden bg-white shadow-2xl
          sm:absolute sm:inset-auto sm:bottom-0 sm:right-0
          sm:w-[480px] sm:h-[680px] sm:max-h-[90vh] sm:rounded-2xl"
        >
          <div className="flex items-center justify-between border-b border-gray-200 bg-white p-4 flex-shrink-0">
            <span className="text-base font-bold text-gray-800">
             شهر GPT - دستیار هوشمند املاک
            </span>
            <button
              onClick={toggleChat}
              className="text-xl text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-3 overflow-x-hidden overflow-y-auto bg-gray-50 p-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex w-full ${
                  msg.role === "user"
                    ? "justify-start"
                    : "justify-end"
                }`}
              >
                <div
                  className={`flex min-w-0 flex-col gap-1 ${
                    msg.role === "ai" && msg.properties
                      ? "w-full max-w-full"
                      : "max-w-[88%]"
                  }`}
                >
                  <div
                    className={`break-words rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "rounded-tr-none bg-[#2a1b8d] text-white"
                        : "rounded-tl-none bg-[#e0f2fe] text-black"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {msg.role === "ai" && msg.properties && (
                    <div className="min-w-0 w-full max-w-full">
                      <PropertySwiper properties={msg.properties} />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {showRecommendationPrompts && (
              <div className="mt-1 flex w-full flex-col gap-3 px-1">
                <p className="text-center text-xs text-gray-500">
                  پیشنهادات:
                </p>
                <div className="flex flex-col gap-2">
                  {RECOMMENDATION_PROMPTS.map((prompt) => (
                    <button
                      key={prompt.category}
                      type="button"
                      onClick={() => handlePromptClick(prompt.text)}
                      className={`group flex w-full cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-right text-sm shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
                        prompt.category === "property_search"
                          ? "border-[#2a1b8d]/25 bg-[#2a1b8d]/5 hover:border-[#2a1b8d]/45 hover:bg-[#2a1b8d]/10 focus-visible:ring-[#2a1b8d]/40"
                          : "border-sky-200 bg-sky-50 hover:border-sky-300 hover:bg-sky-100 focus-visible:ring-sky-300"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <span
                          className={`mb-1 block text-xs font-semibold ${
                            prompt.category === "property_search"
                              ? "text-[#2a1b8d]"
                              : "text-sky-700"
                          }`}
                        >
                          {prompt.label}
                        </span>
                        <span className="block leading-relaxed text-gray-700">
                          {prompt.text}
                        </span>
                      </div>
                      <ChevronLeft
                        className={`size-4 shrink-0 opacity-35 transition-all duration-200 group-hover:opacity-70 group-hover:-translate-x-0.5 ${
                          prompt.category === "property_search"
                            ? "text-[#2a1b8d]"
                            : "text-sky-600"
                        }`}
                        aria-hidden
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex w-full justify-end">
                <div className="max-w-[88%] rounded-2xl rounded-tl-none bg-[#e0f2fe] px-4 py-2 text-sm text-black">
                  <ThreeDots
                    height="40"
                    width="40"
                    color="#4fa94d"
                    visible={true}
                  />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2 border-t border-gray-200 bg-white p-3"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) =>
                setInputText(e.target.value)
              }
              placeholder="اینجا تایپ کنید ..."
              className="flex-1 bg-transparent p-2 text-sm text-gray-800 outline-none"
            />

            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="rotate-180 text-xl text-gray-500 hover:text-[#2a1b8d] disabled:opacity-50"
            >
              ➤
            </button>
          </form>
        </div>
      )}

      {!isOpen && (
        <div className="group relative flex items-center">
          <div
            dir="rtl"
            className={`pointer-events-none absolute right-full top-1/2 z-10 mr-4 -translate-y-1/2 transition-all duration-300 ease-out ${
              isAttention
                ? "translate-x-0 opacity-100"
                : "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
            }`}
          >
            <div className="relative whitespace-nowrap rounded-2xl bg-gradient-to-l from-[#2a1b8d] to-[#4338ca] px-4 py-2.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(42,27,141,0.35)]">
              دستیار هوشمند گویا
              <span
                className="absolute -right-2 top-1/2 size-0 -translate-y-1/2 border-y-[7px] border-l-[8px] border-y-transparent border-l-[#4338ca]"
                aria-hidden
              />
            </div>
          </div>

          <button
            type="button"
            onClick={toggleChat}
            aria-label="دستیار هوشمند گویا"
            className="relative block size-[85px] rounded-full transition-transform duration-300 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2a1b8d]"
          >
            {isAttention && (
              <>
                <span className="pointer-events-none absolute inset-0 rounded-full border-2 border-[#4338ca] animate-ai-widget-pulse-ring" />
                <span
                  className="pointer-events-none absolute inset-0 rounded-full border-2 border-[#2a1b8d] animate-ai-widget-pulse-ring"
                  style={{ animationDelay: "150ms" }}
                />
              </>
            )}
            <Image
              src="/ai/aiIcon.png"
              alt="دستیار هوشمند گویا"
              className="drop-shadow-[0_4px_14px_rgba(42,27,141,0.25)]"
              fill
              priority
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default AiWidget;
