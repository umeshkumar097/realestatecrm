"use client"
import { useSession } from "next-auth/react"

export default function DebugPage() {
  const { data: session, status } = useSession()

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Session Debug</h1>
      <pre className="p-4 bg-slate-100 rounded-lg overflow-auto">
        {JSON.stringify({ status, session }, null, 2)}
      </pre>
    </div>
  )
}
