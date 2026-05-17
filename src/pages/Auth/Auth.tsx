// pages/Login/Login.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Send, CheckCircle, AlertCircle, User, ArrowLeft, Loader2 } from "lucide-react";
import axios from "axios";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"phone" | "otp" | "register">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [family, setFamily] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [testCode, setTestCode] = useState("");

  // بررسی سشن ذخیره شده در localStorage
  useEffect(() => {
    const sessionToken = localStorage.getItem("session_token");
    if (sessionToken) {
      checkSession(sessionToken);
    }
  }, []);

  const checkSession = async (token: string) => {
    try {
      const formData = new FormData();
      formData.append("session_token", token);
      
      const response = await axios.post(
        "https://electroshahresfahan.com/drgearbox/auth/login_user.php",
        formData
      );
      
      if (response.data.success) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/userpanel");
      }
    } catch (err) {
      localStorage.removeItem("session_token");
      localStorage.removeItem("user");
    }
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, "");
    if (numbers.length <= 11) return numbers;
    return numbers.slice(0, 11);
  };

  const handleSendOTP = async () => {
    if (phone.length !== 11) {
      setError("شماره تلفن باید 11 رقم باشد");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("phone", phone);
      
      const response = await axios.post(
        "https://electroshahresfahan.com/drgearbox/auth/send_otp.php",
        formData
      );

      if (response.data.message) {
        setStep("otp");
        setCountdown(120); // 2 دقیقه
        setTestCode(response.data.otp);
        
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError("خطا در ارسال کد تایید");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (code.length !== 6) {
      setError("کد تایید باید 6 رقم باشد");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("phone", phone);
      formData.append("code", code);
      
      const response = await axios.post(
        "https://electroshahresfahan.com/drgearbox/auth/verify_otp.php",
        formData
      );

      if (response.data.status === "existing") {
        // کاربر موجود - ورود به حساب
        const loginForm = new FormData();
        loginForm.append("phone", phone);
        
        const loginResponse = await axios.post(
          "https://electroshahresfahan.com/drgearbox/auth/login_user.php",
          loginForm
        );
        
        if (loginResponse.data.success) {
          localStorage.setItem("user", JSON.stringify(loginResponse.data.user));
          localStorage.setItem("session_token", loginResponse.data.session_token);
          navigate("/userpanel");
        } else {
          setError(loginResponse.data.error);
        }
      } else if (response.data.status === "new") {
        // کاربر جدید - برو به مرحله ثبت نام
        setStep("register");
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError("خطا در تایید کد");
    } finally {
      setLoading(false);
    }

  // window.location.reload();

    
  };

  const handleRegister = async () => {
    if (!name.trim()) {
      setError("نام خود را وارد کنید");
      return;
    }
    if (!family.trim()) {
      setError("نام خانوادگی خود را وارد کنید");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("phone", phone);
      formData.append("name", name);
      formData.append("family", family);
      
      const response = await axios.post(
        "https://electroshahresfahan.com/drgearbox/auth/register_user.php",
        formData
      );

      if (response.data.success) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("session_token", response.data.session_token);
        navigate("/userpanel");
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError("خطا در ثبت نام");
    } finally {
      setLoading(false);
    }

    window.location.reload();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* هدر */}
        <div className="bg-gradient-to-r from-[#1c4793] to-[#113d64] p-6 text-white text-center">
          <h2 className="text-2xl font-bold">ورود / ثبت نام</h2>
          <p className="text-blue-200 text-sm mt-1">دکتر گیربکس</p>
        </div>

        <div className="p-6">
          {/* مرحله 1: وارد کردن شماره تلفن */}
          {step === "phone" && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-10 h-10 text-[#1c4793]" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">ورود با شماره تلفن</h3>
                <p className="text-gray-500 text-sm mt-1">
                  کد تایید برای شما ارسال می‌شود
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  شماره تلفن
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                  placeholder="مثال: 09123456789"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793] focus:border-[#1c4793] transition-all text-center text-lg"
                  maxLength={11}
                />
                <p className="text-xs text-gray-400 mt-1">
                  کد تایید به این شماره ارسال می‌شود
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleSendOTP}
                disabled={loading || phone.length !== 11}
                className="w-full py-3 bg-gradient-to-r from-[#1c4793] to-[#113d64] text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    ارسال کد تایید
                  </>
                )}
              </button>
            </div>
          )}

          {/* مرحله 2: وارد کردن کد تایید */}
          {step === "otp" && (
            <div className="space-y-6">
              <button
                onClick={() => setStep("phone")}
                className="flex items-center gap-1 text-gray-500 hover:text-[#1c4793] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">ویرایش شماره</span>
              </button>

              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">کد تایید ارسال شد</h3>
                <p className="text-gray-500 text-sm mt-1">
                  کد 6 رقمی برای شماره {phone} ارسال شد
                </p>
                {testCode && (
                  <p className="text-xs text-gray-400 mt-1 bg-gray-100 inline-block px-2 py-1 rounded">
                    کد تست: {testCode}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  کد تایید
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                  placeholder="کد 6 رقمی"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793] focus:border-[#1c4793] transition-all text-center text-2xl tracking-widest"
                  maxLength={6}
                />
              </div>

              {countdown > 0 ? (
                <p className="text-center text-sm text-gray-500">
                  زمان باقی مانده: {formatTime(countdown)}
                </p>
              ) : (
                <button
                  onClick={handleSendOTP}
                  className="text-[#1c4793] text-sm font-semibold hover:underline text-center w-full"
                >
                  ارسال مجدد کد
                </button>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleVerifyOTP}
                disabled={loading || code.length !== 6}
                className="w-full py-3 bg-gradient-to-r from-[#1c4793] to-[#113d64] text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  "ورود به حساب کاربری"
                )}
              </button>
            </div>
          )}

          {/* مرحله 3: ثبت نام کاربر جدید */}
          {step === "register" && (
            <div className="space-y-6">
              <button
                onClick={() => setStep("phone")}
                className="flex items-center gap-1 text-gray-500 hover:text-[#1c4793] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">مراحل قبلی</span>
              </button>

              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-[#1c4793]" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">تکمیل اطلاعات</h3>
                <p className="text-gray-500 text-sm mt-1">
                  لطفاً اطلاعات خود را وارد کنید
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  نام
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: علی"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793] focus:border-[#1c4793] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  نام خانوادگی
                </label>
                <input
                  type="text"
                  value={family}
                  onChange={(e) => setFamily(e.target.value)}
                  placeholder="مثال: رضایی"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1c4793] focus:border-[#1c4793] transition-all"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleRegister}
                disabled={loading || !name.trim() || !family.trim()}
                className="w-full py-3 bg-gradient-to-r from-[#1c4793] to-[#113d64] text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  "تکمیل ثبت نام"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;