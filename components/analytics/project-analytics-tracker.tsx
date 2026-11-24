'use client'

import { useEffect } from 'react'
import { trackProjectView } from '@/lib/analytics/ga4'

interface ProjectAnalyticsTrackerProps {
  slug: string
  name: string
}

export function ProjectAnalyticsTracker({ slug, name }: ProjectAnalyticsTrackerProps) {
  useEffect(() => {
    if (!slug) return
    trackProjectView(slug, name)
  }, [slug, name])

  return null
}
