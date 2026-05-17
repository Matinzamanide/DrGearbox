import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { 
  Home, ChevronLeft, ChevronRight, Shield, Zap, 
   Eye,Filter, ChevronDown, RefreshCw,
} from "lucide-react";
import type { IProduct } from "../pages/Gearbox/Gearbox";

interface ICategory {
  id: string;
  name: string;
  parentId: string | null;
}

const CategoryProducts = () => {
  const { slug, id } = useParams<{ slug: string; id: string }>();
//   const navigate = useNavigate();
  
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"default" | "cheapest" | "expensive">("default");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000000 });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  const itemsPerPage = 12;

  // دریافت دسته‌بندی‌ها
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios("https://electroshahresfahan.com/drgearbox/get_products.php");
        if (res.data.categories) {
          setCategories(res.data.categories);
          
          if (id) {
            const foundCategory = res.data.categories.find((c: ICategory) => c.id === id);
            if (foundCategory) {
              setSelectedCategory(foundCategory);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [id]);

  // دریافت محصولات
  useEffect(() => {
    const fetchProducts = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const res = await axios(`https://electroshahresfahan.com/drgearbox/get_products.php?categoryId=${id}`);
        const productsData = res.data.products || [];
        setProducts(productsData);
        
        // محاسبه محدوده قیمت
        const prices = productsData.map((p: IProduct) => Number(p.base_price)).filter((p: number) => p > 0);
        const min = prices.length > 0 ? Math.min(...prices) : 0;
        const max = prices.length > 0 ? Math.max(...prices) : 100000000;
        setPriceRange({ min, max });
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [id]);

  // فیلتر و مرتب‌سازی محصولات
  useEffect(() => {
    let filtered = [...products];
    
    // فیلتر برند
    if (selectedBrand) {
      filtered = filtered.filter(p => p.brand === selectedBrand);
    }
    
    // فیلتر نوع
    if (selectedType) {
      filtered = filtered.filter(p => p.type === selectedType);
    }
    
    // فیلتر محدوده قیمت
    filtered = filtered.filter(p => {
      const price = Number(p.base_price);
      return price >= priceRange.min && price <= priceRange.max;
    });
    
    // مرتب‌سازی
    switch (sortBy) {
      case "cheapest":
        filtered.sort((a, b) => Number(a.base_price) - Number(b.base_price));
        break;
      case "expensive":
        filtered.sort((a, b) => Number(b.base_price) - Number(a.base_price));
        break;
      default:
        filtered.sort((a, b) => b.id - a.id);
    }
    
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, selectedBrand, selectedType, sortBy, priceRange]);

  // استخراج برندهای موجود
  const availableBrands = useMemo(() => {
    const brands = new Set(products.map(p => p.brand).filter(Boolean));
    return Array.from(brands).sort();
  }, [products]);

  // استخراج نوع‌های موجود
  const availableTypes = useMemo(() => {
    const types = new Set(products.map(p => p.type).filter(t => t && t.trim() !== ""));
    return Array.from(types).sort();
  }, [products]);

  // صفحه‌بندی
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setSelectedBrand("");
    setSelectedType("");
    setSortBy("default");
    setPriceRange({ min: 0, max: 100000000 });
  };

  const getBreadcrumbName = () => {
    if (!selectedCategory) return slug || "محصولات";
    return selectedCategory.name;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96" style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)" }}>
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 rounded-full" style={{ borderColor: "#e8f0f8" }}></div>
          <div className="absolute inset-0 border-4 rounded-full animate-spin border-t-transparent" style={{ borderColor: "#1c4793", borderTopColor: "transparent" }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)" }}>
      <div className="container mx-auto px-4 md:px-8 py-8">
        
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-sm flex-wrap">
            <Link 
              to="/" 
              className="flex items-center gap-1 transition-colors hover:text-blue-600"
              style={{ color: "#1c4793" }}
            >
              <Home className="w-4 h-4" />
              <span>دکتر گیربکس</span>
            </Link>
            <ChevronLeft className="w-4 h-4 text-gray-400" />
            <Link 
              to="/products" 
              className="transition-colors hover:text-blue-600"
              style={{ color: "#666666" }}
            >
              محصولات صنعتی
            </Link>
            <ChevronLeft className="w-4 h-4 text-gray-400" />
            <span className="font-semibold" style={{ color: "#113d64" }}>
              {getBreadcrumbName()}
            </span>
          </nav>
        </div>

        {/* هدر */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-1 rounded-full" style={{ background: "linear-gradient(90deg, #1c4793, #e21f25)" }} />
              <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#1c4793" }}>
                محصولات صنعتی
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold" style={{ color: "#113d64" }}>
              {selectedCategory?.name || "محصولات"}
            </h1>
            <p className="text-gray-600 mt-2 max-w-2xl">
              مجموعه‌ای کامل از محصولات با کیفیت بالا و گارانتی معتبر - مناسب برای صنایع مختلف
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" style={{ color: "#1c4793" }} />
                <span className="text-sm text-gray-700">گارانتی 18 ماهه</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" style={{ color: "#32a3db" }} />
                <span className="text-sm text-gray-700">ارسال سریع</span>
              </div>
            </div>
            <div className="px-4 py-2 rounded-lg border" style={{ backgroundColor: "#f0f4fa", borderColor: "#cccccc" }}>
              <span className="text-sm font-medium" style={{ color: "#1c4793" }}>
                {filteredProducts.length} محصول
              </span>
            </div>
          </div>
        </div>

        {/* دکمه فیلتر موبایل */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border rounded-xl shadow-sm"
            style={{ borderColor: "#cccccc" }}
          >
            <Filter className="w-5 h-5" style={{ color: "#1c4793" }} />
            <span className="font-medium" style={{ color: "#113d64" }}>فیلترها</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${mobileFiltersOpen ? "rotate-180" : ""}`} style={{ color: "#666666" }} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* سایدبار فیلترها */}
          <div className={`lg:w-72 flex-shrink-0 ${mobileFiltersOpen ? "block" : "hidden lg:block"}`}>
            <div className="bg-white rounded-xl shadow-sm border p-5 sticky top-20" style={{ borderColor: "#cccccc" }}>
              <div className="flex justify-between items-center mb-4 pb-3 border-b" style={{ borderColor: "#e5e7eb" }}>
                <h3 className="font-bold flex items-center gap-2" style={{ color: "#113d64" }}>
                  <Filter className="w-5 h-5" style={{ color: "#1c4793" }} />
                  فیلترها
                </h3>
                {(selectedBrand || selectedType || sortBy !== "default" || priceRange.min > 0 || priceRange.max < 100000000) && (
                  <button onClick={resetFilters} className="text-xs flex items-center gap-1" style={{ color: "#e21f25" }}>
                    <RefreshCw className="w-3 h-3" />
                    حذف همه
                  </button>
                )}
              </div>

              {/* محدوده قیمت */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-sm" style={{ color: "#113d64" }}>محدوده قیمت (تومان)</h4>
                <div className="flex gap-2 mb-3">
                  <input
                    type="number"
                    placeholder="از"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                    className="w-1/2 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                    style={{ borderColor: "#cccccc", outlineColor: "#1c4793" }}
                  />
                  <input
                    type="number"
                    placeholder="تا"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                    className="w-1/2 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                    style={{ borderColor: "#cccccc", outlineColor: "#1c4793" }}
                  />
                </div>
              </div>

              {/* فیلتر برند */}
              {availableBrands.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-sm" style={{ color: "#113d64" }}>برند</h4>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                    style={{ borderColor: "#cccccc", outlineColor: "#1c4793" }}
                  >
                    <option value="">همه برندها</option>
                    {availableBrands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* فیلتر نوع */}
              {availableTypes.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-sm" style={{ color: "#113d64" }}>نوع محصول</h4>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                    style={{ borderColor: "#cccccc", outlineColor: "#1c4793" }}
                  >
                    <option value="">همه انواع</option>
                    {availableTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="lg:hidden mt-4">
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full py-2 rounded-lg text-sm font-medium"
                  style={{ backgroundColor: "#f0f4fa", color: "#1c4793" }}
                >
                  بستن فیلترها
                </button>
              </div>
            </div>
          </div>

          {/* بخش اصلی محصولات */}
          <div className="flex-1">
            {/* مرتب‌سازی */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex gap-2">
                <button 
                  onClick={() => setSortBy("default")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === "default" ? "text-white" : "bg-white border"
                  }`}
                  style={sortBy === "default" ? 
                    { backgroundColor: "#1c4793", color: "#ffffff" } : 
                    { borderColor: "#cccccc", color: "#113d64", border: "1px solid" }
                  }
                >
                  پیش‌فرض
                </button>
                <button 
                  onClick={() => setSortBy("cheapest")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === "cheapest" ? "text-white" : "bg-white border"
                  }`}
                  style={sortBy === "cheapest" ? 
                    { backgroundColor: "#1c4793", color: "#ffffff" } : 
                    { borderColor: "#cccccc", color: "#113d64", border: "1px solid" }
                  }
                >
                  ارزان‌ترین
                </button>
                <button 
                  onClick={() => setSortBy("expensive")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === "expensive" ? "text-white" : "bg-white border"
                  }`}
                  style={sortBy === "expensive" ? 
                    { backgroundColor: "#1c4793", color: "#ffffff" } : 
                    { borderColor: "#cccccc", color: "#113d64", border: "1px solid" }
                  }
                >
                  گران‌ترین
                </button>
              </div>

              {/* نمایش فیلترهای فعال */}
              {(selectedBrand || selectedType || sortBy !== "default") && (
                <div className="flex flex-wrap gap-2">
                  {selectedBrand && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full" style={{ backgroundColor: "#e8f0f8", color: "#1c4793" }}>
                      برند: {selectedBrand}
                      <button onClick={() => setSelectedBrand("")} className="hover:text-red-500">×</button>
                    </span>
                  )}
                  {selectedType && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full" style={{ backgroundColor: "#e8f0f8", color: "#1c4793" }}>
                      نوع: {selectedType}
                      <button onClick={() => setSelectedType("")} className="hover:text-red-500">×</button>
                    </span>
                  )}
                  {sortBy !== "default" && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full" style={{ backgroundColor: "#e8f0f8", color: "#1c4793" }}>
                      {sortBy === "cheapest" ? "ارزان‌ترین" : "گران‌ترین"}
                      <button onClick={() => setSortBy("default")} className="hover:text-red-500">×</button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* شبکه محصولات */}
            {currentProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {currentProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border" style={{ borderColor: "#cccccc" }}>
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: "#113d64" }}>محصولی یافت نشد</h3>
                <p className="text-gray-500">لطفاً فیلترهای دیگری را امتحان کنید</p>
                <button 
                  onClick={resetFilters}
                  className="mt-4 px-6 py-2 rounded-lg text-white"
                  style={{ backgroundColor: "#1c4793" }}
                >
                  حذف فیلترها
                </button>
              </div>
            )}

            {/* صفحه‌بندی */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mb-12">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors border"
                  style={{ borderColor: "#cccccc" }}
                >
                  <ChevronRight className="w-5 h-5" style={{ color: "#113d64" }} />
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-all ${
                        currentPage === pageNum
                          ? 'text-white shadow-lg'
                          : 'bg-white border'
                      }`}
                      style={currentPage === pageNum ? 
                        { background: "linear-gradient(135deg, #1c4793, #113d64)" } : 
                        { borderColor: "#cccccc", color: "#113d64" }
                      }
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors border"
                  style={{ borderColor: "#cccccc" }}
                >
                  <ChevronLeft className="w-5 h-5" style={{ color: "#113d64" }} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* بنر پایین */}
        <div className="rounded-2xl p-8 text-white mt-8" style={{ background: "linear-gradient(135deg, #1c4793, #113d64)" }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">{selectedCategory?.name || "محصولات صنعتی"} با کیفیت عالی</h3>
              <p className="opacity-90" style={{ color: "#cccccc" }}>
                بهترین کیفیت با گارانتی 18 ماهه و خدمات پس از فروش
              </p>
            </div>
            <button 
              className="font-bold px-8 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap" 
              style={{ backgroundColor: "#ffffff", color: "#1c4793" }}
            >
              دریافت کاتالوگ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// کامپوننت کارت محصول
const ProductCard = ({ product }: { product: IProduct }) => {
  const discount = product.before_discount_price && Number(product.before_discount_price) > Number(product.base_price)
    ? Math.round(((Number(product.before_discount_price) - Number(product.base_price)) / Number(product.before_discount_price)) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2" style={{ borderColor: "#e5e7eb" }}>
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <Link to={`/product/${encodeURIComponent(product.title)}`} className="block p-4 h-56 flex items-center justify-center">
          <img
            src={product.image?.[0] || "/placeholder.png"}
            alt={product.title}
            className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-110"
          />
        </Link>
        
        {discount > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
            {discount}% تخفیف
          </div>
        )}
        
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button className="bg-white text-sm font-bold px-4 py-2 rounded-full shadow-lg transition-transform hover:scale-105" style={{ color: "#1c4793" }}>
            <Eye className="w-4 h-4 inline ml-1" />
            مشاهده سریع
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#e8f0f8", color: "#1c4793" }}>
            {product.brand}
          </span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            product.inventory === "0" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
          }`}>
            {product.inventory === "0" ? "ناموجود" : "موجود"}
          </span>
        </div>
        
        <Link to={`/product/${encodeURIComponent(product.title)}`}>
          <h3 className="font-bold text-sm line-clamp-2 mb-2 transition-colors hover:text-blue-700" style={{ color: "#113d64" }}>
            {product.title}
          </h3>
        </Link>
        
        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-xl font-bold" style={{ color: "#1c4793" }}>
            {Number(product.base_price).toLocaleString("fa-IR")}
          </span>
          <span className="text-xs text-gray-400">تومان</span>
        </div>
        
        {product.before_discount_price && Number(product.before_discount_price) > Number(product.base_price) && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs line-through text-gray-400">
              {Number(product.before_discount_price).toLocaleString("fa-IR")}
            </span>
            <span className="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
              {discount}% تخفیف
            </span>
          </div>
        )}
        
        <button className="w-full mt-4 py-2.5 rounded-xl font-bold text-white transition-all duration-300 shadow-md hover:shadow-lg" style={{ background: "linear-gradient(135deg, #1c4793, #113d64)" }}>
          مشاهده محصول
        </button>
      </div>
    </div>
  );
};

export default CategoryProducts;