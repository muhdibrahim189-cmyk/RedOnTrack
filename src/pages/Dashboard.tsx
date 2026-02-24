/**
 * Dashboard Page - Refactored
 * Demonstrates clean separation: business logic in services/hooks, UI in components
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import CCTVFeed from '../components/CCTVFeed';
import { NavButton, StatusBadge } from '../components/UIComponents';
import { useCurrentTime } from '../hooks';
import { MAIN_FEED, BRANDING } from '../constants';

const Dashboard: React.FC = () => {
  const { currentTime } = useCurrentTime();
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll animation calculations
  const START_TOP = 32;
  const END_TOP = 32;
  const SCROLL_RANGE = 300;

  const progress = Math.min(scrollY / SCROLL_RANGE, 1);
  const inverseProgress = 1 - progress;
  const floatingOpacity = progress > 0.9 ? Math.max(0, 1 - (progress - 0.9) * 10) : 1;

  const ArrowIcon = (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );

  return (
    <div className="min-h-[120vh] bg-white relative">
      <Header
        hideBranding={progress < 0.98}
        logoUrl={BRANDING.logoUrl}
        brandName="RedOn|Track"
        accentColor={BRANDING.accentColor}
      />

      {/* Floating Logo with Animation */}
      <div
        className="fixed z-[45] pointer-events-none"
        style={{
          top: `calc(${START_TOP}% - (${progress} * (${START_TOP}% - ${END_TOP}px)))`,
          left: `calc(50% - (${progress} * (50% - 130px)))`,
          transform: `translate(-50%, -50%) scale(${1 - progress * 0.75})`,
          opacity: floatingOpacity,
          transition: 'opacity 0.1s ease-out',
        }}
      >
        <div
          className={`flex ${progress > 0.7 ? 'flex-row' : 'flex-col'} items-center gap-6 transition-all duration-300`}
        >
          <div className="relative group">
            <div className="absolute -inset-4 bg-red-600/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative">
              <div className="w-40 h-40 md:w-44 md:h-44 flex items-center justify-center p-4 rounded-[36px] bg-white border border-zinc-100 shadow-2xl shadow-red-900/10">
                <img
                  src={BRANDING.logoUrl}
                  alt="RedOnTrack Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          <div className={`text-center transition-all ${progress > 0.7 ? 'text-left' : 'text-center'}`}>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 uppercase italic leading-none">
              RedOn<span className="text-red-600">Track</span>
            </h1>
            <p
              className="text-[10px] font-bold tracking-[0.4em] text-zinc-400 uppercase mono mt-2"
              style={{ opacity: inverseProgress }}
            >
              {BRANDING.tagline}
            </p>
          </div>
        </div>
      </div>

      <main className="w-full flex flex-col items-center px-4 space-y-12">
        <div className="h-[320px] w-full" />

        {/* Primary Feed */}
        <div className="w-full max-w-4xl px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.4em] mono">
              Primary Surveillance Node
            </h3>
            <div className="flex items-center gap-4">
              <StatusBadge text="System Nominal" variant="success" animated />
            </div>
          </div>
          <CCTVFeed feed={MAIN_FEED} onClick={() => navigate('/monitoring')} />
          <p className="mt-4 text-center text-[10px] text-zinc-400 mono uppercase tracking-widest">
            Click main feed to access full monitoring cluster
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-3xl px-4 pt-4">
          <NavButton
            href="/analysis"
            title="Accident Analysis"
            description="AI Forensic Suite"
            icon={ArrowIcon}
          />
          <NavButton
            href="/catalog"
            title="Raw Data Catalog"
            description="Archived Telemetry"
            icon={ArrowIcon}
            className="hover:border-gray-900 hover:text-gray-900"
          />
        </div>

        {/* Status Bar */}
        <div className="flex flex-wrap justify-center items-center gap-6 py-6 px-12 rounded-full bg-zinc-50 border border-zinc-200 mono text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-12">
          <Link to="/history" className="flex items-center gap-3 hover:text-red-600 transition-colors group">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse group-hover:scale-150 transition-transform"></span>
            LOGIN HISTORY
          </Link>
          <div className="w-px h-4 bg-zinc-300" />
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            NETWORK: ENCRYPTED
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            STATION: HUB-09
          </div>
          <div className="hidden sm:block w-px h-4 bg-zinc-300" />
          <div className="flex items-center gap-2 font-bold text-gray-900">
            LOCAL TIME: {currentTime}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
