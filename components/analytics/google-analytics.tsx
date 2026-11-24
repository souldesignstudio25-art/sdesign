'use client'

import React, { Suspense, useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { GA_MEASUREMENT_ID, trackPageView } from '@/lib/analytics/ga4'

function GA4RouteTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const lastTrackedUrl = useRef<string | null>(null)

  useEffect(() => {
    if (!pathname) return

    // Requirement 5: Do not track admin routes as public website page views
    if (pathname.startsWith('/admin')) return

    const search = searchParams?.toString()
    const url = search ? `${pathname}?${search}` : pathname

    // Requirement 2: Prevent duplicate page_view events on client-side navigation
    if (lastTrackedUrl.current === url) return
    lastTrackedUrl.current = url

    trackPageView({
      page_path: url,
      page_title: document.title,
      page_location: window.location.href,
    })
  }, [pathname, searchParams])

  return null
}

export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              send_page_view: false,
              anonymize_ip: true
            });
          `,
        }}
      />
      <Suspense fallback={null}>
        <GA4RouteTracker />
      </Suspense>
    </>
  )
}
