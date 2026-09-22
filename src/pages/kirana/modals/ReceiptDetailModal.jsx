import Modal from '../../../components/Modal';
import { fmt } from '../../../utils/format';
import { generateReceiptPDF, generateReceiptExcel, sendReceiptWhatsApp } from '../../../utils/docGen';
import { useLanguage } from '../../../context/LanguageContext';

export default function ReceiptDetailModal({ receipt, onClose }) {
  const { t } = useLanguage();
  if (!receipt) return null;
  return (
    <Modal title={receipt.receiptNo} onClose={onClose}>
      <div className="card" style={{ margin: '0 16px 14px' }}>
        <div className="tile">
          <div className="tile-detail"><span>{t('modal.date')}</span><span>{receipt.date}</span></div>
          <div className="tile-detail"><span>{t('modal.receivedFrom')}</span><span>{receipt.customerName}</span></div>
          {receipt.village && <div className="tile-detail"><span>{t('modal.villagePlace')}</span><span>{receipt.village}</span></div>}
        </div>
      </div>
      <div className="bill-total-row"><div className="lbl">{t('modal.amountReceived')}</div><div className="val">₹{fmt(receipt.amount)}</div></div>
      <div className="btn-row">
        <button className="btn small" style={{ flex: 1 }} onClick={() => generateReceiptPDF(receipt)}>{t('modal.downloadPdf')}</button>
        <button className="btn small ghost" style={{ flex: 1 }} onClick={() => generateReceiptExcel(receipt)}>{t('modal.downloadExcel')}</button>
      </div>
      <div className="field"><button className="btn" style={{ background: 'linear-gradient(135deg,#3ED07A,#1DA851)' }} onClick={() => sendReceiptWhatsApp(receipt)}>{t('modal.sendWhatsApp')}</button></div>
      <div className="note">{t('modal.receiptNote')}</div>
      <div className="field"><button className="btn ghost" onClick={onClose}>{t('common.close')}</button></div>
    </Modal>
  );
}
