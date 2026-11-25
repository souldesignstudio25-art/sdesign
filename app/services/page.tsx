import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, ArrowRight, Compass, Home, Layers, Sparkles, Building2, Trees } from 'lucide-react'
import { SiteHeaderNav } from '@/components/site-header-nav'
import { BrandLogo } from '@/components/brand-logo'
import { StaggeredHeading } from '@/components/motion/staggered-heading'
import { ScrollReveal } from '@/components/motion/scroll-reveal'
import { ContactCtaLink } from '@/components/contact-cta-link'
import { getPublicSiteData } from '@/lib/cms/queries'
import { getAllServices } from '@/lib/cms/services-data'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const siteData = await getPublicSiteData()
  const studioName = siteData.settings.studioName || 'Sdesign'
  const servicesSeo = siteData.seo?.services
  const title =
    servicesSeo?.seoTitle?.trim() ||
    `Architectural Services — Residential, Interior & Exterior Practice | ${studioName}`
  const description =
    servicesSeo?.metaDescription?.trim() ||
    'Comprehensive architectural services by Sdesign: modern residential architecture, luxury villa design, interior environments, exterior facades, and landscape integration in Kerala, India, and worldwide.'
  const rawCanonical = servicesSeo?.canonicalUrl?.trim()
  const canonicalUrl =
    rawCanonical && rawCanonical !== 'https://sdesign.co.in/' && rawCanonical !== 'https://sdesign.co.in'
      ? rawCanonical
      : 'https://sdesign.co.in/services'
  const ogImage = servicesSeo?.ogImage?.trim() || siteData.settings.mainLogoUrl || '/icon.png'

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
      title: servicesSeo?.ogTitle?.trim() || title,
      description: servicesSeo?.ogDescription?.trim() || description,
      url: canonicalUrl,
      siteName: 'Sdesign',
      type: 'website',
      images: [
        {
          url: ogImage,
          alt: `${studioName} Architectural Services`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: servicesSeo?.ogTitle?.trim() || title,
      description: servicesSeo?.ogDescription?.trim() || description,
      images: [ogImage],
    },
  }
}

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  'residential-architecture': <Home className="w-5 h-5 text-[#d9b686]" />,
  'interior-architecture': <Layers className="w-5 h-5 text-[#d9b686]" />,
  'exterior-architecture': <Sparkles className="w-5 h-5 text-[#d9b686]" />,
  'landscape-architecture': <Trees className="w-5 h-5 text-[#d9b686]" />,
  'commercial-architecture': <Building2 className="w-5 h-5 text-[#d9b686]" />,
  'renovation-adaptive-reuse': <Compass className="w-5 h-5 text-[#d9b686]" />,
}

export default async function ServicesIndexPage() {
  const siteData = await getPublicSiteData()
  const studioName = siteData.settings.studioName || 'S_DE_SIGN'
  const services = getAllServices()

  const servicesStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Architectural Design Services — S_DE_SIGN',
    url: 'https://sdesign.co.in/services',
    description:
      'Full-scope architectural consultancy, luxury residential architecture, interior environments, facade engineering, and landscape spatial design.',
    provider: {
      '@type': 'ArchitecturalFirm',
      name: studioName,
      url: 'https://sdesign.co.in',
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: services.map((service, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Service',
          name: service.title,
          url: `https://sdesign.co.in/services/${service.slug}`,
          description: service.leadParagraph,
          provider: {
            '@type': 'ArchitecturalFirm',
            name: studioName,
          },
        },
      })),
    },
  }

  return (
    <main className="services-index-page min-h-screen bg-[#121110] text-[#f4efe6]">
      {/* Top Navigation */}
      <SiteHeaderNav
        showBackLink
        backHref="/#services"
        backLabel="Back to Overview"
        navItems={siteData.navigation}
        settings={siteData.settings}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesStructuredData) }}
      />

      {/* Hero Header Section */}
      <section className="services-hero pt-36 pb-20 px-6 sm:px-12 max-w-7xl mx-auto border-b border-white/10">
        <div className="section-kicker font-mono text-xs uppercase tracking-widest text-[#d9b686] mb-4">
          ( PRACTICE DISCIPLINES ) <span>END-TO-END ARCHITECTURAL CONSULTANCY</span>
        </div>

        <StaggeredHeading
          tag="h1"
          animateOnInit
          lines={[
            { text: 'Architectural Design Services' },
            { text: '& Spatial Practice', isAccent: true },
          ]}
        />

        <p className="lead-paragraph text-lg sm:text-xl text-[#a8a195] font-light max-w-3xl mt-8 leading-relaxed">
          From early site feasibility and daylight choreography to bespoke construction detailing,
          S_DE_SIGN provides comprehensive architectural services tailored for discerning clients
          in Kerala, India, and worldwide.
        </p>

        <div className="hero-cta-bar flex flex-wrap gap-4 items-center mt-10">
          <ContactCtaLink source="services_index_hero" className="submit-button cursor-target" />
          <Link
            href="/work"
            className="text-link flex items-center gap-2 text-sm text-[#a8a195] hover:text-[#d9b686] transition-colors cursor-target ml-2"
          >
            <span>View Architecture Portfolio</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="services-grid-section py-20 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <article
              key={service.slug}
              className="service-card group p-8 rounded-2xl bg-[#171614] border border-white/5 hover:border-[#d9b686]/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center">
                    {SERVICE_ICONS[service.slug] || <Compass className="w-5 h-5 text-[#d9b686]" />}
                  </div>
                  <span className="font-mono text-xs text-[#a8a195]">0{idx + 1}</span>
                </div>

                <h2 className="font-serif text-2xl text-[#f4efe6] mb-3 group-hover:text-[#d9b686] transition-colors">
                  {service.shortTitle}
                </h2>

                <p className="text-sm text-[#a8a195] leading-relaxed mb-6">
                  {service.leadParagraph}
                </p>

                <div className="service-tags flex flex-wrap gap-2 mb-8">
                  {service.disciplines.slice(0, 3).map((disc) => (
                    <span
                      key={disc}
                      className="px-2.5 py-1 text-[11px] font-mono tracking-wider uppercase rounded-md bg-white/[0.04] text-[#a8a195]"
                    >
                      {disc}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <Link
                  href={`/services/${service.slug}`}
                  className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#d9b686] group-hover:text-[#f1cf9e] transition-colors cursor-target"
                >
                  <span>Explore Discipline</span>
                  <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Architectural Methodology Section */}
      <section className="services-methodology py-24 px-6 sm:px-12 bg-[#171614] border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="section-kicker font-mono text-xs uppercase tracking-widest text-[#d9b686] mb-4">
            ( METHODOLOGY ) <span>THE S_DE_SIGN APPROACH</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl text-[#f4efe6] mb-12">
            Structured for Clarity &amp; Longevity
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { num: '01', title: 'Site Feasibility', desc: 'Solar, climate, and topography analysis.' },
              { num: '02', title: 'Volumetric Massing', desc: 'Proportions, sightlines, and light wells.' },
              { num: '03', title: 'Design Development', desc: 'Envelope engineering and spatial flow.' },
              { num: '04', title: 'Technical Detailing', desc: 'Bespoke joinery and working plate sets.' },
              { num: '05', title: 'Site Observation', desc: 'Meticulous craftsperson coordination.' },
            ].map((step) => (
              <div key={step.num} className="p-6 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="font-mono text-xs text-[#d9b686] block mb-2">{step.num}</span>
                <h3 className="font-medium text-base text-[#f4efe6] mb-2">{step.title}</h3>
                <p className="text-xs text-[#a8a195] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA & Footer */}
      <section className="services-cta py-24 px-6 sm:px-12 text-center max-w-4xl mx-auto">
        <h2 className="font-serif text-3xl sm:text-4xl text-[#f4efe6] mb-4">
          Initiate an Architectural Commission
        </h2>
        <p className="text-sm sm:text-base text-[#a8a195] font-light mb-8 max-w-xl mx-auto">
          Whether you are acquiring land for a luxury private residence or planning an interior transformation,
          our team is prepared to guide your spatial vision.
        </p>
        <ContactCtaLink source="services_index_bottom" className="submit-button cursor-target inline-flex items-center gap-2">
          <span>Start a conversation</span>
          <ArrowUpRight size={17} />
        </ContactCtaLink>
      </section>

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
          <Link href="/work" className="hover:text-[#f4efe6] transition-colors">
            Selected Works
          </Link>
          <span>/</span>
          <Link href="/services" className="text-[#d9b686]">
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
