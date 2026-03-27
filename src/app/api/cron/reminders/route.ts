import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { baileysManager } from "@/lib/whatsapp/baileys-manager"

/**
 * Endpoint to trigger EMI reminders. 
 * Should be called by a CRON job every day.
 */
export async function GET(req: NextRequest) {
  // In production, add a secret header check for security
  
  const sevenDaysFromNow = new Date()
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
  
  const today = new Date()
  today.setHours(0,0,0,0)
  
  const endOfDay = new Date(sevenDaysFromNow)
  endOfDay.setHours(23,59,59,999)

  // Find EMIs expiring in exactly 7 days
  const upcomingEmis = await prisma.eMI.findMany({
    where: {
      expiryDate: {
        gte: sevenDaysFromNow,
        lte: endOfDay
      },
      status: "ACTIVE"
    },
    include: {
      lead: true,
      agency: true
    }
  })

  let count = 0
  for (const emi of upcomingEmis) {
    // 1. Send WhatsApp Reminder (if bot is connected)
    try {
      const message = `🔔 *EMI Reminder — ${emi.agency.name}*\n\nHi ${emi.lead.name}, this is a friendly reminder that your EMI for Plot #${emi.plotNumber} is due in 7 days (${emi.expiryDate.toLocaleDateString()}). \n\nAmount: ₹${emi.totalPrice.toLocaleString()}\n\nPlease ensure timely payment to avoid penalties.`
      
      // We need an agentId to send from. We'll use the one the lead is assigned to.
      if (emi.lead.assignedToId) {
        await baileysManager.sendMessage(emi.lead.assignedToId, emi.lead.phone, message)
        count++
      }
    } catch (err) {
      console.error(`Failed to send reminder for EMI ${emi.id}:`, err)
    }
  }

  return NextResponse.json({ 
    message: `Processed ${upcomingEmis.length} upcoming EMIs. Sent ${count} reminders.`,
    count 
  })
}
