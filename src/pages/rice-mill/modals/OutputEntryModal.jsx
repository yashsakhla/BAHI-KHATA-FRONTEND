import { useEffect, useState } from 'react';
import Modal from '../../../components/Modal';
import { riceApi } from '../../../api/riceMill';
import { apiErrorMessage } from '../../../api/client';
import { todayStr } from '../../../utils/format';
import { useLanguage } from '../../../context/LanguageContext';

export default function OutputEntryModal({ millId, onClose, onSaved }) {
  const { t } = useLanguage();
  const [partyType, setPartyType] = useState('private');
  const [date, setDate] = useState(todayStr());
  const [partyName, setPartyName] = useState('');
  const [riceType, setRiceType] = useState('');
  const [bagsCount, setBagsCount] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [ratePerKg, setRatePerKg] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [linkedIntakeLot, setLinkedIntakeLot] = useState('');
  const [lots, setLots] = useState([]);
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    riceApi.listIntake(millId).then((rows) => {
      setLots([...new Set(rows.map((r) => r.lotNumber).filter(Boolean))]);
    }).catch(() => {});
  }, [millId]);

  const save = async () => {
    if (!partyName.trim()) { setErr(t('modal.partyNameRequired')); return; }
    setSaving(true);
    setErr('');
    try {
      await riceApi.createOutput({
        millId, partyType, partyName: partyName.trim(), date,
        riceType: riceType.trim(), bagsCount: Number(bagsCount) || 0,
        weightKg: Number(weightKg) || 0, ratePerKg: Number(ratePerKg) || 0,
        vehicleNumber: vehicleNumber.trim(), linkedIntakeLot: linkedIntakeLot.trim(),
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
    <Modal title={t('modal.newOutputTitle')} onClose={onClose}>
      <div className="field">
        <label>{t('modal.partyType')}</label>
        <div className="toggle2">
          <div className={`opt${partyType === 'private' ? ' sel-credit' : ''}`} onClick={() => setPartyType('private')}>{t('millHome.private')}</div>
          <div className={`opt${partyType === 'government' ? ' sel-debit' : ''}`} onClick={() => setPartyType('government')}>{t('millHome.government')}</div>
        </div>
      </div>
      <div className="field">
        <label>{t('modal.partyName')}</label>
        <input value={partyName} onChange={(e) => setPartyName(e.target.value)} placeholder={partyType === 'private' ? t('modal.partyNamePrivatePh') : t('modal.partyNameGovtPh')} />
      </div>
      <div className="field"><label>{t('common.date')}</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
      <div className="field"><label>{t('modal.riceType')}</label><input value={riceType} onChange={(e) => setRiceType(e.target.value)} placeholder={t('modal.riceTypePh')} /></div>
      <div className="field"><label>{t('modal.bagsCount')}</label><input type="number" value={bagsCount} onChange={(e) => setBagsCount(e.target.value)} placeholder={t('modal.bagsCountPh')} /></div>
      <div className="field"><label>{t('modal.weightKg')}</label><input type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} placeholder={t('modal.weightKgPh')} /></div>
      <div className="field"><label>{t('modal.ratePerKg')}</label><input type="number" value={ratePerKg} onChange={(e) => setRatePerKg(e.target.value)} placeholder={t('modal.ratePerKgPh')} /></div>
      <div className="field"><label>{t('modal.vehicleNumber')}</label><input value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} placeholder={t('modal.vehicleNumberPh')} /></div>
      <div className="field">
        <label>{t('modal.linkedIntakeLot')}</label>
        <input list="linked-lot-list" value={linkedIntakeLot} onChange={(e) => setLinkedIntakeLot(e.target.value)} placeholder={t('modal.linkedIntakeLotPh')} />
        <datalist id="linked-lot-list">{lots.map((l) => <option key={l} value={l} />)}</datalist>
      </div>
      {err && <div className="errmsg">{err}</div>}
      <div className="field"><button className="btn debit-btn" onClick={save} disabled={saving}>{saving ? t('common.saving') : t('modal.saveOutputEntry')}</button></div>
      <div className="field"><button className="btn ghost" onClick={onClose}>{t('common.cancel')}</button></div>
    </Modal>
  );
}
