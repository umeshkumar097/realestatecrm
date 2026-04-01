import { 
  makeWASocket, 
  DisconnectReason, 
  fetchLatestBaileysVersion, 
  AuthenticationState, 
  SignalDataTypeMap, 
  initAuthCreds, 
  BufferJSON 
} from "@whiskeysockets/baileys"
import { Boom } from "@hapi/boom"
import { prisma } from "@/lib/prisma"
import pino from "pino"

const logger = pino({ level: "silent" })

/**
 * Stateless Database Auth Adapter for Baileys
 * This allows Vercel to load/save WhatsApp sessions to PostgreSQL. 💎
 */
async function usePrismaAuthState(userId: string): Promise<{ state: AuthenticationState, saveCreds: () => Promise<void> }> {
  
  const writeData = async (data: any, type: string, id?: string) => {
    const strData = JSON.stringify(data, BufferJSON.replacer)
    await prisma.baileysAuth.upsert({
      where: { userId_dataType_keyId: { userId, dataType: type, keyId: id || "default" } },
      update: { data: strData },
      create: { userId, dataType: type, keyId: id || "default", data: strData }
    })
  }

  const readData = async (type: string, id?: string) => {
    const res = await prisma.baileysAuth.findUnique({
      where: { userId_dataType_keyId: { userId, dataType: type, keyId: id || "default" } }
    })
    return res ? JSON.parse(res.data, BufferJSON.reviver) : null
  }

  const removeData = async (type: string, id?: string) => {
    await prisma.baileysAuth.delete({
      where: { userId_dataType_keyId: { userId, dataType: type, keyId: id || "default" } }
    }).catch(() => null)
  }

  const creds = await readData("creds") || initAuthCreds()

  return {
    state: {
      creds,
      keys: {
        get: async (type, ids) => {
          const data: { [key: string]: any } = {}
          await Promise.all(ids.map(async id => {
            let val = await readData(type, id)
            if (type === "app-state-sync-key" && val) val = val // Buffer recovery handled by reviver
            data[id] = val
          }))
          return data
        },
        set: async (data) => {
          for (const type in data) {
            for (const id in data[type as keyof SignalDataTypeMap]) {
              const val = data[type as keyof SignalDataTypeMap]![id]
              if (val) await writeData(val, type, id)
              else await removeData(type, id)
            }
          }
        }
      }
    },
    saveCreds: () => writeData(creds, "creds")
  }
}

class BaileysManager {
  private static cachedVersion: any = null

  async connect(userId: string, agencyId: string, force: boolean = false) {
    if (force) {
        await prisma.baileysAuth.deleteMany({ where: { userId } }).catch(() => null)
    }

    if (!BaileysManager.cachedVersion) {
      try {
        const { version } = await fetchLatestBaileysVersion()
        BaileysManager.cachedVersion = version
      } catch (e) {
        BaileysManager.cachedVersion = [2, 3000, 1015901307] 
      }
    }

    const { state, saveCreds } = await usePrismaAuthState(userId)

    const sock = makeWASocket({
      version: BaileysManager.cachedVersion,
      printQRInTerminal: false,
      auth: state,
      logger,
      browser: ["PropCRM", "Chrome", "1.0.0"],
      connectTimeoutMs: 60000,
      defaultQueryTimeoutMs: 60000,
    })

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, qr } = update
      
      if (qr) {
        await prisma.whatsAppSession.upsert({
          where: { agentId: userId },
          update: { qrCode: qr, status: "CONNECTING" },
          create: { agentId: userId, agencyId, qrCode: qr, status: "CONNECTING" }
        })
      }

      if (connection === "open") {
        await prisma.whatsAppSession.update({
          where: { agentId: userId },
          data: { status: "CONNECTED", qrCode: null, phoneNumber: sock.user?.id.split(":")[0] }
        })
      }

      if (connection === "close") {
        const error = (lastDisconnect?.error as Boom)?.output?.statusCode
        if (error === DisconnectReason.loggedOut) {
          await prisma.baileysAuth.deleteMany({ where: { userId } }).catch(() => null)
          await prisma.whatsAppSession.update({ where: { agentId: userId }, data: { status: "DISCONNECTED", qrCode: null } })
        }
      }
    })

    return sock
  }

  async getStatus(userId: string) {
    return prisma.whatsAppSession.findUnique({ where: { agentId: userId } })
  }

  async logout(userId: string) {
    await prisma.baileysAuth.deleteMany({ where: { userId } }).catch(() => null)
    await prisma.whatsAppSession.update({ where: { agentId: userId }, data: { status: "DISCONNECTED", qrCode: null } })
  }

  async sendMessage(userId: string, phone: string, message: string) {
    const sock = await this.connect(userId, "")
    // Wait for connection potentially (standard stateless pattern)
    return new Promise((resolve, reject) => {
        sock.ev.on("connection.update", async (u) => {
            if (u.connection === "open") {
                const jid = `${phone.replace(/\D/g, "")}@s.whatsapp.net`
                await sock.sendMessage(jid, { text: message })
                sock.end() // Close immediately on Vercel to save memory
                resolve(true)
            }
            if (u.connection === "close" && (u.lastDisconnect?.error as Boom)?.output?.statusCode === DisconnectReason.loggedOut) {
                reject(new Error("Logged out"))
            }
        })
        // Timeout safeguard
        setTimeout(() => { sock.end(); reject(new Error("Timeout")) }, 15000)
    })
  }
}

export const baileysManager = new BaileysManager()
