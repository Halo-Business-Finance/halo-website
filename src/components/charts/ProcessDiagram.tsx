import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, FileText, DollarSign, ArrowRight } from 'lucide-react';

interface ProcessStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  timeframe: string;
  status: 'completed' | 'current' | 'upcoming';
}

const processSteps: ProcessStep[] = [
  {
    id: 1,
    title: 'Application',
    description: 'Complete our simple online application with basic business information.',
    icon: <FileText className="h-6 w-6" />,
    timeframe: '5 minutes',
    status: 'completed'
  },
  {
    id: 2,
    title: 'Review',
    description: 'Our team reviews your application and may request additional documentation.',
    icon: <Clock className="h-6 w-6" />,
    timeframe: '24-48 hours',
    status: 'current'
  },
  {
    id: 3,
    title: 'Approval',
    description: 'Receive loan approval with detailed terms and conditions.',
    icon: <CheckCircle className="h-6 w-6" />,
    timeframe: '1-5 days',
    status: 'upcoming'
  },
  {
    id: 4,
    title: 'Funding',
    description: 'Sign documents and receive funds directly to your business account.',
    icon: <DollarSign className="h-6 w-6" />,
    timeframe: '1-3 days',
    status: 'upcoming'
  }
];

export const ProcessDiagram = () => {
  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-white';
      case 'current':
        return 'bg-primary text-white';
      case 'upcoming':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getConnectorColor = (currentStatus: string, nextStatus: string) => {
    if (currentStatus === 'completed') return 'bg-success';
    if (currentStatus === 'current' && nextStatus === 'upcoming') return 'bg-gradient-to-r from-primary to-muted';
    return 'bg-muted';
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Our Lending Process</CardTitle>
        <p className="text-sm text-foreground">From application to funding in as little as 7 days</p>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {processSteps.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Step Content */}
              <div className="flex items-start gap-4 pb-8">
                {/* Icon Circle */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getStepColor(step.status)} transition-colors duration-300`}>
                  {step.icon}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{step.title}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-muted text-foreground">
                      {step.timeframe}
                    </span>
                  </div>
                  <p className="text-foreground">{step.description}</p>
                </div>
              </div>
              
              {/* Connector Line */}
              {index < processSteps.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-8 flex items-center">
                  <div className={`w-full h-full ${getConnectorColor(step.status, processSteps[index + 1].status)} transition-colors duration-300`}>
                    <ArrowRight className="h-4 w-4 text-foreground absolute -right-2 top-2" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Summary Stats */}
        <div className="mt-8 pt-6 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">92%</div>
              <div className="text-sm text-foreground">Approval Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">7 Days</div>
              <div className="text-sm text-foreground">Avg. Processing</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">24/7</div>
              <div className="text-sm text-foreground">Online Access</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};