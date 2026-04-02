"use client"

import Link from "next/link"
import { Building2, MessageSquare, Phone, Globe, Shield } from "lucide-react"
import Logo from "./Logo"

export default function Footer() {
  return (
    <footer className="bg-[#020617] border-t border-slate-900 pt-32 pb-16 px-6 lg:px-12 relative overflow-hidden">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-32">
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3 group mb-10">
              <Logo light />
            </Link>
            <p className="text-xl text-slate-500 leading-relaxed max-w-md font-medium mb-12">
              Scale faster, close more, and dominate your real estate market with the world's most advanced CRM platform.
            </p>
            <div className="flex gap-4">
              {[MessageSquare, Phone, Globe, Shield].map((Icon, i) => (
                <div key={i} className="w-14 h-14 bg-slate-900 rounded-3xl border border-slate-800 flex items-center justify-center text-slate-500 hover:text-white hover:bg-blue-600 transition-all cursor-pointer">
                  <Icon size={24}/>
                </div>
              ))}
            </div>
          </div>
          
            <div className="lg:col-span-7 grid grid-cols-2 lg:grid-cols-3 gap-16">
            <div>
              <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em] mb-12 italic opacity-60">Architect</h4>
              <ul className="flex flex-col gap-6">
                <li><Link href="/features" className="text-slate-500 hover:text-blue-500 font-bold text-sm tracking-tight transition-all">Feature Dashboard</Link></li>
                <li><Link href="/#pricing" className="text-slate-500 hover:text-blue-500 font-bold text-sm tracking-tight transition-all">Global Pricing</Link></li>
                <li><Link href="/about" className="text-slate-500 hover:text-blue-500 font-bold text-sm tracking-tight transition-all">Our Vision</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em] mb-12 italic opacity-60">Governance</h4>
              <ul className="flex flex-col gap-6">
                <li><Link href="/privacy" className="text-slate-500 hover:text-white font-bold text-sm tracking-tight transition-all">Data Residency</Link></li>
                <li><Link href="/terms" className="text-slate-500 hover:text-white font-bold text-sm tracking-tight transition-all">Service Level Agreement</Link></li>
                <li><Link href="/security" className="text-slate-500 hover:text-white font-bold text-sm tracking-tight transition-all">GDPR & ISO Compliance</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em] mb-12 italic opacity-60">Control</h4>
              <ul className="flex flex-col gap-6">
                <li><Link href="/contact" className="text-slate-500 hover:text-white font-bold text-sm tracking-tight transition-all">Enterprise Support</Link></li>
                <li><Link href="/login" className="text-slate-500 hover:text-white font-bold text-sm tracking-tight transition-all">Global Node Login</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="pt-20 border-t border-white/5 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex flex-col gap-2 text-center lg:text-left">
          <div className="space-y-1">
            <p className="text-slate-600 font-black text-[10px] uppercase tracking-[0.2em] italic">© 2026 Master Real Estate Matrix Global HQ. A product by <a href="https://aiclex.in" className="text-slate-400 hover:text-blue-600 transition-colors">Aiclex Labs</a>.</p>
            <p className="text-slate-800 font-bold text-[8px] uppercase tracking-widest leading-none italic">Enterprise Real-Estate Deployment Node: V2.1.0-STABLE</p>
          </div>
            <p className="text-slate-800 font-bold text-[9px] uppercase tracking-widest leading-none">Enterprise Real-Estate Deployment Node: V2.1.0-STABLE</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-full border border-white/10 shadow-2xl">
               <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" />
               <span className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.3em]">Calyx Sync: Online</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-full border border-white/10 opacity-40">
               <Shield size={12} className="text-slate-400" />
               <span className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">AES-256 SSL Protocol</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
