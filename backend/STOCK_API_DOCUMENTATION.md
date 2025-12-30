# Stock Management API Documentation

## Base URL
```
http://localhost:5500
```

---

## Stock Flow Overview

### How Stock is Maintained:

1. **Stock is tracked by Location and Variant:**
   - Each stock entry represents a specific variant at a specific location
   - Stock is maintained at the variant level (not product level)
   - Multiple locations can have stock of the same variant

2. **Stock Relationships:**
   - **Product** → has many **Variants** (different colors/sizes)
   - **Variant** → has stock at multiple **Locations**
   - **Location** → can store multiple variants
   - **Supplier** → supplies products through Purchase Orders (can track which supplier provided stock)

3. **Stock Updates:**
   - **Add Stock**: When receiving goods from Purchase Orders
   - **Subtract Stock**: When making sales
   - **Adjust Stock**: Manual adjustments (damage, returns, etc.)

---

## Locations Endpoints

### 1. Create Location
**POST** `/locations`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Main Store",
  "type": "store",
  "address": "123 Main Street, City",
  "status": "active"
}
```

**Response (201):**
```json
{
  "location_id": 1,
  "name": "Main Store",
  "type": "store",
  "address": "123 Main Street, City",
  "status": "active",
  "created_at": "2024-12-25T10:00:00.000Z",
  "updated_at": "2024-12-25T10:00:00.000Z"
}
```

**Location Types:** `store`, `warehouse`, `counter`

**Required Roles:** `admin`, `manager`

---

### 2. Get All Locations
**GET** `/locations`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "location_id": 1,
    "name": "Main Store",
    "type": "store",
    "address": "123 Main Street",
    "status": "active"
  },
  {
    "location_id": 2,
    "name": "Warehouse",
    "type": "warehouse",
    "status": "active"
  }
]
```

---

### 3. Get Location by ID
**GET** `/locations/:id`

---

### 4. Update Location
**PATCH** `/locations/:id`

**Required Roles:** `admin`, `manager`

---

### 5. Delete Location
**DELETE** `/locations/:id`

**Required Roles:** `admin`

---

## Stock Endpoints

### 1. Create Stock Entry
**POST** `/stock`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "location_id": 1,
  "variant_id": 1,
  "quantity_on_hand": 100
}
```

**Note:** 
- `quantity_reserved` is **optional** and defaults to 0 if not provided
- `variant_id` must be a valid variant ID from the `product_variants` table (created via `/variants` API)
- See `PRODUCT_VARIANT_STOCK_FLOW.md` for complete flow from product → variant → stock

**Response (201):**
```json
{
  "stock_id": 1,
  "location_id": 1,
  "variant_id": 1,
  "quantity_on_hand": 100,
  "quantity_reserved": 0,
  "last_updated_at": "2024-12-25T10:00:00.000Z",
  "created_at": "2024-12-25T10:00:00.000Z"
}
```

**Required Roles:** `admin`, `manager`

**Note:** One stock entry per location-variant combination

---

### 2. Get Stock Summary (Overall Summary)
**GET** `/stock`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "totalItems": 150,
  "lowStockItems": 15,
  "totalValue": 1250000.50
}
```

**Note:** This endpoint returns an overall summary of all stock. Use `GET /stock/all` to get detailed stock entries.

---

### 3. Get All Stock (Detailed List)
**GET** `/stock/all`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "stock_id": 1,
    "location_id": 1,
    "variant_id": 1,
    "quantity_on_hand": 100,
    "quantity_reserved": 5,
    "last_updated_at": "2024-12-25T10:00:00.000Z",
    "location": {
      "location_id": 1,
      "name": "Main Store",
      "type": "store"
    },
    "variant": {
      "variant_id": 1,
      "sku": "MSHIRT101-BLUE-M",
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
      },
      "min_stock_level": 20
    }
  }
]
```

**Response (200):**
```json
{
  "totalItems": 150,
  "lowStockItems": 15,
  "totalValue": 1250000.50
}
```

---

### 4. Get Stock by Location
**GET** `/stock/location/:locationId`

**Example:** `GET /stock/location/1`

**Response:** Array of stock entries for that location

---

### 5. Get Stock by Variant
**GET** `/stock/variant/:variantId`

**Example:** `GET /stock/variant/1`

**Response:** Array of stock entries for that variant across all locations

---

### 6. Get Stock by Product
**GET** `/stock/product/:productId`

**Example:** `GET /stock/product/1`

**Response:** Array of stock entries for all variants of that product

---

### 7. Get Stock by Supplier
**GET** `/stock/supplier/:supplierId`

**Example:** `GET /stock/supplier/1`

**Response:** Array of stock entries (can be enhanced with PO tracking)

---

### 8. Get Specific Stock Entry
**GET** `/stock/:locationId/:variantId`

**Example:** `GET /stock/1/1`

**Response:** Single stock entry for location 1 and variant 1

---

### 9. Update Stock
**PATCH** `/stock/:locationId/:variantId`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "quantity_on_hand": 150,
  "quantity_reserved": 10
}
```

**Required Roles:** `admin`, `manager`

---

### 10. Adjust Stock (Add/Subtract/Set)
**POST** `/stock/:locationId/:variantId/adjust`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "quantity": 50,
  "type": "add",
  "reason": "Received from purchase order PO-001"
}
```

**Adjustment Types:**
- `add`: Add quantity to existing stock
- `subtract`: Subtract quantity from existing stock (validates sufficient stock)
- `set`: Set quantity to specific value

**Response (200):**
```json
{
  "stock_id": 1,
  "location_id": 1,
  "variant_id": 1,
  "quantity_on_hand": 150,
  "quantity_reserved": 0,
  "last_updated_at": "2024-12-25T10:05:00.000Z"
}
```

**Required Roles:** `admin`, `manager`

---

### 11. Delete Stock Entry
**DELETE** `/stock/:locationId/:variantId`

**Required Roles:** `admin`

---

## Complete Stock Management Flow

### Scenario 1: Receiving Goods from Supplier (Purchase Order)

1. **Create Purchase Order** (if PO module exists)
2. **Receive Goods:**
   ```bash
   POST /stock/1/1/adjust
   {
     "quantity": 100,
     "type": "add",
     "reason": "Received from PO-001"
   }
   ```

### Scenario 2: Making a Sale

1. **Create Sale** (if Sales module exists)
2. **Reduce Stock:**
   ```bash
   POST /stock/1/1/adjust
   {
     "quantity": 2,
     "type": "subtract",
     "reason": "Sale #SALE-001"
   }
   ```

### Scenario 3: Stock Adjustment (Damage/Return)

```bash
POST /stock/1/1/adjust
{
  "quantity": 5,
  "type": "subtract",
  "reason": "Damaged items removed"
}
```

### Scenario 4: View Stock by Product

```bash
GET /stock/product/1
```

This returns all stock entries for all variants of product ID 1 across all locations.

---

## Postman Testing Guide

### Step 1: Login
```bash
POST http://localhost:5500/auth/login
Body: { "username": "admin", "password": "admin123" }
```
Copy the `access_token`

### Step 2: Create Location
```bash
POST http://localhost:5500/locations
Authorization: Bearer <token>
Body: {
  "name": "Main Store",
  "type": "store",
  "status": "active"
}
```

### Step 3: Create Stock Entry
```bash
POST http://localhost:5500/stock
Authorization: Bearer <token>
Body: {
  "location_id": 1,
  "variant_id": 1,
  "quantity_on_hand": 100
}
```

### Step 4: Get Stock Summary
```bash
GET http://localhost:5500/stock
Authorization: Bearer <token>
```

### Step 4b: Get All Stock (Detailed)
```bash
GET http://localhost:5500/stock/all
Authorization: Bearer <token>
```

### Step 5: Get Stock by Product
```bash
GET http://localhost:5500/stock/product/1
Authorization: Bearer <token>
```

### Step 6: Adjust Stock (Add)
```bash
POST http://localhost:5500/stock/1/1/adjust
Authorization: Bearer <token>
Body: {
  "quantity": 50,
  "type": "add",
  "reason": "New shipment received"
}
```

### Step 7: Adjust Stock (Subtract)
```bash
POST http://localhost:5500/stock/1/1/adjust
Authorization: Bearer <token>
Body: {
  "quantity": 10,
  "type": "subtract",
  "reason": "Sale completed"
}
```

### Step 8: Get Stock Summary
```bash
GET http://localhost:5500/stock
Authorization: Bearer <token>
```

---

## Stock Data Structure

### Stock Entry Fields:
- `stock_id`: Unique identifier
- `location_id`: Which location this stock is at
- `variant_id`: Which product variant (color/size combination)
- `quantity_on_hand`: Available quantity
- `quantity_reserved`: Reserved quantity (for pending orders)
- `last_updated_at`: Last update timestamp

### Relationships:
- **Stock** belongs to **Location**
- **Stock** belongs to **Variant**
- **Variant** belongs to **Product**
- **Product** can have multiple **Variants**
- **Variant** can have stock at multiple **Locations**

---

## Important Notes

1. **Stock is tracked at Variant level**, not Product level
2. **Each location-variant combination** has one stock entry
3. **Stock adjustments** should include reasons for audit trail
4. **Quantity reserved** is for pending orders/sales
5. **Low stock detection** uses variant's `min_stock_level`
6. **All endpoints require authentication** (JWT token)
7. **Create/Update/Delete** requires `admin` or `manager` role

---

## Error Responses

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Stock not found for this location and variant"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Stock already exists for this location and variant"
}
```

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Insufficient stock"
}
```

---

## Example: Complete Stock Workflow

1. **Create Location** → `POST /locations`
2. **Create Product** → `POST /products`
3. **Create Variant** → `POST /variants` (or through product)
4. **Create Stock Entry** → `POST /stock`
5. **Add Stock** → `POST /stock/:locationId/:variantId/adjust` (type: "add")
6. **View Stock** → `GET /stock/product/:productId`
7. **Subtract Stock** → `POST /stock/:locationId/:variantId/adjust` (type: "subtract")
8. **Check Summary** → `GET /stock`
9. **Get All Stock Details** → `GET /stock/all`

