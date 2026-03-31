import { Home, ArrowUpRight } from "lucide-react"

export default function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
    return (
        <div className={`flex items-center gap-3 group ${className}`}>
            <div className="relative w-10 h-10">
                {/* House Icon */}
                <div className={`absolute inset-0 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 duration-300 ${light ? 'bg-white text-blue-700' : 'bg-gradient-to-tr from-blue-700 to-blue-500 text-white'}`}>
                    <Home size={22} className="stroke-[2.5]" />
                </div>
                {/* Rising green arrow overlay */}
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-lg flex items-center justify-center shadow-md animate-pulse">
                    <ArrowUpRight size={14} className="text-white stroke-[3]" />
                </div>
            </div>
            
            <div className="flex flex-col">
                <span className={`text-2xl font-black tracking-tight leading-none italic ${light ? 'text-white' : 'text-foreground'}`}>
                    PropGo<span className="text-accent">CRM</span>
                </span>
                <span className={`text-[8px] font-black uppercase tracking-[0.2em] mt-1 ${light ? 'text-white/60' : 'text-zinc-400'}`}>
                    BY AICLEX <span className="text-blue-500">TECHNOLOGIES</span>
                </span>
            </div>
        </div>
    )
}
