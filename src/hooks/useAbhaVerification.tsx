
import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useAuthContext } from '@/components/AuthProvider'

export interface AbhaVerification {
  id: string
  abha_id: string
  verification_status: 'pending' | 'verified' | 'failed' | 'expired'
  verified_at?: string
  created_at: string
  verification_attempts: number
}

export const useAbhaVerification = () => {
  const [loading, setLoading] = useState(false)
  const [verification, setVerification] = useState<AbhaVerification | null>(null)
  const { user } = useAuthContext()
  const { toast } = useToast()

  const validateAbhaId = (abhaId: string): boolean => {
    return /^[0-9]{14}$/.test(abhaId)
  }

  const initiateAbhaVerification = async (abhaId: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to verify ABHA ID",
        variant: "destructive"
      })
      return { success: false }
    }

    if (!validateAbhaId(abhaId)) {
      toast({
        title: "Invalid ABHA ID",
        description: "ABHA ID must be exactly 14 digits",
        variant: "destructive"
      })
      return { success: false }
    }

    try {
      setLoading(true)

      // Check if ABHA ID already exists
      const { data: existing, error: checkError } = await supabase
        .from('abha_verifications')
        .select('*')
        .eq('abha_id', abhaId)
        .single()

      if (existing && existing.verification_status === 'verified') {
        toast({
          title: "ABHA ID Already Verified",
          description: "This ABHA ID is already verified by another user",
          variant: "destructive"
        })
        return { success: false }
      }

      // Create or update verification record
      const { data, error } = await supabase
        .from('abha_verifications')
        .upsert({
          user_id: user.id,
          abha_id: abhaId,
          verification_status: 'pending',
          verification_token: crypto.randomUUID(),
          verification_attempts: 0
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single()

      if (error) throw error

      setVerification(data)
      toast({
        title: "ABHA Verification Initiated",
        description: "Your ABHA ID verification has been started. Please complete the verification process."
      })

      return { success: true, data }
    } catch (error: any) {
      console.error('ABHA verification error:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to initiate ABHA verification",
        variant: "destructive"
      })
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  const checkVerificationStatus = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('abha_verifications')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      setVerification(data)
      return data
    } catch (error: any) {
      console.error('Error checking ABHA verification status:', error)
    }
  }

  const markAsVerified = async (verificationId: string) => {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from('abha_verifications')
        .update({
          verification_status: 'verified',
          verified_at: new Date().toISOString()
        })
        .eq('id', verificationId)
        .select()
        .single()

      if (error) throw error

      setVerification(data)
      toast({
        title: "ABHA ID Verified",
        description: "Your ABHA ID has been successfully verified"
      })

      return { success: true, data }
    } catch (error: any) {
      console.error('Error marking ABHA as verified:', error)
      toast({
        title: "Error",
        description: "Failed to verify ABHA ID",
        variant: "destructive"
      })
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    verification,
    validateAbhaId,
    initiateAbhaVerification,
    checkVerificationStatus,
    markAsVerified
  }
}
