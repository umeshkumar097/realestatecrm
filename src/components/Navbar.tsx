"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, ArrowRight } from "lucide-react"
import Logo from "./Logo"
import LeadModal from "./LeadModal"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/#pricing" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-700 ${isScrolled ? "bg-white/70 backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] border-b border-white/20 py-4" : "bg-transparent py-8"}`}>
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
          <Link href="/" className="hover:scale-105 transition-transform active:scale-95">
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 hover:text-blue-600 transition-all relative group">
                {link.name}
                <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-blue-600 transition-all">Login</Link>
            <button 
              onClick={() => setIsLeadModalOpen(true)}
              className="group px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/20 hover:bg-blue-600 hover:scale-105 transition-all active:scale-95 flex items-center gap-3"
            >
              Consult Demo <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <button className="md:hidden p-2 text-slate-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`fixed inset-0 bg-white z-[60] p-6 transition-transform duration-500 md:hidden ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex justify-between items-center mb-12">
            <Logo />
            <X className="h-8 w-8 text-slate-400" onClick={() => setMobileMenuOpen(false)} />
          </div>
          <div className="flex flex-col gap-8 text-2xl font-black text-slate-900">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)}>{link.name}</Link>
            ))}
          </div>
          <div className="mt-20 flex flex-col gap-4">
            <Link href="/login" className="text-center py-5 font-black text-slate-600">Login</Link>
            <button 
              onClick={() => { setMobileMenuOpen(false); setIsLeadModalOpen(true); }}
              className="text-center py-5 bg-blue-600 text-white rounded-2xl font-black"
            >
              Book Demo
            </button>
          </div>
        </div>
      </header>
      
      <LeadModal 
        isOpen={isLeadModalOpen} 
        onClose={() => setIsLeadModalOpen(false)} 
        plan="Demo Request" 
      />
    </>
  )
}
