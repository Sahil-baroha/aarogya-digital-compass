
import { ReactNode } from 'react'
import { useAuthContext } from '@/components/AuthProvider'
import { AuthForm } from './AuthForm'

interface AuthGuardProps {
  children: ReactNode
  requiredRole?: 'patient' | 'doctor' | 'admin' | 'pharmacist'
}

export const AuthGuard = ({ children, requiredRole }: AuthGuardProps) => {
  const { user, userProfile, loading } = useAuthContext()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  if (requiredRole && userProfile?.role !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
          <p className="text-sm text-gray-500 mt-2">Required role: {requiredRole}</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
