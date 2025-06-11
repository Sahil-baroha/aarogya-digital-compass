import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { useAuthContext } from '@/components/AuthProvider'

const appointmentSchema = z.object({
  doctor_id: z.string().min(1, 'Please select a doctor'),
  appointment_date: z.date({
    required_error: 'Please select an appointment date',
  }),
  appointment_time: z.string().min(1, 'Please select a time'),
  consultation_type: z.enum(['in_person', 'video_call', 'phone_call']),
  symptoms: z.string().min(10, 'Please describe your symptoms (minimum 10 characters)'),
  notes: z.string().optional(),
})

type AppointmentFormData = z.infer<typeof appointmentSchema>

interface Doctor {
  id: string
  full_name: string
  specialization?: string
  consultation_fee?: number
}

export const AppointmentBooking = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuthContext()
  const { toast } = useToast()

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      consultation_type: 'in_person',
    },
  })

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctor_profiles')
        .select(`
          id,
          profiles!inner(full_name),
          specialization,
          consultation_fee
        `)
        .eq('is_verified', true)

      if (error) throw error

      const formattedDoctors = data.map(doctor => ({
        id: doctor.id,
        full_name: Array.isArray(doctor.profiles) ? doctor.profiles[0]?.full_name : doctor.profiles.full_name,
        specialization: doctor.specialization,
        consultation_fee: doctor.consultation_fee,
      }))

      setDoctors(formattedDoctors)
    } catch (error) {
      console.error('Error fetching doctors:', error)
      toast({
        title: "Error",
        description: "Failed to load doctors",
        variant: "destructive",
      })
    }
  }

  const onSubmit = async (data: AppointmentFormData) => {
    if (!user) return

    try {
      setLoading(true)
      
      const appointmentDateTime = new Date(data.appointment_date)
      const [hours, minutes] = data.appointment_time.split(':')
      appointmentDateTime.setHours(parseInt(hours), parseInt(minutes))

      const { error } = await supabase
        .from('appointments')
        .insert({
          patient_id: user.id,
          doctor_id: data.doctor_id,
          appointment_datetime: appointmentDateTime.toISOString(),
          consultation_type: data.consultation_type,
          symptoms: data.symptoms,
          notes: data.notes,
          status: 'scheduled',
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Appointment booked successfully!",
      })

      form.reset()
    } catch (error: any) {
      console.error('Error booking appointment:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to book appointment",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchDoctors()
  }, [])

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Book an Appointment</CardTitle>
        <CardDescription>
          Schedule a consultation with one of our verified doctors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="doctor_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Doctor</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a doctor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          <div className="flex flex-col">
                            <span>{doctor.full_name}</span>
                            {doctor.specialization && (
                              <span className="text-sm text-muted-foreground">
                                {doctor.specialization}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="appointment_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="appointment_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 18 }, (_, i) => {
                          const hour = Math.floor(i / 2) + 9
                          const minute = i % 2 === 0 ? '00' : '30'
                          const time = `${hour.toString().padStart(2, '0')}:${minute}`
                          return (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="consultation_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consultation Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="in_person">In-Person</SelectItem>
                      <SelectItem value="video_call">Video Call</SelectItem>
                      <SelectItem value="phone_call">Phone Call</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Symptoms / Reason for Visit</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please describe your symptoms or reason for the consultation..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional information..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Booking..." : "Book Appointment"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
