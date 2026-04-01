import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const BRIDGE_URL = process.env.WHATSAPP_BRIDGE_URL || "http://137.184.114.109";
const BRIDGE_SECRET = process.env.WHATSAPP_BRIDGE_SECRET || "Umesh_WA_Bridge_2003";

export async function GET(req: NextRequest) {
  const sevenDaysFromNow = new Date()
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
  const endOfDay = new Date(sevenDaysFromNow)
  endOfDay.setHours(23,59,59,999)

  const upcomingEmis = await prisma.eMI.findMany({
    where: {
      expiryDate: { gte: sevenDaysFromNow, lte: endOfDay },
      status: "ACTIVE"
    },
    include: { lead: true, agency: true }
  })

  let count = 0
  for (const emi of upcomingEmis) {
    try {
      const message = `🔔 *EMI Reminder — ${emi.agency.name}*\n\nHi ${emi.lead.name}, this is a friendly reminder for EMI Plot #${emi.plotNumber}.\n\nAmount: ₹${emi.totalPrice.toLocaleString()}\n\nDate: ${emi.expiryDate.toLocaleDateString()}`
      
      if (emi.lead.assignedToId) {
        const res = await fetch(`${BRIDGE_URL}/send`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "x-bridge-secret": BRIDGE_SECRET 
            },
            body: JSON.stringify({ agentId: emi.lead.assignedToId, phone: emi.lead.phone, message })
        })
        if (res.ok) count++
      }
    } catch (err) { console.error("Reminder Error:", err) }
  }

  return NextResponse.json({ message: `Processed ${upcomingEmis.length} EMIs. Sent ${count} reminders.`, count })
}
