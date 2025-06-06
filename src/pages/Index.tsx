
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Search, 
  Calendar, 
  FileText, 
  Shield, 
  Heart,
  Leaf,
  Lock
} from "lucide-react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { FeatureCard } from "@/components/FeatureCard";
import { StatsSection } from "@/components/StatsSection";
import { Footer } from "@/components/Footer";

const features = [
  {
    icon: User,
    title: "Digital Health Identity",
    description: "Secure ABDM & DigiLocker integration for unified health records",
    tech: "FHIR APIs, OAuth2, JWT",
    status: "Core"
  },
  {
    icon: Search,
    title: "AI Symptom Checker",
    description: "24/7 intelligent symptom analysis with NLP and machine learning",
    tech: "GPT, BERT, Vector DB",
    status: "AI-Powered"
  },
  {
    icon: Calendar,
    title: "Telemedicine Booking",
    description: "Video consultations with appointment scheduling and WebRTC",
    tech: "WebRTC, Twilio, Real-time",
    status: "Live"
  },
  {
    icon: FileText,
    title: "E-Prescriptions",
    description: "Digital prescriptions with pharmacy integration via ONDC",
    tech: "FHIR, Digital Signatures",
    status: "Secure"
  },
  {
    icon: Shield,
    title: "Insurance Recommendations",
    description: "ML-driven health insurance plan matching and comparison",
    tech: "ML Algorithms, API Integration",
    status: "Smart"
  },
  {
    icon: Heart,
    title: "Healthcare Loans",
    description: "Instant medical financing through NBFC partnerships",
    tech: "OCEN APIs, e-KYC",
    status: "Fintech"
  },
  {
    icon: Leaf,
    title: "Ayurvedic Wellness",
    description: "Personalized Ayush protocols with NAMASTE integration",
    tech: "Traditional Medicine DB",
    status: "Wellness"
  },
  {
    icon: Lock,
    title: "Blockchain Security",
    description: "Immutable patient data with Hyperledger Fabric",
    tech: "Blockchain, Smart Contracts",
    status: "Enterprise"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      
      {/* Features Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Comprehensive Healthcare Ecosystem
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Eight integrated modules powered by cutting-edge technology to revolutionize healthcare delivery in India
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </section>

      <StatsSection />
      
      {/* Architecture Overview */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">System Architecture</h2>
            <p className="text-xl text-muted-foreground">
              Built on modern microservices with secure API integrations
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <CardTitle className="text-blue-600">Frontend Layer</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• React Native/Flutter Mobile App</li>
                  <li>• Progressive Web Application</li>
                  <li>• WebRTC Video Integration</li>
                  <li>• Responsive UI/UX Design</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardHeader>
                <CardTitle className="text-green-600">Backend Services</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Microservices Architecture</li>
                  <li>• ABDM FHIR API Integration</li>
                  <li>• AI/ML Processing Pipeline</li>
                  <li>• Secure Payment Gateways</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:border-purple-200 transition-colors">
              <CardHeader>
                <CardTitle className="text-purple-600">Security & Data</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Blockchain Audit Trail</li>
                  <li>• End-to-End Encryption</li>
                  <li>• HIPAA Compliance</li>
                  <li>• Multi-Factor Authentication</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
