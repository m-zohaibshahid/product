# Online Shop Frontend - Customer Portal

## Overview

This is the customer-facing online shop frontend where customers can browse products, add to cart, and place orders. This is separate from the admin frontend.

---

## Features

✅ **Public Product Browsing** - No login required  
✅ **Customer Registration & Login** - Create account and login  
✅ **Shopping Cart** - Add/remove items, manage quantities  
✅ **Product Details** - View variants, colors, sizes, stock  
✅ **Checkout Flow** - Create order → Confirm → Process payment  
✅ **Order History** - View all orders (requires login)  
✅ **Guest Checkout** - Purchase without registration  

---

## Pages Structure

### `/shop` - Shop Homepage
- Browse all products
- Search functionality
- Product cards with images
- Cart icon with item count
- Login link

### `/shop/products/[id]` - Product Detail
- Product images (primary + gallery)
- Color and size selection
- Stock availability
- Quantity selector
- Add to cart button

### `/shop/login` - Customer Login
- Email and password login
- Link to registration
- Guest checkout option

### `/shop/register` - Customer Registration
- Full registration form
- Email, password, address fields
- Redirects to login after registration

### `/shop/cart` - Shopping Cart
- View all cart items
- Update quantities
- Remove items
- Select location
- Proceed to checkout

### `/shop/checkout` - Checkout
- Shipping address
- Payment method selection (COD/Card/UPI/etc)
- Order summary
- Create order → Confirm order → Process payment

### `/shop/orders` - Order History
- List all customer orders
- Order status badges
- Payment status
- Link to order details

### `/shop/orders/[id]` - Order Details
- Full order information
- Order items
- Shipping address
- Payment details
- Invoice number (if converted to sale)

---

## Contexts

### CustomerAuthContext
- Manages customer authentication state
- Provides `login`, `register`, `logout` functions
- Tracks customer information
- Handles customer JWT tokens

### CartContext
- Manages shopping cart state
- Persists cart in localStorage
- Provides `addItem`, `removeItem`, `updateQuantity` functions
- Calculates totals

---

## API Integration

### Customer APIs
- `POST /customers/register` - Register new customer
- `POST /customers/login` - Customer login
- `GET /customers/me` - Get customer profile

### Order APIs
- `POST /orders` - Create order (cart)
- `POST /orders/:id/confirm` - Confirm order (reserve stock)
- `POST /orders/:id/payment` - Process payment (deduct stock)
- `GET /orders` - Get all orders (staff)
- `GET /orders/:id` - Get order details
- `GET /orders/customer/:id` - Get customer orders

### Product APIs (Public)
- `GET /products` - Get all products
- `GET /products/:id` - Get product details
- `GET /variants/product/:id` - Get variants by product
- `GET /colors` - Get all colors
- `GET /sizes` - Get all sizes

---

## Flow

### Online Order Flow:
```
1. Browse Products (/shop)
   ↓
2. View Product Details (/shop/products/[id])
   ↓
3. Add to Cart (stored in localStorage)
   ↓
4. View Cart (/shop/cart)
   ↓
5. Checkout (/shop/checkout)
   - Create Order (POST /orders)
   - Confirm Order (POST /orders/:id/confirm) → Reserve Stock
   - Process Payment (POST /orders/:id/payment) → Deduct Stock
   ↓
6. View Order (/shop/orders/[id])
```

### Guest Checkout:
- Works without registration
- Can browse and add to cart
- Can checkout without login
- Order created without customer_id

---

## Key Components

- **Shop Layout** (`app/shop/layout.tsx`) - Wraps shop pages with CustomerAuthProvider and CartProvider
- **Product Cards** - Display products with images and prices
- **Cart Icon** - Shows item count in header
- **Order Summary** - Shows totals and payment info
- **Status Badges** - Color-coded order status

---

## Styling

- Uses Tailwind CSS
- Responsive design
- Modern UI with gradients
- Blue color scheme for shop
- Clean, professional look

---

## Environment Variables

Make sure `NEXT_PUBLIC_API_URL` is set in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5500
```

---

## Usage

1. **Start the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Access the shop:**
   - Visit `http://localhost:3000/shop`
   - Browse products (no login required)
   - Add items to cart
   - Checkout as guest or login

3. **Customer Registration:**
   - Click "Login" → "Create Account"
   - Fill registration form
   - Login after registration
   - View order history

---

## Notes

- Cart persists in localStorage
- Customer tokens stored in localStorage
- Products are fetched from public API (no auth)
- Orders require authentication (optional for guest)
- Stock is reserved on order confirmation
- Stock is deducted on payment processing

---

This completes the online shop frontend! 🎉

