/**
 * Reusable UI Components - Small, focused, composable
 * Following SOLID principles - each component has single responsibility
 */

import React from 'react';

// ============ Stat Card Component ============
interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendIsUp?: boolean;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  trend,
  trendIsUp = true,
  className = '',
}) => (
  <div className={`bg-zinc-50 border border-zinc-100 p-6 rounded-3xl shadow-sm ${className}`}>
    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mono mb-1">
      {label}
    </p>
    <div className="flex items-baseline gap-3">
      <span className="text-4xl font-black text-gray-900 tracking-tighter">{value}</span>
      {trend && (
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            trendIsUp ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
          }`}
        >
          {trend}
        </span>
      )}
    </div>
  </div>
);

// ============ Navigation Button Component ============
interface NavButtonProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
}

export const NavButton: React.FC<NavButtonProps> = ({
  title,
  description,
  icon,
  onClick,
  href,
  className = '',
}) => {
  const content = (
    <div className="flex flex-col text-left">
      <span className="text-xl font-black text-gray-900 group-hover:text-red-600 transition-colors uppercase italic tracking-tighter">
        {title}
      </span>
      <span className="text-[10px] text-zinc-400 mono uppercase tracking-widest mt-1">
        {description}
      </span>
    </div>
  );

  const commonClass = `flex-1 group relative flex items-center p-8 bg-zinc-50 border border-zinc-200 rounded-[32px] transition-all hover:bg-white hover:border-red-500 hover:shadow-2xl hover:scale-[1.02] overflow-hidden ${className}`;

  if (href) {
    return (
      <a href={href} className={commonClass}>
        {content}
        {icon && (
          <div className="ml-auto text-zinc-300 group-hover:text-red-500 group-hover:translate-x-1 transition-all">
            {icon}
          </div>
        )}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={commonClass}>
      {content}
      {icon && (
        <div className="ml-auto text-zinc-300 group-hover:text-red-500 group-hover:translate-x-1 transition-all">
          {icon}
        </div>
      )}
    </button>
  );
};

// ============ Status Badge Component ============
interface StatusBadgeProps {
  text: string;
  variant?: 'success' | 'warning' | 'error' | 'info';
  animated?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  text,
  variant = 'info',
  animated = false,
}) => {
  const variantClasses = {
    success: 'bg-green-50 text-green-600 border-green-100',
    warning: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    error: 'bg-red-50 text-red-600 border-red-100',
    info: 'bg-blue-50 text-blue-600 border-blue-100',
  };

  return (
    <span
      className={`text-[10px] text-red-600 font-bold px-3 py-1 rounded-full border border-red-100 ${animated ? 'animate-pulse' : ''} ${variantClasses[variant]}`}
    >
      {text}
    </span>
  );
};

// ============ Section Header Component ============
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actions,
  className = '',
}) => (
  <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 pb-8 ${className}`}>
    <div>
      <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">
        {title}
      </h2>
      {subtitle && (
        <p className="text-zinc-400 mono text-xs mt-1 uppercase tracking-widest">{subtitle}</p>
      )}
    </div>
    {actions && <div className="flex items-center gap-4">{actions}</div>}
  </div>
);

// ============ Modal Overlay Component ============
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    full: 'inset-0',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`bg-white rounded-2xl shadow-2xl ${sizeClasses[size]} p-6 animate-in fade-in zoom-in-95`}>
        {title && <h3 className="text-lg font-bold mb-4">{title}</h3>}
        {children}
      </div>
    </div>
  );
};
