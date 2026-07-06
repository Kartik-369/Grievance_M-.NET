import { useNavigate } from 'react-router-dom'
import { Plus, ArrowRight } from 'lucide-react'
import { GRIEVANCES, STATUSES, CATEGORIES } from '../data/dummy'

const getStatus = (id) => {
  return STATUSES.find(s => s.id === id)
}

const getCategory = (id) => {
  return CATEGORIES.find(c => c.id === id)
}

const STATUS_CSS = { 
  1: 'bg-yellow-100 text-yellow-800', 
  2: 'bg-blue-100 text-blue-800', 
  3: 'bg-green-100 text-green-800', 
  4: 'bg-red-100 text-red-800' 
}

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5">
      <div>
        <div className="text-[26px] font-bold text-slate-900">{value}</div>
        <div className="text-[12.5px] text-slate-500 mt-0.5 font-medium">{label}</div>
        {sub && <div className="text-[11.5px] text-slate-400 mt-0.5">{sub}</div>}
      </div>
    </div>
  )
}

function BarRow({ label, count, total }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-500 w-[110px] shrink-0">{label}</span>
      <div className="flex-1 bg-slate-100 rounded-[4px] h-1.5 overflow-hidden">
        <div className="h-full bg-blue-600 rounded-[4px] transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-slate-600 w-5 text-right">{count}</span>
    </div>
  )
}

function RecentTable({ rows, navigate }) {
  const goToList = () => {
    navigate('/grievances')
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
        <span className="font-semibold text-[13px] text-slate-900">Recent Grievances</span>
        <button onClick={goToList} className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-700 transition-colors">
          View all <ArrowRight size={12} />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-2.5">ID</th>
              <th className="px-4 py-2.5">Title</th>
              <th className="px-4 py-2.5">Category</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5">Date</th>
            </tr>
          </thead>
          <tbody className="text-[13px]">
            {rows.map(g => {
              const st  = getStatus(g.statusId)
              const cat = getCategory(g.categoryId)
              const goDetail = () => {
                navigate(`/grievances/${g.id}`)
              }
              return (
                <tr key={g.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer" onClick={goDetail}>
                  <td className="px-4 py-3"><span className="font-mono text-xs font-semibold text-blue-600">{g.id}</span></td>
                  <td className="px-4 py-3 max-w-[260px] truncate"><span className="font-medium text-slate-800">{g.title}</span></td>
                  <td className="px-4 py-3"><span className="text-xs text-slate-500">{cat?.name}</span></td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11.5px] font-medium ${STATUS_CSS[g.statusId]}`}>{st?.name}</span>
                  </td>
                  <td className="px-4 py-3"><span className="text-xs text-slate-400">{g.date}</span></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function Dashboard({ user }) {
  const navigate   = useNavigate()
  const total      = GRIEVANCES.length
  const pending    = GRIEVANCES.filter(g => g.statusId === 1).length
  const inProgress = GRIEVANCES.filter(g => g.statusId === 2).length
  const resolved   = GRIEVANCES.filter(g => g.statusId === 3).length
  const rejected   = GRIEVANCES.filter(g => g.statusId === 4).length

  const handleNew = () => {
    navigate('/grievances/new')
  }

  return (
    <div className="animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
        <div>
          <div className="text-lg font-bold text-slate-900">Dashboard</div>
          <div className="text-[13px] text-slate-500 mt-0.5">{user.name} &middot; {user.role}</div>
        </div>
        {user.role === 'Student' && (
          <button onClick={handleNew} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors">
            <Plus size={13} /> New Grievance
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Total"       value={total}      />
        <StatCard label="Pending"     value={pending}    />
        <StatCard label="In Progress" value={inProgress} />
        <StatCard label="Resolved"    value={resolved}   />
      </div>

      {user.role === 'Admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="font-semibold text-[13px] mb-3.5 text-slate-800">By Category</div>
            <div className="flex flex-col gap-2.5">
              {CATEGORIES.map(c => {
                const count = GRIEVANCES.filter(g => g.categoryId === c.id).length
                return <BarRow key={c.id} label={c.name} count={count} total={total} />
              })}
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="font-semibold text-[13px] mb-3.5 text-slate-800">By Status</div>
            <div className="flex flex-col gap-4 mt-2">
              {[
                { label: 'Pending',     count: pending,    color: 'bg-yellow-500' },
                { label: 'In Progress', count: inProgress, color: 'bg-blue-600' },
                { label: 'Resolved',    count: resolved,   color: 'bg-green-600' },
                { label: 'Rejected',    count: rejected,   color: 'bg-red-600' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                    <span className="text-[13px] text-slate-600">{s.label}</span>
                  </div>
                  <span className="font-bold text-[16px] text-slate-900">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <RecentTable rows={GRIEVANCES.slice(0, 5)} navigate={navigate} />
    </div>
  )
}
