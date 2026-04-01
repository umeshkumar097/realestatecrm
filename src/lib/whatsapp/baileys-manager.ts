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
import fs from "fs"
import path from "path"

const logger = pino({ level: "info" })

interface WhatsAppInstance {
  socket: any
  qr?: string
  status: "CONNECTED" | "DISCONNECTED" | "CONNECTING"
}

class BaileysManager {
  private instances: Map<string, WhatsAppInstance> = new Map()
  private initLocks: Map<string, Promise<any>> = new Map()
  private static cachedVersion: any = null

  constructor() {}

  private async logToSystem(action: string, level: string = "INFO", details: any = {}) {
    try {
      await prisma.systemLog.create({
        data: {
          type: "WHATSAPP",
          level,
          action,
          details: details ? JSON.parse(JSON.stringify(details)) : null
        }
      })
    } catch (e) {
      logger.error(`[Baileys] SystemLog failed: ${e}`)
    }
  }

  async getInstance(agentId: string) {
    return this.instances.get(agentId)
  }

  async resetAll() {
    logger.info("[Baileys] Resetting all global instances")
    const agentIds = Array.from(this.instances.keys())
    for (const agentId of agentIds) {
      await this.logout(agentId).catch(err => logger.error(`[Baileys] Reset logout failed for ${agentId}: ${err}`))
    }
    
    const sessions = await prisma.whatsAppSession.findMany({ where: { status: "CONNECTED" } })
    for (const session of sessions) {
      this.init(session.agentId, session.agencyId).catch(err => logger.error(`[Baileys] Reset init failed for ${session.agentId}: ${err}`))
    }
    return { count: sessions.length }
  }

  getAllInstances() {
    return Array.from(this.instances.entries()).map(([agentId, instance]) => ({
      agentId,
      status: instance.status,
    }))
  }

  async init(agentId: string, agencyId: string, forceReset: boolean = false): Promise<any> {
    if (this.initLocks.has(agentId)) {
        logger.info(`[Baileys] Already initializing for ${agentId}, waiting for lock...`)
        return this.initLocks.get(agentId)
    }

    const initPromise = (async () => {
        try {
            if (this.instances.has(agentId) && !forceReset) {
              const inst = this.instances.get(agentId)
              if (inst?.status === "CONNECTED") return inst
            }

            this.instances.set(agentId, { socket: null, status: "CONNECTING" })

            // Handshake Timeout Sentinel (15s)
            const timeout = setTimeout(() => {
                const inst = this.instances.get(agentId)
                if (inst && inst.status === "CONNECTING" && !inst.qr) {
                    logger.error(`[Baileys] Handshake timeout for ${agentId}`)
                    inst.status = "DISCONNECTED"
                    this.initLocks.delete(agentId)
                }
            }, 15000)

            if (forceReset) {
                const sessionPath = path.join(process.cwd(), `sessions/${agentId}`)
                if (fs.existsSync(sessionPath)) {
                    logger.info(`[Baileys] Force-resetting session for ${agentId}`)
                    fs.rmSync(sessionPath, { recursive: true, force: true })
                }
            }

            if (!BaileysManager.cachedVersion) {
                try {
                    const { version } = await fetchLatestBaileysVersion()
                    BaileysManager.cachedVersion = version
                } catch (e) {
                    BaileysManager.cachedVersion = [2, 3000, 1015901307]
                }
            }
            const version = BaileysManager.cachedVersion

            const { state, saveCreds } = await useMultiFileAuthState(`sessions/${agentId}`)
            const socket = makeWASocket({
              version,
              printQRInTerminal: false,
              auth: state,
              logger,
              browser: ["PropCRM", "Chrome", "1.0.0"],
            })

            const instance = this.instances.get(agentId)!
            instance.socket = socket

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
                if (!shouldReconnect) {
                  instance.status = "DISCONNECTED"
                  instance.qr = undefined
                  this.instances.delete(agentId)
                  await prisma.whatsAppSession.update({ where: { agentId }, data: { status: "DISCONNECTED", qrCode: null }})
                } else {
                  this.init(agentId, agencyId)
                }
              } else if (connection === "open") {
                instance.status = "CONNECTED"
                instance.qr = undefined
                await prisma.whatsAppSession.update({
                  where: { agentId },
                  data: { status: "CONNECTED", qrCode: null, phoneNumber: socket.user?.id.split(":")[0] }
                })
              }
            })

            socket.ev.on("creds.update", saveCreds)

            socket.ev.on("messaging-history.set", async ({ chats }) => {
              for (const chat of chats) {
                if (chat.id && chat.id.endsWith("@s.whatsapp.net")) {
                   await prisma.lead.upsert({
                    where: { phone_agencyId: { phone: chat.id.split("@")[0], agencyId } },
                    update: { updatedAt: new Date() },
                    create: {
                      phone: chat.id.split("@")[0],
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
        } catch (e) {
            logger.error(`[Baileys] Init error for ${agentId}: ${e}`)
            this.instances.delete(agentId)
            throw e
        } finally {
            this.initLocks.delete(agentId)
        }
    })()

    this.initLocks.set(agentId, initPromise)
    return initPromise
  }

  private async handleIncomingMessage(agentId: string, agencyId: string, msg: proto.IWebMessageInfo) {
    if (!msg.key || !msg.key.remoteJid?.endsWith("@s.whatsapp.net")) return
    const phoneNumber = msg.key.remoteJid.split("@")[0]
    const content = msg.message?.conversation || msg.message?.extendedTextMessage?.text || ""
    
    try {
      const lead = await prisma.lead.upsert({
        where: { phone_agencyId: { phone: phoneNumber, agencyId } },
        update: { updatedAt: new Date() },
        create: { phone: phoneNumber, name: msg.pushName || "WhatsApp User", agencyId, assignedToId: agentId, source: "WHATSAPP" }
      })

      await prisma.message.create({
        data: { content, fromMe: false, leadId: lead.id, agencyId, timestamp: new Date(Number(msg.messageTimestamp) * 1000) }
      })

      await fetch(`${process.env.NEXTAUTH_URL}/api/webhook/whatsapp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId, agencyId, leadId: lead.id, message: content, phone: phoneNumber })
      }).catch(() => null)

    } catch (err) {
      logger.error(`Error handling WhatsApp message: ${err}`)
    }
  }

  async sendMessage(agentId: string, remoteJid: string, text: string) {
    const instance = this.instances.get(agentId)
    if (!instance || instance.status !== "CONNECTED") throw new Error("WhatsApp instance not connected")
    
    const jid = remoteJid.includes("@") ? remoteJid : `${remoteJid}@s.whatsapp.net`
    const sentMsg = await instance.socket.sendMessage(jid, { text })
    
    const lead = await prisma.lead.findFirst({ where: { phone: jid.split("@")[0], agencyId: (instance.socket.user as any)?.agencyId || "" } })
    if (lead) {
      await prisma.message.create({ data: { content: text, fromMe: true, leadId: lead.id, agencyId: lead.agencyId, timestamp: new Date() }})
    }
    return sentMsg
  }

  async logout(agentId: string) {
    const instance = this.instances.get(agentId)
    if (instance) {
      await instance.socket.logout().catch(() => null)
      this.instances.delete(agentId)
      await prisma.whatsAppSession.update({ where: { agentId }, data: { status: "DISCONNECTED", sessionData: "{}" }})
    }
  }
}

const globalForBaileys = global as unknown as { baileysManager: BaileysManager }
export const baileysManager = globalForBaileys.baileysManager || new BaileysManager()
globalForBaileys.baileysManager = baileysManager
