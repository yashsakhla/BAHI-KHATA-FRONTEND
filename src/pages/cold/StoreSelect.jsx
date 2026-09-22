import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Factory, Snowflake, ArrowRight } from 'lucide-react';
import TopBar from '../../components/TopBar';
import Empty from '../../components/Empty';
import Modal from '../../components/Modal';
import { coldApi } from '../../api/coldStorage';
import { apiErrorMessage } from '../../api/client';
import { useLanguage } from '../../context/LanguageContext';

export default function StoreSelect() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await coldApi.listStores(search);
      setStores(data);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!name.trim()) { setErr(t('coldSelect.nameRequired')); return; }
    setSaving(true);
    setErr('');
    try {
      await coldApi.createStore({ name: name.trim() });
      setShowAdd(false);
      setName('');
      load();
    } catch (e) {
      setErr(apiErrorMessage(e, t('coldSelect.couldNotSave')));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <TopBar title={t('coldSelect.title')} sub={t('coldSelect.sub')} onBack={() => navigate('/firms')} />
      <div className="search-wrap">
        <div className="search-box">
          <span><Search size={16} /></span>
          <input placeholder={t('coldSelect.searchPh')} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="body-scroll" style={{ paddingTop: 14 }}>
        {loading ? (
          <div className="spinner-wrap">{t('common.loading')}</div>
        ) : stores.length === 0 ? (
          <Empty icon={Factory} msg={t('coldSelect.empty')} hint={t('coldSelect.emptyHint')} />
        ) : stores.map((s) => (
          <div className="firm-card" key={s._id} onClick={() => navigate(`/cold-storage/${s._id}`)}>
            <div className="firm-icon"><Snowflake size={22} /></div>
            <div>
              <div className="firm-name">{s.name}</div>
              <div className="firm-tag">{s.inCount} IN · {s.outCount} OUT</div>
            </div>
            <div className="firm-arrow"><ArrowRight size={18} /></div>
          </div>
        ))}
      </div>
      <button className="fab" onClick={() => setShowAdd(true)}>+</button>

      {showAdd && (
        <Modal title={t('coldSelect.addTitle')} onClose={() => setShowAdd(false)}>
          <div className="field"><label>{t('coldSelect.nameLabel')}</label><input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('coldSelect.namePh')} /></div>
          {err && <div className="errmsg">{err}</div>}
          <div className="field"><button className="btn" onClick={save} disabled={saving}>{saving ? t('common.saving') : t('common.save')}</button></div>
          <div className="field"><button className="btn ghost" onClick={() => setShowAdd(false)}>{t('common.cancel')}</button></div>
        </Modal>
      )}
    </div>
  );
}
