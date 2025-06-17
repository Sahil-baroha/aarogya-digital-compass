
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, FileText, Activity, Clock } from 'lucide-react'

interface QuickStatsProps {
  upcomingAppointments: number
  totalRecords: number
  lastVitalsDate?: string
  healthScore?: number
}

export const QuickStats = ({ 
  upcomingAppointments, 
  totalRecords, 
  lastVitalsDate, 
  healthScore 
}: QuickStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{upcomingAppointments}</div>
          <p className="text-xs text-muted-foreground">
            Next 30 days
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Medical Records</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRecords}</div>
          <p className="text-xs text-muted-foreground">
            Total documents
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last Vitals</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {lastVitalsDate ? 'Recorded' : 'None'}
          </div>
          <p className="text-xs text-muted-foreground">
            {lastVitalsDate ? `${lastVitalsDate}` : 'Record vitals today'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Health Score</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold">{healthScore || 'N/A'}</div>
            {healthScore && (
              <Badge variant={healthScore >= 80 ? 'default' : healthScore >= 60 ? 'secondary' : 'destructive'}>
                {healthScore >= 80 ? 'Good' : healthScore >= 60 ? 'Fair' : 'Needs Attention'}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Based on recent vitals
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
