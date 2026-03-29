import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import type { StaticProduct } from "@/data/staticProducts";

interface StaticProductCardProps {
  product: StaticProduct;
  index: number;
}

export function StaticProductCard({ product, index }: StaticProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [addedToBag, setAddedToBag] = useState(false);
  const addStaticItem = useCartStore((s) => s.addStaticItem);
  const { toggle: toggleWishlist, has: hasWishlist } = useWishlistStore();
  const wishlisted = hasWishlist(product.id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    toast(wishlisted ? "Removed from wishlist" : "Added to wishlist", {
      position: "top-center",
      style: { background: "hsl(225 25% 12%)", color: "hsl(36 30% 96%)", border: "none", fontSize: "12px", letterSpacing: "0.05em" },
    });
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addStaticItem(product, "M", 1);
    setAddedToBag(true);
    toast.success("Added to bag", {
      position: "top-center",
      style: { background: "hsl(225 25% 12%)", color: "hsl(36 30% 96%)", border: "none", fontSize: "12px", letterSpacing: "0.05em" },
    });
    setTimeout(() => setAddedToBag(false), 2000);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        to={`/product/static/${product.handle}`}
        className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-xl"
        aria-label={`View ${product.title} — ${product.currency} ${product.price.toLocaleString()}`}
      >
        <div className="relative flex h-[15rem] items-center justify-center md:h-[17rem] lg:h-[18rem]">
          {!imageLoaded && <div className="absolute inset-0 skeleton-gold rounded-xl" />}

          <div
            className={`absolute inset-[10%] rounded-full transition-all duration-700 ease-out pointer-events-none ${
              hovered ? "opacity-100 scale-110" : "opacity-60 scale-100"
            }`}
            style={{
              background: "radial-gradient(circle, hsl(40 55% 85% / 0.7) 0%, hsl(40 55% 75% / 0.4) 30%, hsl(40 45% 65% / 0.15) 60%, transparent 80%)",
              filter: hovered ? "blur(40px)" : "blur(25px)",
            }}
          />

          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`relative z-10 h-[85%] w-[85%] object-contain transition-all duration-500 ease-out ${
              imageLoaded ? "opacity-100" : "opacity-0"
            } ${hovered ? "scale-[1.06] -translate-y-2" : "scale-100 translate-y-0"}`}
            style={{
              filter: hovered
                ? "drop-shadow(0 0 18px rgba(255,248,225,0.95)) drop-shadow(0 0 60px rgba(255,245,215,0.7)) drop-shadow(0 0 150px rgba(255,240,200,0.5))"
                : "drop-shadow(0 0 10px rgba(255,248,225,0.6)) drop-shadow(0 0 30px rgba(255,245,215,0.35)) drop-shadow(0 0 90px rgba(255,240,200,0.25))",
            }}
          />

          <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
            <button
              onClick={handleWishlist}
              className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 md:h-9 md:w-9 shadow-sm ${
                hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              } ${
                wishlisted ? "bg-red-500/10 border-red-500/30 text-red-500" : "bg-background/80 border-border/50 text-muted-foreground hover:text-foreground hover:border-foreground/20"
              }`}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className="h-3.5 w-3.5" strokeWidth={2} fill={wishlisted ? "currentColor" : "none"} />
            </button>

            <button
              onClick={handleQuickAdd}
              className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 md:h-9 md:w-9 shadow-sm ${
                hovered ? "opacity-100 translate-y-0 delay-[50ms]" : "opacity-0 translate-y-2"
              } ${
                addedToBag ? "bg-green-500/10 border-green-500/30 text-green-600" : "bg-background/80 border-border/50 text-muted-foreground hover:text-foreground hover:border-foreground/20"
              }`}
              aria-label="Quick add to bag"
            >
              {addedToBag ? <Check className="h-3.5 w-3.5" strokeWidth={2} /> : <ShoppingBag className="h-3.5 w-3.5" strokeWidth={2} />}
            </button>
          </div>

          {product.isNew && (
            <div className="absolute top-3 left-3 z-20">
              <span className="inline-flex items-center gap-1 rounded-full bg-foreground/90 px-2.5 py-1 font-sans text-[8px] md:text-[9px] font-medium uppercase tracking-[0.15em] text-background shadow-md">
                <span className="w-1 h-1 rounded-full bg-gold animate-pulse-gold" />
                New
              </span>
            </div>
          )}

          {!product.inStock && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/75 rounded-xl">
              <span className="rounded-full bg-background/90 px-5 py-2 font-sans text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground shadow-sm">
                Sold Out
              </span>
            </div>
          )}
        </div>

        <div className="mt-3 md:mt-4 px-1">
          <h3 className={`font-serif text-sm leading-snug tracking-tight md:text-base transition-colors duration-300 ${hovered ? "text-gold-dark" : "text-foreground"}`}>
            {product.title}
          </h3>
          <div className="flex items-center justify-between mt-1.5">
            <p className="font-sans text-[10px] font-medium tracking-widest text-muted-foreground md:text-xs">
              {product.currency} {product.price.toLocaleString()}
            </p>
            {product.inStock && (
              <span className={`flex items-center gap-1 text-[8px] font-sans uppercase tracking-[0.15em] text-green-600/70 font-medium transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-70"}`}>
                <span className="w-1 h-1 rounded-full bg-green-500/60" />
                In Stock
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
