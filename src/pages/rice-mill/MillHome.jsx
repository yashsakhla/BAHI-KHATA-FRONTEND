import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Search, ArrowDownToLine, ArrowUpFromLine, BarChart3, FolderClock } from 'lucide-react';
import TopBar from '../../components/TopBar';
import Empty from '../../components/Empty';
import { riceApi } from '../../api/riceMill';
import { fmt } from '../../utils/format';
import { useLanguage } from '../../context/LanguageContext';
import IntakeEntryModal from './modals/IntakeEntryModal';
import OutputEntryModal from './modals/OutputEntryModal';

export default function MillHome() {
  const { millId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [mill, setMill] = useState(null);
  const [tab, setTab] = useState('intake');
  const [search, setSearch] = useState('');
  const [partyType, setPartyType] = useState('private');
  const [intakeEntries, setIntakeEntries] = useState([]);
  const [outputEntries, setOutputEntries] = useState([]);
  const [historyEntries, setHistoryEntries] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // 'intake' | 'output' | null

  const TABS = [
    ['intake', t('millHome.tab.intake'), ArrowDownToLine],
    ['output', t('millHome.tab.output'), ArrowUpFromLine],
    ['summary', t('millHome.tab.summary'), BarChart3],
    ['history', t('millHome.tab.history'), FolderClock],
  ];

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const m = await riceApi.getMill(millId);
      setMill(m);
      if (tab === 'intake') {
        const rows = await riceApi.listIntake(millId, partyType, search);
        setIntakeEntries(rows);
      } else if (tab === 'output') {
        const rows = await riceApi.listOutput(millId, partyType, search);
        setOutputEntries(rows);
      } else if (tab === 'summary') {
        const s = await riceApi.getSummary(millId);
        setSummary(s);
      } else {
        const [inRows, outRows] = await Promise.all([
          riceApi.listIntake(millId, undefined, search),
          riceApi.listOutput(millId, undefined, search),
        ]);
        const merged = [
          ...inRows.map((r) => ({ ...r, _kind: 'intake' })),
          ...outRows.map((r) => ({ ...r, _kind: 'output' })),
        ].sort((a, b) => b.date.localeCompare(a.date));
        setHistoryEntries(merged);
      }
    } finally {
      setLoading(false);
    }
  }, [millId, tab, search, partyType]);

  useEffect(() => { load(); }, [load]);

  if (!mill && loading) {
    return (
      <div>
        <TopBar title={t('common.loading')} onBack={() => navigate('/rice-mill')} />
        <div className="spinner-wrap">{t('common.loading')}</div>
      </div>
    );
  }
  if (!mill) return null;

  const yieldGood = summary && summary.yieldPercent >= 65;

  return (
    <div>
      <TopBar title={mill.name} sub={t('millHome.sub')} onBack={() => navigate('/rice-mill')} />
      {tab !== 'summary' && (
        <div className="search-wrap">
          <div className="search-box">
            <span><Search size={16} /></span>
            <input placeholder={t('millHome.searchPh')} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
      )}
      <div className="tabs">
        {TABS.map(([k, l]) => (
          <div key={k} className={`tab${tab === k ? ' active' : ''}`} onClick={() => { setTab(k); setSearch(''); }}>{l}</div>
        ))}
      </div>

      {(tab === 'intake' || tab === 'output') && (
        <div className="field" style={{ margin: '14px 16px 0' }}>
          <div className="toggle2">
            <div className={`opt${partyType === 'private' ? ' sel-credit' : ''}`} onClick={() => setPartyType('private')}>{t('millHome.private')}</div>
            <div className={`opt${partyType === 'government' ? ' sel-debit' : ''}`} onClick={() => setPartyType('government')}>{t('millHome.government')}</div>
          </div>
        </div>
      )}

      <div className="body-scroll">
        {loading && <div className="spinner-wrap">{t('common.loading')}</div>}

        {!loading && tab === 'intake' && (
          intakeEntries.length === 0 ? (
            <Empty icon={ArrowDownToLine} msg={t('millHome.emptyIntake')} hint={t('millHome.emptyIntakeHint')} />
          ) : intakeEntries.map((e) => (
            <div className="card" key={e._id}>
              <div className="tile">
                <div className="tile-row">
                  <div className="title-line" style={{ fontSize: 13.5 }}>{e.lotNumber ? `Lot #${e.lotNumber}` : e.partyName}</div>
                  <span className={`tag-mode ${e.partyType === 'government' ? 'out' : 'in'}`}>{e.partyType === 'government' ? t('millHome.government') : t('millHome.private')}</span>
                </div>
                <div className="tile-detail"><span>{e.partyName}</span><span>{e.date} {e.time || ''}</span></div>
                <div className="tile-detail"><span>{t('millHome.variety')}: {e.paddyVariety || '—'}</span><span>{t('millHome.vehicle')}: {e.vehicleNumber || '—'}</span></div>
                <div className="tile-detail"><span>{e.bagsCount || 0} {t('millHome.bags')} · {e.weightKg || 0} kg</span><span>{t('millHome.moisture')}: {e.moistureContent != null ? `${e.moistureContent}%` : '—'}</span></div>
                <div className="tile-detail"><span>{t('millHome.rate')}: ₹{fmt(e.ratePerKg)}/kg</span><span className="amt debit">≈ ₹{fmt((e.ratePerKg || 0) * (e.weightKg || 0))}</span></div>
              </div>
            </div>
          ))
        )}

        {!loading && tab === 'output' && (
          outputEntries.length === 0 ? (
            <Empty icon={ArrowUpFromLine} msg={t('millHome.emptyOutput')} hint={t('millHome.emptyOutputHint')} />
          ) : outputEntries.map((e) => (
            <div className="card" key={e._id}>
              <div className="tile">
                <div className="tile-row">
                  <div className="title-line" style={{ fontSize: 13.5 }}>{e.riceType || e.partyName}</div>
                  <span className={`tag-mode ${e.partyType === 'government' ? 'out' : 'in'}`}>{e.partyType === 'government' ? t('millHome.government') : t('millHome.private')}</span>
                </div>
                <div className="tile-detail"><span>{e.partyName}</span><span>{e.date}</span></div>
                <div className="tile-detail"><span>{e.bagsCount || 0} {t('millHome.bags')} · {e.weightKg || 0} kg</span><span>{t('millHome.vehicle')}: {e.vehicleNumber || '—'}</span></div>
                <div className="tile-detail"><span>{t('millHome.rate')}: ₹{fmt(e.ratePerKg)}/kg</span><span className="amt debit">≈ ₹{fmt((e.ratePerKg || 0) * (e.weightKg || 0))}</span></div>
                {e.linkedIntakeLot && (
                  <div className="tile-detail"><span>{t('millHome.linkedLot')}: {e.linkedIntakeLot}</span><span /></div>
                )}
              </div>
            </div>
          ))
        )}

        {!loading && tab === 'summary' && summary && (
          <>
            <div className="balance-strip">
              <div className="bpill"><div className="lbl">{t('millHome.totalIntake')}</div><div className="val amt debit">{fmt((summary.intake.private.weightKg || 0) + (summary.intake.government.weightKg || 0))} kg</div></div>
              <div className="bpill"><div className="lbl">{t('millHome.totalOutput')}</div><div className="val amt credit">{fmt((summary.output.private.weightKg || 0) + (summary.output.government.weightKg || 0))} kg</div></div>
              <div className="bpill"><div className="lbl">{t('millHome.yield')}</div><div className={`val amt ${yieldGood ? 'credit' : 'amber'}`}>{fmt(summary.yieldPercent)}%</div></div>
            </div>

            <div className="section-label">{t('millHome.privateBreakdown')}</div>
            <div className="card" style={{ margin: '0 16px 14px' }}>
              <div className="tile">
                <div className="tile-detail"><span>{t('millHome.totalIntake')}</span><span>{summary.intake.private.bags || 0} {t('millHome.bagsShort')} · {fmt(summary.intake.private.weightKg)} kg</span></div>
                <div className="tile-detail"><span>{t('millHome.totalOutput')}</span><span>{summary.output.private.bags || 0} {t('millHome.bagsShort')} · {fmt(summary.output.private.weightKg)} kg</span></div>
              </div>
            </div>

            <div className="section-label">{t('millHome.governmentBreakdown')}</div>
            <div className="card" style={{ margin: '0 16px 14px' }}>
              <div className="tile">
                <div className="tile-detail"><span>{t('millHome.totalIntake')}</span><span>{summary.intake.government.bags || 0} {t('millHome.bagsShort')} · {fmt(summary.intake.government.weightKg)} kg</span></div>
                <div className="tile-detail"><span>{t('millHome.totalOutput')}</span><span>{summary.output.government.bags || 0} {t('millHome.bagsShort')} · {fmt(summary.output.government.weightKg)} kg</span></div>
              </div>
            </div>
          </>
        )}

        {!loading && tab === 'history' && (
          historyEntries.length === 0 ? (
            <Empty icon={FolderClock} msg={t('millHome.emptyHistory')} hint={t('millHome.emptyHistoryHint')} />
          ) : historyEntries.map((e) => (
            <div className="card" key={e._id}>
              <div className="tile">
                <div className="tile-row">
                  <div className="title-line" style={{ fontSize: 13.5 }}>{e._kind === 'intake' ? (e.lotNumber ? `Lot #${e.lotNumber}` : e.partyName) : (e.riceType || e.partyName)}</div>
                  <span className={`tag-mode ${e._kind === 'intake' ? 'in' : 'out'}`}>{e._kind === 'intake' ? t('millHome.tab.intake') : t('millHome.tab.output')}</span>
                </div>
                <div className="tile-detail"><span>{e.partyName}</span><span>{e.date}</span></div>
                <div className="tile-detail"><span>{e.bagsCount || 0} {t('millHome.bags')} · {e.weightKg || 0} kg</span><span className={`badge ${e.partyType === 'government' ? 'debit' : 'credit'}`}>{e.partyType === 'government' ? t('millHome.government') : t('millHome.private')}</span></div>
              </div>
            </div>
          ))
        )}
      </div>

      {(tab === 'intake' || tab === 'output') && (
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

      {modal === 'intake' && <IntakeEntryModal millId={millId} onClose={() => setModal(null)} onSaved={load} />}
      {modal === 'output' && <OutputEntryModal millId={millId} onClose={() => setModal(null)} onSaved={load} />}
    </div>
  );
}
