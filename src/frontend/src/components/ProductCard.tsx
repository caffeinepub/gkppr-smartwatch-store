import { Heart, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "../backend";
import { useCart } from "../context/CartContext";
import { PRODUCT_IMAGES } from "../utils/productImages";

interface Props {
  product: Product;
  index?: number;
  onWishlist?: (id: bigint) => void;
  isWishlisted?: boolean;
}

export default function ProductCard({
  product,
  index = 1,
  onWishlist,
  isWishlisted,
}: Props) {
  const { addToCart } = useCart();
  const imageUrl = PRODUCT_IMAGES[Number(product.id) % PRODUCT_IMAGES.length];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      productId: product.id,
      quantity: 1,
      name: product.name,
      price: product.price,
      imageUrl,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    onWishlist?.(product.id);
  };

  return (
    <Link to={`/product/${product.id}`} data-ocid={`product.item.${index}`}>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden group">
        <div className="relative">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop";
            }}
          />
          {onWishlist && (
            <button
              type="button"
              onClick={handleWishlist}
              className={`absolute top-2 right-2 p-2 rounded-full shadow transition-colors ${
                isWishlisted
                  ? "bg-red-500 text-white"
                  : "bg-white text-gray-400 hover:text-red-500"
              }`}
              data-ocid={`product.wishlist_button.${index}`}
            >
              <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          )}
          {product.stock <= 5n && product.stock > 0n && (
            <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
              Only {product.stock.toString()} left
            </span>
          )}
          {product.stock === 0n && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              Out of Stock
            </span>
          )}
        </div>
        <div className="p-3">
          <p className="text-xs text-yellow-600 font-medium mb-1">
            {product.category}
          </p>
          <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mb-2">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-gray-500">
              {product.rating.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-900">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </span>
            <button
              type="button"
              onClick={handleAddToCart}
              className="p-2 gold-bg rounded-lg hover:opacity-90 transition-opacity"
              data-ocid={`product.add_cart_button.${index}`}
            >
              <ShoppingCart size={16} className="text-gray-900" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
