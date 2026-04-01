"use client"
import { useSession } from "next-auth/react"
import Script from "next/script"

export default function GoogleAnalytics() {
  const { data: session } = useSession()
  
  // 1. Exclude Super Admin from tracking
  if (session?.user && (session.user as any).role === "SUPER_ADMIN") {
    console.log("[GA] Tracking disabled for Super Admin session.");
    return null
  }

  // 2. Track everyone else (including non-logged in users)
  return (
    <>
      <Script 
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-QFEW61BYVH" 
      />
      <Script 
        id="google-analytics"
        strategy="afterInteractive"
      >
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-QFEW61BYVH');
        `}
      </Script>
    </>
  )
}
