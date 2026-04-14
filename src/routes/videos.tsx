import { createFileRoute } from "@tanstack/react-router";
import { usePosts } from "@/hooks/useSupabaseData";

export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: [
      { title: "Video — Hồng Bàng Dịch" },
      { name: "description", content: "Video bài giảng về Kinh Dịch, Phong Thuỷ và Văn Hoá Phương Đông" },
    ],
  }),
  component: VideosPage,
});

function VideosPage() {
  const { posts: videoPosts, loading } = usePosts("video", 20);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-8 font-display text-3xl font-bold text-gold">VIDEO</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent"></div>
        </div>
      ) : videoPosts.length === 0 ? (
        <p className="py-12 text-center font-body text-text-secondary">
          Chưa có bài viết nào.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videoPosts.map((post) => (
            <div
              key={post.id}
              className="overflow-hidden rounded-sm border border-sepia-border bg-surface transition-all gold-border-top hover:shadow-lg hover:shadow-gold/5"
            >
              <div className="aspect-video">
                {post.youtube_url ? (
                  <iframe
                    src={post.youtube_url.replace("watch?v=", "embed/")}
                    className="h-full w-full"
                    allowFullScreen
                    title={post.title}
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <span className="text-4xl text-gold/20">▶</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-display text-base font-bold text-foreground">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 font-body text-sm text-text-secondary">
                  {post.excerpt}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
