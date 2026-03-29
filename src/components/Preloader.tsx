import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 400);
          return 100;
        }
        const increment = p < 30 ? 8 : p < 70 ? 4 : p < 90 ? 5 : 10;
        return Math.min(p + increment, 100);
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center overflow-hidden"
          exit={{
            opacity: 0,
            scale: 1.02,
            filter: "blur(8px)",
            transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
          }}
        >
          {/* Decorative rotating rings */}
          <motion.div
            className="absolute w-[250px] h-[250px] md:w-[300px] md:h-[300px] rounded-full border border-border/15"
            animate={{ rotate: 360, scale: [1, 1.03, 1] }}
            transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity } }}
          />
          <motion.div
            className="absolute w-[170px] h-[170px] md:w-[200px] md:h-[200px] rounded-full border border-gold/8"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />

          {/* Brand name */}
          <motion.div
            className="flex items-center gap-0.5 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {"OLD MONEY".split("").map((char, i) => (
              <motion.span
                key={i}
                className="font-sans text-base md:text-lg font-medium uppercase tracking-[0.3em] text-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.div>

          {/* Progress bar */}
          <div className="w-40 md:w-56 h-[1.5px] bg-border/20 relative overflow-hidden rounded-full">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold via-gold-dark to-gold rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </div>

          {/* Counter */}
          <motion.p
            className="mt-3 text-[10px] font-sans uppercase tracking-[0.3em] text-muted-foreground/60 tabular-nums"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {progress}%
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
