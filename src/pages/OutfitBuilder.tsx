import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, ShoppingBag, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { StoreHeader } from "@/components/StoreHeader";
import { StoreFooter } from "@/components/StoreFooter";
import { staticProducts, type StaticProduct } from "@/data/staticProducts";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import mannequinMaleCasual from "@/assets/mannequin-male-casual.png";
import mannequinFemaleCasual from "@/assets/mannequin-female-casual.png";

type Gender = "men" | "women";

interface OutfitResult {
  outfitName: string;
  pieces: StaticProduct[];
  mood: string;
  tip: string;
}

const presetOutfits: Record<Gender, Array<{ name: string; mood: string; tip: string; productIds: string[] }>> = {
  men: [
    {
      name: "The Heritage Edit",
      mood: "Timeless Refinement",
      tip: "Roll sleeves slightly for a relaxed touch. Add a leather belt to anchor the look.",
      productIds: ["static-3", "static-5", "static-6"],
    },
    {
      name: "Weekend Ease",
      mood: "Effortless Casual",
      tip: "Tuck the front for a more structured silhouette. Pair with minimal accessories.",
      productIds: ["static-5", "static-7"],
    },
    {
      name: "The Layered Look",
      mood: "Artful Layers",
      tip: "Layer the quarter-zip over the jersey for textured depth.",
      productIds: ["static-3", "static-6", "static-7"],
    },
  ],
  women: [
    {
      name: "Soft Power",
      mood: "Elevated Comfort",
      tip: "Let the oversized sweater drape naturally. Add gold earrings for polish.",
      productIds: ["static-2", "static-4"],
    },
    {
      name: "Knit & Go",
      mood: "Easy Sophistication",
      tip: "Half-zip the jacket and layer over the sweater for dimension.",
      productIds: ["static-2", "static-4"],
    },
  ],
};

export default function OutfitBuilder() {
  const [gender, setGender] = useState<Gender | null>(null);
  const [result, setResult] = useState<OutfitResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [hoveredPiece, setHoveredPiece] = useState<string | null>(null);
  const addStaticItem = useCartStore((s) => s.addStaticItem);

  const totalPrice = useMemo(
    () => result?.pieces.reduce((sum, p) => sum + p.price, 0) ?? 0,
    [result]
  );

  const handleSelectGender = async (g: Gender) => {
    setGender(g);
    setLoading(true);
    setResult(null);

    await new Promise((r) => setTimeout(r, 1200));

    const outfits = presetOutfits[g];
    const pick = outfits[Math.floor(Math.random() * outfits.length)];
    const pieces = pick.productIds
      .map((id) => staticProducts.find((p) => p.id === id))
      .filter(Boolean) as StaticProduct[];

    setResult({ outfitName: pick.name, pieces, mood: pick.mood, tip: pick.tip });
    setLoading(false);
  };

  const handleAddSingle = (e: React.MouseEvent, product: StaticProduct) => {
    e.preventDefault();
    e.stopPropagation();
    addStaticItem(product, "M", 1);
    toast.success(`${product.title} added to bag`);
  };

  const handleAddAllToCart = () => {
    result?.pieces.forEach((p) => addStaticItem(p, "M", 1));
    toast.success(`${result?.pieces.length} items added to bag`);
  };

  const resetAll = () => {
    setGender(null);
    setResult(null);
    setHoveredPiece(null);
  };

  const mannequinSrc = gender === "women" ? mannequinFemaleCasual : mannequinMaleCasual;

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      <main className="pt-24 pb-20">
        <div className="container max-w-5xl mx-auto px-5">
          {/* Header */}
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-gold mb-4 flex items-center justify-center gap-2">
              <Sparkles className="w-3 h-3" /> AI Stylist
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4 leading-tight">
              Build Your Look
            </h1>
            <div className="w-12 h-px bg-gold/60 mx-auto mb-4" />
            <p className="font-sans text-[13px] text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Choose your style — we curate the perfect outfit from our collection.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {/* Gender Selection */}
            {!gender && !loading && (
              <motion.div
                key="gender"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <h2 className="font-serif text-lg text-foreground text-center tracking-wide">
                  Who are we styling?
                </h2>
                <div className="grid grid-cols-2 gap-5 max-w-sm mx-auto">
                  {(["men", "women"] as Gender[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => handleSelectGender(g)}
                      className="group relative overflow-hidden border border-border hover:border-foreground/20 transition-all duration-500"
                    >
                      <div className="aspect-[3/4.5] bg-gradient-to-b from-secondary/20 to-secondary/40 flex items-center justify-center p-8">
                        <img
                          src={g === "men" ? mannequinMaleCasual : mannequinFemaleCasual}
                          alt={g === "men" ? "Men" : "Women"}
                          className="h-full object-contain opacity-50 group-hover:opacity-70 group-hover:scale-[1.03] transition-all duration-700"
                        />
                      </div>
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-background via-background/90 to-transparent p-5 pt-14">
                        <span className="font-sans text-[10px] uppercase tracking-[0.25em] font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                          {g === "men" ? "Menswear" : "Womenswear"}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Loading */}
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-24"
              >
                <div className="relative mx-auto w-20 h-20 mb-8">
                  <motion.div
                    className="absolute inset-0 rounded-full border border-border"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.05, 0.3] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute inset-2 rounded-full border border-foreground/15 border-t-foreground/60"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-foreground/60" />
                  </div>
                </div>
                <p className="font-serif text-lg text-foreground/80 mb-2">Curating your look</p>
                <p className="font-sans text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                  Colors · Textures · Proportions
                </p>
              </motion.div>
            )}

            {/* Result */}
            {result && !loading && (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="space-y-12"
              >
                {/* Outfit Title */}
                <div className="text-center space-y-3">
                  <motion.p
                    className="font-sans text-[9px] uppercase tracking-[0.4em] text-gold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {result.mood}
                  </motion.p>
                  <motion.h2
                    className="font-serif text-3xl md:text-4xl text-foreground"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {result.outfitName}
                  </motion.h2>
                </div>

                {/* Main Layout: Mannequin + Products */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1.1fr] gap-8 md:gap-0 items-start max-w-3xl mx-auto">

                  {/* Left: Mannequin */}
                  <motion.div
                    className="flex justify-center md:justify-end md:pr-10"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35, duration: 0.5 }}
                  >
                    <div className="w-52 md:w-60">
                      <div className="aspect-[3/5] bg-gradient-to-b from-secondary/10 via-secondary/25 to-secondary/10 rounded-sm flex items-center justify-center p-5 relative overflow-hidden">
                        <img
                          src={mannequinSrc}
                          alt="Mannequin"
                          width={512}
                          height={1024}
                          className={`h-full object-contain transition-opacity duration-500 ${
                            hoveredPiece ? "opacity-25" : "opacity-60"
                          }`}
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Center divider (desktop) */}
                  <div className="hidden md:flex flex-col items-center py-4">
                    <div className="w-px h-full bg-border" />
                  </div>

                  {/* Right: Product Cards + CTA */}
                  <motion.div
                    className="flex flex-col md:pl-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <p className="font-sans text-[9px] uppercase tracking-[0.25em] text-muted-foreground mb-4 hidden md:block">
                      {result.pieces.length} Pieces
                    </p>

                    <div className="space-y-3">
                      {result.pieces.map((product, i) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, x: 15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.45 + i * 0.12, type: "spring", stiffness: 180, damping: 20 }}
                          onMouseEnter={() => setHoveredPiece(product.id)}
                          onMouseLeave={() => setHoveredPiece(null)}
                        >
                          <Link
                            to={`/product/static/${product.handle}`}
                            className={`group flex items-center gap-4 py-3 px-4 rounded-sm border transition-all duration-300 ${
                              hoveredPiece === product.id
                                ? "border-foreground/20 bg-secondary/30 shadow-sm"
                                : "border-border hover:border-foreground/10"
                            }`}
                          >
                            {/* Enlarged thumbnail */}
                            <div className="w-20 h-20 bg-secondary/40 rounded-sm overflow-hidden flex-shrink-0">
                              <img
                                src={product.image}
                                alt={product.title}
                                loading="lazy"
                                className="w-full h-full object-contain mix-blend-multiply p-2 group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-serif text-sm text-foreground leading-snug truncate group-hover:text-foreground/80 transition-colors">
                                {product.title}
                              </p>
                              <p className="font-sans text-[12px] text-muted-foreground mt-1 tracking-wide">
                                {product.currency} {product.price.toLocaleString()}
                              </p>
                            </div>
                            {/* Add to Cart button */}
                            <button
                              onClick={(e) => handleAddSingle(e, product)}
                              className="w-9 h-9 rounded-full border border-border bg-background flex items-center justify-center flex-shrink-0 hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-200"
                              aria-label={`Add ${product.title} to cart`}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </Link>
                        </motion.div>
                      ))}
                    </div>

                    {/* Total */}
                    <motion.div
                      className="flex items-center justify-between border-t border-border pt-4 mt-5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                    >
                      <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {result.pieces.length} pieces
                      </span>
                      <span className="font-serif text-xl text-foreground">
                        EGP {totalPrice.toLocaleString()}
                      </span>
                    </motion.div>

                    {/* Primary CTA */}
                    <motion.button
                      onClick={handleAddAllToCart}
                      className="mt-4 w-full h-12 bg-foreground text-background font-sans text-[10px] uppercase tracking-[0.2em] hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                    >
                      <ShoppingBag className="w-4 h-4" /> Add Complete Outfit to Cart
                    </motion.button>

                    {/* New Look button */}
                    <motion.button
                      onClick={resetAll}
                      className="mt-2 w-full h-10 border border-border font-sans text-[10px] uppercase tracking-[0.2em] text-foreground hover:bg-secondary/50 transition-all flex items-center justify-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.05 }}
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Generate New Look
                    </motion.button>
                  </motion.div>
                </div>

                {/* Styling Note — boxed */}
                <motion.div
                  className="max-w-lg mx-auto border border-border bg-secondary/20 rounded-sm p-6 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                >
                  <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-foreground font-medium mb-3">
                    Styling Note
                  </p>
                  <p className="font-sans text-sm text-foreground/70 leading-relaxed">
                    {result.tip}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
