
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useAuthContext } from '@/components/AuthProvider'

export interface DoctorProfileData {
  id: string
  license_number: string
  specialization?: string
  qualification?: string
  experience_years?: number
  consultation_fee?: number
  is_verified?: boolean
  clinic_address?: {
    street?: string
    city?: string
    state?: string
    pincode?: string
  }
  available_hours?: {
    monday?: { start: string; end: string; available: boolean }
    tuesday?: { start: string; end: string; available: boolean }
    wednesday?: { start: string; end: string; available: boolean }
    thursday?: { start: string; end: string; available: boolean }
    friday?: { start: string; end: string; available: boolean }
    saturday?: { start: string; end: string; available: boolean }
    sunday?: { start: string; end: string; available: boolean }
  }
}

export interface VerificationData {
  id?: string
  doctor_id?: string
  verification_status: 'pending' | 'under_review' | 'approved' | 'rejected'
  documents_submitted?: any[]
  reviewer_id?: string
  reviewer_notes?: string
  submitted_at?: string
  reviewed_at?: string
}

export const useDoctorProfile = () => {
  const [profileData, setProfileData] = useState<DoctorProfileData | null>(null)
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuthContext()
  const { toast } = useToast()

  const fetchDoctorProfile = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .rpc('get_doctor_profile', { doctor_user_id: user.id })

      if (error) throw error

      if (data && data.length > 0) {
        const result = data[0]
        setProfileData(result.profile_data)
        setVerificationData(result.verification_data)
      }
    } catch (error: any) {
      console.error('Error fetching doctor profile:', error)
      toast({
        title: "Error",
        description: "Failed to load doctor profile",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const updateDoctorProfile = async (
    profileUpdates: Partial<DoctorProfileData>,
    verificationUpdates?: Partial<VerificationData>
  ) => {
    if (!user?.id) return false

    try {
      const { data, error } = await supabase
        .rpc('update_doctor_profile', {
          doctor_user_id: user.id,
          profile_updates: profileUpdates,
          verification_updates: verificationUpdates || null
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })

      // Refresh the profile data
      await fetchDoctorProfile()
      return true
    } catch (error: any) {
      console.error('Error updating doctor profile:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      })
      return false
    }
  }

  const submitForVerification = async (documents: any[]) => {
    if (!user?.id) return false

    try {
      const verificationUpdates = {
        verification_status: 'under_review',
        documents_submitted: documents,
        submitted_at: new Date().toISOString()
      }

      return await updateDoctorProfile({}, verificationUpdates)
    } catch (error: any) {
      console.error('Error submitting for verification:', error)
      toast({
        title: "Error",
        description: "Failed to submit for verification",
        variant: "destructive"
      })
      return false
    }
  }

  useEffect(() => {
    if (user?.id) {
      fetchDoctorProfile()
    }
  }, [user?.id])

  return {
    profileData,
    verificationData,
    loading,
    updateDoctorProfile,
    submitForVerification,
    refetchProfile: fetchDoctorProfile
  }
}
