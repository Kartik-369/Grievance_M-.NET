import { useState } from 'react'
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react'
import { CATEGORIES as INIT_CATS } from '../../data/dummy'

// Matches backend GrievanceCategories model:
// { CategoryId, CategoryName, CssClassName }
const toModel = (c) => ({ id: c.id, categoryName: c.name, cssClassName: c.css })
const toView  = (c) => ({ id: c.id, name: c.categoryName, css: c.cssClassName })

const CSS_OPTIONS = [
  { label: 'Blue (In Progress)',  value: 'badge-inprogress' },
  { label: 'Yellow (Pending)',    value: 'badge-pending'    },
  { label: 'Orange (High)',       value: 'badge-high'       },
  { label: 'Green (Low)',         value: 'badge-low'        },
  { label: 'Gray (Medium)',       value: 'badge-medium'     },
  { label: 'Red (Rejected)',      value: 'badge-rejected'   },
]

const EMPTY_FORM = { categoryName: '', cssClassName: 'badge-inprogress' }

// Admin-only: full CRUD on api/grievancecategory
export default function Categories() {
  const [cats,  setCats]  = useState(INIT_CATS.map(toModel))
  const [modal, setModal] = useState(null)
  const [form,  setForm]  = useState(EMPTY_FORM)
  const [err,   setErr]   = useState('')

  const openAdd = () => {
    setForm(EMPTY_FORM)
    setErr('')
    setModal('add')
  }

  const openEdit = (c) => {
    setForm({ categoryName: c.categoryName, cssClassName: c.cssClassName })
    setErr('')
    setModal(c)
  }

  const close = () => setModal(null)

  const handleNameChange = (e) => setForm(f => ({ ...f, categoryName: e.target.value }))
  const handleCssChange  = (e) => setForm(f => ({ ...f, cssClassName: e.target.value }))

  const save = () => {
    if (!form.categoryName.trim()) {
      setErr('Category name is required.')
      return
    }
    if (modal === 'add') {
      // POST api/grievancecategory
      setCats(c => [...c, { id: Date.now(), ...form }])
    } else {
      // PUT api/grievancecategory/{id}
      setCats(c => c.map(x => x.id === modal.id ? { ...x, ...form } : x))
    }
    close()
  }

  const remove = (id) => {
    // DELETE api/grievancecategory/{id}
    setCats(c => c.filter(x => x.id !== id))
  }

  return (
    <div className="animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
        <div>
          <div className="text-lg font-bold text-slate-900">Categories</div>
          <div className="text-[13px] text-slate-500 mt-0.5">{cats.length} categories</div>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={13} /> Add Category
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-2.5">#</th>
                <th className="px-4 py-2.5">Category Name</th>
                <th className="px-4 py-2.5">CSS Class</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {cats.map((c, i) => {
                const handleEdit   = () => openEdit(c)
                const handleRemove = () => remove(c.id)
                return (
                  <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-400 text-xs">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{c.categoryName}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[11.5px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {c.cssClassName}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={handleEdit}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded transition-colors"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={handleRemove}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg w-full max-w-[420px] shadow-xl">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
              <span className="font-bold text-[14px] text-slate-900">
                {modal === 'add' ? 'Add Category' : 'Edit Category'}
              </span>
              <button onClick={close} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              {/* CategoryName — matches GrievanceCategories.CategoryName */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Category Name
                </label>
                <input
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-[13.5px] text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                  value={form.categoryName}
                  onChange={handleNameChange}
                  placeholder="e.g. Academic"
                />
                {err && <div className="text-[12px] text-red-600 mt-1.5">{err}</div>}
              </div>

              {/* CssClassName — matches GrievanceCategories.CssClassName */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  CSS Class Name
                </label>
                <select
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-[13.5px] text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                  value={form.cssClassName}
                  onChange={handleCssChange}
                >
                  {CSS_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={save}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-[13px] font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Check size={13} /> Save
                </button>
                <button
                  onClick={close}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-transparent text-slate-700 border border-slate-300 text-[13px] font-medium rounded-md hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
