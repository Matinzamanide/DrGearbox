import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, AlertCircle, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content: "سلام! 👋 من پشتیبان هوشمند دکتر گیربکس هستم. می‌توانم درباره قیمت‌ها، موجودی و مشخصات محصولات به شما کمک کنم. سوال خود را بپرسید!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatPrice = (price: number) => {
    return price?.toLocaleString("fa-IR") + " تومان";
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      // دریافت داده‌های محصولات
      const apiResponse = await fetch("https://electroshahresfahan.com/drgearbox/get_products.php");
      if (!apiResponse.ok) {
        throw new Error("خطا در دریافت اطلاعات از سرور");
      }
      const apiData = await apiResponse.json();

      const getCategoryName = (id: number) => {
        return apiData.categories?.find((c: any) => Number(c.id) === id)?.name || "نامشخص";
      };

      // آماده‌سازی داده‌های محصولات
      const simplifiedProducts = apiData.products?.map((p: any) => ({
        id: p.id,
        نام_محصول: p.title,
        قیمت_پایه: formatPrice(Number(p.base_price)),
        قیمت_قبل_تخفیف: p.before_discount_price ? formatPrice(Number(p.before_discount_price)) : null,
        برند: p.brand,
        نوع: p.type,
        موجودی: Number(p.inventory) > 0 ? `موجود (${p.inventory} عدد)` : "ناموجود",
        دسته_بندی: getCategoryName(Number(p.categoryId)),
        ویژگی‌ها: p.features?.slice(0, 3).join("، ") || "ندارد",
      })) || [];

      // ساخت پرامپت
      const systemPrompt = `شما یک پشتیبان حرفه‌ای فروشگاه اینترنتی "دکتر گیربکس" هستید.

اطلاعات محصولات موجود در فروشگاه:
${JSON.stringify(simplifiedProducts, null, 2)}

قوانین پاسخگویی:
1. فقط بر اساس اطلاعات بالا پاسخ دهید و از اطلاعات خارج از آن استفاده نکنید.
2. قیمت‌ها را به تومان و با سه رقم جدا شده نمایش دهید.
3. اگر محصولی موجود نیست، حتماً به کاربر بگویید.
4. اگر سوال خارج از حوزه محصولات است، بگویید: "من فقط می‌توانم درباره محصولات فروشگاه راهنمایی کنم."
5. پاسخ‌ها را مختصر، مفید و با احترام بیان کنید.
6. اگر کاربر درخواست خرید کرد، بگویید برای ثبت سفارش با بخش فروش تماس بگیرد.
7. از ایموجی‌های مناسب استفاده کنید.

سوال کاربر: ${userMessage.content}`;

      // ارسال به API
      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer sk-49e480b32dd340679da6723b9f73217b",
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: userMessage.content,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "خطا در ارتباط با هوش مصنوعی");
      }

      const data = await response.json();
      const botReply = data.choices[0]?.message?.content || "متاسفانه نتوانستم پاسخ مناسبی پیدا کنم.";

      const botMessage: Message = {
        role: "bot",
        content: botReply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("خطا:", err);
      setError(err instanceof Error ? err.message : "خطا در ارتباط با سرور");
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: "⚠️ متاسفانه خطایی رخ داده است. لطفاً چند لحظه دیگر دوباره تلاش کنید.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-[380px] h-[550px] flex flex-col overflow-hidden border border-gray-200">
        {/* هدر */}
        <div className="bg-gradient-to-r from-[#1c4793] to-[#113d64] text-white p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold">پشتیبان هوشمند</h3>
            <p className="text-xs text-blue-200">دکتر گیربکس | آنلاین</p>
          </div>
        </div>

        {/* بخش پیام‌ها */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-[#1c4793] to-[#113d64] text-white rounded-br-none"
                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {msg.role === "bot" ? (
                    <Bot className="w-4 h-4 text-blue-500" />
                  ) : (
                    <User className="w-4 h-4 opacity-70" />
                  )}
                  <span className="text-xs opacity-70">
                    {msg.timestamp.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none shadow-sm">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#1c4793]" />
                  <span className="text-sm text-gray-500">در حال بررسی...</span>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-center">
              <p className="text-red-600 text-xs flex items-center justify-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {error}
              </p>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* بخش ورودی */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
              placeholder="سوال خود را بپرسید..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c4793] text-sm"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-[#1c4793] to-[#113d64] text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-400 text-center mt-2">
            پشتیبان هوشمند | پاسخ بر اساس اطلاعات موجود در سایت
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;