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
  DollarSign,
  Bell,
  CheckCheck,
  Eye,
  Lock,
  Stamp,
  BadgeAlert,
  ToggleLeft,
  ToggleRight,
  RotateCcw,
  Check
} from 'lucide-react';
import { AdminUser, RatepayerAccount, MonthlyRate, AdminNotification } from '../types';
import { formatZAR } from '../utils/pdfGenerator';

interface AdminDashboardProps {
  currentAdmin: AdminUser;
  accounts: RatepayerAccount[];
  adminNotifications: AdminNotification[];
  onLogout: () => void;
  onOpenEditAccount: (account: RatepayerAccount) => void;
  onOpenNewAccountModal: () => void;
  onClearAccount: (accNo: string) => void;
  onOpenClearanceModal: (account: RatepayerAccount, month: MonthlyRate) => void;
  onRunAiScan: () => void;
  onMarkAdminNotificationRead: (id: string) => void;
  onMarkAllAdminNotificationsRead: () => void;
  onClearReadAdminNotifications: () => void;
  onViewAndClearAdminNotification?: (id: string) => void;
  onMarkAllAdminReadyAndClear?: () => void;
  onRestoreAdminNotifications?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentAdmin,
  accounts,
  adminNotifications,
  onLogout,
  onOpenEditAccount,
  onOpenNewAccountModal,
  onClearAccount,
  onOpenClearanceModal,
  onRunAiScan,
  onMarkAdminNotificationRead,
  onMarkAllAdminNotificationsRead,
  onClearReadAdminNotifications,
  onViewAndClearAdminNotification,
  onMarkAllAdminReadyAndClear,
  onRestoreAdminNotifications,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Arrears' | 'Paid Up'>('All');
  const [isNotificationsExpanded, setIsNotificationsExpanded] = useState(true);
  const [autoClearOnView, setAutoClearOnView] = useState<boolean>(true);
  const [adminToast, setAdminToast] = useState<string>('');

  const isSonke = currentAdmin.username.toLowerCase() === 'sonke';

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

  const unreadAdminCount = adminNotifications.filter((n) => !n.read).length;
  const readAdminCount = adminNotifications.filter((n) => n.read).length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
      {/* Admin Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${
              isSonke
                ? 'bg-gradient-to-tr from-rose-600 to-red-500 shadow-rose-500/20'
                : 'bg-gradient-to-tr from-amber-600 to-amber-500 shadow-amber-500/20'
            }`}
          >
            {isSonke ? <Stamp className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                {isSonke ? 'Chief Master Revenue Administrator' : 'Staff Operations Portal'}
              </h2>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  isSonke
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                Logged in: {currentAdmin.displayName} ({currentAdmin.role})
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {currentAdmin.title} • City of uMhlathuze Revenue & Treasury Services Unit
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
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

      {/* Staff Capabilities Indicator Card */}
      <div
        className={`p-4 rounded-2xl border transition-all ${
          isSonke
            ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
            : 'bg-amber-950/20 border-amber-500/30 text-amber-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`p-2 rounded-xl mt-0.5 ${
                isSonke ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
              }`}
            >
              {isSonke ? <Sparkles className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-sm">
                  {isSonke ? 'Master Admin Privilege Level (Sonke)' : `Staff Role Privilege Level (${currentAdmin.displayName})`}
                </span>
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isSonke
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {isSonke ? 'Endless Capabilities' : 'Limited Capabilities'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {isSonke ? (
                  <>
                    <strong className="text-rose-300">Full & Endless Powers:</strong> Exclusive legal authority to issue the official red municipal seal of certification on Section 118 clearance certificates, perform master arrears write-offs, delete accounts, modify valuations, and run AI debt relief dispatchers.
                  </>
                ) : (
                  <>
                    <strong className="text-amber-300">Staff Rates Assessment Powers:</strong> You have authorization to edit property particulars, valuation assessments, and monthly rates. <span className="text-amber-400 font-bold">You DO NOT have the powers to issue or apply the official stamp of certification</span> on Section 118 certificates (restricted to Sonke).
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Message Bar / Pin & Notifications Center */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-4">
        {/* Bar Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-white text-base">Admin Message Bar & Dispatch Alerts</h3>
                {/* Clear message pin: Don't show unread number when read! */}
                {unreadAdminCount > 0 ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-300 bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 rounded-full animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                    {unreadAdminCount} Unread Pin
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> All Messages Ready • Message Pin Cleared
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Administrative alerts for {currentAdmin.displayName} • Section 118, Objections & Payments
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Auto-Clear on View Switch */}
            <button
              onClick={() => {
                const nextState = !autoClearOnView;
                setAutoClearOnView(nextState);
                setAdminToast(nextState ? 'Auto-clear on view enabled' : 'Auto-clear on view paused');
                setTimeout(() => setAdminToast(''), 2500);
              }}
              className="flex items-center gap-1 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 transition cursor-pointer text-xs"
              title="Automatically mark alert as ready and clear from message bar once viewed"
            >
              {autoClearOnView ? (
                <ToggleRight className="w-4 h-4 text-emerald-400" />
              ) : (
                <ToggleLeft className="w-4 h-4 text-slate-500" />
              )}
              <span className="text-[11px]">
                Auto-Clear: <strong className={autoClearOnView ? 'text-emerald-400' : 'text-slate-400'}>{autoClearOnView ? 'ON' : 'OFF'}</strong>
              </span>
            </button>

            {/* Mark All Ready & Clear */}
            {adminNotifications.length > 0 && (
              <button
                onClick={() => {
                  if (onMarkAllAdminReadyAndClear) {
                    onMarkAllAdminReadyAndClear();
                  } else {
                    onMarkAllAdminNotificationsRead();
                    onClearReadAdminNotifications();
                  }
                  setAdminToast('✓ All admin alerts marked as ready and message bar cleared.');
                  setTimeout(() => setAdminToast(''), 2800);
                }}
                className="text-xs text-emerald-300 hover:text-white font-semibold cursor-pointer flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-500/30 transition shadow-sm"
                title="Mark all notifications as ready and clear message bar"
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mark All Ready & Clear</span>
              </button>
            )}

            <button
              onClick={() => setIsNotificationsExpanded(!isNotificationsExpanded)}
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 transition cursor-pointer"
            >
              {isNotificationsExpanded ? 'Collapse' : 'Expand'}
            </button>
          </div>
        </div>

        {/* Transient Toast */}
        {adminToast && (
          <div className="bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs px-4 py-2 rounded-xl flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="truncate">{adminToast}</span>
          </div>
        )}

        {/* Bar Notification Items */}
        {isNotificationsExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
            {adminNotifications.length === 0 ? (
              <div className="col-span-3 text-center py-8 text-slate-400 text-xs flex flex-col items-center justify-center gap-2.5 bg-slate-950/40 rounded-2xl border border-dashed border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-extrabold text-white text-sm">Admin Message Bar Cleared</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    All notifications have been viewed, marked as ready, and cleared. The message pin has been removed.
                  </p>
                </div>
                {onRestoreAdminNotifications && (
                  <button
                    onClick={onRestoreAdminNotifications}
                    className="mt-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 border border-slate-700 font-semibold text-xs transition cursor-pointer flex items-center gap-1.5"
                    title="Restore sample alerts for testing"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore Sample Alerts</span>
                  </button>
                )}
              </div>
            ) : (
              adminNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    onMarkAdminNotificationRead(n.id);
                    if (autoClearOnView) {
                      if (onViewAndClearAdminNotification) {
                        onViewAndClearAdminNotification(n.id);
                      } else {
                        onClearReadAdminNotifications();
                      }
                      setAdminToast(`✓ Alert "${n.title.slice(0, 24)}..." marked as ready and cleared.`);
                    } else {
                      setAdminToast(`✓ Alert marked as ready and viewed.`);
                    }
                    setTimeout(() => setAdminToast(''), 2500);
                  }}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between group ${
                    !n.read
                      ? 'bg-slate-800/90 border-sky-500/40 shadow-md ring-1 ring-sky-500/20 hover:bg-slate-800'
                      : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20">
                        {n.tag}
                      </span>
                      {/* Mark as ready indicator */}
                      {n.ready || n.read ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Marked as Ready
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-300 bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
                          Unread
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-white text-xs mb-1.5 group-hover:text-sky-300 transition-colors">
                      {n.title}
                    </h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{n.body}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 flex-wrap gap-2">
                    <span>{n.date}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onViewAndClearAdminNotification) {
                          onViewAndClearAdminNotification(n.id);
                        } else {
                          onMarkAdminNotificationRead(n.id);
                          onClearReadAdminNotifications();
                        }
                        setAdminToast(`✓ Alert "${n.title.slice(0, 20)}..." marked as ready and cleared.`);
                        setTimeout(() => setAdminToast(''), 2500);
                      }}
                      className="px-2 py-0.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 font-semibold text-[10px] flex items-center gap-1 transition cursor-pointer"
                      title="Mark as ready and remove from admin message bar"
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>Mark Ready & Clear</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
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
          <p className="text-[11px] text-slate-500 mt-4">Across active uMhlathuze ratepayer accounts</p>
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
                <th className="px-6 py-4 text-center">Section 118 Clearance</th>
                <th className="px-6 py-4 text-center">Staff Actions</th>
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
                              className={`px-2 py-1 rounded text-[10px] font-semibold transition cursor-pointer flex items-center gap-1 border ${
                                isSonke
                                  ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                              }`}
                              title={
                                isSonke
                                  ? `Generate Section 118 clearance with Master Admin red seal for ${m.month}`
                                  : `View Draft Section 118 (Stamping restricted to Sonke)`
                              }
                            >
                              <FileCheck className="w-3 h-3" />
                              <span>{m.month.split(' ')[0]}</span>
                              {!isSonke && <span className="text-[9px] text-amber-400">(Draft)</span>}
                            </button>
                          ))
                      )}
                    </div>
                  </td>

                  {/* Admin Actions */}
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* Both Sonke and Londi/Sizwe can edit rates */}
                      <button
                        onClick={() => onOpenEditAccount(acc)}
                        className="px-2.5 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 font-semibold text-xs transition cursor-pointer flex items-center gap-1"
                        title="Edit ratepayer details and monthly assessment rates"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Rates</span>
                      </button>

                      {/* Sonke Only: Chief Administrator Master Clearance */}
                      {isSonke && acc.balance > 0 && (
                        <button
                          onClick={() => onClearAccount(acc.accNo)}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold text-xs transition cursor-pointer flex items-center gap-1"
                          title="Master Clearance: Write off balance to zero (Sonke exclusive endless power)"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Clear to R0</span>
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
