import { NextResponse } from 'next/server'
import { setVisitorIdInCookie } from '@/lib/mongodb/likes'

// This endpoint sets the visitor ID cookie for new visitors.
// It's called on the first page load via client-side JavaScript.

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const path = url.pathname

    // If someone hits this directly without a visitorId, generate one
    const visitorId = crypto.randomUUID()

    const response = NextResponse.json({ visitorId })
    setVisitorIdInCookie(response, visitorId)
    return response
  } catch (err) {
    console.error('[API] Error setting visitor ID:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}