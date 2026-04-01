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

// Ultra-Stable Prisma Client (v7+)
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

  async getInstance(agentId: string) {
    return this.instances.get(agentId)
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
              defaultQueryTimeoutMs: 60000,
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
                }).catch(() => null)
              }

              if (connection === "close") {
                const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
                if (!shouldReconnect) {
                  instance.status = "DISCONNECTED"
                  this.instances.delete(agentId)
                  await prisma.whatsAppSession.update({ where: { agentId }, data: { status: "DISCONNECTED", qrCode: null }}).catch(() => null)
                } else { 
                  this.init(agentId, agencyId) 
                }
              } else if (connection === "open") {
                instance.status = "CONNECTED"
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
        } finally { 
            this.initLocks.delete(agentId) 
        }
    })()
    this.initLocks.set(agentId, initPromise)
    return initPromise
  }

  async logout(agentId: string) {
    const instance = this.instances.get(agentId)
    if (instance) {
      await instance.socket.logout().catch(() => null)
      this.instances.delete(agentId)
      await prisma.whatsAppSession.update({ where: { agentId }, data: { status: "DISCONNECTED", sessionData: "{}", qrCode: null }}).catch(() => null)
    }
  }
}

const manager = new BaileysManager()

app.get("/", (req, res) => res.json({ status: "alive" }))

app.get("/status/:agentId", auth, async (req, res) => {
    const { agentId } = req.params
    const instance = await manager.getInstance(agentId)
    let qrDataUrl = null
    if (instance?.qr) qrDataUrl = await QRCode.toDataURL(instance.qr)
    res.json({ status: instance?.status || "DISCONNECTED", qr: qrDataUrl })
})

app.post("/connect", auth, async (req, res) => {
    const { agentId, agencyId, force } = req.body
    manager.init(agentId, agencyId, force).catch(() => null)
    res.json({ message: "Connecting initiated" })
})

app.post("/logout", auth, async (req, res) => {
    const { agentId } = req.body
    await manager.logout(agentId)
    res.json({ message: "Logged out" })
})

app.listen(PORT, () => {
    logger.info(`🚀 WhatsApp VPS Bridge running on port ${PORT}`)
})
