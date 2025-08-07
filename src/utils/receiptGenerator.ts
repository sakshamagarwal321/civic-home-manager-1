
import jsPDF from 'jspdf';
import { format } from 'date-fns';

interface ReceiptData {
  receipt_number: string;
  flat_number: string;
  resident_name: string;
  payment_date: string;
  payment_month: string;
  base_amount: number;
  penalty_amount: number;
  total_amount: number;
  payment_method: string;
  society_name: string;
  society_address: string;
}

export const generatePDFReceipt = (receiptData: ReceiptData): Blob => {
  console.log('Starting enhanced graphical PDF generation for receipt:', receiptData.receipt_number);
  
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Enhanced Color Palette
  const brandPrimary = '#0f172a';     // Deep slate
  const brandSecondary = '#1e40af';   // Blue-600
  const accentGreen = '#059669';      // Emerald-600
  const accentGold = '#d97706';       // Amber-600
  const lightBg = '#f8fafc';          // Slate-50
  const cardBg = '#ffffff';           // White
  const textPrimary = '#1e293b';      // Slate-800
  const textSecondary = '#64748b';    // Slate-500
  const borderColor = '#e2e8f0';      // Slate-200
  const successGreen = '#10b981';     // Emerald-500

  let yPos = 15;

  // Create watermark background pattern
  pdf.setGState({ opacity: 0.03 });
  pdf.setFillColor(brandSecondary);
  for (let x = 0; x < 210; x += 40) {
    for (let y = 0; y < 297; y += 40) {
      pdf.circle(x, y, 15, 'F');
    }
  }
  pdf.setGState({ opacity: 1 });

  // Enhanced Header with Gradient Effect
  // Main header background with gradient simulation
  pdf.setFillColor(brandPrimary);
  pdf.rect(0, 0, 210, 55, 'F');
  
  // Add accent stripe
  pdf.setFillColor(accentGold);
  pdf.rect(0, 50, 210, 5, 'F');

  // Logo placeholder with modern frame
  pdf.setFillColor(cardBg);
  pdf.roundedRect(15, 12, 30, 30, 3, 3, 'F');
  pdf.setDrawColor(brandSecondary);
  pdf.setLineWidth(2);
  pdf.roundedRect(15, 12, 30, 30, 3, 3);
  
  // Modern logo placeholder design
  pdf.setFillColor(brandSecondary);
  pdf.circle(30, 27, 8, 'F');
  pdf.setFillColor(cardBg);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(255, 255, 255);
  pdf.text('ECO', 25, 30);

  // Enhanced Society Branding
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(24);
  const societyName = receiptData.society_name.toUpperCase();
  pdf.text(societyName, 55, 25);

  // Tagline
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.text('RESIDENTIAL WELFARE SOCIETY', 55, 32);

  // Enhanced address with better formatting
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  const addressLines = receiptData.society_address.split('\n');
  let addressY = 38;
  addressLines.forEach(line => {
    pdf.text(line, 55, addressY);
    addressY += 3.5;
  });

  // Modern Receipt Info Card (Enhanced)
  yPos = 70;
  pdf.setFillColor(lightBg);
  pdf.roundedRect(140, yPos - 8, 60, 25, 4, 4, 'F');
  pdf.setDrawColor(borderColor);
  pdf.setLineWidth(0.5);
  pdf.roundedRect(140, yPos - 8, 60, 25, 4, 4);

  // Receipt number with modern styling
  pdf.setTextColor(textPrimary);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.text('RECEIPT NO.', 145, yPos - 3);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(brandSecondary);
  pdf.text(receiptData.receipt_number, 145, yPos + 2);

  // Date with icon
  pdf.setTextColor(textPrimary);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.text('DATE', 145, yPos + 8);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text(format(new Date(receiptData.payment_date), 'dd MMM yyyy'), 145, yPos + 13);

  // Main Content Card with Shadow Effect
  yPos += 25;
  
  // Shadow effect
  pdf.setFillColor('#e2e8f0');
  pdf.roundedRect(22, yPos + 2, 166, 140, 6, 6, 'F');
  
  // Main card
  pdf.setFillColor(cardBg);
  pdf.roundedRect(20, yPos, 166, 140, 6, 6, 'F');
  pdf.setDrawColor(borderColor);
  pdf.setLineWidth(1);
  pdf.roundedRect(20, yPos, 166, 140, 6, 6);

  yPos += 15;

  // Enhanced "Received From" Section
  pdf.setFillColor(lightBg);
  pdf.roundedRect(25, yPos - 3, 156, 12, 2, 2, 'F');
  
  pdf.setTextColor(textSecondary);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.text('RECEIVED FROM', 30, yPos + 2);
  
  yPos += 12;
  
  // Resident name with enhanced styling
  pdf.setFillColor(brandSecondary);
  pdf.roundedRect(25, yPos - 2, 156, 10, 2, 2, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text(receiptData.resident_name.toUpperCase(), 30, yPos + 4);

  yPos += 15;

  // Two-column layout for details
  // Left column - Flat details
  pdf.setTextColor(textPrimary);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.text('FLAT NUMBER', 30, yPos);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  pdf.setTextColor(brandSecondary);
  pdf.text(receiptData.flat_number, 30, yPos + 6);

  // Right column - Amount with enhanced styling
  const amountBoxX = 120;
  pdf.setFillColor(successGreen);
  pdf.roundedRect(amountBoxX - 5, yPos - 5, 60, 20, 4, 4, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.text('TOTAL AMOUNT', amountBoxX, yPos - 1);
  
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.text(`₹ ${receiptData.total_amount.toLocaleString('en-IN')}`, amountBoxX, yPos + 8);

  yPos += 25;

  // Amount in Words with modern styling
  pdf.setFillColor(lightBg);
  pdf.roundedRect(25, yPos - 3, 156, 15, 2, 2, 'F');
  
  pdf.setTextColor(textSecondary);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.text('AMOUNT IN WORDS', 30, yPos + 1);
  
  yPos += 8;
  pdf.setTextColor(textPrimary);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  const amountInWords = numberToWords(receiptData.total_amount).toUpperCase() + ' RUPEES ONLY';
  
  // Word wrapping
  const maxWidth = 150;
  const words = amountInWords.split(' ');
  let line = '';
  
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const testWidth = pdf.getTextWidth(testLine);
    
    if (testWidth > maxWidth && line !== '') {
      pdf.text(line.trim(), 30, yPos);
      line = words[i] + ' ';
      yPos += 4;
    } else {
      line = testLine;
    }
  }
  if (line !== '') {
    pdf.text(line.trim(), 30, yPos);
  }

  yPos += 12;

  // Charges For Section with icon
  pdf.setTextColor(textSecondary);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.text('CHARGES FOR', 30, yPos);
  
  yPos += 6;
  pdf.setTextColor(brandSecondary);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  const monthYear = format(new Date(receiptData.payment_month), 'MMMM yyyy').toUpperCase();
  pdf.text(`MAINTENANCE CHARGES - ${monthYear}`, 30, yPos);

  yPos += 15;

  // Enhanced Payment Method Selection
  pdf.setTextColor(textSecondary);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.text('PAYMENT METHOD', 30, yPos);

  yPos += 8;
  
  const paymentMethods = [
    { label: 'CASH', value: 'cash', icon: '💵' },
    { label: 'CHEQUE', value: 'cheque', icon: '📋' },
    { label: 'UPI/IMPS', value: 'upi_imps', icon: '📱' },
    { label: 'TRANSFER', value: 'bank_transfer', icon: '🏦' }
  ];
  
  let xPos = 30;
  paymentMethods.forEach((method, index) => {
    const isSelected = receiptData.payment_method === method.value;
    
    if (isSelected) {
      pdf.setFillColor(accentGreen);
      pdf.roundedRect(xPos - 2, yPos - 4, 35, 8, 2, 2, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
    } else {
      pdf.setFillColor(lightBg);
      pdf.roundedRect(xPos - 2, yPos - 4, 35, 8, 2, 2, 'F');
      pdf.setTextColor(textSecondary);
      pdf.setFont('helvetica', 'normal');
    }
    
    pdf.setFontSize(8);
    pdf.text(method.label, xPos, yPos);
    
    if (isSelected) {
      // Add checkmark
      pdf.setTextColor(255, 255, 255);
      pdf.text('✓', xPos + 28, yPos);
    }
    
    xPos += 38;
  });

  // Enhanced Item Table
  yPos += 20;
  const tableStartY = yPos;
  
  // Table header with gradient
  pdf.setFillColor(brandSecondary);
  pdf.roundedRect(25, tableStartY, 156, 12, 2, 2, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.text('DESCRIPTION', 30, tableStartY + 7);
  pdf.text('MONTH', 120, tableStartY + 7);
  pdf.text('AMOUNT (₹)', 155, tableStartY + 7);

  // Table rows with alternating colors
  yPos = tableStartY + 16;
  
  // Base maintenance row
  pdf.setFillColor('#f9fafb');
  pdf.rect(25, yPos - 4, 156, 10, 'F');
  
  pdf.setTextColor(textPrimary);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.text('Monthly Maintenance Fee', 30, yPos + 1);
  pdf.text(format(new Date(receiptData.payment_month), 'MMM yyyy'), 120, yPos + 1);
  pdf.text(receiptData.base_amount.toLocaleString('en-IN'), 155, yPos + 1);
  
  // Penalty row (if applicable)
  if (receiptData.penalty_amount > 0) {
    yPos += 12;
    pdf.setFillColor('#fef3f2');
    pdf.rect(25, yPos - 4, 156, 10, 'F');
    
    pdf.setTextColor('#dc2626');
    pdf.text('Late Payment Penalty', 30, yPos + 1);
    pdf.setTextColor(textPrimary);
    pdf.text('-', 120, yPos + 1);
    pdf.setTextColor('#dc2626');
    pdf.text(receiptData.penalty_amount.toLocaleString('en-IN'), 155, yPos + 1);
  }

  // Total row with emphasis
  yPos += 16;
  pdf.setFillColor(successGreen);
  pdf.roundedRect(25, yPos - 4, 156, 12, 2, 2, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.text('TOTAL AMOUNT', 30, yPos + 3);
  pdf.setFontSize(12);
  pdf.text(`₹ ${receiptData.total_amount.toLocaleString('en-IN')}`, 155, yPos + 3);

  // QR Code placeholder
  yPos += 25;
  pdf.setFillColor(lightBg);
  pdf.roundedRect(140, yPos, 40, 20, 3, 3, 'F');
  pdf.setDrawColor(borderColor);
  pdf.roundedRect(140, yPos, 40, 20, 3, 3);
  
  pdf.setTextColor(textSecondary);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  pdf.text('Scan for Digital', 143, yPos + 8);
  pdf.text('Verification', 145, yPos + 12);

  // Thank you message with styling
  pdf.setFillColor(lightBg);
  pdf.roundedRect(25, yPos, 110, 20, 3, 3, 'F');
  
  pdf.setTextColor(successGreen);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text('Thank you for your prompt payment! 🙏', 30, yPos + 8);
  
  pdf.setTextColor(textSecondary);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.text('Your contribution helps maintain our community.', 30, yPos + 14);

  // Enhanced Signature Section
  yPos += 35;
  
  // Signature box
  pdf.setFillColor(cardBg);
  pdf.roundedRect(130, yPos - 5, 50, 25, 3, 3, 'F');
  pdf.setDrawColor(borderColor);
  pdf.roundedRect(130, yPos - 5, 50, 25, 3, 3);
  
  // Signature line
  pdf.setDrawColor(textSecondary);
  pdf.line(135, yPos + 8, 175, yPos + 8);
  
  pdf.setTextColor(textSecondary);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.text('Authorized Signatory', 140, yPos + 13);
  pdf.text('Society Office', 145, yPos + 17);

  // Enhanced Footer
  yPos += 35;
  pdf.setDrawColor(borderColor);
  pdf.line(20, yPos, 190, yPos);
  
  yPos += 8;
  pdf.setTextColor(textSecondary);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  pdf.text('This is a computer-generated receipt. No signature required.', 25, yPos);
  pdf.text(`Generated on: ${format(new Date(), 'dd MMM yyyy, hh:mm a')}`, 130, yPos);
  
  yPos += 4;
  pdf.text('For queries, contact: admin@ecoresidents.com | +91-120-1234567', 25, yPos);

  console.log('Enhanced graphical PDF generation completed successfully');
  return pdf.output('blob');
};

// Helper function to convert number to words (enhanced version)
function numberToWords(num: number): string {
  const ones = [
    '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'
  ];
  const tens = [
    '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
  ];
  const teens = [
    'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 
    'sixteen', 'seventeen', 'eighteen', 'nineteen'
  ];

  if (num === 0) return 'zero';

  let words = '';

  // Lakhs
  if (num >= 100000) {
    const lakhs = Math.floor(num / 100000);
    words += numberToWords(lakhs) + ' lakh ';
    num %= 100000;
  }

  // Thousands
  if (num >= 1000) {
    const thousands = Math.floor(num / 1000);
    words += numberToWords(thousands) + ' thousand ';
    num %= 1000;
  }

  // Hundreds
  if (num >= 100) {
    words += ones[Math.floor(num / 100)] + ' hundred ';
    num %= 100;
  }

  // Tens and ones
  if (num >= 20) {
    words += tens[Math.floor(num / 10)] + ' ';
    num %= 10;
  } else if (num >= 10) {
    words += teens[num - 10] + ' ';
    num = 0;
  }

  if (num > 0) {
    words += ones[num];
  }

  return words.trim();
}
