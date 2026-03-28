"use client"
import { useState, useEffect } from "react"
import { 
  Activity, ShieldAlert, Terminal, 
  Search, Filter, Trash2, 
  AlertCircle, Info, Zap,
  Database, Cpu, Globe
} from "lucide-react"

export default function SystemLogsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mocking system logs
    const mockLogs = [
        { id: 1, type: 'API_CALL', level: 'INFO', action: 'Agency registration success', userId: 'admin@elite.re', createdAt: new Date(Date.now() - 5000) },
        { id: 2, type: 'ERROR', level: 'CRITICAL', action: 'Stripe webhook verification failed', userId: 'system', createdAt: new Date(Date.now() - 300000) },
        { id: 3, type: 'AUTH', level: 'WARN', action: 'Failed login attempt (IP: 182.16.2.1)', userId: 'unknown', createdAt: new Date(Date.now() - 1200000) },
        { id: 4, type: 'SYSTEM', level: 'INFO', action: 'WhatsApp broker reconnected', userId: 'system', createdAt: new Date(Date.now() - 3600000) },
    ]
    setLogs(mockLogs)
    setLoading(false)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">System Infrastructure</h1>
          <p className="text-zinc-500 text-sm font-bold">Monitor server health, API traffic, and critical security audits.</p>
        </div>
        <div className="flex items-center gap-3">
            <button className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-black hover:bg-red-100 transition-all flex items-center gap-2">
                <Trash2 className="h-4 w-4" /> Purge Logs
            </button>
            <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20">
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
            <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1">Database Latency</p>
            <h2 className="text-2xl font-black text-zinc-800">14ms</h2>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <Cpu className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full uppercase">3.2% Load</span>
            </div>
            <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1">Compute Resources</p>
            <h2 className="text-2xl font-black text-zinc-800">2 Core / 8GB</h2>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                    <Globe className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-black text-purple-500 bg-purple-50 px-2 py-0.5 rounded-full uppercase">Operational</span>
            </div>
            <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1">API Throughput</p>
            <h2 className="text-2xl font-black text-zinc-800">8.2k rpm</h2>
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
                  <tbody className="divide-y divide-zinc-900/50">
                     {logs.map(log => (
                        <tr key={log.id} className="hover:bg-zinc-900/30 transition-colors">
                           <td className="px-6 py-3 text-zinc-500">{log.createdAt.toLocaleTimeString()}</td>
                           <td className="px-6 py-3">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-black border ${
                                 log.level === 'CRITICAL' ? 'bg-red-950/20 text-red-500 border-red-900/50' :
                                 log.level === 'WARN' ? 'bg-amber-950/20 text-amber-500 border-amber-900/50' :
                                 'bg-blue-950/20 text-blue-500 border-blue-900/50'
                              }`}>
                                 {log.type} / {log.level}
                              </span>
                           </td>
                           <td className="px-6 py-3 text-zinc-300 font-bold">{log.action}</td>
                           <td className="px-6 py-3 text-zinc-500">{log.userId}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
    </div>
  )
}
