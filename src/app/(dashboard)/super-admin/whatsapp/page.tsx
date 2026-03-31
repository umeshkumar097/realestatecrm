"use client"
import { useState, useEffect } from "react"
import { 
  MessageSquare, Users, Activity, 
  ShieldCheck, ShieldAlert, RefreshCcw,
  Unlink, Info, Search, Send, Clock
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function WhatsAppControlsPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [logs, setLogs] = useState<any[]>([])
  const [logsLoading, setLogsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/super-admin/stats")
        if (res.ok) {
          const data = await res.json()
          setStats(data.stats)
        }
      } catch (err) {
        console.error("Failed to fetch whatsapp stats", err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()

    async function fetchLogs() {
      try {
        const res = await fetch("/api/super-admin/whatsapp/logs")
        if (res.ok) setLogs(await res.json())
      } catch (err) {} finally { setLogsLoading(false) }
    }
    fetchLogs()
    const interval = setInterval(fetchLogs, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleAction = async (action: string, message?: string) => {
    setActionLoading(true)
    try {
      const res = await fetch("/api/super-admin/whatsapp/control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, message })
      })
      const data = await res.json()
      if (res.ok) {
        alert(data.message)
      } else {
        alert(data.error || "Action failed")
      }
    } catch (err) {
      alert("Network error occurred")
    } finally {
      setActionLoading(false)
    }
  }

  const promptBroadcast = () => {
    const msg = prompt("Enter announcement message to send across all connected sessions:")
    if (msg) handleAction("broadcast", msg)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">WhatsApp Control Center</h1>
          <p className="text-zinc-500 text-sm">Monitor and force-manage connected WhatsApp sessions globally.</p>
        </div>
        <div className="flex items-center gap-3">
            <button 
                onClick={() => handleAction("reset")}
                disabled={actionLoading}
                className="bg-white border border-zinc-200 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-zinc-50 flex items-center gap-2 disabled:opacity-50"
            >
                <RefreshCcw className={cn("h-4 w-4", actionLoading && "animate-spin")} /> Reset Global Broker
            </button>
            <button 
                onClick={promptBroadcast}
                disabled={actionLoading}
                className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
            >
                <Send className="h-4 w-4" /> Broadcast Announcement
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active Links</p>
                <p className="text-lg font-black text-zinc-800">{stats?.whatsapp?.active || 0} / {stats?.whatsapp?.total || 0}</p>
            </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                <Clock className="h-5 w-5" />
            </div>
            <div>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Retrying</p>
                <p className="text-lg font-black text-zinc-800">{stats?.whatsapp?.retrying || 0}</p>
            </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-red-50 text-red-600 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Critical Fail</p>
                <p className="text-lg font-black text-red-600">{stats?.whatsapp?.failed || 0}</p>
            </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Activity className="h-5 w-5" />
            </div>
            <div>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Msg / Min</p>
                <p className="text-lg font-black text-zinc-800">Dynamic</p>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
         <div className="px-8 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
            <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary animate-pulse" />
                <h2 className="text-sm font-black uppercase tracking-widest text-zinc-800">Advanced Message Flows</h2>
            </div>
            <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-emerald-600 uppercase">Live Flow</span>
                </span>
                <button onClick={() => setLogsLoading(true)} className="p-1.5 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-zinc-100">
                    <RefreshCcw className={cn("h-3.5 w-3.5 text-zinc-400", logsLoading && "animate-spin")} />
                </button>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-zinc-950 font-mono text-[11px] custom-scrollbar">
            {logs.length === 0 && !logsLoading ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-4 font-sans">
                    <Info className="h-8 w-8 opacity-20" />
                    <p className="font-bold">No message flows detected in the last 24h.</p>
                </div>
            ) : logs.map((log) => (
                <div key={log.id} className="flex gap-4 group border-b border-white/5 pb-2 last:border-0 hover:bg-white/5 transition-colors rounded">
                    <span className="text-zinc-500 shrink-0 select-none">[{new Date(log.createdAt).toLocaleTimeString()}]</span>
                    <span className={cn(
                        "font-black uppercase tracking-tighter w-20 shrink-0",
                        log.level === "ERROR" ? "text-red-400" : log.level === "WARN" ? "text-amber-400" : "text-emerald-400"
                    )}>{log.level}</span>
                    <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-zinc-100 font-bold whitespace-pre-wrap">{log.action}</span>
                        {log.details && Object.keys(log.details).length > 0 && (
                            <span className="text-zinc-500 text-[10px] truncate group-hover:whitespace-pre-wrap group-hover:break-words">
                                {JSON.stringify(log.details)}
                            </span>
                        )}
                    </div>
                </div>
            ))}
            {logsLoading && logs.length === 0 && (
                <div className="h-full flex items-center justify-center">
                    <RefreshCcw className="h-6 w-6 text-zinc-700 animate-spin" />
                </div>
            )}
         </div>

         <div className="px-8 py-3 bg-zinc-100 border-t border-zinc-200 flex items-center justify-between">
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Global Broker: connected via local-bridge</p>
            <div className="flex items-center gap-3">
                <button className="text-[10px] font-black text-zinc-500 hover:text-zinc-800 uppercase">Export Sessions</button>
                <div className="h-3 w-[1px] bg-zinc-300" />
                <button className="text-[10px] font-black text-primary hover:opacity-80 uppercase">Redis Configuration</button>
            </div>
         </div>
      </div>
    </div>
  )
}
