// components/admin/OrdersManager.tsx
import  { useEffect, useState } from "react";
import { 
  Package, Eye, Search, ChevronLeft, ChevronRight,
  CheckCircle, Truck, Clock, CreditCard, AlertCircle, X,
 RefreshCw,  User, Phone, MapPin,
  DollarSign, Settings, MessageSquare
} from "lucide-react";
import axios from "axios";

interface OrderItem {
  id: number;
  product_id: number;
  product_title: string;
  quantity: number;
  price: number;
  selected_options: string;
  product_image?: string;
}

interface Order {
  id: number;
  order_number: string;
  user_id: number;
  user_name: string;
  user_phone: string;
  user_address: string;
  total_price: number;
  status: string;
  payment_method: string;
  delivery_method: string;
  notes: string;
  created_at: string;
  items: OrderItem[];
}

interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  totalRevenue: number;
}

const OrdersManager = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState<OrderStats>({
    total: 0, pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0, totalRevenue: 0
  });
  const itemsPerPage = 10;

  // دریافت لیست سفارشات
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const response = await axios.get(
        "https://electroshahresfahan.com/drgearbox/auth/admin/get_orders.php",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setOrders(response.data.orders);
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // به‌روزرسانی وضعیت سفارش
  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await axios.post(
        "https://electroshahresfahan.com/drgearbox/auth/admin/update_order_status.php",
        { order_id: orderId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        await fetchOrders();
        if (selectedOrder?.id === orderId) {
          const updatedOrder = orders.find(o => o.id === orderId);
          setSelectedOrder(updatedOrder || null);
        }
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // فیلتر سفارشات
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.user_phone?.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // صفحه‌بندی
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; color: string; icon: any; bg: string }> = {
      pending: { label: "در انتظار پرداخت", color: "text-yellow-700", bg: "bg-yellow-100", icon: Clock },
      paid: { label: "پرداخت شده", color: "text-blue-700", bg: "bg-blue-100", icon: CreditCard },
      processing: { label: "در حال پردازش", color: "text-purple-700", bg: "bg-purple-100", icon: Settings },
      shipped: { label: "ارسال شده", color: "text-indigo-700", bg: "bg-indigo-100", icon: Truck },
      delivered: { label: "تحویل شده", color: "text-green-700", bg: "bg-green-100", icon: CheckCircle },
      cancelled: { label: "لغو شده", color: "text-red-700", bg: "bg-red-100", icon: AlertCircle }
    };
    return configs[status] || configs.pending;
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("fa-IR") + " تومان";
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fa-IR");
  };

  const statusOptions = [
    { value: "pending", label: "در انتظار پرداخت" },
    { value: "paid", label: "پرداخت شده" },
    { value: "processing", label: "در حال پردازش" },
    { value: "shipped", label: "ارسال شده" },
    { value: "delivered", label: "تحویل شده" },
    { value: "cancelled", label: "لغو شده" }
  ];

  return (
    <div className="space-y-6">
      {/* هدر و آمار */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">مدیریت سفارشات</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">مدیریت و پیگیری وضعیت سفارشات</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          بروزرسانی
        </button>
      </div>

      {/* کارت‌های آماری */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">کل سفارشات</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">در انتظار</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">در حال پردازش</p>
              <p className="text-2xl font-bold text-purple-600">{stats.processing}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">ارسال شده</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.shipped}</p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Truck className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">تحویل شده</p>
              <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">درآمد کل</p>
              <p className="text-xl font-bold text-[#1c4793]">{formatPrice(stats.totalRevenue)}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* فیلترها */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="جستجو بر اساس شماره سفارش، نام یا تلفن..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1c4793] focus:border-transparent"
            />
          </div>
        </div>
        <div className="w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1c4793]"
          >
            <option value="all">همه وضعیت‌ها</option>
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* لیست سفارشات */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-t-[#1c4793] border-gray-200 rounded-full animate-spin"></div>
        </div>
      ) : paginatedOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">هیچ سفارشی یافت نشد</p>
        </div>
      ) : selectedOrder ? (
        // جزئیات سفارش
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#1c4793] to-[#113d64] px-6 py-4 text-white flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">سفارش #{selectedOrder.order_number}</h2>
              <p className="text-blue-200 text-sm mt-1">تاریخ ثبت: {formatDate(selectedOrder.created_at)}</p>
            </div>
            <button
              onClick={() => setSelectedOrder(null)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {/* اطلاعات مشتری */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <User className="w-5 h-5 text-[#1c4793]" />
                <div>
                  <p className="text-xs text-gray-500">نام مشتری</p>
                  <p className="font-semibold">{selectedOrder.user_name || "نامشخص"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Phone className="w-5 h-5 text-[#1c4793]" />
                <div>
                  <p className="text-xs text-gray-500">شماره تماس</p>
                  <p className="font-semibold">{selectedOrder.user_phone || "نامشخص"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <MapPin className="w-5 h-5 text-[#1c4793]" />
                <div>
                  <p className="text-xs text-gray-500">آدرس</p>
                  <p className="font-semibold text-sm">{selectedOrder.user_address || "نامشخص"}</p>
                </div>
              </div>
            </div>

            {/* اطلاعات سفارش */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">وضعیت</p>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                  className={`mt-1 px-3 py-1.5 rounded-lg text-sm font-semibold border-0 ${getStatusConfig(selectedOrder.status).bg} ${getStatusConfig(selectedOrder.status).color}`}
                >
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <p className="text-sm text-gray-500">روش پرداخت</p>
                <p className="font-semibold mt-1">
                  {selectedOrder.payment_method === "online" ? "پرداخت آنلاین" : 
                   selectedOrder.payment_method === "cash" ? "پرداخت در محل" : "کارت به کارت"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">روش ارسال</p>
                <p className="font-semibold mt-1">
                  {selectedOrder.delivery_method === "express" ? "ارسال سریع" :
                   selectedOrder.delivery_method === "normal" ? "ارسال عادی" : "تحویل حضوری"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">مبلغ کل</p>
                <p className="font-bold text-[#1c4793] text-xl mt-1">{formatPrice(selectedOrder.total_price)}</p>
              </div>
            </div>

            {/* محصولات سفارش */}
            <h3 className="font-bold text-gray-800 mb-4">محصولات سفارش</h3>
            <div className="space-y-3">
              {selectedOrder.items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                    {item.product_image ? (
                      <img src={item.product_image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{item.product_title}</p>
                    <div className="flex flex-wrap gap-3 mt-1">
                      <span className="text-sm text-gray-500">تعداد: {item.quantity}</span>
                      <span className="text-sm text-gray-500">قیمت واحد: {formatPrice(item.price)}</span>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-[#1c4793]">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            {selectedOrder.notes && (
              <div className="mt-6 p-4 bg-yellow-50 rounded-xl">
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  توضیحات مشتری:
                </p>
                <p className="text-gray-700 mt-1">{selectedOrder.notes}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        // لیست سفارشات
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">شماره سفارش</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">مشتری</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">تاریخ</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">مبلغ</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">وضعیت</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedOrders.map((order) => {
                  const statusConfig = getStatusConfig(order.status);
                  const StatusIcon = statusConfig.icon;
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm font-semibold text-gray-800">
                        #{order.order_number}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-800">{order.user_name || "نامشخص"}</p>
                          <p className="text-xs text-gray-500">{order.user_phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-4 font-bold text-[#1c4793]">
                        {formatPrice(order.total_price)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center gap-1 text-[#1c4793] hover:underline text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          مشاهده
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* صفحه‌بندی */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 py-4 border-t">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <span className="px-4 py-2 text-sm">
                صفحه {currentPage} از {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersManager;