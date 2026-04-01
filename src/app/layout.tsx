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
  title: "RealEstateCRM AI | Best Property Management Software 2026",
  description: "Scale your agency with the world's leading AI-powered Real Estate CRM. Automate leads, manage EMIs, and close deals faster with our secure, multi-tenant property management platform.",
  keywords: ["Real Estate CRM", "AI Property Management", "Best CRM for Real Estate Agents", "Real Estate Automation", "Property Lead Management", "SaaS CRM India"],
  authors: [{ name: "Aiclex Technologies" }],
  creator: "Umesh Kumar / Aiclex",
  openGraph: {
    title: "RealEstateCRM AI - Scaling Modern Real Estate Agencies",
    description: "The all-in-one AI platform for property management, leads, and automated financial tracking.",
    url: "https://propgocrm.com",
    siteName: "RealEstateCRM",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RealEstateCRM AI | Scale Your Agency",
    description: "Automate your real estate business with the most advanced AI-powered CRM.",
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
