import React, { useState } from 'react';
import { INITIAL_ACCOUNTS, ADMIN_USERS, INITIAL_ADMIN_NOTIFICATIONS } from './data/mockData';
import { RatepayerAccount, AdminUser, MonthlyRate, AdminNotification } from './types';
import { Navbar } from './components/Navbar';
import { SearchHero } from './components/SearchHero';
import { ResidentDashboard } from './components/ResidentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { PaymentModal } from './components/PaymentModal';
import { ValuationObjectionModal } from './components/ValuationObjectionModal';
import { RatesCalculatorModal } from './components/RatesCalculatorModal';
import { MunicipalInboxModal } from './components/MunicipalInboxModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { ResidentAuthModal } from './components/ResidentAuthModal';
import { ClearanceModal } from './components/ClearanceModal';
import { EditAccountModal } from './components/EditAccountModal';
import { NewAccountModal } from './components/NewAccountModal';
import { AiScanModal } from './components/AiScanModal';
import { AIChatDrawer } from './components/AIChatDrawer';
import { Building2, Phone, Mail, MapPin, ShieldCheck, ExternalLink } from 'lucide-react';

export default function App() {
  const [accounts, setAccounts] = useState<RatepayerAccount[]>(INITIAL_ACCOUNTS);
  const [activeAccount, setActiveAccount] = useState<RatepayerAccount | null>(null);
  const [currentView, setCurrentView] = useState<'search' | 'resident' | 'admin'>('search');

  // Auth states
  const [loggedInResident, setLoggedInResident] = useState<RatepayerAccount | null>(null);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [adminNotifications, setAdminNotifications] = useState<AdminNotification[]>(INITIAL_ADMIN_NOTIFICATIONS);

  // Modals
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentSpecificAmount, setPaymentSpecificAmount] = useState<number | undefined>(undefined);
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isResidentAuthOpen, setIsResidentAuthOpen] = useState(false);
  const [isAiScanOpen, setIsAiScanOpen] = useState(false);
  const [isNewAccountOpen, setIsNewAccountOpen] = useState(false);

  // Edit / Clearance selected
  const [editingAccount, setEditingAccount] = useState<RatepayerAccount | null>(null);
  const [clearanceAccount, setClearanceAccount] = useState<RatepayerAccount | null>(null);
  const [clearanceMonth, setClearanceMonth] = useState<MonthlyRate | null>(null);

  // AI Chat
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [aiChatInitialQuery, setAiChatInitialQuery] = useState('');

  // Handle Account Lookup
  const handleSearch = (query: string) => {
    const clean = query.trim().toLowerCase();
    const found = accounts.find(
      (a) => a.accNo === clean || a.saIdNumber === clean || a.name.toLowerCase().includes(clean)
    );

    if (found) {
      setActiveAccount(found);
      setCurrentView('resident');
    } else {
      // Create on-the-fly realistic account if user types a new ID or number
      const generated: RatepayerAccount = {
        accNo: query.length === 9 ? query : '849302810',
        saIdNumber: query.length === 13 ? query : '9001015000081',
        name: 'Resident Ratepayer',
        email: 'resident@umhlathuze.gov.za',
        phone: '+27 82 123 4567',
        address: '45 Pelikaan Parade',
        suburb: 'Meerensee, Richards Bay, 3901',
        propertyCategory: 'Residential',
        marketValuation: 1850000,
        exemptionRebate: 350000,
        balance: 2420.50,
        dueDate: '31 Oct 2026',
        lastPayment: 2100.00,
        lastPaymentDate: '28 Sep 2026',
        status: '30 Days',
        monthlyRates: [
          {
            id: 'mr-gen-1',
            month: 'October 2026',
            amount: 2420.50,
            ratesAmount: 1562.50,
            refuseAmount: 220.00,
            waterAmount: 380.00,
            sewerAmount: 180.00,
            vatAmount: 78.00,
            paid: false,
            dueDate: '31 Oct 2026',
          },
        ],
        history: [
          {
            id: 'h-gen-1',
            date: '31 Oct 2026',
            desc: 'Monthly Rates & Water Assessment (October 2026)',
            amount: 2420.50,
            type: 'charge',
            status: 'Unpaid',
          },
        ],
        inbox: [
          {
            id: 'msg-gen-1',
            title: 'Welcome to uMhlathuze Municipal Rates Portal',
            date: 'Today',
            body: 'Account successfully located in the municipal billing ledger.',
            read: false,
            tag: 'Notice',
          },
        ],
      };

      setAccounts((prev) => [generated, ...prev]);
      setActiveAccount(generated);
      setCurrentView('resident');
    }
  };

  // Trigger from AI search bar
  const handleTriggerGlobalAiSearch = (query: string) => {
    setAiChatInitialQuery(query);
    setIsAiChatOpen(true);
  };

  // Resident Login
  const handleResidentLogin = (idNumber: string): boolean => {
    const acc = accounts.find((a) => a.saIdNumber === idNumber || a.accNo === idNumber);
    if (acc) {
      setLoggedInResident(acc);
      setActiveAccount(acc);
      setCurrentView('resident');
      return true;
    }
    return false;
  };

  // Resident Register
  const handleResidentRegister = (newProfile: Partial<RatepayerAccount>) => {
    const newAcc: RatepayerAccount = {
      accNo: Math.floor(100000000 + Math.random() * 900000000).toString(),
      saIdNumber: newProfile.saIdNumber || '9001015000081',
      name: newProfile.name || 'Resident',
      email: `${(newProfile.name || 'resident').toLowerCase().replace(/\s+/g, '.')}@example.co.za`,
      phone: '+27 82 555 1234',
      address: newProfile.address || '10 Coast Road',
      suburb: newProfile.suburb || 'Meerensee, Richards Bay',
      propertyCategory: 'Residential',
      marketValuation: 1650000,
      exemptionRebate: 350000,
      balance: 1625.00,
      dueDate: '31 Oct 2026',
      lastPayment: 0,
      lastPaymentDate: 'N/A',
      status: 'Current',
      monthlyRates: [
        {
          id: `mr-reg-1`,
          month: 'October 2026',
          amount: 1625.00,
          ratesAmount: 1100.00,
          refuseAmount: 220.00,
          waterAmount: 180.00,
          sewerAmount: 125.00,
          vatAmount: 0.00,
          paid: false,
          dueDate: '31 Oct 2026',
        },
      ],
      history: [
        {
          id: `h-reg-1`,
          date: '31 Oct 2026',
          desc: 'Initial Residential Rates Assessment',
          amount: 1625.00,
          type: 'charge',
          status: 'Unpaid',
        },
      ],
      inbox: [
        {
          id: `msg-reg-1`,
          title: 'Resident Profile Created Successfully',
          date: 'Today',
          body: 'Your municipal online account is now active. You may view and pay rates online.',
          read: false,
          tag: 'Notice',
        },
      ],
    };

    setAccounts((prev) => [newAcc, ...prev]);
    setLoggedInResident(newAcc);
    setActiveAccount(newAcc);
    setCurrentView('resident');
  };

  // Payment Success Handler
  const handlePaymentSuccess = (amountPaid: number, method: string) => {
    if (!activeAccount) return;

    const remainingBal = Math.max(0, activeAccount.balance - amountPaid);
    const updatedMonthlyRates = activeAccount.monthlyRates.map((mr) => ({
      ...mr,
      paid: true,
      paidDate: new Date().toLocaleDateString('en-ZA'),
    }));

    const updatedAccount: RatepayerAccount = {
      ...activeAccount,
      balance: remainingBal,
      lastPayment: amountPaid,
      lastPaymentDate: new Date().toLocaleDateString('en-ZA'),
      status: remainingBal === 0 ? 'Paid Up' : 'Current',
      monthlyRates: updatedMonthlyRates,
      history: [
        {
          id: `h-pay-${Date.now()}`,
          date: new Date().toLocaleDateString('en-ZA'),
          desc: `${method} Payment Cleared - Thank You`,
          amount: amountPaid,
          type: 'payment',
          status: 'Cleared',
        },
        ...activeAccount.history,
      ],
      inbox: [
        {
          id: `msg-pay-${Date.now()}`,
          title: 'Payment Confirmation Received',
          date: 'Today',
          body: `Thank you! Your payment of R ${amountPaid.toFixed(2)} has cleared successfully via ${method}.`,
          read: false,
          tag: 'Payment',
        },
        ...activeAccount.inbox,
      ],
    };

    setActiveAccount(updatedAccount);
    setAccounts((prev) => prev.map((a) => (a.accNo === updatedAccount.accNo ? updatedAccount : a)));
  };

  // Master Clearance (Sonke exclusive)
  const handleClearAccount = (accNo: string) => {
    if (currentAdmin?.username.toLowerCase() !== 'sonke') return;

    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.accNo === accNo) {
          const clearedRates = acc.monthlyRates.map((m) => ({ ...m, paid: true }));
          return {
            ...acc,
            balance: 0,
            status: 'Paid Up',
            monthlyRates: clearedRates,
          };
        }
        return acc;
      })
    );

    if (activeAccount?.accNo === accNo) {
      setActiveAccount((prev) =>
        prev
          ? {
              ...prev,
              balance: 0,
              status: 'Paid Up',
              monthlyRates: prev.monthlyRates.map((m) => ({ ...m, paid: true })),
            }
          : null
      );
    }
  };

  // Save edits
  const handleSaveEditedAccount = (updated: RatepayerAccount) => {
    setAccounts((prev) => prev.map((a) => (a.accNo === updated.accNo ? updated : a)));
    if (activeAccount?.accNo === updated.accNo) {
      setActiveAccount(updated);
    }
  };

  // Add new account
  const handleAddNewAccount = (newAcc: RatepayerAccount) => {
    setAccounts((prev) => [newAcc, ...prev]);
  };

  // Dispatched notices from AI Scan
  const handleDispatchedNotices = () => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.balance > 0) {
          return {
            ...acc,
            inbox: [
              {
                id: `ai-notice-${Date.now()}`,
                title: 'Gemini AI Arrears Notice: 50% Debt Relief Incentive',
                date: 'Today',
                body: `Outstanding rates of R ${acc.balance.toLocaleString('en-ZA', {
                  minimumFractionDigits: 2,
                })} are due. Settle now or arrange an approved AOD before Nov 30 to qualify for the 50% interest write-off incentive.`,
                read: false,
                tag: 'Relief Incentive',
              },
              ...acc.inbox,
            ],
          };
        }
        return acc;
      })
    );
  };

  // Inbox counts: if admin logged in, show admin unread notifications; otherwise resident/account unread
  const currentInboxMessages = activeAccount ? activeAccount.inbox : accounts[0]?.inbox || [];
  const residentUnreadCount = currentInboxMessages.filter((m) => !m.read).length;
  const adminUnreadCount = adminNotifications.filter((n) => !n.read).length;
  const unreadCount = currentAdmin ? adminUnreadCount : residentUnreadCount;

  const handleMarkAllInboxRead = () => {
    if (activeAccount) {
      const readInbox = activeAccount.inbox.map((m) => ({ ...m, read: true }));
      const updated = { ...activeAccount, inbox: readInbox };
      setActiveAccount(updated);
      setAccounts((prev) => prev.map((a) => (a.accNo === updated.accNo ? updated : a)));
    } else {
      setAccounts((prev) =>
        prev.map((a) => ({
          ...a,
          inbox: a.inbox.map((m) => ({ ...m, read: true })),
        }))
      );
    }
  };

  const handleMarkInboxRead = (id: string) => {
    if (activeAccount) {
      const readInbox = activeAccount.inbox.map((m) => (m.id === id ? { ...m, read: true } : m));
      const updated = { ...activeAccount, inbox: readInbox };
      setActiveAccount(updated);
      setAccounts((prev) => prev.map((a) => (a.accNo === updated.accNo ? updated : a)));
    } else {
      setAccounts((prev) =>
        prev.map((a) => ({
          ...a,
          inbox: a.inbox.map((m) => (m.id === id ? { ...m, read: true } : m)),
        }))
      );
    }
  };

  // Clear read messages from inbox
  const handleClearReadMessages = () => {
    if (activeAccount) {
      const clearedInbox = activeAccount.inbox.filter((m) => !m.read);
      const updated = { ...activeAccount, inbox: clearedInbox };
      setActiveAccount(updated);
      setAccounts((prev) => prev.map((a) => (a.accNo === updated.accNo ? updated : a)));
    } else {
      setAccounts((prev) =>
        prev.map((a) => ({
          ...a,
          inbox: a.inbox.filter((m) => !m.read),
        }))
      );
    }
  };

  // Mark message as ready and clear from inbox once viewed
  const handleViewAndClearMessage = (id: string) => {
    if (activeAccount) {
      const clearedInbox = activeAccount.inbox.filter((m) => m.id !== id);
      const updated = { ...activeAccount, inbox: clearedInbox };
      setActiveAccount(updated);
      setAccounts((prev) => prev.map((a) => (a.accNo === updated.accNo ? updated : a)));
    } else {
      setAccounts((prev) =>
        prev.map((a) => ({
          ...a,
          inbox: a.inbox.filter((m) => m.id !== id),
        }))
      );
    }
  };

  // Mark all messages as ready and clear inbox
  const handleMarkAllReadyAndClear = () => {
    if (activeAccount) {
      const updated = { ...activeAccount, inbox: [] };
      setActiveAccount(updated);
      setAccounts((prev) => prev.map((a) => (a.accNo === updated.accNo ? updated : a)));
    } else {
      setAccounts((prev) =>
        prev.map((a) => ({
          ...a,
          inbox: [],
        }))
      );
    }
  };

  // Restore sample demo messages for testing
  const handleRestoreInboxMessages = () => {
    const sampleInbox = [
      {
        id: `msg-rst-1`,
        title: '2026 General Valuation Roll (GV2026) Published',
        date: '15 Oct 2026',
        body: 'Your municipal property valuation is open for public inspection. Objections close 30 Nov 2026.',
        read: false,
        ready: false,
        tag: 'Notice' as const,
      },
      {
        id: `msg-rst-2`,
        title: 'uMhlathuze 100% Interest Amnesty Incentive',
        date: '10 Oct 2026',
        body: 'Settle historical rates balance in full or establish a debit order to receive immediate 100% interest write-off.',
        read: false,
        ready: false,
        tag: 'Relief Incentive' as const,
      },
      {
        id: `msg-rst-3`,
        title: 'Payment Confirmation: Rates & Refuse Assessment',
        date: '28 Sep 2026',
        body: 'Receipt UMH-REC-008492 for R2,100.00 successfully allocated to account.',
        read: false,
        ready: false,
        tag: 'Payment' as const,
      },
    ];

    if (activeAccount) {
      const updated = { ...activeAccount, inbox: sampleInbox };
      setActiveAccount(updated);
      setAccounts((prev) => prev.map((a) => (a.accNo === updated.accNo ? updated : a)));
    } else {
      setAccounts((prev) =>
        prev.map((a) => ({
          ...a,
          inbox: sampleInbox,
        }))
      );
    }
  };

  // Admin Notification handlers
  const handleMarkAdminNotificationRead = (id: string) => {
    setAdminNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, read: true, ready: true, readBy: currentAdmin?.displayName || 'Admin' }
          : n
      )
    );
  };

  const handleMarkAllAdminNotificationsRead = () => {
    setAdminNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        read: true,
        ready: true,
        readBy: currentAdmin?.displayName || 'Admin',
      }))
    );
  };

  const handleClearReadAdminNotifications = () => {
    setAdminNotifications((prev) => prev.filter((n) => !n.read));
  };

  // Mark admin notification as ready and clear from admin message bar once viewed
  const handleViewAndClearAdminNotification = (id: string) => {
    setAdminNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Mark all admin notifications as ready and clear admin message bar
  const handleMarkAllAdminReadyAndClear = () => {
    setAdminNotifications([]);
  };

  // Restore sample admin notifications for testing
  const handleRestoreAdminNotifications = () => {
    setAdminNotifications(INITIAL_ADMIN_NOTIFICATIONS);
  };

  // AI topics
  const handleAskAiTopic = (topic: string) => {
    if (topic === 'valuation') {
      setAiChatInitialQuery('Can you explain how my municipal property valuation in the City of uMhlathuze is calculated and how I can lodge a Section 49 objection if needed?');
    } else if (topic === 'billing') {
      setAiChatInitialQuery('Could you analyze my recent municipal billing history and summarize my account status?');
    }
    setIsAiChatOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0c1222] text-slate-100 antialiased selection:bg-sky-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentAdmin={currentAdmin}
        loggedInResident={loggedInResident}
        unreadCount={unreadCount}
        onGoHome={() => {
          setCurrentView('search');
          setActiveAccount(null);
        }}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenResidentAuth={() => setIsResidentAuthOpen(true)}
        onOpenInbox={() => setIsInboxOpen(true)}
        onLogoutAdmin={() => {
          setCurrentAdmin(null);
          setCurrentView('search');
        }}
        onLogoutResident={() => {
          setLoggedInResident(null);
          setCurrentView('search');
          setActiveAccount(null);
        }}
        onTriggerGlobalAiSearch={handleTriggerGlobalAiSearch}
      />

      {/* Main Body */}
      <main className="flex-1 flex flex-col items-center">
        {currentView === 'search' && (
          <SearchHero
            onSearch={handleSearch}
            accounts={accounts}
            onOpenCalculator={() => setIsCalculatorOpen(true)}
          />
        )}

        {currentView === 'resident' && activeAccount && (
          <ResidentDashboard
            account={activeAccount}
            onResetSearch={() => {
              setCurrentView('search');
              setActiveAccount(null);
            }}
            onOpenPayment={(amt) => {
              setPaymentSpecificAmount(amt);
              setIsPaymentOpen(true);
            }}
            onAskAi={handleAskAiTopic}
            onOpenDisputeModal={() => setIsDisputeOpen(true)}
            onOpenCalculator={() => setIsCalculatorOpen(true)}
            onOpenInbox={() => setIsInboxOpen(true)}
            onMarkAllInboxRead={handleMarkAllInboxRead}
            onClearReadMessages={handleClearReadMessages}
            onViewAndClearMessage={handleViewAndClearMessage}
            onMarkAllReadyAndClear={handleMarkAllReadyAndClear}
            onRestoreMessages={handleRestoreInboxMessages}
          />
        )}

        {currentView === 'admin' && currentAdmin && (
          <AdminDashboard
            currentAdmin={currentAdmin}
            accounts={accounts}
            adminNotifications={adminNotifications}
            onLogout={() => {
              setCurrentAdmin(null);
              setCurrentView('search');
            }}
            onOpenEditAccount={(acc) => {
              setEditingAccount(acc);
            }}
            onOpenNewAccountModal={() => setIsNewAccountOpen(true)}
            onClearAccount={handleClearAccount}
            onOpenClearanceModal={(acc, month) => {
              setClearanceAccount(acc);
              setClearanceMonth(month);
            }}
            onRunAiScan={() => setIsAiScanOpen(true)}
            onMarkAdminNotificationRead={handleMarkAdminNotificationRead}
            onMarkAllAdminNotificationsRead={handleMarkAllAdminNotificationsRead}
            onClearReadAdminNotifications={handleClearReadAdminNotifications}
            onViewAndClearAdminNotification={handleViewAndClearAdminNotification}
            onMarkAllAdminReadyAndClear={handleMarkAllAdminReadyAndClear}
            onRestoreAdminNotifications={handleRestoreAdminNotifications}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-10 text-xs text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-white text-sm">City of uMhlathuze</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Official Municipal Rates & Taxes Self-Service Portal. Richards Bay Civic Centre, KwaZulu-Natal, South Africa.
              </p>
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                <ShieldCheck className="w-4 h-4" /> MPRA & POPIA Fully Compliant
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-3">Customer Support</h4>
              <ul className="space-y-2 text-[11px]">
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-sky-400" />
                  <span>Call Centre: <strong>035 907 5000 / 0800 22 28 27</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-sky-400" />
                  <span>rates@umhlathuze.gov.za</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  <span>Civic Offices, 5 Mark Strasse, Richards Bay, 3900</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-3">Statutory Regulations</h4>
              <ul className="space-y-1.5 text-[11px] text-slate-400">
                <li>• Municipal Property Rates Act (MPRA 6 of 2004)</li>
                <li>• General Valuation Roll (GV2022 / GV2026)</li>
                <li>• Section 118 Municipal Systems Act Clearance</li>
                <li>• uMhlathuze Credit Control & Debt Relief Policy</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-3">Staff & System Administration</h4>
              <p className="text-[11px] text-slate-400 mb-3">
                Authorized revenue officers may sign in to access debtor ledgers, dispute reviews, and digital seals.
              </p>
              <button
                onClick={() => setIsAdminLoginOpen(true)}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
              >
                <span>Staff Portal Access</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-500">
            <p>© 2026 City of uMhlathuze. All rights reserved.</p>
            <p>Powered by Gemini 3.8 Flash AI Municipal Intelligence</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {activeAccount && (
        <>
          <PaymentModal
            isOpen={isPaymentOpen}
            onClose={() => {
              setIsPaymentOpen(false);
              setPaymentSpecificAmount(undefined);
            }}
            account={activeAccount}
            defaultAmount={paymentSpecificAmount}
            onPaymentSuccess={handlePaymentSuccess}
          />
          <ValuationObjectionModal
            isOpen={isDisputeOpen}
            onClose={() => setIsDisputeOpen(false)}
            account={activeAccount}
          />
        </>
      )}

      <RatesCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      <MunicipalInboxModal
        isOpen={isInboxOpen}
        onClose={() => setIsInboxOpen(false)}
        messages={currentInboxMessages}
        onMarkAllAsRead={handleMarkAllInboxRead}
        onMarkAsRead={handleMarkInboxRead}
        onClearReadMessages={handleClearReadMessages}
        onViewAndClearMessage={handleViewAndClearMessage}
        onMarkAllReadyAndClear={handleMarkAllReadyAndClear}
        onRestoreMessages={handleRestoreInboxMessages}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={(admin) => {
          setCurrentAdmin(admin);
          setCurrentView('admin');
        }}
      />

      <ResidentAuthModal
        isOpen={isResidentAuthOpen}
        onClose={() => setIsResidentAuthOpen(false)}
        onLogin={handleResidentLogin}
        onRegister={handleResidentRegister}
      />

      <ClearanceModal
        isOpen={!!clearanceAccount && !!clearanceMonth}
        onClose={() => {
          setClearanceAccount(null);
          setClearanceMonth(null);
        }}
        account={clearanceAccount}
        month={clearanceMonth}
        currentAdmin={currentAdmin}
      />

      <EditAccountModal
        isOpen={!!editingAccount}
        onClose={() => setEditingAccount(null)}
        account={editingAccount}
        onSave={handleSaveEditedAccount}
      />

      <NewAccountModal
        isOpen={isNewAccountOpen}
        onClose={() => setIsNewAccountOpen(false)}
        onAddAccount={handleAddNewAccount}
      />

      <AiScanModal
        isOpen={isAiScanOpen}
        onClose={() => setIsAiScanOpen(false)}
        accounts={accounts}
        onDispatchedNotices={handleDispatchedNotices}
      />

      {/* Floating Gemini AI Municipal Advisor Drawer */}
      <AIChatDrawer
        isOpen={isAiChatOpen}
        onToggle={() => setIsAiChatOpen(!isAiChatOpen)}
        account={activeAccount}
        initialQuery={aiChatInitialQuery}
      />
    </div>
  );
}
