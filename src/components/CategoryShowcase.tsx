import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

const categories = [
  { title: "Men", subtitle: "Tailored Essentials", image: "/category-men.jpg", path: "/category/men", count: "24 items" },
  { title: "Women", subtitle: "Effortless Elegance", image: "/category-women.jpg", path: "/category/women", count: "31 items" },
  { title: "Accessories", subtitle: "Finishing Touches", image: "/category-accessories.jpg", path: "/category/accessories", count: "12 items" },
];
const MotionLink = motion.create(Link);

function CategoryCard({ category, index }: { category: typeof categories[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <MotionLink
        to={category.path}
        className="group relative block overflow-hidden rounded-xl md:rounded-2xl"
        whileTap={{ scale: 0.98 }}
      >
        <div className="relative aspect-[2/3] sm:aspect-[3/5] overflow-hidden">
          <img
            src={category.image}
            alt={category.title}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out ${
              hovered ? "scale-[1.08]" : "scale-100"
            }`}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-foreground/5" />

          {/* Item count badge */}
          <div
            className={`absolute top-3 right-3 md:top-4 md:right-4 transition-all duration-300 ${
              hovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
            }`}
          >
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-background/80 text-[8px] md:text-[9px] font-sans font-medium uppercase tracking-[0.15em] text-foreground/70">
              {category.count}
            </span>
          </div>

          {/* Bottom content */}
          <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6">
            <p
              className={`text-[7px] md:text-[9px] font-sans font-medium uppercase tracking-[0.25em] text-background/40 mb-0.5 md:mb-1 transition-transform duration-400 ease-out ${
                hovered ? "-translate-y-1" : "translate-y-0"
              }`}
            >
              {category.subtitle}
            </p>
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base md:text-2xl text-background tracking-tight">
                {category.title}
              </h3>
              <div
                className={`flex items-center justify-center w-7 h-7 md:w-9 md:h-9 rounded-full border border-background/20 transition-all duration-300 ${
                  hovered ? "bg-gold-dark/30 scale-110" : "bg-background/10 scale-100"
                }`}
              >
                <ArrowRight
                  className={`w-3 h-3 md:w-4 md:h-4 text-background/80 transition-transform duration-300 ${
                    hovered ? "translate-x-0.5" : "translate-x-0"
                  }`}
                  strokeWidth={1.5}
                />
              </div>
            </div>

            {/* Reveal line on hover */}
            <div
              className={`mt-2 md:mt-3 h-[1px] bg-gradient-to-r from-gold/60 via-gold-light/40 to-transparent origin-left transition-transform duration-500 ease-out ${
                hovered ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </div>
        </div>
      </MotionLink>
    </motion.div>
  );
}

export function CategoryShowcase() {
  return (
    <section className="py-4 md:py-8">
      <div className="container">
        <motion.div
          className="text-center mb-10 md:mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[10px] md:text-[11px] font-sans font-medium uppercase tracking-[0.4em] text-muted-foreground mb-3">
            Explore
          </p>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif tracking-tight">Shop by Category</h2>
          <motion.div
            className="mt-4 mx-auto w-12 h-[1.5px] bg-gradient-to-r from-transparent via-gold to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-8">
          {categories.map((category, index) => (
            <CategoryCard key={category.title} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
