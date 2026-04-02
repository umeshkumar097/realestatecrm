"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  LogOut,
  Plus,
  BarChart3,
  MessageSquare,
  CreditCard,
  ListTodo,
  ShieldAlert,
  ShieldCheck,
  Activity,
  Code,
  Zap,
  BookOpen,
  Home
} from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Clients', href: '/leads', icon: Users },
  { name: 'WhatsApp Chat', href: '/dashboard/chat', icon: MessageSquare },
  { name: 'EMIs', href: '/dashboard/emis', icon: CreditCard },
  { name: 'Tasks', href: '/dashboard/tasks', icon: ListTodo },
  { name: 'Support', href: '/dashboard/tickets', icon: ShieldAlert },
  { name: 'Staff', href: '/dashboard/staff', icon: ShieldCheck, adminOnly: true },
  { name: 'Projects', href: '/dashboard/projects', icon: Building2 },
  { name: 'Inventory Units', href: '/properties', icon: Home },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard, adminOnly: true },
  { name: 'Reports', href: '/dashboard/reports', icon: BarChart3, adminOnly: true },
  { name: 'Master Overview', href: '/super-admin', icon: ShieldCheck, superAdminOnly: true },
  { name: 'Agencies', href: '/super-admin/agencies', icon: Building2, superAdminOnly: true },
  { name: 'WhatsApp Hub', href: '/super-admin/whatsapp', icon: MessageSquare, superAdminOnly: true },
  { name: 'Billing/MRR', href: '/super-admin/billing', icon: CreditCard, superAdminOnly: true },
  { name: 'Sales Inquiries', href: '/super-admin/leads', icon: Users, superAdminOnly: true },
  { name: 'Active Users', href: '/super-admin/users', icon: Users, superAdminOnly: true },
  { name: 'Master Settings', href: '/super-admin/settings', icon: ShieldAlert, superAdminOnly: true },
  { name: 'System Logs', href: '/super-admin/logs', icon: Activity, superAdminOnly: true },
]

interface DashboardClientLayoutProps {
  children: React.ReactNode;
  agency: {
    name: string;
    logo: string | null;
  } | null;
}

export default function DashboardClientLayout({
  children,
  agency
}: DashboardClientLayoutProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleQuickAdd = () => {
    const userRole = (session?.user as any)?.role
    if (userRole === 'SUPER_ADMIN') {
        window.location.href = '/super-admin/agencies?add=true'
    } else {
        window.location.href = '/leads?add=true'
    }
  }

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <div className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center overflow-hidden">
            {agency?.logo ? (
              <img src={agency.logo} alt={agency.name} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="text-white h-5 w-5" />
            )}
          </div>
          <span className="font-bold text-lg tracking-tight">
            {agency?.name || "RealEstateCRM"}
          </span>
        </div>

        <div className="flex-1 py-10 px-6 space-y-1.5 overflow-y-auto">
          {navigation.map((item: any) => {
            const userRole = (session?.user as any)?.role
            
            // Separation: SuperAdmin sees only their tools, others see Agency tools
            if (userRole === 'SUPER_ADMIN') {
              if (!item.superAdminOnly) return null
            } else {
              if (item.superAdminOnly) return null
              if (item.adminOnly && userRole !== 'ADMIN') return null
            }
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-[14px] text-[10px] font-black uppercase tracking-[0.2em] transition-all group",
                  isActive 
                    ? "bg-slate-900 text-white shadow-[0_12px_24px_rgba(0,0,0,0.1)] border border-white/10" 
                    : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900"
                )}
              >
                <item.icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", isActive ? "text-blue-500" : "text-zinc-400 group-hover:text-zinc-600")} />
                {item.name}
              </Link>
            )
          })}
        </div>

        {/* Developer Section */}
        {((session?.user as any)?.role === 'ADMIN' || (session?.user as any)?.role === 'AGENCY_OWNER') && (
          <div className="px-6 py-4 mt-auto border-t border-zinc-100 dark:border-zinc-800">
            <p className="px-4 mb-4 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 italic">Core Architect Suite</p>
            <div className="space-y-1.5">
              <Link
                href="/dashboard/developer/api"
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-[12px] text-[9px] font-black uppercase tracking-[0.2em] transition-all group",
                  pathname === '/dashboard/developer/api' 
                    ? "bg-zinc-900 text-blue-500 shadow-xl" 
                    : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900"
                )}
              >
                <Code className={cn("h-3.5 w-3.5", pathname === '/dashboard/developer/api' ? "text-blue-500" : "text-zinc-400")} />
                API Infrastructure
              </Link>
              <Link
                href="/dashboard/developer/webhooks"
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-[12px] text-[9px] font-black uppercase tracking-[0.2em] transition-all group",
                  pathname === '/dashboard/developer/webhooks' 
                    ? "bg-zinc-900 text-blue-500 shadow-xl" 
                    : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900"
                )}
              >
                <Zap className={cn("h-3.5 w-3.5", pathname === '/dashboard/developer/webhooks' ? "text-blue-500" : "text-zinc-400")} />
                Live Webhooks
              </Link>
            </div>
          </div>
        )}

        <div className="p-6 border-t border-zinc-100 dark:border-zinc-800">
          <button
            onClick={async () => {
              // Force logout fallback if signOut hangs after 2s
              const timeout = setTimeout(() => {
                window.location.href = "/login"
              }, 2000)
              
              await signOut({ redirect: true, callbackUrl: "/" })
              clearTimeout(timeout)
            }}
            className="flex w-full items-center gap-4 px-4 py-3 rounded-[14px] text-[10px] font-black uppercase tracking-[0.2em] text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all border border-transparent hover:border-red-100"
          >
            <LogOut className="h-4 w-4" />
            Logout Engine
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-10 flex items-center justify-between shadow-sm relative z-10">
          <div className="flex items-center gap-8">
            <div className="text-right hidden xl:block border-r border-zinc-100 pr-8">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] leading-none mb-1.5">
                    {time.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
                <p className="text-sm font-black text-zinc-800 tabular-nums tracking-tight">
                    {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                </p>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-5 py-2.5 bg-emerald-500/5 border border-emerald-500/10 rounded-full shadow-sm">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" />
                   <span className="text-emerald-600 font-black text-[9px] uppercase tracking-[0.3em] italic">Calyx Sync: Live</span>
                </div>
                <button 
                    onClick={handleQuickAdd}
                    className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 hover:bg-blue-600 active:scale-95 transition-all"
                >
                    <Plus className="h-3.5 w-3.5" />
                    Rapid Deployment
                </button>
            </div>
          </div>

          <div className="flex items-center gap-5">
              <div className="text-right hidden sm:block">
                  <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{session?.user?.name || "Member"}</p>
                  <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-[0.3em] leading-tight">{(session?.user as any)?.role || "Agent"}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10 flex items-center justify-center font-black text-white shadow-xl">
                  {session?.user?.name?.charAt(0) || "U"}
              </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-zinc-50 dark:bg-zinc-950">
          {children}
        </main>
      </div>
    </div>
  )
}
