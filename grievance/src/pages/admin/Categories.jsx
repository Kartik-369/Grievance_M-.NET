import { useState } from 'react'
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react'
import { CATEGORIES as INIT } from '../../data/dummy'

export default function Categories() {
  const [cats,  setCats]  = useState(INIT)
  const [modal, setModal] = useState(null)
  const [name,  setName]  = useState('')
  const [err,   setErr]   = useState('')

  const openAdd = () => {
    setName('')
    setErr('')
    setModal('add')
  }

  const openEdit = (c) => {
    setName(c.name)
    setErr('')
    setModal(c)
  }

  const close = () => {
    setModal(null)
  }

  const handleNameChange = (e) => {
    setName(e.target.value)
  }

  const save = () => {
    if (!name.trim()) {
      setErr('Name is required.')
      return
    }
    if (modal === 'add') {
      setCats(c => [...c, { id: Date.now(), name: name.trim(), css: 'bg-blue-100 text-blue-800' }])
    } else {
      setCats(c => c.map(x => {
        if (x.id === modal.id) {
          return { ...x, name: name.trim() }
        }
        return x
      }))
    }
    close()
  }

  const remove = (id) => {
    setCats(c => c.filter(x => x.id !== id))
  }

  return (
    <div className="animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
        <div>
          <div className="text-lg font-bold text-slate-900">Categories</div>
          <div className="text-[13px] text-slate-500 mt-0.5">{cats.length} categories</div>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors"><Plus size={13} /> Add Category</button>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-2.5">#</th>
                <th className="px-4 py-2.5">Category Name</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {cats.map((c, i) => {
                const handleEdit = () => {
                  openEdit(c)
                }
                const handleRemove = () => {
                  remove(c.id)
                }
                return (
                  <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-400 text-xs">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{c.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={handleEdit} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded transition-colors"><Edit2 size={12} /></button>
                        <button onClick={handleRemove} className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded transition-colors"><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg w-full max-w-[420px] shadow-xl">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
              <span className="font-bold text-[14px] text-slate-900">{modal === 'add' ? 'Add Category' : 'Edit Category'}</span>
              <button onClick={close} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"><X size={16} /></button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category Name</label>
                <input className="w-full border border-slate-300 rounded-md px-3 py-2 text-[13.5px] text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors" value={name} onChange={handleNameChange} placeholder="e.g. Academic" />
                {err && <div className="text-[12px] text-red-600 mt-1.5">{err}</div>}
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={save} className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-[13px] font-medium rounded-md hover:bg-blue-700 transition-colors"><Check size={13} /> Save</button>
                <button onClick={close} className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-transparent text-slate-700 border border-slate-300 text-[13px] font-medium rounded-md hover:bg-slate-50 transition-colors">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
