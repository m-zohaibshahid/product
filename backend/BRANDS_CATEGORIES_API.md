# Brands & Categories API Documentation

## Base URL
```
http://localhost:5500
```

---

## Brands Endpoints

### 1. Create Brand
**POST** `/brands`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Arrow",
  "description": "Premium clothing brand",
  "status": "active"
}
```

**Response (201):**
```json
{
  "brand_id": 1,
  "name": "Arrow",
  "description": "Premium clothing brand",
  "status": "active",
  "created_at": "2024-12-25T02:45:00.000Z",
  "updated_at": "2024-12-25T02:45:00.000Z"
}
```

**Required Roles:** `admin`, `manager`

---

### 2. Get All Brands
**GET** `/brands`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "brand_id": 1,
    "name": "Arrow",
    "description": "Premium clothing brand",
    "status": "active"
  },
  {
    "brand_id": 2,
    "name": "Nike",
    "description": "Sportswear brand",
    "status": "active"
  }
]
```

---

### 3. Get Brand by ID
**GET** `/brands/:id`

**Headers:**
```
Authorization: Bearer <token>
```

---

### 4. Update Brand
**PATCH** `/brands/:id`

**Required Roles:** `admin`, `manager`

---

### 5. Delete Brand
**DELETE** `/brands/:id`

**Required Roles:** `admin`

---

## Categories Endpoints

### 1. Create Category
**POST** `/categories`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Men",
  "description": "Men's clothing",
  "status": "active"
}
```

**Response (201):**
```json
{
  "category_id": 1,
  "name": "Men",
  "description": "Men's clothing",
  "status": "active",
  "created_at": "2024-12-25T02:45:00.000Z",
  "updated_at": "2024-12-25T02:45:00.000Z"
}
```

**Required Roles:** `admin`, `manager`

---

### 2. Get All Categories
**GET** `/categories`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "category_id": 1,
    "name": "Men",
    "description": "Men's clothing",
    "status": "active"
  },
  {
    "category_id": 2,
    "name": "Women",
    "description": "Women's clothing",
    "status": "active"
  }
]
```

---

### 3. Get Category by ID
**GET** `/categories/:id`

---

### 4. Update Category
**PATCH** `/categories/:id`

**Required Roles:** `admin`, `manager`

---

### 5. Delete Category
**DELETE** `/categories/:id`

**Required Roles:** `admin`

---

## Complete Flow: Create Product with Brands & Categories

### Step 1: Login
```bash
POST http://localhost:5500/auth/login
Body: { "username": "admin", "password": "admin123" }
```
Copy the `access_token`

### Step 2: Create Brand
```bash
POST http://localhost:5500/brands
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Arrow",
  "description": "Premium clothing brand",
  "status": "active"
}
```
Response: `{ "brand_id": 1, ... }`

### Step 3: Create Category
```bash
POST http://localhost:5500/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Men",
  "description": "Men's clothing",
  "status": "active"
}
```
Response: `{ "category_id": 1, ... }`

### Step 4: Create Product (Now it will work!)
```bash
POST http://localhost:5500/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "article_code": "MSHIRT101",
  "name": "Men Slim Fit Shirt",
  "description": "Premium cotton shirt",
  "brand_id": 1,
  "category_id": 1,
  "status": "active"
}
```

### Step 5: Upload Images
```bash
POST http://localhost:5500/products/{product_id}/images
Authorization: Bearer <token>
Body (form-data):
  images: [Select multiple image files]
```

---

## Postman Quick Setup

1. **Get Brands List** (to check existing brands):
   ```
   GET http://localhost:5500/brands
   Authorization: Bearer <token>
   ```

2. **Get Categories List** (to check existing categories):
   ```
   GET http://localhost:5500/categories
   Authorization: Bearer <token>
   ```

3. If no brands/categories exist, create them first using the POST endpoints above.


