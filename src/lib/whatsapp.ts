import { Client, LocalAuth } from "whatsapp-web.js"

// Singleton WhatsApp client per agent session
const clients: Map<string, Client> = new Map()
const qrCodes: Map<string, string> = new Map()
const status: Map<string, "disconnected" | "connecting" | "connected"> = new Map()

export function getWhatsAppClient(agentId: string): Client | undefined {
  return clients.get(agentId)
}

export function getQrCode(agentId: string): string | undefined {
  return qrCodes.get(agentId)
}

export function getStatus(agentId: string): string {
  return status.get(agentId) ?? "disconnected"
}

export async function initClient(agentId: string): Promise<void> {
  // If already connected, skip
  if (status.get(agentId) === "connected") return
  if (status.get(agentId) === "connecting") return

  status.set(agentId, "connecting")
  qrCodes.delete(agentId)

  const client = new Client({
    authStrategy: new LocalAuth({ clientId: agentId }),
    puppeteer: {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    },
  })

  client.on("qr", (qr: string) => {
    qrCodes.set(agentId, qr)
    status.set(agentId, "connecting")
  })

  client.on("ready", () => {
    status.set(agentId, "connected")
    qrCodes.delete(agentId)
    console.log(`[WhatsApp] Agent ${agentId} connected`)
  })

  client.on("disconnected", () => {
    status.set(agentId, "disconnected")
    clients.delete(agentId)
    console.log(`[WhatsApp] Agent ${agentId} disconnected`)
  })

  await client.initialize()
  clients.set(agentId, client)
}

export async function disconnectClient(agentId: string): Promise<void> {
  const client = clients.get(agentId)
  if (client) {
    await client.destroy()
    clients.delete(agentId)
    qrCodes.delete(agentId)
    status.set(agentId, "disconnected")
  }
}

/**
 * Send a lead notification to an agent via WhatsApp
 */
export async function sendLeadAlert(agentId: string, agentPhone: string, lead: {
  name: string
  phone: string
  property: string
  source: string
  budget: string
}) {
  const client = clients.get(agentId)
  if (!client || status.get(agentId) !== "connected") {
    console.warn(`[WhatsApp] Agent ${agentId} not connected, skipping lead alert`)
    return
  }

  const chatId = `${agentPhone.replace(/\D/g, "")}@c.us`
  const message = `🏠 *New Lead Alert — PropGOCrm*

👤 *Name:* ${lead.name}
📱 *Phone:* ${lead.phone}
🏡 *Interest:* ${lead.property}
💰 *Budget:* ${lead.budget}
📌 *Source:* ${lead.source}

_Log in to PropGOCrm to take action: https://app.propgocrm.com_`

  try {
    await client.sendMessage(chatId, message)
    console.log(`[WhatsApp] Lead alert sent to agent ${agentId}`)
  } catch (err) {
    console.error(`[WhatsApp] Failed to send lead alert:`, err)
  }
}
