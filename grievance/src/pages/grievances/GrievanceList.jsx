import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, X } from 'lucide-react'
import { GRIEVANCES, STATUSES, CATEGORIES, PRIORITIES } from '../../data/dummy'

const getStatus = (id) => {
  return STATUSES.find(s => s.id === id)
}

const getCategory = (id) => {
  return CATEGORIES.find(c => c.id === id)
}

const getPriority = (id) => {
  return PRIORITIES.find(p => p.id === id)
}

const PRI_CSS = { 
  1: 'bg-green-50 text-green-700', 
  2: 'bg-yellow-50 text-yellow-700', 
  3: 'bg-orange-50 text-orange-700', 
  4: 'bg-red-50 text-red-700' 
}
const ST_CSS  = { 
  1: 'bg-yellow-100 text-yellow-800', 
  2: 'bg-blue-100 text-blue-800', 
  3: 'bg-green-100 text-green-800', 
  4: 'bg-red-100 text-red-800' 
}

export default function GrievanceList({ user }) {
  const navigate = useNavigate()
  const [from,   setFrom]   = useState('2026-01-01')
  const [to,     setTo]     = useState('2026-12-31')
  const [cat,    setCat]    = useState('')
  const [sid,    setSid]    = useState('')
  const [title,  setTitle]  = useState('')
  const [status, setStatus] = useState('all')

  const clear = () => {
    setFrom('2026-01-01')
    setTo('2026-12-31')
    setCat('')
    setSid('')
    setTitle('')
    setStatus('all')
  }

  const rows = GRIEVANCES.filter(g => {
    if (cat && g.categoryId !== +cat) {
      return false
    }
    if (sid && !g.id.toLowerCase().includes(sid.toLowerCase())) {
      return false
    }
    if (title && !g.title.toLowerCase().includes(title.toLowerCase())) {
      return false
    }
    if (status === 'pending' && g.statusId !== 1) {
      return false
    }
    if (status === 'complete' && g.statusId !== 3) {
      return false
    }
    if (g.date < from || g.date > to) {
      return false
    }
    return true
  })

  const handleFromChange = (e) => {
    setFrom(e.target.value)
  }

  const handleToChange = (e) => {
    setTo(e.target.value)
  }

  const handleCatChange = (e) => {
    setCat(e.target.value)
  }

  const handleSidChange = (e) => {
    setSid(e.target.value)
  }

  const handleTitleChange = (e) => {
    setTitle(e.target.value)
  }

  const handleNew = () => {
    navigate('/grievances/new')
  }

  return (
    <div className="animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
        <div>
          <div className="text-lg font-bold text-slate-900">{user?.role === 'Admin' ? 'All Grievances' : 'My Grievances'}</div>
          <div className="text-[13px] text-slate-500 mt-0.5">Kartik &middot; {user?.role}</div>
        </div>
        {user?.role !== 'Agent' && (
          <button onClick={handleNew} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors">
            <Plus size={13} /> Add New
          </button>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4 shadow-sm">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Search size={12} /> Search
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          <input type="date" className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" value={from} onChange={handleFromChange} />
          <input type="date" className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" value={to}   onChange={handleToChange} />
          <select className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" value={cat} onChange={handleCatChange}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" placeholder="Grievance No." value={sid} onChange={handleSidChange} />
        </div>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <input className="w-full lg:max-w-[280px] border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" placeholder="Grievance title..." value={title} onChange={handleTitleChange} />
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <div className="flex gap-4">
              {[['all','All'],['pending','Pending'],['complete','Complete']].map(([v, l]) => {
                const handleStatusChange = () => {
                  setStatus(v)
                }
                return (
                  <label key={v} className="flex items-center gap-1.5 text-[13px] cursor-pointer text-slate-600 hover:text-slate-900 transition-colors">
                    <input type="radio" name="status-filter" value={v} checked={status === v} onChange={handleStatusChange} className="accent-blue-600 w-3.5 h-3.5" />
                    <span className={status === v ? 'font-semibold' : ''}>{l}</span>
                  </label>
                )
              })}
            </div>
            <div className="flex gap-2 ml-auto lg:ml-0">
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors"><Search size={12} /> Search</button>
              <button onClick={clear} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-transparent text-slate-700 border border-slate-300 text-xs font-medium rounded-md hover:bg-slate-50 transition-colors"><X size={12} /> Clear</button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <span className="font-semibold text-[12.5px] flex items-center gap-1.5 text-slate-800">
            <Search size={12} className="text-slate-400" />
            Results
            <span className="text-slate-400 font-normal">
              {rows.length === 0 ? '— No records found' : `(${rows.length})`}
            </span>
          </span>
        </div>

        {rows.length === 0 ? (
          <div className="bg-red-50 border-l-4 border-red-600 m-4 rounded-r-md px-4 py-3 text-[13px] text-red-800">
            No records found for the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-2.5">#</th>
                  <th className="px-4 py-2.5">ID</th>
                  <th className="px-4 py-2.5">Title</th>
                  <th className="px-4 py-2.5">Category</th>
                  <th className="px-4 py-2.5">Priority</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5">Date</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody className="text-[13px]">
                {rows.map((g, i) => {
                  const st  = getStatus(g.statusId)
                  const cat = getCategory(g.categoryId)
                  const pri = getPriority(g.priorityId)
                  
                  const viewGrievance = () => {
                    navigate(`/grievances/${g.id}`)
                  }

                  return (
                    <tr key={g.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-slate-400 text-xs">{i + 1}</td>
                      <td className="px-4 py-3"><span className="font-mono text-xs font-semibold text-blue-600">{g.id}</span></td>
                      <td className="px-4 py-3 max-w-[240px] truncate"><span className="font-medium text-slate-800">{g.title}</span></td>
                      <td className="px-4 py-3 text-xs text-slate-500">{cat?.name}</td>
                      <td className="px-4 py-3"><span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${PRI_CSS[g.priorityId]}`}>{pri?.name}</span></td>
                      <td className="px-4 py-3"><span className={`inline-flex items-center px-2 py-0.5 rounded text-[11.5px] font-medium ${ST_CSS[g.statusId]}`}>{st?.name}</span></td>
                      <td className="px-4 py-3 text-xs text-slate-400">{g.date}</td>
                      <td className="px-4 py-3">
                        <button onClick={viewGrievance} className="px-2.5 py-1 bg-transparent text-blue-600 border border-blue-600 text-xs font-medium rounded hover:bg-blue-50 transition-colors">View</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
