
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { CreditCard, CheckCircle, XCircle, Clock, Shield } from 'lucide-react'
import { useAadhaarVerification } from '@/hooks/useAadhaarVerification'

export const AadhaarVerification = () => {
  const [aadhaarNumber, setAadhaarNumber] = useState('')
  const [otp, setOtp] = useState('')
  const { 
    loading, 
    verification, 
    otpSent,
    validateAadhaarNumber, 
    maskAadhaarNumber,
    sendOtp, 
    verifyOtp,
    getVerificationStatus,
    setOtpSent
  } = useAadhaarVerification()

  useEffect(() => {
    getVerificationStatus()
  }, [])

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!aadhaarNumber.trim()) return

    const result = await sendOtp(aadhaarNumber.trim())
    if (result.success) {
      // Reset OTP field when new OTP is sent
      setOtp('')
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) return

    const result = await verifyOtp(otp)
    if (result.success) {
      setOtp('')
      setOtpSent(false)
      setAadhaarNumber('')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'failed':
      case 'expired':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <CreditCard className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800'
      case 'failed':
      case 'expired':
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
          <CreditCard className="h-5 w-5" />
          <span>Aadhaar Verification</span>
        </CardTitle>
        <CardDescription>
          Verify your Aadhaar number via OTP for enhanced security
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {verification?.verification_status === 'verified' ? (
          <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Aadhaar Verified</p>
              <p className="text-sm text-green-700">
                {maskAadhaarNumber(verification.aadhaar_number)} verified on{' '}
                {new Date(verification.verified_at!).toLocaleDateString()}
              </p>
            </div>
          </div>
        ) : (
          <>
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
                  <Input
                    id="aadhaarNumber"
                    type="text"
                    placeholder="Enter your 12-digit Aadhaar number"
                    value={aadhaarNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 12)
                      setAadhaarNumber(value)
                    }}
                    maxLength={12}
                    disabled={loading}
                  />
                  <p className="text-sm text-gray-500">
                    Format: 12 digits (e.g., 123456789012)
                  </p>
                </div>

                <Button 
                  type="submit" 
                  disabled={loading || !validateAadhaarNumber(aadhaarNumber)}
                  className="w-full"
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <p className="text-sm text-blue-800">
                      OTP sent to the mobile number registered with Aadhaar:{' '}
                      <span className="font-medium">
                        {maskAadhaarNumber(aadhaarNumber)}
                      </span>
                    </p>
                  </div>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp">Enter OTP</Label>
                    <div className="flex justify-center">
                      <InputOTP
                        value={otp}
                        onChange={setOtp}
                        maxLength={6}
                        disabled={loading}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    <p className="text-sm text-gray-500 text-center">
                      Enter the 6-digit OTP sent to your registered mobile number
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setOtpSent(false)
                        setOtp('')
                      }}
                      disabled={loading}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={loading || otp.length !== 6}
                      className="flex-1"
                    >
                      {loading ? "Verifying..." : "Verify OTP"}
                    </Button>
                  </div>
                </form>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => handleSendOtp({ preventDefault: () => {} } as React.FormEvent)}
                  disabled={loading}
                  className="w-full text-sm"
                >
                  Resend OTP
                </Button>
              </div>
            )}
          </>
        )}

        {verification && verification.verification_status !== 'verified' && (
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-2">
              {getStatusIcon(verification.verification_status)}
              <div>
                <p className="font-medium">
                  {maskAadhaarNumber(verification.aadhaar_number)}
                </p>
                <p className="text-sm text-gray-500">
                  Attempts: {verification.attempts_count}/3
                </p>
              </div>
            </div>
            <Badge className={getStatusColor(verification.verification_status)}>
              {verification.verification_status}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
