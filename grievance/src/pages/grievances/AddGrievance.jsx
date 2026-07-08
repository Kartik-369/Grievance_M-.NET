import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { CATEGORIES } from '../../data/dummy'

const PRIORITIES = [
  { id: 1, name: 'Low' }, { id: 2, name: 'Medium' },
  { id: 3, name: 'High' }, { id: 4, name: 'Critical' },
]

export default function AddGrievance() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ title: '', categoryId: '', priorityId: '', description: '' })
  const [errors, setErrors]   = useState({})
  const [submitted, setSubmitted] = useState(false)

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim()) {
      e.title = 'Required'
    }
    if (!form.categoryId) {
      e.categoryId = 'Required'
    }
    if (!form.priorityId) {
      e.priorityId = 'Required'
    }
    if (!form.description.trim()) {
      e.description = 'Required'
    }
    return e
  }

  const submit = (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) {
      setErrors(e2)
      return
    }
    setSubmitted(true)
    setTimeout(() => {
      navigate('/grievances')
    }, 1500)
  }

  const handleTitleChange = (e) => {
    set('title', e.target.value)
  }

  const handleCatChange = (e) => {
    set('categoryId', e.target.value)
  }

  const handlePriChange = (e) => {
    set('priorityId', e.target.value)
  }

  const handleDescChange = (e) => {
    set('description', e.target.value)
  }

  const goBack = () => {
    navigate(-1)
  }

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-xl text-green-600 font-bold">
          &#10003;
        </div>
        <div className="font-bold text-lg text-slate-900">Grievance Submitted</div>
        <div className="text-[13px] text-slate-500">Redirecting...</div>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in duration-200 max-w-2xl mx-auto lg:mx-0">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={goBack} className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors">
          <ArrowLeft size={16} />
        </button>
        <div>
          <div className="text-lg font-bold text-slate-900">New Grievance</div>
          <div className="text-[13px] text-slate-500 mt-0.5">Fill in the details and submit</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        <form onSubmit={submit} className="flex flex-col gap-5">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Title</label>
            <input 
              className={`w-full border rounded-md px-3 py-2 text-[13.5px] text-slate-900 focus:outline-none focus:ring-1 transition-colors ${errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600'}`}
              placeholder="Brief title for your grievance"
              value={form.title} 
              onChange={handleTitleChange} 
            />
            {errors.title && <div className="text-[11.5px] text-red-600 mt-1">{errors.title}</div>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
              <select 
                className={`w-full border rounded-md px-3 py-2 text-[13.5px] focus:outline-none focus:ring-1 transition-colors ${errors.categoryId ? 'border-red-500 focus:border-red-500 focus:ring-red-500 text-slate-900' : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600 text-slate-900'}`}
                value={form.categoryId} 
                onChange={handleCatChange}>
                <option value="">Select</option>
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.categoryId && <div className="text-[11.5px] text-red-600 mt-1">{errors.categoryId}</div>}
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Priority</label>
              <select 
                className={`w-full border rounded-md px-3 py-2 text-[13.5px] focus:outline-none focus:ring-1 transition-colors ${errors.priorityId ? 'border-red-500 focus:border-red-500 focus:ring-red-500 text-slate-900' : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600 text-slate-900'}`}
                value={form.priorityId} 
                onChange={handlePriChange}>
                <option value="">Select</option>
                {PRIORITIES.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              {errors.priorityId && <div className="text-[11.5px] text-red-600 mt-1">{errors.priorityId}</div>}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
            <textarea 
              className={`w-full border rounded-md px-3 py-2 text-[13.5px] text-slate-900 focus:outline-none focus:ring-1 transition-colors resize-y ${errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600'}`}
              rows={5} 
              placeholder="Describe your grievance in detail"
              value={form.description} 
              onChange={handleDescChange}
            />
            {errors.description && <div className="text-[11.5px] text-red-600 mt-1">{errors.description}</div>}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Attachments (Optional)</label>
            <input 
              type="file"
              multiple
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-[13.5px] text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-[12px] file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
            />
            <div className="text-[11px] text-slate-400 mt-1.5">You can attach photos, documents, or PDFs (max 5MB).</div>
          </div>

          <div className="flex gap-2.5 pt-2">
            <button type="submit" className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-[13px] font-medium rounded-md hover:bg-blue-700 transition-colors">Submit</button>
            <button type="button" onClick={goBack} className="inline-flex items-center justify-center px-4 py-2 bg-transparent text-slate-700 border border-slate-300 text-[13px] font-medium rounded-md hover:bg-slate-50 transition-colors">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
