import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useCartSync } from "@/hooks/useCartSync";
import { CursorFollower } from "@/components/CursorFollower";
import Index from "./pages/Index.tsx";

const ProductDetail = lazy(() => import("./pages/ProductDetail.tsx"));
const StaticProductDetail = lazy(() => import("./pages/StaticProductDetail.tsx"));
const CategoryPage = lazy(() => import("./pages/CategoryPage.tsx"));
const WishlistPage = lazy(() => import("./pages/WishlistPage.tsx"));
const OutfitBuilder = lazy(() => import("./pages/OutfitBuilder.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
    </div>
  );
}

function AppContent() {
  useCartSync();
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/product/static/:handle" element={<StaticProductDetail />} />
          <Route path="/product/:handle" element={<ProductDetail />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/outfit-builder" element={<OutfitBuilder />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CursorFollower />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
