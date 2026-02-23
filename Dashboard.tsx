
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CCTVFeed from '../components/CCTVFeed';
import Header from '../components/Header';
import { CameraFeed } from '../types';

const MAIN_FEED: CameraFeed = { 
  id: '1', 
  name: 'Platform 1 (MAIN)', 
  location: 'TERMINAL NORTH', 
  status: 'active', 
  lastUpdate: 'NOW' 
};

const Dashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Adjusted configuration for better separation
  const START_TOP = 32; // Balanced height
  const END_TOP = 32;   // Ends at center of 64px header
  const SCROLL_RANGE = 300;

  const progress = Math.min(scrollY / SCROLL_RANGE, 1);
  const inverseProgress = 1 - progress;
  const floatingOpacity = progress > 0.9 ? Math.max(0, 1 - (progress - 0.9) * 10) : 1;
  const logoUrl = "https://lh3.googleusercontent.com/d/1UyQIXBXstj80Wc6llsBbE4NWK0rqMjaf";

  return (
    <div className="min-h-[120vh] bg-white relative">
      <Header hideBranding={progress < 0.98} />
      
      {/* Floating Logo with Adjusted Separation */}
      <div 
        className="fixed z-[45] pointer-events-none"
        style={{
          top: `calc(${START_TOP}% - (${progress} * (${START_TOP}% - ${END_TOP}px)))`,
          left: `calc(50% - (${progress} * (50% - 130px)))`,
          transform: `translate(-50%, -50%) scale(${1 - (progress * 0.75)})`,
          opacity: floatingOpacity,
          transition: 'opacity 0.1s ease-out'
        }}
      >
        <div className={`flex ${progress > 0.7 ? 'flex-row' : 'flex-col'} items-center gap-6 transition-all duration-300`}>
          <div className="relative group">
            <div className="absolute -inset-4 bg-red-600/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative">
              <div className="w-40 h-40 md:w-44 md:h-44 flex items-center justify-center p-4 rounded-[36px] bg-white border border-zinc-100 shadow-2xl shadow-red-900/10">
                  <img 
                    src={logoUrl} 
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
            <p className="text-[10px] font-bold tracking-[0.4em] text-zinc-400 uppercase mono mt-2" style={{ opacity: inverseProgress }}>
              Next-Gen Railway Intelligence
            </p>
          </div>
        </div>
      </div>

      <main className="w-full flex flex-col items-center px-4 space-y-12">
        {/* Adjusted content gap back to 320px for a tighter, more cohesive look */}
        <div className="h-[320px] w-full" />

        {/* Single Main CCTV Feed */}
        <div className="w-full max-w-4xl px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.4em] mono">Primary Surveillance Node</h3>
            <div className="flex items-center gap-4">
               <span className="text-[10px] text-red-600 font-bold bg-red-50 px-3 py-1 rounded-full border border-red-100 animate-pulse uppercase tracking-widest">System Nominal</span>
            </div>
          </div>
          <CCTVFeed 
            feed={MAIN_FEED} 
            onClick={() => navigate('/monitoring')}
          />
          <p className="mt-4 text-center text-[10px] text-zinc-400 mono uppercase tracking-widest">Click main feed to access full monitoring cluster</p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-3xl px-4 pt-4">
          <Link 
            to="/analysis"
            className="flex-1 group relative flex items-center p-8 bg-zinc-50 border border-zinc-200 rounded-[32px] transition-all hover:bg-white hover:border-red-500 hover:shadow-2xl hover:scale-[1.02] overflow-hidden"
          >
            <div className="flex flex-col text-left">
              <span className="text-xl font-black text-gray-900 group-hover:text-red-600 transition-colors uppercase italic tracking-tighter">Accident Analysis</span>
              <span className="text-[10px] text-zinc-400 mono uppercase tracking-widest mt-1">AI Forensic Suite</span>
            </div>
            <div className="ml-auto text-zinc-300 group-hover:text-red-500 group-hover:translate-x-1 transition-all">
               <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
               </svg>
            </div>
          </Link>

          <Link 
            to="/catalog"
            className="flex-1 group relative flex items-center p-8 bg-zinc-50 border border-zinc-200 rounded-[32px] transition-all hover:bg-white hover:border-gray-900 hover:shadow-2xl hover:scale-[1.02] overflow-hidden"
          >
            <div className="flex flex-col text-left">
              <span className="text-xl font-black text-gray-900 group-hover:text-gray-900 transition-colors uppercase italic tracking-tighter">Raw Data Catalog</span>
              <span className="text-[10px] text-zinc-400 mono uppercase tracking-widest mt-1">Archived Telemetry</span>
            </div>
            <div className="ml-auto text-zinc-300 group-hover:text-gray-900 group-hover:translate-x-1 transition-all">
               <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
               </svg>
            </div>
          </Link>
        </div>

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
          <div className="flex items-center gap-2 font-bold text-gray-900">LOCAL TIME: {currentTime}</div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
