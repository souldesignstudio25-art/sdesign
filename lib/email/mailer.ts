import { getSmtpConfig, createSmtpTransporter } from './smtp'

export interface EnquiryEmailParams {
  name: string
  email: string
  phone?: string
  location?: string
  projectType?: string
  budget?: string
  message: string
}

export interface SendResult {
  success: boolean
  messageId?: string
  error?: string
  skipped?: boolean
  reason?: string
}

/**
 * 1. Studio Notification Email:
 * Informs Sylen Design studio at sylen@sdesign.co.in of a new project inquiry.
 */
export async function sendStudioNotificationEmail(params: EnquiryEmailParams): Promise<SendResult> {
  const config = getSmtpConfig()

  if (!config) {
    console.warn(
      `[Hostinger SMTP Note] Hostinger SMTP is not fully configured (missing SMTP_PASS). ` +
      `Enquiry from "${params.name}" (${params.email}) was safely saved to MongoDB, but studio notification email was skipped.`
    )
    return {
      success: false,
      skipped: true,
      reason: 'missing_smtp_credentials',
      error: 'Hostinger SMTP credentials (SMTP_PASS) not configured.',
    }
  }

  const { name, email, phone, location, projectType, budget, message } = params
  const toEmail = config.studioNotificationEmail // Authoritative recipient

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Project Enquiry — Sylen Design</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #121110; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #f4efe6;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #181614; border: 1px solid rgba(244, 239, 230, 0.12); border-radius: 8px; overflow: hidden;">
    <!-- Header -->
    <tr>
      <td style="padding: 32px 32px 24px; border-bottom: 1px solid rgba(244, 239, 230, 0.08); background-color: #141311;">
        <span style="font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #d9b686; font-weight: 600;">SYLEN DESIGN · STUDIO INQUIRY</span>
        <h1 style="margin: 8px 0 0; font-family: Georgia, serif; font-size: 24px; font-weight: 400; color: #fbf9f4; letter-spacing: -0.01em;">
          New Project Inquiry Received
        </h1>
      </td>
    </tr>

    <!-- Body Info -->
    <tr>
      <td style="padding: 28px 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px; line-height: 1.6;">
          <tr>
            <td style="padding: 8px 0; color: #a19a8e; width: 140px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em;">Client Name</td>
            <td style="padding: 8px 0; color: #fbf9f4; font-weight: 600; font-size: 15px;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #a19a8e; font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em;">Email</td>
            <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #d9b686; text-decoration: none;">${email}</a></td>
          </tr>
          ${phone ? `
          <tr>
            <td style="padding: 8px 0; color: #a19a8e; font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em;">Phone</td>
            <td style="padding: 8px 0;"><a href="tel:${phone}" style="color: #fbf9f4; text-decoration: none;">${phone}</a></td>
          </tr>` : ''}
          ${location ? `
          <tr>
            <td style="padding: 8px 0; color: #a19a8e; font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em;">Location</td>
            <td style="padding: 8px 0; color: #fbf9f4;">${location}</td>
          </tr>` : ''}
          ${projectType ? `
          <tr>
            <td style="padding: 8px 0; color: #a19a8e; font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em;">Project Type</td>
            <td style="padding: 8px 0; color: #d9b686; font-weight: 500;">${projectType}</td>
          </tr>` : ''}
          ${budget ? `
          <tr>
            <td style="padding: 8px 0; color: #a19a8e; font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em;">Est. Budget</td>
            <td style="padding: 8px 0; color: #fbf9f4;">${budget}</td>
          </tr>` : ''}
        </table>

        <!-- Message Box -->
        <div style="margin-top: 24px; padding: 20px; background-color: #121110; border-left: 2px solid #d9b686; border-radius: 4px;">
          <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #a19a8e; display: block; margin-bottom: 8px;">Project Brief / Message</span>
          <div style="color: #e6dfd3; font-size: 14.5px; line-height: 1.7; white-space: pre-wrap; font-family: Georgia, serif;">${message}</div>
        </div>

        <!-- Action Button -->
        <div style="margin-top: 28px; text-align: left;">
          <a href="mailto:${email}?subject=Regarding%20your%20project%20inquiry%20%E2%80%94%20Sylen%20Design" style="display: inline-block; padding: 12px 24px; background-color: #d9b686; color: #121110; text-decoration: none; font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; border-radius: 3px;">
            Reply to ${name}
          </a>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 20px 32px; background-color: #141311; border-top: 1px solid rgba(244, 239, 230, 0.08); text-align: center; font-size: 11px; color: #7c7367;">
        This project inquiry was submitted via the Sylen Design Studio website contact form.
      </td>
    </tr>
  </table>
</body>
</html>
  `

  try {
    const transporter = createSmtpTransporter(config)
    const senderString = `"${config.fromName}" <${config.fromEmail}>`

    const info = await transporter.sendMail({
      from: senderString,
      to: toEmail,
      replyTo: email,
      subject: `New Project Inquiry: ${name} — Sylen Design`,
      html: htmlContent,
    })

    return {
      success: true,
      messageId: info.messageId,
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    const sanitizedError = errorMessage
      .replace(new RegExp(config.pass, 'g'), '***')
      .slice(0, 300)

    console.error('[Hostinger SMTP Studio Notification Error]:', sanitizedError)
    return {
      success: false,
      error: sanitizedError,
    }
  }
}

/**
 * 2. Visitor Acknowledgement Email:
 * Sends an automated branded confirmation to the client acknowledging receipt of their project brief.
 */
export async function sendVisitorAcknowledgementEmail(params: EnquiryEmailParams): Promise<SendResult> {
  const config = getSmtpConfig()

  if (!config) {
    return {
      success: false,
      skipped: true,
      reason: 'missing_smtp_credentials',
      error: 'Hostinger SMTP credentials (SMTP_PASS) not configured.',
    }
  }

  const { name, email, projectType } = params

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>We've received your enquiry — Sylen Design</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #121110; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #f4efe6;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #181614; border: 1px solid rgba(244, 239, 230, 0.12); border-radius: 8px; overflow: hidden;">
    <!-- Header -->
    <tr>
      <td style="padding: 36px 36px 28px; border-bottom: 1px solid rgba(244, 239, 230, 0.08); background-color: #141311;">
        <span style="font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: #d9b686; font-weight: 600; display: block; margin-bottom: 8px;">SYLEN DESIGN · ARCHITECTURE &amp; SPATIAL PRACTICE</span>
        <h1 style="margin: 0; font-family: Georgia, serif; font-size: 26px; font-weight: 400; color: #fbf9f4; letter-spacing: -0.01em; line-height: 1.3;">
          We've received your enquiry
        </h1>
      </td>
    </tr>

    <!-- Body Info -->
    <tr>
      <td style="padding: 32px 36px 24px; line-height: 1.7; font-size: 14.5px; color: #e6dfd3;">
        <p style="margin: 0 0 16px; font-size: 15px; color: #fbf9f4;">
          Dear ${name},
        </p>
        <p style="margin: 0 0 16px;">
          Thank you for reaching out to <strong>Sylen Design</strong>. We have successfully received your project inquiry${projectType ? ` regarding <strong>${projectType}</strong>` : ''}.
        </p>
        <p style="margin: 0 0 20px;">
          Our studio reviews each commission carefully, considering the spatial context, light, and materiality that define every lasting structure. A member of our team will review your brief and contact you shortly to discuss next steps.
        </p>

        <div style="margin: 24px 0; padding: 18px 24px; background-color: #121110; border-left: 2px solid #d9b686; border-radius: 4px;">
          <p style="margin: 0; font-size: 13.5px; color: #a19a8e; line-height: 1.6;">
            If you have any supplementary drawings, site documents, or references you wish to share in the meantime, feel free to reply directly to this email or write to us at <a href="mailto:sylen@sdesign.co.in" style="color: #d9b686; text-decoration: none;">sylen@sdesign.co.in</a>.
          </p>
        </div>

        <p style="margin: 24px 0 0; color: #a19a8e; font-size: 13.5px;">
          Warm regards,<br>
          <strong style="color: #fbf9f4; font-family: Georgia, serif; font-size: 15px;">Sylen Design</strong><br>
          <span style="font-size: 12px; color: #7c7367;">Architecture · Interiors · Spatial Environments · Kerala, India</span>
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 20px 36px; background-color: #141311; border-top: 1px solid rgba(244, 239, 230, 0.08); text-align: center; font-size: 11px; color: #7c7367; line-height: 1.5;">
        Sylen Design · <a href="https://sylendesign.com" style="color: #7c7367; text-decoration: none;">https://sylendesign.com</a> · <a href="mailto:sylen@sdesign.co.in" style="color: #7c7367; text-decoration: none;">sylen@sdesign.co.in</a>
      </td>
    </tr>
  </table>
</body>
</html>
  `

  try {
    const transporter = createSmtpTransporter(config)
    const senderString = `"${config.fromName}" <${config.fromEmail}>`

    const info = await transporter.sendMail({
      from: senderString,
      to: email, // Visitor recipient
      replyTo: config.studioNotificationEmail,
      subject: `We've received your enquiry — Sylen Design`,
      html: htmlContent,
    })

    return {
      success: true,
      messageId: info.messageId,
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    const sanitizedError = errorMessage
      .replace(new RegExp(config.pass, 'g'), '***')
      .slice(0, 300)

    console.error('[Hostinger SMTP Visitor Acknowledgement Error]:', sanitizedError)
    return {
      success: false,
      error: sanitizedError,
    }
  }
}

/**
 * 3. Unified Enquiry Notification Dispatcher:
 * Coordinates studio notification and visitor acknowledgement.
 */
export async function sendEnquiryNotificationEmail(params: EnquiryEmailParams): Promise<{
  success: boolean
  studioDelivered: boolean
  visitorDelivered: boolean
  studioMessageId?: string
  visitorMessageId?: string
  error?: string
  skipped?: boolean
  reason?: string
}> {
  // 1. Studio notification
  const studioResult = await sendStudioNotificationEmail(params)

  // 2. Visitor acknowledgement
  let visitorResult: SendResult = { success: false, skipped: true }
  if (params.email && params.email.includes('@')) {
    visitorResult = await sendVisitorAcknowledgementEmail(params)
  }

  return {
    success: studioResult.success || visitorResult.success,
    studioDelivered: studioResult.success,
    visitorDelivered: visitorResult.success,
    studioMessageId: studioResult.messageId,
    visitorMessageId: visitorResult.messageId,
    skipped: studioResult.skipped,
    reason: studioResult.reason,
    error: studioResult.error || visitorResult.error,
  }
}
