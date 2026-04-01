import express from "express"
import { 
  makeWASocket, 
  useMultiFileAuthState, 
  DisconnectReason, 
  fetchLatestBaileysVersion, 
} from "@whiskeysockets/baileys"
import { Boom } from "@hapi/boom"
import pino from "pino"
import { PrismaClient } from "@prisma/client"
import fs from "fs"
import path from "path"
import dotenv from "dotenv"
import QRCode from "qrcode"

dotenv.config()

const prisma = new PrismaClient({
  datasourceUrl: "postgresql://neondb_owner:npg_djGWaIC7BJ5l@ep-wispy-surf-amfef53a-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
})

const logger = pino({ level: "info" })
const app = express()
app.use(express.json())

const PORT = 80 
const SECRET = "Umesh_WA_Bridge_2003" 

const auth = (req: any, res: any, next: any) => {
    const token = req.headers["x-bridge-secret"]
    if (token !== SECRET) return res.status(401).json({ error: "Unauthorized" })
    next()
}

interface WhatsAppInstance {
  socket: any
  qr?: string
  status: "CONNECTED" | "DISCONNECTED" | "CONNECTING"
}

class BaileysManager {
  private instances: Map<string, WhatsAppInstance> = new Map()
  private initLocks: Map<string, Promise<any>> = new Map()
  private static cachedVersion: any = null
  private sendQueue: Array<{ agentId: string, phone: string, message: string }> = []
  private processingQueue: boolean = false

  async warmupSessions() {
    const sessions = await prisma.whatsAppSession.findMany({
      where: { status: "CONNECTED" }
    });
    logger.info(`🔥 Warming up ${sessions.length} active sessions...`);
    for (const session of sessions) {
      this.init(session.agentId, session.agencyId).catch(() => null);
    }
  }

  async enqueueMessage(agentId: string, phone: string, message: string) {
    this.sendQueue.push({ agentId, phone, message })
    logger.info(`📦 Message queued for ${phone} (Queue size: ${this.sendQueue.length})`)
    this.processQueue()
  }

  async processQueue() {
    if (this.processingQueue || this.sendQueue.length === 0) return
    this.processingQueue = true
    
    while (this.sendQueue.length > 0) {
        const item = this.sendQueue[0]
        try {
            const instance = this.instances.get(item.agentId)
            // Auto-warmup if not in memory
            if (!instance) {
                await this.getInstance(item.agentId).catch(() => null)
                break;
            }

            if (instance.status === "CONNECTED" && instance.socket) {
                // Better JID normalization: remove leading 0 and add 91 for India if no country code
                let cleanPhone = item.phone.replace(/\D/g, "");
                if (cleanPhone.startsWith("0")) cleanPhone = cleanPhone.substring(1);
                if (cleanPhone.length === 10) cleanPhone = `91${cleanPhone}`;
                
                const jid = item.phone.includes("@") ? item.phone : `${cleanPhone}@s.whatsapp.net`
                await instance.socket.sendMessage(jid, { text: item.message })
                this.sendQueue.shift() 
                logger.info(`✅ Delivered to ${jid}`)
            } else {
                logger.info(`⏳ Session ${item.agentId} syncing...`)
                break;
            }
        } catch (err: any) {
            logger.warn(`⏳ Queue loop err: ${err.message}`)
            break; 
        }
        await new Promise(r => setTimeout(r, 1500))
    }
    
    this.processingQueue = false
    if (this.sendQueue.length > 0) setTimeout(() => this.processQueue(), 5000)
  }

  async getInstance(agentId: string) {
    let instance = this.instances.get(agentId)
    if (!instance) {
      const session = await prisma.whatsAppSession.findUnique({ where: { agentId } });
      if (session) {
        return this.init(agentId, session.agencyId)
      }
      throw new Error("Session not found");
    }
    return instance
  }

  async init(agentId: string, agencyId: string, forceReset: boolean = false): Promise<any> {
    if (this.initLocks.has(agentId)) return this.initLocks.get(agentId)
    
    const initPromise = (async () => {
        try {
            if (this.instances.has(agentId) && !forceReset) {
              const inst = this.instances.get(agentId)
              if (inst?.status === "CONNECTED") return inst
            }

            this.instances.set(agentId, { socket: null, status: "CONNECTING" })

            if (forceReset) {
                const sessionPath = path.join(process.cwd(), `sessions/${agentId}`)
                if (fs.existsSync(sessionPath)) fs.rmSync(sessionPath, { recursive: true, force: true })
            }

            if (!BaileysManager.cachedVersion) {
                try {
                    const { version } = await fetchLatestBaileysVersion()
                    BaileysManager.cachedVersion = version
                } catch (e) { BaileysManager.cachedVersion = [2, 3000, 1015901307] }
            }

            const { state, saveCreds } = await useMultiFileAuthState(`sessions/${agentId}`)
            const socket = makeWASocket({
              version: BaileysManager.cachedVersion,
              printQRInTerminal: false,
              auth: state,
              logger,
              browser: ["PropCRM", "Chrome", "1.0.0"],
              connectTimeoutMs: 60000,
            })

            const instance = this.instances.get(agentId)!
            instance.socket = socket

            const WEBHOOK_URL = process.env.WHATSAPP_WEBHOOK_URL;

            socket.ev.on("messages.upsert", async (m) => {
                if (m.type !== "notify") return;
                for (const msg of m.messages) {
                    if (!msg.message || msg.key.fromMe) continue;
                    
                    const contact = msg.key.remoteJid;
                    const content = msg.message.conversation || msg.message.extendedTextMessage?.text || "";

                    logger.info(`📩 Incoming from ${contact}: ${content}`);

                    if (WEBHOOK_URL) {
                        fetch(WEBHOOK_URL, {
                            method: "POST",
                            headers: { 
                                "Content-Type": "application/json",
                                "x-bridge-secret": SECRET
                            },
                            body: JSON.stringify({
                                agentId,
                                contact,
                                content,
                                timestamp: msg.messageTimestamp,
                                pushName: msg.pushName
                            })
                        }).catch(err => logger.error(`❌ Webhook err: ${err.message}`));
                    }
                }
            });

            socket.ev.on("connection.update", async (update) => {
              const { connection, lastDisconnect, qr } = update
              if (qr) {
                instance.qr = qr
                instance.status = "CONNECTING"
                await prisma.whatsAppSession.upsert({
                  where: { agentId },
                  update: { qrCode: qr, status: "CONNECTING" },
                  create: { agentId, agencyId: agencyId || "root", sessionData: "{}", qrCode: qr, status: "CONNECTING" }
                }).catch(() => null)
              }
              if (connection === "close") {
                const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
                if (!shouldReconnect) {
                  instance.status = "DISCONNECTED"
                  this.instances.delete(agentId)
                  await prisma.whatsAppSession.update({ where: { agentId }, data: { status: "DISCONNECTED", qrCode: null }}).catch(() => null)
                } else { 
                    this.initLocks.delete(agentId)
                    this.init(agentId, agencyId) 
                }
              } else if (connection === "open") {
                instance.status = "CONNECTED"
                instance.qr = undefined
                await prisma.whatsAppSession.update({
                  where: { agentId },
                  data: { status: "CONNECTED", qrCode: null, phoneNumber: socket.user?.id.split(":")[0] }
                }).catch(() => null)
                // Trigger queue processing when status opens
                this.processQueue()
              }
            })

            socket.ev.on("creds.update", saveCreds)
            return instance
        } catch (e) {
            this.instances.delete(agentId)
            throw e
        } finally { 
            this.initLocks.delete(agentId) 
        }
    })()

    this.initLocks.set(agentId, initPromise)
    return initPromise
  }

  async logout(agentId: string) {
    const instance = this.instances.get(agentId)
    if (instance?.socket) {
        try {
            await instance.socket.logout()
            instance.socket.end()
        } catch (e) {}
    }
    this.instances.delete(agentId)
    const sessionPath = path.join(process.cwd(), `sessions/${agentId}`)
    if (fs.existsSync(sessionPath)) fs.rmSync(sessionPath, { recursive: true, force: true })
    
    await prisma.whatsAppSession.update({
        where: { agentId },
        data: { status: "DISCONNECTED", qrCode: null }
    }).catch(() => null)
    logger.info(`👋 Logged out: ${agentId}`)
  }
}

const manager = new BaileysManager()

app.get("/", (req, res) => res.json({ status: "alive" }))

app.get("/status/:agentId", auth, async (req, res) => {
    const { agentId } = req.params
    try {
        const instance = await manager.getInstance(agentId).catch(() => null)
        let qrDataUrl = null
        if (instance?.qr) qrDataUrl = await QRCode.toDataURL(instance.qr)
        res.json({ status: instance?.status || "DISCONNECTED", qr: qrDataUrl })
    } catch (e) {
        res.json({ status: "DISCONNECTED", qr: null })
    }
})

app.post("/connect", auth, async (req, res) => {
    const { agentId, agencyId, force } = req.body
    manager.init(agentId, agencyId, force).catch(() => null)
    res.json({ message: "Connecting initiated" })
})

app.post("/disconnect", auth, async (req, res) => {
    const { agentId } = req.body
    await manager.logout(agentId)
    res.json({ message: "Disconnected successfully" })
})

app.post("/send", auth, async (req, res) => {
    try {
        const { agentId, phone, message } = req.body
        if (!agentId || !phone || !message) throw new Error("Missing params")
        await manager.enqueueMessage(agentId, phone, message)
        res.json({ status: "queued" })
    } catch (e: any) {
        res.status(400).json({ error: e.message })
    }
})

app.listen(PORT, () => {
    logger.info(`🚀 Bridge running on ${PORT}`)
    manager.warmupSessions()
})
