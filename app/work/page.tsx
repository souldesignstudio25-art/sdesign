import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SiteHeaderNav } from '@/components/site-header-nav'
import { BrandLogo } from '@/components/brand-logo'
import { StaggeredHeading } from '@/components/motion/staggered-heading'
import { WorkGalleryView } from '@/components/work-gallery-view'
import { ContactCtaLink } from '@/components/contact-cta-link'
import { getPublicSiteData } from '@/lib/cms/queries'
import type { Project } from '@/lib/projects'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const siteData = await getPublicSiteData()
  const studioName = siteData.settings.studioName || 'S_DE_SIGN'
  const title = `Architecture Portfolio & Selected Works — ${studioName}`
  const description =
    'Explore selected architectural case studies by S_DE_SIGN: modern luxury villas, contemporary private residences, cultural retreats, and tactile interior architecture in Kerala, India, and worldwide.'
  const canonicalUrl = 'https://sdesign.co.in/work'
  const ogImage = siteData.settings.mainLogoUrl || '/s-design-logo.jpg'

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: studioName,
      type: 'website',
      images: [
        {
          url: ogImage,
          alt: `${studioName} Architecture Portfolio`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function WorkPage() {
  const siteData = await getPublicSiteData()
  const studioName = siteData.settings.studioName || 'S_DE_SIGN'

  const showcaseProjects: Project[] = (siteData.projects || []).map((p) => ({
    slug: p.slug,
    title: p.title,
    meta: p.meta,
    image: p.mainImage,
    thumbnailImage: p.thumbnailImage,
    size: p.size,
    location: p.location,
    year: p.year,
    type: p.type,
    category: (['Residential', 'Hospitality', 'Cultural', 'Renovation'].includes(p.category)
      ? p.category
      : 'Residential') as Project['category'],
    area: p.area,
    description: p.shortDescription || p.fullDescription,
    details: p.details,
    gallery: p.galleryImages.map((img) => img.url),
    mainMediaType: p.mainMediaType,
    mainVideoUrl: p.mainVideoUrl,
    mainPosterUrl: p.mainPosterUrl,
    galleryItems: p.galleryImages,
  }))

  const collectionStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Architecture Portfolio & Selected Works — ${studioName}`,
    url: 'https://sdesign.co.in/work',
    description:
      'Curated archive of residential architecture projects, modern luxury villas, and spatial commissions designed by S_DE_SIGN.',
    author: {
      '@type': 'ArchitecturalFirm',
      name: studioName,
      url: 'https://sdesign.co.in',
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: showcaseProjects.map((project, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `https://sdesign.co.in/work/${project.slug}`,
        name: project.title,
        image: project.image,
        description: project.description,
      })),
    },
  }

  return (
    <main className="work-page min-h-screen bg-[#121110] text-[#f4efe6]">
      {/* Top Header */}
      <SiteHeaderNav
        showBackLink
        backHref="/#top"
        backLabel="Home"
        navItems={siteData.navigation}
        settings={siteData.settings}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionStructuredData) }}
      />

      {/* Hero Intro */}
      <section className="work-hero pt-36 pb-12 px-6 sm:px-12 max-w-7xl mx-auto border-b border-white/10">
        <div className="section-kicker font-mono text-xs uppercase tracking-widest text-[#d9b686] mb-4">
          ( SELECTED COMMISSIONS ) <span>ARCHITECTURAL PORTFOLIO</span>
        </div>

        <StaggeredHeading
          tag="h1"
          animateOnInit
          lines={[
            { text: 'Architecture Portfolio' },
            { text: '& Selected Works', isAccent: true },
          ]}
        />

        <p className="project-answer text-lg sm:text-xl text-[#a8a195] font-light max-w-3xl mt-8 leading-relaxed">
          We design bespoke residential and commercial spaces that blend daylight, tactile materiality,
          and considered proportion—crafting enduring places for living, gathering, and quiet contemplation.
        </p>
      </section>

      {/* Interactive Filterable Gallery */}
      <section className="work-gallery-section py-12 px-6 sm:px-12 max-w-7xl mx-auto">
        <WorkGalleryView projects={showcaseProjects} initialCategory="All" showSearch={true} />
      </section>

      {/* Bottom Conversion Section */}
      <section className="work-cta py-24 px-6 sm:px-12 text-center max-w-4xl mx-auto border-t border-white/10 mt-12">
        <h2 className="font-serif text-3xl sm:text-4xl text-[#f4efe6] mb-4">
          Have an Architectural Project in Mind?
        </h2>
        <p className="text-sm sm:text-base text-[#a8a195] font-light mb-8 max-w-xl mx-auto">
          We collaborate with private clients and institutions worldwide on new residential builds,
          heritage renovations, and interior architecture.
        </p>
        <ContactCtaLink source="work_portfolio_bottom" className="submit-button cursor-target inline-flex items-center gap-2">
          <span>Initiate a Conversation</span>
          <ArrowUpRight size={17} />
        </ContactCtaLink>
      </section>

      {/* Footer */}
      <footer className="detail-footer py-12 px-6 sm:px-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-7xl mx-auto">
        <BrandLogo
          href="/#top"
          size="sm"
          variant="glass"
          studioName={siteData.settings.studioName}
          studioSubtitle={siteData.settings.studioSubtitle}
          lightLogoUrl={siteData.settings.lightLogoUrl}
          darkLogoUrl={siteData.settings.darkLogoUrl}
        />
        <div className="flex gap-6 text-xs text-[#a8a195] font-mono">
          <Link href="/work" className="text-[#d9b686]">
            Selected Works
          </Link>
          <span>/</span>
          <Link href="/services" className="hover:text-[#f4efe6] transition-colors">
            Services
          </Link>
          <span>/</span>
          <Link href="/#contact" className="hover:text-[#f4efe6] transition-colors">
            Contact
          </Link>
        </div>
      </footer>
    </main>
  )
}
