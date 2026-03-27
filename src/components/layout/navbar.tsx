import Link from 'next/link'
import { Building2 } from 'lucide-react'

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold tracking-tight">RealEstate<span className="text-primary">CRM</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</Link>
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">Login</Link>
            <Link 
              href="/signup" 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-all shadow-md active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
