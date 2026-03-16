import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Review {
    user: Principal;
    productId: bigint;
    comment: string;
    rating: bigint;
}
export type Time = bigint;
export interface CartItem {
    productId: bigint;
    quantity: bigint;
}
export interface ReturnRequest {
    orderId: bigint;
    requestDate: Time;
    reason: string;
}
export interface Order {
    id: bigint;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    user: Principal;
    orderDate: Time;
    address: string;
    items: Array<CartItem>;
}
export interface Product {
    id: bigint;
    name: string;
    description: string;
    stock: bigint;
    imageUrl: string;
    category: Category;
    rating: number;
    price: bigint;
}
export interface UserProfile {
    name: string;
    email: string;
    address: string;
    phone: string;
}
export enum Category {
    Budget = "Budget",
    Luxury = "Luxury",
    Sport = "Sport",
    Kids = "Kids",
    Fitness = "Fitness"
}
export enum OrderStatus {
    Delivered = "Delivered",
    Confirmed = "Confirmed",
    Cancelled = "Cancelled",
    Shipped = "Shipped",
    Pending = "Pending"
}
export enum PaymentMethod {
    COD = "COD",
    Online = "Online"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addReview(productId: bigint, rating: bigint, comment: string): Promise<void>;
    addToCart(productId: bigint, quantity: bigint): Promise<void>;
    addToWishlist(productId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<CartItem>>;
    getOrders(): Promise<Array<Order>>;
    getProduct(id: bigint): Promise<Product>;
    getProducts(): Promise<Array<Product>>;
    getReturnRequests(): Promise<Array<ReturnRequest>>;
    getReviews(productId: bigint): Promise<Array<Review>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWishlist(): Promise<Array<bigint>>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(items: Array<CartItem>, address: string, paymentMethod: PaymentMethod): Promise<void>;
    removeCartItem(productId: bigint): Promise<void>;
    removeFromWishlist(productId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    seedProducts(): Promise<void>;
    submitReturnRequest(orderId: bigint, reason: string): Promise<void>;
    updateCartItem(productId: bigint, quantity: bigint): Promise<void>;
    updateOrderStatus(orderId: bigint, status: OrderStatus): Promise<void>;
}
