import InnerPageLayout from "@/components/inner-page-layout"

export default function SecurityPage() {
  return (
    <InnerPageLayout 
      badge="Trust"
      title="Security & Data Privacy"
      subtitle="How we protect your agency data and WhatsApp sessions."
    >
      <div className="space-y-8 text-slate-600">
        <section>
          <h2 className="text-xl font-black text-slate-900 mb-3">WhatsApp Session Safety</h2>
          <p className="text-sm leading-relaxed">
            The Master Real Estate Matrix uses the Baileys library, which connects directly to WhatsApp's web servers. We do not store your messages on our central server unless they are part of a lead record you've authorized.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-3">Database Isolation</h2>
          <p className="text-sm leading-relaxed">
            Your agency data is logically isolated at the database level. Each query is scoped to your <code>agencyId</code>, ensuring that agents from other companies can never see your leads.
          </p>
        </section>

        <section className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl">
          <p className="text-sm font-bold text-emerald-800">Bounty Program</p>
          <p className="text-xs text-emerald-600 mt-1">Found a security bug? Report it to <a href="mailto:security@aiclex.in" className="underline">security@aiclex.in</a> and help us build a safer PropTech ecosystem.</p>
        </section>
      </div>
    </InnerPageLayout>
  )
}
