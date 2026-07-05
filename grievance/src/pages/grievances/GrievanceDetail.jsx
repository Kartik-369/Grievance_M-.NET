import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { GRIEVANCES, STATUSES, CATEGORIES, PRIORITIES } from '../../data/dummy'

const ST_CSS  = { 
  1: 'bg-yellow-100 text-yellow-800', 
  2: 'bg-blue-100 text-blue-800', 
  3: 'bg-green-100 text-green-800', 
  4: 'bg-red-100 text-red-800' 
}
const PRI_CSS = { 
  1: 'bg-green-50 text-green-700', 
  2: 'bg-yellow-50 text-yellow-700', 
  3: 'bg-orange-50 text-orange-700', 
  4: 'bg-red-50 text-red-700' 
}
const DOT_CLR = { 1: '#eab308', 2: '#2563eb', 3: '#16a34a', 4: '#dc2626' } // tailwind colors for border

export default function GrievanceDetail() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const g = GRIEVANCES.find(x => x.id === id)

  if (!g) return (
    <div className="p-10 text-center text-slate-500">
      <div className="font-semibold mb-3 text-slate-900">Grievance not found</div>
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-transparent text-slate-700 border border-slate-300 text-xs font-medium rounded-md hover:bg-slate-50 transition-colors"><ArrowLeft size={13} /> Go back</button>
    </div>
  )

  const st  = STATUSES.find(s => s.id === g.statusId)
  const cat = CATEGORIES.find(c => c.id === g.categoryId)
  const pri = PRIORITIES.find(p => p.id === g.priorityId)

  return (
    <div className="animate-in fade-in duration-200 max-w-4xl">
      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors mt-0.5"><ArrowLeft size={16} /></button>
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{g.id}</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11.5px] font-medium ${ST_CSS[g.statusId]}`}>{st?.name}</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${PRI_CSS[g.priorityId]}`}>{pri?.name}</span>
          </div>
          <div className="text-lg font-bold text-slate-900">{g.title}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left */}
        <div className="md:col-span-2 flex flex-col gap-5 min-w-0">
          {/* Description */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <div className="font-bold text-[11px] text-slate-500 uppercase tracking-wider mb-3">Description</div>
            <div className="text-[13.5px] text-slate-700 leading-relaxed whitespace-pre-wrap">{g.description}</div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <div className="font-bold text-[11px] text-slate-500 uppercase tracking-wider mb-5">Status History</div>
            <div className="flex flex-col gap-0">
              {g.history.map((h, i) => {
                const hst = STATUSES.find(s => s.id === h.statusId)
                const isLast = i === g.history.length - 1
                return (
                  <div key={i} className="relative pl-7 pb-5">
                    {!isLast && <div className="absolute left-[7px] top-4 bottom-0 w-px bg-slate-200" />}
                    <div className="absolute left-0 top-1 w-3.5 h-3.5 rounded-full border-2 bg-white" style={{ borderColor: DOT_CLR[h.statusId] }} />
                    <div className="bg-slate-50 rounded-lg p-3 ml-1 border border-slate-100">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10.5px] font-medium ${ST_CSS[h.statusId]}`}>{hst?.name}</span>
                        <span className="text-[11px] text-slate-400 font-medium">{h.on}</span>
                      </div>
                      <div className="text-[12.5px] text-slate-600">{h.remarks}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div>
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm sticky top-20">
            <div className="font-bold text-[11px] text-slate-500 uppercase tracking-wider mb-4">Details</div>
            <div className="flex flex-col gap-4">
              {[
                { label: 'Category',  value: cat?.name },
                { label: 'Priority',  value: <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${PRI_CSS[g.priorityId]}`}>{pri?.name}</span> },
                { label: 'Status',    value: <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${ST_CSS[g.statusId]}`}>{st?.name}</span> },
                { label: 'Date',      value: g.date },
                { label: 'Raised By', value: 'Kartik Balkrishna' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</div>
                  <div className="text-[13px] text-slate-800 font-medium">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
