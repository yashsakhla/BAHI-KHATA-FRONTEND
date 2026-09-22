import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import Empty from '../../components/Empty';
import Modal from '../../components/Modal';
import { coldApi } from '../../api/coldStorage';
import { apiErrorMessage } from '../../api/client';

export default function StoreSelect() {
  const navigate = useNavigate();
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
    if (!name.trim()) { setErr('Cold storage name is required'); return; }
    setSaving(true);
    setErr('');
    try {
      await coldApi.createStore({ name: name.trim() });
      setShowAdd(false);
      setName('');
      load();
    } catch (e) {
      setErr(apiErrorMessage(e, 'Could not save'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <TopBar title="Select Cold Storage" sub="Choose a unit to open" onBack={() => navigate('/firms')} />
      <div className="search-wrap">
        <div className="search-box">
          <span>🔍</span>
          <input placeholder="Search cold storage..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="body-scroll" style={{ paddingTop: 14 }}>
        {loading ? (
          <div className="spinner-wrap">Loading…</div>
        ) : stores.length === 0 ? (
          <Empty icon="🏭" msg="No cold storage added" hint="Tap + to add one" />
        ) : stores.map((s) => (
          <div className="firm-card" key={s._id} onClick={() => navigate(`/cold-storage/${s._id}`)}>
            <div className="firm-icon">❄️</div>
            <div>
              <div className="firm-name">{s.name}</div>
              <div className="firm-tag">{s.inCount} IN · {s.outCount} OUT</div>
            </div>
            <div className="firm-arrow">➔</div>
          </div>
        ))}
      </div>
      <button className="fab" onClick={() => setShowAdd(true)}>+</button>

      {showAdd && (
        <Modal title="Add Cold Storage" onClose={() => setShowAdd(false)}>
          <div className="field"><label>Cold Storage Name</label><input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Manoj Cold Storage Unit 1" /></div>
          {err && <div className="errmsg">{err}</div>}
          <div className="field"><button className="btn" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button></div>
          <div className="field"><button className="btn ghost" onClick={() => setShowAdd(false)}>Cancel</button></div>
        </Modal>
      )}
    </div>
  );
}
