import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white py-5 px-8 text-center">
      <h1 className="text-3xl mb-2">{title}</h1>
      {subtitle && <p className="opacity-90 text-lg">{subtitle}</p>}
    </div>
  );
};

export default Header;
