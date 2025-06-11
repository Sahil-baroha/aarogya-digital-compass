
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, Download, Eye, Calendar, User } from 'lucide-react'
import { format } from 'date-fns'
import { supabase } from '@/integrations/supabase/client'
import { useAuthContext } from '@/components/AuthProvider'
import { useToast } from '@/hooks/use-toast'

interface HealthDocument {
  id: string
  title: string
  description?: string
  document_type: string
  file_url?: string
  created_at: string
  uploaded_by: string
  is_verified: boolean
}

interface Prescription {
  id: string
  prescription_data: any
  valid_until?: string
  created_at: string
  status: string
  doctor: {
    full_name: string
    specialization?: string
  }
}

export const MedicalRecords = () => {
  const [documents, setDocuments] = useState<HealthDocument[]>([])
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuthContext()
  const { toast } = useToast()

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

      const formattedPrescriptions = data.map(prescription => ({
        id: prescription.id,
        prescription_data: prescription.prescription_data,
        valid_until: prescription.valid_until,
        created_at: prescription.created_at,
        status: prescription.status,
        doctor: {
          full_name: prescription.doctor.profiles.full_name,
          specialization: prescription.doctor.specialization,
        },
      }))

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

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case 'lab_report':
        return 'bg-blue-100 text-blue-800'
      case 'prescription':
        return 'bg-green-100 text-green-800'
      case 'imaging':
        return 'bg-purple-100 text-purple-800'
      case 'medical_certificate':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPrescriptionStatusColor = (status: string) => {
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

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchDocuments(), fetchPrescriptions()])
      setLoading(false)
    }

    loadData()
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
      <div>
        <h2 className="text-2xl font-bold mb-2">Medical Records</h2>
        <p className="text-gray-600">View your health documents and prescriptions</p>
      </div>

      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="documents">Health Documents</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          {documents.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No documents</h3>
                <p className="text-gray-500">
                  Your health documents will appear here once uploaded.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {documents.map((document) => (
                <Card key={document.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{document.title}</CardTitle>
                        {document.description && (
                          <CardDescription>{document.description}</CardDescription>
                        )}
                      </div>
                      <div className="flex gap-2 items-center">
                        {document.is_verified && (
                          <Badge variant="secondary">Verified</Badge>
                        )}
                        <Badge className={getDocumentTypeColor(document.document_type)}>
                          {document.document_type.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(document.created_at), 'PPP')}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        {document.file_url && (
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download
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

        <TabsContent value="prescriptions" className="space-y-4">
          {prescriptions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No prescriptions</h3>
                <p className="text-gray-500">
                  Your prescriptions will appear here once issued by doctors.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {prescriptions.map((prescription) => (
                <Card key={prescription.id}>
                  <CardHeader className="pb-3">
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
                      <Badge className={getPrescriptionStatusColor(prescription.status)}>
                        {prescription.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>Issued: {format(new Date(prescription.created_at), 'PPP')}</span>
                        </div>
                        {prescription.valid_until && (
                          <div className="text-gray-500">
                            Valid until: {format(new Date(prescription.valid_until), 'PPP')}
                          </div>
                        )}
                      </div>
                      
                      {prescription.prescription_data?.medications && (
                        <div>
                          <h4 className="font-medium text-sm mb-2">Medications:</h4>
                          <div className="space-y-1">
                            {prescription.prescription_data.medications.map((med: any, index: number) => (
                              <div key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                <span className="font-medium">{med.name}</span>
                                {med.dosage && <span className="ml-2">- {med.dosage}</span>}
                                {med.frequency && <span className="ml-2">({med.frequency})</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View Full
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
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
