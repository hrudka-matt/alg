
import { Scale, Search, FileText } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-lg border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">LegalSearch Pro</h1>
              <p className="text-sm text-blue-100">Litigation & Financial Intelligence</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm text-blue-100 bg-white/10 rounded-full px-3 py-1">
              <Search className="h-4 w-4" />
              <span>Multi-Source Research</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-blue-100 bg-white/10 rounded-full px-3 py-1">
              <FileText className="h-4 w-4" />
              <span>Real-Time Data</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
