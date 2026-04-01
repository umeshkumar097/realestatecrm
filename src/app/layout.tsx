import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RealEstateCRM - Scale Your Agency",
  description: "The AI-powered CRM for modern real estate agencies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${interFont.variable} h-full antialiased`}
    >
      <body className={`${interFont.className} min-h-full flex flex-col font-sans`}>
        <Providers>
          <GoogleAnalytics />
          {children}
        </Providers>
      </body>
    </html>
  );
}
