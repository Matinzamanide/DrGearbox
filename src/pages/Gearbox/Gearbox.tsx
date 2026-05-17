import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { X, RefreshCw, Filter, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export interface IProduct {
  id: number;
  title: string;
  base_price: number | string;
  before_discount_price: number | string;
  brand: string;
  type: string;
  inventory: number | string;
  categoryId: string;
  description: string;
  catalog: string;
  image: string[];
  features: string[];
  specifications?: {
    spec_key: string; spec_value: string; spec_unit: string | null;
  }[];
  last_price_update: string;
  last_price_update_fa?: string;
  options: {
    id: string;
    name: string;
    is_required: string | number | boolean;
    choices: { 
      value: string; 
      price_modifier: number;
      modifier_type?: "fixed" | "percent";
    }[];
  }[];
}

interface FilterState {
  brand: string;
  category: string;
  optionFilters: Record<string, string>;
  sortBy: "default" | "price_asc" | "price_desc";
  priceRange: { min: number; max: number };
}

interface ISubCategory {
  name: string;
  link: string;
  description?: string;
  image?: string;
}

interface IGearItem {
  image: string;
  link: string;
  title: string;
  categoryId: string;
  subCategory?: ISubCategory[];
  description?: string;
  icon?: any;
}

const ALLOWED_CATEGORIES = ["101","111","112","113","114","115", "102","121","122", "103","131","132","133","134","135","136","137","138", "104","141","142","143","105","151","152","106","161","162"];

// تابع تبدیل کد دسته‌بندی به نام فارسی
const getCategoryName = (categoryId: string): string => {
  const categories: Record<string, string> = {
    "101": "گیربکس حلزونی",
    "102": "گیربکس خورشیدی",
    "103": "گیربکس هلیکال",
    "104": "گیربکس جناغی",
    "105": "گیربکس بول هلیکال",
    "106": "گیربکس سیکلوئیدی",
    "111": "حلزونی VF",
    "112": "حلزونی کتابی VF/U",
    "113": "مکعبی چینی NMRV",
    "114": "مرکب مکعب چینی NMRV",
    "115": "حلزونی خاص",
    "121": "گیربکس سیاره ای طرح رجیانا",
    "122": "سیاره ای خاص",
    "131": "PM طرح روسی / قورباغه ای",
    "132": "شافت مستقیم سری G",
    "133": "سری R طرح SEW",
    "134": "سری F طرح SEW",
    "135": "سری DG",
    "136": "سری SZN طرح فلندر",
    "137": "دو محور طرح روسی",
    "138": "هلیکال خاص",
    "141": "خط نورد 1.5 Mw",
    "142": "خط نورد 1 Mw",
    "143": "جناغی خاص",
    "151": "گیربکس سری K طرح SEW / پارس گرجی صنعت",
    "152": "بول هلیکال خاص",
    "161": "سیکلوئیدی چینی سری 8000",
    "162": "سیکلوئیدی خاص"
  };
  return categories[categoryId] || `دسته ${categoryId}`;
};

const Gearbox = () => {
  const [data, setData] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000000 });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedCategoryData, setExpandedCategoryData] = useState<IGearItem | null>(null);
  
  const [filters, setFilters] = useState<FilterState>({
    brand: "",
    category: "",
    optionFilters: {},
    sortBy: "default",
    priceRange: { min: 0, max: 100000000 }
  });

  const gearItems: IGearItem[] = [
    { 
      image: "https://www.kalasanati.com/Portals/0/CKEditorFiles/www.kalasanati.com_helikal_113989215.webp", 
      link: "/گیربکس/گیربکس-هلیکال", 
      title: "گیربکس هلیکال", 
      categoryId: "131",
      description: "گیربکس‌های هلیکال با راندمان بالا و صدای کم، مناسب برای صنایع سنگین",
      subCategory: [
        { name: "PM طرح روسی / قورباغه ای", link: "/دسته-بندی-محصولات/گیربکس/هلیکال/روسی/131", description: "گیربکس قورباغه ای مناسب برای فضاهای محدود", image: "https://www.kalasanati.com/Portals/0/CKEditorFiles/www.kalasanati.com_helikal_113989215.webp" },
        { name: "شافت مستقیم سری G", link: "/دسته-بندی-محصولات/گیربکس/هلیکال/شافت-مستقیم-سریG/132", description: "گیربکس بول هلیکال با توان بالا", image: "https://www.kalasanati.com/Portals/0/CKEditorFiles/www.kalasanati.com_helikal_113989215.webp" },
        { name: "سری R طرح SEW", link: "/دسته-بندی-محصولات/گیربکس/هلیکال/سری R طرح SEW/133", description: "گیربکس هلیکال موازی با شافت ورودی و خروجی موازی", image: "https://www.kalasanati.com/Portals/0/CKEditorFiles/www.kalasanati.com_helikal_113989215.webp" },
        { name: "سری F طرح SEW", link: "/دسته-بندی-محصولات/گیربکس/هلیکال/سری F طرح SEW/133", description: "گیربکس هلیکال موازی با شافت ورودی و خروجی موازی", image: "https://www.kalasanati.com/Portals/0/CKEditorFiles/www.kalasanati.com_helikal_113989215.webp" },
        { name: "سری DG", link: "/دسته-بندی-محصولات/گیربکس/هلیکال/سری DG/135", description: "گیربکس هلیکال موازی با شافت ورودی و خروجی موازی", image: "https://www.kalasanati.com/Portals/0/CKEditorFiles/www.kalasanati.com_helikal_113989215.webp" },
        { name: "سری SZN طرح فلندر Flender", link: "/دسته-بندی-محصولات/گیربکس/هلیکال/سری SZN طرح فلندر/136", description: "گیربکس هلیکال موازی با شافت ورودی و خروجی موازی", image: "https://www.kalasanati.com/Portals/0/CKEditorFiles/www.kalasanati.com_helikal_113989215.webp" },
        { name: "دو محور طرح روسی", link: "/دسته-بندی-محصولات/گیربکس/هلیکال/دو-محور-طرح-روسی/137", description: "گیربکس هلیکال موازی با شافت ورودی و خروجی موازی", image: "https://www.kalasanati.com/Portals/0/CKEditorFiles/www.kalasanati.com_helikal_113989215.webp" },
        { name: "هلیکال خاص", link: "/دسته-بندی-محصولات/گیربکس/هلیکال/هلیکال-خاص/138", description: "گیربکس هلیکال موازی با شافت ورودی و خروجی موازی", image: "https://www.kalasanati.com/Portals/0/CKEditorFiles/www.kalasanati.com_helikal_113989215.webp" },
      ]
    },
    { 
      image: "https://www.kalasanati.com/Portals/0/CKEditorFiles/www.kalasanati.com_halazoni_1511325582.webp", 
      link: "/گیربکس/گیربکس-حلزونی", 
      title: "گیربکس حلزونی", 
      categoryId: "111",
      description: "گیربکس‌های حلزونی با عملکرد بی صدا و قفل شوندگی مناسب برای بالابرها",
      subCategory: [
        { name: "حلزونی VF", link: "/دسته-بندی-محصولات/گیربکس/حلزونی/VF-حلزونی/111", description: "گیربکس حلزونی سری NMRV با بدنه آلومینیومی", image: "https://www.kalasanati.com/Portals/0/CKEditorFiles/www.kalasanati.com_halazoni_1511325582.webp" },
        { name: "حلزونی کتابی VF/U", link: "/دسته-بندی-محصولات/گیربکس/حلزونی/VFU-حلزونی-کتابی/112", description: "گیربکس حلزونی سری VF با بدنه چدنی", image: "https://www.kalasanati.com/Portals/0/CKEditorFiles/www.kalasanati.com_halazoni_1511325582.webp" },
        { name: "مکعبی چینی NMRV", link: "/دسته-بندی-محصولات/گیربکس/حلزونی/NMRV-مکعبی-چینی/113", description: "گیربکس حلزونی سری W با طراحی خاص", image: "https://www.kalasanati.com/Portals/0/CKEditorFiles/www.kalasanati.com_halazoni_1511325582.webp" },
        { name: "مرکب مکعب چینی NMRV", link: "/دسته-بندی-محصولات/گیربکس/حلزونی/NMRV-مرکب-مکعب-چینی/114", description: "گیربکس هلیکال موازی با شافت ورودی و خروجی موازی", image: "https://www.kalasanati.com/Portals/0/CKEditorFiles/www.kalasanati.com_helikal_113989215.webp" },
        { name: "حلزونی خاص", link: "/دسته-بندی-محصولات/گیربکس/حلزونی/حلزونی-خاص/115", description: "گیربکس هلیکال موازی با شافت ورودی و خروجی موازی", image: "https://www.kalasanati.com/Portals/0/CKEditorFiles/www.kalasanati.com_helikal_113989215.webp" },
        
      ]
    },
    { 
      image: "https://www.kalasanati.com/Portals/0/CKEditorFiles/www.kalasanati.com_83129539.webp", 
      link: "/گیربکس/گیربکس-سیاره-ای", 
      title: "گیربکس سیاره-ای", 
      categoryId: "121",
      description: "گیربکس‌های خورشیدی با دقت بالا و گشتاور خروجی عالی",
      subCategory: [
        { name: "گیربکس سیاره ای طرح رجیانا Reggiana", link: "/دسته-بندی-محصولات/گیربکس/سیاره-ای/سیاره-ای-طرح-regianna/121", description: "گیربکس هلیکال موازی با شافت ورودی و خروجی موازی", image: "https://www.kalasanati.com/Portals/0/CKEditorFiles/www.kalasanati.com_helikal_113989215.webp" },
        { name: "سیاره ای خاص", link: "/دسته-بندی-محصولات/گیربکس/سیاره-ای/سیاره-ای-خاص/122", description: "گیربکس هلیکال موازی با شافت ورودی و خروجی موازی", image: "https://www.kalasanati.com/Portals/0/CKEditorFiles/www.kalasanati.com_helikal_113989215.webp" },

      ]
    },
    { 
      image: "https://www.kalasanati.com/Portals/0/CKEditorFiles/www.kalasanati.com_gerbox_705788055.webp", 
      link: "/گیربکس/گیربکس-جناغی", 
      title: "گیربکس جناغی", 
      categoryId: "141",
      description: "گیربکس‌های جناغی با تحمل بار بالا و عمر طولانی",
      subCategory: [
        { name: "خط نورد 1.5 Mw", link:  "/دسته-بندی-محصولات/گیربکس/جناغی/خط-نورد-1Mw/141", description: "گیربکس جناغی سری Z با طراحی فشرده", image: "https://www.kalasanati.com/Portals/0/CKEditorFiles/www.kalasanati.com_gerbox_705788055.webp" },
        { name: "خط نورد 1 Mw", link: "/دسته-بندی-محصولات/گیربکس/جناغی/خط-نورد-1.5Mw/142", description: "گیربکس جناغی سری Z با طراحی فشرده", image: "https://www.kalasanati.com/Portals/0/CKEditorFiles/www.kalasanati.com_gerbox_705788055.webp" },
        { name: "سری H", link: "/دسته-بندی-محصولات/گیربکس/جناغی/جناغی-خاص/143", description: "گیربکس جناغی سری H با توان بالا", image: "https://www.kalasanati.com/Portals/0/CKEditorFiles/www.kalasanati.com_gerbox_705788055.webp" },
      ]
    },
    { 
      image: "https://www.kalasanati.com/Portals/0/CKEditorFiles/www.kalasanati.com_gerbox_705788055.webp", 
      link: "/گیربکس/بول-هلیکال", 
      title: "گیربکس بول هلیکال", 
      categoryId: "151",
      description: "گیربکس‌های جناغی با تحمل بار بالا و عمر طولانی",
      subCategory: [
        { name: "گیربکس سری K طرح SEW  / پارس گرجی صنعت", link: "/دسته-بندی-محصولات/گیربکس/بول-هلیکال/پارس-گرجی-صنعت/151", description: "گیربکس هلیکال موازی با شافت ورودی و خروجی موازی", image: "https://www.kalasanati.com/Portals/0/CKEditorFiles/www.kalasanati.com_helikal_113989215.webp" },
        { name: "بول هلیکال خاص", link: "/دسته-بندی-محصولات/گیربکس/بول-هلیکال/بول-هلیکال-خاص/152", description: "گیربکس هلیکال موازی با شافت ورودی و خروجی موازی", image: "https://www.kalasanati.com/Portals/0/CKEditorFiles/www.kalasanati.com_helikal_113989215.webp" },

      ]
    },
    { 
      image: "https://www.kalasanati.com/Portals/0/CKEditorFiles/www.kalasanati.com_gerbox_705788055.webp", 
      link: "/گیربکس/سیکلوئیدی", 
      title: "گیربکس سیکلوئیدی", 
      categoryId: "161",
      description: "گیربکس‌های جناغی با تحمل بار بالا و عمر طولانی",
      subCategory: [
        { name: "سیکلوئیدی چینی سری 8000", link: "/دسته-بندی-محصولات/گیربکس/سیکلوئیدی/سیکلوئیدی-چینی-سری-8000/161", description: "گیربکس هلیکال موازی با شافت ورودی و خروجی موازی", image: "https://www.kalasanati.com/Portals/0/CKEditorFiles/www.kalasanati.com_helikal_113989215.webp" },
        { name: "سیکلوئیدی خاص", link: "/دسته-بندی-محصولات/گیربکس/سیکلوئیدی/سیکلوئیدی-خاص/162", description: "گیربکس هلیکال موازی با شافت ورودی و خروجی موازی", image: "https://www.kalasanati.com/Portals/0/CKEditorFiles/www.kalasanati.com_helikal_113989215.webp" },

      ]
    },
  ];

  // استخراج گزینه‌های موجود بر اساس فیلترهای اعمال شده
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

  // استخراج برندهای موجود
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

  // استخراج دسته‌بندی‌های موجود
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
    
    const categories = new Set(filtered.map(p => p.categoryId).filter(Boolean));
    return Array.from(categories).filter(cat => ALLOWED_CATEGORIES.includes(cat)).sort();
  }, [data, filters.brand, filters.optionFilters]);

  // استخراج گزینه‌های هر آپشن
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

  // اعمال همه فیلترها
  useEffect(() => {
    let filtered = [...data];
    
    filtered = filtered.filter(item => ALLOWED_CATEGORIES.includes(item.categoryId));
    
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
  }, [data, filters]);

  // دریافت داده‌ها
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios("https://electroshahresfahan.com/drgearbox/get_products.php");
        const products = res.data.products || [];
        const allowedProducts = products.filter((p: IProduct) => ALLOWED_CATEGORIES.includes(p.categoryId));
        setData(allowedProducts);
        
        const prices = allowedProducts.map((p: IProduct) => Number(p.base_price)).filter((p: number) => p > 0);
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
      brand: brand,
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
      category: category,
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
        sortBy: "default",
        priceRange: { min: priceRange.min, max: priceRange.max }
      }));
    }
  };

  const handleCategoryClick = (categoryId: string, categoryData: IGearItem) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
      setExpandedCategoryData(null);
    } else {
      setExpandedCategory(categoryId);
      setExpandedCategoryData(categoryData);
      setFilters(prev => ({ ...prev, category: categoryId, optionFilters: {} }));
    }
    if (window.innerWidth < 1024) {
      setMobileFiltersOpen(false);
    }
        window.scrollTo({top:1200,behavior:"smooth"})
  };































  const closeExpandedPanel = () => {
    setExpandedCategory(null);
    setExpandedCategoryData(null);
  };

  const activeFiltersCount = [
    filters.brand ? 1 : 0,
    filters.category ? 1 : 0,
    ...Object.values(filters.optionFilters).filter(v => v).map(() => 1)
  ].length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  }

  return (
    <section className="w-full max-w-7xl mx-auto my-16 px-4 md:px-8 font-sans" dir="rtl">
      
      {/* بخش عناوین */}
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">گیربکس‌های صنعتی</h2>
        <h3 className="text-sm md:text-base text-gray-500 font-medium">
          مشخصات فنی، کاتالوگ و قیمت لحظه‌ای (بهار ۱۴۰۵) با گارانتی و مشاوره فنی رایگان
        </h3>
        <div className="w-16 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
      </div>

      {/* گرید دسته‌بندی‌ها */}
      <div className="relative">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-6 gap-6 lg:gap-8">
          {gearItems.map((item, index) => {
            const isExpanded = expandedCategory === item.categoryId;
            
            return (
              <div key={index} className="flex flex-col">
                {/* کارت اصلی */}
                <button
                  onClick={() => handleCategoryClick(item.categoryId, item)}
                  className={`group flex flex-col items-center justify-center p-6 bg-white rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                    isExpanded 
                      ? 'border-blue-500 shadow-lg ring-2 ring-blue-200 bg-blue-50/30' 
                      : 'border-gray-100 shadow-sm hover:shadow-xl'
                  }`}
                >
                  <div className="relative w-full h-48 flex items-center justify-center mb-4">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110" 
                    />
                    {isExpanded && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <ChevronUp className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="w-0 h-0.5 bg-blue-500 group-hover:w-1/2 transition-all duration-300"></div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-sm font-medium transition-colors ${isExpanded ? 'text-blue-600' : 'text-gray-600'}`}>
                      {item.title}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* پنل بازشونده در پایین گرید - به اندازه کل عرض صفحه */}
        {expandedCategory && expandedCategoryData && (
          <div className="mt-8 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden animate-fade-in-up">
            {/* هدر پنل */}
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img 
                  src={expandedCategoryData.image} 
                  alt={expandedCategoryData.title} 
                  className="w-12 h-12 rounded-lg object-contain bg-white/20 p-1" 
                />
                <div>
                  <h3 className="text-xl font-bold text-white">{expandedCategoryData.title}</h3>
                  <p className="text-sm text-blue-200">{expandedCategoryData.description}</p>
                </div>
              </div>
              <button
                onClick={closeExpandedPanel}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* لیست زیرمجموعه‌ها */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                <h4 className="text-lg font-bold text-gray-800">زیرمجموعه‌های {expandedCategoryData.title}</h4>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {expandedCategoryData.subCategory?.length || 0} محصول
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {expandedCategoryData.subCategory?.map((sub, subIndex) => (
                  <Link
                    key={subIndex}
                    to={sub.link}
                    className="group flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-blue-200"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img 
                        src={sub.image || expandedCategoryData.image} 
                        alt={sub.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {sub.name}
                      </h5>
                      {sub.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{sub.description}</p>
                      )}
                      <span className="inline-flex items-center gap-1 text-xs text-blue-600 mt-2 group-hover:gap-2 transition-all">
                        مشاهده محصولات
                        <ArrowLeft className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* دکمه مشاهده همه */}
              <div className="mt-6 text-center">
                {/* <Link
                  to={expandedCategoryData.link}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md"
                >
                  مشاهده همه محصولات {expandedCategoryData.title}
                  <ArrowLeft className="w-4 h-4" />
                </Link> */}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* دکمه فیلتر در موبایل */}
      <div className="lg:hidden mb-4 mt-8">
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm"
        >
          <Filter className="w-5 h-5 text-blue-600" />
          <span className="font-medium">فیلترها</span>
          {activeFiltersCount > 0 && (
            <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${mobileFiltersOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* بخش اصلی با دو ستون */}
      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        
        {/* سایدبار فیلترها */}
        <div className={`lg:w-80 flex-shrink-0 ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-20">
            
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-600" />
                فیلترها
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
                    <input
                      type="number"
                      placeholder="از"
                      value={filters.priceRange.min}
                      onChange={(e) => setFilters(prev => ({ ...prev, priceRange: { ...prev.priceRange, min: Number(e.target.value) } }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="تا"
                      value={filters.priceRange.max}
                      onChange={(e) => setFilters(prev => ({ ...prev, priceRange: { ...prev.priceRange, max: Number(e.target.value) } }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min={priceRange.min}
                  max={priceRange.max}
                  value={filters.priceRange.max}
                  onChange={(e) => setFilters(prev => ({ ...prev, priceRange: { ...prev.priceRange, max: Number(e.target.value) } }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{priceRange.min.toLocaleString()}</span>
                  <span>{priceRange.max.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* فیلتر برند */}
            {availableBrands.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 text-sm">برند</h4>
                <select
                  value={filters.brand}
                  onChange={(e) => handleBrandChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">همه برندها</option>
                  {availableBrands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
            )}

            {/* فیلتر دسته‌بندی */}
            {availableCategories.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 text-sm">دسته‌بندی</h4>
                <select
                  value={filters.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
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
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
              >
                بستن فیلترها
              </button>
            </div>
          </div>
        </div>

        {/* بخش محصولات */}
        <div className="flex-1">
          
          {/* نمایش فیلترهای فعال */}
          {activeFiltersCount > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-xl">
              <span className="text-xs text-gray-500 ml-2">فیلترهای فعال:</span>
              {filters.brand && (
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  برند: {filters.brand}
                  <button onClick={() => removeFilter("brand")} className="hover:bg-blue-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {filters.category && (
                <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                  دسته: {getCategoryName(filters.category)}
                  <button onClick={() => removeFilter("category")} className="hover:bg-green-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {Object.entries(filters.optionFilters).map(([optName, optValue]) => optValue && (
                <div key={optName} className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                  {optName}: {optValue}
                  <button onClick={() => removeFilter("option", optName)} className="hover:bg-purple-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button onClick={() => removeFilter("all")} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1">
                <RefreshCw className="w-3 h-3" />
                حذف همه
              </button>
            </div>
          )}

          {/* نوار ابزار */}
          <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">مرتب‌سازی:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
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
                <div className="text-gray-400 mb-2">🛒</div>
                <p className="text-gray-500">هیچ محصولی با فیلترهای انتخاب شده یافت نشد</p>
                <button onClick={() => removeFilter("all")} className="mt-3 text-blue-600 hover:text-blue-700 text-sm">
                  حذف همه فیلترها
                </button>
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
                    <span className={item.inventory === "0" ? "text-red-500 font-medium" : "text-green-600 font-medium"}>
                      {item.inventory === "0" ? "ناموجود" : "موجود"}
                    </span>
                  </div>
                  <h3 className="text-gray-800 font-semibold text-sm line-clamp-2 mb-2 min-h-[40px]">{item.title}</h3>
                  <div className="mt-auto">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg font-bold text-blue-600">{Number(item.base_price).toLocaleString()} تومان</span>
                    </div>
                    {item.before_discount_price && Number(item.before_discount_price) !== Number(item.base_price) && (
                      <span className="text-xs line-through text-gray-400">{Number(item.before_discount_price).toLocaleString()} تومان</span>
                    )}
                  </div>
                  {item.options && item.options.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.options.slice(0, 2).map(opt => (
                        <span key={opt.id} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {opt.choices[0]?.value || opt.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <button className="mt-3 w-full bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 transition-all duration-300">
                    مشاهده محصول
                  </button>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default Gearbox;