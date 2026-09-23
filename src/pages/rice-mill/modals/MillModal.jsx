import { useState } from 'react';
import Modal from '../../../components/Modal';
import { riceApi } from '../../../api/riceMill';
import { apiErrorMessage } from '../../../api/client';
import { useLanguage } from '../../../context/LanguageContext';

export default function MillModal({ onClose, onSaved }) {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!name.trim()) { setErr(t('millSelect.nameRequired')); return; }
    setSaving(true);
    setErr('');
    try {
      await riceApi.createMill({ name: name.trim() });
      onSaved?.();
      onClose();
    } catch (e) {
      setErr(apiErrorMessage(e, t('millSelect.couldNotSave')));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={t('millSelect.addTitle')} onClose={onClose}>
      <div className="field"><label>{t('millSelect.nameLabel')}</label><input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('millSelect.namePh')} /></div>
      {err && <div className="errmsg">{err}</div>}
      <div className="field"><button className="btn" onClick={save} disabled={saving}>{saving ? t('common.saving') : t('common.save')}</button></div>
      <div className="field"><button className="btn ghost" onClick={onClose}>{t('common.cancel')}</button></div>
    </Modal>
  );
}
