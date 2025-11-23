'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, Search, Info, User, Menu, MapPin, Building, LogOut, MessageCircle, Bot, Wrench, Settings, UserCircle } from "lucide-react";
import { useState, memo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import LoginModal from "@/components/LoginModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Header = memo(() => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { user, logout } = useAuth();
  
  const navItems = [
    { name: "صفحه اصلی", path: "/", icon: Home },
    { name: "املاک", path: "/properties", icon: Search },
    { name: "جستجوی هوشمند", path: "/ai-search", icon: Bot, highlight: true },
    { name: "خدمات مهندسی", path: "/engineering", icon: Wrench },
    { name: "پشتیبانی", path: "/support", icon: MessageCircle },
    { name: "درباره ما", path: "/about", icon: Info },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Home className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-foreground">گویا</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} href={item.path} className="relative" prefetch={true}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className={item.highlight ? "gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-700 border border-yellow-500/20" : "gap-2"}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                {/* Desktop User Menu */}
                <div className="hidden md:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {user.phone ? user.phone.slice(-2) : (user.name ? user.name.charAt(0) : 'U')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="max-w-[100px] truncate">
                          {user.name || user.phone || 'کاربر'}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">حساب کاربری</p>
                          <p className="text-xs leading-none text-muted-foreground" dir="ltr">
                            {user.phone || user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={user.type === 'admin' ? '/admin' : user.type === 'agent' ? '/agent' : '/user'} className="cursor-pointer">
                          {user.type === 'agent' ? (
                            <Building className="ml-2 h-4 w-4" />
                          ) : (
                            <UserCircle className="ml-2 h-4 w-4" />
                          )}
                          <span>پنل کاربری</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/user" className="cursor-pointer">
                          <Settings className="ml-2 h-4 w-4" />
                          <span>تنظیمات</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                        <LogOut className="ml-2 h-4 w-4" />
                        <span>خروج</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            ) : (
              <Button 
                variant="outline" 
                className="gap-2 hidden md:flex"
                onClick={() => setLoginModalOpen(true)}
              >
                <User className="h-4 w-4" />
                ورود / ثبت نام
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-border py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} href={item.path} onClick={() => setMobileMenuOpen(false)} prefetch={true}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className="w-full justify-start gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
            {user ? (
              <>
                <Link href={user.type === 'admin' ? '/admin' : user.type === 'agent' ? '/agent' : '/user'} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    {user.type === 'agent' ? (
                      <Building className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                    پنل کاربری
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  خروج
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setLoginModalOpen(true);
                }}
              >
                <User className="h-4 w-4" />
                ورود / ثبت نام
              </Button>
            )}
          </nav>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </header>
  );
});

Header.displayName = 'Header';

export default Header;

