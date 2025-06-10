
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useAuthContext } from '@/components/AuthProvider'

export interface DoctorVerificationRequest {
  id: string
  doctor_id: string
  verification_status: 'pending' | 'under_review' | 'approved' | 'rejected'
  documents_submitted: any[]
  submitted_at: string
  reviewed_at?: string
  reviewer_notes?: string
  doctor_profile: {
    license_number: string
    specialization?: string
    qualification?: string
    experience_years?: number
  }
  doctor_details: {
    full_name: string
    email?: string
    phone?: string
  }
}

export interface SystemStats {
  total_patients: number
  total_doctors: number
  pending_verifications: number
  total_appointments: number
  verified_doctors: number
}

export const useAdminDashboard = () => {
  const [verificationRequests, setVerificationRequests] = useState<DoctorVerificationRequest[]>([])
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuthContext()
  const { toast } = useToast()

  const fetchVerificationRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('doctor_verification')
        .select(`
          *,
          doctor_profiles!inner(license_number, specialization, qualification, experience_years),
          profiles!inner(full_name, email, phone)
        `)
        .order('submitted_at', { ascending: false })

      if (error) throw error

      const formattedData = data?.map(item => ({
        id: item.id,
        doctor_id: item.doctor_id,
        verification_status: item.verification_status,
        documents_submitted: item.documents_submitted || [],
        submitted_at: item.submitted_at,
        reviewed_at: item.reviewed_at,
        reviewer_notes: item.reviewer_notes,
        doctor_profile: item.doctor_profiles,
        doctor_details: item.profiles
      })) || []

      setVerificationRequests(formattedData)
    } catch (error: any) {
      console.error('Error fetching verification requests:', error)
      toast({
        title: "Error",
        description: "Failed to load verification requests",
        variant: "destructive"
      })
    }
  }

  const fetchSystemStats = async () => {
    try {
      const [patientsResult, doctorsResult, appointmentsResult, verificationsResult] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact' }).eq('role', 'patient'),
        supabase.from('users').select('id', { count: 'exact' }).eq('role', 'doctor'),
        supabase.from('appointments').select('id', { count: 'exact' }),
        supabase.from('doctor_verification').select('id, verification_status', { count: 'exact' })
      ])

      const verifiedDoctorsResult = await supabase
        .from('doctor_verification')
        .select('id', { count: 'exact' })
        .eq('verification_status', 'approved')

      setSystemStats({
        total_patients: patientsResult.count || 0,
        total_doctors: doctorsResult.count || 0,
        total_appointments: appointmentsResult.count || 0,
        pending_verifications: verificationsResult.data?.filter(v => v.verification_status === 'pending' || v.verification_status === 'under_review').length || 0,
        verified_doctors: verifiedDoctorsResult.count || 0
      })
    } catch (error: any) {
      console.error('Error fetching system stats:', error)
      toast({
        title: "Error",
        description: "Failed to load system statistics",
        variant: "destructive"
      })
    }
  }

  const updateVerificationStatus = async (
    verificationId: string,
    status: 'approved' | 'rejected',
    notes?: string
  ) => {
    if (!user?.id) return false

    try {
      const { error } = await supabase
        .from('doctor_verification')
        .update({
          verification_status: status,
          reviewer_id: user.id,
          reviewer_notes: notes,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', verificationId)

      if (error) throw error

      // If approved, update doctor profile verification status
      if (status === 'approved') {
        const request = verificationRequests.find(r => r.id === verificationId)
        if (request) {
          const { error: profileError } = await supabase
            .from('doctor_profiles')
            .update({ is_verified: true })
            .eq('id', request.doctor_id)

          if (profileError) throw profileError
        }
      }

      toast({
        title: "Success",
        description: `Verification ${status} successfully`,
      })

      // Refresh data
      await Promise.all([fetchVerificationRequests(), fetchSystemStats()])
      return true
    } catch (error: any) {
      console.error('Error updating verification:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to update verification",
        variant: "destructive"
      })
      return false
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchVerificationRequests(), fetchSystemStats()])
      setLoading(false)
    }

    if (user?.id) {
      loadData()
    }
  }, [user?.id])

  return {
    verificationRequests,
    systemStats,
    loading,
    updateVerificationStatus,
    refetchData: () => Promise.all([fetchVerificationRequests(), fetchSystemStats()])
  }
}
