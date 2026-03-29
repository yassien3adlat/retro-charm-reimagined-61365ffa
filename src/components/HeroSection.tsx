import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.png";
import heroImageMobile from "@/assets/hero-image-mobile.jpg";
import { useIsMobile } from "@/hooks/use-mobile";

function MagneticButton({ children, className, to }: { children: React.ReactNode; className?: string; to: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouse = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.15);
    y.set((e.clientY - cy) * 0.15);
  };

  const reset = () => { x.set(0); y.set(0); };
  const MotionLink = motion.create(Link);

  return (
    <MotionLink
      ref={ref}
      to={to}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </MotionLink>
  );
}


export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.4], [0, 100]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [0.35, 0.85]);
  const badgeX = useTransform(scrollYProgress, [0, 0.5], [0, -60]);

  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const lineReveal = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const, delay: 0.5 },
    },
  };

  return (
    <section ref={ref} className="relative h-screen overflow-hidden">
      {/* Parallax background image — no mouse tracking, just scroll parallax */}
      <motion.div className="absolute inset-0" style={{ y: imageY, scale: imageScale }}>
        <img
          src={isMobile ? heroImageMobile : heroImage}
          alt="OLD MONEY Collection — Luxury fashion for men and women"
          className="h-full w-full object-cover object-[65%_center] sm:object-center"
          sizes="100vw"
        />
      </motion.div>

      {/* Overlays */}
      <motion.div className="absolute inset-0 bg-foreground/40" style={{ opacity: overlayOpacity }} />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/60 to-transparent" />

      {/* Side decorative lines */}
      <motion.div
        className="absolute left-6 md:left-10 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-gold/15 to-transparent hidden md:block"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 1.5, duration: 1.5 }}
      />
      <motion.div
        className="absolute right-6 md:right-10 top-1/3 bottom-1/3 w-px bg-gradient-to-b from-transparent via-gold/10 to-transparent hidden md:block"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 1.8, duration: 1.5 }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 container flex h-full flex-col items-center justify-center text-center"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <motion.div className="max-w-2xl" variants={stagger} initial="hidden" animate="visible">
          {/* Subtitle with lines */}
          <motion.div className="flex items-center justify-center gap-3 mb-4 md:mb-6" variants={fadeUp}>
            <motion.div className="w-8 md:w-14 h-px bg-gold origin-left" variants={lineReveal} />
            <p className="text-[9px] md:text-[11px] font-sans font-medium uppercase tracking-[0.4em] text-foreground/55">
              Dress With Class For Less
            </p>
            <motion.div className="w-8 md:w-14 h-px bg-gold origin-right" variants={lineReveal} />
          </motion.div>

          {/* Main heading */}
          <motion.h1
            className="text-[2.2rem] md:text-[4rem] lg:text-[5.5rem] font-serif leading-[0.88] tracking-tight text-foreground"
            variants={fadeUp}
          >
            <motion.span className="inline-block overflow-hidden">
              50% Off
            </motion.span>
            <br />
            <motion.span
              className="inline-block italic text-foreground/65"
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: {
                  opacity: 1, x: 0,
                  transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] as const, delay: 0.1 },
                },
              }}
            >
              Sitewide
            </motion.span>
          </motion.h1>

          {/* Season badge — no backdrop-blur */}
          <motion.div className="mt-4 md:mt-6" variants={fadeUp} style={{ x: badgeX }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-foreground/10 bg-background/30">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse-gold" />
              <span className="text-[10px] md:text-xs font-sans text-foreground/50 tracking-wide">
                Spring/Summer 2026
              </span>
            </span>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div className="mt-10 md:mt-14 flex items-center justify-center gap-4" variants={fadeUp}>
            <MagneticButton
              to="/category/men"
              className="group inline-flex items-center gap-2.5 h-13 md:h-[3.75rem] px-9 md:px-12 bg-foreground text-background text-[10px] md:text-[11px] uppercase tracking-[0.22em] font-sans font-medium rounded-full hover:bg-gold-dark transition-all duration-600 relative overflow-hidden shadow-[0_10px_40px_-8px_hsl(var(--foreground)/0.45)]"
            >
              <span className="relative z-10">Shop Men</span>
              <span className="relative z-10 inline-block text-xs">→</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-gold-dark to-gold"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            </MagneticButton>

            <MagneticButton
              to="/category/women"
              className="group inline-flex items-center gap-2 h-13 md:h-[3.75rem] px-8 md:px-10 text-foreground/80 text-[10px] md:text-[11px] uppercase tracking-[0.22em] font-sans font-medium border border-gold/25 rounded-full hover:border-gold/60 hover:text-foreground transition-all duration-500 relative overflow-hidden"
            >
              <span className="relative z-10">Shop Women</span>
              <motion.div
                className="absolute inset-0 bg-gold/[0.07]"
                initial={{ y: "100%" }}
                whileHover={{ y: "0%" }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            </MagneticButton>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom edge vignette */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.5, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      />
    </section>
  );
}
