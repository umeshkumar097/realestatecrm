"use client"
import { useState, useEffect } from "react"
import { 
  MessageSquare, Users, Activity, 
  ShieldCheck, ShieldAlert, RefreshCcw,
  Unlink, Info, Search, Send, Clock
} from "lucide-react"

export default function WhatsAppControlsPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">WhatsApp Control Center</h1>
          <p className="text-zinc-500 text-sm">Monitor and force-manage connected WhatsApp sessions globally.</p>
        </div>
        <div className="flex items-center gap-3">
            <button className="bg-white border border-zinc-200 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-zinc-50 flex items-center gap-2">
                <RefreshCcw className="h-4 w-4" /> Reset Global Broker
            </button>
            <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 flex items-center gap-2">
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

      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden p-8 flex flex-col items-center justify-center min-h-[400px]">
         <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
            <MessageSquare className="h-10 w-10 text-zinc-300" />
         </div>
         <h2 className="text-xl font-black text-zinc-800 mb-2">Advanced Monitoring Pending</h2>
         <p className="text-zinc-500 text-sm max-w-sm text-center font-bold">This global panel is currently aggregating real-time session logs. Connect your Redis broker to see live message flows.</p>
         <div className="mt-8 flex gap-3">
            <button className="px-6 py-2.5 bg-zinc-950 text-white rounded-xl text-sm font-bold shadow-xl active:scale-95 transition-all">Configure Redis</button>
            <button className="px-6 py-2.5 bg-zinc-100 text-zinc-600 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-all">View Docs</button>
         </div>
      </div>
    </div>
  )
}
