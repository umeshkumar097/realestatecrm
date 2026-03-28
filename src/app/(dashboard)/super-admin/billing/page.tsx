"use client"
import { useState, useEffect } from "react"
import { 
  BarChart3, TrendingUp, IndianRupee,
  Users, CreditCard, ArrowUpRight,
  ArrowDownRight, CheckCircle2, Search
} from "lucide-react"

export default function BillingPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/super-admin/stats")
        if (res.ok) {
          const data = await res.json()
          setStats(data.stats)
        }
      } catch (err) {
        console.error("Failed to fetch billing stats", err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const downloadReport = () => {
    if (!stats?.recentTransactions) return
    const headers = ["ID", "Agency", "Amount", "Date", "Status"]
    const rows = stats.recentTransactions.map((t: any) => [
        t.id, t.agency, t.amount, t.date, t.status
    ].join(","))
    const csv = [headers.join(","), ...rows].join("\n")
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `billing-report-${new Date().toISOString().slice(0,10)}.csv`
    a.click()
  }

  const mrrIncrease = "+12.5%"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Revenue & Subscriptions</h1>
          <p className="text-zinc-500 text-sm">Track MRR, payment history, and global agency monetization.</p>
        </div>
        <div className="flex items-center gap-3">
            <button 
                onClick={downloadReport}
                className="bg-white border border-zinc-200 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-zinc-50 flex items-center gap-2"
            >
                Download Report
            </button>
            <button 
                onClick={() => alert("Plowback Settings: This feature allows you to configure automatic reinvestment of platform fees into lead generation. Coming soon in v2.1.")}
                className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
            >
                Plowback Settings
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-zinc-950 p-8 rounded-3xl text-white shadow-2xl shadow-zinc-950/20 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-zinc-800 rounded-full blur-3xl opacity-50 group-hover:scale-125 transition-transform duration-1000"></div>
            <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center">
                    <IndianRupee className="h-6 w-6 text-zinc-100" />
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm bg-emerald-400/10 px-2 py-0.5 rounded-full">
                    <TrendingUp className="h-3.5 w-3.5" /> {mrrIncrease}
                </div>
            </div>
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">Monthly Recurring Revenue</p>
            <h2 className="text-4xl font-black mb-2">{stats?.mrr || "₹0L"}</h2>
            <p className="text-zinc-500 text-[10px] font-bold italic">* Excludes one-time setup fees.</p>
         </div>

         <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                    <Users className="h-6 w-6" />
                </div>
                <BarChart3 className="h-5 w-5 text-zinc-200" />
            </div>
            <div className="mt-6">
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">Paying Agencies</p>
                <div className="flex items-baseline gap-2">
                    <h2 className="text-3xl font-black text-zinc-800">{stats?.totalSubscriptions || 0}</h2>
                    <span className="text-emerald-500 text-xs font-bold">+{stats?.newAgenciesThisWeek || 0} this week</span>
                </div>
            </div>
         </div>

         <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                    <CreditCard className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-1 text-red-500 font-bold text-[10px] bg-red-50 px-2 py-0.5 rounded-full">
                    Churn: {stats?.churn || "0%"}
                </div>
            </div>
            <div className="mt-6">
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">Average Customer LTV</p>
                <div className="flex items-baseline gap-2">
                    <h2 className="text-3xl font-black text-zinc-800">{stats?.ltv || "₹0"}</h2>
                    <span className="text-zinc-400 text-xs font-bold italic">Dynamic</span>
                </div>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-zinc-100 flex items-center justify-between">
            <h2 className="font-black text-zinc-800">Recent Transactions</h2>
            <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-zinc-400 mr-2" />
                <button className="text-xs font-bold text-zinc-500 uppercase tracking-widest hover:text-zinc-900 transition-colors">View All History</button>
            </div>
        </div>
        
        {stats?.recentTransactions?.length > 0 ? (
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-zinc-50/50 border-b border-zinc-100">
                            <th className="px-8 py-4 text-[10px] font-black uppercase text-zinc-500 tracking-widest">Transaction ID</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase text-zinc-500 tracking-widest">Agency</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase text-zinc-500 tracking-widest">Amount</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase text-zinc-500 tracking-widest">Date</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase text-zinc-500 tracking-widest">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {stats.recentTransactions.map((t: any) => (
                            <tr key={t.id} className="hover:bg-zinc-50/80 transition-colors group">
                                <td className="px-8 py-4 text-xs font-bold text-zinc-400 uppercase tracking-tighter">{t.id.slice(-12)}</td>
                                <td className="px-8 py-4 text-sm font-black text-zinc-800">{t.agency}</td>
                                <td className="px-8 py-4 text-sm font-black text-zinc-800">₹{t.amount.toLocaleString()}</td>
                                <td className="px-8 py-4 text-xs font-bold text-zinc-500">{new Date(t.date).toLocaleDateString()}</td>
                                <td className="px-8 py-4">
                                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 uppercase">
                                        {t.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <div className="p-16 text-center bg-zinc-50/50">
                <div className="w-16 h-16 bg-white border border-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <TrendingUp className="h-8 w-8 text-zinc-200" />
                </div>
                <p className="text-zinc-500 font-bold">Transaction history aggregation in progress...</p>
                <p className="text-zinc-400 text-xs mt-1">Connect your Stripe / Razorpay webhooks to see live payments.</p>
            </div>
        )}
      </div>
    </div>
  )
}
