
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: 'lift' | 'scale' | 'glow' | 'none';
  animationDelay?: number;
  children: React.ReactNode;
}

export const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ className, hoverEffect = 'lift', animationDelay = 0, children, ...props }, ref) => {
    const hoverEffects = {
      lift: 'hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02]',
      scale: 'hover:scale-105',
      glow: 'hover:shadow-xl hover:shadow-primary/20',
      none: ''
    };

    return (
      <Card
        ref={ref}
        className={cn(
          'transition-all duration-300 ease-out animate-fade-in-scale',
          hoverEffects[hoverEffect],
          className
        )}
        style={{ animationDelay: `${animationDelay}ms` }}
        {...props}
      >
        {children}
      </Card>
    );
  }
);

AnimatedCard.displayName = 'AnimatedCard';
