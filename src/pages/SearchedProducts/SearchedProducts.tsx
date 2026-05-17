// pages/Products.tsx
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { Search,X, Loader2 } from "lucide-react";

interface IProduct {
  id: number;
  title: string;
  base_price: number;
  before_discount_price: number;
  brand: string;
  inventory: number;
  image: string[];
  categoryId: string;
}

const Searchedproducts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  
  const search = searchParams.get("search") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = "https://electroshahresfahan.com/drgearbox/get_products.php";
        if (search) {
          url += `?title=${encodeURIComponent(search)}`;
        }
        const response = await axios.get(url);
        let productsData = response.data.products || [];
        
        // فیلتر محصولات گیربکس (categoryId‌های 101-104)
        productsData = productsData;
        
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ search: searchQuery });
    } else {
      setSearchParams({});
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* هدر */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">نتایج جستجو</h1>
          {search && (
            <p className="text-gray-500">
              {products.length} محصول برای عبارت "{search}" یافت شد
            </p>
          )}
        </div>

        {/* فرم جستجو */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی محصولات..."
              className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2">
              <Search className="w-5 h-5 text-gray-400" />
            </button>
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSearchParams({});
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
        </form>

        {/* لیست محصولات */}
        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <div className="text-gray-400 mb-4">🔍</div>
            <p className="text-gray-500">هیچ محصولی با عبارت مورد نظر یافت نشد</p>
            <Link to="/" className="inline-block mt-4 text-blue-600 hover:text-blue-700">
              بازگشت به صفحه اصلی
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/product/${encodeURIComponent(product.title)}`}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="relative w-full h-48 flex items-center justify-center mb-4 overflow-hidden">
                  <img
                    src={product.image?.[0] || "/placeholder.png"}
                    alt={product.title}
                    className="object-contain max-h-full transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span className="font-medium">{product.brand}</span>
                  <span className={product.inventory === 0 ? "text-red-500" : "text-green-600"}>
                    {product.inventory === 0 ? "ناموجود" : "موجود"}
                  </span>
                </div>
                <h3 className="text-gray-800 font-semibold text-sm line-clamp-2 mb-2 min-h-[40px]">
                  {product.title}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-lg font-bold text-blue-600">
                    {product.base_price.toLocaleString("fa-IR")} تومان
                  </span>
                </div>
                <button className="mt-3 w-full bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 transition-all duration-300">
                  مشاهده محصول
                </button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Searchedproducts;