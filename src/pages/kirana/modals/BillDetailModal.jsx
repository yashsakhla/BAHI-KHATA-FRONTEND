import Modal from '../../../components/Modal';
import { fmt } from '../../../utils/format';
import { generateBillPDF, generateBillExcel, sendBillWhatsApp } from '../../../utils/docGen';

export default function BillDetailModal({ bill, onClose }) {
  if (!bill) return null;
  return (
    <Modal title={bill.billNo} onClose={onClose}>
      <div className="card" style={{ margin: '0 16px 14px' }}>
        <div className="tile">
          <div className="tile-detail"><span>Date</span><span>{bill.date}</span></div>
          <div className="tile-detail"><span>Customer</span><span>{bill.customerName}</span></div>
          {bill.village && <div className="tile-detail"><span>Village / Place</span><span>{bill.village}</span></div>}
        </div>
      </div>
      <div className="section-label">Items</div>
      <div className="card" style={{ margin: '0 16px 14px' }}>
        {bill.items.map((it, i) => (
          <div className="tile" key={i} style={{ borderBottom: '1px solid var(--line)' }}>
            <div className="tile-row"><div className="title-line" style={{ fontSize: 13 }}>{it.name}</div><div className="amt debit">₹{fmt(it.amount)}</div></div>
            <div className="tile-detail"><span>{it.qty} × ₹{fmt(it.rate)}</span></div>
          </div>
        ))}
      </div>
      <div className="bill-total-row"><div className="lbl">Grand Total</div><div className="val">₹{fmt(bill.total)}</div></div>
      <div className="btn-row">
        <button className="btn small" style={{ flex: 1 }} onClick={() => generateBillPDF(bill)}>Download PDF</button>
        <button className="btn small ghost" style={{ flex: 1 }} onClick={() => generateBillExcel(bill)}>Download Excel</button>
      </div>
      <div className="field"><button className="btn" style={{ background: 'linear-gradient(135deg,#3ED07A,#1DA851)' }} onClick={() => sendBillWhatsApp(bill)}>Send via WhatsApp</button></div>
      <div className="note">The bill is sent as a text summary — attach the downloaded PDF for a formal copy.</div>
      <div className="field"><button className="btn ghost" onClick={onClose}>Close</button></div>
    </Modal>
  );
}
