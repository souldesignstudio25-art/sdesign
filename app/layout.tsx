import { SmoothScrollProvider } from '@/components/motion/smooth-scroll'
import ClickSpark from '@/components/ClickSpark'
import { ArchitecturalLoaderProvider } from '@/components/architectural-loader'
import { MediaProtectionGuard } from '@/components/media-protection-guard'
import { SiteAccessories } from '@/components/site-accessories'
import GA4 from '@/components/analytics/ga4'
import { getPublicSiteData } from '@/lib/cms/queries'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPublicSiteData()
  const homeSeo = data.seo.home
  const title = homeSeo?.seoTitle || `${data.settings.studioName} — Architecture`
  const description =
    homeSeo?.metaDescription ||
    'S_Designs is an independent architecture studio creating quiet, considered spaces for living, working and gathering.'
  const favicon = data.settings.faviconUrl || '/s-design-logo.jpg'
  const ogImage = homeSeo?.ogImage || favicon

  return {
    metadataBase: new URL('https://sdesign.co.in'),
    title,
    description,
    generator: 'v0.app',
    icons: {
      icon: favicon,
      apple: favicon,
    },
    alternates: {
      canonical: 'https://sdesign.co.in/',
    },
    openGraph: {
      title: homeSeo?.ogTitle || title,
      description: homeSeo?.ogDescription || description,
      url: 'https://sdesign.co.in/',
      siteName: data.settings.studioName,
      type: 'website',
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: homeSeo?.ogTitle || title,
      description: homeSeo?.ogDescription || description,
      images: [ogImage],
    },
  }
}

export const dynamic = 'force-dynamic'

export const viewport: Viewport = { colorScheme: 'light', themeColor: '#f1eee7', width: 'device-width', initialScale: 1 }

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const data = await getPublicSiteData()
  const { brandColors, typography } = data.settings
  const homeSeo = data.seo?.home
  const organizationJson = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.settings.studioName,
    url: 'https://sdesign.co.in',
    logo: homeSeo?.ogImage || data.settings.faviconUrl || '/s-design-logo.jpg',
    sameAs: ['https://instagram.com/', 'https://linkedin.com/'],
    areaServed: 'Chennai, India',
  })

  const bodyStyle: Record<string, string> = {}
  if (brandColors?.ivory) bodyStyle['--ivory'] = brandColors.ivory
  if (brandColors?.paper) bodyStyle['--paper'] = brandColors.paper
  if (brandColors?.ink) bodyStyle['--ink'] = brandColors.ink
  if (brandColors?.bronze) bodyStyle['--bronze'] = brandColors.bronze
  if (brandColors?.bronzeLight) bodyStyle['--bronze-light'] = brandColors.bronzeLight
  if (typography?.heroTitleSize) bodyStyle['--font-size-hero-title'] = typography.heroTitleSize
  if (typography?.heroSubtitleSize) bodyStyle['--font-size-hero-subtitle'] = typography.heroSubtitleSize
  if (studioHeading) bodyStyle['--font-size-studio-heading'] = studioHeading
  if (studioSubheading) bodyStyle['--font-size-studio-subheading'] = studioSubheading
  if (typography?.studioBodySize) bodyStyle['--font-size-studio-body'] = typography.studioBodySize
  if (typography?.workTitleSize) bodyStyle['--font-size-work-title'] = typography.workTitleSize
  if (typography?.workDescSize) bodyStyle['--font-size-work-desc'] = typography.workDescSize
  if (
    typography?.workSlideGap &&
    typography.workSlideGap !== 'clamp(140px, 18vw, 270px)'
  ) {
    bodyStyle['--gap-work-slide'] = typography.workSlideGap
  }
  if (typography?.workImageScale) bodyStyle['--scale-work-image'] = typography.workImageScale
  if (typography?.workSecondaryImageSize) bodyStyle['--size-work-secondary-image'] = typography.workSecondaryImageSize
  if (typography?.approachHeadingSize) bodyStyle['--font-size-approach-heading'] = typography.approachHeadingSize
  if (typography?.approachBodySize) bodyStyle['--font-size-approach-body'] = typography.approachBodySize
  if (typography?.servicesTitleSize) bodyStyle['--font-size-services-title'] = typography.servicesTitleSize
  if (typography?.reviewsHeadingSize) bodyStyle['--font-size-reviews-heading'] = typography.reviewsHeadingSize
  if (typography?.reviewsClientHeadingSize) bodyStyle['--font-size-reviews-client'] = typography.reviewsClientHeadingSize
  if (typography?.reviewsDescSize) bodyStyle['--font-size-reviews-desc'] = typography.reviewsDescSize
  if (typography?.reviewsCenterCardScale) bodyStyle['--scale-reviews-card'] = typography.reviewsCenterCardScale
  if (typography?.founderHeadingSize) bodyStyle['--font-size-founder-heading'] = typography.founderHeadingSize
  if (typography?.founderSubheadingSize) bodyStyle['--font-size-founder-subheading'] = typography.founderSubheadingSize
  if (founderAbout) bodyStyle['--font-size-founder-body'] = founderAbout
  const founderWeight = typography?.founderAboutWeight || typography?.founderBodyWeight
  if (founderWeight) bodyStyle['--font-weight-founder-body'] = String(founderWeight)
  const founderLineHeight = typography?.founderAboutLineHeight || typography?.founderBodyLineHeight
  if (founderLineHeight) bodyStyle['--line-height-founder-body'] = String(founderLineHeight)
  if (typography?.founderAboutLetterSpacing) bodyStyle['--letter-spacing-founder-body'] = String(founderLetterSpacing)
  if (typography?.founderQuoteSize) bodyStyle['--font-size-founder-quote'] = typography.founderQuoteSize
  if (typography?.founderStat1NumberSize) bodyStyle['--font-size-founder-stat1-number'] = typography.founderStat1NumberSize
  if (typography?.founderStat1NumberWeight) bodyStyle['--font-weight-founder-stat1-number'] = String(typography.founderStat1NumberWeight)
  if (typography?.founderStat1NumberLineHeight) bodyStyle['--line-height-founder-stat1-number'] = String(typography.founderStat1NumberLineHeight)
  if (typography?.founderStat2NumberSize) bodyStyle['--font-size-founder-stat2-number'] = typography.founderStat2NumberSize
  if (typography?.founderStat2NumberWeight) bodyStyle['--font-weight-founder-stat2-number'] = String(typography.founderStat2NumberWeight)
  if (typography?.founderStat2NumberLineHeight) bodyStyle['--line-height-founder-stat2-number'] = String(typography.founderStat2NumberLineHeight)
  if (typography?.founderStat3NumberSize) bodyStyle['--font-size-founder-stat3-number'] = typography.founderStat3NumberSize
  if (typography?.founderStat3NumberWeight) bodyStyle['--font-weight-founder-stat3-number'] = String(typography.founderStat3NumberWeight)
  if (typography?.founderStat3NumberLineHeight) bodyStyle['--line-height-founder-stat3-number'] = String(typography.founderStat3NumberLineHeight)
  if (typography?.contactHeadingSize) bodyStyle['--font-size-contact-heading'] = typography.contactHeadingSize
  if (typography?.contactBodySize) bodyStyle['--font-size-contact-body'] = typography.contactBodySize
  if (typography?.kickerSize) bodyStyle['--font-size-kicker'] = typography.kickerSize

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning style={bodyStyle as React.CSSProperties}>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js"
          defer
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          // Configure GA4 with Measurement ID from environment
          gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-6FLZ8FXZC0'}', {
            send_page_view: false,
            cookie_flags: 'samestrict'
          });
        `
          }}
        />
        <div className="sr-only">{data.settings.studioName} Architecture</div>
        <GA4
          customParams={{
            studio: data.settings.studioName || 'S_DE_SIGN'
          }}
        >
          {children}
        </GA4>
        <ArchitecturalLoaderProvider
          studioName={data.settings.studioName}
          studioSubtitle={data.settings.studioSubtitle}
        >
          <SmoothScrollProvider>
            <ClickSpark
              sparkColor="#fff"
              shape="line"
              sparkCount={8}
              sparkSize={14}
              sparkRadius={30}
              duration={500}
            >
              {children}
            </ClickSpark>
          </SmoothScrollProvider>
        </ArchitecturalLoaderProvider>
        <SiteAccessories
          contactBotSettings={data.settings.contactBot}
          email={data.settings.email}
          phone={data.settings.phone}
          whatsapp={data.settings.whatsapp}
          instagramUrl={data.settings.instagramUrl}
          facebookUrl={data.settings.facebookUrl}
          linkedinUrl={data.settings.linkedinUrl}
        />
        <MediaProtectionGuard />
      </body>
    </html>
  )
}