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
import Assignments from './pages/agent/Assignments'
import Profile from './pages/Profile'

export default function App() {
  // Auth state — single user Kartik, role chosen at login
  const [user, setUser] = useState(null) // { name, role }

  const login = (role) => setUser({ name: 'Kartik Balkrishna', role })
  const logout = () => setUser(null)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          user ? <Navigate to="/dashboard" replace /> : <Login onLogin={login} />
        } />

        <Route element={
          user ? <Layout user={user} onLogout={logout} /> : <Navigate to="/login" replace />
        }>
          <Route path="/dashboard"           element={<Dashboard user={user} />} />
          <Route path="/grievances"          element={<GrievanceList user={user} />} />
          <Route path="/grievances/new"      element={<AddGrievance />} />
          <Route path="/grievances/:id"      element={<GrievanceDetail />} />
          <Route path="/admin/users"         element={<Users />} />
          <Route path="/admin/categories"    element={<Categories />} />
          <Route path="/admin/status"        element={<StatusPriority />} />
          <Route path="/admin/reports"       element={<Reports />} />
          <Route path="/agent/assignments"   element={<Assignments user={user} />} />
          <Route path="/profile"             element={<Profile user={user} />} />
          <Route path="*"                    element={<Navigate to="/dashboard" replace />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
