
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuthContext } from '@/components/AuthProvider'

interface ActivityItem {
  id: string
  type: 'appointment' | 'record' | 'vitals' | 'prescription'
  title: string
  description: string
  timestamp: string
  status?: string
}

export const useRecentActivity = (userRole: 'patient' | 'doctor') => {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuthContext()

  const fetchPatientActivity = async () => {
    if (!user) return []

    const activities: ActivityItem[] = []

    try {
      // Fetch recent appointments
      const { data: appointments } = await supabase
        .from('appointments')
        .select('id, appointment_datetime, status, doctor_profiles!inner(profiles!inner(full_name))')
        .eq('patient_id', user.id)
        .order('appointment_datetime', { ascending: false })
        .limit(5)

      appointments?.forEach(apt => {
        const doctorData = apt.doctor_profiles as any
        const doctorName = doctorData?.profiles?.full_name || 'Unknown Doctor'
        
        activities.push({
          id: apt.id,
          type: 'appointment',
          title: `Appointment with Dr. ${doctorName}`,
          description: `Status: ${apt.status}`,
          timestamp: apt.appointment_datetime,
          status: apt.status
        })
      })

      // Fetch recent vitals
      const { data: vitals } = await supabase
        .from('patient_vitals')
        .select('id, recorded_at, heart_rate, blood_pressure_systolic')
        .eq('patient_id', user.id)
        .order('recorded_at', { ascending: false })
        .limit(3)

      vitals?.forEach(vital => {
        activities.push({
          id: vital.id,
          type: 'vitals',
          title: 'Vitals Recorded',
          description: `Heart rate: ${vital.heart_rate || 'N/A'}, BP: ${vital.blood_pressure_systolic || 'N/A'}`,
          timestamp: vital.recorded_at
        })
      })

      // Fetch recent prescriptions
      const { data: prescriptions } = await supabase
        .from('prescriptions')
        .select('id, created_at, status, doctor_profiles!inner(profiles!inner(full_name))')
        .eq('patient_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3)

      prescriptions?.forEach(presc => {
        const doctorData = presc.doctor_profiles as any
        const doctorName = doctorData?.profiles?.full_name || 'Unknown Doctor'
        
        activities.push({
          id: presc.id,
          type: 'prescription',
          title: `Prescription from Dr. ${doctorName}`,
          description: `Status: ${presc.status}`,
          timestamp: presc.created_at,
          status: presc.status
        })
      })

    } catch (error) {
      console.error('Error fetching patient activity:', error)
    }

    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  const fetchDoctorActivity = async () => {
    if (!user) return []

    const activities: ActivityItem[] = []

    try {
      // Fetch recent appointments
      const { data: appointments } = await supabase
        .from('appointments')
        .select('id, appointment_datetime, status, profiles!inner(full_name)')
        .eq('doctor_id', user.id)
        .order('appointment_datetime', { ascending: false })
        .limit(5)

      appointments?.forEach(apt => {
        const patientData = apt.profiles as any
        const patientName = patientData?.full_name || 'Patient'
        
        activities.push({
          id: apt.id,
          type: 'appointment',
          title: `Appointment with ${patientName}`,
          description: `Status: ${apt.status}`,
          timestamp: apt.appointment_datetime,
          status: apt.status
        })
      })

      // Fetch recent prescriptions issued
      const { data: prescriptions } = await supabase
        .from('prescriptions')
        .select('id, created_at, status, profiles!inner(full_name)')
        .eq('doctor_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      prescriptions?.forEach(presc => {
        const patientData = presc.profiles as any
        const patientName = patientData?.full_name || 'Patient'
        
        activities.push({
          id: presc.id,
          type: 'prescription',
          title: `Prescription issued to ${patientName}`,
          description: `Status: ${presc.status}`,
          timestamp: presc.created_at,
          status: presc.status
        })
      })

    } catch (error) {
      console.error('Error fetching doctor activity:', error)
    }

    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  const fetchActivity = async () => {
    setLoading(true)
    try {
      const activityData = userRole === 'patient' 
        ? await fetchPatientActivity()
        : await fetchDoctorActivity()
      
      setActivities(activityData)
    } catch (error) {
      console.error('Error fetching activity:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchActivity()
    }
  }, [user, userRole])

  return {
    activities,
    loading,
    refetch: fetchActivity
  }
}
