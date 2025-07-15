import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Building, FileText, Users, Scale } from "lucide-react";

interface SearchSources {
  litigation: boolean;
  ppp: boolean;
  profile: boolean;
  paga: boolean;
}

interface SearchFormProps {
  onSearch: (query: string, dateRange: { start: string; end: string }, searchSources: SearchSources) => void;
  isLoading: boolean;
}

export const SearchForm = ({ onSearch, isLoading }: SearchFormProps) => {
  const [query, setQuery] = useState("");
  const [startDate, setStartDate] = useState(() => {
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
    return fiveYearsAgo.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [searchSources, setSearchSources] = useState({
    litigation: true,
    ppp: true,
    profile: true,
    paga: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const dateRange = {
      start: startDate,
      end: endDate
    };

    onSearch(query, dateRange, searchSources);
  };

  return (
    <Card className="w-full bg-white rounded-lg shadow-md border border-gray-300">
      <CardContent className="p-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🔍</span>
          <h2 className="text-xl font-bold text-gray-700">Company Research</h2>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          Search across litigation records, PPP loans, PAGA filings, and company profiles
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Name - Full width */}
          <div className="space-y-2">
            <Label htmlFor="company" className="block text-sm font-medium text-gray-700">
              Company Name
            </Label>
            <Input
              id="company"
              placeholder="Enter company name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 text-gray-900 bg-white"
            />
          </div>

          {/* Date Range - Side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Start Date <span className="text-gray-400 font-normal">(Default: 5 years ago)</span>
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 text-gray-900 bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                End Date <span className="text-gray-400 font-normal">(Default: Today)</span>
              </Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 text-gray-900 bg-white"
              />
            </div>
          </div>

          {/* Data Sources */}
          <div className="space-y-4">
            <h3 className="text-base font-medium text-gray-700">Data Sources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200">
                <Checkbox
                  id="litigation"
                  checked={searchSources.litigation}
                  onCheckedChange={(checked) =>
                    setSearchSources(prev => ({ ...prev, litigation: checked as boolean }))
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="litigation" className="flex items-center space-x-2 cursor-pointer">
                  <span className="text-sm">📋</span>
                  <span className="text-sm font-medium text-gray-700">Trellis Litigation</span>
                </Label>
              </div>

              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200">
                <Checkbox
                  id="ppp"
                  checked={searchSources.ppp}
                  onCheckedChange={(checked) =>
                    setSearchSources(prev => ({ ...prev, ppp: checked as boolean }))
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="ppp" className="flex items-center space-x-2 cursor-pointer">
                  <span className="text-sm">💰</span>
                  <span className="text-sm font-medium text-gray-700">PPP Loans</span>
                </Label>
              </div>

              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200">
                <Checkbox
                  id="profile"
                  checked={searchSources.profile}
                  onCheckedChange={(checked) =>
                    setSearchSources(prev => ({ ...prev, profile: checked as boolean }))
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="profile" className="flex items-center space-x-2 cursor-pointer">
                  <span className="text-sm">👥</span>
                  <span className="text-sm font-medium text-gray-700">People Data Labs</span>
                </Label>
              </div>

              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200">
                <Checkbox
                  id="paga"
                  checked={searchSources.paga}
                  onCheckedChange={(checked) =>
                    setSearchSources(prev => ({ ...prev, paga: checked as boolean }))
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="paga" className="flex items-center space-x-2 cursor-pointer">
                  <span className="text-sm">📊</span>
                  <span className="text-sm font-medium text-gray-700">PAGA Filings</span>
                </Label>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-md transition-all duration-200 disabled:cursor-not-allowed" 
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Searching...
              </div>
            ) : (
              "🔍 Search All Sources"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};