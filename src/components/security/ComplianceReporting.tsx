import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  FileText, 
  Download, 
  Calendar, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Shield,
  Award,
  Eye,
  Send
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ComplianceReport {
  id: string;
  type: 'SOC1' | 'SOC2' | 'SOC3' | 'CSOC' | 'Bridge';
  title: string;
  description: string;
  status: 'draft' | 'in_review' | 'approved' | 'published';
  generatedDate: string;
  reportPeriod: {
    start: string;
    end: string;
  };
  auditFirm?: string;
  findings: {
    total: number;
    deficiencies: number;
    exceptions: number;
    materialWeaknesses: number;
  };
  fileSize?: string;
  downloadUrl?: string;
}

interface AuditEvidence {
  id: string;
  controlId: string;
  controlName: string;
  evidenceType: string;
  description: string;
  collectedDate: string;
  reviewStatus: 'pending' | 'reviewed' | 'approved';
  attachments: string[];
}

const ComplianceReporting: React.FC = () => {
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const [auditEvidence, setAuditEvidence] = useState<AuditEvidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    loadComplianceData();
  }, []);

  const loadComplianceData = async () => {
    try {
      setLoading(true);

      // Mock data for demonstration
      const mockReports: ComplianceReport[] = [
        {
          id: '1',
          type: 'SOC2',
          title: 'SOC 2 Type II Report - 2024',
          description: 'Annual SOC 2 Type II assessment covering Security, Availability, and Confidentiality',
          status: 'published',
          generatedDate: '2024-12-01',
          reportPeriod: {
            start: '2024-01-01',
            end: '2024-11-30'
          },
          auditFirm: 'Elite Audit Partners, LLP',
          findings: {
            total: 47,
            deficiencies: 0,
            exceptions: 1,
            materialWeaknesses: 0
          },
          fileSize: '2.4 MB',
          downloadUrl: '#'
        },
        {
          id: '2',
          type: 'SOC1',
          title: 'SOC 1 Type II Report - 2024',
          description: 'Financial reporting controls assessment for user entities',
          status: 'in_review',
          generatedDate: '2024-11-15',
          reportPeriod: {
            start: '2024-01-01',
            end: '2024-10-31'
          },
          auditFirm: 'Elite Audit Partners, LLP',
          findings: {
            total: 23,
            deficiencies: 2,
            exceptions: 0,
            materialWeaknesses: 0
          }
        },
        {
          id: '3',
          type: 'SOC3',
          title: 'SOC 3 General Use Report - 2024',
          description: 'Public-facing trust services report suitable for broad distribution',
          status: 'draft',
          generatedDate: '2024-11-20',
          reportPeriod: {
            start: '2024-01-01',
            end: '2024-10-31'
          },
          findings: {
            total: 15,
            deficiencies: 0,
            exceptions: 0,
            materialWeaknesses: 0
          }
        }
      ];

      const mockEvidence: AuditEvidence[] = [
        {
          id: '1',
          controlId: 'CC6.1',
          controlName: 'Logical and Physical Access Controls',
          evidenceType: 'Documentation',
          description: 'Access control policies and procedures documentation',
          collectedDate: '2024-12-01',
          reviewStatus: 'approved',
          attachments: ['access_control_policy.pdf', 'user_access_matrix.xlsx']
        },
        {
          id: '2',
          controlId: 'CC7.1',
          controlName: 'System Operations',
          evidenceType: 'Testing Results',
          description: 'Backup and recovery testing documentation',
          collectedDate: '2024-11-28',
          reviewStatus: 'reviewed',
          attachments: ['backup_test_results.pdf', 'recovery_procedures.docx']
        },
        {
          id: '3',
          controlId: 'A1.1',
          controlName: 'Availability Monitoring',
          evidenceType: 'System Reports',
          description: 'System uptime and performance monitoring reports',
          collectedDate: '2024-12-02',
          reviewStatus: 'pending',
          attachments: ['uptime_report_nov2024.pdf', 'performance_metrics.xlsx']
        }
      ];

      setReports(mockReports);
      setAuditEvidence(mockEvidence);

    } catch (error) {
      console.error('Error loading compliance data:', error);
      toast.error('Failed to load compliance data');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (reportType: string) => {
    try {
      setGeneratingReport(true);
      
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast.success(`${reportType} report generated successfully`);
      await loadComplianceData();
      
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setGeneratingReport(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'in_review':
      case 'reviewed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'draft':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_review':
      case 'reviewed':
        return <Eye className="h-4 w-4" />;
      case 'draft':
      case 'pending':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'SOC1':
      case 'SOC2':
      case 'SOC3':
        return <Award className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Compliance Reporting Dashboard
          </CardTitle>
          <CardDescription>
            Generate, review, and distribute SOC compliance reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button 
              onClick={() => generateReport('SOC 1')}
              disabled={generatingReport}
              className="h-20 flex flex-col items-center justify-center"
            >
              <Award className="h-6 w-6 mb-2" />
              Generate SOC 1
            </Button>
            <Button 
              onClick={() => generateReport('SOC 2')}
              disabled={generatingReport}
              className="h-20 flex flex-col items-center justify-center"
            >
              <Shield className="h-6 w-6 mb-2" />
              Generate SOC 2
            </Button>
            <Button 
              onClick={() => generateReport('SOC 3')}
              disabled={generatingReport}
              className="h-20 flex flex-col items-center justify-center"
            >
              <Eye className="h-6 w-6 mb-2" />
              Generate SOC 3
            </Button>
            <Button 
              onClick={() => generateReport('Compliance Summary')}
              disabled={generatingReport}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center"
            >
              <FileText className="h-6 w-6 mb-2" />
              Summary Report
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">SOC Reports</TabsTrigger>
          <TabsTrigger value="evidence">Audit Evidence</TabsTrigger>
          <TabsTrigger value="findings">Findings Management</TabsTrigger>
        </TabsList>

        <TabsContent value="reports">
          <div className="space-y-4">
            {reports.map((report) => (
              <Card key={report.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-primary/10 rounded">
                        {getReportTypeIcon(report.type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{report.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {report.description}
                        </CardDescription>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge className={getStatusColor(report.status)}>
                            {getStatusIcon(report.status)}
                            {report.status.replace('_', ' ')}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Period: {report.reportPeriod.start} to {report.reportPeriod.end}
                          </span>
                          {report.auditFirm && (
                            <span className="text-sm text-muted-foreground">
                              Auditor: {report.auditFirm}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {report.downloadUrl && (
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Send className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-lg font-semibold">{report.findings.total}</p>
                      <p className="text-xs text-muted-foreground">Total Controls</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg dark:bg-green-950">
                      <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                        {report.findings.total - report.findings.deficiencies - report.findings.exceptions - report.findings.materialWeaknesses}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">No Exceptions</p>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg dark:bg-yellow-950">
                      <p className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                        {report.findings.deficiencies + report.findings.exceptions}
                      </p>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400">Exceptions</p>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg dark:bg-red-950">
                      <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                        {report.findings.materialWeaknesses}
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-400">Material Weaknesses</p>
                    </div>
                  </div>
                  
                  {report.fileSize && (
                    <div className="mt-4 text-sm text-muted-foreground">
                      Generated: {report.generatedDate} | File Size: {report.fileSize}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="evidence">
          <div className="space-y-4">
            {auditEvidence.map((evidence) => (
              <Card key={evidence.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline">{evidence.controlId}</Badge>
                        <Badge className={getStatusColor(evidence.reviewStatus)}>
                          {getStatusIcon(evidence.reviewStatus)}
                          {evidence.reviewStatus}
                        </Badge>
                      </div>
                      <h4 className="font-medium">{evidence.controlName}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {evidence.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                        <span>Type: {evidence.evidenceType}</span>
                        <span>Collected: {evidence.collectedDate}</span>
                        <span>Attachments: {evidence.attachments.length}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="findings">
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Excellent Compliance Status</AlertTitle>
              <AlertDescription>
                Current audit period shows no material weaknesses and minimal exceptions across all control areas.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Findings Summary - Current Period</CardTitle>
                <CardDescription>
                  Overview of audit findings across all SOC assessments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-green-600 dark:text-green-400 mb-2">Clean Opinions</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Security controls operating effectively</li>
                      <li>• Availability targets consistently met</li>
                      <li>• Privacy controls properly implemented</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-yellow-600 dark:text-yellow-400 mb-2">Minor Exceptions</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Documentation update timing (1 instance)</li>
                      <li>• User access review scheduling</li>
                      <li>• Backup log retention periods</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-blue-600 dark:text-blue-400 mb-2">Recommendations</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Enhanced monitoring dashboard</li>
                      <li>• Automated compliance reporting</li>
                      <li>• Quarterly control self-assessments</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComplianceReporting;