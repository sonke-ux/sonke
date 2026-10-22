export interface MonthlyRate {
  id: string;
  month: string;
  amount: number;
  ratesAmount: number;
  refuseAmount: number;
  waterAmount: number;
  sewerAmount: number;
  vatAmount: number;
  paid: boolean;
  dueDate: string;
  paidDate?: string;
  receiptNumber?: string;
}

export interface BillingHistoryItem {
  id: string;
  date: string;
  desc: string;
  amount: number;
  type: 'charge' | 'payment';
  status: 'Unpaid' | 'Cleared';
}

export interface InboxMessage {
  id: string;
  title: string;
  date: string;
  body: string;
  read: boolean;
  tag: 'Notice' | 'Relief Incentive' | 'Security' | 'Payment';
}

export interface RatepayerAccount {
  accNo: string;
  saIdNumber: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  suburb: string;
  propertyCategory: 'Residential' | 'Commercial' | 'Sectional Title' | 'Vacant Land';
  marketValuation: number;
  exemptionRebate: number;
  balance: number;
  dueDate: string;
  lastPayment: number;
  lastPaymentDate: string;
  status: 'Current' | '30 Days' | '60 Days' | '90+ Days' | 'Paid Up' | 'Under Objection';
  monthlyRates: MonthlyRate[];
  history: BillingHistoryItem[];
  inbox: InboxMessage[];
}

export type StaffRole = 'admin' | 'staff';

export interface AdminUser {
  username: string;
  displayName: string;
  role: StaffRole;
  title: string;
  canStampAndSign: boolean;
  canClearArrears: boolean;
}
