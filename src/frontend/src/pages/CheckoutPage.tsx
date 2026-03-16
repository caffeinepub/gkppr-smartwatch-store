import { CheckCircle, CreditCard, Truck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PaymentMethod } from "../backend";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { PRODUCT_IMAGES } from "../utils/productImages";

type FormField = "name" | "phone" | "address" | "city" | "state" | "pincode";

const ADDRESS_FIELDS: [FormField, string][] = [
  ["name", "Full Name *"],
  ["phone", "Phone Number *"],
  ["address", "Address *"],
  ["city", "City *"],
  ["state", "State"],
  ["pincode", "PIN Code *"],
];

export default function CheckoutPage() {
  const { cartItems, total, clearCart } = useCart();
  const { actor } = useActor();
  const { identity, login } = useInternetIdentity();
  const navigate = useNavigate();

  const [form, setForm] = useState<Record<FormField, string>>({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [payment, setPayment] = useState<PaymentMethod>(PaymentMethod.COD);
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePlace = async () => {
    if (!actor) return;
    if (!identity) {
      login();
      return;
    }
    if (
      !form.name ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.pincode
    ) {
      alert("Please fill all required fields.");
      return;
    }
    setPlacing(true);
    try {
      const address = `${form.name}, ${form.address}, ${form.city}, ${form.state} - ${form.pincode}. Phone: ${form.phone}`;
      const items = cartItems.map((i) => ({
        productId: i.productId,
        quantity: BigInt(i.quantity),
      }));
      await actor.placeOrder(items, address, payment);
      clearCart();
      setSuccess(true);
    } catch (e) {
      console.error(e);
      alert("Order placement failed. Please try again.");
    }
    setPlacing(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div
          className="max-w-lg mx-auto px-4 py-16 text-center"
          data-ocid="checkout.success_state"
        >
          <CheckCircle size={80} className="mx-auto text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Order Placed Successfully!
          </h2>
          <p className="text-gray-600 mb-2">
            Thank you for shopping with GKPPR Store.
          </p>
          {payment === PaymentMethod.COD && (
            <p className="text-orange-600 font-medium mb-6">
              Pay ₹{(total + (total >= 999 ? 0 : 49)).toLocaleString("en-IN")}{" "}
              on delivery.
            </p>
          )}
          <div className="flex gap-3 justify-center">
            <button
              type="button"
              onClick={() => navigate("/orders")}
              className="gold-bg text-gray-900 font-bold px-6 py-3 rounded-lg"
              data-ocid="checkout.view_orders_button"
            >
              View Orders
            </button>
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50"
              data-ocid="checkout.continue_shopping_button"
            >
              Continue Shopping
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Truck size={20} className="text-yellow-600" /> Delivery Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ADDRESS_FIELDS.map(([field, label]) => (
                  <div
                    key={field}
                    className={field === "address" ? "md:col-span-2" : ""}
                  >
                    <label
                      htmlFor={`checkout-${field}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {label}
                    </label>
                    <input
                      id={`checkout-${field}`}
                      type="text"
                      value={form[field]}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, [field]: e.target.value }))
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      data-ocid={`checkout.${field}_input`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <CreditCard size={20} className="text-yellow-600" /> Payment
                Method
              </h2>
              <div className="space-y-3">
                <label
                  htmlFor="payment-cod"
                  className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-colors ${payment === PaymentMethod.COD ? "border-yellow-400 bg-yellow-50" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <input
                    id="payment-cod"
                    type="radio"
                    name="payment"
                    checked={payment === PaymentMethod.COD}
                    onChange={() => setPayment(PaymentMethod.COD)}
                    className="accent-yellow-500"
                    data-ocid="checkout.cod_radio"
                  />
                  <div>
                    <p className="font-semibold">Cash on Delivery</p>
                    <p className="text-xs text-gray-500">
                      Pay when your order arrives
                    </p>
                  </div>
                  <span className="ml-auto text-2xl">💵</span>
                </label>
                <label
                  htmlFor="payment-online"
                  className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-colors ${payment === PaymentMethod.Online ? "border-yellow-400 bg-yellow-50" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <input
                    id="payment-online"
                    type="radio"
                    name="payment"
                    checked={payment === PaymentMethod.Online}
                    onChange={() => setPayment(PaymentMethod.Online)}
                    className="accent-yellow-500"
                    data-ocid="checkout.online_radio"
                  />
                  <div>
                    <p className="font-semibold">Online Payment</p>
                    <p className="text-xs text-gray-500">
                      UPI, Debit/Credit Card, Net Banking
                    </p>
                  </div>
                  <span className="ml-auto text-2xl">💳</span>
                </label>
              </div>
            </div>
          </div>

          <div className="lg:w-80">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="font-bold text-lg mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {cartItems.map((item, i) => {
                  const img =
                    PRODUCT_IMAGES[
                      Number(item.productId) % PRODUCT_IMAGES.length
                    ];
                  return (
                    <div
                      key={item.productId.toString()}
                      className="flex items-center gap-3"
                      data-ocid={`checkout.order_item.${i + 1}`}
                    >
                      <img
                        src={img}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 text-sm">
                        <p className="font-medium line-clamp-1">{item.name}</p>
                        <p className="text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-bold">
                        ₹
                        {(Number(item.price) * item.quantity).toLocaleString(
                          "en-IN",
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="border-t pt-3 space-y-2 mb-4">
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
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>
                    ₹{(total + (total >= 999 ? 0 : 49)).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handlePlace}
                disabled={placing || cartItems.length === 0}
                className="w-full gold-bg text-gray-900 font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                data-ocid="checkout.place_order_button"
              >
                {placing
                  ? "Placing Order..."
                  : `Place Order${payment === PaymentMethod.COD ? " (COD)" : ""}`}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
