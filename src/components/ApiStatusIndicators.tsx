
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Building, Users, Scale, CircleDot } from "lucide-react";

interface ApiStatus {
  connected: boolean;
  name: string;
}

interface ApiStatusIndicatorsProps {
  apiStatus: {
    litigation: ApiStatus;
    ppp: ApiStatus;
    profile: ApiStatus;
    paga: ApiStatus;
  };
}

export const ApiStatusIndicators = ({ apiStatus }: ApiStatusIndicatorsProps) => {
  const indicators = [
    {
      key: 'litigation',
      icon: FileText,
      ...apiStatus.litigation
    },
    {
      key: 'ppp',
      icon: Building,
      ...apiStatus.ppp
    },
    {
      key: 'profile',
      icon: Users,
      ...apiStatus.profile
    },
    {
      key: 'paga',
      icon: Scale,
      ...apiStatus.paga
    }
  ];

  return (
    <Card className="bg-muted/30 border-border/50">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-3 justify-center">
          {indicators.map((indicator) => {
            const Icon = indicator.icon;
            return (
              <div key={indicator.key} className="flex items-center space-x-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{indicator.name}</span>
                <div className="flex items-center space-x-1">
                  <CircleDot 
                    className={`h-3 w-3 ${
                      indicator.connected 
                        ? 'text-green-600' 
                        : 'text-muted-foreground'
                    }`} 
                  />
                  <Badge 
                    variant={indicator.connected ? 'default' : 'secondary'}
                    className={`text-xs px-2 py-0.5 ${
                      indicator.connected 
                        ? 'bg-green-100 text-green-800 border-green-200' 
                        : 'bg-muted text-muted-foreground border-border'
                    }`}
                  >
                    {indicator.connected ? 'Live' : 'Demo'}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
