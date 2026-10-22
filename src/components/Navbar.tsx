import React, { useState } from 'react';
import { Building2, Sparkles, ShieldCheck, UserCheck, Inbox, Lock, LogOut } from 'lucide-react';
import { AdminUser, RatepayerAccount } from '../types';

interface NavbarProps {
  currentAdmin: AdminUser | null;
  loggedInResident: RatepayerAccount | null;
  unreadCount: number;
  onGoHome: () => void;
  onOpenAdminLogin: () => void;
  onOpenResidentAuth: () => void;
  onOpenInbox: () => void;
  onLogoutAdmin: () => void;
  onLogoutResident: () => void;
  onTriggerGlobalAiSearch: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentAdmin,
  loggedInResident,
  unreadCount,
  onGoHome,
  onOpenAdminLogin,
  onOpenResidentAuth,
  onOpenInbox,
  onLogoutAdmin,
  onLogoutResident,
  onTriggerGlobalAiSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    onTriggerGlobalAiSearch(searchQuery.trim());
    setSearchQuery('');
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 text-white shadow-lg backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center gap-4">
          
          {/* Logo & Civic Branding */}
          <button
            onClick={onGoHome}
            className="flex items-center gap-3.5 hover:opacity-90 transition text-left cursor-pointer flex-shrink-0"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-600 via-sky-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20 border border-sky-400/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white">Muni<span className="text-sky-400">Rates</span></span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30 px-1.5 py-0.5 rounded">Ugu</span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">District Municipality • Rates & Water</p>
            </div>
          </button>

          {/* Center AI Search & Status */}
          <div className="hidden lg:flex flex-col items-center flex-1 max-w-lg mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-400">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask Gemini AI: How to dispute property valuation or apply for rebate?"
                className="w-full pl-10 pr-24 py-2 text-xs bg-slate-800/80 border border-slate-700 rounded-full text-slate-200 placeholder-slate-400 focus:outline-none focus:bg-slate-800 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-sky-500 hover:bg-sky-400 text-white text-[11px] font-bold rounded-full transition cursor-pointer flex items-center gap-1"
              >
                Ask AI
              </button>
            </form>

            <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> MPRA Compliant
              </span>
              <span>•</span>
              <span className="hover:text-slate-200 transition">Valuation Roll: GV2022/GV2026</span>
              <span>•</span>
              <span className="text-sky-400">Section 118 Clearance Enabled</span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Municipal Inbox */}
            <button
              onClick={onOpenInbox}
              className="relative p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700 cursor-pointer"
              title="Official Municipal Notices & Reminders"
            >
              <Inbox className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce shadow">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Admin State or Login */}
            {currentAdmin ? (
              <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5">
                <div className="flex flex-col text-right">
                  <div className="flex items-center gap-1.5 justify-end">
                    <span className="text-xs font-bold text-white capitalize">{currentAdmin.displayName}</span>
                    <span
                      className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                        currentAdmin.role === 'admin'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {currentAdmin.role === 'admin' ? 'Master Admin' : 'Staff'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">Staff Portal</span>
                </div>
                <button
                  onClick={onLogoutAdmin}
                  className="p-1.5 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                  title="Logout from staff portal"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-sky-400 transition bg-slate-800/80 hover:bg-slate-800 px-3 py-2 rounded-xl border border-slate-700 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Staff Access</span>
              </button>
            )}

            {/* Resident Auth / Profile */}
            {loggedInResident ? (
              <div className="flex items-center gap-2 bg-sky-950/80 border border-sky-800/60 rounded-xl px-3 py-1.5">
                <div className="w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-xs">
                  {loggedInResident.name.charAt(0)}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-xs font-bold text-white leading-tight truncate max-w-[110px]">{loggedInResident.name}</p>
                  <p className="text-[10px] text-sky-300 font-mono">#{loggedInResident.accNo.slice(-4)}</p>
                </div>
                <button
                  onClick={onLogoutResident}
                  className="p-1 text-slate-400 hover:text-rose-400 transition cursor-pointer ml-1"
                  title="Sign out of resident account"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenResidentAuth}
                className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>Resident Login</span>
              </button>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
};
