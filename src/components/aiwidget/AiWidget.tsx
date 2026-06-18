"use client";

import React, { useState, useRef, FormEvent } from "react";
import Image from "next/image";
import { ThreeDots } from "react-loader-spinner";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const API_BASE_URL = "http://127.0.0.1:8020";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface Property {
  image_url?: string;
  title: string;
  price?: string | number;
  location?: string;
  measure?: string | number;
  rooms?: string | number;
  floor?: string | number;
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

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const formatPrice = (price?: string | number): string => {
  const num = parseInt(String(price ?? "0"));
  if (!num || num === 0) return "قیمت توافقی";
  if (num >= 1_000_000_000)
    return `${(num / 1_000_000_000).toFixed(1)} میلیارد تومان`;
  if (num >= 1_000_000)
    return `${(num / 1_000_000).toFixed(0)} میلیون تومان`;
  return `${num.toLocaleString("fa-IR")} تومان`;
};

// ─── PROPERTY SWIPER ──────────────────────────────────────────────────────────

interface PropertySwiperProps {
  properties: Property[];
}

const PropertySwiper: React.FC<PropertySwiperProps> = ({ properties }) => {
  const [current, setCurrent] = useState<number>(0);
  const total = properties.length;

  const prev = () => setCurrent((i) => (i - 1 + total) % total);
  const next = () => setCurrent((i) => (i + 1) % total);

  const p = properties[current];

  return ( 
    <div className="relative w-full mt-2 rounded-xl border max-h-[350px] min-h-[350px] border-blue-100 min-w-[300px] max-w-[300px] shadow-sm bg-white">
      <div className="relative w-full h-40 overflow-hidden rounded-t-xl">
        {p.image_url ? (
          <Image
            src={p.image_url}
            alt={p.title}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
            بدون تصویر
          </div>
        )}
      </div>

      {total > 1 && (
        <>
          <button
            onClick={next}
            className="absolute -right-[30px] transition-transform duration-200 hover:scale-125"
          >
            <ChevronRight />
          </button>
          <button
            onClick={prev}
            className="absolute -left-[30px] transition-transform duration-200 hover:scale-125"
          >
            <ChevronLeft />
          </button>
        </>
      )}

      <div className="p-3 text-right" dir="rtl">
        <p className="font-bold text-sm text-gray-800 leading-snug mb-1">
          {p.title}
        </p>
        <p className="text-xs text-blue-700 font-semibold mb-2">
          {formatPrice(p.price)}
        </p>

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600 mb-2">
          {p.location && <span>📍 {p.location}</span>}
          {p.measure && <span>📐 {p.measure} متر</span>}
          {p.rooms && <span>🛏 {p.rooms} خواب</span>}
          {p.floor && <span>🏢 طبقه {p.floor}</span>}
        </div>

        {p.facilities && (
          <p className="text-xs text-gray-500 mb-2">
            امکانات: {p.facilities}
          </p>
        )}

        {p.agent && (
          <p className="text-xs text-gray-500">
            {p.agent}
            {p.agent_phonenumber && ` · ${p.agent_phonenumber}`}
          </p>
        )}

        {p.property_url && (
          <a
            href={p.property_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-xs text-blue-600 underline"
          >
            مشاهده ملک
          </a>
        )}
      </div>

      {total > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full z-10">
          {total} / {current + 1}
        </div>
      )}
    </div>
  );
};

// ─── AI WIDGET ────────────────────────────────────────────────────────────────

const AiWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "سلام، خوش اومدید. چطور می‌تونم کمکتون کنم؟",
      properties: null,
    },
  ]);
  const [inputText, setInputText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const toggleChat = () => setIsOpen((o) => !o);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_input: userText }),
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

  return ( 
    <div className="absolute bottom-5 right-5 z-[9999] flex flex-col items-end font-sans">
      {isOpen && (
        <div
          dir="rtl"
          className="fixed inset-0 flex flex-col overflow-hidden bg-white shadow-2xl
          sm:absolute sm:inset-auto sm:bottom-0 sm:right-0
          sm:w-[480px] sm:h-[680px] sm:max-h-[90vh] sm:rounded-2xl"
        >
          <div className="flex items-center justify-between border-b border-gray-200 bg-white p-4 flex-shrink-0">
            <span className="text-base font-bold text-gray-800">
              سیستم پشتیبانی آنلاین
            </span>
            <button
              onClick={toggleChat}
              className="text-xl text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-gray-50 p-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex w-full ${
                  msg.role === "user"
                    ? "justify-start"
                    : "justify-end"
                }`}
              >
                <div className="max-w-[88%] flex flex-col gap-1">
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
                    <div className="px-6">
                      <PropertySwiper
                        properties={msg.properties}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}

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
        <button
          onClick={toggleChat}
          className="block w-[100px] h-[100px] transition-transform hover:scale-105"
        >
          <Image
            src="/ai/aiIcon.png"
            alt="AI Support"
            className="drop-shadow-md"
            fill
            priority
          />
        </button>
      )}
    </div>
  );
};

export default AiWidget;
