export default function Empty({ icon = '📭', msg, hint }) {
  return (
    <div className="empty">
      <div className="big">{icon}</div>
      <div className="msg">{msg}</div>
      {hint && <div className="hint">{hint}</div>}
    </div>
  );
}
