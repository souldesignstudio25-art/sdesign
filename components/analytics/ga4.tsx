'use client'

import { useEffect } from 'react'

// GA4 Configuration
// This component uses the global gtag.js function provided by Google Analytics.
// The Measurement ID is read from the environment variable NEXT_PUBLIC_GA_MEASUREMENT_ID.
// 
// Features:
// - Page view tracking with client-side navigation support
// - Custom events for project engagement
// - Custom events for contact/enquiries
// - No PII sent to Google Analytics
// - Skips admin routes to avoid tracking internal CMS traffic
// - Prevents duplicate event initialization

type GA4Props = {
  /** Optional custom parameters to send with every event */
  customParams?: Record<string, string | number>
}

// Global gtag type declaration (gtag.js is loaded dynamically)
declare global {
  interface Window {
    gtag?: (command: string, ...args: any[]) => void
  }
}

/**
 * Initialize gtag if not already initialized
 * GA4 uses a global gtag function that must be called after the script loads
 */
const initializeGtag = (measurementId: string): void => {
  if (window.gtag) return // Already initialized

  // gtag('config', measurementId) initializes the GA4 config
  // This must be called after the gtag.js script has loaded in the page
  // The script is typically loaded via next/head or dynamically
  try {
    window.gtag('config', measurementId, {
      send_page_view: true, // Send page views automatically
    })
  } catch (e) {
    console.warn('[GA4] Failed to initialize gtag config:', e)
  }
}

/**
 * Track a GA4 event with standard privacy-safe parameters
 * @param eventName - GA4 event name
 * @param parameters - Event parameters (PII will be stripped)
 */
const trackGtagEvent = (
  eventName: string,
  parameters: Record<string, unknown> = {}
): void => {
  if (!window.gtag) {
    // Queue the event if gtag isn't loaded yet; it will be sent on next call
    // We use a simple queue that gtag.js supports
    ;(window as any).ga4Queue = (window as any).ga4Queue || []
    ;(window as any).ga4Queue.push({ event: eventName, ...parameters })
    return
  }

  // Strip any potentially sensitive values
  const safeParams: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(parameters)) {
    // Only send safe, non-PII parameters
    if (
      value !== undefined &&
      value !== null &&
      typeof value !== 'object' &&
      !String(value).match(/^[\w\.\-@]*$/i) // basic sanitization
    ) {
      // Skip known PII fields
      const lowerKey = key.toLowerCase()
      if (
        !['email', 'phone', 'name', 'message', 'password'].includes(lowerKey)
      ) {
        safeParams[key] = value
      }
    } else if (typeof value === 'string') {
      // Sanitize string values - remove potentially sensitive content
      const sanitized = value.replace(/[<>]/g, '')
      safeParams[key] = sanitized
    }
  }

  try {
    window.gtag('event', eventName, safeParams)
  } catch (e) {
    console.warn('[GA4] Failed to track event:', eventName, e)
  }
}

// ============================================================
// GA4 Component
// ============================================================

export function useGA4({
  customParams,
}: GA4Props = {}) {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  if (!measurementId) {
    console.warn('[GA4] NEXT_PUBLIC_GA_MEASUREMENT_ID not configured')
    return
  }

  // Initialize gtag on mount (only once)
  useEffect(() => {
    initializeGtag(measurementId)
  }, [measurementId])

  // Track page view on every render
  // This ensures client-side navigation page views are tracked
  // Skip admin routes to avoid tracking internal CMS traffic as public page views
  useEffect(() => {
    if (!measurementId) return

    const isAdminRoute = window.location.pathname.startsWith('/admin')
    if (isAdminRoute) return // Don't track admin routes as public page views

    const handleTitleChange = () => {
      try {
        // Track page view for client-side navigation
        // We use gtag('event', 'page_view') rather than gtag('config', ...)
        // to ensure each navigation is tracked individually
        const pagePath = window.location.pathname + window.location.search
        const pageReferrer = document.referrer

        const params: Record<string, unknown> = {
          page_path: pagePath,
          page_title: document.title,
          page_hostname: window.location.hostname,
        }

        // Add custom params if provided
        if (customParams) {
          for (const [key, value] of Object.entries(customParams)) {
            params[`custom_${key}`] = value
          }
        }

        trackGtagEvent('page_view', params)
      } catch (e) {
        console.warn('[GA4] Page view tracking error:', e)
      }
    }

    // Track initial page view on mount (only if not on admin route)
    if (!isAdminRoute) {
      handleTitleChange()
    }

    // Listen for popstate events (client-side navigation in Next.js)
    const onPopState = (e: PopStateEvent) => {
      // Skip admin route tracking
      if (window.location.pathname.startsWith('/admin')) return
      handleTitleChange()
    }

    window.addEventListener('popstate', onPopState)

    // Also listen for Next.js navigations via document interaction
    // Next.js automatically handles client-side navigation, but we ensure
    // page_view is tracked on anchor clicks and form submissions
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement
      if (target.href && target.hostname === window.location.hostname) {
        // Small delay to allow navigation to complete before next page_view
        setTimeout(() => {
          // Skip if navigating to admin route
          if (target.pathname.startsWith('/admin')) return
          handleTitleChange()
        }, 100)
      }
    }

    document.addEventListener('click', handleLinkClick, true)

    // Cleanup
    return () => {
      window.removeEventListener('popstate', onPopState)
      document.removeEventListener('click', handleLinkClick, true)
    }
  }, [measurementId, customParams])

  // Helper function to track custom events
  const trackEvent = (
    eventName: string,
    parameters: Record<string, unknown> = {}
  ) => {
    // Add project context if parameters contain slug
    const enhancedParams = {
      ...parameters,
      page_path: window.location.pathname,
      page_title: document.title,
      page_hostname: window.location.hostname,
    }

    // Add custom params
    if (customParams) {
      for (const [key, value] of Object.entries(customParams)) {
        enhancedParams[`custom_${key}`] = value
      }
    }

    trackGtagEvent(eventName, enhancedParams)
  }

  return { trackEvent }
}

/**
 * Pre-built custom event trackers for S_DE_SIGN
 * These can be used directly in components
 */

// Project engagement events
export const trackProjectView = (slug: string, projectName: string) => {
  if (!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) return
  trackGtagEvent('project_view', {
    project_slug: slug,
    project_name: projectName,
    page_path: window.location.pathname,
  })
}

export const trackProjectLike = (slug: string, projectName: string) => {
  if (!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) return
  trackGtagEvent('project_like', {
    project_slug: slug,
    project_name: projectName,
    page_path: window.location.pathname,
  })
}

export const trackProjectUnlike = (slug: string, projectName: string) => {
  if (!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) return
  trackGtagEvent('project_unlike', {
    project_slug: slug,
    project_name: projectName,
    page_path: window.location.pathname,
  })
}

// Contact and enquiry events
export const trackEnquirySubmit = () => {
  if (!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) return
  trackGtagEvent('enquiry_submit', {
    page_path: window.location.pathname,
  })
}

export const trackWhatsappClick = () => {
  if (!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) return
  trackGtagEvent('whatsapp_click', {
    page_path: window.location.pathname,
  })
}

export const trackEmailClick = () => {
  if (!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) return
  trackGtagEvent('email_click', {
    page_path: window.location.pathname,
  })
}

export const trackContactClick = () => {
  if (!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) return
  trackGtagEvent('contact_click', {
    page_path: window.location.pathname,
  })
}

// Default export: hook for use in components
export default function GA4Provider({
  children,
  customParams,
}: {
  children: React.ReactNode
  customParams?: Record<string, string | number>
}) {
  const { trackEvent } = useGA4({ customParams })

  return <>{children}</>
}