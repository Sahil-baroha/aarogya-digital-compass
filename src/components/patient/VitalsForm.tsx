
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { usePatientProfile } from '@/hooks/usePatientProfile'
import { Activity, Heart, Thermometer, Weight } from 'lucide-react'

export const VitalsForm = () => {
  const { latestVitals, addVitals } = usePatientProfile()
  const [formData, setFormData] = useState({
    heart_rate: '',
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    temperature: '',
    weight: '',
    height: '',
    oxygen_saturation: '',
    blood_glucose: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const vitalsData = Object.entries(formData).reduce((acc, [key, value]) => {
      if (value.trim()) {
        acc[key as keyof typeof formData] = parseFloat(value)
      }
      return acc
    }, {} as Record<string, number>)

    const success = await addVitals(vitalsData)
    if (success) {
      setFormData({
        heart_rate: '',
        blood_pressure_systolic: '',
        blood_pressure_diastolic: '',
        temperature: '',
        weight: '',
        height: '',
        oxygen_saturation: '',
        blood_glucose: ''
      })
    }

    setIsSubmitting(false)
  }

  const calculateBMI = () => {
    const weight = parseFloat(formData.weight)
    const height = parseFloat(formData.height) / 100 // Convert cm to meters
    if (weight && height) {
      return (weight / (height * height)).toFixed(1)
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Latest Vitals Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Latest Vitals</span>
          </CardTitle>
          <CardDescription>Your most recent vital signs</CardDescription>
        </CardHeader>
        <CardContent>
          {latestVitals && Object.keys(latestVitals).length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {latestVitals.heart_rate && (
                <div className="text-center">
                  <Heart className="h-6 w-6 mx-auto mb-2 text-red-500" />
                  <p className="text-sm text-gray-600">Heart Rate</p>
                  <p className="font-semibold">{latestVitals.heart_rate} bpm</p>
                </div>
              )}
              {latestVitals.blood_pressure_systolic && latestVitals.blood_pressure_diastolic && (
                <div className="text-center">
                  <Activity className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                  <p className="text-sm text-gray-600">Blood Pressure</p>
                  <p className="font-semibold">
                    {latestVitals.blood_pressure_systolic}/{latestVitals.blood_pressure_diastolic} mmHg
                  </p>
                </div>
              )}
              {latestVitals.temperature && (
                <div className="text-center">
                  <Thermometer className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                  <p className="text-sm text-gray-600">Temperature</p>
                  <p className="font-semibold">{latestVitals.temperature}°F</p>
                </div>
              )}
              {latestVitals.weight && (
                <div className="text-center">
                  <Weight className="h-6 w-6 mx-auto mb-2 text-green-500" />
                  <p className="text-sm text-gray-600">Weight</p>
                  <p className="font-semibold">{latestVitals.weight} kg</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">No vitals recorded yet</p>
          )}
        </CardContent>
      </Card>

      {/* Add New Vitals */}
      <Card>
        <CardHeader>
          <CardTitle>Record New Vitals</CardTitle>
          <CardDescription>Enter your current vital signs</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="heart_rate">Heart Rate (bpm)</Label>
                <Input
                  id="heart_rate"
                  type="number"
                  value={formData.heart_rate}
                  onChange={(e) => setFormData({ ...formData, heart_rate: e.target.value })}
                  placeholder="e.g., 72"
                />
              </div>

              <div>
                <Label htmlFor="temperature">Temperature (°F)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                  placeholder="e.g., 98.6"
                />
              </div>

              <div>
                <Label htmlFor="blood_pressure_systolic">Systolic BP (mmHg)</Label>
                <Input
                  id="blood_pressure_systolic"
                  type="number"
                  value={formData.blood_pressure_systolic}
                  onChange={(e) => setFormData({ ...formData, blood_pressure_systolic: e.target.value })}
                  placeholder="e.g., 120"
                />
              </div>

              <div>
                <Label htmlFor="blood_pressure_diastolic">Diastolic BP (mmHg)</Label>
                <Input
                  id="blood_pressure_diastolic"
                  type="number"
                  value={formData.blood_pressure_diastolic}
                  onChange={(e) => setFormData({ ...formData, blood_pressure_diastolic: e.target.value })}
                  placeholder="e.g., 80"
                />
              </div>

              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="e.g., 70.5"
                />
              </div>

              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  placeholder="e.g., 175"
                />
              </div>

              <div>
                <Label htmlFor="oxygen_saturation">Oxygen Saturation (%)</Label>
                <Input
                  id="oxygen_saturation"
                  type="number"
                  value={formData.oxygen_saturation}
                  onChange={(e) => setFormData({ ...formData, oxygen_saturation: e.target.value })}
                  placeholder="e.g., 98"
                />
              </div>

              <div>
                <Label htmlFor="blood_glucose">Blood Glucose (mg/dL)</Label>
                <Input
                  id="blood_glucose"
                  type="number"
                  value={formData.blood_glucose}
                  onChange={(e) => setFormData({ ...formData, blood_glucose: e.target.value })}
                  placeholder="e.g., 90"
                />
              </div>
            </div>

            {calculateBMI() && (
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm text-blue-700">
                  Calculated BMI: <span className="font-semibold">{calculateBMI()}</span>
                </p>
              </div>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Recording...' : 'Record Vitals'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
