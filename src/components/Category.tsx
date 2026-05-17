import { Link } from "react-router-dom";
import { ArrowLeft, Zap, Settings, Sparkles, TrendingUp, Shield, Star, Truck } from "lucide-react";
import { useState } from "react";

const Category = () => {
    const [, setHoveredIndex] = useState<number | null>(null);

    const categoryItem = [
        {
            name: "گیربکس صنعتی",
            desc: "انواع موتور گیربکس و گیربکس‌های صنعتی با بالاترین کیفیت",
            image: "https://shahbazmotor.com/wp-content/uploads/2023/07/industrial-gearbox-category-shahbazmotor.com_-150x150.webp",
            gradient: "from-orange-500 to-red-500",
            gradientLight: "from-orange-100 to-red-100",
            icon: Zap,
            badge: "پرفروش‌ترین",
            badgeColor: "from-yellow-500 to-orange-500",
            stats: "+۱۲۳ محصول",
            link: "/گیربکس",
            popular: true,
        },
        {
            name: "الکتروموتور",
            desc: "موتورهای الکتریکی تک‌فاز و سه‌فاز با بالاترین راندمان",
            image: "https://shahbazmotor.com/wp-content/uploads/2023/07/electric-motor-category-shahbazmotor.com_-150x150.webp",
            gradient: "from-blue-500 to-cyan-500",
            gradientLight: "from-blue-100 to-cyan-100",
            icon: TrendingUp,
            badge: "جدیدترین",
            badgeColor: "from-green-500 to-emerald-500",
            stats: "+۸۹ محصول",
            link: "/الکتروموتور",
            popular: false,
        },
        {
            name: "تجهیزات انتقال قدرت",
            desc: "تجهیزات و لوازم انتقال قدرت صنعتی اصل اروپایی",
            image: "https://shahbazmotor.com/wp-content/uploads/2023/07/industrial-accessories-shahbazmotor.com_-150x150.webp",
            gradient: "from-emerald-500 to-teal-500",
            gradientLight: "from-emerald-100 to-teal-100",
            icon: Settings,
            badge: "گارانتی اصل",
            badgeColor: "from-emerald-500 to-teal-500",
            stats: "+۲۵۶ قطعه",
            link: "/تجهیزات-انتقال-قدرت",
            popular: true,
        },
        {
            name: "کالای استوک",
            desc: "گیربکس و موتورهای استوک با کیفیت عالی و قیمت مناسب",
            image: "/stock.png",
            gradient: "from-purple-500 to-pink-500",
            gradientLight: "from-purple-100 to-pink-100",
            icon: Shield,
            badge: "اقتصادی",
            badgeColor: "from-purple-500 to-pink-500",
            stats: "+۴۵ کالا",
            link: "/دسته-بندی-محصولات/استوک",
            popular: false,
        },
    ];

    return (
        <section className="w-full max-w-7xl mx-auto my-12 md:my-16 px-4 sm:px-6 lg:px-8 font-sans" dir="rtl">
            
            {/* Modern Header with Glass Morphism */}
            <div className="relative mb-16 md:mb-24">
                {/* Animated Background Decorations */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-72 md:h-72 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-2xl animate-pulse delay-1000" />
                <div className="absolute bottom-0 left-0 w-32 h-32 md:w-48 md:h-48 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-full blur-2xl animate-pulse delay-700" />
                
                <div className="relative text-center">
                    {/* Floating Badge */}
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 backdrop-blur-sm rounded-full px-4 py-2 mb-6 shadow-sm">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <span className="text-xs md:text-sm font-bold text-blue-600">تخصصی‌ترین دسته‌بندی‌ها</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 tracking-tighter">
                        <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            محصولات {' '}
                        </span>
                        <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent animate-gradient">
                            صنعتی
                        </span>
                    </h2>
                    
                    <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed px-4">
                        با کیفیت‌ترین و مدرن‌ترین تجهیزات صنعتی را در دسته‌بندی‌های تخصصی ما تجربه کنید
                    </p>
                    
                    <div className="flex justify-center gap-2 mt-6 md:mt-8">
                        <div className="w-12 md:w-16 h-1 bg-gradient-to-r from-blue-500 to-transparent rounded-full" />
                        <div className="w-6 md:w-8 h-1 bg-gradient-to-r from-cyan-500 to-transparent rounded-full" />
                    </div>
                </div>
            </div>

            {/* Premium Cards Grid - Responsive 2 columns on mobile */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                {categoryItem.map((item, index) => (
                    <div
                        key={index}
                        className="group relative"
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        {/* Premium Card */}
                        <Link to={item.link} className="block h-full">
                            <div className="relative h-full bg-white rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-700 hover:shadow-2xl border border-gray-100 hover:border-transparent">
                                
                                {/* Animated Background Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradientLight} opacity-0 group-hover:opacity-100 transition-all duration-700`} />
                                
                                {/* Glass Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />

                                {/* Top Accent Bar */}
                                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.gradient} transform origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out`} />

                                {/* Badge */}
                                <div className="absolute top-2 md:top-4 right-2 md:right-4 z-20">
                                    <div className={`px-2 md:px-3 py-0.5 md:py-1 rounded-lg text-[10px] md:text-xs font-bold text-white bg-gradient-to-r ${item.badgeColor} shadow-lg transform group-hover:scale-105 transition-all duration-300`}>
                                        {item.badge}
                                    </div>
                                </div>

                                {/* Popular Tag */}
                                {item.popular && (
                                    <div className="absolute top-2 md:top-4 left-2 md:left-4 z-20">
                                        <div className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-orange-500 px-2 md:px-3 py-0.5 md:py-1 rounded-lg shadow-lg">
                                            <Truck className="w-2 h-2 md:w-3 md:h-3 text-white" />
                                            <span className="text-[8px] md:text-[10px] font-bold text-white">پرفروش</span>
                                        </div>
                                    </div>
                                )}

                                {/* Content */}
                                <div className="relative p-3 md:p-6 pt-8 md:pt-12 text-center">
                                    
                                    {/* Icon with Glow Effect */}
                                    <div className="flex justify-center mb-3 md:mb-6">
                                        <div className="relative">
                                            <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-xl md:rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
                                            <div className={`relative w-12 h-12 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                                                <item.icon className="w-6 h-6 md:w-10 md:h-10 text-white" strokeWidth={1.5} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 3D Image Effect */}
                                    <div className="relative mb-3 md:mb-6 mx-auto w-20 h-20 md:w-36 md:h-36 perspective-500">
                                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="relative w-full h-full object-contain drop-shadow-2xl transform group-hover:scale-110 group-hover:rotate-y-12 transition-all duration-700"
                                            loading="lazy"
                                        />
                                    </div>

                                    {/* Text with Modern Typography */}
                                    <div className="space-y-1 md:space-y-3">
                                        <h3 className="text-sm md:text-2xl font-black text-gray-800 group-hover:text-gray-900 transition-colors line-clamp-1">
                                            {item.name}
                                        </h3>
                                        <p className="hidden md:block text-xs md:text-sm h-8 md:h-10 text-gray-500 leading-relaxed line-clamp-2">
                                            {item.desc}
                                        </p>
                                        
                                        {/* Stats */}
                                        <div className="pt-1 md:pt-2">
                                            <span className="inline-flex items-center gap-1 text-[10px] md:text-xs font-semibold text-gray-400">
                                                <Star className="w-2 h-2 md:w-3 md:h-3 fill-current text-yellow-400" />
                                                {item.stats}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Modern CTA Button */}
                                    <div className="mt-3 md:mt-8">
                                        <div className="relative inline-flex items-center justify-between w-full gap-2 md:gap-3 px-3 md:px-5 py-2 md:py-3 rounded-lg md:rounded-xl bg-gray-50 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-500 transition-all duration-500 overflow-hidden">
                                            <span className="text-[10px] md:text-sm font-bold text-gray-700 group-hover:text-white transition-colors duration-300 z-10">
                                                مشاهده محصولات
                                            </span>
                                            <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 z-10" />
                                            
                                            {/* Button Shine Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                        </div>
                                    </div>
                                </div>

                                {/* Decorative Elements */}
                                <div className={`absolute -bottom-16 -right-16 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br ${item.gradient} rounded-full opacity-0 group-hover:opacity-20 transition-all duration-700 blur-3xl`} />
                                <div className={`absolute -top-16 -left-16 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br ${item.gradient} rounded-full opacity-0 group-hover:opacity-10 transition-all duration-700 blur-3xl`} />
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Floating CTA Bar */}
            <div className="mt-12 md:mt-16 text-center">
                <div className="inline-block group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-all duration-500" />
                    <Link 
                        to="/products"
                        className="relative inline-flex items-center gap-2 md:gap-3 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-blue-600 hover:to-cyan-500 text-white px-6 md:px-10 py-3 md:py-4 rounded-full font-bold text-sm md:text-base transition-all duration-500 shadow-xl hover:shadow-2xl group"
                    >
                        <span>مشاهده همه دسته‌بندی‌ها</span>
                        <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                </div>
            </div>

            {/* Add custom CSS for animations */}
            <style>{`
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                .animate-gradient {
                    background-size: 200% auto;
                    animation: gradient 3s linear infinite;
                }
                .perspective-500 {
                    perspective: 500px;
                }
                .line-clamp-1 {
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                /* Mobile optimizations */
                @media (max-width: 640px) {
                    .grid {
                        gap: 0.75rem;
                    }
                }
            `}</style>
        </section>
    );
};

export default Category;