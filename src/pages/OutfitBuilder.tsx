import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { StoreHeader } from "@/components/StoreHeader";
import { StoreFooter } from "@/components/StoreFooter";
import { staticProducts, type StaticProduct } from "@/data/staticProducts";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import mannequinMale from "@/assets/mannequin-male.png";
import mannequinFemale from "@/assets/mannequin-female.png";

type Gender = "men" | "women";

interface OutfitResult {
  outfitName: string;
  pieces: StaticProduct[];
  mood: string;
  tip: string;
}

// Preset outfit combos — you can define your own here
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

    setResult({
      outfitName: pick.name,
      pieces,
      mood: pick.mood,
      tip: pick.tip,
    });
    setLoading(false);
  };

  const handleAddAllToCart = () => {
    result?.pieces.forEach((p) => addStaticItem(p, "M", 1));
    toast.success(`${result?.pieces.length} items added to bag`);
  };

  const resetAll = () => {
    setGender(null);
    setResult(null);
  };

  const mannequinSrc = gender === "women" ? mannequinFemale : mannequinMale;

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      <main className="pt-24 pb-20">
        <div className="container max-w-4xl mx-auto px-5">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold mb-3 flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> AI Stylist
            </p>
            <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-3">
              Build Your Look
            </h1>
            <p className="font-sans text-sm text-muted-foreground max-w-md mx-auto">
              Choose your style — we'll curate the perfect outfit from our collection.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {/* Step: Gender Selection */}
            {!gender && !loading && (
              <motion.div
                key="gender"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="font-serif text-xl text-foreground text-center">Who are we styling?</h2>
                <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                  {(["men", "women"] as Gender[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => handleSelectGender(g)}
                      className="group relative overflow-hidden rounded-sm border border-border hover:border-foreground/30 transition-all duration-500"
                    >
                      <div className="aspect-[3/4] bg-secondary/30 flex items-center justify-center p-6">
                        <img
                          src={g === "men" ? mannequinMale : mannequinFemale}
                          alt={g === "men" ? "Men" : "Women"}
                          className="h-full object-contain opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500"
                        />
                      </div>
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-background via-background/80 to-transparent p-4 pt-10">
                        <span className="font-sans text-[11px] uppercase tracking-[0.2em] font-medium text-foreground">
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
                className="text-center py-20"
              >
                <div className="relative mx-auto w-24 h-24 mb-6">
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-border"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute inset-2 rounded-full border-2 border-foreground/20 border-t-foreground"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-foreground" />
                  </div>
                </div>
                <p className="font-serif text-lg text-foreground mb-2">Styling your look</p>
                <p className="font-sans text-[11px] text-muted-foreground uppercase tracking-[0.15em]">
                  Matching colors, textures & proportions
                </p>
              </motion.div>
            )}

            {/* Result: Mannequin + Products */}
            {result && !loading && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-10"
              >
                {/* Outfit Header */}
                <div className="text-center space-y-2">
                  <motion.p
                    className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {result.mood}
                  </motion.p>
                  <motion.h2
                    className="font-serif text-2xl md:text-3xl text-foreground"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {result.outfitName}
                  </motion.h2>
                </div>

                {/* Mannequin + Product Cards Side by Side */}
                <motion.div
                  className="flex flex-col md:flex-row items-center md:items-start gap-8 max-w-2xl mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  {/* Mannequin */}
                  <div className="w-48 md:w-56 flex-shrink-0">
                    <div className="aspect-[3/5] bg-secondary/20 rounded-sm flex items-center justify-center p-4">
                      <img
                        src={mannequinSrc}
                        alt="Mannequin"
                        className="h-full object-contain opacity-50"
                      />
                    </div>
                  </div>

                  {/* Product List */}
                  <div className="flex-1 space-y-3 w-full">
                    {result.pieces.map((product, i) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.15, type: "spring", stiffness: 200 }}
                      >
                        <Link
                          to={`/product/static/${product.handle}`}
                          className="group flex items-center gap-4 border border-border/60 rounded-sm p-3 hover:border-foreground/20 transition-all bg-background"
                        >
                          <div className="w-16 h-16 bg-secondary/30 rounded-sm overflow-hidden flex-shrink-0">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-full h-full object-contain mix-blend-multiply p-1.5 group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-serif text-sm text-foreground leading-tight truncate">
                              {product.title}
                            </p>
                            <p className="font-sans text-[11px] text-muted-foreground mt-0.5">
                              {product.currency} {product.price.toLocaleString()}
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Styling Tip */}
                <motion.div
                  className="max-w-md mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-foreground font-medium mb-1.5">
                    How to wear it
                  </p>
                  <p className="font-sans text-[11px] text-muted-foreground leading-relaxed">
                    ✦ {result.tip}
                  </p>
                </motion.div>

                {/* Total */}
                <motion.div
                  className="flex items-center justify-between border-t border-b border-border py-4 max-w-md mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <span className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                    Complete look · {result.pieces.length} pieces
                  </span>
                  <span className="font-serif text-lg text-foreground">
                    EGP {totalPrice.toLocaleString()}
                  </span>
                </motion.div>

                {/* Actions */}
                <motion.div
                  className="flex gap-3 max-w-md mx-auto"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  <button
                    onClick={resetAll}
                    className="flex-1 h-12 border border-border font-sans text-[11px] uppercase tracking-[0.15em] text-foreground hover:bg-muted/50 transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> New Look
                  </button>
                  <button
                    onClick={handleAddAllToCart}
                    className="flex-1 h-12 bg-foreground text-background font-sans text-[11px] uppercase tracking-[0.15em] hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Add All to Bag
                  </button>
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
