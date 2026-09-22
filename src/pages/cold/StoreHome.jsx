import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import Empty from '../../components/Empty';
import { coldApi } from '../../api/coldStorage';
import { fmt } from '../../utils/format';
import InEntryModal from './modals/InEntryModal';
import OutEntryModal from './modals/OutEntryModal';
import RentEntryModal from './modals/RentEntryModal';

const TABS = [
  ['in', 'IN', '⬇️'],
  ['out', 'OUT', '⬆️'],
  ['rent', 'Rent', '💰'],
  ['history', 'History', '🗂️'],
];

export default function StoreHome() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [tab, setTab] = useState('in');
  const [search, setSearch] = useState('');
  const [entries, setEntries] = useState([]);
  const [rentData, setRentData] = useState({ rents: [], totalRent: 0 });
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // 'in' | 'out' | 'rent' | null

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
        <TopBar title="Loading…" onBack={() => navigate('/cold-storage')} />
        <div className="spinner-wrap">Loading…</div>
      </div>
    );
  }
  if (!store) return null;

  return (
    <div>
      <TopBar title={store.name} sub="Cold Storage Register" onBack={() => navigate('/cold-storage')} />
      <div className="search-wrap">
        <div className="search-box">
          <span>🔍</span>
          <input placeholder="Search records..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="tabs">
        {TABS.map(([k, l]) => (
          <div key={k} className={`tab${tab === k ? ' active' : ''}`} onClick={() => { setTab(k); setSearch(''); }}>{l}</div>
        ))}
      </div>

      <div className="body-scroll">
        {loading && <div className="spinner-wrap">Loading…</div>}

        {!loading && tab === 'rent' && (
          <>
            <div className="balance-strip" style={{ marginBottom: 6 }}>
              <div className="bpill" style={{ flex: 1 }}><div className="lbl">Total Rent Paid</div><div className="val amt amber">₹{fmt(rentData.totalRent)}</div></div>
            </div>
            {rentData.rents.length === 0 ? (
              <Empty icon="💰" msg="No rent payments" hint="Tap + to add one" />
            ) : rentData.rents.map((r) => (
              <div className="card" key={r._id}>
                <div className="tile">
                  <div className="tile-row"><div className="title-line" style={{ fontSize: 13.5 }}>Rent Payment</div><span className="tag-mode rent">Rent</span></div>
                  <div className="tile-detail"><span>{r.date}</span><span className="amt amber">₹{fmt(r.amount)}</span></div>
                </div>
              </div>
            ))}
          </>
        )}

        {!loading && tab !== 'rent' && (
          entries.length === 0 ? (
            <Empty icon="📦" msg="No records" hint="Tap + to add an entry" />
          ) : entries.map((e) => e.mode === 'in' ? (
            <div className="card" key={e._id}>
              <div className="tile">
                <div className="tile-row">
                  <div className="title-line" style={{ fontSize: 13.5 }}>Lot #{e.lotNumber}</div>
                  <span className="tag-mode in">IN</span>
                </div>
                <div className="tile-detail"><span>{e.materialName}</span><span>{e.date} {e.time || ''}</span></div>
                <div className="tile-detail"><span>Owner: {e.ownerName}</span><span>Lender: {e.lenderEntry || '—'}</span></div>
                <div className="tile-detail"><span>{e.sackCount} · {e.weightKg} kg</span><span>Vehicle: {e.vehicleNumber || '—'}</span></div>
                <div className="tile-detail"><span>Rate: ₹{fmt(e.ratePerKg)}/kg</span><span className="amt debit">≈ ₹{fmt((e.ratePerKg || 0) * (e.weightKg || 0))}</span></div>
              </div>
            </div>
          ) : (
            <div className="card" key={e._id}>
              <div className="tile">
                <div className="tile-row">
                  <div className="title-line" style={{ fontSize: 13.5 }}>{e.lotNumber ? `Lot #${e.lotNumber}` : ''}</div>
                  <span className="tag-mode out">OUT</span>
                </div>
                <div className="tile-detail"><span>Taken by: {e.outOwnerName}</span><span>{e.date}</span></div>
              </div>
            </div>
          ))
        )}
      </div>

      {tab !== 'history' && (
        <button className="fab" onClick={() => setModal(tab)}>+</button>
      )}

      <div className="bottomnav">
        {TABS.map(([k, l, ic]) => (
          <button key={k} className={`navitem${tab === k ? ' active' : ''}`} onClick={() => { setTab(k); setSearch(''); }}>
            <div className="ic">{ic}</div>
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
