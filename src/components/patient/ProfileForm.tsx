
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePatientProfile } from '@/hooks/usePatientProfile'
import { User, MapPin, Phone, Calendar, CreditCard } from 'lucide-react'

export const ProfileForm = () => {
  const { profileData, medicalHistory, loading, updatePatientProfile } = usePatientProfile()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    
    const profileUpdates = {
      full_name: formData.get('fullName') as string,
      phone: formData.get('phone') as string,
      date_of_birth: formData.get('dateOfBirth') as string,
      gender: formData.get('gender') as string,
      abha_id: formData.get('abhaId') as string,
      address: {
        street: formData.get('street') as string,
        city: formData.get('city') as string,
        state: formData.get('state') as string,
        pincode: formData.get('pincode') as string,
      },
      emergency_contact: {
        name: formData.get('emergencyName') as string,
        phone: formData.get('emergencyPhone') as string,
        relation: formData.get('emergencyRelation') as string,
      }
    }

    const medicalUpdates = {
      allergies: (formData.get('allergies') as string).split(',').map(s => s.trim()).filter(Boolean),
      chronic_conditions: (formData.get('chronicConditions') as string).split(',').map(s => s.trim()).filter(Boolean),
      medications: (formData.get('medications') as string).split(',').map(s => s.trim()).filter(Boolean),
      family_history: (formData.get('familyHistory') as string).split(',').map(s => s.trim()).filter(Boolean),
      lifestyle_data: {
        smoking: formData.get('smoking') === 'true',
        alcohol: formData.get('alcohol') === 'true',
        exercise: formData.get('exercise') as string,
        diet: formData.get('diet') as string,
      },
      insurance_details: {
        provider: formData.get('insuranceProvider') as string,
        policy_number: formData.get('policyNumber') as string,
        coverage: formData.get('coverage') as string,
      }
    }

    await updatePatientProfile(profileUpdates, medicalUpdates)
    setIsSubmitting(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Personal Information</span>
          </CardTitle>
          <CardDescription>Update your personal details and contact information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  defaultValue={profileData?.full_name || ''}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={profileData?.phone || ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  defaultValue={profileData?.date_of_birth || ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select name="gender" defaultValue={profileData?.gender || ''}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="abhaId">ABHA ID</Label>
                <Input
                  id="abhaId"
                  name="abhaId"
                  defaultValue={profileData?.abha_id || ''}
                  placeholder="Enter your ABHA ID"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Address</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    name="street"
                    defaultValue={profileData?.address?.street || ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    defaultValue={profileData?.address?.city || ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    defaultValue={profileData?.address?.state || ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    defaultValue={profileData?.address?.pincode || ''}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Emergency Contact</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyName">Contact Name</Label>
                  <Input
                    id="emergencyName"
                    name="emergencyName"
                    defaultValue={profileData?.emergency_contact?.name || ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Contact Phone</Label>
                  <Input
                    id="emergencyPhone"
                    name="emergencyPhone"
                    type="tel"
                    defaultValue={profileData?.emergency_contact?.phone || ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyRelation">Relation</Label>
                  <Input
                    id="emergencyRelation"
                    name="emergencyRelation"
                    defaultValue={profileData?.emergency_contact?.relation || ''}
                    placeholder="e.g., Spouse, Parent"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Medical History</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies (comma-separated)</Label>
                  <Textarea
                    id="allergies"
                    name="allergies"
                    defaultValue={medicalHistory?.allergies?.join(', ') || ''}
                    placeholder="e.g., Peanuts, Penicillin"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chronicConditions">Chronic Conditions (comma-separated)</Label>
                  <Textarea
                    id="chronicConditions"
                    name="chronicConditions"
                    defaultValue={medicalHistory?.chronic_conditions?.join(', ') || ''}
                    placeholder="e.g., Diabetes, Hypertension"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medications">Current Medications (comma-separated)</Label>
                  <Textarea
                    id="medications"
                    name="medications"
                    defaultValue={medicalHistory?.medications?.join(', ') || ''}
                    placeholder="e.g., Metformin, Lisinopril"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="familyHistory">Family History (comma-separated)</Label>
                  <Textarea
                    id="familyHistory"
                    name="familyHistory"
                    defaultValue={medicalHistory?.family_history?.join(', ') || ''}
                    placeholder="e.g., Heart disease, Cancer"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Lifestyle Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smoking">Smoking</Label>
                  <Select name="smoking" defaultValue={medicalHistory?.lifestyle_data?.smoking ? 'true' : 'false'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Do you smoke?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">No</SelectItem>
                      <SelectItem value="true">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alcohol">Alcohol Consumption</Label>
                  <Select name="alcohol" defaultValue={medicalHistory?.lifestyle_data?.alcohol ? 'true' : 'false'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Do you consume alcohol?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">No</SelectItem>
                      <SelectItem value="true">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exercise">Exercise Frequency</Label>
                  <Select name="exercise" defaultValue={medicalHistory?.lifestyle_data?.exercise || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="How often do you exercise?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Never</SelectItem>
                      <SelectItem value="rare">Rarely</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diet">Diet Type</Label>
                  <Select name="diet" defaultValue={medicalHistory?.lifestyle_data?.diet || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="What type of diet do you follow?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span>Insurance Details</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                  <Input
                    id="insuranceProvider"
                    name="insuranceProvider"
                    defaultValue={medicalHistory?.insurance_details?.provider || ''}
                    placeholder="e.g., Star Health"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="policyNumber">Policy Number</Label>
                  <Input
                    id="policyNumber"
                    name="policyNumber"
                    defaultValue={medicalHistory?.insurance_details?.policy_number || ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coverage">Coverage Amount</Label>
                  <Input
                    id="coverage"
                    name="coverage"
                    defaultValue={medicalHistory?.insurance_details?.coverage || ''}
                    placeholder="e.g., ₹5,00,000"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
