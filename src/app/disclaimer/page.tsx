"use client"

import React from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { AlertTriangle, ShieldCheck, Scale } from "lucide-react"

export default function DisclaimerPage() {
    return (
        <div className="min-h-screen bg-zinc-50/50 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
            <Navbar />
            <main className="pt-52 pb-32 container mx-auto px-6 max-w-5xl relative">
                <div className="absolute top-0 right-0 p-32 -mr-16 -mt-16 bg-blue-600/5 rounded-full blur-[80px] -z-10" />
                
                <div className="space-y-6 mb-20">
                    <div className="inline-flex items-center gap-3 px-6 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] italic shadow-xl">
                        <AlertTriangle className="h-3 w-3 text-amber-400" /> Liability Matrix
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter italic text-zinc-900 leading-[0.85]">Architectural <br /><span className="text-blue-600">Disclaimer</span>.</h1>
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 italic">Operational Realization Protocols</p>
                </div>

                <div className="space-y-12 text-lg font-black italic text-zinc-500 leading-relaxed">
                    <section className="space-y-4 p-10 bg-white rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                        <h2 className="text-2xl font-black text-zinc-900 tracking-tighter italic">1. Non-Advisory Provisions</h2>
                        <p className="text-sm">The Master Real Estate Matrix provides architectural tools for operational governance. We do not provide strategic legal advice regarding regional property laws, contracts, or fiscal tax regulations.</p>
                    </section>
                    <section className="space-y-4 p-10 bg-white rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                        <h2 className="text-2xl font-black text-zinc-900 tracking-tighter italic">2. Intelligence Accuracy Matrix</h2>
                        <p className="text-sm">While our connectivity ingress engine is architected for maximum precision, we are not liable for discrepancies in third-party listing registries or portal sync latency nodes.</p>
                    </section>
                    <section className="space-y-4 p-10 bg-white rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                        <h2 className="text-2xl font-black text-zinc-900 tracking-tighter italic">3. Jurisdictional Liability</h2>
                        <p className="text-sm">In no scenario shall the Master Real Estate Matrix or Aiclex Labs be liable for any indirect or consequential parameters arising from the operational use of our architectural nodes.</p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    )
}
