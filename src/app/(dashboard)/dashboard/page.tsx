"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  Users, Building2, TrendingUp, CheckCircle2,
  Clock, ArrowUpRight, MessageSquare,
  IndianRupee, Eye, Calendar,
  Activity, AlertCircle, ChevronRight
} from "lucide-react"
import { useSession } from "next-auth/react"

function cn(...inputs: any[]) { return inputs.filter(Boolean).join(" ") }

export default function DashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [recentLeads, setRecentLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [waStatus, setWaStatus] = useState<string>("DISCONNECTED")
  
  useEffect(() => {
    if (session?.user && (session.user as any).role === "SUPER_ADMIN") {
      router.push("/super-admin")
    }
  }, [session, router])

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, waRes] = await Promise.all([
          fetch("/api/dashboard/stats"),
          fetch("/api/whatsapp")
        ])
        
        if (statsRes.ok) {
          const data = await statsRes.json()
          setStats(data.stats)
          setRecentLeads(data.recentLeads)
        }
        
        if (waRes.ok) {
          const waData = await waRes.json()
          setWaStatus(waData.status)
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  )

  const topStats = [
    { name: "Global Clients", value: stats?.totalLeads || 0, icon: Users, bg: "bg-slate-900", iconBg: "bg-blue-600", text: "text-white" },
    { name: "New Inbound", value: stats?.newLeads || 0, icon: TrendingUp, bg: "bg-white", iconBg: "bg-blue-600/10", text: "text-slate-900" },
    { name: "Elite Inventory", value: stats?.activeProperties || 0, icon: Building2, bg: "bg-white", iconBg: "bg-emerald-500/10", text: "text-slate-900" },
    { name: "Closed Contracts", value: stats?.closedDeals || 0, icon: CheckCircle2, bg: "bg-white", iconBg: "bg-amber-500/10", text: "text-slate-900" },
    { name: "Target Revenue", value: stats?.revenue || "₹0L", icon: IndianRupee, bg: "bg-white", iconBg: "bg-purple-600/10", text: "text-slate-900" },
    { name: "Calyx Messages", value: stats?.messagesCount || 0, icon: MessageSquare, bg: "bg-white", iconBg: "bg-emerald-500/10", text: "text-slate-900" },
  ]

  return (
    <div className="space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tighter italic text-slate-900">{session?.user?.role === "AGENT" ? "Agent Node" : "Agency Control Hub"}</h1>
          <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-[0.2em] italic">System operational · Welcome, {session?.user?.name}.</p>
        </div>
        <div className="flex items-center gap-4">
          {session?.user?.role !== "AGENT" && (
            <Link href="/dashboard/whatsapp" className={`flex items-center gap-3 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl ${
              waStatus === "CONNECTED" 
                ? "bg-white border border-emerald-100 text-emerald-600 hover:bg-emerald-50" 
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30"
            }`}>
              <div className="relative">
                <MessageSquare className="h-4 w-4" />
                {waStatus === "CONNECTED" && <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />}
              </div>
              {waStatus === "CONNECTED" ? "Calyx Online" : "Connect Calyx Sync"}
            </Link>
          )}
          <div className="flex items-center gap-3 bg-white border border-slate-100 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <Clock className="h-4 w-4" />
            {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {topStats.map(s => (
          <div key={s.name} className={`${s.bg} rounded-[32px] p-6 border border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.03)] hover:shadow-2xl hover:scale-105 transition-all group relative overflow-hidden`}>
            {s.bg === "bg-slate-900" && <div className="absolute top-0 right-0 p-12 -mr-8 -mt-8 bg-blue-600/20 rounded-full blur-2xl" />}
            <div className="flex items-center justify-between mb-5 relative">
              <div className={`${s.iconBg} w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-6`}>
                <s.icon className={cn("h-5 w-5", s.bg === "bg-slate-900" ? "text-white" : "text-blue-600")} />
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">{s.name}</p>
            <p className={cn("text-2xl font-black tracking-tight", s.text)}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-10 py-6 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 italic">Live Inbound Activity</h2>
            <Link href="/leads" className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 flex items-center gap-2 hover:gap-4 transition-all">Accelerate All <ArrowUpRight className="h-3 w-3" /></Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentLeads.length > 0 ? recentLeads.map(lead => (
              <div key={lead.id} className="flex items-center gap-5 px-10 py-5 hover:bg-slate-50 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-50 flex items-center justify-center text-slate-900 text-sm font-black shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  {lead.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-slate-900 truncate tracking-tight">{lead.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-widest italic">{lead.phone} · Node: {lead.assignedTo || "Global Ingress"}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={cn(
                    "text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest",
                    lead.status === "NEW" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-emerald-500/10 text-emerald-600"
                  )}>{lead.status}</span>
                  <p className="text-[10px] text-slate-400 mt-1.5 uppercase font-black tracking-tighter">{new Date(lead.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            )) : <div className="p-10 text-center text-slate-300 font-bold italic">Waiting for global inbound leads...</div>}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden p-8">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic mb-8 flex items-center gap-3"><Activity className="h-4 w-4 text-emerald-500" />Ingress Origin</h2>
            <div className="space-y-6">
              {(stats?.sources || [
                { name: "Calyx/WhatsApp", value: 100, color: "bg-emerald-500" }
              ]).map((s: any) => (
                <div key={s.name} className="space-y-2.5">
                  <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <span>{s.name}</span>
                    <span>{s.value}% Cluster</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all duration-1000", s.color || 'bg-blue-600')} style={{ width: `${s.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-10 text-[9px] text-slate-400 font-black uppercase tracking-[0.1em] italic leading-tight">* Statistical weight based on 30-day global cluster data.</p>
          </div>

          {session?.user?.role !== "AGENT" && (
            <div className="bg-slate-900 p-10 rounded-[48px] shadow-3xl shadow-black/20 text-white relative overflow-hidden group">
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
              <h3 className="text-xl font-black mb-3 italic tracking-tighter flex items-center gap-3">Reach Authority <ChevronRight className="h-5 w-5 text-blue-500" /></h3>
              <p className="text-slate-400 text-xs font-medium mb-10 leading-relaxed uppercase tracking-wider">Expand your network. Sync multi-node WhatsApp APIs & deploy AI-intelligence.</p>
              <Link href="/dashboard/billing" className="block text-center w-full py-5 bg-blue-600 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.25em] hover:bg-white hover:text-slate-900 active:scale-95 transition-all shadow-[0_15px_40px_rgba(37,99,235,0.3)]">
                  Consult Plans
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
