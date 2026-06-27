'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Menu,
  Building,
  LucideBuilding,
  LogOut,
  Settings,
  UserCircle,
  Plus,
  FileText,
  Briefcase,
  Heart,
} from "lucide-react";
import { useState, memo, type ComponentType } from "react";
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
import { cn } from "@/lib/utils";
import {
  PropertyNavIcon,
  ConsultantNavIcon,
  EngineeringNavIcon,
  ArticleNavIcon,
  ContactNavIcon,
  AboutNavIcon,
  LoginNavIcon,
} from "./HeaderNavIcons";

const PRIMARY = "#251785";

type NavIconComponent = ComponentType<{ className?: string }>;

const navItems: { name: string; path: string; icon: NavIconComponent }[] = [
  { name: "املاک", path: "/properties", icon: PropertyNavIcon },
  { name: "مشاورین", path: "/agents", icon: ConsultantNavIcon },
  { name: "خدمات مهندسی", path: "/engineering", icon: EngineeringNavIcon },
  { name: "مقالات", path: "/blog", icon: ArticleNavIcon },
  { name: "تماس با ما", path: "/contact", icon: ContactNavIcon },
  { name: "درباره ما", path: "/about", icon: AboutNavIcon },
];

const Header = memo(() => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [submitPropertyModalOpen, setSubmitPropertyModalOpen] = useState(false);
  const { user, backendUser, logout, isAuthenticated } = useAuth();

  const isGooyaAdviser = backendUser?.agent_profile?.is_goooya_adviser === true;
  const isAgent = user?.type === 'agent' || !!backendUser?.agent_profile;
  const { data: ticketsCount } = useAdviserTicketsCount(isGooyaAdviser);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full max-w-[100vw] overflow-x-clip border-b border-[#E8ECF2] bg-white">
      <div className="container mx-auto pe-3 ps-0 lg:pe-4 xl:pe-6">
        <div className="flex h-[72px] min-w-0 items-center justify-between gap-4 lg:grid lg:grid-cols-[auto_1fr_auto] lg:items-center lg:justify-normal lg:gap-x-4 xl:gap-x-6">
          <div className="flex shrink-0 items-center gap-3 lg:gap-4 xl:gap-5">
            <Link
              href="/"
              className="group -ms-1.5 flex shrink-0 items-center gap-2 pe-0 transition-opacity hover:opacity-85 xl:-ms-2"
            >
              <div className="flex h-8 w-8 items-center justify-center xl:h-9 xl:w-9">
                <img
                  src="/logo-gooya.svg"
                  alt="گویا"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-[17px] font-bold text-[#111111] xl:text-[19px]">گویا</span>
            </Link>

            <nav className="hidden shrink-0 items-center gap-1.5 lg:flex xl:gap-2.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    prefetch={true}
                    className={cn(
                      "group inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-1 py-0.5 text-[13px] transition-all duration-200 xl:gap-2 xl:px-1.5 xl:py-1 xl:text-[14px]",
                      active
                        ? "font-bold text-[#251785]"
                        : "font-medium text-[#111111] hover:bg-[#251785]/[0.08] hover:text-[#251785]"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-[18px] w-[18px] shrink-0 transition-colors duration-200 xl:h-[20px] xl:w-[20px]",
                        active
                          ? "text-[#251785]"
                          : "text-[#111111] group-hover:text-[#251785]"
                      )}
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="hidden min-w-0 justify-center px-2 lg:flex xl:px-4">
            <div className="w-full max-w-[300px] xl:max-w-[340px]">
              <QuickSearch />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-4 lg:justify-end lg:gap-5 xl:gap-6">

            {isGooyaAdviser && (
              <Link href="/admin/tickets" className="hidden lg:block">
                <Button
                  className="h-9 gap-1.5 rounded-[10px] px-4 text-[13px] text-white shadow-sm transition-all duration-200 hover:brightness-110 hover:shadow-md"
                  style={{ backgroundColor: PRIMARY }}
                >
                  <FileText className="h-4 w-4" />
                  <span className="hidden xl:inline">تیکت‌های ثبت ملک</span>
                  <span className="xl:hidden">تیکت‌ها</span>
                  {ticketsCount !== undefined && ticketsCount > 0 && (
                    <Badge className="mr-1 bg-white px-1.5 text-xs text-[#251785]">
                      {ticketsCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}

            {(!user || user.type === 'user') && (
              <Button
                className="hidden h-[34px] gap-1.5 rounded-[10px] px-3.5 text-[13px] font-medium text-white
                 transition-colors duration-200 hover:brightness-110 lg:flex xl:h-[36px]
                  xl:gap-2 xl:px-4 xl:text-[13px]"
                style={{ backgroundColor: PRIMARY }}
                onClick={() => setSubmitPropertyModalOpen(true)}
              >
                <Plus className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
                <span className="leading-none">سپردن ملک</span>
              </Button>
            )}

            {user ? (
              <div className="hidden lg:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13.5px] font-medium text-[#111111] transition-all duration-200 hover:bg-[#251785]/[0.06] hover:text-[#251785]"
                    >
                      <Avatar className="h-8 w-8 shrink-0 ring-2 ring-transparent transition-all group-hover:ring-[#251785]/20">
                        <AvatarFallback
                          className="text-xs text-white"
                          style={{ backgroundColor: PRIMARY }}
                        >
                          {user.phone
                            ? user.phone.slice(-2)
                            : user.name
                              ? user.name.charAt(0)
                              : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="max-w-[100px] truncate">
                        {user.name || user.phone || 'کاربر'}
                      </span>
                    </button>
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
                    {user.type !== 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link href="/user/favorites" className="cursor-pointer">
                          <Heart className="ml-2 h-4 w-4" />
                          <span>علاقه‌مندی‌ها</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
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
                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600">
                      <LogOut className="ml-2 h-4 w-4" />
                      <span>خروج</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <button
                type="button"
                className="group hidden items-center gap-2 rounded-[10px] px-1 py-1.5 text-[13px] font-medium text-[#111111] transition-all duration-200 hover:bg-[#251785]/[0.08] hover:text-[#251785] lg:flex xl:gap-2.5 xl:px-2 xl:py-2 xl:text-[14px]"
                onClick={() => setLoginModalOpen(true)}
              >
                <LoginNavIcon className="size-[22px] shrink-0 text-[#161616] transition-colors duration-200 group-hover:text-[#251785] xl:size-[24px]" />
                <span>ورود / ثبت نام</span>
              </button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="space-y-1 border-t border-[#E8ECF2] py-4 lg:hidden">
            <div className="mb-3 px-1">
              <QuickSearch />
            </div>

            {isGooyaAdviser && (
              <Link href="/admin/tickets" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  className="w-full justify-start gap-2 text-white"
                  style={{ backgroundColor: PRIMARY }}
                >
                  <FileText className="h-4 w-4" />
                  تیکت‌های ثبت ملک
                  {ticketsCount !== undefined && ticketsCount > 0 && (
                    <Badge className="mr-auto bg-white text-[#251785]">
                      {ticketsCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}

            {(!user || user.type === 'user') && (
              <Button
                className="my-2 w-full justify-start gap-2 text-white"
                style={{ backgroundColor: PRIMARY }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSubmitPropertyModalOpen(true);
                }}
              >
                <Plus className="h-4 w-4" />
                سپردن ملک
              </Button>
            )}

            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link key={item.path} href={item.path} onClick={() => setMobileMenuOpen(false)} prefetch={true}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-2 text-[#111111] hover:bg-[#251785]/[0.08] hover:text-[#251785]",
                      active && "bg-[#251785]/[0.08] font-semibold text-[#251785]"
                    )}
                  >
                    <Icon className={cn("h-[20px] w-[20px]", active ? "text-[#251785]" : "text-[#111111]")} />
                    {item.name}
                  </Button>
                </Link>
              );
            })}

            {user ? (
              <>
                {isAuthenticated && !isAgent && (
                  <Link href="/become-agent" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="default" className="w-full justify-start gap-2" style={{ backgroundColor: PRIMARY }}>
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
                variant="ghost"
                className="w-full justify-start gap-2 text-[#111111]"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setLoginModalOpen(true);
                }}
              >
                <LoginNavIcon />
                ورود / ثبت نام
              </Button>
            )}
          </nav>
        )}
      </div>

      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
      <SubmitPropertyModal open={submitPropertyModalOpen} onOpenChange={setSubmitPropertyModalOpen} />
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
