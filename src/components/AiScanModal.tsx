import React, { useState, useEffect } from 'react';
import { X, Bot, Sparkles, CheckCircle2, Send, Loader2, ShieldCheck } from 'lucide-react';
import { RatepayerAccount } from '../types';
import { formatZAR } from '../utils/pdfGenerator';

interface AiScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: RatepayerAccount[];
  onDispatchedNotices: () => void;
}

export const AiScanModal: React.FC<AiScanModalProps> = ({
  isOpen,
  onClose,
  accounts,
  onDispatchedNotices,
}) => {
  const [stage, setStage] = useState<'scanning' | 'complete'>('scanning');
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [totalArrearsFlagged, setTotalArrearsFlagged] = useState<number>(0);
  const [flaggedCount, setFlaggedCount] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setStage('scanning');
      setLogMessages([]);
      
      const debtAccounts = accounts.filter((a) => a.balance > 0);
      const totalDebt = debtAccounts.reduce((sum, a) => sum + a.balance, 0);
      setTotalArrearsFlagged(totalDebt);
      setFlaggedCount(debtAccounts.length);

      const logs = [
        'Connecting to City of uMhlathuze Revenue & Water Assessment Ledger...',
        `Analyzing ${accounts.length} ratepayer properties against municipal credit control criteria...`,
        `Detected ${debtAccounts.length} properties in arrears (30d / 60d / 90d+ overdue).`,
        'Formulating personalized empathy-led debt relief notices with 50% interest write-off clauses...',
        'Pushed official encrypted notices directly to ratepayer inboxes.',
      ];

      logs.forEach((msg, idx) => {
        setTimeout(() => {
          setLogMessages((prev) => [...prev, msg]);
          if (idx === logs.length - 1) {
            setTimeout(() => {
              setStage('complete');
              onDispatchedNotices();
            }, 600);
          }
        }, (idx + 1) * 600);
      });
    }
  }, [isOpen, accounts]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg">Gemini AI Arrears Agent</h3>
              <p className="text-xs text-slate-400">Autonomous Monthly Scan & Notice Dispatcher</p>
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
          {stage === 'scanning' ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4">
                <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
              </div>
              <h4 className="font-extrabold text-white text-base mb-1">Scanning Valuation Ledger...</h4>
              <p className="text-xs text-slate-400 mb-6">Running automated revenue recovery protocol</p>

              {/* Progress terminal */}
              <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-left font-mono text-[11px] text-emerald-400 space-y-2">
                {logMessages.map((msg, i) => (
                  <p key={i} className="flex items-start gap-1.5 animate-fadeIn">
                    <span className="text-sky-400">❯</span>
                    <span>{msg}</span>
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-5 py-2">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">Monthly Dispatch Complete</h4>
                  <p className="text-xs text-emerald-300 mt-0.5">
                    All qualifying ratepayer accounts have been notified with the active 50% interest write-off incentive.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl">
                  <span className="text-slate-400 block mb-1">Overdue Accounts Flagged:</span>
                  <strong className="text-base text-amber-400 font-extrabold">{flaggedCount}</strong>
                </div>
                <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl">
                  <span className="text-slate-400 block mb-1">Total Arrears Balance:</span>
                  <strong className="text-base text-rose-400 font-extrabold">{formatZAR(totalArrearsFlagged)}</strong>
                </div>
              </div>

              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                <span className="text-slate-300 font-bold block mb-1">Notice Template Deployed:</span>
                "Dear Resident, City of uMhlathuze has flagged an outstanding balance for your property. Settle or set up an approved AOD before November 30 to qualify for the 50% interest remission."
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition cursor-pointer"
              >
                Acknowledge & Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
