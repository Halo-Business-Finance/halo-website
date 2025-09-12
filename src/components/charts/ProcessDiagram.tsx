import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, FileText, DollarSign, TrendingUp, Users, Award, Zap } from 'lucide-react';

interface ProcessStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  timeframe: string;
  status: 'completed' | 'current' | 'upcoming';
  kpi?: string;
  kpiLabel?: string;
}

const processSteps: ProcessStep[] = [
  {
    id: 1,
    title: 'Application Submission',
    description: 'Streamlined digital application process with intelligent pre-screening and automated validation.',
    icon: <FileText className="h-8 w-8" />,
    timeframe: '< 5 min',
    status: 'completed',
    kpi: '98%',
    kpiLabel: 'Success Rate'
  },
  {
    id: 2,
    title: 'Risk Assessment',
    description: 'Advanced AI-powered credit analysis with real-time verification and comprehensive due diligence.',
    icon: <Clock className="h-8 w-8" />,
    timeframe: '24-48 hrs',
    status: 'current',
    kpi: '15min',
    kpiLabel: 'Avg Review'
  },
  {
    id: 3,
    title: 'Decision & Approval',
    description: 'Executive committee review with instant decision notification and detailed terms presentation.',
    icon: <CheckCircle className="h-8 w-8" />,
    timeframe: '1-3 days',
    status: 'upcoming',
    kpi: '92%',
    kpiLabel: 'Approval Rate'
  },
  {
    id: 4,
    title: 'Capital Deployment',
    description: 'Secure fund transfer with comprehensive documentation and ongoing relationship management.',
    icon: <DollarSign className="h-8 w-8" />,
    timeframe: '24-72 hrs',
    status: 'upcoming',
    kpi: '$2.5B+',
    kpiLabel: 'Deployed YTD'
  }
];

const executiveMetrics = [
  {
    icon: <TrendingUp className="h-6 w-6 text-financial-primary" />,
    value: '$2.5B+',
    label: 'Capital Deployed',
    trend: '+18% YoY',
    trendUp: true
  },
  {
    icon: <Users className="h-6 w-6 text-financial-primary" />,
    value: '15,000+',
    label: 'Businesses Served',
    trend: '+25% YoY',
    trendUp: true
  },
  {
    icon: <Award className="h-6 w-6 text-financial-primary" />,
    value: '4.9/5',
    label: 'Client Satisfaction',
    trend: '+0.2 pts',
    trendUp: true
  },
  {
    icon: <Zap className="h-6 w-6 text-financial-primary" />,
    value: '5.2 days',
    label: 'Avg. Processing',
    trend: '-1.8 days',
    trendUp: true
  }
];

export const ProcessDiagram = () => {
  const getStepStatus = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          bg: 'bg-gradient-to-br from-success/20 to-success/10',
          border: 'border-success/30',
          icon: 'text-success',
          accent: 'text-success'
        };
      case 'current':
        return {
          bg: 'bg-gradient-to-br from-primary/20 to-primary/10',
          border: 'border-primary/30 ring-2 ring-primary/20',
          icon: 'text-primary',
          accent: 'text-primary'
        };
      case 'upcoming':
        return {
          bg: 'bg-gradient-to-br from-muted/50 to-muted/20',
          border: 'border-muted/40',
          icon: 'text-muted-foreground',
          accent: 'text-muted-foreground'
        };
      default:
        return {
          bg: 'bg-muted/20',
          border: 'border-muted/40',
          icon: 'text-muted-foreground',
          accent: 'text-muted-foreground'
        };
    }
  };

  return (
    <div className="space-y-8">
      {/* Executive Overview Header */}
      <Card className="bg-gradient-to-br from-slate-50 to-white border-0 shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-light text-slate-800 mb-2">
                Lending Operations Dashboard
              </CardTitle>
              <p className="text-slate-600 text-lg font-light">
                Enterprise-grade capital deployment process overview
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary to-primary/80 p-4 rounded-2xl">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Executive Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {executiveMetrics.map((metric, index) => (
          <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-slate-50">
                  {metric.icon}
                </div>
                <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                  metric.trendUp ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                }`}>
                  {metric.trend}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-light text-slate-800">{metric.value}</div>
                <div className="text-slate-600 font-medium">{metric.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Process Flow Diagram */}
      <Card className="bg-white border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-light text-slate-800">
            Capital Deployment Process
          </CardTitle>
          <p className="text-slate-600 font-light">
            End-to-end workflow from application to funding
          </p>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {processSteps.map((step, index) => {
              const status = getStepStatus(step.status);
              return (
                <div key={step.id} className="relative">
                  <Card className={`${status.bg} ${status.border} border-2 h-full transition-all duration-300 hover:scale-[1.02]`}>
                    <CardContent className="p-6">
                      {/* Icon and Step Number */}
                      <div className="flex items-center justify-between mb-4">
                        <div className={`${status.icon} p-4 rounded-2xl`}>
                          {step.icon}
                        </div>
                        <div className="text-right">
                          <div className={`text-xs font-semibold ${status.accent} tracking-wider uppercase`}>
                            Step {step.id}
                          </div>
                          <div className={`text-sm font-bold ${status.accent} mt-1`}>
                            {step.timeframe}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-lg text-slate-800 leading-tight">
                          {step.title}
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {step.description}
                        </p>
                        
                        {/* KPI Section */}
                        {step.kpi && (
                          <div className="pt-3 border-t border-slate-200/50">
                            <div className={`text-2xl font-bold ${status.accent}`}>
                              {step.kpi}
                            </div>
                            <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                              {step.kpiLabel}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Connector Arrow */}
                  {index < processSteps.length - 1 && (
                    <div className="hidden xl:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                      <div className="bg-white rounded-full p-2 shadow-md border border-slate-200">
                        <div className={`w-4 h-4 rounded-full ${
                          step.status === 'completed' ? 'bg-success' : 
                          step.status === 'current' ? 'bg-primary' : 'bg-muted'
                        }`} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Process Timeline for Mobile */}
          <div className="xl:hidden mt-8">
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-success via-primary to-muted"></div>
              {processSteps.map((step, index) => (
                <div key={step.id} className="relative flex items-start gap-4 pb-8 last:pb-0">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getStepStatus(step.status).icon} z-10`}>
                    <div className="text-lg font-bold">{step.id}</div>
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="font-semibold text-slate-800">{step.title}</div>
                    <div className={`text-sm ${getStepStatus(step.status).accent} font-medium`}>{step.timeframe}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Executive Summary */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <div className="bg-gradient-to-r from-slate-50 to-white p-6 rounded-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-3xl font-light text-primary">5.2 days</div>
                  <div className="text-slate-600 font-medium">Average Time to Fund</div>
                  <div className="text-xs text-success font-semibold">25% faster than industry</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-light text-primary">92%</div>
                  <div className="text-slate-600 font-medium">First-Time Approval Rate</div>
                  <div className="text-xs text-success font-semibold">Industry leading</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-light text-primary">24/7</div>
                  <div className="text-slate-600 font-medium">Digital Access</div>
                  <div className="text-xs text-primary font-semibold">Real-time updates</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};