import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const BRIDGE_URL = process.env.WHATSAPP_BRIDGE_URL || "http://137.184.114.109";
const BRIDGE_SECRET = process.env.WHATSAPP_BRIDGE_SECRET || "Umesh_WA_Bridge_2003";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { phone, message } = await req.json()
  const userId = (session.user as any).id

  if (!phone || !message) {
    return NextResponse.json({ error: "Phone and Message are required" }, { status: 400 })
  }

  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 25000); // 25s timeout

    const res = await fetch(`${BRIDGE_URL}/send`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "x-bridge-secret": BRIDGE_SECRET 
        },
        body: JSON.stringify({ agentId: userId, phone, message }),
        signal: controller.signal
    });
    
    clearTimeout(id);
    const data = await res.json();
    
    if (!res.ok) {
        return NextResponse.json({ error: data.error || "VPS Bridge Error" }, { status: res.status });
    }

    // --- NEW: Save to Local DB ---
    try {
        const { agencyId } = session.user as any
        const lead = await prisma.lead.findFirst({
            where: { phone: { contains: phone.replace(/\D/g, "") }, agencyId }
        });

        if (lead) {
            await prisma.message.create({
                data: {
                    content: message,
                    fromMe: true,
                    leadId: lead.id,
                    agencyId: lead.agencyId,
                    senderId: userId
                }
            });
        }
    } catch (saveErr) {
        console.error("Local Save Error:", saveErr);
        // We still return success because the VPS accepted it.
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("WhatsApp Send Tooling Error:", err);
    const msg = err.name === 'AbortError' ? "VPS Bridge Timeout" : "Failed to reach VPS Bridge";
    return NextResponse.json({ error: msg }, { status: 504 });
  }
}
