export function Footer() {
  return (
    <footer className="border-t border-sepia-border bg-surface paper-grain">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 text-center">
        <div className="gold-separator mx-auto mb-6 max-w-xs" />

        <h3 className="font-display text-xl font-bold text-gold">
          HỒNG BÀNG DỊCH
        </h3>
        <p className="mt-1 font-body text-sm text-text-secondary">
          Chuyên nghiên cứu Văn Hoá Phương Đông
        </p>

        <div className="mt-6 space-y-1 font-ui text-sm text-text-secondary">
          <p>
            Email:{" "}
            <a href="mailto:dienbatn@gmail.com" className="gold-glow text-foreground">
              dienbatn@gmail.com
            </a>
          </p>
          <p>
            Điện thoại:{" "}
            <span className="text-foreground">0942627277 – 0904392219</span>
          </p>
        </div>

        <div className="gold-separator mx-auto mt-6 max-w-xs" />

        <p className="mt-4 font-ui text-xs text-text-secondary/60">
          © {new Date().getFullYear()} Hồng Bàng Dịch — Điện Bà Tây Ninh. Bảo lưu mọi quyền.
        </p>
      </div>
    </footer>
  );
}
