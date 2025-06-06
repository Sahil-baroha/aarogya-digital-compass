
import { Badge } from "@/components/ui/badge";

export const Footer = () => {
  return (
    <footer className="py-12 px-4 bg-muted/30 border-t">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div>
                <h3 className="font-bold">Aarogya Bharat</h3>
                <Badge variant="secondary" className="text-xs">MVP System</Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Revolutionizing healthcare delivery through technology and innovation.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Core Modules</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Digital Health Identity</li>
              <li>AI Symptom Checker</li>
              <li>Telemedicine Platform</li>
              <li>E-Prescriptions</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Advanced Features</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Insurance Recommendations</li>
              <li>Healthcare Loans</li>
              <li>Ayurvedic Wellness</li>
              <li>Blockchain Security</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Compliance</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>ABDM Integrated</li>
              <li>HIPAA Compliant</li>
              <li>IRDAI Guidelines</li>
              <li>NDHM Standards</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 Aarogya Bharat. Built with modern architecture for India's digital health future.</p>
        </div>
      </div>
    </footer>
  );
};
