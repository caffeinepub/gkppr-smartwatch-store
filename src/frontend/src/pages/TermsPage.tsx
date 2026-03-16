import { FileText } from "lucide-react";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText size={32} className="text-yellow-600" />
            <h1 className="text-2xl font-bold text-gray-800">
              Terms & Conditions
            </h1>
          </div>
          <div className="prose text-gray-700 space-y-4">
            <p className="text-sm text-gray-500">Last updated: March 2026</p>
            <p>
              By using GKPPR Smartwatch Store, you agree to these terms and
              conditions. Please read them carefully.
            </p>
            <h3 className="font-bold text-gray-800">1. Acceptance of Terms</h3>
            <p>
              By accessing and using this website, you accept and agree to be
              bound by these terms. If you do not agree, please do not use our
              service.
            </p>
            <h3 className="font-bold text-gray-800">2. Products and Pricing</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                All prices are in Indian Rupees (₹) and include applicable
                taxes.
              </li>
              <li>
                We reserve the right to change prices without prior notice.
              </li>
              <li>Product images are for illustration purposes only.</li>
            </ul>
            <h3 className="font-bold text-gray-800">3. Orders and Payments</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Orders are subject to availability.</li>
              <li>We accept Cash on Delivery (COD) and Online Payment.</li>
              <li>COD orders must be paid in full at the time of delivery.</li>
            </ul>
            <h3 className="font-bold text-gray-800">
              4. Shipping and Delivery
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>We deliver across India within 3-7 working days.</li>
              <li>Free shipping on orders above ₹999.</li>
              <li>Delivery times may vary based on location.</li>
            </ul>
            <h3 className="font-bold text-gray-800">5. Returns and Refunds</h3>
            <p>
              Please refer to our{" "}
              <a
                href="/return-policy"
                className="text-yellow-600 hover:underline"
              >
                Return & Refund Policy
              </a>{" "}
              for detailed information.
            </p>
            <h3 className="font-bold text-gray-800">
              6. Limitation of Liability
            </h3>
            <p>
              GKPPR Store shall not be liable for any indirect, incidental, or
              consequential damages arising from the use of our products or
              services.
            </p>
            <p className="text-sm text-gray-500 mt-6">
              Contact: legal@gkppr.in
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
