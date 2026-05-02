import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Meteors from "@/components/magicui/meteors";
import RetroGrid from "@/components/magicui/retro-grid";
import LayoutWrapper from "@/components/LayoutWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bharat Election Portal — Lok Sabha 2029",
  description: "Digital Voting Platform for Indian Parliamentary Elections | भारत निर्वाचन पोर्टल",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LayoutWrapper>
            {children}
          </LayoutWrapper>

        </ThemeProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
