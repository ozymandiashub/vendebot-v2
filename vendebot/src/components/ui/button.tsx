// VendeBot MVP - Button Component (Boomer-friendly)
import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'large' | 'medium' | 'small';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export function Button({ 
  variant = 'primary', 
  size = 'large', 
  children, 
  onClick, 
  disabled = false,
  type = 'button',
  className 
}: ButtonProps) {
  const baseClasses = "font-semibold rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-opacity-50 shadow-md";
  
  const sizeClasses = {
    large: "px-8 py-4 text-lg min-h-[56px]",
    medium: "px-6 py-3 text-base min-h-[48px]",
    small: "px-4 py-2 text-sm min-h-[40px]"
  };
  
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-300 disabled:bg-blue-300",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-300 disabled:bg-gray-100",
    success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-300 disabled:bg-green-300",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-300 disabled:bg-red-300"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        disabled && "cursor-not-allowed opacity-60",
        className
      )}
    >
      {children}
    </button>
  );
}

// Legacy export for compatibility
export default Button;