import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Buffer } from "buffer";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lazorkit Demo - Passkey-Powered Solana Wallet",
  description: "Experience Solana with passkey authentication. No seed phrases, no browser extensions, just your fingerprint or Face ID. Built with Lazorkit SDK.",
  keywords: ["Solana", "Lazorkit", "Passkey", "Web3", "Crypto Wallet", "Gasless Transactions"],
  authors: [{ name: "Lazorkit Team" }],
  openGraph: {
    title: "Lazorkit Demo - Passkey-Powered Solana Wallet",
    description: "Experience Solana with passkey authentication. No seed phrases required.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#6366f1",
};

// layout.tsx or providers.tsx
if (typeof window !== "undefined") {
  window.Buffer = window.Buffer || Buffer;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main> {children}</main>
        <Toaster />
      </body>
    </html>
  );
}
