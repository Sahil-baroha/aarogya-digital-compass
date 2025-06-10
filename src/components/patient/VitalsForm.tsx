
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { usePatientProfile } from '@/hooks/usePatientProfile'
import { Heart, Thermometer, Weight, Activity, Droplets } from 'lucide-react'

export const VitalsForm = () => {
  const { latestVitals, addVitals } = usePatientProfile()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    
    const vitalsData = {
      heart_rate: parseInt(formData.get('heartRate') as string) || undefined,
      blood_pressure_systolic: parseInt(formData.get('systolic') as string) || undefined,
      blood_pressure_diastolic: parseInt(formData.get('diastolic') as string) || undefined,
      temperature: parseFloat(formData.get('temperature') as string) || undefined,
      weight: parseFloat(formData.get('weight') as string) || undefined,
      height: parseFloat(formData.get('height') as string) || undefined,
      oxygen_saturation: parseInt(formData.get('oxygenSaturation') as string) || undefined,
      blood_glucose: parseInt(formData.get('bloodGlucose') as string) || undefined,
    }

    // Calculate BMI if height and weight are provided
    if (vitalsData.height && vitalsData.weight) {
      const heightInMeters = vitalsData.height / 100
      vitalsData.bmi = parseFloat((vitalsData.weight / (heightInMeters * heightInMeters)).toFixed(1))
    }

    const success = await addVitals(vitalsData)
    if (success) {
      // Reset form
      e.currentTarget.reset()
    }
    setIsSubmitting(false)
  }

  return (
    <div className="space-y-6">
      {/* Current Vitals Display */}
      {latestVitals && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Latest Vitals</span>
            </CardTitle>
            <CardDescription>
              Recorded on {latestVitals.recorded_at ? new Date(latestVitals.recorded_at).toLocaleDateString() : 'Unknown'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {latestVitals.heart_rate && (
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <Heart className="h-6 w-6 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-600">{latestVitals.heart_rate}</div>
                  <div className="text-sm text-gray-600">bpm</div>
                </div>
              )}
              {(latestVitals.blood_pressure_systolic || latestVitals.blood_pressure_diastolic) && (
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Activity className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">
                    {latestVitals.blood_pressure_systolic || '?'}/{latestVitals.blood_pressure_diastolic || '?'}
                  </div>
                  <div className="text-sm text-gray-600">mmHg</div>
                </div>
              )}
              {latestVitals.temperature && (
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Thermometer className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-600">{latestVitals.temperature}°</div>
                  <div className="text-sm text-gray-600">Celsius</div>
                </div>
              )}
              {latestVitals.weight && (
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Weight className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{latestVitals.weight}</div>
                  <div className="text-sm text-gray-600">kg</div>
                </div>
              )}
              {latestVitals.bmi && (
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Activity className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">{latestVitals.bmi}</div>
                  <div className="text-sm text-gray-600">BMI</div>
                </div>
              )}
              {latestVitals.oxygen_saturation && (
                <div className="text-center p-4 bg-cyan-50 rounded-lg">
                  <Droplets className="h-6 w-6 text-cyan-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-cyan-600">{latestVitals.oxygen_saturation}%</div>
                  <div className="text-sm text-gray-600">SpO2</div>
                </div>
              )}
              {latestVitals.blood_glucose && (
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Droplets className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-600">{latestVitals.blood_glucose}</div>
                  <div className="text-sm text-gray-600">mg/dL</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add New Vitals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5" />
            <span>Record New Vitals</span>
          </CardTitle>
          <CardDescription>Enter your current vital signs measurements</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="heartRate" className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span>Heart Rate (bpm)</span>
                </Label>
                <Input
                  id="heartRate"
                  name="heartRate"
                  type="number"
                  min="40"
                  max="200"
                  placeholder="e.g., 72"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="systolic" className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  <span>Systolic BP (mmHg)</span>
                </Label>
                <Input
                  id="systolic"
                  name="systolic"
                  type="number"
                  min="70"
                  max="250"
                  placeholder="e.g., 120"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="diastolic">Diastolic BP (mmHg)</Label>
                <Input
                  id="diastolic"
                  name="diastolic"
                  type="number"
                  min="40"
                  max="150"
                  placeholder="e.g., 80"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="temperature" className="flex items-center space-x-2">
                  <Thermometer className="h-4 w-4 text-orange-500" />
                  <span>Temperature (°C)</span>
                </Label>
                <Input
                  id="temperature"
                  name="temperature"
                  type="number"
                  step="0.1"
                  min="35"
                  max="42"
                  placeholder="e.g., 36.5"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight" className="flex items-center space-x-2">
                  <Weight className="h-4 w-4 text-green-500" />
                  <span>Weight (kg)</span>
                </Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  step="0.1"
                  min="20"
                  max="300"
                  placeholder="e.g., 70.5"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  min="100"
                  max="250"
                  placeholder="e.g., 175"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="oxygenSaturation" className="flex items-center space-x-2">
                  <Droplets className="h-4 w-4 text-cyan-500" />
                  <span>Oxygen Saturation (%)</span>
                </Label>
                <Input
                  id="oxygenSaturation"
                  name="oxygenSaturation"
                  type="number"
                  min="70"
                  max="100"
                  placeholder="e.g., 98"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bloodGlucose" className="flex items-center space-x-2">
                  <Droplets className="h-4 w-4 text-yellow-500" />
                  <span>Blood Glucose (mg/dL)</span>
                </Label>
                <Input
                  id="bloodGlucose"
                  name="bloodGlucose"
                  type="number"
                  min="50"
                  max="500"
                  placeholder="e.g., 100"
                />
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Recording...' : 'Record Vitals'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
