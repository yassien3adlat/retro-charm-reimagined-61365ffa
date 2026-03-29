import { StoreHeader } from "@/components/StoreHeader";
import { HeroSection } from "@/components/HeroSection";
import { CategoryShowcase } from "@/components/CategoryShowcase";
import { ProductGrid } from "@/components/ProductGrid";
import { StoreFooter } from "@/components/StoreFooter";
import { BackToTop } from "@/components/BackToTop";
import { PageTransition } from "@/components/PageTransition";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Preloader } from "@/components/Preloader";
import { Marquee } from "@/components/Marquee";
import { FeaturesStrip } from "@/components/FeaturesStrip";
import { BrandStory } from "@/components/BrandStory";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

function QuoteSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section ref={ref} className="py-24 md:py-36 border-t border-border/20 relative overflow-hidden">
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-[0.025] pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(var(--gold)), transparent 65%)",
          y: bgY,
        }}
      />

      <div className="container max-w-3xl text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="w-14 h-[1.5px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-10"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          />
          <blockquote className="font-serif text-xl md:text-3xl lg:text-5xl italic leading-[1.25] text-foreground/75 tracking-tight">
            Elegance is not about being noticed, it's about being remembered.
          </blockquote>
          <motion.div
            className="mt-8 flex items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className="w-6 h-[1px] bg-gold/40" />
            <p className="text-[11px] font-sans font-medium uppercase tracking-[0.3em] text-muted-foreground">
              Giorgio Armani
            </p>
            <div className="w-6 h-[1px] bg-gold/40" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

const Index = () => {
  return (
    <>
      <Preloader />
      <PageTransition>
        <div className="min-h-screen bg-background pb-14 md:pb-0">
          <ScrollProgress />
          <StoreHeader />
          <HeroSection />
          <Marquee />
          <CategoryShowcase />
          <FeaturesStrip />
          <ProductGrid />
          <BrandStory />
          <QuoteSection />
          <StoreFooter />
          <BackToTop />
        </div>
      </PageTransition>
    </>
  );
};

export default Index;
