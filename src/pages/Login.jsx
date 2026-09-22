import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const ok = await login(username, password);
    if (ok) navigate('/firms');
  };

  return (
    <div className="login-wrap">
      <div className="brand-seal">🛍️</div>
      <div className="login-title">Bahi Khata</div>
      <div className="login-sub">Smart ledger &amp; cold storage register</div>
      <form onSubmit={submit}>
        <div className="field">
          <label>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
        </div>
        <div className="field">
          <label>Password</label>
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
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </div>
      </form>
      <div className="login-switch">
        New here? <Link to="/register">Create an account</Link>
      </div>
    </div>
  );
}
