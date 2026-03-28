"use client"

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
  ShieldCheck
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
  { name: 'Properties', href: '/properties', icon: Building2 },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard, adminOnly: true },
  { name: 'Reports', href: '/dashboard/reports', icon: BarChart3, adminOnly: true },
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

        <div className="flex-1 py-6 px-4 space-y-1">
          {navigation.map((item) => {
            const userRole = (session?.user as any)?.role
            if (item.adminOnly && userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') return null
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                  isActive 
                    ? "bg-primary text-white shadow-md shadow-primary/10" 
                    : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-600")} />
                {item.name}
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-8 flex items-center justify-between">
          <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
            {pathname.split('/')[1] || 'Overview'}
          </h2>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-md shadow-primary/10 hover:opacity-90 active:scale-95 transition-all">
                <Plus className="h-4 w-4" />
                Quick Add
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-zinc-200 dark:border-zinc-800">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold">{session?.user?.name || "Member"}</p>
                    <p className="text-xs text-zinc-500 uppercase font-black tracking-widest">{(session?.user as any)?.role || "Agent"}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-600">
                    {session?.user?.name?.charAt(0) || "U"}
                </div>
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
