import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Bell, Menu, X, ChevronDown, User, LogOut, LayoutDashboard,
         AlertCircle, FileText, ClipboardList, Users, Tag, Settings,
         BarChart2 } from 'lucide-react'

const NAV_BY_ROLE = {
  Admin:   [
    { label: 'Dashboard',   icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Grievances',  icon: AlertCircle,      path: '/grievances' },
    { label: 'Users',       icon: Users,            path: '/admin/users' },
    { label: 'Categories',  icon: Tag,              path: '/admin/categories' },
    { label: 'Status',      icon: Settings,         path: '/admin/status' },
    { label: 'Reports',     icon: BarChart2,        path: '/admin/reports' },
  ],
  Agent:   [
    { label: 'Dashboard',     icon: LayoutDashboard, path: '/dashboard' },
    { label: 'My Assignments',icon: ClipboardList,   path: '/agent/assignments' },
  ],
  Student: [
    { label: 'Dashboard',     icon: LayoutDashboard, path: '/dashboard' },
    { label: 'My Grievances', icon: FileText,        path: '/grievances' },
    { label: 'Raise',         icon: AlertCircle,     path: '/grievances/new' },
  ],
}

export default function Navbar({ user, onLogout, sidebarOpen, setSidebarOpen }) {
  const location   = useLocation()
  const navigate   = useNavigate()
  const [open, setOpen] = useState(false)

  const navItems = NAV_BY_ROLE[user.role] || []
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2)

  const handleLogout = () => { setOpen(false); onLogout(); navigate('/login') }

  return (
    <nav className="navbar sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 h-14">

        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            id="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white/70 hover:text-white p-1.5 rounded-md hover:bg-white/10 transition-colors"
          >
            {sidebarOpen ? <X size={17} /> : <Menu size={17} />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-black text-xs">DU</span>
            </div>
            <div className="leading-tight hidden sm:block">
              <div className="text-white font-black text-sm tracking-wide">DARSHAN</div>
              <div className="text-white/50 text-[9px] font-medium tracking-widest">UNIVERSITY</div>
            </div>
          </div>

          <div className="w-px h-5 bg-white/20 mx-1 hidden sm:block" />
          <span className="text-white/60 text-xs font-semibold tracking-wider hidden sm:block">
            Grievance Portal
          </span>
        </div>

        {/* Centre nav links */}
        <div className="hidden md:flex items-center gap-0.5">
          {navItems.map(item => {
            const Icon = item.icon
            const active = location.pathname === item.path ||
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
            return (
              <Link
                key={item.path}
                to={item.path}
                id={`nav-${item.label.toLowerCase().replace(/\s/g, '-')}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  active ? 'bg-white/20 text-white' : 'text-white/65 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={13} /> {item.label}
              </Link>
            )
          })}
        </div>

        {/* Right */}
        <div className="flex items-center gap-1.5">
          <button className="relative text-white/65 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors">
            <Bell size={16} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>

          <div className="relative">
            <button
              id="profile-btn"
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors px-1.5"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                {initials}
              </div>
              <span className="hidden md:block text-xs font-semibold">{user.name.split(' ')[0]}</span>
              <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
              <div className="absolute right-0 top-10 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1 animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="font-bold text-sm text-gray-800">{user.name}</div>
                  <span className="mt-1 inline-block text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                    {user.role}
                  </span>
                </div>
                <Link to="/profile" id="nav-profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                  onClick={() => setOpen(false)}>
                  <User size={13} /> My Profile
                </Link>
                <button id="nav-logout" onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                  <LogOut size={13} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
