import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { storefrontApiRequest, PRODUCTS_QUERY, type ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "./ProductCard";
import { StaticProductCard } from "./StaticProductCard";
import { staticProducts } from "@/data/staticProducts";
import { LayoutGrid, List } from "lucide-react";

const PRODUCTS_PER_PAGE = 6;

export function ProductGrid() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);
  const [filter, setFilter] = useState<"all" | "available" | "new">("all");
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");

  useEffect(() => {
    async function load() {
      try {
        const data = await storefrontApiRequest(PRODUCTS_QUERY, { first: 20 });
        if (data?.data?.products?.edges) {
          setProducts(data.data.products.edges);
        }
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredProducts = products.filter((p) => {
    if (filter === "available") return p.node.variants.edges[0]?.node?.availableForSale;
    return true;
  });

  const getStaticFiltered = () => {
    let filtered = staticProducts;
    if (filter === "new") filtered = staticProducts.filter(p => p.isNew);
    if (filter === "available") filtered = staticProducts.filter(p => p.inStock);

    if (sortBy === "price-asc") return [...filtered].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") return [...filtered].sort((a, b) => b.price - a.price);
    return filtered;
  };

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;
  const staticFiltered = getStaticFiltered();

  if (loading) {
    return (
      <section id="collection" className="py-20 md:py-32">
        <div className="container">
          <div className="text-center mb-14 md:mb-20">
            <div className="h-3 w-28 mx-auto rounded-full animate-shimmer mb-5" />
            <div className="h-10 w-64 mx-auto rounded-full animate-shimmer mb-3" />
            <div className="h-[1.5px] w-16 mx-auto animate-shimmer" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div key={i} className="flex flex-col items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
                <div className="w-full aspect-[3/4] rounded-xl animate-shimmer" />
                <div className="mt-4 h-4 rounded-full animate-shimmer w-3/4" />
                <div className="mt-2 h-3 rounded-full animate-shimmer w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0 && staticProducts.length === 0) {
    return (
      <section id="collection" className="container py-24 text-center">
        <p className="text-muted-foreground font-sans text-sm">No products found</p>
      </section>
    );
  }

  return (
    <section id="collection" className="py-20 md:py-32 overflow-hidden">
      <div className="container">
        {/* Section header */}
        <motion.div
          className="text-center mb-10 md:mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[10px] md:text-[11px] font-sans font-medium uppercase tracking-[0.35em] text-muted-foreground mb-4">
            Curated Selection
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif tracking-tight">The Collection</h2>
          <motion.div
            className="mt-5 mx-auto w-16 h-[1.5px] bg-gradient-to-r from-transparent via-gold to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          />
        </motion.div>

        {/* Filter + Sort bar */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 md:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Filters */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-secondary/60 border border-border/30">
            {([
              { key: "all" as const, label: "All" },
              { key: "available" as const, label: "In Stock" },
              { key: "new" as const, label: "New In" },
            ]).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { setFilter(key); setVisibleCount(PRODUCTS_PER_PAGE); }}
                className={`relative px-4 py-2 text-[10px] md:text-[11px] font-sans font-medium uppercase tracking-[0.15em] rounded-full transition-all duration-300 ${
                  filter === key ? "text-background" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {filter === key && (
                  <motion.div className="absolute inset-0 bg-foreground rounded-full" layoutId="activeFilter" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                )}
                <span className="relative z-10">{label}</span>
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="text-[10px] md:text-[11px] font-sans font-medium uppercase tracking-[0.12em] text-muted-foreground bg-transparent border border-border/30 rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gold/30 cursor-pointer"
              aria-label="Sort products"
            >
              <option value="default">Featured</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>
        </motion.div>

        {/* Product grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${filter}-${sortBy}`}
            className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-8 md:gap-x-6 md:gap-y-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {displayedProducts.map((product, i) => (
              <ProductCard key={product.node.id} product={product} index={i} />
            ))}
            {staticFiltered.map((product, i) => (
              <StaticProductCard key={product.id} product={product} index={displayedProducts.length + i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Load more */}
        {hasMore && (
          <motion.div className="text-center mt-14" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <motion.button
              onClick={() => setVisibleCount((prev) => prev + PRODUCTS_PER_PAGE)}
              className="inline-flex items-center gap-2 h-12 px-8 border border-foreground/15 rounded-full text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-sans font-medium text-foreground hover:border-foreground/40 hover:bg-foreground/5 transition-all duration-400"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              Load More
              <span className="text-muted-foreground text-[9px]">({filteredProducts.length - visibleCount} remaining)</span>
            </motion.button>
          </motion.div>
        )}

        {/* Count */}
        <motion.p
          className="text-center mt-5 text-[10px] font-sans text-muted-foreground/50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Showing {displayedProducts.length + staticFiltered.length} of {filteredProducts.length + staticProducts.length} products
        </motion.p>
      </div>
    </section>
  );
}
