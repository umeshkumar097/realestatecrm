"use client"

import { 
  Building2, Users, CreditCard, 
  Search, ShieldCheck, Globe, 
  ExternalLink, MoreVertical,
  Calendar, ArrowUpRight, Activity,
  Mail, Phone, Zap, MessageSquare, 
  Facebook, Instagram, CheckCircle2,
  ArrowRight, Share2, Database,
  TrendingUp, Layers, Bot, Smartphone
} from "lucide-react"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

const SectionHeader = ({ icon: Icon, title, subtitle, badge }: { icon: any, title: string, subtitle: string, badge?: string }) => (
    <div className="flex flex-col items-center text-center mb-24 space-y-6">
        {badge && (
            <span className="px-8 py-3 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.4em] rounded-full border border-primary/10 italic shadow-sm">
                {badge}
            </span>
        )}
        <div className="w-24 h-24 bg-slate-900 rounded-[32px] flex items-center justify-center shadow-2xl shadow-slate-900/10 mb-4 border-4 border-white">
            <Icon className="text-white h-10 w-10 italic" />
        </div>
        <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-zinc-900 italic balance leading-[1.1]">
            {title}
        </h2>
        <p className="text-zinc-400 text-[11px] font-black uppercase tracking-[0.3em] max-w-2xl italic">
            {subtitle}
        </p>
    </div>
)

const FeatureBox = ({ title, desc, icon: Icon }: { title: string, desc: string, icon: any }) => (
    <div className="bg-white p-8 rounded-[32px] border border-zinc-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
            <Icon size={24} />
        </div>
        <h3 className="text-xl font-black text-zinc-900 mb-3">{title}</h3>
        <p className="text-zinc-500 text-sm font-medium leading-relaxed">{desc}</p>
    </div>
)

export default function FeaturesPage() {
    const [scrolled, setScrolled] = useState(false)
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <div className="bg-white selection:bg-primary selection:text-white font-sans">
            <Navbar />

            {/* HERO SECTION */}
            <section className="pt-40 pb-20 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/4 -z-10 blur-3xl rounded-[100px]" />
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <div className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100 animate-bounce">
                            <Zap size={14} /> NEW: PORTAL SYNC 2.0
                        </div>
                        <h1 className="text-5xl md:text-9xl font-black tracking-tighter text-zinc-900 leading-[0.85] balance italic">
                            Architectural Core: <span className="text-primary underline decoration-primary/20 underline-offset-[16px]">Operational Dominance</span>.
                        </h1>
                        <p className="text-xl md:text-3xl text-zinc-500 font-black italic max-w-3xl mx-auto leading-relaxed">
                            The Master Real Estate Matrix centralizes your fiscal, operational, and asset nodes into one high-performance architectural OS. 🌍
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-6 pt-8">
                            <Link href="/signup" className="group bg-primary text-white px-10 py-5 rounded-[24px] text-lg font-black tracking-tight flex items-center gap-3 shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all">
                                Start Free Trial <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/contact" className="px-10 py-5 border-2 border-zinc-900 text-zinc-900 rounded-[24px] text-lg font-black tracking-tight hover:bg-zinc-900 hover:text-white transition-all">
                                Book Live Demo
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 1. LEAD MANAGEMENT */}
            <section className="py-32 bg-zinc-50/50">
                <div className="container mx-auto px-6">
                    <SectionHeader 
                        badge="Ingress Engine"
                        icon={Smartphone}
                        title="Advanced Operational Node Management"
                        subtitle="Centralizing Every Inquiry Node into the Master Strategy Matrix"
                    />
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-10 order-2 lg:order-1">
                            <div className="space-y-6">
                                <h3 className="text-3xl font-black text-zinc-900">Centralized Lead Capture</h3>
                                <p className="text-zinc-500 text-lg font-medium leading-relaxed">
                                    Automatically capture and organize leads from all your marketing channels. Our system enriches lead data and allows manual scoring for better organization.
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { t: "Real-Time Capture", d: "Instant notifications from Property Finder, Bayut & Dubizzle.", i: Zap },
                                    { t: "Lead Prioritization", d: "Manual scoring and tagging system for organization.", i: TrendingUp },
                                    { t: "Smart Routing", d: "Assign leads to the right agent based on location.", i: Share2 },
                                    { t: "Duplicate Detection", d: "Automatically merge duplicate leads from multiple sources.", i: Database }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-4 p-4 hover:bg-white hover:shadow-xl hover:shadow-zinc-100 rounded-3xl transition-all">
                                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-zinc-900 text-sm">{item.t}</h4>
                                            <p className="text-zinc-500 text-xs mt-1 font-medium leading-relaxed">{item.d}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="order-1 lg:order-2">
                           <div className="relative group">
                              <div className="absolute inset-0 bg-primary/20 blur-3xl -z-10 group-hover:scale-110 transition-transform" />
                              <img 
                                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426&h=1800" 
                                className="rounded-[48px] shadow-[0_40px_100px_-20px_rgba(37,99,235,0.4)] border-4 border-white transform lg:rotate-3 group-hover:rotate-0 transition-transform duration-700" 
                                alt="Dashboard Mobile" 
                              />
                           </div>
                        </div>
                    </div>

                    {/* PORTAL LOGOS */}
                    <div className="mt-32">
                        <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-12">Automatic Lead Capture Sources</p>
                        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-20 opacity-60">
                             {['Property Finder', 'Bayut', 'Dubizzle', 'Instagram', 'Facebook', 'Website'].map(src => (
                                 <span key={src} className="text-2xl font-black tracking-tighter text-zinc-300 hover:text-primary transition-colors cursor-default">{src}</span>
                             ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. WHATSAPP & SMS */}
            <section className="py-32">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                         <div>
                            <img 
                                src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&q=80&w=2400&h=2000" 
                                className="rounded-[48px] shadow-2xl border-2 border-zinc-100" 
                                alt="Communication" 
                            />
                         </div>
                         <div className="space-y-10">
                            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl shadow-emerald-200">
                                <MessageSquare className="text-white h-8 w-8" />
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-zinc-900 leading-tight italic">
                                WhatsApp Bridge Resolve
                            </h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 italic mb-4">Master Ingress for Personalized Relationship Governance</p>
                            <p className="text-zinc-500 text-lg font-black italic leading-relaxed">
                                Connect with client nodes instantly through high-authority WhatsApp bridges. Send property realizations, automate site-visit schedules, and maintain governance effortlessly.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Direct WhatsApp messaging from the CRM",
                                    "Automated property sharing and updates",
                                    "Message templates and quick replies",
                                    "Conversation history and tracking"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-zinc-600 font-bold">
                                        <CheckCircle2 size={18} className="text-emerald-500" /> {item}
                                    </li>
                                ))}
                            </ul>
                         </div>
                    </div>
                </div>
            </section>

            {/* 3. SOCIAL MEDIA & ZAPIER */}
            <section className="py-32 bg-zinc-900 border-y border-white/10 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
                <div className="container mx-auto px-6 relative">
                    <SectionHeader 
                        badge="Integration Suite"
                        icon={Instagram}
                        title="Social Media Lead Capture"
                        subtitle="Capture leads automatically from all your social media channels. Never miss an opportunity from Facebook, Instagram, LinkedIn, or any other platform where your potential clients are active."
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white/5 backdrop-blur-md p-10 rounded-[40px] border border-white/10 border-b-primary/30 group">
                            <Facebook className="text-blue-500 h-10 w-10 mb-6 group-hover:scale-110 transition-transform" />
                            <h3 className="text-2xl font-black text-white mb-4">Facebook Lead Ads</h3>
                            <p className="text-white/60 text-sm font-medium leading-relaxed">Direct integration with Facebook Lead Ads forms for instant sync.</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md p-10 rounded-[40px] border border-white/10 border-b-pink-500/30 group">
                            <Instagram className="text-pink-500 h-10 w-10 mb-6 group-hover:scale-110 transition-transform" />
                            <h3 className="text-2xl font-black text-white mb-4">Instagram Lead Ads</h3>
                            <p className="text-white/60 text-sm font-medium leading-relaxed">Automatic lead capture from Instagram campaign forms.</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md p-10 rounded-[40px] border border-white/10 border-b-orange-500/30 group">
                            <Zap className="text-orange-500 h-10 w-10 mb-6 group-hover:scale-110 transition-transform" />
                            <h3 className="text-2xl font-black text-white mb-4">Automation Hub</h3>
                            <p className="text-white/60 text-sm font-medium leading-relaxed">Connect with **Zapier, Pabbly, or n8n** for infinite automated lead workflows.</p>
                        </div>
                    </div>

                    <div className="mt-20 p-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-[48px] flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="space-y-6">
                            <h3 className="text-3xl font-black text-white">Zapier Automation & Lead Sync</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
                                {[
                                    { t: "100% Lead Capture", d: "Every inquiry accounted for." },
                                    { t: "Multichannel Sync", d: "Zapier, Pabbly & n8n Support." },
                                    { t: "5000+ App Integrations", d: "Infinite workflow possibilities." },
                                    { t: "24/7 Automated", d: "Works while you sleep." }
                                ].map((item, idx) => (
                                    <div key={idx} className="space-y-1">
                                        <p className="text-primary font-black">{item.t}</p>
                                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">{item.d}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white/10 p-8 rounded-[32px] border border-white/10">
                             <div className="flex items-center gap-1.5 mb-4">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Live Lead Sync Active</span>
                             </div>
                             <div className="space-y-3">
                                 {[
                                     { s: "Facebook Ads", t: "Just now" },
                                     { s: "Pabbly / n8n", t: "1 min ago" },
                                     { s: "Portal (PF)", t: "2 mins ago" },
                                     { s: "Website Chat", t: "5 mins ago" }
                                 ].map((l, i) => (
                                     <div key={i} className="flex items-center justify-between gap-12 text-sm">
                                         <span className="text-white/80 font-bold">{l.s}</span>
                                         <span className="text-white/20 font-black tracking-widest text-[10px]">{l.t}</span>
                                     </div>
                                 ))}
                             </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. EMAIL TRACKING & AUTOMATION */}
            <section className="py-32">
                <div className="container mx-auto px-6">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                         <div className="space-y-10">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                                <Mail className="text-primary h-8 w-8" />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 leading-tight balance">
                                Email Tracking & Automation
                            </h2>
                            <p className="text-zinc-500 text-lg font-medium leading-relaxed">
                                Track email opens, clicks, and responses. Know when clients are engaged and follow up at the perfect moment to close deals.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    "Real-time email open and click tracking",
                                    "Automated email sequences and drip campaigns",
                                    "Personalized email templates",
                                    "Email performance analytics"
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-3">
                                        <CheckCircle2 size={18} className="text-primary flex-shrink-0" />
                                        <span className="text-zinc-600 font-bold text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>
                         </div>
                         <div>
                            <img 
                                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=2400&h=1800" 
                                className="rounded-[48px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border-2 border-zinc-50" 
                                alt="Email Marketing" 
                            />
                         </div>
                     </div>
                </div>
            </section>

            {/* 5. PROPERTY LISTINGS MANAGEMENT */}
            <section className="py-32 bg-zinc-50">
                <div className="container mx-auto px-6">
                    <SectionHeader 
                        badge="Inventory OS"
                        icon={Building2}
                        title="Advanced Property Listings Management"
                        subtitle="Create once, publish everywhere. Manage your property inventory and automatically sync with all major UAE property portals and your website."
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-primary/10 blur-3xl -z-10 group-hover:scale-110 transition-transform" />
                            <img 
                                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=2400&h=1600" 
                                className="rounded-[48px] shadow-2xl border-4 border-white" 
                                alt="Listing Management" 
                            />
                        </div>

                        <div className="space-y-10">
                            <div className="space-y-6">
                                <h3 className="text-3xl font-black text-zinc-900">Centralized Listing Management</h3>
                                <p className="text-zinc-500 text-lg font-medium leading-relaxed">
                                    Create professional property listings once and automatically distribute them across multiple platforms. Save time while maximizing your property exposure.
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { t: "One-Click Publishing", d: "Sync instantly to Property Finder, Bayut, Dubizzle." },
                                    { t: "Smart Photo Management", d: "Drag & drop photos with automatic optimization." },
                                    { t: "Virtual Tours", d: "360° tours and video integration for enhanced listings." },
                                    { t: "Real-Time Updates", d: "Change status, price, or details and sync everywhere instantly." }
                                ].map((item, idx) => (
                                    <div key={idx} className="p-6 bg-white rounded-3xl border border-zinc-100 shadow-sm">
                                        <CheckCircle2 size={24} className="text-emerald-500 mb-4" />
                                        <h4 className="font-black text-zinc-900 text-sm">{item.t}</h4>
                                        <p className="text-zinc-500 text-xs mt-2 font-medium leading-relaxed">{item.d}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-20 text-center">
                         <Link href="/signup" className="inline-flex items-center gap-3 bg-zinc-900 text-white px-12 py-6 rounded-[32px] text-xl font-black tracking-tight hover:bg-primary transition-all shadow-2xl shadow-zinc-200">
                             Launch My Marketplace <ArrowUpRight />
                         </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
