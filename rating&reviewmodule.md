# Review & Rating and Wishlist Modules – PRD

## 1. Review & Rating Module

### Overview

The Review & Rating module allows customers to provide feedback on products they have purchased. This enhances customer trust and helps improve product credibility. Admins can moderate reviews to prevent misuse.

### Goals

* Enable customers to add reviews only after successful order completion.
* Allow product ratings (1–5 stars) with optional comments.
* Provide APIs to fetch and manage reviews.
* Allow admins to delete inappropriate or fake reviews.

### Data Model (MongoDB Schema)

```js
Review {
  _id: ObjectId,
  productId: ObjectId,     // reference to Product
  userId: ObjectId,        // reference to User
  rating: Number,          // required, min: 1, max: 5
  comment: String,         // optional
  createdAt: Date,
  updatedAt: Date
}
```

### APIs & Functional Requirements

* **Customer**

  * `POST /api/reviews` → Add review (only if user purchased the product).
  * `GET /api/reviews/:productId` → Get all reviews for a product.
  * `DELETE /api/reviews/:id` → Delete own review.

* **Admin**

  * `DELETE /api/reviews/:id` → Delete any review (fraudulent/misuse).

### Validations

* Only verified buyers can post reviews.
* `rating` must be between 1 and 5.
* Prevent multiple reviews from the same user on the same product (allow update instead).

### Non-Functional Notes

* Average rating should be precomputed and stored in the Product schema for faster queries.
* Pagination for fetching reviews (e.g., 10 per page).
* Role-based access control (RBAC) for admin vs customer actions.

---

## 2. Wishlist Module

### Overview

The Wishlist module allows customers to save products for future purchase consideration. It is a user-specific list that persists in the database.

### Goals

* Enable customers to bookmark products they are interested in.
* Provide APIs for adding, removing, and viewing wishlist items.
* Ensure no duplicate entries for the same product in a user’s wishlist.

### Data Model (MongoDB Schema)

```js
Wishlist {
  _id: ObjectId,
  userId: ObjectId,        // reference to User
  products: [ObjectId],    // array of product references
  createdAt: Date,
  updatedAt: Date
}
```

### APIs & Functional Requirements

* **Customer**

  * `POST /api/wishlist` → Add product to wishlist.
  * `DELETE /api/wishlist/:productId` → Remove product from wishlist.
  * `GET /api/wishlist` → Get user’s wishlist with product details.

### Validations

* Prevent duplicate product entries in wishlist.
* Only valid product IDs should be added.

### Non-Functional Notes

* Optimize retrieval with product population (fetch product details in one call).
* Index on `userId` for faster lookups.
* Wishlist should auto-sync with product availability (optional enhancement).
