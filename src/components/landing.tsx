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
      plan: "Professional", 
      price: "1,099", 
      period: "/month", 
      desc: "For growing agencies managing 20+ deals.", 
      features: ["Up to 20 Agents", "Unlimited Leads", "AI Lead Scoring", "Priority Support", "Custom Reports", "Dedicated WhatsApp CRM"], 
      cta: "Most Popular", 
      highlight: true, 
      href: "/signup" 
    },
    { 
      plan: "Enterprise", 
      price: "Custom", 
      period: "", 
      desc: "For large property companies with multiple branches.", 
      features: ["Unlimited Agents", "Multi-Branch Dashboard", "Portal Sync Integration", "API Access", "Custom Integrations", "On-premise Option"], 
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
      title: "Automated Lead Pipeline", 
      desc: "Every inquiry from WhatsApp, Portals, and Ads is auto-captured, scored by AI, and assigned to the right agent instantly.", 
      color: "from-blue-600 to-indigo-700" 
    },
    { 
      icon: Building2, 
      title: "Smart Property Catalog", 
      desc: "Manage listings with rich media, 360 virtual tours, and floor plans. Social share ready with one click.", 
      color: "from-blue-500 to-sky-500" 
    },
    { 
      icon: MessageSquare, 
      title: "Global WhatsApp CRM", 
      desc: "Personalized follow-ups at scale. Send property cards, brochures, and site-visit details directly via API.", 
      color: "from-emerald-500 to-teal-600" 
    },
    { 
      icon: TrendingUp, 
      title: "Advanced HR & Analytics", 
      desc: "Track agent performance, set revenue targets, and manage commissions. Real-time data for better decisions.", 
      color: "from-violet-600 to-fuchsia-600" 
    },
    { 
      icon: Shield, 
      title: "Enterprise Document Vault", 
      desc: "Securely store KYC, agreements, and payment records. AES-256 encryption compliant with global standards.", 
      color: "from-amber-500 to-orange-600" 
    },
    { 
      icon: LayoutDashboard, 
      title: "Multi-Branch Control", 
      desc: "Manage multiple cities or branches from a single Master dashboard. Unified reporting for global operations.", 
      color: "from-slate-700 to-slate-900" 
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFF] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-100 py-3" : "bg-transparent py-6"}`}>
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:rotate-6 transition-transform duration-300">
              <Building2 className="text-white h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight leading-none text-slate-900">Prop<span className="text-blue-600">GOCrm</span></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">The Global Standard</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {['Features', 'MarketSync', 'Pricing', 'Company'].map(i => (
              <Link key={i} href={`#${i.toLowerCase()}`} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors relative group">
                {i}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Login</Link>
            <Link href="/signup" className="group px-7 py-3 bg-slate-900 text-white rounded-2xl text-sm font-black shadow-xl shadow-slate-900/10 hover:bg-blue-600 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center gap-2">
              Get Started Free <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          <button className="md:hidden p-2 text-slate-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`fixed inset-0 bg-white z-[60] p-6 transition-transform duration-500 md:hidden ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex justify-between items-center mb-12">
             <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white"><Building2 size={18}/></div>
              <span className="text-xl font-black">PropGOCrm</span>
            </div>
            <X className="h-8 w-8 text-slate-400" onClick={() => setMobileMenuOpen(false)} />
          </div>
          <div className="flex flex-col gap-8 text-2xl font-black text-slate-900">
            {['Features', 'MarketSync', 'Pricing', 'Company'].map(i => (
              <Link key={i} href={`#${i.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)}>{i}</Link>
            ))}
          </div>
          <div className="mt-20 flex flex-col gap-4">
            <Link href="/login" className="text-center py-5 font-black text-slate-600">Login</Link>
            <Link href="/signup" className="text-center py-5 bg-blue-600 text-white rounded-2xl font-black">Start Free Trial</Link>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* ── HERO ── */}
        <section className="relative pt-32 pb-20 lg:pt-52 lg:pb-40 overflow-hidden">
          {/* Subtle Background Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1600px] h-[800px] bg-gradient-to-b from-blue-50/50 via-indigo-50/20 to-transparent rounded-full blur-[120px] -z-10" />
          <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-blue-200/20 rounded-full blur-[100px] -z-10" />
          
          <div className="container mx-auto px-6 lg:px-12 relative text-center">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/50 backdrop-blur-md border border-blue-100 rounded-full shadow-sm mb-10 animate-fade-in-up">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">The Power of Automation in Real Estate</span>
            </div>

            <h1 className="text-4xl lg:text-7xl font-black tracking-tight leading-[1.1] text-slate-900 mb-10 max-w-5xl mx-auto">
              Real Estate Sales.<br />
              <span className="text-blue-600">Reimagined.</span>
            </h1>

            <p className="text-xl lg:text-2xl text-slate-500 font-medium max-w-2xl mx-auto mb-14 leading-relaxed">
              PropGOCrm empowers modern agencies to close 3x more deals with intelligent lead automation, global portal sync, and integrated WhatsApp CRM.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center mb-24">
              <Link href="/signup" className="group px-12 py-5 bg-blue-600 text-white rounded-[24px] font-black text-xl shadow-2xl shadow-blue-600/30 hover:bg-blue-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
                Start 14-Day Free Trial <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#features" className="px-12 py-5 bg-white text-slate-700 border border-slate-200 rounded-[24px] font-black text-xl shadow-sm hover:border-blue-600 hover:text-blue-600 hover:shadow-xl hover:shadow-blue-600/5 transition-all">
                See Features
              </Link>
            </div>

            {/* Dashboard Visualizer */}
            <div className="relative max-w-6xl mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-blue-600/20 rounded-[44px] blur-2xl opacity-50" />
              <div className="relative bg-[#0F172A] rounded-[40px] shadow-2xl border border-slate-800 overflow-hidden aspect-[16/9] group lg:scale-105 transition-transform duration-700">
                
                {/* Dashboard Sidebar Placeholder */}
                <div className="absolute inset-y-0 left-0 w-20 lg:w-64 bg-[#020617] border-r border-slate-800 p-6 hidden md:flex flex-col gap-8">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white"><Building2 /></div>
                      <span className="text-white font-black text-xl hidden lg:block">PropGOCrm</span>
                   </div>
                   <div className="flex flex-col gap-2">
                      {[LayoutDashboard, Users, Building2, MessageSquare, TrendingUp, Calendar].map((Icon, i) => (
                        <div key={i} className={`flex items-center gap-4 px-4 py-3 rounded-2xl ${i === 0 ? "bg-blue-600 text-white" : "text-slate-500 hover:text-white hover:bg-slate-900"} transition-all cursor-pointer`}>
                          <Icon size={20} />
                          <span className="font-bold hidden lg:block">{['Dashboard', 'Leads', 'Listing', 'Mails', 'Team', 'Meeting'][i]}</span>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Dashboard Header Bar */}
                <div className="absolute top-0 left-20 lg:left-64 right-0 h-20 border-b border-slate-800 flex items-center px-8 justify-between bg-[#0F172A]/80 backdrop-blur-md z-10">
                   <div className="flex items-center gap-6">
                      {['Leads', 'Pipeline', 'Meetings', 'HR & Accounts'].map((t, i) => (
                        <span 
                          key={t} 
                          onClick={() => setActiveTab(t.toLowerCase())}
                          className={`text-sm font-black uppercase tracking-widest cursor-pointer transition-all ${activeTab === t.toLowerCase() ? "text-blue-500" : "text-slate-500 hover:text-slate-300"}`}
                        >
                          {t}
                        </span>
                      ))}
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700" />
                   </div>
                </div>

                {/* Dashboard Content Mockup */}
                <div className="absolute inset-0 pt-20 pl-20 lg:pl-64 overflow-hidden">
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
                <div key={currentLeadIdx} className="absolute right-10 bottom-10 w-80 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[32px] p-5 shadow-2xl animate-float">
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
                  Capturing leads from Bayut, Property Finder, Zillow, and Dubizzle used to be manual. PropGOCrm syncs with them all in real-time, pulling every inquiry directly into your agent's dashboard.
                </p>
                <div className="flex flex-col gap-4 text-left max-w-sm mx-auto lg:mx-0">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-600"><CheckCircle2 size={16}/></div>
                    <span className="font-black text-sm text-slate-600 uppercase tracking-widest italic">Zero Lead Leakage</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-600"><CheckCircle2 size={16}/></div>
                    <span className="font-black text-sm text-slate-600 uppercase tracking-widest italic">Auto-Response via WhatsApp</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-600"><CheckCircle2 size={16}/></div>
                    <span className="font-black text-sm text-slate-600 uppercase tracking-widest italic">Universal XML Sync Support</span>
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
                    <span className="mt-2 px-3 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase rounded-full tracking-widest">Active Sync</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES GRID ── */}
        <section id="features" className="py-32 bg-slate-50 relative overflow-hidden">
          <div className="container mx-auto px-6 lg:px-12 relative">
            <div className="text-center mb-24">
              <h2 className="text-4xl lg:text-7xl font-black text-slate-900 mb-8 leading-none">The Engine for<br />Modern Agencies.</h2>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">Built by real estate veterans to solve the hard problems — scalability, efficiency, and data-driven growth.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((f, i) => (
                <div key={i} className="group bg-white p-10 rounded-[48px] border border-slate-200 hover:border-blue-600/20 hover:shadow-2xl hover:shadow-blue-600/5 transition-all duration-500 flex flex-col items-start text-left">
                  <div className={`w-16 h-16 rounded-[24px] bg-gradient-to-br ${f.color} flex items-center justify-center mb-8 shadow-xl shadow-blue-600/20 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                    <f.icon className="text-white h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{f.title}</h3>
                  <p className="text-slate-500 text-lg leading-relaxed font-medium mb-8 flex-1">{f.desc}</p>
                  <Link href="/signup" className="flex items-center gap-2 text-blue-600 font-black text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
                    Explore Feature <ArrowRight size={18}/>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHATSAPP SECTION ── */}
        <section className="py-32 bg-[#F0F7FF] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-40 -mr-60 -mt-20 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
          <div className="container mx-auto px-6 lg:px-12">
            <div className="flex flex-col lg:flex-row items-center gap-24">
              <div className="flex-1 relative">
                {/* Chat Mockup */}
                <div className="relative bg-white rounded-[48px] shadow-2xl border border-blue-100 p-8 pt-12 overflow-hidden max-w-sm mx-auto">
                   <div className="bg-[#075E54] absolute top-0 inset-x-0 h-16 flex items-center px-6 gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200" />
                      <div className="flex flex-col">
                        <span className="text-white font-black text-sm">Lead: Amit Kapoor</span>
                        <span className="text-white/60 text-[10px] font-bold">Online · WhatsApp API</span>
                      </div>
                   </div>
                   <div className="mt-10 flex flex-col gap-4">
                      <div className="self-end bg-[#DCF8C6] p-4 rounded-[20px] rounded-tr-none text-sm text-slate-800 shadow-sm max-w-[80%]">
                         Hi Amit, thank you for inquiring about the **Bandra Penthouse**. Would you like to schedule a site visit this Saturday? 🏡
                      </div>
                      <div className="self-start bg-white border border-slate-100 p-4 rounded-[20px] rounded-tl-none text-sm text-slate-800 shadow-sm max-w-[80%]">
                         Yes! Please send me the brochure as well.
                      </div>
                      <div className="self-end bg-blue-600 text-white p-5 rounded-[24px] shadow-xl max-w-[90%]">
                         <div className="flex items-center gap-3 mb-2">
                           <Layers size={20}/>
                           <span className="font-black text-xs uppercase tracking-widest">Property PDF Sent</span>
                         </div>
                         <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full bg-white w-full animate-progress" />
                         </div>
                      </div>
                   </div>
                </div>
                {/* Floating badged */}
                <div className="absolute -left-10 top-1/2 bg-white rounded-[32px] p-6 shadow-2xl border border-blue-100 max-w-[200px] animate-bounce-slow">
                   <p className="text-2xl mb-2">🤖</p>
                   <p className="text-sm font-black text-slate-900 leading-tight">AI handling 84% of basic queries...</p>
                </div>
              </div>
              <div className="flex-1 py-10">
                <h2 className="text-4xl lg:text-7xl font-black text-slate-900 mb-10 leading-none">The Future is<br />Conversational.</h2>
                <p className="text-xl text-slate-500 font-medium mb-12 leading-relaxed italic">"WhatsApp is no longer optional for real estate. It's the primary sales channel. We just made it professional."</p>
                <div className="grid grid-cols-2 gap-8 mb-14">
                   <div>
                     <p className="text-4xl font-black text-blue-600 mb-2">98%</p>
                     <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Open Rate</p>
                   </div>
                   <div>
                     <p className="text-4xl font-black text-blue-600 mb-2">4.5x</p>
                     <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Higher Conversion</p>
                   </div>
                </div>
                <Link href="/signup" className="inline-flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-2xl font-black hover:bg-blue-600 transition-all shadow-2xl">
                   Connect WhatsApp API <MousePointer2 />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="pricing" className="py-40 bg-white">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center mb-32">
              <h2 className="text-4xl lg:text-7xl font-black text-slate-900 mb-8 leading-none tracking-tighter">Scale at Your Speed.</h2>
              <p className="text-2xl text-slate-500 max-w-xl mx-auto font-medium italic">Transparent pricing for agencies that mean business.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto hov-stack">
              {pricingPlans.map((p, i) => (
                <div key={i} className={`group relative rounded-[56px] p-12 border ${p.highlight ? "bg-slate-900 text-white border-transparent shadow-[0_40px_100px_-20px_rgba(0,0,0,0.25)] scale-105 z-10" : "bg-white border-slate-200 hover:border-blue-600/30"} transition-all duration-500 flex flex-col`}>
                  {p.highlight && <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-6 py-2.5 rounded-full uppercase tracking-[0.2em] shadow-xl">The Benchmark</div>}
                  
                  <div className="mb-10">
                    <p className={`font-black text-sm uppercase tracking-[0.2em] mb-4 ${p.highlight ? "text-blue-500" : "text-slate-400"}`}>{p.plan}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-6xl font-black tracking-tight">{p.price === 'Custom' ? '' : '₹'}{p.price}</span>
                      <span className={`text-xl font-bold ${p.highlight ? "text-slate-500" : "text-slate-400"}`}>{p.period}</span>
                    </div>
                    <p className={`text-base mt-4 font-medium ${p.highlight ? "text-slate-400" : "text-slate-500"}`}>{p.desc}</p>
                  </div>

                  <div className="flex-1 space-y-5 mb-14">
                    {p.features.map(f => (
                      <div key={f} className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${p.highlight ? "bg-blue-600/20 text-blue-500" : "bg-slate-100 text-blue-600"}`}>
                           <CheckCircle2 size={14}/>
                        </div>
                        <span className={`text-base font-bold ${p.highlight ? "text-slate-200" : "text-slate-700"}`}>{f}</span>
                      </div>
                    ))}
                  </div>

                  {p.href ? (
                    <Link href={p.href} className={`block text-center py-6 rounded-[32px] font-black text-lg transition-all ${p.highlight ? "bg-blue-600 text-white hover:bg-white hover:text-black shadow-2xl shadow-blue-600/30" : "bg-slate-100 text-slate-900 hover:bg-blue-600 hover:text-white"}`}>
                      {p.cta}
                    </Link>
                  ) : (
                    <button onClick={p.onClick} className="w-full text-center py-6 rounded-[32px] font-black text-lg bg-blue-600 text-white hover:bg-white hover:text-black transition-all shadow-2xl shadow-blue-600/30">
                      {p.cta}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="py-40 bg-slate-50 overflow-hidden relative">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1600px] h-[1600px] border border-blue-600/5 rounded-full pointer-events-none" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border border-blue-600/5 rounded-full pointer-events-none" />
           
           <div className="container mx-auto px-6 lg:px-12 relative">
             <div className="max-w-4xl mx-auto text-center">
               <div className="flex justify-center gap-2 mb-10">
                 {[1,2,3,4,5].map(i => <Star key={i} className="fill-blue-600 text-blue-600" size={24}/>)}
               </div>
               <h2 className="text-3xl lg:text-5xl font-black text-slate-900 leading-[1.1] mb-14">"PropGOCrm isn't just software. It's our entire business brain. We closed more in Q1 than all of last year."</h2>
               <div className="flex items-center justify-center gap-6">
                  <div className="w-20 h-20 bg-blue-600 rounded-3xl shrink-0" />
                  <div className="text-left">
                    <p className="text-2xl font-black text-slate-900">Arjun Deshmukh</p>
                    <p className="text-lg text-slate-500 font-bold">CEO, Platinum Realty Global</p>
                  </div>
               </div>
             </div>
           </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="py-40 px-6 lg:px-12">
          <div className="container mx-auto max-w-7xl">
            <div className="bg-[#020617] rounded-[80px] p-16 lg:p-32 text-center relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-80 -mr-40 bg-blue-600/20 rounded-full blur-[160px] group-hover:scale-125 transition-transform duration-1000" />
               <div className="absolute bottom-0 left-0 p-80 -ml-40 bg-indigo-600/10 rounded-full blur-[160px]" />
               
               <div className="relative">
                 <h2 className="text-4xl lg:text-7xl font-black text-white leading-none tracking-tighter mb-14">Become a Global<br /><span className="text-blue-600">Powerhouse.</span></h2>
                 <p className="text-2xl text-slate-400 max-w-2xl mx-auto font-medium mb-20 leading-relaxed">
                   Join 1,200+ top-tier agencies worldwide using PropGOCrm to dominate their local markets.
                 </p>
                 <div className="flex flex-col sm:flex-row gap-6 justify-center">
                   <Link href="/signup" className="px-16 py-7 bg-blue-600 text-white rounded-full font-black text-2xl shadow-3xl shadow-blue-600/40 hover:scale-105 transition-all">
                     Join PropGOCrm Today
                   </Link>
                   <Link href="/contact" className="px-16 py-7 bg-white/5 backdrop-blur-xl border border-white/20 text-white rounded-full font-black text-2xl hover:bg-white hover:text-black transition-all">
                     Talk to Sales
                   </Link>
                 </div>
                 <p className="mt-12 text-slate-500 font-black text-sm uppercase tracking-widest">No credit card required · Instant setup</p>
               </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-[#020617] border-t border-slate-900 pt-32 pb-16 px-6 lg:px-12 relative">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-32">
            <div className="lg:col-span-5">
              <Link href="/" className="inline-flex items-center gap-3 group mb-10">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                  <Building2 size={28}/>
                </div>
                <span className="text-3xl font-black text-white tracking-tighter">PropGOCrm</span>
              </Link>
              <p className="text-xl text-slate-500 leading-relaxed max-w-md font-medium mb-12">
                The world's most advanced CRM platform built specifically for real estate professionals. Scale faster, close more, and dominate your market.
              </p>
              <div className="flex gap-4">
                {[MessageSquare, Phone, Globe, Shield].map((Icon, i) => (
                  <div key={i} className="w-14 h-14 bg-slate-900 rounded-3xl border border-slate-800 flex items-center justify-center text-slate-500 hover:text-white hover:bg-blue-600 transition-all cursor-pointer">
                    <Icon size={24}/>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-7 grid grid-cols-2 lg:grid-cols-3 gap-12">
              <div>
                <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-10">Product</h4>
                <ul className="flex flex-col gap-6">
                  {['Features', 'MarketSync', 'WhatsApp API', 'Pricing', 'API Docs'].map(l => (
                    <li key={l}><Link href="#" className="text-slate-500 hover:text-white font-bold transition-all">{l}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-10">Resources</h4>
                <ul className="flex flex-col gap-6">
                  {['Sales Guide', 'Blog', 'Case Studies', 'Partner Program', 'Status'].map(l => (
                    <li key={l}><Link href="#" className="text-slate-500 hover:text-white font-bold transition-all">{l}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-10">Legal</h4>
                <ul className="flex flex-col gap-6">
                  {['Privacy', 'Terms', 'Cookie Policy', 'Security', 'Refunds'].map(l => (
                    <li key={l}><Link href="#" className="text-slate-500 hover:text-white font-bold transition-all">{l}</Link></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="pt-16 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-10">
            <p className="text-slate-600 font-bold text-sm">© 2026 PropGOCrm Global. Engineering excellence by <a href="https://aiclex.in" className="text-slate-400 hover:text-blue-500">Aiclex</a>.</p>
            <div className="flex items-center gap-2 px-6 py-3 bg-slate-900/50 rounded-full border border-slate-800">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-emerald-500 font-black text-[10px] uppercase tracking-widest">Global Ingress: Operational</span>
            </div>
          </div>
        </div>
      </footer>
      
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
        .font-sans { font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; }
      `}</style>
    </div>
  )
}
