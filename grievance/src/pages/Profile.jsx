import { useState } from 'react'
import { Check, Shield, GraduationCap } from 'lucide-react'

const ROLE_META = {
  Admin:   { label: 'Admin',   icon: Shield,         css: 'bg-purple-100 text-purple-800' },
  Student: { label: 'Student', icon: GraduationCap,  css: 'bg-green-100 text-green-800'  },
}

export default function Profile({ user }) {
  const [form, setForm] = useState({
    firstName: user?.firstName || 'Kartik',
    lastName:  user?.lastName  || '',
    email:     user?.email     || 'user@gms.com',
    mobile:    '9876543210',
  })
  const [saved, setSaved] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleFirstNameChange = (e) => set('firstName', e.target.value)
  const handleLastNameChange  = (e) => set('lastName',  e.target.value)
  const handleEmailChange     = (e) => set('email',     e.target.value)
  const handleMobileChange    = (e) => set('mobile',    e.target.value)

  const save = (e) => {
    e.preventDefault()
    // PUT api/user/{user.userId}
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const initials = `${form.firstName.slice(0, 1)}${form.lastName.slice(0, 1)}`.toUpperCase() || 'U'
  const roleMeta = ROLE_META[user?.role] || ROLE_META.Student
  const RoleIcon = roleMeta.icon

  return (
    <div className="animate-in fade-in duration-200 max-w-[500px]">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
        <div>
          <div className="text-lg font-bold text-slate-900">Profile</div>
          <div className="text-[13px] text-slate-500 mt-0.5">Manage your account information</div>
        </div>
      </div>

      {/* Avatar + role card */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 mb-4 flex items-center gap-4 shadow-sm">
        <div className="w-[52px] h-[52px] rounded-full bg-blue-900 flex items-center justify-center text-[18px] font-bold text-white shrink-0">
          {initials}
        </div>
        <div>
          <div className="font-bold text-[15px] text-slate-900">
            {form.firstName} {form.lastName}
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11.5px] font-medium ${roleMeta.css}`}>
              <RoleIcon size={11} />
              {roleMeta.label}
            </span>
            {user?.isActive !== false && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11.5px] font-medium bg-green-100 text-green-800">
                Active
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <form onSubmit={save} className="flex flex-col gap-4">
          {/* FirstName + LastName — matches User model */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">First Name</label>
              <input
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-[13.5px] text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                value={form.firstName}
                onChange={handleFirstNameChange}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Last Name</label>
              <input
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-[13.5px] text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                value={form.lastName}
                onChange={handleLastNameChange}
              />
            </div>
          </div>

          {/* Email — matches User.Email */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
            <input
              type="email"
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-[13.5px] text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
              value={form.email}
              onChange={handleEmailChange}
            />
          </div>

          {/* Mobile (not in model yet, shown as extra) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mobile</label>
            <input
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-[13.5px] text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
              value={form.mobile}
              onChange={handleMobileChange}
            />
          </div>

          {/* Role — read-only, from User.RoleId */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Role</label>
            <input
              className="w-full border border-slate-200 rounded-md px-3 py-2 text-[13.5px] text-slate-400 bg-slate-50 cursor-not-allowed"
              value={user?.role || ''}
              readOnly
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-white text-[13px] font-medium rounded-md transition-colors ${
                saved ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {saved ? <><Check size={13} /> Saved</> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
