import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

/**
 * WHATSAPP "CLEAN SLATE" ENGINE (Phase 18)
 * 100% Stateless - Zero Caching - Real-Time Truth
 */

const BRIDGE_URL = process.env.WHATSAPP_BRIDGE_URL || "http://137.184.114.109";
const BRIDGE_SECRET = process.env.WHATSAPP_BRIDGE_SECRET || "Umesh_WA_Bridge_2003";

// Standard headers for all bridge calls to prevent ANY caching
const headers = {
  "x-bridge-secret": BRIDGE_SECRET,
  "Cache-Control": "no-cache, no-store, must-revalidate",
  "Pragma": "no-cache",
  "Expires": "0"
};

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = (session.user as any).id

  try {
    // PURE PROXY: Absolute source of truth from DO Bridge
    const response = await fetch(`${BRIDGE_URL}/status/${userId}`, {
      headers,
      cache: "no-store",
      next: { revalidate: 0 }
    });

    const data = await response.json();
    
    // Final check: If bridge is 404 or invalid, return DISCONNECTED
    if (!response.ok) throw new Error("Bridge reported error");

    const res = NextResponse.json(data);
    res.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    return res;
  } catch (error: any) {
    console.error("[WA Sync Engine Error]:", error.message);
    return NextResponse.json({ status: "DISCONNECTED", error: "Bridge OFFLINE" }, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { action, force } = await req.json().catch(() => ({ action: null, force: false }))
  const { id: userId, agencyId } = (session.user as any)

  if (!action) return NextResponse.json({ error: "Action required" }, { status: 400 });

  try {
    const endpoint = action === "connect" ? "/connect" : "/disconnect";
    const body = action === "connect" 
      ? { agentId: userId, agencyId, force: true } // Always force fresh for connectivity
      : { agentId: userId, force: true }; // Always force kill for disconnects

    const response = await fetch(`${BRIDGE_URL}${endpoint}`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store"
    });

    const data = await response.json();
    const res = NextResponse.json(data);
    res.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    return res;
  } catch (error: any) {
    console.error(`[WA Action Engine Error]: ${action}`, error.message);
    return NextResponse.json({ error: "Action failed locally", status: "DISCONNECTED" }, { status: 500 });
  }
}
