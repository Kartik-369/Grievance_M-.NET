import { useState } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { api, setAuthToken, setStoredUser } from '../../services/api'

const ROLES = ['Admin', 'Student']

const MOCK_CREDENTIALS = {
  Admin: {
    userId: 1,
    firstName: 'Kartik',
    lastName: 'Admin',
    name: 'Kartik',
    email: 'admin@gms.com',
    role: 'Admin',
    roleId: 1,
    isActive: true,
  },
  Student: {
    userId: 2,
    firstName: 'Kartik',
    lastName: 'Student',
    name: 'Kartik',
    email: 'student@gms.com',
    role: 'Student',
    roleId: 2,
    isActive: true,
  },
}

export default function Login({ onLogin }) {
  const [role,     setRole]     = useState('Student')
  const [email,    setEmail]    = useState('student@gms.com')
  const [password, setPassword] = useState('')
  const [show,     setShow]     = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleRoleSelect = (r) => {
    setRole(r)
    setEmail(MOCK_CREDENTIALS[r].email)
    setError('')
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!password) {
      setError('Password is required.')
      return
    }

    setError('')
    setLoading(true)

    try {
      // Connect to backend: POST /api/user/login
      const res = await api.post('/user/login', {
        email: email.trim(),
        password: password,
      })

      const token = res?.token || res?.Token || (typeof res === 'string' ? res : '')
      if (token) {
        setAuthToken(token)
      }

      const activeUser = {
        ...MOCK_CREDENTIALS[role],
        email: email.trim(),
        role: role,
      }

      setStoredUser(activeUser)
      onLogin(activeUser)
    } catch (err) {
      // If backend error or offline during demo, allow mock login with default password
      if (password === 'abc' || password === '123456' || password === 'Admin@123') {
        const fallbackUser = MOCK_CREDENTIALS[role]
        setStoredUser(fallbackUser)
        onLogin(fallbackUser)
      } else {
        setError(err.message || 'Login failed. Please verify credentials.')
      }
    } finally {
      setLoading(false)
    }
  }

  const toggleShow = () => setShow(!show)

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    setError('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-[380px]">
        <div className="mb-7">
          <div className="text-[22px] font-bold text-slate-900 tracking-tight">GMS</div>
          <div className="text-[13px] text-slate-500 mt-0.5">Grievance Management System</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-7">
          <div className="mb-5">
            <div className="text-[15px] font-bold text-slate-900">Sign in</div>
            <div className="text-xs text-slate-500 mt-1">Connect to grievance portal</div>
          </div>

          <form onSubmit={submit}>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Login as
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map((r) => (
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

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  required
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 pr-10"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={toggleShow}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-2.5 rounded-md bg-red-50 border border-red-200 text-xs text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
