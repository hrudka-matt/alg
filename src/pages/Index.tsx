
import { useState } from "react";
import { SearchForm } from "@/components/SearchForm";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface SearchResult {
  id: string;
  type: 'litigation' | 'ppp' | 'profile';
  data: any;
}

const Index = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("search");

  const handleSearch = async (query: string, dateRange: { start: string; end: string }) => {
    setIsLoading(true);
    
    try {
      // Simulate API calls - in real implementation, these would call actual APIs
      const mockResults: SearchResult[] = [
        {
          id: "1",
          type: "litigation",
          data: {
            caseTitle: "Securities Class Action vs " + query,
            court: "U.S. District Court, S.D.N.Y.",
            filingDate: "2023-03-15",
            status: "Pending",
            allegations: "Securities fraud, misleading financial statements",
            leadPlaintiff: "Pension Fund XYZ",
            estimatedDamages: "$45.2M"
          }
        },
        {
          id: "2",
          type: "ppp",
          data: {
            businessName: query,
            loanAmount: "$150,000",
            approvalDate: "2020-05-12",
            lender: "Bank of America",
            jobsReported: 25,
            forgiven: true,
            forgivenessDate: "2021-08-22"
          }
        },
        {
          id: "3",
          type: "profile",
          data: {
            companyName: query,
            industry: "Technology",
            employees: "1,000-5,000",
            revenue: "$50M-$100M",
            founded: "2015",
            headquarters: "San Francisco, CA",
            website: "www.example.com"
          }
        }
      ];
      
      setSearchResults(mockResults);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Legal & Financial Research Platform
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive company research across litigation, PPP loans, and financial profiles
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="search">Search & Research</TabsTrigger>
              <TabsTrigger value="results">Results & Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="search" className="space-y-6">
              <SearchForm onSearch={handleSearch} isLoading={isLoading} />
            </TabsContent>
            
            <TabsContent value="results" className="space-y-6">
              <ResultsDisplay results={searchResults} isLoading={isLoading} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Index;
