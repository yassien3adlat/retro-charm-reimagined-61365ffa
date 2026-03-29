import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 50, restDelta: 0.001 });

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-[100] origin-left"
        style={{
          scaleX,
          background: "linear-gradient(90deg, hsl(var(--gold)), hsl(var(--gold-dark)), hsl(var(--gold)))",
        }}
      />
      {/* Glow effect under progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[6px] z-[99] origin-left opacity-40 blur-[3px]"
        style={{
          scaleX,
          background: "linear-gradient(90deg, hsl(var(--gold)), hsl(var(--gold-dark)), hsl(var(--gold)))",
        }}
      />
    </>
  );
}
