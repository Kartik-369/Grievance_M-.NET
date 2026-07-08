import { useState, useEffect } from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function Layout({ user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false) // Desktop doesn't use the sidebar anymore
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
      
      {/* Sidebar is now strictly a mobile drawer, no layout space taken */}
      <Sidebar role={user.role} open={sidebarOpen} setOpen={setSidebarOpen} />
      
      {/* Main content area */}
      <main className="flex-1 p-4 sm:p-6 w-full max-w-7xl mx-auto min-w-0">
        <Outlet />
      </main>
    </div>
  )
}
