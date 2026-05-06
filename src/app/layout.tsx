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
  title: "Bharat Election Portal — 18th Lok Sabha General Election 2029",
  description: "Official-grade Digital Voting Platform for Indian Parliamentary Elections. Exercise your fundamental right under Article 326. भारत निर्वाचन पोर्टल — मेरा वोट, मेरा अधिकार।",
  keywords: ["Election Commission of Bharat", "ECB", "Digital Voting India", "Lok Sabha 2029", "Aadhaar Voting", "Online Election Portal", "Voter ID Verification", "Mera Vote Mera Adhikaar", "E-Voting India"],
  authors: [{ name: "Election Commission of Bharat (Simulated)" }],
  openGraph: {
    title: "Bharat Election Portal — Lok Sabha 2029",
    description: "Secure, Aadhaar-verified digital voting simulation for the 18th Lok Sabha General Elections.",
    url: "https://e-vote-india.vercel.app", // Adjust if needed
    siteName: "ECB Digital Ballot",
    images: [
      {
        url: "https://iili.io/BZEErOb.png",
        width: 1200,
        height: 630,
        alt: "ECB Official Emblem",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bharat Election Portal — Digital Voting",
    description: "Cast your digital ballot securely for the 2029 General Elections.",
    images: ["https://iili.io/BZEErOb.png"],
  },
  icons: {
    icon: [
      { url: "https://iili.io/BZEErOb.png" },
      { url: "https://iili.io/BZEErOb.png", sizes: "32x32", type: "image/png" },
      { url: "https://iili.io/BZEErOb.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "https://iili.io/BZEErOb.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["https://iili.io/BZEErOb.png"],
  },
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
