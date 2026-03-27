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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 py-4 px-6 lg:px-16">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <Building2 className="text-white h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900">PropCRM</span>
              <span className="block text-[8px] font-bold text-blue-500 uppercase tracking-widest leading-none">by Aiclex Technologies</span>
            </div>
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-b from-slate-50 to-white py-16 px-6 lg:px-16 border-b border-slate-100">
        <div className="container mx-auto max-w-3xl">
          {badge && (
            <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest rounded-full border border-blue-100 mb-5">
              {badge}
            </span>
          )}
          <h1 className="text-3xl lg:text-5xl font-black text-slate-900 mb-4">{title}</h1>
          {subtitle && <p className="text-lg text-slate-500 leading-relaxed">{subtitle}</p>}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 py-16 px-6 lg:px-16">
        <div className="container mx-auto max-w-3xl">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 py-8 px-6 lg:px-16 border-t border-slate-800">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">© 2026 <a href="https://aiclex.in" target="_blank" className="text-blue-400 hover:text-white transition-colors font-semibold">Aiclex Technologies</a>. All rights reserved.</p>
          <div className="flex gap-6">
            {[
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Contact", href: "/contact" },
            ].map(l => (
              <Link key={l.label} href={l.href} className="text-slate-500 hover:text-white text-sm transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
