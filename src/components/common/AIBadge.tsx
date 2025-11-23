import { Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AIBadgeProps {
  variant?: "default" | "compact" | "hero";
  className?: string;
}

export function AIBadge({ variant = "default", className }: AIBadgeProps) {
  if (variant === "compact") {
    return (
      <Link 
        href="/ai-search"
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full",
          "bg-gradient-to-r from-yellow-500/10 to-amber-500/10",
          "border border-yellow-500/20",
          "hover:border-yellow-500/40 transition-colors",
          "text-xs font-medium text-yellow-700",
          className
        )}
      >
        <Sparkles className="h-3 w-3" />
        <span>شهر GPT</span>
      </Link>
    );
  }

  if (variant === "hero") {
    return (
      <Link 
        href="/ai-search"
        className={cn(
          "inline-flex items-center gap-2 px-6 py-3 rounded-full",
          "bg-gradient-to-r from-yellow-500 to-amber-500",
          "hover:from-yellow-600 hover:to-amber-600",
          "shadow-lg hover:shadow-xl transition-all",
          "text-white font-bold",
          className
        )}
      >
        <Sparkles className="h-5 w-5" />
        <span>قدرت‌گرفته از شهر GPT</span>
      </Link>
    );
  }

  return (
    <Link 
      href="/ai-search"
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-lg",
        "bg-gradient-to-r from-yellow-500/10 to-amber-500/10",
        "border border-yellow-500/20",
        "hover:border-yellow-500/40 hover:shadow-md transition-all",
        "text-sm font-medium text-yellow-700",
        className
      )}
    >
      <Sparkles className="h-4 w-4" />
      <div className="flex flex-col items-start">
        <span className="text-xs text-yellow-600">متصل به</span>
        <span className="font-bold">شهر GPT</span>
      </div>
    </Link>
  );
}

