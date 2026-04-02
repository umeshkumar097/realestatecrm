"use client"

import React from "react"
import { Shield } from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-zinc-50/50 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
            <Navbar />
            <main className="pt-52 pb-32 container mx-auto px-6 max-w-5xl relative">
                <div className="absolute top-0 right-0 p-32 -mr-16 -mt-16 bg-blue-600/5 rounded-full blur-[80px] -z-10" />
                
                <div className="space-y-6 mb-20">
                    <div className="inline-flex items-center gap-3 px-6 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] italic shadow-xl">
                        <Shield className="h-3 w-3 text-blue-400" /> Strategic Governance
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter italic text-zinc-900 leading-[0.85]">Service Level <br /><span className="text-blue-600">Agreement</span>.</h1>
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 italic">Operational Directives for the Master Matrix</p>
                </div>

                <div className="space-y-12 text-lg font-black italic text-zinc-500 leading-relaxed">
                    <section className="space-y-4 p-10 bg-white rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                        <h2 className="text-2xl font-black text-zinc-900 tracking-tighter italic">1. Acceptance of Governance Protocol</h2>
                        <p className="text-sm">By accessing the Master Real Estate Matrix ingress, you agree to be bound by these Service Level Agreements and all applicable global governance laws.</p>
                    </section>
                    <section className="space-y-4 p-10 bg-white rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                        <h2 className="text-2xl font-black text-zinc-900 tracking-tighter italic">2. Ingress & License Nodes</h2>
                        <p className="text-sm">We grant you a non-exclusive, non-transferable license to operate within our architectural Matrix for your agency's fiscal and operational governance.</p>
                    </section>
                    <section className="space-y-4 p-10 bg-white rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                        <h2 className="text-2xl font-black text-zinc-900 tracking-tighter italic">3. Matrix Uptime Registry</h2>
                        <p className="text-sm">While we maintain a global standard 99.9% uptime for our connectivity ingress, we do not guarantee uninterrupted node access during scheduled architectural maintenance.</p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    )
}
