import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Ruler, Sparkles, Loader2, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

interface SizeChartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productCategory?: string;
  onSizeSelect?: (size: string) => void;
}

interface Recommendation {
  recommendedSize: string;
  confidence: string;
  explanation: string;
  tips: string[];
}

const clothingSizeChart = [
  { size: "XS", chest: "84-88", waist: "68-72", hips: "88-92", height: "160-165" },
  { size: "S", chest: "88-92", waist: "72-76", hips: "92-96", height: "165-170" },
  { size: "M", chest: "92-96", waist: "76-80", hips: "96-100", height: "170-175" },
  { size: "L", chest: "96-100", waist: "80-84", hips: "100-104", height: "175-180" },
  { size: "XL", chest: "100-104", waist: "84-88", hips: "104-108", height: "180-185" },
];

const shoeSizeChart = [
  { eu: "39", us: "6.5", uk: "5.5", cm: "24.5" },
  { eu: "40", us: "7", uk: "6", cm: "25" },
  { eu: "41", us: "8", uk: "7", cm: "25.5" },
  { eu: "42", us: "8.5", uk: "7.5", cm: "26" },
  { eu: "43", us: "9.5", uk: "8.5", cm: "27" },
  { eu: "44", us: "10", uk: "9", cm: "27.5" },
  { eu: "45", us: "11", uk: "10", cm: "28.5" },
];

type Tab = "chart" | "finder";

export function SizeChartModal({ open, onOpenChange, productCategory = "clothing", onSizeSelect }: SizeChartModalProps) {
  const [tab, setTab] = useState<Tab>("chart");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [chest, setChest] = useState("");
  const [waist, setWaist] = useState("");
  const [hips, setHips] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [error, setError] = useState("");

  const isShoes = productCategory === "sneakers";

  // Force chart tab for shoes
  useEffect(() => {
    if (isShoes) setTab("chart");
  }, [isShoes, open]);

  const handleFindSize = async () => {
    if (!height && !weight && !bodyType && !chest && !waist && !hips) {
      setError("Please fill in at least one field");
      return;
    }
    setError("");
    setLoading(true);
    setRecommendation(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("size-recommendation", {
        body: {
          height: height || undefined,
          weight: weight || undefined,
          bodyType: bodyType || undefined,
          chest: chest || undefined,
          waist: waist || undefined,
          hips: hips || undefined,
          productCategory: isShoes ? "sneakers" : "clothing",
        },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      setRecommendation(data);
    } catch (e) {
      console.error(e);
      setError("Could not get recommendation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setHeight(""); setWeight(""); setBodyType("");
    setChest(""); setWaist(""); setHips("");
    setRecommendation(null); setError("");
  };

  const confidenceColor = (c: string) => {
    if (c === "high") return "text-green-500";
    if (c === "medium") return "text-yellow-500";
    return "text-orange-400";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border-border bg-background p-0 gap-0 max-h-[85vh] overflow-hidden">
        <DialogTitle className="sr-only">Size Guide</DialogTitle>

        {/* Header */}
        <div className="flex items-center border-b border-border px-6 py-4">
          <h2 className="font-serif text-xl">Size Guide</h2>
        </div>

        {/* Tabs - only show if not shoes */}
        {!isShoes && (
          <div className="flex border-b border-border">
            <button
              onClick={() => setTab("chart")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 font-sans text-[11px] uppercase tracking-[0.15em] transition-all ${
                tab === "chart" ? "text-foreground border-b-2 border-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Ruler className="h-3.5 w-3.5" /> Size Chart
            </button>
            <button
              onClick={() => { setTab("finder"); resetForm(); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 font-sans text-[11px] uppercase tracking-[0.15em] transition-all ${
                tab === "finder" ? "text-foreground border-b-2 border-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" /> AI Size Finder
            </button>
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-120px)]">
          <AnimatePresence mode="wait">
            {tab === "chart" ? (
              <motion.div key="chart" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }} className="p-6">
                {isShoes ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          {["EU", "US", "UK", "CM"].map(h => (
                            <th key={h} className="py-3 px-3 text-left font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {shoeSizeChart.map(row => (
                          <tr key={row.eu} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="py-3 px-3 font-sans text-sm font-medium">{row.eu}</td>
                            <td className="py-3 px-3 font-sans text-sm text-muted-foreground">{row.us}</td>
                            <td className="py-3 px-3 font-sans text-sm text-muted-foreground">{row.uk}</td>
                            <td className="py-3 px-3 font-sans text-sm text-muted-foreground">{row.cm}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          {["Size", "Chest (cm)", "Waist (cm)", "Hips (cm)", "Height (cm)"].map(h => (
                            <th key={h} className="py-3 px-3 text-left font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {clothingSizeChart.map(row => (
                          <tr key={row.size} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="py-3 px-3 font-sans text-sm font-medium">{row.size}</td>
                            <td className="py-3 px-3 font-sans text-sm text-muted-foreground">{row.chest}</td>
                            <td className="py-3 px-3 font-sans text-sm text-muted-foreground">{row.waist}</td>
                            <td className="py-3 px-3 font-sans text-sm text-muted-foreground">{row.hips}</td>
                            <td className="py-3 px-3 font-sans text-sm text-muted-foreground">{row.height}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <p className="mt-4 font-sans text-[11px] text-muted-foreground leading-relaxed">
                  ✦ Measurements are in centimeters. For the best fit, measure yourself and compare with the chart above.
                </p>
              </motion.div>
            ) : (
              <motion.div key="finder" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="p-6">
                <AnimatePresence mode="wait">
                  {recommendation ? (
                    <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                      <div className="text-center space-y-3">
                        <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Your recommended size</p>
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-foreground"
                        >
                          <span className="font-serif text-3xl">{recommendation.recommendedSize}</span>
                        </motion.div>
                        <p className={`font-sans text-[11px] uppercase tracking-[0.15em] ${confidenceColor(recommendation.confidence)}`}>
                          {recommendation.confidence} confidence
                        </p>
                      </div>

                      <p className="font-sans text-sm text-muted-foreground leading-relaxed text-center">{recommendation.explanation}</p>

                      {recommendation.tips?.length > 0 && (
                        <div className="space-y-2">
                          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-foreground">Fit tips</p>
                          {recommendation.tips.map((tip, i) => (
                            <p key={i} className="font-sans text-[11px] text-muted-foreground leading-relaxed">✦ {tip}</p>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={resetForm}
                          className="flex-1 h-11 border border-border font-sans text-[11px] uppercase tracking-[0.15em] text-foreground hover:bg-muted/50 transition-colors"
                        >
                          Try Again
                        </button>
                        {onSizeSelect && (
                          <button
                            onClick={() => {
                              onSizeSelect(recommendation.recommendedSize);
                              onOpenChange(false);
                            }}
                            className="flex-1 h-11 bg-foreground text-background font-sans text-[11px] uppercase tracking-[0.15em] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                          >
                            Select {recommendation.recommendedSize} <ChevronRight className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                      <div className="space-y-1">
                        <p className="font-sans text-sm text-foreground">Let AI find your perfect size</p>
                        <p className="font-sans text-[11px] text-muted-foreground">Fill in what you know — all fields are optional, but more info = better results.</p>
                      </div>

                      {/* Required-ish fields */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block">
                            Height (cm) <span className="text-foreground/40">*recommended</span>
                          </label>
                          <input
                            type="number"
                            value={height}
                            onChange={e => setHeight(e.target.value)}
                            placeholder="e.g. 175"
                            className="w-full h-10 rounded-sm border border-border bg-transparent px-3 font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/50 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block">
                            Weight (kg) <span className="text-foreground/40">*recommended</span>
                          </label>
                          <input
                            type="number"
                            value={weight}
                            onChange={e => setWeight(e.target.value)}
                            placeholder="e.g. 72"
                            className="w-full h-10 rounded-sm border border-border bg-transparent px-3 font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/50 transition-colors"
                          />
                        </div>
                      </div>

                      {/* Body type */}
                      <div>
                        <label className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block">
                          Body type <span className="text-foreground/40">optional</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {["Slim", "Athletic", "Regular", "Broad"].map(type => (
                            <button
                              key={type}
                              onClick={() => setBodyType(bodyType === type ? "" : type)}
                              className={`h-9 px-4 rounded-sm border font-sans text-[11px] uppercase tracking-[0.1em] transition-all ${
                                bodyType === type
                                  ? "border-foreground bg-foreground text-background"
                                  : "border-border text-foreground/70 hover:border-foreground/50"
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Optional measurements */}
                      {!isShoes && (
                        <div>
                          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                            Body measurements <span className="text-foreground/40">optional — for precise results</span>
                          </p>
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="font-sans text-[10px] text-muted-foreground/60 mb-1 block">Chest (cm)</label>
                              <input
                                type="number"
                                value={chest}
                                onChange={e => setChest(e.target.value)}
                                placeholder="96"
                                className="w-full h-9 rounded-sm border border-border bg-transparent px-2.5 font-sans text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground/50 transition-colors"
                              />
                            </div>
                            <div>
                              <label className="font-sans text-[10px] text-muted-foreground/60 mb-1 block">Waist (cm)</label>
                              <input
                                type="number"
                                value={waist}
                                onChange={e => setWaist(e.target.value)}
                                placeholder="80"
                                className="w-full h-9 rounded-sm border border-border bg-transparent px-2.5 font-sans text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground/50 transition-colors"
                              />
                            </div>
                            <div>
                              <label className="font-sans text-[10px] text-muted-foreground/60 mb-1 block">Hips (cm)</label>
                              <input
                                type="number"
                                value={hips}
                                onChange={e => setHips(e.target.value)}
                                placeholder="100"
                                className="w-full h-9 rounded-sm border border-border bg-transparent px-2.5 font-sans text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground/50 transition-colors"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {error && <p className="font-sans text-[11px] text-destructive">{error}</p>}

                      <button
                        onClick={handleFindSize}
                        disabled={loading}
                        className="w-full h-11 bg-foreground text-background font-sans text-[11px] uppercase tracking-[0.15em] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {loading ? (
                          <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</>
                        ) : (
                          <><Sparkles className="h-3.5 w-3.5" /> Find My Size</>
                        )}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
