
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { GoogleGenAI } from "@google/genai";
import { FootageFolder, AccidentStat } from '../types';
import { INITIAL_MOCK_FOLDERS } from '../constants';

const MOCK_FOLDERS: FootageFolder[] = [
  { id: 'F-001', date: '22/05/2024', day: 'Wednesday', time: '14:30', platform: 'Platform 2', remarks: 'Passenger slip near escalator. Medical team responded in 2 mins.', cameras: ['CAM-02', 'CAM-05'], saved: true },
  { id: 'F-002', date: '19/05/2024', day: 'Sunday', time: '02:45', platform: 'Platform 4', remarks: 'Unauthorized track access. Trespasser fled toward North Exit.', cameras: ['CAM-04', 'CAM-08', 'CAM-09'], saved: false },
  { id: 'F-003', date: '15/05/2024', day: 'Wednesday', time: '08:15', platform: 'Platform 1', remarks: 'Heavy congestion leading to minor collision between commuters.', cameras: ['CAM-01'], saved: true },
  { id: 'F-004', date: '10/05/2024', day: 'Friday', time: '18:50', platform: 'Platform 3', remarks: 'Luggage left unattended for 20 mins. Bomb squad cleared.', cameras: ['CAM-03', 'CAM-07'], saved: false },
  { id: 'F-005', date: '24/05/2024', day: 'Friday', time: '19:20', platform: 'Platform 2', remarks: 'Drunk passenger near platform edge. Escorted by security.', cameras: ['CAM-02'], saved: false },
  { id: 'F-006', date: '20/05/2024', day: 'Monday', time: '07:45', platform: 'Platform 1', remarks: 'Technical fault on platform doors reported.', cameras: ['CAM-01', 'CAM-02'], saved: true },
];

// Generate dynamic-ish stats based on a seed (week index)
const getStatsForWeek = (weekIndex: number, dimension: 'day' | 'time'): AccidentStat[] => {
  const seeds = [
    // Week 0 (Current)
    { day: [2, 1, 5, 3, 6, 8, 4], time: [12, 18, 24, 6] },
    // Week 1
    { day: [3, 2, 4, 1, 9, 5, 2], time: [10, 15, 30, 8] },
    // Week 2
    { day: [1, 5, 2, 7, 4, 3, 6], time: [8, 20, 18, 12] },
    // Week 3
    { day: [4, 3, 8, 2, 5, 7, 1], time: [15, 12, 22, 5] },
  ];
  
  const data = seeds[weekIndex];
  if (dimension === 'day') {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return labels.map((l, i) => ({ label: l, value: data.day[i] }));
  } else {
    const labels = ['06-12', '12-18', '18-00', '00-06'];
    return labels.map((l, i) => ({ label: l, value: data.time[i] }));
  }
};

const MONTHLY_DAY_STATS: AccidentStat[] = [
  { label: 'Mon', value: 12 }, { label: 'Tue', value: 8 }, { label: 'Wed', value: 22 }, 
  { label: 'Thu', value: 14 }, { label: 'Fri', value: 28 }, { label: 'Sat', value: 32 }, { label: 'Sun', value: 10 },
];

const MONTHLY_TIME_STATS: AccidentStat[] = [
  { label: '06-12', value: 45 }, { label: '12-18', value: 62 }, { label: '18-00', value: 88 }, { label: '00-06', value: 15 },
];

const AccidentAnalysis: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  
  // Toggles
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [dimension, setDimension] = useState<'day' | 'time'>('day');
  const [weekOffset, setWeekOffset] = useState(0); // 0 = current, 1-3 = previous
  
  // Graph Filtering State
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [folders, setFolders] = useState<FootageFolder[]>(() => {
    const saved = localStorage.getItem('footage_folders');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_FOLDERS;
  });

  // Persist to localStorage
  React.useEffect(() => {
    localStorage.setItem('footage_folders', JSON.stringify(folders));
  }, [folders]);

  // Date Range Calculation for UI
  const dateRangeLabel = useMemo(() => {
    const now = new Date();
    // Move to end of current week (Sunday)
    const end = new Date(now);
    end.setDate(now.getDate() - now.getDay() - (weekOffset * 7) + 7);
    const start = new Date(end);
    start.setDate(end.getDate() - 6);
    
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}, ${end.getFullYear()}`;
  }, [weekOffset]);

  // Determine current stats dataset
  const currentStats = useMemo(() => {
    if (period === 'weekly') {
      return getStatsForWeek(weekOffset, dimension);
    } else {
      return dimension === 'day' ? MONTHLY_DAY_STATS : MONTHLY_TIME_STATS;
    }
  }, [period, dimension, weekOffset]);

  const totalCases = useMemo(() => currentStats.reduce((acc, curr) => acc + curr.value, 0), [currentStats]);
  const maxValue = useMemo(() => {
    const val = Math.max(...currentStats.map(s => s.value));
    return val > 0 ? val : 1; 
  }, [currentStats]);
  
  const trendPercentage = period === 'weekly' ? '+12%' : '-4%';
  const isTrendUp = trendPercentage.startsWith('+');

  const filteredFolders = useMemo(() => {
    let result = folders;

    // Filter by Graph selection
    if (!selectedFilter) return result;
    
    return result.filter(f => {
      if (dimension === 'day') {
        const dayMap: Record<string, string> = { 
          'Mon': 'Monday', 'Tue': 'Tuesday', 'Wed': 'Wednesday', 
          'Thu': 'Thursday', 'Fri': 'Friday', 'Sat': 'Saturday', 'Sun': 'Sunday' 
        };
        return f.day === dayMap[selectedFilter];
      } else {
        const hour = parseInt(f.time.split(':')[0]);
        if (selectedFilter === '06-12') return hour >= 6 && hour < 12;
        if (selectedFilter === '12-18') return hour >= 12 && hour < 18;
        if (selectedFilter === '18-00') return hour >= 18 || (hour >= 0 && hour < 6 && selectedFilter === '18-00'); 
        if (selectedFilter === '00-06') return hour >= 0 && hour < 6;
        return true;
      }
    });
  }, [selectedFilter, folders, dimension]);

  const performAnalysis = async (folder: FootageFolder) => {
    setAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Perform a safety investigation for this accident: 
      Location: ${folder.platform}, Time: ${folder.time}, Day: ${folder.day}, Date: ${folder.date}. 
      Initial Remarks: ${folder.remarks}. 
      Suggest technical causes and 3 preventative measures.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setAiResult(response.text || "No analysis available.");
    } catch (err) {
      console.error(err);
      setAiResult("SYSTEM ERROR: AI engine failed to connect.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRemarkChange = (id: string, text: string) => {
    setFolders(prev => prev.map(f => f.id === id ? { ...f, remarks: text } : f));
  };

  const toggleSave = (id: string) => {
    setFolders(prev => prev.map(f => f.id === id ? { ...f, saved: !f.saved } : f));
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="p-8 max-w-6xl mx-auto space-y-12">
        {/* Metric Overview */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-50 border border-zinc-100 p-6 rounded-3xl shadow-sm">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mono mb-1">Total Cases ({period})</p>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-gray-900 tracking-tighter">{totalCases}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isTrendUp ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {trendPercentage} vs Prev. {period === 'weekly' ? 'Week' : 'Month'}
              </span>
            </div>
          </div>
          <div className="bg-zinc-50 border border-zinc-100 p-6 rounded-3xl shadow-sm">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mono mb-1">Critical Time Slot</p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-gray-900 tracking-tighter italic uppercase">18:00 - 00:00</span>
              <span className="text-[10px] text-zinc-400 font-bold uppercase mono">High Vol</span>
            </div>
          </div>
          <div className="bg-zinc-50 border border-zinc-100 p-6 rounded-3xl shadow-sm">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mono mb-1">Investigation Status</p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-gray-900 tracking-tighter italic uppercase">84% Resolved</span>
              <span className="text-[10px] text-zinc-400 font-bold uppercase mono">Active</span>
            </div>
          </div>
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

          {/* Bar Chart Implementation - Height fixed at 250px */}
          <div className="flex items-end justify-between h-[250px] gap-3 px-2 relative border-b border-zinc-100 pb-2">
            {/* Grid line backgrounds */}
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
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest italic">Incident Archive</h3>
              <p className="text-[10px] text-zinc-400 mono uppercase">DD/MM/YYYY_Day_Time_Platform</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {/* Saved Archive Link Button */}
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
            </div>
          </div>

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
                        onChange={(e) => handleRemarkChange(folder.id, e.target.value)}
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
        {aiResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/70 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="w-full max-w-3xl bg-white rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
              <div className="p-10 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                <div>
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter">Forensic Insights</h3>
                  <p className="text-[11px] text-red-600 font-black mono uppercase tracking-widest mt-1">AI Safety Engine v4.2.1-Flash</p>
                </div>
                <button onClick={() => setAiResult(null)} className="w-14 h-14 flex items-center justify-center hover:bg-zinc-100 rounded-full transition-all border border-zinc-100">
                  <svg className="w-7 h-7 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-10 max-h-[60vh] overflow-y-auto">
                <div className="prose prose-zinc max-w-none">
                  <div className="text-gray-700 font-medium text-base leading-relaxed whitespace-pre-wrap mono bg-zinc-50 p-10 rounded-[32px] border border-zinc-200 shadow-inner">
                    {aiResult}
                  </div>
                </div>
              </div>
              <div className="p-10 bg-white border-t border-zinc-100 flex flex-col sm:flex-row justify-between items-center gap-6">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest italic text-center sm:text-left">
                  This report is AI-generated for advisory use only. <br/> Cross-verify with ground physical evidence.
                </p>
                <button 
                  onClick={() => setAiResult(null)}
                  className="w-full sm:w-auto bg-red-600 text-white px-12 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-2xl shadow-red-600/30 active:scale-95"
                >
                  Confirm & Log Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccidentAnalysis;
