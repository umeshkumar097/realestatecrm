import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`

  await transporter.sendMail({
    from: `"PropGOCrm Global" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Reset your password",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 16px;">
        <h2 style="color: #1e293b; font-weight: 800; margin-bottom: 16px;">Password Reset Request</h2>
        <p style="color: #475569; line-height: 1.6;">Someone requested a password reset for your account. If this was you, click the button below to set a new password. This link expires in 1 hour.</p>
        <div style="margin: 32px 0;">
          <a href="${resetLink}" style="background-color: #0F172A; color: white; padding: 12px 24px; text-decoration: none; font-weight: 700; border-radius: 8px; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #94a3b8; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
        <p style="color: #94a3b8; font-size: 12px; text-align: center;">PropGOCrm © 2026</p>
      </div>
    `,
  })
}

export const sendPlatformLeadNotification = async (data: any) => {
  const { name, email, phone, company, message, plan } = data

  // Admin Notification
  await transporter.sendMail({
    from: `"PropGOCrm Platform" <${process.env.SMTP_USER}>`,
    to: process.env.SMTP_USER,
    subject: `New ${plan} Inquiry: ${name}`,
    html: `
      <h2>New Enterprise Inquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Company:</strong> ${company || 'N/A'}</p>
      <p><strong>Message:</strong> ${message || 'N/A'}</p>
    `,
  })

  // User Confirmation
  await transporter.sendMail({
    from: `"PropGOCrm Support" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Thank you for your interest!`,
    html: `
      <h2>We've Received Your Request</h2>
      <p>Hi ${name},</p>
      <p>Thanks for reaching out about the ${plan} plan. Our team will contact you shortly.</p>
    `,
  })
}
