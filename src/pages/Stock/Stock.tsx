import { useState } from "react";
import { Package, Truck, CheckCircle, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Stock = () => {
  const [, setHoveredIndex] = useState<number | null>(null);

  const categories = [
    {
      name: "گیربکس استوک",
      image: "https://drgearbox.com/wp-content/uploads/2025/12/Two-axis-spur-gearbox-02.jpg",
      link: "/دسته-بندی-محصولات/محصولات-استوک/گیربکس/401",
    },
    {
      name: "موتور استوک",
      image: "https://drgearbox.com/wp-content/uploads/2025/12/Two-axis-spur-gearbox-02.jpg",
      link: "/دسته-بندی-محصولات/محصولات-استوک/موتور/402",
    },
    {
      name: "الکتروگیربکس استوک",
      image: "https://drgearbox.com/wp-content/uploads/2025/12/Two-axis-spur-gearbox-02.jpg",
      link: "/دسته-بندی-محصولات/محصولات-استوک/الکتروگیربکس/403",
    },
  ];

  return (
    <div className="w-full bg-gradient-to-b from-gray-50 to-white py-16 md:py-24 overflow-hidden" dir="rtl">
      
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, #1c4793 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1c4793]/10 to-[#32a3db]/10 rounded-full px-4 py-2 mb-4">
            <Package className="w-4 h-4 text-[#1c4793]" />
            <span className="text-sm font-semibold text-[#1c4793]">محصولات استوک با کیفیت</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black mb-4">
            <span className="text-[#113d64]">دسته بندی های</span>
            <span className="text-[#1c4793]"> استوک</span>
          </h2>
          
          <p className="text-gray-500 max-w-2xl mx-auto text-base">
            بهترین و باکیفیت‌ترین محصولات استوک صنعتی با ضمانت اصالت و سلامت فیزیکی
          </p>
          
          <div className="flex justify-center gap-2 mt-6">
            <div className="w-12 h-1 bg-[#1c4793] rounded-full"></div>
            <div className="w-6 h-1 bg-[#32a3db] rounded-full"></div>
            <div className="w-3 h-1 bg-[#e21f25] rounded-full"></div>
          </div>
        </div>

        {/* Categories Grid - فقط عنوان، عکس و لینک */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((item, idx) => (
            <Link
              key={idx}
              to={item.link}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Top Gradient Border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1c4793] via-[#32a3db] to-[#e21f25] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
              
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Content - فقط عنوان */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#1c4793] transition-colors">
                  {item.name}
                </h3>
                
                {/* خط تزیینی */}
                <div className="w-12 h-0.5 bg-gradient-to-r from-[#1c4793] to-[#32a3db] mx-auto group-hover:w-24 transition-all duration-300"></div>
              </div>

              {/* Hover Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/10 to-white/0 translate-y-full group-hover:translate-y-0 transition-transform duration-1000 pointer-events-none"></div>
            </Link>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="flex justify-center items-center gap-8 mt-16 flex-wrap">
          <div className="flex items-center gap-2 text-gray-400">
            <CheckCircle className="w-4 h-4 text-[#32a3db]" />
            <span className="text-xs">ضمانت بازگشت کالا</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Shield className="w-4 h-4 text-[#e21f25]" />
            <span className="text-xs">تضمین اصالت کالا</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Truck className="w-4 h-4 text-[#1c4793]" />
            <span className="text-xs">ارسال به سراسر کشور</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stock;