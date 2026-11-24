'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Heart } from 'lucide-react'
import { trackProjectLike, trackProjectUnlike } from '@/lib/analytics/ga4'

interface ProjectLikeButtonProps {
  projectSlug: string
  projectName: string
  className?: string
}

export function ProjectLikeButton({
  projectSlug,
  projectName,
  className = '',
}: ProjectLikeButtonProps) {
  const [isLiked, setIsLiked] = useState<boolean>(false)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)

  // Initialize liked state from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem(`s_designs_liked_${projectSlug}`)
      if (stored === 'true') {
        setIsLiked(true)
      }
    } catch {
      // localStorage disabled or not accessible
    }
  }, [projectSlug])

  const handleToggleLike = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)

    setIsLiked((prev) => {
      const nextState = !prev
      try {
        if (nextState) {
          localStorage.setItem(`s_designs_liked_${projectSlug}`, 'true')
          trackProjectLike(projectSlug, projectName)
        } else {
          localStorage.removeItem(`s_designs_liked_${projectSlug}`)
          trackProjectUnlike(projectSlug, projectName)
        }
      } catch {
        // Handle private browsing or localStorage quotas gracefully
      }
      return nextState
    })
  }, [projectSlug, projectName])

  return (
    <button
      type="button"
      onClick={handleToggleLike}
      className={`project-like-btn cursor-target flex items-center gap-2 px-3.5 py-2 rounded-full border border-[var(--bronze,#d9b686)]/30 bg-[#161513]/70 hover:bg-[#201d19] hover:border-[var(--bronze,#d9b686)]/70 transition-all text-xs tracking-wider uppercase font-mono select-none ${
        isLiked ? 'text-[var(--bronze,#d9b686)] is-liked' : 'text-[#a8a195]'
      } ${className}`}
      data-cursor-label={isLiked ? 'Unlike' : 'Like'}
      aria-label={isLiked ? `Unlike ${projectName}` : `Like ${projectName}`}
      aria-pressed={isLiked}
      suppressHydrationWarning
    >
      <Heart
        size={15}
        className={`transition-all duration-300 ${
          isLiked
            ? 'fill-[var(--bronze,#d9b686)] stroke-[var(--bronze,#d9b686)] scale-110 drop-shadow-[0_0_6px_rgba(217,182,134,0.5)]'
            : 'stroke-current fill-transparent hover:scale-105'
        } ${isAnimating ? 'animate-bounce' : ''}`}
      />
      <span className="text-[11px] font-sans">
        {isLiked ? 'Appreciated' : 'Appreciate Design'}
      </span>
    </button>
  )
}
