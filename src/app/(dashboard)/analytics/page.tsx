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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Business Intelligence</h1>
        <p className="text-slate-500 text-sm mt-0.5">Deep insights into your agency's sales performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.name} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{s.name}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-black text-slate-800">{s.value}</h3>
              <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full ${s.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {s.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {s.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-black text-slate-800 flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" />Client Growth</h2>
            <select className="bg-slate-50 border-none rounded-lg text-xs font-bold text-slate-500">
               <option>Last 7 Days</option>
               <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 px-4">
             {[40, 70, 50, 90, 60, 80, 100].map((h, i) => (
               <div key={i} className="flex-1 bg-primary/10 rounded-t-xl relative group cursor-pointer hover:bg-primary/20 transition-all" style={{ height: `${h}%` }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {h}Clients
                  </div>
               </div>
             ))}
          </div>
          <div className="mt-4 flex justify-between text-[10px] font-black text-slate-300 uppercase px-4">
             <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h2 className="font-black text-slate-800 mb-8 flex items-center gap-2"><Target className="h-5 w-5 text-amber-500" />Conversion Funnel</h2>
          <div className="space-y-6">
            {[
              { name: "Inquiries", count: 1240, color: "bg-blue-500" },
              { name: "Qualified", count: 850, color: "bg-indigo-500", p: 68 },
              { name: "Meeting", count: 320, color: "bg-purple-500", p: 37 },
              { name: "Closed", count: 42, color: "bg-emerald-500", p: 13 }
            ].map((f) => (
              <div key={f.name} className="space-y-2">
                <div className="flex justify-between items-center text-xs font-black uppercase text-slate-400">
                  <span>{f.name}</span>
                  <span className="text-slate-800">{f.count}</span>
                </div>
                <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div className={`h-full ${f.color} rounded-full`} style={{ width: `${f.p || 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
