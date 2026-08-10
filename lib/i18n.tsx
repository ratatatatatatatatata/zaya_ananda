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

interface I18nContextValue {
  lang: Locale;
  setLang: (l: Locale) => void;
  t: (key: string) => string;
  tr: (v: L | undefined) => string;
  tl: (source: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);
const STORAGE_KEY = "zaya_lang";
const originalText = new WeakMap<Text, string>();
const appliedText = new WeakMap<Text, string>();
const originalAttributes = new WeakMap<Element, Map<string, string>>();
const appliedAttributes = new WeakMap<Element, Map<string, string>>();
const TRANSLATABLE_ATTRIBUTES = ["placeholder", "title", "aria-label"] as const;

function translateDocument(root: ParentNode, locale: Locale) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode() as Text | null;
  while (node) {
    const parent = node.parentElement;
    if (parent && !parent.closest("script, style, noscript, code, pre, [translate='no']")) {
      const current = node.nodeValue ?? "";
      if (appliedText.get(node) !== current) originalText.set(node, current);
      const source = originalText.get(node) ?? current;
      const leading = source.match(/^\s*/)?.[0] ?? "";
      const trailing = source.match(/\s*$/)?.[0] ?? "";
      const contentEnd = trailing.length ? source.length - trailing.length : source.length;
      const content = source.slice(leading.length, contentEnd);
      const translated = content ? translateLiteral(content, locale) : content;
      const next = leading + translated + trailing;
      if (current !== next) node.nodeValue = next;
      appliedText.set(node, next);
    }
    node = walker.nextNode() as Text | null;
  }

  const elements = root instanceof Element ? [root, ...root.querySelectorAll("*")] : [...root.querySelectorAll("*")];
  for (const element of elements) {
    if (element.closest("[translate='no']")) continue;
    const originals = originalAttributes.get(element) ?? new Map<string, string>();
    const applied = appliedAttributes.get(element) ?? new Map<string, string>();
    for (const attribute of TRANSLATABLE_ATTRIBUTES) {
      const current = element.getAttribute(attribute);
      if (current == null) continue;
      if (applied.get(attribute) !== current) originals.set(attribute, current);
      const source = originals.get(attribute) ?? current;
      const next = translateLiteral(source, locale);
      if (current !== next) element.setAttribute(attribute, next);
      applied.set(attribute, next);
    }
    originalAttributes.set(element, originals);
    appliedAttributes.set(element, applied);
  }
}

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

  useEffect(() => {
    translateDocument(document.body, lang);
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        const target = mutation.type === "characterData" ? mutation.target.parentNode : mutation.target;
        if (target instanceof Element || target instanceof DocumentFragment) translateDocument(target, lang);
      }
    });
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...TRANSLATABLE_ATTRIBUTES],
    });
    return () => observer.disconnect();
  }, [lang]);

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

  const tr = useCallback((v: L | undefined) => pick(v, lang), [lang]);
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
