# Product and Category Modules – PRD

## 1. Category Module

### Overview

The Category module enables the classification of products into structured groups. It allows **Admins** to create, update, and manage categories, while **Customers** can only view them for browsing and filtering purposes.

### Goals

* Provide structured organization of products.
* Support search and filtering by category.
* Ensure only Admins can manage categories.

### Data Model (MongoDB Schema)

```js
Category {
  _id: ObjectId,
  name: String,         // required, unique
  description: String,  // optional
  image: String,        // URL of category image
  createdAt: Date,
  updatedAt: Date
}
```

### APIs & Functional Requirements

* **Admin**

  * `POST /api/categories` → Create category.
  * `PUT /api/categories/:id` → Update category.
  * `DELETE /api/categories/:id` → Delete category.
  * `GET /api/categories?search&pagination` → List all categories with filters.
* **Customer**

  * `GET /api/categories` → Fetch categories for browsing.

### Validations

* `name` is mandatory and must be unique.
* Image URL must be valid if provided.
* Prevent deletion if linked products exist (soft delete option recommended).

### Non-Functional Notes

* Pagination for category listing.
* Indexing on `name` for fast search.
* Secure endpoints with role-based access control (RBAC).

---

## 2. Product Module

### Overview

The Product module manages the lifecycle of products. It allows **Admins** to add, edit, and delete products, while **Customers** can view, search, and filter products.

### Goals

* Provide full product catalog management.
* Support advanced filtering and search options.
* Maintain stock integrity with future order integration.

### Data Model (MongoDB Schema)

```js
Product {
  _id: ObjectId,
  name: String,          // required
  description: String,   // required
  price: Number,         // required
  stock: Number,         // required, min: 0
  categoryId: ObjectId,  // reference to Category
  images: [String],      // array of image URLs
  createdAt: Date,
  updatedAt: Date,
  isOutOfStock: Boolean  // auto-set if stock <= 0
}
```

### APIs & Functional Requirements

* **Admin**

  * `POST /api/products` → Create product.
  * `PUT /api/products/:id` → Update product details/stock.
  * `DELETE /api/products/:id` → Delete product.
* **Customer**

  * `GET /api/products` → Fetch all products with filters:

    * By category
    * By price range
    * By search keyword
    * With pagination
  * `GET /api/products/:id` → Get product details.

### Validations

* `name`, `description`, `price`, `stock`, `categoryId` are mandatory.
* Price must be > 0.
* Stock cannot be negative.
* Images must be valid URLs.

### Non-Functional Notes

* Indexing on `name` and `categoryId` for optimized search.
* Middleware to auto-mark `isOutOfStock` when stock hits 0.
* JSON response optimized for frontend (with pagination metadata).
* Role-based access (Admin vs Customer).
