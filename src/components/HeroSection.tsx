// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
// import { ChevronRight, ChevronLeft } from 'lucide-react';

// // استایل‌های پیش‌فرض Swiper
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import 'swiper/css/effect-fade';

// const HeroSlider = () => {
//   const slides = [
//     { id: 1, image: "/drbanner.png" },
//     { id: 2, image: "/drbanner1.png" },
//     { id: 3, image: "/drbanner.png" },
//   ];

//   return (
//     <div className="relative w-[90%] mx-auto mt-10 h-[150px] md:h-[500px] max-2xl:h[550px] group overflow-hidden rounded-2xl shadow-lg border border-gray-100">
      
//       <Swiper
//         modules={[Navigation, Pagination, Autoplay, EffectFade]}
//         navigation={{
//           nextEl: '.swiper-button-next-custom',
//           prevEl: '.swiper-button-prev-custom',
//         }}
//         pagination={{ clickable: true, dynamicBullets: true }}
//         autoplay={{ delay: 4000, disableOnInteraction: false }}
//         effect="fade" // افکت محو شدن زیبا
//         loop={true}
//         className="w-full h-full"
//       >
//         {slides.map((slide) => (
//           <SwiperSlide key={slide.id}>
//             <div className="w-full h-full overflow-hidden">
//               <img
//                 src={slide.image}
//                 alt={`Slide ${slide.id}`}
//                 className="w-full h-full object-fill"
//               />
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>

//       {/* دکمه‌های کنترلی سفارشی (فقط در حالت Hover نمایش داده می‌شوند) */}
//       <button className="swiper-button-prev-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-white active:scale-90">
//         <ChevronRight size={24} />
//       </button>
      
//       <button className="swiper-button-next-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-white active:scale-90">
//         <ChevronLeft size={24} />
//       </button>

//       {/* شخصی‌سازی رنگ نقاط پایین (Pagination) در فایل CSS یا به این صورت */}
//       <style>{`
//         .swiper-pagination-bullet-active {
//           background-color: #f59e0b !important; /* رنگ طلایی/آمبر */
//         }
//       `}</style>
//     </div>
//   );
// };

// export default HeroSlider;
