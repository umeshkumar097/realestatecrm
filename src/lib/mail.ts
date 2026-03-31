import nodemailer from "nodemailer";
import { getVerificationEmail, getEnterpriseInquiryEmail } from "./email-templates";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: true, // Use SSL for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailOptions) => {
  try {
    const info = await transporter.sendMail({
      from: `"PropGoCRM" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`[Mail] Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("[Mail] Error sending email:", error);
    return { success: false, error };
  }
};

/**
 * Common HTML Wrapper for PropGoCRM Branding
 */
export const emailWrapper = (content: string, title: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #e2e8f0; }
    .header { background-color: #020617; padding: 40px; text-align: center; }
    .content { padding: 40px; color: #1e293b; line-height: 1.6; }
    .footer { padding: 30px; background-color: #f1f5f9; text-align: center; color: #64748b; font-size: 12px; }
    .button { display: inline-block; padding: 16px 32px; background-color: #2563eb; color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: bold; margin-top: 20px; }
    .logo-text { color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.02em; }
    .accent { color: #10b981; }
    .highlight { color: #2563eb; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-text">PropGo<span class="accent">CRM</span></div>
    </div>
    <div class="content">
      <h1 style="font-size: 24px; font-weight: 800; margin-bottom: 24px; color: #0f172a;">${title}</h1>
      ${content}
    </div>
    <div class="footer">
      <p>© 2026 PropGoCRM Global. Powered by Aiclex Technologies.</p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Enterprise/Marketing Lead Notification
 */
export const sendPlatformLeadNotification = async (data: any) => {
  const adminEmail = process.env.SMTP_USER; // Send to super-admin
  const html = getEnterpriseInquiryEmail(data.name, data.company || "N/A", data.email, data.phone, data.message || "No message provided");
  
  return sendEmail({
    to: adminEmail!,
    subject: `🚀 New Enterprise Lead: ${data.name}`,
    html,
  });
};

/**
 * Verification Email
 */
export const sendVerificationEmail = async (email: string, name: string, token: string) => {
  const html = getVerificationEmail(name, token);
  return sendEmail({
    to: email,
    subject: "Action Required: Verify your PropGoCRM Account",
    html,
  });
};

/**
 * Password Reset Email
 */
export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  const html = emailWrapper(`
    <p>A password reset was requested for your PropGoCRM account.</p>
    <p>Please click the button below to reset your password:</p>
    <div style="text-align: center; margin: 32px 0;">
      <a href="${resetUrl}" class="button">Reset Password</a>
    </div>
    <p>This link will expire in 1 hour.</p>
    <p>If you did not request this, please ignore this email.</p>
  `, "Reset Your Password");

  return sendEmail({
    to: email,
    subject: "Reset your PropGoCRM Password",
    html,
  });
};
