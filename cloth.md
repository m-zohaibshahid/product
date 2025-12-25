## Clothing Shop Inventory System – Functional & Data Design

### 1. Introduction

Ye document ek **clothing shop ke inventory management system** ka design batata hai.  
Isme hum cover karenge:

- System ka **overview**
- **Entities / tables** ka detail (suppliers, products, variants, stock, purchase, sales, returns, etc.)
- **ER diagram** (Mermaid format)
- **Workflows** ka flow (material aana → stock me jaana → sale → stock update)
- Basic **documentation structure**

Is document ko aap app ya website ke backend/database design ke base ke roop me use kar sakte ho.

---

## 2. High-Level Features

- **Suppliers management**: Jahan se maal aata hai.
- **Products & Variants (Article / Color / Size)**:
  - Example: Product = "Men Slim Fit Shirt"
  - Variant = "Men Slim Fit Shirt – Blue – Size M"
- **Stock per Location**: Har shop/warehouse ke liye stock.
- **Purchase Orders & Receiving**: Supplier se order aur phir receive karna.
- **Sales (Bills) & Returns**: Customer ko bechna aur wapas lene ka record.
- **Stock Movements History**: Har ek in/out movement ka record.
- **Users & Roles**: Admin, Manager, Cashier, Stock Keeper.
- **Reports**: Current stock, sales, purchases, slow moving items, etc.

---

## 3. Data Model / Tables (Entities)

### 3.1 Supplier

**Purpose**: Supplier ki details store karna.

**Table**: `suppliers`

**Fields:**
- `supplier_id` (PK, int)
- `name` (varchar)
- `contact_person` (varchar)
- `phone` (varchar)
- `email` (varchar)
- `address_line1` (varchar)
- `address_line2` (varchar, nullable)
- `city` (varchar)
- `state` (varchar)
- `country` (varchar)
- `postal_code` (varchar)
- `tax_id` / `gst_number` (varchar, nullable)
- `status` (enum: active, inactive)
- `notes` (text, nullable)
- `created_at` (datetime)
- `updated_at` (datetime)

---

### 3.2 Brand

**Purpose**: Kapdon ke brand manage karna.

**Table**: `brands`

**Fields:**
- `brand_id` (PK)
- `name`
- `description` (nullable)
- `status` (active/inactive)
- `created_at`, `updated_at`

---

### 3.3 Category & SubCategory

**Purpose**: Products ko group karna (e.g. Men/Women/Kids, Shirts/Trousers/etc.)

**Table**: `categories`
- `category_id` (PK)
- `name`
- `description` (nullable)

**Table**: `subcategories`
- `subcategory_id` (PK)
- `category_id` (FK → `categories.category_id`)
- `name`
- `description` (nullable)

---

### 3.4 Product (Article)

**Purpose**: Ek design/model ko represent karta hai (color/size ke bina).

**Table**: `products`

**Fields:**
- `product_id` (PK)
- `article_code` / `sku_root` (unique code, e.g. "MSHIRT101")
- `name` (e.g. "Men Slim Fit Shirt")
- `description` (text, nullable)
- `brand_id` (FK → `brands`)
- `category_id` (FK → `categories`)
- `subcategory_id` (FK → `subcategories`, nullable)
- `default_tax_rate` (decimal, nullable)
- `status` (active, discontinued)
- `created_at`, `updated_at`

---

### 3.5 Color & Size

**Table**: `colors`
- `color_id` (PK)
- `name` (e.g. "Blue")
- `code` (optional, brand code / hex code, nullable)

**Table**: `sizes`
- `size_id` (PK)
- `name` (e.g. "S", "M", "L", "XL", "32", "34")
- `size_order` (int, sorting ke liye)

---

### 3.6 ProductVariant (Article + Color + Size)

**Purpose**: Ye actual sellable item hai (har color & size combination).

**Table**: `product_variants`

**Fields:**
- `variant_id` (PK)
- `product_id` (FK → `products`)
- `color_id` (FK → `colors`)
- `size_id` (FK → `sizes`)
- `sku` (unique, barcode label ke liye)
- `barcode` (nullable, agar alag ho)
- `cost_price` (decimal)
- `selling_price` (decimal)
- `mrp` (decimal, nullable)
- `status` (active/inactive)
- `min_stock_level` (int, nullable)
- `max_stock_level` (int, nullable)
- `created_at`, `updated_at`

---

### 3.7 Location

**Purpose**: Store / warehouse / counter, jahan stock physicaly rakha hai.

**Table**: `locations`

**Fields:**
- `location_id` (PK)
- `name` (e.g. "Main Shop", "Godown")
- `type` (enum: store, warehouse, counter)
- `address` (text, nullable)
- `status` (active/inactive)
- `created_at`, `updated_at`

---

### 3.8 Stock (Current Quantity)

**Purpose**: Har `variant` ka current stock har `location` pe.

**Table**: `stock`

**Fields:**
- `stock_id` (PK)
- `location_id` (FK → `locations`)
- `variant_id` (FK → `product_variants`)
- `quantity_on_hand` (int)
- `quantity_reserved` (int, default 0, optional)
- `last_updated_at` (datetime)

**Unique constraint**: `(location_id, variant_id)` unique hona chahiye.

---

### 3.9 StockMovement (History)

**Purpose**: Har stock change (in/out) ka complete history.

**Table**: `stock_movements`

**Fields:**
- `movement_id` (PK)
- `variant_id` (FK → `product_variants`)
- `location_id` (FK → `locations`)
- `quantity_change` (int; +ve = in, -ve = out)
- `movement_type` (enum: purchase, sale, return_in, return_out, adjustment, transfer_in, transfer_out)
- `related_document_type` (varchar; e.g. "purchase_order", "sale", "stock_adjustment")
- `related_document_id` (int, nullable)
- `created_at` (datetime)
- `created_by` (FK → `users.user_id`)
- `remark` (text, nullable)

---

### 3.10 PurchaseOrder & PurchaseOrderLine

**Purpose**: Supplier se order aur receive karne ka record.

**Table**: `purchase_orders`
- `po_id` (PK)
- `supplier_id` (FK → `suppliers`)
- `po_number` (unique)
- `order_date` (date)
- `expected_delivery_date` (date, nullable)
- `status` (enum: draft, ordered, partially_received, fully_received, cancelled)
- `total_amount` (decimal, optional / derived)
- `created_by` (FK → `users`)
- `created_at`, `updated_at`

**Table**: `purchase_order_lines`
- `po_line_id` (PK)
- `po_id` (FK → `purchase_orders`)
- `variant_id` (FK → `product_variants`)
- `ordered_qty` (int)
- `received_qty` (int, default 0)
- `unit_cost` (decimal)
- `tax_rate` (decimal)
- `discount` (decimal, nullable)
- `line_total` (decimal, derived)

---

### 3.11 Customer (Optional)

**Table**: `customers`
- `customer_id` (PK)
- `name`
- `phone`
- `email` (nullable)
- `address` (text, nullable)
- `tax_id` / `gst_number` (nullable)
- `created_at`

---

### 3.12 Sale & SaleLine (Bill / Invoice)

**Purpose**: Customer sales ka record.

**Table**: `sales`
- `sale_id` (PK)
- `invoice_number` (unique)
- `sale_date` (datetime)
- `location_id` (FK → `locations`)
- `customer_id` (FK → `customers`, nullable)
- `subtotal_amount` (decimal)
- `discount_amount` (decimal)
- `tax_amount` (decimal)
- `total_amount` (decimal)
- `payment_status` (enum: paid, partial, unpaid)
- `created_by` (FK → `users`)
- `created_at`

**Table**: `sale_lines`
- `sale_line_id` (PK)
- `sale_id` (FK → `sales`)
- `variant_id` (FK → `product_variants`)
- `quantity` (int)
- `unit_price` (decimal)
- `discount` (decimal, nullable)
- `tax_rate` (decimal)
- `line_total` (decimal)

---

### 3.13 Payments

**Purpose**: Har sale ke against payment detail.

**Table**: `payments`
- `payment_id` (PK)
- `sale_id` (FK → `sales`)
- `payment_date` (datetime)
- `payment_method` (enum: cash, card, upi, etc.)
- `amount` (decimal)
- `reference_number` (varchar, nullable – transaction ID, UPI ref, etc.)
- `received_by` (FK → `users`)

---

### 3.14 Returns (Optional Separate Tables)

Simple approach me returns ko `sale_lines` me **negative quantity** ke form me store kiya ja sakta hai aur corresponding `stock_movements` me `movement_type = return_in`.

Agar alag tables chahiye:

**Table**: `returns`
- `return_id` (PK)
- `sale_id` (FK → `sales`)
- `return_date` (datetime)
- `total_refund_amount` (decimal)
- `handled_by` (FK → `users`)

**Table**: `return_lines`
- `return_line_id` (PK)
- `return_id` (FK → `returns`)
- `variant_id` (FK → `product_variants`)
- `quantity` (int)
- `refund_amount` (decimal)

---

### 3.15 Users & Roles

**Table**: `roles`
- `role_id` (PK)
- `name` (e.g. admin, manager, cashier, stock_keeper)
- `description` (nullable)

**Table**: `users`
- `user_id` (PK)
- `username` (unique)
- `password_hash`
- `full_name`
- `role_id` (FK → `roles`)
- `status` (active/inactive)
- `created_at`

(Optional: `permissions`, `role_permissions` agar granular rights chahiye.)

---

### 3.16 StockAdjustment (Optional Detailed)

**Table**: `stock_adjustments`
- `adjustment_id` (PK)
- `location_id` (FK → `locations`)
- `adjustment_date` (datetime)
- `reason` (text)
- `created_by` (FK → `users`)
- `created_at`

**Table**: `stock_adjustment_lines`
- `adjustment_line_id` (PK)
- `adjustment_id` (FK → `stock_adjustments`)
- `variant_id` (FK → `product_variants`)
- `old_qty` (int)
- `new_qty` (int)
- `difference_qty` (int)

---

## 4. ER Diagram (Mermaid)

Is section ko aap kisi Mermaid-supporting editor me paste karke diagram generate kar sakte ho.
maid
erDiagram

  SUPPLIERS ||--o{ PURCHASE_ORDERS : places
  PURCHASE_ORDERS ||--o{ PURCHASE_ORDER_LINES : has

  BRANDS ||--o{ PRODUCTS : has
  CATEGORIES ||--o{ SUBCATEGORIES : has
  CATEGORIES ||--o{ PRODUCTS : classifies
  SUBCATEGORIES ||--o{ PRODUCTS : classifies

  PRODUCTS ||--o{ PRODUCT_VARIANTS : has_variants
  COLORS ||--o{ PRODUCT_VARIANTS : color_of
  SIZES ||--o{ PRODUCT_VARIANTS : size_of

  LOCATIONS ||--o{ STOCK : holds
  PRODUCT_VARIANTS ||--o{ STOCK : in_stock

  PRODUCT_VARIANTS ||--o{ STOCK_MOVEMENTS : moves
  LOCATIONS ||--o{ STOCK_MOVEMENTS : at

  PURCHASE_ORDER_LINES }o--|| PRODUCT_VARIANTS : ordered
  PURCHASE_ORDER_LINES }o--|| PURCHASE_ORDERS : belongs_to

  CUSTOMERS ||--o{ SALES : makes
  SALES ||--o{ SALE_LINES : contains
  PRODUCT_VARIANTS ||--o{ SALE_LINES : sold_as

  SALES ||--o{ PAYMENTS : paid_by

  ROLES ||--o{ USERS : has
  USERS ||--o{ PURCHASE_ORDERS : created
  USERS ||--o{ SALES : created
  USERS ||--o{ STOCK_MOVEMENTS : performed

  STOCK_ADJUSTMENTS ||--o{ STOCK_ADJUSTMENT_LINES : has
  PRODUCT_VARIANTS ||--o{ STOCK_ADJUSTMENT_LINES : adjusted
  LOCATIONS ||--o{ STOCK_ADJUSTMENTS : at
  USERS ||--o{ STOCK_ADJUSTMENTS : made_by---

## 5. Main Workflows (How System Will Work)

### 5.1 Master Data Setup

1. **Suppliers add karo**: `suppliers` table me entries.
2. **Brand/Category/Color/Size setup karo**.
3. **Products banao**: `products` me basic info.
4. **Product Variants banao**:
   - For each color & size, `product_variants` me record:
   - Set `sku`, `cost_price`, `selling_price`, `mrp`.

---

### 5.2 Receiving Stock from Supplier

1. **Purchase Order create**:
   - Choose `supplier`.
   - `purchase_orders` me header + `purchase_order_lines` me variants & quantity.
2. **Goods receive**:
   - Jab maal aaye, `received_qty` update karo.
   - For each received line:
     - `stock_movements` entry:
       - `movement_type = purchase`
       - `quantity_change = +received_qty`
       - `location_id` jahan stock rakh rahe ho.
     - `stock` table me `quantity_on_hand` increase karo.
3. **Status update**:
   - Agar sab aagaya: `status = fully_received`
   - Agar kuch baad me aana hai: `status = partially_received`

---

### 5.3 Selling to Customer (Billing / POS)

1. **New Sale**:
   - `sales` me new record with `location_id`, `sale_date`.
   - `sale_lines` me variants & quantity add karo.
2. **Stock Deduction**:
   - For each `sale_line`:
     - `stock_movements`:
       - `movement_type = sale`
       - `quantity_change = -quantity`
     - `stock.quantity_on_hand` kam karo.
3. **Payments**:
   - `payments` table me record:
     - `payment_method`, `amount`, `reference_number` (agar card/UPI).
   - `sales.payment_status` update karo (paid/partial/unpaid).
4. **Customer Copy**:
   - Invoice print / PDF, with items, taxes, total.

---

### 5.4 Returns

#### Simple Implementation
- Same `sale_id` ke against:
  - `sale_lines` me naya line ya existing line with negative `quantity`.
  - `stock_movements`:
    - `movement_type = return_in`
    - `quantity_change = +returned_qty`.

#### Separate Tables Use Karne Par
- `returns` and `return_lines` me record banao.
- Stock adjust:
  - `stock_movements` me `return_in` ke saath +quantity.

---

### 5.5 Stock Adjustments

1. **Stock Counting**:
   - Physical count vs system `stock.quantity_on_hand`.
2. **Adjustment**:
   - `stock_adjustments` me entry + `stock_adjustment_lines`.
   - For each variant:
     - `difference_qty = new_qty - old_qty`.
     - `stock_movements` with `movement_type = adjustment` and `quantity_change = difference_qty`.
     - `stock.quantity_on_hand = new_qty`.

---

### 5.6 Transfers Between Locations

1. **From Location → To Location**:
   - Source se:
     - `stock_movements`:
       - `movement_type = transfer_out`
       - `quantity_change = -qty`.
   - Destination:
     - `stock_movements`:
       - `movement_type = transfer_in`
       - `quantity_change = +qty`.
   - Dono locations ke `stock` table update karo.

---

## 6. Reporting Ideas

- **Current Stock Report**:
  - Join `stock` + `product_variants` + `products` + `colors` + `sizes`.
- **Sales Report**:
  - `sales` + `sale_lines` se date range / product wise sale.
- **Purchase Report**:
  - `purchase_orders` + `purchase_order_lines` se supplier wise purchase.
- **Fast / Slow Moving Items**:
  - `stock_movements` ya `sale_lines` se last X days me kitna becha gaya.
- **Stock Valuation**:
  - Sum(`stock.quantity_on_hand * product_variants.cost_price`).

---

## 7. Implementation Notes

- **Database**: MySQL / PostgreSQL recommended.
- **Backend**: Node.js (Express/Nest), Laravel (PHP), Django (Python), etc.
- **Authentication**: `users` + `roles`, password hashing (bcrypt, etc.).
- **Backups**: Daily DB backup.
- **Audit Fields**: Almost har table me `created_at`, `updated_at`, aur zarurat ho to `created_by`.

---

## 8. Next Steps

- Is design ko base karke:
  - SQL schema likho (CREATE TABLE statements).
  - Backend API endpoints design karo:
    - `/suppliers`, `/products`, `/variants`, `/stock`
    - `/purchase-orders`, `/sales`, `/payments`, `/stock-movements`
  - UI screens define karo:
    - Master data, Purchase, Sales, Stock, Reports.

Ye document aapke project ke initial phase ke liye complete high-level design deta hai. 