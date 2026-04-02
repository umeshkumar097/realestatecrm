"use client"
import { 
  BarChart3, TrendingUp, Users, 
  Target, Calendar, ArrowUpRight,
  ArrowDownRight, PieChart, Activity
} from "lucide-react"

export default function AnalyticsPage() {
  const stats = [
    { name: "Conversion Rate", value: "12.5%", change: "+2.1%", trend: "up" },
    { name: "Avg. Response Time", value: "14m", change: "-4m", trend: "up" },
    { name: "Client Velocity", value: "8/day", change: "+12%", trend: "up" },
    { name: "ROI (Estimated)", value: "₹4.2L", change: "+₹1.2L", trend: "up" }
  ]

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-4 italic font-black">
            <div className="p-3 bg-emerald-600/10 rounded-[20px] shadow-sm">
                <BarChart3 className="h-8 w-8 text-emerald-600" />
            </div>
            Fiscal Intelligence Matrix
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] ml-20 italic font-black">Synthesizing global operational deltas across {stats.length} core intelligence nodes</p>
        </div>
        <div className="flex items-center gap-4">
             <div className="px-6 py-3 bg-white border border-slate-100 rounded-full shadow-sm flex items-center gap-3">
                <Calendar className="h-4 w-4 text-slate-300" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 italic font-black">Fiscal Period Q2-26</span>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((s) => (
          <div key={s.name} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm group hover:shadow-xl transition-all">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 italic font-black">{s.name}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-4xl font-black text-slate-900 italic tracking-tighter">{s.value}</h3>
              <div className={`flex items-center gap-1.5 text-[9px] font-black px-3 py-1.5 rounded-full border shadow-sm italic font-black ${s.trend === 'up' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                {s.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {s.change}
              </div>
            </div>
            <div className="mt-6 w-12 h-1 bg-slate-900 rounded-full transition-all group-hover:w-20" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700">
          <div className="flex items-center justify-between mb-12">
            <div>
                 <h2 className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-4 italic font-black">
                    <div className="p-2 bg-blue-600/10 rounded-[12px]"><TrendingUp className="h-5 w-5 text-blue-600" /></div>
                    Client Velocity Matrix
                 </h2>
                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-2 italic font-black">Acquisition Realization over Time</p>
            </div>
            <select className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 outline-none hover:bg-slate-900 hover:text-white transition-all appearance-none cursor-pointer italic font-black">
               <option>Governance: 7D Delta</option>
               <option>Governance: 30D Delta</option>
            </select>
          </div>
          <div className="h-80 flex items-end justify-between gap-4 px-6 border-b border-slate-50 pb-2">
             {[40, 70, 50, 90, 60, 80, 100, 65, 85, 45].map((h, i) => (
                <div key={i} className="flex-1 group relative cursor-pointer flex flex-col justify-end h-full">
                   <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-black px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all font-black shadow-xl italic whitespace-nowrap z-10">
                     {h} Ingress Nodes
                   </div>
                   <div className="w-full bg-slate-50 rounded-t-[12px] group-hover:bg-blue-600 transition-all duration-500 overflow-hidden relative" style={{ height: `${h}%` }}>
                       <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                   </div>
                </div>
             ))}
          </div>
          <div className="mt-6 flex justify-between text-[9px] font-black text-slate-300 uppercase px-6 tracking-[0.2em] italic font-black">
             <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700">
          <div className="mb-12">
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-4 italic font-black">
                <div className="p-2 bg-amber-600/10 rounded-[12px]"><Target className="h-5 w-5 text-amber-600" /></div>
                Conversion Governance Funnel
            </h2>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-2 italic font-black">Realization Efficiency Matrix</p>
          </div>
          <div className="space-y-10">
            {[
              { name: "Inquiries", count: 1240, color: "bg-blue-600", shadow: "shadow-blue-500/10" },
              { name: "Qualified Nodes", count: 850, color: "bg-indigo-600", shadow: "shadow-indigo-500/10", p: 68 },
              { name: "Operational Meeting", count: 320, color: "bg-purple-600", shadow: "shadow-purple-500/10", p: 37 },
              { name: "Closed Matrix", count: 42, color: "bg-emerald-600", shadow: "shadow-emerald-500/10", p: 13 }
            ].map((f) => (
              <div key={f.name} className="space-y-3 group">
                <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] italic font-black">
                  <span className="group-hover:text-slate-900 transition-colors">{f.name}</span>
                  <span className="text-slate-900 text-sm font-black italic">{f.count}</span>
                </div>
                <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden p-1 shadow-inner">
                  <div className={`h-full ${f.color} rounded-full transition-all duration-1000 ${f.shadow} group-hover:scale-y-110`} style={{ width: `${f.p || 100}%` }}>
                      <div className="h-full w-full bg-gradient-to-r from-white/10 to-transparent" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex items-center justify-between">
              <div>
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] italic font-black">Global Conversion Efficiency</p>
                  <p className="text-xl font-black text-slate-900 italic font-black">3.4% Matrix Yield</p>
              </div>
              <Activity className="text-emerald-500 animate-pulse h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  )
}
