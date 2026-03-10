/**
 * Camera Monitoring Page - Refactored
 * Clean separation of business logic (hooks/services) and UI rendering
 */

import React, { useState, useEffect } from 'react';
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
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const navigate = useNavigate();

  // Recording timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleCapture = () => {
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 200);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (fullscreenIndex !== null) {
      setFullscreenIndex((fullscreenIndex + 1) % cameras.length);
    }
  };

  const handlePrev = () => {
    if (fullscreenIndex !== null) {
      setFullscreenIndex((fullscreenIndex - 1 + cameras.length) % cameras.length);
    }
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

          {/* Close Button */}
          <button
            onClick={() => { setFullscreenIndex(null); setIsRecording(false); }}
            className="absolute top-4 right-4 z-[101] p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation Controls */}
          <button
            onClick={handlePrev}
            className="absolute left-4 z-[101] p-4 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white backdrop-blur-md border border-white/10 group"
          >
            <svg className="w-8 h-8 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 z-[101] p-4 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white backdrop-blur-md border border-white/10 group"
          >
            <svg className="w-8 h-8 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="relative w-full h-full flex items-center justify-center">
            <CCTVFeed feed={currentFullscreenCamera} />
            
            {/* Recording Overlay */}
            {isRecording && (
              <div className="absolute top-8 left-8 flex items-center gap-3 bg-red-600/20 backdrop-blur-md px-4 py-2 rounded-full border border-red-500/30 animate-pulse">
                <div className="w-3 h-3 rounded-full bg-red-600" />
                <span className="text-xs font-black text-white mono uppercase tracking-widest">
                  REC // {formatTime(recordingTime)}
                </span>
              </div>
            )}
          </div>

          <div className="absolute bottom-8 left-8 z-[101] flex gap-4">
            <button
              onClick={handleCapture}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl backdrop-blur-md border border-white/10 transition-all flex items-center gap-3"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Snapshot
            </button>
            <button 
              onClick={toggleRecording}
              className={`px-8 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all flex items-center gap-3 shadow-2xl ${
                isRecording 
                  ? 'bg-red-600 text-white shadow-red-600/40 animate-pulse' 
                  : 'bg-white text-gray-900 hover:bg-zinc-100'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-white' : 'bg-red-600'}`} />
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
          </div>

          <div className="absolute bottom-8 right-8 z-[101] flex flex-col items-end gap-1">
            <p className="text-white text-lg font-black italic uppercase tracking-tighter leading-none">
              {currentFullscreenCamera.name}
            </p>
            <p className="text-zinc-400 text-[10px] font-bold uppercase mono tracking-widest">
              {currentTime} // UHD_TRANS_ACTIVE
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraMonitoring;
