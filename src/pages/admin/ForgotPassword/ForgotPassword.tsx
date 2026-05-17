// pages/admin/ForgotPassword.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Mail, ArrowLeft, Send, Shield, CheckCircle, AlertCircle,
  Settings, Lock, Key, UserCheck, Phone, MessageSquare,
  Smartphone, Fingerprint,
  EyeOff,
  Eye
} from "lucide-react";
import axios from "axios";

const ForgotPassword = () => {
  const [step, setStep] = useState<"request" | "verify" | "reset">("request");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [countdown, setCountdown] = useState(0);

  // مرحله 1: درخواست OTP
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone.trim() || phone.length < 11) {
      setMessage({ type: "error", text: "لطفاً شماره موبایل معتبر وارد کنید" });
      return;
    }
    
    setLoading(true);
    setMessage(null);
    
    try {
      const response = await axios.post(
        "https://electroshahresfahan.com/drgearbox/auth/admin/send_otp.php",
        { phone, action: "request" }
      );
      
      if (response.data.success) {
        setMessage({ type: "success", text: "کد تایید به شماره موبایل شما ارسال شد" });
        setStep("verify");
        startCountdown();
      } else {
        setMessage({ type: "error", text: response.data.message || "خطا در ارسال کد" });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({ type: "error", text: "خطا در ارتباط با سرور" });
    } finally {
      setLoading(false);
    }
  };

  // مرحله 2: تایید OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim() || code.length !== 6) {
      setMessage({ type: "error", text: "لطفاً کد 6 رقمی را وارد کنید" });
      return;
    }
    
    setLoading(true);
    setMessage(null);
    
    try {
      const response = await axios.post(
        "https://electroshahresfahan.com/drgearbox/auth/admin/verify_otp.php",
        { phone, code, action: "verify" }
      );
      
      if (response.data.success) {
        setMessage({ type: "success", text: "کد با موفقیت تایید شد" });
        setStep("reset");
      } else {
        setMessage({ type: "error", text: response.data.message || "کد وارد شده صحیح نیست" });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({ type: "error", text: "خطا در ارتباط با سرور" });
    } finally {
      setLoading(false);
    }
  };

  // مرحله 3: تنظیم رمز جدید
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "رمز عبور باید حداقل 6 کاراکتر باشد" });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "رمز عبور با تکرار آن مطابقت ندارد" });
      return;
    }
    
    setLoading(true);
    setMessage(null);
    
    try {
      const response = await axios.post(
        "https://electroshahresfahan.com/drgearbox/auth/admin/reset_password.php",
        { phone, code, new_password: newPassword, action: "reset" }
      );
      
      if (response.data.success) {
        setMessage({ type: "success", text: "رمز عبور با موفقیت تغییر کرد. لطفاً وارد شوید." });
        setTimeout(() => {
          window.location.href = "/admin/login";
        }, 3000);
      } else {
        setMessage({ type: "error", text: response.data.message || "خطا در تغییر رمز عبور" });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({ type: "error", text: "خطا در ارتباط با سرور" });
    } finally {
      setLoading(false);
    }
  };

  const startCountdown = () => {
    setCountdown(120); // 2 دقیقه
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setLoading(true);
    try {
      const response = await axios.post(
        "https://electroshahresfahan.com/drgearbox/auth/admin/send_otp.php",
        { phone, action: "resend" }
      );
      
      if (response.data.success) {
        setMessage({ type: "success", text: "کد جدید با موفقیت ارسال شد" });
        startCountdown();
      } else {
        setMessage({ type: "error", text: response.data.message || "خطا در ارسال مجدد کد" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "خطا در ارتباط با سرور" });
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.startsWith('0')) {
      return digits.substring(0, 11);
    }
    return digits;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ 
      background: "linear-gradient(135deg, #1c4793 0%, #113d64 50%, #1c4793 100%)" 
    }}>
      {/* افکت‌های پس‌زمینه */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#32a3db]/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* کارت اصلی */}
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#32a3db] to-[#1c4793] rounded-2xl blur-xl opacity-30"></div>
        
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
          
          {/* هدر */}
          <div className="relative px-8 pt-8 pb-6 text-center" style={{ 
            background: "linear-gradient(135deg, #1c4793, #113d64)" 
          }}>
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: `url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')`
            }}></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl backdrop-blur shadow-lg mb-4">
                <Smartphone className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">بازیابی رمز عبور</h1>
              <p className="text-blue-200 text-sm">
                {step === "request" && "کد تایید به شماره موبایل شما ارسال می‌شود"}
                {step === "verify" && "کد 6 رقمی ارسال شده را وارد کنید"}
                {step === "reset" && "رمز عبور جدید خود را وارد کنید"}
              </p>
            </div>
          </div>

          {/* فرم */}
          <div className="p-8">
            {message && (
              <div className={`mb-6 p-3 rounded-xl flex items-center gap-2 ${
                message.type === "success" 
                  ? "bg-green-50 border border-green-200" 
                  : "bg-red-50 border border-red-200"
              }`}>
                {message.type === "success" ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                <span className={`text-sm ${message.type === "success" ? "text-green-700" : "text-red-700"}`}>
                  {message.text}
                </span>
              </div>
            )}

            {/* مرحله 1: درخواست OTP */}
            {step === "request" && (
              <form onSubmit={handleRequestOTP} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: "#113d64" }}>
                    شماره موبایل
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <Phone className="w-5 h-5" style={{ color: "#cccccc" }} />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                      className="w-full px-4 py-3 pr-12 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2"
                      style={{ 
                        borderColor: "#cccccc",
                        backgroundColor: "#ffffff",
                        color: "#113d64"
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#1c4793";
                        e.target.style.boxShadow = "0 0 0 3px rgba(28,71,147,0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#cccccc";
                        e.target.style.boxShadow = "none";
                      }}
                      placeholder="09123456789"
                      maxLength={11}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    کد تایید 6 رقمی به این شماره ارسال خواهد شد
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="relative w-full py-3 rounded-xl font-bold text-white transition-all duration-300 overflow-hidden group"
                  style={{ 
                    background: "linear-gradient(135deg, #1c4793, #113d64)",
                    boxShadow: "0 4px 15px -5px rgba(28,71,147,0.4)"
                  }}
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <div className="relative flex items-center justify-center gap-2 z-10">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>در حال ارسال...</span>
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-5 h-5" />
                        <span>ارسال کد تایید</span>
                      </>
                    )}
                  </div>
                </button>
              </form>
            )}

            {/* مرحله 2: تایید OTP */}
            {step === "verify" && (
              <form onSubmit={handleVerifyOTP} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: "#113d64" }}>
                    کد تایید
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <Fingerprint className="w-5 h-5" style={{ color: "#cccccc" }} />
                    </div>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                      className="w-full px-4 py-3 pr-12 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 text-center text-2xl tracking-widest"
                      style={{ 
                        borderColor: "#cccccc",
                        backgroundColor: "#ffffff",
                        color: "#113d64"
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#1c4793";
                        e.target.style.boxShadow = "0 0 0 3px rgba(28,71,147,0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#cccccc";
                        e.target.style.boxShadow = "none";
                      }}
                      placeholder="123456"
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-400">
                      کد به شماره {phone} ارسال شد
                    </p>
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={countdown > 0}
                      className="text-xs transition-all hover:underline"
                      style={{ color: countdown > 0 ? "#cccccc" : "#32a3db" }}
                    >
                      {countdown > 0 ? `ارسال مجدد (${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')})` : "ارسال مجدد کد"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="relative w-full py-3 rounded-xl font-bold text-white transition-all duration-300 overflow-hidden group"
                  style={{ 
                    background: "linear-gradient(135deg, #1c4793, #113d64)",
                    boxShadow: "0 4px 15px -5px rgba(28,71,147,0.4)"
                  }}
                >
                  <div className="relative flex items-center justify-center gap-2 z-10">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>در حال تایید...</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5" />
                        <span>تایید کد</span>
                      </>
                    )}
                  </div>
                </button>
              </form>
            )}

            {/* مرحله 3: تنظیم رمز جدید */}
            {step === "reset" && (
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: "#113d64" }}>
                    رمز عبور جدید
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5" style={{ color: "#cccccc" }} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2"
                      style={{ 
                        borderColor: "#cccccc",
                        backgroundColor: "#ffffff",
                        color: "#113d64"
                      }}
                      placeholder="حداقل 6 کاراکتر"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 left-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" style={{ color: "#cccccc" }} />
                      ) : (
                        <Eye className="w-5 h-5" style={{ color: "#cccccc" }} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: "#113d64" }}>
                    تکرار رمز عبور جدید
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5" style={{ color: "#cccccc" }} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2"
                      style={{ 
                        borderColor: "#cccccc",
                        backgroundColor: "#ffffff",
                        color: "#113d64"
                      }}
                      placeholder="تکرار رمز عبور"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="relative w-full py-3 rounded-xl font-bold text-white transition-all duration-300 overflow-hidden group"
                  style={{ 
                    background: "linear-gradient(135deg, #1c4793, #113d64)",
                    boxShadow: "0 4px 15px -5px rgba(28,71,147,0.4)"
                  }}
                >
                  <div className="relative flex items-center justify-center gap-2 z-10">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>در حال تغییر رمز...</span>
                      </>
                    ) : (
                      <>
                        <Key className="w-5 h-5" />
                        <span>تغییر رمز عبور</span>
                      </>
                    )}
                  </div>
                </button>
              </form>
            )}

            {/* لینک بازگشت به صفحه ورود */}
            <div className="mt-6 pt-6 border-t text-center" style={{ borderColor: "#e5e7eb" }}>
              <Link 
                to="/admin/login" 
                className="inline-flex items-center gap-2 text-sm transition-all hover:underline"
                style={{ color: "#32a3db" }}
              >
                <ArrowLeft className="w-4 h-4" />
                بازگشت به صفحه ورود
              </Link>
            </div>
          </div>
        </div>

        {/* فوتر */}
        <div className="text-center mt-6">
          <p className="text-xs text-white/60">
            © ۱۴۰۴ دکتر گیربکس - تمامی حقوق محفوظ است
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;