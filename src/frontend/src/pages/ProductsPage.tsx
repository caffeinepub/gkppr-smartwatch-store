import { Filter, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Category, type Product } from "../backend";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import { useActor } from "../hooks/useActor";

const CATEGORIES = ["All", ...Object.values(Category)];

export default function ProductsPage() {
  const { actor } = useActor();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") || "All",
  );
  const [sortBy, setSortBy] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(100000);
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    if (!actor) return;
    const load = async () => {
      try {
        let prods = await actor.getProducts();
        if (prods.length === 0) {
          await actor.seedProducts();
          prods = await actor.getProducts();
        }
        setProducts(prods);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [actor]);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  let filtered = products;
  if (selectedCategory !== "All")
    filtered = filtered.filter((p) => p.category === selectedCategory);
  if (searchQuery)
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  filtered = filtered.filter((p) => Number(p.price) <= maxPrice);
  if (sortBy === "price_asc")
    filtered = [...filtered].sort((a, b) => Number(a.price) - Number(b.price));
  else if (sortBy === "price_desc")
    filtered = [...filtered].sort((a, b) => Number(b.price) - Number(a.price));
  else if (sortBy === "rating")
    filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            {searchQuery
              ? `Search: "${searchQuery}"`
              : selectedCategory === "All"
                ? "All Smartwatches"
                : `${selectedCategory} Watches`}
          </h1>
          <span className="text-sm text-gray-500">
            {filtered.length} products
          </span>
        </div>

        <div className="flex gap-6">
          <aside
            className="hidden md:block w-56 flex-shrink-0"
            data-ocid="products.filter_panel"
          >
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Filter size={16} /> Filters
              </h3>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Category
                </p>
                {CATEGORIES.map((cat) => (
                  <label
                    key={cat}
                    htmlFor={`cat-${cat}`}
                    className="flex items-center gap-2 py-1 cursor-pointer"
                  >
                    <input
                      id={`cat-${cat}`}
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat}
                      onChange={() => setSelectedCategory(cat)}
                      className="text-yellow-500"
                      data-ocid="products.category_filter.radio"
                    />
                    <span className="text-sm text-gray-600">{cat}</span>
                  </label>
                ))}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Max Price: ₹{maxPrice.toLocaleString("en-IN")}
                </p>
                <input
                  type="range"
                  min={1000}
                  max={100000}
                  step={1000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-yellow-500"
                  data-ocid="products.price_range_input"
                />
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4 bg-white rounded-xl p-3 shadow-sm">
              <SlidersHorizontal size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border-none outline-none bg-transparent text-gray-700 font-medium"
                data-ocid="products.sort_select"
              >
                <option value="featured">Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-3 md:hidden">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat ? "gold-bg text-gray-900" : "bg-white text-gray-600 border"}`}
                  data-ocid="products.mobile_category_tab"
                >
                  {cat}
                </button>
              ))}
            </div>

            {loading ? (
              <div
                className="grid grid-cols-2 md:grid-cols-3 gap-4"
                data-ocid="products.loading_state"
              >
                {Array.from({ length: 9 }, (_, i) => i).map((n) => (
                  <div
                    key={n}
                    className="bg-white rounded-xl h-64 animate-pulse"
                  />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div
                className="text-center py-16"
                data-ocid="products.empty_state"
              >
                <p className="text-gray-500 text-lg">No products found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filtered.map((p, i) => (
                  <ProductCard
                    key={p.id.toString()}
                    product={p}
                    index={i + 1}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
