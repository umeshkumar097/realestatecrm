/**
 * Redirecting engine back to VPS Bridge for Universal Stability. 🦾🛸
 * Vercel Serverless timeouts are too short for the initial WhatsApp handshake.
 */
export const baileysManager = {
  sendMessage: async (userId: string, phone: string, message: string) => {
    const BRIDGE_URL = "http://203.57.85.225"
    const BRIDGE_SECRET = "Umesh_WA_Bridge_2003"
    const res = await fetch(`${BRIDGE_URL}/send`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-bridge-secret": BRIDGE_SECRET 
      },
      body: JSON.stringify({ agentId: userId, phone, message })
    })
    return res.json()
  }
}
