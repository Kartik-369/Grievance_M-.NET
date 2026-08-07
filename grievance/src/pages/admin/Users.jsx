import { useState } from 'react'
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react'

// Matches backend User model:
// { UserId, RoleId, FirstName, LastName, Email, Password, IsActive, ProfilePicturePath }
const INIT = [
  { id: 1, roleId: 1, firstName: 'Kartik', lastName: 'P',  email: 'admin@g.com',   password: '',  isActive: true  },
  { id: 2, roleId: 2, firstName: 'Kartike',  lastName: 'P',   email: 'kp@g.com',   password: '',  isActive: true  },
  { id: 3, roleId: 2, firstName: 'Kartikey',  lastName: 'P',    email: 'kep@g.com',   password: '',  isActive: false },
]

const ROLES = [
  { id: 1, name: 'Admin'   },
  { id: 2, name: 'Student' },
]

const ROLE_CSS = {
  1: 'bg-purple-100 text-purple-800',
  2: 'bg-green-100 text-green-800',
}

const getRoleName = (roleId) => ROLES.find(r => r.id === roleId)?.name ?? 'Unknown'

const EMPTY_FORM = { roleId: 2, firstName: '', lastName: '', email: '', password: '', isActive: true }

// Admin-only: full CRUD on api/user
export default function Users() {
  const [users, setUsers] = useState(INIT)
  const [modal, setModal] = useState(null)   // null | 'add' | user-object
  const [form,  setForm]  = useState(EMPTY_FORM)
  const [err,   setErr]   = useState('')
  const [showPwd, setShowPwd] = useState(false)

  const openAdd = () => {
    setForm(EMPTY_FORM)
    setErr('')
    setShowPwd(false)
    setModal('add')
  }

  const openEdit = (u) => {
    setForm({ ...u, password: '' })
    setErr('')
    setShowPwd(false)
    setModal(u)
  }

  const close = () => setModal(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleFirstNameChange = (e) => set('firstName', e.target.value)
  const handleLastNameChange  = (e) => set('lastName',  e.target.value)
  const handleEmailChange     = (e) => set('email',     e.target.value)
  const handlePasswordChange  = (e) => set('password',  e.target.value)
  const handleRoleChange      = (e) => set('roleId',    +e.target.value)
  const handleActiveChange    = (e) => set('isActive',  e.target.checked)
  const togglePwd             = ()  => setShowPwd(s => !s)

  const save = () => {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      setErr('First name, last name and email are required.')
      return
    }
    if (modal === 'add' && !form.password.trim()) {
      setErr('Password is required for new users.')
      return
    }
    if (modal === 'add') {
      // POST api/user
      setUsers(u => [...u, { ...form, id: Date.now() }])
    } else {
      // PUT api/user/{id}
      setUsers(u => u.map(x => x.id === modal.id ? { ...modal, ...form } : x))
    }
    close()
  }

  const remove = (id) => {
    // DELETE api/user/{id}
    setUsers(u => u.filter(x => x.id !== id))
  }

  return (
    <div className="animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
        <div>
          <div className="text-lg font-bold text-slate-900">User Management</div>
          <div className="text-[13px] text-slate-500 mt-0.5">{users.length} users</div>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={13} /> Add User
        </button>
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
              {users.map((u, i) => {
                const handleEdit   = () => openEdit(u)
                const handleRemove = () => remove(u.id)
                return (
                  <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-400 text-xs">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{u.firstName} {u.lastName}</div>
                    </td>
                    <td className="px-4 py-3 text-[12.5px] text-slate-500">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11.5px] font-medium ${ROLE_CSS[u.roleId]}`}>
                        {getRoleName(u.roleId)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11.5px] font-medium ${
                        u.isActive ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {u.isActive ? 'Active' : 'Inactive'}
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
          <div className="bg-white rounded-lg w-full max-w-[440px] shadow-xl">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
              <span className="font-bold text-[14px] text-slate-900">
                {modal === 'add' ? 'Add User' : 'Edit User'}
              </span>
              <button onClick={close} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              {/* FirstName + LastName — matches User model */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">First Name</label>
                  <input
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-[13px] text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                    value={form.firstName}
                    onChange={handleFirstNameChange}
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Last Name</label>
                  <input
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-[13px] text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                    value={form.lastName}
                    onChange={handleLastNameChange}
                    placeholder="Last name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
                <input
                  type="email"
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-[13px] text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                  value={form.email}
                  onChange={handleEmailChange}
                  placeholder="Email address"
                />
              </div>

              {/* Password — only shown for new user (add) or if admin wants to reset */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Password {modal !== 'add' && <span className="text-slate-400 normal-case font-normal">(leave blank to keep current)</span>}
                </label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-[13px] text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors pr-10"
                    value={form.password}
                    onChange={handlePasswordChange}
                    placeholder={modal === 'add' ? 'Set password' : 'New password'}
                  />
                  <button
                    type="button"
                    onClick={togglePwd}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-[11px]"
                  >
                    {showPwd ? 'hide' : 'show'}
                  </button>
                </div>
              </div>

              {/* Role — maps to RoleId */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Role</label>
                <select
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-[13px] text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                  value={form.roleId}
                  onChange={handleRoleChange}
                >
                  {ROLES.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              {/* IsActive */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={handleActiveChange}
                  className="accent-blue-600 w-3.5 h-3.5"
                />
                <span className="text-[13px] font-medium text-slate-700">Active</span>
              </label>

              {err && <div className="text-[12px] text-red-600">{err}</div>}

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
