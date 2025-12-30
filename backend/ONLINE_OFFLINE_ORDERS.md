# Online vs Offline Order Flow

## Base URL
```
http://localhost:5500
```

---

## Overview

The system now supports **two distinct purchase flows**:

### 1. **Online Order Flow** (E-commerce)
- Customer adds items to cart
- Confirms order → **Stock Reserved** (not deducted yet)
- Selects payment method (COD/Card/UPI)
- Processes payment → **Stock Deducted** → Order converted to Sale

### 2. **Offline Sale Flow** (Walk-in/Store)
- Customer selects items
- Payment processed immediately → **Stock Deducted Immediately** → Sale created

---

## Online Order Flow (E-commerce)

### Step 1: Add to Cart / Create Order
**POST** `/orders`

**No Authentication Required!** (Works for guests and registered customers)

**Request Body:**
```json
{
  "order_date": "2024-12-25",
  "location_id": 1,
  "order_type": "online",
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

**Response (201):**
```json
{
  "order_id": 1,
  "order_number": "ORD-202412-0001",
  "status": "pending",
  "order_type": "online",
  "total_amount": 1888,
  "payment_status": "pending",
  "lines": [...]
}
```

**Important:**
- ✅ **No stock deduction yet** - Stock is only checked for availability
- ✅ **Status: "pending"** - Order is in cart
- ✅ **Customer can modify cart** - Can add/remove items

---

### Step 2: Confirm Order (Reserve Stock)
**POST** `/orders/:id/confirm`

**Headers:**
```
Authorization: Bearer <customer_token> (optional for guest)
```

**Request Body:**
```json
{
  "payment_method": "cod",
  "shipping_address": "123 Main Street, City, State, PIN",
  "notes": "Please deliver in morning"
}
```

**Payment Methods:**
- `cod` - Cash on Delivery
- `card` - Credit/Debit Card
- `upi` - UPI Payment
- `bank_transfer` - Bank Transfer
- `wallet` - Digital Wallet

**Response (200):**
```json
{
  "order_id": 1,
  "order_number": "ORD-202412-0001",
  "status": "confirmed",
  "payment_method": "cod",
  "payment_status": "pending",
  "total_amount": 1888,
  "lines": [...]
}
```

**What Happens:**
1. ✅ **Stock is Reserved** - `quantity_reserved` is increased
2. ✅ **Status changes to "confirmed"**
3. ✅ **Payment method is set**
4. ✅ **Stock is NOT deducted yet** - Still available for other orders

---

### Step 3: Process Payment (Deduct Stock)
**POST** `/orders/:id/payment`

**Headers:**
```
Authorization: Bearer <customer_token> (optional for guest)
```

**Request Body:**
```json
{
  "payment_reference": "TXN123456",
  "payment_date": "2024-12-25"
}
```

**Response (200):**
```json
{
  "order": {
    "order_id": 1,
    "status": "processing",
    "payment_status": "paid",
    "sale_id": 1
  },
  "sale": {
    "sale_id": 1,
    "invoice_number": "INV-202412-0001",
    "total_amount": 1888,
    "payment_status": "paid"
  },
  "message": "Payment processed and order converted to sale"
}
```

**What Happens:**
1. ✅ **Reserved stock is released** - `quantity_reserved` decreased
2. ✅ **Stock is deducted** - `quantity_on_hand` decreased
3. ✅ **Order converted to Sale** - Invoice generated
4. ✅ **Status: "processing"** - Order is being fulfilled
5. ✅ **Payment status: "paid"**

---

## Offline Sale Flow (Walk-in/Store)

### Direct Sale Creation
**POST** `/sales`

**Headers:**
```
Authorization: Bearer <staff_token> (optional - can be guest)
```

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

**Response (201):**
```json
{
  "sale_id": 1,
  "invoice_number": "INV-202412-0001",
  "total_amount": 1888,
  "payment_status": "unpaid",
  "lines": [...]
}
```

**What Happens:**
1. ✅ **Stock is deducted immediately** - `quantity_on_hand` decreased
2. ✅ **Sale is created** - Invoice generated
3. ✅ **No order created** - Direct sale

---

### Process Payment (Offline)
**POST** `/sales/:id/payments`

**Request Body:**
```json
{
  "payment_date": "2024-12-25",
  "payment_method": "cash",
  "amount": 1888
}
```

**Response:** Sale updated with payment status

---

## Complete Flow Comparison

### Online Customer Flow:
```
1. Browse Products (No Auth)
   GET /products

2. Add to Cart (No Auth)
   POST /orders
   → Status: "pending"
   → No stock deduction

3. Confirm Order (Auth Optional)
   POST /orders/:id/confirm
   → Status: "confirmed"
   → Stock Reserved (quantity_reserved++)
   → Payment method selected

4. Process Payment
   POST /orders/:id/payment
   → Status: "processing"
   → Stock Deducted (quantity_on_hand--)
   → Reserved Stock Released (quantity_reserved--)
   → Order → Sale (Invoice generated)
```

### Offline Customer Flow:
```
1. Select Items (No Auth)
   Browse products

2. Process Payment & Create Sale
   POST /sales
   → Stock Deducted Immediately
   → Sale Created (Invoice generated)

3. Payment Complete
   POST /sales/:id/payments
   → Payment recorded
```

---

## Stock Management

### Online Orders:
- **Pending Order**: No stock impact
- **Confirmed Order**: Stock reserved (`quantity_reserved++`)
- **Payment Processed**: Stock deducted (`quantity_on_hand--`) + Reserved released (`quantity_reserved--`)
- **Order Cancelled**: Reserved stock released (`quantity_reserved--`)

### Offline Sales:
- **Sale Created**: Stock deducted immediately (`quantity_on_hand--`)

---

## Order Status Flow

```
pending → confirmed → processing → shipped → delivered
                ↓
            cancelled
```

- **pending**: Order in cart, no stock reserved
- **confirmed**: Order confirmed, stock reserved
- **processing**: Payment processed, stock deducted, order converted to sale
- **shipped**: Order shipped (can be updated manually)
- **delivered**: Order delivered (can be updated manually)
- **cancelled**: Order cancelled, reserved stock released

---

## API Endpoints

### Online Orders
| Endpoint | Method | Purpose | Stock Impact |
|----------|--------|---------|--------------|
| `/orders` | POST | Create order (cart) | None - Check only |
| `/orders/:id/confirm` | POST | Confirm order | ✅ Reserve stock |
| `/orders/:id/payment` | POST | Process payment | ✅ Deduct stock |
| `/orders` | GET | List orders | None |
| `/orders/:id` | GET | Get order | None |
| `/orders/:id/cancel` | PATCH | Cancel order | ✅ Release reserved |

### Offline Sales
| Endpoint | Method | Purpose | Stock Impact |
|----------|--------|---------|--------------|
| `/sales` | POST | Create sale | ✅ Deduct immediately |
| `/sales/:id/payments` | POST | Add payment | None |

---

## Example: Complete Online Order

```bash
# 1. Add to Cart
POST /orders
{
  "order_date": "2024-12-25",
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
→ Order created, status: "pending"

# 2. Confirm Order (Reserve Stock)
POST /orders/1/confirm
{
  "payment_method": "cod",
  "shipping_address": "123 Main St"
}
→ Stock reserved, status: "confirmed"

# 3. Process Payment (Deduct Stock)
POST /orders/1/payment
{
  "payment_reference": "COD-001"
}
→ Stock deducted, Order → Sale, Invoice generated
```

---

## Example: Complete Offline Sale

```bash
# 1. Create Sale (Stock Deducted Immediately)
POST /sales
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
→ Stock deducted, Sale created, Invoice generated

# 2. Add Payment
POST /sales/1/payments
{
  "payment_date": "2024-12-25",
  "payment_method": "cash",
  "amount": 1888
}
→ Payment recorded
```

---

## Key Differences

| Feature | Online Order | Offline Sale |
|---------|-------------|--------------|
| **Stock Deduction** | After payment | Immediately |
| **Stock Reservation** | Yes (on confirm) | No |
| **Order Status** | Multiple statuses | Direct sale |
| **Payment Timing** | Before/after order | At sale time |
| **COD Support** | Yes | N/A |
| **Cart System** | Yes | No |
| **Invoice Generation** | After payment | Immediately |

---

## Payment Methods

### Online Orders:
- **COD (Cash on Delivery)**: Payment on delivery
- **Card**: Credit/Debit card payment
- **UPI**: UPI payment
- **Bank Transfer**: Bank transfer
- **Wallet**: Digital wallet

### Offline Sales:
- **Cash**: Cash payment
- **Card**: Card payment
- **UPI**: UPI payment
- **Bank Transfer**: Bank transfer
- **Cheque**: Cheque payment

---

## Stock Reservation Benefits

✅ **Prevents Overselling** - Stock reserved when order confirmed  
✅ **Better Inventory Management** - Know what's committed vs available  
✅ **Order Cancellation** - Can release reserved stock if order cancelled  
✅ **Payment Flexibility** - Stock held until payment processed  

---

This completes the online/offline order flow! 🎉

