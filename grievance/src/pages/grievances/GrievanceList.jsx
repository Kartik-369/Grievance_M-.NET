import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Loader2, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import { fetchGrievances, deleteGrievance } from './grievanceApi'

export default function GrievanceList({ user }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [list, setList] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchGrievances({ pageNumber: page, pageSize: 10 })
      setList(res?.items || [])
      setTotalPages(res?.totalPages || 1)
    } finally { setLoading(false) }
  }, [page])

  useEffect(() => { load() }, [load])

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-lg font-bold">Grievances</h1>
      </div>
      {loading ? <div className="py-10 text-center"><Loader2 size={24} className="animate-spin" /></div> : (
        <div className="space-y-3">
          {list.map(g => <div key={g.id || g.grievanceId} className="p-3 bg-white border rounded">{g.title}</div>)}
        </div>
      )}
    </div>
  )
}
