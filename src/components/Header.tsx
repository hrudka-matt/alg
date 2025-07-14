
import { Scale, Search, FileText } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-primary shadow-lg border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-accent p-2 rounded-lg">
              <Scale className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary-foreground">LegalSearch Pro</h1>
              <p className="text-sm text-primary-foreground/80">Litigation & Financial Intelligence</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm text-primary-foreground/90 bg-primary-foreground/10 rounded-full px-3 py-1">
              <Search className="h-4 w-4" />
              <span>Multi-Source Research</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-primary-foreground/90 bg-primary-foreground/10 rounded-full px-3 py-1">
              <FileText className="h-4 w-4" />
              <span>Real-Time Data</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
