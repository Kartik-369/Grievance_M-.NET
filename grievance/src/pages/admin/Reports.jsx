import { GRIEVANCES, CATEGORIES, STATUSES } from '../../data/dummy'

const total      = GRIEVANCES.length
const byStatus   = STATUSES.map(s => ({ ...s, count: GRIEVANCES.filter(g => g.statusId === s.id).length }))
const byCategory = CATEGORIES.map(c => ({ ...c, count: GRIEVANCES.filter(g => g.categoryId === c.id).length }))

const STATUS_BAR_COLORS = { 1: '#f59e0b', 2: '#3b82f6', 3: '#10b981', 4: '#ef4444' }

function Bar({ label, count, max, color }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-28 flex-shrink-0 truncate">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2.5">
        <div className="h-2.5 rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color || 'var(--navy)' }} />
      </div>
      <span className="text-xs font-bold text-gray-700 w-5 text-right">{count}</span>
    </div>
  )
}

export default function Reports() {
  return (
    <div className="animate-fade-in">
      <div className="mb-5">
        <h1 className="text-xl font-black text-gray-800">Reports & Analytics</h1>
        <p className="text-xs text-gray-500 mt-0.5">Overview of grievance statistics</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {byStatus.map(s => (
          <div key={s.id} className="stat-card p-4">
            <div className="text-2xl font-black text-gray-800">{s.count}</div>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-2 h-2 rounded-full" style={{ background: STATUS_BAR_COLORS[s.id] }} />
              <span className="text-xs font-semibold text-gray-500">{s.name}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* By status */}
        <div className="card p-5">
          <h3 className="section-title mb-4">By Status</h3>
          <div className="space-y-3">
            {byStatus.map(s => (
              <Bar key={s.id} label={s.name} count={s.count} max={total} color={STATUS_BAR_COLORS[s.id]} />
            ))}
          </div>
        </div>

        {/* By category */}
        <div className="card p-5">
          <h3 className="section-title mb-4">By Category</h3>
          <div className="space-y-3">
            {byCategory.map(c => (
              <Bar key={c.id} label={c.name} count={c.count} max={total} />
            ))}
          </div>
        </div>

        {/* Resolution rate */}
        <div className="card p-5 col-span-2">
          <h3 className="section-title mb-4">Resolution Summary</h3>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-black text-green-600">
                {total > 0 ? Math.round((byStatus.find(s=>s.id===3)?.count||0) / total * 100) : 0}%
              </div>
              <div className="text-xs text-gray-500 mt-1">Resolution Rate</div>
            </div>
            <div>
              <div className="text-3xl font-black text-yellow-600">
                {total > 0 ? Math.round((byStatus.find(s=>s.id===1)?.count||0) / total * 100) : 0}%
              </div>
              <div className="text-xs text-gray-500 mt-1">Pending Rate</div>
            </div>
            <div>
              <div className="text-3xl font-black text-red-500">
                {total > 0 ? Math.round((byStatus.find(s=>s.id===4)?.count||0) / total * 100) : 0}%
              </div>
              <div className="text-xs text-gray-500 mt-1">Rejection Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
