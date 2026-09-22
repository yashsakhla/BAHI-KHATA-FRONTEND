import { useState } from 'react';
import Modal from '../../../components/Modal';
import { kiranaApi } from '../../../api/kirana';
import { apiErrorMessage } from '../../../api/client';

export default function InventoryModal({ onClose, onSaved }) {
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!name.trim()) { setErr('Item name is required'); return; }
    setSaving(true);
    setErr('');
    try {
      await kiranaApi.createInventoryItem({
        name: name.trim(),
        unit: unit.trim() || 'unit',
        qty: Number(qty) || 0,
        price: Number(price) || 0,
      });
      onSaved?.();
      onClose();
    } catch (e) {
      setErr(apiErrorMessage(e, 'Could not save item'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Add Inventory Item" onClose={onClose}>
      <div className="field"><label>Item Name</label><input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sugar" /></div>
      <div className="field"><label>Unit</label><input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="e.g. kg, pcs, ltr" /></div>
      <div className="field"><label>Opening Qty</label><input type="number" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="e.g. 50" /></div>
      <div className="field"><label>Price Per Unit</label><input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 45" /></div>
      {err && <div className="errmsg">{err}</div>}
      <div className="field"><button className="btn" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save Item'}</button></div>
      <div className="field"><button className="btn ghost" onClick={onClose}>Cancel</button></div>
    </Modal>
  );
}
