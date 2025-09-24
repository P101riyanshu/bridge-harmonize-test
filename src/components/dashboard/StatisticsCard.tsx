import React, { useState, useEffect } from 'react';
import { LucideIcon } from 'lucide-react';
import { AnimatedCard } from '../enhanced/AnimatedCard';

interface StatisticsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  delay?: number;
}

const colorVariants = {
  blue: 'bg-gradient-to-r from-blue-500 to-blue-600',
  green: 'bg-gradient-to-r from-green-500 to-green-600',
  orange: 'bg-gradient-to-r from-orange-500 to-orange-600',
  red: 'bg-gradient-to-r from-red-500 to-red-600',
  purple: 'bg-gradient-to-r from-purple-500 to-purple-600'
};

export const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  color = 'blue',
  delay = 0
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [showIcon, setShowIcon] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowIcon(true);
    }, delay + 100);

    const timer2 = setTimeout(() => {
      if (typeof value === 'number') {
        let current = 0;
        const increment = value / 20;
        const timer = setInterval(() => {
          current += increment;
          if (current >= value) {
            current = value;
            clearInterval(timer);
          }
          setAnimatedValue(Math.floor(current));
        }, 50);
      }
    }, delay + 200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [value, delay]);

  return (
    <AnimatedCard delay={delay} className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
            {title}
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white transition-all duration-500">
            {typeof value === 'number' ? animatedValue : value}
          </p>
          {trend !== undefined && (
            <div className={`flex items-center mt-2 text-sm transition-opacity duration-500 ${
              showIcon ? 'opacity-100' : 'opacity-0'
            } ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <span>{trend >= 0 ? '↗' : '↘'} {trend >= 0 ? '+' : ''}{trend}%</span>
              <span className="text-slate-500 dark:text-slate-400 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div
          className={`p-3 rounded-full text-white transition-all duration-500 ${colorVariants[color]} ${
            showIcon ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-180'
          }`}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </AnimatedCard>
  );
};