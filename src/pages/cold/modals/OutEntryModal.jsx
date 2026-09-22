import { useEffect, useState } from 'react';
import Modal from '../../../components/Modal';
import { coldApi } from '../../../api/coldStorage';
import { apiErrorMessage } from '../../../api/client';
import { todayStr } from '../../../utils/format';

export default function OutEntryModal({ storeId, onClose, onSaved }) {
  const [date, setDate] = useState(todayStr());
  const [ownerName, setOwnerName] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [lots, setLots] = useState([]);
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { coldApi.listLotNumbers(storeId).then(setLots).catch(() => {}); }, [storeId]);

  const save = async () => {
    if (!ownerName.trim()) { setErr('Owner name is required'); return; }
    setSaving(true);
    setErr('');
    try {
      await coldApi.createOutEntry({ storeId, date, outOwnerName: ownerName.trim(), lotNumber: lotNumber.trim() });
      onSaved?.();
      onClose();
    } catch (e) {
      setErr(apiErrorMessage(e, 'Could not save entry'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="New OUT Entry" onClose={onClose}>
      <div className="field"><label>Date</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
      <div className="field"><label>Owner Taken Out</label><input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="e.g. Suresh Patel" /></div>
      <div className="field">
        <label>Lot Number (optional)</label>
        <input list="lot-list" value={lotNumber} onChange={(e) => setLotNumber(e.target.value)} placeholder="e.g. LOT-014" />
        <datalist id="lot-list">{lots.map((l) => <option key={l} value={l} />)}</datalist>
      </div>
      {err && <div className="errmsg">{err}</div>}
      <div className="field"><button className="btn debit-btn" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save OUT Entry'}</button></div>
      <div className="field"><button className="btn ghost" onClick={onClose}>Cancel</button></div>
    </Modal>
  );
}
