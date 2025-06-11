
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, MapPin, Phone, Video } from 'lucide-react'
import { format } from 'date-fns'
import { supabase } from '@/integrations/supabase/client'
import { useAuthContext } from '@/components/AuthProvider'
import { useToast } from '@/hooks/use-toast'

interface Appointment {
  id: string
  appointment_datetime: string
  consultation_type: string
  symptoms: string
  notes?: string
  status: string
  doctor: {
    full_name: string
    specialization?: string
  }
  patient?: {
    full_name: string
  }
}

interface AppointmentsListProps {
  userRole: 'patient' | 'doctor'
}

export const AppointmentsList = ({ userRole }: AppointmentsListProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuthContext()
  const { toast } = useToast()

  const fetchAppointments = async () => {
    if (!user) return

    try {
      setLoading(true)
      
      let query = supabase
        .from('appointments')
        .select(`
          id,
          appointment_datetime,
          consultation_type,
          symptoms,
          notes,
          status,
          doctor:doctor_profiles!inner(
            profiles!inner(full_name),
            specialization
          ),
          patient:profiles!patient_id(full_name)
        `)
        .order('appointment_datetime', { ascending: true })

      if (userRole === 'patient') {
        query = query.eq('patient_id', user.id)
      } else if (userRole === 'doctor') {
        query = query.eq('doctor_id', user.id)
      }

      const { data, error } = await query

      if (error) throw error

      const formattedAppointments = data.map(apt => ({
        id: apt.id,
        appointment_datetime: apt.appointment_datetime,
        consultation_type: apt.consultation_type,
        symptoms: apt.symptoms,
        notes: apt.notes,
        status: apt.status,
        doctor: {
          full_name: apt.doctor.profiles.full_name,
          specialization: apt.doctor.specialization,
        },
        patient: apt.patient ? {
          full_name: apt.patient.full_name,
        } : undefined,
      }))

      setAppointments(formattedAppointments)
    } catch (error: any) {
      console.error('Error fetching appointments:', error)
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId)

      if (error) throw error

      toast({
        title: "Success",
        description: "Appointment status updated",
      })

      fetchAppointments()
    } catch (error: any) {
      console.error('Error updating appointment:', error)
      toast({
        title: "Error",
        description: "Failed to update appointment",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getConsultationIcon = (type: string) => {
    switch (type) {
      case 'video_call':
        return <Video className="h-4 w-4" />
      case 'phone_call':
        return <Phone className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [user, userRole])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {userRole === 'patient' ? 'My Appointments' : 'Patient Appointments'}
        </h2>
      </div>

      {appointments.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments</h3>
            <p className="text-gray-500">
              {userRole === 'patient' 
                ? "You don't have any appointments scheduled yet."
                : "No patient appointments found."
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {appointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {userRole === 'patient' 
                        ? `Dr. ${appointment.doctor.full_name}`
                        : appointment.patient?.full_name || 'Patient'
                      }
                    </CardTitle>
                    {appointment.doctor.specialization && (
                      <CardDescription>
                        {appointment.doctor.specialization}
                      </CardDescription>
                    )}
                  </div>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      {format(new Date(appointment.appointment_datetime), 'PPP')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      {format(new Date(appointment.appointment_datetime), 'p')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getConsultationIcon(appointment.consultation_type)}
                    <span className="text-sm capitalize">
                      {appointment.consultation_type.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <h4 className="font-medium text-sm">Symptoms / Reason:</h4>
                    <p className="text-sm text-gray-600">{appointment.symptoms}</p>
                  </div>
                  {appointment.notes && (
                    <div>
                      <h4 className="font-medium text-sm">Notes:</h4>
                      <p className="text-sm text-gray-600">{appointment.notes}</p>
                    </div>
                  )}
                </div>

                {userRole === 'doctor' && appointment.status === 'scheduled' && (
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                    >
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
