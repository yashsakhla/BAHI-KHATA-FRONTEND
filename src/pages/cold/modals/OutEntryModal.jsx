import { useEffect, useState } from 'react';
import Modal from '../../../components/Modal';
import { coldApi } from '../../../api/coldStorage';
import { apiErrorMessage } from '../../../api/client';
import { todayStr } from '../../../utils/format';
import { useLanguage } from '../../../context/LanguageContext';

export default function OutEntryModal({ storeId, onClose, onSaved }) {
  const { t } = useLanguage();
  const [date, setDate] = useState(todayStr());
  const [ownerName, setOwnerName] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [lots, setLots] = useState([]);
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { coldApi.listLotNumbers(storeId).then(setLots).catch(() => {}); }, [storeId]);

  const save = async () => {
    if (!ownerName.trim()) { setErr(t('modal.ownerNameRequired')); return; }
    setSaving(true);
    setErr('');
    try {
      await coldApi.createOutEntry({ storeId, date, outOwnerName: ownerName.trim(), lotNumber: lotNumber.trim() });
      onSaved?.();
      onClose();
    } catch (e) {
      setErr(apiErrorMessage(e, t('modal.couldNotSaveEntry')));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={t('modal.newOutTitle')} onClose={onClose}>
      <div className="field"><label>{t('common.date')}</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
      <div className="field"><label>{t('modal.ownerTakenOut')}</label><input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder={t('modal.ownerNamePh')} /></div>
      <div className="field">
        <label>{t('modal.lotNumberOptional')}</label>
        <input list="lot-list" value={lotNumber} onChange={(e) => setLotNumber(e.target.value)} placeholder={t('modal.lotNumberPh')} />
        <datalist id="lot-list">{lots.map((l) => <option key={l} value={l} />)}</datalist>
      </div>
      {err && <div className="errmsg">{err}</div>}
      <div className="field"><button className="btn debit-btn" onClick={save} disabled={saving}>{saving ? t('common.saving') : t('modal.saveOutEntry')}</button></div>
      <div className="field"><button className="btn ghost" onClick={onClose}>{t('common.cancel')}</button></div>
    </Modal>
  );
}
