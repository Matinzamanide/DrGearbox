// context/ShoppingCartContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import type { IProduct } from "../pages/Product/Product";

export interface CartItem {
  id: string;
  productId: number;
  product: IProduct;
  title: string;
  price: number;
  quantity: number;
  selectedOptions: Record<string, { 
    value: string; 
    modifier: number;
    modifier_type?: "fixed" | "percent";
  }>;
  totalPrice: number;
  image: string;
}

export interface CartSummary {
  totalItems: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  grandTotal: number;
}

interface ShoppingCartContextType {
  items: CartItem[];
  summary: CartSummary;
  isLoading: boolean;
  isOpen: boolean;
  error: string | null;
  addToCart: (product: IProduct, selectedOptions: Record<string, any>, quantity?: number) => boolean;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => boolean;
  clearCart: () => void;
  toggleCart: () => void;
  closeCart: () => void;
  openCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  getItemCount: () => number;
  getSubtotal: () => number;
  clearError: () => void;
  getAvailableStock: (itemId: string) => number;
}

const SHIPPING_COST = 50000;
const TAX_RATE = 0.00;
const STORAGE_KEY = "shopping_cart";

const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(undefined);

export const useShoppingCart = () => {
  const context = useContext(ShoppingCartContext);
  if (!context) {
    throw new Error("useShoppingCart must be used within a ShoppingCartProvider");
  }
  return context;
};

export const ShoppingCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // بارگذاری از localStorage در ابتدای کار
  useEffect(() => {
    const savedCart = localStorage.getItem(STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          // اعتبارسنجی آیتم‌های موجود در سبد با موجودی فعلی
          const validatedCart = parsedCart.filter((item: CartItem) => {
            const product = item.product;
            const availableStock = Number(product.inventory);
            return item.quantity <= availableStock;
          });
          setItems(validatedCart);
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
    setIsInitialized(true);
  }, []);

  // ذخیره در localStorage هنگام تغییر سبد خرید
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isInitialized]);

  // محاسبه خلاصه سبد خرید
  const summary = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const shipping = subtotal > 1000000 ? 0 : SHIPPING_COST;
    const tax = subtotal * TAX_RATE;
    const grandTotal = subtotal + shipping + tax - couponDiscount;
    
    return {
      totalItems,
      subtotal,
      discount: couponDiscount,
      shipping,
      tax,
      grandTotal: Math.max(grandTotal, 0),
    };
  }, [items, couponDiscount]);

  // تولید ID یکتا برای هر آیتم
  const generateItemId = (productId: number, selectedOptions: Record<string, any>): string => {
    const optionsKey = Object.entries(selectedOptions)
      .sort()
      .map(([key, value]) => `${key}:${value.value}`)
      .join("|");
    return `${productId}|${optionsKey}`;
  };

  // محاسبه قیمت نهایی محصول با احتساب آپشن‌ها
  const calculateItemPrice = (product: IProduct, selectedOptions: Record<string, any>): number => {
    const basePrice = Number(product.base_price);
    let modifiersSum = 0;
    
    Object.entries(selectedOptions).forEach(([optionName, opt]) => {
      const option = product.options?.find(o => o.name === optionName);
      const choice = option?.choices?.find(c => c.value === opt.value);
      const modifierType = choice?.modifier_type || opt.modifier_type || "fixed";
      const modifierValue = opt.modifier;
      
      if (modifierType === "percent") {
        modifiersSum += (basePrice * modifierValue) / 100;
      } else {
        modifiersSum += modifierValue;
      }
    });
    
    return basePrice + modifiersSum;
  };

  // بررسی موجودی در سبد خرید برای یک آیتم خاص
  const getCurrentItemQuantity = (itemId: string): number => {
    const item = items.find(i => i.id === itemId);
    return item?.quantity || 0;
  };

  // دریافت موجودی قابل سفارش برای یک آیتم
  const getAvailableStock = (itemId: string): number => {
    const item = items.find(i => i.id === itemId);
    if (!item) return 0;
    const totalStock = Number(item.product.inventory);
    return Math.max(0, totalStock - 0); // فقط موجودی کل محصول
  };

  // افزودن به سبد خرید (با بررسی موجودی)
  const addToCart = useCallback((
    product: IProduct,
    selectedOptions: Record<string, any>,
    quantity: number = 1
  ): boolean => {
    const itemId = generateItemId(product.id, selectedOptions);
    const currentQuantity = getCurrentItemQuantity(itemId);
    const newQuantity = currentQuantity + quantity;
    const availableStock = Number(product.inventory);
    
    // بررسی موجودی
    if (newQuantity > availableStock) {
      setError(`امکان افزودن بیشتر از موجودی انبار (${availableStock} عدد) وجود ندارد`);
      setTimeout(() => setError(null), 3000);
      return false;
    }
    
    const price = calculateItemPrice(product, selectedOptions);
    const totalPrice = price * newQuantity;
    
    setItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === itemId);
      
      if (existingIndex !== -1) {
        // به‌روزرسانی تعداد
        const newItems = [...prev];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newQuantity,
          totalPrice: price * newQuantity,
        };
        return newItems;
      }
      
      // افزودن آیتم جدید
      return [...prev, {
        id: itemId,
        productId: product.id,
        product,
        title: product.title,
        price,
        quantity,
        selectedOptions,
        totalPrice,
        image: product.image?.[0] || "/placeholder.png",
      }];
    });
    
    // باز کردن سبد خرید
    setIsOpen(true);
    setError(null);
    return true;
  }, []);

  // حذف از سبد خرید
  const removeFromCart = useCallback((itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
    setError(null);
  }, []);

  // به‌روزرسانی تعداد (با بررسی موجودی)
  const updateQuantity = useCallback((itemId: string, quantity: number): boolean => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return true;
    }
    
    const item = items.find(i => i.id === itemId);
    if (!item) return false;
    
    const availableStock = Number(item.product.inventory);
    
    if (quantity > availableStock) {
      setError(`امکان افزودن بیشتر از موجودی انبار (${availableStock} عدد) وجود ندارد`);
      setTimeout(() => setError(null), 3000);
      return false;
    }
    
    setItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, quantity, totalPrice: item.price * quantity }
          : item
      )
    );
    setError(null);
    return true;
  }, [items, removeFromCart]);

  // خالی کردن سبد خرید
  const clearCart = useCallback(() => {
    if (window.confirm("آیا از حذف تمام محصولات از سبد خرید مطمئن هستید؟")) {
      setItems([]);
      setCouponDiscount(0);
      localStorage.removeItem(STORAGE_KEY);
      setError(null);
    }
  }, []);

  // اعمال کد تخفیف
  const applyCoupon = useCallback(async (code: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const validCoupons: Record<string, number> = {
        "WELCOME10": 0.1,
        "SAVE20": 0.2,
        "FREESHIP": 50000,
      };
      
      if (validCoupons[code.toUpperCase()]) {
        const discountValue = validCoupons[code.toUpperCase()];
        if (typeof discountValue === "number" && discountValue < 1) {
          setCouponDiscount(summary.subtotal * discountValue);
        } else {
          setCouponDiscount(discountValue);
        }
        return true;
      }
      setError("کد تخفیف نامعتبر است");
      setTimeout(() => setError(null), 3000);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [summary.subtotal]);

  // پاک کردن خطا
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // توابع کنترل مودال
  const toggleCart = useCallback(() => setIsOpen(prev => !prev), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  
  // توابع کمکی
  const getItemCount = useCallback(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const getSubtotal = useCallback(() => items.reduce((sum, item) => sum + item.totalPrice, 0), [items]);

  return (
    <ShoppingCartContext.Provider value={{
      items,
      summary,
      isLoading,
      isOpen,
      error,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleCart,
      closeCart,
      openCart,
      applyCoupon,
      getItemCount,
      getSubtotal,
      clearError,
      getAvailableStock,
    }}>
      {children}
    </ShoppingCartContext.Provider>
  );
}