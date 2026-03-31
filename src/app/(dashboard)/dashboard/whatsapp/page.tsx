"use client"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  MessageSquare, CheckCircle2, XCircle, RefreshCw,
  Smartphone, Wifi, WifiOff, Bell, Shield, ArrowLeft,
  Info, Zap
} from "lucide-react"
import { useSession } from "next-auth/react"

type Status = "disconnected" | "connecting" | "connected"

export default function WhatsAppWebPage() {
  const { data: session } = useSession()
  const [status, setStatus] = useState<Status>("disconnected")
  const [qr, setQr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [polling, setPolling] = useState(false)
  const [lastLead, setLastLead] = useState<{ name: string; time: string } | null>(null)

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/whatsapp")
      if (!res.ok) return
      const data = await res.json()
      // Normalize status to lowercase to match our Status type
      const normalizedStatus = data.status?.toLowerCase() as Status
      setStatus(normalizedStatus || "disconnected")
      setQr(data.qr ?? null)
    } catch (err) {
      console.error("Failed to fetch WhatsApp status", err)
    }
  }, [])

  // Fetch status on mount
  useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  // Poll every 3s while connecting
  useEffect(() => {
    if (status === "connecting") {
      const interval = setInterval(fetchStatus, 2000)
      return () => clearInterval(interval)
    }
  }, [status, fetchStatus])

  // Auto-redirect on success
  useEffect(() => {
    if (status === "connected") {
      const timer = setTimeout(() => {
        // window.location.href = "/dashboard" // Or use router.push if available
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [status])

  const handleConnect = async () => {
    if (!session?.user?.agencyId) return alert("No agency assigned to your profile.")
    
    setLoading(true)
    const res = await fetch("/api/whatsapp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        action: "connect"
      }),
    })
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      alert(errorData.error || "Failed to initiate WhatsApp connection.")
      setLoading(false)
      return
    }
    setStatus("connecting")
    setLoading(false)
    // Start polling immediately
    fetchStatus()
  }

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect? This will stop all lead alerts.")) return
    
    setLoading(true)
    try {
      const res = await fetch("/api/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "disconnect" }),
      })
      
      if (res.ok) {
        setStatus("disconnected")
        setQr(null)
      } else {
        const error = await res.json().catch(() => ({}))
        alert(error.error || "Failed to disconnect")
      }
    } catch (err) {
      console.error("Disconnect error", err)
      alert("An unexpected error occurred while disconnecting.")
    } finally {
      setLoading(false)
    }
  }

  // Simulate a test lead (demo)
  const simulateLead = () => {
    setLastLead({ name: "Amit Kapoor", time: new Date().toLocaleTimeString("en-IN") })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
        <span className="text-slate-300">/</span>
        <h1 className="text-xl font-black text-slate-800">WhatsApp Web Connect</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* QR Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Status bar */}
            <div className={`px-6 py-4 flex items-center justify-between border-b border-slate-100 ${
              status === "connected" ? "bg-emerald-50/50" :
              status === "connecting" ? "bg-amber-50/50" : "bg-slate-50/50"
            }`}>
              <div className="flex items-center gap-3">
                {status === "connected" ? (
                  <><div className="relative"><Wifi className="h-5 w-5 text-emerald-500" /><span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" /></div><div><p className="font-black text-emerald-700 text-sm">Connected</p><p className="text-[10px] text-emerald-600">Active & Syncing</p></div></>
                ) : status === "connecting" ? (
                  <><RefreshCw className="h-5 w-5 text-amber-500 animate-spin" /><div><p className="font-black text-amber-700 text-sm">Waiting for scan…</p><p className="text-[10px] text-amber-600">Scan QR with your phone</p></div></>
                ) : (
                  <><WifiOff className="h-5 w-5 text-slate-400" /><div><p className="font-black text-slate-600 text-sm">Not Connected</p><p className="text-[10px] text-slate-400">Click connect to start</p></div></>
                )}
              </div>
              {status === "connected" && (
                <Link href="/dashboard" className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg hover:bg-emerald-200 transition-all uppercase tracking-tighter">
                  Done, Go Back
                </Link>
              )}
            </div>

            {/* QR code area */}
            <div className="p-8 flex flex-col items-center justify-center min-h-[300px]">
              {status === "connected" ? (
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-black text-slate-800 text-lg">WhatsApp Live! 🎉</p>
                    <p className="text-slate-500 text-sm mt-1">Leads will be sent to your<br />WhatsApp automatically.</p>
                  </div>
                  <button
                    onClick={simulateLead}
                    className="mt-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors"
                  >
                    <span className="flex items-center gap-1.5"><Zap className="h-4 w-4" />Send Test Client</span>
                  </button>
                </div>
              ) : status === "connecting" && qr ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-white p-3 rounded-2xl border-2 border-emerald-500 shadow-lg">
                    <img src={qr} alt="WhatsApp QR Code" className="w-56 h-56" />
                  </div>
                  <p className="text-xs text-slate-500 text-center max-w-[200px]">
                    Open WhatsApp → tap ⋮ → <strong>Linked Devices</strong> → scan this QR
                  </p>
                </div>
              ) : status === "connecting" ? (
                <div className="flex flex-col items-center gap-4 text-center">
                  <RefreshCw className="h-12 w-12 text-amber-400 animate-spin" />
                  <div>
                    <p className="font-black text-slate-700">Generating QR Code…</p>
                    <p className="text-slate-400 text-sm mt-1">This may take 10–20 seconds</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                    <Smartphone className="h-10 w-10 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-black text-slate-700">Not Connected</p>
                    <p className="text-slate-400 text-sm mt-1">Connect your WhatsApp to<br />receive client alerts instantly</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action button */}
            <div className="px-6 pb-6">
              {status === "connected" ? (
                <button
                  onClick={handleDisconnect}
                  disabled={loading}
                  className="w-full py-3 border-2 border-red-200 text-red-600 rounded-xl font-bold text-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="h-4 w-4" /> Disconnect WhatsApp
                </button>
              ) : (
                <button
                  onClick={status === "connecting" ? undefined : handleConnect}
                  disabled={loading || status === "connecting"}
                  className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    status === "connecting"
                      ? "bg-amber-100 text-amber-600 cursor-default"
                      : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/30"
                  }`}
                >
                  {status === "connecting" ? (
                    <><RefreshCw className="h-4 w-4 animate-spin" />Waiting for QR…</>
                  ) : (
                    <><MessageSquare className="h-4 w-4" />Connect WhatsApp</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Info + Lead log */}
        <div className="lg:col-span-2 space-y-6">
          {/* How it works */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-black text-slate-800 mb-5">How It Works</h2>
            <div className="space-y-4">
              {[
                { step: "1", title: "Connect Your WhatsApp", desc: "Click 'Connect WhatsApp' and scan the QR code with your phone's WhatsApp (Linked Devices).", icon: Smartphone, color: "bg-blue-600" },
                { step: "2", title: "Stay Logged In", desc: "Your WhatsApp session stays active in the background. No need to keep the page open.", icon: Wifi, color: "bg-emerald-600" },
                { step: "3", title: "Receive Client Alerts", desc: "When a new client is assigned to you, PropCRM auto-sends the full details to your WhatsApp instantly.", icon: Bell, color: "bg-amber-500" },
                { step: "4", title: "Take Immediate Action", desc: "You'll see the client's name, phone, property interest, budget, and source — all in one WhatsApp message.", icon: MessageSquare, color: "bg-purple-600" },
              ].map(s => (
                <div key={s.step} className="flex gap-4">
                  <div className={`${s.color} w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-black shrink-0`}>{s.step}</div>
                  <div>
                    <p className="font-black text-slate-800 text-sm">{s.title}</p>
                    <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sample message preview */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-black text-slate-800 mb-4">Sample WhatsApp Message</h2>
            <div className="bg-[#DCF8C6] rounded-2xl rounded-br-none p-4 max-w-xs shadow-sm font-sans text-sm text-slate-900 space-y-1 ml-auto">
              <p>🏠 <strong>New Client Alert — PropCRM</strong></p>
              <p></p>
              <p>👤 <strong>Name:</strong> Amit Kapoor</p>
              <p>📱 <strong>Phone:</strong> +91 98765 43210</p>
              <p>🏡 <strong>Interest:</strong> 3BHK Bandra West</p>
              <p>💰 <strong>Budget:</strong> ₹1.8 Cr</p>
              <p>📌 <strong>Source:</strong> Website Form</p>
              <p></p>
              <p className="text-[10px] text-slate-400">Log in to PropCRM to take action</p>
              <p className="text-[9px] text-slate-400 text-right">17:34 ✓✓</p>
            </div>
          </div>

          {/* Last lead sent */}
          {lastLead && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-center gap-4">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 shrink-0" />
              <div>
                <p className="font-black text-emerald-800">Test client sent!</p>
                <p className="text-emerald-600 text-sm">Client "{lastLead?.name}" was sent to your WhatsApp at {lastLead?.time}</p>
              </div>
            </div>
          )}

          {/* Security note */}
          <div className="flex gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
            <Shield className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 leading-relaxed">
              <strong>Privacy:</strong> Your WhatsApp session is stored securely on our servers using local auth (no password required). Only PropCRM can send messages through this session. You can disconnect at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
