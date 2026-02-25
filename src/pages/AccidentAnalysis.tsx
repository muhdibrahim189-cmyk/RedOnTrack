import React from 'react';
import { Link } from 'react-router-dom';
import { Header, StatCard, SectionHeader, Modal } from '../components';
import { 
  useAccidentAnalytics, 
  useAccidentFolders, 
  useFootageFolderFilter, 
  useAIAnalysis 
} from '../hooks';
import { INITIAL_MOCK_FOLDERS, BRANDING } from '../constants';

const AccidentAnalysis: React.FC = () => {
  const {
    period,
    setPeriod,
    dimension,
    setDimension,
    weekOffset,
    setWeekOffset,
    selectedFilter,
    setSelectedFilter,
    currentStats,
    totalCases,
    maxValue,
    dateRangeLabel,
    trendPercentage,
    isTrendUp,
  } = useAccidentAnalytics();

  const {
    folders,
    updateRemarks,
    toggleSave,
  } = useAccidentFolders(INITIAL_MOCK_FOLDERS);

  const { filteredFolders } = useFootageFolderFilter(folders, selectedFilter, dimension);
  const { analyzing, aiResult, performAnalysis, clearResult } = useAIAnalysis();

  return (
    <div className="min-h-screen bg-white">
      <Header 
        logoUrl={BRANDING.logoUrl}
        brandName="RedOn|Track"
        accentColor={BRANDING.accentColor}
      />
      
      <div className="p-8 max-w-6xl mx-auto space-y-12">
        {/* Metric Overview */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            label={`Total Cases (${period})`}
            value={totalCases}
            trend={`${trendPercentage} vs Prev.`}
            trendIsUp={isTrendUp}
          />
          <StatCard 
            label="Critical Time Slot"
            value="18:00 - 00:00"
          />
          <StatCard 
            label="Investigation Status"
            value="84% Resolved"
          />
        </section>

        {/* Analytics Section */}
        <div className="bg-white rounded-3xl p-8 border border-zinc-100 shadow-md">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-6">
            <div>
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Risk Analysis Terminal</h3>
              <p className="text-[10px] text-zinc-400 mono uppercase tracking-widest">Interactive Heuristics • {period === 'weekly' ? 'Week View' : 'Month View'}</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200">
                <button 
                  onClick={() => { setPeriod('weekly'); setSelectedFilter(null); }}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${period === 'weekly' ? 'bg-white text-gray-900 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                  Weekly
                </button>
                <button 
                  onClick={() => { setPeriod('monthly'); setSelectedFilter(null); }}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${period === 'monthly' ? 'bg-white text-gray-900 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                  Monthly
                </button>
              </div>

              <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200">
                <button 
                  onClick={() => { setDimension('day'); setSelectedFilter(null); }}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${dimension === 'day' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                  By Day
                </button>
                <button 
                  onClick={() => { setDimension('time'); setSelectedFilter(null); }}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${dimension === 'time' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                  By Time
                </button>
              </div>

              {selectedFilter && (
                <button 
                  onClick={() => setSelectedFilter(null)}
                  className="text-[10px] font-black text-red-600 bg-red-50 border border-red-100 px-4 py-1.5 rounded-lg hover:bg-red-100 transition-all"
                >
                  Reset Filter: {selectedFilter}
                </button>
              )}
            </div>
          </div>

          {/* Date Range and Pagination Controls */}
          {period === 'weekly' && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 pb-6 border-b border-zinc-50">
              <button 
                onClick={() => setWeekOffset(Math.min(3, weekOffset + 1))}
                disabled={weekOffset === 3}
                className={`p-2 rounded-xl border transition-all ${weekOffset === 3 ? 'opacity-20 cursor-not-allowed border-zinc-100' : 'border-zinc-200 hover:bg-zinc-50 hover:border-red-600 text-zinc-500 hover:text-red-600'}`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black text-zinc-400 mono uppercase tracking-[0.2em] mb-1">
                  {weekOffset === 0 ? 'Current Statistics' : `Historical Week -${weekOffset}`}
                </span>
                <span className="text-sm font-black text-gray-900 mono px-6 py-2 bg-zinc-50 rounded-full border border-zinc-100">
                  {dateRangeLabel}
                </span>
              </div>

              <button 
                onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
                disabled={weekOffset === 0}
                className={`p-2 rounded-xl border transition-all ${weekOffset === 0 ? 'opacity-20 cursor-not-allowed border-zinc-100' : 'border-zinc-200 hover:bg-zinc-50 hover:border-red-600 text-zinc-500 hover:text-red-600'}`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {/* Bar Chart Implementation */}
          <div className="flex items-end justify-between h-[250px] gap-3 px-2 relative border-b border-zinc-100 pb-2">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-[0.05] z-0">
              {[...Array(6)].map((_, i) => <div key={i} className="w-full h-[1px] bg-gray-900" />)}
            </div>
            
            {currentStats.map((stat, i) => {
              const heightPercent = (stat.value / maxValue) * 100;
              return (
                <div key={i} className="flex-1 h-full flex flex-col items-center justify-end gap-3 group cursor-pointer relative z-10" onClick={() => setSelectedFilter(stat.label)}>
                  <div className="relative w-full flex justify-center items-end h-full">
                    <div 
                      className={`w-full max-w-[54px] rounded-t-xl transition-all duration-700 ease-out origin-bottom ${
                        selectedFilter === stat.label ? 'bg-red-600 shadow-2xl shadow-red-600/40' : 'bg-zinc-200 group-hover:bg-zinc-300'
                      }`}
                      style={{ height: `${heightPercent}%`, minHeight: '4px' }}
                    >
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-2xl mono z-20 whitespace-nowrap">
                        {stat.value} CASES
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black uppercase mono transition-colors ${selectedFilter === stat.label ? 'text-red-600' : 'text-zinc-500'}`}>
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footage Archives Section */}
        <section className="space-y-6">
          <SectionHeader 
            title="Incident Archive"
            subtitle="DD/MM/YYYY_Day_Time_Platform"
            actions={
              <>
                <Link
                  to="/archive"
                  className="px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-zinc-200 bg-white text-gray-900 hover:border-red-600 hover:text-red-600 transition-all flex items-center gap-3"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  Show Saved Folders
                </Link>

                {selectedFilter && (
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                    <p className="text-xs font-black text-red-600 bg-red-50 px-4 py-2 rounded-2xl border border-red-100">
                      Filtered by: {selectedFilter}
                    </p>
                  </div>
                )}
              </>
            }
          />

          <div className="grid grid-cols-1 gap-6">
            {filteredFolders.length > 0 ? filteredFolders.map((folder) => (
              <div key={folder.id} className="bg-white border border-zinc-100 rounded-[32px] overflow-hidden hover:shadow-2xl hover:shadow-zinc-200/50 transition-all group">
                <div className="flex flex-col md:flex-row">
                  {/* Folder Sidebar */}
                  <div className="w-full md:w-80 bg-zinc-50 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-100">
                    <div className="flex items-center gap-4 mb-8">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all ${folder.saved ? 'bg-red-600 text-white shadow-red-600/20' : 'bg-white border border-zinc-200 text-zinc-300 shadow-zinc-100'}`}>
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
                        className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-3 ${
                          folder.saved ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/20' : 'bg-white text-gray-900 border-zinc-200 hover:border-red-600 hover:text-red-600'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        {folder.saved ? 'In Secure Archive' : 'Save to Folder'}
                      </button>
                    </div>
                  </div>

                  {/* Investigation Content */}
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
                        placeholder="Log detailed remarks for law enforcement investigation. Specify sequence of events, identified persons, and damage assessment..."
                        className="w-full h-40 p-8 text-sm bg-zinc-50 border border-zinc-200 rounded-[32px] outline-none focus:ring-8 focus:ring-red-500/5 focus:bg-white focus:border-red-200 transition-all text-gray-700 font-medium leading-relaxed resize-none shadow-inner"
                      />
                      <div className="absolute top-6 right-8 text-[10px] font-black text-zinc-300 mono uppercase tracking-widest pointer-events-none group-hover/remarks:text-red-300 transition-colors">
                        Active Log Entry
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-zinc-100">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mono italic">
                          Legally archived record #RT-{folder.id}-V{folder.saved ? '2' : '1'}
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">Zero Incidents Tracked</h4>
                <p className="text-xs text-zinc-400 mono mt-2 uppercase tracking-widest">No matching telemetry for this filter criteria</p>
                <button 
                  onClick={() => { setSelectedFilter(null); }} 
                  className="mt-8 text-[11px] font-black text-red-600 underline underline-offset-4 uppercase tracking-widest hover:text-red-800 transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </section>

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
                This report is AI-generated for advisory use only. <br/> Cross-verify with ground physical evidence.
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

export default AccidentAnalysis;
