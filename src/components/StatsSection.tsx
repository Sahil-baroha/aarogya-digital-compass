
import { Card, CardContent } from "@/components/ui/card";

export const StatsSection = () => {
  const stats = [
    {
      number: "1.4B+",
      label: "Indians Served",
      description: "Potential reach through ABDM integration"
    },
    {
      number: "99.9%",
      label: "Uptime SLA",
      description: "Enterprise-grade reliability"
    },
    {
      number: "<200ms",
      label: "API Response",
      description: "Ultra-fast healthcare data access"
    },
    {
      number: "256-bit",
      label: "Encryption",
      description: "Bank-grade security standards"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-green-600 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Built for Scale</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Enterprise-grade infrastructure designed to serve India's healthcare needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg font-semibold mb-1">{stat.label}</div>
                <div className="text-sm opacity-80">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
