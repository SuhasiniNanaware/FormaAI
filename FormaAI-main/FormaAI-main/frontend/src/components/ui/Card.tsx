import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glow?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, glow = false, className = '', ...props }) => {
  return (
    <div
      className={`relative rounded-2xl glass-card glass-card-hover overflow-hidden transition-all duration-300 ${
        glow ? 'border-indigo-500/30 shadow-lg shadow-indigo-500/10' : 'border-slate-800/80'
      } ${className}`}
      {...props}
    >
      {glow && (
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default Card;