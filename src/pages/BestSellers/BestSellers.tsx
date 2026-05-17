import { useEffect, useState, useRef, type MouseEvent } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ShoppingCart, ChevronLeft, ChevronRight, Star } from "lucide-react";

export interface IProduct {
  id: string;
  title: string;
  base_price: number | string;
  before_discount_price: number | string;
  brand: string;
  image: string[];
}

const BestSellers = () => {
  const [data, setData] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false); // تشخیص حرکت واقعی

  useEffect(() => {
    axios("https://electroshahresfahan.com/drgearbox/get_products.php")
      .then((res) => {
        setData(res.data.products);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  const filteredProducts = data.filter(
    (item) =>
      ["1001", "1002", "1029", "1028", "1022", "1027", "1005", "1006"].includes(item.id)
  );

  const formatPrice = (price: string | number) => {
    return Number(price).toLocaleString("fa-IR");
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setHasMoved(false); // ریست حرکت
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setHasMoved(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // کمی تاخیر برای ریست hasMoved
    setTimeout(() => setHasMoved(false), 100);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    
    // اگر حرکت بیش از 5 پیکسل بود، درگ محسوب شود
    if (Math.abs(walk) > 5) {
      setHasMoved(true);
    }
    
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // بررسی برای کلیک روی لینک - اگر حرکت نکرده بود، اجازه کلیک بده
  const handleLinkClick = (e: React.MouseEvent, url: string) => {
    if (hasMoved) {
      e.preventDefault();
    }
    // اگر حرکت نکرده بود، لینک کار می‌کند
  };

  return (
    <section className="py-16" dir="rtl">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        
        {/* هدر بخش و دکمه‌های اسلایدر */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="md:text-3xl text-2xl font-black text-gray-800 ">
                پرفروش‌ترین‌های <span className="text-blue-600 ">دکتر گیربکس</span>
              </h2>
              <p className="text-gray-500 mt-1 text-sm font-medium">
                محصولاتی که بیشترین انتخاب مشتریان ما بوده‌اند
              </p>
            </div>
          </div>
          
          <div className="md:flex items-center gap-3 hidden">
            <button 
              onClick={() => scroll("right")}
              className="p-3 bg-white  rounded-full shadow-sm hover:shadow-md border border-gray-200 text-gray-600 hover:text-blue-600 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll("left")}
              className="p-3 bg-white rounded-full shadow-sm hover:shadow-md border border-gray-200 text-gray-600 hover:text-blue-600 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <Link 
              to="/products" 
              className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 rounded-full font-bold shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 mr-2"
            >
              مشاهده همه
            </Link>
          </div>
        </div>

        {/* کانتینر اسلایدر افقی - بدون pointerEvents: none */}
        <div 
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex overflow-x-auto gap-6 pb-8 pt-4 px-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
            ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
          `}
        >
          {loading ? (
            [1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="snap-center shrink-0 w-[280px] sm:w-[320px] bg-white  rounded-3xl h-96 animate-pulse p-4 shadow-sm border border-gray-100">
                <div className="w-full h-48 bg-gray-200  rounded-2xl mb-4"></div>
                <div className="w-3/4 h-6 bg-gray-200 rounded-lg mb-3"></div>
                <div className="w-1/2 h-4 bg-gray-200 rounded-lg mb-6"></div>
                <div className="w-full h-12 bg-gray-200 rounded-xl mt-auto"></div>
              </div>
            ))
          ) : (
            filteredProducts.map((item) => (
              <div
                key={item.id} 
                className="snap-center shrink-0 w-[280px] sm:w-[300px] group relative bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100  hover:-translate-y-2 flex flex-col select-none"
              >
                {/* تگ ویژه */}
                <div className="absolute top-6 right-6 z-10 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  پرفروش
                </div>

                {/* تصویر محصول - بدون preventDefault اضافی */}
                <div className="relative block w-full h-48 mb-4 overflow-hidden rounded-2xl bg-gray-50 ">
                  <img 
                    src={item.image && item.image.length > 0 ? item.image[0] : '/placeholder.jpg'} 
                    alt={item.title}
                    draggable="false"
                    className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* اطلاعات محصول */}
                <div className="flex flex-col flex-grow">
                  <span className="text-xs font-bold text-blue-500 mb-2 uppercase tracking-wider">
                    {item.brand || 'دکتر گیربکس'}
                  </span>
                  
                  <Link 
                    to={`/product/${item.title}`}
                    onClick={(e) => handleLinkClick(e, `/product/${item.title}`)}
                    className="block"
                  >
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 line-clamp-2 mb-2 
                    -hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                  </Link>

                  {/* قیمت و دکمه خرید */}
                  <div className="mt-auto pt-4 flex items-center justify-between border-t bord
                  er-gray-100 ">
                    <div className="flex flex-col">
                      <span className="text-[10px] sm:text-xs text-gray-400 mb-1">شروع قیمت از</span>
                      <div className="flex items-center gap-1 text-gray-900">
                        <span className="text-lg sm:text-xl font-black">{formatPrice(item.base_price)}</span>
                        <span className="text-[10px] sm:text-xs font-bold text-gray-500">تومان</span>
                      </div>
                    </div>

                    <Link 
                      to={`/product/${item.title}`}
                      onClick={(e) => handleLinkClick(e, `/product/${item.title}`)}
                      className="w-10 h-10 flex items-center justify-center bg-blue-50  text-blue-600  rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm shrink-0"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;