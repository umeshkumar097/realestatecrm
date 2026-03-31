import { emailWrapper } from "./mail";

export const getVerificationEmail = (name: string, token: string) => emailWrapper(`
  <p>Hello ${name},</p>
  <p>Thank you for choosing PropGoCRM! Your professional real estate workspace is almost ready.</p>
  <p>Please use the following verification code to activate your account and access your dashboard:</p>
  <div style="background: #f8fafc; border: 2px dashed #cbd5e1; padding: 32px; border-radius: 24px; text-align: center; margin: 32px 0;">
    <span style="font-size: 36px; font-weight: 900; letter-spacing: 0.3em; color: #2563eb;">${token}</span>
  </div>
  <p style="font-size: 14px; color: #64748b;">This code will expire in 24 hours. If you did not request this, please ignore this email.</p>
`, "Verify Your Account");

export const getWelcomeEmail = (name: string, agencyName: string) => emailWrapper(`
  <p>Hello ${name},</p>
  <p>Welcome to the future of real estate management. Your agency, <strong>${agencyName}</strong>, is now active on PropGoCRM.</p>
  <p>Here are your first steps to success:</p>
  <ul style="padding-left: 20px;">
    <li><strong>Sync Portals</strong>: Connect your Bayut, Property Finder, or Zillow accounts.</li>
    <li><strong>Invite Team</strong>: Add your top agents to your workspace.</li>
    <li><strong>Automate Leads</strong>: Set up your first WhatsApp automation flow.</li>
  </ul>
  <div style="text-align: center; margin-top: 40px;">
    <a href="https://propgocrm.com/dashboard" style="display: inline-block; padding: 18px 36px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 16px; font-weight: 900; font-size: 16px; box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.2);">Explore Your Dashboard</a>
  </div>
`, "Welcome to PropGoCRM! 🚀");

export const getEnterpriseInquiryEmail = (leadName: string, company: string, email: string, phone: string, message: string) => emailWrapper(`
  <p>A new high-value enterprise inquiry has been received through the PropGoCRM marketing site.</p>
  <div style="background: #f1f5f9; padding: 30px; border-radius: 20px; margin: 24px 0;">
    <p style="margin: 5px 0;"><strong>Name:</strong> ${leadName}</p>
    <p style="margin: 5px 0;"><strong>Company:</strong> ${company}</p>
    <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
    <p style="margin: 5px 0;"><strong>Phone:</strong> ${phone}</p>
    <p style="margin: 20px 0 5px 0;"><strong>Message:</strong></p>
    <p style="font-style: italic; color: #475569;">"${message}"</p>
  </div>
  <p>Please contact this lead within the next 2 hours for maximum conversion.</p>
`, "New Enterprise Lead - PropGoCRM");

export const getTicketAcknowledgmentEmail = (name: string, ticketId: string, subject: string) => emailWrapper(`
  <p>Hello ${name},</p>
  <p>We've received your support request. Our engineering team is currently looking into it.</p>
  <div style="border-left: 4px solid #2563eb; padding-left: 20px; margin: 24px 0;">
    <p style="margin: 0;"><strong>Ticket ID:</strong> #${ticketId}</p>
    <p style="margin: 5px 0 0 0;"><strong>Subject:</strong> ${subject}</p>
  </div>
  <p>You can track the progress of this ticket directly from your agency support portal.</p>
`, "Support Ticket Received");

export const getPurchaseConfirmationEmail = (name: string, planName: string, amount: string) => emailWrapper(`
  <p>Hello ${name},</p>
  <p>Success! Your subscription to the <strong>${planName}</strong> plan has been confirmed.</p>
  <div style="background: #ecfdf5; border: 1px solid #10b981; padding: 24px; border-radius: 20px; margin: 24px 0;">
    <p style="margin: 0; color: #065f46; font-weight: bold;">Payment Successful</p>
    <p style="margin: 5px 0 0 0; color: #059669;">Amount: ${amount}</p>
  </div>
  <p>Your premium features are now unlocked. Go ahead and dominate the market!</p>
`, "Subscription Confirmed 💳");
