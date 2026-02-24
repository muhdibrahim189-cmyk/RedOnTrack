/**
 * Camera Monitoring Page - Refactored
 * Clean separation of business logic (hooks/services) and UI rendering
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import CCTVFeed from '../components/CCTVFeed';
import { SectionHeader } from '../components/UIComponents';
import { useCameraManagement, useCurrentTime } from '../hooks';
import { INITIAL_CAMERA_FEEDS, BRANDING } from '../constants';

const CameraMonitoring: React.FC = () => {
  const { cameras, moveCameraUp, moveCameraDown, fullscreenIndex, setFullscreenIndex, currentFullscreenCamera } =
    useCameraManagement(INITIAL_CAMERA_FEEDS);
  const { currentTime } = useCurrentTime();
  const [showFlash, setShowFlash] = useState(false);
  const navigate = useNavigate();

  const handleCapture = () => {
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 200);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        logoUrl={BRANDING.logoUrl}
        brandName="RedOn|Track"
        accentColor={BRANDING.accentColor}
      />

      <main className="p-8 max-w-7xl mx-auto space-y-12">
        <SectionHeader
          title="Monitoring Cluster"
          subtitle="Multi-Stream Visual Telemetry // Hub-09"
          actions={
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-zinc-500 hover:text-red-600 transition-colors mono text-xs uppercase font-black"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Return to Terminal
            </button>
          }
        />

        {/* 4-Camera Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cameras.map((feed, idx) => (
            <div
              key={feed.id}
              className="animate-in fade-in zoom-in-95 duration-500"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <CCTVFeed feed={feed} onClick={() => setFullscreenIndex(idx)} />
            </div>
          ))}
        </section>

        {/* Device Management Section */}
        <section className="bg-zinc-50 rounded-[40px] border border-zinc-200 p-10 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">
                Device Inventory
              </h3>
              <p className="text-[10px] text-zinc-400 mono uppercase tracking-widest">
                Hardware Configuration & Layout Control
              </p>
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
                {cameras.map((feed, idx) => (
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
                          onClick={() => moveCameraUp(idx)}
                          disabled={idx === 0}
                          className="p-1.5 rounded-lg border border-zinc-200 hover:bg-white hover:text-red-600 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-zinc-400 transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => moveCameraDown(idx)}
                          disabled={idx === cameras.length - 1}
                          className="p-1.5 rounded-lg border border-zinc-200 hover:bg-white hover:text-red-600 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-zinc-400 transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
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

      {/* Fullscreen Modal */}
      {fullscreenIndex !== null && currentFullscreenCamera && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-2 sm:p-6 overflow-hidden">
          {showFlash && <div className="absolute inset-0 bg-white z-[60] opacity-80" />}

          <button
            onClick={() => setFullscreenIndex(null)}
            className="absolute top-4 right-4 z-[101] p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative w-full h-full flex items-center justify-center">
            <CCTVFeed feed={currentFullscreenCamera} />
          </div>

          <div className="absolute bottom-4 left-4 z-[101] flex gap-4">
            <button
              onClick={handleCapture}
              className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl backdrop-blur-md transition-all"
            >
              📸 Snapshot
            </button>
            <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all">
              ⏺️ Record
            </button>
          </div>

          <div className="absolute bottom-4 right-4 z-[101] text-white/70 text-sm font-mono">
            {currentTime}
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraMonitoring;
