import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { agencyId, role, id: userId } = session.user as any
  const { searchParams } = new URL(req.url)
  const leadId = searchParams.get("leadId")

  try {
    const where: any = { agencyId }
    
    // RBAC: Agents only see EMIs for their assigned leads
    if (role === "AGENT") {
      where.lead = { assignedToId: userId }
    }

    if (leadId) {
      where.leadId = leadId
    }

    const [emis, dueSoon] = await Promise.all([
      prisma.eMI.findMany({
        where,
        include: {
          lead: { select: { name: true, phone: true, assignedToId: true } },
          project: { select: { name: true } }
        },
        orderBy: { startDate: "desc" }
      }),
      prisma.installment.count({
        where: {
          emi: where, // Use the same filtered where clause for due soon counts
          status: "PENDING",
          dueDate: {
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ])

    return NextResponse.json({ emis, dueSoon })
  } catch (error: any) {
    console.error("[EMI API Error]:", error)
    return NextResponse.json({ 
      error: "Internal Server Error", 
      details: error.message,
      emis: [],
      dueSoon: 0
    }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = session.user as any
  const agencyId = user.agencyId
  const body = await req.json()

  const { 
      leadId, projectId, plotNumber, plotRate, totalPrice, planDetails, 
      startDate, frequency, totalInstallments, installmentAmount 
  } = body

  if (!leadId || !projectId || !plotNumber || !plotRate || !totalPrice || !startDate || !totalInstallments || !installmentAmount) {
    return NextResponse.json({ error: "Missing required fields for Automated EMI creation" }, { status: 400 })
  }

  try {
      const result = await prisma.$transaction(async (tx) => {
          // 1. Calculate Expiry Date based on frequency and count
          const start = new Date(startDate)
          const count = parseInt(totalInstallments)
          const monthsToAdd = frequency === "QUARTERLY" ? count * 3 : count
          const expiryDate = new Date(start)
          expiryDate.setMonth(expiryDate.getMonth() + monthsToAdd)

          // 2. Create the Master EMI Record
          const emi = await tx.eMI.create({
              data: {
                  leadId,
                  projectId,
                  plotNumber: String(plotNumber),
                  plotRate: parseFloat(String(plotRate)),
                  totalPrice: parseFloat(String(totalPrice)),
                  installmentAmount: parseFloat(String(installmentAmount)),
                  totalInstallments: count,
                  frequency,
                  planDetails,
                  startDate: start,
                  expiryDate: expiryDate,
                  nextDueDate: start, // First payment due on start date
                  agencyId
              }
          })

          // 3. Generate individual Installment records
          const installmentsData = []
          for (let i = 0; i < count; i++) {
              const dueDate = new Date(start)
              const interval = frequency === "QUARTERLY" ? 3 : 1
              dueDate.setMonth(dueDate.getMonth() + (i * interval))

              installmentsData.push({
                  emiId: emi.id,
                  amount: parseFloat(String(installmentAmount)),
                  dueDate: dueDate,
                  status: "PENDING"
              })
          }

          await tx.installment.createMany({
              data: installmentsData
          })

          // 4. Transform Lead Status
          await tx.lead.update({
            where: { id: leadId },
            data: { status: "CONVERTED" }
          })

          return emi
      })

      // --- WhatsApp Notification (Async/Non-blocking) ---
      const BRIDGE_URL = process.env.WHATSAPP_BRIDGE_URL || "http://137.184.114.109"
      const BRIDGE_SECRET = process.env.WHATSAPP_BRIDGE_SECRET || "Umesh_WA_Bridge_2003"
      
      const userId = user.id

      // Trigger notification without awaiting to keeping UI fast
      ;(async () => {
          try {
              console.log(`[WA Notification] Proceeding for user: ${userId}, lead: ${leadId}`);
              const [leadRecord, projectRecord] = await Promise.all([
                  prisma.lead.findUnique({ where: { id: leadId }, select: { name: true, phone: true } }),
                  prisma.project.findUnique({ where: { id: projectId }, select: { name: true } })
              ])

              if (leadRecord && projectRecord) {
                  const cleanPhone = leadRecord.phone.replace(/\D/g, "")
                  const formattedDate = new Date(startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                  
                  const messageText = `Hello ${leadRecord.name || 'Ji'},\n` +
                      `Aapka EMI plan for *${projectRecord.name}* (Plot #${plotNumber}) successfully set up ho gaya hai. 🙏\n\n` +
                      `📊 Plan Details:\n` +
                      `- Total Price: ₹${parseFloat(String(totalPrice)).toLocaleString('en-IN')}\n` +
                      `- Installment: ₹${parseFloat(String(installmentAmount)).toLocaleString('en-IN')} (${frequency})\n` +
                      `- Start Date: ${formattedDate}\n\n` +
                      `Aapka din shubh ho! ✨`

                  console.log(`[WA Notification] Sending to ${cleanPhone} via ${BRIDGE_URL}`);
                  
                  const res = await fetch(`${BRIDGE_URL}/send`, {
                      method: "POST",
                      headers: { 
                          "Content-Type": "application/json",
                          "x-bridge-secret": BRIDGE_SECRET 
                      },
                      body: JSON.stringify({ agentId: userId, phone: cleanPhone, message: messageText })
                  })

                  if (res.ok) {
                      await prisma.message.create({
                          data: {
                              content: messageText,
                              fromMe: true,
                              status: "SENT" as any,
                              leadId: leadId,
                              agencyId: agencyId,
                              senderId: userId
                          }
                      })
                      console.log(`[WA Notification] Success for ${cleanPhone}`);
                  } else {
                      const errorBody = await res.text();
                      console.error(`[WA Notification] Failed: ${res.status} - ${errorBody}`);
                  }
              }
          } catch (notificationErr) {
              console.error("[EMI Notification Trigger Error]:", notificationErr)
          }
      })()

      return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
      console.error("[EMI Creation Error Details]:", error)
      return NextResponse.json({ 
          error: "Failed to create financial schedule", 
          details: error.message,
          code: error.code 
      }, { status: 500 })
  }
}
