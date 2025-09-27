
# **PRD: E-Commerce Backend Authentication System**

## **1. Overview**

* **Purpose:** Secure authentication system for e-commerce platform.
* **Roles:**

  1. **Customer** – Access products, cart, orders, profile.
  2. **Admin** – Manage products, orders, users, reports.
* **Security:** Full token-based authentication with role-based access and best practices.

---

## **2. User Roles & Permissions**

| Role     | Access                                                                |
| -------- | --------------------------------------------------------------------- |
| Customer | View products, place orders, view order history, manage profile, cart |
| Admin    | Manage products, orders, users, view reports, admin dashboard         |

**Notes:**

* Role is stored in DB.
* Admin-only endpoints protected with role middleware.
* Customer-only endpoints protected similarly.

---

## **3. Database Schema**

### **3.1 Users Table**

| Field      | Type      | Notes                  |
| ---------- | --------- | ---------------------- |
| id         | UUID/INT  | PK                     |
| name       | VARCHAR   | Required               |
| email      | VARCHAR   | Unique, Required       |
| password   | VARCHAR   | Hashed (bcrypt/argon2) |
| phone      | VARCHAR   | Optional               |
| role       | ENUM      | `customer` / `admin`   |
| status     | ENUM      | `active` / `inactive`  |
| created_at | TIMESTAMP | Auto                   |
| updated_at | TIMESTAMP | Auto                   |

### **3.2 Password Resets Table**

| Field      | Type      | Notes       |
| ---------- | --------- | ----------- |
| id         | UUID/INT  | PK          |
| user_id    | UUID/INT  | FK to users |
| token      | VARCHAR   | Unique      |
| expires_at | TIMESTAMP | Expiry time |

### **3.3 Optional Tables**

* `sessions` – track active sessions, logout, and token invalidation.
* `audit_logs` – track admin/customer sensitive actions.

---

## **4. API Endpoints**

### **4.1 Registration**

* **POST /api/auth/register**
* **Access:** Public
* **Request Body:**

```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "phone": "string"
}
```

* **Process:**

  1. Validate input.
  2. Hash password (bcrypt/argon2).
  3. Role = `customer` by default.
  4. Save user in DB.
* **Response:**

```json
{
  "success": true,
  "message": "Customer registered"
}
```

---

### **4.2 Login**

* **POST /api/auth/login**
* **Access:** Public
* **Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

* **Process:**

  1. Verify email and password.
  2. Generate JWT token with payload:

```json
{
  "id": "user_id",
  "email": "user_email",
  "role": "customer/admin"
}
```

* **Response:**

```json
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "id": "...",
    "name": "...",
    "email": "...",
    "role": "customer/admin"
  }
}
```

---

### **4.3 Admin Creation**

* **POST /api/auth/create-admin**
* **Access:** Admin only
* **Request Body:**

```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "phone": "string",
  "role": "admin"
}
```

* **Process:**

  * Validate existing admin via token.
  * Hash password & save user with role `admin`.

---

### **4.4 Password Reset / Forgot Password**

* **POST /api/auth/forgot-password** – generate token & send email.
* **POST /api/auth/reset-password** – validate token, hash new password, update DB.

---

### **4.5 Protected Routes & Role-Based Access**

```js
// JWT Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if(!token) return res.status(401).json({ message: "Unauthorized" });
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
};

// Role Middleware
const roleMiddleware = (roles) => (req, res, next) => {
  if(!roles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden" });
  next();
};
```

* **Usage Examples:**

```js
app.get("/api/admin/dashboard", authMiddleware, roleMiddleware(['admin']), adminController);
app.get("/api/customer/orders", authMiddleware, roleMiddleware(['customer']), customerController);
```

---

## **5. Security Guidelines**

1. HTTPS enforced.
2. Password hashed using bcrypt/argon2.
3. JWT tokens short-lived (e.g., 15 min) + refresh tokens.
4. HttpOnly cookies for JWT (prevent XSS attacks).
5. Rate-limit login attempts to prevent brute-force.
6. Admin creation restricted to existing admin.
7. Optional: Two-factor authentication for admin.

---

## **6. Session & Token Management**

* Optional `sessions` table to track issued JWTs.
* Token invalidation on logout.
* Refresh tokens for long sessions.

---

## **7. Developer Notes**

* All APIs return standardized response structure:

```json
{
  "success": true/false,
  "message": "string",
  "data": {}
}
```

* Role-based access strictly enforced.
* Password resets are token-based and expire automatically.
* Admin actions logged in `audit_logs`.

---