// pages/admin/AddAdmin.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  UserPlus, User, Lock, Mail, Shield, Eye, EyeOff, 
  Save, X, AlertCircle, CheckCircle, Key, Briefcase,
  Users, Trash2, Edit, Search,
  Phone
} from "lucide-react";
import axios from "axios";

interface AdminUser {
  id: number;
  username: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  status: number |string;
  last_login: string | null;
  created_at: string;
}

const AddAdmin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"add" | "list">("add");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  
  // فرم افزودن ادمین
  const [formData, setFormData] = useState({
    phone:"",
    username: "",
    password: "",
    name: "",
    email: "",
    role: "editor" as "admin" | "editor" | "viewer",
    status: 1
  });

  // دریافت لیست ادمین‌ها
  const fetchAdmins = async () => {
    setLoadingAdmins(true);
    try {
      const token = localStorage.getItem("admin_token");
      const response = await axios.get("https://electroshahresfahan.com/drgearbox/auth/admin/get_admins.php", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setAdmins(response.data.admins);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setLoadingAdmins(false);
    }
  };

  // افزودن ادمین جدید
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username.trim()) {
      setMessage({ type: "error", text: "نام کاربری الزامی است" });
      return;
    }
    
    if (!formData.password.trim()) {
      setMessage({ type: "error", text: "رمز عبور الزامی است" });
      return;
    }
    
    if (formData.password.length < 6) {
      setMessage({ type: "error", text: "رمز عبور باید حداقل 6 کاراکتر باشد" });
      return;
    }
    
    if (!formData.name.trim()) {
      setMessage({ type: "error", text: "نام و نام خانوادگی الزامی است" });
      return;
    }
    
    setLoading(true);
    setMessage(null);
    
    try {
      const token = localStorage.getItem("admin_token");
      const response = await axios.post(
        "https://electroshahresfahan.com/drgearbox/auth/admin/add_admin.php",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setMessage({ type: "success", text: "ادمین با موفقیت اضافه شد" });
        setFormData({
            phone:"",
          username: "",
          password: "",
          name: "",
          email: "",
          role: "editor",
          status: 1
        });
        fetchAdmins();
        setTimeout(() => setActiveTab("list"), 2000);
      } else {
        setMessage({ type: "error", text: response.data.message || "خطا در افزودن ادمین" });
      }
    } catch (error) {
      console.error("Error adding admin:", error);
      setMessage({ type: "error", text: "خطا در ارتباط با سرور" });
    } finally {
      setLoading(false);
    }
  };

  // حذف ادمین
  const handleDeleteAdmin = async (id: number, name: string) => {
    if (!window.confirm(`آیا از حذف کاربر "${name}" اطمینان دارید؟`)) return;
    
    try {
      const token = localStorage.getItem("admin_token");
      const response = await axios.delete(
        "https://electroshahresfahan.com/drgearbox/auth/admin/delete_admin.php",
        { 
          headers: { Authorization: `Bearer ${token}` },
          data: { id }
        }
      );
      
      if (response.data.success) {
        setMessage({ type: "success", text: "ادمین با موفقیت حذف شد" });
        fetchAdmins();
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: "error", text: response.data.message || "خطا در حذف ادمین" });
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      setMessage({ type: "error", text: "خطا در ارتباط با سرور" });
    }
  };

  // فیلتر ادمین‌ها بر اساس جستجو
  const filteredAdmins = admins.filter(admin => 
    admin.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // تابع دریافت رنگ نقش
  const getRoleColor = (role: string) => {
    switch(role) {
      case "admin": return { bg: "bg-red-100", text: "text-red-700", label: "مدیر کل" };
      case "editor": return { bg: "bg-blue-100", text: "text-blue-700", label: "ویرایشگر" };
      case "viewer": return { bg: "bg-green-100", text: "text-green-700", label: "بیننده" };
      default: return { bg: "bg-gray-100", text: "text-gray-700", label: role };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* هدر */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-[#1c4793] to-[#113d64] rounded-2xl shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">مدیریت کاربران</h1>
          </div>
          <p className="text-gray-500 pr-14">افزودن، ویرایش و مدیریت کاربران سیستم</p>
        </div>

        {/* پیام */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
            message.type === "success" 
              ? "bg-green-50 border border-green-200" 
              : "bg-red-50 border border-red-200"
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

        {/* تب‌ها */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("add")}
            className={`px-6 py-3 font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === "add"
                ? "text-[#1c4793] border-b-2 border-[#1c4793]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <UserPlus className="w-5 h-5" />
            افزودن کاربر جدید
          </button>
          <button
            onClick={() => {
              setActiveTab("list");
              fetchAdmins();
            }}
            className={`px-6 py-3 font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === "list"
                ? "text-[#1c4793] border-b-2 border-[#1c4793]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Users className="w-5 h-5" />
            لیست کاربران
          </button>
        </div>

        {/* فرم افزودن ادمین */}
        {activeTab === "add" && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#1c4793]" />
                <h2 className="text-lg font-bold text-gray-800">اطلاعات کاربر جدید</h2>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* نام کاربری */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    <span className="text-red-500">*</span> نام کاربری
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793] focus:border-transparent transition-all"
                      placeholder="نام کاربری"
                    />
                  </div>
                </div>
                
                {/* رمز عبور */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    <span className="text-red-500">*</span> رمز عبور
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1c4793] focus:border-transparent transition-all"
                      placeholder="حداقل 6 کاراکتر"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 left-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">رمز عبور باید حداقل 6 کاراکتر باشد</p>
                </div>
                
                {/* نام و نام خانوادگی */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    <span className="text-red-500">*</span> نام و نام خانوادگی
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <Briefcase className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793] focus:border-transparent transition-all"
                      placeholder="نام و نام خانوادگی"
                    />
                  </div>
                </div>
                
                {/* ایمیل */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    ایمیل
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793] focus:border-transparent transition-all"
                      placeholder="example@domain.com"
                    />
                  </div>
                </div>
                
                {/* نقش کاربری */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    <span className="text-red-500">*</span> نقش کاربری
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <Shield className="w-5 h-5 text-gray-400" />
                    </div>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
                      className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793] focus:border-transparent transition-all appearance-none"
                    >
                      <option value="admin">مدیر کل</option>
                      <option value="editor">ویرایشگر</option>
                      <option value="viewer">بیننده</option>
                    </select>
                  </div>
                </div>
                
                {/* وضعیت */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    وضعیت
                  </label>
                  <div className="flex items-center gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value={1}
                        checked={formData.status === 1}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: Number(e.target.value) }))}
                        className="w-4 h-4 text-[#1c4793] focus:ring-[#1c4793]"
                      />
                      <span className="text-sm text-gray-700">فعال</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value={0}
                        checked={formData.status === 0}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: Number(e.target.value) }))}
                        className="w-4 h-4 text-red-500 focus:ring-red-500"
                      />
                      
                      <span className="text-sm text-gray-700">غیرفعال</span>
                    </label>
                  </div>
                </div>
              </div>
              <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">
        شماره موبایل
    </label>
    <div className="relative">
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <Phone className="w-5 h-5 text-gray-400" />
        </div>
        <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793] focus:border-transparent transition-all"
            placeholder="09123456789"
            maxLength={11}
        />
    </div>
    <p className="text-xs text-gray-400 mt-1">برای بازیابی رمز عبور از طریق پیامک</p>
</div>
              
              {/* دکمه‌ها */}
              <div className="flex gap-4 mt-8 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-[#1c4793] to-[#113d64] text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      در حال ثبت...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      ثبت کاربر جدید
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                        phone:"",
                      username: "",
                      password: "",
                      name: "",
                      email: "",
                      role: "editor",
                      status: 1
                    });
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <X className="w-5 h-5" />
                  پاک کردن فرم
                </button>
              </div>
            </form>
          </div>
        )}

        {/* لیست ادمین‌ها */}
        {activeTab === "list" && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#1c4793]" />
                  <h2 className="text-lg font-bold text-gray-800">لیست کاربران</h2>
                  <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                    {admins.length} کاربر
                  </span>
                </div>
                
                {/* جستجو */}
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="جستجو در کاربران..."
                    className="pr-10 pl-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793] focus:border-transparent transition-all w-64"
                  />
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">#</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">نام کاربری</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">نام و نام خانوادگی</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">ایمیل</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">نقش</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">وضعیت</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">تاریخ ثبت</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loadingAdmins ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <div className="flex justify-center">
                          <div className="w-8 h-8 border-3 border-[#1c4793] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      </td>
                    </tr>
                  ) : filteredAdmins.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        کاربری یافت نشد
                      </td>
                    </tr>
                  ) : (
                    filteredAdmins.map((admin, index) => {
                      const roleStyle = getRoleColor(admin.role);
                      return (
                        <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-800">{admin.username}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">{admin.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{admin.email || "—"}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${roleStyle.bg} ${roleStyle.text}`}>
                              {roleStyle.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              admin.status === "1" 
                                ? "bg-green-100 text-green-700" 
                                : "bg-red-100 text-red-700"
                            }`}>
                              {admin.status === "1" ? "فعال" : "غیرفعال"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(admin.created_at).toLocaleDateString("fa-IR")}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDeleteAdmin(admin.id, admin.name)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="حذف"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddAdmin;