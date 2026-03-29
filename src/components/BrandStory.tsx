import { motion } from "framer-motion";

const lines = [
  "We don't follow trends.",
  "We curate timeless pieces that transcend seasons.",
  "Each garment is chosen for its craftsmanship,",
  "its quiet confidence, its lasting elegance.",
];

export function BrandStory() {
  return (
    <section className="py-24 md:py-36 border-t border-border/20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]" style={{
        background: "radial-gradient(ellipse at 30% 50%, hsl(var(--gold)), transparent 60%)",
      }} />

      <div className="container max-w-4xl relative z-10">
        <motion.p
          className="text-[10px] md:text-[11px] font-sans font-medium uppercase tracking-[0.4em] text-muted-foreground mb-10 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Our Philosophy
        </motion.p>

        <div className="space-y-2 text-center">
          {lines.map((line, i) => (
            <motion.p
              key={i}
              className="font-serif text-xl md:text-3xl lg:text-4xl text-foreground/80 leading-[1.3] tracking-tight"
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              {line}
            </motion.p>
          ))}
        </div>

        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="w-16 h-[1.5px] bg-gradient-to-r from-transparent via-gold to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
