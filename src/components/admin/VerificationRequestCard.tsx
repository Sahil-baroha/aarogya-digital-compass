
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { DoctorVerificationRequest } from '@/hooks/useAdminDashboard'
import { Calendar, User, FileText, Award, Stethoscope, CheckCircle, XCircle } from 'lucide-react'

interface VerificationRequestCardProps {
  request: DoctorVerificationRequest
  onStatusUpdate: (id: string, status: 'approved' | 'rejected', notes?: string) => Promise<boolean>
}

export const VerificationRequestCard = ({ request, onStatusUpdate }: VerificationRequestCardProps) => {
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const handleStatusUpdate = async (status: 'approved' | 'rejected') => {
    setLoading(true)
    const success = await onStatusUpdate(request.id, status, notes)
    if (success) {
      setNotes('')
    }
    setLoading(false)
  }

  const getStatusBadge = () => {
    const statusColors = {
      pending: 'border-yellow-300 text-yellow-800 bg-yellow-50',
      under_review: 'border-blue-300 text-blue-800 bg-blue-50',
      approved: 'border-green-300 text-green-800 bg-green-50',
      rejected: 'border-red-300 text-red-800 bg-red-50',
    }

    return (
      <Badge variant="outline" className={statusColors[request.verification_status]}>
        {request.verification_status.replace('_', ' ').toUpperCase()}
      </Badge>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>{request.doctor_details.full_name}</span>
          </CardTitle>
          {getStatusBadge()}
        </div>
        <CardDescription className="flex items-center space-x-4 text-sm">
          <span className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>Submitted: {new Date(request.submitted_at).toLocaleDateString()}</span>
          </span>
          {request.reviewed_at && (
            <span className="flex items-center space-x-1">
              <CheckCircle className="h-4 w-4" />
              <span>Reviewed: {new Date(request.reviewed_at).toLocaleDateString()}</span>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Doctor Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium flex items-center space-x-2">
              <Stethoscope className="h-4 w-4" />
              <span>Professional Details</span>
            </h4>
            <div className="text-sm space-y-1">
              <p><strong>License:</strong> {request.doctor_profile.license_number}</p>
              <p><strong>Specialization:</strong> {request.doctor_profile.specialization || 'Not specified'}</p>
              <p><strong>Qualification:</strong> {request.doctor_profile.qualification || 'Not specified'}</p>
              <p><strong>Experience:</strong> {request.doctor_profile.experience_years || 0} years</p>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Contact Information</span>
            </h4>
            <div className="text-sm space-y-1">
              <p><strong>Email:</strong> {request.doctor_details.email || 'Not provided'}</p>
              <p><strong>Phone:</strong> {request.doctor_details.phone || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="space-y-2">
          <h4 className="font-medium flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Submitted Documents</span>
          </h4>
          <p className="text-sm text-gray-600">
            {request.documents_submitted.length} document(s) submitted
          </p>
        </div>

        {/* Previous Review Notes */}
        {request.reviewer_notes && (
          <div className="space-y-2">
            <h4 className="font-medium">Previous Review Notes</h4>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
              {request.reviewer_notes}
            </p>
          </div>
        )}

        {/* Action Section */}
        {(request.verification_status === 'pending' || request.verification_status === 'under_review') && (
          <div className="space-y-3 pt-4 border-t">
            <div className="space-y-2">
              <label htmlFor={`notes-${request.id}`} className="text-sm font-medium">
                Review Notes (Optional)
              </label>
              <Textarea
                id={`notes-${request.id}`}
                placeholder="Add any notes about this verification..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => handleStatusUpdate('approved')}
                disabled={loading}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Approve</span>
              </Button>
              <Button
                onClick={() => handleStatusUpdate('rejected')}
                disabled={loading}
                variant="destructive"
                className="flex items-center space-x-2"
              >
                <XCircle className="h-4 w-4" />
                <span>Reject</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
