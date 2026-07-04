import { useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function Layout({ user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <Navbar user={user} onLogout={onLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1">
        <Sidebar role={user.role} open={sidebarOpen} />
        <main className="flex-1 p-5 overflow-auto animate-fade-in min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
