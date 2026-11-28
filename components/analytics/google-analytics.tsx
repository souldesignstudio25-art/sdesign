'use client'

import React, { Suspense, useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { GTM_CONTAINER_ID, trackPageView } from '@/lib/analytics/ga4'

function GTMRouteTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const lastTrackedUrl = useRef<string | null>(null)

  useEffect(() => {
    if (!pathname) return

    // Do not track admin routes as public website page views
    if (pathname.startsWith('/admin')) return

    const search = searchParams?.toString()
    const url = search ? `${pathname}?${search}` : pathname

    // Prevent duplicate page_view events on client-side navigation
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

export function GoogleTagManager() {
  if (!GTM_CONTAINER_ID) return null

  return (
    <>
      <Script
        id="google-tag-manager"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');`,
        }}
      />
      <Suspense fallback={null}>
        <GTMRouteTracker />
      </Suspense>
    </>
  )
}

/**
 * Fallback noscript iframe for users with JavaScript disabled.
 * Placed immediately after the opening <body> tag.
 */
export function GoogleTagManagerNoscript() {
  if (!GTM_CONTAINER_ID) return null

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  )
}

// Backwards-compatible alias for existing layout references
export const GoogleAnalytics = GoogleTagManager
