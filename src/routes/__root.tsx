import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mb-4 text-6xl text-gold/30">☷</div>
        <h1 className="font-display text-5xl font-bold text-gold">404</h1>
        <h2 className="mt-4 font-display text-xl text-foreground">
          Trang không tồn tại
        </h2>
        <p className="mt-2 font-body text-sm text-text-secondary">
          Trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-sm bg-crimson px-6 py-2.5 font-ui text-sm font-medium text-foreground transition-colors hover:bg-crimson-dark"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "HONG BANG I CHING - MASTER OS" },
      { name: "description", content: "THE DESTINY MANAGEMENT SYSTEM OF THE ANCIENT VIET. You don't care who I am! But you'll know what I will do for you!" },
      { name: "author", content: "dienbatn" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  useEffect(() => {
    supabase.from('posts').select('count').then(({ error }) => { 
      if (error) console.error('Supabase connection failed:', error.message) 
      else console.log('Supabase connected successfully') 
    }) 
  }, []);

  return (
    <div className="min-h-screen bg-background paper-grain">
      <div className="relative z-10">
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
