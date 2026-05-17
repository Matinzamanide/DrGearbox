import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Search, ShoppingCart, User, Menu, X, Settings, ChevronDown, Phone, Star, Zap, ArrowLeft, Loader2, Wrench, Package, ChevronLeft } from 'lucide-react';
import { useShoppingCart } from '../context/ShoppingCartContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface IUser {
  id: string;
  family: string;
  name: string;
  phone: string;
  created_at: string;
}

interface ISearchProduct {
  id: number;
  title: string;
  base_price: number;
  image: string;
  brand: string;
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ISearchProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<number | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { getItemCount } = useShoppingCart();

  const menuItems = [
    { name: 'خانه', href: '/', active: true },
    { name: 'محصولات', href: '#', isMega: true, badge: 'جدید' },
    { name: 'خدمات', href: '#', dropdown: true },
    { name: 'درباره ما', href: '/about' },
    { name: 'تماس با ما', href: '/contact' },
    { name: 'وبلاگ', href: '/blog', badge: 'داغ' },
  ];

interface Category {
  id: string;
  name: string;
  parentId: string | null;
}

interface CategoryNode extends Category {
  children: CategoryNode[];
}
const categoriesData = [
    { "id": "1", "name": "گیربکس", "parentId": null },
    { "id": "2", "name": "الکتروموتور", "parentId": null },
    { "id": "3", "name": "تجهیزات انتقال قدرت", "parentId": null },
    { "id": "4", "name": "استوک", "parentId": null },
    { "id": "101", "name": "گیربکس حلزونی", "parentId": "1" },
    { "id": "102", "name": "گیربکس سیاره ای", "parentId": "1" },
    { "id": "103", "name": "گیربکس هلیکال", "parentId": "1" },
    { "id": "104", "name": "گیربکس جناغی", "parentId": "1" },
    { "id": "111", "name": "حلزونی VF", "parentId": "101" },
    { "id": "112", "name": "حلزونی کتابی VF/U", "parentId": "101" },
    { "id": "121", "name": "طرح رجیانا Reggiana", "parentId": "102" },
    { "id": "201", "name": "موتوژن", "parentId": "2" },
    { "id": "202", "name": "الکتروژن", "parentId": "2" },
    { "id": "203", "name": "چینی", "parentId": "2" },
    { "id": "301", "name": "بک استاپ", "parentId": "3" },
    { "id": "302", "name": "کوپلینگ", "parentId": "3" },
    { "id": "401", "name": "گیربکس استوک", "parentId": "4" }
];

const buildCategoryTree = (categories: Category[]): CategoryNode[] => {
    const categoryMap: Record<string, CategoryNode> = {};
    const tree: CategoryNode[] = [];

    categories.forEach(cat => {
        categoryMap[cat.id] = { ...cat, children: [] };
    });

    categories.forEach(cat => {
        if (cat.parentId === null) {
            tree.push(categoryMap[cat.id]);
        } else if (categoryMap[cat.parentId]) {
            categoryMap[cat.parentId].children.push(categoryMap[cat.id]);
        }
    });
    
    return tree;
};


const categoryIcons = {
    "گیربکس": <Settings className="w-5 h-5" />,
    "الکتروموتور": <Zap className="w-5 h-5" />,
    "تجهیزات انتقال قدرت": <Wrench className="w-5 h-5" />,
    "استوک": <Package className="w-5 h-5" />,
};
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get(
        `https://electroshahresfahan.com/drgearbox/get_products.php?title=${encodeURIComponent(query)}`
      );
      const products = response.data.products || [];
      const limitedResults = products.slice(0, 5).map((p: any) => ({
        id: p.id,
        title: p.title,
        base_price: Number(p.base_price),
        image: p.image?.[0] || '/placeholder.png',
        brand: p.brand
      }));
      setSearchResults(limitedResults);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProductClick = (title: string) => {
    setShowSearchResults(false);
    setSearchQuery('');
    navigate(`/product/${encodeURIComponent(title)}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setShowSearchResults(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const toggleMobileDropdown = (index: number) => {
    setOpenMobileDropdown(openMobileDropdown === index ? null : index);
  };

  useEffect(() => {
    const user_info = localStorage.getItem("user");
    if (user_info) {
      setUser(JSON.parse(user_info));
    } else {
      setUser(null);
    }
  }, []);

  return (
    <>
      <div onClick={() => setIsMenuOpen(false)} className="relative bg-slate-900 text-slate-200 text-sm py-2.5 z-50 border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="hidden md:flex items-center gap-2 text-blue-200 font-medium">
                <span className="animate-pulse">✨</span>
                <span>ارسال رایگان برای سفارش‌های بالای ۵۰ میلیون تومان</span>
              </span>
            </div>
            <div className="flex items-center gap-6">
              <a href="tel:02112345678" className="flex items-center gap-2 hover:text-white transition-colors duration-300">
                <Phone className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium tracking-wider">۰۲۱-۱۲۳۴۵۶۷۸</span>
              </a>
              <span className="hidden md:flex items-center gap-2 text-slate-300">
                <Star className="w-4 h-4 text-amber-400" />
                <span>۷ روز هفته، ۲۴ ساعته</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={`fixed top-0 right-0 w-80 h-full bg-white/95 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.1)] z-50 transform transition-all duration-500 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="relative h-full flex flex-col">
          <button onClick={() => setIsMenuOpen(false)} className="absolute top-5 left-5 z-10 bg-white shadow-sm p-2 rounded-full hover:bg-slate-50 transition-all duration-300">
            <X className="w-5 h-5 text-slate-600" />
          </button>
          
          <div className="pt-8 px-6 flex-1 overflow-y-auto">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-200/60">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-2.5">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-slate-800">DR Gearbox</span>
              </div>
            </div>

            <div className="relative w-full mb-6">
              <input
                type="text"
                placeholder="جستجو در محصولات..."
                className="w-full px-4 py-3 pr-11 rounded-xl bg-slate-100/80 focus:bg-white focus:ring-2 focus:ring-blue-500 text-sm transition-all duration-300 outline-none placeholder-slate-400 text-slate-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 max-h-80 overflow-y-auto">
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleProductClick(product.title)}
                      className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                    >
                      <img src={product.image} alt={product.title} className="w-10 h-10 rounded-lg object-cover" />
                      <div className="flex-1 text-right">
                        <p className="text-sm font-medium text-gray-800 line-clamp-1">{product.title}</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-blue-600 font-bold">{product.base_price.toLocaleString('fa-IR')} تومان</span>
                          <span className="text-xs text-gray-500">{product.brand}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <ul className="space-y-1.5">
              {menuItems.map((item, index) => {
                const hasSub = item.dropdown || item.isMega;
                const isOpen = openMobileDropdown === index;

                return (
                  <li key={index} className="flex flex-col">
                    <div 
                      onClick={() => hasSub ? toggleMobileDropdown(index) : null}
                      className="flex justify-between items-center px-4 py-3.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50/80 rounded-xl font-medium cursor-pointer transition-colors"
                    >
                      {hasSub ? (
                        <span className="flex-1">{item.name}</span>
                      ) : (
                        <Link to={item.href} className="flex-1" onClick={() => setIsMenuOpen(false)}>{item.name}</Link>
                      )}
                      
                      {hasSub && (
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                      )}
                    </div>

                    {hasSub && (
                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-64 opacity-100 mt-1 mb-2' : 'max-h-0 opacity-0'}`}>
                        <ul className="pr-8 pl-4 py-2 border-r-2 border-slate-100 space-y-3">
                          {item.isMega && [
                            'گیربکس صنعتی', 'الکتروموتور', 'تجهیزات جانبی', 'سرویس و نگهداری'
                          ].map((subItem, idx) => (
                            <li key={idx}>
                              <a href="#" className="block text-sm text-slate-500 hover:text-blue-600 transition-colors">
                                {subItem}
                              </a>
                            </li>
                          ))}
                          
                          {item.dropdown && !item.isMega && [
                            'مشاوره مهندسی', 'تعمیرات تخصصی', 'پشتیبانی فنی'
                          ].map((subItem, idx) => (
                            <li key={idx}>
                              <a href="#" className="block text-sm text-slate-500 hover:text-blue-600 transition-colors">
                                {subItem}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          
          {/* Mobile Footer/Login Button */}
          <div className="p-6 border-t border-slate-100">
            {user ? (
              <Link onClick={()=>setIsMenuOpen(false)} to="/userpanel" className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 font-medium">
                <User className="w-4 h-4" />
                <span>{user.name} {user.family}</span>
              </Link>
            ) : (
              <Link onClick={()=>setIsMenuOpen(false)} to="/auth/login" className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 font-medium">
                <User className="w-4 h-4" />
                <span>ورود / ثبت نام</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {isMenuOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsMenuOpen(false)} />}

      <div className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-between py-3.5 gap-6">
            <Link to="/">
          <img src="/dr.svg" className='w-36  md:hidden' alt="" />
          </Link>

            <ul className="hidden lg:flex items-center gap-2 static">
              {menuItems.map((item, index) => (
                <li key={index} className="static group">
                  <Link to={item.href} className="relative px-4 py-6 text-slate-600 hover:text-blue-600 transition-colors duration-300 font-medium flex items-center gap-1.5">
                    {item.name}
                    {(item.dropdown || item.isMega) && <ChevronDown className="w-4 h-4 text-slate-400 group-hover:rotate-180 transition-transform duration-300" />}
                  </Link>
                  
                 {item.isMega && (() => {
    const categoryTree = useMemo(() => buildCategoryTree(categoriesData), []);
    
    const [activeCategory, setActiveCategory] = useState(categoryTree.length > 0 ? categoryTree[0] : null);

    if (!activeCategory) return null;

    return (
        <div className="absolute top-full right-0 left-0 mt-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-b-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border-t border-slate-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-3 z-50 overflow-hidden">
            <div className="p-8 grid grid-cols-12 gap-8 max-w-7xl mx-auto">
                
                <div className="col-span-5 flex gap-6">
                    <div className="w-1/2 space-y-2">
                        {categoryTree.map((parentCat) => (
                            <button
                                key={parentCat.id}
                                onMouseEnter={() => setActiveCategory(parentCat)}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg text-right transition-colors ${
                                    activeCategory.id === parentCat.id
                                    ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300'
                                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                                }`}
                            >
                              {categoryIcons[parentCat.name as keyof typeof categoryIcons] || <Settings className="w-5 h-5 text-slate-500" />}
                                <span className="font-semibold text-sm">{parentCat.name}</span>
                                <ChevronLeft className={`w-4 h-4 mr-auto transition-opacity ${ activeCategory.id === parentCat.id ? 'opacity-100' : 'opacity-0'}`} />
                            </button>
                        ))}
                    </div>

                    <div className="w-1/2">
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">{activeCategory.name}</h3>
                        <ul className="space-y-2">
                           {activeCategory.children.length > 0 ? (
                                activeCategory.children.map(subCat => (
                                    <li key={subCat.id}>
                                        <a href={`/category/${subCat.id}`} className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:mr-1 transition-all flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                                            {subCat.name}
                                        </a>
                                    </li>
                                ))
                           ) : (
                                <li>
                                    <span className="text-sm text-slate-400 dark:text-slate-500">زیرشاخه‌ای وجود ندارد.</span>
                                </li>
                           )}
                        </ul>
                    </div>
                </div>

                <div className="col-span-3 space-y-6 border-r border-slate-100 dark:border-slate-800 pr-8">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">لینک‌های سریع</h3>
                  <ul className="space-y-3">
                    {['لیست قیمت ۱۴۰۵', 'دانلود کاتالوگ محصولات', 'راهنمای انتخاب گیربکس', 'محصولات سفارشی', 'پروژه‌های انجام شده'].map((link, i) => (
                      <li key={i}>
                        <a href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:mr-2 transition-all flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="col-span-4 bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl p-6 text-white relative overflow-hidden flex flex-col justify-end min-h-[250px]">
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                  <div className="relative z-10">
                    <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">ویژه</span>
                    <h3 className="text-2xl font-bold mb-2">گیربکس‌های سری Titan</h3>
                    <p className="text-blue-200 text-sm mb-4">طراحی شده برای شرایط سخت صنعتی با ۲۰٪ راندمان بالاتر.</p>
                    <a href="#" className="inline-flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all text-white">
                      مشاهده سری Titan <ArrowLeft className="w-4 h-4" />
                    </a>
                  </div>
                </div>
            </div>
        </div>
    );
})()}
                  {item.dropdown && !item.isMega && (
                    <div className="absolute top-full mt-0 w-56 bg-white/95 backdrop-blur-xl rounded-b-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border-t border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-3 z-50 overflow-hidden">
                      <div className="p-2">
                        {['مشاوره مهندسی', 'تعمیرات تخصصی', 'پشتیبانی فنی'].map((subItem, idx) => (
                          <a key={idx} href="#" className="block px-4 py-2.5 text-sm text-slate-600 hover:text-blue-700 hover:bg-blue-50/80 rounded-xl transition-colors duration-200 font-medium">
                            {subItem}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>

             <Link to="/">
          <img src="/dr.svg" className='w-44 hidden md:block 2xl:mr-12' alt="" />
          </Link>

            <div className="hidden lg:flex flex-1 max-w-sm mr-auto" ref={searchRef}>
              <div className="relative w-full group">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="جستجو در محصولات..."
                  className="w-full px-5 py-2.5 pr-11 rounded-full bg-slate-100/70 focus:bg-white focus:ring-4 focus:ring-blue-100 text-sm transition-all duration-300 outline-none placeholder-slate-400 text-slate-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => searchQuery && searchResults.length > 0 && setShowSearchResults(true)}
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                
                {isSearching && (
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                  </div>
                )}
                
                {showSearchResults && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                    {searchResults.length > 0 ? (
                      <>
                        {searchResults.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => handleProductClick(product.title)}
                            className="w-full p-3 flex items-center gap-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0 text-right"
                          >
                            <img src={product.image} alt={product.title} className="w-12 h-12 rounded-lg object-cover" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800 line-clamp-1">{product.title}</p>
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-xs text-blue-600 font-bold">{product.base_price.toLocaleString('fa-IR')} تومان</span>
                                <span className="text-xs text-gray-500">{product.brand}</span>
                              </div>
                            </div>
                          </button>
                        ))}
                        <button
                          onClick={() => {
                            setShowSearchResults(false);
                            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
                          }}
                          className="w-full p-2 text-center text-sm text-blue-600 hover:bg-blue-50 transition-colors font-medium"
                        >
                          مشاهده همه نتایج ({searchResults.length}+)
                        </button>
                      </>
                    ) : (
                      !isSearching && searchQuery && (
                        <div className="p-4 text-center text-gray-500">
                          <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">محصولی با عبارت "{searchQuery}" یافت نشد</p>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 md:gap-3">
              <Link to="/cart" className="relative p-2.5 rounded-full text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute top-1 right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{getItemCount()}</span>
              </Link>
              {user ? (
                <Link to='/userpanel' className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white hover:bg-blue-700 transition-all duration-300">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">{user.name} {user.family}</span>
                </Link>
              ) : (
                <Link to="/auth/login" className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white hover:bg-blue-700 transition-all duration-300">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">ورود</span>
                </Link>
              )}
              
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2.5 rounded-full text-slate-600 hover:bg-slate-100 transition-colors">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;




































// import { useEffect, useState, useRef, useCallback } from 'react';
// import { Search, ShoppingCart, User, Menu, X, Settings, ChevronDown, Phone, Star, Zap, Shield, PenTool, ArrowLeft, Loader2 } from 'lucide-react';
// import { useShoppingCart } from '../context/ShoppingCartContext';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// interface IUser {
//   id: string;
//   family: string;
//   name: string;
//   phone: string;
//   created_at: string;
// }

// interface ISearchProduct {
//   id: number;
//   title: string;
//   base_price: number;
//   image: string;
//   brand: string;
// }

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState<ISearchProduct[]>([]);
//   const [isSearching, setIsSearching] = useState(false);
//   const [showSearchResults, setShowSearchResults] = useState(false);
//   const [openMobileDropdown, setOpenMobileDropdown] = useState<number | null>(null);
//   const [user, setUser] = useState<IUser | null>(null);
//   const searchRef = useRef<HTMLDivElement>(null);
//   const searchInputRef = useRef<HTMLInputElement>(null);
//   const navigate = useNavigate();
//   const { getItemCount } = useShoppingCart();

//   const menuItems = [
//     { name: 'خانه', href: '/', active: true },
//     { name: 'محصولات', href: '#', isMega: true, badge: 'جدید' },
//     { name: 'خدمات', href: '#', dropdown: true },
//     { name: 'درباره ما', href: '/about' },
//     { name: 'تماس با ما', href: '/contact' },
//     { name: 'وبلاگ', href: '/blog', badge: 'داغ' },
//   ];

//   // تابع جستجو
//   const handleSearch = useCallback(async (query: string) => {
//     if (!query.trim()) {
//       setSearchResults([]);
//       setShowSearchResults(false);
//       return;
//     }

//     setIsSearching(true);
//     try {
//       const response = await axios.get(
//         `https://electroshahresfahan.com/drgearbox/get_products.php?title=${encodeURIComponent(query)}`
//       );
//       const products = response.data.products || [];
//       const limitedResults = products.slice(0, 5).map((p: any) => ({
//         id: p.id,
//         title: p.title,
//         base_price: Number(p.base_price),
//         image: p.image?.[0] || '/placeholder.png',
//         brand: p.brand
//       }));
//       setSearchResults(limitedResults);
//       setShowSearchResults(true);
//     } catch (error) {
//       console.error('Search error:', error);
//       setSearchResults([]);
//     } finally {
//       setIsSearching(false);
//     }
//   }, []);

//   // دابونس برای جستجو
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (searchQuery) {
//         handleSearch(searchQuery);
//       } else {
//         setSearchResults([]);
//         setShowSearchResults(false);
//       }
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [searchQuery, handleSearch]);

//   // بستن نتایج جستجو با کلیک خارج
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
//         setShowSearchResults(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // تابع هدایت به صفحه محصول
//   const handleProductClick = (title: string) => {
//     setShowSearchResults(false);
//     setSearchQuery('');
//     navigate(`/product/${encodeURIComponent(title)}`);
//   };

//   // تابع جستجو با Enter
//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && searchQuery.trim()) {
//       setShowSearchResults(false);
//       navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
//     }
//   };

//   // تابع تغییر وضعیت دراپ‌داون موبایل
//   const toggleMobileDropdown = (index: number) => {
//     setOpenMobileDropdown(openMobileDropdown === index ? null : index);
//   };

//   useEffect(() => {
//     const user_info = localStorage.getItem("user");
//     if (user_info) {
//       setUser(JSON.parse(user_info));
//     } else {
//       setUser(null);
//     }
//   }, []);

//   return (
//     <>
//       <div className="relative bg-slate-900 text-slate-200 text-sm py-2.5 z-50 border-b border-white/10">
//         <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
//         <div className="container mx-auto px-4 relative z-10">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center gap-4">
//               <span className="hidden md:flex items-center gap-2 text-blue-200 font-medium">
//                 <span className="animate-pulse">✨</span>
//                 <span>ارسال رایگان برای سفارش‌های بالای ۵۰ میلیون تومان</span>
//               </span>
//             </div>
//             <div className="flex items-center gap-6">
//               <a href="tel:02112345678" className="flex items-center gap-2 hover:text-white transition-colors duration-300">
//                 <Phone className="w-4 h-4 text-blue-400" />
//                 <span className="text-sm font-medium tracking-wider">۰۲۱-۱۲۳۴۵۶۷۸</span>
//               </a>
//               <span className="hidden md:flex items-center gap-2 text-slate-300">
//                 <Star className="w-4 h-4 text-amber-400" />
//                 <span>۷ روز هفته، ۲۴ ساعته</span>
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Sidebar Menu (Mobile) */}
//       <div className={`fixed top-0 right-0 w-80 h-full bg-white/95 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.1)] z-50 transform transition-all duration-500 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
//         <div className="relative h-full flex flex-col">
//           <button onClick={() => setIsMenuOpen(false)} className="absolute top-5 left-5 z-10 bg-white shadow-sm p-2 rounded-full hover:bg-slate-50 transition-all duration-300">
//             <X className="w-5 h-5 text-slate-600" />
//           </button>
          
//           <div className="pt-8 px-6 flex-1 overflow-y-auto">
//             <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-200/60">
//               <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-2.5">
//                 <Settings className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <span className="text-xl font-extrabold text-slate-800">DR Gearbox</span>
//               </div>
//             </div>

//             {/* Mobile Search Bar */}
//             <div className="relative w-full mb-6">
//               <input
//                 type="text"
//                 placeholder="جستجو در محصولات..."
//                 className="w-full px-4 py-3 pr-11 rounded-xl bg-slate-100/80 focus:bg-white focus:ring-2 focus:ring-blue-500 text-sm transition-all duration-300 outline-none placeholder-slate-400 text-slate-700"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onKeyPress={handleKeyPress}
//               />
//               <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              
//               {/* نتایج جستجو موبایل */}
//               {showSearchResults && searchResults.length > 0 && (
//                 <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 max-h-80 overflow-y-auto">
//                   {searchResults.map((product) => (
//                     <button
//                       key={product.id}
//                       onClick={() => handleProductClick(product.title)}
//                       className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
//                     >
//                       <img src={product.image} alt={product.title} className="w-10 h-10 rounded-lg object-cover" />
//                       <div className="flex-1 text-right">
//                         <p className="text-sm font-medium text-gray-800 line-clamp-1">{product.title}</p>
//                         <div className="flex justify-between items-center mt-1">
//                           <span className="text-xs text-blue-600 font-bold">{product.base_price.toLocaleString('fa-IR')} تومان</span>
//                           <span className="text-xs text-gray-500">{product.brand}</span>
//                         </div>
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
            
//             {/* Mobile Menu Items */}
//             <ul className="space-y-1.5">
//               {menuItems.map((item, index) => {
//                 const hasSub = item.dropdown || item.isMega;
//                 const isOpen = openMobileDropdown === index;

//                 return (
//                   <li key={index} className="flex flex-col">
//                     <div 
//                       onClick={() => hasSub ? toggleMobileDropdown(index) : null}
//                       className="flex justify-between items-center px-4 py-3.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50/80 rounded-xl font-medium cursor-pointer transition-colors"
//                     >
//                       {hasSub ? (
//                         <span className="flex-1">{item.name}</span>
//                       ) : (
//                         <Link to={item.href} className="flex-1" onClick={() => setIsMenuOpen(false)}>{item.name}</Link>
//                       )}
                      
//                       {hasSub && (
//                         <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
//                       )}
//                     </div>

//                     {hasSub && (
//                       <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-64 opacity-100 mt-1 mb-2' : 'max-h-0 opacity-0'}`}>
//                         <ul className="pr-8 pl-4 py-2 border-r-2 border-slate-100 space-y-3">
//                           {item.isMega && [
//                             'گیربکس صنعتی', 'الکتروموتور', 'تجهیزات جانبی', 'سرویس و نگهداری'
//                           ].map((subItem, idx) => (
//                             <li key={idx}>
//                               <a href="#" className="block text-sm text-slate-500 hover:text-blue-600 transition-colors">
//                                 {subItem}
//                               </a>
//                             </li>
//                           ))}
                          
//                           {item.dropdown && !item.isMega && [
//                             'مشاوره مهندسی', 'تعمیرات تخصصی', 'پشتیبانی فنی'
//                           ].map((subItem, idx) => (
//                             <li key={idx}>
//                               <a href="#" className="block text-sm text-slate-500 hover:text-blue-600 transition-colors">
//                                 {subItem}
//                               </a>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}
//                   </li>
//                 );
//               })}
//             </ul>
//           </div>
          
//           {/* Mobile Footer/Login Button */}
//           <div className="p-6 border-t border-slate-100">
//             {user ? (
//               <Link to="/userpanel" className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 font-medium">
//                 <User className="w-4 h-4" />
//                 <span>{user.name} {user.family}</span>
//               </Link>
//             ) : (
//               <Link to="/auth/login" className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 font-medium">
//                 <User className="w-4 h-4" />
//                 <span>ورود / ثبت نام</span>
//               </Link>
//             )}
//           </div>
//         </div>
//       </div>

//       {isMenuOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsMenuOpen(false)} />}

//       {/* Main Navbar - با لوگو در وسط */}
//       <div className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 shadow-sm transition-all duration-300">
//         <div className="container mx-auto px-4 relative">
//           <div className="flex items-center justify-between py-3.5">
            
//             {/* سمت راست - منو (برای دسکتاپ خالی است، برای موبایل دکمه منو) */}
//             <div className="flex items-center gap-2 lg:w-1/4">
//               <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2.5 rounded-full text-slate-600 hover:bg-slate-100 transition-colors">
//                 <Menu className="w-5 h-5" />
//               </button>
              
//               {/* منوی دسکتاپ - سمت راست لوگو */}
//               <ul className="hidden lg:flex items-center gap-2">
//                 {menuItems.slice(0, 3).map((item, index) => (
//                   <li key={index} className="static group">
//                     <Link to={item.href} className="relative px-4 py-2 text-slate-600 hover:text-blue-600 transition-colors duration-300 font-medium flex items-center gap-1.5 whitespace-nowrap">
//                       {item.name}
//                       {(item.dropdown || item.isMega) && <ChevronDown className="w-4 h-4 text-slate-400 group-hover:rotate-180 transition-transform duration-300" />}
//                     </Link>
                    
//                     {/* Mega Menu */}
//                     {item.isMega && (
//                       <div className="absolute top-full right-0 left-0 mt-0 bg-white/95 backdrop-blur-2xl rounded-b-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border-t border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-3 z-50 overflow-hidden">
//                         <div className="p-8 grid grid-cols-12 gap-8">
//                           <div className="col-span-5 space-y-6">
//                             <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">دسته‌بندی‌های اصلی</h3>
//                             <div className="grid grid-cols-2 gap-4">
//                               {[
//                                 { title: 'گیربکس صنعتی', icon: Settings, desc: 'سری سنگین و سبک' },
//                                 { title: 'الکتروموتور', icon: Zap, desc: 'راندمان بالا (IE3)' },
//                                 { title: 'تجهیزات جانبی', icon: PenTool, desc: 'قطعات یدکی اصلی' },
//                                 { title: 'سرویس و نگهداری', icon: Shield, desc: 'گارانتی ۵ ساله' }
//                               ].map((sub, i) => (
//                                 <a key={i} href="#" className="flex gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group/item">
//                                   <div className="bg-blue-50 text-blue-600 p-2 rounded-lg group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors">
//                                     <sub.icon className="w-5 h-5" />
//                                   </div>
//                                   <div>
//                                     <h4 className="font-semibold text-slate-800 text-sm mb-1">{sub.title}</h4>
//                                     <p className="text-xs text-slate-500">{sub.desc}</p>
//                                   </div>
//                                 </a>
//                               ))}
//                             </div>
//                           </div>

//                           <div className="col-span-3 space-y-6 border-r border-slate-100 pr-8">
//                             <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">لینک‌های سریع</h3>
//                             <ul className="space-y-3">
//                               {['لیست قیمت ۱۴۰۳', 'دانلود کاتالوگ محصولات', 'راهنمای انتخاب گیربکس', 'محصولات سفارشی', 'پروژه‌های انجام شده'].map((link, i) => (
//                                 <li key={i}>
//                                   <a href="#" className="text-sm text-slate-600 hover:text-blue-600 hover:mr-2 transition-all flex items-center gap-2">
//                                     <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
//                                     {link}
//                                   </a>
//                                 </li>
//                               ))}
//                             </ul>
//                           </div>

//                           <div className="col-span-4 bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl p-6 text-white relative overflow-hidden flex flex-col justify-end min-h-[250px]">
//                             <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
//                             <div className="relative z-10">
//                               <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">ویژه</span>
//                               <h3 className="text-2xl font-bold mb-2">گیربکس‌های سری Titan</h3>
//                               <p className="text-blue-200 text-sm mb-4">طراحی شده برای شرایط سخت صنعتی با ۲۰٪ راندمان بالاتر.</p>
//                               <a href="#" className="inline-flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all text-white">
//                                 مشاهده سری Titan <ArrowLeft className="w-4 h-4" />
//                               </a>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {/* Standard Dropdown */}
//                     {item.dropdown && !item.isMega && (
//                       <div className="absolute top-full mt-0 w-56 bg-white/95 backdrop-blur-xl rounded-b-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border-t border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-3 z-50 overflow-hidden">
//                         <div className="p-2">
//                           {['مشاوره مهندسی', 'تعمیرات تخصصی', 'پشتیبانی فنی'].map((subItem, idx) => (
//                             <a key={idx} href="#" className="block px-4 py-2.5 text-sm text-slate-600 hover:text-blue-700 hover:bg-blue-50/80 rounded-xl transition-colors duration-200 font-medium">
//                               {subItem}
//                             </a>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* لوگو - دقیقاً وسط */}
//             <Link to="/" className="flex justify-center lg:w-1/2">
//               <img src="/dr.svg" className="w-36 md:w-44" alt="DR Gearbox" />
//             </Link>

//             {/* سمت چپ - منوی سمت چپ لوگو + جستجو + آیکون‌ها */}
//             <div className="flex items-center justify-end gap-2 lg:w-1/4">
//               {/* منوی سمت چپ لوگو (دسکتاپ) */}
//               <ul className="hidden lg:flex items-center gap-2">
//                 {menuItems.slice(3, 6).map((item, index) => (
//                   <li key={index} className="group relative">
//                     <Link to={item.href} className="relative px-4 py-2 text-slate-600 hover:text-blue-600 transition-colors duration-300 font-medium flex items-center gap-1.5 whitespace-nowrap">
//                       {item.name}
//                       {item.dropdown && <ChevronDown className="w-4 h-4 text-slate-400 group-hover:rotate-180 transition-transform duration-300" />}
//                     </Link>
                    
//                     {item.dropdown && (
//                       <div className="absolute top-full left-0 w-56 bg-white/95 backdrop-blur-xl rounded-b-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border-t border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-3 z-50 overflow-hidden">
//                         <div className="p-2">
//                           {['مشاوره مهندسی', 'تعمیرات تخصصی', 'پشتیبانی فنی'].map((subItem, idx) => (
//                             <a key={idx} href="#" className="block px-4 py-2.5 text-sm text-slate-600 hover:text-blue-700 hover:bg-blue-50/80 rounded-xl transition-colors duration-200 font-medium">
//                               {subItem}
//                             </a>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </li>
//                 ))}
//               </ul>

//               {/* جستجو (دسکتاپ) */}
//               <div className="hidden lg:flex w-64 xl:w-72" ref={searchRef}>
//                 <div className="relative w-full group">
//                   <input
//                     ref={searchInputRef}
//                     type="text"
//                     placeholder="جستجو..."
//                     className="w-full px-4 py-2 pr-9 rounded-full bg-slate-100/70 focus:bg-white focus:ring-2 focus:ring-blue-100 text-sm transition-all duration-300 outline-none placeholder-slate-400 text-slate-700"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     onKeyPress={handleKeyPress}
//                     onFocus={() => searchQuery && searchResults.length > 0 && setShowSearchResults(true)}
//                   />
//                   <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  
//                   {isSearching && (
//                     <div className="absolute left-3 top-1/2 -translate-y-1/2">
//                       <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
//                     </div>
//                   )}
                  
//                   {showSearchResults && (
//                     <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
//                       {searchResults.length > 0 ? (
//                         <>
//                           {searchResults.map((product) => (
//                             <button
//                               key={product.id}
//                               onClick={() => handleProductClick(product.title)}
//                               className="w-full p-2 flex items-center gap-2 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0 text-right"
//                             >
//                               <img src={product.image} alt={product.title} className="w-8 h-8 rounded-lg object-cover" />
//                               <div className="flex-1">
//                                 <p className="text-xs font-medium text-gray-800 line-clamp-1">{product.title}</p>
//                                 <span className="text-[10px] text-blue-600 font-bold">{product.base_price.toLocaleString('fa-IR')} تومان</span>
//                               </div>
//                             </button>
//                           ))}
//                           <button
//                             onClick={() => {
//                               setShowSearchResults(false);
//                               navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
//                             }}
//                             className="w-full p-1.5 text-center text-[10px] text-blue-600 hover:bg-blue-50 transition-colors font-medium"
//                           >
//                             مشاهده همه نتایج ({searchResults.length})
//                           </button>
//                         </>
//                       ) : (
//                         !isSearching && searchQuery && (
//                           <div className="p-3 text-center">
//                             <p className="text-xs text-gray-500">محصولی یافت نشد</p>
//                           </div>
//                         )
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* آیکون‌ها */}
//               <Link to="/cart" className="relative p-2 rounded-full text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
//                 <ShoppingCart className="w-5 h-5" />
//                 <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
//                   {getItemCount()}
//                 </span>
//               </Link>
              
//               {user ? (
//                 <Link to='/userpanel' className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white hover:bg-blue-700 transition-all duration-300">
//                   <User className="w-4 h-4" />
//                   <span className="text-sm font-medium hidden xl:inline">{user.name}</span>
//                 </Link>
//               ) : (
//                 <Link to="/auth/login" className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white hover:bg-blue-700 transition-all duration-300">
//                   <User className="w-4 h-4" />
//                   <span className="text-sm font-medium hidden xl:inline">ورود</span>
//                 </Link>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Navbar;