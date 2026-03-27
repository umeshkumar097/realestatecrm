import InnerPageLayout from "@/components/inner-page-layout"
import { HelpCircle, Book, MessageCircle, Video } from "lucide-react"

export default function HelpPage() {
  const faqs = [
    { q: "How do I connect my WhatsApp?", a: "Go to Dashboard -> WhatsApp Connect and click 'Connect WhatsApp'. A QR code will appear. Scan it with your phone's WhatsApp (Linked Devices)." },
    { q: "Can I connect multiple numbers?", a: "Starter plan supports 1 number. Professional supports up to 5, and Enterprise is unlimited. Each agent can connect their own instance." },
    { q: "Is my data secure?", a: "Yes. We use end-to-end encryption for WhatsApp messages and store your session tokens in a secure browser-based vault." },
    { q: "How are clients auto-created?", a: "Our Baileys bridge listens for new messages. If a number isn't in your CRM, it automatically creates a new client and notifies the assigned agent." },
  ]

  return (
    <InnerPageLayout 
      badge="Support"
      title="Help Center"
      subtitle="Find answers, watch tutorials, or talk to our support team."
    >
      <div className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: Book, label: "Documentation", desc: "Detailed guides for every feature." },
            { icon: Video, label: "Video Tutorials", desc: "Watch how to set up your agency." },
            { icon: MessageCircle, label: "Live Chat", desc: "Talk to our team on WhatsApp." },
            { icon: HelpCircle, label: "FAQ", desc: "Quick answers to common questions." },
          ].map(s => (
            <div key={s.label} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-4 hover:border-blue-200 transition-colors">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                <s.icon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-black text-slate-800 text-sm">{s.label}</p>
                <p className="text-xs text-slate-500 mt-1">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div key={i} className="p-5 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors">
                <p className="font-bold text-slate-800 text-sm mb-2">{f.q}</p>
                <p className="text-slate-500 text-xs leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-600 rounded-3xl p-8 text-center text-white">
          <p className="font-black text-xl mb-2">Still need help?</p>
          <p className="text-blue-100 text-sm mb-6">Our average response time for Professional users is under 30 minutes.</p>
          <a href="mailto:support@aiclex.in" className="inline-block px-8 py-3 bg-white text-blue-600 rounded-xl font-black hover:scale-105 transition-all shadow-lg">
            Email Support
          </a>
        </div>
      </div>
    </InnerPageLayout>
  )
}
