import { useEffect, useState } from "react";
import axios from "axios";
import type { IProduct } from "../../type/type";
import { ChevronLeft, ChevronRight, Shield, Zap, Filter, X, ChevronDown, Home } from "lucide-react";
import ProductCard from "../../components/ProductCard";
const Halazooni = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<string>("");
    const [selectedType, setSelectedType] = useState<string>("");
    const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 100000000 });
    const [sortBy, setSortBy] = useState<"default" | "cheapest" | "expensive">("default");
    
    const itemsPerPage = 8;

    useEffect(() => {
        axios('https://electroshahresfahan.com/drgearbox/get_products.php')
            .then(res => {
                setProducts(res.data.products);
                console.log(res.data.products)
                setFilteredProducts(res.data.products.filter((item: IProduct) => item.categoryId === "103"));
            })
            .catch(err => console.error("Error fetching data:", err));
    }, []);

    // استخراج برندهای منحصر به فرد
    const brands = [...new Set(products.filter(item => item.categoryId === "101").map(item => item.brand).filter(Boolean))];
    
    // استخراج تایپ‌های منحصر به فرد
    const types = [...new Set(products.filter(item => item.categoryId === "101").map(item => item.type).filter(Boolean))];

    // تابع اعمال فیلترها و مرتب‌سازی
    const applyFilters = () => {
        let filtered = products.filter(item => item.categoryId === "101");

        // فیلتر بر اساس برند
        if (selectedBrand) {
            filtered = filtered.filter(item => item.brand === selectedBrand);
        }

        // فیلتر بر اساس تایپ
        if (selectedType) {
            filtered = filtered.filter(item => item.type === selectedType);
        }

        // فیلتر بر اساس محدوده قیمت
        filtered = filtered.filter(item => 
            item.base_price >= priceRange.min && item.base_price <= priceRange.max
        );

        // مرتب‌سازی
        if (sortBy === "cheapest") {
            filtered.sort((a, b) => a.base_price - b.base_price);
        } else if (sortBy === "expensive") {
            filtered.sort((a, b) => b.base_price - a.base_price);
        }

        setFilteredProducts(filtered);
        setCurrentPage(1);
    };

    // اعمال فیلترها هنگام تغییر
    useEffect(() => {
        applyFilters();
    }, [selectedBrand, selectedType, priceRange, sortBy, products]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

    const handleAddToCart = (product: IProduct) => {
        console.log("Add to cart:", product);
    };

    const handleAddToWishlist = (product: IProduct) => {
        console.log("Add to wishlist:", product);
    };

    const resetFilters = () => {
        setSelectedBrand("");
        setSelectedType("");
        setPriceRange({ min: 0, max: 100000000 });
        setSortBy("default");
    };

    // محاسبه بیشترین قیمت برای اسلایدر
    const maxProductPrice = Math.max(...products.filter(item => item.categoryId === "101").map(item => item.base_price), 100000000);

    return (
        <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)" }}>
            <div className="container mx-auto px-4 md:px-8 py-8">
                
                {/* Breadcrumb */}
                <div className="mb-6">
                    <nav className="flex items-center gap-2 text-sm">
                        <a 
                            href="/" 
                            className="flex items-center gap-1 transition-colors hover:text-blue-600"
                            style={{ color: "#1c4793" }}
                        >
                            <Home className="w-4 h-4" />
                            <span>دکتر گیربکس</span>
                        </a>
                        <ChevronLeft className="w-4 h-4 text-gray-400" />
                        <a 
                            href="/industrial-gearboxes" 
                            className="transition-colors hover:text-blue-600"
                            style={{ color: "#666666" }}
                        >
                            گیربکس‌های صنعتی
                        </a>
                        <ChevronLeft className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold" style={{ color: "#113d64" }}>
                            گیربکس‌های حلزونی
                        </span>
                    </nav>
                </div>

                {/* هدر */}
                
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10">
                    <div className="mb-6 md:mb-0">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-1 rounded-full" style={{ background: "linear-gradient(90deg, #1c4793, #e21f25)" }} />
                            <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#1c4793" }}>
                                گیربکس‌های صنعتی
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold" style={{ color: "#113d64" }}>
                            گیربکس‌های <span style={{ color: "#1c4793" }}>حلزونی</span>
                        </h1>
                        <p className="text-gray-600 mt-2 max-w-2xl">
                            با کیفیت بالا و گارانتی معتبر - مناسب برای صنایع مختلف
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
                <div className="md:hidden mb-4">
                    <button 
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border"
                        style={{ backgroundColor: "#ffffff", borderColor: "#cccccc", color: "#1c4793" }}
                    >
                        <Filter className="w-5 h-5" />
                        <span className="font-medium">فیلتر و مرتب‌سازی</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* سایدبار فیلترها */}
                    <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block lg:w-72 flex-shrink-0`}>
                        <div className="bg-white rounded-xl p-5 sticky top-4" style={{ border: "1px solid #cccccc" }}>
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="font-bold text-lg" style={{ color: "#113d64" }}>فیلترها</h3>
                                <button 
                                    onClick={resetFilters}
                                    className="text-xs flex items-center gap-1 transition-colors hover:text-red-500"
                                    style={{ color: "#1c4793" }}
                                >
                                    <X className="w-3 h-3" />
                                    حذف همه
                                </button>
                            </div>

                            {/* فیلتر برند */}
                            {brands.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="font-semibold mb-3 text-sm" style={{ color: "#113d64" }}>برند</h4>
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="brand" 
                                                checked={selectedBrand === ""}
                                                onChange={() => setSelectedBrand("")}
                                                className="w-4 h-4"
                                                style={{ accentColor: "#1c4793" }}
                                            />
                                            <span className="text-sm text-gray-700">همه برندها</span>
                                        </label>
                                        {brands.map(brand => (
                                            <label key={brand} className="flex items-center gap-2 cursor-pointer">
                                                <input 
                                                    type="radio" 
                                                    name="brand" 
                                                    checked={selectedBrand === brand}
                                                    onChange={() => setSelectedBrand(brand || "")}
                                                    className="w-4 h-4"
                                                    style={{ accentColor: "#1c4793" }}
                                                />
                                                <span className="text-sm text-gray-700">{brand}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* فیلتر تایپ (نوع گیربکس) */}
                            {types.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="font-semibold mb-3 text-sm" style={{ color: "#113d64" }}>نوع گیربکس</h4>
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="type" 
                                                checked={selectedType === ""}
                                                onChange={() => setSelectedType("")}
                                                className="w-4 h-4"
                                                style={{ accentColor: "#1c4793" }}
                                            />
                                            <span className="text-sm text-gray-700">همه انواع</span>
                                        </label>
                                        {types.map(type => (
                                            <label key={type} className="flex items-center gap-2 cursor-pointer">
                                                <input 
                                                    type="radio" 
                                                    name="type" 
                                                    checked={selectedType === type}
                                                    onChange={() => setSelectedType(type || "")}
                                                    className="w-4 h-4"
                                                    style={{ accentColor: "#1c4793" }}
                                                />
                                                <span className="text-sm text-gray-700">{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* فیلتر محدوده قیمت */}
                            <div className="mb-6">
                                <h4 className="font-semibold mb-3 text-sm" style={{ color: "#113d64" }}>محدوده قیمت (تومان)</h4>
                                <div className="space-y-3">
                                    <input 
                                        type="range" 
                                        min={0} 
                                        max={maxProductPrice}
                                        value={priceRange.max}
                                        onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                                        style={{ 
                                            background: `linear-gradient(90deg, #1c4793 0%, #1c4793 ${(priceRange.max / maxProductPrice) * 100}%, #cccccc ${(priceRange.max / maxProductPrice) * 100}%)`,
                                            accentColor: "#1c4793"
                                        }}
                                    />
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex-1">
                                            <label className="text-xs text-gray-500">حداقل</label>
                                            <input 
                                                type="number" 
                                                value={priceRange.min}
                                                onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                                                className="w-full px-2 py-1 text-sm border rounded-lg"
                                                style={{ borderColor: "#cccccc" }}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-xs text-gray-500">حداکثر</label>
                                            <input 
                                                type="number" 
                                                value={priceRange.max}
                                                onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                                                className="w-full px-2 py-1 text-sm border rounded-lg"
                                                style={{ borderColor: "#cccccc" }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* نمایش محدوده انتخاب شده */}
                            <div className="mb-6 p-3 rounded-lg" style={{ backgroundColor: "#f0f4fa" }}>
                                <span className="text-xs" style={{ color: "#1c4793" }}>
                                    محدوده انتخابی: {priceRange.min.toLocaleString()} - {priceRange.max.toLocaleString()} تومان
                                </span>
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
                            {(selectedBrand || selectedType || sortBy !== "default" || priceRange.min > 0 || priceRange.max < maxProductPrice) && (
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                {currentProducts.map(product => (
                                    <ProductCard 
                                        key={product.id}
                                        product={product}
                                        onAddToCart={handleAddToCart}
                                        onAddToWishlist={handleAddToWishlist}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
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
                            <h3 className="text-2xl font-bold mb-2">گیربکس حلزونی با کیفیت عالی</h3>
                            <p className="opacity-90" style={{ color: "#cccccc" }}>
                                بهترین کیفیت با گارانتی 18 ماهه و خدمات پس از فروش
                            </p>
                        </div>
                        <button className="font-bold px-8 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap" 
                                style={{ backgroundColor: "#ffffff", color: "#1c4793" }}>
                            مشاهده کاتالوگ کامل
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Halazooni;