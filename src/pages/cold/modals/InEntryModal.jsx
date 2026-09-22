import { useState } from 'react';
import Modal from '../../../components/Modal';
import { coldApi } from '../../../api/coldStorage';
import { apiErrorMessage } from '../../../api/client';
import { todayStr } from '../../../utils/format';
import { useLanguage } from '../../../context/LanguageContext';

export default function InEntryModal({ storeId, onClose, onSaved }) {
  const { t } = useLanguage();
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
      setErr(t('modal.lotOwnerMaterialRequired'));
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
      setErr(apiErrorMessage(e, t('modal.couldNotSaveEntry')));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={t('modal.newInTitle')} onClose={onClose}>
      <div className="field"><label>{t('common.date')}</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
      <div className="field"><label>{t('modal.time')}</label><input type="time" value={time} onChange={(e) => setTime(e.target.value)} /></div>
      <div className="field"><label>{t('modal.lotNumber')}</label><input value={lotNumber} onChange={(e) => setLotNumber(e.target.value)} placeholder={t('modal.lotNumberPh')} /></div>
      <div className="field"><label>{t('modal.productOwnerName')}</label><input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder={t('modal.ownerNamePh')} /></div>
      <div className="field"><label>{t('modal.materialName')}</label><input value={materialName} onChange={(e) => setMaterialName(e.target.value)} placeholder={t('modal.materialNamePh')} /></div>
      <div className="field"><label>{t('modal.sackCount')}</label><input type="number" value={sackCount} onChange={(e) => setSackCount(e.target.value)} placeholder={t('modal.sackCountPh')} /></div>
      <div className="field"><label>{t('modal.weightKg')}</label><input type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} placeholder={t('modal.weightKgPh')} /></div>
      <div className="field"><label>{t('modal.lenderEntry')}</label><input value={lenderEntry} onChange={(e) => setLenderEntry(e.target.value)} placeholder={t('modal.lenderEntryPh')} /></div>
      <div className="field"><label>{t('modal.vehicleNumber')}</label><input value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} placeholder={t('modal.vehicleNumberPh')} /></div>
      <div className="field"><label>{t('modal.ratePerKg')}</label><input type="number" value={ratePerKg} onChange={(e) => setRatePerKg(e.target.value)} placeholder={t('modal.ratePerKgPh')} /></div>
      {err && <div className="errmsg">{err}</div>}
      <div className="field"><button className="btn credit-btn" onClick={save} disabled={saving}>{saving ? t('common.saving') : t('modal.saveInEntry')}</button></div>
      <div className="field"><button className="btn ghost" onClick={onClose}>{t('common.cancel')}</button></div>
    </Modal>
  );
}
