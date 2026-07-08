import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, AlertCircle, FileText, Users, Tag, Settings, BarChart2 } from 'lucide-react'

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

export default function Sidebar({ role, open, setOpen }) {
  const location = useLocation()
  const items    = NAV_BY_ROLE[role] || []

  const handleClick = () => {
    setOpen(false)
  }

  const handleOverlayClick = () => {
    setOpen(false)
  }

  return (
    <div className="lg:hidden">
      {/* Overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-40 transition-opacity"
          onClick={handleOverlayClick}
        />
      )}
      
      {/* Drawer */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="px-5 py-6 border-b border-slate-100 flex items-center justify-between">
            <span className="font-bold text-lg text-slate-900 tracking-tight">GMS Menu</span>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1.5">
            <div className="px-2 pb-2 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
              {role}
            </div>
            {items.map(item => {
              const Icon = item.icon
              const isActive = () => {
                if (location.pathname === item.path) {
                  return true
                }
                if (item.path !== '/dashboard' && item.path !== '/grievances' && location.pathname.startsWith(item.path)) {
                  return true
                }
                if (item.path === '/grievances' && location.pathname.startsWith('/grievances/') && location.pathname !== '/grievances/new') {
                  return true
                }
                return false
              }
              const active = isActive()

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleClick}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${
                    active 
                      ? 'text-blue-700 bg-blue-50/80 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={18} className={active ? 'text-blue-600' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </aside>
    </div>
  )
}
