import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Building, Users, Calendar, DollarSign, AlertTriangle, CheckCircle, Scale, Gavel, ExternalLink } from "lucide-react";
import { SearchResult } from "@/pages/Index";
import { CaseDetailsModal } from "./CaseDetailsModal";
import { useState } from "react";

interface ResultsDisplayProps {
  results: SearchResult[];
  isLoading: boolean;
}

export const ResultsDisplay = ({ results, isLoading }: ResultsDisplayProps) => {
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);

  const handleCaseClick = (caseData: any) => {
    setSelectedCase(caseData);
    setIsCaseModalOpen(true);
  };

  const closeCaseModal = () => {
    setIsCaseModalOpen(false);
    setSelectedCase(null);
  };

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

  // Separate results by type for custom layout
  const litigationResults = results.filter(r => r.type === 'litigation');
  const profileResults = results.filter(r => r.type === 'profile');
  const pagaResults = results.filter(r => r.type === 'paga');
  const pppResults = results.filter(r => r.type === 'ppp');

  // Combine profile and PPP data
  const combinedProfileData = profileResults.map(profile => ({
    ...profile,
    pppData: pppResults.find(p => p.type === 'ppp')?.data
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Search Results</h2>
        <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200">
          {results.length} results found
        </Badge>
      </div>

      {/* Company Profile Cards - Full Width */}
      {combinedProfileData.map((result) => (
        <Card key={result.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 hover:scale-[1.01]">
          <CardHeader className="pb-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-t-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-2 rounded-lg">
                <Building className="h-5 w-5 text-white flex-shrink-0" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-blue-900">{result.data.companyName}</h2>
                <p className="text-xs text-blue-700">Company Profile</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 py-3">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-xs">
              <div>
                <p className="font-semibold text-gray-700">Industry:</p>
                <p className="text-gray-600 line-clamp-1">{result.data.industry}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Founded:</p>
                <p className="text-gray-600">{result.data.founded}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Employees:</p>
                <p className="text-gray-600">{result.data.employees}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Revenue:</p>
                <p className="text-gray-600">{result.data.revenue}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Locations:</p>
                <p className="text-gray-600">{result.data.locations || '25'}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Website:</p>
                <p className="text-gray-600 line-clamp-1">{result.data.website}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 text-xs">
              <div>
                <p className="font-semibold text-gray-700">Headquarters:</p>
                <p className="text-gray-600">{result.data.headquarters}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Secretary of State:</p>
                <a
                  href={`https://www.sos.state.ar.us/corps/search_all.php?corp-search=${encodeURIComponent(result.data.companyName)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline"
                >
                  View Business Profile
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>

            {result.pppData && (
              <>
                <Separator className="bg-gradient-to-r from-blue-200 to-green-200" />
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-2 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-1 rounded">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <h4 className="font-semibold text-green-800 text-sm">PPP Loan Information</h4>
                    <Badge variant={result.pppData.forgiven ? 'default' : 'secondary'} className={`text-xs ${result.pppData.forgiven ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : ''}`}>
                      {result.pppData.forgiven ? 'Forgiven' : 'Not Forgiven'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div>
                      <p className="font-semibold text-gray-700">Loan Amount:</p>
                      <p className="text-gray-600 flex items-center">
                        <DollarSign className="h-3 w-3 mr-1 text-green-500" />
                        {result.pppData.loanAmount}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Jobs Reported:</p>
                      <p className="text-gray-600">{result.pppData.jobsReported}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Approval Date:</p>
                      <p className="text-gray-600 flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-green-500" />
                        {result.pppData.approvalDate}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Lender:</p>
                      <p className="text-gray-600 line-clamp-1">{result.pppData.lender}</p>
                    </div>
                    {result.pppData.forgiven && (
                      <div className="col-span-2">
                        <p className="font-semibold text-gray-700">Forgiveness Date:</p>
                        <p className="text-gray-600 flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                          {result.pppData.forgivenessDate}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}

      {/* PAGA Filings Results - Full Width Table */}
      {pagaResults.length > 0 && (
        <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
          <CardHeader className="pb-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <div className="bg-gradient-to-br from-purple-500 to-violet-500 p-2 rounded-lg">
                <Scale className="h-5 w-5 text-white flex-shrink-0" />
              </div>
              <span className="line-clamp-2 text-purple-800">PAGA Filings</span>
            </CardTitle>
            <Badge variant="secondary" className="w-fit bg-gradient-to-r from-purple-500 to-violet-500 text-white">
              {pagaResults.length} filing{pagaResults.length !== 1 ? 's' : ''} found
            </Badge>
            <CardDescription className="line-clamp-2 text-purple-700">Private Attorneys General Act filings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs p-2">Case #</TableHead>
                    <TableHead className="text-xs p-2">Date Filed</TableHead>
                    <TableHead className="text-xs p-2">Law Firm</TableHead>
                    <TableHead className="text-xs p-2">Plaintiff</TableHead>
                    <TableHead className="text-xs p-2">COAs</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagaResults.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-xs p-2">
                        <span className="font-mono text-purple-600">
                          {result.data.caseNumber}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs p-2">{result.data.filingDate}</TableCell>
                      <TableCell className="text-xs p-2">{result.data.plaintiffAttorney}</TableCell>
                      <TableCell className="text-xs p-2">{result.data.businessName}</TableCell>
                      <TableCell className="text-xs p-2 max-w-xs line-clamp-3">{result.data.coas}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Litigation Results - Full Width */}
      {litigationResults.map((result) => (
        <Card key={result.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
          <CardHeader className="pb-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <div className="bg-gradient-to-br from-red-500 to-orange-500 p-2 rounded-lg">
                <Gavel className="h-5 w-5 text-white flex-shrink-0" />
              </div>
              <span className="line-clamp-2 text-red-800">Employment Litigation</span>
            </CardTitle>
            <Badge variant={result.data.status === 'Pending' ? 'destructive' : 'secondary'} className="w-fit bg-gradient-to-r from-red-500 to-orange-500 text-white">
              {result.data.status}
            </Badge>
            <CardDescription className="line-clamp-2 text-red-700">{result.data.caseTitle}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-gray-700 mb-2 text-sm">Case Details:</p>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs p-2">Case #</TableHead>
                        <TableHead className="text-xs p-2">Jurisdiction</TableHead>
                        <TableHead className="text-xs p-2">Law Firm</TableHead>
                        <TableHead className="text-xs p-2">Category</TableHead>
                        <TableHead className="text-xs p-2">Filed</TableHead>
                        <TableHead className="text-xs p-2">Settled</TableHead>
                        <TableHead className="text-xs p-2">COAs</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.data.cases ? result.data.cases.map((caseItem: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="text-xs p-2">
                            <button
                              onClick={() => handleCaseClick(caseItem)}
                              className="text-blue-600 hover:text-blue-800 hover:underline font-mono"
                            >
                              {caseItem.caseNumber}
                            </button>
                          </TableCell>
                          <TableCell className="text-xs p-2">{caseItem.jurisdiction}</TableCell>
                          <TableCell className="text-xs p-2">{caseItem.lawFirm}</TableCell>
                          <TableCell className="text-xs p-2">{caseItem.category}</TableCell>
                          <TableCell className="text-xs p-2">{caseItem.dateFiled}</TableCell>
                          <TableCell className="text-xs p-2">{caseItem.dateSettled || 'Pending'}</TableCell>
                          <TableCell className="text-xs p-2 max-w-xs">{caseItem.coas}</TableCell>
                        </TableRow>
                      )) : (
                        <>
                          <TableRow>
                            <TableCell className="text-xs p-2">
                              <button
                                onClick={() => handleCaseClick({
                                  caseNumber: "1:23-cv-02156",
                                  jurisdiction: "S.D.N.Y.",
                                  lawFirm: "Robbins Geller",
                                  category: "Securities",
                                  dateFiled: "03/15/23",
                                  dateSettled: null,
                                  coas: "Securities fraud, misleading statements"
                                })}
                                className="text-blue-600 hover:text-blue-800 hover:underline font-mono"
                              >
                                1:23-cv-02156
                              </button>
                            </TableCell>
                            <TableCell className="text-xs p-2">S.D.N.Y.</TableCell>
                            <TableCell className="text-xs p-2">Robbins Geller</TableCell>
                            <TableCell className="text-xs p-2">Securities</TableCell>
                            <TableCell className="text-xs p-2">03/15/23</TableCell>
                            <TableCell className="text-xs p-2">Pending</TableCell>
                            <TableCell className="text-xs p-2 max-w-xs">Securities fraud, misleading statements</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-xs p-2">
                              <button
                                onClick={() => handleCaseClick({
                                  caseNumber: "2:23-cv-03421",
                                  jurisdiction: "C.D. Cal.",
                                  lawFirm: "Bernstein Litowitz",
                                  category: "Consumer Protection",
                                  dateFiled: "05/22/23",
                                  dateSettled: null,
                                  coas: "Failure to disclose material information"
                                })}
                                className="text-blue-600 hover:text-blue-800 hover:underline font-mono"
                              >
                                2:23-cv-03421
                              </button>
                            </TableCell>
                            <TableCell className="text-xs p-2">C.D. Cal.</TableCell>
                            <TableCell className="text-xs p-2">Bernstein Litowitz</TableCell>
                            <TableCell className="text-xs p-2">Consumer Protection</TableCell>
                            <TableCell className="text-xs p-2">05/22/23</TableCell>
                            <TableCell className="text-xs p-2">Pending</TableCell>
                            <TableCell className="text-xs p-2 max-w-xs">Failure to disclose material information</TableCell>
                          </TableRow>
                        </>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Other Results in Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Remove PAGA Results from grid since they now have their own table section */}
      </div>

      {/* Case Details Modal */}
      {selectedCase && (
        <CaseDetailsModal
          isOpen={isCaseModalOpen}
          onClose={closeCaseModal}
          caseData={selectedCase}
        />
      )}
    </div>
  );
};
