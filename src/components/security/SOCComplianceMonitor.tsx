import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  FileText,
  Database,
  Lock,
  Eye,
  Award
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SOCControl {
  id: string;
  name: string;
  category: 'Security' | 'Availability' | 'Processing' | 'Confidentiality' | 'Privacy';
  trustServicesCriteria: string;
  status: 'compliant' | 'non_compliant' | 'in_progress';
  lastTested: string;
  nextTest: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  evidence: string[];
}

interface ComplianceMetrics {
  overallScore: number;
  controlsTotal: number;
  controlsCompliant: number;
  controlsNonCompliant: number;
  controlsInProgress: number;
  lastAuditDate: string;
  nextAuditDate: string;
  certificationType: string;
}

const SOCComplianceMonitor: React.FC = () => {
  const [socControls, setSocControls] = useState<SOCControl[]>([]);
  const [metrics, setMetrics] = useState<ComplianceMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSOCControls();
  }, []);

  const loadSOCControls = async () => {
    try {
      setLoading(true);

      // In production, this would fetch from your compliance management system
      const mockControls: SOCControl[] = [
        {
          id: 'CC1.1',
          name: 'Control Environment - Integrity and Ethical Values',
          category: 'Security',
          trustServicesCriteria: 'CC1.1',
          status: 'compliant',
          lastTested: '2024-12-15',
          nextTest: '2025-03-15',
          riskLevel: 'low',
          evidence: ['Code of Conduct', 'Ethics Training Records', 'Background Checks']
        },
        {
          id: 'CC2.1',
          name: 'Communication and Information - Internal Communication',
          category: 'Security',
          trustServicesCriteria: 'CC2.1',
          status: 'compliant',
          lastTested: '2024-12-10',
          nextTest: '2025-03-10',
          riskLevel: 'low',
          evidence: ['Communication Policies', 'Incident Reporting Procedures']
        },
        {
          id: 'CC3.1',
          name: 'Risk Assessment - Risk Identification',
          category: 'Security',
          trustServicesCriteria: 'CC3.1',
          status: 'in_progress',
          lastTested: '2024-11-30',
          nextTest: '2025-02-28',
          riskLevel: 'medium',
          evidence: ['Risk Register', 'Threat Assessment', 'Business Impact Analysis']
        },
        {
          id: 'CC6.1',
          name: 'Logical and Physical Access Controls',
          category: 'Security',
          trustServicesCriteria: 'CC6.1',
          status: 'compliant',
          lastTested: '2024-12-20',
          nextTest: '2025-03-20',
          riskLevel: 'low',
          evidence: ['Access Control Lists', 'MFA Implementation', 'Physical Security Logs']
        },
        {
          id: 'CC7.1',
          name: 'System Operations - Data Backup and Recovery',
          category: 'Availability',
          trustServicesCriteria: 'CC7.1',
          status: 'compliant',
          lastTested: '2024-12-05',
          nextTest: '2025-03-05',
          riskLevel: 'low',
          evidence: ['Backup Procedures', 'Recovery Testing', 'RTO/RPO Documentation']
        },
        {
          id: 'A1.1',
          name: 'Availability Monitoring',
          category: 'Availability',
          trustServicesCriteria: 'A1.1',
          status: 'compliant',
          lastTested: '2024-12-18',
          nextTest: '2025-03-18',
          riskLevel: 'low',
          evidence: ['Monitoring Systems', 'Uptime Reports', 'Performance Metrics']
        },
        {
          id: 'P1.1',
          name: 'Privacy Notice and Choice',
          category: 'Privacy',
          trustServicesCriteria: 'P1.1',
          status: 'compliant',
          lastTested: '2024-12-12',
          nextTest: '2025-03-12',
          riskLevel: 'medium',
          evidence: ['Privacy Policy', 'Consent Management', 'Data Processing Agreements']
        }
      ];

      setSocControls(mockControls);

      // Calculate metrics
      const compliantControls = mockControls.filter(c => c.status === 'compliant').length;
      const nonCompliantControls = mockControls.filter(c => c.status === 'non_compliant').length;
      const inProgressControls = mockControls.filter(c => c.status === 'in_progress').length;
      const overallScore = (compliantControls / mockControls.length) * 100;

      setMetrics({
        overallScore,
        controlsTotal: mockControls.length,
        controlsCompliant: compliantControls,
        controlsNonCompliant: nonCompliantControls,
        controlsInProgress: inProgressControls,
        lastAuditDate: '2024-12-01',
        nextAuditDate: '2025-11-30',
        certificationType: 'SOC 2 Type II'
      });

    } catch (error) {
      console.error('Error loading SOC controls:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'non_compliant':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      case 'non_compliant':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Security':
        return <Shield className="h-4 w-4" />;
      case 'Availability':
        return <Database className="h-4 w-4" />;
      case 'Processing':
        return <Eye className="h-4 w-4" />;
      case 'Confidentiality':
        return <Lock className="h-4 w-4" />;
      case 'Privacy':
        return <FileText className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading SOC Compliance Data...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Compliance Overview */}
      {metrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              SOC Compliance Overview
            </CardTitle>
            <CardDescription>
              {metrics.certificationType} - SSAE 18 Compliant Assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-primary">{metrics.overallScore.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Overall Compliance</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg dark:bg-green-950">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{metrics.controlsCompliant}</p>
                <p className="text-sm text-green-600 dark:text-green-400">Compliant Controls</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg dark:bg-yellow-950">
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{metrics.controlsInProgress}</p>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">In Progress</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg dark:bg-red-950">
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{metrics.controlsNonCompliant}</p>
                <p className="text-sm text-red-600 dark:text-red-400">Non-Compliant</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Compliance Progress</span>
                <span>{metrics.overallScore.toFixed(1)}%</span>
              </div>
              <Progress value={metrics.overallScore} className="w-full" />
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              <p>Last Audit: {metrics.lastAuditDate} | Next Audit: {metrics.nextAuditDate}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Controls Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Trust Services Criteria Controls
          </CardTitle>
          <CardDescription>
            Security, Availability, Processing Integrity, Confidentiality, and Privacy controls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {socControls.map((control) => (
              <div key={control.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-primary/10 rounded">
                      {getCategoryIcon(control.category)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{control.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Trust Services Criteria: {control.trustServicesCriteria}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline">{control.category}</Badge>
                        <Badge className={getStatusColor(control.status)}>
                          {getStatusIcon(control.status)}
                          {control.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={getRiskColor(control.riskLevel)}>
                          {control.riskLevel} risk
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground mt-3 pl-11">
                  <p>Last Tested: {control.lastTested} | Next Test: {control.nextTest}</p>
                  <p className="mt-1">Evidence: {control.evidence.join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Alerts */}
      <div className="space-y-4">
        {metrics && metrics.controlsNonCompliant > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Compliance Issues Detected</AlertTitle>
            <AlertDescription>
              {metrics.controlsNonCompliant} control(s) are non-compliant and require immediate attention.
            </AlertDescription>
          </Alert>
        )}

        {metrics && metrics.controlsInProgress > 0 && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertTitle>Controls Under Review</AlertTitle>
            <AlertDescription>
              {metrics.controlsInProgress} control(s) are currently being reviewed or updated.
            </AlertDescription>
          </Alert>
        )}

        {metrics && metrics.overallScore >= 95 && (
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle className="text-green-800 dark:text-green-200">Excellent Compliance</AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-300">
              Your organization maintains excellent SOC compliance with {metrics.overallScore.toFixed(1)}% of controls in compliance.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default SOCComplianceMonitor;