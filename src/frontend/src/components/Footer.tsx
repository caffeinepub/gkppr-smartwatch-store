import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="navy-bg text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img
              src="/assets/uploads/WhatsApp-Image-2026-03-10-at-11.31.23-PM-1.jpeg"
              alt="GKPPR Store"
              className="h-14 w-auto object-contain mb-3"
            />
            <p className="text-sm text-gray-300">
              Timeless Elegance & Precision. India's trusted smartwatch
              destination.
            </p>
          </div>
          <div>
            <h3 className="font-semibold gold-text mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link
                  to="/products"
                  className="hover:text-yellow-400"
                  data-ocid="footer.products_link"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className="hover:text-yellow-400"
                  data-ocid="footer.orders_link"
                >
                  My Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/wishlist"
                  className="hover:text-yellow-400"
                  data-ocid="footer.wishlist_link"
                >
                  Wishlist
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="hover:text-yellow-400"
                  data-ocid="footer.profile_link"
                >
                  My Profile
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold gold-text mb-3">Policies</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link
                  to="/return-policy"
                  className="hover:text-yellow-400"
                  data-ocid="footer.return_policy_link"
                >
                  Return & Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-yellow-400"
                  data-ocid="footer.privacy_link"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-yellow-400"
                  data-ocid="footer.terms_link"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold gold-text mb-3">We Accept</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <span className="bg-white/10 px-2 py-1 rounded text-xs font-medium">
                  COD
                </span>
                <span>Cash on Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-white/10 px-2 py-1 rounded text-xs font-medium">
                  UPI
                </span>
                <span>Online Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-white/10 px-2 py-1 rounded text-xs font-medium">
                  CARD
                </span>
                <span>Debit/Credit Card</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; 2026 GKPPR Smartwatch Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
