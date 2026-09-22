import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Receipt } from 'lucide-react';
import TopBar from '../../components/TopBar';
import Empty from '../../components/Empty';
import { kiranaApi } from '../../api/kirana';
import { fmt } from '../../utils/format';
import EntryModal from './modals/EntryModal';
import BillDetailModal from './modals/BillDetailModal';
import ReceiptDetailModal from './modals/ReceiptDetailModal';

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entryType, setEntryType] = useState(null); // 'debit' | 'credit' | null
  const [viewBill, setViewBill] = useState(null);
  const [viewReceipt, setViewReceipt] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [cust, ents] = await Promise.all([
        kiranaApi.getCustomer(id),
        kiranaApi.listEntries(id),
      ]);
      setCustomer(cust);
      setEntries(ents.sort((a, b) => b.date.localeCompare(a.date)));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (loading || !customer) {
    return (
      <div>
        <TopBar title="Loading…" onBack={() => navigate('/kirana')} />
        <div className="spinner-wrap">Loading…</div>
      </div>
    );
  }

  const debitTotal = entries.filter((e) => e.type === 'debit').reduce((s, e) => s + e.amount, 0);
  const creditTotal = entries.filter((e) => e.type === 'credit').reduce((s, e) => s + e.amount, 0);
  const bal = debitTotal - creditTotal;

  const handleGenerateDoc = async (entry) => {
    if (entry.docId) {
      if (entry.docType === 'bill') setViewBill(await kiranaApi.getBill(entry.docId));
      else setViewReceipt(await kiranaApi.getReceipt(entry.docId));
      return;
    }
    const doc = await kiranaApi.generateDoc(entry._id);
    await load();
    if (entry.type === 'debit') setViewBill(doc);
    else setViewReceipt(doc);
  };

  const deleteAccount = async () => {
    if (!window.confirm(`Delete ${customer.name}? This cannot be undone.`)) return;
    await kiranaApi.deleteCustomer(customer._id);
    navigate('/kirana');
  };

  return (
    <div>
      <TopBar title={customer.name} sub={customer.village ? <><MapPin size={12} style={{ verticalAlign: '-2px', marginRight: 3 }} />{customer.village}</> : ''} onBack={() => navigate('/kirana')} />

      <div className="balance-strip">
        <div className="bpill"><div className="lbl">Debit</div><div className="val amt debit">₹{fmt(debitTotal)}</div></div>
        <div className="bpill"><div className="lbl">Credit</div><div className="val amt credit">₹{fmt(creditTotal)}</div></div>
        <div className="bpill"><div className="lbl">Balance</div><div className={`val amt ${bal > 0 ? 'debit' : bal < 0 ? 'credit' : 'settled'}`}>₹{fmt(Math.abs(bal))}</div></div>
      </div>

      <div style={{ display: 'flex', gap: 10, margin: '14px 16px 0' }}>
        <button className="btn debit-btn small" style={{ flex: 1 }} onClick={() => setEntryType('debit')}>Add Debit</button>
        <button className="btn credit-btn small" style={{ flex: 1 }} onClick={() => setEntryType('credit')}>Add Credit</button>
      </div>

      <div className="section-label">Entry History</div>
      <div className="body-scroll">
        {entries.length === 0 ? (
          <Empty icon={Receipt} msg="No entries yet" />
        ) : entries.map((e) => (
          <div className="card" key={e._id}>
            <div className="tile">
              <div className="tile-row">
                <div className="title-line" style={{ fontSize: 13.5 }}>{e.itemName} × {e.qty}</div>
                <div className={`amt ${e.type}`}>{e.type === 'debit' ? '+' : '−'}₹{fmt(e.amount)}</div>
              </div>
              <div className="tile-detail"><span>{e.date}</span><span className={`badge ${e.type}`}>{e.type === 'debit' ? 'Udhaar' : 'Paid'}</span></div>
              <div style={{ textAlign: 'right', marginTop: 8 }}>
                <button className="doc-gen-btn" onClick={() => handleGenerateDoc(e)}>
                  {e.docId ? 'View Doc' : e.type === 'debit' ? 'Generate Invoice' : 'Generate Receipt'}
                </button>
              </div>
            </div>
          </div>
        ))}
        <div style={{ margin: '18px 16px 40px' }}>
          <button className="btn ghost small" disabled={bal !== 0} onClick={deleteAccount}>
            {bal === 0 ? 'Delete Account (balanced)' : 'Clear balance before deleting'}
          </button>
        </div>
      </div>

      {entryType && (
        <EntryModal
          presetCustomerName={customer.name}
          presetType={entryType}
          customers={[customer]}
          onClose={() => setEntryType(null)}
          onSaved={load}
        />
      )}
      {viewBill && <BillDetailModal bill={viewBill} onClose={() => { setViewBill(null); load(); }} />}
      {viewReceipt && <ReceiptDetailModal receipt={viewReceipt} onClose={() => { setViewReceipt(null); load(); }} />}
    </div>
  );
}
