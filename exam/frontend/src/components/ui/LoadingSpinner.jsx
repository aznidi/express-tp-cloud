import React from 'react';
import { cn } from '../../utils/cn';

export const LoadingSpinner = ({ className, size = 'md' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-primary border-t-transparent',
          sizes[size]
        )}
      />
    </div>
  );
}; 