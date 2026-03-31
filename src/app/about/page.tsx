"use client"

import { Building2, Globe, ShieldCheck, Users, Zap, ArrowRight, Heart, Target, Lightbulb } from "lucide-react"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import Logo from "@/components/Logo"

const StoryCard = ({ title, desc, icon: Icon, delay }: { title: string, desc: string, icon: any, delay: string }) => (
    <div className={`p-10 bg-white rounded-[40px] border border-zinc-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group animate-in fade-in slide-in-from-bottom-8 fill-mode-both ${delay}`}>
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8 group-hover:scale-110 transition-transform">
            <Icon size={32} />
        </div>
        <h3 className="text-2xl font-black text-zinc-900 mb-4 italic tracking-tight">{title}</h3>
        <p className="text-zinc-500 text-lg font-medium leading-relaxed">{desc}</p>
    </div>
)

export default function AboutPage() {
    const [scrolled, setScrolled] = useState(false)
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
            {/* Header / Nav Overlay */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm py-4' : 'bg-transparent py-8'}`}>
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <Link href="/">
                        <Logo />
                    </Link>
                    <div className="hidden md:flex items-center gap-12">
                        <Link href="/" className="text-sm font-black uppercase tracking-widest text-zinc-500 hover:text-blue-600 transition-colors">Home</Link>
                        <Link href="/features" className="text-sm font-black uppercase tracking-widest text-zinc-500 hover:text-blue-600 transition-colors">Features</Link>
                        <Link href="/about" className="text-sm font-black uppercase tracking-widest text-blue-600">About Us</Link>
                        <Link href="/contact" className="text-sm font-black uppercase tracking-widest text-zinc-500 hover:text-blue-600 transition-colors">Contact</Link>
                    </div>
                    <Link href="/signup" className="hidden md:block bg-zinc-900 text-white px-8 py-3 rounded-2xl text-sm font-black italic tracking-tight hover:bg-blue-600 transition-all shadow-xl shadow-zinc-200">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* HERO SECTION */}
            <section className="pt-48 pb-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 -skew-x-12 translate-x-1/4 -z-10 blur-3xl rounded-[100px]" />
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center space-y-12">
                        <div className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100 animate-bounce">
                            <Zap size={14} /> Global Standard 2026
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tight text-zinc-900 leading-[0.9] italic balance">
                            The Brain Behind <span className="text-blue-600">Global</span> Real Estate Excellence.
                        </h1>
                        <p className="text-xl md:text-2xl text-zinc-500 font-medium max-w-2xl mx-auto leading-relaxed">
                            PropGoCRM was born out of a simple necessity: To make high-performance real estate automation accessible to every agency worldwide. 
                        </p>
                    </div>
                </div>
            </section>

            {/* OUR STORY / PARTNERSHIP */}
            <section className="py-32 bg-zinc-50/50">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <span className="text-sm font-black text-blue-600 uppercase tracking-[0.3em]">Our Engineering Heritage</span>
                                <h2 className="text-4xl md:text-6xl font-black italic tracking-tight text-zinc-900">
                                    Powered by <span className="text-zinc-400">AICLEX</span> <span className="text-blue-600">TECHNOLOGIES</span>.
                                </h2>
                            </div>
                            <p className="text-xl text-zinc-500 font-medium leading-relaxed">
                                Formed through a strategic partnership with Aiclex Technologies, PropGoCRM combines deep real estate domain expertise with world-class cloud engineering. 
                            </p>
                            <p className="text-lg text-zinc-400 font-medium leading-relaxed">
                                Our goal isn't just to provide a database, but to build an intelligent Operating System that handles the heavy lifting—from lead capture and portal synchronization to automated WhatsApp follow-ups.
                            </p>
                            <div className="grid grid-cols-2 gap-8 pt-6">
                                <div>
                                    <p className="text-4xl font-black text-blue-600 mb-1">1200+</p>
                                    <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">Active Agencies</p>
                                </div>
                                <div>
                                    <p className="text-4xl font-black text-blue-600 mb-1">12M+</p>
                                    <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">Leads Synced</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-0 bg-blue-600/10 blur-3xl rounded-full -z-10 group-hover:scale-110 transition-transform duration-700" />
                            <div className="aspect-[4/5] bg-white rounded-[56px] border border-zinc-100 shadow-2xl p-10 flex flex-col justify-between overflow-hidden">
                                <div className="space-y-6">
                                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                                        <Building2 size={32} />
                                    </div>
                                    <h3 className="text-3xl font-black italic text-zinc-900 leading-tight">Global Ingress & Portal Sync Excellence.</h3>
                                    <p className="text-zinc-500 font-medium">We monitor 50+ property portals every second to ensure zero lead leakage for our partners.</p>
                                </div>
                                <div className="relative mt-8">
                                    <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-600 w-3/4 animate-pulse" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mt-4 flex items-center justify-between">
                                        <span>Sync Ingress Performance</span>
                                        <span className="text-blue-600">99.98% Uptime</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* THREE PILLARS */}
            <section className="py-40">
                <div className="container mx-auto px-6 text-center mb-20">
                    <h2 className="text-4xl lg:text-7xl font-black italic tracking-tighter text-zinc-900 mb-8">Our Core Philosophies.</h2>
                    <p className="text-xl text-zinc-500 font-medium max-w-2xl mx-auto leading-relaxed italic">Everything we build serves three primary directives:</p>
                </div>
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
                    <StoryCard 
                        title="Hyper-Automation" 
                        desc="If it can be automated, it should be. We reduce manual agent entry work by 93% through portal and CRM sync." 
                        icon={Zap}
                        delay="delay-0"
                    />
                    <StoryCard 
                        title="Absolute Governance" 
                        desc="Data security and compliance. Every agency operates in an encrypted silo with military-grade protection." 
                        icon={ShieldCheck}
                        delay="delay-[200ms]"
                    />
                    <StoryCard 
                        title="Global Connectivity" 
                        desc="One platform, worldwide scale. Connecting local agencies to global luxury portfolios through MarketSync." 
                        icon={Globe}
                        delay="delay-[400ms]"
                    />
                </div>
            </section>

            {/* TEAM SECTION (Optional / Simplified) */}
            <section className="py-32 bg-zinc-900 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 blur-[140px] rounded-full pointer-events-none" />
                <div className="container mx-auto px-6 relative text-center">
                    <h2 className="text-4xl lg:text-7xl font-black italic tracking-tighter text-white mb-20">Built by Specialists,<br /><span className="text-blue-600 underline decoration-blue-600/30 underline-offset-8">Scale with Confidence.</span></h2>
                    <div className="flex flex-wrap justify-center gap-12 lg:gap-32">
                         {[
                             { t: "Leadership", d: "Ex-Property Professionals" },
                             { t: "Engineering", d: "Aiclex Tech Labs" },
                             { t: "Support", d: "24/7 Global Response" }
                         ].map((item, idx) => (
                             <div key={idx} className="flex flex-col items-center">
                                 <p className="text-3xl font-black text-blue-500 italic mb-2 tracking-tight">{item.t}</p>
                                 <p className="text-[10px] font-black uppercase text-white/40 tracking-[0.3em]">{item.d}</p>
                             </div>
                         ))}
                    </div>
                </div>
            </section>

            {/* CALL TO ACTION */}
            <section className="py-40 bg-white">
                <div className="container mx-auto px-6">
                    <div className="bg-blue-600 rounded-[80px] p-16 lg:p-32 text-center relative overflow-hidden text-white group shadow-[0_40px_100px_-20px_rgba(29,78,216,0.5)]">
                        <div className="absolute top-0 right-0 p-80 -mr-40 bg-black/10 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000" />
                        <div className="relative space-y-12">
                             <h2 className="text-4xl lg:text-7xl font-black italic tracking-tighter leading-none">Ready to define your<br />next chapter?</h2>
                             <div className="flex flex-wrap items-center justify-center gap-6">
                                 <Link href="/signup" className="px-12 py-6 bg-white text-blue-600 rounded-full font-black text-xl hover:scale-105 transition-all flex items-center gap-3">
                                     Start Building Now <ArrowRight size={24} />
                                 </Link>
                                 <Link href="/contact" className="px-12 py-6 bg-zinc-900 text-white border border-white/20 rounded-full font-black text-xl hover:bg-white hover:text-black transition-all">
                                     Consult Our Team
                                 </Link>
                             </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
