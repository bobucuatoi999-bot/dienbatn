import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uploadToCloudinary } from "@/lib/cloudinary";

export function AdminPostEditor({ isEdit, postId }: { isEdit: boolean; postId?: string }) {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    language: "vi",
    youtube_url: "",
    thumbnail_url: "",
    published: false,
    selectedCategories: [] as string[]
  });

  useEffect(() => {
    fetchCategories();
    if (isEdit && postId) {
      fetchPost(postId);
    }
  }, [isEdit, postId]);

  async function fetchCategories() {
    const { data } = await supabase.from('categories').select('*').order('name');
    if (data) setCategories(data);
  }

  async function fetchPost(id: string) {
    const { data } = await supabase
      .from('posts')
      .select('*, post_categories(category_id)')
      .eq('id', id)
      .single();
      
    if (data) {
      setFormData({
        title: data.title || "",
        slug: data.slug || "",
        excerpt: data.excerpt || "",
        content: data.content || "",
        language: data.language || "vi",
        youtube_url: data.youtube_url || "",
        thumbnail_url: data.thumbnail_url || "",
        published: data.published || false,
        selectedCategories: data.post_categories ? data.post_categories.map((pc: any) => pc.category_id) : []
      });
    }
    setLoading(false);
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData(prev => ({ ...prev, title, slug }));
  };

  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => {
      const selectedCategories = prev.selectedCategories.includes(categoryId)
        ? prev.selectedCategories.filter(id => id !== categoryId)
        : [...prev.selectedCategories, categoryId];
      return { ...prev, selectedCategories };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Chỉ chấp nhận file ảnh');
      return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Ảnh không được vượt quá 10MB');
      return;
    }

    setUploading(true);
    setUploadError("");
    
    try {
      const url = await uploadToCloudinary(file);
      setFormData(prev => ({ ...prev, thumbnail_url: url }));
    } catch (err: any) {
      setUploadError(err.message || 'Tải ảnh thất bại');
    } finally {
      setUploading(false);
    }
  };

  const handleInsertImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      // Insert image markdown or HTML at cursor position
      const imageHtml = `<img src="${url}" alt="${file.name}" style="max-width:100%" />\n`;
      setFormData(prev => ({ ...prev, content: prev.content + imageHtml }));
    } catch (err: any) {
      setUploadError('Không thể chèn ảnh: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Chưa đăng nhập");

      const postPayload = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        language: formData.language,
        youtube_url: formData.language === 'video' ? formData.youtube_url : null,
        thumbnail_url: formData.thumbnail_url || null,
        published: formData.published,
        author_id: user.id,
        view_count: isEdit ? undefined : 0
      };

      let currentPostId = postId;

      if (isEdit && postId) {
        const { error: updateError } = await supabase.from('posts').update(postPayload).eq('id', postId);
        if (updateError) throw updateError;
        
        const { error: deleteCatError } = await supabase.from('post_categories').delete().eq('post_id', postId);
        if (deleteCatError) throw deleteCatError;
      } else {
        const { data, error: insertError } = await supabase.from('posts').insert([postPayload]).select().single();
        if (insertError) throw insertError;
        if (data) currentPostId = data.id;
      }

      if (currentPostId && formData.selectedCategories.length > 0) {
        const catPayload = formData.selectedCategories.map(category_id => ({
          post_id: currentPostId,
          category_id
        }));
        const { error: catError } = await supabase.from('post_categories').insert(catPayload);
        if (catError) throw catError;
      }

      alert("Đã lưu bài viết thành công");
      navigate({ to: '/admin' });
    } catch (error: any) {
      console.error("Lỗi khi lưu bài viết:", error);
      alert(`Lỗi khi lưu bài viết: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-gold font-display text-2xl">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-background paper-grain text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-sepia-border pb-4">
          <h1 className="text-3xl font-display font-bold text-gold">
            {isEdit ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
          </h1>
          <Link to="/admin">
            <Button variant="outline" className="border-sepia-border">Hủy</Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-surface p-8 rounded-sm border border-sepia-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="font-ui text-sm text-foreground/80">Tiêu đề</Label>
              <Input id="title" value={formData.title} onChange={handleTitleChange} required className="bg-background border-sepia-border text-foreground" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug" className="font-ui text-sm text-foreground/80">Slug</Label>
              <Input id="slug" value={formData.slug} onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))} required className="bg-background border-sepia-border text-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt" className="font-ui text-sm text-foreground/80">Tóm tắt</Label>
            <Textarea id="excerpt" value={formData.excerpt} onChange={e => setFormData(prev => ({ ...prev, excerpt: e.target.value }))} className="bg-background border-sepia-border text-foreground min-h-[80px]" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="font-ui text-sm text-foreground/80">Nội dung</Label>
            <div style={{ marginBottom: '4px' }}> 
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleInsertImage} 
                id="content-image-upload" 
                style={{ display: 'none' }} 
                disabled={uploading} 
              /> 
              <label htmlFor="content-image-upload" style={{ cursor: 'pointer', fontSize: '13px', padding: '4px 10px', border: '1px solid #444', borderRadius: '3px', display: 'inline-block' }}> 
                {uploading ? 'Đang tải...' : '🖼 Chèn ảnh vào nội dung'} 
              </label> 
            </div>
            <Textarea id="content" value={formData.content} onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))} className="bg-background border-sepia-border text-foreground min-h-[300px] font-mono text-sm" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="language" className="font-ui text-sm text-foreground/80">Ngôn ngữ / Loại</Label>
              <select 
                id="language" 
                value={formData.language} 
                onChange={e => setFormData(prev => ({ ...prev, language: e.target.value }))}
                className="flex h-10 w-full rounded-md border border-sepia-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
                <option value="zh">Tiếng Trung</option>
                <option value="video">Video</option>
              </select>
            </div>

            {formData.language === 'video' && (
              <div className="space-y-2">
                <Label htmlFor="youtube_url" className="font-ui text-sm text-foreground/80">URL YouTube</Label>
                <Input id="youtube_url" placeholder="https://www.youtube.com/watch?v=..." value={formData.youtube_url} onChange={e => setFormData(prev => ({ ...prev, youtube_url: e.target.value }))} className="bg-background border-sepia-border text-foreground" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail_url" className="font-ui text-sm text-foreground/80">Ảnh đại diện</Label>
            
            {/* Show preview if URL exists */} 
            {formData.thumbnail_url && ( 
              <div style={{ marginBottom: '8px' }}> 
                <img  
                  src={formData.thumbnail_url}  
                  alt="preview"  
                  style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '4px' }}  
                /> 
                <button  
                  type="button"  
                  onClick={() => setFormData(prev => ({ ...prev, thumbnail_url: '' }))} 
                  style={{ marginTop: '4px', fontSize: '12px', color: '#999' }} 
                > 
                  Xoá ảnh 
                </button> 
              </div> 
            )} 
          
            {/* File upload button */} 
            {!formData.thumbnail_url && ( 
              <div> 
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  disabled={uploading} 
                  id="thumbnail-upload" 
                  style={{ display: 'none' }} 
                /> 
                <label  
                  htmlFor="thumbnail-upload" 
                  style={{  
                    display: 'inline-block',  
                    cursor: uploading ? 'not-allowed' : 'pointer', 
                    padding: '8px 16px', 
                    border: '1px dashed #666', 
                    borderRadius: '4px', 
                    width: '100%', 
                    textAlign: 'center' 
                  }} 
                > 
                  {uploading ? 'Đang tải lên...' : 'Chọn ảnh từ máy tính'} 
                </label> 
              </div> 
            )} 
          
            {/* Also allow manual URL input as fallback */} 
            <Input 
              id="thumbnail_url"
              placeholder="Hoặc dán URL ảnh trực tiếp..." 
              value={formData.thumbnail_url} 
              onChange={(e) => setFormData(prev => ({ ...prev, thumbnail_url: e.target.value }))} 
              className="mt-2 bg-background border-sepia-border text-foreground"
            /> 
          
            {uploadError && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{uploadError}</p>} 
          </div>

          <div className="space-y-4">
            <Label className="font-ui text-sm text-foreground/80">Danh mục</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 border border-sepia-border p-4 rounded-sm bg-background/50">
              {categories.map(category => (
                <label key={category.id} className="flex items-center space-x-2 font-ui text-sm cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                    className="rounded border-sepia-border text-crimson focus:ring-crimson bg-background"
                  />
                  <span>{category.name}</span>
                </label>
              ))}
              {categories.length === 0 && <span className="text-text-secondary text-sm">Chưa có danh mục</span>}
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-4 border-t border-sepia-border">
            <input 
              type="checkbox" 
              id="published" 
              checked={formData.published}
              onChange={e => setFormData(prev => ({ ...prev, published: e.target.checked }))}
              className="rounded border-sepia-border text-crimson focus:ring-crimson bg-background w-5 h-5"
            />
            <Label htmlFor="published" className="font-ui font-medium cursor-pointer">
              {formData.published ? 'Đã xuất bản' : 'Bản nháp'}
            </Label>
          </div>

          <div className="pt-6">
            <Button type="submit" disabled={saving} className="w-full md:w-auto bg-crimson hover:bg-crimson-dark text-foreground px-8">
              {saving ? 'Đang lưu...' : 'Lưu bài viết'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
