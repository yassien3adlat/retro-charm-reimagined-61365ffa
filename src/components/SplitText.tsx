import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface SplitTextProps {
  children: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  splitBy?: "char" | "word";
}

export function SplitText({ children, className = "", delay = 0, as: Tag = "span", splitBy = "char" }: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const units = splitBy === "char" ? children.split("") : children.split(" ");

  return (
    <Tag ref={ref as React.RefObject<never>} className={`inline-block ${className}`} aria-label={children}>
      {units.map((unit, i) => (
        <span key={i} className="inline-block overflow-hidden" aria-hidden="true">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", rotate: 8 }}
            animate={isInView ? { y: "0%", rotate: 0 } : { y: "110%", rotate: 8 }}
            transition={{ duration: 0.7, delay: delay + i * (splitBy === "char" ? 0.025 : 0.06), ease: [0.16, 1, 0.3, 1] }}
          >
            {unit === " " ? "\u00A0" : unit}
            {splitBy === "word" && i < units.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
