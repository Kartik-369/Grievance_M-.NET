// Reusable UI components

export function Badge({ text, cssClass }) {
  return <span className={`badge ${cssClass}`}>{text}</span>
}

export function StatusBadge({ statusId }) {
  const map = {
    1: { text: 'Pending', cls: 'badge-pending' },
    2: { text: 'In Progress', cls: 'badge-inprogress' },
    3: { text: 'Resolved', cls: 'badge-resolved' },
    4: { text: 'Rejected', cls: 'badge-rejected' },
  }
  const s = map[statusId] || { text: '—', cls: '' }
  return <span className={`badge ${s.cls}`}>{s.text}</span>
}

export function PriorityBadge({ priorityId }) {
  const map = {
    1: { text: 'Low', cls: 'badge-low' },
    2: { text: 'Medium', cls: 'badge-medium' },
    3: { text: 'High', cls: 'badge-high' },
    4: { text: 'Critical', cls: 'badge-critical' },
  }
  const p = map[priorityId] || { text: '—', cls: '' }
  return <span className={`badge ${p.cls}`}>{p.text}</span>
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

export function StatCard({ icon: Icon, label, value, color, sublabel }) {
  const colorMap = {
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-100' },
    green: { bg: 'bg-green-50', icon: 'text-green-600', border: 'border-green-100' },
    yellow: { bg: 'bg-yellow-50', icon: 'text-yellow-600', border: 'border-yellow-100' },
    red: { bg: 'bg-red-50', icon: 'text-red-600', border: 'border-red-100' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-100' },
  }
  const c = colorMap[color] || colorMap.blue
  return (
    <div className={`stat-card p-5 flex items-center gap-4`}>
      <div className={`w-12 h-12 rounded-xl ${c.bg} ${c.border} border flex items-center justify-center flex-shrink-0`}>
        <Icon size={22} className={c.icon} />
      </div>
      <div>
        <div className="text-2xl font-black text-gray-800">{value}</div>
        <div className="text-xs font-semibold text-gray-500">{label}</div>
        {sublabel && <div className="text-[11px] text-gray-400 mt-0.5">{sublabel}</div>}
      </div>
    </div>
  )
}

export function EmptyState({ message = 'No records found.' }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-gray-400">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mb-3 opacity-30">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="2"/>
      </svg>
      <p className="text-sm font-medium">{message}</p>
    </div>
  )
}

export function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-gray-300">›</span>}
          <span className={i === items.length - 1 ? 'text-gray-800 font-semibold' : 'hover:text-gray-700 cursor-pointer'}>
            {item}
          </span>
        </span>
      ))}
    </nav>
  )
}
