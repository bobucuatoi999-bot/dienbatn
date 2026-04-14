import { createFileRoute } from "@tanstack/react-router";
import { PostCard } from "@/components/PostCard";
import { Sidebar } from "@/components/Sidebar";
import { posts } from "@/lib/mock-data";

export const Route = createFileRoute("/tam-linh")({
  head: () => ({
    meta: [
      { title: "Tâm Linh — Hồng Bàng Dịch" },
      { name: "description", content: "Bài viết về tâm linh, huyền môn và đạo nghĩa" },
    ],
  }),
  component: TamLinhPage,
});

function TamLinhPage() {
  const filtered = posts.filter((p) => p.published && p.category_names.includes("Tâm Linh"));
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-6 font-display text-3xl font-bold text-gold">TÂM LINH</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-6 sm:grid-cols-2">
          {filtered.map((post) => <PostCard key={post.id} post={post} />)}
          {filtered.length === 0 && <p className="col-span-2 py-12 text-center font-body text-text-secondary">Chưa có bài viết nào.</p>}
        </div>
        <Sidebar />
      </div>
    </div>
  );
}
