import { Link } from "@tanstack/react-router";
import type { Post } from "@/lib/mock-data";
import { getLanguageLabel, formatDate } from "@/lib/mock-data";
import { Eye } from "lucide-react";

export function PostCard({ post }: { post: any }) {
  const lang = getLanguageLabel(post.language);
  const categoryNames = post.post_categories?.map((pc: any) => pc.category.name) || [];

  return (
    <Link
      to="/posts/$slug"
      params={{ slug: post.slug }}
      className="group block overflow-hidden rounded-sm border border-sepia-border bg-surface transition-all gold-border-top hover:shadow-lg hover:shadow-gold/5"
    >
      {/* Thumbnail area */}
      <div className="relative aspect-video bg-muted">
        {post.thumbnail_url ? (
          <img
            src={post.thumbnail_url}
            alt={post.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-crimson-dark/30 to-surface">
            <span className="font-display text-4xl text-gold/20">易</span>
          </div>
        )}

        {/* Language badge */}
        <span className="absolute right-2 top-2 rounded-sm bg-background/80 px-2 py-0.5 font-ui text-xs text-foreground backdrop-blur-sm">
          {lang.flag} {lang.label}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Categories */}
        <div className="mb-2 flex flex-wrap gap-1.5">
          {categoryNames.map((cat: string) => (
            <span
              key={cat}
              className="rounded-sm bg-crimson/80 px-2 py-0.5 font-ui text-[10px] font-medium uppercase tracking-wider text-foreground/90"
            >
              {cat}
            </span>
          ))}
        </div>

        <h3 className="font-display text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-gold">
          {post.title}
        </h3>

        <p className="mt-2 line-clamp-2 font-body text-sm leading-relaxed text-text-secondary">
          {post.excerpt}
        </p>

        <div className="mt-3 flex items-center justify-between font-ui text-xs text-text-secondary/70">
          <time>{formatDate(post.created_at)}</time>
          <span className="flex items-center gap-1">
            <Eye size={12} />
            {(post.view_count || 0).toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  );
}
