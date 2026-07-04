import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Tag, AlertCircle, Calendar } from 'lucide-react'
import { GRIEVANCES, STATUSES, CATEGORIES, PRIORITIES } from '../../data/dummy'

const getStatus   = id => STATUSES.find(s => s.id === id)
const getCategory = id => CATEGORIES.find(c => c.id === id)
const getPriority = id => PRIORITIES.find(p => p.id === id)

const DOT_COLORS = { 1: '#f59e0b', 2: '#3b82f6', 3: '#10b981', 4: '#ef4444' }

export default function GrievanceDetail() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const g = GRIEVANCES.find(x => x.id === id)
  if (!g) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-400">
      <p className="text-lg font-bold mb-2">Grievance not found</p>
      <button onClick={() => navigate(-1)} className="btn-outline btn-sm mt-2"><ArrowLeft size={13}/> Go back</button>
    </div>
  )

  const st  = getStatus(g.statusId)
  const cat = getCategory(g.categoryId)
  const pri = getPriority(g.priorityId)

  return (
    <div className="animate-fade-in max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate(-1)} className="btn-outline btn-sm p-2"><ArrowLeft size={14}/></button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[var(--navy)] bg-indigo-50 px-2 py-0.5 rounded">{g.id}</span>
            <span className={`badge ${st?.css}`}>{st?.name}</span>
            <span className={`badge ${pri?.css}`}>{pri?.name}</span>
          </div>
          <h1 className="text-lg font-black text-gray-800 mt-1">{g.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Main */}
        <div className="col-span-2 space-y-4">
          {/* Description */}
          <div className="card p-5">
            <h3 className="section-title mb-3"><AlertCircle size={14}/> Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{g.description}</p>
          </div>

          {/* Timeline */}
          <div className="card p-5">
            <h3 className="section-title mb-4"><Calendar size={14}/> Status History</h3>
            <div>
              {g.history.map((h, i) => {
                const hst = getStatus(h.statusId)
                return (
                  <div key={i} className="timeline-item">
                    <div className="timeline-dot" style={{ borderColor: DOT_COLORS[h.statusId] || '#1a2d4f', background: DOT_COLORS[h.statusId] + '22' }} />
                    <div className="bg-gray-50 rounded-lg p-3 ml-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`badge ${hst?.css} text-[10px]`}>{hst?.name}</span>
                        <span className="text-[10px] text-gray-400">{h.on}</span>
                      </div>
                      <p className="text-xs text-gray-600">{h.remarks}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          <div className="card p-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Details</h3>
            <div className="space-y-3">
              <InfoRow icon={Tag}      label="Category" value={cat?.name} />
              <InfoRow icon={AlertCircle} label="Priority" value={
                <span className={`badge ${pri?.css}`}>{pri?.name}</span>
              } />
              <InfoRow icon={Calendar} label="Raised On" value={g.date} />
              <InfoRow icon={User}     label="Raised By" value="Kartik Balkrishna" />
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Current Status</h3>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: DOT_COLORS[g.statusId] }} />
              <span className={`badge ${st?.css}`}>{st?.name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <Icon size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />
      <div>
        <div className="text-[10px] text-gray-400 font-semibold">{label}</div>
        <div className="text-xs font-medium text-gray-700 mt-0.5">{value}</div>
      </div>
    </div>
  )
}
