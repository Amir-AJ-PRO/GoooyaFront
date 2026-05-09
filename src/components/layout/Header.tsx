'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Search, Info, User, Menu, MapPin, Building, LogOut, MessageCircle, Wrench, Settings, UserCircle, Plus, FileText, Briefcase, BookOpen, Heart, Phone } from "lucide-react";
import { useState, memo, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import LoginModal from "@/components/LoginModal";
import SubmitPropertyModal from "@/components/tickets/SubmitPropertyModal";
import { useAdviserTicketsCount } from "@/hooks/useTicketAdviser";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import QuickSearch from "@/components/common/QuickSearch";

const Header = memo(() => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [submitPropertyModalOpen, setSubmitPropertyModalOpen] = useState(false);
  const { user, backendUser, logout, isAuthenticated } = useAuth();

  // بررسی اینکه آیا کاربر مشاور گویا است
  const isGooyaAdviser = backendUser?.agent_profile?.is_goooya_adviser === true;

  // بررسی اینکه آیا کاربر agent است یا نه
  const isAgent = user?.type === 'agent' || !!backendUser?.agent_profile;

  // فقط وقتی که کاربر مشاور گویا باشه، تعداد تیکت‌ها رو بگیر
  const { data: ticketsCount } = useAdviserTicketsCount(isGooyaAdviser);

  const navItems = [

    { name: "املاک", path: "/properties", icon: Building  },
    { name: "مشاورین", path: "/agents", icon: UserCircle },
    { name: "خدمات مهندسی", path: "/engineering", icon: Wrench },
    { name: "مقالات", path: "/blog", icon: BookOpen },
    // { name: "پشتیبانی", path: "/support", icon: MessageCircle },
    { name: "درباره ما", path: "/about", icon: Info },
        { name: "تماس با ما", path: "/contact", icon: Phone },

  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      

      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="h-10 w-10">
              <img
                src="/logo-gooya.svg"
                alt="گویا"
                className="h-full w-full object-contain"
              />
            </div>
            <span className="text-xl lg:text-2xl font-bold text-foreground">گویا</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} href={item.path} className="relative" prefetch={true}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className={`gap-1.5 text-sm px-2.5 xl:px-3 h-9 ${isActive(item.path)
                        ? "bg-primary/80 hover:bg-primary/90"
                        : ""
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="whitespace-nowrap">{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Quick Search - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-xs xl:max-w-sm mx-2 xl:mx-4">
            <QuickSearch />
          </div>

          <div className="flex items-center gap-1.5 xl:gap-2 flex-shrink-0">
            {/* دکمه تیکت‌ها - فقط برای مشاور گویا */}
            {isGooyaAdviser && (
              <Link href="/admin/tickets">
                <Button variant="default" className="gap-1.5 hidden lg:flex bg-primary hover:bg-primary/90 text-sm px-2.5 xl:px-3 h-9">
                  <FileText className="h-4 w-4" />
                  <span className="hidden xl:inline whitespace-nowrap">تیکت‌های ثبت ملک</span>
                  <span className="xl:hidden whitespace-nowrap">تیکت‌ها</span>
                  {ticketsCount !== undefined && ticketsCount > 0 && (
                    <Badge className="mr-1 bg-white text-primary text-xs px-1.5">
                      {ticketsCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}

            {/* دکمه ثبت ملک - برای همه کاربران */}
            {(!user || user.type === 'user') && (
              <Button
                className="gap-1.5 hidden lg:flex text-sm px-2.5 xl:px-3 h-9"
                onClick={() => setSubmitPropertyModalOpen(true)}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden xl:inline whitespace-nowrap">سپردن ملک</span>
                <span className="xl:hidden whitespace-nowrap">ثبت آگهی</span>
              </Button>
            )}

            {user ? (
              <>
                {/* Desktop User Menu */}
                <div className="hidden lg:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-1.5 text-sm px-2.5 xl:px-3 h-9">
                        <Avatar className="h-6 w-6 flex-shrink-0">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {user.phone ? user.phone.slice(-2) : (user.name ? user.name.charAt(0) : 'U')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="max-w-[60px] xl:max-w-[100px] truncate">
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
                      {/* لینک علاقه‌مندی‌ها - برای کاربران عادی */}
                      {user.type !== 'admin' && (
                        <DropdownMenuItem asChild>
                          <Link href="/user/favorites" className="cursor-pointer">
                            <Heart className="ml-2 h-4 w-4" />
                            <span>علاقه‌مندی‌ها</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                      {/* منوی تیکت‌ها - فقط برای مشاور گویا */}
                      {isGooyaAdviser && (
                        <DropdownMenuItem asChild>
                          <Link href="/admin/tickets" className="cursor-pointer">
                            <FileText className="ml-2 h-4 w-4" />
                            <span>تیکت‌های ثبت ملک</span>
                            {ticketsCount !== undefined && ticketsCount > 0 && (
                              <Badge className="mr-auto bg-primary text-white">
                                {ticketsCount}
                              </Badge>
                            )}
                          </Link>
                        </DropdownMenuItem>
                      )}
                      {/* لینک تبدیل به مشاور - فقط برای کاربران عادی */}
                      {isAuthenticated && !isAgent && (
                        <DropdownMenuItem asChild>
                          <Link href="/become-agent" className="cursor-pointer">
                            <Briefcase className="ml-2 h-4 w-4" />
                            <span>تبدیل به مشاور</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
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
              <>
                <Button
                  variant="outline"
                  className="gap-1.5 hidden lg:flex text-sm px-2.5 xl:px-3 h-9"
                  onClick={() => setLoginModalOpen(true)}
                >
                  <User className="h-4 w-4" />
                  <span className="hidden xl:inline whitespace-nowrap">ورود / ثبت نام</span>
                  <span className="xl:hidden whitespace-nowrap">ورود</span>
                </Button>
              </>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9 flex-shrink-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden border-t border-border py-4 space-y-2">
            {/* دکمه تیکت‌ها - فقط برای مشاور گویا */}
            {isGooyaAdviser && (
              <Link href="/admin/tickets" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full justify-start gap-2 bg-primary hover:bg-primary/90 text-white">
                  <FileText className="h-4 w-4" />
                  تیکت‌های ثبت ملک
                  {ticketsCount !== undefined && ticketsCount > 0 && (
                    <Badge className="mr-auto bg-white text-primary">
                      {ticketsCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}

            {/* دکمه ثبت ملک در موبایل - برای همه کاربران */}
            {(!user || user.type === 'user') && (
              <Button
                className="w-full justify-start gap-2 my-2 "
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSubmitPropertyModalOpen(true);
                }}
              >
                <Plus className="h-4 w-4  " />
                درخواست ثبت آگهی
              </Button>
            )}

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} href={item.path} onClick={() => setMobileMenuOpen(false)} prefetch={true}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className="w-full justify-start gap-2 "
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
            {user ? (
              <>
                {/* لینک تبدیل به مشاور در موبایل - فقط برای کاربران عادی */}
                {isAuthenticated && !isAgent && (
                  <Link href="/become-agent" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="default" className="w-full justify-start gap-2">
                      <Briefcase className="h-4 w-4" />
                      تبدیل به مشاور
                    </Button>
                  </Link>
                )}
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

      {/* Submit Property Modal */}
      <SubmitPropertyModal open={submitPropertyModalOpen} onOpenChange={setSubmitPropertyModalOpen} />
    </header>
  );
});

Header.displayName = 'Header';

export default Header;

