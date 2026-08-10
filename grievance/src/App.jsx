import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Login from './pages/auth/Login'
import Dashboard from './pages/Dashboard'
import GrievanceList from './pages/grievances/GrievanceList'
import AddGrievance from './pages/grievances/AddGrievance'
import GrievanceDetail from './pages/grievances/GrievanceDetail'
import Users from './pages/admin/Users'
import Categories from './pages/admin/Categories'
import StatusPriority from './pages/admin/StatusPriority'
import Reports from './pages/admin/Reports'
import Profile from './pages/Profile'

function RoleGuard({ user, allowedRoles, children }) {
  if (!user) {
    return <Navigate to="/login" replace />
  }
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

export default function App() {
  const [user, setUser] = useState(null)

  const login = (userData) => {
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          user ? <Navigate to="/dashboard" replace /> : <Login onLogin={login} />
        } />

        <Route element={
          user ? <Layout user={user} onLogout={logout} /> : <Navigate to="/login" replace />
        }>
          {/* Both roles */}
          <Route path="/dashboard"      element={<Dashboard user={user} />} />
          <Route path="/profile"        element={<Profile user={user} />} />

          {/* Student + Admin can view grievances list & detail */}
          <Route path="/grievances"     element={<GrievanceList user={user} />} />
          <Route path="/grievances/:id" element={<GrievanceDetail user={user} />} />

          {/* Student only: submit new grievance */}
          <Route path="/grievances/new" element={
            <RoleGuard user={user} allowedRoles={['Student']}>
              <AddGrievance user={user} />
            </RoleGuard>
          } />

          {/* Admin only routes */}
          <Route path="/admin/users" element={
            <RoleGuard user={user} allowedRoles={['Admin']}>
              <Users />
            </RoleGuard>
          } />
          <Route path="/admin/categories" element={
            <RoleGuard user={user} allowedRoles={['Admin']}>
              <Categories />
            </RoleGuard>
          } />
          <Route path="/admin/status" element={
            <RoleGuard user={user} allowedRoles={['Admin']}>
              <StatusPriority />
            </RoleGuard>
          } />
          <Route path="/admin/reports" element={
            <RoleGuard user={user} allowedRoles={['Admin']}>
              <Reports />
            </RoleGuard>
          } />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
