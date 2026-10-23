import React, { useState, useEffect } from 'react';
import { X, FileCheck, ShieldCheck, Download, AlertTriangle, Check } from 'lucide-react';
import { AdminUser, RatepayerAccount, MonthlyRate } from '../types';
import { generateOfficialClearancePDF, formatZAR } from '../utils/pdfGenerator';

interface ClearanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: RatepayerAccount | null;
  month: MonthlyRate | null;
  currentAdmin: AdminUser | null;
}

export const ClearanceModal: React.FC<ClearanceModalProps> = ({
  isOpen,
  onClose,
  account,
  month,
  currentAdmin,
}) => {
  const [letterText, setLetterText] = useState('');
  const [applyStamp, setApplyStamp] = useState(false);

  useEffect(() => {
    if (account && month) {
      setLetterText(
        `This official document certifies that all municipal rates, property taxes, refuse removal charges, sewer tariffs, and municipal levies prescribed under the Local Government: Municipal Property Rates Act 6 of 2004 for ${account.name} (Account No: ${account.accNo}) at ${account.address}, ${account.suburb} for the billing month of ${month.month} have been fully assessed and settled.\n\nTotal Cleared: ${formatZAR(month.amount)}. No arrears remain for the specified assessment period.`
      );
      setApplyStamp(currentAdmin?.canStampAndSign || false);
    }
  }, [account, month, currentAdmin]);

  if (!isOpen || !account || !month) return null;

  const isSonke = currentAdmin?.username.toLowerCase() === 'sonke';

  const handleDownload = () => {
    generateOfficialClearancePDF(
      account,
      month,
      letterText,
      applyStamp && isSonke,
      currentAdmin?.displayName || 'Sonke'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg">Section 118 Clearance Certificate</h3>
              <p className="text-xs text-slate-400">{account.name} • Month: {month.month}</p>
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
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Certificate Declaration Text (Editable)
            </label>
            <textarea
              rows={5}
              value={letterText}
              onChange={(e) => setLetterText(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-sky-500"
            ></textarea>
          </div>

          {/* Master Admin Red Seal Checkbox */}
          {isSonke ? (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={applyStamp}
                  onChange={(e) => setApplyStamp(e.target.checked)}
                  className="w-4 h-4 mt-0.5 text-rose-500 rounded focus:ring-rose-500 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-extrabold text-rose-300 block">
                    Apply Official Master Admin Red Seal & Signature (Sonke)
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Embeds high-resolution official City of uMhlathuze Municipal seal, SHA-256 verification hash, and authorized signature.
                  </p>
                </div>
              </label>
            </div>
          ) : (
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-2.5 text-xs text-amber-300">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                Staff Mode: Only Master Administrator <strong>Sonke</strong> is authorized to apply the official municipal verification red seal. This certificate will be generated as a draft copy.
              </span>
            </div>
          )}

          <button
            onClick={handleDownload}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Generate Official Certificate PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
