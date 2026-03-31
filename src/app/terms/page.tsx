"use client"

import React from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-zinc-900">
            <Navbar />
            <main className="pt-40 pb-20 container mx-auto px-6 max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-12">Terms of Service.</h1>
                <div className="space-y-10 text-lg font-medium text-zinc-600 leading-relaxed italic">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-zinc-900 italic tracking-tight">1. Acceptance of Terms</h2>
                        <p>By accessing PropGoCRM, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
                    </section>
                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-zinc-900 italic tracking-tight">2. License to Use</h2>
                        <p>We grant you a non-exclusive, non-transferable license to use our CRM software for your real estate business operations.</p>
                    </section>
                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-zinc-900 italic tracking-tight">3. Service Availability</h2>
                        <p>While we strive for 99.9% uptime, we do not guarantee uninterrupted service. Maintenance is scheduled during low-traffic periods.</p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    )
}
