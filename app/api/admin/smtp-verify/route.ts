import { NextResponse } from 'next/server'
import { withAdminDb } from '@/lib/cms/api-helpers'
import { verifySmtpConnection } from '@/lib/email/smtp'

export async function GET() {
  const { actor, errorResponse } = await withAdminDb()
  if (errorResponse || !actor) return errorResponse!

  const result = await verifySmtpConnection()
  return NextResponse.json({
    status: result.connected ? 'connected' : result.configured ? 'failed' : 'not_configured',
    configured: result.configured,
    connected: result.connected,
    host: result.host,
    port: result.port,
    user: result.user,
    error: result.error,
  })
}
