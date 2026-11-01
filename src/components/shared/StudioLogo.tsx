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
      className={`group inline-flex cursor-pointer select-none flex-col transition-all duration-300 ${className}`}
    >
      {iconOnly ? (
        /* Standalone Icon */
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-md transition-all duration-300 group-hover:bg-amber-500/40" />
          <svg viewBox="0 0 48 48" className="relative h-9 w-9 transform transition-transform duration-300 group-hover:scale-105">
            <defs>
              <linearGradient id="studio-gold-icon" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FCD34D" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="url(#studio-gold-icon)"
              strokeWidth="3.5"
              className="drop-shadow-sm"
            />
            <path
              d="M19 15L33 24L19 33V15Z"
              fill="url(#studio-gold-icon)"
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </svg>
        </div>
      ) : (
        /* Full Logo with Brand & Tagline */
        <>
          <div className="flex items-center whitespace-nowrap leading-none">
            {/* "Studi" part */}
            <span className="text-[26px] font-black tracking-tight text-neutral-900 transition-colors duration-200 dark:text-white sm:text-[30px] lg:text-[32px]">
              Studi
            </span>

            {/* Custom Interactive "o" with Play Icon */}
            <span className="relative mx-[0.5px] inline-flex items-center justify-center">
              <span className="text-[26px] font-black tracking-tight text-neutral-900 transition-colors duration-200 dark:text-white sm:text-[30px] lg:text-[32px]">
                o
              </span>
              <svg
                viewBox="0 0 24 24"
                className="absolute h-[32%] w-[32%] transform transition-transform duration-300 group-hover:scale-125"
                aria-hidden="true"
              >
                <path
                  d="M7 4L19 12L7 20V4Z"
                  className="fill-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                />
              </svg>
            </span>

            {/* "Space" Gradient Text */}
            <span className="ml-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-[26px] font-black tracking-tight text-transparent transition-all duration-300 group-hover:brightness-110 sm:text-[30px] lg:text-[32px]">
              Space
            </span>
          </div>

          {/* Micro Tagline */}
          <div className="mt-1 flex items-center justify-between px-0.5 text-[8px] font-bold uppercase tracking-[0.3em] transition-colors duration-200 sm:text-[9px]">
            <span className="text-neutral-500 dark:text-neutral-400">
              Find
            </span>
            <span className="h-1 w-1 rounded-full bg-amber-500/80" />
            <span className="text-neutral-500 dark:text-neutral-400">
              Book
            </span>
            <span className="h-1 w-1 rounded-full bg-amber-500/80" />
            <span className="text-neutral-500 dark:text-neutral-400">
              Create
            </span>
          </div>
        </>
      )}
    </div>
  );
}