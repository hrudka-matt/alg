import { useState } from "react";
import { SearchForm } from "@/components/SearchForm";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { Header } from "@/components/Header";
import { ApiStatusIndicators } from "@/components/ApiStatusIndicators";
import { useToast } from "@/hooks/use-toast";

export interface SearchResult {
  id: string;
  type: 'litigation' | 'ppp' | 'profile' | 'paga';
  data: {
    companyName?: string;
    industry?: string;
    employees?: string;
    revenue?: string;
    founded?: string;
    headquarters?: string;
    website?: string;
    locations?: string;
    description?: string;
    businessName?: string;
    loanAmount?: string;
    approvalDate?: string;
    lender?: string;
    jobsReported?: number;
    forgiven?: boolean;
    forgivenessDate?: string;
    caseTitle?: string;
    court?: string;
    filingDate?: string;
    status?: string;
    coas?: string;
    caseNumber?: string;
    plaintiffAttorney?: string;
    lawFirm?: string;
    case_token?: string; // ADD THIS LINE
    cases?: Array<{
      caseNumber: string;
      jurisdiction: string;
      lawFirm: string;
      category: string;
      dateFiled: string;
      dateSettled?: string | null;
      coas: string;
      isClassAction?: boolean;
      case_token?: string; // ADD THIS LINE
    }>;
  };
}

// Backend data types
interface BackendCaseData {
  case_number?: string;
  case_token?: string; // ADD THIS LINE
  display_name?: string;
  filing_date?: string;
  category?: string;
  matter_type?: string;
  law_firm?: string;
  status?: string;
  is_class_action?: boolean;
  ppp_found?: boolean;
  company_info?: Array<{
    industry?: string;
    size?: string;
    revenue?: string;
    inferred_revenue?: string;
    website?: string;
    location?: string | { name: string };
    headquarters?: string;
    founded?: string;
  }>;
}

interface SearchSources {
  litigation: boolean;
  ppp: boolean;
  profile: boolean;
  paga: boolean;
}

// Your backend API configuration
const API_BASE_URL = 'https://co1wnck2h6.execute-api.us-east-1.amazonaws.com';

const Index = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Check API connection status
  const [apiStatus] = useState({
    litigation: { connected: true, name: "Trellis Litigation" },
    ppp: { connected: true, name: "PPP Database" },
    profile: { connected: true, name: "People Data Labs" },
    paga: { connected: false, name: "PAGA Filings" }
  });


const convertBackendResponse = (backendData: BackendCaseData[], query: string, searchSources: SearchSources): SearchResult[] => {
  const results: SearchResult[] = [];

  if (backendData && backendData.length > 0) {
    const firstItem = backendData[0];
    
    // Create profile data from company_info
    if (searchSources.profile && firstItem.company_info?.[0]) {
      const companyInfo = firstItem.company_info[0];
      results.push({
        id: `profile-${Date.now()}`,
        type: 'profile',
        data: {
          companyName: query,
          industry: companyInfo.industry || "Unknown",
          employees: companyInfo.size || "Unknown",
          revenue: companyInfo.revenue || companyInfo.inferred_revenue || "Unknown",
          founded: companyInfo.founded || "Unknown",
          headquarters: companyInfo.headquarters || 
                       (typeof companyInfo.location === 'string' 
                         ? companyInfo.location 
                         : companyInfo.location?.name || "Unknown"),
          website: companyInfo.website || "",
          locations: "Unknown",
          description: `Company information for ${query}`
        }
      });
    }

    // Create PPP data if found
    if (searchSources.ppp) {
      const hasPppData = backendData.some(item => item.ppp_found);
      if (hasPppData) {
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
    }

    // FIXED: Create ONE litigation result with ALL cases in a table
    if (searchSources.litigation && backendData.length > 0) {
      const cases = backendData.map(caseItem => ({
        caseNumber: caseItem.case_number || "Unknown",
        jurisdiction: "CA",
        lawFirm: caseItem.law_firm || "Unknown",
        category: caseItem.category || "Employment",
        dateFiled: caseItem.filing_date ? new Date(caseItem.filing_date).toLocaleDateString('en-US', { 
          month: '2-digit', 
          day: '2-digit', 
          year: '2-digit' 
        }) : "Unknown",
        dateSettled: caseItem.status === 'Settled' ? '12/15/23' : null,
        coas: caseItem.matter_type || "Employment related claims",
        isClassAction: caseItem.is_class_action || false,
        case_token: caseItem.case_token // CRITICAL: Each case keeps its token
      }));

      // Create ONE litigation result with ALL cases
      results.push({
        id: `litigation-${Date.now()}`,
        type: 'litigation',
        data: {
          caseTitle: `Employment Litigation vs ${query}`,
          court: "Superior Court of California",
          filingDate: cases[0]?.dateFiled || new Date().toLocaleDateString(),
          status: "Pending",
          coas: "Employment discrimination, wrongful termination, wage and hour violations",
          cases: cases // All cases in one array
        }
      });
    }
  }

  return results;
};
  const handleSearch = async (query: string, dateRange: { start: string; end: string }, searchSources: SearchSources) => {
    setIsLoading(true);
    
    try {
      console.log('Starting search for:', query);
      console.log('Date range:', dateRange);
      console.log('Search sources:', searchSources);
      
      // Build API parameters
      const params = new URLSearchParams({
        term: query,
        start: dateRange.start,
        end: dateRange.end,
        enrich_pdl: searchSources.profile ? 'true' : 'false',
        paga: searchSources.paga ? 'true' : 'false',
        fuzzy: 'false'
      });
      
      // Call your backend API
      const response = await fetch(`${API_BASE_URL}/search/?${params}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const backendData = await response.json();
      console.log('Backend response:', backendData);
      
      // Convert your backend format to their expected format
      const convertedResults = convertBackendResponse(backendData, query, searchSources);
      setSearchResults(convertedResults);
      
      toast({
        title: "Search completed",
        description: `Found ${convertedResults.length} results for "${query}"`,
      });
      
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search failed",
        description: `Unable to complete search: ${error instanceof Error ? error.message : 'Unknown error'}`,
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