import { useEffect, useState, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { uploadToCloudinary } from "@/lib/cloudinary";

export function AdminMedia() {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { profile } = useAuth();

  useEffect(() => {
    fetchMedia();
  }, []);

  async function fetchMedia() {
    setLoading(true);
    const { data } = await supabase.from('media').select('*').order('created_at', { ascending: false });
    if (data) setMedia(data);
    setLoading(false);
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Chưa đăng nhập");

      const publicUrl = await uploadToCloudinary(file);

      const { error: insertError } = await supabase.from('media').insert([{
        filename: file.name,
        storage_path: publicUrl, // store cloudinary URL as path
        public_url: publicUrl,
        file_size: file.size,
        mime_type: file.type,
        uploaded_by: user.id
      }]);

      if (insertError) throw insertError;

      alert("Tải ảnh lên thành công");
      await fetchMedia();
    } catch (err: any) {
      console.error("Lỗi upload:", err);
      setError('Tải ảnh thất bại: ' + err.message);
      alert(err.message || "Lỗi khi tải lên");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string, storage_path: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa ảnh này?")) {
      try {
        // Since we are using Cloudinary via unsigned upload, 
        // deleting from Cloudinary via frontend without API secret is not directly possible 
        // for simple unsigned setups (Cloudinary requires a signature or token for deletion).
        // For this task, we will just delete the record from Supabase media table.
        const { error: dbError } = await supabase.from('media').delete().eq('id', id);
        if (dbError) throw dbError;

        alert("Đã xóa ảnh thành công");
        fetchMedia();
      } catch (err: any) {
        console.error("Lỗi xóa media:", err);
        alert(`Lỗi khi xóa: ${err.message}`);
      }
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      alert('Đã sao chép URL!');
    });
  };

  return (
    <div className="min-h-screen bg-background paper-grain text-foreground p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-sepia-border pb-4">
          <h1 className="text-3xl font-display font-bold text-gold">Thư viện ảnh</h1>
          <div className="space-x-4">
            <Link to="/admin">
              <Button variant="outline" className="border-sepia-border">Quay lại</Button>
            </Link>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
            <Button 
              onClick={handleUploadClick} 
              disabled={uploading} 
              className="bg-crimson hover:bg-crimson-dark text-foreground"
            >
              {uploading ? 'Đang tải lên...' : 'Tải ảnh lên'}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-text-secondary text-lg">Đang tải...</div>
        ) : media.length === 0 ? (
          <div className="p-12 text-center text-text-secondary border border-dashed border-sepia-border rounded-sm bg-surface">
            Chưa có ảnh nào. Hãy tải ảnh lên.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {media.map(item => (
              <div key={item.id} className="bg-surface rounded-sm border border-sepia-border overflow-hidden flex flex-col group">
                <div className="aspect-square bg-black/40 relative overflow-hidden flex items-center justify-center">
                  <img 
                    src={item.public_url} 
                    alt={item.filename} 
                    className="object-contain max-w-full max-h-full"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="bg-red-900 hover:bg-red-800 text-white"
                      onClick={() => handleDelete(item.id, item.storage_path)}
                    >
                      Xóa ảnh
                    </Button>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <p className="font-ui text-sm text-foreground/80 truncate mb-4" title={item.filename}>
                    {item.filename}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-auto border-sepia-border text-xs"
                    onClick={() => copyToClipboard(item.public_url)}
                  >
                    Sao chép URL
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
