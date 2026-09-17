"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { L, Locale } from "./types";
import { defaultLocale, pick } from "./i18n-core";
import { messages } from "@/data/strings";
import { translateLiteral } from "@/data/literal-translations";
import { observeDocumentTranslation } from "./document-translation";

interface I18nContextValue {
  lang: Locale;
  setLang: (l: Locale) => void;
  t: (key: string) => string;
  tr: (v: L | undefined) => string;
  tl: (source: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);
const STORAGE_KEY = "zaya_lang";
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved && messages[saved]) {
        setLangState(saved);
        return;
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      document.documentElement.lang = lang;
    } catch {
      /* ignore */
    }
  }, [lang]);

  useEffect(() => observeDocumentTranslation(lang), [lang]);

  const setLang = useCallback((l: Locale) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
      document.cookie = STORAGE_KEY + "=" + l + ";path=/;max-age=31536000";
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (key: string) =>
      (messages[lang] && messages[lang][key]) ||
      (messages[defaultLocale] && messages[defaultLocale][key]) ||
      key,
    [lang]
  );

  const tr = useCallback((v: L | undefined) => translateLiteral(pick(v, lang), lang), [lang]);
  const tl = useCallback((source: string) => translateLiteral(source, lang), [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t, tr, tl }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n нь LanguageProvider дотор ашиглагдана");
  return ctx;
}
