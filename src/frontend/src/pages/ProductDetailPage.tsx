import {
  ChevronLeft,
  Heart,
  RotateCcw,
  Shield,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Product, Review } from "../backend";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { PRODUCT_IMAGES } from "../utils/productImages";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { actor } = useActor();
  const { identity, login } = useInternetIdentity();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  const imageUrl = PRODUCT_IMAGES[Number(id) % PRODUCT_IMAGES.length];

  useEffect(() => {
    if (!actor || !id) return;
    const load = async () => {
      try {
        const [p, r, wl] = await Promise.all([
          actor.getProduct(BigInt(id)),
          actor.getReviews(BigInt(id)),
          identity ? actor.getWishlist() : Promise.resolve([] as bigint[]),
        ]);
        setProduct(p);
        setReviews(r);
        setIsWishlisted(wl.some((w) => w === BigInt(id)));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [actor, id, identity]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      productId: product.id,
      quantity: qty,
      name: product.name,
      price: product.price,
      imageUrl,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart({
      productId: product.id,
      quantity: qty,
      name: product.name,
      price: product.price,
      imageUrl,
    });
    navigate("/checkout");
  };

  const handleWishlist = async () => {
    if (!actor || !identity) {
      login();
      return;
    }
    if (!id) return;
    try {
      if (isWishlisted) {
        await actor.removeFromWishlist(BigInt(id));
        setIsWishlisted(false);
      } else {
        await actor.addToWishlist(BigInt(id));
        setIsWishlisted(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReview = async () => {
    if (!actor || !identity) {
      login();
      return;
    }
    if (!id || !reviewText.trim()) return;
    setSubmittingReview(true);
    try {
      await actor.addReview(BigInt(id), BigInt(reviewRating), reviewText);
      const r = await actor.getReviews(BigInt(id));
      setReviews(r);
      setReviewText("");
    } catch (e) {
      console.error(e);
    }
    setSubmittingReview(false);
  };

  if (loading)
    return (
      <div className="min-h-screen">
        <Header />
        <div
          className="flex justify-center items-center h-64"
          data-ocid="product_detail.loading_state"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500" />
        </div>
      </div>
    );
  if (!product)
    return (
      <div className="min-h-screen">
        <Header />
        <div
          className="text-center py-16"
          data-ocid="product_detail.error_state"
        >
          <p>Product not found.</p>
        </div>
      </div>
    );

  const STARS = [1, 2, 3, 4, 5];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 mb-4 hover:text-gray-800"
          data-ocid="product_detail.back_button"
        >
          <ChevronLeft size={18} /> Back
        </button>

        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full rounded-xl object-cover h-80"
              />
            </div>
            <div>
              <span className="text-xs font-medium text-yellow-600 uppercase tracking-wider">
                {product.category}
              </span>
              <h1 className="text-2xl font-bold text-gray-900 mt-1 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {STARS.map((s) => (
                    <Star
                      key={s}
                      size={16}
                      className={
                        s <= Math.round(product.rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-200 fill-gray-200"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {product.rating.toFixed(1)} ({reviews.length} reviews)
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-4">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </div>
              <p className="text-gray-600 mb-6">{product.description}</p>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                    data-ocid="product_detail.qty_minus_button"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-medium">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                    data-ocid="product_detail.qty_plus_button"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleWishlist}
                  className={`p-3 border rounded-lg transition-colors ${isWishlisted ? "bg-red-50 border-red-200 text-red-500" : "hover:bg-gray-50"}`}
                  data-ocid="product_detail.wishlist_button"
                >
                  <Heart
                    size={20}
                    fill={isWishlisted ? "currentColor" : "none"}
                  />
                </button>
              </div>

              <div className="flex gap-3 mb-6">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0n}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-colors ${addedToCart ? "bg-green-500 text-white" : "border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50"}`}
                  data-ocid="product_detail.add_to_cart_button"
                >
                  <ShoppingCart size={20} />
                  {addedToCart ? "Added!" : "Add to Cart"}
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0n}
                  className="flex-1 gold-bg text-gray-900 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                  data-ocid="product_detail.buy_now_button"
                >
                  Buy Now
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="bg-gray-50 rounded-lg p-3">
                  <Truck size={20} className="mx-auto mb-1 text-yellow-600" />
                  <p className="font-medium">Fast Delivery</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <RotateCcw
                    size={20}
                    className="mx-auto mb-1 text-yellow-600"
                  />
                  <p className="font-medium">7-Day Returns</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <Shield size={20} className="mx-auto mb-1 text-yellow-600" />
                  <p className="font-medium">Genuine Product</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
          {reviews.length === 0 && (
            <p className="text-gray-500" data-ocid="reviews.empty_state">
              No reviews yet. Be the first!
            </p>
          )}
          <div className="space-y-4 mb-6">
            {reviews.map((r, i) => (
              <div
                key={`${r.user.toString()}-${i}`}
                className="border-b pb-4"
                data-ocid={`reviews.item.${i + 1}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex">
                    {STARS.map((s) => (
                      <Star
                        key={s}
                        size={12}
                        className={
                          s <= Number(r.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-200"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    {r.user.toString().slice(0, 8)}...
                  </span>
                </div>
                <p className="text-sm text-gray-700">{r.comment}</p>
              </div>
            ))}
          </div>
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Write a Review</h3>
            <div className="flex gap-2 mb-3">
              {STARS.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setReviewRating(s)}
                  data-ocid="reviews.rating_button"
                >
                  <Star
                    size={24}
                    className={
                      s <= reviewRating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }
                  />
                </button>
              ))}
            </div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience..."
              rows={3}
              className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              data-ocid="reviews.textarea"
            />
            <button
              type="button"
              onClick={handleReview}
              disabled={submittingReview || !reviewText.trim()}
              className="mt-2 gold-bg text-gray-900 font-semibold px-6 py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
              data-ocid="reviews.submit_button"
            >
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
