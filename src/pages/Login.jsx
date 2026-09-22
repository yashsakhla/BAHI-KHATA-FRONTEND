import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';

export default function Login() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const ok = await login(username, password);
    if (ok) navigate('/firms');
  };

  return (
    <div className="login-wrap">
      <LanguageToggle light className="login-lang-toggle" />
      <div className="brand-seal"><ShoppingBag size={28} /></div>
      <div className="login-title">{t('login.title')}</div>
      <div className="login-sub">{t('login.sub')}</div>
      <form onSubmit={submit}>
        <div className="field">
          <label>{t('login.username')}</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder={t('login.usernamePh')} required />
        </div>
        <div className="field">
          <label>{t('login.password')}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        {error && <div className="errmsg">{error}</div>}
        <div className="field" style={{ marginTop: 6 }}>
          <button className="btn" disabled={loading} type="submit">
            {loading ? t('login.loggingIn') : t('login.button')}
          </button>
        </div>
      </form>
      <div className="login-switch">
        {t('login.newHere')} <Link to="/register">{t('login.createAccount')}</Link>
      </div>
    </div>
  );
}
