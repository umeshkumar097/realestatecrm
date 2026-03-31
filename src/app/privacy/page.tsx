"use client"

import React from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-zinc-900">
            <Navbar />
            <main className="pt-40 pb-20 container mx-auto px-6 max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-12">Privacy Policy.</h1>
                <div className="space-y-10 text-lg font-medium text-zinc-600 leading-relaxed italic">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-zinc-900 italic tracking-tight">1. Data Collection</h2>
                        <p>We collect only the data necessary to provide you with world-class CRM services. This includes contact information, property listing data, and lead interaction history captured through our portal synchronization engine.</p>
                    </section>
                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-zinc-900 italic tracking-tight">2. Information Security</h2>
                        <p>Your data is protected using AES-256 military-grade encryption. We employ strict access controls and regular security audits to ensure your agency's proprietary information remains confidential.</p>
                    </section>
                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-zinc-900 italic tracking-tight">3. Global Compliance</h2>
                        <p>PropGoCRM is built to comply with international data protection standards, including GDPR and UAE data sovereignty regulations. We do not sell your data to third parties.</p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    )
}
