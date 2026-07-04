import { useState } from 'react'
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react'
import { CATEGORIES as INIT } from '../../data/dummy'

export default function Categories() {
  const [cats, setCats]   = useState(INIT)
  const [modal, setModal] = useState(null)
  const [form, setForm]   = useState({ name: '', css: '' })
  const [err, setErr]     = useState('')

  const openAdd  = () => { setForm({ name: '', css: '' }); setErr(''); setModal('add') }
  const openEdit = (c) => { setForm({ name: c.name, css: c.css }); setErr(''); setModal(c) }
  const close    = () => setModal(null)
  const set      = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const save = () => {
    if (!form.name.trim()) { setErr('Name is required'); return }
    if (modal === 'add') {
      setCats(c => [...c, { id: Date.now(), name: form.name, css: form.css || 'badge-inprogress' }])
    } else {
      setCats(c => c.map(x => x.id === modal.id ? { ...x, ...form } : x))
    }
    close()
  }

  const remove = (id) => setCats(c => c.filter(x => x.id !== id))

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-black text-gray-800">Grievance Categories</h1>
          <p className="text-xs text-gray-500 mt-0.5">{cats.length} categories defined</p>
        </div>
        <button id="add-category-btn" onClick={openAdd} className="btn-primary btn-sm">
          <Plus size={13} /> Add Category
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr><th>#</th><th>Category Name</th><th>Preview</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {cats.map((c, i) => (
              <tr key={c.id}>
                <td className="text-gray-400 text-xs">{i + 1}</td>
                <td className="font-semibold text-sm">{c.name}</td>
                <td><span className={`badge ${c.css}`}>{c.name}</span></td>
                <td>
                  <div className="flex gap-1.5">
                    <button id={`edit-cat-${c.id}`} onClick={() => openEdit(c)} className="btn-outline btn-sm p-1.5"><Edit2 size={12}/></button>
                    <button id={`del-cat-${c.id}`} onClick={() => remove(c.id)} className="btn-sm p-1.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-md transition-colors"><Trash2 size={12}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 m-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-gray-800">{modal === 'add' ? 'Add Category' : 'Edit Category'}</h3>
              <button onClick={close} className="text-gray-400 hover:text-gray-600"><X size={18}/></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="form-label">Category Name</label>
                <input id="cat-name" className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Academic" />
                {err && <p className="text-xs text-red-500 mt-1">{err}</p>}
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button id="save-cat-btn" onClick={save} className="btn-primary flex-1 justify-center"><Check size={13}/> Save</button>
              <button onClick={close} className="btn-outline flex-1 justify-center">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
