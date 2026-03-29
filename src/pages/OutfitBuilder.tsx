import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, RefreshCw, ShoppingBag, ChevronLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { StoreHeader } from "@/components/StoreHeader";
import { StoreFooter } from "@/components/StoreFooter";
import { staticProducts, type StaticProduct } from "@/data/staticProducts";
import { supabase } from "@/integrations/supabase/client";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import mannequinMale from "@/assets/mannequin-male.png";
import mannequinFemale from "@/assets/mannequin-female.png";

type Gender = "men" | "women";

interface OutfitPiece {
  productId: string;
  zone: "head" | "top" | "mid" | "outer" | "bottom" | "feet" | "accessory";
  role: string;
  reason: string;
}

interface OutfitResult {
  outfitName: string;
  selectedProductIds: string[];
  explanation: string;
  pieces: OutfitPiece[];
  stylingTips: string[];
  mood: string;
}

const vibes = [
  { value: "classic", label: "Classic", desc: "Timeless & refined" },
  { value: "relaxed", label: "Relaxed", desc: "Effortless weekend" },
  { value: "layered", label: "Layered", desc: "Textured depth" },
  { value: "bold", label: "Bold", desc: "Statement pieces" },
];

// Position products around the mannequin based on zone
const zonePositions: Record<string, { top: string; left?: string; right?: string }> = {
  head: { top: "2%", right: "-60%" },
  top: { top: "22%", left: "-60%" },
  mid: { top: "30%", right: "-60%" },
  outer: { top: "18%", left: "-60%" },
  bottom: { top: "55%", left: "-60%" },
  feet: { top: "78%", right: "-60%" },
  accessory: { top: "45%", right: "-60%" },
};

// Alternate sides when multiple items land on the same side
function getAlternatedPositions(pieces: OutfitPiece[]) {
  let leftCount = 0;
  let rightCount = 0;
  
  return pieces.map((piece) => {
    const defaultPos = zonePositions[piece.zone] || zonePositions.top;
    const isLeft = "left" in defaultPos;
    
    // Alternate to avoid stacking
    if (isLeft) {
      const offset = leftCount * 18;
      leftCount++;
      return { ...piece, style: { top: `${parseInt(defaultPos.top!) + offset}%`, left: "-55%" } };
    } else {
      const offset = rightCount * 18;
      rightCount++;
      return { ...piece, style: { top: `${parseInt(defaultPos.top!) + offset}%`, right: "-55%" } };
    }
  });
}

export default function OutfitBuilder() {
  const [step, setStep] = useState(0);
  const [gender, setGender] = useState<Gender | null>(null);
  const [vibe, setVibe] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OutfitResult | null>(null);
  const [error, setError] = useState("");
  const addStaticItem = useCartStore((s) => s.addStaticItem);

  const filteredProducts = useMemo(() => {
    if (!gender) return staticProducts;
    return staticProducts.filter((p) => p.category === gender);
  }, [gender]);

  const resultProducts = useMemo(() => {
    if (!result) return [];
    return result.selectedProductIds
      .map((id) => staticProducts.find((p) => p.id === id))
      .filter(Boolean) as StaticProduct[];
  }, [result]);

  const totalPrice = useMemo(
    () => resultProducts.reduce((sum, p) => sum + p.price, 0),
    [resultProducts]
  );

  const positionedPieces = useMemo(() => {
    if (!result) return [];
    return getAlternatedPositions(result.pieces);
  }, [result]);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("outfit-suggestion", {
        body: {
          gender: gender || "men",
          vibe: vibe || "classic",
          products: filteredProducts.map((p) => ({
            id: p.id,
            title: p.title,
            category: p.category,
            tags: p.tags,
            price: p.price,
            currency: p.currency,
          })),
        },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      setResult(data);
      setStep(2);
    } catch (e) {
      console.error(e);
      setError("Could not generate outfit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAllToCart = () => {
    resultProducts.forEach((p) => addStaticItem(p, "M", 1));
    toast.success(`${resultProducts.length} items added to bag`);
  };

  const resetAll = () => {
    setStep(0);
    setGender(null);
    setVibe(null);
    setResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      <main className="pt-24 pb-20">
        <div className="container max-w-3xl mx-auto px-5">
          {/* Header */}
          <motion.div
            className="text-center mb-10"
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
              Pick your vibe — our AI curates the perfect outfit from our collection.
            </p>
          </motion.div>

          {/* Progress */}
          {step < 2 && !loading && (
            <div className="flex items-center gap-2 mb-10 max-w-[120px] mx-auto">
              {[0, 1].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-[2px] rounded-full transition-all duration-500 ${
                    s <= step ? "bg-foreground" : "bg-border"
                  }`}
                />
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
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

            {/* Step 0: Gender */}
            {step === 0 && !loading && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="font-serif text-xl text-foreground">Who are we styling?</h2>
                </div>
                <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                  {(["men", "women"] as Gender[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => { setGender(g); setStep(1); }}
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

            {/* Step 1: Vibe */}
            {step === 1 && !loading && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="font-serif text-xl text-foreground">What's the vibe?</h2>
                </div>
                <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                  {vibes.map((v) => (
                    <button
                      key={v.value}
                      onClick={() => setVibe(v.value)}
                      className={`h-20 rounded-sm border-2 flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                        vibe === v.value
                          ? "border-foreground bg-foreground text-background"
                          : "border-border hover:border-foreground/40 text-foreground"
                      }`}
                    >
                      <span className="font-sans text-[12px] font-medium">{v.label}</span>
                      <span className={`font-sans text-[10px] ${vibe === v.value ? "text-background/60" : "text-muted-foreground"}`}>
                        {v.desc}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 max-w-sm mx-auto">
                  <button
                    onClick={() => setStep(0)}
                    className="h-12 px-5 border border-border font-sans text-[11px] uppercase tracking-[0.15em] text-foreground hover:bg-muted/50 transition-colors flex items-center gap-2"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Back
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={!vibe}
                    className="flex-1 h-12 bg-foreground text-background font-sans text-[11px] uppercase tracking-[0.15em] hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Style Me
                  </button>
                </div>
              </motion.div>
            )}

            {/* Result */}
            {step === 2 && result && !loading && (
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
                    {result.mood || "Your curated look"}
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

                {/* Mannequin + Outfit Display */}
                <motion.div
                  className="relative mx-auto"
                  style={{ maxWidth: "560px" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  <div className="relative flex justify-center">
                    {/* Mannequin */}
                    <div className="relative w-40 md:w-48 flex-shrink-0">
                      <img
                        src={gender === "women" ? mannequinFemale : mannequinMale}
                        alt="Mannequin"
                        className="w-full opacity-20"
                        width={512}
                        height={1024}
                      />

                      {/* Overlay product images on mannequin */}
                      {positionedPieces.map((piece, i) => {
                        const product = staticProducts.find((p) => p.id === piece.productId);
                        if (!product) return null;
                        const isLeft = "left" in piece.style;

                        return (
                          <motion.div
                            key={piece.productId}
                            className="absolute"
                            style={{
                              top: piece.style.top,
                              ...(isLeft ? { left: piece.style.left } : { right: piece.style.right }),
                              width: "110%",
                            }}
                            initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + i * 0.15 }}
                          >
                            <Link
                              to={`/product/static/${product.handle}`}
                              className="group flex items-center gap-2"
                              style={{ flexDirection: isLeft ? "row-reverse" : "row" }}
                            >
                              {/* Connecting line */}
                              <div
                                className={`hidden md:block h-px bg-border/60 flex-shrink-0`}
                                style={{ width: "24px" }}
                              />

                              {/* Product card */}
                              <div className="bg-background border border-border/60 rounded-sm p-2 shadow-sm hover:shadow-md hover:border-foreground/20 transition-all duration-300 w-32 md:w-36">
                                <div className="aspect-square bg-secondary/30 rounded-sm overflow-hidden mb-1.5">
                                  <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-full object-contain mix-blend-multiply p-2 group-hover:scale-110 transition-transform duration-500"
                                    loading="lazy"
                                  />
                                </div>
                                <p className="font-sans text-[9px] uppercase tracking-[0.1em] text-gold/80 mb-0.5">
                                  {piece.role}
                                </p>
                                <p className="font-serif text-[11px] text-foreground leading-tight truncate">
                                  {product.title}
                                </p>
                                <p className="font-sans text-[10px] text-muted-foreground mt-0.5">
                                  {product.currency} {product.price.toLocaleString()}
                                </p>
                              </div>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>

                {/* Explanation */}
                <motion.p
                  className="font-sans text-sm text-muted-foreground text-center max-w-lg mx-auto leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  {result.explanation}
                </motion.p>

                {/* Total */}
                <motion.div
                  className="flex items-center justify-between border-t border-b border-border py-4 max-w-md mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <span className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                    Complete look · {resultProducts.length} pieces
                  </span>
                  <span className="font-serif text-lg text-foreground">
                    EGP {totalPrice.toLocaleString()}
                  </span>
                </motion.div>

                {/* Styling Tips */}
                {result.stylingTips?.length > 0 && (
                  <motion.div
                    className="space-y-2 max-w-md mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-foreground font-medium">
                      How to wear it
                    </p>
                    {result.stylingTips.map((tip, i) => (
                      <p key={i} className="font-sans text-[11px] text-muted-foreground leading-relaxed">
                        ✦ {tip}
                      </p>
                    ))}
                  </motion.div>
                )}

                {/* Actions */}
                <motion.div
                  className="flex gap-3 max-w-md mx-auto"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
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

          {/* Error */}
          {error && (
            <motion.p
              className="text-center font-sans text-[11px] text-destructive mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
