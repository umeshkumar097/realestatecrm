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
          
          <div className="lg:col-span-7 grid grid-cols-2 lg:grid-cols-3 gap-12">
            <div>
              <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-10">Product</h4>
              <ul className="flex flex-col gap-6">
                <li><Link href="/features" className="text-slate-500 hover:text-white font-bold transition-all">Features</Link></li>
                <li><Link href="/#pricing" className="text-slate-500 hover:text-white font-bold transition-all">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-10">Company</h4>
              <ul className="flex flex-col gap-6">
                <li><Link href="/about" className="text-slate-500 hover:text-white font-bold transition-all">About Us</Link></li>
                <li><Link href="/contact" className="text-slate-500 hover:text-white font-bold transition-all">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-10">Legal</h4>
              <ul className="flex flex-col gap-6">
                <li><Link href="/privacy" className="text-slate-500 hover:text-white font-bold transition-all">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-slate-500 hover:text-white font-bold transition-all">Terms of Service</Link></li>
                <li><Link href="/refund" className="text-slate-500 hover:text-white font-bold transition-all">Refund Policy</Link></li>
                <li><Link href="/disclaimer" className="text-slate-500 hover:text-white font-bold transition-all">Disclaimer</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="pt-16 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-10">
          <p className="text-slate-600 font-bold text-sm">© 2026 PropGoCRM Global. Product by <a href="https://aiclex.in" className="text-slate-400 hover:text-blue-500">Aiclex Technologies</a>.</p>
          <div className="flex items-center gap-2 px-6 py-3 bg-slate-900/50 rounded-full border border-slate-800">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-emerald-500 font-black text-[10px] uppercase tracking-widest">Global Ingress: Operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
