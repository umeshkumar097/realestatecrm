import { Loader2, ShieldAlert, CreditCard } from "lucide-react"
import Link from "next/link"

export default function PortalInactivePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-10 text-center space-y-6">
        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert className="h-10 w-10 text-red-600 dark:text-red-400" />
        </div>
        
        <div className="space-y-2">
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white">Portal Inactive</h1>
            <p className="text-zinc-500 text-sm">
                This agency portal has been suspended because the subscription plan is no longer active.
            </p>
        </div>

        <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Notice</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">Please contact the agency owner to reactivate the account.</p>
        </div>

        <Link 
            href="/dashboard/billing" 
            className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
        >
            <CreditCard className="h-4 w-4" />
            Reactivate Plan
        </Link>
        
        <p className="text-[10px] text-zinc-400 uppercase font-black tracking-widest italic pt-4"> Enterprise White-label Protection Active</p>
      </div>
    </div>
  )
}
