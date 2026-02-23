
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { LoginHistoryEntry } from '../types';

const MOCK_HISTORY: LoginHistoryEntry[] = [
  { no: 1, name: 'Sarah Jenkins', id: '10064620', position: 'Station Manager', loginTime: '2024-05-24 08:00:12', signOutTime: '2024-05-24 16:30:45' },
  { no: 2, name: 'Marcus Thorne', id: '22839401', position: 'Security Lead', loginTime: '2024-05-24 16:25:00', signOutTime: '2024-05-25 00:15:22' },
  { no: 3, name: 'Elena Rodriguez', id: '33910284', position: 'Traffic Controller', loginTime: '2024-05-25 00:10:15', signOutTime: '2024-05-25 08:05:00' },
  { no: 4, name: 'David Chen', id: '44556677', position: 'Platform Supervisor', loginTime: '2024-05-25 08:00:00', signOutTime: '2024-05-25 16:20:11' },
  { no: 5, name: 'Authority System', id: '00000000', position: 'Automated Oversight', loginTime: '2024-05-25 16:15:00', signOutTime: 'STILL ACTIVE' },
  { no: 6, name: 'Kinsley Vane', id: '55122390', position: 'Technician', loginTime: '2024-05-26 09:12:00', signOutTime: '2024-05-26 17:00:00' },
  { no: 7, name: 'John Dalton', id: '99023411', position: 'Public Safety', loginTime: '2024-05-26 18:30:45', signOutTime: '2024-05-27 02:45:10' },
];

type SortKey = 'loginTime' | 'signOutTime';
type SortOrder = 'asc' | 'desc';

const LoginHistory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; order: SortOrder } | null>(null);

  const handleSort = (key: SortKey) => {
    let order: SortOrder = 'desc';
    if (sortConfig && sortConfig.key === key && sortConfig.order === 'desc') {
      order = 'asc';
    }
    setSortConfig({ key, order });
  };

  const processedHistory = useMemo(() => {
    let filtered = MOCK_HISTORY.filter((entry) => {
      const searchStr = `${entry.name} ${entry.loginTime} ${entry.id}`.toLowerCase();
      return searchStr.includes(searchQuery.toLowerCase());
    });

    if (sortConfig) {
      filtered.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];

        // Handle "STILL ACTIVE" which should usually be considered as "latest"
        if (valA === 'STILL ACTIVE') return sortConfig.order === 'desc' ? -1 : 1;
        if (valB === 'STILL ACTIVE') return sortConfig.order === 'desc' ? 1 : -1;

        if (valA < valB) return sortConfig.order === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.order === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [searchQuery, sortConfig]);

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortConfig?.key !== column) {
      return (
        <svg className="w-3 h-3 text-zinc-300 group-hover:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortConfig.order === 'asc' ? (
      <svg className="w-3 h-3 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-3 h-3 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="p-8 max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-100 pb-8 gap-6">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Authority Access Logs</h2>
            <p className="text-zinc-400 mono text-xs mt-1 uppercase tracking-widest">Biometric & ID Validation History</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search name, ID (8-digit)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/5 focus:bg-white focus:border-red-200 transition-all text-sm font-medium mono"
              />
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <Link to="/" className="group flex items-center justify-center gap-2 text-zinc-500 hover:text-red-600 transition-colors mono text-sm px-6 py-3 bg-zinc-50 rounded-2xl border border-zinc-200 hover:border-red-200">
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </Link>
          </div>
        </header>

        <div className="bg-white border border-zinc-100 rounded-[40px] overflow-hidden shadow-2xl shadow-zinc-100/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100 text-zinc-400 mono text-[10px] uppercase tracking-[0.2em]">
                  <th className="px-10 py-6">No.</th>
                  <th className="px-10 py-6">Personnel</th>
                  <th className="px-10 py-6">Credentials (8-Digit)</th>
                  <th className="px-10 py-6">Assignment</th>
                  <th 
                    className="px-10 py-6 cursor-pointer group hover:bg-zinc-100 transition-colors"
                    onClick={() => handleSort('loginTime')}
                  >
                    <div className="flex items-center gap-2">
                      Initialization
                      <SortIcon column="loginTime" />
                    </div>
                  </th>
                  <th 
                    className="px-10 py-6 cursor-pointer group hover:bg-zinc-100 transition-colors"
                    onClick={() => handleSort('signOutTime')}
                  >
                    <div className="flex items-center gap-2">
                      Termination
                      <SortIcon column="signOutTime" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {processedHistory.length > 0 ? processedHistory.map((entry) => (
                  <tr key={entry.no} className="hover:bg-zinc-50/80 transition-all group">
                    <td className="px-10 py-8">
                      <span className="text-xs font-black text-zinc-300 mono">#{entry.no.toString().padStart(3, '0')}</span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col">
                        <span className="text-base font-black text-gray-900">{entry.name}</span>
                        <span className="text-[10px] text-zinc-400 mono uppercase tracking-widest mt-1">Personnel Active</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="text-xs font-black text-red-600 bg-red-50 px-4 py-2 rounded-xl border border-red-100 mono">
                        {entry.id}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <span className="text-sm font-bold text-gray-600 uppercase tracking-wider italic">
                        {entry.position}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <span className="text-[11px] font-medium text-zinc-500 mono">{entry.loginTime}</span>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`text-[11px] font-bold mono ${entry.signOutTime === 'STILL ACTIVE' ? 'text-green-500 animate-pulse' : 'text-zinc-400'}`}>
                        {entry.signOutTime}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-10 py-32 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center border border-zinc-100">
                          <svg className="w-8 h-8 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <p className="text-sm font-black text-zinc-400 uppercase tracking-widest mono">No audit trails match "{searchQuery}"</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-center p-12">
            <div className="flex flex-col items-center gap-4 opacity-30 grayscale pointer-events-none">
                 <div className="w-12 h-12 rounded-full border-4 border-zinc-200 border-t-zinc-600 animate-spin" />
                 <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mono">Synchronizing Historical Archives...</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginHistory;
