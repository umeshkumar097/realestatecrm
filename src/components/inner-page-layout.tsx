"use client"
import Link from "next/link"
import { Building2, ArrowLeft } from "lucide-react"

interface InnerPageProps {
  title: string
  subtitle?: string
  badge?: string
  children: React.ReactNode
}

export default function InnerPageLayout({ title, subtitle, badge, children }: InnerPageProps) {
  return (
    <div className="min-h-screen bg-zinc-50/50 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-3xl border-b border-white py-6 px-6 lg:px-16 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-11 h-11 bg-slate-900 rounded-[14px] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
              <Building2 className="text-white h-6 w-6 italic" />
            </div>
            <div className="space-y-0.5">
              <span className="text-xl font-black tracking-tighter text-slate-900 leading-none italic uppercase">Master Real Estate Matrix</span>
              <span className="block text-[8px] font-black text-blue-600 uppercase tracking-[0.4em] leading-none italic">Architectural Governance</span>
            </div>
          </Link>
          <Link href="/" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-blue-600 transition-all italic">
            <ArrowLeft className="h-4 w-4" /> Back to Matrix Home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-white py-24 px-6 lg:px-16 border-b border-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-40 -mr-16 -mt-16 bg-blue-600/5 rounded-full blur-[80px] -z-10" />
        <div className="container mx-auto max-w-4xl relative z-10 space-y-6">
          {badge && (
            <span className="inline-flex items-center px-8 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-full italic shadow-2xl">
              {badge}
            </span>
          )}
          <h1 className="text-4xl lg:text-7xl font-black tracking-tighter text-zinc-900 italic balance leading-[0.85]">{title}</h1>
          {subtitle && (
             <div className="space-y-4">
               <p className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 italic">Operational Documentation Node</p>
               <p className="text-xl md:text-2xl text-slate-500 italic font-black leading-relaxed max-w-3xl border-l-4 border-blue-600/10 pl-8">{subtitle}</p>
             </div>
          )}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 py-20 px-6 lg:px-16 container mx-auto max-w-4xl">
          <div className="relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none -z-10" />
              {children}
          </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 px-6 lg:px-16 border-t border-slate-800">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-1">
             <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] italic">© 2026 Master Real Estate Matrix Global HQ. A product by <a href="https://aiclex.in" className="text-slate-400 hover:text-blue-600">Aiclex Labs</a>.</p>
             <p className="text-slate-700 font-bold text-[8px] uppercase tracking-widest leading-none italic">Enterprise Real-Estate Deployment Node: V2.1.0-STABLE</p>
          </div>
          <div className="flex gap-10">
            {[
              { label: "Data Residency", href: "/privacy" },
              { label: "Governance", href: "/terms" },
              { label: "Strategic Ingress", href: "/contact" },
            ].map(l => (
              <Link key={l.label} href={l.href} className="text-slate-500 hover:text-white text-[10px] uppercase font-black tracking-[0.3em] transition-all italic">{l.label}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
