
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, FileText, Calendar, Gavel } from "lucide-react";

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
  };
}

export const CaseDetailsModal = ({ isOpen, onClose, caseData }: CaseDetailsModalProps) => {
  // Mock docket entries for demonstration
  const docketEntries = [
    {
      id: 1,
      date: "2023-03-15",
      description: "Class Action Complaint Filed",
      document: "Complaint",
      party: "Plaintiff",
      downloadable: true
    },
    {
      id: 2,
      date: "2023-03-22",
      description: "Motion to Dismiss Filed",
      document: "Motion to Dismiss",
      party: "Defendant",
      downloadable: true
    },
    {
      id: 3,
      date: "2023-04-05",
      description: "Plaintiff's Opposition to Motion to Dismiss",
      document: "Opposition Brief",
      party: "Plaintiff",
      downloadable: true
    },
    {
      id: 4,
      date: "2023-04-20",
      description: "Court Order - Motion to Dismiss Denied",
      document: "Court Order",
      party: "Court",
      downloadable: true
    },
    {
      id: 5,
      date: "2023-05-10",
      description: "Answer and Counterclaims Filed",
      document: "Answer",
      party: "Defendant",
      downloadable: true
    },
    {
      id: 6,
      date: "2023-06-15",
      description: "Discovery Conference Scheduled",
      document: "Scheduling Order",
      party: "Court",
      downloadable: false
    },
    {
      id: 7,
      date: "2023-07-20",
      description: "Motion for Class Certification Filed",
      document: "Class Cert Motion",
      party: "Plaintiff",
      downloadable: true
    },
    {
      id: 8,
      date: "2023-08-30",
      description: "Status Conference",
      document: "Minutes",
      party: "Court",
      downloadable: false
    }
  ];

  const handleDownload = (documentName: string) => {
    // Mock download functionality
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

  const getPartyBadgeVariant = (party: string) => {
    switch (party) {
      case 'Plaintiff': return 'default';
      case 'Defendant': return 'destructive';
      case 'Court': return 'secondary';
      default: return 'outline';
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
                <p className="text-gray-600">{caseData.category || 'Securities'}</p>
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
                <Badge variant={caseData.dateSettled ? 'secondary' : 'destructive'}>
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
            </h3>
            
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
                        {entry.description}
                      </TableCell>
                      <TableCell className="text-sm">
                        <span className="flex items-center">
                          <FileText className="h-3 w-3 mr-1 text-gray-500" />
                          {entry.document}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPartyBadgeVariant(entry.party)} className="text-xs">
                          {entry.party}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {entry.downloadable && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(entry.document)}
                            className="h-7 w-7 p-0"
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
