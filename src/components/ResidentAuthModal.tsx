import React, { useState } from 'react';
import { X, UserCheck, ShieldCheck, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { RatepayerAccount } from '../types';

interface ResidentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (idNumber: string) => boolean;
  onRegister: (newAccount: Partial<RatepayerAccount>) => void;
}

export const ResidentAuthModal: React.FC<ResidentAuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  
  // Login fields
  const [loginId, setLoginId] = useState('9001015000081');
  const [loginPass, setLoginPass] = useState('password123');
  const [loginBotPassed, setLoginBotPassed] = useState(false);
  const [error, setError] = useState('');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regId, setRegId] = useState('');
  const [regStreetNum, setRegStreetNum] = useState('');
  const [regStreetName, setRegStreetName] = useState('');
  const [regSuburb, setRegSuburb] = useState('Morningside');
  const [regPass, setRegPass] = useState('');
  const [regBotPassed, setRegBotPassed] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginBotPassed) {
      setError('Please click the human verification checkbox.');
      return;
    }
    const success = onLogin(loginId.trim());
    if (success) {
      setError('');
      onClose();
    } else {
      setError('No matching municipal account found for this SA ID number. Please register your profile.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regBotPassed) {
      setError('Please verify you are human before completing registration.');
      return;
    }
    if (regId.length !== 13) {
      setError('South African ID number must be exactly 13 digits.');
      return;
    }

    onRegister({
      name: regName,
      saIdNumber: regId,
      address: `${regStreetNum} ${regStreetName}, ${regSuburb}`,
      suburb: `${regSuburb}, Durban`,
    });
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg">Resident Self-Service</h3>
              <p className="text-xs text-slate-400">Manage Ugu District Municipal Rates Online</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800">
          <button
            type="button"
            onClick={() => { setTab('login'); setError(''); }}
            className={`flex-1 py-3 text-xs font-bold transition cursor-pointer ${
              tab === 'login'
                ? 'bg-sky-500/10 text-sky-400 border-b-2 border-sky-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Resident Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setError(''); }}
            className={`flex-1 py-3 text-xs font-bold transition cursor-pointer ${
              tab === 'register'
                ? 'bg-sky-500/10 text-sky-400 border-b-2 border-sky-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Register Profile
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {tab === 'login' ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  13-Digit SA ID Number
                </label>
                <input
                  type="text"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="e.g. 9001015000081"
                  required
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Bot Check Box */}
              <div
                onClick={() => setLoginBotPassed(!loginBotPassed)}
                className="flex items-center gap-3 p-3.5 bg-slate-800/60 border border-slate-700 rounded-xl cursor-pointer hover:bg-slate-800 transition"
              >
                <div
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center transition ${
                    loginBotPassed
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-slate-600 bg-slate-900'
                  }`}
                >
                  {loginBotPassed && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-200">Verify you are human</p>
                  <p className="text-[10px] text-slate-400">Ugu District Bot Protection Active</p>
                </div>
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Sign In to Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Full Name & Surname
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Nomvula Khumalo"
                  required
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  13-Digit SA ID Number
                </label>
                <input
                  type="text"
                  value={regId}
                  onChange={(e) => setRegId(e.target.value)}
                  placeholder="e.g. 8804155123089"
                  required
                  pattern="[0-9]{13}"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Street No.</label>
                  <input
                    type="text"
                    value={regStreetNum}
                    onChange={(e) => setRegStreetNum(e.target.value)}
                    placeholder="42"
                    required
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Street Name</label>
                  <input
                    type="text"
                    value={regStreetName}
                    onChange={(e) => setRegStreetName(e.target.value)}
                    placeholder="Musgrave Road"
                    required
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Ugu South Coast Town / Area
                </label>
                <select
                  value={regSuburb}
                  onChange={(e) => setRegSuburb(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="Port Shepstone">Port Shepstone Central</option>
                  <option value="Shelly Beach">Shelly Beach</option>
                  <option value="Margate">Margate</option>
                  <option value="Scottburgh">Scottburgh</option>
                  <option value="Ramsgate">Ramsgate</option>
                  <option value="Hibberdene">Hibberdene</option>
                  <option value="Southbroom">Southbroom</option>
                  <option value="Harding">Harding</option>
                  <option value="Pennington">Pennington</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Create Password
                </label>
                <input
                  type="password"
                  value={regPass}
                  onChange={(e) => setRegPass(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Bot Check Box */}
              <div
                onClick={() => setRegBotPassed(!regBotPassed)}
                className="flex items-center gap-3 p-3.5 bg-slate-800/60 border border-slate-700 rounded-xl cursor-pointer hover:bg-slate-800 transition"
              >
                <div
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center transition ${
                    regBotPassed
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-slate-600 bg-slate-900'
                  }`}
                >
                  {regBotPassed && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-200">Verify you are human</p>
                  <p className="text-[10px] text-slate-400">Ugu District Bot Protection Active</p>
                </div>
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Create Resident Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
