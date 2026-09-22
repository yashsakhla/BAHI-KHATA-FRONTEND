import { useState } from 'react';
import { X } from 'lucide-react';
import Modal from '../../../components/Modal';
import { kiranaApi } from '../../../api/kirana';
import { apiErrorMessage } from '../../../api/client';
import { fmt, todayStr } from '../../../utils/format';
import { useLanguage } from '../../../context/LanguageContext';

export default function NewBillModal({ customers = [], inventory = [], onClose, onSaved }) {
  const { t } = useLanguage();
  const [date, setDate] = useState(todayStr());
  const [custName, setCustName] = useState('');
  const [village, setVillage] = useState('');
  const [phone, setPhone] = useState('');
  const [autoLedger, setAutoLedger] = useState(true);
  const [items, setItems] = useState([{ name: '', qty: '', rate: '' }]);
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  const total = items.reduce((s, it) => s + (Number(it.qty) || 0) * (Number(it.rate) || 0), 0);

  const updateItem = (idx, field, val) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [field]: val } : it)));
  };
  const removeItem = (idx) => {
    setItems((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      return next.length ? next : [{ name: '', qty: '', rate: '' }];
    });
  };
  const addItem = () => setItems((prev) => [...prev, { name: '', qty: '', rate: '' }]);

  const onCustomerInput = (val) => {
    setCustName(val);
    const c = customers.find((x) => x.name.toLowerCase() === val.trim().toLowerCase());
    if (c?.village && !village) setVillage(c.village);
  };

  const save = async () => {
    const validItems = items.filter((it) => it.name.trim() && Number(it.qty) > 0 && Number(it.rate) >= 0);
    if (!custName.trim() || validItems.length === 0) {
      setErr(t('modal.addCustomerItem'));
      return;
    }
    setSaving(true);
    setErr('');
    try {
      const bill = await kiranaApi.createBill({
        date,
        customerName: custName.trim(),
        village: village.trim(),
        phone: phone.trim(),
        items: validItems.map((it) => ({ name: it.name.trim(), qty: Number(it.qty), rate: Number(it.rate) })),
        autoLedger,
      });
      onSaved?.(bill);
      onClose();
    } catch (e) {
      setErr(apiErrorMessage(e, t('modal.couldNotSaveBill')));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={t('modal.newBillTitle')} onClose={onClose}>
      <div className="field"><label>{t('common.date')}</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
      <div className="field">
        <label>{t('modal.customerName')}</label>
        <input list="bill-cust-list" value={custName} onChange={(e) => onCustomerInput(e.target.value)} placeholder={t('modal.customerNamePh')} />
        <datalist id="bill-cust-list">{customers.map((c) => <option key={c._id} value={c.name} />)}</datalist>
      </div>
      <div className="field"><label>{t('modal.village')}</label><input value={village} onChange={(e) => setVillage(e.target.value)} placeholder={t('modal.villagePh')} /></div>
      <div className="field"><label>{t('modal.whatsappOptional')}</label><input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t('modal.whatsappPh')} /></div>

      <div className="section-label" style={{ marginTop: 6 }}>{t('modal.billItems')}</div>
      {items.map((it, idx) => (
        <div className="line-item" key={idx}>
          <input list={`inv-list-${idx}`} placeholder={t('modal.item')} value={it.name} onChange={(e) => updateItem(idx, 'name', e.target.value)} />
          <datalist id={`inv-list-${idx}`}>{inventory.map((i) => <option key={i._id} value={i.name} />)}</datalist>
          <input type="number" placeholder={t('modal.qty')} value={it.qty} onChange={(e) => updateItem(idx, 'qty', e.target.value)} />
          <input type="number" placeholder={t('modal.rate')} value={it.rate} onChange={(e) => updateItem(idx, 'rate', e.target.value)} />
          <div className="li-amt">₹{fmt((Number(it.qty) || 0) * (Number(it.rate) || 0))}</div>
          <div className="li-remove" onClick={() => removeItem(idx)}><X size={14} /></div>
        </div>
      ))}
      <div className="add-line-btn" onClick={addItem}>{t('common.addItem')}</div>

      <div className="bill-total-row"><div className="lbl">{t('modal.grandTotal')}</div><div className="val">₹{fmt(total)}</div></div>
      <div className="check-row">
        <input type="checkbox" id="bill-autoledger" checked={autoLedger} onChange={(e) => setAutoLedger(e.target.checked)} />
        <label htmlFor="bill-autoledger">{t('modal.alsoAddLedger')}</label>
      </div>
      {err && <div className="errmsg">{err}</div>}
      <div className="field"><button className="btn" onClick={save} disabled={saving}>{saving ? t('common.saving') : t('modal.saveBill')}</button></div>
      <div className="field"><button className="btn ghost" onClick={onClose}>{t('common.cancel')}</button></div>
    </Modal>
  );
}
