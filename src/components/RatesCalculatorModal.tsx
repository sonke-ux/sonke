import React, { useState } from 'react';
import { X, Calculator, Info, CheckCircle2 } from 'lucide-react';
import { formatZAR } from '../utils/pdfGenerator';

interface RatesCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RatesCalculatorModal: React.FC<RatesCalculatorModalProps> = ({ isOpen, onClose }) => {
  const [marketValue, setMarketValue] = useState<number>(2000000);
  const [propertyCategory, setPropertyCategory] = useState<'residential' | 'commercial' | 'vacant' | 'sectional'>('residential');
  const [isPrimaryResidence, setIsPrimaryResidence] = useState<boolean>(true);
  const [isPensioner, setIsPensioner] = useState<boolean>(false);

  if (!isOpen) return null;

  // Ugu rates tariff rules
  let tariff = 0.0125; // 1.25 cents in Rand for residential
  if (propertyCategory === 'commercial') tariff = 0.025;
  if (propertyCategory === 'vacant') tariff = 0.035;

  let deduction = 0;
  if ((propertyCategory === 'residential' || propertyCategory === 'sectional') && isPrimaryResidence) {
    deduction = 350000; // Ugu primary residential rebate
  }

  const rateableValue = Math.max(0, marketValue - deduction);
  let baseAnnual = rateableValue * tariff;

  if (propertyCategory === 'sectional') {
    baseAnnual = baseAnnual * 0.9; // 10% sectional title common property rebate
  }

  let pensionerAnnualRebate = 0;
  if (isPensioner && propertyCategory === 'residential') {
    pensionerAnnualRebate = Math.min(baseAnnual, 42000); // Up to R3,500/month
  }

  const finalAnnualRates = Math.max(0, baseAnnual - pensionerAnnualRebate);
  const finalMonthlyRates = finalAnnualRates / 12;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg">Ugu District Rates Calculator</h3>
              <p className="text-xs text-slate-400">Tariff Formulas & Statutory Rebates (2026/2027)</p>
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
        <div className="p-6 space-y-5">
          {/* Market Value input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Property Market Value (ZAR)
            </label>
            <input
              type="number"
              step="50000"
              value={marketValue}
              onChange={(e) => setMarketValue(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-extrabold text-base focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Property Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Property Category
            </label>
            <select
              value={propertyCategory}
              onChange={(e) => setPropertyCategory(e.target.value as any)}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="residential">Residential Full Title (Tariff: 1.25c / Rand)</option>
              <option value="sectional">Residential Sectional Title (10% rebate)</option>
              <option value="commercial">Commercial / Business (Tariff: 2.50c / Rand)</option>
              <option value="vacant">Vacant Land (Tariff: 3.50c / Rand)</option>
            </select>
          </div>

          {/* Checkboxes */}
          <div className="space-y-2.5 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/80">
            {(propertyCategory === 'residential' || propertyCategory === 'sectional') && (
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPrimaryResidence}
                  onChange={(e) => setIsPrimaryResidence(e.target.checked)}
                  className="w-4 h-4 text-sky-500 rounded focus:ring-sky-500"
                />
                <span className="text-xs text-slate-300 font-medium">
                  Primary Residence (First R350,000 value is exempt from rates)
                </span>
              </label>
            )}

            {propertyCategory === 'residential' && (
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPensioner}
                  onChange={(e) => setIsPensioner(e.target.checked)}
                  className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500"
                />
                <span className="text-xs text-slate-300 font-medium">
                  Pensioner / Senior Citizen (60+ years, rebate up to R3,500/month)
                </span>
              </label>
            )}
          </div>

          {/* Result Card */}
          <div className="bg-gradient-to-tr from-slate-950 to-slate-900 border border-slate-700 rounded-2xl p-5 shadow-inner space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Rateable Property Value:</span>
              <strong className="text-sm font-bold text-slate-200">{formatZAR(rateableValue)}</strong>
            </div>

            {pensionerAnnualRebate > 0 && (
              <div className="flex justify-between items-center text-xs text-emerald-400">
                <span>Pensioner Rebate Applied:</span>
                <strong>- {formatZAR(pensionerAnnualRebate)} / year</strong>
              </div>
            )}

            <div className="border-t border-slate-800 pt-3 flex justify-between items-center">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Estimated Monthly Rates</span>
                <p className="text-[11px] text-slate-500">Excludes water, refuse & sewer charges</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold text-sky-400">
                  {formatZAR(finalMonthlyRates)}
                </div>
                <span className="text-[11px] text-slate-400 font-mono">({formatZAR(finalAnnualRates)} / year)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Close Calculator
          </button>
        </div>
      </div>
    </div>
  );
};
