
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, FileText, User, Activity, Plus, Shield } from 'lucide-react'
import { useAuthContext } from '@/components/AuthProvider'
import { usePatientProfile } from '@/hooks/usePatientProfile'
import { useRecentActivity } from '@/hooks/useRecentActivity'
import { ProfileForm } from './ProfileForm'
import { VitalsForm } from './VitalsForm'
import { QuickStats } from './QuickStats'
import { RecentActivity } from '@/components/shared/RecentActivity'
import { AppointmentBooking } from '@/components/appointments/AppointmentBooking'
import { AppointmentsList } from '@/components/appointments/AppointmentsList'
import { MedicalRecords } from '@/components/records/MedicalRecords'
import { VerificationPage } from '@/components/verification/VerificationPage'

export const PatientDashboard = () => {
  const { userProfile } = useAuthContext()
  const { profileData, medicalHistory, latestVitals, loading } = usePatientProfile()
  const { activities, loading: activityLoading } = useRecentActivity('patient')
  const [activeTab, setActiveTab] = useState('overview')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const calculateHealthScore = () => {
    if (!latestVitals) return undefined
    
    let score = 100
    
    // Check BMI
    if (latestVitals.bmi) {
      if (latestVitals.bmi < 18.5 || latestVitals.bmi > 30) score -= 20
      else if (latestVitals.bmi > 25) score -= 10
    }
    
    // Check blood pressure
    if (latestVitals.blood_pressure_systolic) {
      if (latestVitals.blood_pressure_systolic > 140 || latestVitals.blood_pressure_systolic < 90) score -= 15
    }
    
    // Check heart rate
    if (latestVitals.heart_rate) {
      if (latestVitals.heart_rate > 100 || latestVitals.heart_rate < 60) score -= 10
    }
    
    return Math.max(score, 0)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {userProfile?.full_name || 'Patient'}
        </h1>
        <p className="text-gray-600 mt-2">Manage your health records and appointments</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="records">Medical Records</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="vitals">Vitals</TabsTrigger>
          <TabsTrigger value="verification">
            <Shield className="h-4 w-4 mr-2" />
            Verification
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <QuickStats 
            upcomingAppointments={3}
            totalRecords={12}
            lastVitalsDate={latestVitals?.recorded_at ? new Date(latestVitals.recorded_at).toLocaleDateString() : undefined}
            healthScore={calculateHealthScore()}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks you might want to perform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setActiveTab('appointments')}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Book New Appointment
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setActiveTab('vitals')}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Record Vitals
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setActiveTab('records')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  View Medical Records
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setActiveTab('verification')}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Verify Identity
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Health Summary</CardTitle>
                <CardDescription>
                  Overview of your health profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {medicalHistory?.allergies && medicalHistory.allergies.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Allergies:</h4>
                    <div className="flex flex-wrap gap-1">
                      {medicalHistory.allergies.map((allergy, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {medicalHistory?.chronic_conditions && medicalHistory.chronic_conditions.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Chronic Conditions:</h4>
                    <div className="flex flex-wrap gap-1">
                      {medicalHistory.chronic_conditions.map((condition, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {medicalHistory?.medications && medicalHistory.medications.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Current Medications:</h4>
                    <div className="flex flex-wrap gap-1">
                      {medicalHistory.medications.map((medication, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {medication}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {(!medicalHistory?.allergies?.length && 
                  !medicalHistory?.chronic_conditions?.length && 
                  !medicalHistory?.medications?.length) && (
                  <p className="text-sm text-gray-500">
                    Complete your profile to see your health summary here.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <RecentActivity 
            activities={activities} 
            maxItems={5} 
          />
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <AppointmentBooking />
            </div>
            <div>
              <AppointmentsList userRole="patient" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="records">
          <MedicalRecords />
        </TabsContent>

        <TabsContent value="profile">
          <ProfileForm />
        </TabsContent>

        <TabsContent value="vitals">
          <VitalsForm />
        </TabsContent>

        <TabsContent value="verification">
          <VerificationPage />
        </TabsContent>
      </Tabs>
    </div>
  )
}
