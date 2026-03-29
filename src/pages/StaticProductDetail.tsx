import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronDown, Heart, Minus, Plus, Ruler } from "lucide-react";
import { StoreHeader } from "@/components/StoreHeader";
import { SizeChartModal } from "@/components/SizeChartModal";
import { StoreFooter } from "@/components/StoreFooter";
import { getProductByHandle } from "@/data/staticProducts";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { toast } from "sonner";

export default function StaticProductDetail() {
  const { handle } = useParams<{ handle: string }>();
  const product = getProductByHandle(handle || "");
  const [quantity, setQuantity] = useState(1);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("M");
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const addStaticItem = useCartStore((s) => s.addStaticItem);
  const { toggle: toggleWishlist, has: hasWishlist } = useWishlistStore();

  const liked = product ? hasWishlist(product.id) : false;

  useEffect(() => { window.scrollTo(0, 0); }, [handle]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <StoreHeader />
        <div className="container pt-32 pb-32 text-center">
          <p className="font-sans text-muted-foreground">Product not found</p>
          <Link to="/" className="mt-4 inline-block font-sans text-sm underline">Back to shop</Link>
        </div>
      </div>
    );
  }

  const sizes = product.category === "men" && product.tags.includes("sneakers")
    ? ["39", "40", "41", "42", "43", "44", "45"]
    : ["XS", "S", "M", "L", "XL"];

  const handleAddToCart = () => {
    addStaticItem(product, selectedSize, quantity);
    toast.success(`${quantity} item${quantity > 1 ? "s" : ""} added to bag`, {
      position: "top-center",
      style: { background: "hsl(225 25% 12%)", color: "hsl(36 30% 96%)", border: "none", fontSize: "12px", letterSpacing: "0.05em" },
    });
  };

  const categoryPath = product.category === "men" ? "/category/men" : "/category/women";

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      <motion.div className="container pt-24 md:pt-28 pb-8 md:pb-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <Link to={categoryPath} className="mb-8 inline-flex items-center gap-1.5 font-sans text-[11px] uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-3 w-3" /> Back to {product.category}
          </Link>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 md:gap-16 lg:gap-20">
          {/* Image */}
          <motion.div className="space-y-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <div className="relative overflow-hidden rounded-lg">
              <div className="relative aspect-square flex items-center justify-center p-8">
                {/* Flash effect */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] rounded-full opacity-80"
                    style={{ background: "radial-gradient(circle, hsl(var(--gold-light) / 0.55) 0%, hsl(var(--gold) / 0.25) 30%, transparent 65%)" }} />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[12%] opacity-40"
                    style={{ background: "linear-gradient(90deg, transparent 0%, hsl(var(--gold-light) / 0.7) 15%, hsl(var(--background) / 0.9) 50%, hsl(var(--gold-light) / 0.7) 85%, transparent 100%)", filter: "blur(14px)" }} />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] h-[95%] rounded-full opacity-35"
                    style={{ background: "radial-gradient(circle, transparent 30%, hsl(var(--gold) / 0.25) 55%, transparent 70%)" }} />
                  <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[60%] h-[8%] opacity-40"
                    style={{ background: "radial-gradient(ellipse, hsl(var(--gold-light) / 0.6), transparent 65%)", filter: "blur(12px)" }} />
                </div>
                <img src={product.image} alt={product.title} className="max-h-full max-w-full object-contain" style={{ mixBlendMode: "multiply" }} />
              </div>

              <motion.button
                onClick={() => toggleWishlist(product.id)}
                whileTap={{ scale: 0.85 }}
                className="absolute top-4 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-background/60 backdrop-blur-sm transition-colors hover:bg-background/80"
                aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`h-4 w-4 transition-all duration-300 ${liked ? "fill-destructive text-destructive scale-110" : "text-muted-foreground"}`} />
              </motion.button>
            </div>
          </motion.div>

          {/* Details */}
          <motion.div className="flex flex-col" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}>
            <p className="mb-3 font-sans text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground md:text-[11px]">OLD MONEY Collection</p>
            <h1 className="font-serif text-3xl leading-[1.05] md:text-4xl lg:text-5xl">{product.title}</h1>
            <motion.p className="mt-4 font-sans text-lg font-light text-foreground/80 md:text-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              {product.currency} {product.price.toLocaleString()}
            </motion.p>
            <div className="my-6 h-[1px] bg-gradient-to-r from-border via-gold-light/40 to-border" />

            <p className="font-sans text-sm font-light leading-relaxed text-muted-foreground">{product.description}</p>

            {/* Size selector */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <p className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-foreground">
                  Size <span className="ml-2 text-muted-foreground">— {selectedSize}</span>
                </p>
                <button
                  onClick={() => setSizeChartOpen(true)}
                  className="flex items-center gap-1 font-sans text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Ruler className="h-3 w-3" /> Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <motion.button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    whileTap={{ scale: 0.95 }}
                    className={`h-10 min-w-[2.75rem] rounded-sm border px-4 font-sans text-[11px] uppercase tracking-[0.1em] transition-all duration-300 ${
                      selectedSize === size
                        ? "border-foreground bg-foreground text-background shadow-[0_2px_10px_-2px_hsl(var(--foreground)/0.3)]"
                        : "border-border text-foreground/70 hover:border-foreground/50 hover:text-foreground"
                    }`}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-6">
              <p className="mb-3 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-foreground">Quantity</p>
              <div className="inline-flex items-center rounded-sm border border-border">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground" aria-label="Decrease quantity">
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-10 text-center font-sans text-sm font-medium">{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)} className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground" aria-label="Increase quantity">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Add to cart */}
            <motion.button
              onClick={handleAddToCart}
              whileTap={{ scale: 0.98 }}
              className="relative mt-8 h-13 w-full overflow-hidden font-sans text-[11px] font-medium uppercase tracking-[0.2em] bg-foreground text-background hover:shadow-[0_8px_30px_-8px_hsl(var(--foreground)/0.5)] transition-all duration-500"
            >
              Add to Bag — {product.currency} {(product.price * quantity).toLocaleString()}
            </motion.button>

            {/* Shipping details */}
            <div className="mt-8 border-t border-border">
              <button onClick={() => setDetailsOpen((o) => !o)} className="flex w-full items-center justify-between py-4 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-foreground transition-colors hover:text-foreground/80">
                Shipping & Details
                <motion.div animate={{ rotate: detailsOpen ? 180 : 0 }} transition={{ duration: 0.3 }}><ChevronDown className="h-3.5 w-3.5" /></motion.div>
              </button>
              <AnimatePresence>
                {detailsOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-hidden">
                    <div className="space-y-2.5 pb-4 font-sans text-[11px] leading-relaxed text-muted-foreground">
                      <p>✦ Delivery in 2–5 working days</p>
                      <p>✦ Free shipping on orders over EGP 5,000</p>
                      <p>✦ Complimentary gift wrapping available</p>
                      <p>✦ Easy returns within 14 days</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Mobile sticky button */}
      <div className="glass fixed bottom-14 left-0 right-0 z-40 border-t border-border/50 p-3 md:hidden">
        <motion.button
          onClick={handleAddToCart}
          whileTap={{ scale: 0.98 }}
          className="h-12 w-full font-sans text-[11px] font-medium uppercase tracking-[0.15em] bg-foreground text-background transition-all duration-500"
        >
          Add to Bag — {product.currency} {(product.price * quantity).toLocaleString()}
        </motion.button>
      </div>

      <div className="hidden md:block"><StoreFooter /></div>
      <div className="pb-32 md:hidden"><StoreFooter /></div>

      <SizeChartModal
        open={sizeChartOpen}
        onOpenChange={setSizeChartOpen}
        productCategory={product.category === "men" && product.tags.includes("sneakers") ? "sneakers" : "clothing"}
        onSizeSelect={setSelectedSize}
      />
    </div>
  );
}
