import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const BRIDGE_SECRET = process.env.WHATSAPP_BRIDGE_SECRET || "Umesh_WA_Bridge_2003";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-bridge-secret");
  
  if (secret !== BRIDGE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { agentId, contact, content, timestamp, pushName } = await req.json();
  
  if (!contact || !content) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Normalize phone number (handle @s.whatsapp.net OR @lid)
  const phone = contact.split("@")[0].replace(/\D/g, "");

  try {
    // 1. Find or Create Lead based on phone
    // Note: In a production CRM, you would check for the agencyId as well.
    let lead = await prisma.lead.findFirst({
      where: { phone: { contains: phone } }
    });

    if (!lead) {
      // Create a temporary lead for the incoming unknown contact
      lead = await prisma.lead.create({
        data: {
          name: pushName || `New Client (${phone})`,
          phone: phone,
          status: "NEW",
          source: "WHATSAPP",
          notes: "Auto-created from inbound WhatsApp message.",
          assignedToId: agentId || null,
          agencyId: "root" // Defaulting to root if unknown
        }
      });
    }

    // 2. Save Message
    const message = await prisma.message.create({
      data: {
        content: content,
        fromMe: false,
        timestamp: new Date(timestamp * 1000),
        leadId: lead.id,
        agencyId: lead.agencyId,
      }
    });

    return NextResponse.json({ success: true, messageId: message.id });
  } catch (error: any) {
    console.error("Webhook Processing Error:", error);
    return NextResponse.json({ error: "Internal processing error" }, { status: 500 });
  }
}
