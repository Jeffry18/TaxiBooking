import React from 'react'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children, allowedRoles = [] }) {
  const role = typeof window !== 'undefined' ? sessionStorage.getItem('role') : null

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to='/login' replace />
  }

  return children
}

export default ProtectedRoute
