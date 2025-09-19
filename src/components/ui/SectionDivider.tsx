import React from 'react';

interface SectionDividerProps {
  variant?: 'corporate' | 'gradient' | 'minimal';
  height?: 'sm' | 'md' | 'lg';
  showPattern?: boolean;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
  variant = 'corporate',
  height = 'md',
  showPattern = true
}) => {
  const heightClasses = {
    sm: 'h-px',
    md: 'h-px', 
    lg: 'h-px'
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'corporate':
        return 'bg-gradient-to-r from-financial-navy via-slate-800 to-financial-navy';
      case 'gradient':
        return 'bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10';
      case 'minimal':
        return 'bg-muted/30';
      default:
        return 'bg-gradient-to-r from-financial-navy via-slate-800 to-financial-navy';
    }
  };

  return (
    <div className={`${heightClasses[height]} ${getVariantClasses()}`}>
    </div>
  );
};

export default SectionDivider;