import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendEmail, emailWrapper } from "@/lib/mail"

/**
 * EMI Reminder CRON
 * Scans for installments due in next 3 days and alerts agents.
 * Triggered via secure request or Vercel Cron.
 */
export async function GET(req: NextRequest) {
  // Security check: Only allow authorized cron triggers
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const threeDaysFromNow = new Date()
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)

    // 1. Find pending installments due soon
    const upcomingDues = await prisma.installment.findMany({
      where: {
        status: "PENDING",
        dueDate: {
          lte: threeDaysFromNow,
          gte: new Date() // Don't alert for past ones here (handeled separately or by overdue report)
        }
      },
      include: {
        emi: {
          include: {
            lead: { select: { name: true, phone: true } },
            agency: {
              include: {
                // Find ADMIN or assigned agent to notify
                // For simplicity, we notify all ADMINs of that agency for now
              }
            }
          }
        }
      }
    })

    let alertsSent = 0

    // 2. Group by Agency to send consolidated alerts if possible, 
    // or send one per installment for immediate action.
    for (const due of upcomingDues) {
        const agencyId = due.emi.agencyId
        const admins = await prisma.user.findMany({
            where: { agencyId, role: "ADMIN" },
            select: { email: true, name: true }
        })

        for (const admin of admins) {
            const content = `
                <p>Hello <span class="highlight">${admin.name}</span>,</p>
                <p>This is a proactive alert for an **Upcoming EMI Payment** for your agency.</p>
                
                <div style="background-color: #f8fafc; padding: 24px; border-radius: 16px; margin: 24px 0; border: 1px solid #e2e8f0;">
                    <p style="margin: 0; font-size: 10px; font-weight: 800; color: #2563eb; uppercase; tracking: 0.1em;">FINANCIAL ALERT: DUE SOON</p>
                    <p style="margin: 12px 0 0 0; font-weight: bold; color: #1e293b;">Client: ${due.emi.lead.name}</p>
                    <p style="margin: 4px 0 0 0; font-weight: bold; color: #1e293b;">Amount: ₹${due.amount.toLocaleString()}</p>
                    <p style="margin: 4px 0 0 0; font-weight: bold; color: #ef4444;">Due Date: ${due.dueDate.toLocaleDateString()}</p>
                    <p style="margin: 4px 0 0 0; font-size: 11px; color: #64748b;">Plot: #${due.emi.plotNumber}</p>
                </div>

                <p>Please ensure the client is notified and the payment is collected to maintain an active plan status. You can record the payment directly in your dashboard.</p>
                
                <div style="text-align: center; margin: 32px 0;">
                  <a href="${process.env.NEXTAUTH_URL}/dashboard/emis" style="display: inline-block; padding: 16px 32px; background-color: #2563eb; color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: bold;">View EMI Dashboard</a>
                </div>
            `

            await sendEmail({
                to: admin.email,
                subject: `🚨 Financial Alert: EMI Due for ${due.emi.lead.name}`,
                html: emailWrapper(content, "Upcoming Payment Reminder")
            })
            alertsSent++
        }
    }

    return NextResponse.json({ 
        success: true, 
        alertsSent,
        message: `Dispatched ${alertsSent} reminders for ${upcomingDues.length} installments.` 
    })

  } catch (error: any) {
    console.error("[CRON EMI Error]:", error)
    return NextResponse.json({ error: "Reminder dispatch failed", details: error.message }, { status: 500 })
  }
}
