import React, { useState } from 'react';
import { X, Scale, Sparkles, FileText, CheckCircle2, Copy, Download, Loader2 } from 'lucide-react';
import { RatepayerAccount } from '../types';
import { formatZAR } from '../utils/pdfGenerator';
import jsPDF from 'jspdf';

interface ValuationObjectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: RatepayerAccount;
}

export const ValuationObjectionModal: React.FC<ValuationObjectionModalProps> = ({
  isOpen,
  onClose,
  account,
}) => {
  const [proposedValuation, setProposedValuation] = useState<number>(account.marketValuation * 0.8);
  const [reason, setReason] = useState<string>('Comparable sales in immediate street are significantly lower');
  const [evidence, setEvidence] = useState<string>('Recent comparative market analysis (CMA) from registered estate agent showing average sales of R1.4M.');
  const [isDrafting, setIsDrafting] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState<string>('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDraftLetter = async () => {
    setIsDrafting(true);
    try {
      const response = await fetch('/api/gemini/dispute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accNo: account.accNo,
          propertyAddress: `${account.address}, ${account.suburb}`,
          currentValuation: formatZAR(account.marketValuation),
          proposedValuation: formatZAR(proposedValuation),
          reason,
          evidence,
        }),
      });

      const data = await response.json();
      if (data.letter) {
        setGeneratedLetter(data.letter);
      } else {
        throw new Error('No letter returned');
      }
    } catch (err) {
      // Offline fallback
      setGeneratedLetter(
`TO: The Municipal Valuer
City of uMhlathuze
Revenue & Valuation Unit
Richards Bay Civic Centre, KwaZulu-Natal

DATE: ${new Date().toLocaleDateString('en-ZA')}
RE: FORMAL NOTICE OF OBJECTION IN TERMS OF SECTION 49 / 50 OF THE LOCAL GOVERNMENT: MUNICIPAL PROPERTY RATES ACT (ACT NO. 6 OF 2004)

PROPERTY PARTICULARS:
- Municipal Account Number: ${account.accNo}
- Registered Owner: ${account.name} (ID: ${account.saIdNumber})
- Physical Address: ${account.address}, ${account.suburb}
- Rating Category: ${account.propertyCategory}
- Current General Valuation: ${formatZAR(account.marketValuation)}
- Proposed Market Value: ${formatZAR(proposedValuation)}

DEAR SIR / MADAM,

1. I, the undersigned registered owner, hereby formally lodge an objection against the valuation entered on the General Valuation Roll (GV2022/GV2026) for the above-referenced property.

2. GROUNDS OF OBJECTION:
${reason}

3. SUPPORTING EVIDENCE & MOTIVATION:
${evidence}
Comparable market transactions in ${account.suburb} reflect realistic market values substantially below the Municipal Valuer's current assessment.

4. RELIEF SOUGHT:
I respectfully request that the Municipal Valuer review and adjust the certified valuation to ${formatZAR(proposedValuation)} in accordance with the prevailing market conditions as of the base valuation date.

Yours faithfully,

_____________________________
${account.name}
Registered Property Owner`
      );
    } finally {
      setIsDrafting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('City of uMhlathuze', 20, 20);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Section 49/50 MPRA Rates Valuation Objection Notice', 20, 26);
    doc.line(20, 30, 190, 30);

    doc.setFontSize(9);
    const split = doc.splitTextToSize(generatedLetter, 170);
    doc.text(split, 20, 40);

    doc.save(`uMhlathuze_Valuation_Objection_${account.accNo}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg">Valuation Objection (Section 49 MPRA)</h3>
              <p className="text-xs text-slate-400">City of uMhlathuze General Valuation Roll Dispute Form</p>
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
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Property Summary */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400">Current Valuation:</span>
              <p className="text-sm font-extrabold text-white">{formatZAR(account.marketValuation)}</p>
            </div>
            <div>
              <span className="text-slate-400">Property:</span>
              <p className="font-medium text-slate-200 truncate">{account.address}</p>
            </div>
          </div>

          {/* Form Fields */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Proposed Market Valuation by Ratepayer (ZAR)
            </label>
            <input
              type="number"
              step="10000"
              value={proposedValuation}
              onChange={(e) => setProposedValuation(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Primary Grounds for Objection
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="Comparable sales in immediate street are significantly lower">Comparable sales in immediate street are significantly lower</option>
              <option value="Structural defects or subsidence affecting market valuation">Structural defects or subsidence affecting market valuation</option>
              <option value="Incorrect building extent or erf size on municipal roll">Incorrect building extent or erf size on municipal roll</option>
              <option value="Zoning error or adverse servitude affecting property">Zoning error or adverse servitude affecting property</option>
              <option value="Severe water or flood damage from recent storms">Severe water or flood damage from recent storms</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Supporting Evidence / Valuation Motivation
            </label>
            <textarea
              rows={3}
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              placeholder="Provide evidence such as independent valuation report, estate agent comparative market analysis, or structural engineer report..."
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
            ></textarea>
          </div>

          {/* AI Generate Button */}
          <button
            onClick={handleDraftLetter}
            disabled={isDrafting}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 shadow-md flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
          >
            {isDrafting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Drafting Legal Letter with Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Draft Official Section 49 Objection Letter with Gemini AI</span>
              </>
            )}
          </button>

          {/* Generated Letter Display */}
          {generatedLetter && (
            <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Ready for Municipal Valuer Submission
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    className="p-1.5 px-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>

              <textarea
                readOnly
                rows={10}
                value={generatedLetter}
                className="w-full p-4 bg-slate-950 font-mono text-[11px] text-slate-300 border border-slate-800 rounded-2xl leading-relaxed focus:outline-none"
              ></textarea>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
