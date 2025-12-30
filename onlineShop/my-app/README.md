# Online Shop - Customer Portal

A modern e-commerce frontend for customers to browse and purchase fashion products.

## Features

✅ Browse products (public - no login required)  
✅ View product details with variants (color, size)  
✅ Shopping cart with localStorage persistence  
✅ Customer registration and login  
✅ Checkout flow  
✅ Order tracking  

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set environment variables:**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5500
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the shop:**
   Open [http://localhost:3000](http://localhost:3000)

## Pages

- `/` - Product listing (homepage)
- `/products/[id]` - Product detail page
- `/cart` - Shopping cart
- `/login` - Customer login
- `/register` - Customer registration
- `/checkout` - Checkout page
- `/orders` - Order history (requires login)

## API Integration

The app connects to the backend API at `http://localhost:5500` (configurable via `NEXT_PUBLIC_API_URL`).

### Public Endpoints (No Auth):
- `GET /products` - Get all products
- `GET /products/:id` - Get product details
- `GET /variants/product/:id` - Get product variants
- `GET /colors` - Get all colors
- `GET /sizes` - Get all sizes
- `GET /stock/variant/:id` - Get stock for variant

### Customer Endpoints:
- `POST /customers/register` - Register new customer
- `POST /customers/login` - Customer login
- `GET /customers/me` - Get customer profile

### Order Endpoints:
- `POST /orders` - Create order
- `POST /orders/:id/confirm` - Confirm order
- `POST /orders/:id/payment` - Process payment
- `GET /orders/customer/:id` - Get customer orders

## Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Context** - State management (Cart, Auth)

## Project Structure

```
my-app/
├── app/
│   ├── page.tsx              # Homepage (product listing)
│   ├── products/[id]/        # Product detail
│   ├── cart/                 # Shopping cart
│   └── layout.tsx            # Root layout with providers
├── src/
│   ├── lib/
│   │   └── api.ts           # API client
│   ├── contexts/
│   │   ├── CartContext.tsx   # Shopping cart state
│   │   └── CustomerAuthContext.tsx  # Customer auth state
│   └── types/
│       └── index.ts         # TypeScript types
```

## Usage

1. **Browse Products:**
   - Visit the homepage to see all products
   - Use search to filter products
   - Click on a product to view details

2. **Add to Cart:**
   - Select color and size on product page
   - Choose quantity
   - Click "Add to Cart"
   - Cart persists in localStorage

3. **Checkout:**
   - Go to cart page
   - Review items
   - Select location
   - Proceed to checkout
   - Complete order

4. **Track Orders:**
   - Login as customer
   - Visit orders page
   - View order history and status

## Notes

- Cart is stored in browser localStorage
- Customer tokens stored in localStorage
- Products are fetched from public API (no authentication required)
- Guest checkout is supported (no registration required)
