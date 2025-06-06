
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  tech: string;
  status: string;
}

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

export const FeatureCard = ({ feature, index }: FeatureCardProps) => {
  const { icon: Icon, title, description, tech, status } = feature;
  
  const statusColors = {
    "Core": "bg-blue-100 text-blue-800",
    "AI-Powered": "bg-purple-100 text-purple-800",
    "Live": "bg-green-100 text-green-800",
    "Secure": "bg-orange-100 text-orange-800",
    "Smart": "bg-pink-100 text-pink-800",
    "Fintech": "bg-yellow-100 text-yellow-800",
    "Wellness": "bg-emerald-100 text-emerald-800",
    "Enterprise": "bg-gray-100 text-gray-800"
  };

  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-green-50 group-hover:from-blue-100 group-hover:to-green-100 transition-all duration-300">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <Badge className={statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
            {status}
          </Badge>
        </div>
        <CardTitle className="text-lg group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
        <div className="text-xs text-muted-foreground font-mono bg-muted/50 p-2 rounded">
          {tech}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
        >
          Learn More
        </Button>
      </CardContent>
    </Card>
  );
};
