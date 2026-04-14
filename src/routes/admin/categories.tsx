import { createFileRoute } from "@tanstack/react-router";
import { AdminCategories } from "@/pages/admin/AdminCategories";
import { AdminRoute } from "@/components/AdminRoute";

export const Route = createFileRoute("/admin/categories")({
  head: () => ({
    meta: [{ title: "Quản lý danh mục — Quản Trị" }],
  }),
  component: () => (
    <AdminRoute>
      <AdminCategories />
    </AdminRoute>
  ),
});
