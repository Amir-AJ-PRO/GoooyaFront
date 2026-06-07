"use client"
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { ThreeDots } from "react-loader-spinner";
import { ChevronLeft, ChevronRight  } from "lucide-react";


// ─── CONFIG ───────────────────────────────────────────────────────────────────
const API_BASE_URL = "http://127.0.0.1:8020"; 


const formatPrice = (price) => {
    const num = parseInt(price);
    if (!num || num === 0) return "قیمت توافقی";
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)} میلیارد تومان`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(0)} میلیون تومان`;
    return `${num.toLocaleString('fa-IR')} تومان`;
};

const PropertySwiper = ({ properties }) => {
    const [current, setCurrent] = useState(0);
    const total = properties.length;

    const prev = () => setCurrent(i => (i - 1 + total) % total);
    const next = () => setCurrent(i => (i + 1) % total);

    const p = properties[current];

    return (
        // removed overflow-clip so buttons can poke outside the card
        <div className="relative w-full mt-2 rounded-xl border max-h-[350px] min-h-[350px] border-blue-100 min-w-[300px] max-w-[300px] shadow-sm bg-white">
            {/* Image */}
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

            {/* Navigation arrows — outside image div, positioned on the card */}
            {total > 1 && (
               <>
  <button
    onClick={next}
    className='absolute -right-[30px] transition-transform duration-200 hover:scale-125'
  >
    <ChevronRight />
  </button>
  <button
    onClick={prev}
    className='absolute -left-[30px] transition-transform duration-200 hover:scale-125'
  >
    <ChevronLeft />
  </button>
</>

            )}

            {/* Info */}
            <div className="p-3 text-right" dir="rtl">
                <p className="font-bold text-sm text-gray-800 leading-snug mb-1">{p.title}</p>
                <p className="text-xs text-blue-700 font-semibold mb-2">{formatPrice(p.price)}</p>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600 mb-2">
                    {p.location && <span>📍 {p.location}</span>}
                    {p.measure && <span>📐 {p.measure} متر</span>}
                    {p.rooms ? <span>🛏 {p.rooms} خواب</span> : <span></span>}
                    {p.floor && <span>🏢 طبقه {p.floor}</span>}
                </div>
                {p.facilities && (
                    <p className="text-xs text-gray-500 mb-2">امکانات: {p.facilities}</p>
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
               {/* Counter badge stays inside the image */}
                {total > 1 && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full z-10">
                        {total} / {current + 1}
                    </div>
                )}
        </div>
    );
};

const AiWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "ai", text: "سلام، خوش اومدید. چطور می‌تونم کمکتون کنم؟", properties: null }
    ]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const toggleChat = () => setIsOpen(o => !o);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userText = inputText.trim();
        setMessages(prev => [...prev, { role: "user", text: userText, properties: null }]);
        setInputText("");
        setIsLoading(true);

        setTimeout(scrollToBottom, 50);

        try {
            const response = await fetch(`${API_BASE_URL}/agent/response/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_input: userText }),
            });
            console.log(response)

            if (!response.ok) throw new Error(`HTTP error ${response.status}`);

            const data = await response.json();

            const properties = data.properties && data.properties.length > 0 ? data.properties : null;
            const explanation = data.explanation || (properties ? "نتایج زیر برای شما پیدا شد:" : "پاسخی دریافت نشد.");

            setMessages(prev => [...prev, { role: "ai", text: explanation, properties }]);
        } catch (error) {
            console.error("Error fetching AI response:", error);
            setMessages(prev => [...prev, { role: "ai", text: "متاسفانه خطایی رخ داده است.", properties: null }]);
        } finally {
            setIsLoading(false);
            setTimeout(scrollToBottom, 100);
        }
    };

    return (
        <div className="absolute bottom-5 right-5 z-[9999] flex flex-col items-end font-sans">

            {/* Chat Box */}
            {isOpen && (
                <div
                    dir="rtl"
                    className="fixed inset-0 flex flex-col overflow-hidden bg-white shadow-2xl
                               sm:absolute sm:inset-auto sm:bottom-0 sm:right-0
                               sm:w-[480px] sm:h-[680px] sm:max-h-[90vh] sm:rounded-2xl"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-200 bg-white p-4 flex-shrink-0">
                        <span className="text-base font-bold text-gray-800">سیستم پشتیبانی آنلاین</span>
                        <button
                            onClick={toggleChat}
                            className="text-xl text-gray-500 transition-colors hover:text-gray-800 focus:outline-none"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-gray-50 p-4">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex w-full ${msg.role === "user" ? "justify-start" : "justify-end"}`}
                            >
                                <div className={`max-w-[88%] flex flex-col gap-1`}>
                                    {/* Text bubble */}
                                    <div
                                        className={`break-words rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                                            msg.role === "user"
                                                ? "rounded-tr-none bg-[#2a1b8d] text-white"
                                                : "rounded-tl-none bg-[#e0f2fe] text-black"
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                    {/* Property swiper — only for AI messages */}
                                    {msg.role === "ai" && msg.properties && (
                                        // px-6 gives breathing room so the -left-5/-right-5 buttons are visible
                                        <div className="px-6">
                                            <PropertySwiper properties={msg.properties} />
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
                                    visible={true}/>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form
                        onSubmit={handleSendMessage}
                        className="flex items-center gap-2 border-t border-gray-200 bg-white p-3 flex-shrink-0"
                    >
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="اینجا تایپ کنید ..."
                            className="flex-1 bg-transparent p-2 text-sm text-gray-800 outline-none"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !inputText.trim()}
                            className="rotate-180 transform text-xl text-gray-500 transition-colors hover:text-[#2a1b8d] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            ➤
                        </button>
                    </form>
                </div>
            )}

            {/* Floating Action Button */}
            {!isOpen && (
                <button
                    onClick={toggleChat}
                    className="block w-[100px] h-[100px] transition-transform hover:scale-105 focus:outline-none"
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
