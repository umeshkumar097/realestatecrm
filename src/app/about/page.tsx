import InnerPageLayout from "@/components/inner-page-layout"
import Link from "next/link"
import { Building2, Users, Zap, Globe, Award, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <InnerPageLayout
      badge="Our Story"
      title="Built by Agents, for Agents."
      subtitle="PropCRM was born out of frustration with generic CRMs that don't understand real estate. We are Aiclex Technologies — a team of builders passionate about helping Indian agencies scale."
    >
      <div className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Users, label: "500+ Agencies", desc: "Trust PropCRM across India" },
            { icon: Building2, label: "₹200Cr+", desc: "Deals closed using PropCRM" },
            { icon: Zap, label: "4.9/5 Rating", desc: "From verified agency owners" },
          ].map(s => (
            <div key={s.label} className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <s.icon className="h-6 w-6 text-white" />
              </div>
              <p className="text-xl font-black text-slate-900">{s.label}</p>
              <p className="text-sm text-slate-500 mt-1">{s.desc}</p>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-2xl font-black text-slate-900 mb-4">Who We Are</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            <strong>Aiclex Technologies</strong> is a Pune-based SaaS company focused on building intelligent business tools for Indian SMBs. PropCRM is our flagship product, purpose-built for the real estate sector.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            We understand that property businesses in India operate differently — WhatsApp is the first touchpoint, site visits matter, and relationship management is paramount. PropCRM is designed around these realities.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Visit us at <a href="https://aiclex.in" target="_blank" className="text-blue-600 font-semibold hover:underline">aiclex.in</a> to learn more about what we are building.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-black text-slate-900 mb-6">Our Values</h2>
          <div className="space-y-4">
            {[
              { icon: Heart, title: "Customer First", desc: "Every feature starts with a real pain point from a real agency owner." },
              { icon: Globe, title: "Built for India", desc: "INR pricing, local language support, and India-first integrations." },
              { icon: Award, title: "Reliability", desc: "99.9% uptime SLA. Your leads never sleep — and neither does PropCRM." },
            ].map(v => (
              <div key={v.title} className="flex gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center shrink-0">
                  <v.icon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-black text-slate-800">{v.title}</p>
                  <p className="text-slate-500 text-sm mt-1">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-center">
          <p className="text-white font-black text-xl mb-2">Ready to transform your agency?</p>
          <p className="text-blue-200 text-sm mb-6">Start your 14-day free trial — no credit card needed.</p>
          <Link href="/signup" className="inline-block px-8 py-3 bg-white text-blue-700 rounded-xl font-black hover:scale-105 transition-all shadow-lg">
            Start Free Trial →
          </Link>
        </div>
      </div>
    </InnerPageLayout>
  )
}
