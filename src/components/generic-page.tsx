import InnerPageLayout from "@/components/inner-page-layout"

export default function GenericPage({ title, badge, content }: { title: string, badge: string, content: string }) {
  return (
    <InnerPageLayout badge={badge} title={title}>
      <div className="space-y-6 text-slate-600">
        <p className="leading-relaxed">{content}</p>
        <div className="p-12 bg-slate-50 border border-slate-100 rounded-3xl text-center">
            <p className="text-sm font-black text-slate-400">Page under construction — Master Real Estate Matrix is architecting...</p>
        </div>
      </div>
    </InnerPageLayout>
  )
}
