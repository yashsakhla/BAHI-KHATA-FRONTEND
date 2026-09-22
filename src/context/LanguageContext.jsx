import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext(null);

const STORAGE_KEY = 'bahi-khata-lang';

function readStoredLang() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'hi' ? 'hi' : 'en';
  } catch {
    return 'en';
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(readStoredLang);

  const setLang = useCallback((next) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === 'en' ? 'hi' : 'en');
  }, [lang, setLang]);

  const t = useCallback((key, vars) => {
    const dict = translations[lang] || translations.en;
    let str = dict[key] ?? translations.en[key] ?? key;
    if (vars) {
      for (const k of Object.keys(vars)) {
        str = str.replaceAll(`{${k}}`, vars[k]);
      }
    }
    return str;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, toggleLang, t }), [lang, setLang, toggleLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
