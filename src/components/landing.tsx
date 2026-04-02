"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Menu,
  X,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Star,
  ArrowRight,
  Home,
  BarChart3,
  Bell,
  Calendar,
  MessageSquare,
  Phone,
  Zap,
  ShieldCheck,
  Globe,
  LayoutDashboard,
  Shield,
  Clock,
  ArrowUpRight,
  MousePointer2,
  Layers
} from "lucide-react"

import LeadModal from "./LeadModal"
import Navbar from "./Navbar"
import Footer from "./Footer"
import WhatsAppButton from "./WhatsAppButton"

export default function Landing() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentLeadIdx, setCurrentLeadIdx] = useState(0)
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('leads')

  const pricingPlans = [
    { 
      plan: "Starter", 
      price: "699", 
      period: "/month", 
      desc: "Perfect for small agencies getting started.", 
      features: ["Up to 5 Agents", "500 Leads/Month", "Basic Analytics", "Email Support", "Shared WhatsApp"], 
      cta: "Start Free Trial", 
      highlight: false, 
      href: "/signup" 
    },
    { 
      plan: "Professional Node", 
      price: "1,099", 
      period: "/month", 
      desc: "For growing clusters managing 20+ operational nodes.", 
      features: ["Up to 20 Agents", "Unlimited Leads", "AI-Resolve Scoring", "Priority Support", "Governance Reports", "Dedicated WhatsApp Bridge"], 
      cta: "Most Popular", 
      highlight: true, 
      href: "/signup" 
    },
    { 
      plan: "Governance Cluster", 
      price: "Custom", 
      period: "", 
      desc: "For large enterprise companies with multi-node branches.", 
      features: ["Global Node Access", "Multi-Branch Governance", "Universal Portal Sync", "API Ingress", "Custom Architectural Overhaul", "On-premise Isolation"], 
      cta: "Contact Sales", 
      highlight: false, 
      onClick: () => setIsLeadModalOpen(true) 
    },
  ]

  const mockLeads = [
    { name: "Rahul Sharma", action: "Inquired about 3BHK in Bandra", badge: "Hot Lead 🔥" },
    { name: "Priya Patel", action: "Ready to close ₹2.4Cr villa deal", badge: "Closing Soon 💰" },
    { name: "Vikram Singh", action: "Scheduled site visit this evening", badge: "Site Visit 🏠" },
    { name: "Meera Joshi", action: "New referral from existing client", badge: "Referral ⭐" }
  ]

  const portals = [
    { name: "Property Finder", logo: "/logos/property-finder.svg", color: "bg-red-500" },
    { name: "Bayut", logo: "/logos/bayut.svg", color: "bg-emerald-500" },
    { name: "Dubizzle", logo: "/logos/dubizzle.svg", color: "bg-red-600" },
    { name: "Zillow", logo: "/logos/zillow.svg", color: "bg-blue-600" },
    { name: "MagicBricks", logo: "/logos/magicbricks.svg", color: "bg-red-100" },
    { name: "Housing.com", logo: "/logos/housing.svg", color: "bg-pink-600" }
  ]

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    const interval = setInterval(() => setCurrentLeadIdx(p => (p + 1) % mockLeads.length), 3500)
    return () => { window.removeEventListener("scroll", handleScroll); clearInterval(interval) }
  }, [mockLeads.length])

  const features = [
    { 
      icon: Users, 
      title: "Intelligence Ingress Matrix", 
      desc: "Every inquiry from WhatsApp, Portals, and Ads is auto-captured, scored by AI-Resolve, and assigned to the right operational node instantly.", 
      color: "from-blue-600 to-indigo-700" 
    },
    { 
      icon: Building2, 
      title: "Asset Node Registry", 
      desc: "Manage global listings with high-depth media, 360 virtual tours, and floor plans. Social share ready with mission-critical precision.", 
      color: "from-blue-500 to-sky-500" 
    },
    { 
      icon: MessageSquare, 
      title: "WhatsApp Resolve Bridge", 
      desc: "Architected follow-ups at scale. Deploy property nodes, brochures, and site-visit particulars directly via high-authority API.", 
      color: "from-emerald-500 to-teal-600" 
    },
    { 
      icon: TrendingUp, 
      title: "Operational Governance", 
      desc: "Track agent velocity, set revenue targets, and manage commissions. Real-time fiscal intelligence for better technical decisions.", 
      color: "from-violet-600 to-fuchsia-600" 
    },
    { 
      icon: Shield, 
      title: "Enterprise Document Vault", 
      desc: "Securely store KYC, agreements, and fiscal records. AES-256 encryption compliant with global architectural standards.", 
      color: "from-amber-500 to-orange-600" 
    },
    { 
      icon: LayoutDashboard, 
      title: "Multi-Node Command", 
      desc: "Manage multiple regional clusters from a single Master dashboard. Unified reporting for global PropTech operations.", 
      color: "from-slate-700 to-slate-900" 
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFF] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      <Navbar />

      <main className="flex-1">

        {/* ── HERO ── */}
        <section className="relative pt-32 pb-20 lg:pt-52 lg:pb-40 overflow-hidden">
          {/* Premium HSL Gradient Orbs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1800px] h-[900px] bg-[radial-gradient(circle_at_50%_0%,hsla(220,100%,95%,0.8)_0%,hsla(220,100%,98%,0.5)_50%,transparent_100%)] -z-10" />
          <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[120px] -z-10 animate-pulse" />
          <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-indigo-400/5 rounded-full blur-[100px] -z-10" />
          
          <div className="container mx-auto px-6 lg:px-12 relative text-center">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/40 backdrop-blur-xl border border-white/50 rounded-full shadow-[0_8px_32px_rgba(37,99,235,0.06)] mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.8)] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">The Global Benchmark for Real Estate Automation</span>
            </div>

            <h1 className="text-5xl lg:text-9xl font-black tracking-tighter leading-[0.85] text-slate-900 mb-10 max-w-7xl mx-auto italic select-none">
              Master Real Estate<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500">Matrix Architecture.</span>
            </h1>

            <p className="text-xl lg:text-3xl text-slate-500 font-black italic max-w-3xl mx-auto mb-16 leading-relaxed">
              Accelerating elite PropTech operations with AI-Intelligence, Global Portal Sync, and High-Authority Governance. 🌍
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-28">
              <Link href="/signup" className="group px-14 py-6 bg-slate-900 text-white rounded-[28px] font-black text-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
                Get Started for Free <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#features" className="px-14 py-6 bg-white/50 backdrop-blur-md text-slate-700 border border-slate-200 rounded-[28px] font-black text-xl shadow-sm hover:border-blue-600 hover:text-blue-600 hover:shadow-2xl hover:shadow-blue-600/5 transition-all">
                The Platform
              </Link>
            </div>

            {/* Premium Dashboard Visualizer */}
            <div className="relative max-w-screen-xl mx-auto">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-blue-600/10 rounded-[60px] blur-3xl opacity-50" />
              <div className="relative bg-[#020617] rounded-[48px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-slate-800/50 overflow-hidden aspect-[4/3] md:aspect-[16/10] group lg:scale-105 transition-all duration-1000 ease-out hover:rotate-[-0.5deg]">
                
                {/* Dashboard Sidebar */}
                <div className="absolute inset-y-0 left-0 w-24 lg:w-72 bg-[#020617] border-r border-slate-800/40 p-8 hidden md:flex flex-col gap-10">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/10"><Building2 size={24} /></div>
                      <span className="text-white font-black text-2xl tracking-tighter hidden lg:block italic underline decoration-blue-600 underline-offset-8">MasterMatrix</span>
                   </div>
                   <div className="flex flex-col gap-3">
                      {[LayoutDashboard, Users, Building2, MessageSquare, TrendingUp, Calendar].map((Icon, i) => (
                        <div key={i} className={`flex items-center gap-5 px-5 py-4 rounded-2xl transition-all ${i === 0 ? "bg-white/5 text-blue-500 border border-blue-500/20" : "text-slate-600 hover:text-white hover:bg-slate-900"}`}>
                          <Icon size={22} />
                          <span className="font-black uppercase tracking-widest text-[10px] hidden lg:block">{['Dashboard', 'Lead Engine', 'Catalogs', 'Omnichannel', 'Analytics', 'Schedules'][i]}</span>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Dashboard Header */}
                <div className="absolute top-0 left-24 lg:left-72 right-0 h-24 border-b border-white/5 flex items-center px-10 justify-between bg-[#020617]/40 backdrop-blur-2xl z-10">
                   <div className="flex items-center gap-8">
                      {['Overview', 'Global Pipeline', 'Site Visits', 'Reporting'].map((t, i) => (
                        <span 
                          key={t} 
                          onClick={() => setActiveTab(t.toLowerCase())}
                          className={`text-[9px] font-black uppercase tracking-[0.3em] cursor-pointer transition-all ${activeTab === t.toLowerCase() ? "text-blue-500" : "text-slate-600 hover:text-slate-300"}`}
                        >
                          {t}
                        </span>
                      ))}
                   </div>
                   <div className="flex items-center gap-5">
                      <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Real-Time</span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10" />
                   </div>
                </div>

                {/* Dashboard Content Mockup */}
                <div className="absolute inset-0 pt-16 md:pt-20 pl-0 md:pl-20 lg:pl-64 overflow-hidden">
                   <div className="p-8 h-full bg-[#020617]/50">
                      <div className="grid grid-cols-4 gap-6 mb-8">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="h-32 bg-slate-900/50 border border-slate-800/80 rounded-[32px] p-6 animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
                        ))}
                      </div>
                      <div className="grid grid-cols-12 gap-6 h-full">
                        <div className="col-span-8 bg-slate-900/40 border border-slate-800/50 rounded-[40px] p-8 relative overflow-hidden">
                           {/* Floating Stats */}
                           <div className="absolute top-10 left-10 flex gap-4">
                              <div className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl">Hot Leads: 48</div>
                              <div className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-sm shadow-xl">Closing: $1.2M</div>
                           </div>
                           {/* Chart Lines Placeholder */}
                           <div className="mt-20 w-full h-[300px] flex items-end gap-2">
                             {[40, 70, 30, 90, 60, 100, 80, 110, 50, 120].map((h, i) => (
                               <div key={i} className="flex-1 bg-blue-600/20 border-t-2 border-blue-600 rounded-t-xl transition-all hover:bg-blue-600" style={{ height: `${h}%` }} />
                             ))}
                           </div>
                        </div>
                        <div className="col-span-4 flex flex-col gap-6">
                           <div className="flex-1 bg-slate-900/40 border border-slate-800/50 rounded-[40px] p-6" />
                           <div className="flex-1 bg-slate-900/40 border border-slate-800/50 rounded-[40px] p-6" />
                        </div>
                      </div>
                   </div>
                </div>

                {/* Overlays / Notifications */}
                <div key={currentLeadIdx} className="absolute right-4 md:right-10 bottom-4 md:bottom-10 w-[280px] md:w-80 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[24px] md:rounded-[32px] p-4 md:p-5 shadow-2xl animate-float">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shrink-0">
                      <Star size={24} className="fill-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest leading-none mb-1.5">Lead Priority: High</p>
                      <h4 className="text-white font-black text-sm">{mockLeads[currentLeadIdx].name}</h4>
                      <p className="text-white/50 text-xs mt-1">{mockLeads[currentLeadIdx].action}</p>
                    </div>
                  </div>
                </div>

                {/* Floating Cursor Effect */}
                <div className="absolute top-[60%] left-[45%] animate-bounce opacity-80 pointer-events-none">
                  <MousePointer2 className="text-white fill-white" size={32} />
                  <div className="mt-2 ml-4 px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-lg">Assigning Lead...</div>
                </div>
              </div>
            </div>
            
            {/* Social Proof */}
            <div className="mt-40">
              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs mb-10">Trusted by Global Luxury Portfolio Agencies</p>
              <div className="flex flex-wrap justify-center items-center gap-10 lg:gap-20 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                 {['K-Knight', 'Sotheby', 'Remax', 'Engel', 'JLL', 'CBRE'].map(l => (
                   <span key={l} className="text-2xl font-black tracking-tighter">{l}</span>
                 ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── PORTAL INTEGRATION SECTION ── */}
        <section id="marketsync" className="py-32 bg-white relative overflow-hidden">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="flex-1 text-center lg:text-left">
                <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-600 mb-8 mx-auto lg:mx-0">
                  <Globe className="h-8 w-8" />
                </div>
                <h2 className="text-4xl lg:text-6xl font-black text-slate-900 leading-tight mb-8">
                  One Sync.<br />Every Listing Portal.
                </h2>
                <p className="text-xl text-slate-500 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Capturing leads from Bayut, Property Finder, Pabbly, n8n, and Dubizzle used to be manual. The Master Real Estate Matrix syncs with them all in real-time, pulling every inquiry directly into your agent's dashboard.
                </p>
                <div className="flex flex-col gap-4 text-left max-w-sm mx-auto lg:mx-0">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-600"><CheckCircle2 size={16}/></div>
                    <span className="font-black text-sm text-slate-600 uppercase tracking-widest">Zero Lead Leakage</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-600"><CheckCircle2 size={16}/></div>
                    <span className="font-black text-sm text-slate-600 uppercase tracking-widest">Auto-Response via WhatsApp</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-600"><CheckCircle2 size={16}/></div>
                    <span className="font-black text-sm text-slate-600 uppercase tracking-widest">Universal XML Sync Support</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-6">
                {portals.map((p, i) => (
                  <div key={i} className="group aspect-square bg-slate-50 rounded-[40px] border border-slate-100 flex flex-col items-center justify-center p-8 hover:bg-white hover:shadow-2xl hover:shadow-blue-600/10 transition-all duration-500 hover:-translate-y-2">
                    <div className={`w-16 h-16 ${p.color} rounded-3xl mb-6 shadow-xl flex items-center justify-center text-white font-black text-2xl`}>
                      {p.name[0]}
                    </div>
                    <p className="font-black text-slate-900 text-sm tracking-tight">{p.name}</p>
                    <span className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-[9px] font-black uppercase rounded-full tracking-widest">Zapier/Pabbly/n8n</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES GRID ── */}
        <section id="features" className="py-40 bg-white relative overflow-hidden">
          <div className="container mx-auto px-6 lg:px-12 relative">
            <div className="text-center mb-32">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/5 border border-blue-600/10 rounded-full mb-8">
                <Zap size={12} className="text-blue-600" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Enterprise Engine</span>
              </div>
              <h2 className="text-5xl lg:text-8xl font-black text-slate-900 mb-10 leading-[0.9] tracking-tighter italic">Designed for<br />Modern Dominance.</h2>
              <p className="text-xl lg:text-2xl text-slate-500 max-w-2xl mx-auto font-medium">Built by real estate veterans to solve the hard problems — scalability, efficiency, and data-driven growth.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {features.map((f, i) => (
                <div key={i} className="group bg-[#FDFDFF] p-12 rounded-[56px] border border-slate-100/60 hover:bg-white hover:border-blue-600/20 hover:shadow-[0_40px_100px_-20px_rgba(37,99,235,0.08)] transition-all duration-700 flex flex-col items-start text-left">
                  <div className={`w-20 h-20 rounded-[32px] bg-gradient-to-br ${f.color} flex items-center justify-center mb-10 shadow-2xl shadow-blue-600/20 transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                    <f.icon className="text-white h-10 w-10" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-5 tracking-tight">{f.title}</h3>
                  <p className="text-slate-500 text-lg leading-relaxed font-medium mb-10 flex-1">{f.desc}</p>
                  <Link href="/signup" className="flex items-center gap-3 text-blue-600 font-black text-xs uppercase tracking-[0.2em] group-hover:gap-5 transition-all">
                    Explore Engine <ArrowRight size={16}/>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHATSAPP SECTION ── */}
        <section className="py-40 bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(37,99,235,0.15)_0%,transparent_70%)]" />
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-32">
              <div className="flex-1 relative">
                {/* Chat Mockup */}
                <div className="relative bg-[#0F172A] rounded-[64px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5 p-10 pt-16 overflow-hidden max-w-sm mx-auto">
                   <div className="bg-[#075E54] absolute top-0 inset-x-0 h-20 flex items-center px-8 gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-200 shadow-xl" />
                      <div className="flex flex-col">
                        <span className="text-white font-black text-sm">Lead: Amit Kapoor</span>
                        <span className="text-white/60 text-[10px] font-bold tracking-widest uppercase">Live · WhatsApp API</span>
                      </div>
                   </div>
                   <div className="mt-12 flex flex-col gap-5">
                      <div className="self-end bg-[#DCF8C6] p-5 rounded-[24px] rounded-tr-none text-sm text-slate-800 shadow-xl max-w-[85%] font-medium">
                         Hi Amit, thank you for inquiring about the **Bandra Penthouse**. Schedule visit? 🏡
                      </div>
                      <div className="self-start bg-slate-800 border border-white/5 p-5 rounded-[24px] rounded-tl-none text-sm text-white shadow-xl max-w-[85%] font-medium">
                         Yes! Please send me the brochure as well.
                      </div>
                      <div className="self-end bg-blue-600 text-white p-6 rounded-[28px] shadow-2xl max-w-[95%]">
                         <div className="flex items-center gap-4 mb-3">
                           <Layers size={22}/>
                           <span className="font-black text-xs uppercase tracking-[0.2em]">Deploying Catalog...</span>
                         </div>
                         <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full bg-white w-full animate-progress" />
                         </div>
                      </div>
                   </div>
                </div>
              </div>
              <div className="flex-1 py-10">
                <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/5 border border-white/10 rounded-full mb-10 text-emerald-400">
                    <Zap size={14} className="fill-emerald-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Next-Gen Conversational Sales</span>
                </div>
                <h2 className="text-5xl lg:text-8xl font-black text-white mb-12 leading-[0.9] tracking-tighter">The Future is<br /><span className="text-blue-500">Dialogue.</span></h2>
                <p className="text-xl lg:text-2xl text-slate-400 font-medium mb-16 leading-relaxed">"WhatsApp is no longer optional for real estate. It's the primary sales bridge. We just made it professional-grade."</p>
                <div className="grid grid-cols-2 gap-12 mb-20 text-white">
                   <div className="space-y-2">
                     <p className="text-5xl lg:text-7xl font-black tracking-tighter">98%</p>
                     <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.3em]">Open Rate</p>
                   </div>
                   <div className="space-y-2">
                     <p className="text-5xl lg:text-7xl font-black tracking-tighter">4.5x</p>
                     <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.3em]">ROAS Increase</p>
                   </div>
                </div>
                <Link href="/signup" className="group inline-flex items-center gap-4 px-12 py-6 bg-blue-600 text-white rounded-[24px] font-black text-lg hover:bg-white hover:text-slate-900 transition-all shadow-[0_20px_50px_rgba(37,99,235,0.3)]">
                   Connect WhatsApp API <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="pricing" className="py-40 bg-zinc-50/50">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center mb-32">
              <h2 className="text-4xl lg:text-7xl font-black text-slate-900 mb-8 leading-none tracking-tighter italic">Scale at Your Speed.</h2>
              <p className="text-2xl text-slate-500 max-w-xl mx-auto font-medium">Transparent pricing for agencies that mean business.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
              {pricingPlans.map((p, i) => (
                <div key={i} className={`group relative rounded-[64px] p-14 border transition-all duration-700 ${p.highlight ? "bg-slate-900 text-white border-transparent shadow-[0_60px_120px_-20px_rgba(0,0,0,0.3)] scale-105 z-10" : "bg-white border-slate-100 hover:border-blue-600/20 hover:shadow-2xl"} flex flex-col`}>
                  {p.highlight && <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-8 py-3 rounded-full uppercase tracking-[0.3em] shadow-2xl">The Global Benchmark</div>}
                  
                  <div className="mb-12">
                    <p className={`font-black text-sm uppercase tracking-[0.3em] mb-6 ${p.highlight ? "text-blue-500" : "text-slate-400"}`}>{p.plan}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-7xl font-black tracking-tighter">{p.price === 'Custom' ? '' : '₹'}{p.price}</span>
                      <span className={`text-xl font-bold ${p.highlight ? "text-slate-500" : "text-slate-400"}`}>{p.period}</span>
                    </div>
                    <p className={`text-lg mt-6 font-medium leading-relaxed ${p.highlight ? "text-slate-400" : "text-slate-500"}`}>{p.desc}</p>
                  </div>

                  <div className="flex-1 space-y-6 mb-16">
                    {p.features.map(f => (
                      <div key={f} className="flex items-center gap-5">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-lg ${p.highlight ? "bg-blue-600/20 text-blue-500" : "bg-emerald-500/10 text-emerald-600"}`}>
                           <CheckCircle2 size={16} strokeWidth={3}/>
                        </div>
                        <span className={`text-lg font-bold tracking-tight ${p.highlight ? "text-slate-200" : "text-slate-700"}`}>{f}</span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={p.onClick || (() => window.location.href = p.href || "/signup")}
                    className={`block w-full text-center py-7 rounded-[32px] font-black text-xl transition-all duration-500 hover:scale-[1.03] active:scale-95 ${p.highlight ? "bg-blue-600 text-white shadow-[0_20px_50px_rgba(37,99,235,0.4)]" : "bg-slate-100 text-slate-900 hover:bg-slate-900 hover:text-white"}`}
                  >
                    {p.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TRUST METRIC BOARDER ── */}
        <section className="py-32 bg-zinc-50/20">
          <div className="container mx-auto px-6 lg:px-12">
             <div className="bg-white rounded-[64px] border border-slate-100 p-16 lg:p-24 shadow-[0_60px_120px_-20px_rgba(37,99,235,0.06)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-60 -mr-40 bg-blue-600/5 rounded-full blur-[160px] -z-10 group-hover:scale-125 transition-transform duration-1000" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24 items-center justify-center text-center">
                   <div className="space-y-4">
                      <p className="text-5xl lg:text-8xl font-black text-slate-900 tracking-tighter italic">1,200+</p>
                      <p className="text-[10px] font-black uppercase text-blue-600 tracking-[0.4em] leading-none">Operational Nodes</p>
                   </div>
                   <div className="space-y-4">
                      <p className="text-5xl lg:text-8xl font-black text-slate-900 tracking-tighter italic">12M+</p>
                      <p className="text-[10px] font-black uppercase text-blue-600 tracking-[0.4em] leading-none">Intelligence Quantums</p>
                   </div>
                   <div className="space-y-4">
                      <p className="text-5xl lg:text-8xl font-black text-slate-900 tracking-tighter italic">4.8/5</p>
                      <p className="text-[10px] font-black uppercase text-blue-600 tracking-[0.4em] leading-none">Authority Horizon</p>
                   </div>
                   <div className="space-y-4">
                      <p className="text-5xl lg:text-8xl font-black text-slate-900 tracking-tighter italic">99%</p>
                      <p className="text-[10px] font-black uppercase text-blue-600 tracking-[0.4em] leading-none">Matrix Precision</p>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="py-52 px-6 lg:px-12 relative overflow-hidden">
          <div className="container mx-auto max-w-7xl">
            <div className="bg-[#020617] rounded-[100px] p-20 lg:p-40 text-center relative overflow-hidden group shadow-[0_80px_160px_-40px_rgba(0,0,0,0.4)]">
               <div className="absolute top-0 right-0 p-96 -mr-40 bg-blue-600/20 rounded-full blur-[180px] group-hover:scale-150 transition-transform duration-1000" />
               <div className="absolute bottom-0 left-0 p-96 -ml-40 bg-indigo-600/10 rounded-full blur-[180px]" />
               
               <div className="relative">
                 <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full mb-12 text-blue-400">
                    <Globe size={14} className="animate-spin-slow" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Available Worldwide</span>
                 </div>
                 <h2 className="text-5xl lg:text-9xl font-black text-white leading-[0.85] tracking-tighter mb-16 italic">Dominate Your<br /><span className="text-blue-600">Local Market.</span></h2>
                 <p className="text-2xl lg:text-3xl text-slate-400 max-w-3xl mx-auto font-medium mb-24 leading-relaxed">
                   Join 1,200+ elite real estate powerhouses using the Master Real Estate Matrix to accelerate sales and dominate their territory.
                 </p>
                 <div className="flex flex-col sm:flex-row gap-8 justify-center">
                   <Link href="/signup" className="px-20 py-8 bg-blue-600 text-white rounded-full font-black text-2xl shadow-[0_20px_60px_rgba(37,99,235,0.4)] hover:scale-105 active:scale-95 transition-all">
                     Join the Elite Today
                   </Link>
                   <Link href="/contact" className="px-20 py-8 bg-white/5 backdrop-blur-3xl border border-white/20 text-white rounded-full font-black text-2xl hover:bg-white hover:text-black transition-all">
                     Consult Experts
                   </Link>
                 </div>
                 <p className="mt-16 text-slate-500 font-black text-xs uppercase tracking-[0.4em] leading-none">Instant Provisioning · Zero Legacy Code</p>
               </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      
      <LeadModal 
        isOpen={isLeadModalOpen} 
        onClose={() => setIsLeadModalOpen(false)} 
        plan="Enterprise" 
      />
      
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-5%); }
          50% { transform: translateY(0); }
        }
        @keyframes progress {
          0% { width: 0; }
          100% { width: 100%; }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
        .animate-progress { animation: progress 2s linear forwards; }
        .font-sans { font-family: var(--font-inter), sans-serif; }
      `}</style>
      <WhatsAppButton />
    </div>
  )
}
