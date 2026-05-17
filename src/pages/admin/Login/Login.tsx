import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Lock, User, Shield, Eye, EyeOff, LogIn, 
  Settings, AlertCircle
} from "lucide-react";
import axios from "axios";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setError("لطفاً نام کاربری و رمز عبور را وارد کنید");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const response = await axios.post("https://electroshahresfahan.com/drgearbox/auth/admin/login.php", {
        username,
        password,
        remember: rememberMe
      });
      
      if (response.data.success) {
        localStorage.setItem("admin_token", response.data.token);
        localStorage.setItem("admin_user", JSON.stringify(response.data.user));
        
        navigate("/dashboard");
      } else {
        setError(response.data.message || "نام کاربری یا رمز عبور اشتباه است");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ 
      background: "linear-gradient(135deg, #1c4793 0%, #113d64 50%, #1c4793 100%)" 
    }}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#32a3db]/10 rounded-full blur-3xl"></div>
        
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#32a3db] to-[#1c4793] rounded-2xl blur-xl opacity-30"></div>
        
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
          
          <div className="relative px-8 pt-8 pb-6 text-center" style={{ 
            background: "linear-gradient(135deg, #1c4793, #113d64)" 
          }}>
            <div 
              className="absolute inset-0 opacity-30" 
              style={{
                backgroundImage: `url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')`
              }}
            ></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl backdrop-blur shadow-lg mb-4">
                <Settings className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">پنل مدیریت</h1>
              <p className="text-blue-200 text-sm">دکتر گیربکس</p>
            </div>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 p-3 rounded-xl flex items-center gap-2 animate-shake" style={{ 
                backgroundColor: "#fee2e2", 
                border: "1px solid #e21f25" 
              }}>
                <AlertCircle className="w-5 h-5" style={{ color: "#e21f25" }} />
                <span className="text-sm" style={{ color: "#e21f25" }}>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "#113d64" }}>
                  نام کاربری
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <User className="w-5 h-5 transition-colors" style={{ color: "#cccccc" }} />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                    placeholder="نام کاربری خود را وارد کنید"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "#113d64" }}>
                  رمز عبور
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 transition-colors" style={{ color: "#cccccc" }} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    placeholder="رمز عبور خود را وارد کنید"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 left-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 transition-colors hover:opacity-70" style={{ color: "#cccccc" }} />
                    ) : (
                      <Eye className="w-5 h-5 transition-colors hover:opacity-70" style={{ color: "#cccccc" }} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded focus:ring-2"
                    style={{ 
                      accentColor: "#1c4793",
                      borderColor: "#cccccc"
                    }}
                  />
                  <span className="text-sm" style={{ color: "#666666" }}>مرا به خاطر بسپار</span>
                </label>
                
                {/* <a 
                  href="/forgot-password" 
                  className="text-sm transition-all hover:underline"
                  style={{ color: "#32a3db" }}
                >
                  رمز عبور خود را فراموش کرده‌اید؟
                </a> */}
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
                      <span>در حال ورود...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      <span>ورود به پنل مدیریت</span>
                    </>
                  )}
                </div>
              </button>
            </form>

            <div className="mt-6 pt-6 border-t text-center" style={{ borderColor: "#e5e7eb" }}>
              <div className="flex items-center justify-center gap-2 mb-3">
                <Shield className="w-4 h-4" style={{ color: "#32a3db" }} />
                <span className="text-xs" style={{ color: "#666666" }}>ورود ایمن با رمزنگاری پیشرفته</span>
              </div>
              <div className="flex items-center justify-center gap-4 text-xs" style={{ color: "#999999" }}>
                <span>پشتیبانی: ۰۲۱-۱۲۳۴۵۶۷۸</span>
                <span>|</span>
                <span>drgearbox.com</span>
              </div>
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

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
