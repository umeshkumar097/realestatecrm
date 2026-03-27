"use client"
import { useState, useEffect } from "react"
import { 
  CheckCircle2, Clock, AlertCircle, 
  Plus, Calendar, User, ListTodo,
  MoreVertical, Check, Trash2, Loader2
} from "lucide-react"

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ title: "", description: "", status: "TODAY", dueDate: "" })

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      const res = await fetch("/api/tasks")
      setTasks(await res.json())
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setIsModalOpen(false)
        setFormData({ title: "", description: "", status: "TODAY", dueDate: "" })
        loadTasks()
      }
    } catch (err) {
      alert("Failed to create task")
    }
  }

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status })
    })
    loadTasks()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Daily Tasks</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage your team's workflow and daily targets.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-extrabold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" /> Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {["TODAY", "PENDING", "COMPLETE"].map(status => (
          <div key={status} className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                {status === "TODAY" && <Clock className="h-4 w-4 text-blue-500" />}
                {status === "PENDING" && <AlertCircle className="h-4 w-4 text-amber-500" />}
                {status === "COMPLETE" && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                {status} TASKS
              </h2>
              <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                {tasks.filter(t => t.status === status).length}
              </span>
            </div>

            <div className="space-y-3">
              {tasks.filter(t => t.status === status).map(task => (
                <div key={task.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm group hover:border-primary/20 transition-all">
                  <div className="flex justify-between items-start gap-3">
                    <h3 className={`text-sm font-bold text-slate-800 leading-tight ${status === 'COMPLETE' ? 'line-through opacity-50' : ''}`}>{task.title}</h3>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {status !== 'COMPLETE' && (
                        <button onClick={() => updateStatus(task.id, 'COMPLETE')} className="p-1 hover:text-emerald-500"><Check className="h-4 w-4" /></button>
                      )}
                      {status === 'COMPLETE' && (
                        <button onClick={() => updateStatus(task.id, 'PENDING')} className="p-1 hover:text-amber-500"><Clock className="h-4 w-4" /></button>
                      )}
                    </div>
                  </div>
                  {task.description && <p className="text-[11px] text-slate-500 mt-2 line-clamp-2">{task.description}</p>}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-black">
                        {task.assignedTo?.name?.charAt(0) || "U"}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">{task.assignedTo?.name || "Agent"}</span>
                    </div>
                    {task.dueDate && (
                      <span className="text-[9px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-lg flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {tasks.filter(t => t.status === status).length === 0 && (
                <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-2xl text-slate-300">
                  <p className="text-[10px] font-bold">No {status.toLowerCase()} tasks</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-slate-100">
            <h2 className="text-xl font-black text-slate-900 mb-6">Create New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <input 
                type="text" placeholder="Task Title" required 
                className="w-full px-4 py-3 rounded-xl border border-slate-200"
                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
              />
              <textarea 
                placeholder="Description"
                className="w-full px-4 py-3 rounded-xl border border-slate-200"
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white"
                  value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                >
                  <option value="TODAY">Today</option>
                  <option value="PENDING">Pending</option>
                  <option value="COMPLETE">Complete</option>
                </select>
                <input 
                  type="date"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm"
                  value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-500">Cancel</button>
                <button type="submit" className="flex-2 px-8 py-3 bg-primary text-white rounded-xl font-black shadow-lg shadow-primary/20">Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
