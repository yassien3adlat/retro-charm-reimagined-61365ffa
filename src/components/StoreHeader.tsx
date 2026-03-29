import { Link, useLocation } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";
import { Search, User, Menu, X, Heart } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { SearchOverlay } from "./SearchOverlay";
import { MobileBottomNav } from "./MobileBottomNav";
import { useWishlistStore } from "@/stores/wishlistStore";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { label: "New In", path: "/category/new-in" },
  { label: "Men", path: "/category/men" },
  { label: "Women", path: "/category/women" },
  { label: "Accessories", path: "/category/accessories" },
  { label: "AI Stylist", path: "/outfit-builder" },
];

export function StoreHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { scrollY } = useScroll();
  const [lastScroll, setLastScroll] = useState(0);
  const location = useLocation();
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const wishlistCount = useWishlistStore((s) => s.ids.length);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 60);
    if (latest > lastScroll && latest > 200) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setLastScroll(latest);
  });

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleKeyboard = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setSearchOpen((prev) => !prev);
    }
    if (e.key === "Escape" && menuOpen) setMenuOpen(false);
  }, [menuOpen]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [handleKeyboard]);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled ? "glass border-b border-gold/15 shadow-[0_1px_40px_-8px_hsl(var(--gold)/0.12)]" : "bg-transparent"
        }`}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container flex items-center justify-between h-16 md:h-18">
          <motion.button
            className="md:hidden p-2 -ml-2 text-foreground hover:bg-foreground/5 rounded-full transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {menuOpen ? (
                <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <Link to="/" className="flex items-center gap-2.5">
            <span className="font-sans text-base md:text-lg font-medium uppercase tracking-[0.3em] text-foreground">Old Money</span>
          </Link>

          <nav className="hidden md:flex items-center gap-5" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className="relative px-4 py-2 text-[11.5px] font-sans font-medium uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground transition-colors duration-300"
                  onMouseEnter={() => setHoveredNav(item.label)}
                  onMouseLeave={() => setHoveredNav(null)}
                >
                  <span className="relative z-10">{item.label}</span>
                  {(hoveredNav === item.label || isActive) && (
                    <motion.div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1.5px] bg-gradient-to-r from-transparent via-gold to-transparent"
                      layoutId="navUnderline"
                      style={{ width: "70%" }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1 md:gap-2">
            <motion.button
              className="p-2.5 text-foreground/70 hover:text-foreground transition-all duration-300 hover:bg-foreground/5 rounded-full"
              aria-label="Search (⌘K)"
              onClick={() => setSearchOpen(true)}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
            >
              <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </motion.button>
            <Link
              to="/wishlist"
              className="hidden md:flex relative p-2.5 text-foreground/70 hover:text-foreground transition-all duration-300 hover:bg-foreground/5 rounded-full"
              aria-label="Wishlist"
            >
              <Heart className="h-[18px] w-[18px]" strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 rounded-full p-0 flex items-center justify-center text-[9px] font-sans font-medium bg-foreground text-background border-0">
                  {wishlistCount}
                </Badge>
              )}
            </Link>
            <motion.button
              className="hidden md:flex p-2.5 text-foreground/70 hover:text-foreground transition-all duration-300 hover:bg-foreground/5 rounded-full"
              aria-label="Account"
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
            >
              <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </motion.button>
            <CartDrawer />
          </div>
        </div>
      </motion.header>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileBottomNav onSearchOpen={() => setSearchOpen(true)} />

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[59] bg-foreground/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className="fixed inset-0 z-[60] bg-background flex flex-col"
              initial={{ clipPath: "circle(0% at 28px 35px)" }}
              animate={{ clipPath: "circle(150% at 28px 35px)" }}
              exit={{ clipPath: "circle(0% at 28px 35px)" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="container pt-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-12">
                  <span className="font-sans text-sm font-medium uppercase tracking-[0.25em]">Old Money</span>
                  <motion.button
                    onClick={() => setMenuOpen(false)}
                    className="p-2 text-foreground hover:bg-foreground/5 rounded-full transition-colors"
                    aria-label="Close menu"
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>

                <nav className="flex flex-col gap-0 flex-1" role="navigation" aria-label="Mobile navigation">
                  {navItems.map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1], duration: 0.6 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setMenuOpen(false)}
                        className="group flex items-center justify-between py-5 font-serif text-3xl text-foreground border-b border-border/20 active:bg-foreground/5 transition-colors"
                      >
                        <span className="flex items-center gap-4">
                          <span className="text-[10px] font-sans text-muted-foreground/40 font-medium tabular-nums">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          {item.label}
                        </span>
                        <motion.span className="text-muted-foreground/30 text-lg" initial={{ x: -8, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 + i * 0.08 }}>
                          →
                        </motion.span>
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <motion.div
                  className="pb-8 pt-6 border-t border-border/20 flex items-center gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.button
                    className="flex-1 flex items-center justify-center gap-3 px-5 py-4 rounded-2xl border border-border/40 text-muted-foreground font-sans text-sm active:bg-foreground/5 transition-colors"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setMenuOpen(false);
                      setTimeout(() => setSearchOpen(true), 300);
                    }}
                  >
                    <Search className="w-4 h-4" strokeWidth={1.5} />
                    Search
                  </motion.button>
                  <Link
                    to="/wishlist"
                    onClick={() => setMenuOpen(false)}
                    className="relative w-14 h-14 flex items-center justify-center rounded-2xl border border-border/40 text-muted-foreground active:bg-foreground/5 transition-colors"
                  >
                    <Heart className="w-5 h-5" strokeWidth={1.5} />
                    {wishlistCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-4 min-w-4 rounded-full p-0 flex items-center justify-center text-[9px] font-sans font-medium bg-foreground text-background border-0">
                        {wishlistCount}
                      </Badge>
                    )}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
