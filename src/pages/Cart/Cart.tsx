// components/CartDrawer.tsx
import React, { useState } from "react";
import { 
  X, Trash2, Plus, Minus, ShoppingBag, CreditCard, 
  Truck, Tag, AlertCircle, Shield, Clock, 
  ArrowLeft, TrendingUp, Percent, Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useShoppingCart } from "../../context/ShoppingCartContext";

const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { 
    items, 
    summary, 
    isOpen, 
    closeCart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    applyCoupon 
  } = useShoppingCart();
  
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState(false);
  const [isCouponLoading, setIsCouponLoading] = useState(false);

  const formatPrice = (price: number) => {
    return price.toLocaleString("fa-IR") + " تومان";
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      setCouponError("لطفاً کد تخفیف را وارد کنید");
      return;
    }
    
    setIsCouponLoading(true);
    const success = await applyCoupon(couponInput);
    if (success) {
      setCouponSuccess(true);
      setCouponError(null);
      setTimeout(() => setCouponSuccess(false), 3000);
    } else {
      setCouponError("کد تخفیف معتبر نیست");
    }
    setCouponInput("");
    setIsCouponLoading(false);
  };

  const handleProductClick = (title: string) => {
    closeCart();
    navigate(`/product/${encodeURIComponent(title)}`);
  };

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* پس‌زمینه با blur */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000] transition-all duration-300"
        onClick={closeCart}
      />
      
      {/* سایدبار سبد خرید با طراحی مدرن */}
      <div className="fixed top-0 left-0 w-full sm:w-[450px] h-full bg-white shadow-2xl z-[1001] transition-all duration-500 ease-out flex flex-col animate-slide-in">
        
        {/* هدر با گرادیانت مدرن */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1c4793] to-[#113d64] opacity-95" />
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#32a3db]/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">سبد خرید</h2>
                <p className="text-xs text-blue-200 mt-0.5">
                  {items.length} محصول • {summary.totalItems} عدد
                </p>
              </div>
            </div>
            <button 
              onClick={closeCart}
              className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-all duration-300 group"
            >
              <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </div>
        
        {/* لیست محصولات با طراحی کارتی */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-5 shadow-inner">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">سبد خرید خالی است</h3>
              <p className="text-gray-500 text-sm mb-6">محصولات مورد نظر خود را به سبد اضافه کنید</p>
              <button 
                onClick={closeCart}
                className="px-6 py-2.5 bg-gradient-to-r from-[#1c4793] to-[#113d64] text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                ادامه خرید
              </button>
            </div>
          ) : (
            items.map((item, idx) => (
              <div 
                key={item.id} 
                className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 animate-fade-in-up"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex gap-4 p-4">
                  {/* تصویر محصول */}
                  <div 
                    className="relative w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 cursor-pointer flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                    onClick={() => handleProductClick(item.title)}
                  >
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    {item.quantity > 0 && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-[#1c4793] to-[#113d64] text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                        {item.quantity}
                      </div>
                    )}
                  </div>
                  
                  {/* اطلاعات محصول */}
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => handleProductClick(item.title)}
                      className="font-bold text-gray-800 hover:text-[#1c4793] transition-colors text-sm line-clamp-2 text-right w-full"
                    >
                      {item.title}
                    </button>
                    
                    {/* آپشن‌ها */}
                    {Object.keys(item.selectedOptions).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {Object.entries(item.selectedOptions).map(([key, val]) => (
                          <span key={key} className="inline-flex items-center gap-1 text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                            <span className="font-medium">{key}:</span>
                            {val.value}
                            {val.modifier_type === "percent" && val.modifier !== 0 && (
                              <span className="text-[#32a3db]">
                                ({val.modifier > 0 ? `+${val.modifier}%` : `${val.modifier}%`})
                              </span>
                            )}
                            {val.modifier_type !== "percent" && val.modifier !== 0 && (
                              <span className="text-[#32a3db]">
                                ({val.modifier > 0 ? `+${val.modifier.toLocaleString("fa-IR")}` : val.modifier.toLocaleString("fa-IR")})
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* قیمت و کنترل تعداد */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center bg-white rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
                        >
                          <Minus className="w-3.5 h-3.5 text-gray-600" />
                        </button>
                        <span className="w-8 text-center font-semibold text-sm text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center bg-white rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5 text-gray-600" />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold text-[#1c4793] text-base">
                          {formatPrice(item.price)}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* بخش تخفیف و جمع - طراحی مدرن */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 bg-gradient-to-b from-white to-gray-50">
            
            {/* بخش کوپن تخفیف */}
            <div className="p-5 border-b border-gray-100">
              <div className="relative">
                <div className="flex gap-2">
                 
                </div>
                {couponError && (
                  <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {couponError}
                  </p>
                )}
                {couponSuccess && (
                  <p className="text-xs text-green-500 mt-2 flex items-center gap-1 animate-pulse">
                    <CheckCircle className="w-3 h-3" />
                    کد تخفیف با موفقیت اعمال شد
                  </p>
                )}
              </div>
            </div>
            
            {/* جزئیات قیمت */}
            <div className="p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">مجموع قیمت</span>
                <span className="font-semibold text-gray-800">{formatPrice(summary.subtotal)}</span>
              </div>
              
              {summary.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1 text-green-600">
                    <Percent className="w-4 h-4" />
                    تخفیف
                  </span>
                  <span className="font-semibold text-green-600">- {formatPrice(summary.discount)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1 text-gray-500">
                  <Truck className="w-4 h-4" />
                  هزینه ارسال
                </span>
                <span className="font-semibold text-gray-600">پس کرایه</span>
              </div>
              
              {/* نوار پیشرفت برای ارسال رایگان */}
              {summary.subtotal < 1000000 && (
                <div className="bg-blue-50 rounded-xl p-3 mt-2">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-blue-700">برای ارسال رایگان</span>
                    <span className="text-blue-700 font-semibold">
                      {formatPrice(1000000 - summary.subtotal)} دیگر
                    </span>
                  </div>
                  <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#1c4793] to-[#32a3db] rounded-full transition-all duration-500"
                      style={{ width: `${(summary.subtotal / 1000000) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-3 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-800 font-bold">قابل پرداخت</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#1c4793]">
                      {formatPrice(summary.grandTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* دکمه‌های اقدام */}
            <div className="p-5 pt-0 space-y-3">
              <button
                onClick={handleCheckout}
                className="w-full py-3.5 bg-gradient-to-r from-[#1c4793] to-[#113d64] text-white rounded-xl font-bold hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                تسویه حساب و تکمیل سفارش
              </button>
              
              <button
                onClick={clearCart}
                className="w-full py-3 border-2 border-red-200 text-red-500 rounded-xl font-medium hover:bg-red-50 hover:border-red-300 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                خالی کردن سبد خرید
              </button>
            </div>
            
            {/* ضمانت‌ها */}
            <div className="p-5 pt-0 flex justify-center gap-6 text-xs text-gray-400 border-t border-gray-100 pt-4">
              <div className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                <span>گارانتی اصالت</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>تحویل سریع</span>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>مشاوره رایگان</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* استایل‌های اضافی */}
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out forwards;
          opacity: 0;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </>
  );
};

export default CartDrawer;

// اضافه کردن کامپوننت CheckCircle که در کد استفاده شده
const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);




































// components/CartDrawer.tsx
// import React, { useState } from "react";
// import { 
//   X, Trash2, Plus, Minus, ShoppingBag, 
//   Truck, Tag, AlertCircle, Shield, Clock, 
//   ArrowLeft, Percent,  Zap,
//    Gift, Wallet, BadgeCheck,
//   ChevronRight, Coffee, Layers
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useShoppingCart } from "../../context/ShoppingCartContext";

// const CheckCircle = ({ className }: { className?: string }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//   </svg>
// );

// const CartDrawer: React.FC = () => {
//   const navigate = useNavigate();
//   const { 
//     items, 
//     summary, 
//     isOpen, 
//     closeCart, 
//     updateQuantity, 
//     removeFromCart, 
//     clearCart, 
//     applyCoupon 
//   } = useShoppingCart();
  
//   const [couponInput, setCouponInput] = useState("");
//   const [couponError, setCouponError] = useState<string | null>(null);
//   const [couponSuccess, setCouponSuccess] = useState(false);
//   const [isCouponLoading, setIsCouponLoading] = useState(false);
//   const [isRemoving, setIsRemoving] = useState<string | null>(null);
//   const [animationItems, setAnimationItems] = useState<string[]>([]);

//   const formatPrice = (price: number) => {
//     return price.toLocaleString("fa-IR") + " تومان";
//   };

//   const handleApplyCoupon = async () => {
//     if (!couponInput.trim()) {
//       setCouponError("لطفاً کد تخفیف را وارد کنید");
//       return;
//     }
    
//     setIsCouponLoading(true);
//     const success = await applyCoupon(couponInput);
//     if (success) {
//       setCouponSuccess(true);
//       setCouponError(null);
//       setTimeout(() => setCouponSuccess(false), 3000);
//     } else {
//       setCouponError("کد تخفیف معتبر نیست");
//     }
//     setCouponInput("");
//     setIsCouponLoading(false);
//   };

//   const handleProductClick = (title: string) => {
//     closeCart();
//     navigate(`/product/${encodeURIComponent(title)}`);
//   };

//   const handleCheckout = () => {
//     closeCart();
//     navigate("/checkout");
//   };

//   const handleRemoveItem = (itemId: string) => {
//     setIsRemoving(itemId);
//     setTimeout(() => {
//       removeFromCart(itemId);
//       setIsRemoving(null);
//     }, 300);
//   };

//   // پیشنهادات ویژه
//   const specialOffers = [
//     { text: "ارسال رایگان برای سفارش‌های بالای ۱,۰۰۰,۰۰۰ تومان", icon: Truck },
//     { text: "۱۰٪ تخفیف ویژه با کد WELCOME10", icon: Percent },
//     { text: "ضمانت بهترین قیمت", icon: Shield }
//   ];

//   if (!isOpen) return null;

//   return (
//     <>
//       {/* پس‌زمینه با blur مدرن */}
//       <div 
//         className="fixed inset-0 bg-black/50 backdrop-blur-md z-[1000] transition-all duration-500"
//         style={{ animation: 'fadeIn 0.3s ease-out' }}
//         onClick={closeCart}
//       />
      
//       {/* سایدبار سبد خرید با طراحی مدرن */}
//       <div className="fixed top-0 left-0 w-full sm:w-[480px] h-full bg-white shadow-2xl z-[1001] transition-all duration-500 ease-out flex flex-col animate-slide-in">
        
//         {/* هدر با طراحی مدرن */}
//         <div className="relative overflow-hidden">
//           {/* پس‌زمینه گرادیانت با افکت */}
//           <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900" />
//           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
          
//           {/* افکت‌های دایره‌ای */}
//           <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
//           <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#32a3db]/10 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
//           {/* افکت نورانی */}
//           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          
//           <div className="relative p-6 flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="relative">
//                 <div className="absolute inset-0 bg-white/20 rounded-2xl blur-lg" />
//                 <div className="relative w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
//                   <ShoppingBag className="w-6 h-6 text-white" />
//                 </div>
//               </div>
//               <div>
//                 <h2 className="text-2xl font-bold text-white tracking-tight">سبد خرید</h2>
//                 <div className="flex items-center gap-2 mt-0.5">
//                   <p className="text-xs text-indigo-200">
//                     {items.length} محصول
//                   </p>
//                   <div className="w-1 h-1 bg-indigo-300 rounded-full" />
//                   <p className="text-xs text-indigo-200">
//                     {summary.totalItems} عدد
//                   </p>
//                 </div>
//               </div>
//             </div>
            
//             <button 
//               onClick={closeCart}
//               className="group relative w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 overflow-hidden"
//             >
//               <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
//               <X className="w-5 h-5 text-white relative z-10 group-hover:rotate-90 transition-transform duration-300" />
//             </button>
//           </div>
//         </div>
        
//         {/* لیست محصولات با طراحی مدرن */}
//         <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-gradient-to-b from-gray-50 to-white">
//           {items.length === 0 ? (
//             <div className="flex flex-col items-center justify-center h-full text-center py-20">
//               <div className="relative">
//                 <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-inner">
//                   <ShoppingBag className="w-14 h-14 text-gray-400" />
//                 </div>
//                 <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
//                   <Zap className="w-4 h-4 text-white" />
//                 </div>
//               </div>
//               <h3 className="text-2xl font-bold text-gray-800 mt-6 mb-2">سبد خرید خالی است</h3>
//               <p className="text-gray-500 text-sm mb-8 max-w-xs">محصولات مورد نظر خود را به سبد اضافه کنید و از خرید لذت ببرید</p>
//               <button 
//                 onClick={closeCart}
//                 className="group px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 flex items-center gap-2"
//               >
//                 <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
//                 شروع خرید
//               </button>
//             </div>
//           ) : (
//             <>
//               {/* پیشنهادات ویژه */}
//               <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-3 mb-2 border border-amber-100">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Gift className="w-4 h-4 text-amber-600" />
//                   <span className="text-xs font-bold text-amber-700">پیشنهادات ویژه</span>
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                   {specialOffers.map((offer, idx) => (
//                     <span key={idx} className="text-[10px] text-amber-600 bg-amber-100 px-2 py-1 rounded-full flex items-center gap-1">
//                       <offer.icon className="w-3 h-3" />
//                       {offer.text}
//                     </span>
//                   ))}
//                 </div>
//               </div>
              
//               {items.map((item, idx) => (
//                 <div 
//                   key={item.id} 
//                   className={`group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
//                     isRemoving === item.id ? 'animate-fade-out scale-95 opacity-0' : 'animate-fade-in-up'
//                   }`}
//                   style={{ animationDelay: `${idx * 50}ms` }}
//                 >
//                   <div className="flex gap-4 p-4">
//                     {/* تصویر محصول */}
//                     <div 
//                       className="relative w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 cursor-pointer flex-shrink-0 group-hover:scale-105 transition-all duration-500"
//                       onClick={() => handleProductClick(item.title)}
//                     >
//                       <img 
//                         src={item.image} 
//                         alt={item.title}
//                         className="w-full h-full object-cover"
//                       />
//                       <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      
//                       {item.quantity > 0 && (
//                         <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
//                           {item.quantity}
//                         </div>
//                       )}
//                     </div>
                    
//                     {/* اطلاعات محصول */}
//                     <div className="flex-1 min-w-0">
//                       <button
//                         onClick={() => handleProductClick(item.title)}
//                         className="font-bold text-gray-800 hover:text-indigo-600 transition-colors text-sm line-clamp-2 text-right w-full"
//                       >
//                         {item.title}
//                       </button>
                      
//                       {/* آپشن‌ها */}
//                       {Object.keys(item.selectedOptions).length > 0 && (
//                         <div className="flex flex-wrap gap-1 mt-2">
//                           {Object.entries(item.selectedOptions).map(([key, val]) => (
//                             <span key={key} className="inline-flex items-center gap-1 text-[9px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg">
//                               <Layers className="w-2.5 h-2.5" />
//                               <span className="font-medium">{key}:</span>
//                               {val.value}
//                               {val.modifier !== 0 && (
//                                 <span className="text-indigo-400">
//                                   ({val.modifier > 0 ? `+${val.modifier}` : val.modifier}
//                                   {val.modifier_type === "percent" ? "%" : "ت"})
//                                 </span>
//                               )}
//                             </span>
//                           ))}
//                         </div>
//                       )}
                      
//                       {/* قیمت و کنترل تعداد */}
//                       <div className="flex items-center justify-between mt-3">
//                         <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
//                           <button
//                             onClick={() => updateQuantity(item.id, item.quantity - 1)}
//                             className="w-7 h-7 flex items-center justify-center bg-white rounded-lg hover:bg-gray-50 transition-all shadow-sm hover:shadow"
//                           >
//                             <Minus className="w-3.5 h-3.5 text-gray-600" />
//                           </button>
//                           <span className="w-8 text-center font-bold text-sm text-gray-800">{item.quantity}</span>
//                           <button
//                             onClick={() => updateQuantity(item.id, item.quantity + 1)}
//                             className="w-7 h-7 flex items-center justify-center bg-white rounded-lg hover:bg-gray-50 transition-all shadow-sm hover:shadow"
//                           >
//                             <Plus className="w-3.5 h-3.5 text-gray-600" />
//                           </button>
//                         </div>
                        
//                         <div className="text-right">
//                           <div className="font-bold text-indigo-600 text-base">
//                             {formatPrice(item.price)}
//                           </div>
//                           {item.quantity > 1 && (
//                             <div className="text-[10px] text-gray-400">
//                               مجموع: {formatPrice(item.price * item.quantity)}
//                             </div>
//                           )}
//                         </div>
                        
//                         <button
//                           onClick={() => handleRemoveItem(item.id)}
//                           className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* خط تزئینی پایین کارت */}
//                   <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />
//                 </div>
//               ))}
//             </>
//           )}
//         </div>
        
//         {/* بخش تخفیف و جمع - طراحی مدرن */}
//         {items.length > 0 && (
//           <div className="border-t border-gray-100 bg-gradient-to-b from-white to-gray-50 shadow-lg">
            
//             {/* بخش کوپن تخفیف */}
//             <div className="p-5 border-b border-gray-100">
//               <div className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 rounded-xl p-3">
//                 <div className="flex gap-2">
//                   <div className="flex-1 relative">
//                     <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
//                       <Tag className="w-4 h-4 text-gray-400" />
//                     </div>
//                     <input
//                       type="text"
//                       placeholder="کد تخفیف خود را وارد کنید"
//                       value={couponInput}
//                       onChange={(e) => setCouponInput(e.target.value)}
//                       className="w-full pr-10 pl-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
//                     />
//                   </div>
//                   <button
//                     onClick={handleApplyCoupon}
//                     disabled={isCouponLoading}
//                     className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-medium text-sm hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-1"
//                   >
//                     {isCouponLoading ? (
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                     ) : (
//                       <>
//                         <Gift className="w-4 h-4" />
//                         اعمال
//                       </>
//                     )}
//                   </button>
//                 </div>
//                 {couponError && (
//                   <p className="text-xs text-red-500 mt-2 flex items-center gap-1 animate-shake">
//                     <AlertCircle className="w-3 h-3" />
//                     {couponError}
//                   </p>
//                 )}
//                 {couponSuccess && (
//                   <p className="text-xs text-green-500 mt-2 flex items-center gap-1 animate-pulse">
//                     <CheckCircle className="w-3 h-3" />
//                     کد تخفیف با موفقیت اعمال شد
//                   </p>
//                 )}
//               </div>
//             </div>
            
//             {/* جزئیات قیمت */}
//             <div className="p-5 space-y-3">
//               <div className="flex justify-between items-center text-sm">
//                 <span className="text-gray-500">مجموع قیمت کالاها</span>
//                 <span className="font-semibold text-gray-800">{formatPrice(summary.subtotal)}</span>
//               </div>
              
//               {summary.discount > 0 && (
//                 <div className="flex justify-between items-center text-sm">
//                   <span className="flex items-center gap-1 text-green-600">
//                     <BadgeCheck className="w-4 h-4" />
//                     تخفیف اعمال شده
//                   </span>
//                   <span className="font-semibold text-green-600">- {formatPrice(summary.discount)}</span>
//                 </div>
//               )}
              
//               <div className="flex justify-between items-center text-sm">
//                 <span className="flex items-center gap-1 text-gray-500">
//                   <Truck className="w-4 h-4" />
//                   هزینه ارسال
//                 </span>
//                 <span className="font-semibold text-gray-600">پس کرایه</span>
//               </div>
              
//               {/* نوار پیشرفت برای ارسال رایگان */}
//               {summary.subtotal < 1000000 && (
//                 <div className="bg-indigo-50/50 rounded-xl p-3 mt-2">
//                   <div className="flex justify-between text-xs mb-2">
//                     <span className="text-indigo-700 font-medium">ارسال رایگان</span>
//                     <span className="text-indigo-700 font-bold">
//                       {formatPrice(1000000 - summary.subtotal)} دیگر تا ارسال رایگان
//                     </span>
//                   </div>
//                   <div className="w-full h-2 bg-indigo-100 rounded-full overflow-hidden">
//                     <div 
//                       className="h-full bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-full transition-all duration-700 ease-out"
//                       style={{ width: `${Math.min((summary.subtotal / 1000000) * 100, 100)}%` }}
//                     />
//                   </div>
//                   <div className="flex justify-between text-[9px] text-gray-400 mt-1">
//                     <span>۰ تومان</span>
//                     <span>۵۰۰ هزار تومان</span>
//                     <span>۱ میلیون تومان</span>
//                   </div>
//                 </div>
//               )}
              
//               {/* نوار جدایی */}
//               <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2" />
              
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-800 font-bold text-base">قابل پرداخت</span>
//                 <div className="text-right">
//                   <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text text-transparent">
//                     {formatPrice(summary.grandTotal)}
//                   </span>
//                 </div>
//               </div>
//             </div>
            
//             {/* دکمه‌های اقدام */}
//             <div className="p-5 pt-0 space-y-3">
//               <button
//                 onClick={handleCheckout}
//                 className="group relative w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-bold hover:shadow-xl transition-all duration-300 overflow-hidden"
//               >
//                 <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
//                 <div className="relative flex items-center justify-center gap-2">
//                   <Wallet className="w-5 h-5 group-hover:scale-110 transition-transform" />
//                   تسویه حساب و تکمیل سفارش
//                   <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
//                 </div>
//               </button>
              
//               <button
//                 onClick={clearCart}
//                 className="w-full py-3 border-2 border-red-200 text-red-500 rounded-xl font-medium hover:bg-red-50 hover:border-red-300 transition-all duration-300 flex items-center justify-center gap-2 group"
//               >
//                 <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
//                 خالی کردن سبد خرید
//               </button>
//             </div>
            
//             {/* ضمانت‌ها */}
//             <div className="p-5 pt-0 flex justify-center gap-6 text-xs border-t border-gray-100 pt-4 bg-white/50">
//               <div className="flex items-center gap-1.5 text-gray-500 hover:text-indigo-600 transition-colors group cursor-default">
//                 <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
//                   <Shield className="w-3.5 h-3.5 text-green-600" />
//                 </div>
//                 <span>گارانتی اصالت</span>
//               </div>
//               <div className="flex items-center gap-1.5 text-gray-500 hover:text-indigo-600 transition-colors group cursor-default">
//                 <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
//                   <Clock className="w-3.5 h-3.5 text-blue-600" />
//                 </div>
//                 <span>تحویل سریع</span>
//               </div>
//               <div className="flex items-center gap-1.5 text-gray-500 hover:text-indigo-600 transition-colors group cursor-default">
//                 <div className="w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
//                   <Coffee className="w-3.5 h-3.5 text-amber-600" />
//                 </div>
//                 <span>مشاوره رایگان</span>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
      
//       {/* استایل‌های اضافی */}
//       <style>{`
//         @keyframes slide-in {
//           from {
//             transform: translateX(100%);
//             opacity: 0;
//           }
//           to {
//             transform: translateX(0);
//             opacity: 1;
//           }
//         }
        
//         @keyframes fade-in-up {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         @keyframes fade-out {
//           from {
//             opacity: 1;
//             transform: scale(1);
//           }
//           to {
//             opacity: 0;
//             transform: scale(0.95);
//           }
//         }
        
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//           }
//           to {
//             opacity: 1;
//           }
//         }
        
//         @keyframes shake {
//           0%, 100% { transform: translateX(0); }
//           25% { transform: translateX(-5px); }
//           75% { transform: translateX(5px); }
//         }
        
//         .animate-slide-in {
//           animation: slide-in 0.35s cubic-bezier(0.4, 0, 0.2, 1);
//         }
        
//         .animate-fade-in-up {
//           animation: fade-in-up 0.4s ease-out forwards;
//           opacity: 0;
//         }
        
//         .animate-fade-out {
//           animation: fade-out 0.3s ease-out forwards;
//         }
        
//         .animate-shake {
//           animation: shake 0.3s ease-in-out;
//         }
        
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 4px;
//         }
        
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: #f1f1f1;
//           border-radius: 10px;
//         }
        
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #c7d2fe;
//           border-radius: 10px;
//         }
        
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #818cf8;
//         }
//       `}</style>
//     </>
//   );
// };

// export default CartDrawer;