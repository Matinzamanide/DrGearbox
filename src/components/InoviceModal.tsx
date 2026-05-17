import React, { useRef, useState, useEffect } from "react";
import { X, Printer, Eye, Download } from "lucide-react";
import axios from "axios";

interface InvoiceProps {
  order: any;
  user: any;
  onClose: () => void;
}

const Invoice: React.FC<InvoiceProps> = ({ order, user, onClose }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [address, setAddress] = useState<any>(null);
  const [addressLoading, setAddressLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"preview" | "print">("preview");

  useEffect(() => {
    const fetchAddress = async () => {
      const token = localStorage.getItem("session_token");
      if (!token || !order.address_id) {
        setAddressLoading(false);
        return;
      }

      setAddressLoading(true);
      try {
        const response = await axios.get(
          `https://electroshahresfahan.com/drgearbox/auth/get_user_addresses.php?session_token=${token}`
        );
        if (response.data.success) {
          const foundAddress = response.data.addresses.find(
            (addr: any) => addr.id === order.address_id
          );
          setAddress(foundAddress || null);
        }
      } catch (err) {
        console.error("Error fetching address:", err);
      } finally {
        setAddressLoading(false);
      }
    };

    fetchAddress();
  }, [order.address_id]);

  const handlePrint = () => {
    const printContent = invoiceRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>فاکتور ${order.order_number}</title>
        <style>
          /* استایل سیاه و سفید برای چاپ */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            direction: rtl;
            padding: 20px;
            background: white;
            font-family: vaziri,sans-serif;
          }
          
          .invoice-print {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
          }
          
          /* هدر چاپی */
          .print-header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid black;
          }
          
          .print-company h1 {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          
          .print-company p {
            font-size: 11px;
            color: #333;
            margin: 2px 0;
          }
          
          .print-invoice {
            text-align: left;
            border: 1px solid #333;
            padding: 10px 15px;
          }
          
          .print-invoice p {
            margin: 3px 0;
            font-size: 12px;
          }
          
          .print-invoice .invoice-num {
            font-size: 16px;
            font-weight: bold;
            margin-top: 5px;
          }
          
          /* اطلاعات مشتری چاپی */
          .print-customer {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 25px;
            padding: 15px;
            border: 1px solid #ccc;
            background: #fafafa;
          }
          
          .print-customer h3 {
            font-size: 13px;
            font-weight: bold;
            margin-bottom: 8px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 3px;
          }
          
          .print-customer p {
            font-size: 11px;
            margin: 3px 0;
            color: #333;
          }
          
          .print-address {
            grid-column: 1 / -1;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #ccc;
          }
          
          /* جدول چاپی */
          .print-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
          }
          
          .print-table th {
            background: #e0e0e0;
            padding: 10px;
            text-align: center;
            font-size: 11px;
            font-weight: bold;
            border: 1px solid #999;
          }
          
          .print-table td {
            padding: 8px;
            text-align: center;
            font-size: 11px;
            border: 1px solid #ccc;
          }
          
          .print-table th:first-child,
          .print-table td:first-child {
            text-align: center;
          }
          
          /* جمع‌بندی چاپی */
          .print-totals {
            width: 300px;
            margin-left: auto;
            margin-bottom: 25px;
          }
          
          .print-totals-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            border-bottom: 1px solid #ccc;
            font-size: 11px;
          }
          
          .print-totals-row.final {
            background: #333;
            color: white;
            padding: 8px 10px;
            margin-top: 5px;
            border-bottom: none;
          }
          
          /* امضاء چاپی */
          .print-signatures {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 20px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ccc;
          }
          
          .print-signature-box {
            text-align: center;
          }
            .font-peyda{
            font-family:vaziri
            }
          
          .print-signature-box p {
            font-size: 10px;
            margin-bottom: 30px;
          }
          
          .print-signature-line {
            border-bottom: 1px solid black;
            margin-top: 5px;
          }
          
          .print-footer {
            text-align: center;
            font-size: 9px;
            color: #666;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #ccc;
          }
          
          @media print {
            body {
              padding: 0;
            }
            @page {
              size: A4;
              margin: 15mm;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-print">
          <div class="print-header">
            <div class="print-company">
              <h1>دکتر گیربکس</h1>
              <p>Dr. Gearbox</p>
              <p>📞 ۰۳۱-۳۶۲۷۴۰۰۰ | 📧 info@drgearbox.com</p>
              <p>🌐 drgearbox.com | 📍 اصفهان، خیابان کهندژ</p>
            </div>
            <div class="print-invoice">
              <p>فاکتور فروش</p>
              <p class="invoice-num">${order.order_number}</p>
              <p>تاریخ: ${formatDate(order.created_at)}</p>
              <p>وضعیت: ${getStatusText(order.status)}</p>
            </div>
          </div>

          <div class="print-customer">
            <div>
              <h3>مشخصات خریدار</h3>
              <p><strong>نام:</strong> ${user.name} ${user.family}</p>
              <p><strong>تلفن:</strong> ${user.phone}</p>
              ${user.email ? `<p><strong>ایمیل:</strong> ${user.email}</p>` : ''}
            </div>
            <div>
              <h3>اطلاعات سفارش</h3>
              <p><strong>روش ارسال:</strong> ${getDeliveryMethodText(order.delivery_method)}</p>
              <p><strong>روش پرداخت:</strong> ${getPaymentMethodText(order.payment_method)}</p>
            </div>
            <div class="print-address">
              <h3>📍 آدرس تحویل گیرنده</h3>
              <p>${getFullAddress()}</p>
              ${!addressLoading && address?.receiver_name ? `<p><strong>تحویل گیرنده:</strong> ${address.receiver_name}</p>` : ''}
              ${!addressLoading && address?.receiver_phone ? `<p><strong>تلفن:</strong> ${address.receiver_phone}</p>` : ''}
            </div>
          </div>

          <table class="print-table">
            <thead>
              <tr>
                <th>ردیف</th>
                <th>شرح کالا</th>
                <th>تعداد</th>
                <th>قیمت واحد</th>
                <th>مبلغ کل</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map((item: any, index: number) => `
                <tr>
                  <td>${index + 1}</td>
                  <td style="text-align: right;">
                    <strong>${item.product_title}</strong>
                    ${renderSelectedOptionsText(item.selected_options)}
                  </td>
                  <td class="font-peyda">${item.quantity}</td>
                  <td>${Number(item.price).toLocaleString()}</td>
                  <td>${formatPrice(item.price * item.quantity)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="print-totals">
            <div class="print-totals-row">
              <span>جمع کل:</span>
              <span><strong>${formatPrice(calculateSubtotal())} تومان</strong></span>
            </div>
           
            <div class="print-totals-row final">
              <span>مبلغ قابل پرداخت:</span>
              <span>${formatPrice(calculateSubtotal())} تومان</span>
            </div>
          </div>

          ${order.notes ? `
            <div style="background: #f5f5f5; padding: 10px; margin-bottom: 20px; border: 1px solid #ccc;">
              <h3 style="font-size: 12px; margin-bottom: 5px;">توضیحات:</h3>
              <p style="font-size: 11px;">${order.notes}</p>
            </div>
          ` : ''}

          <div class="print-signatures">
            <div class="print-signature-box">
              <p>امضاء فروشنده</p>
              <div class="print-signature-line"></div>
            </div>
            <div class="print-signature-box">
              <p>مهر و امضاء</p>
              <div class="print-signature-line"></div>
            </div>
            <div class="print-signature-box">
              <p>امضاء خریدار</p>
              <div class="print-signature-line"></div>
            </div>
          </div>
          
          <div class="print-footer">
            <p>این فاکتور به صورت الکترونیکی صادر شده و دارای اعتبار قانونی می‌باشد.</p>
          </div>
        </div>
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const renderSelectedOptionsText = (selectedOptions: string) => {
    if (!selectedOptions || selectedOptions === "[]" || selectedOptions === "{}") {
      return '';
    }
    try {
      const options = JSON.parse(selectedOptions);
      if (Object.keys(options).length === 0) return '';
      let result = '<div style="font-size: 10px; color: #666; margin-top: 3px;">';
      Object.entries(options).forEach(([key, val]: [string, any], idx, arr) => {
        result += `${key}: ${val.value}`;
        if (idx < arr.length - 1) result += ' | ';
      });
      result += '</div>';
      return result;
    } catch (e) {
      return '';
    }
  };

  const formatPrice = (price: number) => {
    if (!price && price !== 0) return "0";
    return price.toLocaleString("fa-IR");
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fa-IR");
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "در انتظار پرداخت",
      paid: "پرداخت شده",
      processing: "در حال پردازش",
      shipped: "ارسال شده",
      delivered: "تحویل شده",
      cancelled: "لغو شده",
    };
    return statusMap[status] || status;
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

  const calculateSubtotal = () => {
    return order.items.reduce((sum:any, item:any) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.09;
  };

  const renderSelectedOptions = (selectedOptions: string) => {
    if (!selectedOptions || selectedOptions === "[]" || selectedOptions === "{}") {
      return null;
    }
    try {
      const options = JSON.parse(selectedOptions);
      if (Object.keys(options).length === 0) return null;
      return (
        <div className="text-xs text-gray-500 mt-1">
          {Object.entries(options).map(([key, val]: [string, any], idx) => (
            <span key={key}>
              {key}: {val.value}
              {idx < Object.keys(options).length - 1 && " | "}
            </span>
          ))}
        </div>
      );
    } catch (e) {
      return null;
    }
  };

  const getFullAddress = () => {
    if (addressLoading) return "در حال بارگذاری...";
    if (!address) return "آدرس ثبت نشده است";
    const parts = [];
    if (address.province) parts.push(address.province);
    if (address.city) parts.push(address.city);
    if (address.address) parts.push(address.address);
    if (address.postal_code) parts.push(`کد پستی: ${address.postal_code}`);
    return parts.length > 0 ? parts.join("، ") : "آدرس ثبت نشده است";
  };

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/60  z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
  <div className="bg-white rounded-2xl shadow-2xl flex flex-col  justify-center h-[10%] w-[95%] lg:h-[50%] lg:max-w-5xl lg:w-full my-4 sm:my-8 mx-2 sm:mx-4">
    {/* Header */}
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 p-4 sm:p-6 border-b border-gray-200">
      <h2 className="text-lg sm:text-xl font-bold text-gray-800">فاکتور خرید</h2>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <button
          onClick={handlePrint}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-[#1c4793] text-white rounded-lg hover:bg-[#113d64] transition-colors text-sm sm:text-base"
        >
          <Printer className="w-4 h-4" />
          <span className="hidden sm:inline">چاپ فاکتور</span>
          <span className="sm:hidden">چاپ</span>
        </button>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>

    {/* Preview Mode */}
    <div className="p-3 sm:p-6 bg-gray-50">
      <div ref={invoiceRef} className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header با گرادینت آبی */}
        <div className=" hidden lg:block bg-gradient-to-r from-[#1c4793] to-[#113d64] p-4 sm:p-6 text-white">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex-1 w-full">
              <h1 className="text-2xl sm:text-3xl font-black mb-1 text-center sm:text-right">دکتر گیربکس</h1>
              <p className="text-[#32a3db] text-xs sm:text-sm mb-3 text-center sm:text-right">Dr. Gearbox</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs sm:text-sm text-white/80">
                <p>📞 ۰۳۱-۳۶۲۷۴۰۰۰</p>
                <p>🌐 drgearbox.com</p>
                <p>📧 info@drgearbox.com</p>
                <p>📍 اصفهان، خیابان کهندژ</p>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center min-w-[180px] sm:min-w-[200px] w-full sm:w-auto">
              <p className="text-xs text-white/60 mb-1">شماره فاکتور</p>
              <p className="text-base sm:text-xl font-bold font-mono break-all">{order.order_number}</p>
              <div className="border-t border-white/20 my-2"></div>
              <p className="text-xs text-white/60 mb-1">تاریخ صدور</p>
              <p className="text-xs sm:text-sm font-medium">{formatDate(order.created_at)}</p>
              <div className="mt-2">
                <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold ${
                  order.status === 'paid' ? 'bg-green-500/20 text-green-300' :
                  order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-red-500/20 text-red-300'
                }`}>
                  {getStatusText(order.status)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 sm:p-6">
          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <div className="bg-[#f8fafc] mt-16 lg:mt-0  rounded-xl p-3 sm:p-4 border-r-4 border-[#1c4793]">
              <h3 className="text-[#113d64] font-bold text-base sm:text-lg mb-2 sm:mb-3 flex items-center gap-2">
                <div className="w-1 h-5 sm:h-6 bg-[#e21f25] rounded-full"></div>
                مشخصات خریدار
              </h3>
              <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <p><span className="text-gray-500">نام:</span> <strong className="text-[#1c4793]">{user.name} {user.family}</strong></p>
                <p><span className="text-gray-500">تلفن:</span> <strong className="text-[#1c4793]">{user.phone}</strong></p>
                {user.email && <p className="break-all"><span className="text-gray-500">ایمیل:</span> {user.email}</p>}
              </div>
            </div>
            
            <div className="bg-[#f8fafc] rounded-xl p-3 sm:p-4 border-r-4 border-[#32a3db]">
              <h3 className="text-[#113d64] font-bold text-base sm:text-lg mb-2 sm:mb-3 flex items-center gap-2">
                <div className="w-1 h-5 sm:h-6 bg-[#32a3db] rounded-full"></div>
                اطلاعات سفارش
              </h3>
              <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span className="text-gray-500">روش ارسال:</span>
                  <span className="font-medium text-right sm:text-left">{getDeliveryMethodText(order.delivery_method)}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span className="text-gray-500">روش پرداخت:</span>
                  <span className="font-medium text-right sm:text-left">{getPaymentMethodText(order.payment_method)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-3 sm:p-4 mb-6 border border-gray-100">
            <h3 className="text-[#113d64] font-bold text-sm sm:text-md mb-2 sm:mb-3 flex items-center gap-2">
              <span className="text-lg sm:text-xl">📍</span> آدرس تحویل گیرنده
            </h3>
            <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{getFullAddress()}</p>
            {!addressLoading && address?.receiver_name && (
              <p className="text-xs sm:text-sm mt-2"><span className="text-gray-500">تحویل گیرنده:</span> <strong>{address.receiver_name}</strong></p>
            )}
            {!addressLoading && address?.receiver_phone && (
              <p className="text-xs sm:text-sm"><span className="text-gray-500">تلفن:</span> <strong>{address.receiver_phone}</strong></p>
            )}
          </div>

          {/* Products Table - Responsive with horizontal scroll on mobile */}
          <div className="overflow-x-auto -mx-2 sm:mx-0 mb-6">
            <div className="min-w-[500px] sm:min-w-full">
              <table className="w-full text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-[#1c4793] to-[#113d64] text-white">
                    <th className="py-2 sm:py-3 px-2 sm:px-4 text-center rounded-tr-lg w-[50px]">ردیف</th>
                    <th className="py-2 sm:py-3 px-2 sm:px-4 text-right">شرح کالا</th>
                    <th className="py-2 sm:py-3 px-2 sm:px-4 text-center w-[60px]">تعداد</th>
                    <th className="py-2 sm:py-3 px-2 sm:px-4 text-left w-[100px] sm:w-[120px]">قیمت واحد</th>
                    <th className="py-2 sm:py-3 px-2 sm:px-4 text-left rounded-tl-lg w-[100px] sm:w-[120px]">مبلغ کل</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item: any, index: number) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-center text-gray-500">{index + 1}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">
                        <div className="font-bold text-gray-800 text-xs sm:text-sm break-words">{item.product_title}</div>
                        {renderSelectedOptions(item.selected_options)}
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-center font-medium">{item.quantity}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-left text-[#1c4793] font-medium whitespace-nowrap">{Number(item.price).toLocaleString()} تومان</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-left font-bold text-[#e21f25] whitespace-nowrap">{formatPrice(item.price * item.quantity)} تومان</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-6">
            <div className="w-full sm:w-80 bg-gradient-to-r from-gray-50 to-white rounded-xl p-3 sm:p-4 border border-gray-100">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-gray-500">جمع کل:</span>
                  <span className="font-bold">{formatPrice(calculateSubtotal())} تومان</span>
                </div>
                
                <div className="border-t border-dashed border-gray-200 my-2"></div>
                <div className="flex justify-between items-center text-sm sm:text-lg">
                  <span className="text-[#113d64] font-bold">مبلغ قابل پرداخت:</span>
                  <span className="text-[#e21f25] font-black text-base sm:text-xl">{formatPrice(order.total_price)} تومان</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-amber-50 border-r-4 border-amber-400 rounded-xl p-3 sm:p-4 mb-6">
              <h3 className="text-amber-800 font-bold text-xs sm:text-sm mb-2 flex items-center gap-2">
                📝 توضیحات سفارش
              </h3>
              <p className="text-amber-700 text-xs sm:text-sm break-words">{order.notes}</p>
            </div>
          )}

          {/* Signatures */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 pt-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-[10px] sm:text-xs text-gray-400 mb-2">امضاء فروشنده</p>
              <div className="border-b border-dashed border-gray-300 pt-3 sm:pt-4"></div>
            </div>
            <div className="text-center">
              <p className="text-[10px] sm:text-xs text-gray-400 mb-2">مهر و امضاء</p>
              <div className="border-b border-dashed border-gray-300 pt-3 sm:pt-4"></div>
            </div>
            <div className="text-center">
              <p className="text-[10px] sm:text-xs text-gray-400 mb-2">امضاء خریدار</p>
              <div className="border-b border-dashed border-gray-300 pt-3 sm:pt-4"></div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-[10px] sm:text-xs text-gray-400">
              این فاکتور به صورت الکترونیکی صادر شده و دارای اعتبار قانونی می‌باشد.
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom Actions */}
    <div className="flex flex-col sm:flex-row justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
      <button
        onClick={onClose}
        className="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors order-2 sm:order-1"
      >
        بستن
      </button>
      <button
        onClick={handlePrint}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 bg-[#1c4793] text-white rounded-xl font-medium hover:bg-[#113d64] transition-colors order-1 sm:order-2"
      >
        <Printer className="w-4 h-4" />
        چاپ فاکتور
      </button>
    </div>
  </div>
</div>
  );
};

export default Invoice;