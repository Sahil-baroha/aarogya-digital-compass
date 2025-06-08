
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PatientProfileData, MedicalHistoryData, usePatientProfile } from '@/hooks/usePatientProfile'
import { User, Phone, Calendar, MapPin, Heart } from 'lucide-react'

export const ProfileForm = () => {
  const { profileData, medicalHistory, loading, updatePatientProfile } = usePatientProfile()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<PatientProfileData>>({})
  const [medicalData, setMedicalData] = useState<Partial<MedicalHistoryData>>({})

  const handleEdit = () => {
    setIsEditing(true)
    setFormData({
      full_name: profileData?.full_name || '',
      phone: profileData?.phone || '',
      date_of_birth: profileData?.date_of_birth || '',
      gender: profileData?.gender || '',
      abha_id: profileData?.abha_id || '',
      address: profileData?.address || {},
      emergency_contact: profileData?.emergency_contact || {}
    })
    setMedicalData({
      allergies: medicalHistory?.allergies || [],
      chronic_conditions: medicalHistory?.chronic_conditions || [],
      medications: medicalHistory?.medications || [],
      family_history: medicalHistory?.family_history || [],
      lifestyle_data: medicalHistory?.lifestyle_data || {},
      insurance_details: medicalHistory?.insurance_details || {}
    })
  }

  const handleSave = async () => {
    const success = await updatePatientProfile(formData, medicalData)
    if (success) {
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({})
    setMedicalData({})
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Personal Information</span>
          </CardTitle>
          <CardDescription>Your basic profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              {isEditing ? (
                <Input
                  id="full_name"
                  value={formData.full_name || ''}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              ) : (
                <p className="text-sm py-2">{profileData?.full_name || 'Not provided'}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              ) : (
                <p className="text-sm py-2">{profileData?.phone || 'Not provided'}</p>
              )}
            </div>

            <div>
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              {isEditing ? (
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth || ''}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                />
              ) : (
                <p className="text-sm py-2">{profileData?.date_of_birth || 'Not provided'}</p>
              )}
            </div>

            <div>
              <Label htmlFor="gender">Gender</Label>
              {isEditing ? (
                <Select
                  value={formData.gender || ''}
                  onValueChange={(value) => setFormData({ ...formData, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm py-2">{profileData?.gender || 'Not provided'}</p>
              )}
            </div>

            <div>
              <Label htmlFor="abha_id">ABHA ID</Label>
              {isEditing ? (
                <Input
                  id="abha_id"
                  value={formData.abha_id || ''}
                  onChange={(e) => setFormData({ ...formData, abha_id: e.target.value })}
                  placeholder="14-digit ABHA ID"
                />
              ) : (
                <p className="text-sm py-2">{profileData?.abha_id || 'Not provided'}</p>
              )}
            </div>
          </div>

          {!isEditing && (
            <Button onClick={handleEdit} className="mt-4">
              Edit Profile
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Medical History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5" />
            <span>Medical History</span>
          </CardTitle>
          <CardDescription>Your medical information and history</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="allergies">Allergies</Label>
            {isEditing ? (
              <Textarea
                id="allergies"
                value={medicalData.allergies?.join(', ') || ''}
                onChange={(e) => setMedicalData({ 
                  ...medicalData, 
                  allergies: e.target.value.split(',').map(item => item.trim()).filter(Boolean) 
                })}
                placeholder="Enter allergies separated by commas"
              />
            ) : (
              <p className="text-sm py-2">
                {medicalHistory?.allergies?.length 
                  ? medicalHistory.allergies.join(', ') 
                  : 'None reported'
                }
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="medications">Current Medications</Label>
            {isEditing ? (
              <Textarea
                id="medications"
                value={medicalData.medications?.join(', ') || ''}
                onChange={(e) => setMedicalData({ 
                  ...medicalData, 
                  medications: e.target.value.split(',').map(item => item.trim()).filter(Boolean) 
                })}
                placeholder="Enter medications separated by commas"
              />
            ) : (
              <p className="text-sm py-2">
                {medicalHistory?.medications?.length 
                  ? medicalHistory.medications.join(', ') 
                  : 'None reported'
                }
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="chronic_conditions">Chronic Conditions</Label>
            {isEditing ? (
              <Textarea
                id="chronic_conditions"
                value={medicalData.chronic_conditions?.join(', ') || ''}
                onChange={(e) => setMedicalData({ 
                  ...medicalData, 
                  chronic_conditions: e.target.value.split(',').map(item => item.trim()).filter(Boolean) 
                })}
                placeholder="Enter chronic conditions separated by commas"
              />
            ) : (
              <p className="text-sm py-2">
                {medicalHistory?.chronic_conditions?.length 
                  ? medicalHistory.chronic_conditions.join(', ') 
                  : 'None reported'
                }
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex space-x-2">
          <Button onClick={handleSave}>Save Changes</Button>
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
        </div>
      )}
    </div>
  )
}
