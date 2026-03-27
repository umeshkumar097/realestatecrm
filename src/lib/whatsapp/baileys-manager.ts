import { 
  makeWASocket, 
  useMultiFileAuthState, 
  DisconnectReason, 
  fetchLatestBaileysVersion, 
  proto,
  makeCacheableSignalKeyStore, 
  jidNormalizedUser,
} from "@whiskeysockets/baileys"
import { Boom } from "@hapi/boom"
import pino from "pino"
import { prisma } from "@/lib/prisma"
const logger = pino({ level: "info" })

interface WhatsAppInstance {
  socket: any
  qr?: string
  status: "CONNECTED" | "DISCONNECTED" | "CONNECTING"
}

class BaileysManager {
  private instances: Map<string, WhatsAppInstance> = new Map()

  constructor() {}

  async getInstance(agentId: string) {
    const instance = this.instances.get(agentId)
    if (instance) {
      logger.info(`[Baileys] Getting instance for ${agentId}: ${instance.status}`)
    }
    return instance
  }

  async init(agentId: string, agencyId: string) {
    if (this.instances.has(agentId)) {
      const inst = this.instances.get(agentId)
      if (inst?.status === "CONNECTED") return inst
    }

    const { version, isLatest } = await fetchLatestBaileysVersion()
    logger.info(`using WhatsApp v${version.join(".")}, isLatest: ${isLatest}`)

    // For better scalability, Baileys "AuthState" should be in DB.
    // However, Baileys "useMultiFileAuthState" is simpler for a startup.
    // We'll use a local folder path based on agentId for now, but in prod we'd sync this to S3/DB.
    const { state, saveCreds } = await useMultiFileAuthState(`sessions/${agentId}`)

    const socket = makeWASocket({
      version,
      printQRInTerminal: false,
      auth: state,
      logger,
      browser: ["PropCRM", "Chrome", "1.0.0"],
    })

    const instance: WhatsAppInstance = { socket, status: "CONNECTING" }
    this.instances.set(agentId, instance)

    // Handle connection updates
    socket.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, qr } = update
      
      if (qr) {
        instance.qr = qr
        instance.status = "CONNECTING"
        await prisma.whatsAppSession.upsert({
          where: { agentId },
          update: { qrCode: qr, status: "CONNECTING" },
          create: { agentId, agencyId, sessionData: "{}", qrCode: qr, status: "CONNECTING" }
        })
      }

      if (connection === "close") {
        const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
        logger.info(`connection closed due to ${lastDisconnect?.error}, reconnecting ${shouldReconnect}`)
        
        // Don't clear the QR immediately if we're reconnecting
        if (!shouldReconnect) {
          instance.status = "DISCONNECTED"
          instance.qr = undefined
          await prisma.whatsAppSession.update({
            where: { agentId },
            data: { status: "DISCONNECTED", qrCode: null }
          })
          this.instances.delete(agentId)
        } else {
          // Keep the status as CONNECTING so the FE keeps polling/showing QR
          instance.status = "CONNECTING"
          this.init(agentId, agencyId)
        }
      } else if (connection === "open") {
        logger.info("opened connection")
        instance.status = "CONNECTED"
        instance.qr = undefined
        await prisma.whatsAppSession.update({
          where: { agentId },
          data: { status: "CONNECTED", qrCode: null, phoneNumber: socket.user?.id.split(":")[0] }
        })
      }
    })

    // Save credentials when updated
    socket.ev.on("creds.update", saveCreds)

    // Handle historical chat sync
    socket.ev.on("messaging-history.set", async ({ chats, contacts, messages, isLatest }) => {
      logger.info(`Received messaging history: ${chats.length} chats, ${messages.length} messages`)
      
      for (const chat of chats) {
        // Only sync personal chats, no groups
        if (chat.id && chat.id.endsWith("@s.whatsapp.net")) {
          const phoneNumber = chat.id.split("@")[0]
          
          await prisma.lead.upsert({
            where: { phone_agencyId: { phone: phoneNumber, agencyId } },
            update: { updatedAt: new Date() },
            create: {
              phone: phoneNumber,
              name: chat.name || "WhatsApp User",
              agencyId,
              assignedToId: agentId,
              source: "WHATSAPP",
              notes: "Synced from WhatsApp History"
            }
          })
        }
      }
    })

    // Handle messages
    socket.ev.on("messages.upsert", async (m) => {
      if (m.type === "notify") {
        for (const msg of m.messages) {
          if (!msg.key.fromMe && msg.message) {
            await this.handleIncomingMessage(agentId, agencyId, msg)
          }
        }
      }
    })

    return instance
  }

  private async handleIncomingMessage(agentId: string, agencyId: string, msg: proto.IWebMessageInfo) {
    if (!msg.key) return
    const remoteJid = msg.key.remoteJid
    if (!remoteJid || !remoteJid.endsWith("@s.whatsapp.net")) return

    const phoneNumber = remoteJid.split("@")[0]
    const content = msg.message?.conversation || msg.message?.extendedTextMessage?.text || ""
    const senderName = msg.pushName || "WhatsApp User"

    try {
      // 1. Find or create lead
      const lead = await prisma.lead.upsert({
        where: { phone_agencyId: { phone: phoneNumber, agencyId } },
        update: { updatedAt: new Date() },
        create: {
          phone: phoneNumber,
          name: senderName,
          agencyId,
          assignedToId: agentId,
          source: "WHATSAPP",
          notes: "Auto-created from WhatsApp message"
        }
      })

      // 2. Save message
      await prisma.message.create({
        data: {
          content,
          fromMe: false,
          leadId: lead.id,
          agencyId,
          timestamp: new Date(Number(msg.messageTimestamp) * 1000)
        }
      })

      // 3. Trigger Webhook API (to notify FE via Socket.io / AI)
      const { extracted } = await (await fetch(`${process.env.NEXTAUTH_URL}/api/webhook/whatsapp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId,
          agencyId,
          leadId: lead.id,
          message: content,
          phone: phoneNumber
        })
      })).json().catch(() => ({ extracted: {} }))

      // 4. Auto-Reply if it's a first-time message or has high intent
      if (content.length > 2) {
        const replyText = `Hi ${senderName}! Thanks for reaching out. We've noted your interest in ${extracted.propertyType || 'our properties'} in ${extracted.location || 'this area'}. An agent will call you shortly.`
        await this.sendMessage(agentId, remoteJid, replyText).catch(e => logger.error("Auto-reply failed"))
      }

      logger.info(`Lead ${lead.id} received message: ${content}`)

    } catch (err) {
      logger.error(`Error handling WhatsApp message: ${err}`)
    }
  }

  async sendMessage(agentId: string, remoteJid: string, text: string) {
    const instance = this.instances.get(agentId)
    if (!instance || instance.status !== "CONNECTED") {
      throw new Error("WhatsApp instance not connected")
    }

    const jid = remoteJid.includes("@") ? remoteJid : `${remoteJid}@s.whatsapp.net`
    const sentMsg = await instance.socket.sendMessage(jid, { text })
    
    // Save outbound message to DB
    const phoneNumber = jid.split("@")[0]
    const lead = await prisma.lead.findFirst({
      where: { phone: phoneNumber }
    })

    if (lead) {
      await prisma.message.create({
        data: {
          content: text,
          fromMe: true,
          leadId: lead.id,
          agencyId: lead.agencyId,
          timestamp: new Date()
        }
      })
    }

    return sentMsg
  }

  async logout(agentId: string) {
    logger.info(`[Baileys] Logging out agent: ${agentId}`)
    const instance = this.instances.get(agentId)
    if (instance) {
      try {
        await instance.socket.logout()
      } catch (e) {
        logger.error(`[Baileys] Logout error for ${agentId}: ${e}`)
      }
      this.instances.delete(agentId)
      await prisma.whatsAppSession.update({
        where: { agentId },
        data: { status: "DISCONNECTED", sessionData: "{}" }
      })
      logger.info(`[Baileys] Logout successful for ${agentId}`)
    } else {
      logger.warn(`[Baileys] No active instance found to logout for ${agentId}`)
    }
  }
}

// Global singleton
const globalForBaileys = global as unknown as { baileysManager: BaileysManager }
export const baileysManager = globalForBaileys.baileysManager || new BaileysManager()
if (process.env.NODE_ENV !== "production") globalForBaileys.baileysManager = baileysManager
