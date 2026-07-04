import { useState } from 'react'
import { Edit2, Check, X } from 'lucide-react'

// Declared locally — only used here
const INIT_STATUSES = [
  { id: 1, name: 'Pending',     css: 'badge-pending' },
  { id: 2, name: 'In Progress', css: 'badge-inprogress' },
  { id: 3, name: 'Resolved',    css: 'badge-resolved' },
  { id: 4, name: 'Rejected',    css: 'badge-rejected' },
]

const INIT_PRIORITIES = [
  { id: 1, name: 'Low',      css: 'badge-low' },
  { id: 2, name: 'Medium',   css: 'badge-medium' },
  { id: 3, name: 'High',     css: 'badge-high' },
  { id: 4, name: 'Critical', css: 'badge-critical' },
]

function EditableTable({ title, rows, setRows }) {
  const [editing, setEditing] = useState(null) // id
  const [val, setVal]         = useState('')

  const startEdit = (row) => { setEditing(row.id); setVal(row.name) }
  const save      = (id)  => { setRows(r => r.map(x => x.id === id ? { ...x, name: val } : x)); setEditing(null) }
  const cancel    = ()    => setEditing(null)

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="section-title">{title}</h3>
      </div>
      <table className="data-table">
        <thead><tr><th>#</th><th>Name</th><th>Badge Preview</th><th>Actions</th></tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id}>
              <td className="text-gray-400 text-xs">{i + 1}</td>
              <td>
                {editing === r.id ? (
                  <input className="form-input text-xs py-1" value={val} onChange={e => setVal(e.target.value)} autoFocus />
                ) : (
                  <span className="font-semibold text-sm">{r.name}</span>
                )}
              </td>
              <td><span className={`badge ${r.css}`}>{r.name}</span></td>
              <td>
                {editing === r.id ? (
                  <div className="flex gap-1.5">
                    <button id={`save-${r.id}`} onClick={() => save(r.id)} className="btn-primary btn-sm p-1.5"><Check size={12}/></button>
                    <button onClick={cancel} className="btn-outline btn-sm p-1.5"><X size={12}/></button>
                  </div>
                ) : (
                  <button id={`edit-${r.id}`} onClick={() => startEdit(r)} className="btn-outline btn-sm p-1.5"><Edit2 size={12}/></button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function StatusPriority() {
  const [statuses,   setStatuses]   = useState(INIT_STATUSES)
  const [priorities, setPriorities] = useState(INIT_PRIORITIES)

  return (
    <div className="animate-fade-in">
      <div className="mb-5">
        <h1 className="text-xl font-black text-gray-800">Status & Priority</h1>
        <p className="text-xs text-gray-500 mt-0.5">Manage grievance statuses and priority levels</p>
      </div>
      <div className="space-y-5">
        <EditableTable title="Statuses"   rows={statuses}   setRows={setStatuses} />
        <EditableTable title="Priorities" rows={priorities} setRows={setPriorities} />
      </div>
    </div>
  )
}
