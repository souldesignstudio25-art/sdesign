'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { trackContactClick } from '@/lib/analytics/ga4'

interface ContactCtaLinkProps {
  href?: string
  className?: string
  children?: React.ReactNode
  source?: string
}

export function ContactCtaLink({
  href = '/#contact',
  className = 'text-link detail-hero-cta cursor-target',
  children,
  source = 'project_detail',
}: ContactCtaLinkProps) {
  return (
    <Link
      href={href}
      onClick={() => trackContactClick('start_conversation', source)}
      className={className}
      data-cursor-label="Contact"
    >
      {children || (
        <>
          Start a conversation <ArrowUpRight size={15} />
        </>
      )}
    </Link>
  )
}
