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
  ShieldCheck
} from "lucide-react"

export default function Landing() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentLeadIdx, setCurrentLeadIdx] = useState(0)

  const mockLeads = [
    { name: "Rahul Sharma", action: "Inquired about 3BHK in Bandra", badge: "Hot Lead 🔥" },
    { name: "Priya Patel", action: "Ready to close ₹2.4Cr villa deal", badge: "Closing Soon 💰" },
    { name: "Vikram Singh", action: "Scheduled site visit this evening", badge: "Site Visit 🏠" },
    { name: "Meera Joshi", action: "New referral from existing client", badge: "Referral ⭐" }
  ]

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    const interval = setInterval(() => setCurrentLeadIdx(p => (p + 1) % mockLeads.length), 3500)
    return () => { window.removeEventListener("scroll", handleScroll); clearInterval(interval) }
  }, [mockLeads.length])

  const beforePains = [
    "Leads lost in WhatsApp & Excel sheets",
    "Agents forget followups, deals slip away",
    "No idea which property sells best",
    "Client documents scattered everywhere",
    "Manager always in the dark about team",
  ]

  const afterGains = [
    "Every lead captured & auto-assigned",
    "Smart reminders, zero missed followups",
    "Real-time analytics per property & agent",
    "All docs in one secure digital vault",
    "Boss dashboard — full team visibility",
  ]

  const features = [
    { icon: Users, title: "Lead Pipeline", desc: "Drag-drop pipeline to track every inquiry from first call to deal close.", color: "from-blue-500 to-indigo-600" },
    { icon: Building2, title: "Property Catalog", desc: "Rich listings with photos, pricing history, and availability status.", color: "from-emerald-500 to-teal-600" },
    { icon: Bell, title: "Smart Follow-ups", desc: "AI reminds agents at the right time — never lose a hot lead again.", color: "from-amber-500 to-orange-600" },
    { icon: BarChart3, title: "Sales Analytics", desc: "Daily reports, agent leaderboards, and conversion funnels at a glance.", color: "from-purple-500 to-violet-600" },
    { icon: Calendar, title: "Site Visit Planner", desc: "Schedule and track property visits with clients on an integrated calendar.", color: "from-pink-500 to-rose-600" },
    { icon: ShieldCheck, title: "Document Vault", desc: "Store agreements, KYC docs, and property papers securely in the cloud.", color: "from-cyan-500 to-sky-600" },
  ]

  const testimonials = [
    { name: "Rajesh Mehta", role: "MD, Mehta Realty", city: "Mumbai", stars: 5, quote: "We went from losing 3-4 leads a day to closing 40% more deals in the first month. Ek game-changer hai yeh CRM." },
    { name: "Sunita Agarwal", role: "Sales Head, Skyline Properties", city: "Delhi NCR", stars: 5, quote: "Before this, my team was always confused. Now they know exactly which client to call and when. Stress khatam!" },
    { name: "Kiran Reddy", role: "Founder, KR Estates", city: "Hyderabad", stars: 5, quote: "₹5Cr revenue increase in 6 months. The ROI on this SaaS is insane. Highly recommended for serious agencies." },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-100 py-3" : "bg-transparent py-5"}`}>
        <div className="container mx-auto px-6 lg:px-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <Building2 className="text-white h-6 w-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tighter text-slate-900">PropCRM</span>
              <span className="block text-[9px] font-bold text-blue-600 uppercase tracking-widest leading-none -mt-0.5">Real Estate Intelligence</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {['Features', 'Why Us', 'Pricing', 'Testimonials'].map(i => (
              <Link key={i} href={`#${i.toLowerCase().replace(" ", "-")}`} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">{i}</Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors">Login</Link>
            <Link href="/signup" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all">
              Start Free Trial →
            </Link>
          </div>

          <button className="md:hidden text-slate-800" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 px-6 py-6 flex flex-col gap-5">
            {['Features', 'Why Us', 'Pricing', 'Testimonials'].map(i => (
              <Link key={i} href={`#${i.toLowerCase()}`} className="text-base font-semibold text-slate-700" onClick={() => setMobileMenuOpen(false)}>{i}</Link>
            ))}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              <Link href="/login" className="text-center py-3 font-bold text-slate-700">Login</Link>
              <Link href="/signup" className="text-center py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold">Start Free Trial</Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">

        {/* ── HERO ── */}
        <section className="relative pt-28 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-gradient-to-b from-slate-50 via-blue-50/40 to-white">
          {/* BG City Silhouette */}
          <div className="absolute bottom-0 left-0 right-0 h-64 opacity-5" aria-hidden>
            <svg viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <rect x="0"   y="80" width="60"  height="120" fill="#1e3a5f"/>
              <rect x="20"  y="60" width="20"  height="140" fill="#1e3a5f"/>
              <rect x="80"  y="100" width="80" height="100" fill="#1e3a5f"/>
              <rect x="100" y="70" width="40"  height="130" fill="#1e3a5f"/>
              <rect x="180" y="50" width="100" height="150" fill="#1e3a5f"/>
              <rect x="200" y="30" width="60"  height="170" fill="#1e3a5f"/>
              <rect x="290" y="90" width="70"  height="110" fill="#1e3a5f"/>
              <rect x="370" y="60" width="90"  height="140" fill="#1e3a5f"/>
              <rect x="390" y="40" width="50"  height="160" fill="#1e3a5f"/>
              <rect x="470" y="100" width="60" height="100" fill="#1e3a5f"/>
              <rect x="540" y="55" width="120" height="145" fill="#1e3a5f"/>
              <rect x="560" y="20" width="80"  height="180" fill="#1e3a5f"/>
              <rect x="670" y="80" width="70"  height="120" fill="#1e3a5f"/>
              <rect x="750" y="40" width="100" height="160" fill="#1e3a5f"/>
              <rect x="760" y="10" width="70"  height="190" fill="#1e3a5f"/>
              <rect x="860" y="70" width="80"  height="130" fill="#1e3a5f"/>
              <rect x="950" y="50" width="110" height="150" fill="#1e3a5f"/>
              <rect x="960" y="20" width="90"  height="180" fill="#1e3a5f"/>
              <rect x="1070" y="90" width="70" height="110" fill="#1e3a5f"/>
              <rect x="1150" y="60" width="90" height="140" fill="#1e3a5f"/>
              <rect x="1160" y="30" width="70" height="170" fill="#1e3a5f"/>
              <rect x="1250" y="80" width="80" height="120" fill="#1e3a5f"/>
              <rect x="1340" y="50" width="100" height="150" fill="#1e3a5f"/>
            </svg>
          </div>

          {/* Orbs */}
          <div className="absolute top-0 right-0 -mr-32 w-[700px] h-[700px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-32 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-6 lg:px-16 relative">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              {/* Left Copy */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 text-blue-700 rounded-full text-xs font-black uppercase tracking-widest mb-8 border border-blue-200">
                  <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                  Trusted by 500+ Real Estate Agencies
                </div>

                <h1 className="text-4xl lg:text-6xl font-black text-slate-900 leading-tight mb-6">
                  Stop Losing Deals.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Run Your Agency</span><br />
                  Like a Pro.
                </h1>

                <p className="text-lg text-slate-500 max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed">
                  PropCRM is built for real estate agencies just like yours — manage leads, properties, site visits, and your entire team from one powerful dashboard.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/signup" className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
                    Start Free Trial <ChevronRight className="h-5 w-5" />
                  </Link>
                  <Link href="#why-us" className="px-10 py-4 bg-white text-slate-800 rounded-2xl font-bold text-lg border border-slate-200 hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    See How It Works
                  </Link>
                </div>

                {/* Social Proof */}
                <div className="flex items-center gap-4 mt-10 justify-center lg:justify-start">
                  <div className="flex -space-x-3">
                    {['RM','SP','VA','KR','MA'].map(n => (
                      <div key={n} className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-white flex items-center justify-center text-white text-[10px] font-black">{n}</div>
                    ))}
                  </div>
                  <div>
                    <div className="flex gap-0.5">{[...Array(5)].map((_,i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">4.9/5 from 200+ agencies</p>
                  </div>
                </div>
              </div>

              {/* Right — Hero Image (Desktop only) */}
              <div className="flex-1 w-full hidden lg:block">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-[3rem] blur-2xl" />
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/50">
                    <Image
                      src="/images/hero-dashboard.png"
                      alt="Real estate team using PropCRM"
                      width={640}
                      height={640}
                      className="w-full object-cover"
                      priority
                    />
                  </div>
                  {/* Floating notification */}
                  <div key={currentLeadIdx} className="absolute bottom-6 -left-8 w-72 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-blue-100 animate-notification">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center shrink-0">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-[10px] font-black text-blue-600 uppercase tracking-wider">New Lead</p>
                          <span className="text-[9px] bg-blue-50 text-blue-600 border border-blue-200 px-1.5 py-0.5 rounded-full font-bold">{mockLeads[currentLeadIdx].badge}</span>
                        </div>
                        <p className="text-sm font-black text-slate-800 truncate">{mockLeads[currentLeadIdx].name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{mockLeads[currentLeadIdx].action}</p>
                      </div>
                    </div>
                  </div>
                  {/* Revenue badge */}
                  <div className="absolute -top-4 -right-4 bg-emerald-500 text-white rounded-2xl px-4 py-2 text-sm font-black shadow-xl animate-float">
                    +₹2.4Cr Closed 🎉
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── ANIMATED PRODUCT PREVIEW ── */}
        <section className="py-20 px-6 lg:px-16 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="container mx-auto relative">
            <div className="text-center mb-12">
              <p className="text-blue-600 font-black uppercase tracking-widest text-sm mb-3">Live Product Preview</p>
              <h2 className="text-3xl lg:text-5xl font-black text-slate-900 mb-4">One Dashboard. Total Control.</h2>
              <p className="text-slate-500 text-lg max-w-xl mx-auto">See your entire agency — leads, properties, team performance — in one glance.</p>
            </div>

            {/* Animated Dashboard Mockup */}
            <div className="relative max-w-6xl mx-auto group">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-30 transition duration-1000" />
              <div className="relative bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden">
                {/* Browser chrome */}
                <div className="bg-slate-800 px-6 py-4 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex-1 mx-4 h-7 bg-slate-700 rounded-lg flex items-center px-3">
                    <span className="text-slate-400 text-xs font-medium">app.propcrm.in/dashboard</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded bg-slate-700" />
                    <div className="w-6 h-6 rounded bg-slate-700" />
                  </div>
                </div>

                {/* Dashboard body */}
                <div className="flex h-[520px]">
                  {/* Sidebar */}
                  <div className="hidden md:flex w-56 bg-slate-900 flex-col p-4 gap-1 shrink-0">
                    <div className="flex items-center gap-3 px-3 py-3 mb-4">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-white font-black text-sm">PropCRM</span>
                    </div>
                    {[
                      { icon: BarChart3, label: "Dashboard", active: true },
                      { icon: Users, label: "Leads", active: false },
                      { icon: Building2, label: "Properties", active: false },
                      { icon: Calendar, label: "Site Visits", active: false },
                      { icon: MessageSquare, label: "Follow-ups", active: false },
                      { icon: TrendingUp, label: "Analytics", active: false },
                    ].map(item => (
                      <div key={item.label} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${item.active ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}>
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Main content */}
                  <div className="flex-1 bg-slate-50 p-6 overflow-hidden">
                    {/* Stats row */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      {[
                        { label: "Active Leads", value: "148", change: "+12%", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
                        { label: "Site Visits", value: "23", change: "+8%", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
                        { label: "Deals Closing", value: "7", change: "+3", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
                        { label: "Revenue (Cr)", value: "₹8.4", change: "+18%", color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
                      ].map((s, i) => (
                        <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 animate-float`} style={{ animationDelay: `${i * 0.2}s` }}>
                          <p className="text-xs font-medium text-slate-500 mb-2">{s.label}</p>
                          <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                          <p className="text-xs text-emerald-500 font-bold mt-1">↑ {s.change} this week</p>
                        </div>
                      ))}
                    </div>

                    {/* Two column layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-[calc(100%-130px)]">
                      {/* Lead pipeline */}
                      <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-4 overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-sm font-black text-slate-700">Live Lead Pipeline</p>
                          <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />LIVE
                          </span>
                        </div>
                        <div className="space-y-2.5">
                          {[
                            { name: "Amit Kapoor", prop: "3BHK Bandra West, ₹1.8Cr", status: "Negotiation", badge: "bg-amber-100 text-amber-700", delay: "0s" },
                            { name: "Divya Nair", prop: "Penthouse Worli, ₹4.2Cr", status: "Site Visit", badge: "bg-blue-100 text-blue-700", delay: "0.3s" },
                            { name: "Ravi Tiwari", prop: "Commercial BKC, ₹2.1Cr", status: "Deal Close ✅", badge: "bg-emerald-100 text-emerald-700", delay: "0.6s" },
                            { name: "Priya Mehta", prop: "2BHK Powai, ₹95L", status: "New Lead", badge: "bg-slate-100 text-slate-600", delay: "0.9s" },
                          ].map(lead => (
                            <div key={lead.name} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors animate-float" style={{ animationDelay: lead.delay }}>
                              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-black shrink-0">
                                {lead.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-800 truncate">{lead.name}</p>
                                <p className="text-[10px] text-slate-400 truncate">{lead.prop}</p>
                              </div>
                              <span className={`text-[9px] font-black px-2 py-1 rounded-full shrink-0 ${lead.badge}`}>{lead.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: chart + agent perf */}
                      <div className="lg:col-span-2 flex flex-col gap-4">
                        {/* Chart */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex-1">
                          <p className="text-xs font-black text-slate-700 mb-3">Monthly Revenue</p>
                          <div className="flex items-end gap-1.5 h-[80px]">
                            {[40, 55, 35, 70, 60, 85, 95].map((h, i) => (
                              <div key={i} className="flex-1 rounded-t-lg animate-float" style={{ height: `${h}%`, background: `hsl(${230 + i * 5}, 80%, ${50 + i * 3}%)`, animationDelay: `${i * 0.1}s` }} />
                            ))}
                          </div>
                          <div className="flex justify-between mt-2">
                            {['Sep','Oct','Nov','Dec','Jan','Feb','Mar'].map(m => (
                              <span key={m} className="text-[8px] text-slate-400">{m}</span>
                            ))}
                          </div>
                        </div>
                        {/* Agent leaderboard */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-4">
                          <p className="text-xs font-black text-slate-700 mb-3">🏆 Agent Leaderboard</p>
                          <div className="space-y-2">
                            {[
                              { name: "Pooja K.", deals: 12, pct: 90 },
                              { name: "Aryan S.", deals: 9, pct: 68 },
                              { name: "Sneha R.", deals: 7, pct: 52 },
                            ].map((a, i) => (
                              <div key={a.name} className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-slate-400 w-4">{i + 1}</span>
                                <div className="flex-1">
                                  <div className="flex justify-between mb-0.5">
                                    <span className="text-[10px] font-bold text-slate-700">{a.name}</span>
                                    <span className="text-[10px] font-black text-blue-600">{a.deals} deals</span>
                                  </div>
                                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-shimmer" style={{ width: `${a.pct}%` }} />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div key={currentLeadIdx} className="hidden lg:flex absolute -right-6 top-1/3 w-64 bg-white rounded-2xl p-3.5 shadow-2xl border border-blue-100 animate-notification items-center gap-3">
                <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <Bell className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-wider">Alert</p>
                  <p className="text-xs font-black text-slate-800 truncate">{mockLeads[currentLeadIdx].name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{mockLeads[currentLeadIdx].action}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── BEFORE / AFTER ── */}
        <section id="why-us" className="py-24 bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/></pattern></defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>

          <div className="container mx-auto px-6 lg:px-16 relative">
            <div className="text-center mb-16">
              <p className="text-blue-400 font-black uppercase tracking-widest text-sm mb-3">Before vs After PropCRM</p>
              <h2 className="text-3xl lg:text-5xl font-black text-white mb-4">Every Agency Has 2 Phases.</h2>
              <p className="text-slate-400 text-lg">Which one are you still living in?</p>
            </div>

            {/* Before/After illustration */}
            <div className="flex justify-center mb-12">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10 max-w-2xl w-full">
                <Image
                  src="/images/before-after.png"
                  alt="Before and after using PropCRM"
                  width={800}
                  height={400}
                  className="w-full object-cover"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* BEFORE */}
              <div className="bg-red-950/40 rounded-3xl p-8 border border-red-800/50">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-red-400" />
                  </div>
                  <div>
                    <p className="text-red-400 font-black uppercase tracking-widest text-xs">Before CRM</p>
                    <p className="text-white font-bold text-xl">The Chaos Phase 😩</p>
                  </div>
                </div>
                <ul className="space-y-4">
                  {beforePains.map(p => (
                    <li key={p} className="flex items-start gap-3">
                      <XCircle className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
                      <span className="text-slate-300 font-medium">{p}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 p-5 bg-red-900/30 rounded-2xl border border-red-800/40">
                  <p className="text-red-300 text-sm font-medium italic">"Yaar, 5 deals slip ho gayi is month. Client ka call miss hua, followup bhool gaye. Boss furious hai."</p>
                  <p className="text-red-500 text-xs font-bold mt-2">— Every agent before PropCRM</p>
                </div>
              </div>

              {/* AFTER */}
              <div className="bg-emerald-950/40 rounded-3xl p-8 border border-emerald-800/50">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-emerald-400 font-black uppercase tracking-widest text-xs">After CRM</p>
                    <p className="text-white font-bold text-xl">The Growth Phase 🚀</p>
                  </div>
                </div>
                <ul className="space-y-4">
                  {afterGains.map(g => (
                    <li key={g} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
                      <span className="text-slate-200 font-medium">{g}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 p-5 bg-emerald-900/30 rounded-2xl border border-emerald-800/40">
                  <p className="text-emerald-200 text-sm font-medium italic">"Pehle bahut stress tha. Ab CRM sab handle karta hai. Team productive hai, clients khush hain. Revenue double!"</p>
                  <p className="text-emerald-500 text-xs font-bold mt-2">— Rajesh Mehta, Mehta Realty Mumbai</p>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link href="/signup" className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all">
                Switch to the Growth Phase <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" className="py-24 px-6 lg:px-16 bg-white">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <p className="text-blue-600 font-black uppercase tracking-widest text-sm mb-3">Everything in One Place</p>
              <h2 className="text-3xl lg:text-5xl font-black text-slate-900 mb-4">Built for Real Estate.<br />Period.</h2>
              <p className="text-slate-500 max-w-xl mx-auto text-lg">No generic CRM junk. PropCRM has every feature a property agency needs to scale.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <div key={i} className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <f.icon className="text-white h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TEAM MANAGEMENT VISUAL ── */}
        <section className="py-24 px-6 lg:px-16 bg-gradient-to-br from-blue-600 to-indigo-800 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" aria-hidden>
            <svg viewBox="0 0 400 400" className="w-full h-full">
              {[...Array(6)].map((_,i) => <circle key={i} cx={i*80} cy="200" r="180" fill="none" stroke="white" strokeWidth="0.5" />)}
            </svg>
          </div>

          <div className="container mx-auto relative">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              {/* Left: Team illustration + feed */}
              <div className="flex-1 w-full max-w-md mx-auto lg:mx-0">
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/20 mb-6">
                  <Image
                    src="/images/team-management.png"
                    alt="Real estate team managed with PropCRM"
                    width={500}
                    height={400}
                    className="w-full object-cover"
                  />
                </div>
                <div className="bg-white/10 backdrop-blur rounded-3xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-white font-black text-sm uppercase tracking-widest">🏢 Team Live Feed</p>
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="space-y-3">
                    {[
                      { agent: "Pooja", action: "Added new lead: Suresh Gupta", time: "2m ago", avatar: "PK", color: "from-pink-500 to-rose-500" },
                      { agent: "Aryan", action: "Closed deal — Andheri 2BHK ₹85L", time: "15m ago", avatar: "AS", color: "from-emerald-500 to-teal-500" },
                      { agent: "Sneha", action: "Scheduled site visit: Juhu Villa", time: "32m ago", avatar: "SR", color: "from-blue-500 to-indigo-500" },
                      { agent: "Rahul", action: "Followed up with 8 pending leads", time: "1h ago", avatar: "RM", color: "from-amber-500 to-orange-500" },
                      { agent: "Divya", action: "Uploaded KYC docs for Kapoor family", time: "2h ago", avatar: "DN", color: "from-purple-500 to-violet-500" },
                    ].map((a, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center text-white text-xs font-black shrink-0`}>{a.avatar}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-bold truncate">{a.agent} <span className="font-normal text-white/60 text-xs">{a.action}</span></p>
                          <p className="text-white/40 text-xs">{a.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Copy */}
              <div className="flex-1 text-center lg:text-left">
                <p className="text-blue-200 font-black uppercase tracking-widest text-sm mb-4">For Managers & Owners</p>
                <h2 className="text-3xl lg:text-5xl font-black text-white mb-6">
                  See What Your<br />
                  Entire Team<br />
                  Is Doing.<br />
                  <span className="text-blue-200">Right Now.</span>
                </h2>
                <p className="text-blue-100 text-lg leading-relaxed mb-8">
                  No more calling agents for updates. PropCRM gives you a live bird's-eye view — who's calling, who's closing, and who needs a nudge.
                </p>
                <ul className="space-y-4 text-left mb-10">
                  {[
                    "Agent leaderboard — gamify your team's hustle",
                    "Set targets & track them in real-time",
                    "Get alerts when a hot lead is left unattended",
                    "Daily team performance email digest"
                  ].map(p => (
                    <li key={p} className="flex items-start gap-3">
                      <Zap className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
                      <span className="text-blue-100 font-medium">{p}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 rounded-2xl font-black hover:scale-105 transition-all shadow-xl">
                  Get The Boss Dashboard <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="pricing" className="py-24 px-6 lg:px-16 bg-slate-50">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <p className="text-blue-600 font-black uppercase tracking-widest text-sm mb-3">Simple Pricing</p>
              <h2 className="text-3xl lg:text-5xl font-black text-slate-900 mb-4">One Price.<br />Unlimited Growth.</h2>
              <p className="text-slate-500 text-lg">No per-agent fees. No hidden costs. Just results.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { plan: "Starter", price: "₹2,999", period: "/month", desc: "Perfect for small agencies getting started.", features: ["Up to 5 Agents", "500 Leads/Month", "Basic Analytics", "Email Support"], cta: "Start Free Trial", highlight: false },
                { plan: "Professional", price: "₹5,999", period: "/month", desc: "For growing agencies managing 20+ deals.", features: ["Up to 20 Agents", "Unlimited Leads", "AI Lead Scoring", "Priority Support", "Custom Reports", "WhatsApp Integration"], cta: "Most Popular", highlight: true },
                { plan: "Enterprise", price: "Custom", period: "", desc: "For large property companies with multiple branches.", features: ["Unlimited Agents", "Multi-Branch Dashboard", "Dedicated Account Manager", "API Access", "Custom Integrations", "On-premise Option"], cta: "Contact Sales", highlight: false },
              ].map((p, i) => (
                <div key={i} className={`rounded-3xl p-8 border ${p.highlight ? "bg-gradient-to-br from-blue-600 to-indigo-700 border-transparent shadow-2xl shadow-blue-500/30 scale-105" : "bg-white border-slate-200"} relative`}>
                  {p.highlight && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-xs font-black px-4 py-1.5 rounded-full shadow-lg">⭐ Most Popular</div>}
                  <p className={`font-black text-sm uppercase tracking-widest mb-2 ${p.highlight ? "text-blue-200" : "text-blue-600"}`}>{p.plan}</p>
                  <div className="flex items-end gap-1 mb-2">
                    <span className={`text-4xl font-black ${p.highlight ? "text-white" : "text-slate-900"}`}>{p.price}</span>
                    <span className={`text-sm font-medium mb-1 ${p.highlight ? "text-blue-200" : "text-slate-500"}`}>{p.period}</span>
                  </div>
                  <p className={`text-sm mb-8 ${p.highlight ? "text-blue-200" : "text-slate-500"}`}>{p.desc}</p>
                  <ul className="space-y-3 mb-8">
                    {p.features.map(f => (
                      <li key={f} className={`flex items-center gap-2 text-sm font-medium ${p.highlight ? "text-white" : "text-slate-700"}`}>
                        <CheckCircle2 className={`h-4 w-4 shrink-0 ${p.highlight ? "text-blue-300" : "text-emerald-500"}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/signup" className={`block text-center py-3.5 rounded-2xl font-black transition-all hover:scale-105 ${p.highlight ? "bg-white text-blue-700 hover:shadow-xl" : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"}`}>
                    {p.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section id="testimonials" className="py-24 px-6 lg:px-16 bg-white">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <p className="text-blue-600 font-black uppercase tracking-widest text-sm mb-3">Real Stories, Real Results</p>
              <h2 className="text-3xl lg:text-5xl font-black text-slate-900">Agency Owners<br />Who Made the Switch</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <div key={i} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all">
                  <div className="flex gap-1 mb-4">{[...Array(t.stars)].map((_,j) => <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>
                  <p className="text-slate-700 italic leading-relaxed mb-6">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-black">
                      {t.name.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.role} · {t.city}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section className="py-24 px-6 lg:px-16 bg-slate-900">
          <div className="container mx-auto text-center">
            <div className="inline-block text-5xl mb-6">🏙️</div>
            <h2 className="text-3xl lg:text-5xl font-black text-white mb-6">Ready to Transform<br />Your Agency?</h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">Join 500+ agencies who scaled their business with PropCRM. Start your 14-day free trial — no credit card needed.</p>
            <Link href="/signup" className="inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-xl shadow-2xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all">
              Start Free — No Card Needed <ArrowRight className="h-6 w-6" />
            </Link>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-950 pt-16 pb-8 px-6 lg:px-16 border-t border-slate-800">
        <div className="container mx-auto">
          {/* Main grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
            {/* Brand */}
            <div className="col-span-2 md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="text-white h-5 w-5" />
                </div>
                <div>
                  <span className="text-white font-black text-lg tracking-tight">PropCRM</span>
                  <span className="block text-[9px] font-bold text-blue-400 uppercase tracking-widest leading-none">by Aiclex Technologies</span>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs mb-6">
                The all-in-one CRM built for Indian real estate agencies. Manage leads, properties, site visits, and your entire team from one powerful dashboard.
              </p>
              <div className="flex gap-3">
                {[
                  { label: "WhatsApp", href: "https://wa.me/919999999999", icon: Phone },
                  { label: "Email", href: "mailto:hello@aiclex.in", icon: MessageSquare },
                ].map(s => (
                  <Link key={s.label} href={s.href} className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-blue-600 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                    <s.icon className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <p className="text-white font-black text-xs uppercase tracking-widest mb-5">Product</p>
              <ul className="space-y-3">
                {[
                  { label: "Features", href: "#features" },
                  { label: "Pricing", href: "#pricing" },
                  { label: "Changelog", href: "/changelog" },
                  { label: "Roadmap", href: "/roadmap" },
                  { label: "API Docs", href: "/docs/api" },
                  { label: "Integrations", href: "/integrations" },
                ].map(l => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-slate-400 hover:text-white text-sm transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="text-white font-black text-xs uppercase tracking-widest mb-5">Company</p>
              <ul className="space-y-3">
                {[
                  { label: "About Us", href: "/about" },
                  { label: "Blog", href: "/blog" },
                  { label: "Careers", href: "/careers" },
                  { label: "Press Kit", href: "/press" },
                  { label: "Partners", href: "/partners" },
                  { label: "Contact Us", href: "/contact" },
                ].map(l => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-slate-400 hover:text-white text-sm transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal & Support */}
            <div>
              <p className="text-white font-black text-xs uppercase tracking-widest mb-5">Legal & Support</p>
              <ul className="space-y-3">
                {[
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                  { label: "Refund Policy", href: "/refund" },
                  { label: "Help Center", href: "/help" },
                  { label: "Security", href: "/security" },
                  { label: "Status Page", href: "/status" },
                ].map(l => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-slate-400 hover:text-white text-sm transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">© 2026 <a href="https://aiclex.in" target="_blank" className="text-blue-400 hover:text-white transition-colors font-semibold">Aiclex Technologies</a>. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-400 text-xs font-bold">All systems operational</span>
            </div>
            <p className="text-slate-600 text-xs">Made with ❤️ in India 🇮🇳</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
