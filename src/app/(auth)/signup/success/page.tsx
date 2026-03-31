"use client"

import { Suspense } from "react"
import { CheckCircle2, LayoutDashboard, Mail, Loader2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

function SignupSuccessContent() {
    const searchParams = useSearchParams()
    
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 p-6">
            <div className="w-full max-w-lg bg-white rounded-[40px] shadow-2xl border border-zinc-200 p-12 text-center animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/10">
                    <CheckCircle2 className="h-10 w-10" />
                </div>

                <h1 className="text-4xl font-black italic tracking-tighter mb-4">Activation Initiated!</h1>
                <p className="text-zinc-500 font-medium mb-10 leading-relaxed">
                  Great choice! Your 3-day trial is being provisioned. 
                  <span className="block mt-4 p-4 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100 font-bold italic">
                    Check your email and use the <span className="underline">6-digit verification code</span> to activate your agency dashboard.
                  </span>
                </p>

                <div className="space-y-4">
                    <Link href="/verify-email" className="w-full py-5 bg-primary text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-sm">
                        Verify Your Email Now <Mail className="h-4 w-4" />
                    </Link>
                    
                    <Link href="/login" className="flex items-center gap-2 justify-center text-xs font-black text-zinc-400 uppercase tracking-widest pt-4 hover:text-zinc-600">
                        Skip for now, go to Login
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default function SignupSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-zinc-50">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        }>
            <SignupSuccessContent />
        </Suspense>
    )
}
