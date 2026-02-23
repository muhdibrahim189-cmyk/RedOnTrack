
import React, { useState, useEffect } from 'react';
import { CameraFeed } from '../types';

interface CCTVFeedProps {
  feed: CameraFeed;
  onClick?: () => void;
}

const CCTVFeed: React.FC<CCTVFeedProps> = ({ feed, onClick }) => {
  const [timestamp, setTimestamp] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimestamp(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'offline': return 'bg-zinc-700';
      default: return 'bg-zinc-500';
    }
  };

  return (
    <div 
      onClick={onClick}
      className="relative group overflow-hidden rounded-xl border border-white/5 bg-zinc-950 aspect-video shadow-2xl transition-all hover:border-red-500/30 cursor-pointer"
    >
      {/* Simulation Overlay */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/40 backdrop-blur-md px-2 py-1 rounded">
        <div className={`w-2 h-2 rounded-full animate-pulse ${getStatusColor(feed.status)}`} />
        <span className="text-[10px] font-bold tracking-widest text-white/90 uppercase mono">
          {feed.name} // {feed.location}
        </span>
      </div>
      
      <div className="absolute top-4 right-4 z-10 bg-black/40 backdrop-blur-md px-2 py-1 rounded">
        <span className="text-[10px] font-bold tracking-widest text-white/90 mono">
          {timestamp}
        </span>
      </div>

      <div className="absolute bottom-4 left-4 z-10 flex gap-2">
        <span className="bg-black/80 px-2 py-1 rounded text-[8px] font-bold text-white mono border border-white/10">
          UHD 4K
        </span>
        <span className="bg-red-600/80 px-2 py-1 rounded text-[8px] font-bold text-white mono flex items-center gap-1 border border-red-500/20">
          <div className="w-1 h-1 bg-white rounded-full animate-ping" />
          LIVE
        </span>
      </div>

      {/* Mock Railway Image */}
      <img 
        src={`https://picsum.photos/seed/railway-${feed.id}/1280/720?grayscale`} 
        alt={feed.name}
        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 scale-105 group-hover:scale-100"
      />
      
      {/* HUD/Grid Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />
      <div className="absolute inset-0 border-[0.5px] border-white/5 pointer-events-none group-hover:border-red-500/20" />
      
      {/* Hover expansion indicator */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-full border border-white/20">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CCTVFeed;
