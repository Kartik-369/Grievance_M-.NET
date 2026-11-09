import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Loader2, ChevronLeft, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react'
import { fetchGrievances, deleteGrievance, fetchCategories, fetchStatuses, fetchPriorities } from './grievanceApi'
import GrievanceFilters from './GrievanceFilters'
import GrievanceCard from './GrievanceCard'

export default function GrievanceList({ user }) {
  const navigate = useNavigate()
  const isAdmin = user?.role === 'Admin'
  const [loading, setLoading] = useState(true)
  const [list, setList] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [categories, setCategories] = useState([])
  const [statuses, setStatuses] = useState([])
  const [priorities, setPriorities] = useState([])
  const [filters, setFilters] = useState({ categoryId: '', statusId: '', priorityId: '', searchTitle: '', from: '2026-01-01', to: '2026-12-31' })

  useEffect(() => {
    Promise.all([fetchCategories(), fetchStatuses(), fetchPriorities()]).then(([c, s, p]) => {
      setCategories(c); setStatuses(s); setPriorities(p)
    })
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchGrievances({ pageNumber: page, pageSize: 10, ...filters })
      setList(res?.items || [])
      setTotalPages(res?.totalPages || 1)
      setTotalCount(res?.totalCount || (res?.items || []).length)
    } finally { setLoading(false) }
  }, [page, filters])

  useEffect(() => { load() }, [load])

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-lg font-bold">{isAdmin ? 'All Grievances' : 'My Grievances'}</h1>
      </div>
      <GrievanceFilters categories={categories} statuses={statuses} priorities={priorities} filters={filters} onChange={(k, v) => setFilters(f => ({ ...f, [k]: v }))} onReset={() => setFilters({})} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {list.map(g => <GrievanceCard key={g.id || g.grievanceId} grievance={g} isAdmin={isAdmin} />)}
      </div>
    </div>
  )
}
