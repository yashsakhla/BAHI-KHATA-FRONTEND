import { useState } from 'react';
import Modal from '../../../components/Modal';
import { kiranaApi } from '../../../api/kirana';
import { apiErrorMessage } from '../../../api/client';
import { useLanguage } from '../../../context/LanguageContext';

export default function InventoryModal({ onClose, onSaved }) {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!name.trim()) { setErr(t('modal.itemNameRequired')); return; }
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
      setErr(apiErrorMessage(e, t('modal.couldNotSaveItem')));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={t('modal.addInventoryTitle')} onClose={onClose}>
      <div className="field"><label>{t('modal.itemName')}</label><input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('modal.itemNamePh')} /></div>
      <div className="field"><label>{t('modal.unit')}</label><input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder={t('modal.unitPh')} /></div>
      <div className="field"><label>{t('modal.openingQty')}</label><input type="number" value={qty} onChange={(e) => setQty(e.target.value)} placeholder={t('modal.openingQtyPh')} /></div>
      <div className="field"><label>{t('modal.pricePerUnit')}</label><input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder={t('modal.pricePerUnitPh')} /></div>
      {err && <div className="errmsg">{err}</div>}
      <div className="field"><button className="btn" onClick={save} disabled={saving}>{saving ? t('common.saving') : t('modal.saveItem')}</button></div>
      <div className="field"><button className="btn ghost" onClick={onClose}>{t('common.cancel')}</button></div>
    </Modal>
  );
}
