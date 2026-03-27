import InnerPageLayout from "@/components/inner-page-layout"

export default function TermsPage() {
  return (
    <InnerPageLayout 
      badge="Legal"
      title="Terms of Service"
      subtitle="By using PropCRM, you agree to these terms. Please read them carefully."
    >
      <div className="prose prose-slate max-w-none space-y-8 text-slate-600">
        <section>
          <h2 className="text-xl font-black text-slate-900 mb-3">1. Acceptance of Terms</h2>
          <p className="leading-relaxed">
            By accessing or using PropCRM (a product of Aiclex Technologies), you agree to be bound by these Terms of Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-3">2. Use of Services</h2>
          <p className="leading-relaxed">
            You must be a real estate professional or agency to use this service. You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-3">3. WhatsApp Integration</h2>
          <p className="leading-relaxed">
            PropCRM uses the Baileys library to connect to WhatsApp. You agree to use this integration in compliance with WhatsApp's Terms of Service and Anti-Spam policies. We are not responsible for any issues resulting from your use of WhatsApp.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-3">4. Fees and Payment</h2>
          <p className="leading-relaxed">
            Certain aspects of the service are provided for a fee. You agree to pay all fees and charges associated with your account on time.
          </p>
        </section>

        <section className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <p className="text-sm font-bold text-slate-800">Detailed Terms</p>
          <p className="text-xs text-slate-500 mt-1">
            These terms are governed by the laws of India. Any disputes will be subject to the exclusive jurisdiction of the courts in Pune, Maharashtra.
          </p>
        </section>
      </div>
    </InnerPageLayout>
  )
}
