
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, FileText, User, Activity, Plus } from 'lucide-react'
import { useAuthContext } from '@/components/AuthProvider'
import { usePatientProfile } from '@/hooks/usePatientProfile'
import { ProfileForm } from './ProfileForm'
import { VitalsForm } from './VitalsForm'
import { AppointmentBooking } from '@/components/appointments/AppointmentBooking'
import { AppointmentsList } from '@/components/appointments/AppointmentsList'
import { MedicalRecords } from '@/components/records/MedicalRecords'

export const PatientDashboard = () => {
  const { userProfile } = useAuthContext()
  const { profileData, medicalHistory, latestVitals, loading } = usePatientProfile()
  const [activeTab, setActiveTab] = useState('overview')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="records">Medical Records</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="vitals">Vitals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ABHA ID</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {profileData?.abha_id || 'Not Set'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Your unique health identifier
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Latest BMI</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {latestVitals?.bmi ? latestVitals.bmi.toFixed(1) : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Body mass index
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blood Pressure</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {latestVitals?.blood_pressure_systolic && latestVitals?.blood_pressure_diastolic
                    ? `${latestVitals.blood_pressure_systolic}/${latestVitals.blood_pressure_diastolic}`
                    : 'N/A'
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  mmHg
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {latestVitals?.heart_rate || 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                  bpm
                </p>
              </CardContent>
            </Card>
          </div>

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
      </Tabs>
    </div>
  )
}
