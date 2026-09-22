import { useEffect, useState } from 'react';
import Modal from '../../../components/Modal';
import { kiranaApi } from '../../../api/kirana';
import { apiErrorMessage } from '../../../api/client';
import { todayStr } from '../../../utils/format';
import { useLanguage } from '../../../context/LanguageContext';

export default function EntryModal({ presetCustomerName, presetType, customers = [], onClose, onSaved }) {
  const { t } = useLanguage();
  const [type, setType] = useState(presetType || 'debit');
  const [customerName, setCustomerName] = useState(presetCustomerName || '');
  const [village, setVillage] = useState('');
  const [date, setDate] = useState(todayStr());
  const [itemName, setItemName] = useState('');
  const [qty, setQty] = useState('');
  const [amount, setAmount] = useState('');
  const [generateDoc, setGenerateDoc] = useState(true);
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!presetCustomerName) return;
    const c = customers.find((x) => x.name.toLowerCase() === presetCustomerName.toLowerCase());
    if (c?.village) setVillage(c.village);
  }, [presetCustomerName, customers]);

  const onCustomerInput = (val) => {
    setCustomerName(val);
    const c = customers.find((x) => x.name.toLowerCase() === val.trim().toLowerCase());
    if (c?.village && !village) setVillage(c.village);
  };

  const save = async () => {
    if (!customerName.trim() || !itemName.trim() || !qty || Number(amount) < 0) {
      setErr(t('modal.fillRequired'));
      return;
    }
    setSaving(true);
    setErr('');
    try {
      await kiranaApi.createEntry({
        customerName: customerName.trim(),
        village: village.trim(),
        date,
        itemName: itemName.trim(),
        qty: Number(qty),
        amount: Number(amount) || 0,
        type,
        generateDoc,
      });
      onSaved?.();
      onClose();
    } catch (e) {
      setErr(apiErrorMessage(e, t('modal.couldNotSaveEntry')));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={type === 'debit' ? t('modal.entryDebitTitle') : t('modal.entryCreditTitle')} onClose={onClose}>
      <div className="field">
        <label>{t('modal.entryType')}</label>
        <div className="toggle2">
          <div className={`opt${type === 'debit' ? ' sel-debit' : ''}`} onClick={() => setType('debit')}>{t('modal.udhaarDebit')}</div>
          <div className={`opt${type === 'credit' ? ' sel-credit' : ''}`} onClick={() => setType('credit')}>{t('modal.paidCredit')}</div>
        </div>
      </div>
      <div className="field">
        <label>{t('modal.customerName')}</label>
        <input
          list="entry-cust-list"
          value={customerName}
          onChange={(e) => onCustomerInput(e.target.value)}
          placeholder={t('modal.customerNamePh')}
          disabled={!!presetCustomerName}
        />
        <datalist id="entry-cust-list">
          {customers.map((c) => <option key={c._id} value={c.name} />)}
        </datalist>
      </div>
      <div className="field"><label>{t('modal.village')}</label><input value={village} onChange={(e) => setVillage(e.target.value)} placeholder={t('modal.villagePh')} /></div>
      <div className="field"><label>{t('common.date')}</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
      <div className="field"><label>{t('modal.itemDesc')}</label><input value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder={t('modal.itemDescPh')} /></div>
      <div className="field"><label>{t('modal.quantity')}</label><input type="number" value={qty} onChange={(e) => setQty(e.target.value)} placeholder={t('modal.quantityPh')} /></div>
      <div className="field"><label>{t('modal.amountRs')}</label><input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={t('modal.amountPh')} /></div>
      <div className="check-row">
        <input type="checkbox" id="entry-gendoc" checked={generateDoc} onChange={(e) => setGenerateDoc(e.target.checked)} />
        <label htmlFor="entry-gendoc">{type === 'debit' ? t('modal.alsoGenInvoice') : t('modal.alsoGenReceipt')}</label>
      </div>
      {err && <div className="errmsg">{err}</div>}
      <div className="field"><button className={`btn ${type === 'debit' ? 'debit-btn' : 'credit-btn'}`} onClick={save} disabled={saving}>{saving ? t('common.saving') : t('modal.saveEntry')}</button></div>
      <div className="field"><button className="btn ghost" onClick={onClose}>{t('common.cancel')}</button></div>
    </Modal>
  );
}
