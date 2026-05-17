// pages/Checkout/Checkout.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Truck, CreditCard, User, MapPin, Phone, Mail, 
  Clock, Shield, CheckCircle, 
  ArrowLeft, ShoppingBag, Wallet, Building2, Plus
} from "lucide-react";
import axios from "axios";
import { useShoppingCart } from "../context/ShoppingCartContext";

interface Address {
  id: number;
  province: string;
  city: string;
  address: string;
  postal_code: string;
  is_default: number;
}

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  addressId: number;
  newAddress: {
    province: string;
    city: string;
    address: string;
    postalCode: string;
  };
  paymentMethod: "online" | "cash" | "card";
  deliveryMethod: "express" | "normal" | "pickup";
  notes: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { items, summary, clearCart } = useShoppingCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [, setUserData] = useState<any>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    addressId: 0,
    newAddress: {
      province: "",
      city: "",
      address: "",
      postalCode: "",
    },
    paymentMethod: "online",
    deliveryMethod: "normal",
    notes: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    const token = localStorage.getItem("session_token");
    const user = localStorage.getItem("user");
    
    if (!token) {
      navigate("/auth/login");
      return;
    }
    
    setSessionToken(token);
    if (user) {
      const userObj = JSON.parse(user);
      setUserData(userObj);
      setFormData(prev => ({
        ...prev,
        firstName: userObj.name || "",
        lastName: userObj.family || "",
        phone: userObj.phone || "",
      }));
    }
    
    fetchAddresses(token);
  }, [navigate]);
  

  const fetchAddresses = async (token: string) => {
    try {
      const response = await axios.get(
        `https://electroshahresfahan.com/drgearbox/auth/get_user_addresses.php?session_token=${token}`
      );
      if (response.data.success) {
        setAddresses(response.data.addresses);
        if (response.data.addresses.length > 0) {
          const defaultAddr = response.data.addresses.find((a: Address) => a.is_default === 1);
          setFormData(prev => ({ ...prev, addressId: defaultAddr?.id || response.data.addresses[0].id }));
        }
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const addNewAddress = async () => {
    const { province, city, address, postalCode } = formData.newAddress;
    if (!province || !city || !address || !postalCode) {
      alert("لطفاً تمام فیلدهای آدرس را پر کنید");
      return;
    }

    try {
      const formDataPost = new FormData();
      formDataPost.append("session_token", sessionToken || "");
      formDataPost.append("province", province);
      formDataPost.append("city", city);
      formDataPost.append("address", address);
      formDataPost.append("postal_code", postalCode);

      const response = await axios.post(
        "https://electroshahresfahan.com/drgearbox/auth/add_user_address.php",
        formDataPost
      );

      if (response.data.success) {
        await fetchAddresses(sessionToken!);
        setShowNewAddressForm(false);
        setFormData(prev => ({
          ...prev,
          newAddress: { province: "", city: "", address: "", postalCode: "" },
          addressId: response.data.address_id
        }));
      } else {
        alert(response.data.error);
      }
    } catch (err) {
      console.error("Error adding address:", err);
      alert("خطا در افزودن آدرس");
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("fa-IR") + " تومان";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("newAddress.")) {
      const field = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        newAddress: { ...prev.newAddress, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "نام الزامی است";
    if (!formData.lastName.trim()) newErrors.lastName = "نام خانوادگی الزامی است";
    if (!formData.phone.trim()) newErrors.phone = "شماره تماس الزامی است";
    if (!formData.email.trim()) newErrors.email = "ایمیل الزامی است";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "ایمیل معتبر نیست";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    if (formData.addressId === 0 && !showNewAddressForm) {
      alert("لطفاً یک آدرس انتخاب کنید یا آدرس جدید اضافه کنید");
      return false;
    }
    if (showNewAddressForm) {
      const { province, city, address, postalCode } = formData.newAddress;
      if (!province || !city || !address || !postalCode) {
        alert("لطفاً تمام فیلدهای آدرس را پر کنید");
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 3) {
      setIsSubmitting(true);
      
      // محاسبه قیمت نهایی
      const deliveryCost = formData.deliveryMethod === "express" ? 50000 : 0;
      const totalPrice = summary.subtotal + deliveryCost + summary.tax - summary.discount;
      
      // آماده‌سازی آیتم‌های سفارش
      const orderItems = items.map(item => ({
  product_id: item.productId,
  title: item.title,
  quantity: item.quantity,
  price: item.price,
  selected_options: JSON.stringify(item.selectedOptions) // ذخیره به صورت JSON string
}));
      
      try {
        const response = await axios.post(
          "https://electroshahresfahan.com/drgearbox/auth/place_order.php",
          {
            session_token: sessionToken,
            address_id: showNewAddressForm ? 0 : formData.addressId,
            new_address: showNewAddressForm ? formData.newAddress : null,
            payment_method: formData.paymentMethod,
            delivery_method: formData.deliveryMethod,
            items: orderItems,
            total_price: totalPrice,
            notes: formData.notes
          }
        );
        
        if (response.data.success) {
          setOrderNumber(response.data.order_number);
          setOrderComplete(true);
          clearCart();
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          alert(response.data.error);
        }
      } catch (err) {
        console.error("Error placing order:", err);
        alert("خطا در ثبت سفارش. لطفاً دوباره تلاش کنید");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      handleNextStep();
    }
  };

  // اگر سبد خرید خالی است
  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <ShoppingBag className="w-20 h-20 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">سبد خرید خالی است</h2>
            <p className="text-gray-500 mb-6">برای ثبت سفارش، ابتدا محصولاتی را به سبد خرید اضافه کنید.</p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-gradient-to-r from-[#1c4793] to-[#113d64] text-white rounded-xl hover:shadow-lg transition-all"
            >
              بازگشت به فروشگاه
            </button>
          </div>
        </div>
      </div>
    );
  }

  // نمایش صفحه موفقیت
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">سفارش شما با موفقیت ثبت شد!</h2>
            <p className="text-gray-500 mb-4">شماره سفارش: <span className="font-bold text-[#1c4793]">{orderNumber}</span></p>
            <p className="text-gray-600 mb-6">به زودی کارشناسان ما با شما تماس خواهند گرفت.</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-gradient-to-r from-[#1c4793] to-[#113d64] text-white rounded-xl hover:shadow-lg transition-all"
              >
                بازگشت به فروشگاه
              </button>
              <button
                onClick={() => navigate("/userpanel")}
                className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
              >
                مشاهده سفارشات
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* هدر */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-[#1c4793] transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            بازگشت به سبد خرید
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">تسویه حساب</h1>
          <p className="text-gray-500 mt-2">اطلاعات خود را وارد کنید تا سفارش شما ثبت شود.</p>
        </div>

        {/* مراحل */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {[
              { step: 1, label: "اطلاعات شخصی", icon: User },
              { step: 2, label: "آدرس تحویل", icon: MapPin },
              { step: 3, label: "پرداخت", icon: CreditCard },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = currentStep >= item.step;
              const isCurrent = currentStep === item.step;
              
              return (
                <div key={item.step} className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isActive 
                      ? "bg-gradient-to-r from-[#1c4793] to-[#113d64] text-white shadow-lg" 
                      : "bg-gray-200 text-gray-400"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs mt-2 font-medium ${isCurrent ? "text-[#1c4793]" : "text-gray-500"}`}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* فرم اصلی */}
            <div className="flex-1">
              {/* مرحله 1: اطلاعات شخصی */}
              {currentStep === 1 && (
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#1c4793]" />
                    اطلاعات تماس
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        <span className="text-red-500">*</span> نام
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-[#1c4793] transition-all ${
                          errors.firstName ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="مثال: علی"
                      />
                      {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        <span className="text-red-500">*</span> نام خانوادگی
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-[#1c4793] transition-all ${
                          errors.lastName ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="مثال: رضایی"
                      />
                      {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        <span className="text-red-500">*</span> شماره تماس
                      </label>
                      <div className="relative">
                        <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2.5 pr-10 border rounded-xl focus:ring-2 focus:ring-[#1c4793] transition-all ${
                            errors.phone ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="مثال: 09123456789"
                        />
                      </div>
                      {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        <span className="text-red-500">*</span> ایمیل
                      </label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2.5 pr-10 border rounded-xl focus:ring-2 focus:ring-[#1c4793] transition-all ${
                            errors.email ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="example@gmail.com"
                        />
                      </div>
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* مرحله 2: آدرس تحویل */}
              {currentStep === 2 && (
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#1c4793]" />
                      آدرس تحویل سفارش
                    </h2>
                    {addresses.length > 0 && !showNewAddressForm && (
                      <button
                        type="button"
                        onClick={() => setShowNewAddressForm(true)}
                        className="flex items-center gap-2 text-[#1c4793] text-sm font-semibold hover:underline"
                      >
                        <Plus className="w-4 h-4" />
                        آدرس جدید
                      </button>
                    )}
                  </div>
                  
                  {loadingAddresses ? (
                    <div className="text-center py-8">در حال بارگذاری آدرس‌ها...</div>
                  ) : addresses.length > 0 && !showNewAddressForm ? (
                    <div className="space-y-3">
                      {addresses.map((addr) => (
                        <label key={addr.id} className="flex items-start gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
                          <input
                            type="radio"
                            name="addressId"
                            value={addr.id}
                            checked={formData.addressId === addr.id}
                            onChange={handleInputChange}
                            className="mt-1 w-4 h-4 text-[#1c4793]"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">
                              {addr.province} - {addr.city}
                              {addr.is_default === 1 && <span className="text-xs text-green-600 mr-2">(آدرس پیش‌فرض)</span>}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">{addr.address}</p>
                            <p className="text-xs text-gray-400 mt-1">کد پستی: {addr.postal_code}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="newAddress.province"
                          value={formData.newAddress.province}
                          onChange={handleInputChange}
                          placeholder="استان"
                          className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793]"
                        />
                        <input
                          type="text"
                          name="newAddress.city"
                          value={formData.newAddress.city}
                          onChange={handleInputChange}
                          placeholder="شهر"
                          className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793]"
                        />
                        <textarea
                          name="newAddress.address"
                          value={formData.newAddress.address}
                          onChange={handleInputChange}
                          placeholder="آدرس کامل (خیابان، پلاک، واحد)"
                          rows={3}
                          className="col-span-2 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793]"
                        />
                        <input
                          type="text"
                          name="newAddress.postalCode"
                          value={formData.newAddress.postalCode}
                          onChange={handleInputChange}
                          placeholder="کد پستی"
                          className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793]"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={addNewAddress}
                          className="px-5 py-2 bg-[#1c4793] text-white rounded-xl hover:bg-[#113d64] transition-colors"
                        >
                          ذخیره آدرس
                        </button>
                        {addresses.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setShowNewAddressForm(false)}
                            className="px-5 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            انصراف
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* مرحله 3: روش پرداخت و ارسال */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  {/* روش پرداخت */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <Wallet className="w-5 h-5 text-[#1c4793]" />
                      روش پرداخت
                    </h2>
                    
                    <div className="space-y-4">
                      <label className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="online"
                          checked={formData.paymentMethod === "online"}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-[#1c4793]"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-[#1c4793]" />
                            <span className="font-semibold text-gray-800">پرداخت آنلاین</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">پرداخت از طریق درگاه بانکی با کلیه کارت‌های عضو شتاب</p>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash"
                          checked={formData.paymentMethod === "cash"}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-[#1c4793]"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Wallet className="w-5 h-5 text-[#1c4793]" />
                            <span className="font-semibold text-gray-800">پرداخت در محل</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">پرداخت نقدی هنگام تحویل سفارش</p>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  {/* روش ارسال */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <Truck className="w-5 h-5 text-[#1c4793]" />
                      روش ارسال
                    </h2>
                    
                    <div className="space-y-4">
                      <label className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value="express"
                          checked={formData.deliveryMethod === "express"}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-[#1c4793]"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Truck className="w-5 h-5 text-[#1c4793]" />
                            <span className="font-semibold text-gray-800">ارسال سریع (۲۴ ساعته)</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">تحویل سفارش در کمتر از ۲۴ ساعت</p>
                        </div>
                        <span className="font-bold text-[#1c4793]">+ ۵۰,۰۰۰ تومان</span>
                      </label>
                      
                      <label className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value="normal"
                          checked={formData.deliveryMethod === "normal"}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-[#1c4793]"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-[#1c4793]" />
                            <span className="font-semibold text-gray-800">ارسال عادی (۳ تا ۵ روزه)</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">تحویل سفارش در ۳ تا ۵ روز کاری</p>
                        </div>
                        <span className="font-bold text-green-600">رایگان</span>
                      </label>
                      
                      <label className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value="pickup"
                          checked={formData.deliveryMethod === "pickup"}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-[#1c4793]"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-[#1c4793]" />
                            <span className="font-semibold text-gray-800">تحویل حضوری</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">تحویل از فروشگاه در تهران</p>
                        </div>
                        <span className="font-bold text-green-600">رایگان</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* توضیحات اضافی */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">توضیحات اضافی (اختیاری)</h2>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793] transition-all"
                      placeholder="هرگونه توضیح اضافی مانند زمان مناسب برای تحویل، آدرس دقیق‌تر و ..."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* سایدبار خلاصه سفارش */}
            <div className="lg:w-96">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#1c4793]" />
                  خلاصه سفارش
                </h2>
                
                <div className="space-y-4 max-h-80 overflow-y-auto mb-6">
                  {items.map((item:any) => (
                    <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-100">
                      <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm line-clamp-2">{item.title}</p>
                        <p className="text-xs text-gray-500 mt-1">تعداد: {item.quantity}</p>
                        <p className="text-sm font-bold text-[#1c4793] mt-1">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">مجموع قیمت:</span>
                    <span className="font-semibold">{formatPrice(summary.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">هزینه ارسال:</span>
                    <span>{formData.deliveryMethod === "express" ? formatPrice(50000) : "رایگان"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">مالیات (۹%):</span>
                    <span>{formatPrice(summary.tax)}</span>
                  </div>
                  {summary.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>تخفیف:</span>
                      <span>- {formatPrice(summary.discount)}</span>
                    </div>
                  )}
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>قابل پرداخت:</span>
                      <span className="text-[#1c4793]">
                        {formatPrice(
                          summary.subtotal + 
                          (formData.deliveryMethod === "express" ? 50000 : 0) + 
                          summary.tax - 
                          summary.discount
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-[#1c4793] to-[#113d64] text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      در حال ثبت سفارش...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      {currentStep === 3 ? "ثبت نهایی سفارش" : "ادامه"}
                    </>
                  )}
                </button>
                
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="w-full mt-3 py-2 px-4 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                  >
                    بازگشت به مرحله قبل
                  </button>
                )}
              </div>
              
              {/* ضمانت‌ها */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-gray-800">ضمانت بازگشت وجه</span>
                </div>
                <p className="text-xs text-gray-500">در صورت عدم رضایت از محصول، وجه شما بازگردانده می‌شود.</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;





















































































//  <form onSubmit={handleSubmit}>
//           <div className="flex flex-col lg:flex-row gap-8">
            
//             {/* فرم اصلی */}
//             <div className="flex-1">
//               {/* مرحله 1: اطلاعات شخصی */}
//               {currentStep === 1 && (
//                 <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
//                   <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
//                     <User className="w-5 h-5 text-[#1c4793]" />
//                     اطلاعات تماس
//                   </h2>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-1">
//                         <span className="text-red-500">*</span> نام
//                       </label>
//                       <input
//                         type="text"
//                         name="firstName"
//                         value={formData.firstName}
//                         onChange={handleInputChange}
//                         className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-[#1c4793] transition-all ${
//                           errors.firstName ? "border-red-500" : "border-gray-300"
//                         }`}
//                         placeholder="مثال: علی"
//                       />
//                       {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-1">
//                         <span className="text-red-500">*</span> نام خانوادگی
//                       </label>
//                       <input
//                         type="text"
//                         name="lastName"
//                         value={formData.lastName}
//                         onChange={handleInputChange}
//                         className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-[#1c4793] transition-all ${
//                           errors.lastName ? "border-red-500" : "border-gray-300"
//                         }`}
//                         placeholder="مثال: رضایی"
//                       />
//                       {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-1">
//                         <span className="text-red-500">*</span> شماره تماس
//                       </label>
//                       <div className="relative">
//                         <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                         <input
//                           type="tel"
//                           name="phone"
//                           value={formData.phone}
//                           onChange={handleInputChange}
//                           className={`w-full px-4 py-2.5 pr-10 border rounded-xl focus:ring-2 focus:ring-[#1c4793] transition-all ${
//                             errors.phone ? "border-red-500" : "border-gray-300"
//                           }`}
//                           placeholder="مثال: 09123456789"
//                         />
//                       </div>
//                       {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-1">
//                         <span className="text-red-500">*</span> ایمیل
//                       </label>
//                       <div className="relative">
//                         <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                         <input
//                           type="email"
//                           name="email"
//                           value={formData.email}
//                           onChange={handleInputChange}
//                           className={`w-full px-4 py-2.5 pr-10 border rounded-xl focus:ring-2 focus:ring-[#1c4793] transition-all ${
//                             errors.email ? "border-red-500" : "border-gray-300"
//                           }`}
//                           placeholder="example@gmail.com"
//                         />
//                       </div>
//                       {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* مرحله 2: آدرس تحویل */}
//               {currentStep === 2 && (
//                 <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
//                   <div className="flex items-center justify-between mb-6">
//                     <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
//                       <MapPin className="w-5 h-5 text-[#1c4793]" />
//                       آدرس تحویل سفارش
//                     </h2>
//                     {addresses.length > 0 && !showNewAddressForm && (
//                       <button
//                         type="button"
//                         onClick={() => setShowNewAddressForm(true)}
//                         className="flex items-center gap-2 text-[#1c4793] text-sm font-semibold hover:underline"
//                       >
//                         <Plus className="w-4 h-4" />
//                         آدرس جدید
//                       </button>
//                     )}
//                   </div>
                  
//                   {loadingAddresses ? (
//                     <div className="text-center py-8">در حال بارگذاری آدرس‌ها...</div>
//                   ) : addresses.length > 0 && !showNewAddressForm ? (
//                     <div className="space-y-3">
//                       {addresses.map((addr) => (
//                         <label key={addr.id} className="flex items-start gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
//                           <input
//                             type="radio"
//                             name="addressId"
//                             value={addr.id}
//                             checked={formData.addressId === addr.id}
//                             onChange={handleInputChange}
//                             className="mt-1 w-4 h-4 text-[#1c4793]"
//                           />
//                           <div className="flex-1">
//                             <p className="font-semibold text-gray-800">
//                               {addr.province} - {addr.city}
//                               {addr.is_default === 1 && <span className="text-xs text-green-600 mr-2">(آدرس پیش‌فرض)</span>}
//                             </p>
//                             <p className="text-sm text-gray-600 mt-1">{addr.address}</p>
//                             <p className="text-xs text-gray-400 mt-1">کد پستی: {addr.postal_code}</p>
//                           </div>
//                         </label>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <input
//                           type="text"
//                           name="newAddress.province"
//                           value={formData.newAddress.province}
//                           onChange={handleInputChange}
//                           placeholder="استان"
//                           className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793]"
//                         />
//                         <input
//                           type="text"
//                           name="newAddress.city"
//                           value={formData.newAddress.city}
//                           onChange={handleInputChange}
//                           placeholder="شهر"
//                           className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793]"
//                         />
//                         <textarea
//                           name="newAddress.address"
//                           value={formData.newAddress.address}
//                           onChange={handleInputChange}
//                           placeholder="آدرس کامل (خیابان، پلاک، واحد)"
//                           rows={3}
//                           className="col-span-2 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793]"
//                         />
//                         <input
//                           type="text"
//                           name="newAddress.postalCode"
//                           value={formData.newAddress.postalCode}
//                           onChange={handleInputChange}
//                           placeholder="کد پستی"
//                           className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793]"
//                         />
//                       </div>
//                       <div className="flex gap-3">
//                         <button
//                           type="button"
//                           onClick={addNewAddress}
//                           className="px-5 py-2 bg-[#1c4793] text-white rounded-xl hover:bg-[#113d64] transition-colors"
//                         >
//                           ذخیره آدرس
//                         </button>
//                         {addresses.length > 0 && (
//                           <button
//                             type="button"
//                             onClick={() => setShowNewAddressForm(false)}
//                             className="px-5 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
//                           >
//                             انصراف
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* مرحله 3: روش پرداخت و ارسال */}
//               {currentStep === 3 && (
//                 <div className="space-y-6">
//                   {/* روش پرداخت */}
//                   <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
//                     <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
//                       <Wallet className="w-5 h-5 text-[#1c4793]" />
//                       روش پرداخت
//                     </h2>
                    
//                     <div className="space-y-4">
//                       <label className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
//                         <input
//                           type="radio"
//                           name="paymentMethod"
//                           value="online"
//                           checked={formData.paymentMethod === "online"}
//                           onChange={handleInputChange}
//                           className="w-5 h-5 text-[#1c4793]"
//                         />
//                         <div className="flex-1">
//                           <div className="flex items-center gap-2">
//                             <CreditCard className="w-5 h-5 text-[#1c4793]" />
//                             <span className="font-semibold text-gray-800">پرداخت آنلاین</span>
//                           </div>
//                           <p className="text-xs text-gray-500 mt-1">پرداخت از طریق درگاه بانکی با کلیه کارت‌های عضو شتاب</p>
//                         </div>
//                       </label>
                      
//                       <label className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
//                         <input
//                           type="radio"
//                           name="paymentMethod"
//                           value="cash"
//                           checked={formData.paymentMethod === "cash"}
//                           onChange={handleInputChange}
//                           className="w-5 h-5 text-[#1c4793]"
//                         />
//                         <div className="flex-1">
//                           <div className="flex items-center gap-2">
//                             <Wallet className="w-5 h-5 text-[#1c4793]" />
//                             <span className="font-semibold text-gray-800">پرداخت در محل</span>
//                           </div>
//                           <p className="text-xs text-gray-500 mt-1">پرداخت نقدی هنگام تحویل سفارش</p>
//                         </div>
//                       </label>
//                     </div>
//                   </div>
                  
//                   {/* روش ارسال */}
//                   <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
//                     <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
//                       <Truck className="w-5 h-5 text-[#1c4793]" />
//                       روش ارسال
//                     </h2>
                    
//                     <div className="space-y-4">
//                       <label className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
//                         <input
//                           type="radio"
//                           name="deliveryMethod"
//                           value="express"
//                           checked={formData.deliveryMethod === "express"}
//                           onChange={handleInputChange}
//                           className="w-5 h-5 text-[#1c4793]"
//                         />
//                         <div className="flex-1">
//                           <div className="flex items-center gap-2">
//                             <Truck className="w-5 h-5 text-[#1c4793]" />
//                             <span className="font-semibold text-gray-800">ارسال سریع (۲۴ ساعته)</span>
//                           </div>
//                           <p className="text-xs text-gray-500 mt-1">تحویل سفارش در کمتر از ۲۴ ساعت</p>
//                         </div>
//                         <span className="font-bold text-[#1c4793]">+ ۵۰,۰۰۰ تومان</span>
//                       </label>
                      
//                       <label className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
//                         <input
//                           type="radio"
//                           name="deliveryMethod"
//                           value="normal"
//                           checked={formData.deliveryMethod === "normal"}
//                           onChange={handleInputChange}
//                           className="w-5 h-5 text-[#1c4793]"
//                         />
//                         <div className="flex-1">
//                           <div className="flex items-center gap-2">
//                             <Clock className="w-5 h-5 text-[#1c4793]" />
//                             <span className="font-semibold text-gray-800">ارسال عادی (۳ تا ۵ روزه)</span>
//                           </div>
//                           <p className="text-xs text-gray-500 mt-1">تحویل سفارش در ۳ تا ۵ روز کاری</p>
//                         </div>
//                         <span className="font-bold text-green-600">رایگان</span>
//                       </label>
                      
//                       <label className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
//                         <input
//                           type="radio"
//                           name="deliveryMethod"
//                           value="pickup"
//                           checked={formData.deliveryMethod === "pickup"}
//                           onChange={handleInputChange}
//                           className="w-5 h-5 text-[#1c4793]"
//                         />
//                         <div className="flex-1">
//                           <div className="flex items-center gap-2">
//                             <Building2 className="w-5 h-5 text-[#1c4793]" />
//                             <span className="font-semibold text-gray-800">تحویل حضوری</span>
//                           </div>
//                           <p className="text-xs text-gray-500 mt-1">تحویل از فروشگاه در تهران</p>
//                         </div>
//                         <span className="font-bold text-green-600">رایگان</span>
//                       </label>
//                     </div>
//                   </div>
                  
//                   {/* توضیحات اضافی */}
//                   <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
//                     <h2 className="text-xl font-bold text-gray-800 mb-4">توضیحات اضافی (اختیاری)</h2>
//                     <textarea
//                       name="notes"
//                       value={formData.notes}
//                       onChange={handleInputChange}
//                       rows={4}
//                       className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793] transition-all"
//                       placeholder="هرگونه توضیح اضافی مانند زمان مناسب برای تحویل، آدرس دقیق‌تر و ..."
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* سایدبار خلاصه سفارش */}
//             <div className="lg:w-96">
//               <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
//                 <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
//                   <ShoppingBag className="w-5 h-5 text-[#1c4793]" />
//                   خلاصه سفارش
//                 </h2>
                
//                 <div className="space-y-4 max-h-80 overflow-y-auto mb-6">
//                   {items.map((item:any) => (
//                     <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-100">
//                       <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
//                       <div className="flex-1">
//                         <p className="font-semibold text-gray-800 text-sm line-clamp-2">{item.title}</p>
//                         <p className="text-xs text-gray-500 mt-1">تعداد: {item.quantity}</p>
//                         <p className="text-sm font-bold text-[#1c4793] mt-1">{formatPrice(item.price * item.quantity)}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
                
//                 <div className="border-t pt-4 space-y-3">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">مجموع قیمت:</span>
//                     <span className="font-semibold">{formatPrice(summary.subtotal)}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">هزینه ارسال:</span>
//                     <span>{formData.deliveryMethod === "express" ? formatPrice(50000) : "رایگان"}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">مالیات (۹%):</span>
//                     <span>{formatPrice(summary.tax)}</span>
//                   </div>
//                   {summary.discount > 0 && (
//                     <div className="flex justify-between text-sm text-green-600">
//                       <span>تخفیف:</span>
//                       <span>- {formatPrice(summary.discount)}</span>
//                     </div>
//                   )}
//                   <div className="border-t pt-3 mt-3">
//                     <div className="flex justify-between text-lg font-bold">
//                       <span>قابل پرداخت:</span>
//                       <span className="text-[#1c4793]">
//                         {formatPrice(
//                           summary.subtotal + 
//                           (formData.deliveryMethod === "express" ? 50000 : 0) + 
//                           summary.tax - 
//                           summary.discount
//                         )}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
                
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-[#1c4793] to-[#113d64] text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                       در حال ثبت سفارش...
//                     </>
//                   ) : (
//                     <>
//                       <CheckCircle className="w-5 h-5" />
//                       {currentStep === 3 ? "ثبت نهایی سفارش" : "ادامه"}
//                     </>
//                   )}
//                 </button>
                
//                 {currentStep > 1 && (
//                   <button
//                     type="button"
//                     onClick={handlePrevStep}
//                     className="w-full mt-3 py-2 px-4 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
//                   >
//                     بازگشت به مرحله قبل
//                   </button>
//                 )}
//               </div>
              
//               {/* ضمانت‌ها */}
//               <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
//                 <div className="flex items-center gap-3 mb-4">
//                   <Shield className="w-5 h-5 text-green-600" />
//                   <span className="font-semibold text-gray-800">ضمانت بازگشت وجه</span>
//                 </div>
//                 <p className="text-xs text-gray-500">در صورت عدم رضایت از محصول، وجه شما بازگردانده می‌شود.</p>
//               </div>
//             </div>
//           </div>
//         </form>