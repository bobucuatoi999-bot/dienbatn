import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { AdminRoute } from "@/components/AdminRoute";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Bảng Điều Khiển — Quản Trị" }],
  }),
  component: () => (
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  ),
});
