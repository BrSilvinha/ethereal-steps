import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export function useCartCount() {
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

  return { count, refreshCount: fetchCartCount };
}
