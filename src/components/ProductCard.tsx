import { useState, forwardRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCartStore } from "@/stores/cartStore";
import { Loader2, ShoppingBag, Heart } from "lucide-react";
import { toast } from "sonner";
import type { ShopifyProduct } from "@/lib/shopify";

interface ProductCardProps {
  product: ShopifyProduct;
  index: number;
}

export const ProductCard = forwardRef<HTMLElement, ProductCardProps>(function ProductCard({ product, index }) {
  const addItem = useCartStore((state) => state.addItem);
  const isLoading = useCartStore((state) => state.isLoading);
  const [isAdding, setIsAdding] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const variant = product.node.variants.edges[0]?.node;
  const image = product.node.images.edges[0]?.node;
  const price = product.node.priceRange.minVariantPrice;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variant) return;
    setIsAdding(true);
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    setIsAdding(false);
    toast.success("Added to bag", {
      position: "top-center",
      style: { background: "hsl(225 25% 12%)", color: "hsl(36 30% 96%)", border: "none", fontSize: "12px", letterSpacing: "0.05em" },
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted(!wishlisted);
    toast(wishlisted ? "Removed from wishlist" : "Added to wishlist", {
      position: "top-center",
      style: { background: "hsl(225 25% 12%)", color: "hsl(36 30% 96%)", border: "none", fontSize: "12px", letterSpacing: "0.05em" },
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <Link
        to={`/product/${product.node.handle}`}
        className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-xl"
        aria-label={`View ${product.node.title} — ${price.currencyCode} ${parseFloat(price.amount).toLocaleString()}`}
      >
        <div className="relative flex h-[15rem] items-center justify-center md:h-[17rem] lg:h-[18rem]">
          {!imageLoaded && <div className="absolute inset-0 animate-shimmer rounded-xl" />}
          {image && (
            <>
              {/* Professional flash/glow effect */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Main radial glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full opacity-60"
                  style={{ background: "radial-gradient(circle, hsl(var(--gold-light) / 0.35) 0%, hsl(var(--gold) / 0.12) 35%, transparent 70%)" }} />
                {/* Horizontal lens flare */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[8%] opacity-30"
                  style={{ background: "linear-gradient(90deg, transparent 0%, hsl(var(--gold-light) / 0.5) 20%, hsl(var(--background) / 0.8) 50%, hsl(var(--gold-light) / 0.5) 80%, transparent 100%)", filter: "blur(8px)" }} />
                {/* Soft outer ring */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full opacity-20"
                  style={{ background: "radial-gradient(circle, transparent 40%, hsl(var(--gold) / 0.15) 60%, transparent 75%)" }} />
                {/* Bottom reflection */}
                <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[50%] h-[6%] opacity-25"
                  style={{ background: "radial-gradient(ellipse, hsl(var(--gold-light) / 0.4), transparent 70%)", filter: "blur(6px)" }} />
              </div>
              <motion.img
                src={image.url}
                alt={image.altText || product.node.title}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                style={{ mixBlendMode: "multiply" }}
                className={`relative z-10 h-[85%] w-[85%] object-contain transition-all duration-700 ease-out group-hover:scale-[1.08] group-hover:-translate-y-1 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
              />
            </>
          )}

          <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
            <motion.button
              onClick={handleWishlist}
              whileTap={{ scale: 0.8 }}
              className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm border transition-all duration-300 opacity-0 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 md:h-9 md:w-9 ${
                wishlisted ? "bg-red-500/10 border-red-500/30 text-red-500" : "bg-background/80 border-border/50 text-muted-foreground hover:text-foreground hover:border-foreground/20"
              }`}
              aria-label={wishlisted ? `Remove ${product.node.title} from wishlist` : `Add ${product.node.title} to wishlist`}
            >
              <Heart className="h-3.5 w-3.5" strokeWidth={2} fill={wishlisted ? "currentColor" : "none"} />
            </motion.button>
          </div>

          {variant?.availableForSale && index % 2 === 0 && (
            <div className="absolute top-3 left-3 z-20">
              <span className="inline-flex items-center rounded-full bg-destructive px-2.5 py-1 font-sans text-[9px] font-medium uppercase tracking-[0.15em] text-destructive-foreground">Sale</span>
            </div>
          )}

          {!variant?.availableForSale && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-[2px] rounded-xl">
              <span className="rounded-full bg-background/90 px-4 py-1.5 font-sans text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">Sold Out</span>
            </div>
          )}

          {variant?.availableForSale && (
            <motion.button
              onClick={handleAddToCart}
              disabled={isLoading || isAdding}
              whileTap={{ scale: 0.9 }}
              className="absolute bottom-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background opacity-0 translate-y-2 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-110 disabled:opacity-50 md:h-10 md:w-10 shadow-lg"
              aria-label={`Add ${product.node.title} to bag`}
            >
              {isAdding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShoppingBag className="h-3.5 w-3.5" strokeWidth={2} />}
            </motion.button>
          )}
        </div>

        <div className="mt-3 md:mt-4">
          <h3 className="font-serif text-sm leading-snug tracking-tight text-foreground transition-colors duration-300 group-hover:text-gold-dark md:text-base">
            {product.node.title}
          </h3>
          <div className="flex items-center justify-between mt-1">
            <p className="font-sans text-[10px] font-medium tracking-widest text-muted-foreground md:text-xs">
              {price.currencyCode} {parseFloat(price.amount).toLocaleString()}
            </p>
            {variant?.availableForSale && (
              <span className="text-[8px] font-sans uppercase tracking-[0.15em] text-green-600/70 font-medium">In Stock</span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
});
