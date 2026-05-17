import { useState, useEffect, useRef } from "react";
import { Building2, Award, ChevronLeft, ChevronRight } from "lucide-react";

const Customers = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const customers = [
    {
      name: "سازمان انرژی اتمی",
      image: "https://drgearbox.com/wp-content/uploads/2025/12/logo-customer-9.jpg",
      industry: "انرژی هسته‌ای",
    },
    {
      name: "سیمان هگمتان",
      image: "https://drgearbox.com/wp-content/uploads/2025/12/logo-customer-12.jpg",
      industry: "سیمان",
    },
    {
      name: "شرکت آذر قند نقده",
      image: "https://drgearbox.com/wp-content/uploads/2025/12/logo-customer-7.jpg",
      industry: "صنایع غذایی",
    },
    {
      name: "شرکت باما",
      image: "https://drgearbox.com/wp-content/uploads/2025/12/logo-customer-13.jpg",
      industry: "صنایع تولیدی",
    },
    {
      name: "شرکت پتروشیمی اروند",
      image: "https://drgearbox.com/wp-content/uploads/2025/12/logo-customer-14.jpg",
      industry: "پتروشیمی",
    },
    {
      name: "شرکت پتروشیمی ایلام",
      image: "https://drgearbox.com/wp-content/uploads/2025/12/logo-customer-8.jpg",
      industry: "پتروشیمی",
    },
    {
      name: "شرکت سیمان نیزار قم",
      image: "https://drgearbox.com/wp-content/uploads/2025/12/logo-customer-11.jpg",
      industry: "سیمان",
    },
    {
      name: "شرکت فولاد افزا سپاهان",
      image: "https://drgearbox.com/wp-content/uploads/2025/12/logo-customer-4.jpg",
      industry: "فولاد",
    },
    {
      name: "شرکت قند اصفهان",
      image: "https://drgearbox.com/wp-content/uploads/2025/12/logo-customer-2.jpg",
      industry: "صنایع غذایی",
    },
    {
      name: "شرکت قند نقش جهان",
      image: "https://drgearbox.com/wp-content/uploads/2025/12/logo-customer-20.jpg",
      industry: "صنایع غذایی",
    },
    {
      name: "شرکت کالوپ اصفهان",
      image: "https://drgearbox.com/wp-content/uploads/2025/12/logo-customer-3.jpg",
      industry: "صنایع تولیدی",
    },
    {
      name: "صنایع فولاد کوهپایه",
      image: "https://drgearbox.com/wp-content/uploads/2025/12/logo-customer-16.jpg",
      industry: "فولاد",
    },
    {
      name: "فولاد آلیاژی اصفهان",
      image: "https://drgearbox.com/wp-content/uploads/2025/12/logo-customer-17.jpg",
      industry: "فولاد",
    },
    {
      name: "فولاد سیرجان ایرانیان",
      image: "https://drgearbox.com/wp-content/uploads/2025/12/logo-customer-18.jpg",
      industry: "فولاد",
    },
    {
      name: "قند ارومیه سهامی عام",
      image: "https://drgearbox.com/wp-content/uploads/2025/12/logo-customer-1.jpg",
      industry: "صنایع غذایی",
    },
    {
      name: "گروه صنایع گیتی پسند",
      image: "https://drgearbox.com/wp-content/uploads/2025/12/logo-customer-15.jpg",
      industry: "صنایع تولیدی",
    },
    {
      name: "گروه صنعتی سپاهان",
      image: "https://drgearbox.com/wp-content/uploads/2025/12/logo-customer-21.jpg",
      industry: "صنایع تولیدی",
    },
    {
      name: "مجتمع فولاد مبارکه",
      image: "https://drgearbox.com/wp-content/uploads/2025/12/logo-customer-19.jpg",
      industry: "فولاد",
    },
    {
      name: "مجتمع فولاد میانه",
      image: "https://drgearbox.com/wp-content/uploads/2025/12/logo-customer-22.jpg",
      industry: "فولاد",
    },
    {
      name: "موسسه شهید زین الدین",
      image: "https://drgearbox.com/wp-content/uploads/2025/12/logo-customer-23.jpg",
      industry: "سازمانی",
    },
    {
      name: "توسعه معدنی صبانور",
      image: "https://drgearbox.com/wp-content/uploads/2025/12/logo-customer-6.jpg",
      industry: "معدن",
    },
    {
      name: "شرکت بین المللی ساروج بوشهر",
      image: "https://drgearbox.com/wp-content/uploads/2025/12/logo-customer-10.jpg",
      industry: "ساختمانی",
    },
    {
      name: "مجتمع فولاد صنعت بناب",
      image: "https://drgearbox.com/wp-content/uploads/2025/12/logo-customer-5.jpg",
      industry: "فولاد",
    },
  ];

  // تنظیمات carousel
  const itemsPerView = {
    mobile: 2,
    tablet: 3,
    desktop: 4,
    large: 5,
  };

  const getItemsPerView = () => {
    if (typeof window === "undefined") return itemsPerView.desktop;
    if (window.innerWidth < 640) return itemsPerView.mobile;
    if (window.innerWidth < 768) return itemsPerView.tablet;
    if (window.innerWidth < 1024) return itemsPerView.desktop;
    return itemsPerView.large;
  };

  const [itemsToShow, setItemsToShow] = useState(itemsPerView.desktop);

  useEffect(() => {
    const handleResize = () => setItemsToShow(getItemsPerView());
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = Math.ceil(customers.length / itemsToShow);
  const currentCustomers = customers.slice(
    currentIndex * itemsToShow,
    (currentIndex + 1) * itemsToShow
  );

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Auto-play
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 2000);
    return () => clearInterval(timer);
  }, [currentIndex, isPaused]);

  // محاسبه آمار
  const totalCustomers = customers.length;

  return (
    <div className="w-full bg-gray-50 py-16 md:py-24" dir="rtl">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section - ساده و مینیمال */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-2 mb-4">
            <Building2 className="w-4 h-4 text-blue-600" />
            
            <span className="text-sm font-medium text-blue-600">افتخار همکاری با</span>
          </div>

          <h2 className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent text-4xl lg:text-5xl font-bold">
            مشتریان ما
          </h2>
          
          <p className="text-gray-500 text-base">
            بیش از {totalCustomers} شرکت معتبر صنعتی به ما اعتماد کرده‌اند
          </p>
        </div>

        {/* Customers Carousel */}
        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Carousel Container */}
          <div className="overflow-hidden py-6">
            <div 
              ref={carouselRef}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8 transition-all duration-500"
            >
              {currentCustomers.map((customer, idx) => (
                <div
                  key={`${customer.name}-${idx}`}
                  className="bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100"
                >
                  <div className="p-6 text-center">
                    {/* لوگو با اندازه بزرگتر */}
                    <div className="w-full h-32 flex items-center justify-center">
                      <img
                        src={customer.image}
                        alt={customer.name}
                        className="max-w-full max-h-full object-contain"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/200x120?text=Logo";
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons - ساده */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-4 w-9 h-9 md:w-10 md:h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 z-20 shadow-sm"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-3 md:translate-x-4 w-9 h-9 md:w-10 md:h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 z-20 shadow-sm"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
            </>
          )}
        </div>

        {/* Dots Indicators - ساده */}
        {totalSlides > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? "w-6 bg-blue-600"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}

        {/* Trust Badge - ساده */}
        <div className="text-center mt-10">
          <div className="inline-flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span className="text-xs text-gray-600">
              مورد اعتماد صنایع بزرگ کشور
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;