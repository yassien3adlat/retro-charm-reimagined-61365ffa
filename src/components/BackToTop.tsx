import { motion, AnimatePresence, useScroll, useMotionValueEvent, useTransform } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useState } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const progressDeg = useTransform(scrollYProgress, [0, 1], [0, 360]);

  useMotionValueEvent(scrollY, "change", (v) => setVisible(v > 600));

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center shadow-[0_8px_24px_-6px_hsl(var(--foreground)/0.3)] hover:shadow-[0_12px_36px_-8px_hsl(var(--foreground)/0.4)] transition-shadow duration-300"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
        >
          {/* Progress ring */}
          <motion.svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 48 48"
          >
            <circle cx="24" cy="24" r="22" fill="none" stroke="hsl(var(--gold))" strokeWidth="1.5" strokeDasharray="138.23" strokeDashoffset="138.23"
              style={{ strokeDashoffset: `calc(138.23 - (138.23 * var(--progress, 0)))` }}
              className="opacity-40"
            />
          </motion.svg>
          <ArrowUp className="w-4 h-4 relative z-10" strokeWidth={2} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
