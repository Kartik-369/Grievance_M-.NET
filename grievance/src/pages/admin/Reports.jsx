import { GRIEVANCES, CATEGORIES, STATUSES } from '../../data/dummy'

const total = GRIEVANCES.length

const byStatus = STATUSES.map(s => {
  const count = GRIEVANCES.filter(g => {
    return g.statusId === s.id
  }).length
  return { ...s, count }
})

const byCategory = CATEGORIES.map(c => {
  const count = GRIEVANCES.filter(g => {
    return g.categoryId === c.id
  }).length
  return { ...c, count }
})

function Bar({ label, count, max }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-[12.5px] text-slate-500 w-[100px] shrink-0">{label}</span>
      <div className="flex-1 bg-slate-100 rounded-[4px] h-[7px] overflow-hidden">
        <div className="h-full bg-blue-600 rounded-[4px] transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-slate-700 w-6 text-right">{count}</span>
    </div>
  )
}

export default function Reports() {
  const resolvedState = byStatus.find(s => {
    return s.id === 3
  })
  const resolved = resolvedState ? resolvedState.count : 0

  const pendingState = byStatus.find(s => {
    return s.id === 1
  })
  const pending = pendingState ? pendingState.count : 0

  const rejectedState = byStatus.find(s => {
    return s.id === 4
  })
  const rejected = rejectedState ? rejectedState.count : 0

  const pct = (n) => {
    if (total > 0) {
      return `${Math.round((n / total) * 100)}%`
    }
    return '0%'
  }

  return (
    <div className="animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
        <div>
          <div className="text-lg font-bold text-slate-900">Reports</div>
          <div className="text-[13px] text-slate-500 mt-0.5">Grievance statistics overview</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Resolution Rate', value: pct(resolved), color: 'text-green-600' },
          { label: 'Pending Rate',    value: pct(pending),  color: 'text-yellow-600' },
          { label: 'Rejection Rate',  value: pct(rejected), color: 'text-red-600' },
        ].map(s => {
          return (
            <div key={s.label} className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col items-start gap-1 shadow-sm">
              <div className={`text-[28px] font-bold ${s.color}`}>{s.value}</div>
              <div className="text-[12.5px] text-slate-500 font-medium">{s.label}</div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <div className="font-semibold text-[13px] mb-4 text-slate-800">By Category</div>
          <div className="flex flex-col gap-3">
            {byCategory.map(c => {
              return (
                <Bar key={c.id} label={c.name} count={c.count} max={total} />
              )
            })}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <div className="font-semibold text-[13px] mb-4 text-slate-800">By Status</div>
          <div className="flex flex-col gap-3">
            {byStatus.map(s => {
              return (
                <Bar key={s.id} label={s.name} count={s.count} max={total} />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
