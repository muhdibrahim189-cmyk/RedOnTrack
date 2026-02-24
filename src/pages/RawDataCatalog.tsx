import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, SectionHeader } from '../components';
import { DayFolder, CameraFile } from '../domain';
import { BRANDING } from '../constants';

const generateMockCatalog = (): DayFolder[] => {
  const folders: DayFolder[] = [];
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  for (let i = 0; i < 7; i++) {
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() - i);
    
    const dayName = days[targetDate.getDay()];
    const dateStr = targetDate.toLocaleDateString('en-GB'); // DD/MM/YYYY
    const folderId = `FOLDER-${i + 1}`;

    const files: CameraFile[] = [
      { id: `${folderId}-C1`, name: 'Camera 1 (Platform 1)', size: '12.4 GB', resolution: '4K', timestamp: '00:00 - 23:59' },
      { id: `${folderId}-C2`, name: 'Camera 2 (Platform 2)', size: '11.8 GB', resolution: '4K', timestamp: '00:00 - 23:59' },
      { id: `${folderId}-C3`, name: 'Camera 3 (Platform 3)', size: '13.1 GB', resolution: '4K', timestamp: '00:00 - 23:59' },
      { id: `${folderId}-C4`, name: 'Camera 4 (Platform 4)', size: '12.9 GB', resolution: '4K', timestamp: '00:00 - 23:59' },
    ];

    folders.push({
      id: folderId,
      date: dateStr,
      day: dayName,
      totalSize: '50.2 GB',
      files
    });
  }
  return folders;
};

const RawDataCatalog: React.FC = () => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const folders = useMemo(() => generateMockCatalog(), []);
  const navigate = useNavigate();

  const selectedFolder = useMemo(() => 
    folders.find(f => f.id === selectedFolderId), 
    [selectedFolderId, folders]
  );

  return (
    <div className="min-h-screen bg-white">
      <Header 
        logoUrl={BRANDING.logoUrl}
        brandName="RedOn|Track"
      />
      <div className="p-8 max-w-6xl mx-auto space-y-12">
        <SectionHeader 
          title={selectedFolder ? `${selectedFolder.day}_${selectedFolder.date}` : 'Historical Raw Data'}
          subtitle={selectedFolder ? `Terminal Node Hub-09 // Full Stream Access` : 'Archived Telemetry Index // Last 7 Days'}
          actions={
            <div className="flex items-center gap-4">
              {selectedFolder && (
                <button 
                  onClick={() => setSelectedFolderId(null)}
                  className="px-6 py-2 bg-zinc-100 border border-zinc-200 text-zinc-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Folders
                </button>
              )}
              <button 
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-lg shadow-gray-900/10"
              >
                Station Exit
              </button>
            </div>
          }
        />

        {/* Catalog Statistics */}
        {!selectedFolder && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'RETENTION', value: '7 DAYS' },
              { label: 'TOTAL STORAGE', value: '351.4 GB' },
              { label: 'NODES', value: '4 CAMERAS' },
              { label: 'HEALTH', value: 'ENCRYPTED' },
            ].map((stat, i) => (
              <div key={i} className="bg-zinc-50 border border-zinc-100 p-6 rounded-[24px]">
                <p className="text-[9px] text-zinc-400 mono uppercase tracking-[0.2em] mb-1 font-black">{stat.label}</p>
                <p className="text-xl font-black text-gray-900 italic tracking-tight">{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {!selectedFolder ? (
          /* Folder Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {folders.map((folder) => (
              <div 
                key={folder.id}
                onClick={() => setSelectedFolderId(folder.id)}
                className="group cursor-pointer space-y-4"
              >
                <div className="relative aspect-square bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-[48px] flex items-center justify-center transition-all group-hover:border-red-500 group-hover:bg-white group-hover:shadow-2xl group-hover:shadow-red-500/10 group-hover:-translate-y-2">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 text-zinc-200 group-hover:text-red-600 transition-colors">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z" />
                      </svg>
                    </div>
                    <span className="mt-4 text-[10px] font-black text-zinc-400 mono uppercase tracking-widest">4 Streams</span>
                  </div>
                  
                  {/* Status Indicator */}
                  <div className="absolute top-6 right-8">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                  </div>
                </div>
                
                <div className="px-4 text-center">
                  <h3 className="text-lg font-black text-gray-900 italic tracking-tighter uppercase">{folder.day}_{folder.date.replace(/\//g, '')}</h3>
                  <p className="text-[10px] text-zinc-400 mono uppercase tracking-widest mt-1">Full 24h Recording • {folder.totalSize}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Detailed File View within Folder */
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-6 bg-red-50 rounded-[32px] border border-red-100 mb-10">
              <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-black text-red-900 uppercase italic tracking-tighter">Pre-Incident Telemetry Access</h4>
                <p className="text-[10px] text-red-600 font-bold mono uppercase leading-tight">Access these files to verify timeline prior to any reported scenes. <br/> All footage is timestamped and watermarked.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedFolder.files.map((file) => (
                <div key={file.id} className="bg-white border border-zinc-100 rounded-[32px] p-8 flex items-center justify-between hover:shadow-xl hover:shadow-zinc-200/50 transition-all border-l-4 border-l-gray-900 hover:border-l-red-600 group">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center border border-zinc-100 text-zinc-300 group-hover:text-red-600 transition-all">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 00-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-base font-black text-gray-900 italic uppercase tracking-tighter">{file.name}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[9px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded mono border border-red-100">{file.resolution}</span>
                        <span className="text-[10px] text-zinc-400 font-bold mono uppercase tracking-widest">{file.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[10px] font-black text-zinc-300 mono">{file.size}</span>
                    <button className="px-6 py-3 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-600 transition-all shadow-lg hover:shadow-red-600/20 active:scale-95">
                      Review Stream
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer/Storage Warning */}
        <div className="pt-12 border-t border-zinc-50 flex flex-col items-center text-center space-y-4">
          <div className="px-6 py-2 bg-zinc-50 rounded-full border border-zinc-100 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
             <span className="text-[9px] font-black text-zinc-400 mono uppercase tracking-[0.3em]">Warning: Data older than 7 days is automatically purged</span>
          </div>
          <p className="text-[9px] text-zinc-300 font-medium max-w-md leading-relaxed mono uppercase">
            Historical data access is logged under the National Railway Privacy Act. Unauthorized downloading or distribution of surveillance telemetry is a federal offense.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RawDataCatalog;
