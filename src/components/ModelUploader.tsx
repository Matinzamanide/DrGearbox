// components/ModelUploader.tsx
import { useState } from "react";
import { Upload, FileArchive, CheckCircle, AlertCircle, Loader2, ExternalLink, Copy } from "lucide-react";

const ModelUploader = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success?: boolean;
    message?: string;
    model_url?: string;
    folder_name?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/zip' || file.name.endsWith('.zip')) {
        setSelectedFile(file);
        setUploadResult(null);
      } else {
        alert('لطفاً فقط فایل ZIP انتخاب کنید');
        e.target.value = '';
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('لطفاً ابتدا یک فایل انتخاب کنید');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('zip_file', selectedFile);

    try {
      const response = await fetch('https://electroshahresfahan.com/drgearbox/upload_model.php', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      setUploadResult(result);
      
      if (result.success) {
        setSelectedFile(null);
        const fileInput = document.getElementById('zip_file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }
    } catch (error) {
      setUploadResult({
        success: false,
        message: 'خطا در ارتباط با سرور'
      });
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border" style={{ borderColor: "#cccccc" }}>
      <h2 className="text-2xl font-bold mb-4" style={{ color: "#113d64" }}>
        📦 آپلود مدل سه بعدی
      </h2>
      
      <p className="text-gray-600 mb-4 text-sm">
        فایل ZIP خروجی گرفته شده از KeyShotXR را آپلود کنید. 
        پوشه به طور خودکار در مسیر <code className="bg-gray-100 px-2 py-0.5 rounded">/public_html/models/</code> extract می‌شود.
      </p>
      
      <div className="border-2 border-dashed rounded-xl p-8 text-center" style={{ borderColor: "#cccccc" }}>
        <input
          type="file"
          id="zip_file"
          accept=".zip"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <label
          htmlFor="zip_file"
          className="cursor-pointer flex flex-col items-center gap-3"
        >
          <FileArchive className="w-16 h-16" style={{ color: "#1c4793" }} />
          <div>
            <span className="text-[#1c4793] font-semibold">انتخاب فایل ZIP</span>
            <p className="text-xs text-gray-500 mt-1">
              {selectedFile ? selectedFile.name : 'حداکثر حجم: 50 مگابایت'}
            </p>
          </div>
        </label>
      </div>
      
      {selectedFile && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full mt-4 py-3 rounded-xl text-white font-bold transition-all flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, #1c4793, #113d64)" }}
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              در حال آپلود و extract...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              آپلود و استخراج
            </>
          )}
        </button>
      )}
      
      {uploadResult && (
        <div className={`mt-4 p-4 rounded-xl ${uploadResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
          {uploadResult.success ? (
            <>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-bold text-green-800">✅ آپلود موفق!</span>
              </div>
              <p className="text-green-700 text-sm mb-2">{uploadResult.message}</p>
              
              {uploadResult.model_url && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-700">آدرس مدل:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm break-all">
                      {uploadResult.model_url}
                    </code>
                    <button
                      onClick={() => copyToClipboard(uploadResult.model_url!)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      title="کپی آدرس"
                    >
                      <Copy className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  {copied && <span className="text-xs text-green-600">✅ کپی شد!</span>}
                  
                  <a
                    href={uploadResult.model_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#1c4793] text-sm hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    مشاهده مدل آپلود شده
                  </a>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="font-bold text-red-800">❌ خطا</span>
              </div>
              <p className="text-red-700 text-sm mt-1">{uploadResult.message}</p>
            </>
          )}
        </div>
      )}
      
      <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
        <p>📁 مسیر ذخیره‌سازی: <code className="bg-gray-200 px-1 rounded">/public_html/models/نام_پوشه/</code></p>
        <p className="mt-1">💡 <span className="font-bold">نکته:</span> نام پوشه بر اساس نام فایل ZIP انتخاب می‌شود.</p>
      </div>
    </div>
  );
};

export default ModelUploader;