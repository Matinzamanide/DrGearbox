// pages/admin/AddProduct.tsx
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { 
  Package, Upload, X, Plus, Trash2, Save, 
  Image as ImageIcon, FileText, Settings, 
  CheckCircle, AlertCircle, Loader2, 
  ChevronLeft, DollarSign,  Database, Sparkles, Link as LinkIcon,
  Ruler, Gauge, Weight, Zap, Thermometer, Wind, Percent
} from "lucide-react";
import { useDropzone } from "react-dropzone";

// ============================================
// تایپ‌ها
// ============================================
interface IChoice {
  value: string;
  price_modifier: number;
  modifier_type: "fixed" | "percent";
}

interface ICategories {
  id: string;
  name: string;
  parentId: string | null;
}

interface IOption {
  id: string;
  name: string;
  is_required: boolean;
  choices: IChoice[];
}

interface ISpecification {
  key: string;
  value: string;
  unit: string;
}

interface IProductForm {
  title: string;
  base_price: number;
  before_discount_price: number | null;
  brand: string;
  type: string;
  inventory: number;
  categoryId: number;
  description: string;
  catalog: string;
  imageUrls: string[];
  features: string[];
  options: IOption[];
  specifications: ISpecification[];
}

// لیست پیشنهادی برای مشخصات فنی
const commonSpecs = [
  { key: "power", label: "قدرت", icon: Zap, unit: "kW" },
  { key: "torque", label: "گشتاور", icon: Gauge, unit: "Nm" },
  { key: "ratio", label: "نسبت تبدیل", icon: Settings, unit: "" },
  { key: "weight", label: "وزن", icon: Weight, unit: "kg" },
  { key: "protection", label: "درجه حفاظت", icon: Settings, unit: "" },
  { key: "efficiency", label: "راندمان", icon: Settings, unit: "%" },
  { key: "input_speed", label: "سرعت ورودی", icon: Zap, unit: "rpm" },
  { key: "output_speed", label: "سرعت خروجی", icon: Zap, unit: "rpm" },
  { key: "temperature", label: "دمای کاری", icon: Thermometer, unit: "°C" },
  { key: "noise", label: "نویز", icon: Wind, unit: "dB" },
];

// ============================================
// کامپوننت اصلی
// ============================================
const AddProduct = () => {
  const [formData, setFormData] = useState<IProductForm>({
    title: "",
    base_price: 0,
    before_discount_price: null,
    brand: "",
    type: "",
    inventory: 0,
    categoryId: 0,
    description: "",
    catalog: "",
    imageUrls: [],
    features: [""],
    options: [],
    specifications: []
  });

  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingCatalog, setUploadingCatalog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [activeImageTab, setActiveImageTab] = useState<"upload" | "url">("upload");
  const [customSpecKey, setCustomSpecKey] = useState("");
  const [customSpecValue, setCustomSpecValue] = useState("");
  const [customSpecUnit, setCustomSpecUnit] = useState("");
  const [categories, setCategories] = useState<ICategories[]>([]);
  
  // State برای دسته‌بندی سلسله‌مراتبی
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [selectedChildCategory, setSelectedChildCategory] = useState<string>("");
  
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [lastProductId, setLastProductId] = useState<number>(1000);

  // دریافت آخرین ID محصولات موجود
  useEffect(() => {
    const fetchLastId = async () => {
      try {
        const response = await axios.get("https://electroshahresfahan.com/drgearbox/get_products.php");
        const products = response.data.products || [];
        if (products.length > 0) {
          const maxId = Math.max(...products.map((p: any) => Number(p.id)));
          setLastProductId(maxId);
        } else {
          setLastProductId(1000);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setLastProductId(1000);
      }
    };
    fetchLastId();
  }, []);

  // دریافت دسته‌بندی‌ها
  useEffect(() => {
    axios("https://electroshahresfahan.com/drgearbox/get_products.php")
      .then((res) => {
        if (res.data.categories) {
          setCategories(res.data.categories);
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  // استخراج دسته‌بندی‌های اصلی (parentId = null)
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

  const generateNewId = (): number => {
    return lastProductId + 1;
  };

  // ============================================
  // محاسبه خودکار قیمت بر اساس درصد تخفیف محصول
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
    
    if (formData.before_discount_price && formData.before_discount_price > 0 && percent > 0) {
      const discountedPrice = formData.before_discount_price - (formData.before_discount_price * percent / 100);
      setFormData(prev => ({ ...prev, base_price: Math.round(discountedPrice) }));
    } else if (percent === 0 && formData.before_discount_price && formData.before_discount_price > 0) {
      setFormData(prev => ({ ...prev, base_price: formData.before_discount_price! }));
    }
  };

  const handleBasePriceChange = (value: number) => {
    setFormData(prev => ({ ...prev, base_price: value }));
    
    if (formData.before_discount_price && formData.before_discount_price > 0 && value > 0) {
      const percent = ((formData.before_discount_price - value) / formData.before_discount_price) * 100;
      setDiscountPercent(Math.round(percent));
    }
  };

  // ============================================
  // آپلود تصاویر
  // ============================================
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setUploadingImages(true);
    const formDataUpload = new FormData();
    
    acceptedFiles.forEach(file => {
      formDataUpload.append("images[]", file);
    });
    formDataUpload.append("product_id", "temp");
    formDataUpload.append("upload_type", "image");
    
    try {
      const response = await axios.post(
        "https://electroshahresfahan.com/drgearbox/upload_file.php",
        formDataUpload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      
      if (response.data.success) {
        const urls = response.data.image_urls || [response.data.image_url];
        setFormData(prev => ({
          ...prev,
          imageUrls: [...prev.imageUrls, ...urls]
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
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp", ".html"] },
    maxSize: 50 * 1024 * 1024
  });

  const addImageByUrl = () => {
    if (!imageUrlInput.trim()) {
      setMessage({ type: "error", text: "لطفاً آدرس تصویر را وارد کنید" });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    
    const urlPattern = /^(https?:\/\/.*\.(jpg|jpeg|png|gif|webp|svg|html))$/i;
    if (!urlPattern.test(imageUrlInput)) {
      setMessage({ type: "error", text: "آدرس تصویر معتبر نیست" });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      imageUrls: [...prev.imageUrls, imageUrlInput]
    }));
    setImageUrlInput("");
    setMessage({ type: "success", text: "تصویر با موفقیت اضافه شد" });
    setTimeout(() => setMessage(null), 3000);
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }));
  };

  const handleCatalogUpload = async (file: File) => {
    setUploadingCatalog(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("product_id", "temp");
    formDataUpload.append("upload_type", "catalog");
    
    try {
      const response = await axios.post(
        "https://electroshahresfahan.com/drgearbox/upload_file.php",
        formDataUpload,
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
      specifications: [...prev.specifications, {
        key: customSpecKey,
        value: customSpecValue,
        unit: customSpecUnit
      }]
    }));
    
    setCustomSpecKey("");
    setCustomSpecValue("");
    setCustomSpecUnit("");
  };

  const addCommonSpec = (specKey: string, specLabel: string, defaultUnit: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, {
        key: specKey,
        value: "",
        unit: defaultUnit
      }]
    }));
    console.log(specLabel);
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const updateSpecification = (index: number, field: keyof ISpecification, value: string) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setFormData(prev => ({ ...prev, specifications: newSpecs }));
  };

  const removeSpecification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  // ============================================
  // ارسال فرم
  // ============================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setMessage({ type: "error", text: "عنوان محصول الزامی است" });
      return;
    }
    
    if (formData.base_price <= 0) {
      setMessage({ type: "error", text: "قیمت پایه معتبر الزامی است" });
      return;
    }
    
    if (formData.categoryId === 0) {
      setMessage({ type: "error", text: "دسته‌بندی محصول الزامی است" });
      return;
    }
    
    if (formData.imageUrls.length === 0) {
      setMessage({ type: "error", text: "حداقل یک تصویر برای محصول الزامی است" });
      return;
    }
    
    setSubmitting(true);
    
    try {
      const newId = generateNewId();
      const formDataToSend = new FormData();
      
      // فیلدهای پایه
      formDataToSend.append("id", String(newId));
      formDataToSend.append("title", formData.title);
      formDataToSend.append("base_price", String(formData.base_price));
      if (formData.before_discount_price) {
        formDataToSend.append("before_discount_price", String(formData.before_discount_price));
      }
      formDataToSend.append("brand", formData.brand);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("inventory", String(formData.inventory));
      formDataToSend.append("categoryId", String(formData.categoryId));
      formDataToSend.append("description", formData.description);
      formDataToSend.append("catalog", formData.catalog);
      formDataToSend.append("image", JSON.stringify(formData.imageUrls));
      formDataToSend.append("features", JSON.stringify(formData.features.filter(f => f.trim() !== "")));
      
      // آپشن‌ها با modifier_type
      const optionsToSend = formData.options.filter(opt => opt.id && opt.name).map(opt => ({
        id: opt.id,
        name: opt.name,
        is_required: opt.is_required,
        choices: opt.choices.map(choice => ({
          value: choice.value,
          price_modifier: choice.price_modifier,
          modifier_type: choice.modifier_type
        }))
      }));
      formDataToSend.append("options", JSON.stringify(optionsToSend));
      formDataToSend.append("specifications", JSON.stringify(formData.specifications.filter(spec => spec.key && spec.value)));
      
      console.log("Sending product with ID:", newId);
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      
      const response = await fetch("https://electroshahresfahan.com/drgearbox/insert_product.php", {
        method: "POST",
        body: formDataToSend,
      });
      
      const result = await response.json();
      console.log("Server response:", result);
      
      if (result.success) {
        setMessage({ type: "success", text: "محصول با موفقیت ثبت شد!" });
        setLastProductId(newId);
        setFormData({
          title: "",
          base_price: 0,
          before_discount_price: null,
          brand: "",
          type: "",
          inventory: 0,
          categoryId: 0,
          description: "",
          catalog: "",
          imageUrls: [],
          features: [""],
          options: [],
          specifications: []
        });
        setSelectedMainCategory("");
        setSelectedSubCategory("");
        setSelectedChildCategory("");
        setDiscountPercent(0);
        setImageUrlInput("");
        setTimeout(() => setMessage(null), 5000);
      } else {
        setMessage({ type: "error", text: result.message || "خطا در ثبت محصول" });
      }
    } catch (error: any) {
      console.error("Error:", error);
      setMessage({ type: "error", text: "خطا در ارتباط با سرور: " + error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* هدر */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-[#1c4793] to-[#113d64] rounded-2xl shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">افزودن محصول جدید</h1>
          </div>
          <p className="text-gray-500 pr-14">اطلاعات محصول را در فرم زیر وارد کنید</p>
        </div>

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
          
          {/* اطلاعات پایه */}
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
                   قیمت بعد از تخفیف    (تومان)
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
                  <span className="text-red-500">*</span> قیمت پایه (تومان)
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

          {/* تصاویر */}
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
              
              {formData.imageUrls.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    تصاویر اضافه شده ({formData.imageUrls.length}):
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {formData.imageUrls.map((url, index) => (
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

          {/* کاتالوگ */}
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
                      <a href={formData.catalog} target="_blank" className="text-xs text-[#1c4793] hover:underline">
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

          {/* مشخصات فنی */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-[#1c4793]" />
                <h2 className="text-lg font-bold text-gray-800">مشخصات فنی</h2>
              </div>
            </div>
            
            <div className="p-6">
              {formData.specifications.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">لیست مشخصات:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {formData.specifications.map((spec, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                        <input
                          type="text"
                          value={spec.key}
                          onChange={(e) => updateSpecification(index, "key", e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="کلید"
                        />
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) => updateSpecification(index, "value", e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="مقدار"
                        />
                        <input
                          type="text"
                          value={spec.unit}
                          onChange={(e) => updateSpecification(index, "unit", e.target.value)}
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

          {/* ویژگی‌ها */}
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
                {formData.features.map((feature, index) => (
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
                ))}
              </div>
            </div>
          </div>

          {/* آپشن‌ها */}
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
                      checked={option.is_required}
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
                          onChange={(e) => updateChoice(optIndex, chIndex, "modifier_type", e.target.value)}
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

          {/* دکمه ارسال */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-gradient-to-r from-[#1c4793] to-[#113d64] text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  در حال ثبت محصول...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  ثبت محصول جدید
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-4 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              بازگشت
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;