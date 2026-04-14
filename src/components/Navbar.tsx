import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { to: "/", label: "TRANG CHỦ" },
  { to: "/posts", label: "BÀI VIẾT" },
  { to: "/videos", label: "VIDEO" },
  { to: "/nghien-cuu", label: "NGHIÊN CỨU" },
  { to: "/tam-linh", label: "TÂM LINH" },
  { to: "/phong-thuy", label: "PHONG THUỶ" },
  { to: "/about", label: "GIỚI THIỆU" },
] as const;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="w-full">
      {/* Top gold bar */}
      <div className="gold-separator" />

      {/* Crimson navigation */}
      <div className="bg-crimson paper-grain">
        <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 py-0">
          {/* Desktop links */}
          <div className="hidden items-center gap-0 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-3 font-ui text-sm font-medium tracking-wide text-foreground/90 transition-colors hover:bg-crimson-dark hover:text-gold"
                activeProps={{ className: "bg-crimson-dark text-gold" }}
                activeOptions={{ exact: link.to === "/" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Admin login link */}
          <Link
            to="/login"
            className="hidden py-3 font-ui text-xs tracking-wide text-foreground/50 transition-colors hover:text-gold md:block"
          >
            Admin
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="py-3 text-foreground/90 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="relative z-10 border-t border-crimson-dark md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block px-6 py-3 font-ui text-sm font-medium text-foreground/90 transition-colors hover:bg-crimson-dark hover:text-gold"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/login"
              className="block px-6 py-3 font-ui text-xs text-foreground/50 hover:text-gold"
              onClick={() => setMobileOpen(false)}
            >
              Admin Login
            </Link>
          </div>
        )}
      </div>

      <div className="gold-separator" />
    </nav>
  );
}
