import InnerPageLayout from "@/components/inner-page-layout"

export default function IntegrationsPage() {
  const integrations = [
    { name: "WhatsApp", desc: "Native Baileys bridge for real-time messaging." },
    { name: "Zapier", desc: "Connect with over 5000+ other business apps." },
    { name: "Magicbricks", desc: "Auto-sync leads from the property portal." },
    { name: "99acres", desc: "Capture inquiries instantly into your CRM." },
  ]

  return (
    <InnerPageLayout 
      badge="Ecosystem"
      title="Integrations"
      subtitle="Connect PropCRM with the tools you already use every day."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map(i => (
          <div key={i.name} className="p-6 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors group">
            <h3 className="font-black text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{i.name}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{i.desc}</p>
          </div>
        ))}
      </div>
    </InnerPageLayout>
  )
}
