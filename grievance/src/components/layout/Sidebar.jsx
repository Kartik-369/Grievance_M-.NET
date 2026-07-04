import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, AlertCircle, FileText, ClipboardList,
         Users, Tag, Settings, BarChart2, ChevronRight } from 'lucide-react'

const NAV_BY_ROLE = {
  Admin: [
    { label: 'Dashboard',      icon: LayoutDashboard, path: '/dashboard' },
    { label: 'All Grievances', icon: AlertCircle,      path: '/grievances' },
    { label: 'User Management',icon: Users,            path: '/admin/users' },
    { label: 'Categories',     icon: Tag,              path: '/admin/categories' },
    { label: 'Status & Priority',icon: Settings,       path: '/admin/status' },
    { label: 'Reports',        icon: BarChart2,        path: '/admin/reports' },
  ],
  Agent: [
    { label: 'Dashboard',      icon: LayoutDashboard, path: '/dashboard' },
    { label: 'My Assignments', icon: ClipboardList,   path: '/agent/assignments' },
  ],
  Student: [
    { label: 'Dashboard',      icon: LayoutDashboard, path: '/dashboard' },
    { label: 'My Grievances',  icon: FileText,        path: '/grievances' },
    { label: 'Raise Grievance',icon: AlertCircle,     path: '/grievances/new' },
  ],
}

export default function Sidebar({ role, open }) {
  const location = useLocation()
  const items = NAV_BY_ROLE[role] || []

  return (
    <aside className={`sidebar flex-shrink-0 transition-all duration-300 ${open ? 'w-[220px]' : 'w-0 overflow-hidden border-0'}`}>
      <div className="py-3">
        <div className="px-4 mb-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">{role} Menu</span>
        </div>
        {items.map(item => {
          const Icon = item.icon
          const active = location.pathname === item.path ||
            (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
          return (
            <Link
              key={item.path}
              to={item.path}
              id={`sidebar-${item.label.toLowerCase().replace(/[\s&]/g, '-')}`}
              className={`sidebar-link ${active ? 'active' : ''}`}
            >
              <Icon size={14} className="flex-shrink-0" />
              <span className="truncate text-[13px]">{item.label}</span>
              {active && <ChevronRight size={12} className="ml-auto flex-shrink-0 opacity-50" />}
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
