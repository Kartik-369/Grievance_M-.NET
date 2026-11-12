import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2, Clock } from 'lucide-react'
import { fetchGrievanceById, fetchGrievanceHistory } from './grievanceApi'
import { StatusBadge, PriorityBadge } from './GrievanceStatusBadge'
import GrievanceTimeline from './GrievanceTimeline'

export default function GrievanceDetail({ user }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [grievance, setGrievance] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    Promise.all([fetchGrievanceById(id), fetchGrievanceHistory(id)]).then(([g, h]) => {
      setGrievance(g)
      setHistory(h.length ? h : g?.history || [])
    }).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="p-10 text-center"><Loader2 size={24} className="animate-spin" /></div>
  if (!grievance) return <div>Not found</div>

  return (
    <div className="max-w-4xl">
      <button onClick={() => navigate(-1)} className="mb-4"><ArrowLeft size={16} /></button>
      <h1 className="text-xl font-bold">{grievance.title}</h1>
      <p className="mt-2 text-sm text-slate-700">{grievance.description}</p>
      <div className="mt-6">
        <h2 className="text-xs font-bold uppercase mb-3"><Clock size={13} className="inline mr-1" /> Status History</h2>
        <GrievanceTimeline history={history} />
      </div>
    </div>
  )
}
