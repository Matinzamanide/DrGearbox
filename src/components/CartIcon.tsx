// components/CartIcon.tsx
import React from "react";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { ShoppingCart } from "lucide-react";

const CartIcon: React.FC = () => {
  const { getItemCount, toggleCart } = useShoppingCart();
  const itemCount = getItemCount();

  return (
    <button
      onClick={toggleCart}
      className="fixed bottom-14 left-6 z-50 bg-gradient-to-r from-[#1c4793] to-[#113d64] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
    >
      <ShoppingCart className="w-6 h-6" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-[#e21f25] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </button>
  );
};

export default CartIcon;