
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Shield, CheckCircle, XCircle, Clock } from 'lucide-react'
import { useAbhaVerification } from '@/hooks/useAbhaVerification'

export const AbhaVerification = () => {
  const [abhaId, setAbhaId] = useState('')
  const { 
    loading, 
    verification, 
    validateAbhaId, 
    initiateAbhaVerification, 
    checkVerificationStatus 
  } = useAbhaVerification()

  useEffect(() => {
    checkVerificationStatus()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!abhaId.trim()) return

    await initiateAbhaVerification(abhaId.trim())
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <Shield className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>ABHA ID Verification</span>
        </CardTitle>
        <CardDescription>
          Verify your Ayushman Bharat Health Account (ABHA) ID for secure health record access
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {verification && (
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-2">
              {getStatusIcon(verification.verification_status)}
              <div>
                <p className="font-medium">ABHA ID: {verification.abha_id}</p>
                <p className="text-sm text-gray-500">
                  Attempts: {verification.verification_attempts}
                </p>
              </div>
            </div>
            <Badge className={getStatusColor(verification.verification_status)}>
              {verification.verification_status}
            </Badge>
          </div>
        )}

        {(!verification || verification.verification_status !== 'verified') && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="abhaId">ABHA ID</Label>
              <Input
                id="abhaId"
                type="text"
                placeholder="Enter your 14-digit ABHA ID"
                value={abhaId}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 14)
                  setAbhaId(value)
                }}
                maxLength={14}
                disabled={loading}
              />
              <p className="text-sm text-gray-500">
                Format: 14 digits (e.g., 12345678901234)
              </p>
            </div>

            <Button 
              type="submit" 
              disabled={loading || !validateAbhaId(abhaId)}
              className="w-full"
            >
              {loading ? "Verifying..." : "Verify ABHA ID"}
            </Button>
          </form>
        )}

        {verification?.verification_status === 'verified' && (
          <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">ABHA ID Verified</p>
              <p className="text-sm text-green-700">
                Verified on {new Date(verification.verified_at!).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
