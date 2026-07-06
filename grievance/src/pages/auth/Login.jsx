import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

const ROLES = ['Admin', 'Student']

export default function Login({ onLogin }) {
  const [role,     setRole]     = useState('Student')
  const [password, setPassword] = useState('')
  const [show,     setShow]     = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (password !== 'abc') {
      setError('Incorrect password.')
      return
    }
    setError('')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onLogin(role)
    }, 400)
  }

  const toggleShow = () => {
    setShow(!show)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    setError('')
  }

  const handleRoleSelect = (r) => {
    setRole(r)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-[380px]">

        <div className="mb-7">
          <div className="text-[22px] font-bold text-slate-900 tracking-tight">GMS</div>
          <div className="text-[13px] text-slate-500 mt-0.5">Grievance Management System</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-7">
          <div className="mb-5.5">
            <div className="text-[15px] font-bold text-slate-900">Sign in</div>
            <div className="text-[12.5px] text-slate-500 mt-0.5">
              Password: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[12px]">abc</code>
            </div>
          </div>

          <form onSubmit={submit}>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Login as</label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRoleSelect(r)}
                    className={`px-1 py-2 rounded-md text-[13px] font-semibold transition-all border-[1.5px] ${
                      role === r 
                        ? 'border-blue-600 bg-blue-50 text-blue-700' 
                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  className={`w-full border rounded-md px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-1 transition-colors pr-9 ${
                    error ? 'border-red-600 focus:border-red-600 focus:ring-red-600' : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600'
                  }`}
                  placeholder="Enter password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
                <button
                  type="button"
                  onClick={toggleShow}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {error && (
                <div className="text-[12px] text-red-600 mt-1.5">{error}</div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full inline-flex items-center justify-center gap-1.5 p-2 bg-blue-600 text-white text-sm font-medium rounded-md transition-colors ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              {loading ? 'Signing in...' : `Sign in as ${role}`}
            </button>
          </form>
        </div>

        <div className="text-center mt-4 text-[11.5px] text-slate-400">
          Kartik Balkrishna
        </div>
      </div>
    </div>
  )
}
