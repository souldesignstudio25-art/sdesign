import { NextResponse } from 'next/server'
import { withAdminDb } from '@/lib/cms/api-helpers'
import { verifyAdminSessionToken } from '@/lib/auth/session'
import { getMongoDb } from '@/lib/mongodb/client'

export async function GET(request: Request) {
  try {
    // Verify admin session
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(8) : undefined

    const decoded = await verifyAdminSessionToken(token)
    if (!decoded?.actor) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = await getMongoDb()
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })

    // Get like counts per project
    const likeCounts = await db.collection('likes')
      .aggregate([
        {
          $group: {
            _id: '$projectSlug',
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ])
      .toArray()

    // Get total likes
    const totalLikes = await db.collection('likes').countDocuments()

    // Get top 5 most liked projects with project details
    const top5 = await db.collection('projects')
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
            year: 1,
            likeCount: { $size: '$likes' },
          },
        },
        { $sort: { likeCount: -1 } },
        { $limit: 5 },
      ])
      .toArray()

    // Get like counts for all published projects (include those with 0)
    const allProjectsWithLikes = await db.collection('projects')
      .find({ status: 'published' })
      .sort({ displayOrder: 1 })
      .project({ title: 1, slug: 1, likeCount: { $size: '$likes' } })
      .toArray()

    // Actually, let me redo this properly with a proper lookup
    // Get all published projects
    const projects = await db.collection('projects')
      .find({ status: 'published' })
      .sort({ displayOrder: 1 })
      .toArray()

    // Build like counts map
    const likesMap: Record<string, number> = {}
    for (const proj of projects) {
      const count = await db.collection('likes').countDocuments({ projectSlug: proj.slug })
      likesMap[proj.slug] = count
    }

    return NextResponse.json({
      likeCounts: likeCounts.map((l: any) => ({
        slug: l._id,
        count: l.count,
      })),
      totalLikes,
      byProject: likesMap,
      top5MostLiked: top5.map((p: any) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        category: p.category,
        likeCount: p.likeCount,
      })),
    })
  } catch (err) {
    console.error('[API] Error getting admin like analytics:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Config to allow dynamic rendering
export const config = {
  api: {
    bodyParser: true,
  },
}