import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, Package, Receipt, FolderClock, MapPin, BookOpen } from 'lucide-react';
import TopBar from '../../components/TopBar';
import Empty from '../../components/Empty';
import { kiranaApi } from '../../api/kirana';
import { fmt } from '../../utils/format';
import { useLanguage } from '../../context/LanguageContext';
import EntryModal from './modals/EntryModal';
import InventoryModal from './modals/InventoryModal';
import StockAdjustModal from './modals/StockAdjustModal';
import NewBillModal from './modals/NewBillModal';
import BillDetailModal from './modals/BillDetailModal';
import ReceiptDetailModal from './modals/ReceiptDetailModal';

export default function KiranaHome() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [tab, setTab] = useState('customers');
  const [search, setSearch] = useState('');

  const [customers, setCustomers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [bills, setBills] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showEntryModal, setShowEntryModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [adjustItem, setAdjustItem] = useState(null);
  const [showNewBill, setShowNewBill] = useState(false);
  const [viewBill, setViewBill] = useState(null);
  const [viewReceipt, setViewReceipt] = useState(null);

  const TABS = [
    ['customers', t('kirana.tab.customers'), Users],
    ['inventory', t('kirana.tab.inventory'), Package],
    ['bills', t('kirana.tab.bills'), Receipt],
    ['history', t('kirana.tab.history'), FolderClock],
  ];

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [c, i, b, e] = await Promise.all([
        kiranaApi.listCustomers(),
        kiranaApi.listInventory(),
        kiranaApi.listBills(),
        kiranaApi.listEntries(),
      ]);
      setCustomers(c);
      setInventory(i);
      setBills(b);
      setEntries(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const q = search.trim().toLowerCase();

  const filteredCustomers = customers.filter(
    (c) => !q || c.name.toLowerCase().includes(q) || (c.village || '').toLowerCase().includes(q),
  );
  const filteredBills = bills
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date) || b.billNo.localeCompare(a.billNo))
    .filter((b) => !q || [b.billNo, b.customerName, b.village].join(' ').toLowerCase().includes(q));
  const filteredEntries = entries
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .filter((e) => {
      if (!q) return true;
      const c = customers.find((x) => x._id === e.customerId);
      return [e.itemName, e.village, c ? c.name : '', e.date].join(' ').toLowerCase().includes(q);
    });

  const handleGenerateDoc = async (entry) => {
    if (entry.docId) {
      if (entry.docType === 'bill') {
        const bill = await kiranaApi.getBill(entry.docId);
        setViewBill(bill);
      } else {
        const receipt = await kiranaApi.getReceipt(entry.docId);
        setViewReceipt(receipt);
      }
      return;
    }
    const doc = await kiranaApi.generateDoc(entry._id);
    await loadAll();
    if (entry.type === 'debit') setViewBill(doc);
    else setViewReceipt(doc);
  };

  return (
    <div>
      <TopBar title={t('kirana.title')} sub={t('kirana.sub')} onBack={() => navigate('/firms')} />
      <div className="search-wrap">
        <div className="search-box">
          <span><Search size={16} /></span>
          <input placeholder={t('kirana.searchPh')} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="tabs">
        {TABS.map(([k, l]) => (
          <div key={k} className={`tab${tab === k ? ' active' : ''}`} onClick={() => { setTab(k); setSearch(''); }}>{l}</div>
        ))}
      </div>

      <div className="body-scroll">
        {loading && <div className="spinner-wrap">{t('common.loading')}</div>}

        {!loading && tab === 'customers' && (
          filteredCustomers.length === 0 ? (
            <Empty icon={BookOpen} msg={t('kirana.emptyCustomers')} hint={t('kirana.emptyCustomersHint')} />
          ) : filteredCustomers.map((c) => (
            <div className="card" key={c._id}>
              <div className="card-row" onClick={() => navigate(`/kirana/customers/${c._id}`)}>
                <div className="avatar">{c.name.slice(0, 1).toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <div className="title-line">{c.name}</div>
                  <div className="sub-line">{c.village ? <><MapPin size={12} style={{ verticalAlign: '-2px', marginRight: 3 }} />{c.village}</> : ''}</div>
                </div>
                <div className={`amt ${c.balance > 0 ? 'debit' : c.balance < 0 ? 'credit' : 'settled'}`}>
                  ₹{fmt(Math.abs(c.balance))}
                </div>
              </div>
            </div>
          ))
        )}

        {!loading && tab === 'inventory' && (
          inventory.length === 0 ? (
            <Empty icon={Package} msg={t('kirana.emptyInventory')} hint={t('kirana.emptyInventoryHint')} />
          ) : inventory
            .filter((i) => !q || i.name.toLowerCase().includes(q))
            .map((item) => (
              <div className="card" key={item._id}>
                <div className="card-row" onClick={() => setAdjustItem(item)}>
                  <div className="avatar"><Package size={18} /></div>
                  <div style={{ flex: 1 }}>
                    <div className="title-line">{item.name}</div>
                    <div className="sub-line">{item.qty} {item.unit} {t('kirana.inStock')}</div>
                  </div>
                  <div className="amt">₹{fmt(item.price)}</div>
                </div>
              </div>
            ))
        )}

        {!loading && tab === 'bills' && (
          filteredBills.length === 0 ? (
            <Empty icon={Receipt} msg={t('kirana.emptyBills')} hint={t('kirana.emptyBillsHint')} />
          ) : filteredBills.map((b) => (
            <div className="card" key={b._id}>
              <div className="card-row" onClick={() => setViewBill(b)}>
                <div className="avatar"><Receipt size={18} /></div>
                <div style={{ flex: 1 }}>
                  <div className="title-line">{b.billNo} · {b.customerName}</div>
                  <div className="sub-line">{b.date} · {b.items.length} {t('kirana.items')}</div>
                </div>
                <div className="amt debit">₹{fmt(b.total)}</div>
              </div>
            </div>
          ))
        )}

        {!loading && tab === 'history' && (
          filteredEntries.length === 0 ? (
            <Empty icon={FolderClock} msg={t('kirana.emptyHistory')} hint={t('kirana.emptyHistoryHint')} />
          ) : filteredEntries.map((e) => {
            const c = customers.find((x) => x._id === e.customerId);
            return (
              <div className="card" key={e._id}>
                <div className="tile">
                  <div className="tile-row">
                    <div className="title-line" style={{ fontSize: 14 }}>{c ? c.name : '—'}</div>
                    <div className={`amt ${e.type}`}>{e.type === 'debit' ? '+' : '−'}₹{fmt(e.amount)}</div>
                  </div>
                  <div className="tile-detail"><span>{e.itemName} × {e.qty}</span><span>{e.date}</span></div>
                  <div className="tile-detail">
                    <span>{e.village ? <><MapPin size={12} style={{ verticalAlign: '-2px', marginRight: 3 }} />{e.village}</> : ''}</span>
                    <span className={`badge ${e.type}`}>{e.type === 'debit' ? t('kirana.udhaar') : t('kirana.paid')}</span>
                  </div>
                  <div style={{ textAlign: 'right', marginTop: 8 }}>
                    <button className="doc-gen-btn" onClick={() => handleGenerateDoc(e)}>
                      {e.docId ? t('kirana.viewDoc') : e.type === 'debit' ? t('kirana.generateInvoice') : t('kirana.generateReceipt')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {tab !== 'history' && (
        <button
          className="fab"
          onClick={() => {
            if (tab === 'customers') setShowEntryModal(true);
            if (tab === 'inventory') setShowInventoryModal(true);
            if (tab === 'bills') setShowNewBill(true);
          }}
        >+</button>
      )}

      <div className="bottomnav">
        {TABS.map(([k, l, Ic]) => (
          <button key={k} className={`navitem${tab === k ? ' active' : ''}`} onClick={() => { setTab(k); setSearch(''); }}>
            <div className="ic"><Ic size={18} /></div>
            <div className="lb">{l}</div>
          </button>
        ))}
      </div>

      {showEntryModal && (
        <EntryModal
          customers={customers}
          onClose={() => setShowEntryModal(false)}
          onSaved={loadAll}
        />
      )}
      {showInventoryModal && (
        <InventoryModal onClose={() => setShowInventoryModal(false)} onSaved={loadAll} />
      )}
      {adjustItem && (
        <StockAdjustModal
          item={adjustItem}
          onClose={() => setAdjustItem(null)}
          onSaved={loadAll}
          onDeleted={loadAll}
        />
      )}
      {showNewBill && (
        <NewBillModal
          customers={customers}
          inventory={inventory}
          onClose={() => setShowNewBill(false)}
          onSaved={(bill) => { loadAll(); setViewBill(bill); }}
        />
      )}
      {viewBill && <BillDetailModal bill={viewBill} onClose={() => { setViewBill(null); loadAll(); }} />}
      {viewReceipt && <ReceiptDetailModal receipt={viewReceipt} onClose={() => { setViewReceipt(null); loadAll(); }} />}
    </div>
  );
}
