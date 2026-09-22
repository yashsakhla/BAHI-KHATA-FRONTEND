import { Inbox } from 'lucide-react';

export default function Empty({ icon: Icon = Inbox, msg, hint }) {
  return (
    <div className="empty">
      <div className="big"><Icon size={40} strokeWidth={1.5} /></div>
      <div className="msg">{msg}</div>
      {hint && <div className="hint">{hint}</div>}
    </div>
  );
}

//added build
