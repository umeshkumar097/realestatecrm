import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

import { processWhatsAppLead } from "@/lib/ai/extractor"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { agentId, agencyId, leadId, message, phone } = body

    if (!leadId || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // 1. Process Lead via AI Extraction Engine
    const { extracted } = await processWhatsAppLead(leadId, message)

    return NextResponse.json({
      success: true,
      extracted
    })
  } catch (err) {
    console.error(`[WHATSAPP WEBHOOK ERROR]`, err)
    return NextResponse.json({ error: "Internal Error" }, { status: 500 })
  }
}
