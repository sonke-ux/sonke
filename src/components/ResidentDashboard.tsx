import React from 'react';
import {
  RotateCcw,
  CreditCard,
  Download,
  Building,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Receipt,
  Scale,
  Calendar,
  MapPin,
  FileCheck,
  Bell,
  Trash2,
  Eye,
  CheckCheck,
  Inbox
} from 'lucide-react';
import { RatepayerAccount, MonthlyRate } from '../types';
import { formatZAR, generateMonthlyStatementPDF, generatePaymentReceiptPDF, generateOfficialClearancePDF } from '../utils/pdfGenerator';

interface ResidentDashboardProps {
  account: RatepayerAccount;
  onResetSearch: () => void;
  onOpenPayment: (specificAmount?: number) => void;
  onAskAi: (topic: string) => void;
  onOpenDisputeModal: () => void;
  onOpenCalculator: () => void;
  onOpenInbox: () => void;
  onMarkAllInboxRead: () => void;
  onClearReadMessages: () => void;
  onViewAndClearMessage?: (id: string) => void;
  onMarkAllReadyAndClear?: () => void;
  onRestoreMessages?: () => void;
}

export const ResidentDashboard: React.FC<ResidentDashboardProps> = ({
  account,
  onResetSearch,
  onOpenPayment,
  onAskAi,
  onOpenDisputeModal,
  onOpenCalculator,
  onOpenInbox,
  onMarkAllInboxRead,
  onClearReadMessages,
  onViewAndClearMessage,
  onMarkAllReadyAndClear,
  onRestoreMessages,
}) => {
  const [activeNoticeDetail, setActiveNoticeDetail] = React.useState<boolean>(false);
  const outstandingBills = account.monthlyRates.filter((m) => !m.paid);
  const clearedBills = account.monthlyRates.filter((m) => m.paid);

  const handleDownloadStatement = (month?: MonthlyRate) => {
    generateMonthlyStatementPDF(account, month);
  };

  const handleDownloadReceipt = () => {
    generatePaymentReceiptPDF(
      account,
      account.lastPayment,
      'uMhlathuze Online Payment (Ozow / Card)',
      'UMH-REC-' + account.accNo.slice(-6)
    );
  };

  const handleDownloadClearance = (month: MonthlyRate) => {
    generateOfficialClearancePDF(
      account,
      month,
      '',
      true,
      'Sonke'
    );
  };

  // Handle viewing the notice in the message bar: marks ready and clears inbox
  const handleViewAndClearTopNotice = () => {
    if (account.inbox && account.inbox.length > 0) {
      const topMsg = account.inbox[0];
      if (onViewAndClearMessage) {
        onViewAndClearMessage(topMsg.id);
      } else {
        onClearReadMessages();
      }
      setActiveNoticeDetail(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
      {/* Top Banner: Property & Account Owner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider bg-sky-500/20 text-sky-400 border border-sky-500/30 px-2.5 py-0.5 rounded-full">
              {account.propertyCategory}
            </span>
            <span
              className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                account.balance === 0
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              Status: {account.status}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {account.name}
          </h2>
          <div className="flex items-center gap-4 text-xs text-slate-400 mt-2 flex-wrap">
            <span className="flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-sky-400" /> Account No: <strong className="text-slate-200">{account.accNo}</strong>
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {account.address}, {account.suburb}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <button
            onClick={() => handleDownloadStatement()}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-sky-500/40 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 hover:text-white font-semibold text-xs transition cursor-pointer shadow-sm group"
            title="Download Official Municipal Monthly Statement (PDF)"
          >
            <FileText className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
            <span>Download Statement</span>
          </button>
          <button
            onClick={onResetSearch}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Search Another Account</span>
          </button>
        </div>
      </div>

      {/* Official Municipal Message Bar & Notice Alert */}
      {account.inbox && account.inbox.length > 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div
              onClick={() => setActiveNoticeDetail(!activeNoticeDetail)}
              className="flex items-start sm:items-center gap-3 cursor-pointer group flex-1"
              title="Click to view message detail, mark as ready, and clear"
            >
              <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex-shrink-0 group-hover:scale-105 transition-transform">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-white text-xs">Official Municipal Message Bar</span>
                  {account.inbox.filter((m) => !m.read).length > 0 ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-300 bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 rounded-full animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                      {account.inbox.filter((m) => !m.read).length} Unread Notice
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Marked as Ready • Message Pin Cleared
                    </span>
                  )}
                  <span className="text-[10px] text-sky-400 font-semibold group-hover:underline">
                    {activeNoticeDetail ? 'Hide Notice Detail' : 'Click to View & Mark Ready'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5 truncate max-w-xl group-hover:text-white transition-colors">
                  <strong className="text-white">{account.inbox[0]?.title}:</strong>{' '}
                  <span className="text-slate-400">{account.inbox[0]?.body}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
              {/* Direct Mark as Ready & Clear button */}
              <button
                onClick={handleViewAndClearTopNotice}
                className="px-3 py-1.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm shadow-emerald-500/20"
                title="Mark this message as ready and clear from inbox"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark as Ready & Clear</span>
              </button>

              {account.inbox.length > 1 && onMarkAllReadyAndClear && (
                <button
                  onClick={onMarkAllReadyAndClear}
                  className="px-2.5 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  title="Mark all notices as ready and clear entire inbox"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              )}

              <button
                onClick={onOpenInbox}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Inbox className="w-3.5 h-3.5" />
                <span>Inbox ({account.inbox.length})</span>
              </button>
            </div>
          </div>

          {/* Quick Notice Detail View (Marked as Ready & Viewed) */}
          {activeNoticeDetail && account.inbox[0] && (
            <div className="mt-2 p-4 rounded-xl bg-slate-850 border border-sky-500/30 bg-slate-800/80 space-y-2.5 animate-fadeIn">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Marked as Ready & Viewed
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Date: {account.inbox[0].date}</span>
              </div>
              <h5 className="font-bold text-white text-xs">{account.inbox[0].title}</h5>
              <p className="text-xs text-slate-300 leading-relaxed">{account.inbox[0].body}</p>
              <div className="pt-2 border-t border-slate-700 flex justify-end gap-2">
                <button
                  onClick={handleViewAndClearTopNotice}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Dismiss & Clear from Inbox</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Message Bar Cleared State */
        <div className="bg-slate-900/60 border border-emerald-500/30 rounded-2xl p-3.5 px-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-emerald-400">
            <div className="p-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <span className="font-extrabold text-white">Official Municipal Message Bar:</span>{' '}
              <span className="text-slate-300">
                All messages have been viewed, marked as ready, and cleared from the inbox. The unread notification pin is removed.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {onRestoreMessages && (
              <button
                onClick={onRestoreMessages}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 border border-slate-700 font-semibold text-[11px] transition cursor-pointer flex items-center gap-1.5"
                title="Restore demo notices to test inbox again"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Restore Demo Notices</span>
              </button>
            )}
            <button
              onClick={onOpenInbox}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-semibold text-[11px] transition cursor-pointer flex items-center gap-1"
            >
              <Inbox className="w-3 h-3" />
              <span>Inbox (0)</span>
            </button>
          </div>
        </div>
      )}

      {/* 3 Core Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Outstanding Balance & Payment */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Outstanding Balance</span>
              <CreditCard className="w-5 h-5 text-rose-400" />
            </div>
            <div className={`text-3xl sm:text-4xl font-extrabold tracking-tight my-1 ${account.balance > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {formatZAR(account.balance)}
            </div>
            {account.balance > 0 ? (
              <p className="text-xs font-medium text-rose-300 bg-rose-500/10 border border-rose-500/20 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg mt-2">
                <Calendar className="w-3 h-3" /> Due by {account.dueDate}
              </p>
            ) : (
              <p className="text-xs font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg mt-2">
                <CheckCircle2 className="w-3 h-3" /> Account fully paid up
              </p>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col gap-2.5">
            {account.balance > 0 ? (
              <button
                onClick={() => onOpenPayment()}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>Pay Full Balance</span>
                <CreditCard className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => clearedBills[0] && handleDownloadClearance(clearedBills[0])}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>Download Clearance Certificate</span>
                <FileCheck className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => handleDownloadStatement()}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-300 bg-slate-800 hover:bg-slate-750 hover:text-white border border-slate-700 hover:border-slate-600 flex items-center justify-center gap-2 transition cursor-pointer"
              title="Download official monthly statement and tax invoice PDF"
            >
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              <span>Download Statement (PDF)</span>
            </button>
          </div>
        </div>

        {/* Card 2: Last Payment Received */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Last Payment Received</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight my-1">
              {formatZAR(account.lastPayment)}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Processed on <strong className="text-slate-200">{account.lastPaymentDate}</strong>
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Ref: uMhlathuze Electronic Clearing System
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={handleDownloadReceipt}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Payment Receipt (PDF)</span>
            </button>
          </div>
        </div>

        {/* Card 3: Property Valuation & Objection */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">General Valuation Roll</span>
              <Building className="w-5 h-5 text-sky-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight my-1">
              {formatZAR(account.marketValuation)}
            </div>
            <div className="text-xs text-slate-400 space-y-1 mt-2">
              <div className="flex justify-between">
                <span>Statutory Rebate:</span>
                <span className="text-emerald-400 font-semibold">- {formatZAR(account.exemptionRebate)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800/80 pt-1">
                <span>Rateable Value:</span>
                <strong className="text-slate-200">
                  {formatZAR(Math.max(0, account.marketValuation - account.exemptionRebate))}
                </strong>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex gap-2">
            <button
              onClick={() => onAskAi('valuation')}
              className="flex-1 py-2 px-3 rounded-xl font-semibold text-xs text-sky-400 bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
              title="Ask Gemini AI how this valuation is determined"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Explain</span>
            </button>
            <button
              onClick={onOpenDisputeModal}
              className="flex-1 py-2 px-3 rounded-xl font-semibold text-xs text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 flex items-center justify-center gap-1.5 transition cursor-pointer"
              title="Lodge an official Section 49 objection"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Object / Dispute</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Banner */}
      <div className="bg-gradient-to-r from-sky-950/60 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center flex-shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">uMhlathuze Rates Calculator & Pensioner Rebates</h3>
            <p className="text-xs text-slate-400">
              Calculate projected monthly rates based on current City of uMhlathuze tariffs, sectional title discounts, and pensioner rebates up to R3,500/month.
            </p>
          </div>
        </div>
        <button
          onClick={onOpenCalculator}
          className="whitespace-nowrap px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold text-xs border border-sky-500/30 transition cursor-pointer flex items-center gap-2 shadow-sm"
        >
          <span>Open Rates Calculator</span>
        </button>
      </div>

      {/* Outstanding Monthly Payments Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/80 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Outstanding Monthly Rates & Levies</h3>
              <p className="text-xs text-slate-400">Unsettled billing assessments for this property</p>
            </div>
          </div>
          <button
            onClick={() => onAskAi('billing')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 font-semibold text-xs transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Billing Assessment</span>
          </button>
        </div>

        {outstandingBills.length === 0 ? (
          <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-2" />
            <p className="font-bold text-white text-base">No Outstanding Bills</p>
            <p className="text-xs text-slate-500">Your municipal rates account is in good standing.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950/40">
                  <th className="px-6 py-4">Assessment Month</th>
                  <th className="px-6 py-4">Item Breakdown</th>
                  <th className="px-6 py-4 text-right">Amount (ZAR)</th>
                  <th className="px-6 py-4 text-center">Due Date</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {outstandingBills.map((month) => (
                  <tr key={month.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4 font-bold text-white whitespace-nowrap">
                      {month.month}
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      <div className="text-xs font-medium">Rates: {formatZAR(month.ratesAmount)} • Refuse: {formatZAR(month.refuseAmount)}</div>
                      <div className="text-[11px] text-slate-500">Water: {formatZAR(month.waterAmount)} • Sewer: {formatZAR(month.sewerAmount)} • VAT: {formatZAR(month.vatAmount)}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-right text-rose-400 whitespace-nowrap text-sm">
                      {formatZAR(month.amount)}
                    </td>
                    <td className="px-6 py-4 text-center text-slate-300 whitespace-nowrap">
                      {month.dueDate}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-1 rounded-full text-[11px] font-bold">
                        Unpaid
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onOpenPayment(month.amount)}
                          className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-sm transition cursor-pointer flex items-center gap-1"
                        >
                          <CreditCard className="w-3 h-3" />
                          <span>Pay</span>
                        </button>
                        <button
                          onClick={() => handleDownloadStatement(month)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
                          title="Download Statement (PDF) for this billing period"
                        >
                          <FileText className="w-3.5 h-3.5 text-sky-400" />
                          <span className="text-[11px] font-medium hidden sm:inline">Statement</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Cleared Monthly Payments Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Cleared Monthly Rates & Historical Receipts</h3>
              <p className="text-xs text-slate-400">Paid assessments with verifiable clearance certificates</p>
            </div>
          </div>
        </div>

        {clearedBills.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            No cleared history found for this account.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950/40">
                  <th className="px-6 py-4">Assessment Month</th>
                  <th className="px-6 py-4">Service Details</th>
                  <th className="px-6 py-4 text-right">Amount Settled</th>
                  <th className="px-6 py-4 text-center">Payment Date</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Clearance & Invoices</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {clearedBills.map((month) => (
                  <tr key={month.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4 font-bold text-white whitespace-nowrap">
                      {month.month}
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      Monthly Rates & Water Assessment • City of uMhlathuze
                    </td>
                    <td className="px-6 py-4 font-bold text-right text-emerald-400 whitespace-nowrap text-sm">
                      {formatZAR(month.amount)}
                    </td>
                    <td className="px-6 py-4 text-center text-slate-300 whitespace-nowrap">
                      {month.paidDate || 'Cleared via Portal'}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[11px] font-bold">
                        Cleared
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleDownloadClearance(month)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-semibold text-xs transition cursor-pointer flex items-center gap-1.5"
                          title="Download Section 118 Monthly Clearance Certificate"
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>Clearance PDF</span>
                        </button>
                        <button
                          onClick={() => handleDownloadStatement(month)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
                          title="Download Historical Monthly Statement (PDF)"
                        >
                          <FileText className="w-3.5 h-3.5 text-sky-400" />
                          <span className="text-[11px] font-medium hidden sm:inline">Statement</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
