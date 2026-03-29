import { Home, Search, Heart, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { Badge } from "@/components/ui/badge";

interface MobileBottomNavProps {
  onSearchOpen: () => void;
}

export function MobileBottomNav({ onSearchOpen }: MobileBottomNavProps) {
  const location = useLocation();
  const totalItems = useCartStore((s) => s.getTotalItems());
  const wishlistCount = useWishlistStore((s) => s.ids.length);

  const items = [
    { icon: Home, label: "Home", to: "/", action: undefined },
    { icon: Search, label: "Search", to: undefined, action: onSearchOpen },
    { icon: Heart, label: "Wishlist", to: "/wishlist", action: undefined },
    { icon: ShoppingBag, label: "Bag", to: undefined, action: undefined },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass border-t border-border/30"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-14">
        {items.map((item) => {
          const isActive = item.to ? location.pathname === item.to : false;
          const badge = item.label === "Bag" ? totalItems : item.label === "Wishlist" ? wishlistCount : 0;

          const content = (
            <div className="relative flex flex-col items-center gap-0.5 py-1 min-w-[44px] min-h-[44px] justify-center">
              <item.icon
                className={`h-5 w-5 transition-colors ${isActive ? "text-foreground" : "text-muted-foreground"}`}
                strokeWidth={1.5}
              />
              <span className={`text-[9px] font-sans tracking-wide ${isActive ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {item.label}
              </span>
              {badge > 0 && (
                <Badge className="absolute -top-0.5 right-0 h-3.5 min-w-3.5 rounded-full p-0 flex items-center justify-center text-[8px] font-sans bg-foreground text-background border-0">
                  {badge}
                </Badge>
              )}
            </div>
          );

          if (item.action) {
            return (
              <button key={item.label} onClick={item.action} className="focus-visible:outline-none" aria-label={item.label}>
                {content}
              </button>
            );
          }

          if (item.to) {
            return (
              <Link key={item.label} to={item.to} className="focus-visible:outline-none" aria-label={item.label}>
                {content}
              </Link>
            );
          }

          // Bag — just visual, CartDrawer handles it from header
          return <div key={item.label} className="opacity-50 pointer-events-none">{content}</div>;
        })}
      </div>
    </nav>
  );
}
