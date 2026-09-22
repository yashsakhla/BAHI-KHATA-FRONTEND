import { useState } from 'react';
import Modal from '../../../components/Modal';
import { coldApi } from '../../../api/coldStorage';
import { apiErrorMessage } from '../../../api/client';
import { todayStr } from '../../../utils/format';

export default function RentEntryModal({ storeId, onClose, onSaved }) {
  const [date, setDate] = useState(todayStr());
  const [amount, setAmount] = useState('');
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    const amt = Number(amount);
    if (!amt || amt <= 0) { setErr('Enter a valid amount'); return; }
    setSaving(true);
    setErr('');
    try {
      await coldApi.createRentPayment({ storeId, date, amount: amt });
      onSaved?.();
      onClose();
    } catch (e) {
      setErr(apiErrorMessage(e, 'Could not save payment'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="New Rent Payment" onClose={onClose}>
      <div className="field"><label>Date</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
      <div className="field"><label>Amount</label><input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 5000" /></div>
      {err && <div className="errmsg">{err}</div>}
      <div className="field"><button className="btn amber-btn" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save Rent Entry'}</button></div>
      <div className="field"><button className="btn ghost" onClick={onClose}>Cancel</button></div>
    </Modal>
  );
}
