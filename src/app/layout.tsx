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
  title: "RealEstateCRM AI | #1 Global Property Management & Sales Hub 2026",
  description: "Accelerate your agency with the world's most advanced AI-powered Real Estate CRM. Dominate markets in Dubai, London, NYC, and Mumbai with automated lead pipelines, global portal sync, and integrated WhatsApp CRM.",
  keywords: [
    "Real Estate CRM", 
    "AI Property Management", 
    "Best CRM for Real Estate Agents", 
    "Dubai Real Estate CRM", 
    "London Property Software", 
    "Prop-Tech AI", 
    "Real Estate Sales Automation", 
    "Property Lead Management", 
    "Global Real Estate Dashboard", 
    "Enterprise Property CRM"
  ],
  authors: [{ name: "Aiclex Technologies" }],
  creator: "Aiclex - Global PropTech Elite",
  openGraph: {
    title: "RealEstateCRM AI - Global Hub for Modern Real Estate Dominance",
    description: "The all-in-one AI platform for elite property management, lead acceleration, and global market sync.",
    url: "https://propgocrm.com",
    siteName: "PropGOCrm AI",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PropGOCrm AI | Dominate Your Local Market Globally",
    description: "Automate your real estate powerhouse with the most advanced AI-powered CRM on the market.",
  },
  alternates: {
    canonical: "https://propgocrm.com",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  }
};

// Vercel Re-trigger: Force build for business branding
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
