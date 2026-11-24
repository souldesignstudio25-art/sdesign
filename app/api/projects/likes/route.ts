import { NextResponse } from 'next/server'
import { withAdminDb, slugify } from '@/lib/cms/api-helpers'
import { getMongoDb, getVisitorIdFromCookie, setVisitorIdInCookie } from '@/lib/mongodb/likes'
import { verifyAdminSessionToken } from '@/lib/auth/session'
import type { NextRequest } from 'next/server'

const crypto = require('crypto')

// ============================================================
// PUBLIC: Get like status and count for a project
// ============================================================

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const db = await getMongoDb()
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })

    // Ensure visitor ID cookie is set (authoritative identifier for duplicate prevention)
    let visitorId = getVisitorIdFromCookie(request)
    if (!visitorId) {
      // Generate a new visitor ID and set it in a first-party cookie
      visitorId = crypto.randomUUID()
      const response = NextResponse.json({
        count: 0,
        hasLiked: false,
      })
      setVisitorIdInCookie(response, visitorId)
      return response
    }

    const count = await getLikeCount(db, params.slug)
    const hasLiked = await hasVisitorLiked(db, params.slug, request)

    return NextResponse.json({
      count,
      hasLiked,
    })
  } catch (err) {
    console.error('[API] Error getting like status:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ============================================================
// PUBLIC: Like / Unlike a project
// ============================================================

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  try {
    const db = await getMongoDb()
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })

    // Ensure visitor ID cookie is set (authoritative identifier for duplicate prevention)
    let visitorId = getVisitorIdFromCookie(request)
    if (!visitorId) {
      // Generate a new visitor ID and set it in a first-party cookie
      visitorId = crypto.randomUUID()
      const response = NextResponse.json({
        count: 0,
        hasLiked: false,
        action: 'liked',
        visitorId,
      })
      setVisitorIdInCookie(response, visitorId)
      return response
    }

    const result = await toggleLike(db, params.slug, visitorId)

    return NextResponse.json({
      count: result.newCount,
      hasLiked: result.hasLiked,
      action: result.action, // 'liked' or 'unliked'
    })
  } catch (err) {
    console.error('[API] Error toggling like:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ============================================================
// ADMIN: Get like analytics (protected)
// ============================================================

export async function GET_ADMIN_LIKES(request: Request) {
  try {
    const auth = await verifyAdminSessionToken(
      request.headers.get('authorization')?.replace('Bearer ', '') ||
        request.cookies.get('sd_admin_session')?.value
    )

    if (!auth?.actor) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = await getMongoDb()
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })

    const [
      likeCounts,
      totalLikes,
      mostLiked,
      leastLiked,
      topProjects,
    ] = await Promise.all([
      // Get like count per project
      db.collection('likes')
        .aggregate([
          {
            $group: {
              _id: '$projectSlug',
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
        ])
        .toArray(),
      // Total likes
      db.collection('likes').countDocuments(),
      // Most liked project
      db.collection('projects')
        .aggregate([
          {
            $lookup: {
              from: 'likes',
              localField: 'slug',
              foreignField: 'projectSlug',
              as: 'likes',
            },
          },
          {
            $project: {
              title: 1,
              slug: 1,
              likeCount: { $size: '$likes' },
            },
          },
          { $sort: { likeCount: -1 } },
          { $limit: 1 },
        ])
        .toArray(),
      // Least liked project (projects with 0 likes excluded, or include with 0)
      db.collection('projects')
        .aggregate([
          {
            $lookup: {
              from: 'likes',
              localField: 'slug',
              foreignField: 'projectSlug',
              as: 'likes',
            },
          },
          {
            $project: {
              title: 1,
              slug: 1,
              likeCount: { $size: '$likes' },
            },
          },
          { $sort: { likeCount: 1 } },
          { $limit: 1 },
        ])
        .toArray(),
      // Top 5 most liked projects
      db.collection('projects')
        .aggregate([
          {
            $lookup: {
              from: 'likes',
              localField: 'slug',
              foreignField: 'projectSlug',
              as: 'likes',
            },
          },
          {
            $project: {
              id: 1,
              title: 1,
              slug: 1,
              category: 1,
              likeCount: { $size: '$likes' },
            },
          },
          { $sort: { likeCount: -1 } },
          { $limit: 5 },
        ])
        .toArray(),
    ])

    return NextResponse.json({
      likeCounts: likeCounts.map((l: any) => ({
        slug: l._id,
        count: l.count,
      })),
      totalLikes,
      mostLiked: mostLiked[0] || null,
      leastLiked: leastLiked[0] || null,
      top5MostLiked: topProjects.map((p: any) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        likeCount: p.likeCount,
      })),
    })
  } catch (err) {
    console.error('[API] Error getting admin like analytics:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Export the admin handler with a path parameter for compatibility
export const config = {
  api: {
    bodyParser: true,
  },
}