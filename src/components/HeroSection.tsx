
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const HeroSection = () => {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 -z-10" />
      
      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-8">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-green-600 text-white">
            🚀 MVP Launch Ready
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-green-600 to-purple-600 bg-clip-text text-transparent leading-tight">
            Aarogya Bharat
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
            India's Next-Generation Digital Healthcare Platform
          </p>
          <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
            Integrating ABDM, AI diagnostics, telemedicine, blockchain security, and Ayurvedic wellness 
            into one comprehensive healthcare ecosystem
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button size="lg" className="text-lg px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
            Explore Platform
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 py-3">
            View Architecture
          </Button>
        </div>
        
        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">8</div>
            <div className="text-sm text-muted-foreground">Core Modules</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
            <div className="text-sm text-muted-foreground">ABDM Compliant</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
            <div className="text-sm text-muted-foreground">AI Support</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">🔒</div>
            <div className="text-sm text-muted-foreground">Blockchain Secured</div>
          </div>
        </div>
      </div>
    </section>
  );
};
