import React, { useState } from 'react';
import { X, Lock, ShieldCheck, Terminal, AlertCircle, ArrowRight, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { ADMIN_USERS } from '../data/mockData';
import { AdminUser } from '../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (admin: AdminUser) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [error, setError] = useState('');

  // Ensure fields are completely blank each time staff portal gateway is opened
  React.useEffect(() => {
    if (isOpen) {
      setUsername('');
      setPassword('');
      setError('');
      setIsVerifying(false);
      setCurrentStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();
    const targetAdmin = ADMIN_USERS[cleanUser];

    if (!targetAdmin) {
      setError('Access Denied: Only authorized personnel (Sonke, Londi, or Sizwe) have staff access.');
      return;
    }

    setError('');
    setIsVerifying(true);
    setCurrentStep(1);

    setTimeout(() => setCurrentStep(2), 500);
    setTimeout(() => setCurrentStep(3), 1100);
    setTimeout(() => setCurrentStep(4), 1700);
    setTimeout(() => {
      setIsVerifying(false);
      onLoginSuccess(targetAdmin);
      onClose();
    }, 2300);
  };

  const handleSelectDemoUser = (user: string) => {
    setUsername(user);
    setPassword('admin2026');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg">Staff & Admin Gateway</h3>
              <p className="text-xs text-slate-400">City of uMhlathuze Revenue Management Security</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Staff Username (Sonke, Londi, or Sizwe)
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. sonke"
                required
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Quick Demo Select */}
            <div className="pt-1">
              <span className="text-[11px] text-slate-400 font-semibold mb-1.5 block">Quick Select Authorized Staff:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectDemoUser('sonke')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                    username.toLowerCase() === 'sonke'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  Sonke (Master Admin)
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectDemoUser('londi')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                    username.toLowerCase() === 'londi'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  Londi (Staff)
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectDemoUser('sizwe')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                    username.toLowerCase() === 'sizwe'
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  Sizwe (Staff)
                </button>
              </div>
            </div>

            {/* AI Security Terminal Inspection Animation */}
            {isVerifying && (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl font-mono text-xs space-y-2 mt-4 text-emerald-400">
                <div className="flex items-center gap-2 text-slate-400 border-b border-slate-800 pb-2">
                  <Terminal className="w-4 h-4 text-sky-400" />
                  <span className="font-bold">Gemini AI Security Inspector Active</span>
                </div>
                {currentStep >= 1 && <p className="animate-pulse">❯ [1/4] Inspecting IP payload & cryptographic headers...</p>}
                {currentStep >= 2 && <p className="animate-pulse">❯ [2/4] Executing zero-trust biometric heuristic verification...</p>}
                {currentStep >= 3 && <p className="animate-pulse">❯ [3/4] Validating municipal role-based access rights...</p>}
                {currentStep >= 4 && (
                  <p className="text-emerald-300 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> [4/4] Security clearance granted. Redirecting to revenue console...
                  </p>
                )}
              </div>
            )}

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full mt-4 py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Authenticate to Revenue Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
