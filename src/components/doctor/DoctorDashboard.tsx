
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Users, CheckCircle, Clock, Star } from 'lucide-react'
import { useAuthContext } from '@/components/AuthProvider'
import { useDoctorProfile } from '@/hooks/useDoctorProfile'
import { DoctorProfileForm } from './DoctorProfileForm'
import { AppointmentsList } from '@/components/appointments/AppointmentsList'

export const DoctorDashboard = () => {
  const { userProfile } = useAuthContext()
  const { profileData, verificationData, loading } = useDoctorProfile()
  const [activeTab, setActiveTab] = useState('overview')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const getVerificationStatus = () => {
    if (!verificationData) return 'pending'
    return verificationData.verification_status
  }

  const getVerificationColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dr. {userProfile?.full_name || 'Doctor'}
            </h1>
            <p className="text-gray-600 mt-2">
              {profileData?.specialization || 'Medical Professional'}
            </p>
          </div>
          <Badge className={getVerificationColor(getVerificationStatus())}>
            {getVerificationStatus().replace('_', ' ')} verification
          </Badge>
        </div>
      </div>

      {getVerificationStatus() === 'pending' && (
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <h3 className="font-medium text-yellow-800">Verification Pending</h3>
                <p className="text-sm text-yellow-700">
                  Please complete your profile and submit verification documents to start accepting patients.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="profile">Profile & Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">License Number</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {profileData?.license_number || 'Not Set'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Medical license
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Experience</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {profileData?.experience_years || 0} years
                </div>
                <p className="text-xs text-muted-foreground">
                  Professional experience
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Consultation Fee</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{profileData?.consultation_fee || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Per consultation
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {profileData?.is_verified ? 'Verified' : 'Pending'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Account status
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Manage your practice efficiently
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setActiveTab('appointments')}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  View Appointments
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setActiveTab('profile')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Update Profile
                </Button>
                {!profileData?.is_verified && (
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab('profile')}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Complete Verification
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Practice Information</CardTitle>
                <CardDescription>
                  Your professional details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-1">Specialization:</h4>
                  <p className="text-sm text-gray-600">
                    {profileData?.specialization || 'Not specified'}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-1">Qualification:</h4>
                  <p className="text-sm text-gray-600">
                    {profileData?.qualification || 'Not specified'}
                  </p>
                </div>

                {profileData?.clinic_address && (
                  <div>
                    <h4 className="font-medium text-sm mb-1">Clinic Address:</h4>
                    <p className="text-sm text-gray-600">
                      {profileData.clinic_address.street && `${profileData.clinic_address.street}, `}
                      {profileData.clinic_address.city && `${profileData.clinic_address.city}, `}
                      {profileData.clinic_address.state && `${profileData.clinic_address.state} `}
                      {profileData.clinic_address.pincode}
                    </p>
                  </div>
                )}

                {(!profileData?.specialization && !profileData?.qualification) && (
                  <p className="text-sm text-gray-500">
                    Complete your profile to display practice information.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appointments">
          <AppointmentsList userRole="doctor" />
        </TabsContent>

        <TabsContent value="profile">
          <DoctorProfileForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
