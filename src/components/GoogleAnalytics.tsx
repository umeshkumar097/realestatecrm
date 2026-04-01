"use client"
import { useSession } from "next-auth/react"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, Suspense } from "react"
import Script from "next/script"

function GoogleAnalyticsContent() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // 1. Exclude Super Admin from tracking
  const isSuperAdmin = session?.user && (session.user as any).role === "SUPER_ADMIN"

  // 2. Track Page Views on Change
  useEffect(() => {
    if (isSuperAdmin) return;
    
    if (window.gtag) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "")
      window.gtag('config', 'G-QFEW61BYVH', {
        page_path: url,
      })
    }
  }, [pathname, searchParams, isSuperAdmin])

  if (isSuperAdmin) {
    return null
  }

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
          gtag('config', 'G-QFEW61BYVH', {
            send_page_view: false // Manual tracking handled by useEffect
          });
        `}
      </Script>
    </>
  )
}

export default function GoogleAnalytics() {
    return (
        <Suspense fallback={null}>
            <GoogleAnalyticsContent />
        </Suspense>
    )
}

declare global {
  interface Window {
    gtag: any;
    dataLayer: any[];
  }
}
