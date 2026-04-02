"use client"
import { useState, useEffect } from "react"
import { 
  Key, Copy, RefreshCw, 
  ShieldCheck, AlertCircle, 
  Terminal, Code, Zap,
  Loader2, Eye, EyeOff
} from "lucide-react"
import Link from "next/link"

export default function DeveloperApiPage() {
    const [apiKey, setApiKey] = useState<string | null>(null)
    const [usage, setUsage] = useState(0)
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [showKey, setShowKey] = useState(false)
    const [copied, setCopied] = useState(false)

    const fetchApiKey = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/developer/api-key")
            const data = await res.json()
            setApiKey(data.apiKey)
            setUsage(data.usage || 0)
        } catch (e) {
            console.error("Failed to fetch API key")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchApiKey()
    }, [])

    const handleGenerate = async () => {
        if (apiKey && !confirm("Rotating your API Key will immediately invalidate the current one. Continue?")) return
        
        setGenerating(true)
        try {
            const res = await fetch("/api/developer/api-key", { method: "POST" })
            const data = await res.json()
            if (data.apiKey) {
                setApiKey(data.apiKey)
                setShowKey(true)
            }
        } catch (e) {
            alert("Rotation failed")
        } finally {
            setGenerating(false)
        }
    }

    const handleCopy = () => {
        if (!apiKey) return
        navigator.clipboard.writeText(apiKey)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const freeLimit = 100
    const usagePercent = Math.min((usage / freeLimit) * 100, 100)

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest leading-none">Establishing Secure Handshake...</p>
        </div>
    )

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            {/* Header Cluster */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-zinc-100 dark:border-zinc-800">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">API & Authentication</h1>
                    <p className="text-zinc-500 font-medium tracking-tight">Engineer programmatic integrations for your real estate ecosystem.</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400">System Live</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Integration Command Center */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[40px] p-10 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
                        
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-zinc-900 text-white rounded-2xl shadow-xl shadow-zinc-900/10"><Key size={24}/></div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Main Productivity Key</h2>
                                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-wide">Production Level Key</p>
                                </div>
                            </div>
                            <button 
                                onClick={handleGenerate}
                                disabled={generating}
                                className="flex items-center gap-2 px-6 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 hover:bg-primary hover:text-white hover:border-primary transition-all"
                            >
                                {generating ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                                {apiKey ? "Rotate Key" : "Generate Key"}
                            </button>
                        </div>

                        {apiKey ? (
                            <div className="space-y-6">
                                <div className="relative group/key">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-2xl blur opacity-0 group-hover/key:opacity-100 transition duration-700" />
                                    <div className="relative flex items-center gap-3 bg-zinc-50 dark:bg-zinc-950 px-6 py-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden font-mono text-sm">
                                        <Code size={16} className="text-zinc-400 shrink-0" />
                                        <div className="flex-1 truncate tracking-tighter">
                                            {showKey ? apiKey : apiKey.replace(/./g, "•").slice(0, 48)}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => setShowKey(!showKey)}
                                                className="p-2 text-zinc-400 hover:text-primary transition-colors"
                                            >
                                                {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                            <button 
                                                onClick={handleCopy}
                                                className={`flex items-center gap-2 px-4 py-2+ rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${copied ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-white border border-zinc-200 dark:border-zinc-700 hover:border-primary hover:text-primary"}`}
                                            >
                                                <Copy size={14} />
                                                {copied ? "Copied!" : "Copy"}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-2xl flex items-start gap-3">
                                    <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={16} />
                                    <p className="text-xs text-amber-800 dark:text-amber-400 font-medium leading-relaxed italic">
                                        <strong>Caution:</strong> This key grants full programmatic access to your leads and agency data. Never share it or expose it in client-side code.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 gap-6 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-3xl">
                                <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-full"><ShieldCheck size={32} className="text-zinc-200" /></div>
                                <div className="text-center space-y-1">
                                    <h3 className="font-black text-slate-800 dark:text-zinc-200">No Key Issued</h3>
                                    <p className="text-xs text-zinc-400 font-medium">Provision your first API key to begin building.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Documentation Shortcut */}
                    <div className="bg-zinc-950 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group border border-white/5">
                        <Terminal size={48} className="absolute -right-4 -bottom-4 text-white/5 group-hover:scale-110 transition-transform duration-700" />
                        <div className="relative z-10 space-y-6">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-black tracking-tight">API Documentation</h2>
                                <p className="text-zinc-400 font-medium text-sm">Explore our REST endpoints for lead ingestion, status polling, and report generation.</p>
                            </div>
                            <button className="flex items-center gap-2 group/btn">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary group-hover/btn:underline">View SDK Guides</span>
                                <Terminal size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Metrics / Tier Col */}
                <div className="space-y-8">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[40px] p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Pricing Plan</span>
                            <div className="p-2 bg-primary/10 text-primary rounded-lg font-black text-[10px]">FREE</div>
                        </div>
                        
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-black text-slate-800 dark:text-white leading-none">Usage Quota</p>
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase">Monthly API Handshakes</p>
                                    </div>
                                    <span className="text-xs font-black text-slate-900 dark:text-white">{usage} / {freeLimit}</span>
                                </div>
                                <div className="relative w-full h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <div 
                                        className="absolute inset-y-0 left-0 bg-primary transition-all duration-1000 ease-out rounded-full shadow-lg shadow-primary/20"
                                        style={{ width: `${usagePercent}%` }}
                                    />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
                                <div className="flex items-center gap-3">
                                    <Zap size={14} className="text-emerald-500" />
                                    <span className="text-xs font-bold text-slate-600 dark:text-zinc-400 underline decoration-dotted underline-offset-4">Webhook Events: Unlimited</span>
                                </div>
                                <p className="text-[10px] font-medium text-zinc-500 leading-relaxed italic pr-4">
                                    Your 100 API request limit resets on the 1st of every month. For higher concurrency or custom endpoints, upgrade to PropGo Enterprise.
                                </p>
                                <button className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                                    Upgrade Tier
                                </button>
                            </div>
                        </div>
                    </div>

                    <p className="text-center px-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 leading-relaxed">
                        Developer suite v1.0.4<br/>
                        Master Matrix Global Registry
                    </p>
                </div>
            </div>
        </div>
    )
}
