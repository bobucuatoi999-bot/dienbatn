import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { formatDate, getLanguageLabel } from "@/lib/mock-data";
import { PostCard } from "@/components/PostCard";
import { Share2, Eye } from "lucide-react";

export const Route = createFileRoute("/posts/$slug")({
  component: SinglePostPage,
});

function SinglePostPage() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPostData() {
      setLoading(true);
      try {
        const { data: postData, error } = await supabase
          .from('posts')
          .select('*, post_categories(category:categories(*))')
          .eq('slug', slug)
          .eq('published', true)
          .single();

        if (error) throw error;
        setPost(postData);

        // Increment view count
        await supabase.rpc('increment_view_count', { post_id: postData.id });

        // Fetch related posts
        if (postData.post_categories?.length > 0) {
          const categoryIds = postData.post_categories.map((pc: any) => pc.category_id);
          const { data: relatedData } = await supabase
            .from('posts')
            .select('*, post_categories(category:categories(*))')
            .eq('published', true)
            .neq('id', postData.id)
            .in('post_categories.category_id', categoryIds)
            .limit(3);
          
          setRelated(relatedData || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPostData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="font-display text-2xl text-gold">Bài viết không tồn tại</p>
        <Link to="/" className="mt-4 inline-block font-ui text-sm text-text-secondary gold-glow">
          ← Về trang chủ
        </Link>
      </div>
    );
  }

  const lang = getLanguageLabel(post.language);
  const categoryNames = post.post_categories?.map((pc: any) => pc.category.name) || [];

  return (
    <article className="mx-auto max-w-4xl px-4 py-10">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 font-ui text-sm text-text-secondary">
        <Link to="/" className="gold-glow">Trang chủ</Link>
        <span className="text-gold/30">›</span>
        <Link to="/posts" search={{ category: "" }} className="gold-glow">Bài viết</Link>
        {categoryNames.length > 0 && (
          <>
            <span className="text-gold/30">›</span>
            <span className="text-foreground/60">{categoryNames[0]}</span>
          </>
        )}
      </div>

      {/* Header */}
      <header className="mb-8">
        <div className="mb-3 flex flex-wrap gap-2">
          {categoryNames.map((cat: string) => (
            <span key={cat} className="rounded-sm bg-crimson px-2.5 py-0.5 font-ui text-xs font-medium text-foreground/90">
              {cat}
            </span>
          ))}
          <span className="rounded-sm bg-surface px-2.5 py-0.5 font-ui text-xs text-foreground/70">
            {lang.flag} {lang.label}
          </span>
        </div>

        <h1 className="font-display text-3xl font-black leading-tight text-foreground md:text-4xl">
          {post.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-4 font-ui text-sm text-text-secondary">
          <time>{formatDate(post.created_at)}</time>
          <span className="flex items-center gap-1">
            <Eye size={14} />
            {(post.view_count || 0).toLocaleString()} lượt xem
          </span>
          <button
            className="ml-auto flex items-center gap-1 text-text-secondary transition-colors hover:text-gold"
            onClick={() => {
              if (typeof navigator !== "undefined" && navigator.share) {
                navigator.share({ title: post.title, url: window.location.href });
              }
            }}
          >
            <Share2 size={14} />
            Chia sẻ
          </button>
        </div>
      </header>

      <div className="gold-separator mb-8" />

      {/* YouTube embed for video posts */}
      {post.language === "video" && post.youtube_url && (
        <div className="mb-8 aspect-video overflow-hidden rounded-sm border border-sepia-border">
          <iframe
            src={post.youtube_url.replace("watch?v=", "embed/")}
            className="h-full w-full"
            allowFullScreen
            title={post.title}
          />
        </div>
      )}

      {/* Content */}
      <div
        className="prose-hongbang font-body text-base leading-relaxed text-foreground/90"
        dangerouslySetInnerHTML={{ __html: post.content || `<p>${post.excerpt || ""}</p>` }}
      />

      <div className="gold-separator my-10" />

      {/* Related posts */}
      {related.length > 0 && (
        <section>
          <h2 className="mb-6 font-display text-xl font-bold text-gold">
            BÀI VIẾT LIÊN QUAN
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
