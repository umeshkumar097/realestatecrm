import InnerPageLayout from "@/components/inner-page-layout"

export default function ChangelogPage() {
  return (
    <InnerPageLayout 
      badge="Updates"
      title="Product Changelog"
      subtitle="Stay up to date with the latest features and improvements in PropCRM."
    >
      <div className="space-y-12">
        <div className="relative pl-8 border-l-2 border-slate-100">
          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-sm" />
          <h3 className="text-lg font-black text-slate-900 mb-2">v2.1.0 — Multi-tenant Baileys Bridge</h3>
          <p className="text-xs text-slate-400 font-bold uppercase mb-4">March 26, 2026</p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
            <li>New: Persistent WhatsApp sessions per agent.</li>
            <li>New: Auto-lead creation from incoming messages.</li>
            <li>New: Role-based dashboard stats (Agent vs Agency).</li>
            <li>Fix: Resolved JSON parsing stability issues on API errors.</li>
          </ul>
        </div>

        <div className="relative pl-8 border-l-2 border-slate-100 opacity-60">
          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-200 border-4 border-white" />
          <h3 className="text-lg font-black text-slate-900 mb-2">v2.0.4 — Premium Lead UI</h3>
          <p className="text-xs text-slate-400 font-bold uppercase mb-4">March 15, 2026</p>
          <p className="text-sm text-slate-600 italic">Initial release of the high-fidelity lead management table.</p>
        </div>
      </div>
    </InnerPageLayout>
  )
}
