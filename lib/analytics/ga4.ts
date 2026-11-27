// GA4 Analytics Client Utility for SYLEN DESIGNS
// Handles GA4 initialization, page view tracking, and custom engagement events.
// Ensures strict privacy by stripping all personally identifiable information (PII).

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-6FLZ8FXZC0'

declare global {
  interface Window {
    dataLayer?: any[]
    gtag?: (...args: any[]) => void
  }
}

/**
 * Strips any potential PII keys and sanitizes string values
 */
function sanitizeEventParams(params: Record<string, unknown> = {}): Record<string, unknown> {
  const safe: Record<string, unknown> = {}
  const prohibitedKeys = [
    'email',
    'mail',
    'phone',
    'telephone',
    'mobile',
    'name',
    'fullname',
    'first_name',
    'last_name',
    'message',
    'body',
    'password',
    'secret',
    'token',
    'visitor_id',
    'visitorid',
  ]

  for (const [key, value] of Object.entries(params)) {
    const lowerKey = key.toLowerCase()
    // Skip disallowed PII fields
    if (prohibitedKeys.includes(lowerKey)) {
      continue
    }

    if (typeof value === 'string') {
      // Discard values that look like email addresses or phone numbers
      if (value.includes('@') && value.includes('.')) continue
      if (/^\+?[0-9\s\-()]{7,20}$/.test(value)) continue
      safe[key] = value.replace(/[<>]/g, '').slice(0, 200)
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      safe[key] = value
    }
  }

  return safe
}

/**
 * Dispatch an event to Google Analytics via gtag
 */
export function sendGAEvent(eventName: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return

  const safeParams = sanitizeEventParams(params)

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, safeParams)
  } else {
    // Queue event if gtag has not finished loading yet
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: eventName,
      ...safeParams,
    })
  }
}

// ============================================================
// Standard Page View Tracking
// ============================================================

export interface PageViewParams {
  page_path: string
  page_title?: string
  page_location?: string
}

export function trackPageView({ page_path, page_title, page_location }: PageViewParams) {
  if (typeof window === 'undefined') return
  sendGAEvent('page_view', {
    page_path,
    page_title: page_title || (typeof document !== 'undefined' ? document.title : ''),
    page_location: page_location || (typeof window !== 'undefined' ? window.location.href : ''),
  })
}

// ============================================================
// Custom SYLEN DESIGNS Events
// ============================================================

/**
 * project_view: When a visitor opens an individual project details page.
 */
export function trackProjectView(projectSlug: string, projectName: string) {
  sendGAEvent('project_view', {
    project_slug: projectSlug,
    project_name: projectName,
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
  })
}

/**
 * project_like: When a visitor successfully likes a project.
 */
export function trackProjectLike(projectSlug: string, projectName: string) {
  sendGAEvent('project_like', {
    project_slug: projectSlug,
    project_name: projectName,
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
  })
}

/**
 * project_unlike: When a visitor removes a like.
 */
export function trackProjectUnlike(projectSlug: string, projectName: string) {
  sendGAEvent('project_unlike', {
    project_slug: projectSlug,
    project_name: projectName,
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
  })
}

/**
 * enquiry_submit: When a contact enquiry is successfully submitted.
 * Notice: Zero PII is sent. Only non-personal metadata like project category/type.
 */
export function trackEnquirySubmit(projectType?: string) {
  sendGAEvent('enquiry_submit', {
    project_type: projectType || 'General Inquiry',
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
  })
}

/**
 * whatsapp_click: When a visitor clicks the WhatsApp contact link.
 */
export function trackWhatsAppClick(source: string = 'contact_bot') {
  sendGAEvent('whatsapp_click', {
    source,
    link_type: 'whatsapp',
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
  })
}

/**
 * email_click: When a visitor clicks an email contact link.
 */
export function trackEmailClick(source: string = 'contact_bot') {
  sendGAEvent('email_click', {
    source,
    link_type: 'mailto',
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
  })
}

/**
 * contact_click: When a visitor interacts with the contact section or contact buttons.
 */
export function trackContactClick(action: string = 'open_contact', source: string = 'general') {
  sendGAEvent('contact_click', {
    action,
    source,
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
  })
}
