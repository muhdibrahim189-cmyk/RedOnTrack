/**
 * Header Component - Refactored following SOLID principles
 * Presentational component with minimal logic
 * Interface Segregation - props are well-separated
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  hideBranding?: boolean;
  logoUrl: string;
  brandName: string;
  accentColor?: string;
  showNotification?: boolean;
  userRole?: string;
  onSignOut?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  hideBranding = false,
  logoUrl,
  brandName,
  accentColor = 'red-600',
  showNotification = true,
  userRole = 'Administrator',
  onSignOut,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    setIsMenuOpen(false);
    onSignOut?.();
    navigate('/login');
  };

  return (
    <header className="w-full h-16 border-b border-zinc-100 flex items-center justify-between px-8 bg-white sticky top-0 z-40 transition-colors">
      <Link
        to="/"
        className={`flex items-center gap-3 transition-all duration-300 ${
          hideBranding ? 'opacity-0 pointer-events-none -translate-x-4' : 'opacity-100'
        }`}
      >
        <div className="w-8 h-8 rounded flex items-center justify-center overflow-hidden">
          <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
        </div>
        <span className="font-black tracking-tighter text-gray-900 uppercase italic text-xl">
          {brandName.split('|')[0]}
          <span className={`text-${accentColor}`}>{brandName.split('|')[1]}</span>
        </span>
      </Link>

      <div className="flex items-center gap-4 relative" ref={menuRef}>
        {/* Notification Icon */}
        {showNotification && (
          <button className="p-2 text-zinc-400 hover:text-red-600 transition-colors relative group">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border-2 border-white"></span>
          </button>
        )}

        {/* User Profile Button */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex items-center gap-2 p-1 pl-3 rounded-full border transition-all ${
              isMenuOpen
                ? 'border-red-500 bg-red-50'
                : 'border-zinc-200 hover:border-red-200 hover:bg-red-50'
            }`}
          >
            <span className="text-xs font-bold text-gray-700">Station Manager</span>
            <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 overflow-hidden border border-zinc-200">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-zinc-100 rounded-xl shadow-2xl shadow-zinc-200/50 py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 border-b border-zinc-50 mb-1">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mono">
                  Access Level
                </p>
                <p className="text-xs font-black text-gray-900">{userRole}</p>
              </div>

              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                Profile
              </button>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-600 hover:text-white transition-all"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
