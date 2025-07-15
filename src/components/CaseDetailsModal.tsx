import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, FileText, Calendar, Gavel } from "lucide-react";
import { useState, useEffect } from "react";

interface CaseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: {
    caseNumber: string;
    jurisdiction: string;
    lawFirm: string;
    dateFiled: string;
    dateSettled?: string;
    coas: string;
    category?: string;
    caseToken?: string;
  };
}

interface DocketEntry {
  id: number;
  date: string;
  description: string;
  document: string;
  party: string;
  downloadable: boolean;
  download_token?: string;
  document_name?: string;
  entry_type?: string;
  is_preview?: boolean;
}

// Backend docket entry interface
interface BackendDocketEntry {
  date?: string;
  entry_number?: string;
  description?: string;
  document_type?: string;
  party?: string;
  attorney?: string;
  downloadable?: boolean;
  download_token?: string;
  document_name?: string;
  entry_type?: string;
  is_preview?: boolean;
}

// Backend docket response interface
interface DocketResponse {
  case_token: string;
  dockets: BackendDocketEntry[];
  total_entries: number;
  error?: string;
}

const API_BASE_URL = 'https://co1wnck2h6.execute-api.us-east-1.amazonaws.com';

export const CaseDetailsModal = ({ isOpen, onClose, caseData }: CaseDetailsModalProps) => {
  const [docketEntries, setDocketEntries] = useState<DocketEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setDocketEntries([]);
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  // Fetch real docket data when modal opens
  useEffect(() => {
    if (isOpen && caseData.caseToken) {
      console.log('=== MODAL DEBUG ===');
      console.log('Case Number:', caseData.caseNumber);
      console.log('Case Token:', caseData.caseToken);
      console.log('Full Case Data:', caseData);
      console.log('===================');
      fetchDocketData(caseData.caseToken);
    } else if (isOpen && !caseData.caseToken) {
      console.warn('=== NO CASE TOKEN ===');
      console.log('Case Data:', caseData);
      console.warn('Using mock docket data');
      setDocketEntries(getMockDocketEntries());
    }
  }, [isOpen, caseData.caseToken, caseData.caseNumber]);

  const fetchDocketData = async (caseToken: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching docket data for case token: ${caseToken}`);
      const response = await fetch(`${API_BASE_URL}/case/${caseToken}/dockets`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch docket data: ${response.status}`);
      }
      
      const data: DocketResponse = await response.json();
      console.log('Docket data received:', data);
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Convert backend docket format to frontend format
      const convertedDockets: DocketEntry[] = (data.dockets || []).map((entry: BackendDocketEntry, index: number) => ({
        id: index + 1,
        date: entry.date || 'N/A',
        description: entry.description || 'No description',
        document: entry.document_type || 'Document', 
        party: entry.party || '',
        downloadable: entry.downloadable || false,
        download_token: entry.download_token || '',
        document_name: entry.document_name || '',
        entry_type: entry.entry_type || 'unknown',
        is_preview: entry.is_preview || false
      }));
      
      setDocketEntries(convertedDockets);
      
      // Log download statistics
      const downloadableCount = convertedDockets.filter(d => d.downloadable).length;
      console.log(`Found ${convertedDockets.length} docket entries, ${downloadableCount} downloadable`);
      
      // Only use mock data if no real dockets AND no case token
      if (convertedDockets.length === 0 && !caseToken) {
        console.warn('No dockets and no case token, using mock data');
        setDocketEntries(getMockDocketEntries());
      } else if (convertedDockets.length === 0) {
        console.info('No docket entries found for this case');
      }
      
    } catch (err) {
      console.error('Error fetching docket data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load docket data');
      
      // Only fallback to mock data if there was a real error, not just empty results
      console.warn('API error, using mock data as fallback');
      setDocketEntries(getMockDocketEntries());
    } finally {
      setLoading(false);
    }
  };

  // Fallback mock data if API fails
  const getMockDocketEntries = (): DocketEntry[] => [
    {
      id: 1,
      date: "2023-03-15",
      description: "Class Action Complaint Filed",
      document: "Complaint",
      party: "Plaintiff",
      downloadable: true,
      entry_type: "document"
    },
    {
      id: 2,
      date: "2023-03-22",
      description: "Motion to Dismiss Filed",
      document: "Motion to Dismiss",
      party: "Defendant",
      downloadable: true,
      entry_type: "document"
    },
    {
      id: 3,
      date: "2023-04-05",
      description: "Plaintiff's Opposition to Motion to Dismiss",
      document: "Opposition Brief",
      party: "Plaintiff",
      downloadable: true,
      entry_type: "document"
    },
    {
      id: 4,
      date: "2023-04-20",
      description: "Court Order - Motion to Dismiss Denied",
      document: "Court Order",
      party: "Court",
      downloadable: true,
      entry_type: "event"
    },
    {
      id: 5,
      date: "2023-05-10",
      description: "Answer and Counterclaims Filed",
      document: "Answer",
      party: "Defendant",
      downloadable: true,
      entry_type: "document"
    },
    {
      id: 6,
      date: "2023-06-15",
      description: "Discovery Conference Scheduled",
      document: "Scheduling Order",
      party: "Court",
      downloadable: false,
      entry_type: "event"
    },
    {
      id: 7,
      date: "2023-07-20",
      description: "Motion for Class Certification Filed",
      document: "Class Cert Motion",
      party: "Plaintiff",
      downloadable: true,
      entry_type: "document"
    },
    {
      id: 8,
      date: "2023-08-30",
      description: "Status Conference",
      document: "Minutes",
      party: "Court",
      downloadable: false,
      entry_type: "event"
    }
  ];

  // Real download function for actual documents
  const handleDownload = async (entry: DocketEntry) => {
    if (!entry.downloadable || !entry.download_token) {
      // Fallback to mock download for non-downloadable items
      handleMockDownload(entry.document);
      return;
    }

    try {
      // Show loading state
      const button = document.querySelector(`[data-download="${entry.id}"]`) as HTMLButtonElement;
      if (button) {
        button.disabled = true;
        const originalContent = button.innerHTML;
        button.innerHTML = '<div class="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>';
        
        // Restore content after a short delay if something goes wrong
        setTimeout(() => {
          if (button.disabled) {
            button.innerHTML = originalContent;
            button.disabled = false;
          }
        }, 10000);
      }

      // Call the backend download endpoint
      const downloadUrl = `${API_BASE_URL}/case/${caseData.caseToken}/document/${entry.download_token}`;
      console.log(`Attempting download from: ${downloadUrl}`);
      
      const response = await fetch(downloadUrl);

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status} ${response.statusText}`);
      }

      // Handle the response properly based on content type
      const contentType = response.headers.get('content-type') || '';
      console.log('Response Content-Type:', contentType);
      console.log('Response Status:', response.status);
      
      if (contentType.includes('application/json')) {
        // This means there was an error
        const errorData = await response.json();
        console.log('Error response:', errorData);
        throw new Error(errorData.error || 'Download failed - backend returned JSON instead of file');
      }
      
      // Try to get the blob
      const blob = await response.blob();
      console.log('Blob size:', blob.size, 'type:', blob.type);
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Use document name if available, otherwise generate one
      const filename = entry.document_name || 
                      `${entry.document.replace(/\s+/g, '_')}_${caseData.caseNumber}_${entry.date}.pdf`;
      a.download = filename;
      
      // Trigger download
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log(`Successfully downloaded: ${filename}`);

      // Reset button state
      if (button) {
        button.innerHTML = '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path></svg>';
        button.disabled = false;
      }

    } catch (error) {
      console.error('Download error:', error);
      alert(`Failed to download document: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Reset button state
      const button = document.querySelector(`[data-download="${entry.id}"]`) as HTMLButtonElement;
      if (button) {
        button.innerHTML = '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path></svg>';
        button.disabled = false;
      }
      
      // Fallback to mock download
      handleMockDownload(entry.document);
    }
  };

  // Mock download functionality for fallback
  const handleMockDownload = (documentName: string) => {
    const blob = new Blob([`Mock document: ${documentName} for case ${caseData.caseNumber}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentName.replace(/\s+/g, '_')}_${caseData.caseNumber}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getPartyBadgeClass = (party: string) => {
    switch (party) {
      case 'Plaintiff': 
        return 'bg-blue-100 text-blue-800';
      case 'Defendant': 
        return 'bg-red-100 text-red-800';
      case 'Court': 
        return 'bg-gray-100 text-gray-800';
      case 'Filed':
        return 'bg-green-100 text-green-800';
      case 'Party Motion':
        return 'bg-purple-100 text-purple-800';
      default: 
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl">
            <div className="bg-gradient-to-br from-red-500 to-orange-500 p-2 rounded-lg">
              <Gavel className="h-5 w-5 text-white" />
            </div>
            <span>Case Details: {caseData.caseNumber}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Case Summary */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-3">Case Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-700">Jurisdiction:</p>
                <p className="text-gray-600">{caseData.jurisdiction}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Lead Counsel:</p>
                <p className="text-gray-600">{caseData.lawFirm}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Category:</p>
                <p className="text-gray-600">{caseData.category || 'Employment'}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Date Filed:</p>
                <p className="text-gray-600 flex items-center">
                  <Calendar className="h-3 w-3 mr-1 text-red-500" />
                  {caseData.dateFiled}
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Status:</p>
                <Badge className={caseData.dateSettled ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'}>
                  {caseData.dateSettled ? 'Settled' : 'Pending'}
                </Badge>
              </div>
            </div>
            <div className="mt-3">
              <p className="font-semibold text-gray-700 mb-1">COAs:</p>
              <p className="text-gray-600 text-sm">{caseData.coas}</p>
            </div>
          </div>

          <Separator />

          {/* Docket History */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Docket History ({docketEntries.length} entries)
              {docketEntries.filter(d => d.downloadable).length > 0 && (
                <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                  {docketEntries.filter(d => d.downloadable).length} downloadable
                </Badge>
              )}
              {loading && <span className="ml-2 text-sm text-blue-600">Loading...</span>}
              {error && <span className="ml-2 text-sm text-orange-600">Using mock data</span>}
              {!caseData.caseToken && <span className="ml-2 text-sm text-gray-500">Mock data</span>}
            </h3>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading docket entries...</span>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-32">Document</TableHead>
                      <TableHead className="w-24">Party</TableHead>
                      <TableHead className="w-20">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {docketEntries.map((entry) => (
                      <TableRow key={entry.id} className="hover:bg-gray-50">
                        <TableCell className="text-sm font-mono">
                          {entry.date}
                        </TableCell>
                        <TableCell className="text-sm">
                          <div>
                            <div>{entry.description}</div>
                            {entry.is_preview && (
                              <Badge className="text-xs bg-yellow-100 text-yellow-800 mt-1">
                                Preview Only
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="flex items-center space-x-1">
                            <FileText className="h-3 w-3 text-gray-500" />
                            <span>{entry.document}</span>
                            {entry.downloadable && (
                              <Badge className="text-xs bg-green-100 text-green-800 ml-1">
                                Available
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-xs ${getPartyBadgeClass(entry.party)}`}>
                            {entry.party}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {entry.downloadable ? (
                            <Button
                              onClick={() => handleDownload(entry)}
                              className="h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                              data-download={entry.id}
                              title={`Download ${entry.document_name || entry.document}`}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          ) : (
                            <div className="h-8 w-8 flex items-center justify-center">
                              <span className="text-xs text-gray-400">—</span>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};