
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
  console.log('Starting PDF generation for receipt:', receiptData.receipt_number);
  
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Set font
  pdf.setFont('helvetica');

  // Header - RECEIPT
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('RECEIPT', 150, 20);

  // Receipt details top right
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Receipt No: ${receiptData.receipt_number}`, 150, 30);
  pdf.text(`Date: ${format(new Date(receiptData.payment_date), 'dd/MM/yyyy')}`, 150, 37);

  // Society Information
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text(receiptData.society_name, 20, 40);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const addressLines = receiptData.society_address.split('\n');
  let yPos = 50;
  addressLines.forEach(line => {
    pdf.text(line, 20, yPos);
    yPos += 5;
  });

  // Main receipt content
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  
  yPos += 20;
  pdf.text('RECEIVED WITH THANKS FROM MR/MRS', 20, yPos);
  
  yPos += 10;
  pdf.setFont('helvetica', 'bold');
  pdf.text(receiptData.resident_name.toUpperCase(), 20, yPos);
  
  yPos += 15;
  pdf.setFont('helvetica', 'normal');
  pdf.text('THE SUM OF RUPEES', 20, yPos);
  
  yPos += 10;
  pdf.setFont('helvetica', 'bold');
  const amountInWords = numberToWords(receiptData.total_amount).toUpperCase() + ' ONLY';
  pdf.text(amountInWords, 20, yPos);
  
  yPos += 20;
  pdf.setFont('helvetica', 'normal');
  pdf.text('MAINTENANCE CHARGES FOR MONTH OF:', 20, yPos);
  
  yPos += 10;
  pdf.setFont('helvetica', 'bold');
  const monthYear = format(new Date(receiptData.payment_month), 'MMMM yyyy').toUpperCase();
  pdf.text(monthYear, 20, yPos);
  
  // Payment method checkboxes
  yPos += 20;
  pdf.setFont('helvetica', 'normal');
  pdf.text('PAYMENT BY:', 20, yPos);
  
  yPos += 10;
  const paymentMethods = [
    { label: 'CASH', value: 'cash' },
    { label: 'CHEQUE', value: 'cheque' },
    { label: 'IMPS/UPI', value: 'upi_imps' },
    { label: 'BANK TRANSFER', value: 'bank_transfer' }
  ];
  
  let xPos = 20;
  paymentMethods.forEach(method => {
    // Checkbox
    pdf.rect(xPos, yPos - 3, 3, 3);
    if (receiptData.payment_method === method.value) {
      pdf.text('✓', xPos + 0.5, yPos - 0.5);
    }
    pdf.text(method.label, xPos + 6, yPos);
    xPos += 40;
  });

  // Flat number
  yPos += 15;
  pdf.text(`FLAT NO: ${receiptData.flat_number}`, 20, yPos);

  // Amount box
  yPos += 20;
  pdf.rect(130, yPos - 10, 50, 25);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Rs', 135, yPos);
  pdf.setFontSize(18);
  pdf.text(receiptData.total_amount.toString(), 145, yPos + 5);

  // Breakdown if penalty exists
  if (receiptData.penalty_amount > 0) {
    yPos += 30;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Base Amount: ₹${receiptData.base_amount}`, 20, yPos);
    pdf.text(`Late Fee: ₹${receiptData.penalty_amount}`, 20, yPos + 5);
    pdf.text(`Total: ₹${receiptData.total_amount}`, 20, yPos + 10);
  }

  // Signature line
  yPos += 40;
  pdf.line(20, yPos, 80, yPos);
  pdf.text('Signature', 20, yPos + 7);

  console.log('PDF generation completed successfully');
  return pdf.output('datauristring');
};

// Helper function to convert number to words (simplified version)
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
