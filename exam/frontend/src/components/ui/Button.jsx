import React from 'react';
import { cn } from '../../utils/cn';

const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children, 
  disabled = false,
  loading = false,
  type = 'button',
  ...props 
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-poppins font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-primary text-surface shadow-button border-none',
    secondary: 'bg-secondary text-surface shadow-button border-none',
    outline: 'border border-border bg-transparent text-textPrimary',
    ghost: 'bg-transparent text-textPrimary',
    danger: 'bg-red-500 text-surface shadow-button border-none',
  };

  const sizes = {
    sm: 'h-9 px-3 text-sm rounded-sm',
    md: 'h-10 px-4 text-base rounded-md',
    lg: 'h-12 px-6 text-base rounded-md',
    icon: 'h-10 w-10 rounded-md',
  };

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading ? (
        <>
          <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
          <span>Chargement...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
});

Button.displayName = 'Button';

export { Button }; 