"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import StudioLogo from "@/components/shared/StudioLogo";
import { useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

import {
  Menu,
  X,
  ArrowUpRight,
  Sun,
  Moon,
  UserRound,
  ChevronDown,
  PlusCircle,
  Building2,
  CalendarCheck,
  LogOut,
} from "lucide-react";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

// shadcn/ui DropdownMenu কম্পোনেন্টসমূহ
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// নেভিগেশন লিংকসমূহ
const navLinks = [
  { name: "Home", href: "/" },
  { name: "Explore Studios", href: "/studios" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "About Us", href: "/#about" },
];

// ইউজার ড্রপডাউন লিংকসমূহ
const userLinks = [
  {
    name: "Add New Studio",
    href: "/studios/new",
    icon: PlusCircle,
  },
  {
    name: "My Studio Listings",
    href: "/my-studios",
    icon: Building2,
  },
  {
    name: "My Bookings",
    href: "/my-bookings",
    icon: CalendarCheck,
  },
];

type NavbarUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

type UserAvatarProps = {
  user: NavbarUser;
  size?: "sm" | "md" | "lg";
};

// ইউজার অ্যাভাটার কম্পোনেন্ট
function UserAvatar({ user, size = "md" }: UserAvatarProps) {
  const sizeClass = {
    sm: "h-9 w-9",
    md: "h-10 w-10",
    lg: "h-11 w-11",
  };

  const initials =
    user.name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase() || "U";

  return (
    <Avatar className={`${sizeClass[size]} shrink-0 border border-border`}>
      <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
      <AvatarFallback className="bg-surface-hover text-sm font-semibold text-foreground">
        {user.name ? initials : <UserRound size={18} />}
      </AvatarFallback>
    </Avatar>
  );
}

// থিম হাইড্রেশন হেল্পারস
const subscribe = () => () => { };
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

interface ThemeToggleProps {
  isDark: boolean;
  mounted: boolean;
  onToggle: () => void;
}

// থিম টগল বাটন কম্পোনেন্ট
function ThemeToggle({ isDark, mounted, onToggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={!mounted}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50"
    >
      {!mounted ? (
        <Moon size={19} />
      ) : isDark ? (
        <Sun size={19} />
      ) : (
        <Moon size={19} />
      )}
    </button>
  );
}

// মূল নেভবার কম্পোনেন্ট
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  // বেটার অথ সেশন চেক
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );

  const isDark = resolvedTheme === "dark";

  // থিম পরিবর্তনের ফাংশন
  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  // কোন পেজে আছি তা চেক করার ফাংশন
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // বেটার অথ লগআউট হ্যান্ডলার
  const handleLogout = async () => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Logout failed.");
        return;
      }

      setMobileMenuOpen(false);
      toast.success("Logged out successfully.");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-xl">
      <nav className="mx-auto flex h-19 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">

        {/* লোগো */}
        <Link href="/" aria-label="StudioSpace Home">
          <StudioLogo />
        </Link>

        {/* ডেস্কটপ নেভিগেশন লিংকসমূহ (Modern Pill Style) */}
        <div className="hidden items-center gap-1 rounded-full border border-border/40 bg-card/40 p-1.5 backdrop-blur-md lg:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-300 ${active
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                  }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* ডেস্কটপ রাইট অ্যাকশন্স (থিম ও অ্যাথেন্টিকেশন) */}
        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle isDark={isDark} mounted={mounted} onToggle={toggleTheme} />

          {/* ইউজার লগইন করা না থাকলে */}
          {!isPending && !user && (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="group flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:opacity-90 hover:shadow-lg"
              >
                Get Started
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </>
          )}

          {/* ইউজার লগইন করা থাকলে shadcn DropdownMenu ব্যবহার */}
          {!isPending && user && (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-border p-1.5 pr-3 outline-none transition-colors hover:bg-surface-hover">
                <UserAvatar user={user} size="sm" />
                <ChevronDown size={16} className="text-muted-foreground" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-64 rounded-xl p-2 shadow-2xl">
                {/* ইউজার ইনফরমেশন */}
                <div className="flex items-center gap-3 px-3 py-3">
                  <UserAvatar user={user} size="lg" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>

                <DropdownMenuSeparator className="my-2" />

                {/* প্রোফাইল লিংকস */}
                {userLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <DropdownMenuItem key={link.name} className="p-0">
                      <Link
                        href={link.href}
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Icon size={18} />
                        {link.name}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}

                <DropdownMenuSeparator className="my-2" />

                {/* লগআউট বাটন */}
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-500"
                >
                  <LogOut size={18} />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* মোবাইল স্ক্রিন অ্যাকশন্স */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle isDark={isDark} mounted={mounted} onToggle={toggleTheme} />

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-surface-hover"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

      </nav>

      {/* মোবাইল নেভিগেশন মেনু */}
      <div
        className={`overflow-hidden border-t border-border bg-background transition-all duration-300 lg:hidden ${mobileMenuOpen
          ? "max-h-125 overflow-y-auto opacity-100"
          : "max-h-0 border-transparent opacity-0"
          }`}
      >
        <div className="space-y-1 px-5 py-5 sm:px-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors ${isActive(link.href)
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                }`}
            >
              {link.name}
              {isActive(link.href) && (
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </Link>
          ))}

          {/* মোবাইল অ্যাথেন্টিকেশন বাটন */}
          {!isPending && !user && (
            <div className="grid grid-cols-2 gap-3 border-t border-border pt-5">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg border border-border px-4 py-3 text-center text-sm font-medium text-foreground transition-colors hover:bg-surface-hover"
              >
                Log In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
              >
                Register
                <ArrowUpRight size={15} />
              </Link>
            </div>
          )}

          {/* মোবাইল ইউজার ইনফো ও লিংকস */}
          {!isPending && user && (
            <div className="mt-4 border-t border-border pt-4">
              <div className="flex items-center gap-3 px-3 py-3">
                <UserAvatar user={user} size="lg" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="mt-2 space-y-1">
                {userLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
                    >
                      <Icon size={18} />
                      {link.name}
                    </Link>
                  );
                })}
              </div>

              <div className="my-3 border-t border-border" />
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}