import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
  onClick?: () => void;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  className, 
  delay = 0, 
  hover = true,
  onClick 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardStyles: React.CSSProperties = {
    animationDelay: `${delay}ms`,
    transform: isHovered && hover ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
    boxShadow: isHovered ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  return (
    <div
      style={cardStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={cn(
        "bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-white/20 dark:border-slate-700/50",
        "rounded-xl shadow-lg cursor-pointer relative overflow-hidden",
        "animate-slideInUp opacity-0 animate-fill-forwards",
        className
      )}
    >
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 opacity-0 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : ''
        }`} 
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};