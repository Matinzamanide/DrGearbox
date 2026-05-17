// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { 
//   User, LogOut
//   , Heart, MapPin, Settings, 
//    CheckCircle, Package, ChevronRight,
//   Eye, Truck, CreditCard, Plus, X, Trash2,
//   Edit2, Star, Image as ImageIcon,Clock, AlertCircle
// } from "lucide-react";
// import axios from "axios";


// interface UserData {
//   id: number;
//   phone: string;
//   name: string;
//   family: string;
//   email?: string;
//   created_at?: string;
// }

// interface OrderItem {
//   id: number;
//   product_id: number;
//   product_title: string;
//   quantity: number;
//   price: number;
//   selected_options: string;
//   product_image?: string;
//   selected_options_parsed?: Record<string, any>;
// }

// interface Order {
//   id: number;
//   order_number: string;
//   total_price: number;
//   status: string;
//   payment_method: string;
//   delivery_method: string;
//   notes: string;
//   created_at: string;
//   items: OrderItem[];
// }

// interface Address {
//   id: number;
//   province: string;
//   city: string;
//   address: string;
//   postal_code: string;
//   is_default: number;
// }

// interface UserProfile {
//   name: string;
//   family: string;
//   phone: string;
//   email: string;
// }

// const UserPanel: React.FC = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState<UserData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState<"profile" | "orders" | "addresses" | "wishlist">("profile");
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [ordersLoading, setOrdersLoading] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [addresses, setAddresses] = useState<Address[]>([]);
//   const [addressesLoading, setAddressesLoading] = useState(false);
//   const [showAddAddressForm, setShowAddAddressForm] = useState(false);
//   const [isEditingProfile, setIsEditingProfile] = useState(false);
//   const [profileForm, setProfileForm] = useState<UserProfile>({
//     name: "",
//     family: "",
//     phone: "",
//     email: ""
//   });
//   const [editSuccess, setEditSuccess] = useState(false);
//   const [newAddress, setNewAddress] = useState({
//     province: "",
//     city: "",
//     address: "",
//     postal_code: ""
//   });
//   const [sessionToken, setSessionToken] = useState<string | null>(null);

//   useEffect(() => {
//     const token = localStorage.getItem("session_token");
//     const userData = localStorage.getItem("user");
    
//     if (!token || !userData) {
//       navigate("/auth/login");
//       return;
//     }
    
//     setSessionToken(token);
//     const parsedUser = JSON.parse(userData);
//     setUser(parsedUser);
//     setProfileForm({
//       name: parsedUser.name || "",
//       family: parsedUser.family || "",
//       phone: parsedUser.phone || "",
//       email: parsedUser.email || ""
//     });
//     verifySession(token);
//     fetchAddresses(token);
//   }, [navigate]);

//   const verifySession = async (token: string) => {
//     try {
//       const formData = new FormData();
//       formData.append("session_token", token);
      
//       const response = await axios.post(
//         "https://electroshahresfahan.com/drgearbox/auth/login_user.php",
//         formData
//       );
      
//       if (!response.data.success) {
//         handleLogout();
//       }
//     } catch (err) {
//       handleLogout();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchOrders = async () => {
//     if (!sessionToken) return;
    
//     setOrdersLoading(true);
//     try {
//       const response = await axios.get(
//         `https://electroshahresfahan.com/drgearbox/auth/get_user_orders.php?session_token=${sessionToken}`
//       );
//       if (response.data.success) {
//         setOrders(response.data.orders);
//       }
//     } catch (err) {
//       console.error("Error fetching orders:", err);
//     } finally {
//       setOrdersLoading(false);
//     }
//   };

//   const fetchAddresses = async (token: string) => {
//     setAddressesLoading(true);
//     try {
//       const response = await axios.get(
//         `https://electroshahresfahan.com/drgearbox/auth/get_user_addresses.php?session_token=${token}`
//       );
//       if (response.data.success) {
//         setAddresses(response.data.addresses);
//       }
//     } catch (err) {
//       console.error("Error fetching addresses:", err);
//     } finally {
//       setAddressesLoading(false);
//     }
//   };

//   const updateProfile = async () => {
//     if (!sessionToken) return;
    
//     try {
//       const formData = new FormData();
//       formData.append("session_token", sessionToken);
//       formData.append("name", profileForm.name);
//       formData.append("family", profileForm.family);
//       formData.append("email", profileForm.email);
      
//       const response = await axios.post(
//         "https://electroshahresfahan.com/drgearbox/auth/update_profile.php",
//         formData
//       );
      
//       if (response.data.success) {
//         const updatedUser = { ...user, name: profileForm.name, family: profileForm.family, email: profileForm.email };
//         setUser(updatedUser as UserData);
//         localStorage.setItem("user", JSON.stringify(updatedUser));
//         setIsEditingProfile(false);
//         setEditSuccess(true);
//         setTimeout(() => setEditSuccess(false), 3000);
//       } else {
//         alert(response.data.error);
//       }
//     } catch (err) {
//       console.error("Error updating profile:", err);
//       alert("خطا در ویرایش اطلاعات");
//     }
//   };

//   const addNewAddress = async () => {
//     if (!newAddress.province || !newAddress.city || !newAddress.address || !newAddress.postal_code) {
//       alert("لطفاً تمام فیلدهای آدرس را پر کنید");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("session_token", sessionToken || "");
//       formData.append("province", newAddress.province);
//       formData.append("city", newAddress.city);
//       formData.append("address", newAddress.address);
//       formData.append("postal_code", newAddress.postal_code);

//       const response = await axios.post(
//         "https://electroshahresfahan.com/drgearbox/auth/add_user_address.php",
//         formData
//       );

//       if (response.data.success) {
//         if (sessionToken) {
//           await fetchAddresses(sessionToken);
//         }
//         setShowAddAddressForm(false);
//         setNewAddress({ province: "", city: "", address: "", postal_code: "" });
//         alert("آدرس با موفقیت اضافه شد");
//       } else {
//         alert(response.data.error);
//       }
//     } catch (err) {
//       console.error("Error adding address:", err);
//       alert("خطا در افزودن آدرس");
//     }
//   };

//   const setDefaultAddress = async (addressId: number) => {
//     if (!sessionToken) return;
    
//     try {
//       const formData = new FormData();
//       formData.append("session_token", sessionToken);
//       formData.append("address_id", String(addressId));
      
//       const response = await axios.post(
//         "https://electroshahresfahan.com/drgearbox/auth/set_default_address.php",
//         formData
//       );
      
//       if (response.data.success) {
//         if (sessionToken) {
//           await fetchAddresses(sessionToken);
//         }
//         alert("آدرس پیش‌فرض با موفقیت تنظیم شد");
//       } else {
//         alert(response.data.error);
//       }
//     } catch (err) {
//       console.error("Error setting default address:", err);
//       alert("خطا در تنظیم آدرس پیش‌فرض");
//     }
//   };

//   const deleteAddress = async (addressId: number) => {
//     if (!sessionToken) return;
    
//     if (!window.confirm("آیا از حذف این آدرس مطمئن هستید؟")) {
//       return;
//     }
    
//     try {
//       const formData = new FormData();
//       formData.append("session_token", sessionToken);
//       formData.append("address_id", String(addressId));
      
//       const response = await axios.post(
//         "https://electroshahresfahan.com/drgearbox/auth/delete_user_address.php",
//         formData
//       );
      
//       if (response.data.success) {
//         if (sessionToken) {
//           await fetchAddresses(sessionToken);
//         }
//         alert("آدرس با موفقیت حذف شد");
//       } else {
//         alert(response.data.error);
//       }
//     } catch (err) {
//       console.error("Error deleting address:", err);
//       alert("خطا در حذف آدرس");
//     }
//   };

//   const handleTabChange = (tab: "profile" | "orders" | "addresses" | "wishlist") => {
//     setActiveTab(tab);
//     setSelectedOrder(null);
//     setIsEditingProfile(false);
//     if (tab === "orders") {
//       fetchOrders();
//     } else if (tab === "addresses" && sessionToken) {
//       fetchAddresses(sessionToken);
//     }
//   };

//   const handleLogout = async () => {
//     if (sessionToken) {
//       try {
//         const formData = new FormData();
//         formData.append("session_token", sessionToken);
//         await axios.post(
//           "https://electroshahresfahan.com/drgearbox/auth/logout_user.php",
//           formData
//         );
//       } catch (err) {
//         console.error("Logout error:", err);
//       }
//     }
    
//     localStorage.removeItem("user");
//     localStorage.removeItem("session_token");
//     window.location.reload();
//     navigate("/auth/login");
//   };

//   const getStatusIcon = (status: string) => {
//     switch(status) {
//       case 'delivered': return <CheckCircle className="w-4 h-4" />;
//       case 'shipped': return <Truck className="w-4 h-4" />;
//       case 'processing': return <Settings className="w-4 h-4" />;
//       case 'paid': return <CreditCard className="w-4 h-4" />;
//       case 'cancelled': return <AlertCircle className="w-4 h-4" />;
//       default: return <Clock className="w-4 h-4" />;
//     }
//   };

//   const getStatusText = (status: string) => {
//     const statusMap: Record<string, { text: string; color: string }> = {
//       pending: { text: "در انتظار پرداخت", color: "bg-yellow-100 text-yellow-800" },
//       paid: { text: "پرداخت شده", color: "bg-blue-100 text-blue-800" },
//       processing: { text: "در حال پردازش", color: "bg-purple-100 text-purple-800" },
//       shipped: { text: "ارسال شده", color: "bg-indigo-100 text-indigo-800" },
//       delivered: { text: "تحویل شده", color: "bg-green-100 text-green-800" },
//       cancelled: { text: "لغو شده", color: "bg-red-100 text-red-800" },
//     };
//     return statusMap[status] || { text: status, color: "bg-gray-100 text-gray-800" };
//   };

//   const getPaymentMethodText = (method: string) => {
//     const methodMap: Record<string, string> = {
//       online: "پرداخت آنلاین",
//       cash: "پرداخت در محل",
//       card: "کارت به کارت"
//     };
//     return methodMap[method] || method;
//   };

//   const getDeliveryMethodText = (method: string) => {
//     const methodMap: Record<string, string> = {
//       express: "ارسال سریع (۲۴ ساعته)",
//       normal: "ارسال عادی",
//       pickup: "تحویل حضوری"
//     };
//     return methodMap[method] || method;
//   };

//  const formatPrice = (price: number) => {
//   if (!price && price !== 0) return "0 تومان";
//   return price.toLocaleString("en-US") + " تومان";
// };

//   const formatDate = (dateStr: string) => {
//     return new Date(dateStr).toLocaleDateString("fa-IR");
//   };

//   const renderSelectedOptions = (selectedOptions: string) => {
//     if (!selectedOptions || selectedOptions === "[]" || selectedOptions === "{}") {
//       return null;
//     }
    
//     try {
//       const options = JSON.parse(selectedOptions);
//       if (Object.keys(options).length === 0) return null;
      
//       return (
//         <div className="mt-3 pt-3 border-t border-gray-100">
//           <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
//             <Settings className="w-3 h-3" />
//             مشخصات انتخاب شده:
//           </p>
//           <div className="flex flex-wrap gap-2">
//             {Object.entries(options).map(([key, val]: [string, any]) => (
//               <div key={key} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg px-3 py-1.5 text-xs border border-gray-200 shadow-sm">
//                 <span className="font-semibold text-gray-700">{key}:</span>
//                 <span className="text-gray-600 mx-1">{val.value}</span>
//                 {val.modifier !== 0 && (
//                   <span className="text-[#32a3db]">
//                     ({val.modifier_type === 'percent' 
//                       ? `${val.modifier > 0 ? `+${val.modifier}%` : `${val.modifier}%`}`
//                       : `${val.modifier > 0 ? `+${val.modifier.toLocaleString("fa-IR")}` : val.modifier.toLocaleString("fa-IR")} تومان`
//                     })
//                   </span>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       );
//     } catch (e) {
//       return null;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
//         <div className="w-12 h-12 border-4 border-t-[#1c4793] border-gray-200 rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   if (!user) return null;

//   const orderStats = {
//     total: orders.length,
//     delivered: orders.filter(o => o.status === 'delivered').length,
//     pending: orders.filter(o => o.status === 'pending').length,
//     totalSpent: orders.reduce((sum, o) => sum + o.total_price, 0)
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       {/* هدر با طرح جدید */}
//       <div className="bg-gradient-to-r from-[#1c4793] to-[#113d64] text-white">
//         <div className="max-w-6xl mx-auto px-4 py-6">
//           <div className="flex items-center justify-between flex-wrap gap-4">
//             <div className="flex items-center gap-4">
//               <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
//                 <User className="w-8 h-8" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold">پنل کاربری</h1>
//                 <p className="text-blue-200 mt-1">
//                   خوش آمدید {user.name} {user.family}
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={handleLogout}
//               className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition-all duration-300 backdrop-blur-sm"
//             >
//               <LogOut className="w-5 h-5" />
//               خروج
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-6xl mx-auto px-4 py-8">
//         {/* کارت‌های آماری - فقط در صورتی که سفارش وجود داشته باشد */}
//         {orders.length > 0 && (
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//             <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-500 text-sm">کل سفارشات</p>
//                   <p className="text-2xl font-bold text-gray-800 mt-1">{orderStats.total}</p>
//                 </div>
//                 <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
//                   <Package className="w-5 h-5 text-[#1c4793]" />
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-500 text-sm">تحویل شده</p>
//                   <p className="text-2xl font-bold text-green-600 mt-1">{orderStats.delivered}</p>
//                 </div>
//                 <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
//                   <CheckCircle className="w-5 h-5 text-green-600" />
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-500 text-sm">در انتظار</p>
//                   <p className="text-2xl font-bold text-yellow-600 mt-1">{orderStats.pending}</p>
//                 </div>
//                 <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
//                   <Clock className="w-5 h-5 text-yellow-600" />
//                 </div>
//               </div>
//             </div>
//             {/* <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-500 text-sm">مجموع خرید</p>
//                   <p className="text-xl font-bold text-[#1c4793] mt-1">{formatPrice(orderStats.totalSpent)}</p>
//                 </div>
//                 <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
//                   <Wallet className="w-5 h-5 text-purple-600" />
//                 </div>
//               </div>
//             </div> */}
//           </div>
//         )}

//         {/* تب‌ها */}
//         <div className="flex flex-wrap gap-2 mb-8">
//           <button
//             onClick={() => handleTabChange("profile")}
//             className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
//               activeTab === "profile"
//                 ? "bg-[#1c4793] text-white shadow-md"
//                 : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
//             }`}
//           >
//             <User className="w-4 h-4" />
//             اطلاعات شخصی
//           </button>
//           <button
//             onClick={() => handleTabChange("orders")}
//             className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
//               activeTab === "orders"
//                 ? "bg-[#1c4793] text-white shadow-md"
//                 : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
//             }`}
//           >
//             <Package className="w-4 h-4" />
//             سفارشات من
//           </button>
//           <button
//             onClick={() => handleTabChange("addresses")}
//             className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
//               activeTab === "addresses"
//                 ? "bg-[#1c4793] text-white shadow-md"
//                 : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
//             }`}
//           >
//             <MapPin className="w-4 h-4" />
//             آدرس‌های من
//           </button>
//           <button
//             onClick={() => handleTabChange("wishlist")}
//             className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
//               activeTab === "wishlist"
//                 ? "bg-[#1c4793] text-white shadow-md"
//                 : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
//             }`}
//           >
//             <Heart className="w-4 h-4" />
//             علاقه‌مندی‌ها
//           </button>
//         </div>

//         {/* تب اطلاعات شخصی */}
//         {activeTab === "profile" && (
//           <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//             <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <User className="w-5 h-5 text-[#1c4793]" />
//                   <h2 className="text-lg font-bold text-gray-800">اطلاعات شخصی</h2>
//                 </div>
//                 {!isEditingProfile && (
//                   <button
//                     onClick={() => setIsEditingProfile(true)}
//                     className="flex items-center gap-2 text-[#1c4793] text-sm font-semibold hover:underline"
//                   >
//                     <Edit2 className="w-4 h-4" />
//                     ویرایش اطلاعات
//                   </button>
//                 )}
//               </div>
//             </div>
            
//             <div className="p-6">
//               {editSuccess && (
//                 <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 animate-fade-in">
//                   <CheckCircle className="w-5 h-5 text-green-600" />
//                   <span className="text-green-700 text-sm">اطلاعات شما با موفقیت به‌روزرسانی شد</span>
//                 </div>
//               )}
              
//               {isEditingProfile ? (
//                 <div className="space-y-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-1">نام</label>
//                       <input
//                         type="text"
//                         value={profileForm.name}
//                         onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793] transition-all"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-1">نام خانوادگی</label>
//                       <input
//                         type="text"
//                         value={profileForm.family}
//                         onChange={(e) => setProfileForm({ ...profileForm, family: e.target.value })}
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793]"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-1">شماره تلفن</label>
//                       <input
//                         type="tel"
//                         value={profileForm.phone}
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-gray-50"
//                         disabled
//                       />
//                       <p className="text-xs text-gray-400 mt-1">شماره تلفن قابل ویرایش نیست</p>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-1">ایمیل</label>
//                       <input
//                         type="email"
//                         value={profileForm.email}
//                         onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
//                         placeholder="ایمیل خود را وارد کنید"
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793]"
//                       />
//                     </div>
//                   </div>
//                   <div className="flex gap-3 pt-4">
//                     <button
//                       onClick={updateProfile}
//                       className="px-6 py-2.5 bg-[#1c4793] text-white rounded-xl hover:bg-[#113d64] transition-colors"
//                     >
//                       ذخیره تغییرات
//                     </button>
//                     <button
//                       onClick={() => {
//                         setIsEditingProfile(false);
//                         setProfileForm({
//                           name: user?.name || "",
//                           family: user?.family || "",
//                           phone: user?.phone || "",
//                           email: user?.email || ""
//                         });
//                       }}
//                       className="px-6 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
//                     >
//                       انصراف
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="p-4 bg-gray-50 rounded-xl">
//                     <label className="block text-sm text-gray-500">نام</label>
//                     <p className="font-semibold text-gray-800 text-lg mt-1">{user.name}</p>
//                   </div>
//                   <div className="p-4 bg-gray-50 rounded-xl">
//                     <label className="block text-sm text-gray-500">نام خانوادگی</label>
//                     <p className="font-semibold text-gray-800 text-lg mt-1">{user.family}</p>
//                   </div>
//                   <div className="p-4 bg-gray-50 rounded-xl">
//                     <label className="block text-sm text-gray-500">شماره تلفن</label>
//                     <p className="font-semibold text-gray-800 text-lg mt-1">{user.phone}</p>
//                   </div>
//                   <div className="p-4 bg-gray-50 rounded-xl">
//                     <label className="block text-sm text-gray-500">تاریخ عضویت</label>
//                     <p className="font-semibold text-gray-800 text-lg mt-1">
//                       {user.created_at ? formatDate(user.created_at) : "نامشخص"}
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* تب سفارشات */}
//         {activeTab === "orders" && (
//           <div className="bg-white rounded-2xl shadow-lg p-6">
//             <div className="flex items-center gap-3 mb-6">
//               <Package className="w-6 h-6 text-[#1c4793]" />
//               <h2 className="text-xl font-bold text-gray-800">سفارشات من</h2>
//             </div>
            
//             {ordersLoading ? (
//               <div className="text-center py-12">
//                 <div className="w-10 h-10 border-4 border-t-[#1c4793] border-gray-200 rounded-full animate-spin mx-auto"></div>
//                 <p className="text-gray-500 mt-3">در حال بارگذاری سفارشات...</p>
//               </div>
//             ) : orders.length === 0 ? (
//               <div className="text-center py-12">
//                 <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
//                 <p className="text-gray-500">تاکنون سفارشی ثبت نکرده‌اید</p>
//                 <button
//                   onClick={() => navigate("/")}
//                   className="mt-4 px-6 py-2 bg-[#1c4793] text-white rounded-lg hover:bg-[#113d64] transition-colors"
//                 >
//                   شروع خرید
//                 </button>
//               </div>
//             ) : selectedOrder ? (
//               <div>
//                 <button
//                   onClick={() => setSelectedOrder(null)}
//                   className="flex items-center gap-1 text-gray-500 hover:text-[#1c4793] mb-4 transition-colors"
//                 >
//                   <ChevronRight className="w-4 h-4" />
//                   بازگشت به لیست سفارشات
//                 </button>
                
//                 <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 mb-6 border border-gray-200">
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     <div>
//                       <p className="text-sm text-gray-500">شماره سفارش</p>
//                       <p className="font-bold text-gray-800 text-lg">{selectedOrder.order_number}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">تاریخ ثبت</p>
//                       <p className="font-bold text-gray-800">{formatDate(selectedOrder.created_at)}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">وضعیت</p>
//                       <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusText(selectedOrder.status).color}`}>
//                         {getStatusIcon(selectedOrder.status)}
//                         {getStatusText(selectedOrder.status).text}
//                       </span>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">روش پرداخت</p>
//                       <p className="font-semibold text-gray-700">{getPaymentMethodText(selectedOrder.payment_method)}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">روش ارسال</p>
//                       <p className="font-semibold text-gray-700">{getDeliveryMethodText(selectedOrder.delivery_method)}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">مبلغ کل</p>
//                       <p className="font-bold text-[#1c4793] text-xl">{selectedOrder.total_price.toLocaleString('fa-IR')}</p>
//                     </div>
//                   </div>
//                   {selectedOrder.notes && (
//                     <div className="mt-4 pt-4 border-t border-gray-200">
//                       <p className="text-sm text-gray-500">توضیحات</p>
//                       <p className="text-gray-700 mt-1">{selectedOrder.notes}</p>
//                     </div>
//                   )}
//                 </div>
                
//                 <h3 className="font-bold text-gray-800 mb-4">محصولات سفارش</h3>
//                 <div className="space-y-4">
//                   {selectedOrder.items.map((item) => (
//                     <div key={item.id} className="flex gap-4 p-4 bg-white border rounded-xl hover:shadow-md transition-all">
//                       <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
//                         {item.product_image ? (
//                           <img 
//                             src={item.product_image} 
//                             alt={item.product_title}
//                             className="w-full h-full object-cover"
//                             onError={(e) => {
//                               (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=No+Image";
//                             }}
//                           />
//                         ) : (
//                           <div className="w-full h-full flex items-center justify-center">
//                             <ImageIcon className="w-8 h-8 text-gray-300" />
//                           </div>
//                         )}
//                       </div>
                      
//                       <div className="flex-1">
//                         <div className="flex justify-between items-start flex-wrap gap-2">
//                           <div>
//                             <h4 className="font-bold text-gray-800 text-lg">{item.product_title}</h4>
//                             <div className="flex flex-wrap gap-3 mt-1">
//                               <span className="text-sm text-gray-500">تعداد: {item.quantity}</span>
//                               <span className="text-sm text-gray-500">قیمت واحد: {formatPrice(item.price * item.quantity)}</span>
//                             </div>
//                           </div>
//                           <div className="text-left">
//                             <p className="font-bold text-[#1c4793] text-xl">{formatPrice(item.price * item.quantity)}</p>
//                           </div>
//                         </div>
                        
//                         {renderSelectedOptions(item.selected_options)}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {orders.map((order) => (
//                   <div
//                     key={order.id}
//                     onClick={() => setSelectedOrder(order)}
//                     className="flex flex-wrap items-center justify-between gap-4 p-4 border rounded-xl hover:shadow-md transition-all cursor-pointer group"
//                   >
//                     <div>
//                       <p className="font-bold text-gray-800">{order.order_number}</p>
//                       <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
//                     </div>
//                     <div>
//                       <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusText(order.status).color}`}>
//                         {getStatusIcon(order.status)}
//                         {getStatusText(order.status).text}
//                       </span>
//                     </div>
//                     <div className="text-right">
//                       <p className="font-bold text-[#1c4793]">{formatPrice(order.total_price).toLocaleString()}</p>
//                       <p className="text-xs text-gray-400">{order.items.length} محصول</p>
//                     </div>
//                     <Eye className="w-5 h-5 text-gray-400 group-hover:text-[#1c4793] transition-colors" />
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* تب آدرس‌ها */}
//         {activeTab === "addresses" && (
//           <div className="bg-white rounded-2xl shadow-lg p-6">
//             <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
//               <div className="flex items-center gap-3">
//                 <MapPin className="w-6 h-6 text-[#1c4793]" />
//                 <h2 className="text-xl font-bold text-gray-800">آدرس‌های من</h2>
//               </div>
//               <button
//                 onClick={() => setShowAddAddressForm(!showAddAddressForm)}
//                 className="flex items-center gap-2 text-[#1c4793] text-sm font-semibold hover:underline"
//               >
//                 {showAddAddressForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
//                 {showAddAddressForm ? "انصراف" : "افزودن آدرس جدید"}
//               </button>
//             </div>
            
//             {addressesLoading ? (
//               <div className="text-center py-12">
//                 <div className="w-10 h-10 border-4 border-t-[#1c4793] border-gray-200 rounded-full animate-spin mx-auto"></div>
//               </div>
//             ) : showAddAddressForm ? (
//               <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <input
//                     type="text"
//                     placeholder="استان"
//                     value={newAddress.province}
//                     onChange={(e) => setNewAddress({ ...newAddress, province: e.target.value })}
//                     className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793]"
//                   />
//                   <input
//                     type="text"
//                     placeholder="شهر"
//                     value={newAddress.city}
//                     onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
//                     className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793]"
//                   />
//                   <textarea
//                     placeholder="آدرس کامل (خیابان، پلاک، واحد)"
//                     value={newAddress.address}
//                     onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
//                     rows={3}
//                     className="col-span-2 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793]"
//                   />
//                   <input
//                     type="text"
//                     placeholder="کد پستی"
//                     value={newAddress.postal_code}
//                     onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
//                     className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793]"
//                   />
//                 </div>
//                 <button
//                   onClick={addNewAddress}
//                   className="px-5 py-2 bg-[#1c4793] text-white rounded-xl hover:bg-[#113d64] transition-colors"
//                 >
//                   ذخیره آدرس
//                 </button>
//               </div>
//             ) : addresses.length === 0 ? (
//               <div className="text-center py-12">
//                 <MapPin className="w-16 h-16 mx-auto text-gray-300 mb-4" />
//                 <p className="text-gray-500">هیچ آدرسی ثبت نشده است</p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {addresses.map((addr) => (
//                   <div key={addr.id} className="flex items-start justify-between p-4 border rounded-xl hover:shadow-md transition-all">
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 mb-2">
//                         <MapPin className="w-4 h-4 text-[#1c4793]" />
//                         <p className="font-semibold text-gray-800">
//                           {addr.province} - {addr.city}
//                         </p>
//                         {addr.is_default === 1 && (
//                           <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">آدرس پیش‌فرض</span>
//                         )}
//                       </div>
//                       <p className="text-gray-600 text-sm">{addr.address}</p>
//                       <p className="text-gray-400 text-xs mt-1">کد پستی: {addr.postal_code}</p>
//                     </div>
//                     <div className="flex gap-2">
//                       {addr.is_default !== 1 && (
//                         <button
//                           onClick={() => setDefaultAddress(addr.id)}
//                           className="p-2 text-gray-400 hover:text-[#1c4793] transition-colors"
//                           title="تنظیم به عنوان آدرس پیش‌فرض"
//                         >
//                           <Star className="w-4 h-4" />
//                         </button>
//                       )}
//                       <button
//                         onClick={() => deleteAddress(addr.id)}
//                         className="p-2 text-gray-400 hover:text-red-500 transition-colors"
//                         title="حذف آدرس"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* تب علاقه‌مندی‌ها */}
//         {activeTab === "wishlist" && (
//           <div className="bg-white rounded-2xl shadow-lg p-6">
//             <div className="flex items-center gap-3 mb-6">
//               <Heart className="w-6 h-6 text-[#1c4793]" />
//               <h2 className="text-xl font-bold text-gray-800">علاقه‌مندی‌های من</h2>
//             </div>
//             <div className="text-center py-12">
//               <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
//               <p className="text-gray-500">هیچ محصولی به علاقه‌مندی‌ها اضافه نشده است</p>
//               <button
//                 onClick={() => navigate("/")}
//                 className="mt-4 px-6 py-2 bg-[#1c4793] text-white rounded-lg hover:bg-[#113d64] transition-colors"
//               >
//                 مشاهده محصولات
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       <style>{`
//         @keyframes fade-in {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fade-in {
//           animation: fade-in 0.3s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default UserPanel;







































import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, LogOut
  , Heart, MapPin, Settings, 
   CheckCircle, Package, ChevronRight,
  Eye, Truck, CreditCard, Plus, X, Trash2,
  Edit2, Star, Image as ImageIcon,Clock, AlertCircle,
  Printer
} from "lucide-react";
import axios from "axios";
import Invoice from "../../components/InoviceModal";


interface UserData {
  id: number;
  phone: string;
  name: string;
  family: string;
  email?: string;
  created_at?: string;
}

interface OrderItem {
  id: number;
  product_id: number;
  product_title: string;
  quantity: number;
  price: number;
  selected_options: string;
  product_image?: string;
  selected_options_parsed?: Record<string, any>;
}

interface Order {
  id: number;
  order_number: string;
  total_price: number;
  status: string;
  payment_method: string;
  delivery_method: string;
  notes: string;
  created_at: string;
  items: OrderItem[];
}

interface Address {
  id: number;
  province: string;
  city: string;
  address: string;
  postal_code: string;
  is_default: number;
}

interface UserProfile {
  name: string;
  family: string;
  phone: string;
  email: string;
}

const UserPanel: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "addresses" | "wishlist">("profile");
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [profileForm, setProfileForm] = useState<UserProfile>({
    name: "",
    family: "",
    phone: "",
    email: ""
  });
  const [editSuccess, setEditSuccess] = useState(false);
  const [newAddress, setNewAddress] = useState({
    province: "",
    city: "",
    address: "",
    postal_code: ""
  });
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("session_token");
    const userData = localStorage.getItem("user");
    
    if (!token || !userData) {
      navigate("/auth/login");
      return;
    }
    
    setSessionToken(token);
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setProfileForm({
      name: parsedUser.name || "",
      family: parsedUser.family || "",
      phone: parsedUser.phone || "",
      email: parsedUser.email || ""
    });
    verifySession(token);
    fetchAddresses(token);
  }, [navigate]);

  const verifySession = async (token: string) => {
    try {
      const formData = new FormData();
      formData.append("session_token", token);
      
      const response = await axios.post(
        "https://electroshahresfahan.com/drgearbox/auth/login_user.php",
        formData
      );
      
      if (!response.data.success) {
        handleLogout();
      }
    } catch (err) {
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    if (!sessionToken) return;
    
    setOrdersLoading(true);
    try {
      const response = await axios.get(
        `https://electroshahresfahan.com/drgearbox/auth/get_user_orders.php?session_token=${sessionToken}`
      );
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchAddresses = async (token: string) => {
    setAddressesLoading(true);
    try {
      const response = await axios.get(
        `https://electroshahresfahan.com/drgearbox/auth/get_user_addresses.php?session_token=${token}`
      );
      if (response.data.success) {
        setAddresses(response.data.addresses);
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
    } finally {
      setAddressesLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!sessionToken) return;
    
    try {
      const formData = new FormData();
      formData.append("session_token", sessionToken);
      formData.append("name", profileForm.name);
      formData.append("family", profileForm.family);
      formData.append("email", profileForm.email);
      
      const response = await axios.post(
        "https://electroshahresfahan.com/drgearbox/auth/update_profile.php",
        formData
      );
      
      if (response.data.success) {
        const updatedUser = { ...user, name: profileForm.name, family: profileForm.family, email: profileForm.email };
        setUser(updatedUser as UserData);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setIsEditingProfile(false);
        setEditSuccess(true);
        setTimeout(() => setEditSuccess(false), 3000);
      } else {
        alert(response.data.error);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("خطا در ویرایش اطلاعات");
    }
  };

  const addNewAddress = async () => {
    if (!newAddress.province || !newAddress.city || !newAddress.address || !newAddress.postal_code) {
      alert("لطفاً تمام فیلدهای آدرس را پر کنید");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("session_token", sessionToken || "");
      formData.append("province", newAddress.province);
      formData.append("city", newAddress.city);
      formData.append("address", newAddress.address);
      formData.append("postal_code", newAddress.postal_code);

      const response = await axios.post(
        "https://electroshahresfahan.com/drgearbox/auth/add_user_address.php",
        formData
      );

      if (response.data.success) {
        if (sessionToken) {
          await fetchAddresses(sessionToken);
        }
        setShowAddAddressForm(false);
        setNewAddress({ province: "", city: "", address: "", postal_code: "" });
        alert("آدرس با موفقیت اضافه شد");
      } else {
        alert(response.data.error);
      }
    } catch (err) {
      console.error("Error adding address:", err);
      alert("خطا در افزودن آدرس");
    }
  };

  const setDefaultAddress = async (addressId: number) => {
    if (!sessionToken) return;
    
    try {
      const formData = new FormData();
      formData.append("session_token", sessionToken);
      formData.append("address_id", String(addressId));
      
      const response = await axios.post(
        "https://electroshahresfahan.com/drgearbox/auth/set_default_address.php",
        formData
      );
      
      if (response.data.success) {
        if (sessionToken) {
          await fetchAddresses(sessionToken);
        }
        alert("آدرس پیش‌فرض با موفقیت تنظیم شد");
      } else {
        alert(response.data.error);
      }
    } catch (err) {
      console.error("Error setting default address:", err);
      alert("خطا در تنظیم آدرس پیش‌فرض");
    }
  };

  const deleteAddress = async (addressId: number) => {
    if (!sessionToken) return;
    
    if (!window.confirm("آیا از حذف این آدرس مطمئن هستید؟")) {
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append("session_token", sessionToken);
      formData.append("address_id", String(addressId));
      
      const response = await axios.post(
        "https://electroshahresfahan.com/drgearbox/auth/delete_user_address.php",
        formData
      );
      
      if (response.data.success) {
        if (sessionToken) {
          await fetchAddresses(sessionToken);
        }
        alert("آدرس با موفقیت حذف شد");
      } else {
        alert(response.data.error);
      }
    } catch (err) {
      console.error("Error deleting address:", err);
      alert("خطا در حذف آدرس");
    }
  };

  const handleTabChange = (tab: "profile" | "orders" | "addresses" | "wishlist") => {
    setActiveTab(tab);
    setSelectedOrder(null);
    setIsEditingProfile(false);
    if (tab === "orders") {
      fetchOrders();
    } else if (tab === "addresses" && sessionToken) {
      fetchAddresses(sessionToken);
    }
  };

  const handleLogout = async () => {
    if (sessionToken) {
      try {
        const formData = new FormData();
        formData.append("session_token", sessionToken);
        await axios.post(
          "https://electroshahresfahan.com/drgearbox/auth/logout_user.php",
          formData
        );
      } catch (err) {
        console.error("Logout error:", err);
      }
    }
    
    localStorage.removeItem("user");
    localStorage.removeItem("session_token");
    window.location.reload();
    navigate("/auth/login");
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'processing': return <Settings className="w-4 h-4" />;
      case 'paid': return <CreditCard className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, { text: string; color: string }> = {
      pending: { text: "در انتظار پرداخت", color: "bg-yellow-100 text-yellow-800" },
      paid: { text: "پرداخت شده", color: "bg-blue-100 text-blue-800" },
      processing: { text: "در حال پردازش", color: "bg-purple-100 text-purple-800" },
      shipped: { text: "ارسال شده", color: "bg-indigo-100 text-indigo-800" },
      delivered: { text: "تحویل شده", color: "bg-green-100 text-green-800" },
      cancelled: { text: "لغو شده", color: "bg-red-100 text-red-800" },
    };
    return statusMap[status] || { text: status, color: "bg-gray-100 text-gray-800" };
  };

  const getPaymentMethodText = (method: string) => {
    const methodMap: Record<string, string> = {
      online: "پرداخت آنلاین",
      cash: "پرداخت در محل",
      card: "کارت به کارت"
    };
    return methodMap[method] || method;
  };

  const getDeliveryMethodText = (method: string) => {
    const methodMap: Record<string, string> = {
      express: "ارسال سریع (۲۴ ساعته)",
      normal: "ارسال عادی",
      pickup: "تحویل حضوری"
    };
    return methodMap[method] || method;
  };

 const formatPrice = (price: number) => {
  if (!price && price !== 0) return "0 تومان";
  return price.toLocaleString("en-US") + " تومان";
};

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fa-IR");
  };

  const renderSelectedOptions = (selectedOptions: string) => {
    if (!selectedOptions || selectedOptions === "[]" || selectedOptions === "{}") {
      return null;
    }
    
    try {
      const options = JSON.parse(selectedOptions);
      if (Object.keys(options).length === 0) return null;
      
      return (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <Settings className="w-3 h-3" />
            مشخصات انتخاب شده:
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(options).map(([key, val]: [string, any]) => (
              <div key={key} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg px-3 py-1.5 text-xs border border-gray-200 shadow-sm">
                <span className="font-semibold text-gray-700">{key}:</span>
                <span className="text-gray-600 mx-1">{val.value}</span>
                {val.modifier !== 0 && (
                  <span className="text-[#32a3db]">
                    ({val.modifier_type === 'percent' 
                      ? `${val.modifier > 0 ? `+${val.modifier}%` : `${val.modifier}%`}`
                      : `${val.modifier > 0 ? `+${val.modifier.toLocaleString("fa-IR")}` : val.modifier.toLocaleString("fa-IR")} تومان`
                    })
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    } catch (e) {
      return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-[#1c4793] border-gray-200 rounded-full animate-spin"></div>
      </div>
    );
  }
  const testnumber=123456;
  if (!user) return null;

  const orderStats = {
    total: orders.length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    pending: orders.filter(o => o.status === 'pending').length,
    totalSpent: orders.reduce((sum, o) => sum + o.total_price, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* هدر با طرح جدید */}
      <div className="bg-gradient-to-r from-[#1c4793] to-[#113d64] text-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">پنل کاربری</h1>
                <p className="text-blue-200 mt-1">
                  خوش آمدید {user.name} {user.family}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition-all duration-300 backdrop-blur-sm"
            >
              <LogOut className="w-5 h-5" />
              خروج
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* کارت‌های آماری - فقط در صورتی که سفارش وجود داشته باشد */}
        {orders.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">کل سفارشات</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{orderStats.total}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Package className="w-5 h-5 text-[#1c4793]" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">تحویل شده</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{orderStats.delivered}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">در انتظار</p>
                  <p className="text-2xl font-bold text-yellow-600 mt-1">{orderStats.pending}</p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
            </div>
            {/* <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">مجموع خرید</p>
                  <p className="text-xl font-bold text-[#1c4793] mt-1">{formatPrice(orderStats.totalSpent)}</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Wallet className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div> */}
          </div>
        )}

        {/* تب‌ها */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => handleTabChange("profile")}
            className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === "profile"
                ? "bg-[#1c4793] text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <User className="w-4 h-4" />
            اطلاعات شخصی
          </button>
          <button
            onClick={() => handleTabChange("orders")}
            className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === "orders"
                ? "bg-[#1c4793] text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <Package className="w-4 h-4" />
            سفارشات من
          </button>
          <button
            onClick={() => handleTabChange("addresses")}
            className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === "addresses"
                ? "bg-[#1c4793] text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <MapPin className="w-4 h-4" />
            آدرس‌های من
          </button>
          <button
            onClick={() => handleTabChange("wishlist")}
            className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === "wishlist"
                ? "bg-[#1c4793] text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <Heart className="w-4 h-4" />
            علاقه‌مندی‌ها
          </button>
        </div>

        {/* تب اطلاعات شخصی */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-[#1c4793]" />
                  <h2 className="text-lg font-bold text-gray-800">اطلاعات شخصی</h2>
                </div>
                {!isEditingProfile && (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="flex items-center gap-2 text-[#1c4793] text-sm font-semibold hover:underline"
                  >
                    <Edit2 className="w-4 h-4" />
                    ویرایش اطلاعات
                  </button>
                )}
              </div>
            </div>
            
            <div className="p-6">
              {editSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 animate-fade-in">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 text-sm">اطلاعات شما با موفقیت به‌روزرسانی شد</span>
                </div>
              )}
              
              {isEditingProfile ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">نام</label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">نام خانوادگی</label>
                      <input
                        type="text"
                        value={profileForm.family}
                        onChange={(e) => setProfileForm({ ...profileForm, family: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">شماره تلفن</label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-gray-50"
                        disabled
                      />
                      <p className="text-xs text-gray-400 mt-1">شماره تلفن قابل ویرایش نیست</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">ایمیل</label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        placeholder="ایمیل خود را وارد کنید"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793]"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={updateProfile}
                      className="px-6 py-2.5 bg-[#1c4793] text-white rounded-xl hover:bg-[#113d64] transition-colors"
                    >
                      ذخیره تغییرات
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingProfile(false);
                        setProfileForm({
                          name: user?.name || "",
                          family: user?.family || "",
                          phone: user?.phone || "",
                          email: user?.email || ""
                        });
                      }}
                      className="px-6 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      انصراف
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <label className="block text-sm text-gray-500">نام</label>
                    <p className="font-semibold text-gray-800 text-lg mt-1">{user.name}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <label className="block text-sm text-gray-500">نام خانوادگی</label>
                    <p className="font-semibold text-gray-800 text-lg mt-1">{user.family}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <label className="block text-sm text-gray-500">شماره تلفن</label>
                    <p className="font-semibold text-gray-800 text-lg mt-1">{user.phone}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <label className="block text-sm text-gray-500">تاریخ عضویت</label>
                    <p className="font-semibold text-gray-800 text-lg mt-1">
                      {user.created_at ? formatDate(user.created_at) : "نامشخص"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* تب سفارشات */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Package className="w-6 h-6 text-[#1c4793]" />
              <h2 className="text-xl font-bold text-gray-800">سفارشات من</h2>
            </div>
            
            {ordersLoading ? (
              <div className="text-center py-12">
                <div className="w-10 h-10 border-4 border-t-[#1c4793] border-gray-200 rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-500 mt-3">در حال بارگذاری سفارشات...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">تاکنون سفارشی ثبت نکرده‌اید</p>
                <button
                  onClick={() => navigate("/")}
                  className="mt-4 px-6 py-2 bg-[#1c4793] text-white rounded-lg hover:bg-[#113d64] transition-colors"
                >
                  شروع خرید
                </button>
              </div>
            ) : selectedOrder ? (
              <div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex items-center gap-1 text-gray-500 hover:text-[#1c4793] mb-4 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                  بازگشت به لیست سفارشات
                </button>



  
  <button
    onClick={() => {
      setInvoiceOrder(selectedOrder);
      setShowInvoice(true);
    }}
    className="flex items-center gap-2 px-4 py-2 m-4 bg-[#1c4793] text-white rounded-lg hover:bg-[#113d64] transition-colors"
  >
    <Printer className="w-4 h-4" />
    چاپ فاکتور
  </button>

{showInvoice && invoiceOrder && user && (
  <Invoice 
    order={invoiceOrder} 
    user={user} 
    onClose={() => {
      setShowInvoice(false);
      setInvoiceOrder(null);
    }} 
  />
)}      
                <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 mb-6 border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">شماره سفارش</p>
                      <p className="font-bold text-gray-800 text-lg">{selectedOrder.order_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">تاریخ ثبت</p>
                      <p className="font-bold text-gray-800">{formatDate(selectedOrder.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">وضعیت</p>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusText(selectedOrder.status).color}`}>
                        {getStatusIcon(selectedOrder.status)}
                        {getStatusText(selectedOrder.status).text}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">روش پرداخت</p>
                      <p className="font-semibold text-gray-700">{getPaymentMethodText(selectedOrder.payment_method)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">روش ارسال</p>
                      <p className="font-semibold text-gray-700">{getDeliveryMethodText(selectedOrder.delivery_method)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">مبلغ کل</p>
                      <p className="font-bold text-[#1c4793] text-xl">{Number(selectedOrder.total_price).toLocaleString('fa-IR')}</p>
                    </div>
                  </div>
                  {selectedOrder.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500">توضیحات</p>
                      <p className="text-gray-700 mt-1">{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>
                
                <h3 className="font-bold text-gray-800 mb-4">محصولات سفارش</h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-white border rounded-xl hover:shadow-md transition-all">
                      <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        {item.product_image ? (
                          <img 
                            src={item.product_image} 
                            alt={item.product_title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=No+Image";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-gray-300" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <div>
                            <h4 className="font-bold text-gray-800 text-lg">{item.product_title}</h4>
                            <div className="flex flex-wrap gap-3 mt-1">
                              <span className="text-sm text-gray-500">تعداد: {item.quantity}</span>
                              <span className="text-sm text-gray-500">قیمت واحد: {formatPrice(item.price * item.quantity)}</span>
                            </div>
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-[#1c4793] text-xl">{formatPrice(item.price * item.quantity)}</p>
                          </div>
                        </div>
                        
                        {renderSelectedOptions(item.selected_options)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="flex flex-wrap items-center justify-between gap-4 p-4 border rounded-xl hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div>
                      <p className="font-bold text-gray-800">{order.order_number}</p>
                      <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                    </div>
                    <div>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusText(order.status).color}`}>
                        {getStatusIcon(order.status)}
                        {getStatusText(order.status).text}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#1c4793]">{ Number(order.total_price).toLocaleString()}</p>
                      <p className="text-xs text-gray-400">{order.items.length} محصول</p>
                    </div>
                    <Eye className="w-5 h-5 text-gray-400 group-hover:text-[#1c4793] transition-colors" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* تب آدرس‌ها */}
        {activeTab === "addresses" && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-[#1c4793]" />
                <h2 className="text-xl font-bold text-gray-800">آدرس‌های من</h2>
              </div>
              <button
                onClick={() => setShowAddAddressForm(!showAddAddressForm)}
                className="flex items-center gap-2 text-[#1c4793] text-sm font-semibold hover:underline"
              >
                {showAddAddressForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {showAddAddressForm ? "انصراف" : "افزودن آدرس جدید"}
              </button>
            </div>
            
            {addressesLoading ? (
              <div className="text-center py-12">
                <div className="w-10 h-10 border-4 border-t-[#1c4793] border-gray-200 rounded-full animate-spin mx-auto"></div>
              </div>
            ) : showAddAddressForm ? (
              <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="استان"
                    value={newAddress.province}
                    onChange={(e) => setNewAddress({ ...newAddress, province: e.target.value })}
                    className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793]"
                  />
                  <input
                    type="text"
                    placeholder="شهر"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793]"
                  />
                  <textarea
                    placeholder="آدرس کامل (خیابان، پلاک، واحد)"
                    value={newAddress.address}
                    onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                    rows={3}
                    className="col-span-2 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793]"
                  />
                  <input
                    type="text"
                    placeholder="کد پستی"
                    value={newAddress.postal_code}
                    onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                    className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793]"
                  />
                </div>
                <button
                  onClick={addNewAddress}
                  className="px-5 py-2 bg-[#1c4793] text-white rounded-xl hover:bg-[#113d64] transition-colors"
                >
                  ذخیره آدرس
                </button>
              </div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">هیچ آدرسی ثبت نشده است</p>
              </div>
            ) : (
              <div className="space-y-4">
                {addresses.map((addr) => (
                  <div key={addr.id} className="flex items-start justify-between p-4 border rounded-xl hover:shadow-md transition-all">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-[#1c4793]" />
                        <p className="font-semibold text-gray-800">
                          {addr.province} - {addr.city}
                        </p>
                        {addr.is_default === 1 && (
                          <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">آدرس پیش‌فرض</span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">{addr.address}</p>
                      <p className="text-gray-400 text-xs mt-1">کد پستی: {addr.postal_code}</p>
                    </div>
                    <div className="flex gap-2">
                      {addr.is_default !== 1 && (
                        <button
                          onClick={() => setDefaultAddress(addr.id)}
                          className="p-2 text-gray-400 hover:text-[#1c4793] transition-colors"
                          title="تنظیم به عنوان آدرس پیش‌فرض"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="حذف آدرس"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* تب علاقه‌مندی‌ها */}
        {activeTab === "wishlist" && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-6 h-6 text-[#1c4793]" />
              <h2 className="text-xl font-bold text-gray-800">علاقه‌مندی‌های من</h2>
            </div>
            <div className="text-center py-12">
              <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">هیچ محصولی به علاقه‌مندی‌ها اضافه نشده است</p>
              <button
                onClick={() => navigate("/")}
                className="mt-4 px-6 py-2 bg-[#1c4793] text-white rounded-lg hover:bg-[#113d64] transition-colors"
              >
                مشاهده محصولات
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default UserPanel;
