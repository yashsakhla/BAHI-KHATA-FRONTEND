import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Firms() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div>
      <div className="topbar">
        <div className="topbar-actions">
          <button className="pillbtn" onClick={() => { logout(); navigate('/login'); }}>
            Logout
          </button>
        </div>
        <h1>Select an Account</h1>
        <div className="sub">Choose a firm to open</div>
      </div>
      <div className="body-scroll" style={{ paddingTop: 20 }}>
        <div className="firm-card" onClick={() => navigate('/kirana')}>
          <div className="firm-icon">🛒</div>
          <div>
            <div className="firm-name">Manoj Kirana Dukan</div>
            <div className="firm-tag">Ledger, inventory &amp; billing</div>
          </div>
          <div className="firm-arrow">➔</div>
        </div>
        <div className="firm-card" onClick={() => navigate('/cold-storage')}>
          <div className="firm-icon">❄️</div>
          <div>
            <div className="firm-name">Cold Storage</div>
            <div className="firm-tag">Lot register &amp; rent tracking</div>
          </div>
          <div className="firm-arrow">➔</div>
        </div>
      </div>
    </div>
  );
}
