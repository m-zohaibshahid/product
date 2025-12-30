# Product → Variant → Stock Complete Flow

## Base URL
```
http://localhost:5500
```

---

## Understanding the Relationship

### Product → Variant → Stock Hierarchy:

```
Product (e.g., "Men Slim Fit Shirt")
  ├── Variant 1 (Blue, Size M) → Stock at Location 1: 100 units
  ├── Variant 2 (Blue, Size L) → Stock at Location 1: 50 units
  ├── Variant 3 (Red, Size M) → Stock at Location 1: 75 units
  └── Variant 4 (Red, Size L) → Stock at Location 2: 30 units
```

**Key Points:**
- **Product** = Base item (e.g., "Men Slim Fit Shirt")
- **Variant** = Specific combination of Color + Size (e.g., "Blue, Size M")
- **Stock** = Quantity of a specific variant at a specific location
- One product can have multiple variants
- One variant can have stock at multiple locations

---

## Complete Flow: From Product to Stock

### Step 1: Create Colors (if not exists)
**POST** `/colors`

**Request:**
```json
{
  "name": "Blue",
  "code": "#0000FF"
}
```

**Response:** `{ "color_id": 1, "name": "Blue", ... }`

---

### Step 2: Create Sizes (if not exists)
**POST** `/sizes`

**Request:**
```json
{
  "name": "M",
  "size_order": 2
}
```

**Response:** `{ "size_id": 1, "name": "M", ... }`

---

### Step 3: Create Product
**POST** `/products`

**Request:**
```json
{
  "article_code": "MSHIRT101",
  "name": "Men Slim Fit Shirt",
  "description": "Premium cotton shirt",
  "brand_id": 1,
  "category_id": 1,
  "default_tax_rate": 18,
  "status": "active"
}
```

**Response:** `{ "product_id": 1, ... }`

---

### Step 4: Create Variant (Color + Size combination)
**POST** `/variants`

**Request:**
```json
{
  "product_id": 1,
  "color_id": 1,
  "size_id": 1,
  "sku": "MSHIRT101-BLUE-M",
  "cost_price": 500,
  "selling_price": 800,
  "mrp": 1000,
  "min_stock_level": 20,
  "status": "active"
}
```

**Response:**
```json
{
  "variant_id": 1,
  "product_id": 1,
  "color_id": 1,
  "size_id": 1,
  "sku": "MSHIRT101-BLUE-M",
  "cost_price": 500,
  "selling_price": 800,
  "min_stock_level": 20,
  "product": {
    "product_id": 1,
    "name": "Men Slim Fit Shirt"
  },
  "color": {
    "color_id": 1,
    "name": "Blue"
  },
  "size": {
    "size_id": 1,
    "name": "M"
  }
}
```

**Important:** This `variant_id` is what you'll use in stock creation!

---

### Step 5: Create Stock Entry
**POST** `/stock`

**Request:**
```json
{
  "location_id": 1,
  "variant_id": 1,
  "quantity_on_hand": 100
}
```

**Note:** `quantity_reserved` is optional and defaults to 0 if not provided.

**Response:**
```json
{
  "stock_id": 1,
  "location_id": 1,
  "variant_id": 1,
  "quantity_on_hand": 100,
  "quantity_reserved": 0,
  "last_updated_at": "2024-12-25T10:00:00.000Z"
}
```

---

## Variants API Endpoints

### 1. Create Variant
**POST** `/variants`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "product_id": 1,
  "color_id": 1,
  "size_id": 1,
  "sku": "MSHIRT101-BLUE-M",
  "cost_price": 500,
  "selling_price": 800,
  "mrp": 1000,
  "min_stock_level": 20,
  "status": "active"
}
```

**Required Roles:** `admin`, `manager`

---

### 2. Get All Variants
**GET** `/variants`

**Response:** Array of all variants with product, color, and size relations

---

### 3. Get Variants by Product
**GET** `/variants/product/:productId`

**Example:** `GET /variants/product/1`

**Response:** Array of variants for that product

---

### 4. Get Variant by ID
**GET** `/variants/:id`

**Response:** Single variant with all relations

---

### 5. Update Variant
**PATCH** `/variants/:id`

**Required Roles:** `admin`, `manager`

---

### 6. Delete Variant
**DELETE** `/variants/:id`

**Required Roles:** `admin`

---

## Colors API Endpoints

### 1. Create Color
**POST** `/colors`

**Request:**
```json
{
  "name": "Blue",
  "code": "#0000FF"
}
```

---

### 2. Get All Colors
**GET** `/colors`

---

### 3. Get Color by ID
**GET** `/colors/:id`

---

### 4. Update Color
**PATCH** `/colors/:id`

---

### 5. Delete Color
**DELETE** `/colors/:id`

---

## Sizes API Endpoints

### 1. Create Size
**POST** `/sizes`

**Request:**
```json
{
  "name": "M",
  "size_order": 2
}
```

---

### 2. Get All Sizes
**GET** `/sizes`

**Response:** Sorted by `size_order` then `name`

---

### 3. Get Size by ID
**GET** `/sizes/:id`

---

### 4. Update Size
**PATCH** `/sizes/:id`

---

### 5. Delete Size
**DELETE** `/sizes/:id`

---

## Complete Testing Flow

### Step 1: Login
```bash
POST http://localhost:5500/auth/login
Body: { "username": "admin", "password": "admin123" }
```
Copy `access_token`

---

### Step 2: Create Color
```bash
POST http://localhost:5500/colors
Authorization: Bearer <token>
Body: { "name": "Blue", "code": "#0000FF" }
```
Response: `{ "color_id": 1, ... }`

---

### Step 3: Create Size
```bash
POST http://localhost:5500/sizes
Authorization: Bearer <token>
Body: { "name": "M", "size_order": 1 }
```
Response: `{ "size_id": 1, ... }`

---

### Step 4: Create Product
```bash
POST http://localhost:5500/products
Authorization: Bearer <token>
Body: {
  "article_code": "MSHIRT101",
  "name": "Men Slim Fit Shirt",
  "brand_id": 1,
  "category_id": 1,
  "status": "active"
}
```
Response: `{ "product_id": 1, ... }`

---

### Step 5: Create Variant
```bash
POST http://localhost:5500/variants
Authorization: Bearer <token>
Body: {
  "product_id": 1,
  "color_id": 1,
  "size_id": 1,
  "sku": "MSHIRT101-BLUE-M",
  "cost_price": 500,
  "selling_price": 800,
  "min_stock_level": 20
}
```
Response: `{ "variant_id": 1, ... }` ← **Use this variant_id for stock!**

---

### Step 6: Create Stock
```bash
POST http://localhost:5500/stock
Authorization: Bearer <token>
Body: {
  "location_id": 1,
  "variant_id": 1,
  "quantity_on_hand": 100
}
```
**Note:** `quantity_reserved` is optional - don't include it if you don't need it!

---

### Step 7: Verify Stock by Product
```bash
GET http://localhost:5500/stock/product/1
Authorization: Bearer <token>
```

This will show all stock entries for all variants of product ID 1.

---

## Stock Creation - Fixed Issue

### Problem:
The error was: `"quantity_reserved must not be less than 0"`

### Solution:
The `quantity_reserved` field is now **optional** in the DTO. You can:

1. **Omit it completely** (recommended):
```json
{
  "location_id": 1,
  "variant_id": 1,
  "quantity_on_hand": 100
}
```

2. **Include it with a value**:
```json
{
  "location_id": 1,
  "variant_id": 1,
  "quantity_on_hand": 100,
  "quantity_reserved": 0
}
```

The service will default `quantity_reserved` to 0 if not provided.

---

## Relationship Summary

```
Product (product_id: 1)
  └── Variant (variant_id: 1, product_id: 1, color_id: 1, size_id: 1)
      ├── Stock Entry 1 (location_id: 1, variant_id: 1, qty: 100)
      └── Stock Entry 2 (location_id: 2, variant_id: 1, qty: 50)
```

**To get stock for a product:**
- Use `GET /stock/product/:productId` - Returns stock for ALL variants of that product

**To get stock for a variant:**
- Use `GET /stock/variant/:variantId` - Returns stock for that variant at ALL locations

**To get stock at a location:**
- Use `GET /stock/location/:locationId` - Returns stock for ALL variants at that location

---

## Quick Reference

| Endpoint | Purpose | Returns |
|----------|---------|---------|
| `GET /products` | Get all products | Products with variants |
| `GET /variants/product/:id` | Get variants of a product | Variants for that product |
| `GET /stock` | Get stock summary | Overall summary (totalItems, lowStockItems, totalValue) |
| `GET /stock/all` | Get all stock entries | Detailed list of all stock entries |
| `GET /stock/product/:id` | Get stock for a product | Stock for all variants |
| `GET /stock/variant/:id` | Get stock for a variant | Stock at all locations |
| `GET /stock/location/:id` | Get stock at a location | Stock for all variants |
| `POST /stock` | Create stock entry | New stock entry |
| `POST /variants` | Create variant | New variant (get variant_id) |

---

## Example: Complete Workflow

1. **Create Color** → Get `color_id: 1`
2. **Create Size** → Get `size_id: 1`
3. **Create Product** → Get `product_id: 1`
4. **Create Variant** → Get `variant_id: 1` (This is what you need!)
5. **Create Stock** → Use `variant_id: 1` and `location_id: 1`
6. **View Stock** → `GET /stock/product/1` to see all stock for product

The `variant_id` comes from the variant you created in step 4!

