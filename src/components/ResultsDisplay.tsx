
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Building, Users, Calendar, DollarSign, AlertTriangle, CheckCircle } from "lucide-react";
import { SearchResult } from "@/pages/Index";

interface ResultsDisplayProps {
  results: SearchResult[];
  isLoading: boolean;
}

export const ResultsDisplay = ({ results, isLoading }: ResultsDisplayProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Yet</h3>
          <p className="text-gray-500">Search for a company to see litigation, PPP, and profile data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Search Results</h2>
        <Badge variant="secondary">{results.length} results found</Badge>
      </div>

      <div className="space-y-4">
        {results.map((result) => (
          <Card key={result.id} className="hover:shadow-md transition-shadow">
            {result.type === 'litigation' && (
              <>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-red-600" />
                    <span>Class Action Litigation</span>
                    <Badge variant={result.data.status === 'Pending' ? 'destructive' : 'secondary'}>
                      {result.data.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{result.data.caseTitle}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold text-gray-700">Court:</p>
                      <p className="text-gray-600">{result.data.court}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Filing Date:</p>
                      <p className="text-gray-600 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {result.data.filingDate}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <p className="font-semibold text-gray-700 mb-2">Allegations:</p>
                    <p className="text-gray-600">{result.data.allegations}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold text-gray-700">Lead Plaintiff:</p>
                      <p className="text-gray-600">{result.data.leadPlaintiff}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Estimated Damages:</p>
                      <p className="text-gray-600 flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {result.data.estimatedDamages}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </>
            )}

            {result.type === 'ppp' && (
              <>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-green-600" />
                    <span>PPP Loan Record</span>
                    <Badge variant={result.data.forgiven ? 'default' : 'secondary'}>
                      {result.data.forgiven ? 'Forgiven' : 'Not Forgiven'}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{result.data.businessName}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="font-semibold text-gray-700">Loan Amount:</p>
                      <p className="text-gray-600 flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {result.data.loanAmount}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Approval Date:</p>
                      <p className="text-gray-600 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {result.data.approvalDate}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Jobs Reported:</p>
                      <p className="text-gray-600">{result.data.jobsReported}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold text-gray-700">Lender:</p>
                      <p className="text-gray-600">{result.data.lender}</p>
                    </div>
                    {result.data.forgiven && (
                      <div>
                        <p className="font-semibold text-gray-700">Forgiveness Date:</p>
                        <p className="text-gray-600 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                          {result.data.forgivenessDate}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </>
            )}

            {result.type === 'profile' && (
              <>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span>Company Profile</span>
                  </CardTitle>
                  <CardDescription>{result.data.companyName}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold text-gray-700">Industry:</p>
                      <p className="text-gray-600">{result.data.industry}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Founded:</p>
                      <p className="text-gray-600">{result.data.founded}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold text-gray-700">Employees:</p>
                      <p className="text-gray-600">{result.data.employees}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Revenue:</p>
                      <p className="text-gray-600">{result.data.revenue}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold text-gray-700">Headquarters:</p>
                      <p className="text-gray-600">{result.data.headquarters}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Website:</p>
                      <p className="text-gray-600">{result.data.website}</p>
                    </div>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
