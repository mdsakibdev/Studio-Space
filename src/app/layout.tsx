
import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/shared/Navbar";
import ThemeProvider from "@/components/shared/ThemeProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "StudioSpace | Creative Spaces, Endless Possibilities",
    template: "%s | StudioSpace",
  },
  description:
    "Discover and book premium creative studios, photography spaces, podcast rooms, music suites and production stages with StudioSpace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"
  suppressHydrationWarning
  data-scroll-behavior="smooth">
      <body>
        <ThemeProvider>
          <Navbar />

          <main className="min-h-screen">
            {children}
          </main>

          <Toaster
            position="bottom-right"
            richColors
            closeButton
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
