import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getContent, type Content, type Lang } from '../data/content';
import { ui, type UiKey } from './ui';

const STORAGE_KEY = 'portfolio-lang';

interface LangState {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
}

// Default value keeps components usable (and testable) without a provider: English.
const LangContext = createContext<LangState>({ lang: 'en', setLang: () => undefined, toggle: () => undefined });

function readStoredLang(): Lang {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'fr' ? 'fr' : 'en';
  } catch {
    return 'en';
  }
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStoredLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode: the choice just isn't remembered */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, toggle: () => setLang(lang === 'en' ? 'fr' : 'en') }), [lang, setLang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const state = useContext(LangContext);
  const t = useCallback(
    (key: UiKey, params?: Record<string, string | number>) => {
      let text: string = ui[state.lang][key] ?? ui.en[key];
      if (params) for (const [k, v] of Object.entries(params)) text = text.replace(`{${k}}`, String(v));
      return text;
    },
    [state.lang],
  );
  return { ...state, t };
}

export function useContent(): Content {
  return getContent(useContext(LangContext).lang);
}
