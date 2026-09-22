import { useEffect, useState } from 'react';
import Modal from '../../../components/Modal';
import { kiranaApi } from '../../../api/kirana';
import { apiErrorMessage } from '../../../api/client';
import { todayStr } from '../../../utils/format';

export default function EntryModal({ presetCustomerName, presetType, customers = [], onClose, onSaved }) {
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
      setErr('Please fill customer, item and quantity');
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
      setErr(apiErrorMessage(e, 'Could not save entry'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={type === 'debit' ? 'Add Udhaar (Debit)' : 'Add Payment (Credit)'} onClose={onClose}>
      <div className="field">
        <label>Entry Type</label>
        <div className="toggle2">
          <div className={`opt${type === 'debit' ? ' sel-debit' : ''}`} onClick={() => setType('debit')}>Udhaar (Debit)</div>
          <div className={`opt${type === 'credit' ? ' sel-credit' : ''}`} onClick={() => setType('credit')}>Paid (Credit)</div>
        </div>
      </div>
      <div className="field">
        <label>Customer Name</label>
        <input
          list="entry-cust-list"
          value={customerName}
          onChange={(e) => onCustomerInput(e.target.value)}
          placeholder="e.g. Ramesh Yadav"
          disabled={!!presetCustomerName}
        />
        <datalist id="entry-cust-list">
          {customers.map((c) => <option key={c._id} value={c.name} />)}
        </datalist>
      </div>
      <div className="field"><label>Village / Place</label><input value={village} onChange={(e) => setVillage(e.target.value)} placeholder="e.g. Bargawan" /></div>
      <div className="field"><label>Date</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
      <div className="field"><label>Item / Description</label><input value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="e.g. Rice, Sugar, Oil" /></div>
      <div className="field"><label>Quantity</label><input type="number" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="e.g. 5" /></div>
      <div className="field"><label>Amount (₹)</label><input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 450" /></div>
      <div className="check-row">
        <input type="checkbox" id="entry-gendoc" checked={generateDoc} onChange={(e) => setGenerateDoc(e.target.checked)} />
        <label htmlFor="entry-gendoc">Also generate {type === 'debit' ? 'an invoice' : 'a receipt'} for this entry</label>
      </div>
      {err && <div className="errmsg">{err}</div>}
      <div className="field"><button className={`btn ${type === 'debit' ? 'debit-btn' : 'credit-btn'}`} onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save Entry'}</button></div>
      <div className="field"><button className="btn ghost" onClick={onClose}>Cancel</button></div>
    </Modal>
  );
}
