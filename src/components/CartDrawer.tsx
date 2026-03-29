import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingBag, Minus, Plus, X, ExternalLink, Loader2, MessageCircle } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    items, staticItems, isLoading, isSyncing,
    updateQuantity, removeItem,
    updateStaticQuantity, removeStaticItem,
    getCheckoutUrl, syncCart, getTotalItems, getTotalPrice,
  } = useCartStore();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const currency = staticItems[0]?.currency || items[0]?.price.currencyCode || "EGP";

  useEffect(() => { if (isOpen) syncCart(); }, [isOpen, syncCart]);

  const handleCheckout = () => {
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl && items.length > 0) {
      window.open(checkoutUrl, '_blank');
      setIsOpen(false);
      return;
    }
    // WhatsApp order for static items
    if (staticItems.length > 0) {
      const lines = staticItems.map(i => `• ${i.title} (${i.size}) x${i.quantity} — ${i.currency} ${(i.price * i.quantity).toLocaleString()}`).join('\n');
      const msg = encodeURIComponent(`Hi! I'd like to order:\n\n${lines}\n\nTotal: ${currency} ${totalPrice.toLocaleString()}`);
      window.open(`https://wa.me/?text=${msg}`, '_blank');
      setIsOpen(false);
    }
  };

  const hasItems = items.length > 0 || staticItems.length > 0;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="relative p-2.5 text-foreground/70 hover:text-foreground transition-colors duration-300 hover:bg-foreground/5 rounded-full" aria-label={`Shopping bag, ${totalItems} items`}>
          <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
          <AnimatePresence>
            {totalItems > 0 && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 500, damping: 25 }}>
                <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 rounded-full p-0 flex items-center justify-center text-[9px] font-sans font-medium bg-foreground text-background border-0">
                  {totalItems}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-[420px] flex flex-col h-full bg-background p-0 border-l border-border/30">
        <SheetHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-border/30">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-serif text-2xl">Bag</SheetTitle>
            <span className="text-xs text-muted-foreground font-sans">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
          </div>
        </SheetHeader>

        <div className="flex flex-col flex-1 min-h-0">
          {!hasItems ? (
            <div className="flex-1 flex items-center justify-center px-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <p className="text-sm text-foreground font-sans">Your bag is empty</p>
                <p className="text-xs text-muted-foreground mt-1 font-sans">Add something beautiful</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto min-h-0 px-6">
                {/* Static items */}
                {staticItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    className="flex gap-4 py-5 border-b border-border/30 last:border-0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={`/product/static/${item.handle}`}
                      onClick={() => setIsOpen(false)}
                      className="w-[72px] h-[90px] bg-secondary rounded-lg overflow-hidden flex-shrink-0 hover:opacity-80 transition-opacity"
                    >
                      <img src={item.image} alt={item.title} className="w-full h-full object-contain mix-blend-multiply p-1" />
                    </Link>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif text-sm leading-snug">{item.title}</h4>
                        <p className="text-[10px] text-muted-foreground mt-0.5 font-sans">Size: {item.size}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3">
                          <button className="w-7 h-7 flex items-center justify-center rounded-full border border-border hover:border-foreground/30 transition-colors active:scale-90" onClick={() => updateStaticQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity">
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-5 text-center text-xs tabular-nums font-sans font-medium">{item.quantity}</span>
                          <button className="w-7 h-7 flex items-center justify-center rounded-full border border-border hover:border-foreground/30 transition-colors active:scale-90" onClick={() => updateStaticQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity">
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-sans font-medium">{item.currency} {(item.price * item.quantity).toLocaleString()}</span>
                          <button className="text-muted-foreground hover:text-foreground transition-colors active:scale-90" onClick={() => removeStaticItem(item.id)} aria-label="Remove item">
                            <X className="h-4 w-4" strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Shopify items */}
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-4 py-5 border-b border-border/30 last:border-0">
                    <div className="w-[72px] h-[90px] bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                      {item.product.node.images?.edges?.[0]?.node && (
                        <img src={item.product.node.images.edges[0].node.url} alt={item.product.node.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif text-sm leading-snug">{item.product.node.title}</h4>
                        <p className="text-[10px] text-muted-foreground mt-0.5 font-sans">{item.selectedOptions.map(o => o.value).join(' · ')}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3">
                          <button className="w-7 h-7 flex items-center justify-center rounded-full border border-border hover:border-foreground/30 transition-colors active:scale-90" onClick={() => updateQuantity(item.variantId, item.quantity - 1)}>
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-5 text-center text-xs tabular-nums font-sans font-medium">{item.quantity}</span>
                          <button className="w-7 h-7 flex items-center justify-center rounded-full border border-border hover:border-foreground/30 transition-colors active:scale-90" onClick={() => updateQuantity(item.variantId, item.quantity + 1)}>
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-sans font-medium">{item.price.currencyCode} {parseFloat(item.price.amount).toLocaleString()}</span>
                          <button className="text-muted-foreground hover:text-foreground transition-colors active:scale-90" onClick={() => removeItem(item.variantId)}>
                            <X className="h-4 w-4" strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex-shrink-0 px-6 py-5 border-t border-border/30 bg-background space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase tracking-[0.15em] font-sans font-medium text-muted-foreground">Subtotal</span>
                  <span className="font-serif text-lg">{currency} {totalPrice.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-muted-foreground font-sans">Shipping calculated at checkout</p>
                <button
                  onClick={handleCheckout}
                  className="w-full h-13 bg-foreground text-background rounded-full text-[11px] uppercase tracking-[0.18em] font-sans font-medium hover:bg-foreground/85 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                  disabled={!hasItems || isLoading || isSyncing}
                >
                  {isLoading || isSyncing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : staticItems.length > 0 && items.length === 0 ? (
                    <>Order via WhatsApp <MessageCircle className="w-3.5 h-3.5" /></>
                  ) : (
                    <>Checkout <ExternalLink className="w-3.5 h-3.5" /></>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
