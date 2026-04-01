"use client"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { authOptions } from "@/lib/auth"
import {
  MessageSquare, CheckCircle2, XCircle, RefreshCw,
  Smartphone, WifiOff, Shield, ArrowLeft,
  Zap, Globe, Key, Trash2, Loader2, Plus
} from "lucide-react"
import { useSession } from "next-auth/react"

type Status = "disconnected" | "connecting" | "connected"

export default function WhatsAppWebPage() {
  const { data: session } = useSession()
  const [status, setStatus] = useState<Status>("disconnected")
  const [qr, setQr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"CONNECT" | "WEBHOOK">("CONNECT")

  // Webhook States
  const [webhooks, setWebhooks] = useState<any[]>([])
  const [whLoading, setWhLoading] = useState(false)

  const fetchWebhooks = useCallback(async () => {
    setWhLoading(true)
    try {
        const res = await fetch("/api/webhooks/config")
        const data = await res.json()
        setWebhooks(data.webhooks || [])
    } catch (e) { console.error("Webhook fetch failed") }
    finally { setWhLoading(false) }
  }, [])

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/whatsapp")
      if (!res.ok) return
      const data = await res.json()
      const normalizedStatus = data.status?.toLowerCase() as Status
      setStatus(normalizedStatus || "disconnected")
      setQr(data.qr ?? null)
    } catch (err) { console.error("Status fetch error", err) }
  }, [])

  useEffect(() => {
    fetchStatus()
    fetchWebhooks()
  }, [fetchStatus, fetchWebhooks])

  useEffect(() => {
    if (status === "connecting") {
      const interval = setInterval(fetchStatus, 1000)
      return () => clearInterval(interval)
    }
  }, [status, fetchStatus])

  const handleConnect = async (force: boolean = false) => {
    setLoading(true)
    const res = await fetch("/api/whatsapp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "connect", force }),
    })
    if (!res.ok) alert("Connection failed")
    setStatus("connecting")
    setLoading(false)
    fetchStatus()
  }

  const handleDisconnect = async () => {
    if (!confirm("Are you sure? This will stop all lead alerts.")) return
    setLoading(true)
    await fetch("/api/whatsapp", {
      method: "POST",
      body: JSON.stringify({ action: "disconnect" }),
    })
    setStatus("disconnected")
    setQr(null)
    setLoading(false)
  }

  const handleCreateWebhook = async () => {
      setWhLoading(true)
      await fetch("/api/webhooks/config", { method: "POST" })
      fetchWebhooks()
  }

  const handleDeleteWebhook = async (id: string) => {
      if (!confirm("Delete this webhook secret?")) return
      await fetch(`/api/webhooks/config?id=${id}`, { method: "DELETE" })
      fetchWebhooks()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
            <Link href="/dashboard" className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-primary transition-colors mb-2">
                <ArrowLeft size={12} /> Dashboard
            </Link>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">WhatsApp Integration</h1>
            <p className="text-zinc-500 font-medium tracking-tight">Sync your real-time lead ingestion with global WhatsApp connectivity.</p>
        </div>

        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-2xl w-fit border border-zinc-200">
            <button 
                onClick={() => setActiveTab("CONNECT")}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "CONNECT" ? "bg-white text-primary shadow-sm" : "text-zinc-500"}`}
            >
                Connect Device
            </button>
            <button 
                onClick={() => setActiveTab("WEBHOOK")}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "WEBHOOK" ? "bg-white text-primary shadow-sm" : "text-zinc-500"}`}
            >
                Webhook Config
            </button>
        </div>
      </div>

      {activeTab === "CONNECT" ? (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-white border border-slate-200 rounded-[48px] shadow-sm overflow-hidden min-h-[600px] flex flex-col">
                {/* Connection Status Bar */}
                <div className={`p-8 flex items-center justify-between border-b border-zinc-100 ${status === "connected" ? "bg-emerald-50/30" : status === "connecting" ? "bg-amber-50/30" : "bg-white"}`}>
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${status === "connected" ? "bg-emerald-500 text-white" : status === "connecting" ? "bg-amber-500 text-white" : "bg-zinc-100 text-zinc-400"}`}>
                            {status === "connected" ? <Globe className="animate-spin-slow" /> : status === "connecting" ? <RefreshCw className="animate-spin" /> : <WifiOff />}
                        </div>
                        <div>
                            <p className="font-black text-slate-800 uppercase tracking-widest text-[10px]">Current Status</p>
                            <p className={`text-lg font-black uppercase tracking-tighter ${status === "connected" ? "text-emerald-600" : status === "connecting" ? "text-amber-600" : "text-zinc-400"}`}>
                                {status === "connected" ? "LIVE & SYNCED" : status === "connecting" ? "WAITING FOR SCAN" : "DISCONNECTED"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Primary QR Focus Area */}
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                    {status === "connected" ? (
                        <div className="space-y-8">
                            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50 overflow-hidden relative group">
                                <div className="absolute inset-0 bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-all duration-700" />
                                <CheckCircle2 size={48} className="text-emerald-500 relative z-10" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Active Connectivity! 🚀</h2>
                                <p className="text-zinc-500 font-medium max-w-sm mx-auto">Your agency is now synchronized. New leads will be dispatched to your WhatsApp immediately.</p>
                            </div>
                            <div className="bg-zinc-50 border border-zinc-100 rounded-3xl p-6 flex items-center gap-4 text-left">
                                <Shield className="text-emerald-500 shrink-0" size={24} />
                                <p className="text-xs font-semibold text-slate-600 leading-relaxed"><strong>Security Verified:</strong> Your session is protected via local authentication. No private data is ever shared with external handlers.</p>
                            </div>
                        </div>
                    ) : status === "connecting" && qr ? (
                        <div className="space-y-10">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Scan to Authorize</h2>
                                <p className="text-sm font-medium text-zinc-400 uppercase tracking-widest">Open WhatsApp → Linked Devices → Scan</p>
                            </div>
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-[44px] blur-xl opacity-20 group-hover:opacity-40 transition-all duration-1000" />
                                <div className="bg-white p-6 rounded-[40px] border-4 border-slate-900 shadow-2xl relative">
                                    <img src={qr} alt="WhatsApp QR" className="w-[320px] h-[320px]" />
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-4">
                                <div className="bg-amber-50 rounded-2xl p-4 flex items-center justify-center gap-3 text-amber-700">
                                    <RefreshCw size={14} className="animate-spin" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">Polling Secure Gateway...</p>
                                </div>
                                <button 
                                    onClick={() => handleConnect(true)}
                                    className="text-[9px] font-black uppercase text-zinc-400 hover:text-primary transition-colors underline underline-offset-4"
                                >
                                    QR Not showing? Force Reset
                                </button>
                            </div>
                        </div>
                    ) : status === "connecting" ? (
                        <div className="space-y-8">
                            <Loader2 size={64} className="animate-spin text-amber-500 mx-auto" />
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <h2 className="text-xl font-black text-slate-800">Booting WhatsApp Cluster</h2>
                                    <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">Generating Digital Handshake...</p>
                                </div>
                                <button 
                                    onClick={() => handleConnect(true)}
                                    className="px-6 py-3 bg-zinc-100 border border-zinc-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all text-zinc-500"
                                >
                                    Taking too long? Force New QR
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="w-24 h-24 bg-zinc-100 rounded-[32px] flex items-center justify-center mx-auto">
                                <Smartphone size={40} className="text-zinc-300" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Offline</h2>
                                <p className="text-zinc-500 font-medium max-w-sm mx-auto">Connect your flagship WhatsApp account to enable professional lead alerts 24/7.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Action */}
                <div className="p-8 bg-zinc-50 border-t border-zinc-100">
                    {status === "connected" ? (
                        <button 
                            onClick={handleDisconnect}
                            disabled={loading}
                            className="w-full py-5 bg-white border border-red-200 text-red-600 rounded-3xl text-xs font-black uppercase tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <><XCircle size={16} /> Disconnect Device</>}
                        </button>
                    ) : (
                                <button 
                                    onClick={() => handleConnect(false)}
                                    disabled={loading || status === "connecting"}
                                    className="w-full py-5 bg-emerald-500 text-white rounded-3xl text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:bg-zinc-200 disabled:text-zinc-400 disabled:shadow-none"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : <><MessageSquare size={18} /> Connect Core Handset</>}
                                </button>
                    )}
                </div>
            </div>
          </div>
      ) : (
          /* Webhook Configuration Section */
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
              <div className="bg-white border border-slate-200 rounded-[48px] p-12 overflow-hidden relative">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                      <div className="space-y-2">
                          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Agency Webhooks</h2>
                          <p className="text-sm text-zinc-500 font-medium">Inject leads directly into PropGoCRM via your website or third-party forms.</p>
                      </div>
                      <button 
                        onClick={handleCreateWebhook}
                        disabled={whLoading}
                        className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/10 flex items-center gap-2"
                      >
                          {whLoading ? <Loader2 className="animate-spin"/> : <><Plus size={14}/> Generate Webhook</>}
                      </button>
                  </div>

                  {whLoading ? (
                      <div className="flex flex-col items-center justify-center py-20 gap-4">
                          <Loader2 className="animate-spin text-primary" size={40} />
                          <p className="text-[10px] font-black uppercase text-zinc-400">Updating Webhook Registry...</p>
                      </div>
                  ) : webhooks.length > 0 ? (
                      <div className="space-y-6">
                        {webhooks.map((wh) => (
                            <div key={wh.id} className="bg-zinc-50 border border-zinc-100 rounded-3xl p-8 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-white border border-zinc-200 rounded-xl"><Globe size={18} className="text-primary"/></div>
                                        <div>
                                            <p className="text-sm font-black text-slate-800">{wh.name}</p>
                                            <p className="text-[10px] font-black text-emerald-500 uppercase">ACTIVE & READY</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteWebhook(wh.id)}
                                        className="p-3 bg-white border border-red-100 text-red-500 rounded-xl hover:bg-red-50 transition-all"
                                    >
                                        <Trash2 size={16}/>
                                    </button>
                                </div>
                                
                                <div className="space-y-4 pt-4 border-t border-zinc-200/50">
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase text-zinc-400 tracking-widest flex items-center gap-1.5"><Globe size={10}/> Endpoint URL</label>
                                        <div className="flex items-center gap-2">
                                            <code className="flex-1 bg-white px-5 py-3 border border-zinc-200 rounded-xl text-xs font-bold text-slate-600 truncate">
                                                {process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/incoming/{wh.agencyId}
                                            </code>
                                            <button onClick={() => { navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/incoming/${wh.agencyId}`); alert("URL Copied!"); }} className="p-3 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-all font-black text-[10px] uppercase">Copy</button>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase text-zinc-400 tracking-widest flex items-center gap-1.5"><Key size={10}/> Webhook Secret</label>
                                        <div className="flex items-center gap-2">
                                            <code className="flex-1 bg-white px-5 py-3 border border-zinc-200 rounded-xl text-xs font-bold text-slate-600 truncate">
                                                {wh.secret}
                                            </code>
                                            <button onClick={() => { navigator.clipboard.writeText(wh.secret); alert("Secret Copied!"); }} className="p-3 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-all font-black text-[10px] uppercase">Copy</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                      </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center gap-6">
                        <div className="w-20 h-20 bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-[32px] flex items-center justify-center">
                            <Zap size={32} className="text-zinc-300" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-slate-800">No Webhooks Established</h3>
                            <p className="text-sm text-zinc-500 font-medium max-w-xs">Generate your first webhook to begin ingestion from your external platforms.</p>
                        </div>
                    </div>
                  )}
              </div>
          </div>
      )}
    </div>
  )
}
