
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication
    console.log(`${mode === 'login' ? 'Logging in' : 'Signing up'} with ID:`, employeeId);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements - Subtle Grid & Tracks */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-0 left-1/4 w-px h-full bg-black" />
        <div className="absolute top-0 left-2/4 w-px h-full bg-black" />
        <div className="absolute top-0 left-3/4 w-px h-full bg-black" />
        <div className="absolute top-1/4 left-0 w-full h-px bg-black" />
        <div className="absolute top-2/4 left-0 w-full h-px bg-black" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Branding */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center text-white font-black text-3xl italic shadow-2xl shadow-red-600/30 mb-6 group transition-transform hover:rotate-3">
            R
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 uppercase italic">
            RedOn<span className="text-red-600">Track</span>
          </h1>
          <p className="text-[10px] font-bold tracking-[0.4em] text-zinc-400 uppercase mono mt-2">
            STATION AUTHORITY PORTAL
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-zinc-100 rounded-[40px] shadow-2xl shadow-zinc-200/50 overflow-hidden">
          <div className="p-10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black uppercase italic tracking-tighter text-gray-800">
                {mode === 'login' ? 'Authentication' : 'Worker Enrollment'}
              </h2>
              <div className="flex gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${mode === 'login' ? 'bg-red-600' : 'bg-zinc-200'}`} />
                <div className={`w-1.5 h-1.5 rounded-full ${mode === 'signup' ? 'bg-red-600' : 'bg-zinc-200'}`} />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mono ml-4">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/5 focus:bg-white focus:border-red-200 transition-all text-sm font-medium"
                    placeholder="Enter full name..."
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mono ml-4">Employee ID</label>
                <input
                  type="text"
                  required
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/5 focus:bg-white focus:border-red-200 transition-all text-sm font-medium"
                  placeholder="e.g. 10064620"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mono ml-4">Security Key</label>
                  {mode === 'login' && (
                    <button type="button" className="text-[9px] font-black text-red-600 uppercase tracking-widest hover:underline">Reset</button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/5 focus:bg-white focus:border-red-200 transition-all text-sm font-medium"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gray-900 text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-gray-900/10 hover:bg-black transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                {mode === 'login' ? 'Initialize Terminal' : 'Request Credentials'}
              </button>
            </form>
          </div>

          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="w-full py-6 bg-zinc-50 border-t border-zinc-100 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-red-600 transition-colors"
          >
            {mode === 'login' ? "New Worker? Sign Up Here" : "Existing Authority? Log In"}
          </button>
        </div>

        {/* Legal/System Footer */}
        <div className="mt-10 flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-3 py-2 px-6 rounded-full bg-zinc-100 border border-zinc-200 text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em]">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            SECURE LINK ESTABLISHED
          </div>
          <p className="text-[9px] text-zinc-300 font-medium max-w-[280px] leading-relaxed">
            By accessing this system, you agree to the National Railway Safety protocols and biometric data logging policies.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
