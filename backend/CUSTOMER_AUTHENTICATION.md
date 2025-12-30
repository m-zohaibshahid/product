# Customer Authentication & Sales Flow

## Base URL
```
http://localhost:5500
```

---

## Overview

Customers can now **register and login** to make purchases! The system supports:
- ✅ **Public Customer Registration** (No auth required)
- ✅ **Public Customer Login** (No auth required)
- ✅ **Customer JWT Tokens** for authenticated purchases
- ✅ **Automatic Stock Deduction** when customers make purchases
- ✅ **Customer can view their own sales** and make payments

---

## Customer Registration (Public - No Auth Required)

### Register New Customer
**POST** `/customers/register`

**No Authentication Required!**

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securepassword123",
  "phone": "+1234567890",
  "address": "123 Main Street",
  "city": "New York",
  "state": "NY",
  "pincode": "10001",
  "country": "USA"
}
```

**Required Fields:**
- `name` (string)
- `email` (string, must be unique)
- `password` (string, minimum 6 characters)

**Optional Fields:**
- `phone`, `address`, `city`, `state`, `pincode`, `country`

**Response (201):**
```json
{
  "message": "Customer registered successfully",
  "customer": {
    "customer_id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "status": "active",
    "created_at": "2024-12-25T10:00:00.000Z"
  }
}
```

**Errors:**
- `409 Conflict`: Email already registered
- `400 Bad Request`: Validation errors

---

## Customer Login (Public - No Auth Required)

### Login Customer
**POST** `/customers/login`

**No Authentication Required!**

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "customer": {
    "customer_id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "status": "active"
  },
  "message": "Login successful"
}
```

**Token Expiry:** 7 days

**Errors:**
- `401 Unauthorized`: Invalid email or password
- `401 Unauthorized`: Customer account is inactive

---

## Customer Profile (Protected)

### Get Current Customer Info
**GET** `/customers/me`

**Headers:**
```
Authorization: Bearer <customer_token>
```

**Response (200):**
```json
{
  "customer": {
    "customer_id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "status": "active"
  },
  "message": "Current customer information"
}
```

---

## Making Purchases (Customer Authenticated)

### Create Sale (Purchase Products)
**POST** `/sales`

**Headers:**
```
Authorization: Bearer <customer_token>
Content-Type: application/json
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

**Important Notes:**
- ✅ **`customer_id` is automatically set** from the authenticated customer token
- ✅ **Stock is automatically deducted** when sale is created
- ✅ **Invoice number is auto-generated** (INV-YYYYMM-####)
- ✅ **No need to specify customer_id** - it's taken from your token!

**Response (201):**
```json
{
  "sale_id": 1,
  "invoice_number": "INV-202412-0001",
  "customer_id": 1,
  "total_amount": 1888,
  "payment_status": "unpaid",
  "lines": [...]
}
```

---

## Viewing Customer's Own Sales

### Get Customer's Sales
**GET** `/sales/customer/:customerId`

**Headers:**
```
Authorization: Bearer <customer_token>
```

**Security:** Customers can only view their own sales. If you try to view another customer's sales, you'll get `401 Unauthorized`.

**Response:** Array of all sales for the authenticated customer

---

### Get Specific Sale
**GET** `/sales/:id`

**Headers:**
```
Authorization: Bearer <customer_token>
```

**Security:** Customers can only view their own sales.

---

## Making Payments (Customer Authenticated)

### Add Payment to Sale
**POST** `/sales/:id/payments`

**Headers:**
```
Authorization: Bearer <customer_token>
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

**Payment Methods:** `cash`, `card`, `upi`, `bank_transfer`, `cheque`

**Security:** Customers can only pay for their own sales.

**Response:** Updated sale with payment status

---

## Complete Customer Flow Example

### Step 1: Customer Registration (Public)
```bash
POST http://localhost:5500/customers/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `{ "customer": { "customer_id": 1, ... } }`

---

### Step 2: Customer Login (Public)
```bash
POST http://localhost:5500/customers/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `{ "access_token": "eyJ...", "customer": {...} }`

**Save the `access_token`!**

---

### Step 3: Browse Products (Optional)
```bash
GET http://localhost:5500/products
Authorization: Bearer <customer_token>
```

---

### Step 4: Make Purchase (Stock Auto-Deducted!)
```bash
POST http://localhost:5500/sales
Authorization: Bearer <customer_token>
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
1. ✅ Customer ID is automatically set from token
2. ✅ Stock is validated and deducted automatically
3. ✅ Invoice is generated
4. ✅ Sale is created

**Response:** `{ "invoice_number": "INV-202412-0001", ... }`

---

### Step 5: View Your Purchase
```bash
GET http://localhost:5500/sales/1
Authorization: Bearer <customer_token>
```

---

### Step 6: Make Payment
```bash
POST http://localhost:5500/sales/1/payments
Authorization: Bearer <customer_token>
Content-Type: application/json

{
  "payment_date": "2024-12-25",
  "payment_method": "upi",
  "amount": 1888,
  "reference_number": "UPI-123456"
}
```

**Response:** Sale updated with `payment_status: "paid"`

---

## Staff vs Customer Tokens

### Staff Tokens (from `/auth/login`)
- Used by: Admin, Manager, Cashier
- Can: Create sales for any customer, view all sales, manage inventory
- Token Type: `type: "staff"` (or no type field)

### Customer Tokens (from `/customers/login`)
- Used by: Customers
- Can: Create sales for themselves, view own sales, make payments
- Token Type: `type: "customer"`

**The system automatically detects token type and applies appropriate permissions!**

---

## Security Features

✅ **Customer Registration is Public** - No auth required  
✅ **Customer Login is Public** - No auth required  
✅ **Sales Endpoint Requires Auth** - Must be logged in (customer or staff)  
✅ **Customers Can Only View Own Sales** - Automatic filtering  
✅ **Customers Can Only Pay Own Sales** - Automatic validation  
✅ **Stock Validation** - Prevents overselling  
✅ **Automatic Stock Deduction** - Happens on sale creation  

---

## API Endpoints Summary

| Endpoint | Method | Auth Required | Who Can Use |
|----------|--------|---------------|-------------|
| `/customers/register` | POST | ❌ No | Anyone |
| `/customers/login` | POST | ❌ No | Anyone |
| `/customers/me` | GET | ✅ Customer Token | Customers |
| `/sales` | POST | ✅ Customer/Staff Token | Customers & Staff |
| `/sales/:id` | GET | ✅ Customer/Staff Token | Customers (own), Staff (all) |
| `/sales/customer/:id` | GET | ✅ Customer/Staff Token | Customers (own), Staff (all) |
| `/sales/:id/payments` | POST | ✅ Customer/Staff Token | Customers (own), Staff (all) |

---

## Error Handling

### Invalid Credentials
```json
{
  "statusCode": 401,
  "message": "Invalid email or password",
  "error": "Unauthorized"
}
```

### Email Already Registered
```json
{
  "statusCode": 409,
  "message": "Email already registered",
  "error": "Conflict"
}
```

### Unauthorized to View Sale
```json
{
  "statusCode": 401,
  "message": "Unauthorized to view this sale",
  "error": "Unauthorized"
}
```

### Insufficient Stock
```json
{
  "statusCode": 400,
  "message": "Insufficient stock for variant 1. Available: 5, Requested: 10",
  "error": "Bad Request"
}
```

---

## Key Features

✅ **Public Registration & Login** - Customers can sign up without staff help  
✅ **JWT Authentication** - Secure token-based authentication  
✅ **Automatic Customer ID** - No need to specify customer_id in sales  
✅ **Stock Auto-Deduction** - Stock managed automatically  
✅ **Customer Privacy** - Customers can only see their own data  
✅ **Payment Processing** - Customers can pay for their purchases  
✅ **Invoice Generation** - Automatic invoice numbers  

---

## Notes

1. **Customer registration is completely public** - no authentication required
2. **Customer login returns JWT token** - use this token for all authenticated requests
3. **Sales endpoint accepts both customer and staff tokens** - system detects automatically
4. **Customer ID is auto-set** - from the authenticated customer token
5. **Stock is deducted immediately** - when sale is created, not when payment is made
6. **Customers can only access their own data** - automatic security filtering
7. **Token expires in 7 days** - customers need to login again after expiry

---

This completes the professional customer authentication and purchase flow! 🎉

