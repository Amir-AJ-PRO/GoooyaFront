'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, User, Heart, Trophy, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function MobileNav() {
  const pathname = usePathname();
  const { user, backendUser } = useAuth();

  const isVerifiedAgent = backendUser?.agent_profile?.is_verified === true;
  const accountPath =
    user?.type === 'admin'
      ? '/admin'
      : user?.type === 'agent' || isVerifiedAgent
        ? '/agent'
        : '/user';

  const navItems = [
    { name: "خانه", path: "/", icon: Home },
    { name: "املاک", path: "/properties", icon: Search },
    { name: "مشاورین", path: "/agents", icon: Users },
    { name: "گویا کلاب", path: "/user/club", icon: Trophy },
    { name: "علاقه‌مندی", path: "/user/favorites", icon: Heart },
    { name: "حساب من", path: accountPath, icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <nav className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isFavorites = item.path === "/user/favorites";
          const isClub = item.path === "/user/club";
          const isAccount = item.name === "حساب من";
          const isActive = isFavorites
            ? pathname.startsWith("/user/favorites")
            : isClub
              ? pathname.startsWith("/user/club")
            : isAccount
              ? (pathname === item.path || pathname.startsWith(`${item.path}/`)) &&
                !pathname.startsWith("/user/favorites") &&
                !pathname.startsWith("/user/club")
              : item.path === "/"
                ? pathname === "/"
                : pathname === item.path || pathname.startsWith(`${item.path}/`);
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 py-2 transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon
                className={`h-5 w-5 ${isClub ? "text-[#D4AF37]" : ""}`}
              />
              <span className="truncate text-[10px]">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
