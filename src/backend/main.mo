import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Nat32 "mo:core/Nat32";
import Text "mo:core/Text";
import Int32 "mo:core/Int32";
import Float "mo:core/Float";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    category : Category;
    imageUrl : Text;
    stock : Nat;
    rating : Float;
  };

  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Nat.compare(p1.id, p2.id);
    };
  };

  type Category = {
    #Sport;
    #Luxury;
    #Budget;
    #Kids;
    #Fitness;
  };

  type CartItem = {
    productId : Nat;
    quantity : Nat;
  };

  type OrderStatus = {
    #Pending;
    #Confirmed;
    #Shipped;
    #Delivered;
    #Cancelled;
  };

  type PaymentMethod = {
    #COD;
    #Online;
  };

  type Order = {
    id : Nat;
    user : Principal;
    items : [CartItem];
    address : Text;
    paymentMethod : PaymentMethod;
    status : OrderStatus;
    orderDate : Time.Time;
  };

  type ReturnRequest = {
    orderId : Nat;
    reason : Text;
    requestDate : Time.Time;
  };

  type Review = {
    productId : Nat;
    user : Principal;
    rating : Nat;
    comment : Text;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
    address : Text;
  };

  let products = Map.fromIter<Nat, Product>(Iter.empty());
  let carts = Map.empty<Principal, List.List<CartItem>>();
  let orders = Map.empty<Nat, Order>();
  let wishlists = Map.empty<Principal, List.List<Nat>>();
  let returnRequests = Map.empty<Nat, ReturnRequest>();
  let reviews = Map.empty<Nat, List.List<Review>>();
  let nextOrderId = Map.fromIter<Principal, Nat>(Iter.empty());
  let nextReturnRequestId = Map.fromIter<Principal, Nat>(Iter.empty());
  let seeded = Map.empty<Nat, Bool>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Authorization state for role-based access control
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Management
  public shared ({ caller }) func seedProducts() : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can seed products");
    };

    if (products.isEmpty()) {
      let initialProducts : [Product] = [
        {
          id = 1;
          name = "FitPro X1";
          description = "Sporty smartwatch with heart rate monitor";
          price = 4999;
          category = #Sport;
          imageUrl = "https://example.com/fitpro.png";
          stock = 50;
          rating = 4.2;
        },
        {
          id = 2;
          name = "LuxuryTime";
          description = "Premium leather strap smartwatch";
          price = 15999;
          category = #Luxury;
          imageUrl = "https://example.com/luxurytime.png";
          stock = 30;
          rating = 4.8;
        },
        {
          id = 3;
          name = "BudgetBeats";
          description = "Affordable fitness tracking smartwatch";
          price = 2999;
          category = #Budget;
          imageUrl = "https://example.com/budgetbeats.png";
          stock = 100;
          rating = 4.0;
        },
        {
          id = 4;
          name = "KidzWatch";
          description = "Colorful smartwatch for kids with GPS";
          price = 6999;
          category = #Kids;
          imageUrl = "https://example.com/kidzwatch.png";
          stock = 40;
          rating = 4.5;
        },
        {
          id = 5;
          name = "FitPro X2";
          description = "Advanced fitness metrics and waterproof design";
          price = 7499;
          category = #Sport;
          imageUrl = "https://example.com/fitprox2.png";
          stock = 60;
          rating = 4.6;
        },
        {
          id = 6;
          name = "EliteTime";
          description = "High-end luxury smartwatch with sapphire glass";
          price = 24999;
          category = #Luxury;
          imageUrl = "https://example.com/elittime.png";
          stock = 20;
          rating = 4.9;
        },
        {
          id = 7;
          name = "BudgetBeats Pro";
          description = "Enhanced budget smartwatch with music control";
          price = 3999;
          category = #Budget;
          imageUrl = "https://example.com/budgetbeatspro.png";
          stock = 80;
          rating = 4.3;
        },
        {
          id = 8;
          name = "KidzWatch Lite";
          description = "Lightweight smartwatch for kids";
          price = 4999;
          category = #Kids;
          imageUrl = "https://example.com/kidzwatchlite.png";
          stock = 50;
          rating = 4.2;
        },
        {
          id = 9;
          name = "FitPro Ultra";
          description = "Professional-grade smartwatch for athletes";
          price = 12999;
          category = #Fitness;
          imageUrl = "https://example.com/fitproultra.png";
          stock = 35;
          rating = 4.7;
        },
        {
          id = 10;
          name = "LuxuryTime Classic";
          description = "Classic design luxury smartwatch";
          price = 18999;
          category = #Luxury;
          imageUrl = "https://example.com/luxurytimeclassic.png";
          stock = 25;
          rating = 4.8;
        },
        {
          id = 11;
          name = "BudgetBeats Lite";
          description = "Minimalist budget smartwatch for everyday use";
          price = 2499;
          category = #Budget;
          imageUrl = "https://example.com/budgetbeatslite.png";
          stock = 120;
          rating = 3.9;
        },
        {
          id = 12;
          name = "KidzWatch Pro";
          description = "Feature-rich smartwatch for kids";
          price = 8999;
          category = #Kids;
          imageUrl = "https://example.com/kidzwatchpro.png";
          stock = 30;
          rating = 4.6;
        },
      ];

      for (product in initialProducts.values()) {
        products.add(product.id, product);
      };
      seeded.add(0, true);
    };
  };

  public query func getProducts() : async [Product] {
    // Public access - no authorization check needed
    products.values().toArray().sort();
  };

  public query func getProduct(id : Nat) : async Product {
    // Public access - no authorization check needed
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  // Shopping Cart Management
  public query ({ caller }) func getCart() : async [CartItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view cart");
    };
    switch (carts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart.toArray() };
    };
  };

  public shared ({ caller }) func addToCart(productId : Nat, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add to cart");
    };
    let cart = switch (carts.get(caller)) {
      case (null) { List.empty<CartItem>() };
      case (?existingCart) { existingCart };
    };
    cart.add({ productId; quantity });
    carts.add(caller, cart);
  };

  public shared ({ caller }) func updateCartItem(productId : Nat, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update cart");
    };
    switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart not found") };
      case (?existingCart) {
        let filteredCart = existingCart.filter(func(item) { item.productId != productId });
        filteredCart.add({ productId; quantity });
        carts.add(caller, filteredCart);
      };
    };
  };

  public shared ({ caller }) func removeCartItem(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove from cart");
    };
    switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart not found") };
      case (?existingCart) {
        let filteredCart = existingCart.filter(func(item) { item.productId != productId });
        carts.add(caller, filteredCart);
      };
    };
  };

  // Order Management
  public shared ({ caller }) func placeOrder(items : [CartItem], address : Text, paymentMethod : PaymentMethod) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };

    // Get and increment next order ID for the caller
    let currentOrderId = switch (nextOrderId.get(caller)) {
      case (null) {
        nextOrderId.add(caller, 2); // Start with 2 for the next order
        1; // First order ID
      };
      case (?id) {
        nextOrderId.add(caller, id + 1);
        id;
      };
    };

    let order : Order = {
      id = currentOrderId;
      user = caller;
      items;
      address;
      paymentMethod;
      status = #Pending;
      orderDate = Time.now();
    };

    orders.add(currentOrderId, order);
  };

  public query ({ caller }) func getOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };
    let userOrders = orders.filter(func(_, order) { order.user == caller });
    userOrders.values().toArray();
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : OrderStatus) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder : Order = { order with status };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  // Wishlist Management
  public shared ({ caller }) func addToWishlist(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add to wishlist");
    };
    let wishlist = switch (wishlists.get(caller)) {
      case (null) { List.empty<Nat>() };
      case (?existingWishlist) { existingWishlist };
    };
    wishlist.add(productId);
    wishlists.add(caller, wishlist);
  };

  public shared ({ caller }) func removeFromWishlist(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove from wishlist");
    };
    switch (wishlists.get(caller)) {
      case (null) { Runtime.trap("Wishlist not found") };
      case (?existingWishlist) {
        let filteredWishlist = existingWishlist.filter(func(id) { id != productId });
        wishlists.add(caller, filteredWishlist);
      };
    };
  };

  public query ({ caller }) func getWishlist() : async [Nat] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view wishlist");
    };
    switch (wishlists.get(caller)) {
      case (null) { [] };
      case (?wishlist) { wishlist.toArray() };
    };
  };

  // Return Request Management
  public shared ({ caller }) func submitReturnRequest(orderId : Nat, reason : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit return requests");
    };

    // Verify the order belongs to the caller
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        if (order.user != caller) {
          Runtime.trap("Unauthorized: Can only submit return requests for your own orders");
        };
      };
    };

    // Get and increment next return request ID for the caller
    let currentRequestId = switch (nextReturnRequestId.get(caller)) {
      case (null) {
        nextReturnRequestId.add(caller, 2); // Start with 2 for the next request id
        1; // First request id
      };
      case (?id) {
        nextReturnRequestId.add(caller, id + 1);
        id;
      };
    };

    let request : ReturnRequest = {
      orderId;
      reason;
      requestDate = Time.now();
    };

    returnRequests.add(currentRequestId, request);
  };

  public query ({ caller }) func getReturnRequests() : async [ReturnRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view return requests");
    };
    let userRequests = returnRequests.filter(func(_, req) {
      switch (orders.get(req.orderId)) {
        case (null) { false };
        case (?order) { order.user == caller };
      }
    });
    userRequests.values().toArray();
  };

  // Review Management
  public shared ({ caller }) func addReview(productId : Nat, rating : Nat, comment : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add reviews");
    };

    let review : Review = {
      productId;
      user = caller;
      rating;
      comment;
    };

    let productReviews = switch (reviews.get(productId)) {
      case (null) { List.empty<Review>() };
      case (?existingReviews) { existingReviews };
    };

    productReviews.add(review);
    reviews.add(productId, productReviews);
  };

  public query func getReviews(productId : Nat) : async [Review] {
    // Public access - no authorization check needed
    switch (reviews.get(productId)) {
      case (null) { [] };
      case (?productReviews) { productReviews.toArray() };
    };
  };
};
