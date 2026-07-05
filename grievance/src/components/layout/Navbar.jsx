import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Bell, ChevronDown, User, LogOut,
         LayoutDashboard, AlertCircle, FileText, ClipboardList,
         Users, Tag, Settings, BarChart2 } from 'lucide-react'

const NAV_BY_ROLE = {
  Admin:   [
    { label: 'Dashboard',       icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Grievances',      icon: AlertCircle,      path: '/grievances' },
    { label: 'Users',           icon: Users,            path: '/admin/users' },
    { label: 'Categories',      icon: Tag,              path: '/admin/categories' },
    { label: 'Status',          icon: Settings,         path: '/admin/status' },
    { label: 'Reports',         icon: BarChart2,        path: '/admin/reports' },
  ],
  Agent:   [
    { label: 'Dashboard',       icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Assignments',     icon: ClipboardList,   path: '/agent/assignments' },
  ],
  Student: [
    { label: 'Dashboard',       icon: LayoutDashboard, path: '/dashboard' },
    { label: 'My Grievances',   icon: FileText,        path: '/grievances' },
    { label: 'New Grievance',   icon: AlertCircle,     path: '/grievances/new' },
  ],
}

export default function Navbar({ user, onLogout, sidebarOpen, setSidebarOpen }) {
  const location  = useLocation()
  const navigate  = useNavigate()
  const [drop, setDrop] = useState(false)
  const navItems  = NAV_BY_ROLE[user.role] || []
  const initials  = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  const doLogout = () => { setDrop(false); onLogout(); navigate('/login') }

  return (
    <nav className="bg-slate-900 h-14 flex items-center px-4 sticky top-0 z-50 border-b border-white/10">
      <div className="flex items-center justify-between w-full gap-3">

        {/* Left */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white/70 hover:text-white p-1 transition-colors"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <span className="font-bold text-[15px] text-white tracking-tight">GMS</span>
          <span className="text-white/25 text-[13px]">|</span>
          <span className="text-[12px] text-white/50 whitespace-nowrap hidden sm:inline">
            {user.role} Portal
          </span>
        </div>

        {/* Centre links — desktop only */}
        <div className="hidden lg:flex items-center gap-1 flex-1 justify-center overflow-hidden">
          {navItems.map(item => {
            const Icon   = item.icon
            const active = location.pathname === item.path ||
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12.5px] font-medium transition-colors whitespace-nowrap ${
                  active ? 'text-white bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={13} /> {item.label}
              </Link>
            )
          })}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 shrink-0">
          <button className="text-white/60 hover:text-white p-1 transition-colors relative">
            <Bell size={16} />
          </button>

          <div className="relative">
            <button
              onClick={() => setDrop(!drop)}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-[11px] font-bold text-white">
                {initials}
              </div>
              <span className="text-[12.5px] font-medium hidden sm:block">
                {user.name.split(' ')[0]}
              </span>
              <ChevronDown size={12} className={`transition-transform duration-200 ${drop ? 'rotate-180' : ''}`} />
            </button>

            {drop && (
              <div className="absolute right-0 top-10 bg-white border border-slate-200 rounded-lg shadow-lg w-48 overflow-hidden z-[200] animate-in fade-in duration-200">
                <div className="px-3.5 py-3 border-b border-slate-100 bg-slate-50">
                  <div className="font-semibold text-[13px] text-slate-900">{user.name}</div>
                  <div className="text-[11.5px] text-slate-500 mt-0.5">{user.role}</div>
                </div>
                <Link to="/profile" onClick={() => setDrop(false)}
                  className="flex items-center gap-2 px-3.5 py-2.5 text-[13px] text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <User size={13} /> Profile
                </Link>
                <button onClick={doLogout}
                  className="flex items-center gap-2 px-3.5 py-2.5 text-[13px] text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                >
                  <LogOut size={13} /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
