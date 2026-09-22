import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';

export default function Register() {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [businessName, setBusinessName] = useState('Manoj Kirana Dukan, Rice Mill & Cold Storage');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [localErr, setLocalErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLocalErr('');
    if (password !== confirm) {
      setLocalErr(t('register.errMismatch'));
      return;
    }
    if (password.length < 4) {
      setLocalErr(t('register.errShort'));
      return;
    }
    const ok = await register(username, password, businessName);
    if (ok) navigate('/firms');
  };

  return (
    <div className="login-wrap">
      <LanguageToggle light className="login-lang-toggle" />
      <div className="brand-seal"><ShoppingBag size={28} /></div>
      <div className="login-title">{t('register.title')}</div>
      <div className="login-sub">{t('register.sub')}</div>
      <form onSubmit={submit}>
        <div className="field">
          <label>{t('register.businessName')}</label>
          <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder={t('register.businessNamePh')} />
        </div>
        <div className="field">
          <label>{t('register.username')}</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder={t('register.usernamePh')} required />
        </div>
        <div className="field">
          <label>{t('register.password')}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        <div className="field">
          <label>{t('register.confirmPassword')}</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        {(localErr || error) && <div className="errmsg">{localErr || error}</div>}
        <div className="field" style={{ marginTop: 6 }}>
          <button className="btn" disabled={loading} type="submit">
            {loading ? t('register.creating') : t('register.button')}
          </button>
        </div>
      </form>
      <div className="login-switch">
        {t('register.haveAccount')} <Link to="/login">{t('register.login')}</Link>
      </div>
    </div>
  );
}
