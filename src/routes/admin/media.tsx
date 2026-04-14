import { createFileRoute } from "@tanstack/react-router";
import { AdminMedia } from "@/pages/admin/AdminMedia";
import { AdminRoute } from "@/components/AdminRoute";

export const Route = createFileRoute("/admin/media")({
  head: () => ({
    meta: [{ title: "Thư viện ảnh — Quản Trị" }],
  }),
  component: () => (
    <AdminRoute>
      <AdminMedia />
    </AdminRoute>
  ),
});
