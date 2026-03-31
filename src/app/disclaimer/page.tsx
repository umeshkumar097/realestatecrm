"use client"

import React from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function DisclaimerPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-zinc-900">
            <Navbar />
            <main className="pt-40 pb-20 container mx-auto px-6 max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-12">Disclaimer.</h1>
                <div className="space-y-10 text-lg font-medium text-zinc-600 leading-relaxed italic">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-zinc-900 italic tracking-tight">1. No Legal Advice</h2>
                        <p>PropGoCRM provides tools for real estate management. We do not provide legal advice regarding property laws, contracts, or tax regulations.</p>
                    </section>
                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-zinc-900 italic tracking-tight">2. Data Accuracy</h2>
                        <p>While our portal sync engine is highly accurate, we are not responsible for errors in third-party listing data or portal sync delays.</p>
                    </section>
                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-zinc-900 italic tracking-tight">3. Liability</h2>
                        <p>In no event shall PropGoCRM or Aiclex Technologies be liable for any indirect or consequential damages arising from the use of our services.</p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    )
}
