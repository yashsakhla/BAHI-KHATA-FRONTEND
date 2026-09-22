import { useState } from 'react';
import { X } from 'lucide-react';
import Modal from '../../../components/Modal';
import { kiranaApi } from '../../../api/kirana';
import { apiErrorMessage } from '../../../api/client';
import { fmt, todayStr } from '../../../utils/format';

export default function NewBillModal({ customers = [], inventory = [], onClose, onSaved }) {
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
      setErr('Add a customer name and at least one valid item');
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
      setErr(apiErrorMessage(e, 'Could not save bill'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="New Bill" onClose={onClose}>
      <div className="field"><label>Date</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
      <div className="field">
        <label>Customer Name</label>
        <input list="bill-cust-list" value={custName} onChange={(e) => onCustomerInput(e.target.value)} placeholder="e.g. Ramesh Yadav" />
        <datalist id="bill-cust-list">{customers.map((c) => <option key={c._id} value={c.name} />)}</datalist>
      </div>
      <div className="field"><label>Village / Place</label><input value={village} onChange={(e) => setVillage(e.target.value)} placeholder="e.g. Bargawan" /></div>
      <div className="field"><label>WhatsApp Number (optional)</label><input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 91XXXXXXXXXX" /></div>

      <div className="section-label" style={{ marginTop: 6 }}>Bill Items</div>
      {items.map((it, idx) => (
        <div className="line-item" key={idx}>
          <input list={`inv-list-${idx}`} placeholder="Item" value={it.name} onChange={(e) => updateItem(idx, 'name', e.target.value)} />
          <datalist id={`inv-list-${idx}`}>{inventory.map((i) => <option key={i._id} value={i.name} />)}</datalist>
          <input type="number" placeholder="Qty" value={it.qty} onChange={(e) => updateItem(idx, 'qty', e.target.value)} />
          <input type="number" placeholder="Rate" value={it.rate} onChange={(e) => updateItem(idx, 'rate', e.target.value)} />
          <div className="li-amt">₹{fmt((Number(it.qty) || 0) * (Number(it.rate) || 0))}</div>
          <div className="li-remove" onClick={() => removeItem(idx)}><X size={14} /></div>
        </div>
      ))}
      <div className="add-line-btn" onClick={addItem}>+ Add Item</div>

      <div className="bill-total-row"><div className="lbl">Grand Total</div><div className="val">₹{fmt(total)}</div></div>
      <div className="check-row">
        <input type="checkbox" id="bill-autoledger" checked={autoLedger} onChange={(e) => setAutoLedger(e.target.checked)} />
        <label htmlFor="bill-autoledger">Also add this as a ledger entry for the customer</label>
      </div>
      {err && <div className="errmsg">{err}</div>}
      <div className="field"><button className="btn" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save Bill'}</button></div>
      <div className="field"><button className="btn ghost" onClick={onClose}>Cancel</button></div>
    </Modal>
  );
}
