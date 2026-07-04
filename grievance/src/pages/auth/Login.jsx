import { useState } from 'react'
import { Eye, EyeOff, Lock, AlertTriangle } from 'lucide-react'

const ROLES = ['Admin', 'Agent', 'Student']

export default function Login({ onLogin }) {
  const [role, setRole]       = useState('Student')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (password !== 'abc') {
      setError('Incorrect password. Hint: abc')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onLogin(role)
    }, 500)
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>

      {/* ── Left panel ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-2/5 p-12"
        style={{ background: 'linear-gradient(160deg,#111e36 0%,#1a2d4f 55%,#243a62 100%)' }}
      >
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
              <span className="text-white font-black text-sm">DU</span>
            </div>
            <div>
              <div className="text-white font-black text-lg tracking-wide">DARSHAN</div>
              <div className="text-white/50 text-xs tracking-widest">UNIVERSITY</div>
            </div>
          </div>

          <h1 className="text-4xl font-black text-white leading-tight mb-4">
            Grievance<br />
            <span className="text-red-400">Management</span><br />
            Portal
          </h1>
          <p className="text-white/55 text-sm leading-relaxed max-w-xs">
            Raise, track and resolve institutional grievances with full audit trail and role-based access.
          </p>
        </div>

        <div className="space-y-3">
          {['Role-based dashboards', 'Real-time status tracking', 'Full status history audit', 'Category-wise routing'].map(f => (
            <div key={f} className="flex items-center gap-2.5 text-white/65 text-sm">
              <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
                <span className="text-green-400 text-[10px]">✓</span>
              </div>
              {f}
            </div>
          ))}
        </div>

        <p className="text-white/25 text-xs">© 2026–27 Darshan University</p>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">

          {/* mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center">
              <span className="text-white font-black text-xs">DU</span>
            </div>
            <div>
              <div className="font-black text-base" style={{ color: 'var(--navy)' }}>DARSHAN UNIVERSITY</div>
              <div className="text-gray-500 text-[10px]">Grievance Portal</div>
            </div>
          </div>

          <div className="card p-8">
            <h2 className="text-xl font-black text-gray-800 mb-0.5">Sign In</h2>
            <p className="text-xs text-gray-400 mb-6">Kartik Balkrishna · password: <code className="bg-gray-100 px-1 rounded">abc</code></p>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2.5 mb-4 text-xs animate-fade-in">
                <AlertTriangle size={13} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Role selector */}
              <div>
                <label className="form-label">Login As</label>
                <div className="grid grid-cols-3 gap-2">
                  {ROLES.map(r => (
                    <button
                      key={r}
                      type="button"
                      id={`role-${r.toLowerCase()}`}
                      onClick={() => setRole(r)}
                      className={`py-2 rounded-lg border text-xs font-semibold transition-all ${
                        role === r
                          ? 'border-[var(--navy)] bg-[var(--navy)] text-white'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="form-label">Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="login-password"
                    type={showPass ? 'text' : 'password'}
                    className="form-input pl-9 pr-9"
                    placeholder="Enter password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-2.5 mt-2"
              >
                {loading
                  ? <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Signing in...
                    </span>
                  : `Sign in as ${role}`
                }
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
