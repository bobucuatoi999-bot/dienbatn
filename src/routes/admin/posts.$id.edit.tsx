import { createFileRoute } from "@tanstack/react-router";
import { AdminPostEditor } from "@/pages/admin/AdminPostEditor";
import { AdminRoute } from "@/components/AdminRoute";

export const Route = createFileRoute("/admin/posts/$id/edit")({
  head: () => ({
    meta: [{ title: "Chỉnh sửa bài viết — Quản Trị" }],
  }),
  component: EditPostComponent,
});

function EditPostComponent() {
  const { id } = Route.useParams();
  return (
    <AdminRoute>
      <AdminPostEditor isEdit={true} postId={id} />
    </AdminRoute>
  );
}
