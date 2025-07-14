
import { useState } from "react";
import { SearchForm } from "@/components/SearchForm";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export interface SearchResult {
  id: string;
  type: 'litigation' | 'ppp' | 'profile' | 'paga';
  data: any;
}

const Index = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("search");
  const { toast } = useToast();

  const generateDummyData = (query: string, searchSources: any): SearchResult[] => {
    const results: SearchResult[] = [];

    // Generate litigation data if enabled
    if (searchSources.litigation) {
      results.push({
        id: `litigation-${Date.now()}`,
        type: 'litigation',
        data: {
          caseTitle: `Securities Class Action vs ${query}`,
          court: "U.S. District Court, S.D.N.Y.",
          filingDate: "2023-03-15",
          status: "Pending",
          allegations: "Securities fraud, misleading financial statements, failure to disclose material information",
          leadPlaintiff: "Teachers' Retirement System",
          estimatedDamages: "$45.2M"
        }
      });
    }

    // Generate PPP data if enabled
    if (searchSources.ppp) {
      results.push({
        id: `ppp-${Date.now()}`,
        type: 'ppp',
        data: {
          businessName: query,
          loanAmount: "$150,000",
          approvalDate: "2020-05-12",
          lender: "Bank of America",
          jobsReported: 25,
          forgiven: true,
          forgivenessDate: "2021-08-22"
        }
      });
    }

    // Generate profile data if enabled
    if (searchSources.profile) {
      results.push({
        id: `profile-${Date.now()}`,
        type: 'profile',
        data: {
          companyName: query,
          industry: "Retail Trade",
          employees: "2,300,000",
          revenue: "$611.3B",
          founded: "1962",
          headquarters: "Bentonville, AR",
          website: "www.walmart.com",
          description: "Multinational retail corporation operating hypermarkets, discount department stores, and grocery stores."
        }
      });
    }

    // Generate PAGA data if enabled
    if (searchSources.paga) {
      results.push({
        id: `paga-${Date.now()}`,
        type: 'paga',
        data: {
          businessName: query,
          filingDate: "2023-09-15",
          court: "Superior Court of California, Los Angeles County",
          caseNumber: "BC712345",
          allegations: "Failure to provide meal and rest breaks, unpaid overtime wages, wage statement violations",
          status: "Active",
          plaintiffAttorney: "Smith & Associates",
          estimatedPenalties: "$280,000",
          affectedEmployees: 150
        }
      });
    }

    return results;
  };

  const handleSearch = async (query: string, dateRange: { start: string; end: string }, searchSources: any) => {
    setIsLoading(true);
    
    try {
      console.log('Starting search for:', query);
      console.log('Date range:', dateRange);
      console.log('Search sources:', searchSources);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const dummyResults = generateDummyData(query, searchSources);
      setSearchResults(dummyResults);
      
      // Switch to results tab after successful search
      setActiveTab("results");
      
      toast({
        title: "Search completed",
        description: `Found ${dummyResults.length} results for "${query}"`,
      });
      
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search failed",
        description: "Unable to complete search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Legal & Financial Research Platform
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive company research across litigation, PPP loans, and financial profiles
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/80 backdrop-blur-sm">
              <TabsTrigger 
                value="search" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
              >
                Search & Research
              </TabsTrigger>
              <TabsTrigger 
                value="results"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
              >
                Results & Analysis
              </TabsTrigger>
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
