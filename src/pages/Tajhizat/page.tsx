import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { IProduct } from "../Gearbox/Gearbox";
import { 
  Zap, 
  Shield, 
  Truck, 
  Star, 
  Award,
  Headphones,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Flame,
  ShoppingBag,
  CheckCircle
} from "lucide-react";

const Tajhizat = () => {
  
  const [data, setData] = useState<IProduct[]>([]);
  const [,setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeCatIndex, setActiveCatIndex] = useState(2);

  const categoryData = [
    {
      id: 301,
      name: "Backstop",
      image: "/images/beckstop.png",
      bgGradient: "from-[#1c4793] to-[#32a3db]",
      badge: "Best Seller",
      badgeColor: "from-[#e21f25] to-[#ff4757]",
      products: 128,
      spinColor: "conic-gradient(from 0deg, transparent 70%, #1c4793 100%)",
      description: "Ultimate equipment protection against overloads",
      link:"/دسته-بندی-محصولات/تجهیزات-انتقال-قدرت/بک-استاپ/301",
      icon: Shield,
    },
    {
      id: 302,
      name: "Coupling",
      image: "/images/Coupling.png",
      bgGradient: "from-[#113d64] to-[#32a3db]",
      badge: "New Arrival",
      badgeColor: "from-[#32a3db] to-[#5cbcf0]",
      products: 96,
      spinColor: "conic-gradient(from 0deg, transparent 70%, #113d64 100%)",
      description: "Precise mechanical connection without backlash",
      link:"/دسته-بندی-محصولات/تجهیزات-انتقال-قدرت/کوپلینگ/302",
      icon: Zap,
    },
    {
      id: 303,
      name: "Hydro Coupling",
      image: "/images/hydrocoupling.png",
      bgGradient: "from-[#1c4793] to-[#113d64]",
      badge: "Premium",
      badgeColor: "from-[#e21f25] to-[#ff6b6b]",
      products: 64,
      spinColor: "conic-gradient(from 0deg, transparent 70%, #1c4793 100%)",
      description: "Fluid power transmission & heavy shock reduction",
      link:"/دسته-بندی-محصولات/تجهیزات-انتقال-قدرت/هیدروکوپلینگ/303",
      icon: Flame,
    },
    {
      id: 304,
      name: "Slew Bearing",
      image: "/images/bearing.png",
      bgGradient: "from-[#32a3db] to-[#1c4793]",
      badge: "Original",
      badgeColor: "from-[#113d64] to-[#1c4793]",
      products: 245,
      spinColor: "conic-gradient(from 0deg, transparent 70%, #32a3db 100%)",
      description: "High endurance industrial sleeve bearings",
      link:"/دسته-بندی-محصولات/تجهیزات-انتقال-قدرت/اسلیوبیرینگ/304",
      icon: Award,
    },
    {
      id: 305,
      name: "Shrink Disk",
      image: "/images/shrink-disk.png",
      bgGradient: "from-[#e21f25] to-[#1c4793]",
      badge: "High-Tech",
      badgeColor: "from-[#32a3db] to-[#5cbcf0]",
      products: 42,
      spinColor: "conic-gradient(from 0deg, transparent 70%, #e21f25 100%)",
      description: "Advanced technology for keyless connection",
      link:"/دسته-بندی-محصولات/تجهیزات-انتقال-قدرت/شیرینک-دیسک/305",
      icon: Sparkles,
    },
  ];

  const features = [
    { icon: Truck, title: "ارسال سریع", desc: "تحویل اکسپرس در کمترین زمان", color: "#1c4793" },
    { icon: Shield, title: "ضمانت اصالت", desc: "ضمانت 100٪ اصالت کالا", color: "#32a3db" },
    { icon: RefreshCw, title: "بازگشت کالا", desc: "ضمانت 7 روزه بازگشت", color: "#e21f25" },
    { icon: Headphones, title: "پشتیبانی 24/7", desc: "مشاوره و پشتیبانی شبانه روزی", color: "#113d64" },
  ];

  const testimonials = [
    { name: "علی رضایی", text: "کیفیت محصولات عالی بود، حتما باز هم خرید می‌کنم", rating: 5, role: "مدیر تولید" },
    { name: "سارا محمدی", text: "ارسال بسیار سریع و بسته‌بندی مناسب", rating: 5, role: "مهندس صنایع" },
    { name: "رضا کریمی", text: "مشاوره خوب و محصولات با کیفیت", rating: 4, role: "تکنسین" },
  ];

  useEffect(() => {
    axios("https://electroshahresfahan.com/drgearbox/get_products.php")
      .then((res) => {
        setData(res.data.products);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);
  
  // window.scrollTo({top:0,behavior:"smooth"})

  const filteredProduct = data.filter((item) => 
    (selectedCategory === "all" || item.categoryId === selectedCategory) &&
    (item.categoryId === "301" || item.categoryId === "302" || item.categoryId === "303")
  );

  const bannerSlides = [
    { title: "تجهیزات صنعتی اصل", subtitle: "با بهترین کیفیت و ضمانت", bg: "from-[#1c4793] to-[#113d64]" },
    { title: "تخفیف ویژه", subtitle: "تا ۴۰٪ تخفیف برای محصولات منتخب", bg: "from-[#e21f25] to-[#ff4757]" },
    { title: "ارسال رایگان", subtitle: "برای خرید بالای ۵ میلیون تومان", bg: "from-[#32a3db] to-[#1c4793]" },
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);

  const nextCatSlide = () => setActiveCatIndex((prev) => (prev + 1) % categoryData.length);
  const prevCatSlide = () => setActiveCatIndex((prev) => (prev - 1 + categoryData.length) % categoryData.length);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white" dir="rtl">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        
        .font-cinzel { font-family: 'Cinzel', serif; }
        .font-playfair { font-family: 'Playfair Display', serif; }

        @keyframes spin-border {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-spin-slow { animation: spin-border 3s linear infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .shimmer-effect { position: relative; overflow: hidden; }
        .shimmer-effect::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: shimmer 2s infinite;
        }
      `}</style>

      {/* Hero Section with Slider */}
      <div className="relative overflow-hidden rounded-b-3xl shadow-xl">
      
        
        <button onClick={prevSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full z-10 transition-all hover:scale-110">
          <ChevronRight size={24} className="text-white" />
        </button>
        <button onClick={nextSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full z-10 transition-all hover:scale-110">
          <ChevronLeft size={24} className="text-white" />
        </button>
      </div>

      <div className="mt-4 z-10 relative">
        {/* Main Title */}
        <div className="text-center  relative z-20">
          <div className="inline-block bg-white rounded-2xl p-[2px] shadow-2xl">
            <div className="rounded-2xl px-8 py-6 bg-white">
              <h1 className="text-4xl md:text-5xl font-black text-[#113d64]">تجهیزات انتقال قدرت</h1>
              <h2 className="text-lg md:text-xl text-[#32a3db] font-medium mt-1 font-cinzel">Power Transmission Equipment</h2>
            </div>
          </div>
        </div>

        {/* 3D Category Spherical Slider */}
        <div className="w-full max-w-6xl mx-auto my-20 relative px-4" dir="ltr">
          <div className="relative h-[450px] w-full flex justify-center items-center perspective-[1200px] overflow-hidden">
            
            {/* دکمه‌های کنترل اسلایدر دسته‌بندی */}
            <button onClick={prevCatSlide} className="absolute left-4 z-50 bg-white hover:bg-[#1c4793] text-[#1c4793] hover:text-white p-3 rounded-full shadow-lg transition-all hover:scale-110">
              <ChevronLeft size={28} />
            </button>
            <button onClick={nextCatSlide} className="absolute right-4 z-50 bg-white hover:bg-[#1c4793] text-[#1c4793] hover:text-white p-3 rounded-full shadow-lg transition-all hover:scale-110">
              <ChevronRight size={28} />
            </button>

            {categoryData.map((item, index) => {
              let offset = index - activeCatIndex;
              if (offset < -2) offset += categoryData.length;
              if (offset > 2) offset -= categoryData.length;

              const absOffset = Math.abs(offset);
              const isActive = offset === 0;
              const isVisible = absOffset <= 2;

              const translateX = offset * 220;
              const translateZ = isActive ? 100 : -absOffset * 150;
              const rotateY = -offset * 25;
              const opacity = isVisible ? (1 - absOffset * 0.3) : 0;
              const zIndex = 50 - absOffset;

              return (
                <Link
                  to={`${item.link}`}
                  key={item.id}
                  onClick={() => {
                    setActiveCatIndex(index);
                    setSelectedCategory(item.id.toString());
                  }}
                  className={`absolute w-72 transition-all duration-700 ease-out cursor-pointer group ${!isVisible && 'pointer-events-none'}`}
                  style={{
                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg)`,
                    opacity: opacity,
                    zIndex: zIndex,
                  }}
                >
                  <div className={`relative flex flex-col justify-center items-center text-center bg-white rounded-3xl p-[3px] shadow-2xl overflow-hidden transition-all duration-500 ${isActive ? 'ring-4 ring-[#32a3db]/50 shadow-2xl' : ''}`}>
                    <div className="absolute inset-[-100%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-spin-slow" style={{ background: item.spinColor }}></div>
                    
                    <div className="relative z-10 w-full h-full bg-white rounded-[22px] overflow-hidden">
                      <div className={`w-full h-48 flex justify-center items-center bg-gradient-to-br ${item.bgGradient} relative overflow-hidden`}>
                        <item.icon className="absolute top-3 left-3 text-white/20" size={60} />
                        <img src={item.image} alt={item.name} className="w-36 h-auto drop-shadow-2xl group-hover:scale-110 transition-transform duration-700" />
                        {isActive && (
                          <div className="absolute inset-0 shimmer-effect pointer-events-none"></div>
                        )}
                      </div>

                      <div className="p-6">
                        <h3 className="text-2xl cursive  font-bold text-[#113d64] mb-2 tracking-wider">
                          {item.name}
                        </h3>
                        {/* <p className="text-sm text-gray-500">{item.description}</p> */}
                        <div className="flex items-center justify-between mt-4">
                        
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Products Section Header */}
      <div className="mt-10 mb-10">
        <div className="flex items-center justify-between w-[90%] mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-1 h-12 bg-gradient-to-b from-[#1c4793] to-[#32a3db] rounded-full"></div>
            <div>
              <h2 className="text-3xl font-bold text-[#113d64]">محصولات تجهیزات انتقال قدرت</h2>
              <p className="text-gray-500 text-sm mt-1">{filteredProduct.length} محصول فعال • {filteredProduct.filter(p => Number(p.inventory) > 0).length} کالای موجود</p>
            </div>
          </div>
          <ShoppingBag className="text-[#32a3db]" size={32} />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-[90%] mx-auto">
        {filteredProduct.slice(0, 10).map((item) => {
          const productLink = `/product/${item.title}`;
          const isInStock = Number(item.inventory) > 0;
          const discount = Number(item.before_discount_price) > Number(item.base_price) 
            ? Math.round(((Number(item.before_discount_price) - Number(item.base_price)) / Number(item.before_discount_price)) * 100) : 0;
          
          return (
            <Link to={productLink} key={item.id} className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1">
              <div className="relative h-56 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                <img src={item.image?.[0] || "/api/placeholder/200/200"} alt={item.title} className="h-44 object-contain group-hover:scale-110 transition-transform duration-500" />
                {discount > 0 && ( 
                  <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full bg-gradient-to-r from-[#e21f25] to-[#ff4757] text-white font-bold shadow-lg">{discount}% تخفیف</span> 
                )}
                <span className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full text-white font-bold shadow-lg ${ isInStock ? "bg-gradient-to-r from-[#32a3db] to-[#5cbcf0]" : "bg-gradient-to-r from-[#e21f25] to-[#ff4757]" }`}>
                  {isInStock ? "موجود" : "ناموجود"}
                </span>
              </div>
              <div className="p-4 flex flex-col gap-2">
                <h3 className="text-sm font-bold text-gray-800 line-clamp-2 h-10">{item.title}</h3>
                {item.brand && ( <p className="text-xs text-gray-500">برند: <span className="text-[#1c4793] font-semibold">{item.brand}</span></p> )}
                <div className="flex flex-col mt-2">
                  {discount > 0 && ( <span className="text-xs text-gray-400 line-through">{Number(item.before_discount_price).toLocaleString()} تومان</span> )}
                  <span className="text-xl font-bold text-[#1c4793]">{Number(item.base_price || item.base_price).toLocaleString()} تومان</span>
                </div>
                <button className="mt-3 w-full bg-gradient-to-r from-[#1c4793] to-[#113d64] text-white text-sm py-2.5 rounded-xl hover:from-[#113d64] hover:to-[#1c4793] transition-all duration-300 font-bold shadow-md">
                  مشاهده محصول
                </button>
              </div>
            </Link>
          );
        })}
      </div>

      {/* View More Button */}
      {filteredProduct.length > 10 && (
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-gradient-to-r from-[#1c4793] to-[#113d64] text-white rounded-xl font-bold hover:shadow-xl transition-all hover:scale-105">
            مشاهده همه {filteredProduct.length} محصول
          </button>
        </div>
      )}

      {/* Features Section */}
      <div className="max-w-[90%] mx-auto relative z-10 my-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-md" style={{ backgroundColor: feature.color + '15' }}>
                <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="mt-10 bg-gradient-to-r from-[#1c4793]/5 to-[#32a3db]/5 py-16">
        <div className="max-w-[90%] mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#113d64] mb-12">نظرات مشتریان</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                <div>
                  <p className="font-bold text-[#1c4793]">{testimonial.name}</p>
                  <p className="text-xs text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-[#1c4793] to-[#113d64] py-12 mt-10">
        <div className="max-w-[90%] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-white">۵۰۰+</div>
            <div className="text-sm text-[#32a3db]">محصول فعال</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">۱۰۰۰+</div>
            <div className="text-sm text-[#32a3db]">مشتری راضی</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">۲۴</div>
            <div className="text-sm text-[#32a3db]">ساعت پشتیبانی</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">۷ روز</div>
            <div className="text-sm text-[#32a3db]">ضمانت بازگشت</div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="max-w-[90%] mx-auto my-16">
        <div className="bg-gradient-to-r from-[#113d64] to-[#1c4793] rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }}></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white mb-3">عضویت در خبرنامه</h3>
            <p className="text-[#32a3db] mb-6">از تخفیف‌ها و محصولات جدید با خبر شوید</p>
            <div className="flex max-w-md mx-auto gap-3">
              <input type="email" placeholder="ایمیل خود را وارد کنید" className="flex-1 px-6 py-3 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#32a3db]" />
              <button className="px-8 py-3 bg-[#e21f25] text-white rounded-xl font-bold hover:bg-[#ff4757] transition-all hover:scale-105 shadow-lg">
                عضویت
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tajhizat;

























































// import axios from "axios";
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import type { IProduct } from "../Gearbox/Gearbox";
// import { 
//   Package, 
//   TrendingUp, 
//   Zap, 
//   Shield, 
//   Truck, 
//   Star, 
//   ArrowLeft,
//   Grid,
//   List,
//   Filter,
//   Move,
//   RotateCw
// } from "lucide-react";

// const Tajhizat = () => {

//   const slugify = (text:any) => {
//     return text
//       .toString()
//       .trim()
//       .replace(/\s+/g, "-")
//       .replace(/[ـ]/g, "")
//       .replace(/[^\u0600-\u06FFa-zA-Z0-9-]/g, "")
//       .replace(/-+/g, "-");
//   };
  
//   const [data, setData] = useState<IProduct[]>([]);
//   const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
//   const [hoveredCard, setHoveredCard] = useState<number | null>(null);
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

//   // Tracking mouse for parallax effect
//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       setMousePosition({ x: e.clientX, y: e.clientY });
//     };
//     window.addEventListener('mousemove', handleMouseMove);
//     return () => window.removeEventListener('mousemove', handleMouseMove);
//   }, []);

//   const categoryData = [
//     {
//       id: 301,
//       name: "بک استاپ",
//       image: "/images/beckstop.png",
//       bgGradient: "from-blue-700 via-blue-600 to-cyan-500",
//       badge: "پرفروش",
//       badgeColor: "bg-gradient-to-r from-yellow-500 to-orange-500",
//       products: 128,
//       spinColor: "conic-gradient(from 0deg, transparent 70%, #2563eb 100%)",
//       description: "محافظت از تجهیزات در برابر بارهای اضافی",
//     },
//     {
//       id: 302,
//       name: "کوپلینگ",
//       image: "/images/Coupling.png",
//       bgGradient: "from-fuchsia-600 via-purple-600 to-pink-500",
//       badge: "جدید",
//       badgeColor: "bg-gradient-to-r from-green-500 to-emerald-500",
//       products: 96,
//       spinColor: "conic-gradient(from 0deg, transparent 70%, #c026d3 100%)",
//       description: "اتصال دقیق و بدون لقی محورها",
//     },
//     {
//       id: 303,
//       name: "هیدروکوپلینگ",
//       image: "/images/hydrocoupling.png",
//       bgGradient: "from-emerald-600 via-teal-500 to-cyan-400",
//       badge: "ویژه",
//       badgeColor: "bg-gradient-to-r from-purple-500 to-pink-500",
//       products: 64,
//       spinColor: "conic-gradient(from 0deg, transparent 70%, #059669 100%)",
//       description: "انتقال قدرت با سیال و کاهش شوک",
//     },
//     {
//       id: 304,
//       name: "اسلیو بیرینگ",
//       image: "/images/bearing.png",
//       bgGradient: "from-amber-600 via-orange-500 to-yellow-400",
//       badge: "اورجینال",
//       badgeColor: "bg-gradient-to-r from-blue-500 to-indigo-500",
//       products: 245,
//       spinColor: "conic-gradient(from 0deg, transparent 70%, #d97706 100%)",
//       description: "بلبرینگ‌های صنعتی با کیفیت بالا",
//     },
//     {
//       id: 305,
//       name: "شیرینک دیسک",
//       image: "/images/shrink-disk.png",
//       bgGradient: "from-rose-600 via-red-600 to-orange-500",
//       badge: "تکنولوژی",
//       badgeColor: "bg-gradient-to-r from-cyan-500 to-blue-500",
//       products: 42,
//       spinColor: "conic-gradient(from 0deg, transparent 70%, #e11d48 100%)",
//       description: "اتصال دقیق با تکنولوژی پیشرفته",
//     },
//   ];

//   useEffect(() => {
//     axios("https://electroshahresfahan.com/drgearbox/get_products.php")
//       .then((res) => {
//         setData(res.data.products);
//       })
//       .catch((err) => {
//         console.error("Error fetching products:", err);
//       });
//   }, []);

//   const filteredProduct = data.filter((item) => 
//     item.categoryId === "301" || item.categoryId === "302" || item.categoryId === "303"
//   );

//   // Parallax effect values
//   const offsetX = (mousePosition.x / window.innerWidth - 0.5) * 20;
//   const offsetY = (mousePosition.y / window.innerHeight - 0.5) * 20;

//   return (
//     <div className="min-h-screen bg-[#0a0a1a] relative overflow-hidden" dir="rtl">
      
//       {/* String Theory Background - کش اومدن فضا و زمان */}
//       <div className="fixed inset-0 w-full h-full">
        
//         {/* لایه اصلی شطرنجی با انحنای فضا-زمان */}
//         <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#12122a] to-[#1a1a3a]"></div>
        
//         {/* Grid با انحنا و کشیدگی متناسب با موس */}
//         <div 
//           className="absolute inset-0 opacity-30 transition-transform duration-300 ease-out"
//           style={{
//             transform: `perspective(1000px) rotateX(${offsetY * 0.5}deg) rotateY(${offsetX * 0.5}deg) translateZ(${Math.abs(offsetX + offsetY) * 2}px)`,
//           }}
//         >
//           <div className="absolute inset-0" style={{
//             backgroundImage: `
//               linear-gradient(45deg, #00d4ff 2px, transparent 2px),
//               linear-gradient(-45deg, #00d4ff 2px, transparent 2px),
//               radial-gradient(circle at 20% 50%, rgba(0, 212, 255, 0.1) 0%, transparent 50%)
//             `,
//             backgroundSize: '80px 80px, 80px 80px, 100% 100%',
//             backgroundPosition: 'center center',
//           }}></div>
//         </div>

//         {/* لایه دوم شطرنجی با انحنای معکوس */}
//         <div 
//           className="absolute inset-0 opacity-20 transition-transform duration-500 ease-out"
//           style={{
//             transform: `perspective(800px) rotateX(${-offsetY * 0.3}deg) rotateY(${-offsetX * 0.3}deg) scale(1.1)`,
//           }}
//         >
//           <div className="absolute inset-0" style={{
//             backgroundImage: `
//               linear-gradient(90deg, #ff00ff 1px, transparent 1px),
//               linear-gradient(0deg, #ff00ff 1px, transparent 1px),
//               repeating-linear-gradient(45deg, rgba(255, 0, 255, 0.05) 0px, rgba(255, 0, 255, 0.05) 20px, transparent 20px, transparent 40px)
//             `,
//             backgroundSize: '50px 50px, 50px 50px, 100% 100%',
//           }}></div>
//         </div>

//         {/* لایه سوم - نقاط در حال کشیده شدن */}
//         <div 
//           className="absolute inset-0 opacity-40"
//           style={{
//             transform: `translate(${offsetX * 2}px, ${offsetY * 2}px) scale(${1 + Math.abs(offsetX + offsetY) * 0.01})`,
//           }}
//         >
//           <div className="absolute inset-0" style={{
//             backgroundImage: 'radial-gradient(circle at 3px 3px, #ffffff 2px, transparent 2px)',
//             backgroundSize: '60px 60px',
//           }}></div>
//         </div>

//         {/* لایه چهارم - امواج فضا-زمان */}
//         <div 
//           className="absolute inset-0 opacity-20 transition-all duration-300"
//           style={{
//             transform: `translate(${offsetX * -1}px, ${offsetY * -1}px) rotate(${offsetX + offsetY}deg)`,
//           }}
//         >
//           <svg className="absolute inset-0 w-full h-full">
//             <defs>
//               <pattern id="waves" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
//                 <path d="M0,50 Q25,30 50,50 T100,50" fill="none" stroke="#00d4ff" strokeWidth="0.5" opacity="0.3"/>
//                 <path d="M0,70 Q25,50 50,70 T100,70" fill="none" stroke="#ff00ff" strokeWidth="0.5" opacity="0.3"/>
//               </pattern>
//             </defs>
//             <rect width="100%" height="100%" fill="url(#waves)" />
//           </svg>
//         </div>

//         {/* سیاهچاله‌های کوچک */}
//         <div 
//           className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-blue-600/10 to-purple-600/10 blur-3xl"
//           style={{
//             left: `${50 + offsetX * 0.5}%`,
//             top: `${50 + offsetY * 0.5}%`,
//             transform: `scale(${1 + Math.abs(offsetX + offsetY) * 0.02})`,
//           }}
//         ></div>

//         {/* گرادینت‌های نورانی در حال چرخش */}
//         <div 
//           className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-spin-slow"
//           style={{
//             transform: `translate(${offsetX * 0.5}px, ${offsetY * 0.5}px)`,
//           }}
//         ></div>
//         <div 
//           className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-spin-reverse"
//           style={{
//             transform: `translate(${-offsetX * 0.5}px, ${-offsetY * 0.5}px)`,
//           }}
//         ></div>

//         {/* ذرات در حال تغییر فضا */}
//         {[...Array(100)].map((_, i) => (
//           <div
//             key={i}
//             className="absolute w-1 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-twinkle"
//             style={{
//               top: `${Math.random() * 100}%`,
//               left: `${Math.random() * 100}%`,
//               animationDelay: `${Math.random() * 5}s`,
//               animationDuration: `${3 + Math.random() * 5}s`,
//               opacity: 0.1 + Math.random() * 0.5,
//               transform: `translate(${offsetX * (Math.random() - 0.5)}px, ${offsetY * (Math.random() - 0.5)}px)`,
//             }}
//           ></div>
//         ))}
//       </div>

//       {/* متن توضیحی کش آمدگی فضا-زمان */}
//       <div className="fixed bottom-4 left-4 z-20 bg-black/50 backdrop-blur-sm rounded-xl px-3 py-1.5 text-xs text-gray-400">
//         <div className="flex items-center gap-2">
//           <Move size={12} className="text-cyan-400 animate-pulse" />
//           <span>حرکت ماوس برای مشاهده کش آمدگی فضا-زمان</span>
//           <RotateCw size={12} className="text-purple-400 animate-spin-slow" />
//         </div>
//       </div>

//       <div className="relative z-10 p-6">
        
//         {/* Hero Section with Parallax */}
//         <div 
//           className="text-center mb-16 transition-transform duration-300"
//           style={{
//             transform: `translate(${offsetX * 0.3}px, ${offsetY * 0.3}px)`,
//           }}
//         >
//           <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-[2px] shadow-2xl">
//             <div className="bg-[#0a0a1a]/80 backdrop-blur-sm rounded-2xl px-8 py-6">
//               <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
//                 تجهیزات انتقال قدرت
//               </h1>
//             </div>
//           </div>
//           <p className="text-gray-300 mt-4 text-lg max-w-2xl mx-auto">
//             ارائه‌دهنده بهترین و باکیفیت‌ترین تجهیزات صنعتی با گارانتی اصالت و سلامت فیزیکی
//           </p>
          
//           <div className="flex justify-center gap-6 mt-8 flex-wrap">
//             <div className="flex items-center gap-2 text-gray-300">
//               <Truck className="w-5 h-5 text-blue-400" />
//               <span className="text-sm">ارسال سریع</span>
//             </div>
//             <div className="flex items-center gap-2 text-gray-300">
//               <Shield className="w-5 h-5 text-green-400" />
//               <span className="text-sm">ضمانت اصالت</span>
//             </div>
//             <div className="flex items-center gap-2 text-gray-300">
//               <Zap className="w-5 h-5 text-yellow-400" />
//               <span className="text-sm">کیفیت بالا</span>
//             </div>
//             <div className="flex items-center gap-2 text-gray-300">
//               <Star className="w-5 h-5 text-purple-400" />
//               <span className="text-sm">رضایت مشتریان</span>
//             </div>
//           </div>
//         </div>

//         {/* View Toggle */}
//         <div className="flex justify-end mb-6 w-[95%] mx-auto">
//           <div className="bg-[#0f0f1f]/50 backdrop-blur-sm rounded-xl p-1 flex gap-1">
//             <button
//               onClick={() => setViewMode("grid")}
//               className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}
//             >
//               <Grid size={18} />
//             </button>
//             <button
//               onClick={() => setViewMode("list")}
//               className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}
//             >
//               <List size={18} />
//             </button>
//           </div>
//         </div>

//         {/* Categories Section with Space-time Warp */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 w-[95%] mx-auto mb-20">
//           {categoryData.map((item, index) => {
//             const itemLink = `/دسته-بندی-محصولات/تجهیزات-انتقال-قدرت/${slugify(item.name)}/${item.id}/`;
            
//             return (
//               <Link
//                 to={itemLink}
//                 key={index}
//                 className="group relative flex flex-col justify-center items-center text-center bg-gradient-to-br from-[#0f0f1f] to-[#1a1a2e] rounded-2xl p-[2px] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-700/50"
//               >
//                 <div
//                   className="absolute inset-[-100%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-spin-slow"
//                   style={{ background: item.spinColor }}
//                 ></div>

//                 <div className="relative z-10 w-full h-full bg-gradient-to-br from-[#0f0f1f] to-[#1a1a2e] rounded-[14px] overflow-hidden">
//                   <div className={`w-full h-44 flex justify-center items-center bg-gradient-to-br ${item.bgGradient} relative overflow-hidden`}>
//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       className="w-32 h-auto drop-shadow-2xl group-hover:scale-110 transition-transform duration-500 filter brightness-110"
//                     />
//                     <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all"></div>
//                   </div>

//                   <div className="p-5">
//                     <p className="text-xl font-bold text-white mb-1">
//                       {item.name}
//                     </p>
//                     <p className="text-xs text-gray-400 mb-2">
//                       {item.description}
//                     </p>
//                     <p className="text-sm text-gray-400 mb-3">
//                       <Package className="inline w-4 h-4 ml-1" />
//                       {item.products} محصول موجود
//                     </p>
//                     <span className={`text-[10px] font-bold px-3 py-1 rounded-full text-white ${item.badgeColor} shadow-sm`}>
//                       {item.badge}
//                     </span>
//                   </div>
//                 </div>
//               </Link>
//             );
//           })}
//         </div>

//         {/* Products Section */}
//         <div className="mt-20 mb-10">
//           <div className="flex items-center justify-between w-[95%] mx-auto">
//             <div className="flex items-center gap-3">
//               <div className="w-1 h-12 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
//               <div>
//                 <h2 className="text-3xl font-bold text-white">
//                   محصولات تجهیزات انتقال قدرت
//                 </h2>
//                 <p className="text-gray-400 text-sm mt-1">
//                   {filteredProduct.length} محصول فعال
//                 </p>
//               </div>
//             </div>
//             <div className="text-gray-400 text-sm">
//               {filteredProduct.filter(p => Number(p.inventory) > 0).length} کالای موجود
//             </div>
//           </div>
//         </div>

//         {/* Products Grid/List */}
//         <div className={viewMode === "grid" 
//           ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-[95%] mx-auto"
//           : "space-y-4 w-[95%] mx-auto"
//         }>
//           {filteredProduct.map((item, idx) => {
//             const productLink = `/product/${item.title}`;
//             const isInStock = Number(item.inventory) > 0;
            
//             return (
//               <Link
//                 to={productLink}
//                 key={item.id}
//                 className="group bg-gradient-to-br from-[#0f0f1f] to-[#1a1a2e] rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-700/50 hover:border-blue-500/50 hover:-translate-y-1"
//                 onMouseEnter={() => setHoveredCard(idx)}
//                 onMouseLeave={() => setHoveredCard(null)}
//               >
//                 <div className="relative h-56 flex items-center justify-center bg-gradient-to-br from-gray-800/50 to-gray-900/50 overflow-hidden">
//                   <img
//                     src={item.image[0]}
//                     alt={item.title}
//                     className={`h-44 object-contain transition-all duration-500 ${
//                       hoveredCard === idx ? "scale-110 rotate-3" : "scale-100"
//                     }`}
//                   />
                  
//                   <span className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full text-white font-bold shadow-lg ${
//                     isInStock 
//                       ? "bg-gradient-to-r from-green-500 to-emerald-500" 
//                       : "bg-gradient-to-r from-red-500 to-orange-500"
//                   }`}>
//                     {isInStock ? "موجود" : "ناموجود"}
//                   </span>

//                   {Number(item.before_discount_price) > Number(item.base_price) && (
//                     <span className="absolute top-3 left-3 text-xs px-3 py-1 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold shadow-lg">
//                       {Math.round(((Number(item.before_discount_price) - Number(item.base_price)) / Number(item.before_discount_price)) * 100)}% تخفیف
//                     </span>
//                   )}
//                 </div>

//                 <div className="p-5 flex flex-col gap-2">
//                   <h3 className="text-sm font-bold text-white line-clamp-2 h-10">
//                     {item.title}
//                   </h3>
                  
//                   {item.brand && (
//                     <p className="text-xs text-gray-400">
//                       برند: <span className="text-blue-400">{item.brand}</span>
//                     </p>
//                   )}

//                   <div className="flex flex-col mt-2">
//                     {Number(item.before_discount_price) > Number(item.base_price) && (
//                       <span className="text-xs text-gray-500 line-through">
//                         {Number(item.before_discount_price).toLocaleString()} تومان
//                       </span>
//                     )}
//                     <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
//                       {Number(item.base_price || item.base_price).toLocaleString()} تومان
//                     </span>
//                   </div>

//                   <button className="mt-3 w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm py-2.5 rounded-xl hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 font-bold shadow-lg">
//                     مشاهده و خرید
//                   </button>
//                 </div>
//               </Link>
//             );
//           })}
//         </div>

//         {filteredProduct.length === 0 && (
//           <div className="text-center py-20">
//             <Package className="w-20 h-20 mx-auto text-gray-600 mb-4" />
//             <p className="text-gray-400 text-lg">محصولی یافت نشد</p>
//           </div>
//         )}
//       </div>

//       {/* Animation Styles */}
//       <style>{`
//         @keyframes spin-border {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
        
//         @keyframes spin-reverse {
//           from { transform: rotate(360deg); }
//           to { transform: rotate(0deg); }
//         }
        
//         @keyframes twinkle {
//           0%, 100% { opacity: 0.1; transform: scale(1); }
//           50% { opacity: 0.8; transform: scale(1.5); }
//         }
        
//         .animate-spin-slow {
//           animation: spin-border 8s linear infinite;
//         }
        
//         .animate-spin-reverse {
//           animation: spin-reverse 12s linear infinite;
//         }
        
//         .animate-twinkle {
//           animation: twinkle random infinite;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Tajhizat;
