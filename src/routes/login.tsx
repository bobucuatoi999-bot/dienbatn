import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Đăng nhập — Hồng Bàng Dịch" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      navigate({ to: "/admin" });
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.message?.includes("Invalid login credentials")) {
        setError("Email hoặc mật khẩu không đúng");
      } else if (err.message?.includes("Email not confirmed")) {
        setError("Email chưa được xác nhận. Kiểm tra hộp thư của bạn.");
      } else {
        setError("Đăng nhập thất bại: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-sm border border-sepia-border bg-surface p-8 paper-grain">
        <div className="relative z-10">
          <h1 className="mb-2 text-center font-display text-2xl font-bold text-gold">
            ĐĂNG NHẬP
          </h1>
          <p className="mb-6 text-center font-ui text-sm text-text-secondary">
            Dành cho quản trị viên
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-sm bg-red-900/50 border border-red-500/50 p-3 text-sm text-red-200 text-center">
                {error}
              </div>
            )}
            <div>
              <Label htmlFor="email" className="font-ui text-sm text-foreground/80">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 bg-background border-sepia-border text-foreground"
                placeholder="admin@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="font-ui text-sm text-foreground/80">
                Mật khẩu
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 bg-background border-sepia-border text-foreground"
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-crimson text-foreground hover:bg-crimson-dark font-ui">
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
