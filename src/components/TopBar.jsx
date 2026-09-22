import { useNavigate } from 'react-router-dom';

export default function TopBar({ title, sub, onBack, rightSlot }) {
  const navigate = useNavigate();
  return (
    <div className="topbar">
      {rightSlot && <div className="topbar-actions">{rightSlot}</div>}
      <div className="back-row">
        {onBack && (
          <div className="iconbtn" onClick={() => (typeof onBack === 'function' ? onBack() : navigate(-1))}>
            ←
          </div>
        )}
        <div>
          <h1>{title}</h1>
          {sub && <div className="sub">{sub}</div>}
        </div>
      </div>
    </div>
  );
}
