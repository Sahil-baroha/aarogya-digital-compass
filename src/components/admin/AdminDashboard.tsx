
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuthContext } from '@/components/AuthProvider'
import { useAdminDashboard } from '@/hooks/useAdminDashboard'
import { VerificationRequestCard } from './VerificationRequestCard'
import { 
  Users, 
  Stethoscope, 
  Calendar, 
  UserCheck, 
  AlertCircle, 
  LogOut,
  Activity,
  FileCheck
} from 'lucide-react'

export const AdminDashboard = () => {
  const { userProfile, signOut } = useAuthContext()
  const { 
    verificationRequests, 
    systemStats, 
    loading, 
    updateVerificationStatus,
    refetchData 
  } = useAdminDashboard()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
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
                <p className="text-sm text-gray-600">Admin Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">{userProfile?.full_name}</span>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
          <p className="text-gray-600">Manage system operations and doctor verifications</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="verifications">
              Doctor Verifications
              {systemStats && systemStats.pending_verifications > 0 && (
                <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {systemStats.pending_verifications}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* System Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span>Total Patients</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats?.total_patients || 0}</div>
                  <CardDescription>Registered patients in the system</CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Stethoscope className="h-5 w-5 text-green-600" />
                    <span>Total Doctors</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats?.total_doctors || 0}</div>
                  <CardDescription>Registered doctors in the system</CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <UserCheck className="h-5 w-5 text-purple-600" />
                    <span>Verified Doctors</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats?.verified_doctors || 0}</div>
                  <CardDescription>Doctors with approved verification</CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    <span>Pending Reviews</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats?.pending_verifications || 0}</div>
                  <CardDescription>Doctor verifications awaiting review</CardDescription>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Recent Verifications</span>
                  </CardTitle>
                  <CardDescription>Latest doctor verification requests</CardDescription>
                </CardHeader>
                <CardContent>
                  {verificationRequests.length > 0 ? (
                    <div className="space-y-3">
                      {verificationRequests.slice(0, 5).map((request) => (
                        <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{request.doctor_details.full_name}</p>
                            <p className="text-sm text-gray-600">{request.doctor_profile.specialization}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            request.verification_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            request.verification_status === 'under_review' ? 'bg-blue-100 text-blue-800' :
                            request.verification_status === 'approved' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {request.verification_status.replace('_', ' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No verification requests yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>System Activity</span>
                  </CardTitle>
                  <CardDescription>Platform usage overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Appointments</span>
                      <span className="font-medium">{systemStats?.total_appointments || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Verification Rate</span>
                      <span className="font-medium">
                        {systemStats?.total_doctors ? 
                          Math.round((systemStats.verified_doctors / systemStats.total_doctors) * 100) : 0}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">System Status</span>
                      <span className="font-medium text-green-600">Operational</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="verifications" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Doctor Verification Requests</h3>
                <p className="text-sm text-gray-600">Review and approve doctor registrations</p>
              </div>
              <Button onClick={refetchData} variant="outline">
                Refresh
              </Button>
            </div>

            {verificationRequests.length > 0 ? (
              <div className="space-y-6">
                {verificationRequests.map((request) => (
                  <VerificationRequestCard
                    key={request.id}
                    request={request}
                    onStatusUpdate={updateVerificationStatus}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center text-gray-500">
                    <FileCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No verification requests found</p>
                    <p className="text-sm mt-2">New doctor registrations will appear here</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>System Management</CardTitle>
                <CardDescription>Advanced system configuration and monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>System management features coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
