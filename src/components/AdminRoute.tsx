import { Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-gold text-2xl font-display">
        Đang tải...
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
