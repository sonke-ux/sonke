import React, { useState } from 'react';
import { Search, ShieldCheck, ArrowRight, FileCheck, Calculator, AlertCircle, Sparkles, Building, Landmark } from 'lucide-react';
import { RatepayerAccount } from '../types';

interface SearchHeroProps {
  onSearch: (query: string) => void;
  accounts: RatepayerAccount[];
  onOpenCalculator: () => void;
}

export const SearchHero: React.FC<SearchHeroProps> = ({ onSearch, accounts, onOpenCalculator }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleSelectDemo = (identifier: string) => {
    setQuery(identifier);
    onSearch(identifier);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-16 flex flex-col items-center">
      {/* Civic Emblem & Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold mb-4 shadow-sm">
          <Landmark className="w-4 h-4 text-emerald-400" />
          <span>Official Ugu District Municipality Rates & Taxes Portal</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
          Municipal Rates, Valuations & <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">Clearance Certificates</span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          View property valuation details, inspect monthly rates assessments, generate official Section 118 clearance certificates, and settle accounts across the KwaZulu-Natal South Coast.
        </p>
      </div>

      {/* Main Search Card */}
      <div className="w-full max-w-2xl bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/5 rounded-bl-full pointer-events-none"></div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="searchQuery" className="text-sm font-bold text-slate-200">
                Search Property Account
              </label>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> POPIA & MPRA Secured
              </span>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5 text-sky-400" />
              </div>
              <input
                type="text"
                id="searchQuery"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter 9-digit Account No. or 13-digit SA ID Number"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-base font-medium shadow-inner transition"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Tip: You can use your municipal account number (found on the top-right of your monthly paper bill) or South African ID number.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 transition transform active:scale-[0.99] cursor-pointer"
          >
            <span>Access Property Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast-Testing Chips */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <p className="text-xs font-semibold text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Fast-Test with Sample Ratepayer Accounts:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {accounts.slice(0, 4).map((acc) => (
              <button
                key={acc.accNo}
                type="button"
                onClick={() => handleSelectDemo(acc.accNo)}
                className="text-left p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 hover:border-sky-500/50 transition cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <p className="text-xs font-bold text-slate-200 group-hover:text-sky-300 transition">{acc.name}</p>
                  <p className="text-[10px] text-slate-400 truncate max-w-[180px]">{acc.address}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      acc.balance === 0
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : acc.status === '90+ Days'
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {acc.balance === 0 ? 'Paid Up' : `R ${acc.balance.toLocaleString('en-ZA')}`}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mt-10">
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-200">Section 118 Clearance</h3>
              <p className="text-xs text-slate-400">Deeds registry compliance</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Generate and verify official rates clearance certificates with Master Admin Sonke digital red seal verification.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-200">Valuation Roll Objections</h3>
              <p className="text-xs text-slate-400">Section 49 MPRA dispute</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Review your General Valuation Roll value and use Gemini AI to draft a formal objection letter to the Municipal Valuer.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-200">Rates Tariff Calculator</h3>
              <p className="text-xs text-slate-400">R350k rebate & pensioner relief</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Estimate your annual and monthly municipal rates assessment based on Ugu District statutory formulas.
          </p>
          <button
            onClick={onOpenCalculator}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 font-bold text-xs rounded-xl border border-slate-700 transition cursor-pointer text-center"
          >
            Launch Rates Calculator
          </button>
        </div>
      </div>
    </div>
  );
};
