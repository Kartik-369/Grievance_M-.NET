import { useNavigate } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { GRIEVANCES, STATUSES, CATEGORIES, PRIORITIES } from '../../data/dummy'

const getStatus   = id => STATUSES.find(s => s.id === id)
const getCategory = id => CATEGORIES.find(c => c.id === id)
const getPriority = id => PRIORITIES.find(p => p.id === id)

// Agent sees only in-progress grievances (assigned)
const MY_ASSIGNMENTS = GRIEVANCES.filter(g => g.statusId === 2)

export default function Assignments({ user }) {
  const navigate = useNavigate()

  return (
    <div className="animate-fade-in">
      <div className="mb-5">
        <h1 className="text-xl font-black text-gray-800">My Assignments</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          {user?.name} · {MY_ASSIGNMENTS.length} active assignment{MY_ASSIGNMENTS.length !== 1 ? 's' : ''}
        </p>
      </div>

      {MY_ASSIGNMENTS.length === 0 ? (
        <div className="card p-10 text-center text-gray-400">
          <p className="font-semibold">No active assignments</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="data-table">
            <thead>
              <tr><th>#</th><th>Grievance ID</th><th>Title</th><th>Category</th><th>Priority</th><th>Status</th><th>Date</th><th>Action</th></tr>
            </thead>
            <tbody>
              {MY_ASSIGNMENTS.map((g, i) => {
                const st  = getStatus(g.statusId)
                const cat = getCategory(g.categoryId)
                const pri = getPriority(g.priorityId)
                return (
                  <tr key={g.id}>
                    <td className="text-gray-400 text-xs">{i + 1}</td>
                    <td><span className="font-mono text-xs font-bold text-[var(--navy)]">{g.id}</span></td>
                    <td><span className="font-medium text-sm">{g.title}</span></td>
                    <td><span className="text-xs text-gray-500">{cat?.name}</span></td>
                    <td><span className={`badge ${pri?.css}`}>{pri?.name}</span></td>
                    <td><span className={`badge ${st?.css}`}>{st?.name}</span></td>
                    <td><span className="text-xs text-gray-400">{g.date}</span></td>
                    <td>
                      <button id={`view-assign-${g.id}`} onClick={() => navigate(`/grievances/${g.id}`)}
                        className="btn-outline btn-sm"><Eye size={12}/> View</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
