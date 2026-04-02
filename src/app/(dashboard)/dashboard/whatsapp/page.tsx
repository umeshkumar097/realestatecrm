"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { ArrowLeft, Globe, WifiOff, XCircle, RefreshCw, QrCode, ShieldCheck, Zap } from "lucide-react"

/**
 * WHATSAPP "CLEAN SLATE" DASHBOARD (Phase 18)
 * 100% Stateless - High Performance - World Class UI
 */

type ConnectionStatus = "disconnected" | "connecting" | "connected" | "resetting"

export default function WhatsAppWebPage() {
  const [status, setStatus] = useState<ConnectionStatus>("disconnected")
  const [qr, setQr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lockdown, setLockdown] = useState<number>(0)

  // 1. PURE SYNC ENGINE: Fetches the absolute truth from the server
  const syncStatus = useCallback(async () => {
    // If we are in 'lockdown' (Nuclear Reset), don't even ask the server
    if (Date.now() < lockdown) {
      setStatus("resetting")
      setQr(null)
      return
    }

    try {
      const res = await fetch("/api/whatsapp", { cache: "no-store", headers: { 'Pragma': 'no-cache' } })
      const data = await res.json()
      const serverStatus = data.status?.toLowerCase() as ConnectionStatus

      // Sync logic: Pure reflection of server data
      setStatus(serverStatus || "disconnected")
      setQr(data.qr ?? null)
      if (serverStatus === "connected") setError(null)
    } catch (err) {
      console.error("[WA Sync] Failure:", err)
      setStatus("disconnected")
    }
  }, [lockdown])

  // 2. High-Performance Poller
  useEffect(() => {
    syncStatus()
    const interval = setInterval(syncStatus, status === "connected" ? 10000 : 3000)
    return () => clearInterval(interval)
  }, [syncStatus, status])

  // 3. NUCLEAR RESET ACTION: Physically kills ghost sessions
  const handleReset = async () => {
    if (!confirm("NUCLEAR RESET: This will FORCE your connection to stay OFFLINE for 60 seconds to wipe all zombie sessions. Continue?")) return
    
    setLoading(true)
    setLockdown(Date.now() + 60000)
    setStatus("resetting")
    setQr(null)

    try {
      const res = await fetch("/api/whatsapp", { 
        method: "POST", 
        body: JSON.stringify({ action: "reset" }) 
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
    } catch (err: any) {
      console.error("[WA Reset] Failure:", err.message)
      setError("Reset initiated, but bridge communication failed. Cooldown remains active for safety.")
    } finally {
      setLoading(false)
    }
  }

  // 4. ACTION: Disconnect (Soft)
  const handleDisconnect = async () => {
    setLoading(true)
    setStatus("disconnected")
    setQr(null)

    try {
      await fetch("/api/whatsapp", { method: "POST", body: JSON.stringify({ action: "disconnect" }) })
      syncStatus()
    } catch (err: any) {
      setError("Disconnect failed. Use Force Reset if necessary.")
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async (force: boolean = false) => {
    setLoading(true)
    setError(null)
    setStatus("connecting")
    
    try {
      const res = await fetch("/api/whatsapp", {
        method: "POST",
        body: JSON.stringify({ action: "connect", force })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      syncStatus()
    } catch (err: any) {
      setError(err.message || "Failed to initialize bridge.")
      setStatus("disconnected")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20 p-6 animate-in fade-in slide-in-from-bottom-5 duration-1000">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
            <Link href="/dashboard" className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-all group">
                <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Dashboard
            </Link>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">WhatsApp <span className="text-emerald-500">Sync</span></h1>
            <p className="text-zinc-500 font-medium flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-500" /> Secure VPS Bridge (Stateless Mode)
            </p>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[56px] shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col min-h-[600px] relative overflow-hidden">
        {/* Status Hub Bar */}
        <div className={`p-10 flex items-center justify-between border-b transition-colors duration-1000 ${status === "connected" ? "bg-emerald-50/40" : "bg-white"}`}>
            <div className="flex items-center gap-6">
                <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-all duration-700 ${status === "connected" ? "bg-emerald-500 text-white shadow-[0_20px_50px_rgba(16,185,129,0.3)]" : status === "connecting" || status === "resetting" ? "bg-amber-500 text-white animate-pulse" : "bg-zinc-100 text-zinc-300"}`}>
                    {status === "connected" ? <Globe size={28} /> : status === "resetting" ? <Zap size={28} /> : status === "connecting" ? <RefreshCw size={28} className="animate-spin" /> : <WifiOff size={28} />}
                </div>
                <div className="space-y-0.5">
                    <p className="font-bold text-slate-400 uppercase tracking-[0.2em] text-[10px]">Real-Time Signal</p>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full animate-ping ${status === "connected" ? "bg-emerald-500" : status === "resetting" ? "bg-amber-500" : "bg-zinc-300"}`} />
                        <p className={`text-2xl font-black uppercase tracking-tighter ${status === "connected" ? "text-emerald-600" : status === "resetting" ? "text-amber-600" : "text-zinc-400"}`}>
                            {status === "connected" ? "Live & Synced" : status === "resetting" ? "Nuclear Resetting..." : status === "connecting" ? "Establishing..." : "Offline"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {status === "connected" && (
                    <button onClick={handleDisconnect} disabled={loading} className="px-6 py-4 bg-white border border-red-100 text-red-500 rounded-2xl hover:bg-red-50 transition-all font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 disabled:opacity-50">
                        <XCircle size={14} /> Disconnect
                    </button>
                )}
                <button onClick={handleReset} disabled={loading} className="px-6 py-4 bg-zinc-900 text-white rounded-2xl hover:scale-105 active:scale-95 transition-all font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-2xl shadow-zinc-900/20 disabled:opacity-50 group">
                    <RefreshCw size={14} className={loading || status === "resetting" ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"} /> Force Reset Hub
                </button>
            </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col items-center justify-center p-16 text-center space-y-8">
            {status === "connected" ? (
                <div className="space-y-6 animate-in zoom-in duration-1000">
                    <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30">
                        <ShieldCheck size={64} className="text-white" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Operational 🚀</h2>
                        <p className="text-zinc-500 max-w-sm mx-auto font-medium">Your WhatsApp channel is now bridged to the CRM. Messages are being synced in real-time.</p>
                    </div>
                </div>
            ) : status === "resetting" ? (
                <div className="space-y-8 max-w-md animate-in fade-in duration-500">
                    <div className="relative">
                        <RefreshCw size={80} className="text-amber-500 animate-spin mx-auto opacity-20" />
                        <Zap size={40} className="text-amber-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Nuclear Reset In-Progress</h2>
                        <p className="text-zinc-500 font-medium leading-relaxed">We are physically terminating all zombie sessions on the server. The hub will remain locked for 60 seconds to ensure a total memory wipe. 🧼</p>
                    </div>
                    <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full animate-[progress_60s_linear]" />
                    </div>
                </div>
            ) : status === "connecting" ? (
                <div className="space-y-6">
                    <QrCode size={80} className="text-amber-500 animate-pulse mx-auto" />
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight italic">Negotiating with QR Engine...</h2>
                </div>
            ) : qr ? (
                <div className="space-y-8 animate-in zoom-in-95 duration-700">
                    <div className="bg-white p-10 rounded-[40px] shadow-2xl border-4 border-emerald-500 inline-block relative group">
                        <img src={qr} alt="Scan QR" className="w-[300px] h-[300px]" />
                        <div className="absolute inset-0 bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-8 backdrop-blur-sm">
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Scan to Link</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Scan with WhatsApp</h2>
                        <p className="text-zinc-500 font-medium text-sm">Open WhatsApp &gt; Settings &gt; Linked Devices &gt; Link a Device</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    <div className="w-32 h-32 bg-zinc-100 rounded-[32px] flex items-center justify-center mx-auto text-zinc-300">
                        <QrCode size={64} />
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Ready to Bridged</h2>
                            <p className="text-zinc-500 font-medium text-sm">Initialize your server node to start the WhatsApp bridge.</p>
                        </div>
                        <button onClick={() => handleConnect()} disabled={loading} className="px-12 py-5 bg-emerald-500 text-white rounded-[24px] font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-emerald-500/20 disabled:opacity-50">
                            Initialize Sync Hub
                        </button>
                    </div>
                </div>
            )}

            {error && (
                <div className="mt-8 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 animate-in shake duration-500">
                    ⚠️ {error}
                </div>
            )}
        </div>

        {/* Footer info */}
        <div className="p-8 bg-zinc-50/50 border-t flex items-center justify-center gap-8">
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">End-to-End Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">24/7 VPS Uptime</span>
            </div>
        </div>
      </div>
    </div>
  )
}
