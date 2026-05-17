// pages/admin/Dashboard.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Package, Edit, Users, 
  LogOut, ChevronRight, Menu, Bell, Search,
  TrendingUp, ShoppingBag, DollarSign, UserCheck,
  Shield, Clock, AlertTriangle, CheckCircle,
  Sun, Moon, ArrowRight, 
} from "lucide-react";
import AddProduct from "../../../components/addproduct";
import EditProduct from "../../../components/EditProduct";
import AddAdmin from "../AddAdmin/AddAdmin";
import axios from "axios";

// تایپ برای آمار
interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  lowStock: number;
  outOfStock: number;
}

// تایپ برای کاربر
interface AdminUser {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"products" | "edit" | "admins" | "stats">("stats");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    lowStock: 0,
    outOfStock: 0
  });
  const [, setLoading] = useState(true);

  // بررسی احراز هویت
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const user = localStorage.getItem("admin_user");
    
    if (!token || !user) {
      navigate("/admin/login");
      return;
    }
    
    setAdminUser(JSON.parse(user));
    fetchStats();
  }, [navigate]);

  // دریافت آمار
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await axios.get(
        "https://electroshahresfahan.com/drgearbox/auth/admin/get_stats.php",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // خروج از حساب
  const handleLogout = () => {
    if (window.confirm("آیا از خروج از حساب اطمینان دارید؟")) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      navigate("/admin/login");
    }
  };

  const menuItems = [
    { id: "stats", label: "داشبورد", icon: LayoutDashboard, color: "from-blue-500 to-blue-600" },
    { id: "products", label: "افزودن محصول", icon: Package, color: "from-emerald-500 to-emerald-600" },
    { id: "edit", label: "ویرایش محصول", icon: Edit, color: "from-amber-500 to-amber-600" },
    { id: "admins", label: "مدیریت کاربران", icon: Users, color: "from-purple-500 to-purple-600" },
  ];

  const statCards = [
    { key: "totalProducts", label: "کل محصولات", icon: ShoppingBag, color: "from-blue-500 to-blue-600" },
    { key: "totalOrders", label: "سفارشات", icon: TrendingUp, color: "from-green-500 to-green-600" },
    { key: "totalRevenue", label: "درآمد کل", icon: DollarSign, color: "from-amber-500 to-amber-600", isPrice: true },
    { key: "totalUsers", label: "کاربران", icon: UserCheck, color: "from-purple-500 to-purple-600" },
  ];

  const getStatValue = (key: string) => {
    const value = stats[key as keyof DashboardStats];
    if (key === "totalRevenue") {
      return value?.toLocaleString("fa-IR") || "0";
    }
    return value || 0;
  };

  return (
    <div className={`min-h-screen ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      
      {/* سایدبار */}
      <aside className={`fixed right-0 top-0 h-full bg-white dark:bg-gray-800 z-50 shadow-2xl z-30 transition-all duration-300 ${
        sidebarOpen ? "w-72" : "w-20"
      }`}>
        
        {/* لوگو */}
        <div className="flex items-center justify-between p-5 border-b dark:border-gray-700">
          <div className={`flex items-center gap-3 ${!sidebarOpen && "justify-center w-full"}`}>
            <div className="w-10 h-10 bg-gradient-to-r from-[#1c4793] to-[#113d64] rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-gray-800 dark:text-white">پنل مدیریت</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">دکتر گیربکس</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* اطلاعات کاربر */}
        {sidebarOpen && adminUser && (
          <div className="p-4 m-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-[#1c4793] to-[#113d64] rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">
                  {adminUser.name?.charAt(0) || "A"}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 dark:text-white">{adminUser.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-300">{adminUser.role === "admin" ? "مدیر کل" : adminUser.role === "editor" ? "ویرایشگر" : "بیننده"}</p>
              </div>
            </div>
          </div>
        )}

        {/* منوی اصلی */}
        <nav className="p-3 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? "bg-gradient-to-r from-[#1c4793] to-[#113d64] text-white shadow-md"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                  isActive ? "text-white" : ""
                }`} />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
                {isActive && sidebarOpen && (
                  <ChevronRight className="w-4 h-4 mr-auto" />
                )}
              </button>
            );
          })}
        </nav>

        {/* دکمه خروج */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium">خروج از حساب</span>}
          </button>
        </div>
      </aside>

      {/* محتوای اصلی */}
      <main className={`transition-all duration-300 ${sidebarOpen ? "mr-72" : "mr-20"}`}>
        
        {/* هدر */}
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="جستجو..."
                  className="pr-10 pl-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1c4793]"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3">
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{adminUser?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">خوش آمدید</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-[#1c4793] to-[#113d64] rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-bold">
                    {adminUser?.name?.charAt(0) || "A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* محتوای صفحات */}
        <div className="p-6">
          
          {/* صفحه آمار */}
          {activeTab === "stats" && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">داشبورد</h1>
                <p className="text-gray-500 dark:text-gray-400">خلاصه آماری فروشگاه شما</p>
              </div>

              {/* کارت‌های آماری */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {statCards.map((card, idx) => {
                  const Icon = card.icon;
                  const value = getStatValue(card.key);
                  return (
                    <div
                      key={idx}
                      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700 overflow-hidden"
                    >
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-2xl font-black text-gray-800 dark:text-white">
                            {card.isPrice ? `${value} تومان` : value}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
                      </div>
                      <div className={`h-1 bg-gradient-to-r ${card.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right`}></div>
                    </div>
                  );
                })}
              </div>

              {/* هشدارهای موجودی */}
              {(stats.lowStock > 0 || stats.outOfStock > 0) && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-amber-500" />
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">هشدارهای موجودی</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stats.lowStock > 0 && (
                      <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-amber-600" />
                          <span className="text-amber-700 dark:text-amber-300">محصولات با موجودی کم</span>
                        </div>
                        <span className="text-2xl font-bold text-amber-700 dark:text-amber-300">{stats.lowStock}</span>
                      </div>
                    )}
                    {stats.outOfStock > 0 && (
                      <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                          <span className="text-red-700 dark:text-red-300">محصولات ناموجود</span>
                        </div>
                        <span className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.outOfStock}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* فعالیت‌های اخیر */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#1c4793]" />
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">فعالیت‌های اخیر</h2>
                  </div>
                  <button className="text-sm text-[#1c4793] hover:underline flex items-center gap-1">
                    مشاهده همه <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800 dark:text-white">محصول جدید اضافه شد</p>
                        <p className="text-xs text-gray-400">۲ ساعت پیش</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* صفحه افزودن محصول */}
          {activeTab === "products" && <AddProduct />}

          {/* صفحه ویرایش محصول */}
          {activeTab === "edit" && <EditProduct />}

          {/* صفحه مدیریت کاربران */}
          {activeTab === "admins" && <AddAdmin />}
          
        </div>
      </main>
    </div>
  );
};

export default Dashboard;