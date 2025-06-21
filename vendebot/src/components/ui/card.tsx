// VendeBot MVP - Card Component (Boomer-friendly)
import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'small' | 'medium' | 'large';
  shadow?: boolean;
}

export function Card({ 
  children, 
  className, 
  padding = 'large',
  shadow = true 
}: CardProps) {
  const paddingClasses = {
    none: '',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  };

  return (
    <div
      className={clsx(
        'bg-white rounded-lg border border-gray-200',
        shadow && 'shadow-lg',
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: string;
  icon?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red';
}

export function MetricCard({ 
  title, 
  value, 
  trend, 
  icon, 
  color = 'blue' 
}: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200', 
    yellow: 'bg-yellow-50 border-yellow-200',
    red: 'bg-red-50 border-red-200'
  };

  const iconColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600', 
    red: 'text-red-600'
  };

  return (
    <Card className={clsx('text-center', colorClasses[color])} padding="medium">
      {icon && (
        <div className={clsx('text-4xl mb-2', iconColorClasses[color])}>
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      {trend && (
        <div className="text-sm text-gray-600">{trend}</div>
      )}
    </Card>
  );
}

// Legacy interface for compatibility
interface LegacyCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  footer?: React.ReactNode;
}

const LegacyCard: React.FC<LegacyCardProps> = ({ title, description, imageUrl, footer }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {imageUrl && <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />}
      <div className="p-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-gray-700">{description}</p>
      </div>
      {footer && <div className="bg-gray-100 p-4">{footer}</div>}
    </div>
  );
};

export default LegacyCard;