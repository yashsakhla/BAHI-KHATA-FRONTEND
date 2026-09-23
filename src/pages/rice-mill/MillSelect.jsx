import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Wheat, ArrowRight } from 'lucide-react';
import TopBar from '../../components/TopBar';
import Empty from '../../components/Empty';
import { riceApi } from '../../api/riceMill';
import { useLanguage } from '../../context/LanguageContext';
import MillModal from './modals/MillModal';

export default function MillSelect() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [mills, setMills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await riceApi.listMills(search);
      setMills(data);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <TopBar title={t('millSelect.title')} sub={t('millSelect.sub')} onBack={() => navigate('/firms')} />
      <div className="search-wrap">
        <div className="search-box">
          <span><Search size={16} /></span>
          <input placeholder={t('millSelect.searchPh')} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="body-scroll" style={{ paddingTop: 14 }}>
        {loading ? (
          <div className="spinner-wrap">{t('common.loading')}</div>
        ) : mills.length === 0 ? (
          <Empty icon={Wheat} msg={t('millSelect.empty')} hint={t('millSelect.emptyHint')} />
        ) : mills.map((m) => (
          <div className="firm-card" key={m._id} onClick={() => navigate(`/rice-mill/${m._id}`)}>
            <div className="firm-icon"><Wheat size={22} /></div>
            <div>
              <div className="firm-name">{m.name}</div>
              <div className="firm-tag">{m.intakeCount || 0} IN · {m.outputCount || 0} OUT</div>
            </div>
            <div className="firm-arrow"><ArrowRight size={18} /></div>
          </div>
        ))}
      </div>
      <button className="fab" onClick={() => setShowAdd(true)}>+</button>

      {showAdd && <MillModal onClose={() => setShowAdd(false)} onSaved={load} />}
    </div>
  );
}
