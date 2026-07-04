import { useState } from 'react'
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react'

// Initial data local to this page
const INIT_USERS = [
  { id: 1, name: 'Kartik Balkrishna', email: 'kartik@darshan.ac.in', role: 'Admin',   active: true },
  { id: 2, name: 'Kartik Balkrishna', email: 'kartik.agent@darshan.ac.in', role: 'Agent',   active: true },
  { id: 3, name: 'Kartik Balkrishna', email: 'kartik.s@darshan.ac.in', role: 'Student', active: true },
]

const ROLES = ['Admin', 'Agent', 'Student']

export default function Users() {
  const [users, setUsers]   = useState(INIT_USERS)
  const [modal, setModal]   = useState(null) // null | 'add' | user object
  const [form, setForm]     = useState({ name: '', email: '', role: 'Student', active: true })

  const openAdd  = () => { setForm({ name: '', email: '', role: 'Student', active: true }); setModal('add') }
  const openEdit = (u) => { setForm({ ...u }); setModal(u) }
  const closeModal = () => setModal(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const save = () => {
    if (!form.name.trim() || !form.email.trim()) return
    if (modal === 'add') {
      setUsers(u => [...u, { ...form, id: Date.now() }])
    } else {
      setUsers(u => u.map(x => x.id === modal.id ? { ...modal, ...form } : x))
    }
    closeModal()
  }

  const remove = (id) => setUsers(u => u.filter(x => x.id !== id))

  const ROLE_COLOR = { Admin: 'bg-red-100 text-red-700', Agent: 'bg-blue-100 text-blue-700', Student: 'bg-green-100 text-green-700' }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-black text-gray-800">User Management</h1>
          <p className="text-xs text-gray-500 mt-0.5">{users.length} users registered</p>
        </div>
        <button id="add-user-btn" onClick={openAdd} className="btn-primary btn-sm">
          <Plus size={13} /> Add User
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id}>
                <td className="text-gray-400 text-xs">{i + 1}</td>
                <td className="font-semibold text-sm">{u.name}</td>
                <td className="text-xs text-gray-500">{u.email}</td>
                <td><span className={`badge ${ROLE_COLOR[u.role]}`}>{u.role}</span></td>
                <td>
                  <span className={`badge ${u.active ? 'badge-resolved' : 'badge-rejected'}`}>
                    {u.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="flex gap-1.5">
                    <button id={`edit-user-${u.id}`} onClick={() => openEdit(u)} className="btn-outline btn-sm p-1.5">
                      <Edit2 size={12} />
                    </button>
                    <button id={`del-user-${u.id}`} onClick={() => remove(u.id)}
                      className="btn-sm p-1.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-md transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 m-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-gray-800">{modal === 'add' ? 'Add User' : 'Edit User'}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="form-label">Full Name</label>
                <input id="user-name" className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Full name" />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input id="user-email" className="form-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="Email address" />
              </div>
              <div>
                <label className="form-label">Role</label>
                <select id="user-role" className="form-input" value={form.role} onChange={e => set('role', e.target.value)}>
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} className="w-4 h-4 accent-[var(--navy)]" />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>
            <div className="flex gap-2 mt-5">
              <button id="save-user-btn" onClick={save} className="btn-primary flex-1 justify-center">
                <Check size={13} /> Save
              </button>
              <button onClick={closeModal} className="btn-outline flex-1 justify-center">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
