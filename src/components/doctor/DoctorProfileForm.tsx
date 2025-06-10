
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useDoctorProfile } from '@/hooks/useDoctorProfile'
import { 
  Stethoscope, 
  MapPin, 
  Clock, 
  CreditCard, 
  FileText, 
  AlertCircle,
  CheckCircle,
  Upload
} from 'lucide-react'

export const DoctorProfileForm = () => {
  const { profileData, verificationData, loading, updateDoctorProfile, submitForVerification } = useDoctorProfile()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [documents, setDocuments] = useState<File[]>([])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    
    const profileUpdates = {
      license_number: formData.get('licenseNumber') as string,
      specialization: formData.get('specialization') as string,
      qualification: formData.get('qualification') as string,
      experience_years: parseInt(formData.get('experienceYears') as string) || 0,
      consultation_fee: parseFloat(formData.get('consultationFee') as string) || 0,
      clinic_address: {
        street: formData.get('clinicStreet') as string,
        city: formData.get('clinicCity') as string,
        state: formData.get('clinicState') as string,
        pincode: formData.get('clinicPincode') as string,
      },
      available_hours: {
        monday: {
          start: formData.get('mondayStart') as string,
          end: formData.get('mondayEnd') as string,
          available: formData.get('mondayAvailable') === 'true'
        },
        tuesday: {
          start: formData.get('tuesdayStart') as string,
          end: formData.get('tuesdayEnd') as string,
          available: formData.get('tuesdayAvailable') === 'true'
        },
        wednesday: {
          start: formData.get('wednesdayStart') as string,
          end: formData.get('wednesdayEnd') as string,
          available: formData.get('wednesdayAvailable') === 'true'
        },
        thursday: {
          start: formData.get('thursdayStart') as string,
          end: formData.get('thursdayEnd') as string,
          available: formData.get('thursdayAvailable') === 'true'
        },
        friday: {
          start: formData.get('fridayStart') as string,
          end: formData.get('fridayEnd') as string,
          available: formData.get('fridayAvailable') === 'true'
        },
        saturday: {
          start: formData.get('saturdayStart') as string,
          end: formData.get('saturdayEnd') as string,
          available: formData.get('saturdayAvailable') === 'true'
        },
        sunday: {
          start: formData.get('sundayStart') as string,
          end: formData.get('sundayEnd') as string,
          available: formData.get('sundayAvailable') === 'true'
        }
      }
    }

    await updateDoctorProfile(profileUpdates)
    setIsSubmitting(false)
  }

  const handleVerificationSubmit = async () => {
    if (documents.length === 0) {
      alert('Please upload at least one document for verification.')
      return
    }
    
    setIsSubmitting(true)
    
    // Convert files to base64 or handle file upload logic here
    const documentData = documents.map(file => ({
      name: file.name,
      type: file.type,
      size: file.size,
      // In a real app, you'd upload to storage and store the URL
      url: `placeholder-url-for-${file.name}`
    }))
    
    await submitForVerification(documentData)
    setDocuments([])
    setIsSubmitting(false)
  }

  const getVerificationStatusBadge = () => {
    if (!verificationData) return null

    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      under_review: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    }

    return (
      <Badge className={statusColors[verificationData.verification_status]}>
        {verificationData.verification_status.replace('_', ' ').toUpperCase()}
      </Badge>
    )
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
      {/* Verification Status Card */}
      {verificationData && (
        <Card className={`border-l-4 ${
          verificationData.verification_status === 'approved' ? 'border-l-green-500' :
          verificationData.verification_status === 'rejected' ? 'border-l-red-500' :
          verificationData.verification_status === 'under_review' ? 'border-l-blue-500' :
          'border-l-yellow-500'
        }`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                {verificationData.verification_status === 'approved' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                )}
                <span>Verification Status</span>
              </CardTitle>
              {getVerificationStatusBadge()}
            </div>
          </CardHeader>
          <CardContent>
            {verificationData.verification_status === 'approved' && (
              <p className="text-green-700">
                Congratulations! Your profile has been verified. You can now accept appointments.
              </p>
            )}
            {verificationData.verification_status === 'rejected' && (
              <div className="space-y-2">
                <p className="text-red-700">
                  Your verification was rejected. Please review the feedback and resubmit.
                </p>
                {verificationData.reviewer_notes && (
                  <div className="bg-red-50 p-3 rounded-md">
                    <p className="text-sm text-red-800">
                      <strong>Reviewer Notes:</strong> {verificationData.reviewer_notes}
                    </p>
                  </div>
                )}
              </div>
            )}
            {verificationData.verification_status === 'under_review' && (
              <p className="text-blue-700">
                Your profile is currently under review. You'll be notified once the review is complete.
              </p>
            )}
            {verificationData.verification_status === 'pending' && (
              <p className="text-yellow-700">
                Please complete your profile and submit required documents for verification.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Professional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Stethoscope className="h-5 w-5" />
            <span>Professional Information</span>
          </CardTitle>
          <CardDescription>Update your medical credentials and professional details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">Medical License Number</Label>
                <Input
                  id="licenseNumber"
                  name="licenseNumber"
                  defaultValue={profileData?.license_number || ''}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Select name="specialization" defaultValue={profileData?.specialization || ''}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general-medicine">General Medicine</SelectItem>
                    <SelectItem value="cardiology">Cardiology</SelectItem>
                    <SelectItem value="dermatology">Dermatology</SelectItem>
                    <SelectItem value="orthopedics">Orthopedics</SelectItem>
                    <SelectItem value="pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="gynecology">Gynecology</SelectItem>
                    <SelectItem value="neurology">Neurology</SelectItem>
                    <SelectItem value="psychiatry">Psychiatry</SelectItem>
                    <SelectItem value="ophthalmology">Ophthalmology</SelectItem>
                    <SelectItem value="ent">ENT</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="qualification">Qualification</Label>
                <Input
                  id="qualification"
                  name="qualification"
                  defaultValue={profileData?.qualification || ''}
                  placeholder="e.g., MBBS, MD"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experienceYears">Years of Experience</Label>
                <Input
                  id="experienceYears"
                  name="experienceYears"
                  type="number"
                  min="0"
                  max="50"
                  defaultValue={profileData?.experience_years || ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="consultationFee" className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Consultation Fee (₹)</span>
                </Label>
                <Input
                  id="consultationFee"
                  name="consultationFee"
                  type="number"
                  min="0"
                  defaultValue={profileData?.consultation_fee || ''}
                  placeholder="e.g., 500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Clinic Address</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clinicStreet">Street Address</Label>
                  <Input
                    id="clinicStreet"
                    name="clinicStreet"
                    defaultValue={profileData?.clinic_address?.street || ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinicCity">City</Label>
                  <Input
                    id="clinicCity"
                    name="clinicCity"
                    defaultValue={profileData?.clinic_address?.city || ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinicState">State</Label>
                  <Input
                    id="clinicState"
                    name="clinicState"
                    defaultValue={profileData?.clinic_address?.state || ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinicPincode">Pincode</Label>
                  <Input
                    id="clinicPincode"
                    name="clinicPincode"
                    defaultValue={profileData?.clinic_address?.pincode || ''}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Available Hours</span>
              </h4>
              <div className="space-y-3">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                  <div key={day} className="grid grid-cols-4 gap-4 items-center">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name={`${day}Available`}
                        value="true"
                        defaultChecked={profileData?.available_hours?.[day]?.available || false}
                        className="rounded"
                      />
                      <Label className="capitalize">{day}</Label>
                    </div>
                    <Input
                      name={`${day}Start`}
                      type="time"
                      defaultValue={profileData?.available_hours?.[day]?.start || '09:00'}
                    />
                    <Input
                      name={`${day}End`}
                      type="time"
                      defaultValue={profileData?.available_hours?.[day]?.end || '17:00'}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Document Verification */}
      {(!verificationData || verificationData.verification_status !== 'approved') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Document Verification</span>
            </CardTitle>
            <CardDescription>
              Upload required documents for profile verification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="documents">Upload Documents</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <input
                  type="file"
                  id="documents"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setDocuments(Array.from(e.target.files || []))}
                  className="hidden"
                />
                <label htmlFor="documents" className="cursor-pointer">
                  <div className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    PDF, JPG, PNG up to 10MB each
                  </div>
                </label>
              </div>
            </div>

            {documents.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Documents:</Label>
                <div className="space-y-1">
                  {documents.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setDocuments(docs => docs.filter((_, i) => i !== index))}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">Required Documents:</h5>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Medical License Certificate</li>
                <li>• Educational Qualification Certificates</li>
                <li>• Professional Registration Certificate</li>
                <li>• Government-issued ID Proof</li>
              </ul>
            </div>

            <Button
              onClick={handleVerificationSubmit}
              disabled={isSubmitting || documents.length === 0}
              className="w-full"
            >
              {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
