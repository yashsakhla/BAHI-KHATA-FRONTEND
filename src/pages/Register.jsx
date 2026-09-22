import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState('Manoj Kirana Dukan, Rice Mill & Cold Storage');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [localErr, setLocalErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLocalErr('');
    if (password !== confirm) {
      setLocalErr('Passwords do not match');
      return;
    }
    if (password.length < 4) {
      setLocalErr('Password must be at least 4 characters');
      return;
    }
    const ok = await register(username, password, businessName);
    if (ok) navigate('/firms');
  };

  return (
    <div className="login-wrap">
      <div className="brand-seal">🛍️</div>
      <div className="login-title">Create Account</div>
      <div className="login-sub">Set up access to your Bahi Khata</div>
      <form onSubmit={submit}>
        <div className="field">
          <label>Business Name</label>
          <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Business Name" />
        </div>
        <div className="field">
          <label>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Choose a username" required />
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
        <div className="field">
          <label>Confirm Password</label>
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
            {loading ? 'Creating…' : 'Create Account'}
          </button>
        </div>
      </form>
      <div className="login-switch">
        Already have an account? <Link to="/login">Log in</Link>
      </div>
    </div>
  );
}
