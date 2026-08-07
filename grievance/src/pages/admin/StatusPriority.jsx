import { useState } from 'react'
import { Edit2, Check, X } from 'lucide-react'

// Matches backend Status model: { StatusID, StatusName, StatusCssClass }
const INIT_STATUSES = [
  { id: 1, statusName: 'Pending',     statusCssClass: 'bg-yellow-100 text-yellow-800' },
  { id: 2, statusName: 'In Progress', statusCssClass: 'bg-blue-100 text-blue-800'    },
  { id: 3, statusName: 'Resolved',    statusCssClass: 'bg-green-100 text-green-800'  },
  { id: 4, statusName: 'Rejected',    statusCssClass: 'bg-red-100 text-red-800'      },
]

// Matches backend Priority model: { PriorityId, PriorityName, PriorityCssClass }
const INIT_PRIORITIES = [
  { id: 1, priorityName: 'Low',      priorityCssClass: 'bg-green-50 text-green-700'   },
  { id: 2, priorityName: 'Medium',   priorityCssClass: 'bg-yellow-50 text-yellow-700' },
  { id: 3, priorityName: 'High',     priorityCssClass: 'bg-orange-50 text-orange-700' },
  { id: 4, priorityName: 'Critical', priorityCssClass: 'bg-red-50 text-red-700'       },
]

// Editable table for both Status and Priority — fields renamed to match backend models
function Table({ title, rows, setRows, nameKey, cssKey }) {
  const [editing, setEditing] = useState(null)
  const [nameVal, setNameVal] = useState('')
  const [cssVal,  setCssVal]  = useState('')

  const start = (r) => {
    setEditing(r.id)
    setNameVal(r[nameKey])
    setCssVal(r[cssKey])
  }

  const save = (id) => {
    // PUT api/status/{id}  OR  PUT api/priority/{id}
    setRows(prev => prev.map(x => {
      if (x.id === id) {
        return { ...x, [nameKey]: nameVal, [cssKey]: cssVal }
      }
      return x
    }))
    setEditing(null)
  }

  const cancel = () => setEditing(null)

  const handleNameChange = (e) => setNameVal(e.target.value)
  const handleCssChange  = (e) => setCssVal(e.target.value)

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-slate-100 font-semibold text-[13px] text-slate-900">{title}</div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-2.5">#</th>
              <th className="px-4 py-2.5">Name</th>
              <th className="px-4 py-2.5">CSS Class</th>
              <th className="px-4 py-2.5">Preview</th>
              <th className="px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody className="text-[13px]">
            {rows.map((r, i) => {
              const handleStart = () => start(r)
              const handleSave  = () => save(r.id)
              const isEditing   = editing === r.id

              return (
                <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-400 text-xs">{i + 1}</td>

                  {/* Name field: StatusName or PriorityName */}
                  <td className="px-4 py-3">
                    {isEditing
                      ? <input
                          className="w-full border border-slate-300 rounded-md px-2.5 py-1 text-[13px] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                          value={nameVal}
                          onChange={handleNameChange}
                          autoFocus
                        />
                      : <span className="font-medium text-slate-800">{r[nameKey]}</span>
                    }
                  </td>

                  {/* CssClass field: StatusCssClass or PriorityCssClass */}
                  <td className="px-4 py-3">
                    {isEditing
                      ? <input
                          className="w-full border border-slate-300 rounded-md px-2.5 py-1 text-[11px] font-mono focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                          value={cssVal}
                          onChange={handleCssChange}
                          placeholder="e.g. bg-blue-100 text-blue-800"
                        />
                      : <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {r[cssKey]}
                        </span>
                    }
                  </td>

                  {/* Live preview badge */}
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11.5px] font-medium ${isEditing ? cssVal : r[cssKey]}`}>
                      {isEditing ? nameVal || '…' : r[nameKey]}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {isEditing
                      ? <div className="flex gap-2">
                          <button
                            onClick={handleSave}
                            className="p-1.5 text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                          >
                            <Check size={12} />
                          </button>
                          <button
                            onClick={cancel}
                            className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 border border-slate-200 rounded transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      : <button
                          onClick={handleStart}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded transition-colors"
                        >
                          <Edit2 size={12} />
                        </button>
                    }
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Admin-only: manages api/status and api/priority
export default function StatusPriority() {
  const [statuses,   setStatuses]   = useState(INIT_STATUSES)
  const [priorities, setPriorities] = useState(INIT_PRIORITIES)

  return (
    <div className="animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
        <div>
          <div className="text-lg font-bold text-slate-900">Status &amp; Priority</div>
          <div className="text-[13px] text-slate-500 mt-0.5">Manage grievance statuses and priority levels</div>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <Table
          title="Statuses"
          rows={statuses}
          setRows={setStatuses}
          nameKey="statusName"
          cssKey="statusCssClass"
        />
        <Table
          title="Priorities"
          rows={priorities}
          setRows={setPriorities}
          nameKey="priorityName"
          cssKey="priorityCssClass"
        />
      </div>
    </div>
  )
}
