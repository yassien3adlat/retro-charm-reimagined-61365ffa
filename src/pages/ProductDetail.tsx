import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { storefrontApiRequest, PRODUCT_BY_HANDLE_QUERY } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { StoreHeader } from "@/components/StoreHeader";
import { StoreFooter } from "@/components/StoreFooter";
import { SizeChartModal } from "@/components/SizeChartModal";
import { Loader2, ArrowLeft, Check, Minus, Plus, ChevronDown, Heart, Ruler } from "lucide-react";
import { toast } from "sonner";

interface ProductNode {
  id: string;
  title: string;
  description: string;
  handle: string;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  images: { edges: Array<{ node: { url: string; altText: string | null } }> };
  variants: { edges: Array<{ node: { id: string; title: string; price: { amount: string; currencyCode: string }; availableForSale: boolean; selectedOptions: Array<{ name: string; value: string }> } }> };
  options: Array<{ name: string; values: string[] }>;
}

export default function ProductDetail() {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ProductNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const isCartLoading = useCartStore((s) => s.isLoading);

  useEffect(() => { window.scrollTo(0, 0); }, [handle]);

  useEffect(() => {
    async function load() {
      try {
        const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
        if (data?.data?.product) {
          setProduct(data.data.product);
          const firstAvailable = data.data.product.variants.edges.find(
            (v: { node: { availableForSale: boolean } }) => v.node.availableForSale,
          );
          if (firstAvailable) setSelectedVariant(firstAvailable.node.id);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, [handle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <StoreHeader />
        <div className="container pt-24 md:pt-28 pb-12">
          <div className="grid gap-8 md:grid-cols-2 md:gap-16">
            <div className="aspect-square animate-shimmer rounded-xl" />
            <div className="space-y-6 py-8">
              <div className="h-3 w-24 animate-shimmer rounded-full" />
              <div className="h-10 w-3/4 animate-shimmer rounded-full" />
              <div className="h-6 w-32 animate-shimmer rounded-full" />
              <div className="mt-8 h-20 w-full animate-shimmer rounded-lg" />
              <div className="mt-6 h-14 w-full animate-shimmer rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

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

  const currentVariant = product.variants.edges.find((v) => v.node.id === selectedVariant)?.node;
  const images = product.images.edges;

  const handleAddToCart = async () => {
    if (!currentVariant) return;
    setIsAdding(true);
    await addItem({
      product: { node: product },
      variantId: currentVariant.id,
      variantTitle: currentVariant.title,
      price: currentVariant.price,
      quantity,
      selectedOptions: currentVariant.selectedOptions,
    });
    setIsAdding(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
    toast.success(`${quantity} item${quantity > 1 ? "s" : ""} added to bag`, {
      position: "top-center",
      style: { background: "hsl(225 25% 12%)", color: "hsl(36 30% 96%)", border: "none", fontSize: "12px", letterSpacing: "0.05em" },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      <motion.div className="container pt-24 md:pt-28 pb-8 md:pb-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <Link to="/" className="mb-8 inline-flex items-center gap-1.5 font-sans text-[11px] uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-3 w-3" /> Back to collection
          </Link>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 md:gap-16 lg:gap-20">
          <motion.div className="space-y-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <div className="relative overflow-hidden rounded-lg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="relative aspect-square flex items-center justify-center p-8"
                >
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[65%] h-[65%] rounded-full opacity-60"
                      style={{ background: "radial-gradient(circle, hsl(var(--gold-light) / 0.35) 0%, hsl(var(--gold) / 0.12) 35%, transparent 70%)" }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[8%] opacity-25"
                      style={{ background: "linear-gradient(90deg, transparent 0%, hsl(var(--gold-light) / 0.5) 20%, hsl(var(--background) / 0.8) 50%, hsl(var(--gold-light) / 0.5) 80%, transparent 100%)", filter: "blur(10px)" }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[75%] rounded-full opacity-20"
                      style={{ background: "radial-gradient(circle, transparent 40%, hsl(var(--gold) / 0.15) 60%, transparent 75%)" }} />
                    <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2 w-[45%] h-[5%] opacity-25"
                      style={{ background: "radial-gradient(ellipse, hsl(var(--gold-light) / 0.4), transparent 70%)", filter: "blur(8px)" }} />
                  </div>
                  {images[selectedImage] && (
                    <img src={images[selectedImage].node.url} alt={images[selectedImage].node.altText || product.title} className="max-h-full max-w-full object-contain" style={{ mixBlendMode: "multiply" }} />
                  )}
                </motion.div>
              </AnimatePresence>

              <motion.button
                onClick={() => setLiked(!liked)}
                whileTap={{ scale: 0.85 }}
                className="absolute top-4 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-background/60 backdrop-blur-sm transition-colors hover:bg-background/80"
                aria-label="Add to wishlist"
              >
                <Heart className={`h-4 w-4 transition-all duration-300 ${liked ? "fill-destructive text-destructive scale-110" : "text-muted-foreground"}`} />
              </motion.button>
            </div>

            {images.length > 1 && (
              <motion.div className="flex justify-center gap-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`h-14 w-14 overflow-hidden rounded-lg transition-all duration-300 md:h-16 md:w-16 ${
                      i === selectedImage ? "scale-105 ring-2 ring-foreground ring-offset-2 ring-offset-background" : "opacity-55 hover:scale-105 hover:opacity-85"
                    }`}
                    aria-label={`Show image ${i + 1}`}
                  >
                    <img src={img.node.url} alt="" className="h-full w-full object-contain" />
                  </button>
                ))}
              </motion.div>
            )}
          </motion.div>

          <motion.div className="flex flex-col" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}>
            <p className="mb-3 font-sans text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground md:text-[11px]">OLD MONEY Collection</p>
            <h1 className="font-serif text-3xl leading-[1.05] md:text-4xl lg:text-5xl">{product.title}</h1>
            <motion.p className="mt-4 font-sans text-lg font-light text-foreground/80 md:text-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              {currentVariant?.price.currencyCode} {parseFloat(currentVariant?.price.amount || "0").toLocaleString()}
            </motion.p>
            <div className="my-6 h-[1px] bg-gradient-to-r from-border via-gold-light/40 to-border" />

            {product.description && <p className="font-sans text-sm font-light leading-relaxed text-muted-foreground">{product.description}</p>}

            {product.options.map((option) => (
              <div key={option.name} className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-foreground">
                    {option.name}
                    {currentVariant && <span className="ml-2 text-muted-foreground">— {currentVariant.selectedOptions.find((o) => o.name === option.name)?.value}</span>}
                  </p>
                  {option.name.toLowerCase() === "size" && (
                    <button
                      onClick={() => setSizeChartOpen(true)}
                      className="flex items-center gap-1 font-sans text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Ruler className="h-3 w-3" /> Size Guide
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {option.values.map((value) => {
                    const matchingVariant = product.variants.edges.find((v) => v.node.selectedOptions.some((o) => o.name === option.name && o.value === value));
                    const isSelected = matchingVariant?.node.id === selectedVariant;
                    const isAvailable = matchingVariant?.node.availableForSale;
                    return (
                      <motion.button
                        key={value}
                        onClick={() => matchingVariant && setSelectedVariant(matchingVariant.node.id)}
                        disabled={!isAvailable}
                        whileTap={{ scale: 0.95 }}
                        className={`h-10 min-w-[2.75rem] rounded-sm border px-4 font-sans text-[11px] uppercase tracking-[0.1em] transition-all duration-300 ${
                          isSelected ? "border-foreground bg-foreground text-background shadow-[0_2px_10px_-2px_hsl(var(--foreground)/0.3)]" : "border-border text-foreground/70 hover:border-foreground/50 hover:text-foreground"
                        } ${!isAvailable ? "cursor-not-allowed opacity-25 line-through" : ""}`}
                      >
                        {value}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ))}

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

            <motion.button
              onClick={handleAddToCart}
              disabled={isCartLoading || isAdding || !currentVariant?.availableForSale}
              whileTap={{ scale: 0.98 }}
              className={`relative mt-8 h-13 w-full overflow-hidden font-sans text-[11px] font-medium uppercase tracking-[0.2em] transition-all duration-500 disabled:opacity-50 ${
                justAdded ? "bg-accent text-accent-foreground" : "bg-foreground text-background hover:shadow-[0_8px_30px_-8px_hsl(var(--foreground)/0.5)]"
              }`}
            >
              <AnimatePresence mode="wait">
                {isAdding ? (
                  <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center"><Loader2 className="h-4 w-4 animate-spin" /></motion.span>
                ) : justAdded ? (
                  <motion.span key="added" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center justify-center gap-2"><Check className="h-4 w-4" /> Added to Bag</motion.span>
                ) : !currentVariant?.availableForSale ? (
                  <motion.span key="sold" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Sold Out</motion.span>
                ) : (
                  <motion.span key="add" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    Add to Bag — {currentVariant?.price.currencyCode} {parseFloat(currentVariant?.price.amount || "0").toLocaleString()}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

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

      <div className="glass fixed bottom-0 left-0 right-0 z-40 border-t border-border/50 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
        <motion.button
          onClick={handleAddToCart}
          disabled={isCartLoading || isAdding || !currentVariant?.availableForSale}
          whileTap={{ scale: 0.98 }}
          className={`h-12 w-full font-sans text-[11px] font-medium uppercase tracking-[0.15em] transition-all duration-500 disabled:opacity-50 ${
            justAdded ? "bg-accent text-accent-foreground" : "bg-foreground text-background"
          }`}
        >
          {isAdding ? (
            <Loader2 className="mx-auto h-4 w-4 animate-spin" />
          ) : justAdded ? (
            <span className="flex items-center justify-center gap-2"><Check className="h-4 w-4" /> Added</span>
          ) : !currentVariant?.availableForSale ? (
            "Sold Out"
          ) : (
            `Add to Bag — ${currentVariant?.price.currencyCode} ${parseFloat(currentVariant?.price.amount || "0").toLocaleString()}`
          )}
        </motion.button>
      </div>

      <div className="hidden md:block"><StoreFooter /></div>
      <div className="pb-20 md:hidden"><StoreFooter /></div>

      <SizeChartModal
        open={sizeChartOpen}
        onOpenChange={setSizeChartOpen}
        productCategory="clothing"
      />
    </div>
  );
}
