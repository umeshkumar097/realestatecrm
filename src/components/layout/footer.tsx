import { Building2, Github, Twitter, Linkedin, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-secondary/50 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold tracking-tight">RealEstate<span className="text-primary">CRM</span></span>
            </div>
            <p className="mt-4 text-sm text-secondary-foreground/70 max-w-xs">
              The all-in-one solution for modern real estate agencies. Manage leads, properties, and teams with ease.
            </p>
            <div className="flex gap-4 mt-6">
              <Twitter className="h-5 w-5 text-secondary-foreground/50 hover:text-primary cursor-pointer transition-colors" />
              <Github className="h-5 w-5 text-secondary-foreground/50 hover:text-primary cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-secondary-foreground/50 hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Product</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors">API</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors">About</a></li>
              <li><a href="#" className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border flex justify-between items-center">
          <p className="text-sm text-secondary-foreground/50">
            &copy; {new Date().getFullYear()} RealEstateCRM. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
