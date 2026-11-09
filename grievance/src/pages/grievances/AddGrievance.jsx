import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import { fetchCategories, fetchPriorities } from './grievanceApi'

export default function AddGrievance({ user }) {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [priorities, setPriorities] = useState([])
  const [loadingMeta, setLoadingMeta] = useState(true)
  const [form, setForm] = useState({ title: '', categoryId: '', priorityId: '', description: '' })
  const [errors, setErrors] = useState({})

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

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    if (errors[k]) setErrors(e => ({ ...e, [k]: null }))
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    else if (form.title.trim().length > 200) e.title = 'Title cannot exceed 200 characters'
    if (!form.categoryId) e.categoryId = 'Please select a category'
    if (!form.priorityId) e.priorityId = 'Please select a priority'
    if (!form.description.trim()) e.description = 'Description is required'
    return e
  }

  const goBack = () => navigate(-1)

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={goBack}><ArrowLeft size={16} /></button>
        <div className="text-lg font-bold">New Grievance</div>
      </div>
      <div className="bg-white border p-6 rounded">
        <div>Title: <input value={form.title} onChange={e => set('title', e.target.value)} /></div>
      </div>
    </div>
  )
}
