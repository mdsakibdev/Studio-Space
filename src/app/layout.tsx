
import type { Metadata } from "next";
import "./globals.css";

import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

import Navbar from "@/components/shared/Navbar";
import ThemeProvider from "@/components/shared/ThemeProvider";
import { Toaster } from "sonner";
import Footer from "@/components/shared/Footer";

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
      <body className={`${poppins.variable} font-sans`}>
        <ThemeProvider>
          <Navbar />

          <main className="min-h-screen">
            {children}
          </main>

          <Footer/>

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
