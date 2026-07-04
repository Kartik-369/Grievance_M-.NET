import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Send } from 'lucide-react'
import { CATEGORIES } from '../../data/dummy'

// Options declared locally — only used on this page
const PRIORITIES = [
  { id: 1, name: 'Low' },
  { id: 2, name: 'Medium' },
  { id: 3, name: 'High' },
  { id: 4, name: 'Critical' },
]

export default function AddGrievance() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', categoryId: '', priorityId: '', description: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const validate = () => {
    const e = {}
    if (!form.title.trim())       e.title       = 'Title is required'
    if (!form.categoryId)         e.categoryId  = 'Please select a category'
    if (!form.priorityId)         e.priorityId  = 'Please select a priority'
    if (!form.description.trim()) e.description = 'Description is required'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    setSubmitted(true)
    setTimeout(() => navigate('/grievances'), 1800)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <span className="text-green-600 text-3xl">✓</span>
        </div>
        <h2 className="text-xl font-black text-gray-800 mb-1">Grievance Submitted!</h2>
        <p className="text-sm text-gray-500">Redirecting to your grievances list...</p>
      </div>
    )
  }

  return (
    <div className="animate-fade-in max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate(-1)} className="btn-outline btn-sm p-2">
          <ArrowLeft size={14} />
        </button>
        <div>
          <h1 className="text-xl font-black text-gray-800">Raise a Grievance</h1>
          <p className="text-xs text-gray-500 mt-0.5">Fill in the details below and submit</p>
        </div>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Title */}
          <div>
            <label className="form-label">Grievance Title <span className="text-red-500">*</span></label>
            <input id="grv-title" type="text" className={`form-input ${errors.title ? 'border-red-400' : ''}`}
              placeholder="Brief title describing your issue"
              value={form.title} onChange={e => set('title', e.target.value)} />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Category + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Category <span className="text-red-500">*</span></label>
              <select id="grv-category" className={`form-input ${errors.categoryId ? 'border-red-400' : ''}`}
                value={form.categoryId} onChange={e => set('categoryId', e.target.value)}>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.categoryId && <p className="text-xs text-red-500 mt-1">{errors.categoryId}</p>}
            </div>
            <div>
              <label className="form-label">Priority <span className="text-red-500">*</span></label>
              <select id="grv-priority" className={`form-input ${errors.priorityId ? 'border-red-400' : ''}`}
                value={form.priorityId} onChange={e => set('priorityId', e.target.value)}>
                <option value="">Select priority</option>
                {PRIORITIES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              {errors.priorityId && <p className="text-xs text-red-500 mt-1">{errors.priorityId}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="form-label">Description <span className="text-red-500">*</span></label>
            <textarea id="grv-description"
              className={`form-input resize-none ${errors.description ? 'border-red-400' : ''}`}
              rows={5} placeholder="Describe your grievance in detail..."
              value={form.description} onChange={e => set('description', e.target.value)} />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button id="submit-grievance" type="submit" className="btn-primary">
              <Send size={13} /> Submit Grievance
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn-outline">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
