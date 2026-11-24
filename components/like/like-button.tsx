'use client'

import { useState, useEffect, useCallback } from 'react'
import { FiHeart, FiHeartMinus } from 'lucide-react'
import { useRouter } from 'next/navigation'

// --------------------------------------------------------
// Like Button Component
// - Persistent state via visitorId cookie (authoritative)
// - Optimistic UI update with server confirmation
// - Disables on click to prevent double-taps
// --------------------------------------------------------

type LikeButtonProps = {
  projectSlug: string
  initialCount?: number
  /** Optional custom className for styling variations */
  className?: string
}

const HEART_FILL_COLOR = '#b68d54' // Gold accent from the design system
const HEART_OUTLINE_COLOR = '#6b6358' // Ink/dark color for outline
const LIKE_ANIMATION_DURATION = 200 // ms

export function LikeButton({
  projectSlug,
  initialCount = 0,
  className,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(initialCount)
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  // Initialize like state from server on mount
  useEffect(() => {
    async function init() {
      try {
        const res = await fetch(`/api/projects/${projectSlug}/likes`, {
          credentials: 'include',
        })
        const data = await res.json()
        if (res.ok) {
          setIsLiked(data.hasLiked)
          setLikeCount(data.count)
        }
      } catch (err) {
        console.warn('[LikeButton] Failed to init state:', err)
      }
    }
    init()
  }, [projectSlug])

  // Optimistic update when user clicks
  const handleLike = useCallback(async (e: React.MouseEvent) => {
    if (isProcessing) return
    e.stopPropagation()
    setIsLiked(!isLiked) // Optimistic UI: toggle immediately

    try {
      const res = await fetch(`/api/projects/${projectSlug}/likes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectSlug }),
        credentials: 'include',
      })
      const data = await res.json()

      if (!res.ok) {
        // Rollback optimistic update on failure
        setIsLiked(!isLiked)
        setLikeCount(isLiked ? likeCount + 1 : likeCount - 1)
        throw new Error(data.error || 'Failed to toggle like')
      }

      // Commit: update count from server response
      setLikeCount(data.count)
    } catch (err) {
      console.error('[LikeButton] Toggle like error:', err)
    } finally {
      setIsProcessing(false)
    }
  }, [isLiked, likeCount, projectSlug])

  return (
    <div
      className={`flex items-center gap-1.5 cursor-pointer select-none ${className}`}
      onClick={handleLike}
      role="button"
      tabIndex={0}
      aria-label={
        isLiked
          ? `Unlike this project. Likes: ${likeCount}`
          : `Like this project. Likes: ${likeCount}`
      }
    >
      {/* Heart icon with color based on liked state */}
      <svg
        width={18}
        height={18}
        viewBox="0 0 24 24"
        fill={isLiked ? HEART_FILL_COLOR : 'none'}
        stroke={HEART_OUTLINE_COLOR}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-colors duration-${LIKE_ANIMATION_DURATION} ${isLiked ? 'fill-current' : ''}` }
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>

      {/* Heart outline (always visible, fills when liked) */}
      <svg
        width={18}
        height={18}
        viewBox="0 0 24 24"
        fill="none"
        stroke={HEART_FILL_COLOR}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-stroke-width duration-${LIKE_ANIMATION_DURATION} ${isLiked ? 'stroke-2' : 'stroke-4'}` }
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>

      {/* Like count */}
      <span className={`text-xs font-medium text-[#6b6358] transition-opacity duration-200 ${!isLiked ? 'opacity-100' : 'opacity-80'}`}>
        {likeCount}
      </span>
    </div>
  )
}