
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AbhaVerification } from './AbhaVerification'
import { AadhaarVerification } from './AadhaarVerification'
import { SecuritySettings } from '../security/SecuritySettings'
import { Shield, CreditCard, Settings } from 'lucide-react'

export const VerificationPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Identity Verification & Security</h1>
        <p className="text-gray-600 mt-2">
          Secure your health records with government-verified identity and enhanced security settings
        </p>
      </div>

      <Tabs defaultValue="abha" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="abha" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>ABHA ID</span>
          </TabsTrigger>
          <TabsTrigger value="aadhaar" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Aadhaar</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="abha" className="mt-6">
          <AbhaVerification />
        </TabsContent>

        <TabsContent value="aadhaar" className="mt-6">
          <AadhaarVerification />
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <SecuritySettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
