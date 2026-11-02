
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  
  User,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  Image as ImageIcon,
  ArrowRight,
  Globe,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import StudioLogo from "@/components/shared/StudioLogo";


export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, ] = useState(false);

  // Check password requirements
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const router = useRouter();

  // Handle registration form submission
  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // Check required fields
  if (!name.trim() || !email.trim() || !password || !confirmPassword) {
    toast.error("Please fill in all required fields.");
    return;
  }

  // Check email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    toast.error("Please enter a valid email address.");
    return;
  }

  // Check password
  if (!hasMinLength || !hasUppercase || !hasLowercase) {
    toast.error("Please create a stronger password.");
    return;
  }

  // Check confirm password
  if (password !== confirmPassword) {
    toast.error("Passwords do not match.");
    return;
  }

  // Check photo URL
  if (photoURL.trim()) {
    try {
      const imageURL = new URL(photoURL);

      if (!["http:", "https:"].includes(imageURL.protocol)) {
        toast.error("Please enter a valid photo URL.");
        return;
      }
    } catch {
      toast.error("Please enter a valid photo URL.");
      return;
    }
  }

  const formData = new FormData(e.currentTarget);
  const user = Object.fromEntries(formData.entries());
  console.log("Registering user:", user);

  try {
    // Send registration data to Better Auth
    const { data, error } = await authClient.signUp.email({
      name: name.trim(),
      email: email.trim(),
      password,
      image: photoURL.trim() || undefined,
    });

    if (error) {
      toast.error(error.message || "Registration failed.");
      return;
    }

    if (data) {
      toast.success("Account created successfully!");
      router.push("/");
    }
  } catch (error) {
    console.error("Registration error:", error);
    toast.error("Something went wrong. Please try again.");
  }
};

const handleGoogleSignUp = async () =>{
   const data = await authClient.signIn.social({
    provider: "google",
  });

  console.log(data)
}

  return (
    <section className="min-h-[calc(100vh-76px)] bg-background px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">

        {/* Left Side - Welcome Content */}
        <div className="hidden lg:block">
          <div className="mb-6 flex items-center gap-3">
            <StudioLogo/>
          </div>

          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
            Join Our Community
          </p>

          <h1 className="max-w-lg text-4xl font-bold leading-tight xl:text-5xl">
            Find your space. Create something extraordinary.
          </h1>

          <p className="mt-6 max-w-lg text-base leading-8 text-muted-foreground">
            Create your StudioSpace account and discover inspiring creative
            spaces. Connect with studio owners and bring your ideas to life.
          </p>

          <div className="mt-10 flex items-center gap-3 text-sm text-muted-foreground">
            <div className="h-px w-12 bg-primary" />
            Create. Explore. Inspire.
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8">

            <div className="mb-7 text-center lg:text-left">
              <div className="mb-5 flex justify-center lg:hidden">
                <StudioLogo/>
              </div>

              <h2 className="text-3xl font-bold tracking-tight">
                Create Account
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Fill in your details to get started.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">

              {/* Full Name */}
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className="h-11 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium">
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
                    className="h-11 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
              </div>

              {/* Photo URL */}
              <div>
                <label htmlFor="photoURL" className="mb-2 block text-sm font-medium">
                  Profile Photo URL
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    (Optional)
                  </span>
                </label>

                <div className="relative">
                  <ImageIcon
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />

                  <input
                    id="photoURL"
                    type="url"
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="h-11 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium">
                  Password
                </label>

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
                    placeholder="Create a password"
                    autoComplete="new-password"
                    className="h-11 w-full rounded-xl border border-border bg-background pl-11 pr-12 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password Requirements */}
                <div className="mt-3 grid grid-cols-1 gap-1.5 text-xs sm:grid-cols-2">
                  <p className={hasMinLength ? "text-green-500" : "text-muted-foreground"}>
                    {hasMinLength ? "✓" : "○"} At least 6 characters
                  </p>

                  <p className={hasUppercase ? "text-green-500" : "text-muted-foreground"}>
                    {hasUppercase ? "✓" : "○"} One uppercase letter
                  </p>

                  <p className={hasLowercase ? "text-green-500" : "text-muted-foreground"}>
                    {hasLowercase ? "✓" : "○"} One lowercase letter
                  </p>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium">
                  Confirm Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />

                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    className="h-11 w-full rounded-xl border border-border bg-background pl-11 pr-12 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {confirmPassword && (
                  <p className={`mt-2 text-xs ${
                    password === confirmPassword ? "text-green-500" : "text-red-500"
                  }`}>
                    {password === confirmPassword
                      ? "Passwords match"
                      : "Passwords do not match"}
                  </p>
                )}
              </div>

              {/* Create Account */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Please wait..." : "Create Account"}
                {!isLoading && <ArrowRight size={18} />}
              </button>
            </form>

            {/* Google Signup - Coming Later */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-border bg-background text-sm font-medium text-foreground transition hover:bg-surface-hover"
            >
              <Globe size={18} />
              Continue with Google
            </button>

            {/* Login Link */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary transition hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            By creating an account, you agree to our Terms of Service
            and Privacy Policy.
          </p>
        </div>
      </div>
    </section>
  );
}
