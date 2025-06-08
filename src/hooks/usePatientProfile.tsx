
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useAuthContext } from '@/components/AuthProvider'

export interface PatientProfileData {
  id: string
  full_name: string
  email?: string
  phone?: string
  date_of_birth?: string
  gender?: string
  abha_id?: string
  address?: {
    street?: string
    city?: string
    state?: string
    pincode?: string
  }
  emergency_contact?: {
    name?: string
    phone?: string
    relation?: string
  }
}

export interface MedicalHistoryData {
  allergies?: string[]
  chronic_conditions?: string[]
  medications?: string[]
  family_history?: string[]
  lifestyle_data?: {
    smoking?: boolean
    alcohol?: boolean
    exercise?: string
    diet?: string
  }
  insurance_details?: {
    provider?: string
    policy_number?: string
    coverage?: string
  }
}

export interface VitalsData {
  heart_rate?: number
  blood_pressure_systolic?: number
  blood_pressure_diastolic?: number
  temperature?: number
  weight?: number
  height?: number
  bmi?: number
  oxygen_saturation?: number
  blood_glucose?: number
  recorded_at?: string
}

export const usePatientProfile = () => {
  const [profileData, setProfileData] = useState<PatientProfileData | null>(null)
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryData | null>(null)
  const [latestVitals, setLatestVitals] = useState<VitalsData | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuthContext()
  const { toast } = useToast()

  const fetchPatientProfile = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .rpc('get_patient_profile', { patient_user_id: user.id })

      if (error) throw error

      if (data && data.length > 0) {
        const result = data[0]
        setProfileData(result.profile_data)
        setMedicalHistory(result.medical_history)
        setLatestVitals(result.latest_vitals)
      }
    } catch (error: any) {
      console.error('Error fetching patient profile:', error)
      toast({
        title: "Error",
        description: "Failed to load patient profile",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const updatePatientProfile = async (
    profileUpdates: Partial<PatientProfileData>,
    medicalHistoryUpdates?: Partial<MedicalHistoryData>
  ) => {
    if (!user?.id) return false

    try {
      const { data, error } = await supabase
        .rpc('update_patient_profile', {
          patient_user_id: user.id,
          profile_updates: profileUpdates,
          medical_history_updates: medicalHistoryUpdates || null
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })

      // Refresh the profile data
      await fetchPatientProfile()
      return true
    } catch (error: any) {
      console.error('Error updating patient profile:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      })
      return false
    }
  }

  const addVitals = async (vitalsData: Omit<VitalsData, 'id' | 'recorded_at'>) => {
    if (!user?.id) return false

    try {
      const { error } = await supabase
        .from('patient_vitals')
        .insert({
          patient_id: user.id,
          recorded_by: user.id,
          ...vitalsData
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Vitals recorded successfully",
      })

      // Refresh the profile data to get latest vitals
      await fetchPatientProfile()
      return true
    } catch (error: any) {
      console.error('Error adding vitals:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to record vitals",
        variant: "destructive"
      })
      return false
    }
  }

  useEffect(() => {
    if (user?.id) {
      fetchPatientProfile()
    }
  }, [user?.id])

  return {
    profileData,
    medicalHistory,
    latestVitals,
    loading,
    updatePatientProfile,
    addVitals,
    refetchProfile: fetchPatientProfile
  }
}
