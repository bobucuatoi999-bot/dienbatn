import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export function AdminDashboard() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, published: 0, categories: 0 });
  const { signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    
    try {
      // Fetch posts with categories
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*, post_categories(category:categories(name))')
        .order('created_at', { ascending: false });
        
      if (postsError) throw postsError;

      if (postsData) {
        setPosts(postsData);
        const published = postsData.filter(p => p.published).length;
        const draft = postsData.filter(p => !p.published).length;
        
        setStats({
          total: postsData.length,
          published,
          categories: draft // We'll repurpose the 'categories' stat for 'draft' as per instructions
        });
      }
    } catch (error: any) {
      console.error("Lỗi khi tải dữ liệu:", error);
      alert(`Lỗi khi tải dữ liệu: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    await signOut();
    navigate({ to: '/' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      try {
        const { error } = await supabase.from('posts').delete().eq('id', id);
        if (error) throw error;
        alert("Đã xóa bài viết thành công");
        fetchData();
      } catch (error: any) {
        alert(`Lỗi khi xóa: ${error.message}`);
      }
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from('posts').update({ published: !currentStatus }).eq('id', id);
      if (error) throw error;
      alert("Đã cập nhật trạng thái thành công");
      fetchData();
    } catch (error: any) {
      alert(`Lỗi khi cập nhật: ${error.message}`);
    }
  };

  const getLanguageBadge = (lang: string) => {
    switch (lang) {
      case 'vi': return '🇻🇳 vi';
      case 'en': return '🇬🇧 en';
      case 'zh': return '🇨🇳 zh';
      case 'video': return '📹 video';
      default: return lang;
    }
  };

  return (
    <div className="min-h-screen bg-background paper-grain text-foreground p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-sepia-border pb-4">
          <h1 className="text-3xl font-display font-bold text-gold">Bảng Điều Khiển</h1>
          <Button onClick={handleLogout} variant="outline" className="border-sepia-border text-foreground hover:bg-sepia-border">
            Đăng xuất
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-surface p-6 rounded-sm border border-sepia-border">
            <h3 className="text-lg text-text-secondary font-ui mb-2">Tổng số bài viết</h3>
            <p className="text-4xl font-display text-gold">{stats.total}</p>
          </div>
          <div className="bg-surface p-6 rounded-sm border border-sepia-border">
            <h3 className="text-lg text-text-secondary font-ui mb-2">Đã xuất bản</h3>
            <p className="text-4xl font-display text-gold">{stats.published}</p>
          </div>
          <div className="bg-surface p-6 rounded-sm border border-sepia-border">
            <h3 className="text-lg text-text-secondary font-ui mb-2">Bản nháp</h3>
            <p className="text-4xl font-display text-gold">{stats.categories}</p>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <Link to="/admin/posts/new">
            <Button className="bg-crimson hover:bg-crimson-dark text-foreground">Tạo bài viết mới</Button>
          </Link>
          <Link to="/admin/categories">
            <Button variant="outline" className="border-sepia-border">Quản lý danh mục</Button>
          </Link>
          <Link to="/admin/media">
            <Button variant="outline" className="border-sepia-border">Thư viện ảnh</Button>
          </Link>
        </div>

        <div className="bg-surface rounded-sm border border-sepia-border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-text-secondary">Đang tải...</div>
          ) : posts.length === 0 ? (
            <div className="p-8 text-center text-text-secondary">Chưa có dữ liệu</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-sepia-border bg-black/20">
                  <th className="p-4 font-ui font-medium text-gold">Tiêu đề</th>
                  <th className="p-4 font-ui font-medium text-gold">Ngôn ngữ</th>
                  <th className="p-4 font-ui font-medium text-gold">Danh mục</th>
                  <th className="p-4 font-ui font-medium text-gold">Trạng thái</th>
                  <th className="p-4 font-ui font-medium text-gold">Ngày tạo</th>
                  <th className="p-4 font-ui font-medium text-gold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id} className="border-b border-sepia-border/50 hover:bg-black/10 transition-colors">
                    <td className="p-4 font-body">
                      <Link to={`/admin/posts/${post.id}/edit`} className="hover:text-gold transition-colors">
                        {post.title}
                      </Link>
                    </td>
                    <td className="p-4 font-ui text-sm uppercase">{getLanguageBadge(post.language)}</td>
                    <td className="p-4 font-ui text-xs text-text-secondary">
                      {post.post_categories?.map((pc: any) => pc.category.name).join(', ') || '—'}
                    </td>
                    <td className="p-4 font-ui text-sm">
                      <button 
                        onClick={() => togglePublish(post.id, post.published)}
                        className={`px-2 py-1 rounded-sm text-xs border transition-colors ${
                          post.published 
                            ? 'bg-green-900/20 text-green-400 border-green-800/50 hover:bg-green-900/40' 
                            : 'bg-gray-800/50 text-gray-400 border-gray-700 hover:bg-gray-800'
                        }`}
                      >
                        {post.published ? 'Đã xuất bản' : 'Bản nháp'}
                      </button>
                    </td>
                    <td className="p-4 font-ui text-sm text-text-secondary">
                      {new Date(post.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link to={`/admin/posts/${post.id}/edit`}>
                        <Button variant="outline" size="sm" className="h-8 border-sepia-border text-xs">Sửa</Button>
                      </Link>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="h-8 text-xs bg-red-900 hover:bg-red-800 text-white"
                        onClick={() => handleDelete(post.id)}
                      >
                        Xóa
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
