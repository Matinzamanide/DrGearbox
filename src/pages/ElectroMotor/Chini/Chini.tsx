// import { Link } from "react-router-dom";
// import { Zap, Shield, Truck, Award, Star, ArrowLeft, Flame, Wind, ChevronLeft } from "lucide-react";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import type { IProduct } from "../../Gearbox/Gearbox";

// const Chini = () => {
//   const [data, setData] = useState<IProduct[]>([]);
//   const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
//   const [activeTab, setActiveTab] = useState<string>("231");
//   const [loading, setLoading] = useState(true);

//   const tabs = [
//     { id: "231", name: "سه‌فاز بدنه آلومینیوم", icon: Zap, color: "from-blue-500 to-indigo-600", shadow: "shadow-blue-500/30" },
//     { id: "232", name: "سه‌فاز بدنه چدن", icon: Flame, color: "from-orange-500 to-red-500", shadow: "shadow-orange-500/30" },
//     { id: "233", name: "الکتروموتور تک فاز", icon: Wind, color: "from-teal-400 to-emerald-500", shadow: "shadow-emerald-500/30" },
//   ];

//   const stats = [
//     { icon: Shield, label: "گارانتی شرکتی", value: "۱۸ ماهه", color: "text-blue-600", bg: "bg-blue-50" },
//     { icon: Truck, label: "ارسال به سراسر کشور", value: "سریع و مطمئن", color: "text-emerald-600", bg: "bg-emerald-50" },
//     { icon: Award, label: "تضمین اصالت", value: "کالای اورجینال", color: "text-amber-600", bg: "bg-amber-50" },
//     { icon: Star, label: "رضایت خریداران", value: "۹۸.۵٪", color: "text-rose-600", bg: "bg-rose-50" },
//   ];

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const res = await axios("https://electroshahresfahan.com/drgearbox/get_products.php");
//         setData(res.data.products || []);
//       } catch (e) {
//         console.log(e);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     const filtered = data.filter((item) => item.categoryId === activeTab);
//     setFilteredProducts(filtered);
//   }, [data, activeTab]);

//   // کامپوننت اسکلت برای لودینگ جذاب‌تر
//   const SkeletonCard = () => (
//     <div className="bg-white rounded-3xl p-3 border border-gray-100 shadow-sm animate-pulse">
//       <div className="h-52 bg-slate-100 rounded-2xl mb-4 w-full"></div>
//       <div className="px-2">
//         <div className="h-3 bg-slate-100 rounded-full w-1/4 mb-3"></div>
//         <div className="h-4 bg-slate-200 rounded-full w-3/4 mb-2"></div>
//         <div className="h-4 bg-slate-100 rounded-full w-1/2 mb-6"></div>
//         <div className="flex justify-between items-center mt-4">
//           <div className="h-5 bg-slate-200 rounded-full w-1/3"></div>
//           <div className="h-8 bg-slate-100 rounded-xl w-1/3"></div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <section className="w-full py-16 px-4 md:px-8 bg-[#F8FAFC] min-h-screen font-sans" dir="rtl">
//       <div className="max-w-7xl mx-auto">

//         {/* Header Section */}
//         <div className="text-center mb-16 relative">
//           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none"></div>
//           <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-4">
//             الکتروموتورهای <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-600 to-indigo-500">چینی</span>
//           </h2>
//           <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
//             مجموعه‌ای بی‌نظیر از موتورهای صنعتی با راندمان بالا، طراحی شده برای سخت‌ترین شرایط کاری همراه با گارانتی معتبر شرکتی.
//           </p>
//         </div>

//         {/* Premium Stats Grid */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
//           {stats.map((s, i) => (
//             <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col items-center text-center group">
//               <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
//                 <s.icon className={`${s.color} w-6 h-6`} strokeWidth={1.5} />
//               </div>
//               <p className="text-slate-800 font-bold text-sm md:text-base">{s.value}</p>
//               <p className="text-xs text-slate-500 mt-1">{s.label}</p>
//             </div>
//           ))}
//         </div>

//         {/* Modern Segmented Tabs */}
//         <div className="flex flex-wrap gap-3 justify-center mb-12">
//           {tabs.map((tab) => {
//             const Icon = tab.icon;
//             const active = activeTab === tab.id;
//             return (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`
//                   relative px-6 py-3.5 rounded-2xl text-sm font-bold flex items-center gap-2.5 transition-all duration-300 overflow-hidden
//                   ${active ? `text-white shadow-lg ${tab.shadow} -translate-y-0.5` : "bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-200"}
//                 `}
//               >
//                 {active && <div className={`absolute inset-0 bg-gradient-to-r ${tab.color} opacity-100`}></div>}
//                 <Icon className={`w-5 h-5 relative z-10 ${active ? "animate-pulse" : ""}`} strokeWidth={active ? 2 : 1.5} />
//                 <span className="relative z-10">{tab.name}</span>
//               </button>
//             );
//           })}
//         </div>

//         {/* Section Header */}
//         <div className="flex items-end justify-between mb-8 px-2">
//           <div>
//             <h3 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
//               {tabs.find((t) => t.id === activeTab)?.name}
//             </h3>
//             <p className="text-sm text-slate-500 mt-1">
//               نمایش {loading ? "..." : filteredProducts.length} محصول یافت شده
//             </p>
//           </div>
//           <Link to="/products" className="group flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50/50 hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors">
//             مشاهده همه
//             <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
//           </Link>
//         </div>

//         {/* Products Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
//           {loading ? (
//             Array.from({ length: 8 }).map((_, idx) => <SkeletonCard key={idx} />)
//           ) : (
//             filteredProducts.map((product) => {
//               const hasDiscount = product.before_discount_price && Number(product.before_discount_price) > Number(product.base_price);
//               const discountPercent = hasDiscount 
//                 ? Math.round(((Number(product.before_discount_price) - Number(product.base_price)) / Number(product.before_discount_price)) * 100) 
//                 : 0;

//               return (
//                 <Link
//                   key={product.id}
//                   to={`/product/${encodeURIComponent(product.title)}`}
//                   className="group bg-white rounded-[24px] p-3 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 hover:border-blue-100 transition-all duration-500 hover:-translate-y-1.5 flex flex-col"
//                 >
//                   {/* Image Box */}
//                   <div className="relative h-56 bg-[#F8FAFC] rounded-2xl flex items-center justify-center overflow-hidden mb-4 group-hover:bg-blue-50/30 transition-colors">
//                     {/* Hover Overlay */}
//                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors z-10"></div>
                    
//                     <img
//                       src={product.image?.[0] || "/placeholder.png"}
//                       alt={product.title}
//                       className="object-contain w-3/4 h-3/4 drop-shadow-md transition-transform duration-700 ease-out group-hover:scale-110 mix-blend-multiply"
//                     />

//                     {/* Badges */}
//                     {hasDiscount && (
//                       <div className="absolute top-3 right-3 z-20 bg-rose-500/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1.5 rounded-xl shadow-sm">
//                         {discountPercent}٪ تخفیف
//                       </div>
//                     )}
//                   </div>

//                   {/* Content */}
//                   <div className="px-2 flex flex-col grow">
//                     <div className="flex justify-between items-center text-xs mb-2">
//                       <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">
//                         {product.brand || "بدون برند"}
//                       </span>
//                       <span className={`font-medium flex items-center gap-1 ${product.inventory === "0" ? "text-rose-500" : "text-emerald-500"}`}>
//                         <span className={`w-1.5 h-1.5 rounded-full ${product.inventory === "0" ? "bg-rose-500" : "bg-emerald-500 animate-pulse"}`}></span>
//                         {product.inventory === "0" ? "ناموجود" : "موجود در انبار"}
//                       </span>
//                     </div>

//                     <h3 className="text-slate-800 font-bold text-sm leading-relaxed mb-4 line-clamp-2 min-h-[44px] group-hover:text-blue-600 transition-colors">
//                       {product.title}
//                     </h3>

//                     {/* Footer / Price */}
//                     <div className="mt-auto flex items-end justify-between pt-4 border-t border-slate-50">
//                       <div>
//                         {hasDiscount && (
//                           <div className="text-xs line-through text-slate-400 mb-0.5">
//                             {Number(product.before_discount_price).toLocaleString("fa-IR")}
//                           </div>
//                         )}
//                         <div className="text-lg font-extrabold text-slate-800">
//                           {Number(product.base_price).toLocaleString("fa-IR")} <span className="text-xs font-normal text-slate-500">تومان</span>
//                         </div>
//                       </div>
                      
//                       {/* Action Button */}
//                       <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-blue-500/30">
//                         <ArrowLeft className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
//                       </div>
//                     </div>
//                   </div>
//                 </Link>
//               );
//             })
//           )}
//         </div>

//       </div>
//     </section>
//   );
// };

// export default Chini;




import { Link } from "react-router-dom";
import { Zap, Shield, Truck, Award, Star, ArrowLeft, Flame, Wind, ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import type { IProduct } from "../../Gearbox/Gearbox";

const Chini = () => {
  const [data, setData] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [activeTab, setActiveTab] = useState<string>("231");
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: "231", name: "سه‌فاز بدنه آلومینیوم", icon: Zap, color: "from-[#1c4793] to-[#32a3db]", shadow: "shadow-[#32a3db]/30" },
    { id: "232", name: "سه‌فاز بدنه چدن", icon: Flame, color: "from-[#e21f25] to-[#ff4b4b]", shadow: "shadow-[#e21f25]/30" },
    { id: "233", name: "الکتروموتور تک فاز", icon: Wind, color: "from-[#113d64] to-[#1c4793]", shadow: "shadow-[#113d64]/30" },
  ];

  const stats = [
    { icon: Shield, label: "گارانتی شرکتی", value: "۱۸ ماهه", color: "text-[#1c4793]", bg: "bg-[#1c4793]/10" },
    { icon: Truck, label: "ارسال به سراسر کشور", value: "سریع و مطمئن", color: "text-[#32a3db]", bg: "bg-[#32a3db]/10" },
    { icon: Award, label: "تضمین اصالت", value: "کالای اورجینال", color: "text-[#113d64]", bg: "bg-[#113d64]/10" },
    { icon: Star, label: "رضایت خریداران", value: "۹۸.۵٪", color: "text-[#e21f25]", bg: "bg-[#e21f25]/10" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios("https://electroshahresfahan.com/drgearbox/get_products.php");
        setData(res.data.products || []);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = data.filter((item) => item.categoryId === activeTab);
    setFilteredProducts(filtered);
  }, [data, activeTab]);

  const SkeletonCard = () => (
    <div className="bg-[#ffffff] rounded-3xl p-3 border border-[#cccccc]/50 shadow-sm animate-pulse">
      <div className="h-52 bg-[#cccccc]/20 rounded-2xl mb-4 w-full"></div>
      <div className="px-2">
        <div className="h-3 bg-[#cccccc]/30 rounded-full w-1/4 mb-3"></div>
        <div className="h-4 bg-[#cccccc]/40 rounded-full w-3/4 mb-2"></div>
        <div className="h-4 bg-[#cccccc]/30 rounded-full w-1/2 mb-6"></div>
        <div className="flex justify-between items-center mt-4">
          <div className="h-5 bg-[#cccccc]/40 rounded-full w-1/3"></div>
          <div className="h-8 bg-[#cccccc]/20 rounded-xl w-1/3"></div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="w-full py-16 px-4 md:px-8 bg-slate-50 min-h-screen font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#32a3db]/10 blur-[80px] rounded-full pointer-events-none"></div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#113d64] tracking-tight mb-4">
            الکتروموتورهای <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#1c4793] to-[#32a3db]">چینی</span>
          </h2>
          <p className="text-[#113d64]/70 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            مجموعه‌ای بی‌نظیر از موتورهای صنعتی با راندمان بالا، طراحی شده برای سخت‌ترین شرایط کاری همراه با گارانتی معتبر.
          </p>
        </div>

        {/* Premium Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
          {stats.map((s, i) => (
            <div key={i} className="bg-[#ffffff] p-5 rounded-2xl shadow-sm border border-[#cccccc]/30 hover:border-[#32a3db]/50 transition-colors flex flex-col items-center text-center group">
              <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                <s.icon className={`${s.color} w-6 h-6`} strokeWidth={1.5} />
              </div>
              <p className="text-[#113d64] font-bold text-sm md:text-base">{s.value}</p>
              <p className="text-xs text-[#113d64]/60 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Modern Segmented Tabs */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative px-6 py-3.5 rounded-2xl text-sm font-bold flex items-center gap-2.5 transition-all duration-300 overflow-hidden
                  ${active ? `text-[#ffffff] shadow-lg ${tab.shadow} -translate-y-0.5` : "bg-[#ffffff] text-[#113d64] hover:bg-[#cccccc]/10 border border-[#cccccc]/50"}
                `}
              >
                {active && <div className={`absolute inset-0 bg-gradient-to-r ${tab.color} opacity-100`}></div>}
                <Icon className={`w-5 h-5 relative z-10 ${active ? "animate-pulse" : ""}`} strokeWidth={active ? 2 : 1.5} />
                <span className="relative z-10">{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Section Header */}
        <div className="flex items-end justify-between mb-8 px-2">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-[#113d64] flex items-center gap-2">
              {tabs.find((t) => t.id === activeTab)?.name}
            </h3>
            <p className="text-sm text-[#113d64]/60 mt-1">
              نمایش {loading ? "..." : filteredProducts.length} محصول یافت شده
            </p>
          </div>
          <Link to="/products" className="group flex items-center gap-1 text-sm font-medium text-[#1c4793] hover:text-[#e21f25] bg-[#32a3db]/10 hover:bg-[#e21f25]/10 px-4 py-2 rounded-xl transition-colors">
            مشاهده همه
            <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {loading ? (
            Array.from({ length: 8 }).map((_, idx) => <SkeletonCard key={idx} />)
          ) : (
            filteredProducts.map((product) => {
              const hasDiscount = product.before_discount_price && Number(product.before_discount_price) > Number(product.base_price);
              const discountPercent = hasDiscount 
                ? Math.round(((Number(product.before_discount_price) - Number(product.base_price)) / Number(product.before_discount_price)) * 100) 
                : 0;

              return (
                <Link
                  key={product.id}
                  to={`/product/${encodeURIComponent(product.title)}`}
                  className="group bg-[#ffffff] rounded-[24px] p-3 shadow-sm hover:shadow-[0_15px_30px_-10px_rgba(28,71,147,0.15)] border border-[#cccccc]/50 hover:border-[#32a3db] transition-all duration-500 hover:-translate-y-1.5 flex flex-col"
                >
                  {/* Image Box */}
                  <div className="relative h-56 bg-[#ffffff] border border-[#cccccc]/20 rounded-2xl flex items-center justify-center overflow-hidden mb-4 group-hover:border-[#32a3db]/30 transition-colors">
                    
                    <img
                      src={product.image?.[0] || "/placeholder.png"}
                      alt={product.title}
                      className="object-contain w-3/4 h-3/4  transition-transform duration-700 ease-out group-hover:scale-110 mix-blend-multiply"
                    />

                    {/* Badges */}
                    {hasDiscount && (
                      <div className="absolute top-3 right-3 z-20 bg-[#e21f25] text-[#ffffff] text-xs font-bold px-2.5 py-1.5 rounded-xl shadow-sm">
                        {discountPercent}٪ تخفیف
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="px-2 flex flex-col grow">
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="bg-[#cccccc]/20 text-[#113d64] px-2 py-1 rounded-md font-medium">
                        {product.brand || "بدون برند"}
                      </span>
                      <span className={`font-medium flex items-center gap-1 ${product.inventory === "0" ? "text-[#e21f25]" : "text-[#32a3db]"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${product.inventory === "0" ? "bg-[#e21f25]" : "bg-[#32a3db] animate-pulse"}`}></span>
                        {product.inventory === "0" ? "ناموجود" : "موجود در انبار"}
                      </span>
                    </div>

                    <h3 className="text-[#113d64] font-bold text-sm leading-relaxed mb-4 line-clamp-2 min-h-[44px] group-hover:text-[#1c4793] transition-colors">
                      {product.title}
                    </h3>

                    {/* Footer / Price */}
                    <div className="mt-auto flex items-end justify-between pt-4 border-t border-[#cccccc]/40">
                      <div>
                        {hasDiscount && (
                          <div className="text-xs line-through text-[#cccccc] mb-0.5">
                            {Number(product.before_discount_price).toLocaleString("fa-IR")}
                          </div>
                        )}
                        <div className="text-lg font-extrabold text-[#1c4793]">
                          {Number(product.base_price).toLocaleString("fa-IR")} <span className="text-xs font-normal text-[#113d64]/70">تومان</span>
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      <div className="w-10 h-10 rounded-xl bg-[#cccccc]/20 text-[#1c4793] flex items-center justify-center group-hover:bg-[#e21f25] group-hover:text-[#ffffff] transition-all duration-300 shadow-sm">
                        <ArrowLeft className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
};

export default Chini;
