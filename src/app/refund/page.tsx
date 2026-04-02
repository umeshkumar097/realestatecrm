"use client"

import React from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function RefundPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-zinc-900">
            <Navbar />
            <main className="pt-40 pb-20 container mx-auto px-6 max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-12">Refund Policy.</h1>
                <div className="space-y-10 text-lg font-medium text-zinc-600 leading-relaxed">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-zinc-900 tracking-tight">1. Service Commitment</h2>
                        <p>The Master Real Estate Matrix provides high-performance SaaS solutions. We offer a 14-day discovery phase to ensure the architecture meets your agency's needs before fiscal commitment begins.</p>
                    </section>
                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-zinc-900 tracking-tight">2. Subscription Refunds</h2>
                        <p>Refunds are processed on a case-by-case basis within 7 days of the initial subscription charge if the service is found to be non-functional for your region.</p>
                    </section>
                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-zinc-900 tracking-tight">3. Cancellation</h2>
                        <p>You may cancel your subscription at any time. Access will continue until the end of your current billing cycle.</p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    )
}
