import { useState } from 'react';
import Modal from '../../../components/Modal';
import { coldApi } from '../../../api/coldStorage';
import { apiErrorMessage } from '../../../api/client';
import { todayStr } from '../../../utils/format';
import { useLanguage } from '../../../context/LanguageContext';

export default function RentEntryModal({ storeId, onClose, onSaved }) {
  const { t } = useLanguage();
  const [date, setDate] = useState(todayStr());
  const [amount, setAmount] = useState('');
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    const amt = Number(amount);
    if (!amt || amt <= 0) { setErr(t('modal.validAmount')); return; }
    setSaving(true);
    setErr('');
    try {
      await coldApi.createRentPayment({ storeId, date, amount: amt });
      onSaved?.();
      onClose();
    } catch (e) {
      setErr(apiErrorMessage(e, t('modal.couldNotSavePayment')));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={t('modal.newRentTitle')} onClose={onClose}>
      <div className="field"><label>{t('common.date')}</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
      <div className="field"><label>{t('common.amount')}</label><input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={t('modal.amountPhRent')} /></div>
      {err && <div className="errmsg">{err}</div>}
      <div className="field"><button className="btn amber-btn" onClick={save} disabled={saving}>{saving ? t('common.saving') : t('modal.saveRentEntry')}</button></div>
      <div className="field"><button className="btn ghost" onClick={onClose}>{t('common.cancel')}</button></div>
    </Modal>
  );
}
