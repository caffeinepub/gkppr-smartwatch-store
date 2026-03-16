import { Heart, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Header() {
  const { cartCount } = useCart();
  const { identity, login, clear: logout } = useInternetIdentity();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="navy-bg text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0" data-ocid="header.link">
            <img
              src="/assets/uploads/WhatsApp-Image-2026-03-10-at-11.31.23-PM-1.jpeg"
              alt="GKPPR Smartwatch Store"
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search smartwatches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-12 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                data-ocid="header.search_input"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                data-ocid="header.search_button"
              >
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* Nav Icons */}
          <div className="flex items-center gap-3">
            <Link
              to="/wishlist"
              className="p-2 hover:text-yellow-400 transition-colors hidden md:block"
              data-ocid="header.wishlist_link"
            >
              <Heart size={22} />
            </Link>
            <Link
              to="/cart"
              className="p-2 hover:text-yellow-400 transition-colors relative"
              data-ocid="header.cart_link"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-gray-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {identity ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/profile"
                  className="p-2 hover:text-yellow-400 transition-colors"
                  data-ocid="header.profile_link"
                >
                  <User size={22} />
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="text-sm px-3 py-1 border border-white/30 rounded hover:bg-white/10 transition-colors"
                  data-ocid="header.logout_button"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={login}
                className="hidden md:block text-sm px-3 py-1 gold-bg text-gray-900 font-semibold rounded hover:opacity-90 transition-opacity"
                data-ocid="header.login_button"
              >
                Login
              </button>
            )}
            <button
              type="button"
              className="md:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              data-ocid="header.menu_button"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search smartwatches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pr-12 rounded-lg text-gray-900 text-sm focus:outline-none"
              data-ocid="header.mobile_search_input"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
              data-ocid="header.mobile_search_button"
            >
              <Search size={18} />
            </button>
          </div>
        </form>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/20 py-3 flex flex-col gap-3">
            <Link
              to="/wishlist"
              className="hover:text-yellow-400"
              onClick={() => setMenuOpen(false)}
              data-ocid="header.mobile_wishlist_link"
            >
              Wishlist
            </Link>
            <Link
              to="/orders"
              className="hover:text-yellow-400"
              onClick={() => setMenuOpen(false)}
              data-ocid="header.mobile_orders_link"
            >
              My Orders
            </Link>
            {identity ? (
              <>
                <Link
                  to="/profile"
                  className="hover:text-yellow-400"
                  onClick={() => setMenuOpen(false)}
                  data-ocid="header.mobile_profile_link"
                >
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="text-left hover:text-yellow-400"
                  data-ocid="header.mobile_logout_button"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  login();
                  setMenuOpen(false);
                }}
                className="text-left hover:text-yellow-400"
                data-ocid="header.mobile_login_button"
              >
                Login
              </button>
            )}
          </div>
        )}
      </div>

      {/* Category Nav */}
      <div className="bg-black/20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-6 overflow-x-auto py-2 text-sm font-medium scrollbar-hide">
            <Link
              to="/products"
              className="whitespace-nowrap hover:text-yellow-400 transition-colors"
              data-ocid="nav.all_link"
            >
              All Watches
            </Link>
            <Link
              to="/products?category=Sport"
              className="whitespace-nowrap hover:text-yellow-400 transition-colors"
              data-ocid="nav.sport_link"
            >
              Sport
            </Link>
            <Link
              to="/products?category=Fitness"
              className="whitespace-nowrap hover:text-yellow-400 transition-colors"
              data-ocid="nav.fitness_link"
            >
              Fitness
            </Link>
            <Link
              to="/products?category=Luxury"
              className="whitespace-nowrap hover:text-yellow-400 transition-colors"
              data-ocid="nav.luxury_link"
            >
              Luxury
            </Link>
            <Link
              to="/products?category=Budget"
              className="whitespace-nowrap hover:text-yellow-400 transition-colors"
              data-ocid="nav.budget_link"
            >
              Budget
            </Link>
            <Link
              to="/products?category=Kids"
              className="whitespace-nowrap hover:text-yellow-400 transition-colors"
              data-ocid="nav.kids_link"
            >
              Kids
            </Link>
            <Link
              to="/orders"
              className="whitespace-nowrap hover:text-yellow-400 transition-colors"
              data-ocid="nav.orders_link"
            >
              My Orders
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
