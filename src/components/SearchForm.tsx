
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, Search, Building, FileText, Users } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SearchFormProps {
  onSearch: (query: string, dateRange: { start: string; end: string }) => void;
  isLoading: boolean;
}

export const SearchForm = ({ onSearch, isLoading }: SearchFormProps) => {
  const [query, setQuery] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [searchSources, setSearchSources] = useState({
    litigation: true,
    ppp: true,
    profile: true
  });

  // Set default date range to last 5 years
  const defaultStartDate = new Date();
  defaultStartDate.setFullYear(defaultStartDate.getFullYear() - 5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const dateRange = {
      start: startDate ? format(startDate, "yyyy-MM-dd") : format(defaultStartDate, "yyyy-MM-dd"),
      end: endDate ? format(endDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")
    };

    onSearch(query, dateRange);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Search className="h-5 w-5" />
          <span>Company Research</span>
        </CardTitle>
        <CardDescription>
          Search across litigation records, PPP loans, and company profiles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            <Input
              id="company"
              placeholder="Enter company name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date (Default: 5 years ago)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : format(defaultStartDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date (Default: Today)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : format(new Date(), "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Data Sources</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="litigation"
                  checked={searchSources.litigation}
                  onCheckedChange={(checked) =>
                    setSearchSources(prev => ({ ...prev, litigation: checked as boolean }))
                  }
                />
                <Label htmlFor="litigation" className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Trellis Litigation</span>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ppp"
                  checked={searchSources.ppp}
                  onCheckedChange={(checked) =>
                    setSearchSources(prev => ({ ...prev, ppp: checked as boolean }))
                  }
                />
                <Label htmlFor="ppp" className="flex items-center space-x-2">
                  <Building className="h-4 w-4" />
                  <span>PPP Loans</span>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="profile"
                  checked={searchSources.profile}
                  onCheckedChange={(checked) =>
                    setSearchSources(prev => ({ ...prev, profile: checked as boolean }))
                  }
                />
                <Label htmlFor="profile" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>People Data Labs</span>
                </Label>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Searching..." : "Search All Sources"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
