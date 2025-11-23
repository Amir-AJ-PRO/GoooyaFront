'use client';

import { Sparkles, Shield, CheckCircle, TrendingUp } from "lucide-react";
import Link from "next/link";

export function TrustBar() {
  const items = [
    {
      icon: CheckCircle,
      text: "املاک تایید شده",
      color: "text-green-600",
    },
    {
      icon: Sparkles,
      text: "متصل به شهر GPT",
      color: "text-yellow-600",
      link: "/ai-search",
    },
    {
      icon: Shield,
      text: "معاملات امن",
      color: "text-blue-600",
    },
    {
      icon: TrendingUp,
      text: "تحلیل بازار",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="border-b bg-gradient-to-r from-primary/5 via-yellow-500/5 to-primary/5">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-sm">
          {items.map((item, index) => {
            const Icon = item.icon;
            const content = (
              <>
                <Icon className={`h-4 w-4 ${item.color}`} />
                <span className="text-muted-foreground">{item.text}</span>
              </>
            );

            if (item.link) {
              return (
                <Link
                  key={index}
                  href={item.link}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  {content}
                </Link>
              );
            }

            return (
              <div key={index} className="flex items-center gap-2">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

