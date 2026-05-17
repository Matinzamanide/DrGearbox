// import axios from "axios";
// import { useEffect, useState, useMemo } from "react";
// import { useParams, Link } from "react-router-dom";
// import { 
//   ShoppingCart, Heart, Share2, Award, ChevronLeft, 
//   FileText, Ruler, CheckCircle, AlertCircle, 
//   Package, Sparkles, Settings, Tag, Shield, Truck, Clock, Zap,
//   Phone, MessageCircle, Headphones, Mail, MapPin, Download, 
//   Link2, Check, Plus, Minus
// } from "lucide-react";
// import { useShoppingCart } from "../../context/ShoppingCartContext";

// export interface IProduct {
//   id: number;
//   title: string;
//   base_price: number | string;
//   before_discount_price: number | string;
//   brand: string;
//   type: string;
//   inventory: number |string;
//   categoryId: number;
//   description: string;
//   catalog: string;
//   image: string[];
//   features: string[];
//   specifications?: { spec_key: string; spec_value: string; spec_unit: string | null }[];
//   last_price_update: string;
//   last_price_update_fa?: string;
//   options: {
//     id: string;
//     name: string;
//     is_required: string | number | boolean;
//     choices: { 
//       value: string; 
//       price_modifier: number;
//       modifier_type?: "fixed" | "percent";
//     }[];
//   }[];
// }

// type SelectedOptionsState = Record<string, { 
//   value: string; 
//   modifier: number;
//   modifier_type?: "fixed" | "percent";
// }>;

// // تابع تشخیص نوع فایل (تصویر یا مدل سه بعدی)
// const isModel3D = (url: string): boolean => {
//   if (!url) return false;
//   return url.endsWith('.html') || 
//          url.includes('/3d/') || 
//          url.includes('/models/') ||
//          url.includes('B3DH') ||
//          url.includes('keyshot');
// };

// // تابع ترجمه کلید مشخصات فنی
// const getSpecLabel = (key: string): string => {
//   const labels: Record<string, string> = {
//     power: "قدرت",
//     torque: "گشتاور",
//     ratio: "نسبت تبدیل",
//     weight: "وزن",
//     protection: "درجه حفاظت",
//     efficiency: "راندمان",
//     input_speed: "سرعت ورودی",
//     output_speed: "سرعت خروجی",
//     voltage: "ولتاژ",
//     current: "جریان",
//     frequency: "فرکانس",
//     material: "جنس بدنه",
//     dimension: "ابعاد",
//     warranty: "گارانتی",
//     temperature: "دمای کاری",
//     noise: "نویز",
//     mounting: "نحوه نصب"
//   };
//   return labels[key] || key;
// };

// // کامپوننت نمایش مدل سه بعدی
// const Model3DViewer = ({ src, title }: { src: string; title: string }) => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [hasError, setHasError] = useState(false);

//   return (
//     <div className="relative w-full h-full flex items-center justify-center">
//       {isLoading && (
//         <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
//           <div className="text-center">
//             <div className="w-10 h-10 border-3 border-t-[#1c4793] border-[#cccccc] rounded-full animate-spin mx-auto mb-2"></div>
//             <p className="text-xs text-gray-500">در حال بارگذاری مدل سه بعدی...</p>
//           </div>
//         </div>
//       )}
      
//       {!hasError ? (
//         <div className="w-full h-full flex items-center justify-center">
//           <div className="w-full h-full absolute top-20">
//             <iframe
//               src={src}
//               title={title}
//               allowFullScreen
//               style={{ 
//                 width: '100%',
//                 height: '100%',
//                 border: 'none',
//                 display: 'block'
//               }}
//               frameBorder="0"
//               scrolling="no"
//               onLoad={() => setIsLoading(false)}
//               onError={() => {
//                 setIsLoading(false);
//                 setHasError(true);
//               }}
//             />
//           </div>
//         </div>
//       ) : (
//         <div className="flex flex-col items-center justify-center h-full text-center p-4 bg-gray-50 rounded-xl">
//           <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
//           <p className="text-xs text-gray-500 mb-3">خطا در بارگذاری مدل سه بعدی</p>
//           <button
//             onClick={() => window.open(src, '_blank')}
//             className="px-4 py-1.5 text-xs bg-[#1c4793] text-white rounded-lg"
//           >
//             مشاهده در پنجره جدید
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };


// const scrollToSection = (sectionId: string) => {
//   const element = document.getElementById(sectionId);
//   if (element) {
//     element.scrollIntoView({ 
//       behavior: "smooth", 
//       block: "start" 
//     });
//   }
// };

// const RelatedProducts = ({ currentId, categoryId }: { currentId: number; categoryId: number }) => {
//   const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setLoading(true);
//     axios.get(`https://electroshahresfahan.com/drgearbox/get_products.php?categoryId=${categoryId}`)
//       .then((res) => {
//         const products = res.data.products || [];
//         const filtered = products.filter((p: IProduct) => p.id !== currentId).slice(0, 4);
//         setRelatedProducts(filtered);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error fetching related products:", err);
//         setLoading(false);
//       });
      
//   }, [currentId, categoryId]);

//   if (loading || relatedProducts.length === 0) return null;



  
//   return (
//     <div className="mt-16 relative z-10">
//       <div className="flex items-center justify-between mb-6 border-b pb-3" style={{ borderColor: "#cccccc" }}>
//         <div className="flex items-center gap-2">
//           <div className="p-2 rounded-xl shadow-md" style={{ background: "linear-gradient(135deg, #1c4793, #113d64)" }}>
//             <Sparkles className="w-4 h-4 text-white" />
//           </div>
//           <h2 className="text-xl font-bold" style={{ color: "#113d64" }}>
//             محصولات مشابه
//           </h2>
//         </div>
//         <Link to="/products" className="group text-xs font-semibold flex items-center gap-1 transition-all px-3 py-1.5 rounded-lg" style={{ color: "#1c4793", backgroundColor: "#e8f0f8" }}>
//           مشاهده همه
//           <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
//         </Link>
//       </div>
      
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {relatedProducts.map((product) => (
//           <Link 
//             key={product.id} 
//             to={`/product/${encodeURIComponent(product.title)}`}
//             className="group bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col relative"
//             style={{ borderColor: "#cccccc" }}
//           >
//             <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" style={{ background: "linear-gradient(135deg, rgba(28,71,147,0.03), rgba(50,163,219,0.03))" }}></div>
            
//             <div className="aspect-square p-4 flex items-center justify-center relative overflow-hidden">
//               <img 
//                 src={product.image?.[0] || "/placeholder.png"} 
//                 alt={product.title}
//                 className="w-full h-full object-contain relative z-10 group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
//               />
//             </div>
//             <div className="p-4 flex flex-col flex-grow justify-between border-t" style={{ borderColor: "#cccccc", backgroundColor: "#ffffff" }}>
//               <h3 className="font-bold leading-relaxed line-clamp-2 text-xs mb-2 transition-colors" style={{ color: "#113d64" }}>
//                 {product.title}
//               </h3>
//               <div className="flex items-center justify-end mt-auto">
//                 <div className="flex items-baseline gap-1 px-3 py-1.5 rounded-xl transition-colors" style={{ backgroundColor: "#e8f0f8" }}>
//                   <span className="font-black text-sm" style={{ color: "#1c4793" }}>
//                     {Number(product.base_price).toLocaleString('fa-IR')}
//                   </span>
//                   <span className="text-[10px] font-bold" style={{ color: "#32a3db" }}>تومان</span>
//                 </div>
//               </div>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// const Product = () => {
//     const [data, setData] = useState<IProduct | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [selectedOptions, setSelectedOptions] = useState<SelectedOptionsState>({});
//     const [isLiked, setIsLiked] = useState(false);
//     const [selectedImage, setSelectedImage] = useState<string>("");
//     const [isModelView, setIsModelView] = useState(false);
//     const [showNotification, setShowNotification] = useState(false);
//     const [showShareMenu, setShowShareMenu] = useState(false);
//     const [copied, setCopied] = useState(false);
//     const [cartQuantity, setCartQuantity] = useState(0);
//     const [isInCart, setIsInCart] = useState(false);
//     const [stockError,setStockError]=useState<string|null>(null);
//     const { id } = useParams();
    
// const { addToCart, items, updateQuantity, removeFromCart, error: cartError, clearError } = useShoppingCart();
//     // تابع تولید itemId مشابه با context
//     const generateItemId = (productId: number, selectedOptions: SelectedOptionsState): string => {
//       const optionsKey = Object.entries(selectedOptions)
//         .sort()
//         .map(([key, value]) => `${key}:${value.value}`)
//         .join("|");
//       return `${productId}|${optionsKey}`;
//     };





//     const convertGregorianToPersian = (gregorianDate: string): string => {
//   if (!gregorianDate) return "";
//   const date = new Date(gregorianDate);
//   return new Intl.DateTimeFormat('fa-IR', {
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: false
//   }).format(date);
// };


//     useEffect(() => {
//         if (!id) return;
// window.scroll({behavior:'smooth',top:0})
//         setLoading(true);
//         axios.get(`https://electroshahresfahan.com/drgearbox/get_products.php?title=${encodeURIComponent(id)}`)
//             .then((res) => {
//                 const products = res.data.products || [];
//                 if (products.length > 0) {
//                     const product = products[0];
//                     console.log("Product loaded:", product);
                    
//                     setData(product);
//                     const firstMedia = product.image?.[0] || "";
//                     setSelectedImage(firstMedia);
//                     setIsModelView(isModel3D(firstMedia));
                    
//                     const initialSelections: SelectedOptionsState = {};
//                     if (product.options && Array.isArray(product.options) && product.options.length > 0) {
//                         product.options.forEach((opt: any) => {
//                             const isRequired = opt.is_required === "1" || opt.is_required === 1 || opt.is_required === true;
                            
//                             if (isRequired && opt.choices && opt.choices.length > 0) {
//                                 initialSelections[opt.name] = {
//                                     value: opt.choices[0].value,
//                                     modifier: Number(opt.choices[0].price_modifier) || 0,
//                                     modifier_type: opt.choices[0].modifier_type || "fixed"
//                                 };
//                             }
//                         });
//                     }
//                     setSelectedOptions(initialSelections);
//                 }
//                 setLoading(false);
//             })
//             .catch((err) => {
//                 console.error("Error fetching product:", err);
//                 setLoading(false);
//             });
//     }, [id]);

//     // بررسی وجود محصول در سبد خرید با توجه به آپشن‌های انتخاب شده
//     useEffect(() => {
//       if (data) {
//         const itemId = generateItemId(data.id, selectedOptions);
//         const existingItem = items.find(item => item.id === itemId);
        
//         if (existingItem) {
//           setIsInCart(true);
//           setCartQuantity(existingItem.quantity);
//         } else {
//           setIsInCart(false);
//           setCartQuantity(0);
//         }
//       }
//     }, [data, selectedOptions, items]);

//     // محاسبه قیمت نهایی با پشتیبانی از درصد
//     const finalPrice = useMemo(() => {
//         if (!data?.base_price) return 0;
//         const base = Number(data.base_price);
        
//         let modifiersSum = 0;
        
//         Object.entries(selectedOptions).forEach(([optionName, opt]) => {
//             const option = data.options?.find(o => o.name === optionName);
//             const choice = option?.choices?.find(c => c.value === opt.value);
//             const modifierType = choice?.modifier_type || opt.modifier_type || "fixed";
//             const modifierValue = opt.modifier;
            
//             if (modifierType === "percent") {
//                 const percentValue = (base * modifierValue) / 100;
//                 modifiersSum += percentValue;
//             } else {
//                 modifiersSum += modifierValue;
//             }
//         });
        
//         return base + modifiersSum;
//     }, [data, selectedOptions]);

//     const handleOptionSelect = (optionName: string, choiceValue: string, modifier: number, modifierType: string = "fixed") => {
//         setSelectedOptions(prev => ({
//             ...prev,
//             [optionName]: { 
//                 value: choiceValue, 
//                 modifier: Number(modifier) || 0,
//                 modifier_type: modifierType as "fixed" | "percent"
//             }
//         }));
//     };

//     const handleSelectMedia = (url: string) => {
//         setSelectedImage(url);
//         setIsModelView(isModel3D(url));
//     };

//     const handleDownloadCatalog = () => {
//         if (data?.catalog) {
//             window.open(data.catalog, '_blank');
//         } else {
//             setShowNotification(true);
//             setTimeout(() => setShowNotification(false), 3000);
//         }
//     };

//     const handleShare = async (platform?: string) => {
//         const url = window.location.href;
//         const title = data?.title || "محصول دکتر گیربکس";
//         const text = `مشاهده محصول ${title} در فروشگاه دکتر گیربکس`;
        
//         if (platform === 'copy') {
//             try {
//                 await navigator.clipboard.writeText(url);
//                 setCopied(true);
//                 setTimeout(() => setCopied(false), 2000);
//             } catch (err) {
//                 console.error('Failed to copy:', err);
//             }
//             setShowShareMenu(false);
//             return;
//         }
        
//         if (platform === 'whatsapp') {
//             window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`, '_blank');
//         } else if (platform === 'telegram') {
//             window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
//         } else if (platform === 'twitter') {
//             window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
//         } else if (platform === 'facebook') {
//             window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
//         } else if (platform === 'linkedin') {
//             window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
//         } else {
//             if (navigator.share) {
//                 try {
//                     await navigator.share({
//                         title: title,
//                         text: text,
//                         url: url,
//                     });
//                 } catch (err) {
//                     console.log('Error sharing:', err);
//                 }
//             } else {
//                 setShowShareMenu(!showShareMenu);
//             }
//         }
        
//         setShowShareMenu(false);
//     };

//     const handleAddToCart = () => {
//     if (isOutOfStock) {
//         setStockError("این محصول ناموجود است و قابل افزودن به سبد خرید نمی‌باشد");
//         setTimeout(() => setStockError(null), 3000);
//         return;
//     }
    
//     if (data) {
//         const success = addToCart(data, selectedOptions);
//         if (success) {
//             // موفقیت آمیز
//         }
//     }
// };

//     const increaseCartQuantity = () => {
//     if (isOutOfStock) {
//         setStockError("این محصول ناموجود است");
//         setTimeout(() => setStockError(null), 3000);
//         return;
//     }
    
//     if (data) {
//         const itemId = generateItemId(data.id, selectedOptions);
//         const currentQuantity = items.find(item => item.id === itemId)?.quantity || 0;
        
//         if (currentQuantity >= Number(data.inventory)) {
//             setStockError(`امکان افزودن بیشتر از موجودی انبار (${data.inventory} عدد) وجود ندارد`);
//             setTimeout(() => setStockError(null), 3000);
//             return;
//         }
        
//         addToCart(data, selectedOptions, 1);
//     }
// };

//     const decreaseCartQuantity = () => {
//       if (data) {
//         const itemId = generateItemId(data.id, selectedOptions);
//         const existingItem = items.find(item => item.id === itemId);
        
//         if (existingItem && existingItem.quantity === 1) {
//           removeFromCart(itemId);
//         } else if (existingItem) {
//           updateQuantity(itemId, existingItem.quantity - 1);
//         }
//       }
//     };

//     const renderMediaDisplay = () => {
//         if (!selectedImage) {
//             return (
//                 <div className="flex flex-col items-center gap-2 relative z-10" style={{ color: "#cccccc" }}>
//                     <Package className="w-16 h-16" />
//                     <span className="font-medium text-sm">تصویری موجود نیست</span>
//                 </div>
//             );
//         }

//         if (isModelView) {
//             return <Model3DViewer src={selectedImage} title={data?.title || "مدل سه بعدی"} />;
//         }

//         return (
//             <img 
//                 src={selectedImage} 
//                 alt={data?.title} 
//                 className="w-full h-full object-contain drop-shadow-xl relative z-10 transition-transform duration-500" 
//             />
//         );
//     };

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-screen" style={{ background: "linear-gradient(135deg, #f5f7fa, #ffffff)" }}>
//                 <div className="text-center p-8 bg-white rounded-2xl shadow-xl border" style={{ borderColor: "#cccccc" }}>
//                     <div className="relative w-16 h-16 mx-auto mb-4">
//                         <div className="absolute inset-0 border-t-3 rounded-full animate-spin" style={{ borderColor: "#1c4793" }}></div>
//                         <div className="absolute inset-1 border-r-3 rounded-full animate-spin" style={{ borderColor: "#32a3db" }}></div>
//                     </div>
//                     <p className="font-bold text-sm animate-pulse" style={{ color: "#113d64" }}>در حال بارگذاری محصول...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (!data) return null;

//     const oldPrice = Number(data.before_discount_price) || 0;
//     const basePrice = Number(data.base_price) || 0;
//     const hasDiscount = oldPrice > basePrice;
//     const discountPercent = hasDiscount ? Math.round(((oldPrice - basePrice) / oldPrice) * 100) : 0;
//     const isOutOfStock = data.inventory === "0";

//     console.log(data.inventory);

//     const technicalSpecs = [
//         { label: "برند", value: data.brand || "نامشخص", icon: Award },
//         { label: "نوع/مدل", value: data.type || "نامشخص", icon: Settings },
//         { label: "موجودی انبار", value: isOutOfStock ? "ناموجود" : `${data.inventory} عدد`, icon: Package },
//         { label: "کد محصول", value: `PRD-${data.id}`, icon: Tag },
//         { label: "گارانتی", value: "۱۸ ماهه", icon: Shield },
//         { label: "ارسال", value: "۲۴ ساعته", icon: Truck },
//     ];

//     const validFeatures = data.features?.filter(f => f && f.trim() !== "") || [];
//     const hasOptions = data.options && Array.isArray(data.options) && data.options.length > 0 && 
//                        data.options.some(opt => opt.choices && opt.choices.length > 0);
//     const hasSpecifications = data.specifications && data.specifications.length > 0;
//     const hasLastPriceUpdate = data.last_price_update && data.last_price_update !== "هنوز به‌روزرسانی نشده";

//     return (
//         <div className="min-h-screen py-6 md:py-10 relative" style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)" }}>
            
//             {/* نوتیفیکیشن‌ها */}
//             {showNotification && (
//                 <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[100] animate-fade-in-down">
//                     <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 shadow-lg">
//                         <p className="text-amber-700 text-xs flex items-center gap-2">
//                             <AlertCircle className="w-4 h-4" />
//                             کاتالوگی برای این محصول موجود نیست
//                         </p>
//                     </div>
//                 </div>
//             )}
            
//             {copied && (
//                 <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[100] animate-fade-in-down">
//                     <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 shadow-lg">
//                         <p className="text-green-700 text-xs flex items-center gap-2">
//                             <Check className="w-4 h-4" />
//                             لینک محصول با موفقیت کپی شد
//                         </p>
//                     </div>
//                 </div>
//             )}

//             {cartError && (
//     <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-xl flex items-center gap-2 animate-pulse">
//         <AlertCircle className="w-5 h-5 text-red-600" />
//         <span className="text-sm text-red-700 font-medium">{cartError}</span>
//         <button onClick={clearError} className="mr-auto text-red-500 hover:text-red-700">✕</button>
//     </div>
// )}

//             {/* منوی اشتراک‌گذاری */}
//             {showShareMenu && (
//                 <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center animate-fade-in" onClick={() => setShowShareMenu(false)}>
//                     <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
//                         <div className="flex items-center justify-between mb-4">
//                             <h3 className="text-lg font-bold text-gray-800">اشتراک‌گذاری محصول</h3>
//                             <button onClick={() => setShowShareMenu(false)} className="text-gray-400 hover:text-gray-600">✕</button>
//                         </div>
//                         <div className="grid grid-cols-2 gap-3">
//                             <button onClick={() => handleShare('whatsapp')} className="flex items-center gap-2 p-3 rounded-xl bg-green-50 text-green-700 hover:bg-green-100">
//                                 <MessageCircle className="w-5 h-5" />
//                                 <span className="text-sm font-medium">واتساپ</span>
//                             </button>
//                             <button onClick={() => handleShare('telegram')} className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100">
//                                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                                     <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.66-.35-1.02.22-1.61.15-.15 2.71-2.48 2.76-2.69.01-.03.02-.12-.05-.17-.07-.05-.17-.03-.24-.02-.1.02-1.64 1.04-4.64 3.07-.44.3-.84.45-1.2.44-.39-.01-1.15-.22-1.72-.41-.7-.23-1.26-.35-1.21-.74.03-.2.3-.41.82-.63 3.17-1.38 5.29-2.29 6.36-2.73 3.03-1.25 3.66-1.47 4.07-1.47.09 0 .29.02.42.13.11.09.14.22.15.34-.01.09-.02.23-.03.37z"/>
//                                 </svg>
//                                 <span className="text-sm font-medium">تلگرام</span>
//                             </button>
//                             <button onClick={() => handleShare('twitter')} className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100">
//                                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                                     <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.968-3.305c1.674-3.087 2.524-6.453 2.478-9.812a10.015 10.015 0 002.455-2.545z"/>
//                                 </svg>
//                                 <span className="text-sm font-medium">توییتر</span>
//                             </button>
//                             <button onClick={() => handleShare('copy')} className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100">
//                                 <Link2 className="w-5 h-5" />
//                                 <span className="text-sm font-medium">کپی لینک</span>
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* سایدبار شناور سمت چپ */}
//             <div className="fixed left-3 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block">
//                 <div className="bg-white rounded-xl shadow-xl border overflow-hidden" style={{ borderColor: "#cccccc", width: "240px" }}>
//                     <div className="px-3 py-2 text-white text-center" style={{ background: "linear-gradient(135deg, #1c4793, #113d64)" }}>
//                         <Headphones className="w-5 h-5 mx-auto mb-1" />
//                         <h3 className="font-bold text-xs">پشتیبانی فروش</h3>
//                         <p className="text-[9px] text-blue-200">ما پاسخگوی شما هستیم</p>
//                     </div>
//                     <div className="p-3 space-y-2">
//                         <a href="tel:02112345678" className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 transition-all group">
//                             <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200"><Phone className="w-3.5 h-3.5 text-green-600" /></div>
//                             <div><p className="text-[9px] text-gray-400">تماس مستقیم</p><p className="text-xs font-bold text-gray-800">۰۲۱-۱۲۳۴۵۶۷۸</p></div>
//                         </a>
//                         <a href="https://wa.me/989123456789" target="_blank" className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 transition-all group">
//                             <div className="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center group-hover:bg-emerald-200"><MessageCircle className="w-3.5 h-3.5 text-emerald-600" /></div>
//                             <div><p className="text-[9px] text-gray-400">پیام در واتساپ</p><p className="text-xs font-bold text-gray-800">۰۹۱۲-۳۴۵-۶۷۸۹</p></div>
//                         </a>
//                         <a href="mailto:sales@drgearbox.com" className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 transition-all group">
//                             <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200"><Mail className="w-3.5 h-3.5 text-blue-600" /></div>
//                             <div><p className="text-[9px] text-gray-400">ایمیل</p><p className="text-[10px] font-bold text-gray-800 truncate">sales@drgearbox.com</p></div>
//                         </a>
//                         <div className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 transition-all">
//                             <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center"><MapPin className="w-3.5 h-3.5 text-purple-600" /></div>
//                             <div><p className="text-[9px] text-gray-400">آدرس</p><p className="text-[10px] font-medium text-gray-700 leading-tight">تهران، خیابان اصلی، پلاک ۱۲۳</p></div>
//                         </div>
//                     </div>
//                     <div className="border-t border-[#cccccc]"></div>
//                     <div className="p-2 text-center bg-gray-50"><Clock className="w-3 h-3 inline-block ml-1 text-[#1c4793]" /><span className="text-[9px] text-gray-500">ساعات پاسخگویی: ۹ صبح تا ۵ عصر</span></div>
//                 </div>
//             </div>
            
//             {/* نسخه موبایل */}
//             <div className="fixed bottom-5 left-3 z-50 lg:hidden">
//                 <a href="tel:02112345678" className="flex items-center gap-2 bg-gradient-to-r from-[#1c4793] to-[#113d64] text-white px-3 py-2 rounded-full shadow-lg">
//                     <Phone className="w-4 h-4 animate-pulse" />
//                     <span className="font-bold text-xs">تماس با فروش</span>
//                 </a>
//             </div>

//             <div className="max-w-6xl mx-auto px-3 sm:px-5 lg:px-6 relative z-10">
                
//                 {/* Breadcrumb */}
//                 <div className="mb-5">
//                     <nav className="flex items-center gap-1.5 text-xs font-medium bg-white/80 backdrop-blur-md px-3 py-2 rounded-lg shadow-sm border" style={{ borderColor: "#cccccc" }}>
//                         <Link to="/" className="transition-colors text-[11px]" style={{ color: "#1c4793" }}>دکتر گیربکس</Link>
//                         <ChevronLeft className="w-2.5 h-2.5" style={{ color: "#cccccc" }} />
//                         <Link to="/products" className="transition-colors text-[11px]" style={{ color: "#666666" }}>محصولات</Link>
//                         <ChevronLeft className="w-2.5 h-2.5" style={{ color: "#cccccc" }} />
//                         <span className="px-2 py-0.5 rounded-lg truncate max-w-[160px] md:max-w-xs font-semibold text-[11px]" style={{ backgroundColor: "#e8f0f8", color: "#1c4793" }}>{data.title}</span>
//                     </nav>
//                 </div>

//                 {/* Main Product Card */}
//                 <div className="bg-white rounded-2xl shadow-lg overflow-hidden border" style={{ borderColor: "#cccccc" }}>
//                     <div className="flex flex-col lg:flex-row">
                        
//                         {/* گالری تصویر */}
//                         <div className="lg:w-5/12 p-4 md:p-5 relative">
//                             <div className="hidden lg:block absolute left-0 top-6 bottom-6 w-px" style={{ background: "linear-gradient(to bottom, transparent, #cccccc, transparent)" }}></div>
//                             <div className="relative">
//                                 {hasDiscount && (
//                                     <div className="absolute top-2 right-2 z-20">
//                                         <div className="text-white px-2 py-1 rounded-xl shadow-md flex items-center gap-1 text-[10px]" style={{ background: "linear-gradient(135deg, #e21f25, #c41a20)" }}>
//                                             <span className="text-xs font-bold">{discountPercent}%</span>
//                                             <span className="text-[8px] font-medium">تخفیف</span>
//                                         </div>
//                                     </div>
//                                 )}
//                                 <button onClick={() => setIsLiked(!isLiked)} className="absolute top-2 left-2 z-20 bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-md border transition-all duration-300 hover:scale-105" style={{ borderColor: "#cccccc" }}>
//                                     <Heart className={`w-4 h-4 transition-all ${isLiked ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-400'}`} />
//                                 </button>
//                                 <div className="aspect-square rounded-xl border shadow-inner relative overflow-hidden bg-gradient-to-br from-gray-50 to-white" style={{ borderColor: "#cccccc" }}>
//                                     {renderMediaDisplay()}
//                                 </div>
//                                 {data.image && data.image.length > 1 && (
//                                     <div className="flex gap-2 mt-4 justify-center flex-wrap">
//                                         {data.image.map((media, idx) => {
//                                             const isActive = selectedImage === media;
//                                             const is3D = isModel3D(media);
//                                             return (
//                                                 <button key={idx} onClick={() => handleSelectMedia(media)} className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all duration-300 ${isActive ? 'shadow-md ring-2' : 'shadow-sm hover:scale-105'}`} style={{ borderColor: isActive ? "#1c4793" : "#cccccc", backgroundColor: "#f8fafc" }}>
//                                                     {is3D ? (
//                                                         <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
//                                                             <svg className="w-5 h-5 text-[#1c4793]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4-3-9s1.34-9 3-9m-9 9a9 9 0 019-9" /></svg>
//                                                             <span className="text-[8px] mt-0.5 text-[#1c4793] font-bold">3D</span>
//                                                         </div>
//                                                     ) : (<img src={media} alt="" className="w-full h-full object-cover p-1" />)}
//                                                 </button>
//                                             );
//                                         })}
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         {/* اطلاعات محصول */}
//                         <div className="lg:w-7/12 p-5 md:p-6 lg:pl-8 flex flex-col">
//                             <div className="flex flex-wrap items-center gap-2 mb-4">
//                                 {data.brand && (<span className="text-[10px] font-bold text-white px-2 py-1 rounded-lg shadow-sm" style={{ background: "linear-gradient(135deg, #1c4793, #113d64)" }}>{data.brand}</span>)}
//                                 {isOutOfStock ? (
//                                     <span className="text-[10px] font-bold text-white px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm" style={{ background: "linear-gradient(135deg, #e21f25, #c41a20)" }}><AlertCircle className="w-3 h-3" />سفارشی</span>
//                                 ) : (
//                                     <span className="text-[10px] font-bold text-white px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm" style={{ background: "linear-gradient(135deg, #32a3db, #1c4793)" }}><CheckCircle className="w-3 h-3" /> موجود در انبار</span>
//                                 )}
//                                 <button onClick={handleDownloadCatalog} className="text-[10px] font-semibold px-2 py-1 rounded-lg flex items-center gap-1 transition-all hover:scale-105" style={{ backgroundColor: "#e8f0f8", color: "#1c4793" }}><Download className="w-3 h-3" /> دانلود کاتالوگ</button>
//                             </div>

//                             <h1 className="text-xl md:text-2xl font-bold leading-tight mb-4" style={{ color: "#113d64" }}>{data.title}</h1>

//                             {/* بخش قیمت با آخرین بروزرسانی */}
//                             <div className="rounded-xl p-4 mb-6 border bg-gradient-to-r from-blue-50 to-white" style={{ borderColor: "#cccccc" }}>
//                                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
//                                     <span className="font-semibold text-xs" style={{ color: "#666666" }}>مبلغ نهایی پرداخت:</span>
//                                     <div className="text-left w-full md:w-auto">
//                                         {hasDiscount && (
//                                             <div className="flex items-center justify-end gap-1 mb-1">
//                                                 <span className="text-xs line-through decoration-1 font-medium" style={{ color: "#cccccc", textDecorationColor: "#e21f25" }}>
//                                                     {oldPrice.toLocaleString('fa-IR')}
//                                                 </span>
//                                             </div>
//                                         )}
//                                         <div className="flex items-baseline justify-end gap-1">
//                                             <span className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: "#1c4793" }}>
//                                                 {finalPrice > 0 ? finalPrice.toLocaleString('fa-IR') : 'تماس بگیرید'}
//                                             </span>
//                                             {finalPrice > 0 && <span className="text-xs font-bold" style={{ color: "#32a3db" }}>تومان</span>}
//                                         </div>
                                        
//                                         {hasLastPriceUpdate ? (
//                                             <div className="text-left mt-2 pt-1 border-t border-dashed border-gray-200">
//                                                 <div className="flex items-center gap-1">
//                                                     <Clock className="w-3 h-3 text-gray-400" />
//                                                     <span className="text-[12px] text-[#e21f25]">
//                                                         آخرین بروزرسانی: { convertGregorianToPersian( data.last_price_update)}
//                                                     </span>
//                                                 </div>
//                                             </div>
//                                         ) : (
//                                             <div className="text-left mt-2 pt-1 border-t border-dashed border-gray-200">
//                                                 <span className="text-[9px] text-gray-300">
//                                                     ✓ قیمت به‌روز است
//                                                 </span>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* آپشن ها */}
//                             {hasOptions ? (
//                                 <div className="space-y-5 mb-6 flex-grow">
//                                     <div className="flex items-center gap-1.5 mb-1"><Settings className="w-3.5 h-3.5" style={{ color: "#1c4793" }} /><h3 className="text-sm font-bold" style={{ color: "#113d64" }}>مشخصات قابل انتخاب</h3></div>
//                                     {data.options.map((option, idx) => {
//                                         if (!option.choices || option.choices.length === 0) return null;
//                                         const isRequired = option.is_required === "1" || option.is_required === 1 || option.is_required === true;
//                                         return (
//                                             <div key={idx}>
//                                                 <div className="flex items-center gap-2 mb-2">
//                                                     <div className="w-1.5 h-4 rounded-full" style={{ background: "linear-gradient(135deg, #1c4793, #32a3db)" }}></div>
//                                                     <span className="text-sm font-bold" style={{ color: "#113d64" }}>{option.name}</span>
//                                                     {isRequired && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md" style={{ backgroundColor: "#fee2e2", color: "#e21f25" }}>الزامی</span>}
//                                                 </div>
//                                                 <div className="flex flex-wrap gap-2">
//                                                     {option.choices.map((choice) => {
//                                                         const isSelected = selectedOptions[option.name]?.value === choice.value;
//                                                         const priceModifier = Number(choice.price_modifier) || 0;
//                                                         const modifierType = choice.modifier_type || "fixed";
                                                        
//                                                         return (
//                                                             <button 
//                                                                 key={choice.value} 
//                                                                 onClick={() => handleOptionSelect(option.name, choice.value, choice.price_modifier, modifierType)} 
//                                                                 className={`px-3 py-1.5 text-xs font-semibold rounded-xl border-2 transition-all duration-200 flex flex-col items-start gap-0.5 ${isSelected ? 'text-white shadow-md' : 'bg-white hover:shadow-sm'}`} 
//                                                                 style={isSelected ? { background: "linear-gradient(135deg, #1c4793, #113d64)", borderColor: "#1c4793" } : { borderColor: "#cccccc", color: "#555555" }}
//                                                             >
//                                                                 <span>{choice.value}</span>
//                                                                 {priceModifier !== 0 && (
//                                                                     <span className={`text-[9px] px-1 py-0 rounded ${isSelected ? 'bg-white/20 text-white' : ''}`} style={!isSelected ? { backgroundColor: "#e8f0f8", color: "#1c4793" } : {}}>
//                                                                         {modifierType === "percent" ? (
//                                                                             <>{priceModifier > 0 ? `+ ${priceModifier}%` : `${priceModifier}%`}</>
//                                                                         ) : (
//                                                                             <>{priceModifier > 0 ? `+ ${priceModifier.toLocaleString('fa-IR')} تومان` : `${priceModifier.toLocaleString('fa-IR')} تومان`}</>
//                                                                         )}
//                                                                     </span>
//                                                                 )}
//                                                             </button>
//                                                         );
//                                                     })}
//                                                 </div>
//                                             </div>
//                                         );
//                                     })}
//                                 </div>
//                             ) : (
//                                 <div className="mb-6 p-3 bg-gray-50 rounded-lg text-center border border-dashed" style={{ borderColor: "#cccccc" }}><Package className="w-5 h-5 mx-auto mb-1 opacity-30" /><p className="text-xs text-gray-500">این محصول فاقد آپشن قابل انتخاب است</p></div>
//                             )}

//                             {/* اکشن ها با دکمه سبد خرید و دکمه‌های + و - */}
//                             <div className="flex gap-3 mt-auto pt-5 border-t border-dashed" style={{ borderColor: "#cccccc" }}>
//                               {isInCart ? (
//                                 <div className="flex items-center justify-between w-full gap-3">
//                                   <button 
//                                     onClick={decreaseCartQuantity}
//                                     className="w-12 h-12 flex items-center justify-center bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
//                                   >
//                                     <Minus className="w-5 h-5" />
//                                   </button>
//                                   <div className="flex-1 text-center">
//                                     <span className="text-2xl font-bold text-[#1c4793]">{cartQuantity}</span>
//                                     <span className="text-xs text-gray-500 mr-1">عدد در سبد</span>
//                                   </div>
//                                   <button 
//                                     onClick={increaseCartQuantity}
//                                     disabled={isOutOfStock}
//                                     className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-[#1c4793] to-[#113d64] text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                                   >
//                                     <Plus className="w-5 h-5" />
//                                   </button>
//                                 </div>
//                               ) : (
//                                 <button 
//                                   onClick={handleAddToCart}
//                                   disabled={isOutOfStock} 
//                                   className={`flex-1 font-bold text-sm py-3 px-5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden relative group ${isOutOfStock ? 'cursor-not-allowed' : 'active:scale-[0.98]'}`} 
//                                   style={{ background: isOutOfStock ? "rgb(201 21 27)" : "linear-gradient(135deg, #1c4793, #113d64)", color: "#ffffff", boxShadow: !isOutOfStock ? "0 4px 15px -5px rgba(28,71,147,0.4)" : "none" }}
//                                 >
//                                   {!isOutOfStock && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>}
//                                   <ShoppingCart className="w-4 h-4 relative z-10" />
//                                   <span className="relative z-10 text-sm">{isOutOfStock ? 'محصول سفارشی' : 'افزودن به سبد خرید'}</span>
//                                 </button>
//                               )}
                              
//                               <button onClick={() => handleShare()} className="px-4 rounded-xl border bg-white transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-md hover:bg-gray-50" style={{ borderColor: "#cccccc", color: "#666666" }}>
//                                 <Share2 className="w-4 h-4" />
//                               </button>
//                             </div>
//                             <p className="mt-10 bg-blue-600 text-white px-2 py-3  rounded font-bold">برای اطلاعات بیشتر در مورد این محصول با واحد فروش تماس حاصل فرمایید</p>
//                         </div>
//                     </div>

//                     {/* بخش اطلاعات تکمیلی - بدون اسکرول */}
//                     <div className="mt-4 border-t" style={{ borderColor: "#cccccc", backgroundColor: "#f8fafc" }}>
//                         <div className="p-5 md:p-6 space-y-8">

//                             <div className="flex bg-gradient-to-r from-white to-gray-50 p-1 rounded-2xl shadow-lg border border-gray-100 sticky top-4 z-20" style={{ boxShadow: "0 4px 20px rgba(28,71,147,0.08)" }}>
//                                 <button onClick={() => scrollToSection("in_pro")} className="flex-1 px-4 py-3 text-sm font-bold rounded-xl transition-all duration-300 text-[#113d64] hover:text-white hover:bg-gradient-to-r hover:from-[#1c4793] hover:to-[#113d64] hover:shadow-md">
//                                     📖 معرفی محصول
//                                 </button>
//                                 <button onClick={() => scrollToSection("sec")} className="flex-1 px-4 py-3 text-sm font-bold rounded-xl transition-all duration-300 text-[#113d64] hover:text-white hover:bg-gradient-to-r hover:from-[#1c4793] hover:to-[#113d64] hover:shadow-md">
//                                     ⚙️ مشخصات فنی
//                                 </button>
//                                 <button onClick={() => scrollToSection("general_inf")} className="flex-1 px-4 py-3 text-sm font-bold rounded-xl transition-all duration-300 text-[#113d64] hover:text-white hover:bg-gradient-to-r hover:from-[#1c4793] hover:to-[#113d64] hover:shadow-md">
//                                     📋 اطلاعات عمومی
//                                 </button>
//                                 <button onClick={() => scrollToSection("features")} className="flex-1 px-4 py-3 text-sm font-bold rounded-xl transition-all duration-300 text-[#113d64] hover:text-white hover:bg-gradient-to-r hover:from-[#1c4793] hover:to-[#113d64] hover:shadow-md">
//                                     ✨ ویژگی‌های برجسته
//                                 </button>
//                             </div>
                            
//                             {/* توضیحات محصول */}
//                             <div id="in_pro">
//                                 <div className="flex items-center gap-2 mb-4 pb-2 border-b" style={{ borderColor: "#cccccc" }}>
//                                     <div className="p-1.5 rounded-lg" style={{ backgroundColor: "#1c4793" }}><FileText className="w-4 h-4 text-white" /></div>
//                                     <h3 className="text-base font-bold" style={{ color: "#113d64" }}>معرفی محصول</h3>
//                                 </div>
//                                 <div className="leading-relaxed text-sm font-normal bg-white p-5 rounded-xl shadow-sm border" style={{ borderColor: "#cccccc", color: "#555555", lineHeight: "1.8" }}>
//                                     {data.description ? <div dangerouslySetInnerHTML={{ __html: data.description }} /> : <div className="text-center py-8 flex flex-col items-center gap-2" style={{ color: "#cccccc" }}><FileText className="w-8 h-8" /><span className="text-sm">توضیحاتی برای این محصول درج نشده است.</span></div>}
//                                 </div>
//                             </div>
                            
//                             <p className="py-6"></p>
                            
//                             {/* مشخصات فنی از دیتابیس */}
//                             {hasSpecifications && (
//                                 <div id="sec">
//                                     <div className="flex items-center gap-2 mb-4 pb-2 border-b" style={{ borderColor: "#cccccc" }}>
//                                         <div className="p-1.5 rounded-lg" style={{ backgroundColor: "#1c4793" }}><Ruler className="w-4 h-4 text-white" /></div>
//                                         <h3 className="text-base font-bold" style={{ color: "#113d64" }}>مشخصات فنی</h3>
//                                     </div>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                                         {data.specifications?.map((spec, idx) => (
//                                             <div key={idx} className="flex items-center p-3 bg-white rounded-xl border transition-all hover:shadow-sm" style={{ borderColor: "#cccccc" }}>
//                                                 <span className="font-medium text-xs" style={{ color: "#666666" }}>{getSpecLabel(spec.spec_key)}:</span>
//                                                 <span className="font-semibold text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: "#f8fafc", color: "#113d64" }}>{spec.spec_value} {spec.spec_unit || ''}</span>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}

//                             <p className="py-6" id="general_inf"></p>
                            
//                             {/* مشخصات فنی ثابت */}
//                             <div>
//                                 <div className="flex items-center gap-2 mb-4 pb-2 border-b" style={{ borderColor: "#cccccc" }}>
//                                     <div className="p-1.5 rounded-lg" style={{ backgroundColor: "#1c4793" }}><Settings className="w-4 h-4 text-white" /></div>
//                                     <h3 className="text-base font-bold" style={{ color: "#113d64" }}>اطلاعات عمومی</h3>
//                                 </div>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                                     {technicalSpecs.map((spec, idx) => (
//                                         <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-xl border transition-all hover:shadow-sm" style={{ borderColor: "#cccccc" }}>
//                                             <div className="flex items-center gap-2">
//                                                 <div className="p-1.5 rounded-lg" style={{ backgroundColor: "#e8f0f8", color: "#1c4793" }}><spec.icon className="w-3.5 h-3.5" /></div>
//                                                 <span className="font-medium text-xs" style={{ color: "#666666" }}>{spec.label}</span>
//                                             </div>
//                                             <span className="font-semibold text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: "#f8fafc", color: "#113d64" }}>{spec.value}</span>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
                            
//                             <p id="features" className="py-6"></p>
                            
//                             {/* ویژگی‌ها */}
//                             <div>
//                                 <div className="flex items-center gap-2 mb-4 pb-2 border-b" style={{ borderColor: "#cccccc" }}>
//                                     <div className="p-1.5 rounded-lg" style={{ backgroundColor: "#1c4793" }}><Sparkles className="w-4 h-4 text-white" /></div>
//                                     <h3 className="text-base font-bold" style={{ color: "#113d64" }}>ویژگی‌های برجسته</h3>
//                                 </div>
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//                                     {validFeatures.length > 0 ? (
//                                         validFeatures.map((feature, idx) => (
//                                             <div key={idx} className="flex items-center gap-2 p-3 bg-white rounded-xl border shadow-sm hover:shadow-md transition-all" style={{ borderColor: "#cccccc" }}>
//                                                 <div className="p-1 rounded-lg" style={{ backgroundColor: "#e8f0f8" }}><CheckCircle className="w-3.5 h-3.5" style={{ color: "#32a3db" }} /></div>
//                                                 <span className="font-medium text-sm" style={{ color: "#113d64", lineHeight: "1.5" }}>{feature}</span>
//                                             </div>
//                                         ))
//                                     ) : (
//                                         <div className="col-span-full text-center py-8 font-medium bg-white rounded-xl border" style={{ borderColor: "#cccccc", color: "#cccccc" }}><span className="text-sm">ویژگی خاصی ثبت نشده است.</span></div>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* محصولات مرتبط */}
//                 {data.id && data.categoryId && <RelatedProducts currentId={data.id} categoryId={data.categoryId} />}

//                 {/* بنر پایین */}
//                 <div className="mt-12 rounded-xl p-5 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1c4793, #113d64)" }}>
//                     <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
//                     <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
//                         <div className="text-center md:text-right"><h3 className="text-lg font-bold mb-1">نیاز به مشاوره دارید؟</h3><p className="text-xs opacity-80" style={{ color: "#32a3db" }}>کارشناسان ما آماده پاسخگویی به سوالات شما هستند</p></div>
//                         <div className="flex gap-3">
//                             <button className="font-semibold text-xs px-4 py-2 rounded-lg hover:shadow-lg transition-all" style={{ backgroundColor: "#ffffff", color: "#1c4793" }}>تماس با ما</button>
//                             <button className="border text-xs px-4 py-2 rounded-lg transition-all" style={{ borderColor: "#32a3db", color: "#ffffff" }}>دریافت مشاوره</button>
//                         </div>
//                     </div>
//                 </div>

//                 {/* ویژگی‌های برند */}
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
//                     {[
//                         { icon: Shield, title: "گارانتی ۱۸ ماهه", desc: "ضمانت اصالت و سلامت" },
//                         { icon: Truck, title: "ارسال سریع", desc: "تحویل ۲۴ ساعته" },
//                         { icon: Clock, title: "پشتیبانی ۷/۲۴", desc: "مشاوره فنی رایگان" },
//                         { icon: Zap, title: "تضمین بهترین قیمت", desc: "قیمت رقابتی با بازار" }
//                     ].map((item, idx) => (
//                         <div key={idx} className="bg-white rounded-lg p-3 text-center border hover:shadow-md transition-all" style={{ borderColor: "#cccccc" }}>
//                             <item.icon className="w-6 h-6 mx-auto mb-1" style={{ color: "#1c4793" }} />
//                             <h4 className="font-bold text-xs" style={{ color: "#113d64" }}>{item.title}</h4>
//                             <p className="text-[10px] mt-0.5" style={{ color: "#666666" }}>{item.desc}</p>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Product;




































import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ShoppingCart, Heart, Share2, Award, ChevronLeft, 
  FileText, Ruler, CheckCircle, AlertCircle, 
  Package, Sparkles, Settings, Tag, Shield, Truck, Clock, Zap,
  Phone, MessageCircle, Headphones, Mail, Download, 
  Link2, Check, Plus, Minus, Star, RotateCw
} from "lucide-react";
import { useShoppingCart } from "../../context/ShoppingCartContext";

export interface IProduct {
  id: number;
  title: string;
  base_price: number | string;
  before_discount_price: number | string;
  brand: string;
  type: string;
  inventory: number | string;
  categoryId: number;
  description: string;
  catalog: string;
  image: string[];
  features: string[];
  specifications?: { spec_key: string; spec_value: string; spec_unit: string | null }[];
  last_price_update: string;
  last_price_update_fa?: string;
  options: {
    id: string;
    name: string;
    is_required: string | number | boolean;
    choices: { 
      value: string; 
      price_modifier: number;
      modifier_type?: "fixed" | "percent";
    }[];
  }[];
}

type SelectedOptionsState = Record<string, { 
  value: string; 
  modifier: number;
  modifier_type?: "fixed" | "percent";
}>;

// تابع تشخیص نوع فایل (تصویر یا مدل سه بعدی)
const isModel3D = (url: string): boolean => {
  if (!url) return false;
  return url.endsWith('.html') || 
         url.includes('/3d/') || 
         url.includes('/models/') ||
         url.includes('B3DH') ||
         url.includes('keyshot');
};

// تابع ترجمه کلید مشخصات فنی
const getSpecLabel = (key: string): string => {
  const labels: Record<string, string> = {
    power: "قدرت",
    torque: "گشتاور",
    ratio: "نسبت تبدیل",
    weight: "وزن",
    protection: "درجه حفاظت",
    efficiency: "راندمان",
    input_speed: "سرعت ورودی",
    output_speed: "سرعت خروجی",
    voltage: "ولتاژ",
    current: "جریان",
    frequency: "فرکانس",
    material: "جنس بدنه",
    dimension: "ابعاد",
    warranty: "گارانتی",
    temperature: "دمای کاری",
    noise: "نویز",
    mounting: "نحوه نصب"
  };
  return labels[key] || key;
};

// کامپوننت نمایش مدل سه بعدی
const Model3DViewer = ({ src, title }: { src: string; title: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <div className="text-center">
            <div className="w-10 h-10 border-3 border-t-[#1c4793] border-[#cccccc] rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-gray-500">در حال بارگذاری مدل سه بعدی...</p>
          </div>
        </div>
      )}
      
      {!hasError ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-full h-full absolute top-20">
            <iframe
              src={src}
              title={title}
              allowFullScreen
              style={{ 
                width: '100%',
                height: '100%',
                border: 'none',
                display: 'block'
              }}
              frameBorder="0"
              scrolling="no"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center p-4 bg-gray-50 rounded-xl">
          <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
          <p className="text-xs text-gray-500 mb-3">خطا در بارگذاری مدل سه بعدی</p>
          <button
            onClick={() => window.open(src, '_blank')}
            className="px-4 py-1.5 text-xs bg-[#1c4793] text-white rounded-lg"
          >
            مشاهده در پنجره جدید
          </button>
        </div>
      )}
    </div>
  );
};

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ 
      behavior: "smooth", 
      block: "start" 
    });
  }
};

const RelatedProducts = ({ currentId, categoryId }: { currentId: number; categoryId: number }) => {
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`https://electroshahresfahan.com/drgearbox/get_products.php?categoryId=${categoryId}`)
      .then((res) => {
        const products = res.data.products || [];
        const filtered = products.filter((p: IProduct) => p.id !== currentId).slice(0, 4);
        setRelatedProducts(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching related products:", err);
        setLoading(false);
      });
  }, [currentId, categoryId]);

  if (loading || relatedProducts.length === 0) return null;

  return (
    <div className="mt-16 relative z-10">
      <div className="flex items-center justify-between mb-6 border-b pb-3" style={{ borderColor: "#e5e7eb" }}>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl shadow-md bg-gradient-to-r from-blue-600 to-indigo-700">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">محصولات مشابه</h2>
        </div>
        <Link to="/products" className="group text-xs font-semibold flex items-center gap-1 transition-all px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100">
          مشاهده همه
          <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {relatedProducts.map((product) => (
          <Link 
            key={product.id} 
            to={`/product/${encodeURIComponent(product.title)}`}
            className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
          >
            <div className="aspect-square p-4 flex items-center justify-center bg-gray-50">
              <img 
                src={product.image?.[0] || "/placeholder.png"} 
                alt={product.title}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 flex flex-col flex-grow justify-between border-t border-gray-100 bg-white">
              <h3 className="font-bold leading-relaxed line-clamp-2 text-sm mb-2 text-gray-800">
                {product.title}
              </h3>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs text-gray-500">{product.brand}</span>
                <div className="flex items-baseline gap-1 px-3 py-1.5 rounded-xl bg-blue-50">
                  <span className="font-black text-sm text-blue-600">
                    {Number(product.base_price).toLocaleString('fa-IR')}
                  </span>
                  <span className="text-[10px] font-bold text-blue-400">تومان</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const Product = () => {
    const [data, setData] = useState<IProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedOptions, setSelectedOptions] = useState<SelectedOptionsState>({});
    const [isLiked, setIsLiked] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string>("");
    const [isModelView, setIsModelView] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);
    const [cartQuantity, setCartQuantity] = useState(0);
    const [isInCart, setIsInCart] = useState(false);
    const [stockError, setStockError] = useState<string | null>(null);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const { id } = useParams();
    
    const { addToCart, items, updateQuantity, removeFromCart, error: cartError, clearError } = useShoppingCart();
    
    // تابع تولید itemId
    const generateItemId = (productId: number, selectedOptions: SelectedOptionsState): string => {
      const optionsKey = Object.entries(selectedOptions)
        .sort()
        .map(([key, value]) => `${key}:${value.value}`)
        .join("|");
      return `${productId}|${optionsKey}`;
    };

    const convertGregorianToPersian = (gregorianDate: string): string => {
      if (!gregorianDate) return "";
      const date = new Date(gregorianDate);
      return new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(date);
    };

    useEffect(() => {
        if (!id) return;
        window.scroll({ behavior: 'smooth', top: 0 });
        setLoading(true);
        axios.get(`https://electroshahresfahan.com/drgearbox/get_products.php?title=${encodeURIComponent(id)}`)
            .then((res) => {
                const products = res.data.products || [];
                if (products.length > 0) {
                    const product = products[0];
                    setData(product);
                    const firstMedia = product.image?.[0] || "";
                    setSelectedImage(firstMedia);
                    setIsModelView(isModel3D(firstMedia));
                    
                    const initialSelections: SelectedOptionsState = {};
                    if (product.options && Array.isArray(product.options) && product.options.length > 0) {
                        product.options.forEach((opt: any) => {
                            const isRequired = opt.is_required === "1" || opt.is_required === 1 || opt.is_required === true;
                            if (isRequired && opt.choices && opt.choices.length > 0) {
                                initialSelections[opt.name] = {
                                    value: opt.choices[0].value,
                                    modifier: Number(opt.choices[0].price_modifier) || 0,
                                    modifier_type: opt.choices[0].modifier_type || "fixed"
                                };
                            }
                        });
                    }
                    setSelectedOptions(initialSelections);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching product:", err);
                setLoading(false);
            });
    }, [id]);

    // بررسی وجود محصول در سبد خرید
    useEffect(() => {
      if (data) {
        const itemId = generateItemId(data.id, selectedOptions);
        const existingItem = items.find(item => item.id === itemId);
        
        if (existingItem) {
          setIsInCart(true);
          setCartQuantity(existingItem.quantity);
        } else {
          setIsInCart(false);
          setCartQuantity(0);
        }
      }
    }, [data, selectedOptions, items]);

    // محاسبه قیمت نهایی
    const finalPrice = useMemo(() => {
        if (!data?.base_price) return 0;
        const base = Number(data.base_price);
        let modifiersSum = 0;
        
        Object.entries(selectedOptions).forEach(([optionName, opt]) => {
            const option = data.options?.find(o => o.name === optionName);
            const choice = option?.choices?.find(c => c.value === opt.value);
            const modifierType = choice?.modifier_type || opt.modifier_type || "fixed";
            const modifierValue = opt.modifier;
            
            if (modifierType === "percent") {
                modifiersSum += (base * modifierValue) / 100;
            } else {
                modifiersSum += modifierValue;
            }
        });
        
        return base + modifiersSum;
    }, [data, selectedOptions]);

    const handleOptionSelect = (optionName: string, choiceValue: string, modifier: number, modifierType: string = "fixed") => {
        setSelectedOptions(prev => ({
            ...prev,
            [optionName]: { 
                value: choiceValue, 
                modifier: Number(modifier) || 0,
                modifier_type: modifierType as "fixed" | "percent"
            }
        }));
    };

    const handleSelectMedia = (url: string) => {
        setSelectedImage(url);
        setIsModelView(isModel3D(url));
    };

    const handleDownloadCatalog = () => {
        if (data?.catalog) {
            window.open(data.catalog, '_blank');
        } else {
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
        }
    };

    const handleShare = async (platform?: string) => {
        const url = window.location.href;
        const title = data?.title || "محصول دکتر گیربکس";
        const text = `مشاهده محصول ${title} در فروشگاه دکتر گیربکس`;
        
        if (platform === 'copy') {
            try {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
            setShowShareMenu(false);
            return;
        }
        
        if (platform === 'whatsapp') {
            window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`, '_blank');
        } else if (platform === 'telegram') {
            window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        } else if (platform === 'twitter') {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        } else if (platform === 'facebook') {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        } else if (platform === 'linkedin') {
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        } else {
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: title,
                        text: text,
                        url: url,
                    });
                } catch (err) {
                    console.log('Error sharing:', err);
                }
            } else {
                setShowShareMenu(!showShareMenu);
            }
        }
        
        setShowShareMenu(false);
    };

    const handleAddToCart = () => {
        if (isOutOfStock) {
            setStockError("این محصول ناموجود است و قابل افزودن به سبد خرید نمی‌باشد");
            setTimeout(() => setStockError(null), 3000);
            return;
        }
        
        if (data) {
            addToCart(data, selectedOptions);
        }
    };

    const increaseCartQuantity = () => {
        if (isOutOfStock) {
            setStockError("این محصول ناموجود است");
            setTimeout(() => setStockError(null), 3000);
            return;
        }
        
        if (data) {
            const itemId = generateItemId(data.id, selectedOptions);
            const currentQuantity = items.find(item => item.id === itemId)?.quantity || 0;
            
            if (currentQuantity >= Number(data.inventory)) {
                setStockError(`امکان افزودن بیشتر از موجودی انبار (${data.inventory} عدد) وجود ندارد`);
                setTimeout(() => setStockError(null), 3000);
                return;
            }
            
            addToCart(data, selectedOptions, 1);
        }
    };

    const decreaseCartQuantity = () => {
      if (data) {
        const itemId = generateItemId(data.id, selectedOptions);
        const existingItem = items.find(item => item.id === itemId);
        
        if (existingItem && existingItem.quantity === 1) {
          removeFromCart(itemId);
        } else if (existingItem) {
          updateQuantity(itemId, existingItem.quantity - 1);
        }
      }
    };

    const renderMediaDisplay = () => {
        if (!selectedImage) {
            return (
                <div className="flex flex-col items-center gap-2 text-gray-300">
                    <Package className="w-16 h-16" />
                    <span className="font-medium text-sm">تصویری موجود نیست</span>
                </div>
            );
        }

        if (isModelView) {
            return <Model3DViewer src={selectedImage} title={data?.title || "مدل سه بعدی"} />;
        }

        return (
            <img 
                src={selectedImage} 
                alt={data?.title} 
                className="w-full h-full object-contain drop-shadow-xl transition-transform duration-500" 
            />
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-white">
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
                    <div className="relative w-16 h-16 mx-auto mb-4">
                        <div className="absolute inset-0 border-t-3 rounded-full animate-spin border-blue-600"></div>
                        <div className="absolute inset-1 border-r-3 rounded-full animate-spin border-indigo-400"></div>
                    </div>
                    <p className="font-bold text-sm animate-pulse text-gray-600">در حال بارگذاری محصول...</p>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const oldPrice = Number(data.before_discount_price) || 0;
    const basePrice = Number(data.base_price) || 0;
    const hasDiscount = oldPrice > basePrice;
    const discountPercent = hasDiscount ? Math.round(((oldPrice - basePrice) / oldPrice) * 100) : 0;
    const isOutOfStock = data.inventory === "0";

    const technicalSpecs = [
        { label: "برند", value: data.brand || "نامشخص", icon: Award },
        { label: "نوع/مدل", value: data.type || "نامشخص", icon: Settings },
        { label: "موجودی انبار", value: isOutOfStock ? "ناموجود" : `${data.inventory} عدد`, icon: Package },
        { label: "کد محصول", value: `PRD-${data.id}`, icon: Tag },
        { label: "گارانتی", value: "۱۸ ماهه", icon: Shield },
        { label: "ارسال", value: "۲۴ ساعته", icon: Truck },
    ];

    const validFeatures = data.features?.filter(f => f && f.trim() !== "") || [];
    const hasOptions = data.options && Array.isArray(data.options) && data.options.length > 0 && 
                       data.options.some(opt => opt.choices && opt.choices.length > 0);
    const hasSpecifications = data.specifications && data.specifications.length > 0;
    const hasLastPriceUpdate = data.last_price_update && data.last_price_update !== "هنوز به‌روزرسانی نشده";

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50">
            
            {/* نوتیفیکیشن‌ها */}
            {(stockError || cartError) && (
                <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] animate-slide-down">
                    <div className={`rounded-2xl px-6 py-3 shadow-2xl flex items-center gap-3 ${stockError ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`}>
                        <AlertCircle className="w-5 h-5 text-white" />
                        <span className="text-white font-medium">{stockError || cartError}</span>
                        {(cartError ) && (
                            <button onClick={clearError} className="text-white/80 hover:text-white">✕</button>
                        )}
                    </div>
                </div>
            )}
            
            {showNotification && (
                <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] animate-slide-down">
                    <div className="bg-amber-500 rounded-2xl px-6 py-3 shadow-2xl flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-white" />
                        <span className="text-white font-medium">کاتالوگی برای این محصول موجود نیست</span>
                    </div>
                </div>
            )}
            
            {copied && (
                <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] animate-slide-down">
                    <div className="bg-emerald-500 rounded-2xl px-6 py-3 shadow-2xl flex items-center gap-3">
                        <Check className="w-5 h-5 text-white" />
                        <span className="text-white font-medium">لینک محصول با موفقیت کپی شد</span>
                    </div>
                </div>
            )}

            {/* منوی اشتراک‌گذاری */}
            {showShareMenu && (
                <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center animate-fade-in" onClick={() => setShowShareMenu(false)}>
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-800">اشتراک‌گذاری محصول</h3>
                            <button onClick={() => setShowShareMenu(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => handleShare('whatsapp')} className="flex items-center gap-2 p-3 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 transition-all">
                                <MessageCircle className="w-5 h-5" />
                                <span className="text-sm font-medium">واتساپ</span>
                            </button>
                            <button onClick={() => handleShare('telegram')} className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.66-.35-1.02.22-1.61.15-.15 2.71-2.48 2.76-2.69.01-.03.02-.12-.05-.17-.07-.05-.17-.03-.24-.02-.1.02-1.64 1.04-4.64 3.07-.44.3-.84.45-1.2.44-.39-.01-1.15-.22-1.72-.41-.7-.23-1.26-.35-1.21-.74.03-.2.3-.41.82-.63 3.17-1.38 5.29-2.29 6.36-2.73 3.03-1.25 3.66-1.47 4.07-1.47.09 0 .29.02.42.13.11.09.14.22.15.34-.01.09-.02.23-.03.37z"/>
                                </svg>
                                <span className="text-sm font-medium">تلگرام</span>
                            </button>
                            <button onClick={() => handleShare('twitter')} className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 transition-all">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.968-3.305c1.674-3.087 2.524-6.453 2.478-9.812a10.015 10.015 0 002.455-2.545z"/>
                                </svg>
                                <span className="text-sm font-medium">توییتر</span>
                            </button>
                            <button onClick={() => handleShare('copy')} className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 transition-all">
                                <Link2 className="w-5 h-5" />
                                <span className="text-sm font-medium">کپی لینک</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* سایدبار شناور سمت چپ */}
            <div className="fixed left-2 top-1/2 transform -translate-y-1/2 z-50 hidden xl:block">
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="px-4 py-3 text-white text-center bg-gradient-to-r from-blue-600 to-indigo-700">
                        <Headphones className="w-5 h-5 mx-auto mb-1" />
                        <h3 className="font-bold text-xs">پشتیبانی ۲۴/۷</h3>
                    </div>
                    <div className="p-3 space-y-2">
                        <a href="tel:02112345678" className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-all group">
                            <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Phone className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-gray-400">تماس مستقیم</p>
                                <p className="text-xs font-bold text-gray-700">۰۲۱-۱۲۳۴۵۶۷۸</p>
                            </div>
                        </a>
                        <a href="https://wa.me/989123456789" target="_blank" className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-all group">
                            <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <MessageCircle className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-gray-400">پیام در واتساپ</p>
                                <p className="text-xs font-bold text-gray-700">۰۹۱۲-۳۴۵-۶۷۸۹</p>
                            </div>
                        </a>
                        <a href="mailto:sales@drgearbox.com" className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-all group">
                            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Mail className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-gray-400">ایمیل</p>
                                <p className="text-[10px] font-bold text-gray-700 truncate">sales@drgearbox.com</p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
            
            <div className="fixed bottom-6 left-4 z-50 xl:hidden">
                <a href="tel:02112345678" className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-3 rounded-full shadow-2xl hover:shadow-xl transition-all">
                    <Phone className="w-4 h-4 animate-pulse" />
                    <span className="font-bold text-xs">تماس با فروش</span>
                </a>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                
                <div className="mb-8">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link to="/" className="text-gray-500 hover:text-blue-600 transition-colors">خانه</Link>
                        <ChevronLeft className="w-3 h-3 text-gray-400" />
                        <Link to="/products" className="text-gray-500 hover:text-blue-600 transition-colors">محصولات</Link>
                        <ChevronLeft className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-800 font-medium line-clamp-1">{data.title}</span>
                    </nav>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        
                        <div className="relative bg-gradient-to-br from-gray-50 to-white p-6 lg:p-8">
                            <div className="relative group">
                                {hasDiscount && (
                                    <div className="absolute top-4 right-4 z-20">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-red-500 rounded-full blur-md opacity-50"></div>
                                            <div className="relative bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                                                <span className="text-xs font-bold">{discountPercent}%</span>
                                                <span className="text-[10px]">تخفیف</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                <button 
                                    onClick={() => setIsLiked(!isLiked)} 
                                    className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                                >
                                    <Heart className={`w-5 h-5 transition-all ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                                </button>
                                
                                <div 
                                    className="relative aspect-square rounded-2xl overflow-hidden cursor-zoom-in"
                                    onMouseEnter={() => setIsZoomed(true)}
                                    onMouseLeave={() => setIsZoomed(false)}
                                    onMouseMove={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        const x = ((e.clientX - rect.left) / rect.width) * 100;
                                        const y = ((e.clientY - rect.top) / rect.height) * 100;
                                        setZoomPosition({ x, y });
                                    }}
                                >
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                                        {renderMediaDisplay()}
                                    </div>
                                    
                                    {isZoomed && !isModelView && selectedImage && (
                                        <div 
                                            className="absolute inset-0 pointer-events-none"
                                            style={{
                                                backgroundImage: `url(${selectedImage})`,
                                                backgroundSize: '200%',
                                                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                                opacity: 0.95
                                            }}
                                        />
                                    )}
                                </div>
                                
                                {data.image && data.image.length > 1 && (
                                    <div className="flex gap-2 mt-4 justify-center">
                                        {data.image.slice(0, 5).map((media, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleSelectMedia(media)}
                                                className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                                                    selectedImage === media 
                                                        ? 'border-blue-500 shadow-lg scale-105' 
                                                        : 'border-gray-200 hover:border-gray-300 hover:scale-105'
                                                }`}
                                            >
                                                {isModel3D(media) ? (
                                                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                                                        <RotateCw className="w-6 h-6 text-blue-600" />
                                                    </div>
                                                ) : (
                                                    <img src={media} alt="" className="w-full h-full object-cover" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* اطلاعات محصول */}
                        <div className="p-6 lg:p-8 bg-white flex flex-col">
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                {data.brand && (
                                    <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-md">
                                        <Award className="w-3 h-3" />
                                        {data.brand}
                                    </span>
                                )}
                                {isOutOfStock ? (
                                    <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-full">
                                        <AlertCircle className="w-3 h-3" />
                                        سفارشی
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-full">
                                        <CheckCircle className="w-3 h-3" />
                                        موجود در انبار
                                    </span>
                                )}
                                <button 
                                    onClick={handleDownloadCatalog} 
                                    className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all duration-300"
                                >
                                    <Download className="w-3 h-3" />
                                    کاتالوگ
                                </button>
                            </div>

                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-4">
                                {data.title}
                            </h1>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <div className="w-px h-4 bg-gray-300"></div>
                                <span className="text-xs text-gray-500">کد: PRD-{data.id}</span>
                            </div>

                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 mb-6">
                                <div className="flex items-center justify-between flex-wrap gap-3">
                                    <span className="text-sm text-gray-600">مبلغ قابل پرداخت:</span>
                                    <div className="text-left">
                                        {hasDiscount && (
                                            <div className="flex items-center gap-2 mb-1 justify-end">
                                                <span className="text-sm line-through text-gray-400">
                                                    {oldPrice.toLocaleString('fa-IR')} تومان
                                                </span>
                                                <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                    {discountPercent}% تخفیف
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-black text-blue-600">
                                                {finalPrice.toLocaleString('fa-IR')}
                                            </span>
                                            <span className="text-sm font-bold text-gray-500">تومان</span>
                                        </div>
                                        
                                        {hasLastPriceUpdate && (
                                            <div className="flex items-center gap-1 mt-2 pt-2 border-t border-blue-200/50">
                                                <Clock className="w-3 h-3 text-gray-400" />
                                                <span className="text-[10px] text-gray-500">
                                                    بروزرسانی: {convertGregorianToPersian(data.last_price_update)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {hasOptions && (
                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-5 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                                        <h3 className="text-sm font-bold text-gray-800">مشخصات قابل انتخاب</h3>
                                    </div>
                                    
                                    {data.options.map((option, idx) => {
                                        if (!option.choices?.length) return null;
                                        const isRequired = option.is_required === "1" || option.is_required === 1 || option.is_required === true;
                                        return (
                                            <div key={idx} className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold text-gray-700">{option.name}</span>
                                                    {isRequired && (
                                                        <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">الزامی</span>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {option.choices.map((choice) => {
                                                        const isSelected = selectedOptions[option.name]?.value === choice.value;
                                                        return (
                                                            <button
                                                                key={choice.value}
                                                                onClick={() => handleOptionSelect(option.name, choice.value, choice.price_modifier, choice.modifier_type)}
                                                                className={`px-4 py-2 text-sm font-medium rounded-xl border-2 transition-all duration-200 ${
                                                                    isSelected
                                                                        ? 'border-blue-600 bg-blue-600 text-white shadow-md scale-105'
                                                                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-sm'
                                                                }`}
                                                            >
                                                                {choice.value}
                                                                {choice.price_modifier !== 0 && (
                                                                    <span className={`text-[10px] mr-1 ${isSelected ? 'text-white/80' : 'text-blue-600'}`}>
                                                                        ({choice.modifier_type === 'percent' 
                                                                            ? `${choice.price_modifier > 0 ? '+' : ''}${choice.price_modifier}%`
                                                                            : `${choice.price_modifier > 0 ? '+' : ''}${choice.price_modifier.toLocaleString('fa-IR')}ت`})
                                                                    </span>
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <div className="mt-auto pt-5 border-t border-gray-100">
                                <div className="flex gap-3">
                                    {isInCart ? (
                                        <div className="flex items-center justify-between w-full gap-3 bg-gray-50 rounded-xl p-1">
                                            <button 
                                                onClick={decreaseCartQuantity}
                                                className="w-12 h-12 flex items-center justify-center bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300 shadow-md"
                                            >
                                                <Minus className="w-5 h-5" />
                                            </button>
                                            <div className="flex-1 text-center">
                                                <span className="text-2xl font-bold text-blue-600">{cartQuantity}</span>
                                                <span className="text-xs text-gray-500 mr-1">عدد در سبد</span>
                                            </div>
                                            <button 
                                                onClick={increaseCartQuantity}
                                                disabled={isOutOfStock}
                                                className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={handleAddToCart}
                                            disabled={isOutOfStock}
                                            className="flex-1 relative overflow-hidden group bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                            <ShoppingCart className="w-5 h-5 inline ml-2 relative z-10" />
                                            <span className="relative z-10">{isOutOfStock ? 'محصول سفارشی' : 'افزودن به سبد خرید'}</span>
                                        </button>
                                    )}
                                    
                                    <button 
                                        onClick={() => handleShare()} 
                                        className="w-12 h-12 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all duration-300 flex items-center justify-center shadow-sm"
                                    >
                                        <Share2 className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
                                
                                <p className="mt-4 text-center text-xs text-gray-500 bg-gray-50 py-3 rounded-xl">
                                    <Phone className="w-3 h-3 inline ml-1" />
                                    برای اطلاعات بیشتر با واحد فروش تماس بگیرید
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* تب‌بندی اطلاعات محصول */}
                    <div className="border-t border-gray-100 bg-gray-50/50">
                        <div className="max-w-7xl mx-auto px-6 lg:px-8">
                            <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-200 gap-2">
                                {[
                                    { id: "in_pro", label: "معرفی", icon: FileText },
                                    { id: "sec", label: "مشخصات", icon: Ruler },
                                    { id: "general_inf", label: "اطلاعات عمومی", icon: Settings },
                                    { id: "features", label: "ویژگی‌ها", icon: Sparkles }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => scrollToSection(tab.id)}
                                        className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-gray-600 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition-all duration-300 whitespace-nowrap"
                                    >
                                        <tab.icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div className="py-8 space-y-10">
                                <div id="in_pro" className="scroll-mt-20">
                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                                            معرفی محصول
                                        </h3>
                                        <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                                            {data.description ? (
                                                <div dangerouslySetInnerHTML={{ __html: data.description }} />
                                            ) : (
                                                <div className="text-center py-8 text-gray-400">
                                                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                                    <span>توضیحاتی برای این محصول ثبت نشده است</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {hasSpecifications && (
                                    <div id="sec" className="scroll-mt-20">
                                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                                <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                                                مشخصات فنی
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {data.specifications?.map((spec, idx) => (
                                                    <div key={idx} className="flex items-center  p-3 bg-gray-50 rounded-xl">
                                                        <span className="text-sm text-gray-600">{getSpecLabel(spec.spec_key)} :</span>
                                                        <span className="text-sm font-semibold mr-4 text-gray-800">
                                                            {spec.spec_value} {spec.spec_unit || ''}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div id="general_inf" className="scroll-mt-20">
                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                                            اطلاعات عمومی
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {technicalSpecs.map((spec, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                                    <div className="flex items-center gap-2">
                                                        <spec.icon className="w-4 h-4 text-blue-600" />
                                                        <span className="text-sm text-gray-600">{spec.label}</span>
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-800">{spec.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div id="features" className="scroll-mt-20">
                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                                            ویژگی‌های برجسته
                                        </h3>
                                        {validFeatures.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {validFeatures.map((feature, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                                                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                        <span className="text-sm text-gray-700">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-gray-400">
                                                <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                                <span>ویژگی خاصی ثبت نشده است</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* محصولات مرتبط */}
                {data.id && data.categoryId && <RelatedProducts currentId={data.id} categoryId={data.categoryId} />}

                {/* بنر مشاوره */}
                <div className="mt-12 relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-700 to-blue-800 text-white p-8 shadow-2xl">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 -right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 -left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-right">
                            <h3 className="text-2xl font-bold mb-2">نیاز به مشاوره دارید؟</h3>
                            <p className="text-blue-200">کارشناسان ما آماده پاسخگویی به سوالات شما هستند</p>
                        </div>
                        <div className="flex gap-3">
                            <a href="tel:02112345678" className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all shadow-lg">
                                تماس با ما
                            </a>
                            <a href="https://wa.me/989123456789" target="_blank" className="px-6 py-3 bg-blue-500/30 backdrop-blur border border-white/30 text-white rounded-xl font-bold text-sm hover:bg-blue-500/40 transition-all">
                                مشاوره واتساپ
                            </a>
                        </div>
                    </div>
                </div>

                {/* گارانتی‌ها */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    {[
                        { icon: Shield, title: "گارانتی ۱۸ ماهه", desc: "ضمانت اصالت و سلامت", color: "from-blue-500 to-blue-600" },
                        { icon: Truck, title: "ارسال سریع", desc: "تحویل ۲۴ ساعته", color: "from-emerald-500 to-emerald-600" },
                        { icon: Headphones, title: "پشتیبانی ۷/۲۴", desc: "مشاوره فنی رایگان", color: "from-purple-500 to-purple-600" },
                        { icon: Zap, title: "تضمین بهترین قیمت", desc: "قیمت رقابتی با بازار", color: "from-amber-500 to-amber-600" }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                            <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                                <item.icon className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="font-bold text-sm text-gray-800 mb-1">{item.title}</h4>
                            <p className="text-[11px] text-gray-500">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Product;