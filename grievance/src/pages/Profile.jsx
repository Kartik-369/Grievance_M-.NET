import { useState } from 'react'
import { User, Mail, Shield, Camera, Check } from 'lucide-react'

export default function Profile({ user }) {
  const [form, setForm]     = useState({ name: user?.name || 'Kartik Balkrishna', email: 'kartik@darshan.ac.in', mobile: '9876543210' })
  const [saved, setSaved]   = useState(false)
  const initials = form.name.split(' ').map(n => n[0]).join('').slice(0, 2)

  const save = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="animate-fade-in max-w-xl">
      <div className="mb-5">
        <h1 className="text-xl font-black text-gray-800">My Profile</h1>
        <p className="text-xs text-gray-500 mt-0.5">View and update your personal information</p>
      </div>

      {/* Avatar */}
      <div className="card p-6 mb-4">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center text-white font-black text-2xl">
              {initials}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-[var(--navy)] rounded-full flex items-center justify-center text-white hover:bg-[var(--navy-light)] transition-colors">
              <Camera size={12} />
            </button>
          </div>
          <div>
            <div className="font-black text-lg text-gray-800">{form.name}</div>
            <div className="flex items-center gap-1.5 mt-1">
              <Shield size={12} className="text-indigo-500" />
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="card p-6">
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="form-label">Full Name</label>
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="form-input pl-9" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="form-label">Email Address</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="form-input pl-9" type="email" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="form-label">Mobile Number</label>
            <input className="form-input" value={form.mobile}
              onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))} />
          </div>
          <div>
            <label className="form-label">Role</label>
            <input className="form-input bg-gray-50 text-gray-400 cursor-not-allowed" value={user?.role || ''} readOnly />
          </div>

          <button id="save-profile-btn" type="submit"
            className={`btn-primary ${saved ? 'bg-green-600' : ''}`}>
            {saved ? <><Check size={13}/> Saved!</> : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
