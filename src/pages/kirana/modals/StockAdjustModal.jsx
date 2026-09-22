import { useState } from 'react';
import Modal from '../../../components/Modal';
import { kiranaApi } from '../../../api/kirana';
import { apiErrorMessage } from '../../../api/client';

export default function StockAdjustModal({ item, onClose, onSaved, onDeleted }) {
  const [mode, setMode] = useState('add');
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState(item.price);
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    const q = Number(qty);
    if (!q || q <= 0) { setErr('Enter a valid quantity'); return; }
    setSaving(true);
    setErr('');
    try {
      await kiranaApi.adjustStock(item._id, { mode, qty: q, price: Number(price) || undefined });
      onSaved?.();
      onClose();
    } catch (e) {
      setErr(apiErrorMessage(e, 'Could not update stock'));
    } finally {
      setSaving(false);
    }
  };

  const del = async () => {
    setSaving(true);
    try {
      await kiranaApi.deleteInventoryItem(item._id);
      onDeleted?.();
      onClose();
    } catch (e) {
      setErr(apiErrorMessage(e, 'Could not delete item'));
      setSaving(false);
    }
  };

  return (
    <Modal title={item.name} onClose={onClose}>
      <div className="field">
        <label>Current Stock</label>
        <input value={`${item.qty} ${item.unit}`} disabled />
      </div>
      <div className="field">
        <label>Adjustment Type</label>
        <div className="toggle2">
          <div className={`opt${mode === 'add' ? ' sel-add' : ''}`} onClick={() => setMode('add')}>Add Stock</div>
          <div className={`opt${mode === 'reduce' ? ' sel-reduce' : ''}`} onClick={() => setMode('reduce')}>Reduce Stock</div>
        </div>
      </div>
      <div className="field"><label>Qty to Adjust</label><input type="number" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="e.g. 10" /></div>
      <div className="field"><label>Update Price</label><input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder={item.price} /></div>
      {err && <div className="errmsg">{err}</div>}
      <div className="field"><button className="btn" onClick={save} disabled={saving}>{saving ? 'Updating…' : 'Update Stock'}</button></div>
      <div className="field"><button className="btn debit-btn" onClick={del} disabled={saving}>Delete Item</button></div>
      <div className="field"><button className="btn ghost" onClick={onClose}>Cancel</button></div>
    </Modal>
  );
}
