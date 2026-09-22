import { fmt } from './format';

export function generateBillPDF(bill) {
  if (!window.jspdf) { alert('PDF library is still loading — please try again in a moment.'); return; }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(16); doc.text('Manoj Kirana Dukan', 14, 18);
  doc.setFontSize(10); doc.text('Invoice: ' + bill.billNo, 14, 26); doc.text('Date: ' + bill.date, 120, 26);
  doc.text('Customer: ' + bill.customerName, 14, 33);
  if (bill.village) doc.text('Village: ' + bill.village, 14, 39);
  let y = 50;
  doc.setFontSize(11);
  doc.text('Item', 14, y); doc.text('Qty', 105, y); doc.text('Rate', 135, y); doc.text('Amount', 170, y);
  y += 4; doc.line(14, y, 196, y); y += 8;
  bill.items.forEach((it) => {
    doc.setFontSize(10);
    doc.text(String(it.name), 14, y); doc.text(String(it.qty), 105, y);
    doc.text('Rs.' + fmt(it.rate), 135, y); doc.text('Rs.' + fmt(it.amount), 170, y);
    y += 8;
  });
  y += 2; doc.line(14, y, 196, y); y += 10;
  doc.setFontSize(13); doc.text('Total: Rs.' + fmt(bill.total), 140, y);
  y += 16; doc.setFontSize(9); doc.text('Thank you for shopping with us!', 14, y);
  doc.save(bill.billNo + '.pdf');
}

export function generateBillExcel(bill) {
  if (!window.XLSX) { alert('Excel library is still loading — please try again in a moment.'); return; }
  const rows = bill.items.map((it) => ({ Item: it.name, Quantity: it.qty, Rate: it.rate, Amount: it.amount }));
  rows.push({ Item: '', Quantity: '', Rate: 'TOTAL', Amount: bill.total });
  const ws = window.XLSX.utils.json_to_sheet(rows);
  const wb = window.XLSX.utils.book_new();
  window.XLSX.utils.book_append_sheet(wb, ws, bill.billNo);
  window.XLSX.writeFile(wb, bill.billNo + '.xlsx');
}

export function sendBillWhatsApp(bill) {
  let msg = `*Manoj Kirana Dukan*\nInvoice: ${bill.billNo}\nDate: ${bill.date}\nCustomer: ${bill.customerName}\n\n`;
  bill.items.forEach((it) => { msg += `${it.name} x${it.qty} = Rs.${fmt(it.amount)}\n`; });
  msg += `\n*Total: Rs.${fmt(bill.total)}*\n\nThank you for shopping with us!`;
  const base = bill.phone ? `https://wa.me/${bill.phone.replace(/\D/g, '')}` : 'https://wa.me/';
  window.open(base + `?text=${encodeURIComponent(msg)}`, '_blank');
}

export function generateReceiptPDF(r) {
  if (!window.jspdf) { alert('PDF library is still loading — please try again in a moment.'); return; }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(16); doc.text('Manoj Kirana Dukan', 14, 18);
  doc.setFontSize(13); doc.text('Payment Receipt', 14, 27);
  doc.setFontSize(10);
  doc.text('Receipt No: ' + r.receiptNo, 14, 38); doc.text('Date: ' + r.date, 120, 38);
  doc.text('Received From: ' + r.customerName, 14, 46);
  if (r.village) doc.text('Village: ' + r.village, 14, 52);
  doc.setFontSize(13); doc.text('Amount Received: Rs.' + fmt(r.amount), 14, 66);
  doc.setFontSize(9); doc.text('Thank you for shopping with us!', 14, 82);
  doc.save(r.receiptNo + '.pdf');
}

export function generateReceiptExcel(r) {
  if (!window.XLSX) { alert('Excel library is still loading — please try again in a moment.'); return; }
  const rows = [{ 'Receipt No': r.receiptNo, Date: r.date, Customer: r.customerName, Village: r.village || '', 'Amount Received': r.amount }];
  const ws = window.XLSX.utils.json_to_sheet(rows);
  const wb = window.XLSX.utils.book_new();
  window.XLSX.utils.book_append_sheet(wb, ws, r.receiptNo);
  window.XLSX.writeFile(wb, r.receiptNo + '.xlsx');
}

export function sendReceiptWhatsApp(r) {
  const msg = `*Manoj Kirana Dukan*\n*Payment Receipt*\nReceipt No: ${r.receiptNo}\nDate: ${r.date}\nReceived From: ${r.customerName}\n\n*Amount Received: Rs.${fmt(r.amount)}*\n\nThank you for shopping with us!`;
  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
}
