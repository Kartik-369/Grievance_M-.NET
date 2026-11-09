import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { createGrievance, fetchCategories, fetchPriorities } from './grievanceApi'

export default function AddGrievance({ user }) {
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [priorities, setPriorities] = useState([])
  const [loadingMeta, setLoadingMeta] = useState(true)

  const [form, setForm] = useState({
    title: '',
    categoryId: '',
    priorityId: '',
    description: '',
  })

  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    async function loadMeta() {
      try {
        const [cats, pris] = await Promise.all([
          fetchCategories(),
          fetchPriorities(),
        ])
        setCategories(cats)
        setPriorities(pris)
      } catch (e) {
        console.error('Failed to load metadata:', e)
      } finally {
        setLoadingMeta(false)
      }
    }
    loadMeta()
  }, [])

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }))
    if (errors[k]) {
      setErrors((e) => ({ ...e, [k]: null }))
    }
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim()) {
      e.title = 'Title is required'
    } else if (form.title.trim().length > 200) {
      e.title = 'Title cannot exceed 200 characters'
    }

    if (!form.categoryId) {
      e.categoryId = 'Please select a category'
    }

    if (!form.priorityId) {
      e.priorityId = 'Please select a priority level'
    }

    if (!form.description.trim()) {
      e.description = 'Description is required'
    }

    return e
  }

  const submit = async (e) => {
    e.preventDefault()
    setServerError('')

    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        raisedBy: user?.userId || 2,
        categoryId: Number(form.categoryId),
        priorityId: Number(form.priorityId),
        statusId: 1, // Pending
      }

      await createGrievance(payload)
      setSubmitted(true)
      setTimeout(() => navigate('/grievances'), 1400)
    } catch (err) {
      console.error('Submission error:', err)
      setServerError(err.message || 'Failed to submit grievance. Please verify details.')
    } finally {
      setSubmitting(false)
    }
  }

  const goBack = () => navigate(-1)

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
          <CheckCircle2 size={28} />
        </div>
        <div className="font-bold text-lg text-slate-900">Grievance Submitted Successfully</div>
        <div className="text-[13px] text-slate-500">Redirecting to your grievances list...</div>
      </div>
    )
  }

  
  return (
    <div className="animate-in fade-in duration-200 max-w-2xl mx-auto lg:mx-0">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={goBack}
          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <div className="text-lg font-bold text-slate-900">New Grievance</div>
          <div className="text-[13px] text-slate-500 mt-0.5">
            Submitting as <span className="font-semibold text-slate-700">{user?.name || user?.firstName}</span>
          </div>
        </div>
      </div>

      {/* RaisedBy info pill */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-5 text-[13px] text-blue-800">
        <span className="font-semibold">Raised by:</span> {user?.firstName} {user?.lastName} &middot; {user?.email}
      </div>

      {serverError && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle size={15} />
          <span>{serverError}</span>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Title <span className="text-red-500">*</span>
              </label>
              <span className={`text-[11px] ${titleCharsLeft < 20 ? 'text-rose-600 font-semibold' : 'text-slate-400'}`}>
                {titleCharsLeft} chars left
              </span>
            </div>
            <input
              type="text"
              className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                errors.title ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600'
              }`}
              placeholder="Brief summary of the issue (max 200 characters)"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              maxLength={200}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                  errors.categoryId ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600'
                }`}
                value={form.categoryId}
                onChange={(e) => set('categoryId', e.target.value)}
                disabled={loadingMeta}
              >
                <option value="">{loadingMeta ? 'Loading categories...' : 'Select Category'}</option>
                {categories.map((c) => (
                  <option key={c.id || c.categoryId} value={c.id || c.categoryId}>
                    {c.name || c.categoryName}
                  </option>
                ))}
              </select>
              {errors.categoryId && <p className="text-xs text-red-500 mt-1">{errors.categoryId}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                Priority <span className="text-red-500">*</span>
              </label>
              <select
                className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                  errors.priorityId ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600'
                }`}
                value={form.priorityId}
                onChange={(e) => set('priorityId', e.target.value)}
                disabled={loadingMeta}
              >
                <option value="">{loadingMeta ? 'Loading priorities...' : 'Select Priority'}</option>
                {priorities.map((p) => (
                  <option key={p.id || p.priorityId} value={p.id || p.priorityId}>
                    {p.name || p.priorityName}
                  </option>
                ))}
              </select>
              {errors.priorityId && <p className="text-xs text-red-500 mt-1">{errors.priorityId}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={5}
              className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                errors.description ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600'
              }`}
              placeholder="Describe your grievance in detail including relevant dates, locations, or affected departments..."
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={goBack}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium rounded-md transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-70 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Submitting...
                </>
              ) : (
                'Submit Grievance'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

