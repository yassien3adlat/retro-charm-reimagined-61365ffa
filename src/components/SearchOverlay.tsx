import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, Clock, TrendingUp, Sparkles } from "lucide-react";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { staticProducts, type Category } from "@/data/staticProducts";

const trendingSearches = ["Linen Shirts", "Summer Collection", "Accessories", "New Arrivals"];
const recentSearches = ["Cable Knit", "Samba"];
const categoryFilters: Array<{ label: string; value: Category | "all" }> = [
  { label: "All", value: "all" },
  { label: "Men", value: "men" },
  { label: "Women", value: "women" },
  { label: "Accessories", value: "accessories" },
];

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const [debouncedQuery, setDebouncedQuery] = useState("");

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
    setSelectedIndex(-1);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(value), 150);
  }, []);

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const q = debouncedQuery.toLowerCase();
    return staticProducts.filter(p => {
      const matchesQuery = p.title.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)) || p.category.toLowerCase().includes(q);
      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
      return matchesQuery && matchesCategory;
    });
  }, [debouncedQuery, categoryFilter]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
      setQuery("");
      setDebouncedQuery("");
      setSelectedIndex(-1);
      setCategoryFilter("all");
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
      }
      if (e.key === "Enter" && selectedIndex >= 0 && results[selectedIndex]) {
        e.preventDefault();
        navigate(`/product/static/${results[selectedIndex].handle}`);
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose, results, selectedIndex, navigate]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-background/60 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-0 top-0 z-[71] bg-background backdrop-blur-xl shadow-[0_20px_60px_-15px_hsl(var(--foreground)/0.15)] max-h-[85svh] overflow-y-auto border-b border-border/30"
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="container py-6 md:py-10">
              <div className="flex items-center gap-4 mb-4">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, duration: 0.3 }}>
                  <Search className="w-5 h-5 text-gold shrink-0" strokeWidth={1.5} />
                </motion.div>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  placeholder="What are you looking for?"
                  className="flex-1 bg-transparent text-xl md:text-3xl font-serif placeholder:text-muted-foreground/30 focus:outline-none text-foreground"
                  aria-label="Search products"
                  autoComplete="off"
                />
                <div className="flex items-center gap-2">
                  {query && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-foreground/5"
                      onClick={() => { handleQueryChange(""); inputRef.current?.focus(); }}
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  )}
                  <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-foreground/5" aria-label="Close search">
                    <X className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              {/* Category filters */}
              <div className="flex gap-2 mb-4">
                {categoryFilters.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategoryFilter(cat.value)}
                    className={`px-3.5 py-1.5 rounded-full text-[10px] font-sans font-medium uppercase tracking-[0.15em] border transition-all duration-300 ${
                      categoryFilter === cat.value
                        ? "bg-foreground text-background border-foreground"
                        : "border-border/50 text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <motion.div
                className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.15 }}
              />

              {results.length > 0 && (
                <div className="mb-6">
                  <p className="text-[10px] font-sans font-medium uppercase tracking-[0.3em] text-muted-foreground mb-3 flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-gold" />
                    Results ({results.length})
                  </p>
                  <div className="space-y-1">
                    {results.map((product, i) => (
                      <motion.a
                        key={product.id}
                        href={`/product/static/${product.handle}`}
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                          selectedIndex === i ? "bg-foreground/5" : "hover:bg-foreground/[0.03]"
                        }`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={(e) => { e.preventDefault(); navigate(`/product/static/${product.handle}`); onClose(); }}
                      >
                        <div className="w-12 h-12 rounded-lg bg-secondary/80 overflow-hidden flex-shrink-0">
                          <img src={product.image} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-serif text-sm text-foreground truncate">{product.title}</p>
                          <p className="text-[10px] font-sans text-muted-foreground mt-0.5">
                            {product.currency} {product.price.toLocaleString()}
                            {product.isNew && <span className="ml-2 text-gold font-medium">NEW</span>}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground/30 shrink-0" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              )}

              {query.trim() && debouncedQuery.trim() && results.length === 0 && (
                <motion.div className="text-center py-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="text-sm font-sans text-muted-foreground">No results for "<span className="text-foreground font-medium">{query}</span>"</p>
                  <p className="text-[11px] font-sans text-muted-foreground/60 mt-1">Try a different search term</p>
                </motion.div>
              )}

              {!query.trim() && (
                <div className="grid gap-6 md:grid-cols-2">
                  {recentSearches.length > 0 && (
                    <div>
                      <p className="text-[10px] font-sans font-medium uppercase tracking-[0.3em] text-muted-foreground mb-3 flex items-center gap-2">
                        <Clock className="w-3 h-3" /> Recent
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((term, i) => (
                          <motion.button
                            key={term}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-border/40 text-xs font-sans text-muted-foreground hover:border-foreground/20 hover:text-foreground transition-all duration-300"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.04 }}
                            onClick={() => handleQueryChange(term)}
                          >
                            <Clock className="w-3 h-3 opacity-40" /> {term}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-[10px] font-sans font-medium uppercase tracking-[0.3em] text-muted-foreground mb-3 flex items-center gap-2">
                      <TrendingUp className="w-3 h-3" /> Trending
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {trendingSearches.map((term, i) => (
                        <motion.button
                          key={term}
                          className="group inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-border/40 text-xs font-sans text-muted-foreground hover:border-gold/30 hover:text-foreground hover:bg-gold/5 transition-all duration-300"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.25 + i * 0.04 }}
                          onClick={() => handleQueryChange(term)}
                        >
                          {term}
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <motion.div
                className="mt-6 pt-4 border-t border-border/20 flex items-center gap-4 text-[10px] font-sans text-muted-foreground/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded border border-border/40 text-[9px] font-mono">↑↓</kbd> Navigate
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded border border-border/40 text-[9px] font-mono">Enter</kbd> Select
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded border border-border/40 text-[9px] font-mono">ESC</kbd> Close
                </span>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
