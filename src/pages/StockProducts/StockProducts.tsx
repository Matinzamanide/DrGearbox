import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Shield, Package, ShoppingCart, CheckCircle, XCircle, Settings, Truck, Award, Star, ChevronDown, ChevronUp } from "lucide-react";
import type { IProduct } from "../Gearbox/Gearbox";

export interface ICategory {
  id: string;
  name: string;
  parentId: number | null;
}

const StockProducts = () => {
  const [data, setData] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [category, setCategory] = useState<ICategory>();
  const [loading, setLoading] = useState(true);
  const [expandedSpecs, setExpandedSpecs] = useState<Record<string, boolean>>({}); // برای tracking کدام محصول باز شده

  const params = useParams().id;

  useEffect(() => {
    axios("https://electroshahresfahan.com/drgearbox/get_products.php")
      .then((res) => {
        setCategories(res.data.categories);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (categories.length === 0) return;
    const selectedCategories = categories.find((item) => item.id === params);
    setCategory(selectedCategories);
    if (selectedCategories) {
      axios(`https://electroshahresfahan.com/drgearbox/get_products.php?categoryId=${selectedCategories?.id}`)
        .then((res) => {
          setData(res.data.products);
        });
    }
  }, [params, categories]);

  const toggleSpecs = (productId: string) => {
    setExpandedSpecs(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12" dir="rtl">
      <div className="w-[90%] lg:w-[85%] mx-auto">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 pb-6 border-b border-gray-200">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-16 h-1 rounded-full bg-gradient-to-r from-[#1c4793] to-[#e21f25]" />
              <span className="text-sm font-semibold uppercase tracking-wider text-[#1c4793]">
                محصولات استوک صنعتی
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#113d64]">
              {category?.name || "محصولات استوک"}
            </h1>
            <p className="text-gray-500 mt-3 max-w-2xl text-sm leading-relaxed">
              مجموعه‌ای کامل از محصولات استوک با کیفیت بالا و گارانتی معتبر - مناسب برای صنایع مختلف
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm">
                <Shield className="w-4 h-4 text-[#1c4793]" />
                <span className="text-xs text-gray-600">گارانتی ۱۸ ماهه</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm">
                <Truck className="w-4 h-4 text-[#32a3db]" />
                <span className="text-xs text-gray-600">ارسال سریع</span>
              </div>
            </div>
            <div className="px-4 py-2 rounded-lg bg-[#f0f4fa] border border-[#cccccc]/30">
              <span className="text-sm font-bold text-[#1c4793]">
                <Package className="inline w-4 h-4 ml-1" />
                {data.length} محصول
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1c4793]"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">محصولی در این دسته‌بندی یافت نشد</p>
          </div>
        ) : (
          <div className="space-y-8">
            {data.map((item) => {
              const isInStock = Number(item.inventory) > 0;
              const discount = Number(item.before_discount_price) > Number(item.base_price)
                ? Math.round(((Number(item.before_discount_price) - Number(item.base_price)) / Number(item.before_discount_price)) * 100)
                : 0;
              const isExpanded = expandedSpecs[item.id] || false;
              const specs = item.specifications || [];
              const visibleSpecs = isExpanded ? specs : specs.slice(0, 4);

              return (
                <div key={item.id} className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                  <div className="flex flex-col lg:flex-row">
                    
                    <div className="lg:w-1/3 relative bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
                      <div className="relative">
                        <img
                          src={item.image?.[0] || "/placeholder.jpg"}
                          alt={item.title}
                          className="h-full w-full  group-hover:scale-105 transition-transform duration-500"
                        />
                        {discount > 0 && (
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#e21f25] to-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {discount}% تخفیف
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="lg:w-2/3 p-6 lg:p-8">
                      <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                        <h2 className="text-xl lg:text-2xl font-bold text-[#113d64] line-clamp-2 flex-1">
                          {item.title}
                        </h2>
                        {item.brand && (
                          <span className="px-3 py-1 bg-[#1c4793]/10 text-[#1c4793] text-xs font-bold rounded-full">
                            {item.brand}
                          </span>
                        )}
                      </div>

                      <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                        {item.description || "محصولی با کیفیت بالا و گارانتی اصالت، مناسب برای کاربردهای صنعتی"}
                      </p>

                      {specs.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-sm font-bold text-[#113d64] mb-3 flex items-center gap-2">
                            <Settings className="w-4 h-4 text-[#32a3db]" />
                            مشخصات فنی
                          </h3>
                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {visibleSpecs.map((spec, idx) => (
                                <div key={idx} className="flex justify-between items-center border-b border-gray-200 pb-2">
                                  <span className="text-xs text-gray-500">{spec.spec_key}</span>
                                  <span className="text-xs font-medium text-[#1c4793]">
                                    {spec.spec_value} {spec.spec_unit || ""}
                                  </span>
                                </div>
                              ))}
                            </div>
                            
                            {specs.length > 4 && (
                              <button
                                onClick={() => toggleSpecs(String(item.id))}
                                className="mt-3 w-full flex items-center justify-center gap-1 text-xs text-[#32a3db] hover:text-[#1c4793] transition-colors"
                              >
                                {isExpanded ? (
                                  <>
                                    <ChevronUp className="w-3 h-3" />
                                    مشاهده کمتر
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="w-3 h-3" />
                                    مشاهده همه مشخصات ({specs.length} مورد)
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
                        <div>
                          {discount > 0 && (
                            <span className="text-sm text-gray-400 line-through block">
                              {Number(item.before_discount_price).toLocaleString()} تومان
                            </span>
                          )}
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-[#e21f25]">
                              {Number(item.base_price).toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-500">تومان</span>
                          </div>
                          <span className="text-xs text-gray-400">قیمت حدودی</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg ${
                            isInStock ? "bg-emerald-50" : "bg-red-50"
                          }`}>
                            {isInStock ? (
                              <>
                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                                <span className="text-sm font-medium text-emerald-700">موجود</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 text-red-600" />
                                <span className="text-sm font-medium text-red-700">ناموجود</span>
                              </>
                            )}
                          </div>
                          <div className="flex gap-3">
                            <button className="px-5 py-2.5 bg-white border border-[#1c4793] text-[#1c4793] rounded-xl text-sm font-bold hover:bg-[#1c4793] hover:text-white transition-all duration-300">
                              استعلام قیمت
                            </button>
                            <Link to={`/product/${item.title}`} className="px-5 py-2.5 bg-gradient-to-r from-[#1c4793] to-[#113d64] text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all duration-300 flex items-center gap-2">
                              <ShoppingCart className="w-4 h-4" />
                              خرید محصول
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#1c4793]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-[#1c4793]" />
              </div>
              <h4 className="font-bold text-gray-800 text-sm">ضمانت اصالت</h4>
              <p className="text-xs text-gray-400 mt-1">ضمانت 100٪ اصالت کالا</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#32a3db]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Truck className="w-6 h-6 text-[#32a3db]" />
              </div>
              <h4 className="font-bold text-gray-800 text-sm">ارسال سریع</h4>
              <p className="text-xs text-gray-400 mt-1">تحویل اکسپرس در کمترین زمان</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#e21f25]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-[#e21f25]" />
              </div>
              <h4 className="font-bold text-gray-800 text-sm">کیفیت بالا</h4>
              <p className="text-xs text-gray-400 mt-1">محصولات با بالاترین کیفیت</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#113d64]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-[#113d64]" />
              </div>
              <h4 className="font-bold text-gray-800 text-sm">رضایت مشتریان</h4>
              <p className="text-xs text-gray-400 mt-1">بیش از ۱۰۰۰ مشتری راضی</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockProducts;