export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-crimson-dark via-background to-background paper-grain">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 text-center md:py-24">
        {/* Decorative top element */}
        <div className="mx-auto mb-6 text-5xl text-gold/30">☰</div>

        <h1 className="font-display text-2xl font-black leading-tight text-foreground md:text-4xl lg:text-5xl uppercase">
          HONG BANG I CHING - MASTER OS
          <span className="mt-2 block text-gold text-xl md:text-2xl">THE DESTINY MANAGEMENT SYSTEM OF THE ANCIENT VIET</span>
        </h1>

        <div className="mt-4 text-gold/80 font-serif italic text-lg md:text-xl">
          鸿庞易 - 主操作系统：百越民族命运管理系统
        </div>

        <div className="gold-separator mx-auto my-6 max-w-sm" />

        <p className="mx-auto max-w-2xl font-body text-base leading-relaxed text-text-secondary md:text-lg">
          "You don't care who I am! But you'll know what I will do for you!"
          <br />
          <span className="text-sm italic opacity-80 mt-1 block">"Bạn không quan tâm tôi là ai! Nhưng bạn sẽ biết tôi có thể làm gì cho bạn!"</span>
        </p>

        {/* Decorative bottom trigram */}
        <div className="mt-8 text-3xl tracking-[0.5em] text-gold/15">
          ☷ ☶ ☳ ☴ ☵ ☲ ☱ ☰
        </div>
      </div>
    </section>
  );
}
