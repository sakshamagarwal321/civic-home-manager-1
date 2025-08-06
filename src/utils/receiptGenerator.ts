
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

export const generatePDFReceipt = (receiptData: ReceiptData): string => {
  console.log('Starting modern PDF generation for receipt:', receiptData.receipt_number);
  
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Set default font
  pdf.setFont('helvetica');

  // Colors (professional theme)
  const primaryColor = '#1e3a8a'; // Deep blue
  const secondaryColor = '#64748b'; // Slate gray
  const accentColor = '#059669'; // Emerald green
  const lightGray = '#f1f5f9';

  let yPos = 20;

  // Header Section - Society Branding
  pdf.setFillColor(primaryColor);
  pdf.rect(0, 0, 210, 45, 'F'); // Header background

  // Society Name (centered, white text)
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  const societyNameWidth = pdf.getTextWidth(receiptData.society_name);
  pdf.text(receiptData.society_name, (210 - societyNameWidth) / 2, 20);

  // Society Address (centered, smaller white text)
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const addressLines = receiptData.society_address.split('\n');
  let addressYPos = 27;
  addressLines.forEach(line => {
    const lineWidth = pdf.getTextWidth(line);
    pdf.text(line, (210 - lineWidth) / 2, addressYPos);
    addressYPos += 4;
  });

  // Horizontal divider
  pdf.setDrawColor(200, 200, 200);
  pdf.line(20, 50, 190, 50);

  // Reset text color for main content
  pdf.setTextColor(0, 0, 0);
  yPos = 65;

  // Receipt Info Card (top right)
  pdf.setFillColor(lightGray);
  pdf.roundedRect(135, yPos - 5, 50, 20, 2, 2, 'F');
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Receipt No.', 140, yPos);
  pdf.setFont('helvetica', 'normal');
  pdf.text(receiptData.receipt_number, 140, yPos + 5);
  
  pdf.setFont('helvetica', 'bold');
  pdf.text('Date', 140, yPos + 10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(format(new Date(receiptData.payment_date), 'dd/MM/yyyy'), 140, yPos + 15);

  // Main Content Card
  pdf.setDrawColor(220, 220, 220);
  pdf.roundedRect(20, yPos + 20, 170, 120, 3, 3);

  yPos += 35;

  // Received From Section
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('RECEIVED FROM:', 25, yPos);
  
  yPos += 8;
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(primaryColor);
  pdf.text(receiptData.resident_name.toUpperCase(), 25, yPos);
  pdf.setTextColor(0, 0, 0);

  // Flat Number
  yPos += 12;
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('FLAT NO:', 25, yPos);
  pdf.setFont('helvetica', 'normal');
  pdf.text(receiptData.flat_number, 50, yPos);

  // Amount Section (highlighted)
  const amountBoxY = yPos + 5;
  pdf.setFillColor(accentColor);
  pdf.roundedRect(130, amountBoxY, 50, 25, 3, 3, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('AMOUNT', 135, amountBoxY + 8);
  
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`₹${receiptData.total_amount}`, 135, amountBoxY + 18);
  pdf.setTextColor(0, 0, 0);

  yPos += 35;

  // Amount in Words
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('AMOUNT IN WORDS:', 25, yPos);
  
  yPos += 6;
  pdf.setFont('helvetica', 'normal');
  const amountInWords = numberToWords(receiptData.total_amount).toUpperCase() + ' RUPEES ONLY';
  const maxWidth = 160;
  const words = amountInWords.split(' ');
  let line = '';
  
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const testWidth = pdf.getTextWidth(testLine);
    
    if (testWidth > maxWidth && line !== '') {
      pdf.text(line.trim(), 25, yPos);
      line = words[i] + ' ';
      yPos += 5;
    } else {
      line = testLine;
    }
  }
  if (line !== '') {
    pdf.text(line.trim(), 25, yPos);
  }

  yPos += 15;

  // Charges For Section
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CHARGES FOR:', 25, yPos);
  
  yPos += 8;
  pdf.setFont('helvetica', 'normal');
  const monthYear = format(new Date(receiptData.payment_month), 'MMMM yyyy').toUpperCase();
  pdf.text(`MAINTENANCE CHARGES FOR ${monthYear}`, 25, yPos);

  yPos += 15;

  // Payment Method Section
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PAYMENT MODE:', 25, yPos);
  
  yPos += 8;
  const paymentMethods = [
    { label: 'CASH', value: 'cash' },
    { label: 'CHEQUE', value: 'cheque' },
    { label: 'UPI/IMPS', value: 'upi_imps' },
    { label: 'BANK TRANSFER', value: 'bank_transfer' }
  ];
  
  let xPos = 25;
  paymentMethods.forEach(method => {
    // Checkbox with highlight for selected method
    if (receiptData.payment_method === method.value) {
      pdf.setFillColor(accentColor);
      pdf.roundedRect(xPos - 1, yPos - 4, 20, 6, 1, 1, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
    } else {
      pdf.setTextColor(secondaryColor);
      pdf.setFont('helvetica', 'normal');
    }
    
    pdf.text(method.label, xPos + 1, yPos);
    pdf.setTextColor(0, 0, 0);
    xPos += 35;
  });

  // Item Table
  yPos += 20;
  const tableStartY = yPos;
  
  // Table header
  pdf.setFillColor(240, 240, 240);
  pdf.rect(25, tableStartY, 140, 8, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.text('DESCRIPTION', 27, tableStartY + 5);
  pdf.text('MONTH', 100, tableStartY + 5);
  pdf.text('AMOUNT', 145, tableStartY + 5);

  // Table rows
  yPos = tableStartY + 12;
  pdf.setFont('helvetica', 'normal');
  
  // Base maintenance
  pdf.text('Monthly Maintenance', 27, yPos);
  pdf.text(format(new Date(receiptData.payment_month), 'MMM yyyy'), 100, yPos);
  pdf.text(`₹${receiptData.base_amount}`, 145, yPos);
  
  // Penalty if applicable
  if (receiptData.penalty_amount > 0) {
    yPos += 6;
    pdf.text('Late Payment Fee', 27, yPos);
    pdf.text('-', 100, yPos);
    pdf.text(`₹${receiptData.penalty_amount}`, 145, yPos);
  }

  // Total row
  yPos += 8;
  pdf.setFillColor(lightGray);
  pdf.rect(25, yPos - 3, 140, 8, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.text('TOTAL', 27, yPos + 2);
  pdf.text(`₹${receiptData.total_amount}`, 145, yPos + 2);

  // Thank you note
  yPos += 20;
  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(10);
  pdf.setTextColor(secondaryColor);
  const thankYouText = 'Thank you for your prompt payment.';
  const thankYouWidth = pdf.getTextWidth(thankYouText);
  pdf.text(thankYouText, (210 - thankYouWidth) / 2, yPos);

  // Signature section
  yPos += 25;
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  
  // Signature line
  pdf.line(130, yPos, 180, yPos);
  pdf.text('Authorized Signatory', 130, yPos + 7);

  // Footer
  yPos += 20;
  pdf.setFontSize(8);
  pdf.setTextColor(secondaryColor);
  pdf.text('This is a computer generated receipt', 25, yPos);

  console.log('Modern PDF generation completed successfully');
  return pdf.output('datauristring');
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
