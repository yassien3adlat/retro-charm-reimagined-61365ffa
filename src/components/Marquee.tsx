const items = [
  "Free Shipping Over EGP 1,500", "✦", "Premium Quality Materials", "✦",
  "14-Day Easy Returns", "✦", "Handcrafted Details", "✦", "Exclusive Collections", "✦",
];

function MarqueeRow({ direction = "normal" }: { direction?: "normal" | "reverse" }) {
  const marqueeItems = [...items, ...items, ...items];

  return (
    <div className="flex gap-8 whitespace-nowrap overflow-hidden">
      <div
        className={`flex gap-8 shrink-0 ${direction === "normal" ? "animate-[marquee_30s_linear_infinite]" : "animate-[marquee_35s_linear_infinite_reverse]"}`}
      >
        {marqueeItems.map((item, i) => (
          <span
            key={i}
            className={`text-[10px] md:text-[11px] font-sans font-medium uppercase tracking-[0.25em] shrink-0 ${
              item === "✦" ? "text-gold" : "text-muted-foreground"
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Marquee() {
  return (
    <div className="relative overflow-hidden py-4 md:py-5 border-y border-border/30 bg-card/40">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      <div className="space-y-2.5">
        <MarqueeRow direction="normal" />
        <MarqueeRow direction="reverse" />
      </div>
    </div>
  );
}
