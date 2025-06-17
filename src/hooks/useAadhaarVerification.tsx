
import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useAuthContext } from '@/components/AuthProvider'

export interface AadhaarVerification {
  id: string
  aadhaar_number: string
  verification_status: 'pending' | 'verified' | 'failed' | 'expired'
  otp_expires_at: string
  verified_at?: string
  attempts_count: number
}

export const useAadhaarVerification = () => {
  const [loading, setLoading] = useState(false)
  const [verification, setVerification] = useState<AadhaarVerification | null>(null)
  const [otpSent, setOtpSent] = useState(false)
  const { user } = useAuthContext()
  const { toast } = useToast()

  const validateAadhaarNumber = (aadhaarNumber: string): boolean => {
    return /^[0-9]{12}$/.test(aadhaarNumber)
  }

  const maskAadhaarNumber = (aadhaarNumber: string): string => {
    if (aadhaarNumber.length !== 12) return aadhaarNumber
    return `XXXX XXXX ${aadhaarNumber.slice(-4)}`
  }

  const generateOtpHash = (otp: string): string => {
    // In a real implementation, this would use proper hashing
    // For demo purposes, we'll use a simple hash
    return btoa(otp + 'salt').slice(0, 32)
  }

  const sendOtp = async (aadhaarNumber: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to verify Aadhaar",
        variant: "destructive"
      })
      return { success: false }
    }

    if (!validateAadhaarNumber(aadhaarNumber)) {
      toast({
        title: "Invalid Aadhaar Number",
        description: "Aadhaar number must be exactly 12 digits",
        variant: "destructive"
      })
      return { success: false }
    }

    try {
      setLoading(true)

      // Generate a demo OTP (in real implementation, this would be sent via SMS)
      const demoOtp = Math.floor(100000 + Math.random() * 900000).toString()
      const otpHash = generateOtpHash(demoOtp)

      const { data, error } = await supabase
        .from('aadhaar_verifications')
        .upsert({
          user_id: user.id,
          aadhaar_number: aadhaarNumber,
          otp_hash: otpHash,
          verification_status: 'pending',
          otp_expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
          attempts_count: 0
        }, {
          onConflict: 'user_id,aadhaar_number'
        })
        .select()
        .single()

      if (error) throw error

      setVerification(data)
      setOtpSent(true)

      // In demo mode, show the OTP to the user
      toast({
        title: "OTP Sent",
        description: `Demo OTP: ${demoOtp} (Valid for 10 minutes)`,
        duration: 10000
      })

      return { success: true, data, demoOtp }
    } catch (error: any) {
      console.error('OTP send error:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP",
        variant: "destructive"
      })
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async (otp: string) => {
    if (!verification) {
      toast({
        title: "Error",
        description: "No pending verification found",
        variant: "destructive"
      })
      return { success: false }
    }

    try {
      setLoading(true)

      // Check if OTP has expired
      if (new Date() > new Date(verification.otp_expires_at)) {
        await supabase
          .from('aadhaar_verifications')
          .update({ verification_status: 'expired' })
          .eq('id', verification.id)

        toast({
          title: "OTP Expired",
          description: "Please request a new OTP",
          variant: "destructive"
        })
        return { success: false }
      }

      const otpHash = generateOtpHash(otp)

      // Get current verification data
      const { data: currentData, error: fetchError } = await supabase
        .from('aadhaar_verifications')
        .select('*')
        .eq('id', verification.id)
        .single()

      if (fetchError) throw fetchError

      // Check if too many attempts
      if (currentData.attempts_count >= 3) {
        await supabase
          .from('aadhaar_verifications')
          .update({ verification_status: 'failed' })
          .eq('id', verification.id)

        toast({
          title: "Too Many Attempts",
          description: "Maximum OTP attempts exceeded. Please request a new OTP",
          variant: "destructive"
        })
        return { success: false }
      }

      // Verify OTP
      if (otpHash === currentData.otp_hash) {
        const { data, error } = await supabase
          .from('aadhaar_verifications')
          .update({
            verification_status: 'verified',
            verified_at: new Date().toISOString()
          })
          .eq('id', verification.id)
          .select()
          .single()

        if (error) throw error

        setVerification(data)
        setOtpSent(false)

        toast({
          title: "Aadhaar Verified",
          description: "Your Aadhaar has been successfully verified"
        })

        return { success: true, data }
      } else {
        // Increment attempts
        await supabase
          .from('aadhaar_verifications')
          .update({
            attempts_count: currentData.attempts_count + 1,
            last_attempt_at: new Date().toISOString()
          })
          .eq('id', verification.id)

        toast({
          title: "Invalid OTP",
          description: `Incorrect OTP. ${2 - currentData.attempts_count} attempts remaining`,
          variant: "destructive"
        })

        return { success: false }
      }
    } catch (error: any) {
      console.error('OTP verification error:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to verify OTP",
        variant: "destructive"
      })
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  const getVerificationStatus = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('aadhaar_verifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('verification_status', 'verified')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) throw error

      setVerification(data)
      return data
    } catch (error: any) {
      console.error('Error getting Aadhaar verification status:', error)
    }
  }

  return {
    loading,
    verification,
    otpSent,
    validateAadhaarNumber,
    maskAadhaarNumber,
    sendOtp,
    verifyOtp,
    getVerificationStatus,
    setOtpSent
  }
}
