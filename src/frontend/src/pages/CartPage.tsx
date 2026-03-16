import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import { PRODUCT_IMAGES } from "../utils/productImages";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, total } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div
          className="max-w-7xl mx-auto px-4 py-16 text-center"
          data-ocid="cart.empty_state"
        >
          <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-6">
            Add some amazing smartwatches to your cart!
          </p>
          <Link
            to="/products"
            className="gold-bg text-gray-900 font-bold px-6 py-3 rounded-lg"
            data-ocid="cart.shop_button"
          >
            Shop Now
          </Link>
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
          Shopping Cart ({cartItems.length} items)
        </h1>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            {cartItems.map((item, i) => {
              const img =
                PRODUCT_IMAGES[Number(item.productId) % PRODUCT_IMAGES.length];
              return (
                <div
                  key={item.productId.toString()}
                  className="bg-white rounded-xl p-4 shadow-sm flex gap-4"
                  data-ocid={`cart.item.${i + 1}`}
                >
                  <img
                    src={img}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-yellow-600 font-bold">
                      ₹{Number(item.price).toLocaleString("en-IN")}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="p-1.5 bg-gray-100 hover:bg-gray-200"
                          data-ocid={`cart.qty_minus_button.${i + 1}`}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="p-1.5 bg-gray-100 hover:bg-gray-200"
                          data-ocid={`cart.qty_plus_button.${i + 1}`}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId)}
                        className="text-red-400 hover:text-red-600 transition-colors"
                        data-ocid={`cart.remove_button.${i + 1}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      ₹
                      {(Number(item.price) * item.quantity).toLocaleString(
                        "en-IN",
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:w-80">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="font-bold text-lg mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery</span>
                  <span className="text-green-600">
                    {total >= 999 ? "FREE" : "₹49"}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>
                    ₹{(total + (total >= 999 ? 0 : 49)).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="w-full gold-bg text-gray-900 font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
                data-ocid="cart.checkout_button"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
