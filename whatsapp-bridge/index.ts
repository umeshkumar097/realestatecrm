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

  async warmupSessions() {
    const sessions = await prisma.whatsAppSession.findMany({
      where: { status: "CONNECTED" }
    });
    logger.info(`🔥 Warming up ${sessions.length} active sessions...`);
    for (const session of sessions) {
      this.init(session.agentId, session.agencyId).catch(err => {
        logger.error(`❌ Warmup failed for ${session.agentId}: ${err.message}`);
      });
    }
  }

  private sendQueue: Array<{ agentId: string, phone: string, message: string }> = []
  private processingQueue: boolean = false

  async enqueueMessage(agentId: string, phone: string, message: string) {
    this.sendQueue.push({ agentId, phone, message })
    logger.info(`📦 Message queued for ${phone} (Queue size: ${this.sendQueue.length})`)
    this.processQueue() // Trigger background worker
  }

  async processQueue() {
    if (this.processingQueue || this.sendQueue.length === 0) return
    this.processingQueue = true
    
    while (this.sendQueue.length > 0) {
        const item = this.sendQueue[0]
        try {
            const instance = await this.getInstance(item.agentId)
            if (instance.status === "CONNECTED" && instance.socket) {
                await instance.socket.sendMessage(item.phone + "@s.whatsapp.net", { text: item.message })
                this.sendQueue.shift() // Remove from queue only on success
                logger.info(`✅ Message delivered background to ${item.phone}`)
            } else {
                // Not connected yet, wait and retry
                break;
            }
        } catch (err) {
            logger.warn(`⏳ Waiting for session ${item.agentId} to be ready...`)
            break; // Stop and retry later
        }
        await new Promise(r => setTimeout(r, 1000)) // 1s throttle
    }
    
    this.processingQueue = false
    // Retry in 3 seconds if queue still has items
    if (this.sendQueue.length > 0) setTimeout(() => this.processQueue(), 3000)
  }

  async getInstance(agentId: string) {
    let instance = this.instances.get(agentId)
    if (!instance) {
      const session = await prisma.whatsAppSession.findUnique({ where: { agentId } });
      if (session) this.init(agentId, session.agencyId).catch(() => null);
      throw new Error("Initializing connection...");
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

            logger.info(`📩 Incoming message from ${contact}: ${content}`);

            // 1. Save to Database directly (optional, but good for persistence)
            // 2. Dispatch to Main CRM Webhook for Automation
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
                }).catch(err => logger.error(`❌ Webhook failed: ${err.message}`));
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
        } else { this.init(agentId, agencyId) }
      } else if (connection === "open") {
        instance.status = "CONNECTED"
        instance.qr = undefined
        await prisma.whatsAppSession.update({
          where: { agentId },
          data: { status: "CONNECTED", qrCode: null, phoneNumber: socket.user?.id.split(":")[0] }
        }).catch(() => null)
      }
    })
    socket.ev.on("creds.update", saveCreds)
    return instance
  } catch (e) {
    this.instances.delete(agentId)
    throw e
  } finally { this.initLocks.delete(agentId) }
})()
this.initLocks.set(agentId, initPromise)
return initPromise
}

  async sendMessage(agentId: string, phone: string, message: string) {
    const instance = await this.getInstance(agentId)
    if (!instance || instance.status !== "CONNECTED") throw new Error("WhatsApp not connected")
    const jid = `${phone.replace(/\D/g, "")}@s.whatsapp.net`
    return instance.socket.sendMessage(jid, { text: message })
  }

  async logout(agentId: string) {
    const instance = this.instances.get(agentId)
    if (instance?.socket) {
        try {
            await instance.socket.logout() // Tell WA servers we are logging out
            instance.socket.end() // Close socket
        } catch (e) {}
    }
    this.instances.delete(agentId)
    const sessionPath = path.join(process.cwd(), `sessions/${agentId}`)
    if (fs.existsSync(sessionPath)) fs.rmSync(sessionPath, { recursive: true, force: true })
    
    await prisma.whatsAppSession.update({
        where: { agentId },
        data: { status: "DISCONNECTED", qrCode: null }
    }).catch(() => null)
    
    logger.info(`👋 Session logged out and deleted for ${agentId}`)
  }
}

const manager = new BaileysManager()

app.get("/", (req, res) => res.json({ status: "alive" }))
app.get("/status/:agentId", auth, async (req, res) => {
    const { agentId } = req.params
    const instance = await manager.getInstance(agentId).catch(() => null)
    let qrDataUrl = null
    if (instance?.qr) qrDataUrl = await QRCode.toDataURL(instance.qr)
    res.json({ status: instance?.status || "DISCONNECTED", qr: qrDataUrl })
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
        if (!agentId || !phone || !message) throw new Error("Missing parameters")
        
        await manager.enqueueMessage(agentId, phone, message)
        res.json({ status: "queued", message: "Message accepted and queued for delivery" })
    } catch (e: any) {
        res.status(400).json({ error: e.message })
    }
})
app.listen(PORT, () => {
    logger.info(`🚀 WhatsApp VPS Bridge running on port ${PORT}`)
    manager.warmupSessions()
})
