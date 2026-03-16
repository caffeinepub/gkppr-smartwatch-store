import { Package, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { type Order, OrderStatus } from "../backend";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: "bg-yellow-100 text-yellow-700",
  [OrderStatus.Confirmed]: "bg-blue-100 text-blue-700",
  [OrderStatus.Shipped]: "bg-purple-100 text-purple-700",
  [OrderStatus.Delivered]: "bg-green-100 text-green-700",
  [OrderStatus.Cancelled]: "bg-red-100 text-red-700",
};

const SKELETONS = Array.from({ length: 3 }, (_, i) => i);

export default function OrdersPage() {
  const { actor } = useActor();
  const { identity, login } = useInternetIdentity();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningOrderId, setReturningOrderId] = useState<bigint | null>(null);
  const [returnReason, setReturnReason] = useState("");

  useEffect(() => {
    if (!actor || !identity) {
      setLoading(false);
      return;
    }
    actor
      .getOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [actor, identity]);

  const handleReturn = async (orderId: bigint) => {
    if (!actor || !returnReason.trim()) return;
    try {
      await actor.submitReturnRequest(orderId, returnReason);
      alert("Return request submitted successfully!");
      setReturningOrderId(null);
      setReturnReason("");
    } catch (e) {
      console.error(e);
    }
  };

  if (!identity) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <Package size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Sign in to view your orders
          </h2>
          <button
            type="button"
            onClick={login}
            className="gold-bg text-gray-900 font-bold px-6 py-3 rounded-lg"
            data-ocid="orders.login_button"
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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>
        {loading ? (
          <div className="space-y-4" data-ocid="orders.loading_state">
            {SKELETONS.map((n) => (
              <div key={n} className="bg-white rounded-xl h-32 animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16" data-ocid="orders.empty_state">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">
              No orders yet. Start shopping!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <div
                key={order.id.toString()}
                className="bg-white rounded-xl p-5 shadow-sm"
                data-ocid={`orders.item.${i + 1}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-800">
                      Order #{order.id.toString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(
                        Number(order.orderDate) / 1_000_000,
                      ).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {order.items.length} item(s) • {order.paymentMethod}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">📍 {order.address}</p>
                {order.status === OrderStatus.Delivered &&
                  returningOrderId !== order.id && (
                    <button
                      type="button"
                      onClick={() => setReturningOrderId(order.id)}
                      className="flex items-center gap-2 text-sm text-orange-600 border border-orange-300 px-3 py-1.5 rounded-lg hover:bg-orange-50"
                      data-ocid={`orders.return_button.${i + 1}`}
                    >
                      <RotateCcw size={14} /> Request Return
                    </button>
                  )}
                {returningOrderId === order.id && (
                  <div
                    className="mt-3 p-3 bg-orange-50 rounded-lg"
                    data-ocid={`orders.return_form.${i + 1}`}
                  >
                    <textarea
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                      placeholder="Reason for return..."
                      rows={2}
                      className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 mb-2"
                      data-ocid="orders.return_reason_textarea"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleReturn(order.id)}
                        className="text-sm bg-orange-500 text-white px-4 py-1.5 rounded font-medium"
                        data-ocid="orders.return_submit_button"
                      >
                        Submit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setReturningOrderId(null);
                          setReturnReason("");
                        }}
                        className="text-sm border px-4 py-1.5 rounded"
                        data-ocid="orders.return_cancel_button"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
