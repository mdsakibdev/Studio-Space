
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  useState,
  useSyncExternalStore,
  useEffect,
  useRef,
} from "react";
import { useTheme } from "next-themes";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

import {
  Aperture,
  Menu,
  X,
  ArrowUpRight,
  Sun,
  Moon,
  UserRound,
  ChevronDown,
  LayoutDashboard,
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

// --------------------------------------
// Navigation Links
// --------------------------------------

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Explore Studios", href: "/studios" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "About Us", href: "/#about" },
];

const userLinks = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
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

// --------------------------------------
// Types
// --------------------------------------

type NavbarUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

type UserAvatarProps = {
  user: NavbarUser;
  size?: "sm" | "md" | "lg";
};

// --------------------------------------
// Avatar Component
// --------------------------------------

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
    <Avatar
      className={`${sizeClass[size]} shrink-0 border border-border`}
    >
      <AvatarImage
        src={user.image || undefined}
        alt={user.name || "User"}
      />

      <AvatarFallback className="bg-surface-hover text-sm font-semibold text-foreground">
        {user.name ? initials : <UserRound size={18} />}
      </AvatarFallback>
    </Avatar>
  );
}

// --------------------------------------
// Profile Links Component
// --------------------------------------

function ProfileLinks({
  onNavigate,
}: {
  onNavigate: () => void;
}) {
  return (
    <>
      {userLinks.map((link) => {
        const Icon = link.icon;

        return (
          <Link
            key={link.name}
            href={link.href}
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
          >
            <Icon size={18} />
            {link.name}
          </Link>
        );
      })}
    </>
  );
}

// --------------------------------------
// Logout Button Component
// --------------------------------------

function LogoutButton({
  onLogout,
}: {
  onLogout: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onLogout}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10"
    >
      <LogOut size={18} />
      Logout
    </button>
  );
}

// --------------------------------------
// Hydration Helpers
// --------------------------------------

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function ThemeToggle({
  isDark,
  mounted,
  onToggle,
}: {
  isDark: boolean;
  mounted: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={!mounted}
      aria-label="Toggle theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-surface-hover disabled:opacity-50"
    >
      {mounted && isDark ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
}

// --------------------------------------
// Main Navbar
// --------------------------------------

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { resolvedTheme, setTheme } = useTheme();

  // Better Auth session
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);

  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );

  const isDark = resolvedTheme === "dark";

  // --------------------------------------
  // Close profile dropdown on outside click
  // --------------------------------------

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --------------------------------------
  // Theme Toggle
  // --------------------------------------

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  // --------------------------------------
  // Active Navigation
  // --------------------------------------

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";

    if (href.startsWith("/#")) return false;

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // --------------------------------------
  // Close Menus
  // --------------------------------------

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  };

  // --------------------------------------
  // Better Auth Logout
  // --------------------------------------

  const handleLogout = async () => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Logout failed.");
        return;
      }

      closeMenus();

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
      <nav className="mx-auto flex h-19 max-w-360 items-center justify-between px-5 sm:px-8 lg:px-12">

        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenus}
          className="group flex shrink-0 items-center gap-3"
          aria-label="StudioSpace Home"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform duration-300 group-hover:rotate-12">
            <Aperture size={27} strokeWidth={2.2} />
          </div>

          <div className="flex flex-col">
            <span className="text-[21px] font-bold tracking-tight text-foreground">
              Studio<span className="text-primary">Space</span>
            </span>

            <span className="text-[9px] font-medium uppercase tracking-[3px] text-muted-foreground">
              Create Beyond Limits
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`relative py-2 text-[13px] font-medium transition-colors duration-200 ${
                isActive(link.href)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.name}

              {isActive(link.href) && (
                <span className="absolute -bottom-0.75 left-0 h-0.5 w-full rounded-full bg-primary" />
              )}
            </Link>
          ))}
        </div>

        {/* Desktop Right Actions */}
        <div className="hidden items-center gap-3 lg:flex">

          <ThemeToggle isDark={isDark} mounted={mounted} onToggle={toggleTheme} />

          {/* Authentication */}
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

          {/* Logged In User */}
          {!isPending && user && (
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 rounded-full border border-border p-1.5 pr-3 transition-colors hover:bg-surface-hover"
                aria-label="Open profile menu"
                aria-expanded={profileMenuOpen}
              >
                <UserAvatar user={user} size="sm" />

                <ChevronDown
                  size={16}
                  className={`text-muted-foreground transition-transform ${
                    profileMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {profileMenuOpen && (
                <div className="absolute right-0 top-full mt-3 w-64 rounded-xl border border-border bg-background p-2 shadow-2xl">
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

                  <div className="my-2 border-t border-border" />

                  <ProfileLinks onNavigate={closeMenus} />

                  <div className="my-2 border-t border-border" />

                  <LogoutButton onLogout={handleLogout} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 lg:hidden">

          <ThemeToggle isDark={isDark} mounted={mounted} onToggle={toggleTheme} />

          {/* Mobile Profile Avatar */}
          {!isPending && user && (
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Open profile menu"
              className="rounded-full"
            >
              <UserAvatar user={user} size="sm" />
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-surface-hover"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div
        className={`overflow-hidden border-t border-border bg-background transition-all duration-300 lg:hidden ${
          mobileMenuOpen
            ? "max-h-175 overflow-y-auto opacity-100"
            : "max-h-0 border-transparent opacity-0"
        }`}
      >
        <div className="space-y-1 px-5 py-5 sm:px-8">

          {/* Main Navigation Links */}
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={closeMenus}
              className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive(link.href)
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

          {/* Mobile Authentication */}
          {!isPending && !user && (
            <div className="grid grid-cols-2 gap-3 border-t border-border pt-5">
              <Link
                href="/login"
                onClick={closeMenus}
                className="rounded-lg border border-border px-4 py-3 text-center text-sm font-medium text-foreground transition-colors hover:bg-surface-hover"
              >
                Log In
              </Link>

              <Link
                href="/register"
                onClick={closeMenus}
                className="flex items-center justify-center gap-1 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
              >
                Get Started
                <ArrowUpRight size={15} />
              </Link>
            </div>
          )}

          {/* Mobile Logged In User */}
          {!isPending && user && (
            <div className="mt-4 border-t border-border pt-4">

              {/* User Information */}
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

              {/* User Menu Links */}
              <div className="mt-2 space-y-1">
                <ProfileLinks onNavigate={closeMenus} />
              </div>

              <div className="my-3 border-t border-border" />

              <LogoutButton onLogout={handleLogout} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
