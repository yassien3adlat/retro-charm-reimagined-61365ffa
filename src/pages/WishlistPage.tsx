import { StoreHeader } from "@/components/StoreHeader";
import { StoreFooter } from "@/components/StoreFooter";
import { useWishlistStore } from "@/stores/wishlistStore";
import { staticProducts } from "@/data/staticProducts";
import { StaticProductCard } from "@/components/StaticProductCard";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";

export default function WishlistPage() {
  const { ids, clear } = useWishlistStore();
  const products = staticProducts.filter((p) => ids.includes(p.id));

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <StoreHeader />
        <div className="container pt-24 md:pt-28 pb-16">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[10px] md:text-[11px] font-sans font-medium uppercase tracking-[0.4em] text-muted-foreground mb-3">
              Your Collection
            </p>
            <h1 className="text-3xl md:text-5xl font-serif tracking-tight">Wishlist</h1>
            <motion.div
              className="mt-4 mx-auto w-12 h-[1.5px] bg-gradient-to-r from-transparent via-gold to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </motion.div>

          {products.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <p className="text-foreground font-sans">Your wishlist is empty</p>
              <p className="text-sm text-muted-foreground mt-1 font-sans">Save items you love for later</p>
              <Link
                to="/"
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background text-[11px] font-sans font-medium uppercase tracking-[0.15em] hover:bg-foreground/85 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <p className="text-xs text-muted-foreground font-sans">{products.length} {products.length === 1 ? 'item' : 'items'}</p>
                <button
                  onClick={clear}
                  className="text-[10px] font-sans uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear All
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product, i) => (
                  <StaticProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
        <StoreFooter />
      </div>
    </PageTransition>
  );
}
