import { useState, useEffect } from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function Layout({ user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024)
  const location = useLocation()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Navbar user={user} onLogout={onLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 relative">
        <Sidebar role={user.role} open={sidebarOpen} setOpen={setSidebarOpen} />
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
