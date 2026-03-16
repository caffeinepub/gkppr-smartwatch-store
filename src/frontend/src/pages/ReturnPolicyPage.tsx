import { RotateCcw } from "lucide-react";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <RotateCcw size={32} className="text-yellow-600" />
            <h1 className="text-2xl font-bold text-gray-800">
              Return & Refund Policy
            </h1>
          </div>
          <div className="prose text-gray-700 space-y-4">
            <p className="text-lg font-semibold text-yellow-700">
              7-Day Easy Return Policy
            </p>
            <p>
              At GKPPR Smartwatch Store, we want you to be completely satisfied
              with your purchase. If for any reason you are not satisfied, you
              may return the product within 7 days of delivery.
            </p>
            <h3 className="font-bold text-gray-800 mt-4">Return Conditions</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Item must be in original, unused condition with all accessories
                and packaging intact.
              </li>
              <li>Return request must be raised within 7 days of delivery.</li>
              <li>
                Item should not have any physical damage caused after delivery.
              </li>
              <li>Original invoice/receipt must be provided.</li>
            </ul>
            <h3 className="font-bold text-gray-800 mt-4">
              Non-Returnable Items
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Items damaged due to misuse or accident.</li>
              <li>Products with tampered serial numbers.</li>
              <li>Items returned after 7 days of delivery.</li>
            </ul>
            <h3 className="font-bold text-gray-800 mt-4">Refund Process</h3>
            <p>
              Once we receive and inspect the returned item, we will process
              your refund within <strong>5-7 business days</strong>. Refunds
              will be issued to the original payment method.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Online Payments:</strong> Refunded to original payment
                method within 5-7 working days.
              </li>
              <li>
                <strong>Cash on Delivery:</strong> Refunded via bank transfer
                within 7-10 working days.
              </li>
            </ul>
            <h3 className="font-bold text-gray-800 mt-4">
              How to Initiate a Return
            </h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                Go to <strong>My Orders</strong> section.
              </li>
              <li>Select the delivered order you wish to return.</li>
              <li>
                Click <strong>Request Return</strong> and provide the reason.
              </li>
              <li>
                Our team will contact you within 24-48 hours to arrange pickup.
              </li>
            </ol>
            <p className="text-sm text-gray-500 mt-6">
              For any queries, contact us at support@gkppr.in
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
