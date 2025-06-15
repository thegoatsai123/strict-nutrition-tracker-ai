
import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div
    className={cn(
      'animate-pulse rounded-md bg-muted',
      className
    )}
  />
);

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={cn('animate-spin rounded-full border-2 border-muted border-t-primary', sizeClasses[size])} />
  );
};

export const LoadingDots: React.FC = () => (
  <div className="flex space-x-1">
    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
  </div>
);

interface SkeletonCardProps {
  showAvatar?: boolean;
  lines?: number;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ showAvatar = false, lines = 3 }) => (
  <div className="p-4 space-y-3">
    {showAvatar && (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[160px]" />
        </div>
      </div>
    )}
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} />
      ))}
    </div>
  </div>
);
