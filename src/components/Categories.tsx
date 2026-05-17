import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, TrendingUp, Shield, Zap, Award } from "lucide-react";
import { useState } from "react";

const Categories = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const categoryData = [
    {
      name: "بک استاپ",
      slug: "/دسته-بندی-محصولات/تجهیزات-انتقال-قدرت/بک-استاپ/301",
      image: "/images/beckstop.png",
      gradient: "from-blue-600 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      border: "border-blue-500",
      icon: Shield,
      badge: "پرفروش",
      products: 128
    },
    {
      name: "کوپلینگ",
      slug: "/دسته-بندی-محصولات/تجهیزات-انتقال-قدرت/کوپلینگ/302",
      image: "/images/Coupling.png",
      gradient: "from-purple-600 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      border: "border-purple-500",
      icon: Zap,
      badge: "جدید",
      products: 96
    },
    {
      name: "هیدروکوپلینگ",
      slug: "/دسته-بندی-محصولات/تجهیزات-انتقال-قدرت/هیدروکوپلینگ/303",
      image: "/images/hydrocoupling.png",
      gradient: "from-emerald-600 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50",
      border: "border-emerald-500",
      icon: TrendingUp,
      badge: "ویژه",
      products: 64
    },
    {
      name: "بیرینگ و اسلیو",
      slug: "/دسته-بندی-محصولات/تجهیزات-انتقال-قدرت/اسلیوبیرینگ/304",
      image: "/images/bearing.png",
      gradient: "from-orange-600 to-amber-500",
      bgGradient: "from-orange-50 to-amber-50",
      border: "border-orange-500",
      icon: Award,
      badge: "اورجینال",
      products: 245
    },
    {
      name: "شیرینک دیسک",
      slug: "/دسته-بندی-محصولات/تجهیزات-انتقال-قدرت/شیرینک-دیسک/305",
      image: "/images/shrink-disk.png",
      gradient: "from-red-600 to-rose-500",
      bgGradient: "from-red-50 to-rose-50",
      border: "border-red-500",
      icon: Sparkles,
      badge: "تکنولوژی",
      products: 42
    },
  ];

  return (
    <section className="w-full py-20 px-4 md:px-8 bg-gradient-to-b from-white to-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        <div className="relative mb-16">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
          
          <div className="relative text-center md:text-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white rounded-full shadow-sm border border-gray-100">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-semibold text-gray-600 tracking-wider">دسته‌بندی ویژه</span>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-4xl md:text-5xl font-black mb-4">
                  <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    قطعات صنعتی
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    دسته‌بندی حرفه‌ای
                  </span>
                </h2>
                <p className="text-gray-500 max-w-2xl leading-relaxed">
                  دسترسی سریع به انواع تجهیزات انتقال قدرت و قطعات یدکی اصل با بهترین کیفیت
                </p>
              </div>
              
              <div className="hidden md:block">
                <div className="h-12 w-0.5 bg-gradient-to-b from-blue-500 to-transparent mx-auto" />
              </div>
            </div>
          </div>
        </div>

        {/* Premium Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
          {categoryData.map((cat, index) => (
            <Link
              key={index}
              to={cat.slug}
              className="group relative block"
            //   onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Animated Card */}
              <div className="relative">
                {/* Glow Effect */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${cat.gradient} rounded-3xl blur-lg opacity-0 group-hover:opacity-70 transition-all duration-500 group-hover:duration-200`} />
                
                {/* Main Card */}
                <div className={`
                  relative bg-white rounded-3xl overflow-hidden
                  transition-all duration-500 ease-out
                  shadow-md hover:shadow-2xl
                  ${hoveredIndex === index ? 'transform -translate-y-3' : ''}
                `}>
                  
                  {/* Background Pattern */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                  
                  {/* Top Accent Line */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${cat.gradient} transform origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-700`} />

                  {/* Content Container */}
                  <div className="relative p-6 text-center">
                    
                    {/* Icon Badge */}
                    <div className="absolute top-3 right-3 z-10">
                      <div className={`px-2 py-1 rounded-lg text-xs font-bold text-white bg-gradient-to-r ${cat.gradient} shadow-lg transform group-hover:scale-105 transition-all duration-300`}>
                        {cat.badge}
                      </div>
                    </div>

                    {/* Image Container */}
                    <div className="relative mb-5 pt-2">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative aspect-square rounded-2xl flex items-center justify-center p-4">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-contain transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                          loading="lazy"
                        />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-black text-gray-800 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 group-hover:bg-clip-text transition-all duration-300">
                      {cat.name}
                    </h3>

                    {/* Product Count */}
                    <div className="flex items-center justify-center gap-1 mb-3">
                      <span className="text-xs text-gray-400">{cat.products} محصول</span>
                    </div>

                    {/* Modern CTA Button */}
                    <div className="relative">
                      <div className={`
                        inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl
                        bg-gray-50 group-hover:bg-gradient-to-r ${cat.gradient}
                        transition-all duration-500 overflow-hidden
                        w-full transform group-hover:scale-105
                      `}>
                        <span className="text-[10px] font-bold text-gray-600 group-hover:text-white transition-colors duration-300 z-10">
                           محصولات مرتبط
                        </span>
                        <ArrowLeft className="w-3.5 h-3.5 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 z-10" />
                        
                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className={`absolute -bottom-16 -right-16 w-32 h-32 bg-gradient-to-br ${cat.gradient} rounded-full opacity-0 group-hover:opacity-10 transition-all duration-700 blur-3xl`} />
                  <div className={`absolute -top-16 -left-16 w-32 h-32 bg-gradient-to-br ${cat.gradient} rounded-full opacity-0 group-hover:opacity-10 transition-all duration-700 blur-3xl`} />
                </div>
              </div>

              {/* Tooltip on Hover */}
              {hoveredIndex === index && (
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1.5 bg-gray-900 rounded-lg shadow-lg whitespace-nowrap z-20 animate-fade-in">
                  <span className="text-xs text-white">مشاهده {cat.name}</span>
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                </div>
              )}
            </Link>
          ))}
        </div>

      
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default Categories;