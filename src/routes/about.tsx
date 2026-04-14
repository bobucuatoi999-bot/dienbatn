import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "HONG BANG I CHING - MASTER OS" },
      { name: "description", content: "THE DESTINY MANAGEMENT SYSTEM OF THE ANCIENT VIET. You don't care who I am! But you'll know what I will do for you!" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 font-display text-3xl font-bold text-gold uppercase">HONG BANG I CHING - MASTER OS</h1>
      <div className="gold-separator mb-8" />

      <div className="space-y-6 font-body text-base leading-relaxed text-foreground/90">
        <div className="space-y-2">
          <div className="text-xl font-bold text-gold uppercase tracking-wider">
            THE DESTINY MANAGEMENT SYSTEM OF THE ANCIENT VIET
          </div>
          <div className="text-lg font-bold text-gold/90">
            HỆ THỐNG ĐIỀU HÀNH CHÍNH: HỆ THỐNG QUẢN LÝ SỐ PHẬN CỦA NGƯỜI VIỆT CỔ ĐẠI
          </div>
        </div>
        
        <div className="text-lg text-gold/80 italic font-serif">
          标题 (Tiáotí): 鸿庞易 - 主操作系统：百越民族命运管理系统
        </div>

        <div className="rounded-sm border-l-2 border-crimson bg-surface/50 p-6 mt-8">
          <h3 className="text-gold font-display font-bold mb-2">KHÁI NIỆM CỐT LÕI</h3>
          <p className="text-foreground/80">
            Hơn cả triết học, đây là một Hệ Điều Hành Chính được thiết kế để đồng bộ hóa năng lượng sinh học của con người với lưới tinh thần của Trái Đất (Long Mạch). Nó được hỗ trợ bởi Ký tự Nòng nọc.
          </p>
        </div>

        <div className="mt-8 space-y-2">
          <p className="text-xl font-ui text-text-secondary italic">
            "You don't care who I am! But you'll know what I will do for you!"
          </p>
          <p className="text-lg font-ui text-text-secondary italic">
            "Bạn không quan tâm tôi là ai! Nhưng bạn sẽ biết tôi có thể làm gì cho bạn!"
          </p>
        </div>

        <div className="gold-separator my-8" />

      </div>

      <div className="gold-separator my-8" />

      <div className="font-ui text-sm text-text-secondary">
        <h3 className="mb-3 font-display text-lg font-bold text-gold">LIÊN HỆ</h3>
        <p>Email: <a href="mailto:dienbatn@gmail.com" className="text-foreground gold-glow">dienbatn@gmail.com</a></p>
        <p>Điện thoại: 0942627277 – 0904392219</p>
      </div>
    </div>
  );
}
