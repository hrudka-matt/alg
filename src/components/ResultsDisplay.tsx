import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Building, Users, Calendar, DollarSign, AlertTriangle, CheckCircle, Scale, Gavel } from "lucide-react";
import { SearchResult } from "@/pages/Index";

interface ResultsDisplayProps {
  results: SearchResult[];
  isLoading: boolean;
}

export const ResultsDisplay = ({ results, isLoading }: ResultsDisplayProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse bg-gradient-to-br from-white to-gray-50">
            <CardHeader>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200">
        <CardContent className="text-center py-12">
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-4 rounded-full w-fit mx-auto mb-4">
            <FileText className="h-12 w-12 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Yet</h3>
          <p className="text-gray-500">Search for a company to see litigation, PPP, and profile data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Search Results</h2>
        <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200">
          {results.length} results found
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {results.map((result) => (
          <Card key={result.id} className="hover:shadow-xl transition-all duration-300 flex flex-col border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 hover:scale-[1.02]">
            {result.type === 'litigation' && (
              <>
                <CardHeader className="pb-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-t-lg">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <div className="bg-gradient-to-br from-red-500 to-orange-500 p-2 rounded-lg">
                      <FileText className="h-5 w-5 text-white flex-shrink-0" />
                    </div>
                    <span className="line-clamp-2 text-red-800">Class Action Litigation</span>
                  </CardTitle>
                  <Badge variant={result.data.status === 'Pending' ? 'destructive' : 'secondary'} className="w-fit bg-gradient-to-r from-red-500 to-orange-500 text-white">
                    {result.data.status}
                  </Badge>
                  <CardDescription className="line-clamp-2 text-red-700">{result.data.caseTitle}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-grow">
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-gray-700 text-sm">Court:</p>
                      <p className="text-gray-600 text-sm line-clamp-2">{result.data.court}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700 text-sm">Filing Date:</p>
                      <p className="text-gray-600 text-sm flex items-center">
                        <Calendar className="h-3 w-3 mr-1 flex-shrink-0 text-red-500" />
                        {result.data.filingDate}
                      </p>
                    </div>
                  </div>
                  <Separator className="bg-gradient-to-r from-red-200 to-orange-200" />
                  <div>
                    <p className="font-semibold text-gray-700 mb-2 text-sm">Allegations:</p>
                    <p className="text-gray-600 text-sm line-clamp-3">{result.data.allegations}</p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-gray-700 text-sm">Lead Plaintiff:</p>
                      <p className="text-gray-600 text-sm line-clamp-1">{result.data.leadPlaintiff}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700 text-sm">Estimated Damages:</p>
                      <p className="text-gray-600 text-sm flex items-center">
                        <DollarSign className="h-3 w-3 mr-1 flex-shrink-0 text-red-500" />
                        {result.data.estimatedDamages}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </>
            )}

            {result.type === 'ppp' && (
              <>
                <CardHeader className="pb-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-t-lg">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-2 rounded-lg">
                      <Building className="h-5 w-5 text-white flex-shrink-0" />
                    </div>
                    <span className="line-clamp-2 text-green-800">PPP Loan Record</span>
                  </CardTitle>
                  <Badge variant={result.data.forgiven ? 'default' : 'secondary'} className={`w-fit ${result.data.forgiven ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : ''}`}>
                    {result.data.forgiven ? 'Forgiven' : 'Not Forgiven'}
                  </Badge>
                  <CardDescription className="line-clamp-2 text-green-700">{result.data.businessName}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-grow">
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-gray-700 text-sm">Loan Amount:</p>
                      <p className="text-gray-600 text-sm flex items-center">
                        <DollarSign className="h-3 w-3 mr-1 flex-shrink-0 text-green-500" />
                        {result.data.loanAmount}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700 text-sm">Approval Date:</p>
                      <p className="text-gray-600 text-sm flex items-center">
                        <Calendar className="h-3 w-3 mr-1 flex-shrink-0 text-green-500" />
                        {result.data.approvalDate}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700 text-sm">Jobs Reported:</p>
                      <p className="text-gray-600 text-sm">{result.data.jobsReported}</p>
                    </div>
                  </div>
                  <Separator className="bg-gradient-to-r from-green-200 to-emerald-200" />
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-gray-700 text-sm">Lender:</p>
                      <p className="text-gray-600 text-sm line-clamp-1">{result.data.lender}</p>
                    </div>
                    {result.data.forgiven && (
                      <div>
                        <p className="font-semibold text-gray-700 text-sm">Forgiveness Date:</p>
                        <p className="text-gray-600 text-sm flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1 text-green-600 flex-shrink-0" />
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
                <CardHeader className="pb-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-t-lg">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-2 rounded-lg">
                      <Users className="h-5 w-5 text-white flex-shrink-0" />
                    </div>
                    <span className="line-clamp-2 text-blue-800">Company Profile</span>
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-blue-700">{result.data.companyName}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-grow">
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-gray-700 text-sm">Industry:</p>
                      <p className="text-gray-600 text-sm line-clamp-1">{result.data.industry}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700 text-sm">Founded:</p>
                      <p className="text-gray-600 text-sm">{result.data.founded}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-gray-700 text-sm">Employees:</p>
                      <p className="text-gray-600 text-sm">{result.data.employees}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700 text-sm">Revenue:</p>
                      <p className="text-gray-600 text-sm">{result.data.revenue}</p>
                    </div>
                  </div>
                  <Separator className="bg-gradient-to-r from-blue-200 to-indigo-200" />
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-gray-700 text-sm">Headquarters:</p>
                      <p className="text-gray-600 text-sm line-clamp-1">{result.data.headquarters}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700 text-sm">Website:</p>
                      <p className="text-gray-600 text-sm line-clamp-1">{result.data.website}</p>
                    </div>
                  </div>
                </CardContent>
              </>
            )}

            {result.type === 'paga' && (
              <>
                <CardHeader className="pb-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-t-lg">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <div className="bg-gradient-to-br from-purple-500 to-violet-500 p-2 rounded-lg">
                      <Scale className="h-5 w-5 text-white flex-shrink-0" />
                    </div>
                    <span className="line-clamp-2 text-purple-800">PAGA Filing</span>
                  </CardTitle>
                  <Badge variant={result.data.status === 'Active' ? 'destructive' : 'secondary'} className="w-fit bg-gradient-to-r from-purple-500 to-violet-500 text-white">
                    {result.data.status}
                  </Badge>
                  <CardDescription className="line-clamp-2 text-purple-700">{result.data.businessName}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-grow">
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-gray-700 text-sm">Case Number:</p>
                      <p className="text-gray-600 text-sm">{result.data.caseNumber}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700 text-sm">Court:</p>
                      <p className="text-gray-600 text-sm line-clamp-2">{result.data.court}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700 text-sm">Filing Date:</p>
                      <p className="text-gray-600 text-sm flex items-center">
                        <Calendar className="h-3 w-3 mr-1 flex-shrink-0 text-purple-500" />
                        {result.data.filingDate}
                      </p>
                    </div>
                  </div>
                  <Separator className="bg-gradient-to-r from-purple-200 to-violet-200" />
                  <div>
                    <p className="font-semibold text-gray-700 mb-2 text-sm">Allegations:</p>
                    <p className="text-gray-600 text-sm line-clamp-3">{result.data.allegations}</p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-gray-700 text-sm">Plaintiff Attorney:</p>
                      <p className="text-gray-600 text-sm line-clamp-1">{result.data.plaintiffAttorney}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700 text-sm">Estimated Penalties:</p>
                      <p className="text-gray-600 text-sm flex items-center">
                        <DollarSign className="h-3 w-3 mr-1 flex-shrink-0 text-purple-500" />
                        {result.data.estimatedPenalties}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700 text-sm">Affected Employees:</p>
                      <p className="text-gray-600 text-sm">{result.data.affectedEmployees}</p>
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
