import React, { useState } from 'react';
import { X, CreditCard, Landmark, QrCode, Lock, CheckCircle2, Download, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { RatepayerAccount } from '../types';
import { formatZAR, generatePaymentReceiptPDF } from '../utils/pdfGenerator';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: RatepayerAccount;
  defaultAmount?: number;
  onPaymentSuccess: (amount: number, method: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  account,
  defaultAmount,
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'instant_eft' | 'qr'>('card');
  const [selectedBank, setSelectedBank] = useState<string>('Capitec');
  const [amount, setAmount] = useState<number>(defaultAmount || account.balance);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState('');

  if (!isOpen) return null;

  const handlePay = () => {
    if (amount <= 0) return;
    setIsProcessing(true);
    setProcessingStep('Connecting to City of uMhlathuze Municipal Treasury gateway...');

    setTimeout(() => {
      setProcessingStep('Authorizing secure bank transaction & 3D Secure...');
    }, 900);

    setTimeout(() => {
      setProcessingStep('Reconciling municipal ledger & updating ratepayer balance...');
    }, 1800);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      const generatedReceipt = `UMH-REC-${Math.floor(100000 + Math.random() * 900000)}`;
      setReceiptNumber(generatedReceipt);

      // Trigger Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0ea5e9', '#10b981', '#f59e0b', '#3b82f6'],
        });
      } catch (e) {
        // Fallback silently if canvas-confetti is not available
      }

      const methodLabel =
        selectedMethod === 'card'
          ? 'Credit / Debit Card'
          : selectedMethod === 'instant_eft'
          ? `Instant EFT (${selectedBank})`
          : 'Zapper / Masterpass QR';

      onPaymentSuccess(amount, methodLabel);
    }, 2700);
  };

  const handleDownloadReceipt = () => {
    generatePaymentReceiptPDF(
      account,
      amount,
      selectedMethod === 'card' ? 'Visa / Mastercard' : `Instant EFT (${selectedBank})`,
      receiptNumber || 'UMH-REC-994123'
    );
  };

  const handleClose = () => {
    setIsSuccess(false);
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/90">
          <div>
            <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-sky-400" />
              <span>City of uMhlathuze Secure Rates Payment</span>
            </h3>
            <p className="text-xs text-slate-400">Account #{account.accNo} • {account.name}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            /* Success State */
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-extrabold text-white mb-1">Payment Processed Successfully!</h4>
              <p className="text-xs text-slate-400 max-w-sm mb-6">
                Your payment of <strong className="text-emerald-400">{formatZAR(amount)}</strong> has cleared and has been credited to municipal account #{account.accNo}.
              </p>

              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 w-full mb-6 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Receipt Reference:</span>
                  <strong className="text-white font-mono">{receiptNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Gateway:</span>
                  <span className="text-slate-200">City of uMhlathuze Electronic Clearing System</span>
                </div>
                <div className="flex justify-between border-t border-slate-700/60 pt-2">
                  <span className="text-slate-400">Ledger Status:</span>
                  <span className="text-emerald-400 font-bold">RECONCILED & UPDATED</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  onClick={handleDownloadReceipt}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-sky-500 hover:bg-sky-400 text-white transition cursor-pointer flex items-center justify-center gap-2 shadow"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Receipt</span>
                </button>
                <button
                  onClick={handleClose}
                  className="py-3 px-6 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : isProcessing ? (
            /* Processing State */
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Loader2 className="w-12 h-12 text-sky-400 animate-spin mb-4" />
              <h4 className="font-extrabold text-white text-base mb-1">Processing Payment...</h4>
              <p className="text-xs text-slate-400 font-mono animate-pulse">{processingStep}</p>
            </div>
          ) : (
            /* Payment Selection Form */
            <div className="flex flex-col gap-6">
              
              {/* Amount Box */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-400 font-medium">Payment Amount (ZAR)</span>
                  <p className="text-xs text-slate-500">Outstanding: {formatZAR(account.balance)}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold text-slate-300">R</span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max={account.balance || 100000}
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-32 py-1.5 px-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-extrabold text-right focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 block">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  
                  {/* Option 1: Card */}
                  <label
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition cursor-pointer ${
                      selectedMethod === 'card'
                        ? 'bg-sky-500/10 border-sky-500 text-white'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-xs">Credit / Debit Card</p>
                        <p className="text-[11px] text-slate-400">Visa, Mastercard, American Express</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="payment_method"
                      checked={selectedMethod === 'card'}
                      onChange={() => setSelectedMethod('card')}
                      className="text-sky-500 focus:ring-sky-500"
                    />
                  </label>

                  {/* Option 2: Instant EFT */}
                  <label
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition cursor-pointer ${
                      selectedMethod === 'instant_eft'
                        ? 'bg-emerald-500/10 border-emerald-500 text-white'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                        <Landmark className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-xs">Instant EFT (Ozow / Capitec Pay)</p>
                        <p className="text-[11px] text-slate-400">Capitec, FNB, Standard Bank, Nedbank, Absa</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="payment_method"
                      checked={selectedMethod === 'instant_eft'}
                      onChange={() => setSelectedMethod('instant_eft')}
                      className="text-emerald-500 focus:ring-emerald-500"
                    />
                  </label>

                  {/* Bank selector if Instant EFT */}
                  {selectedMethod === 'instant_eft' && (
                    <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                      <span className="text-slate-400">Select Bank:</span>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="Capitec">Capitec Bank</option>
                        <option value="FNB">First National Bank (FNB)</option>
                        <option value="Standard Bank">Standard Bank</option>
                        <option value="Nedbank">Nedbank</option>
                        <option value="Absa">Absa</option>
                        <option value="TymeBank">TymeBank</option>
                      </select>
                    </div>
                  )}

                  {/* Option 3: Masterpass / Zapper QR */}
                  <label
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition cursor-pointer ${
                      selectedMethod === 'qr'
                        ? 'bg-purple-500/10 border-purple-500 text-white'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-xs">Scan to Pay (Zapper / Masterpass)</p>
                        <p className="text-[11px] text-slate-400">Scan QR code using banking mobile app</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="payment_method"
                      checked={selectedMethod === 'qr'}
                      onChange={() => setSelectedMethod('qr')}
                      className="text-purple-500 focus:ring-purple-500"
                    />
                  </label>
                </div>
              </div>

              {/* Submit */}
              <button
                type="button"
                onClick={handlePay}
                disabled={amount <= 0}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>Confirm Payment of {formatZAR(amount)}</span>
              </button>

              <p className="text-[11px] text-center text-slate-500 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" /> 256-Bit SSL Encrypted Municipal Payment Gateway
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
