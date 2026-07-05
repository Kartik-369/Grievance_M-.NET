import { useState } from 'react'
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react'

const INIT = [
  { id: 1, name: 'Kartik Balkrishna', email: 'kartik@example.com', role: 'Admin',   active: true },
  { id: 2, name: 'Kartik Balkrishna', email: 'kartik.a@example.com', role: 'Agent',   active: true },
  { id: 3, name: 'Kartik Balkrishna', email: 'kartik.s@example.com', role: 'Student', active: true },
]
const ROLES = ['Admin', 'Agent', 'Student']
const ROLE_CSS = { 
  Admin: 'bg-purple-100 text-purple-800', 
  Agent: 'bg-blue-100 text-blue-800', 
  Student: 'bg-green-100 text-green-800' 
}

export default function Users() {
  const [users,  setUsers]  = useState(INIT)
  const [modal,  setModal]  = useState(null)
  const [form,   setForm]   = useState({ name: '', email: '', role: 'Student', active: true })
  const [err,    setErr]    = useState('')

  const openAdd  = () => { setForm({ name: '', email: '', role: 'Student', active: true }); setErr(''); setModal('add') }
  const openEdit = u => { setForm({ ...u }); setErr(''); setModal(u) }
  const close    = () => setModal(null)
  const set      = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const save = () => {
    if (!form.name.trim() || !form.email.trim()) { setErr('Name and email are required.'); return }
    if (modal === 'add') setUsers(u => [...u, { ...form, id: Date.now() }])
    else setUsers(u => u.map(x => x.id === modal.id ? { ...modal, ...form } : x))
    close()
  }

  const remove = id => setUsers(u => u.filter(x => x.id !== id))

  return (
    <div className="animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
        <div>
          <div className="text-lg font-bold text-slate-900">User Management</div>
          <div className="text-[13px] text-slate-500 mt-0.5">{users.length} users</div>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors"><Plus size={13} /> Add User</button>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-2.5">#</th>
                <th className="px-4 py-2.5">Name</th>
                <th className="px-4 py-2.5">Email</th>
                <th className="px-4 py-2.5">Role</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {users.map((u, i) => (
                <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-400 text-xs">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{u.name}</td>
                  <td className="px-4 py-3 text-[12.5px] text-slate-500">{u.email}</td>
                  <td className="px-4 py-3"><span className={`inline-flex items-center px-2 py-0.5 rounded text-[11.5px] font-medium ${ROLE_CSS[u.role]}`}>{u.role}</span></td>
                  <td className="px-4 py-3"><span className={`inline-flex items-center px-2 py-0.5 rounded text-[11.5px] font-medium ${u.active ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}`}>{u.active ? 'Active' : 'Inactive'}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(u)} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded transition-colors"><Edit2 size={12} /></button>
                      <button onClick={() => remove(u.id)} className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded transition-colors"><Trash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg w-full max-w-[420px] shadow-xl">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
              <span className="font-bold text-[14px] text-slate-900">{modal === 'add' ? 'Add User' : 'Edit User'}</span>
              <button onClick={close} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"><X size={16} /></button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                <input className="w-full border border-slate-300 rounded-md px-3 py-2 text-[13.5px] text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Full name" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
                <input className="w-full border border-slate-300 rounded-md px-3 py-2 text-[13.5px] text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="Email" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Role</label>
                <select className="w-full border border-slate-300 rounded-md px-3 py-2 text-[13.5px] text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors" value={form.role} onChange={e => set('role', e.target.value)}>
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer mt-1">
                <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} className="accent-blue-600 w-3.5 h-3.5" />
                <span className="text-[13px] font-medium text-slate-700">Active</span>
              </label>
              {err && <div className="text-[12px] text-red-600">{err}</div>}
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
