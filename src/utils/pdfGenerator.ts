import jsPDF from 'jspdf';
import { RatepayerAccount, MonthlyRate } from '../types';

export const formatZAR = (amount: number): string => {
  return 'R ' + amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const generateOfficialClearancePDF = (
  account: RatepayerAccount,
  monthRate: MonthlyRate,
  customText: string,
  isOfficiallyStamped: boolean,
  adminName: string = 'Sonke'
) => {
  const doc = new jsPDF();
  const certNumber = `UMH-CLR-${account.accNo}-${Date.now().toString().slice(-6)}`;
  const issueDate = new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });

  // Top Civic Header Banner
  doc.setFillColor(11, 37, 69); // Dark civic navy
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('CITY OF UMHLATHUZE', 105, 12, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('REVENUE & TREASURY MANAGEMENT CLUSTER • RATES & SERVICES • RICHARDS BAY', 105, 19, { align: 'center' });

  doc.setDrawColor(212, 175, 55); // Gold accent line
  doc.setLineWidth(1);
  doc.line(15, 28, 195, 28);

  // Certificate Heading
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('OFFICIAL MUNICIPAL RATES & CLEARANCE CERTIFICATE', 105, 42, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Issued in terms of Section 118 of the Local Government: Municipal Systems Act (Act 32 of 2000)`, 105, 48, { align: 'center' });

  // Certificate Metadata Bar
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, 54, 180, 16, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`Certificate No:`, 20, 64);
  doc.setFont('helvetica', 'normal');
  doc.text(certNumber, 45, 64);

  doc.setFont('helvetica', 'bold');
  doc.text(`Issue Date:`, 110, 64);
  doc.setFont('helvetica', 'normal');
  doc.text(issueDate, 130, 64);

  // Property & Account Table
  doc.setFillColor(241, 245, 249);
  doc.rect(15, 76, 180, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('PROPERTY & RATEPAYER PARTICULARS', 20, 82);

  const leftX = 20;
  const colValX = 65;
  let curY = 92;

  const row = (label: string, value: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(label, leftX, curY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(value, colValX, curY);
    curY += 6.5;
  };

  row('Ratepayer Account Number:', account.accNo);
  row('Registered Account Holder:', account.name);
  row('SA Identity / Registration No:', account.saIdNumber);
  row('Physical Property Address:', account.address + ', ' + account.suburb);
  row('Property Rating Category:', account.propertyCategory);
  row('Certified General Valuation:', formatZAR(account.marketValuation));
  row('Billing Assessment Month:', monthRate.month);
  row('Total Cleared Amount:', formatZAR(monthRate.amount));

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.line(15, curY + 2, 195, curY + 2);
  curY += 10;

  // Certification Statement
  doc.setFillColor(241, 245, 249);
  doc.rect(15, curY, 180, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('MUNICIPAL CERTIFICATION & CLEARANCE DECLARATION', 20, curY + 6);
  curY += 14;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  const defaultCertStatement =
    customText ||
    `This document officially certifies that all municipal rates, property taxes, refuse removal charges, sewer tariffs, and water services levies prescribed under the Local Government: Municipal Property Rates Act 6 of 2004 for the above property have been fully assessed and settled for ${monthRate.month}.\n\nNo outstanding municipal debts remain for the specified assessment period. This certificate is registered in the official revenue database of the City of uMhlathuze.`;

  const splitNotice = doc.splitTextToSize(defaultCertStatement, 175);
  doc.text(splitNotice, 18, curY);
  curY += splitNotice.length * 4.5 + 10;

  // Stamping and Signature Section
  if (isOfficiallyStamped && adminName.toLowerCase() === 'sonke') {
    // Official Red Administrative Municipal Seal
    const sealX = 148;
    const sealY = curY + 20;

    doc.setDrawColor(220, 38, 38); // Red
    doc.setLineWidth(1.6);
    doc.circle(sealX, sealY, 24);
    doc.setLineWidth(0.6);
    doc.circle(sealX, sealY, 21.5);

    doc.setTextColor(220, 38, 38);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('CITY OF UMHLATHUZE', sealX, sealY - 11, { align: 'center' });
    doc.setFontSize(10);
    doc.text('OFFICIALLY', sealX, sealY - 4, { align: 'center' });
    doc.text('VERIFIED', sealX, sealY + 3, { align: 'center' });
    doc.setFontSize(8);
    doc.text('ADMINISTRATOR', sealX, sealY + 10, { align: 'center' });
    doc.setFontSize(7);
    doc.text('SONKE • SEC. 118', sealX, sealY + 15, { align: 'center' });

    // Official Signature Line
    doc.setDrawColor(71, 85, 105);
    doc.setLineWidth(0.5);
    doc.line(20, curY + 26, 85, curY + 26);

    // Calligraphic Signature Representation
    doc.setTextColor(15, 23, 42);
    doc.setFont('times', 'italic');
    doc.setFontSize(16);
    doc.text('Sonke N. (Admin)', 28, curY + 22);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('Authorized Delegated Authority', 20, curY + 31);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Chief Revenue Operations • City of uMhlathuze', 20, curY + 35);
    doc.text(`Digital Verification Timestamp: ${new Date().toISOString()}`, 20, curY + 39);
  } else {
    // Draft Copy Warning Watermark
    doc.setTextColor(203, 213, 225);
    doc.setFontSize(36);
    doc.setFont('helvetica', 'bold');
    doc.text('DRAFT COPY - FOR REVIEW ONLY', 105, curY + 24, { align: 'center', angle: 25 });

    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.5);
    doc.line(20, curY + 28, 85, curY + 28);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Pending Master Admin Sonke Official Verification Stamp', 20, curY + 34);
  }

  // Footer Security Code
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 282, 210, 15, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(`Official uMhlathuze Municipal Portal Document | Security Hash: SHA256-${account.accNo.slice(0, 4)}-${monthRate.id} | Richards Bay, 3900`, 105, 290, { align: 'center' });

  doc.save(`uMhlathuze_Clearance_${account.accNo}_${monthRate.month.replace(/\s+/g, '_')}.pdf`);
};

export const generateMonthlyStatementPDF = (
  account: RatepayerAccount,
  specificMonth?: MonthlyRate
) => {
  const doc = new jsPDF();
  const currentMonth = specificMonth || account.monthlyRates[0] || {
    id: 'mr-curr',
    month: 'Current Assessment',
    amount: account.balance,
    ratesAmount: Math.round(account.balance * 0.65),
    refuseAmount: 220.00,
    waterAmount: Math.round(account.balance * 0.15),
    sewerAmount: 180.00,
    vatAmount: Math.round(account.balance * 0.08),
    paid: account.balance === 0,
    dueDate: account.dueDate,
  };

  const invoiceNo = `UMH-STMT-${account.accNo}-${Date.now().toString().slice(-5)}`;
  const issueDate = new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });

  // 1. Top Civic Header Banner
  doc.setFillColor(11, 37, 69); // Dark civic navy
  doc.rect(0, 0, 210, 26, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('CITY OF UMHLATHUZE', 15, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('OFFICIAL MUNICIPAL STATEMENT OF ACCOUNT & TAX INVOICE', 15, 17);
  doc.text('Treasury Management & Municipal Services • Richards Bay, 3900 • VAT No: 4890123456', 15, 22);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(212, 175, 55); // Gold accent
  doc.text('MONTHLY STATEMENT', 195, 14, { align: 'right' });
  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225);
  doc.setFont('helvetica', 'normal');
  doc.text(`Tax Invoice: ${invoiceNo}`, 195, 20, { align: 'right' });

  // Gold accent rule
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(1);
  doc.line(15, 26, 195, 26);

  // 2. Ratepayer Info & Statement Particulars
  let curY = 35;

  // Left column: Ratepayer Details
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(account.name.toUpperCase(), 15, curY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Physical Address: ${account.address}`, 15, curY + 5.5);
  doc.text(`Postal / Area: ${account.suburb}`, 15, curY + 10.5);
  doc.text(`Identity / Reg Number: ${account.saIdNumber}`, 15, curY + 15.5);
  doc.text(`Property Category: ${account.propertyCategory}`, 15, curY + 20.5);

  // Right column: Statement Meta Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(120, 29, 75, 30, 2, 2, 'FD');

  const metaRow = (lbl: string, val: string, yPos: number, isAlert = false) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(lbl, 124, yPos);
    doc.setFont('helvetica', isAlert ? 'bold' : 'normal');
    doc.setTextColor(isAlert ? 220 : 15, isAlert ? 38 : 23, isAlert ? 38 : 42);
    doc.text(val, 160, yPos);
  };

  metaRow('Municipal Account:', account.accNo, 36);
  metaRow('Statement Date:', issueDate, 42);
  metaRow('Assessment Month:', currentMonth.month, 48);
  metaRow('Payment Due Date:', currentMonth.dueDate, 54, !currentMonth.paid);

  curY = 64;

  // 3. Valuation & Rebates Highlight Bar
  doc.setFillColor(241, 245, 249);
  doc.rect(15, curY, 180, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('PROPERTY VALUATION & STATUTORY REBATES PARTICULARS', 18, curY + 5.5);

  curY += 13;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Certified Market Valuation:`, 18, curY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(formatZAR(account.marketValuation), 62, curY);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Primary Property Rebate:`, 95, curY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 101, 52);
  doc.text(`- ${formatZAR(account.exemptionRebate)}`, 135, curY);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Rateable Net:`, 160, curY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(formatZAR(Math.max(0, account.marketValuation - account.exemptionRebate)), 182, curY);

  curY += 6;
  doc.setDrawColor(226, 232, 240);
  doc.line(15, curY, 195, curY);
  curY += 6;

  // 4. Financial Account Balance Summary Box (4 Columns)
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, curY, 180, 18, 2, 2, 'FD');

  const summaryCol = (title: string, val: string, xPos: number, isFinal = false) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(title.toUpperCase(), xPos, curY + 6);
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(isFinal ? (account.balance > 0 ? 220 : 22) : 15, isFinal ? (account.balance > 0 ? 38 : 101) : 23, isFinal ? (account.balance > 0 ? 38 : 52) : 42);
    doc.text(val, xPos, curY + 13);
  };

  const prevBalanceEstimate = Math.max(0, account.balance + account.lastPayment - currentMonth.amount);
  summaryCol('Previous Balance', formatZAR(prevBalanceEstimate), 18);
  summaryCol('Less: Last Payment', `- ${formatZAR(account.lastPayment)}`, 62);
  summaryCol('Current Assessment', formatZAR(currentMonth.amount), 110);
  summaryCol('Total Amount Due', formatZAR(account.balance), 155, true);

  curY += 24;

  // 5. Itemized Current Monthly Assessment Table
  doc.setFillColor(11, 37, 69);
  doc.rect(15, curY, 180, 7.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Service Item Description', 18, curY + 5);
  doc.text('Assessment Basis / Tariff Rate', 110, curY + 5);
  doc.text('Amount (ZAR)', 190, curY + 5, { align: 'right' });

  curY += 12;
  const lineRow = (desc: string, basis: string, amt: number) => {
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(desc, 18, curY);
    doc.text(basis, 110, curY);
    doc.setFont('helvetica', 'bold');
    doc.text(formatZAR(amt), 190, curY, { align: 'right' });
    doc.setDrawColor(241, 245, 249);
    doc.line(15, curY + 2.5, 195, curY + 2.5);
    curY += 7.5;
  };

  lineRow(`Property Rates Assessment (${currentMonth.month})`, `Tariff @ 0.0125 / Rand`, currentMonth.ratesAmount);
  lineRow('Domestic Solid Waste / Refuse Removal', 'Fixed Monthly Municipal Levies', currentMonth.refuseAmount);
  lineRow('uMhlathuze Water Supply & Availability Tariff', 'Metered Municipal Water Services', currentMonth.waterAmount);
  lineRow('Sewerage & Sanitation Effluent Charges', 'Standard Residential Tariff Basis', currentMonth.sewerAmount);
  lineRow('Value Added Tax (VAT @ 15%)', 'Applicable Statutory Municipal Levy', currentMonth.vatAmount);

  // Subtotal Bar
  doc.setFillColor(241, 245, 249);
  doc.rect(110, curY, 85, 12, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('Current Month Assessment Total:', 114, curY + 5.5);
  doc.setFontSize(11);
  doc.setTextColor(14, 116, 144);
  doc.text(formatZAR(currentMonth.amount), 190, curY + 6.5, { align: 'right' });

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Status: ${currentMonth.paid ? 'PAID & SETTLED' : 'DUE BY ' + currentMonth.dueDate}`, 114, curY + 10);

  curY += 18;

  // 6. Recent Transaction History Extract
  doc.setFillColor(241, 245, 249);
  doc.rect(15, curY, 180, 6.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('RECENT STATEMENT ACCOUNT LEDGER ENTRIES', 18, curY + 4.5);

  curY += 10;
  const recentHistory = account.history.slice(0, 3);
  recentHistory.forEach((hist) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(hist.date, 18, curY);
    doc.text(hist.desc, 45, curY);

    doc.setFont('helvetica', 'bold');
    if (hist.type === 'payment') {
      doc.setTextColor(22, 101, 52);
      doc.text(`- ${formatZAR(hist.amount)}`, 190, curY, { align: 'right' });
    } else {
      doc.setTextColor(30, 41, 59);
      doc.text(formatZAR(hist.amount), 190, curY, { align: 'right' });
    }
    curY += 5.5;
  });

  curY += 4;

  // 7. Perforated Remittance Advice Slip (Detachable Style)
  doc.setDrawColor(148, 163, 184);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(15, curY, 195, curY);
  doc.setLineDashPattern([], 0); // reset line dash

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('✂  TEAR OFF REMITTANCE SLIP — RETURN WITH PAYMENT OR USE VIA ELECTRONIC BANKING', 105, curY + 3.5, { align: 'center' });

  curY += 6;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, curY, 180, 32, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(11, 37, 69);
  doc.text('REMITTANCE ADVICE & BANKING DETAILS', 19, curY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text('• Bank: First National Bank (FNB) | Account Name: City of uMhlathuze Revenue', 19, curY + 12);
  doc.text(`• Account No: 62234567890 | Branch Code: 220228 (Richards Bay) | Reference: ${account.accNo}`, 19, curY + 17);
  doc.text('• Online Portal Payment: Settle immediately using Instant EFT (Ozow, Capitec Pay) or Credit Card.', 19, curY + 22);

  // Barcode / Pay@ box
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(132, curY + 3, 58, 25, 1.5, 1.5, 'D');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text('EasyPay / Pay@ Reference:', 135, curY + 8);
  doc.setFont('courier', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`99283 ${account.accNo}`, 135, curY + 15);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Payable at Pick n Pay, Shoprite, Checkers', 135, curY + 22);

  // Footer security and timestamp
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(`City of uMhlathuze Revenue Management • Enquiries: 035 907 5000 • rates@umhlathuze.gov.za • Security SHA256-${account.accNo}`, 105, 292, { align: 'center' });

  doc.save(`uMhlathuze_Monthly_Statement_${account.accNo}_${currentMonth.month.replace(/\s+/g, '_')}.pdf`);
};

export const generateStatementInvoicePDF = (
  account: RatepayerAccount,
  monthRate: MonthlyRate
) => {
  generateMonthlyStatementPDF(account, monthRate);
};

export const generatePaymentReceiptPDF = (
  account: RatepayerAccount,
  amountPaid: number,
  method: string,
  receiptNo: string
) => {
  const doc = new jsPDF();
  const dateStr = new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  // Background tint
  doc.setFillColor(240, 253, 244);
  doc.rect(0, 0, 210, 297, 'F');

  // Green Header
  doc.setFillColor(22, 101, 52);
  doc.rect(0, 0, 210, 32, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('City of uMhlathuze', 105, 14, { align: 'center' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('OFFICIAL MUNICIPAL RATES & WATER RECEIPT', 105, 22, { align: 'center' });

  // White Card in center
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(20, 45, 170, 160, 4, 4, 'FD');

  // Big Green Checkmark
  doc.setTextColor(22, 163, 74);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('SUCCESSFULLY PROCESSED', 105, 65, { align: 'center' });

  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for keeping your uMhlathuze municipal account up to date.', 105, 73, { align: 'center' });

  doc.setDrawColor(226, 232, 240);
  doc.line(30, 80, 180, 80);

  // Key Details
  let curY = 92;
  const entry = (label: string, val: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(label, 35, curY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(val, 95, curY);
    curY += 8;
  };

  entry('Official Receipt No:', receiptNo);
  entry('Payment Date & Time:', dateStr);
  entry('Ratepayer Account No:', account.accNo);
  entry('Account Holder Name:', account.name);
  entry('Property Address:', account.address);
  entry('Payment Method:', method);

  curY += 4;
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(35, curY, 140, 18, 2, 2, 'FD');

  doc.setTextColor(22, 101, 52);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Total Amount Settled:', 42, curY + 11);
  doc.setFontSize(14);
  doc.text(formatZAR(amountPaid), 165, curY + 12, { align: 'right' });

  // Stamp in receipt
  curY += 28;
  doc.setDrawColor(22, 163, 74);
  doc.setLineWidth(1);
  doc.roundedRect(70, curY, 70, 16, 2, 2, 'D');
  doc.setFontSize(9);
  doc.text('uMhlathuze Municipal Cashier Verified', 105, curY + 7, { align: 'center' });
  doc.setFontSize(7.5);
  doc.text('ELECTRONIC SETTLEMENT VALIDATED', 105, curY + 12, { align: 'center' });

  doc.save(`uMhlathuze_Payment_Receipt_${receiptNo}.pdf`);
};
