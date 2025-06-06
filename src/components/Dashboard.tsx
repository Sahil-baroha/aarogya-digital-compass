
import { useAuthContext } from '@/components/AuthProvider'
import { PatientDashboard } from './patient/PatientDashboard'
import { DoctorDashboard } from './doctor/DoctorDashboard'
import { AdminDashboard } from './admin/AdminDashboard'

export const Dashboard = () => {
  const { userProfile } = useAuthContext()

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  switch (userProfile.role) {
    case 'patient':
      return <PatientDashboard />
    case 'doctor':
      return <DoctorDashboard />
    case 'admin':
      return <AdminDashboard />
    default:
      return (
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Aarogya Bharat</h2>
          <p className="text-gray-600">Your dashboard is being set up...</p>
        </div>
      )
  }
}
