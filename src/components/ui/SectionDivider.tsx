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
    sm: 'h-12',
    md: 'h-20', 
    lg: 'h-32'
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
    <div className={`relative ${heightClasses[height]} ${getVariantClasses()} overflow-hidden`}>
      {/* Background Pattern */}
      {showPattern && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-y-1"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/5 rounded-full transform -translate-y-1/2"></div>
          <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-white/5 rounded-full"></div>
          <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-white/5 rounded-full"></div>
        </div>
      )}
      
      {/* Central Line Element */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="relative">
            {/* Main divider line */}
            
            {/* Center accent */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              </div>
            </div>
            
            {/* Side accents */}
            <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-2 h-2 bg-white/30 rounded-full"></div>
            </div>
            <div className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2">
              <div className="w-2 h-2 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionDivider;