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
            <p className="text-lg font-black text-zinc-900 tracking-tight italic mb-1">{value}</p>
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

            <section className="pt-48 pb-24">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                        
                        {/* LEFT: INFO */}
                        <div className="lg:col-span-5 space-y-12">
                            <div className="space-y-6">
                                <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-zinc-900 leading-tight">Let's Define Your <span className="text-blue-600">Growth OS.</span></h1>
                                <p className="text-xl text-zinc-500 font-medium leading-relaxed italic">"Global agencies don't just happen. They are built on robust, automated foundations. Let's build yours."</p>
                            </div>

                            <div className="flex flex-col gap-6">
                                <ContactMethod 
                                    icon={Mail} 
                                    title="Email Support" 
                                    value="hello@propgocrm.com" 
                                    sub="Response time: Under 4 hours."
                                    color="bg-blue-600"
                                />
                                <ContactMethod 
                                    icon={MessageSquare} 
                                    title="Engineering Partnership" 
                                    value="team@aiclex.in" 
                                    sub="For complex enterprise integrations."
                                    color="bg-zinc-900"
                                />
                                <ContactMethod 
                                    icon={Phone} 
                                    title="Sales Direct" 
                                    value="+91 8449488090" 
                                    sub="Available Mon-Sat, 10am-7pm IST."
                                    color="bg-accent"
                                />
                            </div>

                            <div className="p-8 bg-zinc-900 rounded-[40px] text-white relative overflow-hidden group shadow-2xl">
                                <div className="absolute top-0 right-0 p-20 -mr-20 bg-blue-600/30 rounded-full blur-[60px]" />
                                <div className="relative space-y-4">
                                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"><Globe size={20}/></div>
                                    <h3 className="text-xl font-black italic">Operating Globally.</h3>
                                    <p className="text-white/50 text-sm font-medium">Supporting property agencies across UAE, India, UK, and North America.</p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: FORM */}
                        <div className="lg:col-span-7">
                            <div className="bg-white rounded-[56px] border border-zinc-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] p-12 lg:p-16 relative overflow-hidden">
                                {status === "success" ? (
                                    <div className="h-[400px] flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in duration-500">
                                        <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shadow-xl mb-4">
                                            <CheckCircle2 size={48} />
                                        </div>
                                        <h2 className="text-3xl font-black tracking-tighter">Inquiry Received!</h2>
                                        <p className="text-zinc-500 text-lg max-w-sm mx-auto font-medium">One of our specialists will analyze your requirements and reach out within 4 hours.</p>
                                        <button onClick={() => setStatus(null)} className="text-blue-600 font-black tracking-widest uppercase text-[10px] hover:underline underline-offset-4 mt-8">Submit Another Inquiry</button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-700">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-4">Full Name</label>
                                                <input required className="w-full px-8 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold placeholder:text-zinc-300" placeholder="Agent or CEO Name" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-4">Email Address</label>
                                                <input type="email" required className="w-full px-8 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold placeholder:text-zinc-300" placeholder="work@agency.com" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-4">Agency Name</label>
                                                <input required className="w-full px-8 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold placeholder:text-zinc-300" placeholder="Your Real Estate Firm" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-4">Platform Goals</label>
                                                <select className="w-full px-8 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold text-zinc-500">
                                                    <option>Portal Sync Automation</option>
                                                    <option>WhatsApp CRM Setup</option>
                                                    <option>Enterprise Scaling (Multi-Branch)</option>
                                                    <option>Aiclex Tech Consulting</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-4">Your Vision / Requirements</label>
                                            <textarea rows={5} required className="w-full px-8 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold placeholder:text-zinc-300 resize-none" placeholder="Tell us how we can help you scale..." />
                                        </div>

                                        <button type="submit" disabled={status === "sending"} className="w-full bg-blue-600 text-white rounded-[32px] py-6 font-black text-xl tracking-tight shadow-xl shadow-blue-600/30 hover:scale-[1.02] active:scale-95 transition-all text-center flex items-center justify-center gap-3">
                                            {status === "sending" ? "Initialising Protocol..." : "Submit Strategic Inquiry"} <ArrowRight />
                                        </button>

                                        <p className="text-center text-[10px] font-black uppercase text-zinc-400 tracking-[0.3em]">Confidentiality: AES-256 Protected Submission</p>
                                    </form>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
