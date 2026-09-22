import { Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageToggle({ className = '', light = false }) {
  const { lang, toggleLang } = useLanguage();
  return (
    <button
      type="button"
      className={`pillbtn lang-toggle${light ? ' light' : ''} ${className}`}
      onClick={toggleLang}
      aria-label="Switch language"
    >
      <Languages size={14} />
      <span>{lang === 'en' ? 'EN' : 'हिं'}</span>
    </button>
  );
}
