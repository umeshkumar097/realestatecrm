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

const APP_URL = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "https://propgocrm.com";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailOptions) => {
  try {
    const info = await transporter.sendMail({
      from: `"Master Real Estate Matrix" <${process.env.SMTP_USER}>`,
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
 * Common HTML Wrapper for Master Real Estate Matrix Branding
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
      <div class="logo-text">Master Matrix Registry</div>
    </div>
    <div class="content">
      <h1 style="font-size: 24px; font-weight: 800; margin-bottom: 24px; color: #0f172a;">${title}</h1>
      ${content}
    </div>
    <div class="footer">
      <p>© 2026 Master Real Estate Matrix Global. Powered by Aiclex Labs.</p>
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
    subject: "Action Required: Verify your Master Real Estate Matrix Account",
    html,
  });
};

/**
 * Password Reset Email
 */
export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;
  const html = emailWrapper(`
    <p>A password reset was requested for your Master Real Estate Matrix account.</p>
    <p>Please click the button below to reset your password:</p>
    <div style="text-align: center; margin: 32px 0;">
      <a href="${resetUrl}" class="button">Reset Password</a>
    </div>
    <p>This link will expire in 1 hour.</p>
    <p>If you did not request this, please ignore this email.</p>
  `, "Reset Your Password");

  return sendEmail({
    to: email,
    subject: "Reset your Master Real Estate Matrix Password",
    html,
  });
};

/**
 * Staff Invitation Email
 */
export const sendStaffInvitationEmail = async (email: string, name: string, agencyName: string, password?: string) => {
  const loginUrl = `${APP_URL}/login`;
  const verifyUrl = `${APP_URL}/verify-email?email=${encodeURIComponent(email)}`;
  
  const content = `
    <p>Hello <span class="highlight">${name}</span>,</p>
    <p>You have been invited to join <span class="highlight">${agencyName}</span> as an Agent on the Master Real Estate Matrix platform.</p>
    
    <div style="background-color: #f8fafc; padding: 24px; border-radius: 16px; margin: 24px 0; border: 1px dashed #cbd5e1;">
      <p style="margin: 0; font-size: 14px; color: #64748b;">Temporary Credentials:</p>
      <p style="margin: 8px 0 0 0; font-weight: bold; color: #1e293b;">Email: ${email}</p>
      ${password ? `<p style="margin: 4px 0 0 0; font-weight: bold; color: #1e293b;">Password: ${password}</p>` : ""}
    </div>

    <p>Please click the button below to verify your email and activate your access:</p>
    <div style="text-align: center; margin: 32px 0;">
      <a href="${verifyUrl}" class="button">Verify Email & Activate</a>
    </div>

    <p style="font-size: 13px; color: #64748b;">If you already have a Master Real Estate Matrix account, you can simply <a href="${loginUrl}" class="highlight">Login here</a>. After verification, we recommend changing your password immediately.</p>
  `;

  return sendEmail({
    to: email,
    subject: `🚀 Invitation: Join ${agencyName} on Master Real Estate Matrix`,
    html: emailWrapper(content, "Staff Invitation"),
  });
};

/**
 * Membership Upgrade Confirmation
 */
export const sendMembershipUpgradeEmail = async (email: string, planName: string, isLifetime: boolean = false) => {
  const loginUrl = `${APP_URL}/login`;
  
  const content = `
    <p>Great news! Your account has been upgraded to the <span class="highlight">${planName}</span> plan Tier.</p>
    
    <div style="background-color: #f8fafc; padding: 24px; border-radius: 16px; margin: 24px 0; border: 1px dashed #cbd5e1;">
        <p style="margin: 0; font-size: 14px; text-align: center;">🛡️ Account Status: <span style="font-weight: 800; color: #10b981;">ACTIVE</span></p>
        <p style="margin: 8px 0 0 0; text-align: center; font-weight: bold; color: #1e293b;">Plan: ${planName}</p>
        ${isLifetime ? `<p style="margin: 4px 0 0 0; text-align: center; font-weight: 800; color: #2563eb; letter-spacing: 0.1em;">LIFETIME ACCESS GRANTED 💎</p>` : ""}
    </div>

    <p>This upgrade unlocks advanced real estate automation, higher agent seat limits, and premium analytics for your agency. You can now access all features associated with this plan.</p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${loginUrl}" class="button">Go to Dashboard</a>
    </div>

    <p style="font-size: 13px; color: #64748b;">If you need a detailed breakdown of your new features, visit the <span class="highlight">Billing</span> section in your agency command center.</p>
  `;

  return sendEmail({
    to: email,
    subject: `💎 Plan Upgraded: Welcome to ${planName} Access!`,
    html: emailWrapper(content, "Plan Upgrade Successful"),
  });
};

/**
 * Member Lifecycle Notification (To Admin)
 */
export const sendMemberUpdateNotification = async (adminEmail: string, memberData: { name: string, email: string }, action: 'ADDED' | 'DELETED', agencyName: string) => {
  const isAdded = action === 'ADDED';
  const color = isAdded ? "#10b981" : "#ef4444";
  
  const content = `
    <p>A member lifecycle event has been recorded for <span class="highlight">${agencyName}</span>.</p>
    
    <div style="background-color: #f8fafc; padding: 24px; border-radius: 16px; margin: 24px 0; border: 1px solid #e2e8f0;">
        <p style="margin: 0; font-size: 10px; font-weight: 800; uppercase; tracking: 0.1em; color: ${color};">${action} MEMBER REPORT</p>
        <p style="margin: 12px 0 0 0; font-weight: bold; color: #1e293b;">Name: ${memberData.name}</p>
        <p style="margin: 4px 0 0 0; font-weight: bold; color: #1e293b;">Email: ${memberData.email}</p>
    </div>

    <p>${isAdded ? "The agent has been successfully invited and will appear in your fleet once they verify their identity." : "The member's access has been purged and they can no longer access your agency dashboard."}</p>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `🛡️ Security Alert: Member ${isAdded ? 'Added' : 'Removed'} from ${agencyName}`,
    html: emailWrapper(content, `Member ${isAdded ? 'Onboarded' : 'Offboarded'}`),
  });
};

/**
 * Password Reset Success Notification
 */
export const sendPasswordResetSuccessEmail = async (email: string, name: string) => {
  const content = `
    <p>Hello <span class="highlight">${name}</span>,</p>
    <p>This is a security confirmation that the password for your Master Real Estate Matrix account has been **successfully updated**.</p>
    
    <div style="background-color: #ecfdf5; padding: 24px; border-radius: 16px; margin: 24px 0; border: 1px solid #10b981;">
        <p style="margin: 0; font-weight: bold; color: #065f46; text-align: center;">Shield Verified: Credentials Updated</p>
    </div>

    <p>If you did not perform this change, please contact our security team immediately at <span class="highlight">security@propgocrm.com</span> to lock your account.</p>
  `;

  return sendEmail({
    to: email,
    subject: "🛡️ Security Alert: Password Updated Successfully",
    html: emailWrapper(content, "Password Changed Successfully"),
  });
};
