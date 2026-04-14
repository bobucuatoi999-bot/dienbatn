import { createFileRoute } from "@tanstack/react-router";
import { AdminPostEditor } from "@/pages/admin/AdminPostEditor";
import { AdminRoute } from "@/components/AdminRoute";

export const Route = createFileRoute("/admin/posts/new")({
  head: () => ({
    meta: [{ title: "Tạo bài viết mới — Quản Trị" }],
  }),
  component: () => (
    <AdminRoute>
      <AdminPostEditor isEdit={false} />
    </AdminRoute>
  ),
});
