import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const BRIDGE_SECRET = process.env.WHATSAPP_BRIDGE_SECRET || "Umesh_WA_Bridge_2003";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-bridge-secret");
  
  if (secret !== BRIDGE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type, agentId, whatsappId, contact, content, timestamp, pushName, status, messages } = await req.json();
  
  if (type === "status") {
    if (!whatsappId || !status) return NextResponse.json({ error: "Missing status data" }, { status: 400 });
    await prisma.message.updateMany({
      where: { whatsappId },
      data: { status }
    });
    return NextResponse.json({ success: true });
  }

  if (type === "batch_history") {
    if (!messages || !Array.isArray(messages)) return NextResponse.json({ error: "Invalid batch" }, { status: 400 });
    
    // Process history in background (don't block the bridge too long)
    (async () => {
        for (const m of messages) {
            const phone = m.contact.split("@")[0].replace(/\D/g, "");
            let lead = await prisma.lead.findFirst({ where: { phone: { contains: phone } } });
            if (!lead) {
                lead = await prisma.lead.create({
                    data: {
                        name: m.pushName || `Client (${phone})`,
                        phone: phone,
                        status: "NEW",
                        source: "WHATSAPP",
                        agencyId: "root"
                    }
                });
            }
            await prisma.message.upsert({
                where: { whatsappId: m.whatsappId || "pending" },
                update: { status: m.status || "SENT" },
                create: {
                    whatsappId: m.whatsappId,
                    content: m.content,
                    fromMe: m.fromMe,
                    status: m.status || "SENT",
                    timestamp: new Date((m.timestamp || Math.floor(Date.now()/1000)) * 1000),
                    leadId: lead.id,
                    agencyId: lead.agencyId,
                }
            });
        }
    })().catch(e => console.error("Batch History Sync Err:", e));

    return NextResponse.json({ success: true, count: messages.length });
  }

  // Handle incoming chat message
  if (!contact || !content) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Normalize phone number (handle @s.whatsapp.net OR @lid)
  const phone = contact.split("@")[0].replace(/\D/g, "");

  try {
    // 1. Find or Create Lead based on phone
    let lead = await prisma.lead.findFirst({
      where: { phone: { contains: phone } }
    });

    if (!lead) {
      lead = await prisma.lead.create({
        data: {
          name: pushName || `New Client (${phone})`,
          phone: phone,
          status: "NEW",
          source: "WHATSAPP",
          notes: "Auto-created from inbound WhatsApp message.",
          assignedToId: agentId || null,
          agencyId: "root" 
        }
      });
    }

    // 2. Save Message (with deduplication)
    const message = await prisma.message.upsert({
      where: { whatsappId: whatsappId || "pending" },
      update: { content, status: "READ" }, // Read by system/notified
      create: {
        whatsappId: whatsappId,
        content: content,
        fromMe: false,
        status: "READ",
        timestamp: new Date((timestamp || Math.floor(Date.now()/1000)) * 1000),
        leadId: lead.id,
        agencyId: lead.agencyId,
      }
    });

    return NextResponse.json({ success: true, messageId: message.id });
  } catch (error: any) {
    console.error("Webhook Processing Error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
