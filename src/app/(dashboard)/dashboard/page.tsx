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
    { name: "Total Clients", value: stats?.totalLeads || 0, icon: Users, bg: "bg-blue-50", iconBg: "bg-blue-600" },
    { name: "New Clients", value: stats?.newLeads || 0, icon: Users, bg: "bg-indigo-50", iconBg: "bg-indigo-600" },
    { name: "Properties", value: stats?.activeProperties || 0, icon: Building2, bg: "bg-emerald-50", iconBg: "bg-emerald-600" },
    { name: "Closed Deals", value: stats?.closedDeals || 0, icon: CheckCircle2, bg: "bg-amber-50", iconBg: "bg-amber-500" },
    { name: "Revenue (Month)", value: stats?.revenue || "₹0L", icon: IndianRupee, bg: "bg-purple-50", iconBg: "bg-purple-600" },
    { name: "WhatsApp Msgs", value: stats?.messagesCount || 0, icon: MessageSquare, bg: "bg-emerald-50", iconBg: "bg-emerald-500" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight">{session?.user?.role === "AGENT" ? "Agent Dashboard" : "Agency Dashboard"}</h1>
          <p className="text-slate-500 text-sm mt-0.5">Welcome back, {session?.user?.name}.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/whatsapp" className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm ${
            waStatus === "CONNECTED" 
              ? "bg-white border border-emerald-100 text-emerald-600 hover:bg-emerald-50" 
              : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30"
          }`}>
            <div className="relative">
              <MessageSquare className="h-4 w-4" />
              {waStatus === "CONNECTED" && <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />}
            </div>
            {waStatus === "CONNECTED" ? "WhatsApp Connected" : "WhatsApp Connect"}
          </Link>
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm text-slate-500">
            <Clock className="h-4 w-4" />
            {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {topStats.map(s => (
          <div key={s.name} className={`${s.bg} rounded-2xl p-4 border border-white/60 shadow-sm hover:shadow-md transition-all`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`${s.iconBg} w-8 h-8 rounded-lg flex items-center justify-center`}>
                <s.icon className="h-4 w-4 text-white" />
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{s.name}</p>
            <p className="text-xl font-black text-slate-800 mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-black text-slate-800">Recent Activity</h2>
            <Link href="/leads" className="text-sm text-blue-600 font-bold flex items-center gap-1 hover:underline">View All <ArrowUpRight className="h-3 w-3" /></Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentLeads.length > 0 ? recentLeads.map(lead => (
              <div key={lead.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black shrink-0">
                  {lead.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-slate-800 truncate">{lead.name}</p>
                  <p className="text-xs text-slate-400 truncate">{lead.phone} · {lead.assignedTo || "Unassigned"}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={cn(
                    "text-[10px] font-black px-2 py-0.5 rounded-full",
                    lead.status === "NEW" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"
                  )}>{lead.status}</span>
                  <p className="text-[9px] text-slate-400 mt-1 uppercase font-bold">{new Date(lead.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            )) : <div className="p-8 text-center text-slate-400">No recent clients found.</div>}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
            <h2 className="font-black text-slate-800 mb-4 flex items-center gap-2"><Activity className="h-4 w-4 text-emerald-500" />Client Sources</h2>
            <div className="space-y-4">
              {(stats?.sources || [
                { name: "WhatsApp", value: 100, color: "bg-emerald-500" }
              ]).map((s: any) => (
                <div key={s.name} className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-400">
                    <span>{s.name}</span>
                    <span>{s.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${s.color || 'bg-primary'} rounded-full transition-all duration-1000`} style={{ width: `${s.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-[11px] text-slate-400 font-bold italic leading-tight">* Based on the last 30 days of incoming traffic.</p>
          </div>

          <div className="bg-primary p-6 rounded-3xl shadow-xl shadow-primary/20 text-white relative overflow-hidden group">
             <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform"></div>
             <h3 className="text-lg font-black mb-2 flex items-center gap-2">Upgrade to Pro <ChevronRight className="h-4 w-4" /></h3>
             <p className="text-white/80 text-[11px] mb-6 leading-relaxed">Connect multiple WhatsApp numbers and unlock AI-powered intent extraction & auto-replies.</p>
             <Link href="/dashboard/billing" className="block text-center w-full py-3 bg-white text-primary rounded-xl font-black text-xs hover:bg-slate-50 active:scale-95 transition-all shadow-lg">
                 View Pricing Plans
             </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
