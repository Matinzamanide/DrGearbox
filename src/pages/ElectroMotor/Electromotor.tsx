import { Link } from "react-router-dom";
import { Zap, TrendingUp, Award, Shield, Truck, CheckCircle, ArrowLeft, Filter, ChevronDown, X, RefreshCw } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import type { IProduct } from "../Gearbox/Gearbox";
import axios from "axios";

interface FilterState {
  brand: string;
  category: string;
  optionFilters: Record<string, string>;
  powerRange: { min: number; max: number };
  poleCount: string;
  protection: string;
  sortBy: "default" | "price_asc" | "price_desc";
  priceRange: { min: number; max: number };
}

interface ICategory {
  id: string;
  name: string;
  parentId: string | null;
}

const ElectroMotor = () => {
  const [data, setData] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000000 });
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  
  const [filters, setFilters] = useState<FilterState>({
    brand: "",
    category: "",
    optionFilters: {},
    powerRange: { min: 0, max: 315 },
    poleCount: "",
    protection: "",
    sortBy: "default",
    priceRange: { min: 0, max: 100000000 }
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios("https://electroshahresfahan.com/drgearbox/get_products.php");
        if (res.data.categories) {
          setCategories(res.data.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const electroMotorSubCategories = useMemo(() => {
    return categories.filter(cat => cat.parentId === "2");
  }, [categories]);

  const electroMotorCategoryIds = useMemo(() => {
    const ids = ["2"];
    electroMotorSubCategories.forEach(cat => {
      ids.push(cat.id);
      categories.filter(c => c.parentId === cat.id).forEach(subCat => {
        ids.push(subCat.id);
      });
    });
    return ids;
  }, [electroMotorSubCategories, categories]);

  const availableOptions = useMemo(() => {
    let filteredBySelection = [...data];
    
    if (filters.brand) {
      filteredBySelection = filteredBySelection.filter(p => p.brand === filters.brand);
    }
    
    if (filters.category) {
      filteredBySelection = filteredBySelection.filter(p => p.categoryId === filters.category);
    }
    
    const optionsMap = new Map<string, Set<string>>();
    
    filteredBySelection.forEach(product => {
      product.options?.forEach(option => {
        if (!optionsMap.has(option.name)) {
          optionsMap.set(option.name, new Set());
        }
        option.choices.forEach(choice => {
          optionsMap.get(option.name)?.add(choice.value);
        });
      });
    });
    
    const result: { name: string; values: string[] }[] = [];
    optionsMap.forEach((values, name) => {
      result.push({ name, values: Array.from(values).sort() });
    });
    return result;
  }, [data, filters.brand, filters.category]);

  const availableBrands = useMemo(() => {
    let filtered = [...data];
    
    if (filters.category) {
      filtered = filtered.filter(p => p.categoryId === filters.category);
    }
    
    Object.entries(filters.optionFilters).forEach(([optionName, selectedValue]) => {
      if (selectedValue) {
        filtered = filtered.filter(product => {
          const productOption = product.options?.find(opt => opt.name === optionName);
          return productOption?.choices.some(choice => choice.value === selectedValue);
        });
      }
    });
    
    const brands = new Set(filtered.map(p => p.brand).filter(Boolean));
    return Array.from(brands).sort();
  }, [data, filters.category, filters.optionFilters]);

  const availableCategories = useMemo(() => {
    let filtered = [...data];
    
    if (filters.brand) {
      filtered = filtered.filter(p => p.brand === filters.brand);
    }
    
    Object.entries(filters.optionFilters).forEach(([optionName, selectedValue]) => {
      if (selectedValue) {
        filtered = filtered.filter(product => {
          const productOption = product.options?.find(opt => opt.name === optionName);
          return productOption?.choices.some(choice => choice.value === selectedValue);
        });
      }
    });
    
    const cats = new Set(filtered.map(p => p.categoryId).filter(Boolean));
    const validCats = Array.from(cats).filter(cat => electroMotorCategoryIds.includes(cat));
    return validCats.sort();
  }, [data, filters.brand, filters.optionFilters, electroMotorCategoryIds]);

  const getAvailableOptionValues = (optionName: string) => {
    let filtered = [...data];
    
    if (filters.brand) {
      filtered = filtered.filter(p => p.brand === filters.brand);
    }
    
    if (filters.category) {
      filtered = filtered.filter(p => p.categoryId === filters.category);
    }
    
    Object.entries(filters.optionFilters).forEach(([name, value]) => {
      if (value && name !== optionName) {
        filtered = filtered.filter(product => {
          const productOption = product.options?.find(opt => opt.name === name);
          return productOption?.choices.some(choice => choice.value === value);
        });
      }
    });
    
    const values = new Set<string>();
    filtered.forEach(product => {
      const option = product.options?.find(opt => opt.name === optionName);
      option?.choices.forEach(choice => {
        values.add(choice.value);
      });
    });
    
    return Array.from(values).sort();
  };

  const actualPowerRange = useMemo(() => {
    let filtered = [...data];
    
    if (filters.brand) {
      filtered = filtered.filter(p => p.brand === filters.brand);
    }
    
    if (filters.category) {
      filtered = filtered.filter(p => p.categoryId === filters.category);
    }
    
    Object.entries(filters.optionFilters).forEach(([optionName, selectedValue]) => {
      if (selectedValue) {
        filtered = filtered.filter(product => {
          const productOption = product.options?.find(opt => opt.name === optionName);
          return productOption?.choices.some(choice => choice.value === selectedValue);
        });
      }
    });
    
    let min = 315;
    let max = 0;
    
    filtered.forEach(p => {
      const powerSpec = p.specifications?.find(s => s.spec_key === "power");
      if (powerSpec) {
        const power = parseFloat(powerSpec.spec_value);
        if (!isNaN(power)) {
          min = Math.min(min, power);
          max = Math.max(max, power);
        }
      }
    });
    
    return { min: min === 315 ? 0 : min, max: max === 0 ? 315 : max };
  }, [data, filters.brand, filters.category, filters.optionFilters]);

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      powerRange: { min: actualPowerRange.min, max: actualPowerRange.max }
    }));
  }, [actualPowerRange]);

  useEffect(() => {
    let filtered = [...data];
    
    filtered = filtered.filter(item => electroMotorCategoryIds.includes(item.categoryId));
    
    if (filters.category) {
      filtered = filtered.filter(item => item.categoryId === filters.category);
    }
    
    if (filters.brand) {
      filtered = filtered.filter(item => item.brand === filters.brand);
    }
    
    Object.entries(filters.optionFilters).forEach(([optionName, selectedValue]) => {
      if (selectedValue) {
        filtered = filtered.filter(product => {
          const productOption = product.options?.find(opt => opt.name === optionName);
          return productOption?.choices.some(choice => choice.value === selectedValue);
        });
      }
    });
    
    if (filters.powerRange.min > 0 || filters.powerRange.max < 315) {
      filtered = filtered.filter(item => {
        const powerSpec = item.specifications?.find(s => s.spec_key === "power");
        if (powerSpec) {
          const power = parseFloat(powerSpec.spec_value);
          return power >= filters.powerRange.min && power <= filters.powerRange.max;
        }
        return true;
      });
    }
    
    filtered = filtered.filter(item => {
      const price = Number(item.base_price);
      return price >= filters.priceRange.min && price <= filters.priceRange.max;
    });
    
    switch (filters.sortBy) {
      case "price_asc":
        filtered.sort((a, b) => Number(a.base_price) - Number(b.base_price));
        break;
      case "price_desc":
        filtered.sort((a, b) => Number(b.base_price) - Number(a.base_price));
        break;
      default:
        filtered.sort((a, b) => b.id - a.id);
    }
    
    setFilteredProducts(filtered);
  }, [data, filters, electroMotorCategoryIds]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios("https://electroshahresfahan.com/drgearbox/get_products.php");
        let products = res.data.products || [];
        
        setData(products);
        
        const prices = products.map((p: IProduct) => Number(p.base_price)).filter((p: number) => p > 0);
        const min = prices.length > 0 ? Math.min(...prices) : 0;
        const max = prices.length > 0 ? Math.max(...prices) : 100000000;
        setPriceRange({ min, max });
        setFilters(prev => ({ ...prev, priceRange: { min, max } }));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBrandChange = (brand: string) => {
    const newOptionFilters: Record<string, string> = {};
    
    Object.entries(filters.optionFilters).forEach(([optName, optValue]) => {
      if (optValue) {
        const availableValues = getAvailableOptionValues(optName);
        if (availableValues.includes(optValue)) {
          newOptionFilters[optName] = optValue;
        }
      }
    });
    
    setFilters(prev => ({
      ...prev,
      brand,
      optionFilters: newOptionFilters
    }));
  };

  const handleCategoryChange = (category: string) => {
    const newOptionFilters: Record<string, string> = {};
    
    Object.entries(filters.optionFilters).forEach(([optName, optValue]) => {
      if (optValue) {
        const availableValues = getAvailableOptionValues(optName);
        if (availableValues.includes(optValue)) {
          newOptionFilters[optName] = optValue;
        }
      }
    });
    
    setFilters(prev => ({
      ...prev,
      category,
      optionFilters: newOptionFilters
    }));
  };

  const handleOptionChange = (optionName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      optionFilters: {
        ...prev.optionFilters,
        [optionName]: value
      }
    }));
  };

  const removeFilter = (type: string, value?: string) => {
    if (type === "brand") {
      setFilters(prev => ({ ...prev, brand: "" }));
    } else if (type === "category") {
      setFilters(prev => ({ ...prev, category: "" }));
    } else if (type === "powerRange") {
      setFilters(prev => ({ ...prev, powerRange: { min: 0, max: 315 } }));
    } else if (type === "option" && value) {
      setFilters(prev => {
        const newOptionFilters = { ...prev.optionFilters };
        delete newOptionFilters[value];
        return { ...prev, optionFilters: newOptionFilters };
      });
    } else if (type === "all") {
      setFilters(prev => ({
        ...prev,
        brand: "",
        category: "",
        optionFilters: {},
        powerRange: { min: 0, max: 315 },
        sortBy: "default",
        priceRange: { min: priceRange.min, max: priceRange.max }
      }));
    }
  };

  const activeFiltersCount = [
    filters.brand ? 1 : 0,
    filters.category ? 1 : 0,
    (filters.powerRange.min > 0 || filters.powerRange.max < 315) ? 1 : 0,
    ...Object.values(filters.optionFilters).filter(v => v).map(() => 1)
  ].length;

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(c => c.id === categoryId);
    if (category) return category.name;
    const categoryMap: Record<string, string> = {
      "201": "موتوژن",
      "202": "الکتروژن",
      "203": "چینی",
      "211": "سه فاز بدنه آلومینیوم موتوژن",
      "212": "سه فاز بدنه چدن موتوژن",
      "213": "تک فاز رله ای موتوژن",
      "214": "تک فاز خازنی موتوژن",
      "221": "سه فاز الکتروژن",
      "222": "تک فاز الکتروژن",
      "231": "سه فاز بدنه آلومینیوم چینی",
      "232": "سه فاز بدنه چدن چینی",
      "233": "تک فاز چینی"
    };
    return categoryMap[categoryId] || `دسته ${categoryId}`;
  };

  const categoriesDisplay = [
    { name: 'موتوژن', link: "/الکتروموتور/موتوژن", image: "https://motogen.com/images/logo.png", description: "الکتروموتورهای صنعتی با راندمان بالا", features: ["راندمان IE3", "گارانتی ۲۴ ماهه", "تحویل فوری"], color: "from-blue-600 to-blue-800", bgColor: "bg-blue-50" },
    { name: 'الکتروژن', link: "/products?brand=electrogen", image: "https://electrogenco.com/wp-content/uploads/2023/01/ELECTROGEN-FA-8.png", description: "الکتروموتورهای اروپایی با کیفیت عالی", features: ["استاندارد IEC", "۱۵ سال سابقه", "نمایندگی رسمی"], color: "from-emerald-600 to-emerald-800", bgColor: "bg-emerald-50" },
    { name: 'الکتروموتور چینی', link: "/الکتروموتور/چینی", image: "/chinamotor.png", description: "الکتروموتورهای اقتصادی با قیمت مناسب", features: ["قیمت رقابتی", "تنوع بالا", "موجودی انبار"], color: "from-amber-600 to-amber-800", bgColor: "bg-amber-50" },
  ];

  const stats = [
    { icon: Zap, label: "راندمان بالا", value: "تا ۹۶٪" },
    { icon: TrendingUp, label: "توان خروجی", value: "۰.۱۸ تا ۳۱۵ کیلووات" },
    { icon: Shield, label: "گارانتی", value: "۲۴ ماهه" },
    { icon: Truck, label: "تحویل", value: "۲۴ ساعته" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <section className="w-full py-16 px-4 md:px-8 font-sans" dir="rtl" style={{ background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)" }}>
      <div className="max-w-7xl mx-auto">
        
        {/* هدر بخش */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-2xl mb-4">
            <Zap className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-3">الکتروموتورهای صنعتی</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base">مجموعه‌ای کامل از الکتروموتورهای برندهای معتبر با بهترین قیمت و کیفیت</p>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* آمار سریع */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <stat.icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
              <p className="text-lg font-bold text-gray-800">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* کارت‌های برندها */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {categoriesDisplay.map((item, index) => (
            <Link key={index} to={item.link} className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              <div className="p-6 flex flex-col items-center text-center relative z-10">
                <div className={`w-32 h-32 rounded-2xl flex items-center justify-center mb-5 p-4 transition-all duration-300 group-hover:scale-110 ${item.bgColor}`}>
                  <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">{item.name}</h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">{item.description}</p>
                <div className="flex flex-wrap gap-2 justify-center mb-5">
                  {item.features.map((feature, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      {feature}
                    </span>
                  ))}
                </div>
                <div className="w-full pt-3 border-t border-gray-100">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition-all duration-300">
                    مشاهده محصولات
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                  </span>
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right`}></div>
            </Link>
          ))}
        </div>

        {/* دکمه فیلتر در موبایل */}
        <div className="lg:hidden mb-4">
          <button onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm">
            <Filter className="w-5 h-5 text-blue-600" />
            <span className="font-medium">فیلترهای تخصصی</span>
            {activeFiltersCount > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{activeFiltersCount}</span>
            )}
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${mobileFiltersOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* بخش اصلی با دو ستون */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* سایدبار فیلترها - سمت راست */}
          <div className={`lg:w-80 flex-shrink-0 ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-20">
              
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-600" />
                  فیلترهای تخصصی
                </h3>
                {activeFiltersCount > 0 && (
                  <button onClick={() => removeFilter("all")} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" />
                    حذف همه
                  </button>
                )}
              </div>

              {/* فیلتر محدوده قیمت */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 text-sm">محدوده قیمت (تومان)</h4>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input type="number" placeholder="از" value={filters.priceRange.min} onChange={(e) => setFilters(prev => ({ ...prev, priceRange: { ...prev.priceRange, min: Number(e.target.value) } }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                    </div>
                    <div className="flex-1">
                      <input type="number" placeholder="تا" value={filters.priceRange.max} onChange={(e) => setFilters(prev => ({ ...prev, priceRange: { ...prev.priceRange, max: Number(e.target.value) } }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                    </div>
                  </div>
                  <input type="range" min={priceRange.min} max={priceRange.max} value={filters.priceRange.max} onChange={(e) => setFilters(prev => ({ ...prev, priceRange: { ...prev.priceRange, max: Number(e.target.value) } }))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{priceRange.min.toLocaleString()}</span>
                    <span>{priceRange.max.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* فیلتر محدوده توان */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 text-sm">توان (کیلووات)</h4>
                <div className="flex gap-2">
                  <input type="number" placeholder="حداقل" value={filters.powerRange.min} onChange={(e) => setFilters(prev => ({ ...prev, powerRange: { ...prev.powerRange, min: Number(e.target.value) } }))} className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                  <input type="number" placeholder="حداکثر" value={filters.powerRange.max} onChange={(e) => setFilters(prev => ({ ...prev, powerRange: { ...prev.powerRange, max: Number(e.target.value) } }))} className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{actualPowerRange.min} کیلووات</span>
                  <span>{actualPowerRange.max} کیلووات</span>
                </div>
              </div>

              {/* فیلتر برند */}
              {availableBrands.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3 text-sm">برند</h4>
                  <select value={filters.brand} onChange={(e) => handleBrandChange(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                    <option value="">همه برندها</option>
                    {availableBrands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
                  </select>
                </div>
              )}

              {/* فیلتر دسته‌بندی */}
              {availableCategories.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3 text-sm">دسته‌بندی</h4>
                  <select value={filters.category} onChange={(e) => handleCategoryChange(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                    <option value="">همه دسته‌ها</option>
                    {availableCategories.map(cat => (
                      <option key={cat} value={cat}>
                        {getCategoryName(cat)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* فیلترهای آپشن */}
              {availableOptions.map(option => (
                <div key={option.name} className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3 text-sm">{option.name}</h4>
                  <select
                    value={filters.optionFilters[option.name] || ""}
                    onChange={(e) => handleOptionChange(option.name, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">همه</option>
                    {getAvailableOptionValues(option.name).map(value => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </select>
                </div>
              ))}

              <div className="lg:hidden mt-4">
                <button onClick={() => setMobileFiltersOpen(false)} className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">بستن فیلترها</button>
              </div>
            </div>
          </div>

          {/* بخش محصولات - سمت چپ */}
          <div className="flex-1">
            
            {/* نمایش فیلترهای فعال */}
            {activeFiltersCount > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-xl">
                <span className="text-xs text-gray-500 ml-2">فیلترهای فعال:</span>
                {filters.brand && (<div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">برند: {filters.brand}<button onClick={() => removeFilter("brand")} className="hover:bg-blue-200 rounded-full p-0.5"><X className="w-3 h-3" /></button></div>)}
                {filters.category && (<div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">دسته: {getCategoryName(filters.category)}<button onClick={() => removeFilter("category")} className="hover:bg-green-200 rounded-full p-0.5"><X className="w-3 h-3" /></button></div>)}
                {(filters.powerRange.min > 0 || filters.powerRange.max < 315) && (<div className="flex items-center gap-1 px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">توان: {filters.powerRange.min} تا {filters.powerRange.max} کیلووات<button onClick={() => removeFilter("powerRange")} className="hover:bg-pink-200 rounded-full p-0.5"><X className="w-3 h-3" /></button></div>)}
                {Object.entries(filters.optionFilters).map(([optName, optValue]) => optValue && (
                  <div key={optName} className="flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                    {optName}: {optValue}
                    <button onClick={() => removeFilter("option", optName)} className="hover:bg-indigo-200 rounded-full p-0.5"><X className="w-3 h-3" /></button>
                  </div>
                ))}
                <button onClick={() => removeFilter("all")} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"><RefreshCw className="w-3 h-3" />حذف همه</button>
              </div>
            )}

            {/* نوار ابزار */}
            <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">مرتب‌سازی:</span>
                <select value={filters.sortBy} onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="default">پیش‌فرض</option>
                  <option value="price_asc">ارزان‌ترین</option>
                  <option value="price_desc">گران‌ترین</option>
                </select>
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-bold text-blue-600">{filteredProducts.length}</span> محصول یافت شد
              </div>
            </div>

            {/* لیست محصولات */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-100">
                  <Zap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">هیچ محصولی با فیلترهای انتخاب شده یافت نشد</p>
                  <button onClick={() => removeFilter("all")} className="mt-3 text-blue-600 hover:text-blue-700 text-sm">حذف همه فیلترها</button>
                </div>
              ) : (
                filteredProducts.map((item) => (
                  <Link to={`/product/${item.title}`} key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col group">
                    <div className="relative w-full h-40 flex items-center justify-center mb-4 overflow-hidden">
                      <img src={item.image?.[0] || "/placeholder.png"} alt={item.title} className="object-contain max-h-full transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute bottom-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-3/4"></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span className="font-medium">{item.brand}</span>
                      <span className={item.inventory === "0" ? "text-red-500 font-medium" : "text-green-600 font-medium"}>{item.inventory === "0" ? "ناموجود" : "موجود"}</span>
                    </div>
                    <h3 className="text-gray-800 font-semibold text-sm line-clamp-2 mb-2 min-h-[40px]">{item.title}</h3>
                    
                    {/* نمایش آپشن‌های مهم محصول */}
                    {item.options && item.options.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.options.slice(0, 2).map(opt => (
                          <span key={opt.id} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {opt.choices[0]?.value || opt.name}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* نمایش مشخصات فنی */}
                    {item.specifications && item.specifications.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.specifications.slice(0, 2).map((spec, idx) => (
                          <span key={idx} className="text-[10px] bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full">
                            {spec.spec_value} {spec.spec_unit || ''}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-auto">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg font-bold text-blue-600">{Number(item.base_price).toLocaleString()} تومان</span>
                      </div>
                      {item.before_discount_price && Number(item.before_discount_price) !== Number(item.base_price) && (<span className="text-xs line-through text-gray-400">{Number(item.before_discount_price).toLocaleString()} تومان</span>)}
                    </div>
                    <button className="mt-3 w-full bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 transition-all duration-300">مشاهده محصول</button>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* بنر پایین */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl overflow-hidden shadow-xl mt-12">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          </div>
          <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-right">
              <h3 className="text-2xl font-bold text-white mb-2">مشاوره تخصصی خرید الکتروموتور</h3>
              <p className="text-blue-100 text-sm">کارشناسان ما آماده ارائه مشاوره رایگان برای انتخاب بهترین گزینه هستند</p>
            </div>
            <div className="flex gap-4">
              <a href="tel:02112345678" className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all duration-300 shadow-lg">تماس با ما</a>
              <Link to="/products" className="px-6 py-3 bg-blue-500 text-white rounded-xl font-bold text-sm hover:bg-blue-400 transition-all duration-300 border border-white/20">مشاهده همه محصولات</Link>
            </div>
          </div>
        </div>

        {/* مزایا */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {[
            { icon: Shield, title: "ضمانت اصالت", desc: "تضمین ۱۰۰٪ اصلی بودن" },
            { icon: Truck, title: "ارسال سریع", desc: "تحویل ۲۴ ساعته در تهران" },
            { icon: Award, title: "کیفیت عالی", desc: "استانداردهای بین‌المللی" },
            { icon: Zap, title: "پشتیبانی فنی", desc: "مشاوره رایگان قبل و بعد از فروش" },
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <item.icon className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <h4 className="font-bold text-xs text-gray-800">{item.title}</h4>
              <p className="text-[10px] text-gray-500 mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ElectroMotor;