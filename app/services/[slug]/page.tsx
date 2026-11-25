import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Compass, ShieldCheck } from 'lucide-react'
import { SiteHeaderNav } from '@/components/site-header-nav'
import { BrandLogo } from '@/components/brand-logo'
import { StaggeredHeading } from '@/components/motion/staggered-heading'
import { ScrollReveal } from '@/components/motion/scroll-reveal'
import { ContactCtaLink } from '@/components/contact-cta-link'
import { getPublicSiteData } from '@/lib/cms/queries'
import { getAllServices, getServiceBySlug } from '@/lib/cms/services-data'
import { getOptimizedImageUrl } from '@/lib/storage/image-optimization'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  const services = getAllServices()
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  const siteData = await getPublicSiteData()

  if (!service) {
    return {
      title: `Architectural Service — ${siteData.settings.studioName || 'S_DE_SIGN'}`,
    }
  }

  const studioName = siteData.settings.studioName || 'S_DE_SIGN'
  const title = `${service.seoTitle} | ${studioName}`
  const description = service.seoDescription
  const canonicalUrl = `https://sdesign.co.in/services/${service.slug}`
  const ogImage = siteData.settings.mainLogoUrl || '/icon.png'

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
          alt: `${service.title} — ${studioName}`,
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

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) notFound()

  const siteData = await getPublicSiteData()
  const studioName = siteData.settings.studioName || 'S_DE_SIGN'
  const allServices = getAllServices()
  const currentIndex = allServices.findIndex((s) => s.slug === service.slug)
  const nextService = allServices[(currentIndex + 1) % allServices.length]
  const prevService = allServices[(currentIndex - 1 + allServices.length) % allServices.length]

  // Find relevant featured projects from site data
  const relatedProjects = (siteData.projects || []).filter((p) =>
    service.featuredProjectSlugs.includes(p.slug)
  )

  const canonicalUrl = `https://sdesign.co.in/services/${service.slug}`

  // Schema.org Graph: BreadcrumbList, Service, FAQPage
  const structuredDataGraph: any[] = [
    {
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://sdesign.co.in',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Services',
          item: 'https://sdesign.co.in/services',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: service.title,
          item: canonicalUrl,
        },
      ],
    },
    {
      '@type': 'Service',
      '@id': `${canonicalUrl}#service`,
      name: service.title,
      description: service.leadParagraph,
      provider: {
        '@type': 'ArchitecturalFirm',
        name: studioName,
        url: 'https://sdesign.co.in',
        logo: 'https://sdesign.co.in/icon.png',
        areaServed: ['Kerala, India', 'India', 'Worldwide'],
      },
      serviceType: service.shortTitle,
      areaServed: ['Kerala', 'India', 'Worldwide'],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: `${service.title} Deliverables`,
        itemListElement: service.deliverables.map((item) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: item,
          },
        })),
      },
    },
  ]

  if (service.faqs && service.faqs.length > 0) {
    structuredDataGraph.push({
      '@type': 'FAQPage',
      '@id': `${canonicalUrl}#faq`,
      mainEntity: service.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    })
  }

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': structuredDataGraph,
  })

  return (
    <main className="service-detail-page min-h-screen bg-[#121110] text-[#f4efe6]">
      {/* Top Header */}
      <SiteHeaderNav
        showBackLink
        backHref="/services"
        backLabel="All Services"
        navItems={siteData.navigation}
        settings={siteData.settings}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      {/* Hero Section */}
      <section className="service-hero pt-36 pb-20 px-6 sm:px-12 max-w-7xl mx-auto border-b border-white/10">
        <div className="section-kicker font-mono text-xs uppercase tracking-widest text-[#d9b686] mb-4">
          {service.kicker}
        </div>

        <StaggeredHeading
          tag="h1"
          animateOnInit
          lines={[{ text: service.title }]}
        />

        <p className="lead-paragraph text-xl sm:text-2xl text-[#a8a195] font-light max-w-3xl mt-8 leading-relaxed">
          {service.leadParagraph}
        </p>

        <div className="mt-8 max-w-3xl text-sm sm:text-base text-[#7c7569] leading-relaxed">
          <p>{service.fullOverview}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-10">
          <ContactCtaLink source={`service_${service.slug}_hero`} className="submit-button cursor-target">
            <span>Commission a Project</span>
            <ArrowUpRight size={17} />
          </ContactCtaLink>
          <Link
            href="/work"
            className="text-link flex items-center gap-2 text-sm text-[#a8a195] hover:text-[#d9b686] transition-colors cursor-target ml-2"
          >
            <span>View Related Portfolio Case Studies</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      {/* Core Disciplines & Sub-Specializations */}
      <section className="service-disciplines py-20 px-6 sm:px-12 max-w-7xl mx-auto border-b border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <div className="section-kicker font-mono text-xs uppercase tracking-widest text-[#d9b686] mb-3">
              ( SCOPE OF PRACTICE )
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#f4efe6] leading-tight">
              Specialized Competencies
            </h2>
            <p className="text-sm text-[#a8a195] mt-4 leading-relaxed font-light">
              Every commission draws upon tailored architectural engineering, solar modeling, and custom
              material curation honed across high-end international residences and spatial environments.
            </p>
          </div>

          <div className="md:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {service.disciplines.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-[#171614] border border-white/5 flex items-start gap-3.5"
                >
                  <div className="w-6 h-6 rounded-full bg-[#d9b686]/10 border border-[#d9b686]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-[#d9b686]" />
                  </div>
                  <span className="text-sm text-[#f4efe6] font-medium">{item}</span>
                </div>
              ))}
            </div>

            {/* Materiality & Sustainability Callout Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="font-mono text-xs uppercase tracking-wider text-[#d9b686] block mb-2">
                  Tactile Materiality
                </span>
                <p className="text-xs text-[#a8a195] leading-relaxed">
                  {service.materialityFocus}
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="font-mono text-xs uppercase tracking-wider text-[#d9b686] block mb-2">
                  Passive Climate Design
                </span>
                <p className="text-xs text-[#a8a195] leading-relaxed">
                  {service.sustainableAspects}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Phase Architectural Process */}
      <section className="service-process py-24 px-6 sm:px-12 bg-[#171614] border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="section-kicker font-mono text-xs uppercase tracking-widest text-[#d9b686] mb-4">
            ( METHODOLOGY ) <span>EXECUTION TIMELINE</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#f4efe6] mb-12">
            Architectural Project Delivery
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {service.processPhases.map((phase) => (
              <div
                key={phase.number}
                className="p-6 rounded-2xl bg-[#121110] border border-white/5 relative flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-xs text-[#d9b686] font-semibold mb-2 block">
                    PHASE {phase.number}
                  </span>
                  <h3 className="font-serif text-lg text-[#f4efe6] mb-3">{phase.name}</h3>
                  <p className="text-xs text-[#a8a195] leading-relaxed">{phase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables Checklist */}
      <section className="service-deliverables py-20 px-6 sm:px-12 max-w-7xl mx-auto border-b border-white/10">
        <div className="max-w-3xl">
          <div className="section-kicker font-mono text-xs uppercase tracking-widest text-[#d9b686] mb-3">
            ( DELIVERABLES )
          </div>
          <h2 className="font-serif text-3xl text-[#f4efe6] mb-8">
            Technical Client Deliverables
          </h2>
          <ul className="space-y-4">
            {service.deliverables.map((del, dIdx) => (
              <li key={dIdx} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="w-5 h-5 rounded-full bg-[#d9b686]/10 text-[#d9b686] flex items-center justify-center font-mono text-xs shrink-0 mt-0.5">
                  ✓
                </span>
                <span className="text-sm text-[#f4efe6]">{del}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Featured Projects Portfolio Integration */}
      {relatedProjects.length > 0 && (
        <section className="service-projects py-24 px-6 sm:px-12 max-w-7xl mx-auto border-b border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="section-kicker font-mono text-xs uppercase tracking-widest text-[#d9b686] mb-2">
                ( PORTFOLIO CASE STUDIES )
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#f4efe6]">
                Featured Realizations
              </h2>
            </div>
            <Link
              href="/work"
              className="text-link text-xs font-mono uppercase tracking-widest text-[#d9b686] flex items-center gap-2 cursor-target"
            >
              <span>View all projects</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProjects.map((project) => (
              <article
                key={project.slug}
                className="group rounded-2xl overflow-hidden bg-[#171614] border border-white/5 hover:border-[#d9b686]/40 transition-all duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#1a1917]">
                  {project.mainImage && (
                    <img
                      src={getOptimizedImageUrl(project.mainImage, { width: 800, quality: 'auto' })}
                      alt={`Exterior view of ${project.title} — ${project.category} architecture by ${studioName}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  )}
                  <span className="absolute top-4 left-4 px-2.5 py-1 text-[10px] font-mono tracking-wider uppercase rounded bg-[#121110]/80 backdrop-blur-md text-[#d9b686]">
                    {project.category} · {project.location}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl text-[#f4efe6] group-hover:text-[#d9b686] transition-colors mb-2">
                    {project.title}
                  </h3>
                  <p className="text-xs text-[#a8a195] line-clamp-2 leading-relaxed mb-4">
                    {project.shortDescription || project.fullDescription}
                  </p>
                  <Link
                    href={`/work/${project.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#d9b686] cursor-target"
                  >
                    <span>Inspect Case Study</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Frequently Asked Questions Section */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="service-faq py-24 px-6 sm:px-12 max-w-4xl mx-auto border-b border-white/10">
          <div className="section-kicker font-mono text-xs uppercase tracking-widest text-[#d9b686] mb-3">
            ( FAQ &amp; INSIGHTS )
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#f4efe6] mb-10">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {service.faqs.map((faq, fIdx) => (
              <div
                key={fIdx}
                className="p-6 sm:p-8 rounded-2xl bg-[#171614] border border-white/5"
              >
                <h3 className="font-serif text-xl text-[#f4efe6] mb-3">
                  {faq.question}
                </h3>
                <p className="text-sm text-[#a8a195] font-light leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bottom Conversion Section */}
      <section className="service-cta py-24 px-6 sm:px-12 text-center max-w-4xl mx-auto">
        <h2 className="font-serif text-3xl sm:text-4xl text-[#f4efe6] mb-4">
          Ready to Discuss Your {service.shortTitle} Project?
        </h2>
        <p className="text-sm sm:text-base text-[#a8a195] font-light mb-8 max-w-xl mx-auto">
          Share your site location, spatial aspirations, and timeline. Our architectural team will arrange a private initial consultation.
        </p>
        <ContactCtaLink source={`service_${service.slug}_bottom`} className="submit-button cursor-target inline-flex items-center gap-2">
          <span>Start a conversation</span>
          <ArrowUpRight size={17} />
        </ContactCtaLink>
      </section>

      {/* Discipline Pager Footer */}
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

        <div className="project-pager-nav flex items-center gap-4 text-xs font-mono">
          <Link
            href={`/services/${prevService.slug}`}
            className="pager-link cursor-target flex items-center gap-1.5 text-[#a8a195] hover:text-[#f4efe6] transition-colors"
          >
            <ArrowLeft size={14} /> Previous: {prevService.shortTitle}
          </Link>
          <span className="dot text-[#444]">/</span>
          <Link
            href={`/services/${nextService.slug}`}
            className="pager-link cursor-target flex items-center gap-1.5 text-[#a8a195] hover:text-[#f4efe6] transition-colors"
          >
            Next: {nextService.shortTitle} <ArrowRight size={14} />
          </Link>
        </div>

        <Link className="text-link cursor-target text-xs text-[#a8a195] hover:text-[#d9b686]" href="/#contact">
          Initiate a Project <ArrowUpRight size={14} />
        </Link>
      </footer>
    </main>
  )
}
