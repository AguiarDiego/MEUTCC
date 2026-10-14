
import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  function addItem(product) {
    setItems((prev) => {
      const existing = prev.find(
        (item) => String(item.id) === String(product.id)
      );

      if (existing) {
        return prev.map((item) =>
          String(item.id) === String(product.id)
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          id: product.id,
          qty: 1,
          product: { ...product },
        },
      ];
    });
  }

  function removeItem(id) {
    setItems((prev) =>
      prev.filter((item) => String(item.id) !== String(id))
    );
  }

  function setQty(id, qty) {
    setItems((prev) =>
      prev.map((item) =>
        String(item.id) === String(id)
          ? { ...item, qty: Math.max(1, qty) }
          : item
      )
    );
  }

  const totalCount = useMemo(
    () => items.reduce((sum, item) => sum + item.qty, 0),
    [items]
  );

  const value = { items, addItem, removeItem, setQty, totalCount };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error('useCart deve ser usado dentro de CartProvider');
  }

  return ctx;
}
