import { Home, ArrowUpRight } from "lucide-react"

export default function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
    return (
        <div className={`flex items-center gap-3.5 group ${className}`}>
            <div className="relative w-11 h-11 shrink-0">
                {/* House Icon with Gradient */}
                <div className={`absolute inset-0 rounded-xl flex items-center justify-center shadow-xl transition-all group-hover:scale-105 duration-500 overflow-hidden ${light ? 'bg-white text-blue-600' : 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white'}`}>
                    <Home size={24} className="stroke-[2.5] relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20" />
                </div>
                {/* Rising green arrow overlay - Matches user image */}
                <div className="absolute -top-1.5 -right-1.5 w-7 h-7 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg animate-pulse ring-2 ring-white/50">
                    <ArrowUpRight size={16} className="text-white stroke-[3.5]" />
                </div>
            </div>
            
            <div className="flex flex-col justify-center">
                <div className="flex items-baseline">
                    <span className={`text-2xl font-normal tracking-tight leading-none ${light ? 'text-white' : 'text-slate-900'}`}>
                        PropGo
                    </span>
                    <span className="text-2xl font-black tracking-tight leading-none text-emerald-500 ml-0.5">
                        CRM
                    </span>
                </div>
                <span className={`text-[7.5px] font-black uppercase tracking-[0.35em] mt-1.5 opacity-80 whitespace-nowrap ${light ? 'text-white/60' : 'text-slate-400'}`}>
                    BY AICLEX <span className={light ? 'text-white' : 'text-blue-600'}>TECHNOLOGIES</span>
                </span>
            </div>
        </div>
    )
}
