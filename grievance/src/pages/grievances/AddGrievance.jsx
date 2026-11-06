import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { fetchCategories, fetchPriorities } from './grievanceApi'

export default function AddGrievance({ user }) {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [priorities, setPriorities] = useState([])
  const [loadingMeta, setLoadingMeta] = useState(true)
  const [form, setForm] = useState({ title: '', categoryId: '', priorityId: '', description: '' })

  useEffect(() => {
    async function load() {
      try {
        const [cats, pris] = await Promise.all([fetchCategories(), fetchPriorities()])
        setCategories(cats)
        setPriorities(pris)
      } finally { setLoadingMeta(false) }
    }
    load()
  }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const goBack = () => navigate(-1)

  return (
    <div className="animate-in fade-in duration-200 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={goBack} className="p-1.5 text-slate-500 hover:text-slate-900 rounded"><ArrowLeft size={16} /></button>
        <div className="text-lg font-bold text-slate-900">New Grievance</div>
      </div>
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        <div className="text-xs text-slate-500 mb-4">{loadingMeta ? 'Loading metadata...' : 'Fill out details to submit'}</div>
      </div>
    </div>
  )
}
