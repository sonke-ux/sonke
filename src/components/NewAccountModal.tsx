import React, { useState } from 'react';
import { X, Plus, Building2, Check } from 'lucide-react';
import { RatepayerAccount } from '../types';

interface NewAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccount: (account: RatepayerAccount) => void;
}

export const NewAccountModal: React.FC<NewAccountModalProps> = ({ isOpen, onClose, onAddAccount }) => {
  const [name, setName] = useState('');
  const [saIdNumber, setSaIdNumber] = useState('');
  const [address, setAddress] = useState('');
  const [suburb, setSuburb] = useState('Morningside, Durban');
  const [category, setCategory] = useState<'Residential' | 'Commercial' | 'Sectional Title' | 'Vacant Land'>('Residential');
  const [valuation, setValuation] = useState<number>(1500000);
  const [monthlyAmount, setMonthlyAmount] = useState<number>(1850);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAccNo = Math.floor(100000000 + Math.random() * 900000000).toString();
    const exemptionRebate = category === 'Residential' || category === 'Sectional Title' ? 350000 : 0;

    const newAccount: RatepayerAccount = {
      accNo: newAccNo,
      saIdNumber: saIdNumber || '9401015000088',
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.co.za`,
      phone: '+27 82 000 0000',
      address,
      suburb,
      propertyCategory: category,
      marketValuation: valuation,
      exemptionRebate,
      balance: monthlyAmount,
      dueDate: '31 Oct 2026',
      lastPayment: 0,
      lastPaymentDate: 'N/A',
      status: 'Current',
      monthlyRates: [
        {
          id: `mr-new-1`,
          month: 'October 2026',
          amount: monthlyAmount,
          ratesAmount: Math.round(monthlyAmount * 0.65),
          refuseAmount: 220,
          waterAmount: 250,
          sewerAmount: 180,
          vatAmount: Math.round(monthlyAmount * 0.1),
          paid: false,
          dueDate: '31 Oct 2026',
        },
      ],
      history: [
        {
          id: `h-new-1`,
          date: '31 Oct 2026',
          desc: 'Initial Municipal Rates Assessment',
          amount: monthlyAmount,
          type: 'charge',
          status: 'Unpaid',
        },
      ],
      inbox: [
        {
          id: `msg-new-1`,
          title: 'Welcome to eThekwini Municipal Rates Portal',
          date: 'Today',
          body: 'Your property account has been enrolled in the municipal valuation ledger.',
          read: false,
          tag: 'Notice',
        },
      ],
    };

    onAddAccount(newAccount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg">Add Property Account</h3>
              <p className="text-xs text-slate-400">Enroll new ratepayer into General Valuation Roll</p>
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
              Ratepayer Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sindi Ndlovu"
              required
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              13-Digit SA ID Number
            </label>
            <input
              type="text"
              value={saIdNumber}
              onChange={(e) => setSaIdNumber(e.target.value)}
              placeholder="e.g. 9102035000084"
              required
              pattern="[0-9]{13}"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Physical Street Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 74 Innes Road"
                required
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Suburb / Area
              </label>
              <input
                type="text"
                value={suburb}
                onChange={(e) => setSuburb(e.target.value)}
                placeholder="Morningside, Durban"
                required
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Rating Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="Residential">Residential</option>
                <option value="Sectional Title">Sectional Title</option>
                <option value="Commercial">Commercial</option>
                <option value="Vacant Land">Vacant Land</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Certified Valuation (ZAR)
              </label>
              <input
                type="number"
                step="50000"
                value={valuation}
                onChange={(e) => setValuation(parseFloat(e.target.value) || 0)}
                required
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Initial Assessment Amount (ZAR)
            </label>
            <input
              type="number"
              step="10"
              value={monthlyAmount}
              onChange={(e) => setMonthlyAmount(parseFloat(e.target.value) || 0)}
              required
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create & Register Ratepayer Account</span>
          </button>
        </form>
      </div>
    </div>
  );
};
