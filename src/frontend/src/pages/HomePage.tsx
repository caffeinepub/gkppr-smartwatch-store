import { ChevronRight, RotateCcw, Shield, Star, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../backend";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import { useActor } from "../hooks/useActor";

const CATEGORIES = [
  { name: "Sport", emoji: "🏃", color: "from-blue-500 to-blue-700" },
  { name: "Fitness", emoji: "💪", color: "from-green-500 to-green-700" },
  { name: "Luxury", emoji: "👑", color: "from-yellow-500 to-yellow-700" },
  { name: "Budget", emoji: "💰", color: "from-purple-500 to-purple-700" },
  { name: "Kids", emoji: "🎮", color: "from-pink-500 to-pink-700" },
];

const TRUST_BADGES = [
  { title: "Free Delivery", desc: "On orders above ₹999", type: "truck" },
  { title: "7-Day Returns", desc: "Easy return policy", type: "return" },
  { title: "100% Genuine", desc: "Verified products only", type: "shield" },
  { title: "Top Rated", desc: "4.5+ average rating", type: "star" },
];

const SKELETONS_8 = Array.from({ length: 8 }, (_, i) => i);

export default function HomePage() {
  const { actor } = useActor();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actor) return;
    const loadProducts = async () => {
      try {
        let prods = await actor.getProducts();
        if (prods.length === 0) {
          await actor.seedProducts();
          prods = await actor.getProducts();
        }
        setProducts(prods);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [actor]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section
        className="navy-bg text-white py-16 px-4"
        data-ocid="home.hero_section"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <p className="text-yellow-400 font-medium mb-2 uppercase tracking-widest text-sm">
              Timeless Elegance & Precision
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Premium Smartwatches
              <br />
              <span className="gold-text">For Every Lifestyle</span>
            </h1>
            <p className="text-gray-300 mb-6 text-lg">
              Explore India's finest collection of smartwatches. Fast delivery,
              easy returns, and genuine products guaranteed.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link
                to="/products"
                className="gold-bg text-gray-900 font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
                data-ocid="home.shop_now_button"
              >
                Shop Now
              </Link>
              <Link
                to="/products?category=Luxury"
                className="border border-yellow-400 text-yellow-400 font-bold px-6 py-3 rounded-lg hover:bg-yellow-400/10 transition-colors"
                data-ocid="home.luxury_button"
              >
                View Luxury
              </Link>
            </div>
          </div>
          <div className="flex-shrink-0">
            <img
              src="/assets/uploads/WhatsApp-Image-2026-03-10-at-11.31.23-PM-1.jpeg"
              alt="GKPPR Store"
              className="w-64 h-64 object-contain"
            />
          </div>
        </div>
      </section>

      <section className="bg-white border-b py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {TRUST_BADGES.map((b) => (
            <div key={b.type} className="flex items-center gap-3 p-3">
              {b.type === "truck" && (
                <Truck size={24} className="text-yellow-600" />
              )}
              {b.type === "return" && (
                <RotateCcw size={24} className="text-yellow-600" />
              )}
              {b.type === "shield" && (
                <Shield size={24} className="text-yellow-600" />
              )}
              {b.type === "star" && (
                <Star size={24} className="text-yellow-600" />
              )}
              <div>
                <p className="font-semibold text-sm text-gray-800">{b.title}</p>
                <p className="text-xs text-gray-500">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="max-w-7xl mx-auto px-4 py-10"
        data-ocid="home.categories_section"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Shop by Category</h2>
          <Link
            to="/products"
            className="text-yellow-600 hover:text-yellow-700 font-medium flex items-center gap-1"
            data-ocid="home.view_all_link"
          >
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.name}`}
              data-ocid={`home.category.item.${i + 1}`}
            >
              <div
                className={`bg-gradient-to-br ${cat.color} text-white rounded-xl p-6 text-center hover:scale-105 transition-transform cursor-pointer shadow-md`}
              >
                <div className="text-3xl mb-2">{cat.emoji}</div>
                <p className="font-semibold">{cat.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section
        className="max-w-7xl mx-auto px-4 py-6"
        data-ocid="home.featured_section"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Featured Watches</h2>
          <Link
            to="/products"
            className="text-yellow-600 hover:text-yellow-700 font-medium flex items-center gap-1"
            data-ocid="home.view_all_products_link"
          >
            View All <ChevronRight size={16} />
          </Link>
        </div>
        {loading ? (
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            data-ocid="home.loading_state"
          >
            {SKELETONS_8.map((n) => (
              <div key={n} className="bg-white rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.slice(0, 8).map((p, i) => (
              <ProductCard key={p.id.toString()} product={p} index={i + 1} />
            ))}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Special Offer
          </h3>
          <p className="text-gray-800 mb-4">
            Get flat 10% off on your first order! Use code{" "}
            <strong>GKPPR10</strong>
          </p>
          <Link
            to="/products"
            className="navy-bg text-white font-bold px-6 py-3 rounded-lg inline-block hover:opacity-90"
            data-ocid="home.promo_button"
          >
            Shop Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
