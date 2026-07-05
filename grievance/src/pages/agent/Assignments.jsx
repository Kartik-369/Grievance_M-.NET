import { useNavigate } from 'react-router-dom'
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

const ASSIGNED = GRIEVANCES.filter(g => g.statusId === 2)

export default function Assignments({ user }) {
  const navigate = useNavigate()
  return (
    <div className="animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
        <div>
          <div className="text-lg font-bold text-slate-900">My Assignments</div>
          <div className="text-[13px] text-slate-500 mt-0.5">{user?.name} &middot; {ASSIGNED.length} active</div>
        </div>
      </div>

      {ASSIGNED.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center text-slate-500 text-[13.5px] shadow-sm">
          No active assignments.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
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
                {ASSIGNED.map((g, i) => {
                  const st  = STATUSES.find(s => s.id === g.statusId)
                  const cat = CATEGORIES.find(c => c.id === g.categoryId)
                  const pri = PRIORITIES.find(p => p.id === g.priorityId)
                  return (
                    <tr key={g.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-slate-400 text-xs">{i + 1}</td>
                      <td className="px-4 py-3"><span className="font-mono text-xs font-semibold text-blue-600">{g.id}</span></td>
                      <td className="px-4 py-3 max-w-[220px] truncate"><span className="font-medium text-slate-800">{g.title}</span></td>
                      <td className="px-4 py-3 text-xs text-slate-500">{cat?.name}</td>
                      <td className="px-4 py-3"><span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${PRI_CSS[g.priorityId]}`}>{pri?.name}</span></td>
                      <td className="px-4 py-3"><span className={`inline-flex items-center px-2 py-0.5 rounded text-[11.5px] font-medium ${ST_CSS[g.statusId]}`}>{st?.name}</span></td>
                      <td className="px-4 py-3 text-xs text-slate-400">{g.date}</td>
                      <td className="px-4 py-3"><button onClick={() => navigate(`/grievances/${g.id}`)} className="px-2.5 py-1 bg-transparent text-blue-600 border border-blue-600 text-xs font-medium rounded hover:bg-blue-50 transition-colors">View</button></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
