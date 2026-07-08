import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Bell, ChevronDown, User, LogOut, LayoutDashboard, AlertCircle, FileText, Users, Tag, Settings, BarChart2 } from 'lucide-react'

const NAV_BY_ROLE = {
  Admin:   [
    { label: 'Dashboard',       icon: LayoutDashboard, path: '/dashboard' },
    { label: 'All Grievances',  icon: AlertCircle,     path: '/grievances' },
    { label: 'Users',           icon: Users,           path: '/admin/users' },
    { label: 'Categories',      icon: Tag,             path: '/admin/categories' },
    { label: 'Statuses',        icon: Settings,        path: '/admin/status' },
    { label: 'Reports',         icon: BarChart2,       path: '/admin/reports' },
  ],
  Student: [
    { label: 'Dashboard',       icon: LayoutDashboard, path: '/dashboard' },
    { label: 'My Grievances',   icon: FileText,        path: '/grievances' },
    { label: 'New Grievance',   icon: AlertCircle,     path: '/grievances/new' },
  ],
}

export default function Navbar({ user, onLogout, sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [drop, setDrop] = useState(false)
  const initials = user.name.slice(0, 2).toUpperCase()
  const navItems = NAV_BY_ROLE[user.role] || []

  const doLogout = () => {
    setDrop(false)
    onLogout()
    navigate('/login')
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const toggleDrop = () => {
    setDrop(!drop)
  }

  const closeDrop = () => {
    setDrop(false)
  }

  const isActive = (itemPath) => {
    if (location.pathname === itemPath) {
      return true
    }
    if (itemPath !== '/dashboard' && itemPath !== '/grievances' && location.pathname.startsWith(itemPath)) {
      return true
    }
    if (itemPath === '/grievances' && location.pathname.startsWith('/grievances/') && location.pathname !== '/grievances/new') {
      return true
    }
    return false
  }

  return (
    <nav className="bg-slate-900 h-14 flex items-center px-4 sticky top-0 z-50 border-b border-white/10 shadow-sm">
      <div className="flex items-center justify-between w-full">

        {/* Left Side (Logo and Hamburger) */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={toggleSidebar}
            className="text-white/70 hover:text-white p-1 transition-colors lg:hidden"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          
          <div className="flex items-center gap-3">
            <span className="font-bold text-[16px] text-white tracking-tight">GMS</span>
            <span className="text-white/25 text-[14px]">|</span>
            <span className="text-[12.5px] font-medium text-blue-400 whitespace-nowrap">
              {user.role} Portal
            </span>
          </div>
        </div>

        {/* Center Side (Desktop Links) */}
        <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto mx-4 no-scrollbar">
          {navItems.map(item => {
            const Icon = item.icon
            const active = isActive(item.path)
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors whitespace-nowrap ${
                  active 
                    ? 'text-white bg-white/15 shadow-sm' 
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Right Side (Profile & Notifications) */}
        <div className="flex items-center gap-3 shrink-0">
          <button className="text-white/60 hover:text-white p-1 transition-colors relative">
            <Bell size={16} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full border border-slate-900"></span>
          </button>

          <div className="relative">
            <button
              onClick={toggleDrop}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors p-1"
            >
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-[11px] font-bold text-white shadow-sm">
                {initials}
              </div>
              <span className="text-[13px] font-medium hidden sm:block">
                {user.name}
              </span>
              <ChevronDown size={14} className={`transition-transform duration-200 text-white/50 ${drop ? 'rotate-180' : ''}`} />
            </button>

            {drop && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg w-48 overflow-hidden z-[200] animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                  <div className="font-semibold text-[13px] text-slate-900 truncate">{user.name}</div>
                  <div className="text-[11.5px] text-slate-500 mt-0.5">{user.role}</div>
                </div>
                <div className="p-1.5">
                  <Link to="/profile" onClick={closeDrop}
                    className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                  >
                    <User size={14} /> Profile
                  </Link>
                  <div className="h-px bg-slate-100 my-1"></div>
                  <button onClick={doLogout}
                    className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-red-600 hover:bg-red-50 rounded-md transition-colors w-full text-left"
                  >
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
