import { useState } from 'react';
import Modal from '../../../components/Modal';
import { coldApi } from '../../../api/coldStorage';
import { apiErrorMessage } from '../../../api/client';
import { todayStr } from '../../../utils/format';

export default function InEntryModal({ storeId, onClose, onSaved }) {
  const [date, setDate] = useState(todayStr());
  const [time, setTime] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [materialName, setMaterialName] = useState('');
  const [sackCount, setSackCount] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [lenderEntry, setLenderEntry] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [ratePerKg, setRatePerKg] = useState('');
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!lotNumber.trim() || !ownerName.trim() || !materialName.trim()) {
      setErr('Lot number, owner and material are required');
      return;
    }
    setSaving(true);
    setErr('');
    try {
      await coldApi.createInEntry({
        storeId, date, time, lotNumber: lotNumber.trim(), ownerName: ownerName.trim(),
        materialName: materialName.trim(), sackCount, weightKg: Number(weightKg) || 0,
        lenderEntry: lenderEntry.trim(), vehicleNumber: vehicleNumber.trim(), ratePerKg: Number(ratePerKg) || 0,
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
    <Modal title="New IN Entry" onClose={onClose}>
      <div className="field"><label>Date</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
      <div className="field"><label>Time</label><input type="time" value={time} onChange={(e) => setTime(e.target.value)} /></div>
      <div className="field"><label>Lot Number</label><input value={lotNumber} onChange={(e) => setLotNumber(e.target.value)} placeholder="e.g. LOT-014" /></div>
      <div className="field"><label>Product Owner Name</label><input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="e.g. Suresh Patel" /></div>
      <div className="field"><label>Material Name</label><input value={materialName} onChange={(e) => setMaterialName(e.target.value)} placeholder="e.g. Potato" /></div>
      <div className="field"><label>Sack Count</label><input type="number" value={sackCount} onChange={(e) => setSackCount(e.target.value)} placeholder="e.g. 120" /></div>
      <div className="field"><label>Weight (kg)</label><input type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} placeholder="e.g. 6000" /></div>
      <div className="field"><label>Lender Entry</label><input value={lenderEntry} onChange={(e) => setLenderEntry(e.target.value)} placeholder="e.g. self / bank / party" /></div>
      <div className="field"><label>Vehicle Number</label><input value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} placeholder="e.g. MP20 AB 1234" /></div>
      <div className="field"><label>Rate per kg</label><input type="number" value={ratePerKg} onChange={(e) => setRatePerKg(e.target.value)} placeholder="e.g. 8" /></div>
      {err && <div className="errmsg">{err}</div>}
      <div className="field"><button className="btn credit-btn" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save IN Entry'}</button></div>
      <div className="field"><button className="btn ghost" onClick={onClose}>Cancel</button></div>
    </Modal>
  );
}
