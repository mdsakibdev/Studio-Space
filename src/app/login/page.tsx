
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  Aperture,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle login form submission
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      // Backend authentication will be connected here.
      toast.info("Authentication service is not connected yet.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-76px)] bg-background px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">

        {/* Left Side - Welcome Content */}
        <div className="hidden lg:block">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Aperture size={27} />
            </div>

            <span className="text-2xl font-bold tracking-tight">
              StudioSpace
            </span>
          </div>

          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
            Welcome Back
          </p>

          <h1 className="max-w-lg text-4xl font-bold leading-tight xl:text-5xl">
            Your creative space is waiting for you.
          </h1>

          <p className="mt-6 max-w-lg text-base leading-8 text-muted-foreground">
            Sign in to discover inspiring studios, manage your bookings,
            and bring your creative ideas to life.
          </p>

          <div className="mt-10 flex items-center gap-3 text-sm text-muted-foreground">
            <div className="h-px w-12 bg-primary" />
            Create. Explore. Inspire.
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-9">

            <div className="mb-8 text-center lg:text-left">
              <div className="mb-5 flex justify-center lg:hidden">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Aperture size={27} />
                </div>
              </div>

              <h2 className="text-3xl font-bold tracking-tight">
                Welcome Back
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Enter your details to access your account.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium"
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-primary transition hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-12 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Please wait..." : "Sign In"}
                {!isLoading && <ArrowRight size={18} />}
              </button>
            </form>

            {/* Register Link */}
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-primary transition hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing, you agree to StudioSpace&apos;s Terms of Service
            and Privacy Policy.
          </p>
        </div>
      </div>
    </section>
  );
}
