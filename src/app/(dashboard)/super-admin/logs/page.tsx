"use client"
import { useState, useEffect } from "react"
import { 
  Activity, ShieldAlert, Terminal, 
  Search, Filter, Trash2, 
  AlertCircle, Info, Zap,
  Database, Cpu, Globe
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function SystemLogsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [health, setHealth] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/super-admin/logs")
      if (res.ok) {
        const data = await res.json()
        setLogs(data.logs)
        setHealth(data.health)
      }
    } catch (err) {
      console.error("Failed to fetch logs", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  const purgeLogs = async () => {
    if (!confirm("Are you sure you want to purge all system logs?")) return
    try {
      const res = await fetch("/api/super-admin/logs", { method: "DELETE" })
      if (res.ok) {
        setLogs([])
        alert("Logs purged successfully")
      }
    } catch (err) {
      alert("Failed to purge logs")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">System Infrastructure</h1>
          <p className="text-zinc-500 text-sm font-bold">Monitor server health, API traffic, and critical security audits.</p>
        </div>
        <div className="flex items-center gap-3">
            <button 
                onClick={purgeLogs}
                className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
            >
                <Trash2 className="h-4 w-4" /> Purge Logs
            </button>
            <button 
                onClick={fetchLogs}
                className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
            >
                Refresh Live
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <Database className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">Healthy</span>
            </div>
             <div>
                 <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Database Latency</p>
                 <p className="text-3xl font-black text-zinc-800">{health?.dbLatency || "..."}</p>
             </div>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
             <div className="flex justify-between items-start mb-4">
                 <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                     <Cpu className="h-6 w-6" />
                 </div>
                 <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 uppercase">
                     {health?.load || "..."}
                 </span>
             </div>
             <div>
                 <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Compute Resources</p>
                 <p className="text-xl font-black text-zinc-800">{health?.compute || "..."}</p>
             </div>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
             <div className="flex justify-between items-start mb-4">
                 <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                     <Globe className="h-6 w-6" />
                 </div>
                 <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 uppercase">
                     {health?.status || "..."}
                 </span>
             </div>
             <div>
                 <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">API Throughput</p>
                 <p className="text-2xl font-black text-zinc-800">{health?.throughput || "..."}</p>
             </div>
         </div>
      </div>

      <div className="bg-zinc-950 rounded-3xl overflow-hidden shadow-2xl border border-zinc-800">
         <div className="px-8 py-5 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Terminal className="h-4 w-4 text-zinc-500" />
                <h2 className="text-sm font-black text-zinc-200 uppercase tracking-widest">Global Audit Trail</h2>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[10px] font-black text-zinc-500 uppercase tracking-tighter">Live Streaming...</span>
               </div>
            </div>
         </div>
         <div className="p-2 font-mono text-[11px]">
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="text-zinc-600 border-b border-zinc-800/50">
                        <th className="px-6 py-3 font-bold uppercase">Timestamp</th>
                        <th className="px-6 py-3 font-bold uppercase">Type/Level</th>
                        <th className="px-6 py-3 font-bold uppercase">Action Descriptor</th>
                        <th className="px-6 py-3 font-bold uppercase">Actor</th>
                     </tr>
                  </thead>
                    <tbody className="divide-y divide-zinc-900">
                        {logs.length > 0 ? logs.map((log) => (
                            <tr key={log.id} className="hover:bg-zinc-900/50 transition-colors">
                            <td className="px-8 py-4 text-xs font-bold text-zinc-500">{new Date(log.createdAt).toLocaleTimeString()}</td>
                            <td className="px-8 py-4">
                                <span className={cn(
                                    "text-[9px] font-black px-2 py-0.5 rounded uppercase border",
                                    log.level === 'CRITICAL' || log.level === 'ERROR' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                    log.level === 'WARN' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                    "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                )}>
                                    {log.type} / {log.level}
                                </span>
                            </td>
                            <td className="px-8 py-4 text-xs font-medium text-zinc-300 font-mono italic">{log.action}</td>
                            <td className="px-8 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{log.actor || 'system'}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={4} className="px-8 py-16 text-center text-zinc-500 text-sm italic">
                                    No system logs found.
                                </td>
                            </tr>
                        )}
                    </tbody>
               </table>
            </div>
         </div>
      </div>
    </div>
  )
}
