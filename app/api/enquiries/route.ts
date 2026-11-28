import { NextResponse } from 'next/server'
import { getMongoDb } from '@/lib/mongodb/client'
import { sendEnquiryNotificationEmail } from '@/lib/email/mailer'
import { checkRateLimit } from '@/lib/security/rate-limit'

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const rateLimit = checkRateLimit(`enquiry:${ip}`, { limit: 5, windowMs: 600000 }) // 5 requests per 10 mins
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many enquiry submissions from this IP. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.reset),
          },
        }
      )
    }

    const body = await request.json()

    const name = String(body.name || '').trim()
    const email = String(body.email || '').trim().toLowerCase()
    const phone = String(body.phone || '').trim()
    const location = String(body.location || '').trim()
    const projectType = String(body.projectType || '').trim()
    const budget = String(body.budget || '').trim()
    const message = String(body.message || '').trim()

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: 'Please provide your name.' }, { status: 400 })
    }
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 })
    }
    if (!message) {
      return NextResponse.json({ error: 'Please provide a brief message about your project.' }, { status: 400 })
    }

    const db = await getMongoDb()
    const now = new Date().toISOString()

    const userAgent = request.headers.get('user-agent') || 'unknown'

    const enquiryDoc = {
      id: `enq-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name,
      email,
      phone: phone || undefined,
      location: location || undefined,
      projectType: projectType || undefined,
      budget: budget || undefined,
      message,
      status: 'new' as const,
      createdAt: now,
      updatedAt: now,
      ip,
      userAgent,
    }

    let insertedId = 'local-' + Date.now()

    if (db) {
      const result = await db.collection('inquiries').insertOne(enquiryDoc)
      insertedId = result.insertedId.toString()
    }

    // Trigger email notification via Hostinger SMTP (Studio notification + Visitor acknowledgement)
    let studioDelivered = false
    let visitorDelivered = false

    try {
      const emailResult = await sendEnquiryNotificationEmail({
        name,
        email,
        phone,
        location,
        projectType,
        budget,
        message,
      })
      studioDelivered = emailResult.studioDelivered
      visitorDelivered = emailResult.visitorDelivered
    } catch (err) {
      console.warn('[Enquiry Email Delivery Exception]:', err)
      studioDelivered = false
      visitorDelivered = false
    }

    return NextResponse.json({
      success: true,
      id: insertedId,
      studioDelivered,
      visitorDelivered,
      emailDelivered: studioDelivered,
      message: 'Thank you. Your enquiry has been received and our studio will be in touch shortly.',
    })
  } catch (err) {
    console.error('[Enquiry API Error]:', err)
    return NextResponse.json(
      { error: 'Something went wrong while processing your enquiry. Please try again.' },
      { status: 500 }
    )
  }
}
