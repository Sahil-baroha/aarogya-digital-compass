
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, Download, Upload, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { supabase } from '@/integrations/supabase/client'
import { useAuthContext } from '@/components/AuthProvider'
import { useToast } from '@/hooks/use-toast'

interface Prescription {
  id: string
  prescription_data: any
  valid_until: string
  created_at: string
  status: string
  doctor: {
    full_name: string
    specialization?: string
  }
}

interface HealthDocument {
  id: string
  title: string
  document_type: string
  file_url?: string
  created_at: string
  description?: string
  is_verified: boolean
}

export const MedicalRecords = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [documents, setDocuments] = useState<HealthDocument[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuthContext()
  const { toast } = useToast()

  const fetchPrescriptions = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .select(`
          id,
          prescription_data,
          valid_until,
          created_at,
          status,
          doctor:doctor_profiles!inner(
            profiles!inner(full_name),
            specialization
          )
        `)
        .eq('patient_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedPrescriptions = data.map(prescription => {
        // Handle doctor data safely
        const doctorData = prescription.doctor as any
        let doctorFullName = 'Unknown Doctor'
        let doctorSpecialization = undefined

        if (Array.isArray(doctorData)) {
          const firstDoctor = doctorData[0]
          if (firstDoctor?.profiles) {
            const profileData = firstDoctor.profiles
            doctorFullName = Array.isArray(profileData) ? profileData[0]?.full_name : profileData?.full_name
          }
          doctorSpecialization = firstDoctor?.specialization
        } else if (doctorData?.profiles) {
          const profileData = doctorData.profiles
          doctorFullName = Array.isArray(profileData) ? profileData[0]?.full_name : profileData?.full_name
          doctorSpecialization = doctorData.specialization
        }

        return {
          id: prescription.id,
          prescription_data: prescription.prescription_data,
          valid_until: prescription.valid_until,
          created_at: prescription.created_at,
          status: prescription.status,
          doctor: {
            full_name: doctorFullName || 'Unknown Doctor',
            specialization: doctorSpecialization,
          },
        }
      })

      setPrescriptions(formattedPrescriptions)
    } catch (error: any) {
      console.error('Error fetching prescriptions:', error)
      toast({
        title: "Error",
        description: "Failed to load prescriptions",
        variant: "destructive",
      })
    }
  }

  const fetchDocuments = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('health_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setDocuments(data || [])
    } catch (error: any) {
      console.error('Error fetching documents:', error)
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'issued':
        return 'bg-green-100 text-green-800'
      case 'dispensed':
        return 'bg-blue-100 text-blue-800'
      case 'expired':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case 'lab_report':
        return 'bg-purple-100 text-purple-800'
      case 'prescription':
        return 'bg-green-100 text-green-800'
      case 'medical_certificate':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await Promise.all([fetchPrescriptions(), fetchDocuments()])
      setLoading(false)
    }

    if (user) {
      fetchData()
    }
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Medical Records</h2>
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      <Tabs defaultValue="prescriptions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="prescriptions" className="space-y-4">
          {prescriptions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No prescriptions</h3>
                <p className="text-gray-500">
                  Your prescriptions will appear here once doctors issue them.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {prescriptions.map((prescription) => (
                <Card key={prescription.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          Prescription from Dr. {prescription.doctor.full_name}
                        </CardTitle>
                        {prescription.doctor.specialization && (
                          <CardDescription>
                            {prescription.doctor.specialization}
                          </CardDescription>
                        )}
                      </div>
                      <Badge className={getStatusColor(prescription.status)}>
                        {prescription.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          Issued: {format(new Date(prescription.created_at), 'PPP')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          Valid until: {format(new Date(prescription.valid_until), 'PPP')}
                        </span>
                      </div>
                    </div>

                    {prescription.prescription_data?.medications && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Medications:</h4>
                        <div className="space-y-2">
                          {prescription.prescription_data.medications.map((med: any, index: number) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg">
                              <div className="font-medium">{med.name}</div>
                              <div className="text-sm text-gray-600">
                                Dosage: {med.dosage} | Duration: {med.duration}
                              </div>
                              {med.instructions && (
                                <div className="text-sm text-gray-600">
                                  Instructions: {med.instructions}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          {documents.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No documents</h3>
                <p className="text-gray-500">
                  Upload your medical documents to keep them organized and accessible.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {documents.map((document) => (
                <Card key={document.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{document.title}</h3>
                          <Badge className={getDocumentTypeColor(document.document_type)}>
                            {document.document_type.replace('_', ' ')}
                          </Badge>
                          {document.is_verified && (
                            <Badge variant="outline" className="text-green-600">
                              Verified
                            </Badge>
                          )}
                        </div>
                        {document.description && (
                          <p className="text-sm text-gray-600 mb-2">{document.description}</p>
                        )}
                        <p className="text-xs text-gray-500">
                          Uploaded: {format(new Date(document.created_at), 'PPP')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {document.file_url && (
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
