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
        "x-bridge-secret": BRIDGE_SECRET,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      },
      cache: "no-store"
    });

    const data = await response.json();
    const res = NextResponse.json(data);
    res.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    return res;
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
    } else if (action === "disconnect" || action === "reset") {
      endpoint = "/disconnect";
      body = { agentId: userId, force: action === "reset" };
    } else {
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    const response = await fetch(`${BRIDGE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-bridge-secret": BRIDGE_SECRET,
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify(body),
      cache: "no-store"
    });

    const data = await response.json();
    const res = NextResponse.json(data);
    res.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    return res;
  } catch (error: any) {
    console.error(`WhatsApp ${action} failure:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
