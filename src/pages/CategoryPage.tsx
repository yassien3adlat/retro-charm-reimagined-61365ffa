import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { StoreHeader } from "@/components/StoreHeader";
import { StoreFooter } from "@/components/StoreFooter";
import { StaticProductCard } from "@/components/StaticProductCard";
import { getProductsByCategory, getNewProducts, staticProducts, type Category } from "@/data/staticProducts";

const categoryMeta: Record<string, { title: string; subtitle: string; description: string }> = {
  men: {
    title: "Men",
    subtitle: "Tailored Essentials",
    description: "Refined pieces for the modern gentleman. From classic sneakers to timeless outerwear.",
  },
  women: {
    title: "Women",
    subtitle: "Effortless Elegance",
    description: "Curated knitwear and essentials designed for understated sophistication.",
  },
  accessories: {
    title: "Accessories",
    subtitle: "Finishing Touches",
    description: "The details that complete the look. Belts, bags, and more coming soon.",
  },
  "new-in": {
    title: "New In",
    subtitle: "Just Arrived",
    description: "The latest additions to our curated collection.",
  },
};

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const meta = categoryMeta[category || ""];

  const products = category === "new-in"
    ? getNewProducts()
    : getProductsByCategory(category as Category);

  if (!meta) {
    return (
      <div className="min-h-screen bg-background">
        <StoreHeader />
        <div className="container pt-32 pb-32 text-center">
          <p className="font-sans text-muted-foreground">Category not found</p>
          <Link to="/" className="mt-4 inline-block font-sans text-sm underline">Back to shop</Link>
        </div>
        <StoreFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      <motion.div
        className="container pt-24 md:pt-28 pb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-1.5 font-sans text-[11px] uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" /> Back to home
          </Link>
        </motion.div>

        {/* Category Header */}
        <motion.div
          className="text-center mb-12 md:mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[10px] md:text-[11px] font-sans font-medium uppercase tracking-[0.35em] text-muted-foreground mb-5">
            {meta.subtitle}
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif tracking-tight">{meta.title}</h1>
          <div className="mt-6 mx-auto w-16 h-[1.5px] bg-gradient-to-r from-transparent via-gold to-transparent" />
          <p className="mt-6 font-sans text-sm text-muted-foreground max-w-md mx-auto">{meta.description}</p>
        </motion.div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-8 md:gap-x-6 md:gap-y-12">
            {products.map((product, i) => (
              <StaticProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="font-serif text-2xl text-foreground/60 mb-3">Coming Soon</p>
            <p className="font-sans text-sm text-muted-foreground">
              We're curating the perfect pieces for this collection. Stay tuned.
            </p>
          </motion.div>
        )}

        <motion.p
          className="text-center mt-8 text-[10px] font-sans text-muted-foreground/50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {products.length} {products.length === 1 ? "product" : "products"}
        </motion.p>
      </motion.div>

      <StoreFooter />
    </div>
  );
}
