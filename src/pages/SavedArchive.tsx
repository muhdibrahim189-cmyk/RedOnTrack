import React from 'react';
import { Link } from 'react-router-dom';
import { Header, Modal, SectionHeader } from '../components';
import { useAccidentFolders, useAIAnalysis } from '../hooks';
import { INITIAL_MOCK_FOLDERS, BRANDING } from '../constants';

const SavedArchive: React.FC = () => {
  const {
    getSavedFolders,
    toggleSave,
    updateRemarks,
  } = useAccidentFolders(INITIAL_MOCK_FOLDERS);
  
  const folders = getSavedFolders();
  const { analyzing, aiResult, performAnalysis, clearResult } = useAIAnalysis();

  return (
    <div className="min-h-screen bg-white">
      <Header 
        logoUrl={BRANDING.logoUrl}
        brandName="RedOn|Track"
      />
      <div className="p-8 max-w-6xl mx-auto space-y-12">
        <SectionHeader 
          title="Secure Saved Archive"
          subtitle="Restricted Access • Forensic Data Vault"
          actions={
            <Link 
              to="/analysis"
              className="px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-zinc-200 hover:border-red-600 hover:text-red-600 transition-all flex items-center gap-3"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Analysis
            </Link>
          }
        />

        <div className="grid grid-cols-1 gap-6">
          {folders.length > 0 ? folders.map((folder) => (
            <div key={folder.id} className="bg-white border border-zinc-100 rounded-[32px] overflow-hidden hover:shadow-2xl hover:shadow-zinc-200/50 transition-all group">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-80 bg-zinc-50 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-100">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg bg-red-600 text-white shadow-red-600/20">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z" />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-zinc-400 mono uppercase tracking-widest">Event ID</span>
                      <span className="text-sm font-black text-gray-900 mono">{folder.id}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-5 bg-white rounded-2xl border border-zinc-200/50 shadow-sm">
                      <p className="text-[9px] font-black text-zinc-400 mono uppercase mb-2 tracking-widest">System Filename</p>
                      <p className="text-[11px] font-black text-gray-900 mono break-all leading-relaxed bg-zinc-50 p-2 rounded-lg border border-zinc-100">
                        {folder.date}_{folder.day.substring(0,3)}_{folder.time.replace(':', '')}_{folder.platform.replace(' ', '')}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button 
                      onClick={() => toggleSave(folder.id)}
                      className="w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-3"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      Remove from Archive
                    </button>
                  </div>
                </div>

                <div className="flex-1 p-8 md:p-10 space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <h4 className="text-[11px] font-black text-zinc-900 uppercase tracking-widest mono">Police Investigation Log</h4>
                      <div className="flex gap-2">
                        {folder.cameras.map(cam => (
                          <span key={cam} className="text-[9px] font-black text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100 mono">{cam}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative group/remarks">
                    <textarea 
                      value={folder.remarks}
                      onChange={(e) => updateRemarks(folder.id, e.target.value)}
                      placeholder="Log detailed remarks..."
                      className="w-full h-40 p-8 text-sm bg-zinc-50 border border-zinc-200 rounded-[32px] outline-none focus:ring-8 focus:ring-red-500/5 focus:bg-white focus:border-red-200 transition-all text-gray-700 font-medium leading-relaxed resize-none shadow-inner"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-zinc-100">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mono italic">
                        Legally archived record #RT-{folder.id}-V2
                      </p>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                      <button className="flex-1 sm:flex-none px-6 py-3 rounded-2xl border border-zinc-200 text-zinc-500 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50">
                        Export Data
                      </button>
                      <button 
                        onClick={() => performAnalysis(folder)}
                        disabled={analyzing}
                        className="flex-1 sm:flex-none px-8 py-3 rounded-2xl bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-gray-900/10 group"
                      >
                        {analyzing ? (
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                          <svg className="w-4 h-4 text-red-500 group-hover:scale-125 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        )}
                        AI Forensic Suite
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="bg-zinc-50 border-4 border-dashed border-zinc-200 rounded-[48px] p-24 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <h4 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">Archive Empty</h4>
              <p className="text-xs text-zinc-400 mono mt-2 uppercase tracking-widest">No footage folders have been saved to the secure archive yet.</p>
              <Link 
                to="/analysis" 
                className="mt-8 text-[11px] font-black text-red-600 underline underline-offset-4 uppercase tracking-widest hover:text-red-800 transition-all"
              >
                Go to Analysis
              </Link>
            </div>
          )}
        </div>

        {/* AI Analysis Result Modal */}
        <Modal 
          isOpen={!!aiResult} 
          onClose={clearResult}
          title="Forensic Insights"
          size="lg"
        >
          <div className="space-y-6">
            <p className="text-[11px] text-red-600 font-black mono uppercase tracking-widest">AI Safety Engine v4.2.1-Flash</p>
            <div className="max-h-[60vh] overflow-y-auto">
              <div className="text-gray-700 font-medium text-base leading-relaxed whitespace-pre-wrap mono bg-zinc-50 p-6 rounded-[24px] border border-zinc-200 shadow-inner">
                {aiResult}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-4">
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest italic text-center sm:text-left">
                This report is AI-generated for advisory use only.
              </p>
              <button 
                onClick={clearResult}
                className="w-full sm:w-auto bg-red-600 text-white px-8 py-4 rounded-[20px] text-[11px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-2xl shadow-red-600/30 active:scale-95"
              >
                Confirm & Log Report
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default SavedArchive;
