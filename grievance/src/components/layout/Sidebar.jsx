import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, AlertCircle, FileText, ClipboardList,
         Users, Tag, Settings, BarChart2 } from 'lucide-react'

const NAV_BY_ROLE = {
  Admin:   [
    { label: 'Dashboard',       icon: LayoutDashboard, path: '/dashboard' },
    { label: 'All Grievances',  icon: AlertCircle,     path: '/grievances' },
    { label: 'User Management', icon: Users,           path: '/admin/users' },
    { label: 'Categories',      icon: Tag,             path: '/admin/categories' },
    { label: 'Status & Priority',icon: Settings,       path: '/admin/status' },
    { label: 'Reports',         icon: BarChart2,       path: '/admin/reports' },
  ],
  Agent:   [
    { label: 'Dashboard',       icon: LayoutDashboard, path: '/dashboard' },
    { label: 'My Assignments',  icon: ClipboardList,   path: '/agent/assignments' },
  ],
  Student: [
    { label: 'Dashboard',       icon: LayoutDashboard, path: '/dashboard' },
    { label: 'My Grievances',   icon: FileText,        path: '/grievances' },
    { label: 'New Grievance',   icon: AlertCircle,     path: '/grievances/new' },
  ],
}

export default function Sidebar({ role, open, setOpen }) {
  const location = useLocation()
  const items    = NAV_BY_ROLE[role] || []

  // Auto-close for mobile screens
  const handleClick = () => {
    if (window.innerWidth < 1024) {
      setOpen(false)
    }
  }

  return (
    <>
      {/* Mobile backdrop overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-slate-900/20 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      
      <aside className={`bg-white border-r border-slate-200 h-[calc(100vh-3.5rem)] shrink-0 transition-all duration-300 overflow-y-auto overflow-x-hidden fixed lg:static z-40 ${open ? 'w-64 opacity-100' : 'w-0 opacity-0 border-r-0 pointer-events-none'}`}>
        <div className="pt-2 w-64">
          <div className="px-5 py-3 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
            {role} MENU
          </div>
          <div className="flex flex-col gap-1 px-3">
            {items.map(item => {
              const Icon   = item.icon
              const active = location.pathname === item.path ||
                (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleClick}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-[13.5px] font-medium transition-colors whitespace-nowrap ${
                    active 
                      ? 'text-blue-700 bg-blue-50' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={16} className="shrink-0" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </aside>
    </>
  )
}
