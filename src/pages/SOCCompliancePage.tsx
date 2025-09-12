import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import DefaultPageHeader from '@/components/DefaultPageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Shield, 
  Lock, 
  FileText, 
  CheckCircle, 
  Clock, 
  Database, 
  Eye,
  Download,
  AlertTriangle,
  Award,
  Users,
  Server
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ComplianceMetric {
  id: string;
  name: string;
  category: string;
  status: 'compliant' | 'in_progress' | 'non_compliant';
  lastAudit: string;
  nextAudit: string;
  description: string;
}

interface SOCReport {
  id: string;
  type: 'SOC1' | 'SOC2' | 'SOC3';
  period: string;
  status: 'current' | 'in_progress' | 'expired';
  auditFirm: string;
  issueDate: string;
  expiryDate: string;
  opinion: 'unqualified' | 'qualified' | 'adverse' | 'disclaimer';
}

const SOCCompliancePage: React.FC = () => {
  const [complianceMetrics, setComplianceMetrics] = useState<ComplianceMetric[]>([]);
  const [socReports, setSocReports] = useState<SOCReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [overallCompliance, setOverallCompliance] = useState(0);

  useEffect(() => {
    loadComplianceData();
  }, []);

  const loadComplianceData = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration - in production this would come from your compliance management system
      const mockMetrics: ComplianceMetric[] = [
        {
          id: '1',
          name: 'Access Controls',
          category: 'Security',
          status: 'compliant',
          lastAudit: '2024-12-15',
          nextAudit: '2025-03-15',
          description: 'Multi-factor authentication and role-based access controls'
        },
        {
          id: '2',
          name: 'Data Encryption',
          category: 'Security',
          status: 'compliant',
          lastAudit: '2024-12-10',
          nextAudit: '2025-03-10',
          description: 'AES-256 encryption for data at rest and in transit'
        },
        {
          id: '3',
          name: 'Audit Logging',
          category: 'Monitoring',
          status: 'compliant',
          lastAudit: '2024-12-20',
          nextAudit: '2025-03-20',
          description: 'Comprehensive audit trail for all system activities'
        },
        {
          id: '4',
          name: 'Backup & Recovery',
          category: 'Availability',
          status: 'in_progress',
          lastAudit: '2024-11-30',
          nextAudit: '2025-02-28',
          description: 'Automated backup systems with tested recovery procedures'
        },
        {
          id: '5',
          name: 'Incident Response',
          category: 'Security',
          status: 'compliant',
          lastAudit: '2024-12-01',
          nextAudit: '2025-03-01',
          description: 'Documented incident response procedures and 24/7 monitoring'
        }
      ];

      const mockReports: SOCReport[] = [
        {
          id: '1',
          type: 'SOC2',
          period: '2024',
          status: 'current',
          auditFirm: 'Elite Audit Partners',
          issueDate: '2024-12-01',
          expiryDate: '2025-11-30',
          opinion: 'unqualified'
        },
        {
          id: '2',
          type: 'SOC1',
          period: '2024',
          status: 'in_progress',
          auditFirm: 'Elite Audit Partners',
          issueDate: '2024-10-15',
          expiryDate: '2025-10-14',
          opinion: 'unqualified'
        }
      ];

      setComplianceMetrics(mockMetrics);
      setSocReports(mockReports);
      
      // Calculate overall compliance
      const compliantCount = mockMetrics.filter(m => m.status === 'compliant').length;
      const compliancePercentage = (compliantCount / mockMetrics.length) * 100;
      setOverallCompliance(compliancePercentage);

    } catch (error) {
      console.error('Error loading compliance data:', error);
      toast.error('Failed to load compliance data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'current':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'non_compliant':
      case 'expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'current':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      case 'non_compliant':
      case 'expired':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Helmet>
        <title>SOC Compliance - SSAE 18 Service Organization Controls | Halo Business Finance</title>
        <meta name="description" content="SSAE 18-compliant SOC 1, SOC 2, and SOC 3 assessments. Comprehensive security controls, audit reports, and compliance monitoring for financial services." />
        <meta name="keywords" content="SOC compliance, SSAE 18, SOC 1, SOC 2, SOC 3, audit reports, security controls, compliance monitoring" />
      </Helmet>

      <DefaultPageHeader 
        title="SOC Compliance Dashboard"
        subtitle="SSAE 18-Compliant Service Organization Control Assessments"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Compliance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overall Compliance</p>
                  <p className="text-2xl font-bold">{overallCompliance.toFixed(0)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active SOC Reports</p>
                  <p className="text-2xl font-bold">{socReports.filter(r => r.status === 'current').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center">
                  <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Security Controls</p>
                  <p className="text-2xl font-bold">{complianceMetrics.filter(m => m.category === 'Security').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center">
                  <FileText className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Audit</p>
                  <p className="text-sm font-bold">Dec 2024</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              SOC Compliance Progress
            </CardTitle>
            <CardDescription>
              Current status of SOC 1, SOC 2, and SOC 3 compliance requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span>Overall Compliance</span>
                  <span>{overallCompliance.toFixed(0)}%</span>
                </div>
                <Progress value={overallCompliance} className="w-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="reports">SOC Reports</TabsTrigger>
            <TabsTrigger value="controls">Security Controls</TabsTrigger>
            <TabsTrigger value="monitoring">Continuous Monitoring</TabsTrigger>
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
          </TabsList>

          <TabsContent value="reports">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* SOC Reports */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Current SOC Reports
                  </CardTitle>
                  <CardDescription>
                    Active SSAE 18 compliant audit reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {socReports.map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded">
                            <Award className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{report.type} Report - {report.period}</p>
                            <p className="text-sm text-muted-foreground">
                              {report.auditFirm} | {report.opinion} opinion
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(report.status)}>
                            {getStatusIcon(report.status)}
                            {report.status}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* SOC Types Information */}
              <Card>
                <CardHeader>
                  <CardTitle>SOC Report Types</CardTitle>
                  <CardDescription>
                    Understanding different SOC assessment types
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold text-primary mb-2">SOC 1 - Financial Reporting</h4>
                      <p className="text-sm text-muted-foreground">
                        Controls relevant to user entities' internal control over financial reporting (ICFR)
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold text-primary mb-2">SOC 2 - Security & Operations</h4>
                      <p className="text-sm text-muted-foreground">
                        Security, availability, processing integrity, confidentiality, and privacy controls
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold text-primary mb-2">SOC 3 - General Use</h4>
                      <p className="text-sm text-muted-foreground">
                        General use report suitable for broad distribution without restrictions
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="controls">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security Controls Matrix
                </CardTitle>
                <CardDescription>
                  Comprehensive security controls aligned with SOC 2 Trust Services Criteria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceMetrics.map((metric) => (
                    <div key={metric.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded">
                          {metric.category === 'Security' && <Shield className="h-4 w-4 text-primary" />}
                          {metric.category === 'Monitoring' && <Eye className="h-4 w-4 text-primary" />}
                          {metric.category === 'Availability' && <Server className="h-4 w-4 text-primary" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{metric.name}</p>
                          <p className="text-sm text-muted-foreground">{metric.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Last Audit: {metric.lastAudit} | Next: {metric.nextAudit}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(metric.status)}>
                          {getStatusIcon(metric.status)}
                          {metric.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline">
                          {metric.category}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Real-time Monitoring
                  </CardTitle>
                  <CardDescription>
                    Continuous monitoring of security controls and compliance status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>All Systems Operational</AlertTitle>
                      <AlertDescription>
                        Security monitoring systems are functioning normally. No compliance violations detected.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-green-50 rounded-lg dark:bg-green-950">
                        <p className="text-sm font-medium text-green-800 dark:text-green-200">Security Events</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">0</p>
                        <p className="text-xs text-green-600 dark:text-green-400">Last 24 hours</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg dark:bg-blue-950">
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Audit Logs</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">1,247</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">Last 24 hours</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Access Management
                  </CardTitle>
                  <CardDescription>
                    User access controls and privilege management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-sm font-medium">Multi-Factor Authentication</span>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Enabled
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-sm font-medium">Role-Based Access Control</span>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-sm font-medium">Session Management</span>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Secure
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documentation">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>SOC 1 Documentation</CardTitle>
                  <CardDescription>
                    Financial reporting controls documentation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      SOC 1 Type II Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Control Matrix
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Testing Procedures
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SOC 2 Documentation</CardTitle>
                  <CardDescription>
                    Trust Services Criteria documentation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      SOC 2 Type II Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Security Policies
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Privacy Notice
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Audit Artifacts</CardTitle>
                  <CardDescription>
                    Supporting documentation and evidence
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Risk Assessment
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Incident Response Plan
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Change Management
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SOCCompliancePage;