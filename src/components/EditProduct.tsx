// pages/admin/EditProduct.tsx
import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { 
  Package, Upload, X, Plus, Trash2, 
  Image as ImageIcon, FileText, Settings, 
  CheckCircle, AlertCircle, Loader2, 
  ChevronLeft, DollarSign, 
  ShoppingBag, Database, Layers, Sparkles, Link as LinkIcon,
  Ruler, Gauge, Weight, Zap, Thermometer, Wind, Percent,
  Edit, RefreshCw, Clock, Calendar
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import type { IProduct } from "../pages/Product/Product";

// ============================================
// تایپ‌ها
// ============================================
interface IChoice {
  value: string;
  price_modifier: number;
  modifier_type: "fixed" | "percent";
}

interface IOption {
  id: string;
  name: string;
  is_required: boolean;
  choices: IChoice[];
}

interface ISpecification {
  spec_key: string;
  spec_value: string;
  spec_unit: string | null;
}

interface ICategory {
  id: string;
  name: string;
  parentId: string | null;
}

// ============================================
// توابع کمکی برای تاریخ
// ============================================
const convertToPersianDate = (date: Date): string => {
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date);
};

const getCurrentPersianDate = (): string => {
  return convertToPersianDate(new Date());
};

const getCurrentMySQLTimestamp = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const convertGregorianToPersian = (gregorianDate: string): string => {
  if (!gregorianDate) return "";
  const date = new Date(gregorianDate);
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);
};

// ============================================
// کامپوننت اصلی
// ============================================
const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || "0");

  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [originalBasePrice, setOriginalBasePrice] = useState<number>(0);
  const [priceChanged, setPriceChanged] = useState<boolean>(false);
  const [selectedUpdateDate, setSelectedUpdateDate] = useState<string>("");
  
  // State برای دسته‌بندی سلسله‌مراتبی
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [selectedChildCategory, setSelectedChildCategory] = useState<string>("");
  
  const [formData, setFormData] = useState<IProduct>({
    id: 0,
    title: "",
    base_price: 0,
    before_discount_price: 0,
    brand: "",
    type: "",
    last_price_update: "",
    last_price_update_fa: "",
    inventory: 0,
    categoryId: 0,
    description: "",
    catalog: "",
    image: [],
    features: [],
    options: [],
    specifications: []
  });

  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingCatalog, setUploadingCatalog] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [activeImageTab, setActiveImageTab] = useState<"upload" | "url">("upload");
  const [customSpecKey, setCustomSpecKey] = useState("");
  const [customSpecValue, setCustomSpecValue] = useState("");
  const [customSpecUnit, setCustomSpecUnit] = useState("");
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  // ============================================
  // بررسی تغییر قیمت
  // ============================================
  useEffect(() => {
    if (originalBasePrice !== 0 && Number(formData.base_price) !== originalBasePrice) {
      setPriceChanged(true);
    } else {
      setPriceChanged(false);
    }
  }, [formData.base_price, originalBasePrice]);

  // ============================================
  // دریافت اطلاعات محصول و دسته‌بندی‌ها
  // ============================================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://electroshahresfahan.com/drgearbox/get_products.php");
        if (response.data.categories) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId || productId === 0) {
        setMessage({ type: "error", text: "شناسه محصول معتبر نیست" });
        setFetching(false);
        return;
      }

      setFetching(true);
      try {
        const response = await axios.get(`https://electroshahresfahan.com/drgearbox/get_products.php?id=${productId}`);
        
        let productData = null;
        
        if (response.data.success && response.data.product) {
          productData = response.data.product;
        } else if (response.data.products && response.data.products.length > 0) {
          productData = response.data.products[0];
        } else if (response.data.product) {
          productData = response.data.product;
        }
        
        if (productData) {
          let discount = 0;
          const beforePrice = Number(productData.before_discount_price) || 0;
          const basePrice = Number(productData.base_price) || 0;
          
          if (beforePrice > 0 && beforePrice > basePrice) {
            discount = Math.round(((beforePrice - basePrice) / beforePrice) * 100);
          }
          setDiscountPercent(discount);
          setOriginalBasePrice(basePrice);
          
          if (productData.last_price_update) {
            const datePart = productData.last_price_update.split(' ')[0];
            setSelectedUpdateDate(datePart);
          }
          
          let specifications: ISpecification[] = [];
          if (productData.specifications && Array.isArray(productData.specifications)) {
            specifications = productData.specifications.map((spec: any) => ({
              spec_key: spec.spec_key || spec.key || "",
              spec_value: spec.spec_value || spec.value || "",
              spec_unit: spec.spec_unit || spec.unit || null
            }));
          }
          
          let options: IOption[] = [];
          if (productData.options && Array.isArray(productData.options)) {
            options = productData.options.map((opt: any) => ({
              id: opt.id || opt.option_key || "",
              name: opt.name || "",
              is_required: opt.is_required === 1 || opt.is_required === true,
              choices: (opt.choices || []).map((choice: any) => ({
                value: choice.value || "",
                price_modifier: Number(choice.price_modifier) || 0,
                modifier_type: choice.modifier_type === "percent" ? "percent" : "fixed"
              }))
            }));
          }
          
          setFormData({
            id: productData.id,
            title: productData.title || "",
            base_price: basePrice,
            before_discount_price: beforePrice || "",
            brand: productData.brand || "",
            type: productData.type || "",
            inventory: productData.inventory || 0,
            categoryId: productData.categoryId || productData.category_id || 0,
            description: productData.description || "",
            catalog: productData.catalog || "",
            image: productData.image || productData.images || [],
            features: productData.features || [],
            options: options,
            specifications: specifications,
            last_price_update: productData.last_price_update || "",
            last_price_update_fa: productData.last_price_update_fa || ""
          });
        } else {
          setMessage({ type: "error", text: `محصول با شناسه ${productId} یافت نشد` });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setMessage({ type: "error", text: "خطا در دریافت اطلاعات محصول" });
      } finally {
        setFetching(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // تنظیم مسیر دسته‌بندی هنگام بارگذاری محصول
  useEffect(() => {
    if (formData.categoryId && categories.length > 0) {
      const findCategoryPath = (catId: number, path: string[] = []): string[] => {
        const cat = categories.find(c => Number(c.id) === catId);
        if (!cat) return path;
        path.unshift(cat.id);
        if (cat.parentId) {
          return findCategoryPath(Number(cat.parentId), path);
        }
        return path;
      };
      
      const path = findCategoryPath(formData.categoryId);
      
      setSelectedMainCategory(path[0] || "");
      setSelectedSubCategory(path[1] || "");
      setSelectedChildCategory(path[2] || "");
    }
  }, [formData.categoryId, categories]);

  // استخراج دسته‌بندی‌های اصلی
  const mainCategories = categories.filter(cat => cat.parentId === null);
  
  // استخراج زیردسته‌ها بر اساس دسته‌بندی اصلی انتخاب شده
  const subCategories = categories.filter(cat => cat.parentId === selectedMainCategory && selectedMainCategory !== "");
  
  // استخراج زیرشاخه‌های سطح دوم
  const childCategories = categories.filter(cat => cat.parentId === selectedSubCategory && selectedSubCategory !== "");

  // هنگامی که دسته‌بندی اصلی تغییر می‌کند
  const handleMainCategoryChange = (mainCatId: string) => {
    setSelectedMainCategory(mainCatId);
    setSelectedSubCategory("");
    setSelectedChildCategory("");
    setFormData(prev => ({ ...prev, categoryId: 0 }));
  };

  // هنگامی که زیردسته تغییر می‌کند
  const handleSubCategoryChange = (subCatId: string) => {
    setSelectedSubCategory(subCatId);
    setSelectedChildCategory("");
    setFormData(prev => ({ ...prev, categoryId: Number(subCatId) }));
  };

  // هنگامی که زیرشاخه سطح دوم تغییر می‌کند
  const handleChildCategoryChange = (childCatId: string) => {
    setSelectedChildCategory(childCatId);
    setFormData(prev => ({ ...prev, categoryId: Number(childCatId) }));
  };

  // ============================================
  // محاسبه خودکار قیمت بر اساس درصد تخفیف
  // ============================================
  const handleBeforePriceChange = (value: number) => {
    setFormData(prev => ({ ...prev, before_discount_price: value }));
    
    if (value > 0 && discountPercent > 0) {
      const discountedPrice = value - (value * discountPercent / 100);
      setFormData(prev => ({ ...prev, base_price: Math.round(discountedPrice) }));
    }
  };

  const handleDiscountPercentChange = (percent: number) => {
    setDiscountPercent(percent);
    
    const beforePrice = Number(formData.before_discount_price);
    if (beforePrice > 0 && percent > 0) {
      const discountedPrice = beforePrice - (beforePrice * percent / 100);
      setFormData(prev => ({ ...prev, base_price: Math.round(discountedPrice) }));
    } else if (percent === 0 && beforePrice > 0) {
      setFormData(prev => ({ ...prev, base_price: beforePrice }));
    }
  };

  const handleBasePriceChange = (value: number) => {
    setFormData(prev => ({ ...prev, base_price: value }));
    
    const beforePrice = Number(formData.before_discount_price);
    if (beforePrice > 0 && value > 0) {
      const percent = ((beforePrice - value) / beforePrice) * 100;
      setDiscountPercent(Math.round(percent));
    }
  };

  // ============================================
  // هندلر تغییر تاریخ بروزرسانی
  // ============================================
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setSelectedUpdateDate(newDate);
    
    const persianDate = convertGregorianToPersian(newDate);
    
    setFormData(prev => ({
      ...prev,
      last_price_update: newDate,
      last_price_update_fa: persianDate
    }));
  };

  // ============================================
  // لیست پیشنهادی برای مشخصات فنی
  // ============================================
  const commonSpecs = [
    { key: "power", label: "قدرت", icon: Zap, unit: "kW" },
    { key: "torque", label: "گشتاور", icon: Gauge, unit: "Nm" },
    { key: "ratio", label: "نسبت تبدیل", icon: Settings, unit: "" },
    { key: "weight", label: "وزن", icon: Weight, unit: "kg" },
    { key: "protection", label: "درجه حفاظت", icon: Settings, unit: "IP" },
    { key: "efficiency", label: "راندمان", icon: Settings, unit: "%" },
    { key: "input_speed", label: "سرعت ورودی", icon: Zap, unit: "rpm" },
    { key: "output_speed", label: "سرعت خروجی", icon: Zap, unit: "rpm" },
    { key: "temperature", label: "دمای کاری", icon: Thermometer, unit: "°C" },
    { key: "noise", label: "نویز", icon: Wind, unit: "dB" },
    { key: "voltage", label: "ولتاژ", icon: Zap, unit: "V" },
    { key: "current", label: "جریان", icon: Zap, unit: "A" },
    { key: "frequency", label: "فرکانس", icon: Settings, unit: "Hz" },
  ];

  // ============================================
  // آپلود تصاویر
  // ============================================
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setUploadingImages(true);
    const uploadFormData = new FormData();
    
    acceptedFiles.forEach(file => {
      uploadFormData.append("images[]", file);
    });
    uploadFormData.append("product_id", String(productId));
    uploadFormData.append("upload_type", "image");
    
    try {
      const response = await axios.post(
        "https://electroshahresfahan.com/drgearbox/upload_file.php",
        uploadFormData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      
      if (response.data.success) {
        const urls = response.data.image_urls || [response.data.image_url];
        setFormData(prev => ({
          ...prev,
          image: [...prev.image, ...urls]
        }));
        setMessage({ type: "success", text: "تصاویر با موفقیت آپلود شد" });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      setMessage({ type: "error", text: "خطا در آپلود تصویر" });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setUploadingImages(false);
    }
  }, [productId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"] },
    maxSize: 50 * 1024 * 1024
  });

  const addImageByUrl = () => {
    if (!imageUrlInput.trim()) {
      setMessage({ type: "error", text: "لطفاً آدرس تصویر را وارد کنید" });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    
    const urlPattern = /^(https?:\/\/.*\.(jpg|jpeg|png|gif|webp|svg))$/i;
    if (!urlPattern.test(imageUrlInput)) {
      setMessage({ type: "error", text: "آدرس تصویر معتبر نیست" });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      image: [...prev.image, imageUrlInput]
    }));
    setImageUrlInput("");
    setMessage({ type: "success", text: "تصویر با موفقیت اضافه شد" });
    setTimeout(() => setMessage(null), 3000);
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index)
    }));
  };

  // ============================================
  // آپلود کاتالوگ
  // ============================================
  const handleCatalogUpload = async (file: File) => {
    setUploadingCatalog(true);
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("product_id", String(productId));
    uploadFormData.append("upload_type", "catalog");
    
    try {
      const response = await axios.post(
        "https://electroshahresfahan.com/drgearbox/upload_file.php",
        uploadFormData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      
      if (response.data.success) {
        setFormData(prev => ({ ...prev, catalog: response.data.catalog_url }));
        setMessage({ type: "success", text: "کاتالوگ با موفقیت آپلود شد" });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      setMessage({ type: "error", text: "خطا در آپلود کاتالوگ" });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setUploadingCatalog(false);
    }
  };

  // ============================================
  // مدیریت ویژگی‌ها
  // ============================================
  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ""] }));
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const removeFeature = (index: number) => {
    if (formData.features.length > 1) {
      setFormData(prev => ({
        ...prev,
        features: prev.features.filter((_, i) => i !== index)
      }));
    } else {
      setFormData(prev => ({ ...prev, features: [""] }));
    }
  };

  // ============================================
  // مدیریت آپشن‌ها
  // ============================================
  const addOption = () => {
    const newOption: IOption = {
      id: `opt_${Date.now()}`,
      name: "",
      is_required: false,
      choices: [{ value: "", price_modifier: 0, modifier_type: "fixed" }]
    };
    setFormData(prev => ({ ...prev, options: [...prev.options, newOption] }));
  };

  const updateOption = (index: number, field: keyof IOption, value: any) => {
    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const removeOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const addChoice = (optionIndex: number) => {
    const newOptions = [...formData.options];
    newOptions[optionIndex].choices.push({ 
      value: "", 
      price_modifier: 0, 
      modifier_type: "fixed" 
    });
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const updateChoice = (optionIndex: number, choiceIndex: number, field: keyof IChoice, value: any) => {
    const newOptions = [...formData.options];
    newOptions[optionIndex].choices[choiceIndex] = {
      ...newOptions[optionIndex].choices[choiceIndex],
      [field]: field === "price_modifier" ? Number(value) : value
    };
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const removeChoice = (optionIndex: number, choiceIndex: number) => {
    const newOptions = [...formData.options];
    if (newOptions[optionIndex].choices.length > 1) {
      newOptions[optionIndex].choices = newOptions[optionIndex].choices.filter((_, i) => i !== choiceIndex);
      setFormData(prev => ({ ...prev, options: newOptions }));
    }
  };

  // ============================================
  // مدیریت مشخصات فنی
  // ============================================
  const addSpecification = () => {
    if (!customSpecKey.trim() || !customSpecValue.trim()) {
      setMessage({ type: "error", text: "لطفاً کلید و مقدار مشخصه را وارد کنید" });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      specifications: [...(prev.specifications || []), {
        spec_key: customSpecKey,
        spec_value: customSpecValue,
        spec_unit: customSpecUnit || null
      }]
    }));
    
    setCustomSpecKey("");
    setCustomSpecValue("");
    setCustomSpecUnit("");
  };

  const addCommonSpec = (specKey: string, _specLabel: string, defaultUnit: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: [...(prev.specifications || []), {
        spec_key: specKey,
        spec_value: "",
        spec_unit: defaultUnit || null
      }]
    }));
  };

  const updateSpecification = (index: number, field: keyof ISpecification, value: string) => {
    const currentSpecs = formData.specifications || [];
    const newSpecs = [...currentSpecs];
    if (newSpecs[index]) {
      newSpecs[index] = { ...newSpecs[index], [field]: value };
      setFormData(prev => ({ ...prev, specifications: newSpecs }));
    }
  };

  const removeSpecification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications: (prev.specifications || []).filter((_, i) => i !== index)
    }));
  };

  // ============================================
  // ارسال فرم (بروزرسانی)
  // ============================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setMessage({ type: "error", text: "عنوان محصول الزامی است" });
      return;
    }
    
    if (Number(formData.base_price) <= 0) {
      setMessage({ type: "error", text: "قیمت پایه معتبر الزامی است" });
      return;
    }
    
    if (!formData.brand.trim()) {
      setMessage({ type: "error", text: "برند محصول الزامی است" });
      return;
    }
    
    if (!formData.type.trim()) {
      setMessage({ type: "error", text: "نوع محصول الزامی است" });
      return;
    }
    
    if (formData.categoryId === 0) {
      setMessage({ type: "error", text: "دسته‌بندی محصول الزامی است" });
      return;
    }
    
    if (formData.image.length === 0) {
      setMessage({ type: "error", text: "حداقل یک تصویر برای محصول الزامی است" });
      return;
    }
    
    setSubmitting(true);
    
    try {
      const submitData = new FormData();
      
      submitData.append("id", String(formData.id));
      submitData.append("title", formData.title);
      submitData.append("base_price", String(formData.base_price));
      if (formData.before_discount_price && Number(formData.before_discount_price) > 0) {
        submitData.append("before_discount_price", String(formData.before_discount_price));
      }
      submitData.append("brand", formData.brand);
      submitData.append("type", formData.type);
      submitData.append("inventory", String(formData.inventory));
      submitData.append("categoryId", String(formData.categoryId));
      submitData.append("description", formData.description);
      submitData.append("catalog", formData.catalog);
      submitData.append("image", JSON.stringify(formData.image));
      submitData.append("features", JSON.stringify(formData.features.filter(f => f.trim() !== "")));
      
      if (selectedUpdateDate) {
        const timePart = formData.last_price_update?.split(' ')[1] || "00:00:00";
        const fullDateTime = `${selectedUpdateDate} ${timePart}`;
        const persianDate = convertGregorianToPersian(selectedUpdateDate);
        submitData.append("last_price_update", fullDateTime);
        submitData.append("last_price_update_date", persianDate);
      } else if (priceChanged) {
        const currentMySQLTimestamp = getCurrentMySQLTimestamp();
        const currentPersianDate = getCurrentPersianDate();
        submitData.append("last_price_update", currentMySQLTimestamp);
        submitData.append("last_price_update_date", currentPersianDate);
      } else if (formData.last_price_update) {
        submitData.append("last_price_update", formData.last_price_update);
        if (formData.last_price_update_fa) {
          submitData.append("last_price_update_date", formData.last_price_update_fa);
        }
      }
      
      const optionsToSend = formData.options.filter(opt => opt.id && opt.name).map(opt => ({
        id: opt.id,
        name: opt.name,
        is_required: opt.is_required,
        choices: opt.choices.filter(c => c.value.trim()).map(choice => ({
          value: choice.value,
          price_modifier: choice.price_modifier,
          modifier_type: choice.modifier_type
        }))
      }));
      submitData.append("options", JSON.stringify(optionsToSend));
      
      const specsToSend = (formData.specifications || [])
        .filter(spec => spec.spec_key && spec.spec_value)
        .map(spec => ({
          key: spec.spec_key,
          value: spec.spec_value,
          unit: spec.spec_unit || ""
        }));
      submitData.append("specifications", JSON.stringify(specsToSend));
      
      const response = await fetch("https://electroshahresfahan.com/drgearbox/update_product.php", {
        method: "POST",
        body: submitData,
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMessage({ type: "success", text: "محصول با موفقیت بروزرسانی شد!" });
        setTimeout(() => {
          window.location.href = "/admin/products";
        }, 2000);
      } else {
        setMessage({ type: "error", text: result.message || "خطا در بروزرسانی محصول" });
      }
    } catch (error: any) {
      console.error("Error:", error);
      setMessage({ type: "error", text: "خطا در ارتباط با سرور: " + error.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#1c4793] mx-auto mb-4" />
          <p className="text-gray-600">در حال بارگذاری اطلاعات محصول...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* هدر */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-[#1c4793] to-[#113d64] rounded-2xl shadow-lg">
              <Edit className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">ویرایش محصول</h1>
            <span className="px-3 py-1 bg-[#1c4793]/10 text-[#1c4793] rounded-full text-sm font-semibold">
              ID: {formData.id}
            </span>
          </div>
          <p className="text-gray-500 pr-14">اطلاعات محصول را ویرایش کنید</p>
        </div>

        {/* پیام */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
            message.type === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
          }`}>
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <span className={message.type === "success" ? "text-green-700" : "text-red-700"}>
              {message.text}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* ============================================
              بخش اطلاعات پایه
          ============================================ */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#1c4793]" />
                <h2 className="text-lg font-bold text-gray-800">اطلاعات پایه</h2>
              </div>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  <span className="text-red-500">*</span> عنوان محصول
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793] transition-all"
                  placeholder="مثال: گیربکس حلزونی سری NMRV"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  <span className="text-red-500">*</span> برند
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793] transition-all"
                  placeholder="مثال: Dr Gearbox"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    قیمت پایه (تومان)
                </label>
                <input
                  type="number"
                  value={formData.before_discount_price || ""}
                  onChange={(e) => handleBeforePriceChange(Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793] transition-all"
                  placeholder="مثال: 3000000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  <span className="text-red-500">*</span>  قیمت بعد از تخفیف (تومان)
                </label>
                <div className="relative">
                  <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.base_price || ""}
                    onChange={(e) => handleBasePriceChange(Number(e.target.value))}
                    className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793] transition-all"
                    placeholder="مثال: 2500000"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  درصد تخفیف (%)
                </label>
                <div className="relative">
                  <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={discountPercent || ""}
                    onChange={(e) => handleDiscountPercentChange(Number(e.target.value))}
                    className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793] transition-all"
                    placeholder="مثال: 15"
                    step="1"
                    min="0"
                    max="100"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  با وارد کردن درصد، قیمت پایه به صورت خودکار محاسبه می‌شود
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  <span className="text-red-500">*</span> نوع محصول
                </label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793] transition-all"
                  placeholder="مثال: NMRV"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  <span className="text-red-500">*</span> موجودی انبار
                </label>
                <input
                  type="number"
                  value={formData.inventory}
                  onChange={(e) => setFormData(prev => ({ ...prev, inventory: Number(e.target.value) }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793] transition-all"
                  placeholder="تعداد موجودی"
                />
                {formData.inventory <= "5" && formData.inventory > "0" && (
                  <p className="text-xs text-orange-500 mt-1">⚠️ موجودی در حال اتمام است</p>
                )}
                {formData.inventory === 0 && (
                  <p className="text-xs text-red-500 mt-1">❌ محصول ناموجود است</p>
                )}
              </div>
              
              {/* بخش دسته‌بندی سلسله‌مراتبی */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  <span className="text-red-500">*</span> دسته‌بندی
                </label>
                
                {/* سطح اول - دسته‌بندی اصلی */}
                <select
                  value={selectedMainCategory}
                  onChange={(e) => handleMainCategoryChange(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793] transition-all mb-2"
                >
                  <option value="">انتخاب دسته‌بندی اصلی</option>
                  {mainCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                
                {/* سطح دوم - زیردسته */}
                {subCategories.length > 0 && (
                  <select
                    value={selectedSubCategory}
                    onChange={(e) => handleSubCategoryChange(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793] transition-all mb-2"
                  >
                    <option value="">انتخاب زیردسته</option>
                    {subCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                )}
                
                {/* سطح سوم - زیرشاخه */}
                {childCategories.length > 0 && (
                  <select
                    value={selectedChildCategory}
                    onChange={(e) => handleChildCategoryChange(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793] transition-all"
                  >
                    <option value="">انتخاب زیرشاخه</option>
                    {childCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                )}
                
                {/* نمایش دسته‌بندی انتخاب شده */}
                {formData.categoryId !== 0 && (
                  <p className="text-xs text-green-600 mt-2">
                    ✓ دسته‌بندی انتخاب شده: {categories.find(c => Number(c.id) === formData.categoryId)?.name}
                  </p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  توضیحات محصول
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793] transition-all"
                  placeholder="توضیحات کامل محصول..."
                />
              </div>
            </div>
          </div>

          {/* ============================================
              بخش تاریخ بروزرسانی قیمت با تقویم
          ============================================ */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#1c4793]" />
                <h2 className="text-lg font-bold text-gray-800">تاریخ بروزرسانی قیمت</h2>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className={`rounded-xl p-4 border ${
                  priceChanged 
                    ? "bg-orange-50 border-orange-200" 
                    : "bg-blue-50 border-blue-200"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {priceChanged ? (
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-blue-600" />
                    )}
                    <span className={`text-sm font-semibold ${priceChanged ? "text-orange-700" : "text-blue-700"}`}>
                      تاریخ ثبت شده فعلی:
                    </span>
                  </div>
                  <p className="text-gray-700">
                    {formData.last_price_update_fa 
                      ? formData.last_price_update_fa 
                      : (formData.last_price_update 
                        ? formData.last_price_update 
                        : "هنوز بروزرسانی نشده")}
                  </p>
                  {priceChanged && (
                    <div className="mt-2 text-xs text-orange-600 bg-orange-100 p-2 rounded-lg">
                      ⚠️ قیمت تغییر کرده است - در صورت عدم انتخاب تاریخ، زمان فعلی ثبت می‌شود
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    انتخاب تاریخ بروزرسانی جدید (میلادی)
                  </label>
                  <input
                    type="date"
                    value={selectedUpdateDate || (formData.last_price_update ? formData.last_price_update.split(' ')[0] : "")}
                    onChange={handleDateChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793] focus:border-transparent transition-all"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    * می‌توانید تاریخ دلخواه را انتخاب کنید - زمان فعلی به صورت خودکار اضافه می‌شود
                  </p>
                  {selectedUpdateDate && (
                    <div className="mt-2 text-sm text-green-600 bg-green-50 p-2 rounded-lg">
                      📅 تاریخ شمسی انتخاب شده: {convertGregorianToPersian(selectedUpdateDate)}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const today = new Date().toISOString().split('T')[0];
                    setSelectedUpdateDate(today);
                    setFormData(prev => ({
                      ...prev,
                      last_price_update: today,
                      last_price_update_fa: convertGregorianToPersian(today)
                    }));
                  }}
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  تنظیم به تاریخ امروز
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUpdateDate("");
                    if (priceChanged) {
                      setMessage({ type: "success", text: "در زمان ذخیره، تاریخ فعلی ثبت خواهد شد" });
                      setTimeout(() => setMessage(null), 3000);
                    }
                  }}
                  className="px-4 py-2 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  حذف تاریخ انتخاب شده
                </button>
              </div>
            </div>
          </div>

          {/* ============================================
              بخش تصاویر
          ============================================ */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#1c4793]" />
                <h2 className="text-lg font-bold text-gray-800">تصاویر محصول</h2>
                <span className="text-xs text-red-500">* (حداقل یک تصویر)</span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex gap-2 mb-5 border-b border-gray-200">
                <button
                  type="button"
                  onClick={() => setActiveImageTab("upload")}
                  className={`pb-2 px-4 text-sm font-medium transition-all ${
                    activeImageTab === "upload"
                      ? "text-[#1c4793] border-b-2 border-[#1c4793]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Upload className="w-4 h-4 inline ml-1" />
                  آپلود فایل
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImageTab("url")}
                  className={`pb-2 px-4 text-sm font-medium transition-all ${
                    activeImageTab === "url"
                      ? "text-[#1c4793] border-b-2 border-[#1c4793]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <LinkIcon className="w-4 h-4 inline ml-1" />
                  آدرس URL
                </button>
              </div>
              
              {activeImageTab === "upload" && (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    isDragActive ? "border-[#1c4793] bg-blue-50" : "border-gray-300 hover:border-[#1c4793]"
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600">
                    {isDragActive ? "فایل را اینجا رها کنید" : "برای آپلود کلیک کنید یا فایل را بکشید"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">فرمت‌های مجاز: JPG, PNG, GIF, WEBP (حداکثر 50MB)</p>
                  {uploadingImages && (
                    <div className="mt-3 flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-[#1c4793]" />
                      <span className="text-sm text-gray-500">در حال آپلود...</span>
                    </div>
                  )}
                </div>
              )}
              
              {activeImageTab === "url" && (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6">
                  <div className="flex gap-3">
                    <input
                      type="url"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793] transition-all"
                    />
                    <button
                      type="button"
                      onClick={addImageByUrl}
                      className="px-6 py-2.5 bg-[#1c4793] text-white rounded-xl hover:bg-[#113d64] transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      افزودن
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    فرمت‌های مجاز: jpg, jpeg, png, gif, webp, svg
                  </p>
                </div>
              )}
              
              {formData.image.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    تصاویر اضافه شده ({formData.image.length}):
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {formData.image.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`تصویر ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200 shadow-sm"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=Invalid+URL";
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ============================================
              بخش کاتالوگ
          ============================================ */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#1c4793]" />
                <h2 className="text-lg font-bold text-gray-800">کاتالوگ محصول</h2>
              </div>
            </div>
            
            <div className="p-6">
              {formData.catalog ? (
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">کاتالوگ آپلود شده</p>
                      <a href={formData.catalog} target="_blank" rel="noopener noreferrer" className="text-xs text-[#1c4793] hover:underline">
                        مشاهده فایل
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, catalog: "" }))}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleCatalogUpload(e.target.files[0]);
                    }}
                    className="hidden"
                    id="catalog-upload"
                  />
                  <label
                    htmlFor="catalog-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <FileText className="w-10 h-10 text-gray-400" />
                    <span className="text-[#1c4793] font-semibold">انتخاب فایل PDF</span>
                    <span className="text-xs text-gray-400">حداکثر حجم: 50MB</span>
                  </label>
                  {uploadingCatalog && (
                    <div className="mt-3 flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-[#1c4793]" />
                      <span className="text-sm text-gray-500">در حال آپلود...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ============================================
              بخش مشخصات فنی
          ============================================ */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-[#1c4793]" />
                <h2 className="text-lg font-bold text-gray-800">مشخصات فنی</h2>
              </div>
            </div>
            
            <div className="p-6">
              {formData.specifications && formData.specifications.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">لیست مشخصات:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {formData.specifications.map((spec, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                        <input
                          type="text"
                          value={spec.spec_key}
                          onChange={(e) => updateSpecification(index, "spec_key", e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="کلید"
                        />
                        <input
                          type="text"
                          value={spec.spec_value}
                          onChange={(e) => updateSpecification(index, "spec_value", e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="مقدار"
                        />
                        <input
                          type="text"
                          value={spec.spec_unit || ""}
                          onChange={(e) => updateSpecification(index, "spec_unit", e.target.value)}
                          className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="واحد"
                        />
                        <button
                          type="button"
                          onClick={() => removeSpecification(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">افزودن مشخصه جدید:</h3>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {commonSpecs.map((spec) => (
                    <button
                      key={spec.key}
                      type="button"
                      onClick={() => addCommonSpec(spec.key, spec.label, spec.unit)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <spec.icon className="w-3 h-3" />
                      {spec.label}
                    </button>
                  ))}
                </div>
                
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={customSpecKey}
                    onChange={(e) => setCustomSpecKey(e.target.value)}
                    placeholder="کلید (مثال: voltage)"
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793]"
                  />
                  <input
                    type="text"
                    value={customSpecValue}
                    onChange={(e) => setCustomSpecValue(e.target.value)}
                    placeholder="مقدار (مثال: 380)"
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793]"
                  />
                  <input
                    type="text"
                    value={customSpecUnit}
                    onChange={(e) => setCustomSpecUnit(e.target.value)}
                    placeholder="واحد (مثال: V)"
                    className="w-24 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793]"
                  />
                  <button
                    type="button"
                    onClick={addSpecification}
                    className="px-6 py-2.5 bg-[#1c4793] text-white rounded-xl hover:bg-[#113d64] transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================
              بخش ویژگی‌ها
          ============================================ */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#1c4793]" />
                  <h2 className="text-lg font-bold text-gray-800">ویژگی‌های محصول</h2>
                </div>
                <button
                  type="button"
                  onClick={addFeature}
                  className="flex items-center gap-1 text-sm text-[#1c4793] hover:text-[#113d64]"
                >
                  <Plus className="w-4 h-4" />
                  افزودن ویژگی
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-3">
                {formData.features.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>هیچ ویژگی‌ای تعریف نشده است</p>
                    <button
                      type="button"
                      onClick={addFeature}
                      className="mt-2 text-sm text-[#1c4793] hover:underline"
                    >
                      + افزودن ویژگی جدید
                    </button>
                  </div>
                ) : (
                  formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-3">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793] transition-all"
                        placeholder={`مثال: ویژگی ${index + 1}`}
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="px-3 py-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* ============================================
              بخش آپشن‌ها
          ============================================ */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#1c4793]" />
                  <h2 className="text-lg font-bold text-gray-800">آپشن‌های قابل انتخاب</h2>
                </div>
                <button
                  type="button"
                  onClick={addOption}
                  className="flex items-center gap-1 text-sm text-[#1c4793] hover:text-[#113d64]"
                >
                  <Plus className="w-4 h-4" />
                  افزودن آپشن
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {formData.options.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <Settings className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>هیچ آپشنی تعریف نشده است</p>
                  <button
                    type="button"
                    onClick={addOption}
                    className="mt-2 text-sm text-[#1c4793] hover:underline"
                  >
                    + افزودن آپشن جدید
                  </button>
                </div>
              )}
              
              {formData.options.map((option, optIndex) => (
                <div key={optIndex} className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">شناسه آپشن</label>
                        <input
                          type="text"
                          value={option.id}
                          onChange={(e) => updateOption(optIndex, "id", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="مثال: ratio"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">نام آپشن</label>
                        <input
                          type="text"
                          value={option.name}
                          onChange={(e) => updateOption(optIndex, "name", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="مثال: نسبت تبدیل"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeOption(optIndex)}
                      className="mr-3 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <input
                      type="checkbox"
                      checked={Boolean(option.is_required)}
                      onChange={(e) => updateOption(optIndex, "is_required", e.target.checked)}
                      className="w-4 h-4 text-[#1c4793] rounded"
                    />
                    <label className="text-sm text-gray-600">آپشن اجباری است</label>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-gray-600 mb-2">گزینه‌ها</label>
                    {option.choices.map((choice, chIndex) => (
                      <div key={chIndex} className="flex gap-2 items-center flex-wrap">
                        <input
                          type="text"
                          value={choice.value}
                          onChange={(e) => updateChoice(optIndex, chIndex, "value", e.target.value)}
                          className="flex-1 min-w-[150px] px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="مقدار (مثال: 1:10)"
                        />
                        
                        <select
                          value={choice.modifier_type}
                          onChange={(e) => updateChoice(optIndex, chIndex, "modifier_type", e.target.value as "fixed" | "percent")}
                          className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                        >
                          <option value="fixed">مبلغ ثابت</option>
                          <option value="percent">درصد</option>
                        </select>
                        
                        <input
                          type="number"
                          value={choice.price_modifier}
                          onChange={(e) => updateChoice(optIndex, chIndex, "price_modifier", e.target.value)}
                          className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder={choice.modifier_type === "fixed" ? "مبلغ به تومان" : "درصد (%)"}
                        />
                        
                        {option.choices.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeChoice(optIndex, chIndex)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addChoice(optIndex)}
                      className="text-sm text-[#1c4793] hover:text-[#113d64] flex items-center gap-1 mt-2"
                    >
                      <Plus className="w-3 h-3" />
                      افزودن گزینه دیگر
                    </button>
                    <p className="text-[10px] text-gray-400 mt-1">
                      * در حالت "مبلغ ثابت"، عدد وارد شده مستقیماً به قیمت اضافه می‌شود.
                      در حالت "درصد"، عدد به عنوان درصدی از قیمت پایه محاسبه می‌شود.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ============================================
              دکمه‌ها
          ============================================ */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-gradient-to-r from-[#1c4793] to-[#113d64] text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  در حال بروزرسانی محصول...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  بروزرسانی محصول
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-4 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;