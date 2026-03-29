import { motion, AnimatePresence } from "framer-motion";
import { Instagram, ArrowUpRight, ArrowRight, MapPin, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

const emailSchema = z.string().trim().email().max(255);

export function StoreFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError("Please enter a valid email");
      return;
    }
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden">
      {/* Newsletter section */}
      <div className="bg-foreground text-background py-24 md:py-32 relative overflow-hidden noise-overlay">
        {/* Animated orbs */}
        <motion.div
          className="absolute top-1/2 left-1/4 w-[400px] h-[400px] rounded-full opacity-[0.03] pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(var(--gold)), transparent 60%)" }}
          animate={{ scale: [1, 1.3, 1], x: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="container text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.p
              className="text-[10px] md:text-[11px] font-sans font-medium uppercase tracking-[0.4em] text-background/30 mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Stay Connected
            </motion.p>
            <h3 className="font-serif text-3xl md:text-5xl lg:text-6xl mb-3 font-normal">
              Join the Inner Circle
            </h3>
            <p className="text-xs md:text-sm font-sans text-background/30 mb-10 max-w-md mx-auto leading-relaxed">
              Be the first to discover new arrivals, exclusive offers, and curated style guides.
            </p>

            <form onSubmit={handleSubscribe} className="max-w-lg mx-auto relative" noValidate>
              <motion.div
                className={`flex rounded-full border transition-all duration-500 ${
                  focused ? "border-background/40 shadow-[0_0_30px_-8px_hsl(var(--gold)/0.2)]" : "border-background/15"
                } ${error ? "border-red-400/50" : ""}`}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="Your email address"
                  required
                  maxLength={255}
                  className="flex-1 h-12 md:h-14 px-6 bg-transparent text-sm font-sans placeholder:text-background/20 focus:outline-none text-background"
                  aria-label="Email address for newsletter"
                  aria-invalid={!!error}
                  aria-describedby={error ? "newsletter-error" : undefined}
                />
                <motion.button
                  type="submit"
                  className="h-12 md:h-14 px-6 md:px-8 bg-gold text-foreground text-[11px] uppercase tracking-[0.18em] font-sans font-medium rounded-r-full hover:bg-gold-light transition-colors duration-400 flex items-center gap-2"
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.02 }}
                  disabled={subscribed}
                >
                  <AnimatePresence mode="wait">
                    {subscribed ? (
                      <motion.span
                        key="check"
                        initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-green-600"
                      >
                        ✓
                      </motion.span>
                    ) : (
                      <motion.span
                        key="text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <span className="hidden md:inline">Subscribe</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    id="newsletter-error"
                    className="absolute -bottom-6 left-6 text-[10px] font-sans text-red-400"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    role="alert"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {subscribed && (
                  <motion.p
                    className="absolute -bottom-7 left-0 right-0 text-[10px] font-sans text-background/50 text-center"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    Welcome to the circle ✦
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Gold divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />

      {/* Footer links */}
      <div className="bg-background py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-8">
            {/* Brand */}
            <motion.div
              className="col-span-2 md:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="font-sans text-sm font-medium uppercase tracking-[0.3em]">Old Money</span>
              </div>
              <p className="text-xs text-muted-foreground leading-[1.9] max-w-[280px] font-sans">
                Timeless pieces for the modern connoisseur. Quiet luxury, crafted with intention and designed to last.
              </p>

              <div className="mt-5 space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-sans">
                  <MapPin className="w-3 h-3 text-gold/60 shrink-0" strokeWidth={1.5} />
                  Cairo, Egypt
                </div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-sans">
                  <Phone className="w-3 h-3 text-gold/60 shrink-0" strokeWidth={1.5} />
                  +20 100 XXX XXXX
                </div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-sans">
                  <Mail className="w-3 h-3 text-gold/60 shrink-0" strokeWidth={1.5} />
                  hello@oldmoney.eg
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <motion.a
                  href="#"
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-foreground/5 transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="w-4 h-4" strokeWidth={1.5} />
                </motion.a>
              </div>
            </motion.div>

            {/* Link groups */}
            {[
              { title: "Shop", links: [
                { label: "New Arrivals", path: "/category/new-in" },
                { label: "Men", path: "/category/men" },
                { label: "Women", path: "/category/women" },
                { label: "Accessories", path: "/category/accessories" },
              ]},
              { title: "Help", links: [
                { label: "Shipping", path: "#" },
                { label: "Returns", path: "#" },
                { label: "Size Guide", path: "#" },
                { label: "Contact", path: "#" },
              ]},
              { title: "Legal", links: [
                { label: "Privacy Policy", path: "#" },
                { label: "Terms of Service", path: "#" },
              ]},
            ].map((group, gi) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * (gi + 1) }}
              >
                <h4 className="text-[11.5px] uppercase tracking-[0.25em] font-sans font-medium mb-5 text-foreground">
                  {group.title}
                </h4>
                <ul className="space-y-3">
                  {group.links.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.path}
                        className="group inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors duration-300 font-sans underline-reveal"
                      >
                        {item.label}
                        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-[-2px] group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Bottom bar */}
          <motion.div
            className="mt-12 pt-5 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-[11px] text-muted-foreground font-sans">
              © {currentYear} OLD MONEY. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-[10px] text-muted-foreground/50 font-sans">Crafted with ✦ in Cairo</span>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
