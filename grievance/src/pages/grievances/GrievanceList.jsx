import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, X, Eye } from 'lucide-react'
import { GRIEVANCES, STATUSES, CATEGORIES, PRIORITIES } from '../../data/dummy'

const getStatus   = id => STATUSES.find(s => s.id === id)
const getCategory = id => CATEGORIES.find(c => c.id === id)
const getPriority = id => PRIORITIES.find(p => p.id === id)

export default function GrievanceList({ user }) {
  const navigate = useNavigate()

  // Filter state
  const [filters, setFilters] = useState({ category: '', status: 'all', title: '', id: '' })
  const [fromDate, setFromDate] = useState('2026-01-01')
  const [toDate, setToDate]     = useState('2026-12-31')

  const set = (key, val) => setFilters(f => ({ ...f, [key]: val }))

  const filtered = GRIEVANCES.filter(g => {
    if (filters.category && g.categoryId !== +filters.category) return false
    if (filters.status === 'pending'    && g.statusId !== 1) return false
    if (filters.status === 'complete'   && g.statusId !== 3) return false
    if (filters.title  && !g.title.toLowerCase().includes(filters.title.toLowerCase())) return false
    if (filters.id     && !g.id.toLowerCase().includes(filters.id.toLowerCase())) return false
    if (g.date < fromDate || g.date > toDate) return false
    return true
  })

  const clear = () => {
    setFilters({ category: '', status: 'all', title: '', id: '' })
    setFromDate('2026-01-01')
    setToDate('2026-12-31')
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-black text-gray-800">
            {user?.role === 'Admin' ? 'All Grievances' : 'My Grievances'}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Student · Kartik Balkrishna
          </p>
        </div>
        {(user?.role === 'Student' || user?.role === 'Admin') && (
          <button id="add-grievance-btn" onClick={() => navigate('/grievances/new')} className="btn-primary btn-sm">
            <Plus size={13} /> Add New <span className="opacity-50 text-[10px]">(F9)</span>
          </button>
        )}
      </div>

      {/* Search panel */}
      <div className="search-panel">
        <div className="search-panel-header">
          <span className="flex items-center gap-2">
            <Search size={13} /> SEARCH
          </span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">📅</span>
            <input type="date" className="form-input pl-8 text-xs" value={fromDate}
              onChange={e => setFromDate(e.target.value)} />
          </div>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">📅</span>
            <input type="date" className="form-input pl-8 text-xs" value={toDate}
              onChange={e => setToDate(e.target.value)} />
          </div>
          <select id="filter-category" className="form-input text-xs"
            value={filters.category} onChange={e => set('category', e.target.value)}>
            <option value="">Select Grievance Type</option>
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input id="filter-id" type="text" className="form-input pl-8 text-xs" placeholder="Enter Grievance No."
              value={filters.id} onChange={e => set('id', e.target.value)} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="relative w-64">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input id="filter-title" type="text" className="form-input pl-8 text-xs" placeholder="Enter Grievance Title"
              value={filters.title} onChange={e => set('title', e.target.value)} />
          </div>

          <div className="flex items-center gap-4">
            {/* Status radio — exactly like the UMS screenshot */}
            <div className="flex items-center gap-3 text-xs">
              {[['all', 'All'], ['pending', 'Pending'], ['complete', 'Complete']].map(([val, lbl]) => (
                <label key={val} className="flex items-center gap-1.5 cursor-pointer font-medium text-gray-600">
                  <input type="radio" name="status" value={val}
                    checked={filters.status === val} onChange={() => set('status', val)}
                    className="accent-[var(--navy)]" />
                  {lbl}
                </label>
              ))}
            </div>

            <div className="flex gap-2">
              <button id="search-btn" className="btn-primary btn-sm"><Search size={12} /> Search</button>
              <button id="clear-btn" onClick={clear} className="btn-outline btn-sm"><X size={12} /> Clear</button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="section-title">
            <Search size={13} /> SEARCH RESULT
            <span className="text-gray-400 font-normal text-xs ml-1">
              {filtered.length === 0 ? 'No Record Found' : `${filtered.length} record${filtered.length > 1 ? 's' : ''}`}
            </span>
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="flex items-center gap-2 bg-red-50 border-l-4 border-red-400 text-red-700 text-sm px-5 py-4 m-4 rounded">
            ⊗ No Record Found
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Grievance ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g, i) => {
                const st  = getStatus(g.statusId)
                const cat = getCategory(g.categoryId)
                const pri = getPriority(g.priorityId)
                return (
                  <tr key={g.id}>
                    <td className="text-gray-400 text-xs">{i + 1}</td>
                    <td><span className="font-mono text-xs font-bold text-[var(--navy)]">{g.id}</span></td>
                    <td>
                      <span className="font-medium text-sm text-gray-800 line-clamp-1 max-w-xs block">
                        {g.title}
                      </span>
                    </td>
                    <td><span className="text-xs text-gray-500">{cat?.name}</span></td>
                    <td><span className={`badge ${pri?.css}`}>{pri?.name}</span></td>
                    <td><span className={`badge ${st?.css}`}>{st?.name}</span></td>
                    <td><span className="text-xs text-gray-400">{g.date}</span></td>
                    <td>
                      <button id={`view-${g.id}`} onClick={() => navigate(`/grievances/${g.id}`)}
                        className="btn-outline btn-sm">
                        <Eye size={12} /> View
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
