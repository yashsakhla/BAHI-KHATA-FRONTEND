import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Wheat, Snowflake, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';

export default function Firms() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { t } = useLanguage();

  return (
    <div>
      <div className="topbar">
        <div className="topbar-actions">
          <LanguageToggle />
          <button className="pillbtn" onClick={() => { logout(); navigate('/login'); }}>
            {t('common.logout')}
          </button>
        </div>
        <h1>{t('firms.title')}</h1>
        <div className="sub">{t('firms.sub')}</div>
      </div>
      <div className="body-scroll" style={{ paddingTop: 20 }}>
        <div className="firm-card" onClick={() => navigate('/kirana')}>
          <div className="firm-icon"><ShoppingCart size={22} /></div>
          <div>
            <div className="firm-name">{t('firms.kiranaName')}</div>
            <div className="firm-tag">{t('firms.kiranaTag')}</div>
          </div>
          <div className="firm-arrow"><ArrowRight size={18} /></div>
        </div>
        <div className="firm-card" onClick={() => navigate('/rice-mill')}>
          <div className="firm-icon"><Wheat size={22} /></div>
          <div>
            <div className="firm-name">{t('firms.riceMillName')}</div>
            <div className="firm-tag">{t('firms.riceMillTag')}</div>
          </div>
          <div className="firm-arrow"><ArrowRight size={18} /></div>
        </div>
        <div className="firm-card" onClick={() => navigate('/cold-storage')}>
          <div className="firm-icon"><Snowflake size={22} /></div>
          <div>
            <div className="firm-name">{t('firms.coldName')}</div>
            <div className="firm-tag">{t('firms.coldTag')}</div>
          </div>
          <div className="firm-arrow"><ArrowRight size={18} /></div>
        </div>
      </div>
    </div>
  );
}
