import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "./context/WalletContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NovaEvents — Transparent Event Management on Stellar",
  description:
    "Every sponsorship, ticket sale, and payout on-chain. Auditable and open to anyone.",
  openGraph: {
    title: "NovaEvents — Transparent Event Management on Stellar",
    description:
      "Every sponsorship, ticket sale, and payout on-chain. Auditable and open to anyone.",
    url: "https://novaevents.xyz",
    siteName: "NovaEvents",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NovaEvents — Transparent Event Management on Stellar",
    description:
      "Every sponsorship, ticket sale, and payout on-chain. Auditable and open to anyone.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
