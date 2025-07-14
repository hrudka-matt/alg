
import { useState } from "react";
import { SearchForm } from "@/components/SearchForm";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { Header } from "@/components/Header";
import { ApiStatusIndicators } from "@/components/ApiStatusIndicators";
import { useToast } from "@/hooks/use-toast";

export interface SearchResult {
  id: string;
  type: 'litigation' | 'ppp' | 'profile' | 'paga';
  data: any;
}

const Index = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // API connection status - currently using dummy data
  const apiStatus = {
    litigation: { connected: false, name: "Trellis Litigation" },
    ppp: { connected: false, name: "PPP Database" },
    profile: { connected: false, name: "People Data Labs" },
    paga: { connected: false, name: "PAGA Filings" }
  };

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
          coas: "Securities fraud, misleading financial statements, failure to disclose material information",
          cases: [
            {
              caseNumber: "1:23-cv-02156",
              jurisdiction: "S.D.N.Y.",
              lawFirm: "Robbins Geller",
              category: "Securities",
              dateFiled: "03/15/23",
              dateSettled: null,
              coas: "Securities fraud, misleading statements"
            },
            {
              caseNumber: "2:23-cv-03421",
              jurisdiction: "C.D. Cal.",
              lawFirm: "Bernstein Litowitz",
              category: "Consumer Protection",
              dateFiled: "05/22/23",
              dateSettled: null,
              coas: "Failure to disclose material information"
            },
            {
              caseNumber: "3:23-cv-04789",
              jurisdiction: "N.D. Ill.",
              lawFirm: "Kessler Topaz",
              category: "Data Privacy",
              dateFiled: "08/10/23",
              dateSettled: "12/15/23",
              coas: "Breach of fiduciary duty, unjust enrichment"
            }
          ]
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
          locations: "10,585",
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
          caseNumber: "BC712345",
          coas: "Failure to provide meal and rest breaks, unpaid overtime wages, wage statement violations",
          plaintiffAttorney: "Smith & Associates",
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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-accent/10">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent mb-4">
              Legal & Financial Research Platform
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive company research across litigation, PPP loans, and financial profiles
            </p>
          </div>

          <div className="space-y-8">
            <ApiStatusIndicators apiStatus={apiStatus} />
            <SearchForm onSearch={handleSearch} isLoading={isLoading} />
            <ResultsDisplay results={searchResults} isLoading={isLoading} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
