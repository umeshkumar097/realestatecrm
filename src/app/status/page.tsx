import InnerPageLayout from "@/components/inner-page-layout"
import { CheckCircle2, AlertCircle, Clock } from "lucide-react"

export default function StatusPage() {
  const systems = [
    { name: "API Servers", status: "Operational", color: "text-emerald-500" },
    { name: "WhatsApp Bridge", status: "Operational", color: "text-emerald-500" },
    { name: "Database Cluster", status: "Operational", color: "text-emerald-500" },
    { name: "Dashboard UI", status: "Operational", color: "text-emerald-500" },
  ]

  return (
    <InnerPageLayout 
      badge="Systems"
      title="Status"
      subtitle="All systems are currently operational and monitored 24/7."
    >
      <div className="space-y-8">
        <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-3xl flex items-center gap-4">
          <CheckCircle2 className="h-10 w-10 text-emerald-500 shrink-0" />
          <div>
            <p className="font-black text-emerald-800">All Systems Operational</p>
            <p className="text-emerald-600 text-sm">Last checked: Just now</p>
          </div>
        </div>

        <div className="space-y-3">
          {systems.map(s => (
            <div key={s.name} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl">
              <span className="text-sm font-bold text-slate-700">{s.name}</span>
              <span className={`text-[10px] font-black uppercase tracking-widest ${s.color}`}>{s.status}</span>
            </div>
          ))}
        </div>

        <div className="p-6 border border-slate-200 rounded-3xl">
          <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2"><Clock className="h-4 w-4" /> Past Incidents</h2>
          <div className="space-y-4">
            <div className="text-sm">
              <p className="font-bold text-slate-500">March 12 — Scheduled Maintenance</p>
              <p className="text-slate-400 text-xs mt-1">Database migration completed successfully with 5 minutes downtime.</p>
            </div>
          </div>
        </div>
      </div>
    </InnerPageLayout>
  )
}
