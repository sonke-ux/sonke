import React, { useState, useEffect } from 'react';
import { X, Edit3, Save, Check, Plus, Trash2 } from 'lucide-react';
import { RatepayerAccount, MonthlyRate } from '../types';

interface EditAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: RatepayerAccount | null;
  onSave: (updatedAccount: RatepayerAccount) => void;
}

export const EditAccountModal: React.FC<EditAccountModalProps> = ({
  isOpen,
  onClose,
  account,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [suburb, setSuburb] = useState('');
  const [valuation, setValuation] = useState<number>(0);
  const [monthlyRates, setMonthlyRates] = useState<MonthlyRate[]>([]);

  useEffect(() => {
    if (account) {
      setName(account.name);
      setAddress(account.address);
      setSuburb(account.suburb);
      setValuation(account.marketValuation);
      setMonthlyRates(JSON.parse(JSON.stringify(account.monthlyRates)));
    }
  }, [account]);

  if (!isOpen || !account) return null;

  const handleRateAmountChange = (index: number, newAmount: number) => {
    const updated = [...monthlyRates];
    updated[index].amount = Math.max(0, newAmount);
    setMonthlyRates(updated);
  };

  const handleRatePaidToggle = (index: number) => {
    const updated = [...monthlyRates];
    updated[index].paid = !updated[index].paid;
    setMonthlyRates(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let newBalance = 0;
    monthlyRates.forEach((m) => {
      if (!m.paid) newBalance += m.amount;
    });

    let newStatus: RatepayerAccount['status'] = 'Current';
    if (newBalance === 0) {
      newStatus = 'Paid Up';
    } else if (newBalance > 5000) {
      newStatus = '90+ Days';
    } else if (newBalance > 2000) {
      newStatus = '30 Days';
    }

    const updatedAccount: RatepayerAccount = {
      ...account,
      name,
      address,
      suburb,
      marketValuation: valuation,
      monthlyRates,
      balance: newBalance,
      status: newStatus,
    };

    onSave(updatedAccount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg">Edit Ratepayer Records</h3>
              <p className="text-xs text-slate-400">Account #{account.accNo}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Ratepayer Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Physical Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Suburb / City
              </label>
              <input
                type="text"
                value={suburb}
                onChange={(e) => setSuburb(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Certified Market Valuation (ZAR)
            </label>
            <input
              type="number"
              step="50000"
              value={valuation}
              onChange={(e) => setValuation(parseFloat(e.target.value) || 0)}
              required
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Monthly Rates Editor */}
          <div className="pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Monthly Assessments & Payment Status
            </label>
            <div className="space-y-2.5 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              {monthlyRates.map((mr, idx) => (
                <div
                  key={mr.id || idx}
                  className="flex items-center justify-between gap-3 p-3 bg-slate-800/80 rounded-xl border border-slate-700"
                >
                  <span className="font-bold text-xs text-white w-28 truncate">{mr.month}</span>
                  
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-400">R</span>
                    <input
                      type="number"
                      step="0.01"
                      value={mr.amount}
                      onChange={(e) => handleRateAmountChange(idx, parseFloat(e.target.value) || 0)}
                      className="w-24 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-right text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500 font-bold"
                    />
                  </div>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={mr.paid}
                      onChange={() => handleRatePaidToggle(idx)}
                      className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500"
                    />
                    <span className={`text-xs font-bold ${mr.paid ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {mr.paid ? 'Cleared' : 'Unpaid'}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Account & Ledger Updates</span>
          </button>
        </form>
      </div>
    </div>
  );
};
