"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";

interface CartContextType {
  count: number;
  refreshCount: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({
  count: 0,
  refreshCount: async () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [count, setCount] = useState(0);

  const fetchCartCount = async () => {
    if (!session) {
      setCount(0);
      return;
    }

    try {
      const response = await fetch("/api/cart/count");
      if (response.ok) {
        const data = await response.json();
        setCount(data.count);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, [session]);

  return (
    <CartContext.Provider value={{ count, refreshCount: fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
