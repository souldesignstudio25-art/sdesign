import { MongoClient, Db } from 'mongodb'

// ============================================================
// Visitor ID Management
// Store a first-party anonymous visitor ID in a cookie.
// This is the authoritative identifier for preventing duplicate likes.
// ============================================================

export function getVisitorIdFromCookie(request: Request): string | null {
  try {
    // Try to get visitorId from cookie (set by frontend on first visit)
    const cookieStore = request.cookies
    const cookieVal = (cookieStore.get('visitorId') as string | undefined)?.value
    if (cookieVal && cookieVal.trim()) {
      return cookieVal.trim()
    }
    return null
  } catch {
    return null
  }
}

export function setVisitorIdInCookie(response: Response, visitorId: string): void {
  const cookieOpts = {
    httpOnly: false,
    sameSite: 'lax' as const,
    secure: false,
    path: '/',
    maxAge: 60 * 60 * 24 * 365 * 2, // 2 years
  }
  ;(response as any).cookie('visitorId', visitorId, cookieOpts)
}

// ============================================================
// Like Toggle & Count Operations
// Uses atomic MongoDB operations for consistency with concurrent requests.
// ============================================================

export async function hasVisitorLiked(db: Db, projectSlug: string, request: Request): Promise<boolean> {
  try {
    const visitorId = getVisitorIdFromCookie(request)
    if (!visitorId) return false

    const exists = await db
      .collection('likes')
      .findOne({ projectSlug, visitorId })

    return !!exists
  } catch {
    return false
  }
}

export async function toggleLike(db: Db, projectSlug: string, visitorId: string): Promise<{
  newCount: number
  hasLiked: boolean
  action: 'liked' | 'unliked'
}> {
  const session = await db.startSession()
  const result = await session.withTransaction(async () => {
    // Check if visitor has already liked this project
    const alreadyLiked = await db.collection('likes').findOne(
      { projectSlug, visitorId },
      { session }
    )

    if (alreadyLiked) {
      // Unlike: remove the like record and decrement count
      await db.collection('likes').deleteOne(
        { projectSlug, visitorId },
        { session }
      )
      const newCount = await db
        .collection('projects')
        .updateOne(
          { slug: projectSlug },
          { $inc: { likeCount: -1 } },
          { session, upsert: false }
        )
      return {
        newCount: newCount.modifiedCount > 0
          ? newCount.modifiedCount // count was decremented
          : await getProjectLikeCount(db, projectSlug),
        hasLiked: false,
        action: 'unliked',
      }
    } else {
      // Like: create like record and increment count
      await db.collection('likes').insertOne(
        { projectSlug, visitorId },
        { session }
      )
      const newCount = await db
        .collection('projects')
        .updateOne(
          { slug: projectSlug },
          { $inc: { likeCount: 1 } },
          { session, upsert: false }
        )
      return {
        newCount: newCount.modifiedCount > 0
          ? newCount.modifiedCount // count was incremented
          : await getProjectLikeCount(db, projectSlug),
        hasLiked: true,
        action: 'liked',
      }
    }
  })

  session.endSession()
  return result
}

export async function getProjectLikeCount(db: Db, projectSlug: string): Promise<number> {
  const doc = await db
    .collection('projects')
    .findOne({ slug: projectSlug }, { projection: { likeCount: 1 } })

  if (doc && doc.likeCount !== undefined) {
    return doc.likeCount
  }
  return 0
}

// Helper to get like count from likes collection directly
export async function getLikeCountFromCollection(db: Db, projectSlug: string): Promise<number> {
  return await db.collection('likes').countDocuments({ projectSlug })
}

// ============================================================
// Database Seed: Add likeCount field to existing projects
// ============================================================

export async function seedProjectLikeCounts(db: Db): Promise<void> {
  // Initialize likeCount to 0 for all projects that don't have it
  const result = await db
    .collection('projects')
    .updateMany(
      { likeCount: { $exists: false } },
      { $set: { likeCount: 0 } }
    )

  if (result.modifiedCount > 0) {
    console.log(`[MongoDB] Seeded likeCount for ${result.modifiedCount} projects`)
  }
}