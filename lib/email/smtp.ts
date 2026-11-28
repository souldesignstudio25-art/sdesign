import nodemailer from 'nodemailer'

export interface SmtpConfig {
  host: string
  port: number
  secure: boolean
  user: string
  pass: string
  fromEmail: string
  fromName: string
  studioNotificationEmail: string
}

/**
 * Retrieves Hostinger SMTP configuration securely from server environment variables.
 * None of these variables are exposed to the client.
 */
export function getSmtpConfig(): SmtpConfig | null {
  const user = process.env.SMTP_USER?.trim() || 'sylen@sdesign.co.in'
  const pass = process.env.SMTP_PASS?.trim()

  // Hostinger official settings
  const host = process.env.SMTP_HOST?.trim() || 'smtp.hostinger.com'
  const port = parseInt(process.env.SMTP_PORT?.trim() || '465', 10)
  const secure =
    process.env.SMTP_SECURE === 'true' ||
    process.env.SMTP_SECURE === '1' ||
    port === 465

  const fromEmail = process.env.SMTP_FROM_EMAIL?.trim() || user
  const fromName = process.env.SMTP_FROM_NAME?.trim() || 'Sylen Design'

  // Authoritative studio notification recipient: environment variable takes precedence
  const studioNotificationEmail =
    process.env.STUDIO_NOTIFICATION_EMAIL?.trim() ||
    process.env.ENQUIRY_EMAIL?.trim() ||
    'sylen@sdesign.co.in'

  // If password is not configured yet, return null
  if (!pass) {
    return null
  }

  return {
    host,
    port,
    secure,
    user,
    pass,
    fromEmail,
    fromName,
    studioNotificationEmail,
  }
}

/**
 * Creates a Nodemailer transporter using verified Hostinger SMTP settings.
 */
export function createSmtpTransporter(config: SmtpConfig) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    // Set socket timeouts to prevent hanging serverless instances
    connectionTimeout: 10000, // 10s
    greetingTimeout: 10000,
    socketTimeout: 15000,
  })
}

/**
 * Safe connection test without exposing credentials.
 */
export async function verifySmtpConnection(): Promise<{
  configured: boolean
  connected: boolean
  host?: string
  port?: number
  user?: string
  error?: string
}> {
  const config = getSmtpConfig()
  if (!config) {
    return {
      configured: false,
      connected: false,
      error: 'Hostinger SMTP password (SMTP_PASS) is not configured in environment variables.',
    }
  }

  try {
    const transporter = createSmtpTransporter(config)
    await transporter.verify()
    return {
      configured: true,
      connected: true,
      host: config.host,
      port: config.port,
      user: config.user,
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    // Sanitize any potential credential leaks in error output
    const sanitizedError = errorMessage
      .replace(new RegExp(config.pass, 'g'), '***')
      .slice(0, 300)

    console.error('[Hostinger SMTP Verify Error]:', sanitizedError)
    return {
      configured: true,
      connected: false,
      host: config.host,
      port: config.port,
      user: config.user,
      error: sanitizedError,
    }
  }
}
