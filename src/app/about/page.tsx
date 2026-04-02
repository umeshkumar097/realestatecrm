"use client"

import { Building2, Globe, ShieldCheck, Users, Zap, ArrowRight, Heart, Target, Lightbulb } from "lucide-react"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import Logo from "@/components/Logo"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

const StoryCard = ({ title, desc, icon: Icon, delay }: { title: string, desc: string, icon: any, delay: string }) => (
    <div className={`p-10 bg-white rounded-[40px] border border-zinc-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group animate-in fade-in slide-in-from-bottom-8 fill-mode-both ${delay}`}>
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8 group-hover:scale-110 transition-transform">
            <Icon size={32} />
        </div>
        <h3 className="text-2xl font-black text-zinc-900 mb-4 tracking-tight">{title}</h3>
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
        <Navbar />

        {/* HERO SECTION */}
        <section className="pt-52 pb-32 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 -skew-x-12 translate-x-1/4 -z-10 blur-3xl rounded-[100px]" />
            <div className="container mx-auto px-6">
                <div className="max-w-5xl mx-auto text-center space-y-12">
                    <div className="inline-flex items-center gap-3 px-8 py-3 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] italic shadow-2xl">
                        <Zap size={14} className="text-blue-400" /> Global Standard Node: 2026
                    </div>
                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-zinc-900 leading-[0.85] italic balance">
                        Strategic Genesis: <br /><span className="text-blue-600 underline decoration-blue-600/10 underline-offset-[16px]">PropTech Excellence</span>.
                    </h1>
                    <p className="text-xl md:text-3xl text-zinc-500 font-black italic max-w-3xl mx-auto leading-relaxed">
                        The Master Real Estate Matrix was architected for a single directive: To establish high-performance operational dominance for every elite agency worldwide. 
                    </p>
                </div>
            </div>
        </section>

        {/* OUR STORY / PARTNERSHIP */}
        <section className="py-40 bg-zinc-50/50 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <span className="text-[11px] font-black text-blue-600 uppercase tracking-[0.4em] italic">Architectural Heritage</span>
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-900 italic leading-[0.9]">
                                Powered by <span className="text-zinc-400">AICLEX</span> <span className="text-blue-600">LABS</span>.
                            </h2>
                        </div>
                        <p className="text-xl text-zinc-500 font-black italic leading-relaxed border-l-8 border-blue-600/10 pl-8">
                            Formed through a strategic genesis with Aiclex Technologies, the Master Real Estate Matrix combines deep domain expertise with world-class cloud architecture. 
                        </p>
                        <p className="text-lg text-zinc-400 font-black italic leading-relaxed">
                            Our architecture isn't just a database—it's an intelligent Operational Governance Matrix that handles mission-critical loads: from Lead Ingress to Global Portal Sync and WhatsApp Resolve.
                        </p>
                        <div className="grid grid-cols-2 gap-12 pt-8">
                            <div className="space-y-2">
                                <p className="text-6xl font-black text-slate-900 tracking-tighter italic">1,200+</p>
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] italic">Active Operational Nodes</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-6xl font-black text-slate-900 tracking-tighter italic">12M+</p>
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] italic">Intelligence Quantums</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-blue-600/10 blur-[100px] rounded-full -z-10 group-hover:scale-110 transition-transform duration-1000" />
                        <div className="aspect-[4/5] bg-white rounded-[80px] border border-slate-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] p-16 flex flex-col justify-between overflow-hidden relative group">
                            <div className="absolute top-0 right-0 p-32 -mr-16 -mt-16 bg-blue-600/5 rounded-full blur-[60px]" />
                            <div className="space-y-8 relative z-10">
                                <div className="w-20 h-20 bg-slate-900 rounded-[32px] flex items-center justify-center text-white shadow-2xl shadow-slate-900/20 border-4 border-white">
                                    <Building2 size={36} className="italic" />
                                </div>
                                <h3 className="text-4xl font-black text-zinc-900 leading-[0.95] italic tracking-tighter">Global Ingress & Portal Sync Authority.</h3>
                                <p className="text-zinc-500 font-black italic text-lg leading-relaxed">We monitor 50+ property portals every second to ensure absolute zero lead leakage for our nodes.</p>
                            </div>
                            <div className="relative mt-8 z-10">
                                <div className="h-3 w-full bg-zinc-50 rounded-full overflow-hidden shadow-inner">
                                    <div className="h-full bg-blue-600 w-3/4 animate-pulse" />
                                </div>
                                <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.3em] mt-6 flex items-center justify-between italic">
                                    <span>Ingress Sync Performance</span>
                                    <span className="text-blue-600">99.998% Uptime</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* THREE PILLARS */}
        <section className="py-48 bg-white relative">
            <div className="container mx-auto px-6 text-center mb-32 space-y-4">
                <h2 className="text-5xl lg:text-9xl font-black tracking-tighter text-zinc-900 italic balance">Operational Directives.</h2>
                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400 italic">Structural Philosophies for Global Dominance</p>
            </div>
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
                <StoryCard 
                    title="Hyper-Automation" 
                    desc="If it can be automated, it must be. We reduce manual agent entry work by 93% through portal ingress and CRM sync." 
                    icon={Zap}
                    delay="delay-0"
                />
                <StoryCard 
                    title="Absolute Governance" 
                    desc="Military-grade data security and compliance. Every agency operates in an encrypted architectural silo." 
                    icon={ShieldCheck}
                    delay="delay-[200ms]"
                />
                <StoryCard 
                    title="Global Connectivity" 
                    desc="One platform, worldwide scale. Connecting local agencies to global luxury portfolios through MarketSync nodes." 
                    icon={Globe}
                    delay="delay-[400ms]"
                />
            </div>
        </section>

        {/* TEAM SECTION (Optional / Simplified) */}
        <section className="py-48 bg-slate-900 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-600/10 blur-[180px] rounded-full pointer-events-none" />
            <div className="container mx-auto px-6 relative text-center">
                <h2 className="text-5xl lg:text-9xl font-black tracking-tighter text-white mb-28 italic leading-[0.85]">Architected by Specialists,<br /><span className="text-blue-600 underline decoration-blue-600/30 underline-offset-[24px]">Scale with Matrix Confidence.</span></h2>
                 <div className="flex flex-wrap justify-center gap-12 lg:gap-40">
                      {[
                          { t: "Leadership", d: "Ex-Property Professionals" },
                          { t: "Engineering", d: "Aiclex Tech Labs" },
                          { t: "Support", d: "24/7 Global Resolve" }
                      ].map((item, idx) => (
                          <div key={idx} className="flex flex-col items-center group">
                              <p className="text-4xl lg:text-6xl font-black text-blue-500 mb-3 tracking-tighter italic group-hover:scale-110 transition-transform">{item.t}</p>
                              <p className="text-[11px] font-black uppercase text-white/40 tracking-[0.4em] italic">{item.d}</p>
                          </div>
                      ))}
                 </div>
            </div>
        </section>

        <Footer />
    </div>
    )
}
