import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../backend";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function WishlistPage() {
  const { actor } = useActor();
  const { identity, login } = useInternetIdentity();
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlistIds, setWishlistIds] = useState<bigint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actor || !identity) {
      setLoading(false);
      return;
    }
    const load = async () => {
      try {
        const [allProds, wl] = await Promise.all([
          actor.getProducts(),
          actor.getWishlist(),
        ]);
        setWishlistIds(wl);
        setProducts(allProds.filter((p) => wl.some((w) => w === p.id)));
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    load();
  }, [actor, identity]);

  const handleWishlist = async (id: bigint) => {
    if (!actor) return;
    await actor.removeFromWishlist(id);
    setProducts((p) => p.filter((prod) => prod.id !== id));
    setWishlistIds((w) => w.filter((wid) => wid !== id));
  };

  if (!identity) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <Heart size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Sign in to view your wishlist
          </h2>
          <button
            type="button"
            onClick={login}
            className="gold-bg text-gray-900 font-bold px-6 py-3 rounded-lg"
            data-ocid="wishlist.login_button"
          >
            Login
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          My Wishlist ({products.length})
        </h1>
        {loading ? (
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            data-ocid="wishlist.loading_state"
          >
            {Array.from({ length: 4 }, (_, i) => i).map((n) => (
              <div key={n} className="bg-white rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16" data-ocid="wishlist.empty_state">
            <Heart size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg mb-4">
              Your wishlist is empty.
            </p>
            <Link
              to="/products"
              className="gold-bg text-gray-900 font-bold px-6 py-3 rounded-lg"
              data-ocid="wishlist.shop_button"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((p, i) => (
              <ProductCard
                key={p.id.toString()}
                product={p}
                index={i + 1}
                onWishlist={handleWishlist}
                isWishlisted={wishlistIds.some((w) => w === p.id)}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
