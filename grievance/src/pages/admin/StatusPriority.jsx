import { useState } from 'react'
import { Edit2, Check, X } from 'lucide-react'

const INIT_STATUSES = [
  { id: 1, name: 'Pending',     css: 'bg-yellow-100 text-yellow-800' },
  { id: 2, name: 'In Progress', css: 'bg-blue-100 text-blue-800' },
  { id: 3, name: 'Resolved',    css: 'bg-green-100 text-green-800' },
  { id: 4, name: 'Rejected',    css: 'bg-red-100 text-red-800' },
]
const INIT_PRIORITIES = [
  { id: 1, name: 'Low',      css: 'bg-green-50 text-green-700' },
  { id: 2, name: 'Medium',   css: 'bg-yellow-50 text-yellow-700' },
  { id: 3, name: 'High',     css: 'bg-orange-50 text-orange-700' },
  { id: 4, name: 'Critical', css: 'bg-red-50 text-red-700' },
]

function Table({ title, rows, setRows }) {
  const [editing, setEditing] = useState(null)
  const [val,     setVal]     = useState('')

  const start  = r => { setEditing(r.id); setVal(r.name) }
  const save   = id => { setRows(r => r.map(x => x.id === id ? { ...x, name: val } : x)); setEditing(null) }
  const cancel = () => setEditing(null)

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-slate-100 font-semibold text-[13px] text-slate-900">{title}</div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-2.5">#</th>
              <th className="px-4 py-2.5">Name</th>
              <th className="px-4 py-2.5">Badge</th>
              <th className="px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody className="text-[13px]">
            {rows.map((r, i) => (
              <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-slate-400 text-xs">{i + 1}</td>
                <td className="px-4 py-3">
                  {editing === r.id
                    ? <input className="w-full border border-slate-300 rounded-md px-2.5 py-1 text-[13px] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors" value={val} onChange={e => setVal(e.target.value)} autoFocus />
                    : <span className="font-medium text-slate-800">{r.name}</span>
                  }
                </td>
                <td className="px-4 py-3"><span className={`inline-flex items-center px-2 py-0.5 rounded text-[11.5px] font-medium ${r.css}`}>{r.name}</span></td>
                <td className="px-4 py-3">
                  {editing === r.id
                    ? <div className="flex gap-2">
                        <button onClick={() => save(r.id)} className="p-1.5 text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"><Check size={12} /></button>
                        <button onClick={cancel} className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 border border-slate-200 rounded transition-colors"><X size={12} /></button>
                      </div>
                    : <button onClick={() => start(r)} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded transition-colors"><Edit2 size={12} /></button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function StatusPriority() {
  const [statuses,   setStatuses]   = useState(INIT_STATUSES)
  const [priorities, setPriorities] = useState(INIT_PRIORITIES)
  return (
    <div className="animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
        <div>
          <div className="text-lg font-bold text-slate-900">Status & Priority</div>
          <div className="text-[13px] text-slate-500 mt-0.5">Manage grievance statuses and priority levels</div>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <Table title="Statuses"   rows={statuses}   setRows={setStatuses} />
        <Table title="Priorities" rows={priorities} setRows={setPriorities} />
      </div>
    </div>
  )
}
