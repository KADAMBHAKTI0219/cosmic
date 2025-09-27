# Order and Cart Modules – PRD

## 1. Cart Module

### Overview

The Cart module allows customers to add, update, and remove products before checkout. Each user has a dedicated cart stored in the database, linked to their user ID.

### Goals

* Provide seamless shopping experience for customers.
* Support quantity adjustments, product removal, and total price calculation.
* Persist cart data in the database for logged-in users.

### Data Model (MongoDB Schema)

```js
Cart {
  _id: ObjectId,
  userId: ObjectId,        // reference to User
  items: [
    {
      productId: ObjectId, // reference to Product
      quantity: Number,    // min: 1
      price: Number        // snapshot of product price at time of add
    }
  ],
  totalPrice: Number,      // auto-calculated
  createdAt: Date,
  updatedAt: Date
}
```

### APIs & Functional Requirements

* **Customer**

  * `POST /api/cart` → Add product to cart (create if not exists).
  * `PUT /api/cart/:itemId` → Update quantity of product in cart.
  * `DELETE /api/cart/:itemId` → Remove product from cart.
  * `GET /api/cart` → Get current user’s cart with product details + total price.

### Validations

* Quantity must be ≥ 1.
* Prevent adding product if out of stock.
* Ensure `totalPrice` is recalculated on every update.

### Non-Functional Notes

* Store `price` snapshot for consistency even if product price changes.
* Optimize performance with aggregation pipelines to fetch product details.
* Cart is user-specific → only one active cart per user.

---

## 2. Order Module

### Overview

The Order module handles checkout, payment status, and order tracking. It is integrated with cart data, and stock levels are adjusted automatically when an order is placed.

### Goals

* Enable customers to place and track their orders.
* Allow admins to manage, filter, and update order statuses.
* Maintain stock integrity when orders are confirmed or cancelled.

### Data Model (MongoDB Schema)

```js
Order {
  _id: ObjectId,
  userId: ObjectId,          // reference to User
  items: [
    {
      productId: ObjectId,   // reference to Product
      quantity: Number,
      price: Number
    }
  ],
  totalPrice: Number,
  paymentStatus: {           // enum
    type: String,            // "pending" | "paid" | "failed"
    default: "pending"
  },
  orderStatus: {             // enum
    type: String,            // "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
    default: "pending"
  },
  createdAt: Date,
  updatedAt: Date
}
```

### APIs & Functional Requirements

* **Customer**

  * `POST /api/orders` → Place order (fetch cart items, create order, adjust stock).
  * `GET /api/orders` → Get my orders (with filters, pagination).
  * `GET /api/orders/:id` → Get single order details.

* **Admin**

  * `GET /api/orders` → Get all orders with search + filter by status.
  * `PUT /api/orders/:id` → Update order status (confirmed, shipped, delivered, cancelled).

### Validations

* Ensure order cannot be placed if cart is empty.
* Stock validation → reduce stock only if sufficient quantity available.
* Payment status defaults to `pending`.
* Once delivered/cancelled → cart should be cleared automatically.

### Non-Functional Notes

* Middleware to auto-adjust stock based on order placement/cancellation.
* Index on `customerId` and `orderStatus` for faster queries.
* Audit trail/logging for order lifecycle events.
