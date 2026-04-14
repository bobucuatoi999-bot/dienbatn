import { Link } from "@tanstack/react-router";
import { useTopPosts, useCategories } from "@/hooks/useSupabaseData";
import { Eye, Flame } from "lucide-react";

export function Sidebar() {
  const { posts: topPosts, loading: topLoading } = useTopPosts(5);
  const { categories, loading: categoriesLoading } = useCategories();

  return (
    <aside className="space-y-6">
      {/* TOP HOT */}
      <div className="rounded-sm border border-sepia-border bg-surface paper-grain">
        <div className="relative z-10 border-b border-sepia-border px-4 py-3">
          <h3 className="flex items-center gap-2 font-display text-base font-bold text-gold">
            <Flame size={16} className="text-crimson" />
            TOP HOT
          </h3>
        </div>
        <div className="relative z-10 divide-y divide-sepia-border">
          {topLoading ? (
            <div className="flex justify-center p-6">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gold border-t-transparent"></div>
            </div>
          ) : topPosts.length === 0 ? (
            <p className="px-4 py-6 text-center text-xs text-text-secondary">Chưa có bài viết nổi bật</p>
          ) : (
            topPosts.map((post, i) => (
              <Link
                key={post.id}
                to="/posts/$slug"
                params={{ slug: post.slug }}
                className="group flex gap-3 px-4 py-3 transition-colors hover:bg-surface-elevated"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-crimson font-ui text-xs font-bold text-foreground">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 font-body text-sm leading-snug text-foreground group-hover:text-gold">
                    {post.title}
                  </p>
                  <span className="mt-1 flex items-center gap-1 font-ui text-[10px] text-text-secondary/60">
                    <Eye size={10} />
                    {post.view_count.toLocaleString()}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="rounded-sm border border-sepia-border bg-surface paper-grain">
        <div className="relative z-10 border-b border-sepia-border px-4 py-3">
          <h3 className="font-display text-base font-bold text-gold">
            DANH MỤC – CHỦ ĐỀ
          </h3>
        </div>
        <div className="relative z-10 divide-y divide-sepia-border/50">
          {categoriesLoading ? (
            <div className="flex justify-center p-6">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gold border-t-transparent"></div>
            </div>
          ) : categories.length === 0 ? (
            <p className="px-4 py-6 text-center text-xs text-text-secondary">Chưa có danh mục</p>
          ) : (
            categories.map((cat) => (
              <Link
                key={cat.id}
                to="/posts"
                search={{ category: cat.slug }}
                className="flex items-center justify-between px-4 py-2.5 font-ui text-sm text-foreground/80 transition-colors gold-glow"
              >
                <span>{cat.name}</span>
                {/* Supabase categories table doesn't have post_count by default in this schema, 
                    but the requirement says don't modify schema. We'll omit it or show a dot */}
                <span className="h-1.5 w-1.5 rounded-full bg-crimson/40"></span>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* CONTACT */}
      <div className="rounded-sm border border-gold/30 bg-surface paper-grain">
        <div className="relative z-10 p-4 text-center">
          <h3 className="font-display text-base font-bold text-gold">LIÊN HỆ</h3>
          <div className="gold-separator mx-auto my-3 max-w-[100px]" />
          <p className="font-ui text-sm text-text-secondary">
            dienbatn@gmail.com
          </p>
          <p className="font-ui text-sm text-text-secondary">
            0942627277 – 0904392219
          </p>
        </div>
      </div>
    </aside>
  );
}
