import InnerPageLayout from "@/components/inner-page-layout"

export default function RoadmapPage() {
  const quarters = [
    { q: "Q2 2026", items: ["AI-powered lead scoring", "WhatsApp Broadcasts", "Mobile App (Alpha)"] },
    { q: "Q3 2026", items: ["Digital Document Signing", "Integration with Property Portals", "Advanced Team Analytics"] },
  ]

  return (
    <InnerPageLayout 
      badge="Future"
      title="Product Roadmap"
      subtitle="The future of real estate tech is here. See what we're building next."
    >
      <div className="space-y-10">
        {quarters.map(q => (
          <div key={q.q} className="p-8 bg-slate-50 border border-slate-100 rounded-3xl">
            <h3 className="text-xl font-black text-slate-800 mb-5">{q.q}</h3>
            <ul className="space-y-4">
              {q.items.map(i => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-blue-200 mt-0.5 shrink-0" />
                  <span className="text-slate-600 font-medium">{i}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl text-center">
            <p className="text-sm font-bold text-blue-800 italic">Have a feature request? Let us know at <a href="mailto:hello@aiclex.in" className="underline">hello@aiclex.in</a></p>
        </div>
      </div>
    </InnerPageLayout>
  )
}
