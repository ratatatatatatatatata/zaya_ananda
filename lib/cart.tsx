"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import type { CartItem, ItemKind } from "./types";

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  ready: boolean;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (kind: ItemKind, slug: string) => void;
  setQty: (kind: ItemKind, slug: string, qty: number) => void;
  clear: () => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  continueBrowsing: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "zaya_cart_v2";
const RETURN_KEY = "zaya_cart_return";
type BrowsePosition = { href: string; top: number };
const isCartRoute = (path: string) => /^\/(cart|checkout)(\/|$)/.test(path);

function readBrowsePosition(): BrowsePosition | null {
  try {
    const value = JSON.parse(sessionStorage.getItem(RETURN_KEY) || "null");
    if (!value || typeof value.href !== "string" || !Number.isFinite(value.top)) return null;
    const url = new URL(value.href, window.location.origin);
    if (url.origin !== window.location.origin || isCartRoute(url.pathname)) return null;
    return { href: url.pathname + url.search + url.hash, top: Math.max(0, value.top) };
  } catch { return null; }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const browsePosition = useRef<BrowsePosition | null>(null);
  const pendingReturn = useRef<BrowsePosition | null>(null);

  const rememberPosition = useCallback(() => {
    if (isCartRoute(window.location.pathname)) return;
    const position = {
      href: window.location.pathname + window.location.search + window.location.hash,
      top: window.scrollY,
    };
    browsePosition.current = position;
    try { sessionStorage.setItem(RETURN_KEY, JSON.stringify(position)); } catch { /* optional */ }
  }, []);
  const close = useCallback(() => setIsOpen(false), []);
  const open = useCallback(() => { rememberPosition(); setIsOpen(true); }, [rememberPosition]);
  const continueBrowsing = useCallback(() => {
    close();
    // Closing the drawer preserves the current page, modal and scroll position.
    if (!isCartRoute(window.location.pathname)) return;
    const position = browsePosition.current || readBrowsePosition() || { href: "/shop", top: 0 };
    pendingReturn.current = position;
    router.push(position.href, { scroll: false });
  }, [close, router]);

  useEffect(() => {
    close();
    const position = pendingReturn.current;
    if (!position || new URL(position.href, window.location.origin).pathname !== pathname) return;
    pendingReturn.current = null;
    // Wait for a streamed destination to become tall enough to restore its section.
    const restore = () => {
      window.scrollTo({ top: position.top, behavior: "instant" as ScrollBehavior });
      if (document.documentElement.scrollHeight - window.innerHeight >= position.top) observer.disconnect();
    };
    const observer = new ResizeObserver(restore);
    observer.observe(document.body);
    const frame = requestAnimationFrame(restore);
    const timeout = window.setTimeout(() => observer.disconnect(), 3000);
    const stop = () => observer.disconnect();
    window.addEventListener("wheel", stop, { once: true, passive: true });
    window.addEventListener("touchstart", stop, { once: true, passive: true });
    return () => {
      cancelAnimationFrame(frame); clearTimeout(timeout); observer.disconnect();
      window.removeEventListener("wheel", stop); window.removeEventListener("touchstart", stop);
    };
  }, [pathname, close]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, ready]);

  const add = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    rememberPosition();
    setItems((prev) => {
      const idx = prev.findIndex(
        (p) => p.kind === item.kind && p.slug === item.slug
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: Math.min(20, next[idx].qty + qty) };
        return next;
      }
      return [...prev, { ...item, qty: Math.max(1, Math.min(20, qty)) }];
    });
    setIsOpen(true);
  }, [rememberPosition]);

  const remove = useCallback((kind: ItemKind, slug: string) => {
    setItems((prev) => prev.filter((p) => !(p.kind === kind && p.slug === slug)));
  }, []);

  const setQty = useCallback((kind: ItemKind, slug: string, qty: number) => {
    setItems((prev) =>
      qty <= 0 ? prev.filter((p) => !(p.kind === kind && p.slug === slug)) : prev.map((p) =>
        p.kind === kind && p.slug === slug
          ? { ...p, qty: Math.max(1, Math.min(20, qty)) }
          : p
      )
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const total = items.reduce((s, i) => s + i.price * i.qty, 0);
    return {
      items,
      count,
      total,
      ready,
      add,
      remove,
      setQty,
      clear,
      isOpen,
      open,
      close,
      continueBrowsing,
    };
  }, [items, ready, isOpen, add, remove, setQty, clear, open, close, continueBrowsing]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart нь CartProvider дотор ашиглагдана");
  return ctx;
}
