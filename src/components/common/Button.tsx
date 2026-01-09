import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'save' | 'cancel' | 'nav' | 'delete';
  children: React.ReactNode;
}

const variantClasses: Record<string, string> = {
  default: 'border-gray-300 bg-white hover:bg-gray-100',
  primary: 'bg-indigo-500 text-white border-indigo-500 hover:bg-indigo-600',
  save: 'bg-green-600 text-white border-green-600 hover:bg-green-700',
  cancel: 'bg-gray-500 text-white border-gray-500 hover:bg-gray-600',
  nav: 'border-gray-300 bg-white hover:bg-gray-100',
  delete: 'border-red-500 bg-white text-red-500 hover:bg-red-500 hover:text-white text-sm px-2.5 py-1 rounded-xl',
};

const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = variant === 'delete'
    ? 'border cursor-pointer transition-all duration-200 flex items-center gap-1.5'
    : 'px-4 py-2 border rounded cursor-pointer text-sm transition-all duration-200 flex items-center gap-1.5';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
