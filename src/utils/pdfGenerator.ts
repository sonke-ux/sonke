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
  const certNumber = `UGU-CLR-${account.accNo}-${Date.now().toString().slice(-6)}`;
  const issueDate = new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });

  // Top Civic Header Banner
  doc.setFillColor(11, 37, 69); // Dark civic navy
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('UGU DISTRICT MUNICIPALITY', 105, 12, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('REVENUE & TREASURY MANAGEMENT CLUSTER • RATES & WATER SERVICES • PORT SHEPSTONE', 105, 19, { align: 'center' });

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
    `This document officially certifies that all municipal rates, property taxes, refuse removal charges, sewer tariffs, and water services levies prescribed under the Local Government: Municipal Property Rates Act 6 of 2004 for the above property have been fully assessed and settled for ${monthRate.month}.\n\nNo outstanding municipal debts remain for the specified assessment period. This certificate is registered in the official revenue database of Ugu District Municipality.`;

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
    doc.text('UGU DISTRICT MUNICIPALITY', sealX, sealY - 11, { align: 'center' });
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
    doc.text('Chief Revenue Operations • Ugu District Municipality', 20, curY + 35);
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
  doc.text(`Official Ugu Municipal Portal Document | Security Hash: SHA256-${account.accNo.slice(0, 4)}-${monthRate.id} | Port Shepstone, 4240`, 105, 290, { align: 'center' });

  doc.save(`Ugu_Clearance_${account.accNo}_${monthRate.month.replace(/\s+/g, '_')}.pdf`);
};

export const generateStatementInvoicePDF = (
  account: RatepayerAccount,
  monthRate: MonthlyRate
) => {
  const doc = new jsPDF();
  const invoiceNo = `UGU-INV-${account.accNo}-${Date.now().toString().slice(-5)}`;
  const issueDate = new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' });

  // Header
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, 210, 24, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Ugu District Municipality', 15, 12);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Tax Invoice & Municipal Statement of Account • Port Shepstone, KwaZulu-Natal', 15, 18);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('OFFICIAL MUNICIPAL STATEMENT', 195, 15, { align: 'right' });

  // Info Section
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(account.name, 15, 36);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(account.address, 15, 41);
  doc.text(account.suburb, 15, 46);
  doc.text(`ID Number: ${account.saIdNumber}`, 15, 51);

  // Metadata Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(120, 30, 75, 28, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.text('Account Number:', 124, 37);
  doc.setFont('helvetica', 'normal');
  doc.text(account.accNo, 160, 37);

  doc.setFont('helvetica', 'bold');
  doc.text('Invoice Number:', 124, 43);
  doc.setFont('helvetica', 'normal');
  doc.text(invoiceNo, 160, 43);

  doc.setFont('helvetica', 'bold');
  doc.text('Statement Date:', 124, 49);
  doc.setFont('helvetica', 'normal');
  doc.text(issueDate, 160, 49);

  doc.setFont('helvetica', 'bold');
  doc.text('Payment Due:', 124, 55);
  doc.setTextColor(220, 38, 38);
  doc.text(monthRate.dueDate, 160, 55);

  // Breakdown Table Header
  doc.setFillColor(11, 37, 69);
  doc.rect(15, 66, 180, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('Service Item Description', 20, 71.5);
  doc.text('Tariff Rate / Basis', 110, 71.5);
  doc.text('Amount (ZAR)', 190, 71.5, { align: 'right' });

  let lineY = 82;
  const itemRow = (desc: string, basis: string, amount: number) => {
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(desc, 20, lineY);
    doc.text(basis, 110, lineY);
    doc.setFont('helvetica', 'bold');
    doc.text(formatZAR(amount), 190, lineY, { align: 'right' });
    doc.setDrawColor(241, 245, 249);
    doc.line(15, lineY + 3, 195, lineY + 3);
    lineY += 9;
  };

  itemRow(`Property Rates Assessment (${monthRate.month})`, `Valuation ${formatZAR(account.marketValuation)}`, monthRate.ratesAmount);
  itemRow('Domestic Refuse Removal Services', 'Fixed Monthly Municipal Tariff', monthRate.refuseAmount);
  itemRow('Ugu District Water Consumption Tariff', 'Metered Municipal Water Services', monthRate.waterAmount);
  itemRow('Sewerage & Effluent Disposal Charge', 'Standard Residential Municipal Basis', monthRate.sewerAmount);
  itemRow('Value Added Tax (VAT @ 15%)', 'Applicable to municipal services', monthRate.vatAmount);

  // Total Summary Box
  lineY += 4;
  doc.setFillColor(241, 245, 249);
  doc.rect(110, lineY, 85, 18, 'F');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Total Amount Due (ZAR):', 115, lineY + 8);
  doc.setFontSize(13);
  doc.setTextColor(14, 116, 144);
  doc.text(formatZAR(monthRate.amount), 190, lineY + 9, { align: 'right' });

  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text(`Status: ${monthRate.paid ? 'PAID & CLEARED' : 'UNPAID - DUE BY ' + monthRate.dueDate}`, 115, lineY + 14);

  // Banking & Payment Details
  lineY += 30;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, lineY, 180, 28, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('Official Ugu Municipal Payment Channels:', 20, lineY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text('• Bank: First National Bank (FNB) | Branch: Port Shepstone (220228)', 20, lineY + 13);
  doc.text(`• Account Name: Ugu District Municipality | Account: 62234567890 | Reference: ${account.accNo}`, 20, lineY + 18);
  doc.text('• Instant Online Portal Payment: Pay instantly via Card, Ozow, or Capitec Pay at portal.', 20, lineY + 23);

  doc.save(`Ugu_Invoice_${account.accNo}_${monthRate.month.replace(/\s+/g, '_')}.pdf`);
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
  doc.text('Ugu District Municipality', 105, 14, { align: 'center' });
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
  doc.text('Thank you for keeping your Ugu municipal account up to date.', 105, 73, { align: 'center' });

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
  doc.text('Ugu Municipal Cashier Verified', 105, curY + 7, { align: 'center' });
  doc.setFontSize(7.5);
  doc.text('ELECTRONIC SETTLEMENT VALIDATED', 105, curY + 12, { align: 'center' });

  doc.save(`Ugu_Payment_Receipt_${receiptNo}.pdf`);
};
