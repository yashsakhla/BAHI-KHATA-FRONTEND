import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Search, ArrowDownToLine, ArrowUpFromLine, Wallet, FolderClock, Package } from 'lucide-react';
import TopBar from '../../components/TopBar';
import Empty from '../../components/Empty';
import { coldApi } from '../../api/coldStorage';
import { fmt } from '../../utils/format';
import { useLanguage } from '../../context/LanguageContext';
import InEntryModal from './modals/InEntryModal';
import OutEntryModal from './modals/OutEntryModal';
import RentEntryModal from './modals/RentEntryModal';

export default function StoreHome() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [store, setStore] = useState(null);
  const [tab, setTab] = useState('in');
  const [search, setSearch] = useState('');
  const [entries, setEntries] = useState([]);
  const [rentData, setRentData] = useState({ rents: [], totalRent: 0 });
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // 'in' | 'out' | 'rent' | null

  const TABS = [
    ['in', t('coldHome.tab.in'), ArrowDownToLine],
    ['out', t('coldHome.tab.out'), ArrowUpFromLine],
    ['rent', t('coldHome.tab.rent'), Wallet],
    ['history', t('coldHome.tab.history'), FolderClock],
  ];

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const s = await coldApi.getStore(storeId);
      setStore(s);
      if (tab === 'rent') {
        const r = await coldApi.listRentPayments(storeId, search);
        setRentData(r);
      } else {
        const mode = tab === 'history' ? undefined : tab;
        const e = await coldApi.listEntries(storeId, mode, search);
        setEntries(e);
      }
    } finally {
      setLoading(false);
    }
  }, [storeId, tab, search]);

  useEffect(() => { load(); }, [load]);

  if (!store && loading) {
    return (
      <div>
        <TopBar title={t('common.loading')} onBack={() => navigate('/cold-storage')} />
        <div className="spinner-wrap">{t('common.loading')}</div>
      </div>
    );
  }
  if (!store) return null;

  return (
    <div>
      <TopBar title={store.name} sub={t('coldHome.sub')} onBack={() => navigate('/cold-storage')} />
      <div className="search-wrap">
        <div className="search-box">
          <span><Search size={16} /></span>
          <input placeholder={t('coldHome.searchPh')} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="tabs">
        {TABS.map(([k, l]) => (
          <div key={k} className={`tab${tab === k ? ' active' : ''}`} onClick={() => { setTab(k); setSearch(''); }}>{l}</div>
        ))}
      </div>

      <div className="body-scroll">
        {loading && <div className="spinner-wrap">{t('common.loading')}</div>}

        {!loading && tab === 'rent' && (
          <>
            <div className="balance-strip" style={{ marginBottom: 6 }}>
              <div className="bpill" style={{ flex: 1 }}><div className="lbl">{t('coldHome.totalRentPaid')}</div><div className="val amt amber">₹{fmt(rentData.totalRent)}</div></div>
            </div>
            {rentData.rents.length === 0 ? (
              <Empty icon={Wallet} msg={t('coldHome.emptyRent')} hint={t('coldHome.emptyRentHint')} />
            ) : rentData.rents.map((r) => (
              <div className="card" key={r._id}>
                <div className="tile">
                  <div className="tile-row"><div className="title-line" style={{ fontSize: 13.5 }}>{t('coldHome.rentPayment')}</div><span className="tag-mode rent">{t('coldHome.rent')}</span></div>
                  <div className="tile-detail"><span>{r.date}</span><span className="amt amber">₹{fmt(r.amount)}</span></div>
                </div>
              </div>
            ))}
          </>
        )}

        {!loading && tab !== 'rent' && (
          entries.length === 0 ? (
            <Empty icon={Package} msg={t('coldHome.emptyRecords')} hint={t('coldHome.emptyRecordsHint')} />
          ) : entries.map((e) => e.mode === 'in' ? (
            <div className="card" key={e._id}>
              <div className="tile">
                <div className="tile-row">
                  <div className="title-line" style={{ fontSize: 13.5 }}>Lot #{e.lotNumber}</div>
                  <span className="tag-mode in">IN</span>
                </div>
                <div className="tile-detail"><span>{e.materialName}</span><span>{e.date} {e.time || ''}</span></div>
                <div className="tile-detail"><span>{t('coldHome.owner')}: {e.ownerName}</span><span>{t('coldHome.lender')}: {e.lenderEntry || '—'}</span></div>
                <div className="tile-detail"><span>{e.sackCount} · {e.weightKg} kg</span><span>{t('coldHome.vehicle')}: {e.vehicleNumber || '—'}</span></div>
                <div className="tile-detail"><span>{t('coldHome.rate')}: ₹{fmt(e.ratePerKg)}/kg</span><span className="amt debit">≈ ₹{fmt((e.ratePerKg || 0) * (e.weightKg || 0))}</span></div>
              </div>
            </div>
          ) : (
            <div className="card" key={e._id}>
              <div className="tile">
                <div className="tile-row">
                  <div className="title-line" style={{ fontSize: 13.5 }}>{e.lotNumber ? `Lot #${e.lotNumber}` : ''}</div>
                  <span className="tag-mode out">OUT</span>
                </div>
                <div className="tile-detail"><span>{t('coldHome.takenBy')}: {e.outOwnerName}</span><span>{e.date}</span></div>
              </div>
            </div>
          ))
        )}
      </div>

      {tab !== 'history' && (
        <button className="fab" onClick={() => setModal(tab)}>+</button>
      )}

      <div className="bottomnav">
        {TABS.map(([k, l, Ic]) => (
          <button key={k} className={`navitem${tab === k ? ' active' : ''}`} onClick={() => { setTab(k); setSearch(''); }}>
            <div className="ic"><Ic size={18} /></div>
            <div className="lb">{l}</div>
          </button>
        ))}
      </div>

      {modal === 'in' && <InEntryModal storeId={storeId} onClose={() => setModal(null)} onSaved={load} />}
      {modal === 'out' && <OutEntryModal storeId={storeId} onClose={() => setModal(null)} onSaved={load} />}
      {modal === 'rent' && <RentEntryModal storeId={storeId} onClose={() => setModal(null)} onSaved={load} />}
    </div>
  );
}
