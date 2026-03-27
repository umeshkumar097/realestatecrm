import InnerPageLayout from "@/components/inner-page-layout"

export default function PrivacyPage() {
  return (
    <InnerPageLayout 
      badge="Legal"
      title="Privacy Policy"
      subtitle="Last updated: March 26, 2026. Your privacy is our priority at PropCRM by Aiclex Technologies."
    >
      <div className="prose prose-slate max-w-none space-y-8 text-slate-600">
        <section>
          <h2 className="text-xl font-black text-slate-900 mb-3">1. Information We Collect</h2>
          <p className="leading-relaxed">
            We collect information you provide directly to us when you create an account, such as your name, email address, agency name, and phone number. We also collect data from your connected WhatsApp sessions to provide the CRM services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-3">2. How We Use Your Information</h2>
          <p className="leading-relaxed">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Provide, maintain, and improve our services.</li>
            <li>Process transactions and send related information.</li>
            <li>Send you technical notices, updates, and support messages.</li>
            <li>Respond to your comments and questions.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-3">3. Data Security</h2>
          <p className="leading-relaxed">
            We use industry-standard security measures to protect your information. WhatsApp sessions are stored using local authentication tokens and are never shared with third parties.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-3">4. Your Rights</h2>
          <p className="leading-relaxed">
            You have the right to access, correct, or delete your personal data at any time through your dashboard or by contacting us.
          </p>
        </section>

        <section className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
          <p className="text-sm font-bold text-blue-800">Questions about our Privacy Policy?</p>
          <p className="text-xs text-blue-600 mt-1">
            Contact us at <a href="mailto:privacy@aiclex.in" className="underline">privacy@aiclex.in</a>
          </p>
        </section>
      </div>
    </InnerPageLayout>
  )
}
