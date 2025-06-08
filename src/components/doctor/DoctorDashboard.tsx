
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuthContext } from '@/components/AuthProvider'
import { DoctorProfileForm } from './DoctorProfileForm'
import { useDoctorProfile } from '@/hooks/useDoctorProfile'
import { Calendar, Users, FileText, Stethoscope, LogOut, AlertCircle, UserCheck } from 'lucide-react'

export const DoctorDashboard = () => {
  const { userProfile, signOut } = useAuthContext()
  const { verificationData } = useDoctorProfile()

  const getVerificationStatusBadge = () => {
    if (!verificationData) return (
      <Badge variant="outline" className="border-yellow-300 text-yellow-800">
        Not Submitted
      </Badge>
    )

    const statusColors = {
      pending: 'border-yellow-300 text-yellow-800',
      under_review: 'border-blue-300 text-blue-800',
      approved: 'border-green-300 text-green-800',
      rejected: 'border-red-300 text-red-800',
    }

    return (
      <Badge variant="outline" className={statusColors[verificationData.verification_status]}>
        {verificationData.verification_status.replace('_', ' ')}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Aarogya Bharat</h1>
                <p className="text-sm text-gray-600">Doctor Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Dr. {userProfile?.full_name}</span>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Doctor Dashboard</h2>
              <p className="text-gray-600">Manage your practice and patient consultations</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Verification Status:</span>
              {getVerificationStatusBadge()}
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Verification Notice */}
            {(!verificationData || verificationData.verification_status !== 'approved') && (
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-amber-800">Complete Your Verification</h3>
                      <p className="text-sm text-amber-700 mt-1">
                        Complete your profile and submit for verification to start accepting appointments.
                      </p>
                    </div>
                    {getVerificationStatusBadge()}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span>Appointments</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    View and manage your appointment schedule
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Users className="h-5 w-5 text-green-600" />
                    <span>Patients</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Access patient records and medical history
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <span>Prescriptions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Create and manage digital prescriptions
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Stethoscope className="h-5 w-5 text-red-600" />
                    <span>Profile</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Update your professional information
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            {/* Today's Schedule */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Appointments</CardTitle>
                  <CardDescription>Your schedule for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No appointments scheduled for today</p>
                    {(!verificationData || verificationData.verification_status !== 'approved') && (
                      <p className="text-sm mt-2">Complete verification to start accepting appointments</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Consultations</CardTitle>
                  <CardDescription>Your recent patient interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No consultations yet</p>
                    {(!verificationData || verificationData.verification_status !== 'approved') && (
                      <p className="text-sm mt-2">Start seeing patients after verification</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <DoctorProfileForm />
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Appointments</CardTitle>
                <CardDescription>Manage your appointments and consultations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Appointment management system coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle>Patient Records</CardTitle>
                <CardDescription>Access and manage patient information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Patient management system coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prescriptions">
            <Card>
              <CardHeader>
                <CardTitle>Prescriptions</CardTitle>
                <CardDescription>Create and manage digital prescriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Prescription management system coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
