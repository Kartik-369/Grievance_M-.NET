import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { fetchGrievanceById } from './grievanceApi'
import { StatusBadge, PriorityBadge } from './GrievanceStatusBadge'

export default function GrievanceDetail({ user }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [grievance, setGrievance] = useState(null)

  useEffect(() => {
    fetchGrievanceById(id).then(setGrievance).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="p-10 text-center"><Loader2 size={24} className="animate-spin" /></div>
  if (!grievance) return <div>Not found</div>

  return (
    <div className="max-w-4xl">
      <button onClick={() => navigate(-1)} className="mb-4"><ArrowLeft size={16} /></button>
      <h1 className="text-xl font-bold">{grievance.title}</h1>
      <p className="mt-2 text-sm text-slate-700">{grievance.description}</p>
    </div>
  )
}
