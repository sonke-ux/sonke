import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Plus,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  Bot,
  FileCheck,
  Trash2,
  LogOut,
  Send,
  User,
  Sparkles,
  Building,
  DollarSign
} from 'lucide-react';
import { AdminUser, RatepayerAccount, MonthlyRate } from '../types';
import { formatZAR } from '../utils/pdfGenerator';

interface AdminDashboardProps {
  currentAdmin: AdminUser;
  accounts: RatepayerAccount[];
  onLogout: () => void;
  onOpenEditAccount: (account: RatepayerAccount) => void;
  onOpenNewAccountModal: () => void;
  onClearAccount: (accNo: string) => void;
  onOpenClearanceModal: (account: RatepayerAccount, month: MonthlyRate) => void;
  onRunAiScan: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentAdmin,
  accounts,
  onLogout,
  onOpenEditAccount,
  onOpenNewAccountModal,
  onClearAccount,
  onOpenClearanceModal,
  onRunAiScan,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Arrears' | 'Paid Up'>('All');

  // Compute metrics
  let totalDebt = 0;
  let totalMonthsDue = 0;
  let totalMonthsPaid = 0;
  let arrearsCount = 0;

  accounts.forEach((acc) => {
    totalDebt += acc.balance;
    if (acc.balance > 0) arrearsCount++;
    acc.monthlyRates.forEach((m) => {
      totalMonthsDue++;
      if (m.paid) totalMonthsPaid++;
    });
  });

  const collectionRatio = totalMonthsDue > 0 ? Math.round((totalMonthsPaid / totalMonthsDue) * 100) : 0;

  // Filter accounts
  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch =
      acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.accNo.includes(searchTerm) ||
      acc.suburb.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'Arrears') return acc.balance > 0;
    if (statusFilter === 'Paid Up') return acc.balance === 0;
    return true;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
      {/* Admin Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${
              currentAdmin.role === 'admin'
                ? 'bg-gradient-to-tr from-rose-600 to-red-500 shadow-rose-500/20'
                : 'bg-gradient-to-tr from-amber-600 to-amber-500 shadow-amber-500/20'
            }`}
          >
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                {currentAdmin.role === 'admin' ? 'Master Admin Revenue Portal' : 'Staff Operations Portal'}
              </h2>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  currentAdmin.role === 'admin'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                Logged as: {currentAdmin.displayName} ({currentAdmin.role})
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {currentAdmin.title} • Ugu District Municipality Revenue & Water Services Unit
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenNewAccountModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Property Account</span>
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* 4 Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Arrears */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl border-l-4 border-l-rose-500 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Arrears Balance</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 mt-2 tracking-tight">
              {formatZAR(totalDebt)}
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-4">Across all active ratepayer accounts</p>
        </div>

        {/* Collection Ratio */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl border-l-4 border-l-emerald-500 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Collection Rate</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-2 tracking-tight">
              {collectionRatio}%
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-4">
            {totalMonthsPaid} of {totalMonthsDue} billing months settled
          </p>
        </div>

        {/* Accounts in Arrears */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl border-l-4 border-l-amber-500 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Accounts with Debt</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-2 tracking-tight">
              {arrearsCount} / {accounts.length}
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-4">Flagged for automated AI debt reminder notices</p>
        </div>

        {/* Autonomous AI Tracker Launcher */}
        <div className="bg-gradient-to-br from-slate-900 to-emerald-950/60 border border-emerald-500/30 rounded-3xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
              <Bot className="w-4 h-4" />
              <span>Gemini AI Arrears Agent</span>
            </div>
            <p className="text-xs text-slate-300">
              Autonomous monthly scans & customized debt relief notices.
            </p>
          </div>
          <button
            onClick={onRunAiScan}
            className="mt-4 w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition cursor-pointer flex items-center justify-center gap-1.5 relative z-10"
          >
            <Sparkles className="w-4 h-4" />
            <span>Run Arrears Scan</span>
          </button>
        </div>
      </div>

      {/* Account Table & Search Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        {/* Search & Filter Header */}
        <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900/80">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, account no, suburb..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400 font-medium mr-1">Filter:</span>
            {(['All', 'Arrears', 'Paid Up'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  statusFilter === filter
                    ? 'bg-sky-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950/40">
                <th className="px-6 py-4">Account No</th>
                <th className="px-6 py-4">Ratepayer / Property</th>
                <th className="px-6 py-4 text-right">Outstanding (ZAR)</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Monthly Clearance</th>
                <th className="px-6 py-4 text-center">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredAccounts.map((acc) => (
                <tr key={acc.accNo} className="hover:bg-slate-800/40 transition">
                  {/* Account No */}
                  <td className="px-6 py-4 font-mono font-bold text-slate-300 whitespace-nowrap">
                    {acc.accNo}
                  </td>

                  {/* Ratepayer Info */}
                  <td className="px-6 py-4">
                    <p className="font-bold text-white text-sm">{acc.name}</p>
                    <p className="text-[11px] text-slate-400 truncate max-w-[220px]">{acc.address}, {acc.suburb}</p>
                    <span className="text-[10px] text-sky-400 font-mono">Valuation: {formatZAR(acc.marketValuation)}</span>
                  </td>

                  {/* Balance */}
                  <td className="px-6 py-4 font-bold text-right whitespace-nowrap text-sm">
                    <span className={acc.balance > 0 ? 'text-rose-400' : 'text-emerald-400'}>
                      {formatZAR(acc.balance)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                        acc.balance === 0
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : acc.status === '90+ Days'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {acc.status}
                    </span>
                  </td>

                  {/* Monthly Clearance Buttons */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-xs mx-auto">
                      {acc.monthlyRates.filter((m) => m.paid).length === 0 ? (
                        <span className="text-[11px] text-slate-500 italic">No cleared months</span>
                      ) : (
                        acc.monthlyRates
                          .filter((m) => m.paid)
                          .map((m) => (
                            <button
                              key={m.id}
                              onClick={() => onOpenClearanceModal(acc, m)}
                              className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-semibold transition cursor-pointer flex items-center gap-1"
                              title={`Generate Section 118 clearance for ${m.month}`}
                            >
                              <FileCheck className="w-3 h-3" />
                              <span>{m.month.split(' ')[0]}</span>
                            </button>
                          ))
                      )}
                    </div>
                  </td>

                  {/* Admin Actions */}
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onOpenEditAccount(acc)}
                        className="px-2.5 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 font-semibold text-xs transition cursor-pointer flex items-center gap-1"
                        title="Edit ratepayer details and monthly rates"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      {currentAdmin.canClearArrears && acc.balance > 0 && (
                        <button
                          onClick={() => onClearAccount(acc.accNo)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold text-xs transition cursor-pointer flex items-center gap-1"
                          title="Chief Administrator Master Clearance (Sonke only)"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Clear Balance</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
