"use client"

import { Mail, Phone, MapPin, MessageSquare, Zap, Clock, Globe, ArrowRight, CheckCircle2, Building2 } from "lucide-react"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import Logo from "@/components/Logo"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

const ContactMethod = ({ icon: Icon, title, value, sub, color }: { icon: any, title: string, value: string, sub: string, color: string }) => (
    <div className="flex gap-6 p-8 bg-white rounded-[32px] border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
        <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-zinc-100 group-hover:scale-110 transition-transform`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.25em] mb-1">{title}</p>
            <p className="text-lg font-black text-zinc-900 tracking-tight mb-1">{value}</p>
            <p className="text-xs text-zinc-500 font-medium">{sub}</p>
        </div>
    </div>
)

export default function ContactPage() {
    const [scrolled, setScrolled] = useState(false)
    const [status, setStatus] = useState<string | null>(null)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus("sending")
        setTimeout(() => setStatus("success"), 1500)
    }

    return (
        <div className="min-h-screen bg-zinc-50/50 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
        <Navbar />

        <section className="pt-52 pb-32">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
                    
                    {/* LEFT: INFO */}
                    <div className="lg:col-span-5 space-y-16">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-3 px-6 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] italic shadow-xl">
                                <Zap size={14} className="text-blue-400" /> Strategic Ingress Node
                            </div>
                            <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-zinc-900 leading-[0.85] italic">Master Matrix <br /><span className="text-blue-600 underline decoration-blue-600/10 underline-offset-[16px]">Consultation</span>.</h1>
                            <p className="text-xl md:text-2xl text-zinc-500 font-black italic leading-relaxed">"Global PropTech dominance is architected through robust, automated foundations. Initialize your ingress today."</p>
                        </div>

                        <div className="flex flex-col gap-8">
                            <ContactMethod 
                                icon={Mail} 
                                title="Operational Support Node" 
                                value="resolve@matrix.com" 
                                sub="Response time: Under 4 hours."
                                color="bg-blue-600"
                            />
                            <ContactMethod 
                                icon={MessageSquare} 
                                title="Architectural Genesis Partnership" 
                                value="genesis@aiclex.labs" 
                                sub="For complex enterprise cluster integrations."
                                color="bg-slate-900"
                            />
                            <ContactMethod 
                                icon={Phone} 
                                title="Strategic Sales Ingress" 
                                value="+91 8449488090" 
                                sub="Available Mon-Sat, 10am-7pm IST."
                                color="bg-indigo-600"
                            />
                        </div>

                        <div className="p-12 bg-slate-900 rounded-[60px] text-white relative overflow-hidden group shadow-2xl shadow-slate-900/20 border-t-4 border-blue-600/20">
                            <div className="absolute top-0 right-0 p-40 -mr-20 bg-blue-600/10 rounded-full blur-[80px]" />
                            <div className="relative space-y-6">
                                <div className="w-16 h-16 bg-white/5 rounded-[24px] flex items-center justify-center border border-white/10"><Globe size={28} className="text-blue-400 animate-spin-slow"/></div>
                                <h3 className="text-2xl font-black italic tracking-tighter">Operating Globally.</h3>
                                <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.3em] leading-relaxed">Supporting proprietary real estate nodes across UAE, India, UK, and the Americas.</p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: FORM */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-[80px] border border-slate-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] p-12 lg:p-20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-32 -mr-16 -mt-16 bg-blue-600/5 rounded-full blur-[80px] -z-10" />
                            {status === "success" ? (
                                <div className="h-[500px] flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in duration-700">
                                    <div className="w-32 h-32 bg-emerald-50 text-emerald-500 rounded-[40px] flex items-center justify-center shadow-2xl mb-6 border-4 border-white animate-bounce-slow">
                                        <CheckCircle2 size={64} />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-5xl font-black tracking-tighter italic">Inquiry Synchronized!</h2>
                                        <p className="text-zinc-500 text-lg font-black italic uppercase tracking-[0.1em]">Resolve Node Initialized.</p>
                                    </div>
                                    <p className="text-zinc-400 text-lg max-w-sm mx-auto font-black italic leading-relaxed">Our specialists are analyzing your architectural requirements. Protocol resolve within 4 hours.</p>
                                    <button onClick={() => setStatus(null)} className="text-blue-600 font-black tracking-[0.4em] uppercase text-[10px] hover:underline underline-offset-8 mt-12 italic">Initialize Another Ingress</button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-10 animate-in fade-in duration-1000">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-6 italic">Full Principal Name</label>
                                            <input required className="w-full px-10 py-6 bg-zinc-50/50 border border-zinc-50 rounded-[32px] outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all font-black italic text-sm placeholder:text-zinc-200" placeholder="Matrix Principal" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-6 italic">Ingress Ingress Address</label>
                                            <input type="email" required className="w-full px-10 py-6 bg-zinc-50/50 border border-zinc-50 rounded-[32px] outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all font-black italic text-sm placeholder:text-zinc-200" placeholder="principal@agency.matrix" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-6 italic">Operating Agency Designation</label>
                                            <input required className="w-full px-10 py-6 bg-zinc-50/50 border border-zinc-50 rounded-[32px] outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all font-black italic text-sm placeholder:text-zinc-200" placeholder="Real Estate Node" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-6 italic">Operational Directives</label>
                                            <select className="w-full px-10 py-6 bg-zinc-50/50 border border-zinc-50 rounded-[32px] outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all font-black italic text-sm text-zinc-400">
                                                <option>Portal Ingress Sync Architecture</option>
                                                <option>WhatsApp Bridge Resolve</option>
                                                <option>Enterprise Cluster Scaling</option>
                                                <option>Aiclex Genesis Consulting</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-6 italic">Strategic Narrative / Requirements</label>
                                        <textarea rows={6} required className="w-full px-10 py-6 bg-zinc-50/50 border border-zinc-50 rounded-[40px] outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all font-black italic text-sm placeholder:text-zinc-200 resize-none" placeholder="Detail your operational vision for the Matrix..." />
                                    </div>

                                    <button type="submit" disabled={status === "sending"} className="w-full bg-slate-900 text-white rounded-[40px] py-8 text-[11px] font-black uppercase tracking-[0.5em] italic shadow-2xl shadow-slate-900/10 hover:bg-blue-600 hover:scale-[1.01] active:scale-95 transition-all text-center flex items-center justify-center gap-4">
                                        {status === "sending" ? "Initialising Protocol..." : "Initialize Consultation Ingress ⚡"} <ArrowRight className="h-5 w-5" />
                                    </button>

                                    <p className="text-center text-[9px] font-black uppercase text-zinc-400 tracking-[0.4em] italic">Architectural Security: AES-256 Protected Node Submission</p>
                                </form>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </section>
        <style jsx global>{`
          .animate-spin-slow { animation: spin 8s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          .animate-bounce-slow { animation: bounce 3s ease-in-out infinite; }
          @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10%); } }
        `}</style>

        <Footer />
    </div>
    )
}
