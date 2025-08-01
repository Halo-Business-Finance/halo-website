import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description: string;
  fields: string[];
  isCompleted: boolean;
  isActive: boolean;
  hasErrors: boolean;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStepIndex: number;
  completedFields: string[];
  errorFields: string[];
  onStepClick?: (stepIndex: number) => void;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  currentStepIndex,
  completedFields,
  errorFields,
  onStepClick
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const totalSteps = steps.length;
  const progressPercentage = ((currentStepIndex + 1) / totalSteps) * 100;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progressPercentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [progressPercentage]);

  const getStepStatus = (step: Step, index: number) => {
    if (index < currentStepIndex) return 'completed';
    if (index === currentStepIndex) return 'active';
    return 'pending';
  };

  const getStepIcon = (step: Step, index: number) => {
    const status = getStepStatus(step, index);
    
    if (status === 'completed') {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
    
    if (status === 'active') {
      const hasErrors = step.fields.some(field => errorFields.includes(field));
      if (hasErrors) {
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      }
      return <Circle className="h-5 w-5 text-primary" />;
    }
    
    return <Circle className="h-5 w-5 text-gray-400" />;
  };

  const getStepClasses = (step: Step, index: number) => {
    const status = getStepStatus(step, index);
    const baseClasses = "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all";
    
    if (status === 'completed') {
      return `${baseClasses} bg-green-50 border border-green-200 hover:bg-green-100`;
    }
    
    if (status === 'active') {
      const hasErrors = step.fields.some(field => errorFields.includes(field));
      if (hasErrors) {
        return `${baseClasses} bg-red-50 border border-red-200`;
      }
      return `${baseClasses} bg-primary/10 border border-primary/20`;
    }
    
    return `${baseClasses} bg-gray-50 border border-gray-200 hover:bg-gray-100`;
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Application Progress</h3>
            <span className="text-sm text-muted-foreground">
              Step {currentStepIndex + 1} of {totalSteps}
            </span>
          </div>
          
          <Progress 
            value={animatedProgress} 
            className="h-3 mb-2"
          />
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Just started</span>
            <span>{Math.round(progressPercentage)}% complete</span>
            <span>Application complete</span>
          </div>
        </CardContent>
      </Card>

      {/* Step Navigation */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Application Steps</h3>
          
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={getStepClasses(step, index)}
                onClick={() => onStepClick?.(index)}
              >
                <div className="flex-shrink-0">
                  {getStepIcon(step, index)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{step.title}</h4>
                    <span className="text-xs text-muted-foreground">
                      {index < currentStepIndex && '✓ Complete'}
                      {index === currentStepIndex && 'In Progress'}
                      {index > currentStepIndex && 'Pending'}
                    </span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-1">
                    {step.description}
                  </p>
                  
                  {/* Field completion status */}
                  {index === currentStepIndex && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">
                          Fields completed:
                        </span>
                        <span className="font-medium">
                          {step.fields.filter(field => completedFields.includes(field)).length}
                          /
                          {step.fields.length}
                        </span>
                      </div>
                      
                      {step.fields.some(field => errorFields.includes(field)) && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                          <AlertCircle className="h-3 w-3" />
                          <span>Please fix the errors below</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Quick Stats</h3>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {steps.filter((_, index) => index < currentStepIndex).length}
              </div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-primary">
                1
              </div>
              <div className="text-xs text-muted-foreground">In Progress</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-gray-400">
                {steps.filter((_, index) => index > currentStepIndex).length}
              </div>
              <div className="text-xs text-muted-foreground">Remaining</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estimated Time */}
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Estimated time remaining</div>
            <div className="text-lg font-semibold">
              {Math.max(1, (totalSteps - currentStepIndex - 1) * 3)} minutes
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};