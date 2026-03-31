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
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-100 py-3" : "bg-transparent py-6"}`}>
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors relative group">
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Login</Link>
            <button 
              onClick={() => setIsLeadModalOpen(true)}
              className="group px-7 py-3 bg-slate-900 text-white rounded-2xl text-sm font-black shadow-xl shadow-slate-900/10 hover:bg-blue-600 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center gap-2"
            >
              Book Demo <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
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
