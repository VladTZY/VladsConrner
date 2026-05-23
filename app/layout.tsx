import type { Metadata } from "next";
import { Outfit, Space_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-space-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "vscorner | reviews",
  description: "movies, tv, books, and music.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${spaceMono.variable} antialiased bg-[#faf9f6] dark:bg-[#1c1917] text-[#1c1917] dark:text-[#faf9f6] selection:bg-stone-300 dark:selection:bg-stone-700 selection:text-black dark:selection:text-white`}
      >
        <ThemeProvider>
          <div className="min-h-screen flex flex-col max-w-3xl mx-auto px-6 py-12 md:py-20">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
