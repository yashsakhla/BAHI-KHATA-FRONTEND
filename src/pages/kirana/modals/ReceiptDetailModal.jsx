import Modal from '../../../components/Modal';
import { fmt } from '../../../utils/format';
import { generateReceiptPDF, generateReceiptExcel, sendReceiptWhatsApp } from '../../../utils/docGen';

export default function ReceiptDetailModal({ receipt, onClose }) {
  if (!receipt) return null;
  return (
    <Modal title={receipt.receiptNo} onClose={onClose}>
      <div className="card" style={{ margin: '0 16px 14px' }}>
        <div className="tile">
          <div className="tile-detail"><span>Date</span><span>{receipt.date}</span></div>
          <div className="tile-detail"><span>Received From</span><span>{receipt.customerName}</span></div>
          {receipt.village && <div className="tile-detail"><span>Village / Place</span><span>{receipt.village}</span></div>}
        </div>
      </div>
      <div className="bill-total-row"><div className="lbl">Amount Received</div><div className="val">₹{fmt(receipt.amount)}</div></div>
      <div className="btn-row">
        <button className="btn small" style={{ flex: 1 }} onClick={() => generateReceiptPDF(receipt)}>Download PDF</button>
        <button className="btn small ghost" style={{ flex: 1 }} onClick={() => generateReceiptExcel(receipt)}>Download Excel</button>
      </div>
      <div className="field"><button className="btn" style={{ background: 'linear-gradient(135deg,#3ED07A,#1DA851)' }} onClick={() => sendReceiptWhatsApp(receipt)}>Send via WhatsApp</button></div>
      <div className="note">The receipt is sent as a text summary — attach the downloaded PDF for a formal copy.</div>
      <div className="field"><button className="btn ghost" onClick={onClose}>Close</button></div>
    </Modal>
  );
}
