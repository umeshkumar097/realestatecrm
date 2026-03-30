"use client"

import { CheckCircle2, ChevronRight, LayoutDashboard, Mail } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

export default function SignupSuccessPage() {
    const searchParams = useSearchParams()
    const [email, setEmail] = useState("")

    useEffect(() => {
        // Stripe usually passes some metadata or we can fetch it if needed.
        // For simplicity, we assume the session is handled by the webhook.
    }, [searchParams])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 p-6">
            <div className="w-full max-w-lg bg-white rounded-[40px] shadow-2xl border border-zinc-200 p-12 text-center animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/10">
                    <CheckCircle2 className="h-10 w-10" />
                </div>

                <h1 className="text-4xl font-black italic tracking-tighter mb-4">Activation Initiated</h1>
                <p className="text-zinc-500 font-medium mb-10 leading-relaxed">
                    Great choice! Your 3-day trial is being provisioned as we speak. 
                    <span className="block mt-2 font-bold text-zinc-900 italic">Check your email for a welcome link once your dashboard is ready (usually &lt; 60 seconds).</span>
                </p>

                <div className="space-y-4">
                    <Link href="/login" className="w-full py-5 bg-primary text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-sm">
                        Go to Your Dashboard <LayoutDashboard className="h-4 w-4" />
                    </Link>
                    
                    <div className="flex items-center gap-2 justify-center text-xs font-bold text-zinc-400 uppercase tracking-widest pt-4">
                        <Mail className="h-3 w-3" /> Still waiting? Check your spam folder
                    </div>
                </div>
            </div>
        </div>
    )
}
