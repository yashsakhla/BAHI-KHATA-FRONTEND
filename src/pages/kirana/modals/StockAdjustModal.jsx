import { useState } from 'react';
import Modal from '../../../components/Modal';
import { kiranaApi } from '../../../api/kirana';
import { apiErrorMessage } from '../../../api/client';
import { useLanguage } from '../../../context/LanguageContext';

export default function StockAdjustModal({ item, onClose, onSaved, onDeleted }) {
  const { t } = useLanguage();
  const [mode, setMode] = useState('add');
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState(item.price);
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    const q = Number(qty);
    if (!q || q <= 0) { setErr(t('modal.validQty')); return; }
    setSaving(true);
    setErr('');
    try {
      await kiranaApi.adjustStock(item._id, { mode, qty: q, price: Number(price) || undefined });
      onSaved?.();
      onClose();
    } catch (e) {
      setErr(apiErrorMessage(e, t('modal.couldNotUpdateStock')));
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
      setErr(apiErrorMessage(e, t('modal.couldNotDeleteItem')));
      setSaving(false);
    }
  };

  return (
    <Modal title={item.name} onClose={onClose}>
      <div className="field">
        <label>{t('modal.currentStock')}</label>
        <input value={`${item.qty} ${item.unit}`} disabled />
      </div>
      <div className="field">
        <label>{t('modal.adjustmentType')}</label>
        <div className="toggle2">
          <div className={`opt${mode === 'add' ? ' sel-add' : ''}`} onClick={() => setMode('add')}>{t('modal.addStock')}</div>
          <div className={`opt${mode === 'reduce' ? ' sel-reduce' : ''}`} onClick={() => setMode('reduce')}>{t('modal.reduceStock')}</div>
        </div>
      </div>
      <div className="field"><label>{t('modal.qtyToAdjust')}</label><input type="number" value={qty} onChange={(e) => setQty(e.target.value)} placeholder={t('modal.qtyToAdjustPh')} /></div>
      <div className="field"><label>{t('modal.updatePrice')}</label><input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder={item.price} /></div>
      {err && <div className="errmsg">{err}</div>}
      <div className="field"><button className="btn" onClick={save} disabled={saving}>{saving ? t('modal.updating') : t('modal.updateStock')}</button></div>
      <div className="field"><button className="btn debit-btn" onClick={del} disabled={saving}>{t('modal.deleteItem')}</button></div>
      <div className="field"><button className="btn ghost" onClick={onClose}>{t('common.cancel')}</button></div>
    </Modal>
  );
}
