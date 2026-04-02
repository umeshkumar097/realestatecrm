"use client"

import React from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Shield, Lock, Globe } from "lucide-react"

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-zinc-50/50 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
            <Navbar />
            <main className="pt-52 pb-32 container mx-auto px-6 max-w-5xl relative">
                <div className="absolute top-0 right-0 p-32 -mr-16 -mt-16 bg-blue-600/5 rounded-full blur-[80px] -z-10" />
                
                <div className="space-y-6 mb-20">
                    <div className="inline-flex items-center gap-3 px-6 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] italic shadow-xl">
                        <Lock className="h-3 w-3 text-blue-400" /> Data Residency Protocol
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter italic text-zinc-900 leading-[0.85]">Privacy & <br /><span className="text-blue-600">Security Matrix</span>.</h1>
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 italic">Global Sovereignty Protection Registry</p>
                </div>

                <div className="space-y-12 text-lg font-black italic text-zinc-500 leading-relaxed">
                    <section className="space-y-4 p-10 bg-white rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                        <h2 className="text-2xl font-black text-zinc-900 tracking-tighter italic">1. Connectivity Ingress Collection</h2>
                        <p className="text-sm">We collect only the intelligence parameters necessary to provide absolute world-class CRM governance. This includes contact nodes, property inventory registries, and interaction history captured through our portal sync engine.</p>
                    </section>
                    <section className="space-y-4 p-10 bg-white rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                        <h2 className="text-2xl font-black text-zinc-900 tracking-tighter italic">2. Information Security Matrix</h2>
                        <p className="text-sm">Your operational data is protected using AES-256 military-grade encryption. We employ strict architectural access controls and regular security audits to ensure your agency's proprietary intelligence remains confidential.</p>
                    </section>
                    <section className="space-y-4 p-10 bg-white rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                        <h2 className="text-2xl font-black text-zinc-900 tracking-tighter italic">3. Global Compliance Registry</h2>
                        <p className="text-sm">The Master Real Estate Matrix is architected to comply with international sovereignty standards, including GDPR and UAE data residency regulations. Your intelligence is never commercialized to third-party nodes.</p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    )
}
