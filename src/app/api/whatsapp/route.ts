import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const BRIDGE_URL = process.env.WHATSAPP_BRIDGE_URL || "http://137.184.114.109";
const BRIDGE_SECRET = process.env.WHATSAPP_BRIDGE_SECRET || "Umesh_WA_Bridge_2003";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = (session.user as any).id

  try {
    const response = await fetch(`${BRIDGE_URL}/status/${userId}`, {
      headers: {
        "x-bridge-secret": BRIDGE_SECRET
      }
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("WhatsApp status check failed:", error);
    return NextResponse.json({ 
      status: "DISCONNECTED", 
      error: error.message 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { action, force } = await req.json().catch(() => ({ action: null, force: false }))
  const { id: userId, agencyId } = (session.user as any)

  try {
    let endpoint = "";
    let body = {};

    if (action === "connect") {
      endpoint = "/connect";
      body = { agentId: userId, agencyId, force };
    } else if (action === "disconnect") {
      endpoint = "/disconnect";
      body = { agentId: userId };
    } else {
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    const response = await fetch(`${BRIDGE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-bridge-secret": BRIDGE_SECRET
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`WhatsApp ${action} failure:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
