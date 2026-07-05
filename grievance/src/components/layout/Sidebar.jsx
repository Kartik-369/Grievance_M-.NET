import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, AlertCircle, FileText, ClipboardList,
         Users, Tag, Settings, BarChart2 } from 'lucide-react'

const NAV_BY_ROLE = {
  Admin:   [
    { label: 'Dashboard',       icon: LayoutDashboard, path: '/dashboard' },
    { label: 'All Grievances',  icon: AlertCircle,      path: '/grievances' },
    { label: 'User Management', icon: Users,            path: '/admin/users' },
    { label: 'Categories',      icon: Tag,              path: '/admin/categories' },
    { label: 'Status & Priority',icon: Settings,        path: '/admin/status' },
    { label: 'Reports',         icon: BarChart2,        path: '/admin/reports' },
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

export default function Sidebar({ role, open }) {
  const location = useLocation()
  const items    = NAV_BY_ROLE[role] || []

  return (
    <aside className={`bg-white border-r border-slate-200 min-h-[calc(100vh-3.5rem)] shrink-0 transition-all duration-200 overflow-hidden ${open ? 'w-56 opacity-100' : 'w-0 opacity-0 border-r-0'}`}>
      <div className="pt-2 w-56">
        <div className="px-4 py-2 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
          {role}
        </div>
        {items.map(item => {
          const Icon   = item.icon
          const active = location.pathname === item.path ||
            (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium transition-colors border-l-4 whitespace-nowrap ${
                active 
                  ? 'text-slate-900 bg-blue-50 border-blue-600 font-semibold' 
                  : 'text-slate-500 border-transparent hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon size={14} className="shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
