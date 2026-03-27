"use client"
import { useState, useEffect } from "react"
import { 
  BarChart3, Users, ListTodo, 
  MessageSquare, TrendingUp, ArrowUpRight,
  PieChart, Activity, Calendar
} from "lucide-react"

export default function ReportsPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/reports/stats")
        if (!res.ok) {
          const errData = await res.json().catch(() => ({ error: "Unknown Error" }))
          throw new Error(errData.error || `Error ${res.status}: Failed to load metrics`)
        }
        
        const data = await res.json()
        setStats(data)
      } catch (err: any) {
        console.error("Failed to load report stats:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  )

  if (error || !stats) return (
    <div className="p-12 text-center bg-white rounded-[40px] border border-slate-100 shadow-sm">
      <div className="inline-flex items-center justify-center p-4 bg-red-50 text-red-600 rounded-3xl mb-4">
        <Activity className="h-8 w-8" />
      </div>
      <h2 className="text-xl font-black text-slate-800">Connection Issue</h2>
      <p className="text-slate-500 mt-2 max-w-xs mx-auto text-sm font-bold">
        {error || "We couldn't retrieve your agency metrics right now."}
      </p>
      <div className="mt-8 flex flex-col gap-3 items-center">
        <button 
          onClick={() => window.location.reload()} 
          className="px-8 py-3 bg-primary text-white rounded-2xl text-xs font-black shadow-lg shadow-primary/20 hover:scale-105 transition-all"
        >
          Try Refreshing
        </button>
        <a href="/dashboard/debug" className="text-[10px] text-slate-400 font-black uppercase hover:text-primary transition-all">
          Check Session Status (Debug)
        </a>
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Executive Reports</h1>
        <p className="text-slate-500 text-sm mt-0.5">Comprehensive analytics of your agency performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Leads Report */}
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
           <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-50/50 rounded-full blur-3xl group-hover:bg-blue-100 transition-all"></div>
           <div className="relative z-10">
             <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit mb-6"><Users className="h-6 w-6" /></div>
             <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Clients Performance</p>
             <h3 className="text-4xl font-black text-slate-800 mt-2">{stats.leads.total}</h3>
             <div className="mt-8 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500">Converted</span>
                  <span className="text-xs font-black text-emerald-600">{(stats.leads.converted / stats.leads.total * 100 || 0).toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${(stats.leads.converted / stats.leads.total * 100 || 0)}%` }}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500">Site Visits</span>
                  <span className="text-xs font-black text-amber-600">{stats.leads.siteVisit} Clients</span>
                </div>
             </div>
           </div>
        </div>

        {/* Tasks Report */}
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
           <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-50/50 rounded-full blur-3xl group-hover:bg-indigo-100 transition-all"></div>
           <div className="relative z-10">
             <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl w-fit mb-6"><ListTodo className="h-6 w-6" /></div>
             <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Team Efficiency</p>
             <h3 className="text-4xl font-black text-slate-800 mt-2">{stats.tasks.total}</h3>
             <div className="mt-8 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500">Completion Rate</span>
                  <span className="text-xs font-black text-indigo-600">{(stats.tasks.complete / stats.tasks.total * 100 || 0).toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: `${(stats.tasks.complete / stats.tasks.total * 100 || 0)}%` }}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500">Pending Actions</span>
                  <span className="text-xs font-black text-red-600">{stats.tasks.pending} Tasks</span>
                </div>
             </div>
           </div>
        </div>

        {/* Support Report */}
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
           <div className="absolute -right-10 -top-10 w-40 h-40 bg-rose-50/50 rounded-full blur-3xl group-hover:bg-rose-100 transition-all"></div>
           <div className="relative z-10">
             <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl w-fit mb-6"><Activity className="h-6 w-6" /></div>
             <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Support Response</p>
             <h3 className="text-4xl font-black text-slate-800 mt-2">{stats.tickets.total}</h3>
             <div className="mt-8 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500">Resolution Status</span>
                  <span className="text-xs font-black text-rose-600">{( (stats.tickets.total - stats.tickets.open) / stats.tickets.total * 100 || 0).toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500" style={{ width: `${( (stats.tickets.total - stats.tickets.open) / stats.tickets.total * 100 || 0)}%` }}></div>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-tighter">Open Tickets: {stats.tickets.open}</p>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}
