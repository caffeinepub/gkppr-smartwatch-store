import { Shield } from "lucide-react";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield size={32} className="text-yellow-600" />
            <h1 className="text-2xl font-bold text-gray-800">Privacy Policy</h1>
          </div>
          <div className="prose text-gray-700 space-y-4">
            <p className="text-sm text-gray-500">Last updated: March 2026</p>
            <p>
              GKPPR Smartwatch Store ("we", "our", "us") is committed to
              protecting your personal information. This policy explains how we
              collect, use, and protect your data.
            </p>
            <h3 className="font-bold text-gray-800">Information We Collect</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Name, email address, phone number</li>
              <li>Delivery address for order fulfillment</li>
              <li>Payment information (processed securely)</li>
              <li>Order history and browsing behavior</li>
            </ul>
            <h3 className="font-bold text-gray-800">
              How We Use Your Information
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>To process and fulfill your orders</li>
              <li>To send order confirmations and updates</li>
              <li>To improve our products and services</li>
              <li>To prevent fraud and ensure security</li>
            </ul>
            <h3 className="font-bold text-gray-800">Data Security</h3>
            <p>
              Your data is stored securely on the Internet Computer blockchain
              platform, which provides end-to-end encryption and decentralized
              security.
            </p>
            <h3 className="font-bold text-gray-800">Your Rights</h3>
            <p>
              You have the right to access, update, or delete your personal
              information at any time through your Profile page.
            </p>
            <p className="text-sm text-gray-500 mt-6">
              Contact: privacy@gkppr.in
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
