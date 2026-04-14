import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PostCard } from "@/components/PostCard";
import { Sidebar } from "@/components/Sidebar";
import { usePosts } from "@/hooks/useSupabaseData";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type LangFilter = "all" | "vi" | "en" | "zh" | "video";

export const Route = createFileRoute("/posts/")({
  validateSearch: (search: Record<string, unknown>) => ({
    category: (search.category as string) || "",
  }),
  head: () => ({
    meta: [
      { title: "Bài Viết — Hồng Bàng Dịch" },
      { name: "description", content: "Danh sách bài viết nghiên cứu Văn Hoá Phương Đông" },
    ],
  }),
  component: PostsPage,
});

const langTabs: { key: LangFilter; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "vi", label: "🇻🇳 Tiếng Việt" },
  { key: "en", label: "🇬🇧 English" },
  { key: "zh", label: "🇨🇳 Tiếng Trung" },
  { key: "video", label: "📹 Video" },
];

function PostsPage() {
  const { category } = Route.useSearch();
  const [langFilter, setLangFilter] = useState<LangFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { posts: allPosts, loading } = usePosts(
    langFilter === "all" ? undefined : langFilter,
    50 // Fetch more for filtering
  );

  let filtered = allPosts;
  
  if (category) {
    filtered = filtered.filter((p) => 
      p.post_categories?.some((pc: any) => pc.category.slug === category)
    );
  }
  
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter((p) => 
      p.title.toLowerCase().includes(q) || 
      (p.excerpt && p.excerpt.toLowerCase().includes(q))
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-6 font-display text-3xl font-bold text-gold">BÀI VIẾT</h1>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
        <Input
          placeholder="Tìm kiếm bài viết..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 font-ui bg-surface border-sepia-border text-foreground placeholder:text-text-secondary/50"
        />
      </div>

      {/* Language tabs */}
      <div className="mb-8 flex flex-wrap gap-1 rounded-sm border border-sepia-border bg-surface p-1">
        {langTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setLangFilter(tab.key)}
            className={`rounded-sm px-4 py-2 font-ui text-sm transition-colors ${
              langFilter === tab.key
                ? "bg-crimson text-foreground"
                : "text-text-secondary hover:text-gold"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent"></div>
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-12 text-center font-body text-text-secondary">
              Chưa có bài viết nào.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {filtered.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
        <Sidebar />
      </div>
    </div>
  );
}
