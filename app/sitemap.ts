import type { MetadataRoute } from 'next'
import { getPublicSiteData } from '@/lib/cms/queries'
import { getAllServices } from '@/lib/cms/services-data'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const BASE_URL = 'https://sylendesign.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteData = await getPublicSiteData()

  // 1. Core Public Static Pages
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/work`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  // 2. Dedicated Architectural Service Pages
  const services = getAllServices()
  for (const service of services) {
    routes.push({
      url: `${BASE_URL}/services/${service.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.85,
    })
  }

  // 3. Published Project Detail Pages
  const projects = siteData?.projects || []
  const seenSlugs = new Set<string>()

  for (const project of projects) {
    if (!project || project.status !== 'published') continue

    const slug = typeof project.slug === 'string' ? project.slug.trim() : ''
    if (!slug || seenSlugs.has(slug)) continue
    seenSlugs.add(slug)

    let lastModified = new Date()
    if (project.updatedAt) {
      const parsed = new Date(project.updatedAt)
      if (!isNaN(parsed.getTime())) {
        lastModified = parsed
      }
    }

    const images: string[] = []
    if (project.mainImage && typeof project.mainImage === 'string' && project.mainImage.trim()) {
      images.push(project.mainImage.trim())
    }

    routes.push({
      url: `${BASE_URL}/work/${slug}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
      ...(images.length > 0 ? { images } : {}),
    })
  }

  return routes
}
