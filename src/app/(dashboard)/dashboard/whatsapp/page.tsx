"use client"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { 
  MessageSquare, CheckCircle2, XCircle, RefreshCw,
  Smartphone, WifiOff, Shield, ArrowLeft,
  Globe, Loader2 
} from "lucide-react"
import { useSession } from "next-auth/react"

type Status = "disconnected" | "connecting" | "connected"

export default function WhatsAppWebPage() {
  const [status, setStatus] = useState<Status>("disconnected")
  const [qr, setQr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connectingAt, setConnectingAt] = useState<number | null>(null)

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/whatsapp")
      const data = await res.json()
      const normalizedStatus = data.status?.toLowerCase() as Status
      
      // UI State Locking: If we are within the 60s grace period, 
      // do NOT let the UI switch back to 'disconnected' status.
      const gracePeriod = 60000 
      const isWithinGrace = connectingAt && (Date.now() - connectingAt) < gracePeriod

      if (status === "connecting" && normalizedStatus === "disconnected" && !data.qr) {
          if (!isWithinGrace) {
            setError("Connection took too long. Please Force Reset.")
            setStatus("disconnected") // Only now we switch back
            setConnectingAt(null)
          }
          // Else: We keep the status as 'connecting' to hold the UI
      } else {
          // If we are connected or have a QR, update freely
          if (normalizedStatus === "connected") {
              setError(null)
              setConnectingAt(null)
          }
          setStatus(normalizedStatus || "disconnected")
          setQr(data.qr ?? null)
      }
    } catch (err) { console.error("Poll Error", err) }
  }, [status, connectingAt])

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 2000)
    return () => clearInterval(interval)
  }, [fetchStatus])

  const handleConnect = async (force: boolean = false) => {
    setLoading(true)
    setError(null)
    setConnectingAt(Date.now())
    await fetch("/api/whatsapp", {
      method: "POST",
      body: JSON.stringify({ action: "connect", force }),
    })
    setStatus("connecting")
    setLoading(false)
  }

  const handleDisconnect = async () => {
    if (!confirm("Stop synchronization?")) return
    setLoading(true)
    await fetch("/api/whatsapp", { method: "POST", body: JSON.stringify({ action: "disconnect" }) })
    setStatus("disconnected")
    setQr(null)
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20 p-6 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
            <Link href="/dashboard" className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-primary transition-colors">
                <ArrowLeft size={12} /> Dashboard
            </Link>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">WhatsApp Integration</h1>
            <p className="text-zinc-500 font-medium">Stateless VPS Bridge (Root Port 80)</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[48px] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className={`p-8 flex items-center justify-between border-b ${status === "connected" ? "bg-emerald-50/50" : "bg-white"}`}>
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${status === "connected" ? "bg-emerald-500 text-white shadow-xl shadow-emerald-500/20" : status === "connecting" ? "bg-amber-500 text-white animate-pulse" : "bg-zinc-100 text-zinc-400"}`}>
                    {status === "connected" ? <Globe /> : status === "connecting" ? <RefreshCw className="animate-spin" /> : <WifiOff />}
                </div>
                <div>
                    <p className="font-black text-slate-800 uppercase tracking-widest text-[10px]">Sync Status</p>
                    <p className={`text-lg font-black uppercase tracking-tighter ${status === "connected" ? "text-emerald-600" : "text-zinc-400"}`}>
                        {status === "connected" ? "LIVE & SYNCED" : status === "connecting" ? "WAITING FOR SCAN" : "OFFLINE"}
                    </p>
                </div>
            </div>
            {status === "connected" && (
                <button onClick={handleDisconnect} className="p-4 bg-white border border-red-100 text-red-500 rounded-2xl hover:bg-red-50 transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                    <XCircle size={16} /> Logout
                </button>
            )}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            {status === "connected" ? (
                <div className="space-y-6">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                        <CheckCircle2 size={40} className="text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Connectivity! 🚀</h2>
                </div>
            ) : status === "connecting" && qr ? (
                <div className="space-y-8 animate-in zoom-in-95 duration-500">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Scan to Authorize</h2>
                        <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">Open WhatsApp → Linked Devices → Scan</p>
                    </div>
                    <div className="bg-white p-6 rounded-[40px] border-4 border-slate-900 shadow-2xl inline-block">
                        <img src={qr} alt="QR" className="w-[280px] h-[280px]" />
                    </div>
                    <button onClick={() => handleConnect(true)} className="text-[10px] font-black uppercase underline text-zinc-400 hover:text-primary">Force Refresh QR</button>
                </div>
            ) : status === "connecting" ? (
                <div className="space-y-6 flex flex-col items-center">
                    <Loader2 size={48} className="animate-spin text-amber-500" />
                    <div>
                        <h2 className="text-xl font-black text-slate-800">Booting Bridge Cluster</h2>
                        <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">Standardizing Handshake...</p>
                    </div>
                    {error && <p className="p-3 bg-red-50 text-red-500 text-[10px] font-black uppercase rounded-xl">{error}</p>}
                </div>
            ) : (
                <div className="space-y-8">
                    <div className="w-20 h-20 bg-zinc-100 rounded-[32px] flex items-center justify-center mx-auto"><Smartphone size={32} className="text-zinc-300" /></div>
                    <button 
                        onClick={() => handleConnect(false)} 
                        disabled={loading}
                        className="px-12 py-5 bg-emerald-500 text-white rounded-3xl text-sm font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Connect Core Handset"}
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  )
}
