import { createContext, useContext, useState } from 'react'
import { USERS, getRoleById } from '../data/dummy'

const AuthContext = createContext(null)

// Simulated login map
const AUTH_MAP = {
  'admin@darshan.ac.in': { password: 'admin123', userId: 1 },
  'rahul.agent@darshan.ac.in': { password: 'agent123', userId: 2 },
  'priya.s@darshan.ac.in': { password: 'student123', userId: 3 },
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)

  const login = (email, password) => {
    const entry = AUTH_MAP[email]
    if (entry && entry.password === password) {
      const user = USERS.find(u => u.userId === entry.userId)
      const role = getRoleById(user.roleId)
      setCurrentUser({ ...user, role })
      return { success: true, role: role.roleName }
    }
    return { success: false }
  }

  const logout = () => setCurrentUser(null)

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
