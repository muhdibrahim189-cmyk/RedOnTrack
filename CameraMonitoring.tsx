
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import CCTVFeed from '../components/CCTVFeed';
import { CameraFeed } from '../types';

const INITIAL_FEEDS: CameraFeed[] = [
  { id: '1', name: 'Platform 1', location: 'TERMINAL NORTH', status: 'active', lastUpdate: 'NOW' },
  { id: '2', name: 'Platform 2', location: 'TERMINAL SOUTH', status: 'active', lastUpdate: 'NOW' },
  { id: '3', name: 'Platform 3', location: 'WEST WING', status: 'active', lastUpdate: 'NOW' },
  { id: '4', name: 'Platform 4', location: 'EAST CROSSING', status: 'active', lastUpdate: 'NOW' },
];

const CameraMonitoring: React.FC = () => {
  const [feeds, setFeeds] = useState<CameraFeed[]>(INITIAL_FEEDS);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCapture = () => {
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 200);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newFeeds = [...feeds];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newFeeds.length) {
      [newFeeds[index], newFeeds[targetIndex]] = [newFeeds[targetIndex], newFeeds[index]];
      setFeeds(newFeeds);
    }
  };

  const currentFeed = fullscreenIndex !== null ? feeds[fullscreenIndex] : null;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="p-8 max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 pb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Monitoring Cluster</h2>
            <p className="text-zinc-400 mono text-xs mt-1 uppercase tracking-widest">Multi-Stream Visual Telemetry // Hub-09</p>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-zinc-500 hover:text-red-600 transition-colors mono text-xs uppercase font-black"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Return to Terminal
          </button>
        </header>

        {/* 4-Camera Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {feeds.map((feed, idx) => (
            <div key={feed.id} className="animate-in fade-in zoom-in-95 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
              <CCTVFeed 
                feed={feed} 
                onClick={() => setFullscreenIndex(idx)}
              />
            </div>
          ))}
        </section>

        {/* Device Management Section */}
        <section className="bg-zinc-50 rounded-[40px] border border-zinc-200 p-10 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">Device Inventory</h3>
              <p className="text-[10px] text-zinc-400 mono uppercase tracking-widest">Hardware Configuration & Layout Control</p>
            </div>
            <button className="px-6 py-2 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-lg shadow-gray-900/10">
              Refresh Bus
            </button>
          </div>

          <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100 text-zinc-400 mono text-[9px] uppercase tracking-widest">
                  <th className="px-8 py-4">Node ID</th>
                  <th className="px-8 py-4">Designation</th>
                  <th className="px-8 py-4">Stream Status</th>
                  <th className="px-8 py-4">Arrangement</th>
                  <th className="px-8 py-4 text-right">Settings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {feeds.map((feed, idx) => (
                  <tr key={feed.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <span className="text-xs font-black text-zinc-300 mono">NODE-00{feed.id}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-900">{feed.name}</span>
                        <span className="text-[10px] text-zinc-400 mono uppercase">{feed.location}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-gray-600 uppercase mono">UHD_LINK_OK</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => moveItem(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1.5 rounded-lg border border-zinc-200 hover:bg-white hover:text-red-600 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-zinc-400 transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                        </button>
                        <button 
                          onClick={() => moveItem(idx, 'down')}
                          disabled={idx === feeds.length - 1}
                          className="p-1.5 rounded-lg border border-zinc-200 hover:bg-white hover:text-red-600 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-zinc-400 transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="text-[10px] font-black text-zinc-400 hover:text-gray-900 uppercase mono underline underline-offset-4">
                        Edit Params
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Expanded Fullscreen Modal */}
      {fullscreenIndex !== null && currentFeed && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-2 sm:p-6 overflow-hidden">
          {showFlash && <div className="absolute inset-0 bg-white z-[60] opacity-80" />}
          
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/90 to-transparent flex items-center justify-between px-8 z-50">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-white font-black tracking-tighter italic text-2xl">
                  RedOn<span className="text-red-600">Track</span>
                </span>
                <span className="text-[10px] text-zinc-500 mono uppercase tracking-[0.3em] leading-none">
                  SECURE_SURVEILLANCE_CHANNEL // {currentFeed.name}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-white/40 text-[9px] font-black uppercase tracking-widest mono">Node Status</span>
                <span className="text-green-500 text-[10px] font-bold mono uppercase">Streaming_UHD_4K</span>
              </div>
              <span className="text-white mono font-bold text-base tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/10">{currentTime}</span>
              <button 
                onClick={() => setFullscreenIndex(null)} 
                className="w-12 h-12 flex items-center justify-center text-white/60 hover:text-white bg-white/5 rounded-full hover:bg-red-600 transition-all border border-white/10"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>

          <div className="relative w-full max-w-[95vw] max-h-[85vh] aspect-video rounded-[40px] overflow-hidden border border-white/10 shadow-[0_0_150px_rgba(0,0,0,0.8)] transition-all duration-500">
            <img 
              src={`https://picsum.photos/seed/railway-${currentFeed.id}/1920/1080?grayscale`} 
              alt={currentFeed.name}
              className="w-full h-full object-cover"
            />
            
            {/* HUD Overlays within the bigger screen */}
            <div className="absolute inset-0 pointer-events-none border-[1px] border-white/5" />
            
            {isRecording && (
              <div className="absolute top-10 left-10 flex items-center gap-4 bg-black/60 px-8 py-4 rounded-3xl border border-red-500/40 backdrop-blur-2xl">
                <div className="w-4 h-4 bg-red-600 rounded-full animate-pulse shadow-[0_0_20px_rgba(220,38,38,1)]" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-white mono uppercase tracking-[0.2em]">REC_SURVEILLANCE_MODE</span>
                  <span className="text-[8px] text-red-400 mono uppercase tracking-widest">Storage: NAS-CL-04</span>
                </div>
              </div>
            )}
            
            <div className="absolute bottom-10 left-10 flex flex-col gap-1 drop-shadow-2xl">
              <span className="text-white/50 text-[11px] font-black uppercase tracking-[0.5em] mono">Source Location identifier</span>
              <span className="text-white font-black text-4xl tracking-tighter italic uppercase drop-shadow-lg">{currentFeed.location}</span>
            </div>

            <div className="absolute top-10 right-10 flex flex-col items-end gap-2">
               <span className="bg-red-600/90 text-white text-[9px] font-black px-4 py-1.5 rounded-full mono tracking-widest border border-red-400/30">CHANNEL_{currentFeed.id}</span>
               <span className="bg-black/40 text-white/60 text-[8px] font-black px-4 py-1.5 rounded-full mono tracking-widest border border-white/10 backdrop-blur-md">LATENCY: 12ms</span>
            </div>
          </div>

          <div className="absolute bottom-10 flex items-center gap-8 z-50">
            <button 
              onClick={handleCapture} 
              className="flex flex-col items-center gap-3 p-8 bg-zinc-900/90 border border-white/10 rounded-[32px] hover:bg-zinc-800 transition-all hover:scale-105 group backdrop-blur-xl shadow-2xl"
            >
              <svg className="w-10 h-10 text-white group-hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
              <span className="text-[11px] font-black text-zinc-400 uppercase mono tracking-[0.2em]">Snapshot</span>
            </button>
            
            <button 
              onClick={() => setIsRecording(!isRecording)} 
              className={`flex flex-col items-center gap-3 p-10 border rounded-[40px] transition-all hover:scale-110 group backdrop-blur-2xl shadow-2xl ${isRecording ? 'bg-red-600 border-red-500 shadow-red-600/40' : 'bg-zinc-900/90 border-white/10'}`}
            >
              <svg className={`w-12 h-12 ${isRecording ? 'text-white' : 'text-red-500'}`} fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /></svg>
              <span className={`text-[12px] font-black uppercase mono tracking-[0.3em] ${isRecording ? 'text-white' : 'text-zinc-400'}`}>{isRecording ? 'ACTIVE_REC' : 'INIT_RECORD'}</span>
            </button>
            
            <button 
              onClick={() => setFullscreenIndex((fullscreenIndex + 1) % feeds.length)} 
              className="flex flex-col items-center gap-3 p-8 bg-zinc-900/90 border border-white/10 rounded-[32px] hover:bg-zinc-800 transition-all hover:scale-105 group backdrop-blur-xl shadow-2xl"
            >
              <svg className="w-10 h-10 text-white group-hover:text-red-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              <span className="text-[11px] font-black text-zinc-400 uppercase mono tracking-[0.2em]">Switch Stream</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraMonitoring;
