import { useState } from "react";
import { SearchForm } from "@/components/SearchForm";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export interface SearchResult {
  id: string;
  type: 'litigation' | 'ppp' | 'profile';
  data: any;
}

const Index = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("search");
  const { toast } = useToast();

  const handleSearch = async (query: string, dateRange: { start: string; end: string }, searchSources: any) => {
    setIsLoading(true);
    
    try {
      console.log('Starting search for:', query);
      
      // Use the Supabase project URL for Edge Functions
      const supabaseUrl = 'https://xthmhwbgpdnknlrxiuzj.supabase.co';
      const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0aG1od2JncGRua25scnhpdXpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4OTQwMTYsImV4cCI6MjA1MjQ3MDAxNn0.f8tVEXYz_bwOuJUGdK8vXgRSQDdgqzlqKRDaKqSZSNQ';
      
      const response = await fetch(`${supabaseUrl}/functions/v1/unified-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          query,
          dateRange,
          searchSources
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Search response error:', response.status, errorText);
        throw new Error(`Search failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Search results:', data);
      
      setSearchResults(data.results || []);
      
      // Switch to results tab after successful search
      setActiveTab("results");
      
      toast({
        title: "Search completed",
        description: `Found ${data.results?.length || 0} results for "${query}"`,
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
