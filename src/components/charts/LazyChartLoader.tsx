import React, { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load chart components with named imports
const LoanApprovalChart = lazy(() => 
  import('./LoanApprovalChart').then(module => ({ default: module.LoanApprovalChart }))
);
const EquipmentTypesChart = lazy(() => 
  import('./EquipmentTypesChart').then(module => ({ default: module.EquipmentTypesChart }))
);
const IndustryStatsChart = lazy(() => 
  import('./IndustryStatsChart').then(module => ({ default: module.IndustryStatsChart }))
);
const ProcessDiagram = lazy(() => 
  import('./ProcessDiagram').then(module => ({ default: module.ProcessDiagram }))
);
const LendingStatsSection = lazy(() => 
  import('./LendingStatsSection').then(module => ({ default: module.LendingStatsSection }))
);

interface ChartLoaderProps {
  type: 'loan-approval' | 'equipment-types' | 'industry-stats' | 'process-diagram' | 'lending-stats';
  className?: string;
}

const ChartSkeleton = () => (
  <div className="space-y-4 p-6">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-64 w-full" />
  </div>
);

export const LazyChartLoader: React.FC<ChartLoaderProps> = ({ type, className }) => {
  const renderChart = () => {
    switch (type) {
      case 'loan-approval':
        return <LoanApprovalChart />;
      case 'equipment-types':
        return <EquipmentTypesChart />;
      case 'industry-stats':
        return <IndustryStatsChart />;
      case 'process-diagram':
        return <ProcessDiagram />;
      case 'lending-stats':
        return <LendingStatsSection />;
      default:
        return null;
    }
  };

  return (
    <Suspense fallback={<ChartSkeleton />}>
      <div className={className}>
        {renderChart()}
      </div>
    </Suspense>
  );
};

export default LazyChartLoader;
