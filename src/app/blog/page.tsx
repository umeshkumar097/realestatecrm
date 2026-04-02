import InnerPageLayout from "@/components/inner-page-layout"
import Link from "next/link"
import { Calendar, User, ArrowRight } from "lucide-react"

export default function BlogPage() {
  const posts = [
    { title: "How WhatsApp Integration is changing Real Estate", date: "Mar 24, 2026", author: "Aiclex Team", excerpt: "Stop losing leads to slow response times. Learn how automation can double your site visits..." },
    { title: "5 Tips for Managing a remote Sales Team", date: "Mar 20, 2026", author: "Rajesh Mehta", excerpt: "Real-time visibility is the key to managing agents across multiple locations effectively..." },
    { title: "The Future of PropTech in India", date: "Mar 15, 2026", author: "Founder @ Aiclex", excerpt: "AI-driven lead scoring and automated document management are no longer luxuries..." },
  ]

  return (
    <InnerPageLayout 
      badge="Resources"
      title="Master Matrix Registry Blog"
      subtitle="Insights, updates, and tips for the modern real estate agency."
    >
      <div className="space-y-8">
        {posts.map((p, i) => (
          <div key={i} className="group p-8 border border-slate-200 rounded-3xl hover:bg-slate-50 transition-all">
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
              <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {p.date}</span>
              <span className="flex items-center gap-1.5"><User className="h-3 w-3" /> {p.author}</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{p.title}</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">{p.excerpt}</p>
            <Link href="#" className="inline-flex items-center gap-2 text-sm font-black text-blue-600 hover:underline">
              Read Entire Article <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ))}

        <div className="pt-8 text-center text-slate-400">
          <p className="text-sm">Stay tuned for more updates!</p>
        </div>
      </div>
    </InnerPageLayout>
  )
}
