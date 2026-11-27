"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  id: number;
  slug: string;
  name: string;
  priceCents: number;
  compareAtCents?: number | null;
  image: string;
  qty: number;
  stockQty?: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  hydrated: boolean;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (id: number) => void;
  setQty: (id: number, qty: number) => void;
  clearCart: () => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  wishlist: CartItem[];
  isWished: (id: number) => boolean;
  toggleWish: (item: Omit<CartItem, "qty">) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const CART_KEY = "rr_cart_v1";
const WISH_KEY = "rr_wish_v1";

function read<T>(key: string): T[] {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(read<CartItem>(CART_KEY));
    setWishlist(read<CartItem>(WISH_KEY));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
    } catch {
      /* ignore */
    }
  }, [wishlist, hydrated]);

  // Lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const addItem = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, qty: Math.min(i.qty + qty, Math.max(item.stockQty ?? 99, 10)) }
            : i
        );
      }
      return [...prev, { ...item, qty: Math.min(qty, Math.max(item.stockQty ?? 99, 10)) }];
    });
    setDrawerOpen(true);
  }, []);

  const removeItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const setQty = useCallback((id: number, qty: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.id === id
            ? { ...i, qty: Math.max(0, Math.min(qty, Math.max(i.stockQty ?? 99, 10))) }
            : i
        )
        .filter((i) => i.qty > 0)
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const isWished = useCallback((id: number) => wishlist.some((w) => w.id === id), [wishlist]);

  const toggleWish = useCallback((item: Omit<CartItem, "qty">) => {
    setWishlist((prev) =>
      prev.some((w) => w.id === item.id)
        ? prev.filter((w) => w.id !== item.id)
        : [...prev, { ...item, qty: 1 }]
    );
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + i.qty * i.priceCents, 0);
    return {
      items,
      count,
      subtotal,
      hydrated,
      addItem,
      removeItem,
      setQty,
      clearCart,
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      wishlist,
      isWished,
      toggleWish,
    };
  }, [items, hydrated, addItem, removeItem, setQty, clearCart, drawerOpen, wishlist, isWished, toggleWish]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
