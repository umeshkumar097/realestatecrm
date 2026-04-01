import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail, emailWrapper } from "@/lib/mail";

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
    
    if (!isCron && process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
        
        // Window of 24h around that target
        const startOfWindow = new Date(threeDaysFromNow.getFullYear(), threeDaysFromNow.getMonth(), threeDaysFromNow.getDate(), 0, 0, 0);
        const endOfWindow = new Date(threeDaysFromNow.getFullYear(), threeDaysFromNow.getMonth(), threeDaysFromNow.getDate(), 23, 59, 59);

        // 1. Fetch Subscriptions ending in 3 days
        const targetSubscriptions = await (prisma as any).subscription.findMany({
            where: {
                status: "ACTIVE",
                currentPeriodEnd: {
                    gte: startOfWindow,
                    lte: endOfWindow
                }
            },
            include: {
                agency: {
                    include: { 
                        plan: true,
                        users: { where: { role: "AGENCY_OWNER" }, take: 1 }
                    }
                }
            }
        });

        let reminderCount = 0;

        for (const sub of targetSubscriptions) {
            const recipient = sub.agency.billingEmail || sub.agency.users?.[0]?.email;
            if (!recipient) continue;

            const isLifetime = !sub.stripeSubscriptionId;
            const amount = isLifetime ? 0 : (sub.agency.plan?.monthlyPrice || 0);

            const content = `
                <p>Hello <span class="highlight">${sub.agency.name}</span> Admin,</p>
                <p>This is a friendly reminder that your <span class="highlight">${sub.plan}</span> subscription is scheduled for renewal in <span class="highlight">3 days</span>.</p>
                
                <div style="background-color: #f8fafc; padding: 24px; border-radius: 16px; margin: 24px 0; border: 1px dashed #cbd5e1;">
                    <p style="margin: 0; font-size: 14px; color: #64748b;">Upcoming Billing Details:</p>
                    <p style="margin: 8px 0 0 0; font-weight: bold; color: #1e293b;">Plan: ${sub.plan}</p>
                    <p style="margin: 4px 0 0 0; font-weight: bold; color: #1e293b;">Renewal Date: ${sub.currentPeriodEnd?.toLocaleDateString()}</p>
                    <p style="margin: 4px 0 0 0; font-weight: bold; color: #2563eb;">Estimated Amount: ₹${amount.toLocaleString()}</p>
                </div>

                <p>An automated invoice will be generated and dispatched on the day of renewal. If you wish to upgrade, downgrade, or update your GST details, please visit your Agency Command Center.</p>

                <div style="text-align: center; margin: 32px 0;">
                    <a href="${process.env.NEXTAUTH_URL}/dashboard/billing" class="button">Manage Billing</a>
                </div>

                <p style="font-size: 13px; color: #64748b;">If you need assistance with your commercial account, please contact our financial desk at billing@aiclex.com.</p>
            `;

            await sendEmail({
                to: recipient,
                subject: `🔔 Billing Reminder: Your ${sub.plan} Renewal is in 3 Days`,
                html: emailWrapper(content, "Upcoming Renewal Reminder")
            });

            reminderCount++;
        }

        return NextResponse.json({
            success: true,
            message: `Dispatch Cycle Complete. Reminders Sent: ${reminderCount}`,
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        console.error("[Reminder Cron Failed]:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
