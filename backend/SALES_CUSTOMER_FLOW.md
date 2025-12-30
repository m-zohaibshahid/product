# Complete Sales & Customer Management Flow

## Base URL
```
http://localhost:5500
```

---

## Overview

This document describes the complete flow for managing customers and sales, including automatic stock deduction when products are purchased.

### Flow Diagram:
```
1. Customer Registration/Info → 2. Browse Products → 3. Create Sale → 4. Stock Auto-Deducted → 5. Payment Processing
```

---

## Customer Management

### 1. Create Customer (Client Registration)
**POST** `/customers`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "address": "123 Main Street",
  "city": "New York",
  "state": "NY",
  "pincode": "10001",
  "country": "USA",
  "status": "active"
}
```

**Response (201):**
```json
{
  "customer_id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "address": "123 Main Street",
  "city": "New York",
  "state": "NY",
  "pincode": "10001",
  "country": "USA",
  "status": "active",
  "created_at": "2024-12-25T10:00:00.000Z",
  "updated_at": "2024-12-25T10:00:00.000Z"
}
```

**Required Roles:** `admin`, `manager`, `cashier`

**Note:** All fields except `name` are optional. Customers can be created with just a name for walk-in sales.

---

### 2. Get All Customers
**GET** `/customers`

**Response (200):**
```json
[
  {
    "customer_id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "status": "active"
  }
]
```

---

### 3. Search Customers
**GET** `/customers?search=john`

**Response:** Array of customers matching the search query (searches name, email, phone)

---

### 4. Get Customer by ID
**GET** `/customers/:id`

**Response:** Customer details with sales history

---

### 5. Update Customer
**PATCH** `/customers/:id`

**Required Roles:** `admin`, `manager`

---

### 6. Delete Customer
**DELETE** `/customers/:id`

**Required Roles:** `admin`

---

## Sales Management

### 1. Create Sale (Purchase Order)
**POST** `/sales`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "sale_date": "2024-12-25",
  "location_id": 1,
  "customer_id": 1,
  "discount_amount": 50,
  "lines": [
    {
      "variant_id": 1,
      "quantity": 2,
      "unit_price": 800,
      "discount": 0,
      "tax_rate": 18
    },
    {
      "variant_id": 2,
      "quantity": 1,
      "unit_price": 1200,
      "discount": 100,
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
  "sale_date": "2024-12-25",
  "location_id": 1,
  "customer_id": 1,
  "subtotal_amount": 2700,
  "discount_amount": 50,
  "tax_amount": 477,
  "total_amount": 3127,
  "payment_status": "unpaid",
  "created_by": 1,
  "created_at": "2024-12-25T10:00:00.000Z",
  "location": {
    "location_id": 1,
    "name": "Main Store"
  },
  "customer": {
    "customer_id": 1,
    "name": "John Doe"
  },
  "lines": [
    {
      "sale_line_id": 1,
      "variant_id": 1,
      "quantity": 2,
      "unit_price": 800,
      "discount": 0,
      "tax_rate": 18,
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
        }
      }
    }
  ]
}
```

**Required Roles:** `admin`, `manager`, `cashier`

**Important Features:**
- ✅ **Automatic Stock Deduction**: Stock is automatically deducted from the specified location when sale is created
- ✅ **Stock Validation**: Checks if sufficient stock is available before creating sale
- ✅ **Invoice Number Generation**: Automatically generates unique invoice numbers (INV-YYYYMM-####)
- ✅ **Tax Calculation**: Calculates tax per line item and totals
- ✅ **Transaction Safety**: Uses database transactions to ensure data consistency

**Stock Deduction Logic:**
- Stock is deducted from `quantity_on_hand` at the specified `location_id`
- Validates that `quantity_on_hand - quantity_reserved >= requested_quantity`
- If insufficient stock, sale creation fails with error message

---

### 2. Get All Sales
**GET** `/sales`

**Response:** Array of all sales with full details including lines, customer, location, and payments

---

### 3. Get Sale by ID
**GET** `/sales/:id`

**Response:** Single sale with all relations

---

### 4. Get Sales by Customer
**GET** `/sales/customer/:customerId`

**Response:** Array of all sales for that customer

---

### 5. Get Sales by Location
**GET** `/sales/location/:locationId`

**Response:** Array of all sales at that location

---

## Payment Processing

### 1. Add Payment to Sale
**POST** `/sales/:id/payments`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "payment_date": "2024-12-25",
  "payment_method": "cash",
  "amount": 3127,
  "reference_number": "CASH-001"
}
```

**Payment Methods:** `cash`, `card`, `upi`, `bank_transfer`, `cheque`

**Response (201):**
```json
{
  "sale_id": 1,
  "invoice_number": "INV-202412-0001",
  "total_amount": 3127,
  "payment_status": "paid",
  "payments": [
    {
      "payment_id": 1,
      "payment_date": "2024-12-25",
      "payment_method": "cash",
      "amount": 3127,
      "reference_number": "CASH-001",
      "received_by": 1,
      "created_at": "2024-12-25T10:05:00.000Z"
    }
  ]
}
```

**Payment Status Logic:**
- `unpaid`: No payments made
- `partial`: Some payment made but less than total
- `paid`: Total payments >= total_amount

**Required Roles:** `admin`, `manager`, `cashier`

---

### 2. Multiple Payments (Partial Payments)
You can add multiple payments to a sale:

**Example: First Payment (Partial)**
```json
POST /sales/1/payments
{
  "payment_date": "2024-12-25",
  "payment_method": "cash",
  "amount": 1500
}
```
Response: `payment_status: "partial"`

**Example: Second Payment (Complete)**
```json
POST /sales/1/payments
{
  "payment_date": "2024-12-25",
  "payment_method": "card",
  "amount": 1627,
  "reference_number": "CARD-123456"
}
```
Response: `payment_status: "paid"`

---

## Complete Flow Example

### Step 1: Login
```bash
POST http://localhost:5500/auth/login
Body: { "username": "cashier", "password": "password123" }
```
Copy `access_token`

---

### Step 2: Create Customer (Optional - for walk-in, skip this)
```bash
POST http://localhost:5500/customers
Authorization: Bearer <token>
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890"
}
```
Response: `{ "customer_id": 1, ... }`

---

### Step 3: Check Stock Availability
```bash
GET http://localhost:5500/stock/location/1
Authorization: Bearer <token>
```
This shows available stock at location 1

---

### Step 4: Create Sale
```bash
POST http://localhost:5500/sales
Authorization: Bearer <token>
Body: {
  "sale_date": "2024-12-25",
  "location_id": 1,
  "customer_id": 1,
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
1. ✅ Validates location exists
2. ✅ Validates customer exists (if provided)
3. ✅ Validates variants exist
4. ✅ **Checks stock availability** for each variant at the location
5. ✅ **Deducts stock automatically** from `quantity_on_hand`
6. ✅ Calculates totals (subtotal, tax, discount, total)
7. ✅ Generates invoice number
8. ✅ Creates sale with lines
9. ✅ Returns complete sale details

**Response:** Sale created with invoice number and stock deducted!

---

### Step 5: Verify Stock Deduction
```bash
GET http://localhost:5500/stock/1/1
Authorization: Bearer <token>
```
Check that `quantity_on_hand` has been reduced by the quantity sold (2 in this example)

---

### Step 6: Process Payment
```bash
POST http://localhost:5500/sales/1/payments
Authorization: Bearer <token>
Body: {
  "payment_date": "2024-12-25",
  "payment_method": "cash",
  "amount": 1888
}
```

**Response:** Sale updated with `payment_status: "paid"`

---

### Step 7: View Sale Invoice
```bash
GET http://localhost:5500/sales/1
Authorization: Bearer <token>
```

Returns complete invoice with:
- Customer details
- All line items with product/variant info
- Payment details
- Totals

---

## Stock Deduction Details

### How Stock is Deducted:

1. **When Sale is Created:**
   - For each line item in the sale:
     - Finds stock entry: `location_id` + `variant_id`
     - Validates: `quantity_on_hand - quantity_reserved >= requested_quantity`
     - Deducts: `quantity_on_hand -= quantity`

2. **Transaction Safety:**
   - Uses database transactions
   - If any validation fails, entire sale is rolled back
   - Stock is only deducted if sale is successfully created

3. **Stock Restoration:**
   - If sale is deleted (and has no payments), stock is automatically restored
   - Stock cannot be restored if sale has payments (must process refund first)

---

## Error Handling

### Insufficient Stock Error:
```json
{
  "statusCode": 400,
  "message": "Insufficient stock for variant 1. Available: 5, Requested: 10",
  "error": "Bad Request"
}
```

### No Stock Available:
```json
{
  "statusCode": 400,
  "message": "No stock available for variant 1 at location 1",
  "error": "Bad Request"
}
```

### Variant Not Found:
```json
{
  "statusCode": 404,
  "message": "Variant with ID 999 not found",
  "error": "Not Found"
}
```

### Payment Exceeds Total:
```json
{
  "statusCode": 400,
  "message": "Payment amount exceeds total amount. Total: 1000, Already paid: 500, New payment: 600",
  "error": "Bad Request"
}
```

---

## Sale Deletion

### Delete Sale (Restores Stock)
**DELETE** `/sales/:id`

**Required Roles:** `admin`, `manager`

**Important:**
- ✅ Stock is automatically restored when sale is deleted
- ❌ Cannot delete sale if it has payments (must process refund first)

**Response:**
```json
{
  "message": "Sale deleted and stock restored successfully"
}
```

---

## Complete Workflow Summary

### For Walk-in Customers (No Registration):
1. Create sale with `customer_id: null` or omit it
2. Stock is deducted automatically
3. Process payment
4. Done!

### For Registered Customers:
1. Create customer → Get `customer_id`
2. Create sale with `customer_id` → Stock deducted automatically
3. Process payment(s)
4. View customer's purchase history: `GET /sales/customer/:customerId`

---

## API Endpoints Summary

| Endpoint | Method | Purpose | Stock Impact |
|----------|--------|---------|--------------|
| `/customers` | POST | Create customer | None |
| `/customers` | GET | List customers | None |
| `/customers/:id` | GET | Get customer | None |
| `/sales` | POST | Create sale | ✅ **Deducts stock** |
| `/sales` | GET | List all sales | None |
| `/sales/:id` | GET | Get sale details | None |
| `/sales/customer/:id` | GET | Get customer sales | None |
| `/sales/location/:id` | GET | Get location sales | None |
| `/sales/:id/payments` | POST | Add payment | None |
| `/sales/:id` | DELETE | Delete sale | ✅ **Restores stock** |

---

## Testing Complete Flow

### Quick Test Script:

```bash
# 1. Login
TOKEN=$(curl -X POST http://localhost:5500/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq -r '.access_token')

# 2. Create Customer
CUSTOMER_ID=$(curl -X POST http://localhost:5500/customers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Customer","phone":"1234567890"}' | jq -r '.customer_id')

# 3. Create Sale (Stock auto-deducted)
SALE_ID=$(curl -X POST http://localhost:5500/sales \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"sale_date\": \"2024-12-25\",
    \"location_id\": 1,
    \"customer_id\": $CUSTOMER_ID,
    \"lines\": [{
      \"variant_id\": 1,
      \"quantity\": 1,
      \"unit_price\": 800,
      \"tax_rate\": 18
    }]
  }" | jq -r '.sale_id')

# 4. Add Payment
curl -X POST http://localhost:5500/sales/$SALE_ID/payments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "payment_date": "2024-12-25",
    "payment_method": "cash",
    "amount": 944
  }'

# 5. Verify Stock Deduction
curl -X GET http://localhost:5500/stock/1/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## Key Features

✅ **Automatic Stock Management**: Stock is deducted automatically when sale is created  
✅ **Stock Validation**: Prevents overselling by checking availability before sale  
✅ **Transaction Safety**: Uses database transactions for data consistency  
✅ **Invoice Generation**: Automatic unique invoice numbers  
✅ **Tax Calculation**: Per-line tax calculation with totals  
✅ **Payment Tracking**: Multiple payment methods and partial payments  
✅ **Customer History**: Track all purchases by customer  
✅ **Stock Restoration**: Stock restored if sale is deleted (no payments)  

---

## Notes

1. **Stock is deducted at sale creation**, not at payment
2. **Reserved stock** (`quantity_reserved`) is not available for sale
3. **Available stock** = `quantity_on_hand - quantity_reserved`
4. **Sales cannot be deleted** if they have payments (prevents data inconsistency)
5. **Invoice numbers** are auto-generated in format: `INV-YYYYMM-####`
6. **Tax is calculated per line item** and can be overridden per line
7. **Customer is optional** - sales can be made without customer (walk-in)

---

This completes the full customer → purchase → stock deduction flow! 🎉

