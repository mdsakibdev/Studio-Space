interface StudioLogoProps {
  className?: string;
  iconOnly?: boolean;
}

export default function StudioLogo({
  className = "",
  iconOnly = false,
}: StudioLogoProps) {
  return (
    <div
      className={`group inline-flex items-center gap-3 select-none transition-all duration-300 ${className}`}
    >
      {/* ১. ইউনিক স্টুডিও/ক্যামেরা লেন্স কাস্টম SVG আইকন */}
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-neutral-900 via-neutral-800 to-black p-2.5 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30 transition-all duration-300 group-hover:scale-105 group-hover:ring-amber-500/60 dark:bg-card dark:ring-border">
        {/* ব্যাকগ্রাউন্ড গোল্ডেন গ্লো */}
        <div className="absolute inset-0 rounded-2xl bg-amber-500/10 blur-md transition-all duration-300 group-hover:bg-amber-500/25 group-hover:blur-lg" />
        
        {/* ইউনিক ক্যামেরা/স্টুডিও লেন্স SVG */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative h-6 w-6 text-amber-500 transition-transform duration-300 group-hover:rotate-12"
        >
          {/* বাইরের রিং / লেন্স বডি */}
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
          {/* ভেতরের অ্যাপারচার / লেন্স সার্কেল */}
          <circle cx="12" cy="13" r="4" />
          {/* প্লে / ক্রিয়েটিভ ফোকাস ডট */}
          <path d="M12 11v4" strokeWidth="2.5" className="text-amber-400" />
        </svg>
      </div>

      {/* ২. ডান পাশে ব্র্যান্ড নেম ও ট্যাগলাইন */}
      {!iconOnly && (
        <div className="flex flex-col">
          {/* StudioSpace Brand Name */}
          <div className="flex items-center text-xl font-extrabold tracking-tight sm:text-2xl">
            <span className="text-foreground transition-colors duration-200">
              Studio
            </span>
            <span className="bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent transition-all duration-300 group-hover:brightness-110">
              Space
            </span>
          </div>

          {/* Micro Tagline */}
          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
            <span>Find</span>
            <span className="h-1 w-1 rounded-full bg-amber-500" />
            <span>Book</span>
            <span className="h-1 w-1 rounded-full bg-amber-500" />
            <span>Create</span>
          </div>
        </div>
      )}
    </div>
  );
}