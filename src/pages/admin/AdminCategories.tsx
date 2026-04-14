import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    color: "#8B1A1A"
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    const { data } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
    if (data) setCategories(data);
    setLoading(false);
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData(prev => ({ ...prev, name, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    await supabase.from('categories').insert([{
      name: formData.name,
      slug: formData.slug,
      color: formData.color
    }]);

    setFormData({ name: "", slug: "", color: "#8B1A1A" });
    await fetchCategories();
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      await supabase.from('categories').delete().eq('id', id);
      fetchCategories();
    }
  };

  return (
    <div className="min-h-screen bg-background paper-grain text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-sepia-border pb-4">
          <h1 className="text-3xl font-display font-bold text-gold">Quản lý danh mục</h1>
          <Link to="/admin">
            <Button variant="outline" className="border-sepia-border">Quay lại</Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="mb-12 bg-surface p-6 rounded-sm border border-sepia-border flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full space-y-2">
            <Label htmlFor="name" className="font-ui text-sm">Tên danh mục</Label>
            <Input id="name" value={formData.name} onChange={handleNameChange} required className="bg-background border-sepia-border text-foreground" />
          </div>
          
          <div className="flex-1 w-full space-y-2">
            <Label htmlFor="slug" className="font-ui text-sm">Slug</Label>
            <Input id="slug" value={formData.slug} onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))} required className="bg-background border-sepia-border text-foreground" />
          </div>

          <div className="w-full md:w-24 space-y-2">
            <Label htmlFor="color" className="font-ui text-sm">Màu sắc</Label>
            <Input id="color" type="color" value={formData.color} onChange={e => setFormData(prev => ({ ...prev, color: e.target.value }))} className="h-10 p-1 bg-background border-sepia-border cursor-pointer w-full" />
          </div>

          <Button type="submit" disabled={saving} className="w-full md:w-auto bg-crimson hover:bg-crimson-dark text-foreground">
            {saving ? 'Đang thêm...' : 'Thêm mới'}
          </Button>
        </form>

        <div className="bg-surface rounded-sm border border-sepia-border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-text-secondary">Đang tải...</div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center text-text-secondary">Chưa có dữ liệu</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-sepia-border bg-black/20">
                  <th className="p-4 font-ui font-medium text-gold w-12">Màu</th>
                  <th className="p-4 font-ui font-medium text-gold">Tên danh mục</th>
                  <th className="p-4 font-ui font-medium text-gold">Slug</th>
                  <th className="p-4 font-ui font-medium text-gold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat.id} className="border-b border-sepia-border/50 hover:bg-black/10 transition-colors">
                    <td className="p-4">
                      <div className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: cat.color }}></div>
                    </td>
                    <td className="p-4 font-body font-bold">{cat.name}</td>
                    <td className="p-4 font-mono text-sm text-text-secondary">{cat.slug}</td>
                    <td className="p-4 text-right">
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="h-8 text-xs bg-red-900 hover:bg-red-800 text-white"
                        onClick={() => handleDelete(cat.id)}
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
