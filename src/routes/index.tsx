import { createFileRoute } from "@tanstack/react-router";
import { HeroBanner } from "@/components/HeroBanner";
import { PostCard } from "@/components/PostCard";
import { Sidebar } from "@/components/Sidebar";
import { usePosts } from "@/hooks/useSupabaseData";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hồng Bàng Dịch — Điện Bà Tây Ninh" },
      { name: "description", content: "Chuyên nghiên cứu về Văn Hoá Phương Đông: Kinh Dịch, Phong Thuỷ, Huyền Môn, Mật Tông" },
      { property: "og:title", content: "Hồng Bàng Dịch — Điện Bà Tây Ninh" },
      { property: "og:description", content: "Chuyên nghiên cứu về Văn Hoá Phương Đông" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { posts: latestPosts, loading } = usePosts(undefined, 6);

  return (
    <>
      <HeroBanner />

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Main content */}
          <div>
            <h2 className="mb-6 font-display text-2xl font-bold text-gold">
              BÀI VIẾT MỚI NHẤT
            </h2>
            
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent"></div>
              </div>
            ) : latestPosts.length === 0 ? (
              <p className="py-10 text-center text-text-secondary">Chưa có bài viết nào</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {latestPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <Sidebar />
        </div>
      </div>
    </>
  );
}
