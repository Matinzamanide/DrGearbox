// components/ProductCard.tsx
import { useState } from "react";
import { ShoppingCart, Eye, Truck, ShieldCheck } from "lucide-react";
import type { IProduct } from "../type/type";
import { Link } from "react-router-dom";

interface ProductCardProps {
    product: IProduct;
    onAddToCart?: (product: IProduct) => void;
    onAddToWishlist?: (product: IProduct) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    // تشخیص فایل html
    const isHtmlFile = (url: string) => {
        if (!url) return false;
        return url.toLowerCase().endsWith(".html") || url.includes(".html?");
    };

    // جلوگیری از ارور هنگام خالی بودن آرایه
    const imageUrl = product.image?.[0] || "";

    const calculateDiscountPercent = (price: number, beforePrice: string | number) => {
        const oldPrice = Number(beforePrice);
        if (!oldPrice || oldPrice <= price) return 0;
        return Math.round(((oldPrice - price) / oldPrice) * 100);
    };

    const discountPercent = calculateDiscountPercent(
        product.base_price,
        product.before_discount_price
    );

    const isOutOfStock = product.inventory === 0;

    return (
        <Link to={`/product/${product.title}`}>
            <div
                className="group relative bg-white rounded-2xl transition-all duration-500 flex flex-col overflow-hidden"
                style={{
                    border: "1px solid #cccccc",
                    boxShadow: isHovered
                        ? "0 20px 40px -12px rgba(28, 71, 147, 0.25), 0 8px 24px -6px rgba(0, 0, 0, 0.1)"
                        : "0 1px 3px rgba(0, 0, 0, 0.08)",
                    transform: isHovered ? "translateY(-4px)" : "translateY(0)"
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >

                {/* افکت جذاب */}
                <div
                    className="absolute inset-0 transition-opacity duration-700 pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(circle at top right, rgba(28,71,147,0.08) 0%, rgba(50,163,219,0.04) 50%, transparent 70%)",
                        opacity: isHovered ? 1 : 0
                    }}
                />

                {/* بلور هنگام هاور */}
                <div
                    className="absolute inset-0 transition-opacity duration-500 pointer-events-none backdrop-blur-[1px]"
                    style={{ opacity: isHovered ? 0.1 : 0 }}
                />

                {/* لیبل تخفیف */}
                {discountPercent > 0 && (
                    <div className="absolute top-4 right-4 z-20 animate-pulse">
                        <div className="relative">
                            <div
                                className="absolute inset-0 rounded-full blur-md"
                                style={{ backgroundColor: "#e21f25" }}
                            />
                            <div
                                className="relative px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1"
                                style={{
                                    background:
                                        "linear-gradient(135deg, #e21f25, #c41a20)",
                                    color: "#ffffff"
                                }}
                            >
                                <span className="text-sm font-black">{discountPercent}%</span>
                                <span className="text-[10px] font-medium">تخفیف</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* تصویر / iframe */}
                <div
                    className="relative aspect-square overflow-hidden cursor-pointer"
                    style={{
                        background:
                            "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)"
                    }}
                >
                    {/* لودر */}
                    {!imageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div
                                className="w-8 h-8 border-3 rounded-full animate-spin"
                                style={{ borderColor: "#1c4793", borderTopColor: "transparent" }}
                            />
                        </div>
                    )}

                    {/* html یا تصویر */}
                    {isHtmlFile(imageUrl) ? (
                        <iframe
                            src={imageUrl}
                            loading="lazy"
                            onLoad={() => setImageLoaded(true)}
                            className="absolute top-16 left-0 w-full h-full border-0"
                        />
                    ) : (
                        <img
                            src={imageUrl}
                            alt={product.title}
                            loading="lazy"
                            onLoad={() => setImageLoaded(true)}
                            className={`w-full h-full object-contain transition-all duration-700 ${
                                isHovered ? "scale-110 rotate-1" : "scale-100"
                            } ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                        />
                    )}

                    {/* دکمه‌ها در حالت hover */}
                    <div
                        className={`absolute bottom-4 left-0 right-0 flex justify-center gap-2 transition-all duration-300 ${
                            isHovered
                                ? "translate-y-0 opacity-100"
                                : "translate-y-12 opacity-0"
                        }`}
                    >
                        <button
                            onClick={() => onAddToCart?.(product)}
                            className="px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md transition-all hover:scale-105 flex items-center gap-2"
                            style={{
                                backgroundColor: "rgba(28, 71, 147, 0.95)",
                                color: "#ffffff"
                            }}
                        >
                            <ShoppingCart className="w-4 h-4" />
                            خرید سریع
                        </button>

                        <button
                            className="p-2 rounded-full backdrop-blur-md transition-all hover:scale-105"
                            style={{
                                backgroundColor: "rgba(255, 255, 255, 0.95)",
                                color: "#113d64"
                            }}
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* ادامه بخش توضیحات و قیمت‌ها - بدون تغییر */}
                <div className="p-5 flex flex-col flex-grow relative z-10">
                    <div className="flex items-center justify-between mb-3">
                        {product.brand && (
                            <span
                                className="text-[11px] font-bold px-2.5 py-1 rounded-full transition-all duration-300"
                                style={{
                                    backgroundColor: isHovered
                                        ? "#1c4793"
                                        : "#e8f0f8",
                                    color: isHovered ? "#ffffff" : "#1c4793"
                                }}
                            >
                                {product.brand}
                            </span>
                        )}

                        {!isOutOfStock ? (
                            <div className="flex items-center gap-1">
                                <div
                                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                                    style={{ backgroundColor: "#32a3db" }}
                                />
                                <span className="text-[11px] text-gray-500">
                                    موجود در انبار
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1">
                                <div
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{ backgroundColor: "#e21f25" }}
                                />
                                <span className="text-[11px]">تماس بگیرید</span>
                            </div>
                        )}
                    </div>

                    <div className="mb-3">
                        <h3
                            className="text-base font-bold line-clamp-2 transition-all duration-300 leading-relaxed"
                            style={{ color: "#113d64" }}
                        >
                            {product.title}
                        </h3>
                        <div
                            className={`w-0 h-0.5 transition-all duration-300 mt-1 rounded-full ${
                                isHovered ? "w-12" : "w-0"
                            }`}
                            style={{ backgroundColor: "#32a3db" }}
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                        <div className="flex items-center gap-1 text-[10px] text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                            <Truck className="w-3 h-3" />
                            <span>ارسال سریع</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                            <ShieldCheck className="w-3 h-3" />
                            <span>گارانتی اصالت</span>
                        </div>
                    </div>

                    <div className="mt-auto pt-4 border-t" style={{ borderColor: "#f0f0f0" }}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex flex-col">
                                {Number(product.before_discount_price) > product.base_price && (
                                    <span className="text-xs text-gray-400 line-through mb-0.5">
                                        {Number(product.before_discount_price).toLocaleString()} تومان
                                    </span>
                                )}

                                {product.base_price !== 0 && (
                                    <div className="flex items-baseline gap-1">
                                        <span
                                            className="text-2xl font-black"
                                            style={{ color: "#1c4793" }}
                                        >
                                            {Number(product.base_price).toLocaleString()}
                                        </span>
                                        <span className="text-xs text-gray-500">تومان</span>

                                        {discountPercent > 0 && (
                                            <span
                                                className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                                                style={{
                                                    backgroundColor: "#e21f25",
                                                    color: "#ffffff"
                                                }}
                                            >
                                                {discountPercent}%−
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                className={`flex-1 font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md relative overflow-hidden group/btn ${
                                    isOutOfStock ? "" : "hover:shadow-xl active:scale-[0.97]"
                                }`}
                                style={{
                                    background: !isOutOfStock
                                        ? "linear-gradient(135deg, #1c4793, #113d64)"
                                        : "#e21f25",
                                    color: "#ffffff"
                                }}
                                disabled={isOutOfStock}
                            >
                                <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300" />
                                <ShoppingCart className="w-5 h-5 transition-transform group-hover/btn:scale-110" />
                                <span>{isOutOfStock ? "برای اطلاع از قیمت تماس بگیرید" : "افزودن به سبد"}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className="absolute bottom-0 left-0 w-full h-0.5 transition-transform duration-700"
                    style={{
                        background:
                            "linear-gradient(90deg, #1c4793, #32a3db, #e21f25, #32a3db, #1c4793)",
                        backgroundSize: "200% 100%",
                        transform: isHovered ? "translateX(0)" : "translateX(-100%)",
                        animation: isHovered ? "shimmer 1.5s linear infinite" : "none"
                    }}
                />

                <style>{`
                    @keyframes shimmer {
                        0% { background-position: 0% 0; }
                        100% { background-position: 200% 0; }
                    }
                `}</style>
            </div>
        </Link>
    );
};

export default ProductCard;


// https://electroshahresfahan.com/models/cycplnt50/cycplnt.50.html
// sk-b06e0fb3feff437883b61102e0fa7e52



















// // components/ProductCard.tsx
// import { useState } from "react";
// import { ShoppingCart, Eye, Truck, ShieldCheck } from "lucide-react";
// import type { IProduct } from "../type/type";
// import { Link } from "react-router-dom";

// interface ProductCardProps {
//     product: IProduct;
//     onAddToCart?: (product: IProduct) => void;
//     onAddToWishlist?: (product: IProduct) => void;
// }

// // تابع تشخیص فرمت فایل (HTML/مدل سه بعدی یا تصویر معمولی)
// const isModel3D = (url: string): boolean => {
//     if (!url) return false;
//     return url.endsWith('.html') || 
//            url.includes('/3d/') || 
//            url.includes('/models/') ||
//            url.includes('B3DH') ||
//            url.includes('keyshot');
// };

// const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
//     const [isHovered, setIsHovered] = useState(false);
//     const [imageLoaded, setImageLoaded] = useState(false);
//     const [iframeLoaded, setIframeLoaded] = useState(false);
//     const [thumbnailError, setThumbnailError] = useState(false);

//     const calculateDiscountPercent = (price: number, beforePrice: string | number) => {
//         const oldPrice = Number(beforePrice);
//         if (!oldPrice || oldPrice <= price) return 0;
//         return Math.round(((oldPrice - price) / oldPrice) * 100);
//     };

//     const discountPercent = calculateDiscountPercent(product.base_price, product.before_discount_price);
//     const isOutOfStock = product.inventory === 0;
    
//     // بررسی نوع فایل اول
//     const firstMedia = product.image?.[0];
//     const isFirstMedia3D = firstMedia ? isModel3D(firstMedia) : false;
//     const has3DModel = product.image?.some(img => isModel3D(img)) || false;

//     // انتخاب تصویر پیش‌نمایش برای حالت عادی
//     const getThumbnailImage = () => {
//         if (!product.image || product.image.length === 0) return null;
//         // اولین تصویر غیر HTML را پیدا کن
//         const normalImage = product.image.find(img => !isModel3D(img));
//         return normalImage || product.image[0];
//     };
    
//     const thumbnailImage = getThumbnailImage();
//     const showIframe = isFirstMedia3D && !thumbnailError;

//     return (
//         // <Link to={`/product/${encodeURIComponent(product.title)}`}>
//             <div 
//                 className="group relative bg-white rounded-2xl transition-all duration-500 flex flex-col overflow-hidden"
//                 style={{ 
//                     border: "1px solid #cccccc",
//                     boxShadow: isHovered 
//                         ? "0 20px 40px -12px rgba(28, 71, 147, 0.25), 0 8px 24px -6px rgba(0, 0, 0, 0.1)" 
//                         : "0 1px 3px rgba(0, 0, 0, 0.08)",
//                     transform: isHovered ? "translateY(-4px)" : "translateY(0)"
//                 }}
//                 onMouseEnter={() => setIsHovered(true)}
//                 onMouseLeave={() => setIsHovered(false)}
//             >
//                 {/* پس‌زمینه گرادیانت */}
//                 <div 
//                     className="absolute inset-0 transition-opacity duration-700 pointer-events-none" 
//                     style={{ 
//                         background: "radial-gradient(circle at top right, rgba(28,71,147,0.08) 0%, rgba(50,163,219,0.04) 50%, transparent 70%)", 
//                         opacity: isHovered ? 1 : 0 
//                     }}
//                 />

//                 <div 
//                     className="absolute inset-0 transition-opacity duration-500 pointer-events-none backdrop-blur-[1px]"
//                     style={{ opacity: isHovered ? 0.1 : 0 }}
//                 />

//                 {/* برچسب تخفیف */}
//                 {discountPercent > 0 && (
//                     <div className="absolute top-4 right-4 z-20 animate-pulse">
//                         <div className="relative">
//                             <div className="absolute inset-0 rounded-full blur-md" style={{ backgroundColor: "#e21f25" }} />
//                             <div className="relative px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1" style={{ background: "linear-gradient(135deg, #e21f25, #c41a20)", color: "#ffffff" }}>
//                                 <span className="text-sm font-black">{discountPercent}%</span>
//                                 <span className="text-[10px] font-medium">تخفیف</span>
//                             </div>
//                         </div>
//                     </div>
//                 )}
                
//                 {/* برچسب مدل سه بعدی */}
//                 {has3DModel && (
//                     <div className="absolute top-4 left-4 z-20">
//                         <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-lg">
//                             <span>مدل 3D</span>
//                         </div>
//                     </div>
//                 )}
               
//                 {/* بخش نمایش رسانه (تصویر یا iframe) */}
//                 <div className="relative aspect-square overflow-hidden cursor-pointer" style={{ background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)" }}>
                    
//                     {/* لودینگ */}
//                     {(!imageLoaded && !showIframe) && (
//                         <div className="absolute inset-0 flex items-center justify-center">
//                             <div className="w-8 h-8 border-3 rounded-full animate-spin" style={{ borderColor: "#1c4793", borderTopColor: "transparent" }} />
//                         </div>
//                     )}
                    
//                     {/* اگر فایل HTML/مدل سه بعدی باشد */}
//                     {showIframe ? (
//                         <>
//                             {!iframeLoaded && (
//                                 <div className="absolute inset-0 flex items-center justify-center z-10">
//                                     <div className="text-center">
//                                         <div className="w-8 h-8 border-3 rounded-full animate-spin mx-auto mb-2" style={{ borderColor: "#1c4793", borderTopColor: "transparent" }} />
//                                         <span className="text-[10px] text-gray-400">در حال بارگذاری مدل...</span>
//                                     </div>
//                                 </div>
//                             )}
//                             <iframe 
//                                 src={firstMedia}
//                                 title={product.title}
//                                 className={`absolute top-20 left-0 w-full h-full transition-opacity duration-500 ${iframeLoaded ? 'opacity-100' : 'opacity-0'}`}
//                                 style={{ border: 'none', pointerEvents: 'none' }}
//                                 frameBorder="0"
//                                 scrolling="no"
//                                 onLoad={() => {
//                                     setIframeLoaded(true);
//                                     setImageLoaded(true);
//                                 }}
//                                 onError={() => {
//                                     setThumbnailError(true);
//                                     setImageLoaded(true);
//                                 }}
//                             />
//                             {/* fallback برای زمانی که iframe خطا بدهد */}
//                             {thumbnailError && thumbnailImage && (
//                                 <img 
//                                     src={thumbnailImage} 
//                                     alt={product.title} 
//                                     className="w-full h-full object-contain p-4"
//                                 />
//                             )}
//                         </>
//                     ) : (
//                         /* اگر فایل تصویر معمولی باشد */
//                         thumbnailImage && (
//                             <img 
//                                 src={thumbnailImage} 
//                                 alt={product.title} 
//                                 className={`w-full h-full object-contain transition-all duration-700 p-4 ${
//                                     isHovered ? 'scale-110 rotate-1' : 'scale-100'
//                                 } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
//                                 onLoad={() => setImageLoaded(true)}
//                                 onError={() => setThumbnailError(true)}
//                             />
//                         )
//                     )}

//                     {/* دکمه‌های سریع */}
//                     <div className={`absolute bottom-4 left-0 right-0 flex justify-center gap-2 transition-all duration-300 z-30 ${
//                         isHovered ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
//                     }`}>
//                         <button 
//                             onClick={(e) => {
//                                 e.preventDefault();
//                                 onAddToCart?.(product);
//                             }}
//                             className="px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md transition-all hover:scale-105 flex items-center gap-2"
//                             style={{ backgroundColor: "rgba(28, 71, 147, 0.95)", color: "#ffffff" }}
//                         >
//                             <ShoppingCart className="w-4 h-4" />
//                             خرید سریع
//                         </button>
//                         <button 
//                             className="p-2 rounded-full backdrop-blur-md transition-all hover:scale-105"
//                             style={{ backgroundColor: "rgba(255, 255, 255, 0.95)", color: "#113d64" }}
//                         >
//                             <Eye className="w-4 h-4" />
//                         </button>
//                     </div>
//                 </div>

//                 {/* اطلاعات محصول */}
//                 <div className="p-5 flex flex-col flex-grow relative z-10">
//                     <div className="flex items-center justify-between mb-3">
//                         {product.brand && (
//                             <span className="text-[11px] font-bold px-2.5 py-1 rounded-full transition-all duration-300" 
//                                   style={{ 
//                                       backgroundColor: isHovered ? "#1c4793" : "#e8f0f8",
//                                       color: isHovered ? "#ffffff" : "#1c4793"
//                                   }}>
//                                 {product.brand}
//                             </span>
//                         )}
                        
//                         {!isOutOfStock ? (
//                             <div className="flex items-center gap-1">
//                                 <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#32a3db" }} />
//                                 <span className="text-[11px] text-gray-500">موجود در انبار</span>
//                             </div>
//                         ) : (
//                             <div className="flex items-center gap-1">
//                                 <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#e21f25" }} />
//                                 <span className="text-[11px]" style={{ color: "#e21f25" }}>تماس بگیرید</span>
//                             </div>
//                         )}
//                     </div>

//                     <div className="mb-3">
//                         <h3 className="text-base font-bold line-clamp-2 transition-all duration-300 leading-relaxed" 
//                             style={{ color: "#113d64" }}>
//                             {product.title}
//                         </h3>
//                         <div className={`w-0 h-0.5 transition-all duration-300 mt-1 rounded-full ${isHovered ? 'w-12' : 'w-0'}`} 
//                              style={{ backgroundColor: "#32a3db" }} />
//                     </div>

//                     {/* مشخصات سریع */}
//                     <div className="flex flex-wrap gap-2 mb-4">
//                         <div className="flex items-center gap-1 text-[10px] text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
//                             <Truck className="w-3 h-3" />
//                             <span>ارسال سریع</span>
//                         </div>
//                         <div className="flex items-center gap-1 text-[10px] text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
//                             <ShieldCheck className="w-3 h-3" />
//                             <span>گارانتی اصالت</span>
//                         </div>
//                         {has3DModel && !showIframe && (
//                             <div className="flex items-center gap-1 text-[10px] text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
//                                 <span>همراه مدل 3D</span>
//                             </div>
//                         )}
//                     </div>

//                     {/* قیمت */}
//                     <div className="mt-auto pt-4 border-t" style={{ borderColor: "#f0f0f0" }}>
//                         <div className="flex items-center justify-between mb-4">
//                             <div className="flex flex-col">
//                                 {Number(product.before_discount_price) > product.base_price && (
//                                     <span className="text-xs text-gray-400 line-through mb-0.5">
//                                         {Number(product.before_discount_price).toLocaleString()} تومان
//                                     </span>
//                                 )}
//                                 {product.base_price !== 0 && (
//                                     <div className="flex items-baseline gap-1">
//                                         <span className="text-2xl font-black" style={{ color: "#1c4793" }}>
//                                             {Number(product.base_price).toLocaleString()}
//                                         </span>
//                                         <span className="text-xs text-gray-500">تومان</span>
//                                         {discountPercent > 0 && (
//                                             <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: "#e21f25", color: "#ffffff" }}>
//                                                 {discountPercent}%−
//                                             </span>
//                                         )}
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         {/* دکمه اصلی */}
//                         <div className="flex gap-2">
//                             <button 
//                                 onClick={(e) => {
//                                     e.preventDefault();
//                                     onAddToCart?.(product);
//                                 }}
//                                 className={`flex-1 font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md relative overflow-hidden group/btn ${
//                                     isOutOfStock ? '' : 'hover:shadow-xl active:scale-[0.97]'
//                                 }`}
//                                 style={{ background: !isOutOfStock ? "linear-gradient(135deg, #1c4793, #113d64)" : "#e21f25", color: "#ffffff" }}
//                                 disabled={isOutOfStock}
//                             >
//                                 <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300" />
//                                 <ShoppingCart className="w-5 h-5 transition-transform group-hover/btn:scale-110" />
//                                 <span>{isOutOfStock ? 'برای اطلاع از قیمت تماس بگیرید' : 'افزودن به سبد'}</span>
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//                 {/* نوار انیمیشن پایین */}
//                 <div 
//                     className="absolute bottom-0 left-0 w-full h-0.5 transition-transform duration-700"
//                     style={{ 
//                         background: has3DModel 
//                             ? "linear-gradient(90deg, #8b5cf6, #6366f1, #e21f25, #6366f1, #8b5cf6)"
//                             : "linear-gradient(90deg, #1c4793, #32a3db, #e21f25, #32a3db, #1c4793)",
//                         backgroundSize: "200% 100%",
//                         transform: isHovered ? 'translateX(0)' : 'translateX(-100%)',
//                         animation: isHovered ? "shimmer 1.5s linear infinite" : "none"
//                     }}
//                 />

//                 <style>{`
//                     @keyframes shimmer {
//                         0% { background-position: 0% 0; }
//                         100% { background-position: 200% 0; }
//                     }
//                 `}</style>
//             </div>
//         // </Link>
//     );
// };

// export default ProductCard;