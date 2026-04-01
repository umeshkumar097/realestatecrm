import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = (session.user as any).id
  
  // High-Fidelity VPS Proxy Sequence (Root Port 80)
  const BRIDGE_URL = "http://203.57.85.225"
  const BRIDGE_SECRET = "Umesh_WA_Bridge_2003"

  try {
      const res = await fetch(`${BRIDGE_URL}/status/${userId}`, {
          headers: { "x-bridge-secret": BRIDGE_SECRET },
          next: { revalidate: 0 }
      })
      if (res.ok) {
          const data = await res.json()
          return NextResponse.json(data)
      }
  } catch (e) {
      console.error("[Vercel] VPS Bridge Status Fetch Failed:", e)
  }

  return NextResponse.json({ status: "DISCONNECTED", qr: null })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { action, force } = await req.json().catch(() => ({ action: null, force: false }))
  const { id: userId, agencyId } = (session.user as any)

  const BRIDGE_URL = "http://203.57.85.225"
  const BRIDGE_SECRET = "Umesh_WA_Bridge_2003"

  if (action === "connect") {
    await fetch(`${BRIDGE_URL}/connect`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "x-bridge-secret": BRIDGE_SECRET 
        },
        body: JSON.stringify({ agentId: userId, agencyId, force })
    }).catch(console.error)

    return NextResponse.json({ message: "Connecting initiated on VPS Cluster" })
  }

  if (action === "disconnect") {
    await fetch(`${BRIDGE_URL}/logout`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "x-bridge-secret": BRIDGE_SECRET 
        },
        body: JSON.stringify({ agentId: userId })
    }).catch(console.error)

    return NextResponse.json({ message: "Disconnected" })
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 })
}
