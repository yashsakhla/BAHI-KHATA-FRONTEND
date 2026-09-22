export default function Modal({ onClose, title, children }) {
  return (
    <div className="modal-bg" onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div className="modal">
        <div className="modal-handle" />
        {title && <h3>{title}</h3>}
        {children}
      </div>
    </div>
  );
}
