# Product API Documentation with Multiple Images

## Base URL
```
http://localhost:5500
```

---

## Products Endpoints

### 1. Create Product
**POST** `/products`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "article_code": "MSHIRT101",
  "name": "Men Slim Fit Shirt",
  "description": "Premium cotton slim fit shirt",
  "brand_id": 1,
  "category_id": 1,
  "subcategory_id": 1,
  "default_tax_rate": 18,
  "status": "active"
}
```

**Response (201):**
```json
{
  "product_id": 1,
  "article_code": "MSHIRT101",
  "name": "Men Slim Fit Shirt",
  "description": "Premium cotton slim fit shirt",
  "brand_id": 1,
  "category_id": 1,
  "subcategory_id": 1,
  "default_tax_rate": 18,
  "status": "active",
  "created_at": "2024-12-24T02:30:00.000Z",
  "updated_at": "2024-12-24T02:30:00.000Z"
}
```

**Required Roles:** `admin`, `manager`

---

### 2. Get All Products
**GET** `/products`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "product_id": 1,
    "article_code": "MSHIRT101",
    "name": "Men Slim Fit Shirt",
    "brand": { "brand_id": 1, "name": "Arrow" },
    "category": { "category_id": 1, "name": "Men" },
    "variants": [...],
    "images": [...]
  }
]
```

---

### 3. Get Product by ID
**GET** `/products/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "product_id": 1,
  "article_code": "MSHIRT101",
  "name": "Men Slim Fit Shirt",
  "description": "Premium cotton slim fit shirt",
  "brand": {
    "brand_id": 1,
    "name": "Arrow"
  },
  "category": {
    "category_id": 1,
    "name": "Men"
  },
  "variants": [...],
  "images": [
    {
      "image_id": 1,
      "image_path": "/uploads/products/product_1_1234567890.jpg",
      "image_url": "http://localhost:5500/uploads/products/product_1_1234567890.jpg",
      "image_type": "main",
      "is_primary": true,
      "display_order": 0
    }
  ]
}
```

---

### 4. Upload Multiple Images to Product
**POST** `/products/:id/images`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (form-data):**
- `images`: File[] (Multiple files, max 10)
  - Key: `images`
  - Type: File
  - Select multiple files

**Response (201):**
```json
[
  {
    "image_id": 1,
    "entity_type": "product",
    "entity_id": 1,
    "image_path": "/uploads/products/product_1_1234567890.jpg",
    "image_url": "http://localhost:5500/uploads/products/product_1_1234567890.jpg",
    "image_type": "main",
    "is_primary": true,
    "display_order": 0,
    "file_size": 245678,
    "mime_type": "image/jpeg"
  },
  {
    "image_id": 2,
    "entity_type": "product",
    "entity_id": 1,
    "image_path": "/uploads/products/product_1_1234567891.jpg",
    "image_url": "http://localhost:5500/uploads/products/product_1_1234567891.jpg",
    "image_type": "gallery",
    "is_primary": false,
    "display_order": 1,
    "file_size": 189234,
    "mime_type": "image/jpeg"
  }
]
```

**Required Roles:** `admin`, `manager`

**Note:** 
- First image automatically becomes primary (is_primary: true)
- Remaining images are marked as gallery
- Images are saved in `backend/uploads/products/` directory

---

### 5. Get Product Images
**GET** `/products/:id/images`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "image_id": 1,
    "image_path": "/uploads/products/product_1_1234567890.jpg",
    "image_url": "http://localhost:5500/uploads/products/product_1_1234567890.jpg",
    "image_type": "main",
    "is_primary": true,
    "display_order": 0
  }
]
```

---

### 6. Update Product
**PATCH** `/products/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Product Name",
  "status": "discontinued"
}
```

**Required Roles:** `admin`, `manager`

---

### 7. Delete Product
**DELETE** `/products/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Required Roles:** `admin`

---

## Images Endpoints

### 8. Delete Image
**DELETE** `/images/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Image deleted successfully"
}
```

---

### 9. Set Primary Image
**POST** `/images/:id/set-primary`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "entity_type": "product",
  "entity_id": 1
}
```

---

## Complete Flow: Create Product with Images

### Step 1: Create Product
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

**Response:** Product created with `product_id: 1`

### Step 2: Upload Multiple Images
```bash
POST http://localhost:5500/products/1/images
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form-data:
  images: [file1.jpg, file2.jpg, file3.jpg]
```

**Response:** Array of uploaded images with URLs

---

## Postman Testing Guide

### Create Product with Images:

1. **Login first** to get token:
   ```
   POST http://localhost:5500/auth/login
   Body: { "username": "admin", "password": "admin123" }
   Copy the access_token
   ```

2. **Create Product:**
   - Method: `POST`
   - URL: `http://localhost:5500/products`
   - Headers:
     - `Authorization: Bearer <token>`
     - `Content-Type: application/json`
   - Body (raw JSON):
   ```json
   {
     "article_code": "MSHIRT101",
     "name": "Men Slim Fit Shirt",
     "brand_id": 1,
     "category_id": 1,
     "status": "active"
   }
   ```
   - Response me `product_id` copy karo

3. **Upload Images:**
   - Method: `POST`
   - URL: `http://localhost:5500/products/{product_id}/images`
   - Headers:
     - `Authorization: Bearer <token>`
   - Body → form-data:
     - Key: `images` (Type: File)
     - Value: Select multiple image files (max 10)
   - Send

4. **View Product with Images:**
   - Method: `GET`
   - URL: `http://localhost:5500/products/{product_id}`
   - Headers: `Authorization: Bearer <token>`

---

## Image File Storage

- **Location:** `backend/uploads/products/`
- **URL Pattern:** `http://localhost:5500/uploads/products/{filename}`
- **Naming:** `product_{product_id}_{timestamp}.{extension}`
- **Supported Formats:** JPEG, PNG, WebP, etc.
- **Max Files:** 10 images per upload

---

## Important Notes

1. **Authentication Required:** All endpoints require JWT token
2. **Role-Based Access:** 
   - Create/Update/Delete: `admin`, `manager`
   - View: All authenticated users
3. **Image Upload:** Only `admin` and `manager` can upload images
4. **Primary Image:** First uploaded image becomes primary automatically
5. **File Size:** No explicit limit set, but recommended max 5MB per image



