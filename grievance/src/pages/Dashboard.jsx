import { useNavigate } from 'react-router-dom'
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, Plus, ArrowRight } from 'lucide-react'
import { GRIEVANCES, STATUSES, CATEGORIES } from '../data/dummy'

// ── helpers ────────────────────────────────────────────────
const getStatus  = id => STATUSES.find(s => s.id === id)
const getCategory= id => CATEGORIES.find(c => c.id === id)

// ── stat card ──────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    blue:   'bg-blue-50 text-blue-600 border-blue-100',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    green:  'bg-green-50 text-green-600 border-green-100',
    red:    'bg-red-50 text-red-600 border-red-100',
  }
  return (
    <div className="stat-card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${colors[color]}`}>
        <Icon size={21} />
      </div>
      <div>
        <div className="text-2xl font-black text-gray-800">{value}</div>
        <div className="text-xs font-semibold text-gray-500">{label}</div>
      </div>
    </div>
  )
}

// ── Admin dashboard ────────────────────────────────────────
function AdminDashboard({ navigate }) {
  const total      = GRIEVANCES.length
  const pending    = GRIEVANCES.filter(g => g.statusId === 1).length
  const inProgress = GRIEVANCES.filter(g => g.statusId === 2).length
  const resolved   = GRIEVANCES.filter(g => g.statusId === 3).length

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={FileText}    label="Total Grievances" value={total}      color="blue" />
        <StatCard icon={Clock}       label="Pending"          value={pending}    color="yellow" />
        <StatCard icon={AlertCircle} label="In Progress"      value={inProgress} color="blue" />
        <StatCard icon={CheckCircle} label="Resolved"         value={resolved}   color="green" />
      </div>

      {/* Category breakdown */}
      <div className="card p-5 mb-4">
        <h3 className="section-title mb-4"><BarChart label="By Category" /></h3>
        <div className="space-y-2.5">
          {CATEGORIES.map(cat => {
            const count = GRIEVANCES.filter(g => g.categoryId === cat.id).length
            const pct   = Math.round((count / total) * 100) || 0
            return (
              <div key={cat.id} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-28 flex-shrink-0">{cat.name}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div className="h-2 rounded-full bg-[var(--navy)]" style={{ width: `${pct}%`, transition: 'width .6s ease' }} />
                </div>
                <span className="text-xs font-bold text-gray-600 w-6 text-right">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      <RecentTable navigate={navigate} />
    </>
  )
}

// ── Agent dashboard ────────────────────────────────────────
function AgentDashboard({ navigate }) {
  // Agent sees only in-progress (assigned) grievances
  const assigned = GRIEVANCES.filter(g => g.statusId === 2)
  return (
    <>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard icon={ClipboardIcon} label="Assigned to Me" value={assigned.length} color="blue" />
        <StatCard icon={CheckCircle}   label="Resolved"       value={GRIEVANCES.filter(g=>g.statusId===3).length} color="green" />
      </div>
      <RecentTable navigate={navigate} filter={g => g.statusId === 2} title="My Active Assignments" />
    </>
  )
}

// ── Student dashboard ──────────────────────────────────────
function StudentDashboard({ navigate }) {
  const mine = GRIEVANCES // student sees all (single user)
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={FileText}    label="Total Raised"  value={mine.length} color="blue" />
        <StatCard icon={Clock}       label="Pending"       value={mine.filter(g=>g.statusId===1).length} color="yellow" />
        <StatCard icon={AlertCircle} label="In Progress"   value={mine.filter(g=>g.statusId===2).length} color="blue" />
        <StatCard icon={CheckCircle} label="Resolved"      value={mine.filter(g=>g.statusId===3).length} color="green" />
      </div>
      <RecentTable navigate={navigate} />
    </>
  )
}

// ── Shared: recent table ────────────────────────────────────
function RecentTable({ navigate, filter = () => true, title = 'Recent Grievances' }) {
  const rows = GRIEVANCES.filter(filter).slice(0, 4)
  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <span className="section-title">{title}</span>
        <button onClick={() => navigate('/grievances')} className="text-xs text-[var(--navy)] font-semibold flex items-center gap-1 hover:underline">
          View all <ArrowRight size={12} />
        </button>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th><th>Title</th><th>Category</th><th>Status</th><th>Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(g => {
            const st  = getStatus(g.statusId)
            const cat = getCategory(g.categoryId)
            return (
              <tr key={g.id} className="cursor-pointer" onClick={() => navigate(`/grievances/${g.id}`)}>
                <td><span className="font-mono text-xs font-bold text-[var(--navy)]">{g.id}</span></td>
                <td><span className="font-medium text-sm">{g.title}</span></td>
                <td><span className="text-xs text-gray-500">{cat?.name}</span></td>
                <td><span className={`badge ${st?.css}`}>{st?.name}</span></td>
                <td><span className="text-xs text-gray-400">{g.date}</span></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// tiny helpers to avoid import issues in inline comps
function ClipboardIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/>
    </svg>
  )
}
function BarChart({ label }) {
  return <span className="text-sm font-bold text-[var(--navy)]">{label}</span>
}

// ── Main export ────────────────────────────────────────────
export default function Dashboard({ user }) {
  const navigate = useNavigate()
  const firstName = user.name.split(' ')[0]

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-black text-gray-800">
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {user.role} Dashboard · {new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
          </p>
        </div>
        {user.role === 'Student' && (
          <button id="raise-grievance-btn" onClick={() => navigate('/grievances/new')} className="btn-danger btn-sm">
            <Plus size={13} /> Raise Grievance
          </button>
        )}
      </div>

      {user.role === 'Admin'   && <AdminDashboard   navigate={navigate} />}
      {user.role === 'Agent'   && <AgentDashboard   navigate={navigate} />}
      {user.role === 'Student' && <StudentDashboard navigate={navigate} />}
    </div>
  )
}
