# Guest Checkout - Purchase Without Registration

## Base URL
```
http://localhost:5500
```

---

## Overview

Customers can now **browse products and make purchases WITHOUT registration**! The system supports:

- ✅ **Public Product Browsing** - No authentication required
- ✅ **Guest Checkout** - Purchase without registration
- ✅ **Automatic Stock Deduction** - Stock managed automatically
- ✅ **Purchase Tracking** - All sales are tracked (with or without customer_id)
- ✅ **Optional Registration** - Customers can register later if they want

---

## Public Product Browsing (No Auth Required)

### Get All Products
**GET** `/products`

**No Authentication Required!**

**Response (200):**
```json
[
  {
    "product_id": 1,
    "name": "Men Slim Fit Shirt",
    "brand": { "name": "Arrow" },
    "category": { "name": "Men" },
    "variants": [...],
    "images": [...]
  }
]
```

---

### Get Product by ID
**GET** `/products/:id`

**No Authentication Required!**

**Response:** Full product details with variants and images

---

### Get Product Images
**GET** `/products/:id/images`

**No Authentication Required!**

---

### Get Variants by Product
**GET** `/variants/product/:productId`

**No Authentication Required!**

---

### Get All Variants
**GET** `/variants`

**No Authentication Required!**

---

### Get All Colors
**GET** `/colors`

**No Authentication Required!**

---

### Get All Sizes
**GET** `/sizes`

**No Authentication Required!**

---

## Guest Checkout (No Registration Required)

### Create Sale (Guest Purchase)
**POST** `/sales`

**No Authentication Required!**

**Request Body:**
```json
{
  "sale_date": "2024-12-25",
  "location_id": 1,
  "lines": [
    {
      "variant_id": 1,
      "quantity": 2,
      "unit_price": 800,
      "tax_rate": 18
    }
  ]
}
```

**Important Notes:**
- ✅ **No `customer_id` required** - Can be omitted for guest sales
- ✅ **No authentication required** - Anyone can make a purchase
- ✅ **Stock is automatically deducted** when sale is created
- ✅ **Invoice number is auto-generated** (INV-YYYYMM-####)
- ✅ **Sale is tracked** even without customer registration

**Response (201):**
```json
{
  "sale_id": 1,
  "invoice_number": "INV-202412-0001",
  "customer_id": null,
  "location_id": 1,
  "total_amount": 1888,
  "payment_status": "unpaid",
  "lines": [
    {
      "variant_id": 1,
      "quantity": 2,
      "unit_price": 800,
      "variant": {
        "product": { "name": "Men Slim Fit Shirt" },
        "color": { "name": "Blue" },
        "size": { "name": "M" }
      }
    }
  ]
}
```

**Note:** `customer_id` will be `null` for guest sales, but the sale is still fully tracked!

---

## Guest Checkout with Optional Customer Info

You can optionally provide customer information during checkout (without registration):

**POST** `/sales`

```json
{
  "sale_date": "2024-12-25",
  "location_id": 1,
  "customer_id": null,  // Optional - can be null for guest
  "lines": [
    {
      "variant_id": 1,
      "quantity": 2,
      "unit_price": 800,
      "tax_rate": 18
    }
  ]
}
```

**Note:** Even if you provide `customer_id`, it's optional. The sale will work with `customer_id: null` for true guest checkout.

---

## Complete Guest Flow Example

### Step 1: Browse Products (No Auth)
```bash
GET http://localhost:5500/products
```

**Response:** List of all products with variants and images

---

### Step 2: View Product Details (No Auth)
```bash
GET http://localhost:5500/products/1
```

**Response:** Full product details

---

### Step 3: Check Variants (No Auth)
```bash
GET http://localhost:5500/variants/product/1
```

**Response:** All variants for product 1

---

### Step 4: Make Purchase (Guest Checkout - No Auth!)
```bash
POST http://localhost:5500/sales
Content-Type: application/json

{
  "sale_date": "2024-12-25",
  "location_id": 1,
  "lines": [
    {
      "variant_id": 1,
      "quantity": 2,
      "unit_price": 800,
      "tax_rate": 18
    }
  ]
}
```

**What Happens:**
1. ✅ No authentication required
2. ✅ No customer registration required
3. ✅ Stock is validated and deducted automatically
4. ✅ Invoice is generated
5. ✅ Sale is created with `customer_id: null`
6. ✅ Purchase is fully tracked!

**Response:** `{ "invoice_number": "INV-202412-0001", "customer_id": null, ... }`

---

## Guest vs Registered Customer

### Guest Checkout
- ✅ No registration required
- ✅ No login required
- ✅ No authentication token needed
- ✅ `customer_id` is `null` in sale
- ✅ Purchase is still tracked
- ✅ Stock is still deducted
- ✅ Invoice is still generated

### Registered Customer Checkout
- ✅ Customer must register and login
- ✅ Authentication token required
- ✅ `customer_id` is automatically set
- ✅ Customer can view purchase history
- ✅ Customer can make payments
- ✅ Better tracking and customer relationship

---

## Viewing Guest Sales

### Get All Sales (Staff Only)
**GET** `/sales`

**Headers:**
```
Authorization: Bearer <staff_token>
```

**Response:** All sales including guest sales (where `customer_id: null`)

---

### Get Sale by Invoice Number (Staff Only)
**GET** `/sales/:id`

**Headers:**
```
Authorization: Bearer <staff_token>
```

**Response:** Sale details (guest sales will have `customer_id: null`)

---

## Payment for Guest Sales

### Add Payment (Staff Only)
**POST** `/sales/:id/payments`

**Headers:**
```
Authorization: Bearer <staff_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "payment_date": "2024-12-25",
  "payment_method": "cash",
  "amount": 1888,
  "reference_number": "CASH-001"
}
```

**Note:** Guest sales can be paid by staff at the store/counter.

---

## Public vs Protected Endpoints

### Public Endpoints (No Auth Required)
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/products` | GET | Browse all products |
| `/products/:id` | GET | View product details |
| `/products/:id/images` | GET | Get product images |
| `/variants` | GET | Browse all variants |
| `/variants/product/:id` | GET | Get variants by product |
| `/variants/:id` | GET | Get variant details |
| `/colors` | GET | Browse all colors |
| `/colors/:id` | GET | Get color details |
| `/sizes` | GET | Browse all sizes |
| `/sizes/:id` | GET | Get size details |
| `/sales` | POST | **Guest checkout** |

### Protected Endpoints (Auth Required)
| Endpoint | Method | Who Can Use |
|----------|--------|-------------|
| `/sales` | GET | Staff only |
| `/sales/:id` | GET | Staff, or Customer (own sales) |
| `/sales/:id/payments` | POST | Staff, or Customer (own sales) |
| `/products` | POST | Staff (admin/manager) |
| `/variants` | POST | Staff (admin/manager) |

---

## Benefits of Guest Checkout

✅ **Lower Friction** - Customers can purchase immediately  
✅ **No Barriers** - No registration required  
✅ **Faster Checkout** - Quick purchase process  
✅ **Still Tracked** - All sales are recorded  
✅ **Stock Managed** - Stock is still deducted  
✅ **Invoice Generated** - Professional invoices  
✅ **Optional Upgrade** - Customers can register later  

---

## Tracking Guest Sales

### How Guest Sales are Tracked:

1. **Invoice Number** - Unique invoice for each sale
2. **Sale Date** - When the purchase was made
3. **Location** - Where the sale was made
4. **Line Items** - What was purchased
5. **Payment Status** - Payment tracking
6. **Stock Deduction** - Automatic inventory management

**Even without `customer_id`, the sale is fully tracked and can be:**
- Viewed by staff
- Paid by staff
- Used for inventory management
- Used for sales reporting
- Linked to customer later (if customer registers)

---

## Example: Complete Guest Purchase

```bash
# 1. Browse Products (No Auth)
curl http://localhost:5500/products

# 2. View Product (No Auth)
curl http://localhost:5500/products/1

# 3. Check Variants (No Auth)
curl http://localhost:5500/variants/product/1

# 4. Make Purchase (Guest - No Auth!)
curl -X POST http://localhost:5500/sales \
  -H "Content-Type: application/json" \
  -d '{
    "sale_date": "2024-12-25",
    "location_id": 1,
    "lines": [
      {
        "variant_id": 1,
        "quantity": 2,
        "unit_price": 800,
        "tax_rate": 18
      }
    ]
  }'

# Response:
# {
#   "invoice_number": "INV-202412-0001",
#   "customer_id": null,
#   "total_amount": 1888,
#   ...
# }
```

---

## Key Features

✅ **Zero Friction** - No registration, no login, just purchase  
✅ **Fully Tracked** - All sales recorded even without customer  
✅ **Stock Managed** - Automatic stock deduction  
✅ **Professional** - Invoice generation  
✅ **Flexible** - Customers can register later if they want  
✅ **Secure** - Stock validation prevents overselling  

---

## Notes

1. **Guest sales have `customer_id: null`** - This is normal and expected
2. **Stock is still deducted** - Guest checkout manages inventory
3. **Invoices are generated** - Professional tracking
4. **Staff can view all sales** - Including guest sales
5. **Customers can register later** - And link their purchase history
6. **Payment can be processed** - By staff at the store

---

This completes the guest checkout flow! Customers can now browse and purchase without any registration! 🎉

