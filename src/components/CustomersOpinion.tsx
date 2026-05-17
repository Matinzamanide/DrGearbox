import { useState, useEffect } from "react";
import { Quote, ChevronLeft, ChevronRight, User, MessageSquare, Award, Sparkles, Star } from "lucide-react";

const CustomersOpinion = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const opinions = [
    {
      id: 1,
      name: "علی حسینی",
      position: "مدیر عامل فولاد اصفهان",
      person_image: "https://www.mizito.ir/images/testimonials/talebi.png",
      text: "عادت کرده‌ایم ابزارهای خوب خارجی باشند، اما ابزارهایی مثل دکتر گیربکس نشان داده‌اند که سرویس‌های آنلاین ایرانی می‌توانند هم متناسب با نیازهای بازار داخلی باشند و هم باکیفیت‌تر از نمونه‌های خارجی.",
      color: "from-green-500 to-emerald-500",
      rating: 5,
      project: "تجهیزات صنعتی",
    },
    {
      id: 2,
      name: "سیدمسعود ساداتی",
      position: "مدیریت آمار و فناوری اطلاعات دانشگاه علوم پزشکی مشهد",
      person_image: "https://www.mizito.ir/images/testimonials/sadati.png",
      text: "با دکتر گیربکس قادر هستیم زمان را در پروژه‌ها کنترل کنیم و به راحت‌ترین حالت ممکن وظایف صاحبان فرآیند را مشخص و مدیریت کنیم.",
      color: "from-blue-500 to-cyan-500",
      rating: 5,
      project: "پروژه‌های صنعتی",
    },
    {
      id: 3,
      name: "حسین دانشمند",
      position: "مدیرعامل شرکت پتروشیمی دانشمند",
      person_image: "https://www.mizito.ir/images/testimonials/daneshmand.png",
      text: "با دکتر گیربکس می‌توان کسب‌وکار خود را به راحتی مدیریت کرد و یکی از مزایای عالی آن پشتیبانی سریع است، همچنین ساخته شده توسط یک گروه ایرانی جوان است که این نیز از مزایای دیگر آن محسوب می‌گردد.",
      color: "from-red-500 to-orange-500",
      rating: 5,
      project: "پتروشیمی",
    },
    {
      id: 4,
      name: "محمد رضایی",
      position: "مدیر تولید سیمان هگمتان",
      person_image: "https://www.mizito.ir/images/testimonials/talebi.png",
      text: "کیفیت محصولات دکتر گیربکس بی‌نظیر است. از زمانی که با این مجموعه همکاری می‌کنیم، راندمان خط تولید ما به طرز چشمگیری افزایش یافته است.",
      color: "from-purple-500 to-pink-500",
      rating: 5,
      project: "سیمان",
    },
    {
      id: 5,
      name: "احمد کریمی",
      position: "مدیر فنی فولاد مبارکه",
      person_image: "https://www.mizito.ir/images/testimonials/sadati.png",
      text: "پشتیبانی فنی عالی و محصولات با کیفیت باعث شده تا همکاری خود را با دکتر گیربکس ادامه دهیم. تحویل به موقع و قیمت مناسب از دیگر مزایای این مجموعه است.",
      color: "from-amber-500 to-orange-500",
      rating: 5,
      project: "فولاد",
    },
  ];

  const totalSlides = opinions.length;

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    setTimeout(() => setIsAnimating(false), 100);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setTimeout(() => setIsAnimating(false), 100);
  };

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [currentIndex, isPaused]);

  const currentOpinion = opinions[currentIndex];

  return (
    <div className="w-full bg-gray-50 py-16 md:py-24 overflow-hidden relative" dir="rtl">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-100/40 to-cyan-100/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-r from-purple-100/40 to-pink-100/40 rounded-full blur-3xl"></div>
      
      {/* Dot Pattern */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, #94a3b8 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }}></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 mb-4 shadow-sm border border-slate-200">
            <MessageSquare className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-semibold text-slate-600">نظرات مشتریان</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-slate-800">آنچه مشتریان</span>
            <span className="text-blue-600"> می‌گویند</span>
          </h2>
          
          <p className="text-slate-500 text-sm max-w-2xl mx-auto">
            افتخار ما اعتماد بزرگترین شرکت‌های صنعتی کشور است
          </p>
          
          <div className="flex justify-center gap-1 mt-4">
            <div className="w-10 h-0.5 bg-blue-500 rounded-full"></div>
            <div className="w-5 h-0.5 bg-cyan-500 rounded-full"></div>
          </div>
        </div>

        {/* Stats Section - Compact */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-slate-100">
            <div className="text-lg font-bold text-blue-600">۵۰۰+</div>
            <div className="text-[10px] text-slate-500">پروژه موفق</div>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-slate-100">
            <div className="text-lg font-bold text-blue-600">۱۰۰%</div>
            <div className="text-[10px] text-slate-500">رضایت مشتریان</div>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-slate-100">
            <div className="text-lg font-bold text-blue-600">۱۰+</div>
            <div className="text-[10px] text-slate-500">سال تجربه</div>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-slate-100">
            <div className="text-lg font-bold text-blue-600">۲۴/۷</div>
            <div className="text-[10px] text-slate-500">پشتیبانی</div>
          </div>
        </div>

        {/* Main Testimonial Card - One at a time */}
        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation Buttons */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 group transition-all duration-300 z-20 border border-slate-200 hover:border-blue-600"
              >
                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 group transition-all duration-300 z-20 border border-slate-200 hover:border-blue-600"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
              </button>
            </>
          )}

          {/* Card Container with Animation */}
          <div className={`transition-all duration-500 transform ${isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
              
              {/* Card Content */}
              <div className="p-6 md:p-8">
                
                {/* Top Section with Rating */}
                <div className="flex justify-between items-start mb-6">
                  {/* Rating Stars */}
                  <div className="flex gap-1">
                    {[...Array(currentOpinion.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  
                  {/* Quote Icon */}
                  <div className="opacity-10">
                    <Quote size={48} className="text-slate-400" />
                  </div>
                </div>

                {/* Testimonial Text - کامل و خوانا */}
                <p className="text-slate-700 leading-relaxed mb-8 text-base md:text-lg">
                  "{currentOpinion.text}"
                </p>

                {/* Author Section */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                  {/* Avatar */}
                  <div className="relative">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${currentOpinion.color} flex items-center justify-center p-[2px]`}>
                      <div className="w-full h-full rounded-lg bg-white flex items-center justify-center overflow-hidden">
                        {currentOpinion.person_image ? (
                          <img
                            src={currentOpinion.person_image}
                            alt={currentOpinion.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>

                  {/* Author Info */}
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 text-base">
                      {currentOpinion.name}
                    </h4>
                    <p className="text-xs text-slate-400">{currentOpinion.position}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Award className="w-3 h-3 text-blue-400" />
                      <span className="text-[10px] text-slate-400">{currentOpinion.project}</span>
                    </div>
                  </div>

                  {/* Color Accent */}
                  <div className={`w-1 h-12 bg-gradient-to-b ${currentOpinion.color} rounded-full`}></div>
                </div>
              </div>

              {/* Bottom Gradient Bar */}
              <div className={`h-1 bg-gradient-to-r ${currentOpinion.color}`}></div>
            </div>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center items-center gap-3 mt-8">
          {opinions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (isAnimating) return;
                setIsAnimating(true);
                setCurrentIndex(idx);
                setTimeout(() => setIsAnimating(false), 500);
              }}
              className="group relative"
            >
              <div className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === idx
                  ? "w-8 bg-blue-600"
                  : "w-2 bg-slate-300 group-hover:bg-slate-400"
              }`} />
            </button>
          ))}
        </div>

        {/* Counter */}
        <div className="text-center mt-4">
          <span className="text-sm text-slate-400">
            {currentIndex + 1} / {totalSlides}
          </span>
        </div>

        {/* Trust Badge */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-slate-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[11px] text-slate-500">
              نظرات واقعی و تایید شده مشتریان صنعتی
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomersOpinion;