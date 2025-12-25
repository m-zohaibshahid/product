# Authentication API Documentation

## Base URL
```
http://localhost:5500
```

---

## Authentication Endpoints

### 1. Register New User
**POST** `/auth/register`

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123",
  "full_name": "Admin User",
  "role_id": 1
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "user_id": 1,
    "username": "admin",
    "full_name": "Admin User",
    "role_id": 1,
    "status": "active",
    "created_at": "2024-12-24T02:20:00.431Z"
  }
}
```

**Errors:**
- `409 Conflict`: Username already exists
- `404 Not Found`: Role not found
- `400 Bad Request`: Validation errors

---

### 2. Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": 1,
    "username": "admin",
    "full_name": "Admin User",
    "role_id": 1,
    "status": "active",
    "created_at": "2024-12-24T02:20:00.431Z",
    "role": {
      "role_id": 1,
      "name": "admin",
      "description": "Full system access"
    }
  },
  "message": "Login successful"
}
```

**Errors:**
- `401 Unauthorized`: Invalid credentials
- `401 Unauthorized`: User account is inactive

---

### 3. Get Current User Profile
**GET** `/auth/profile`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "user_id": 1,
  "username": "admin",
  "full_name": "Admin User",
  "role_id": 1,
  "status": "active",
  "created_at": "2024-12-24T02:20:00.431Z",
  "role": {
    "role_id": 1,
    "name": "admin",
    "description": "Full system access"
  }
}
```

**Errors:**
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: User not found

---

### 4. Get Current User (Me)
**GET** `/auth/me`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "user": {
    "user_id": 1,
    "username": "admin",
    "full_name": "Admin User",
    "role_id": 1,
    "status": "active",
    "role": {
      "role_id": 1,
      "name": "admin"
    }
  },
  "message": "Current user information"
}
```

---

## Roles Endpoints

### 5. Get All Roles
**GET** `/roles`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
[
  {
    "role_id": 1,
    "name": "admin",
    "description": "Full system access"
  },
  {
    "role_id": 2,
    "name": "manager",
    "description": "Manage purchases, sales, and reports"
  },
  {
    "role_id": 3,
    "name": "cashier",
    "description": "Handle sales and payments"
  },
  {
    "role_id": 4,
    "name": "stock_keeper",
    "description": "Manage stock and receiving goods"
  }
]
```

---

## Available Roles

1. **admin** - Full system access
2. **manager** - Manage purchases, sales, and reports
3. **cashier** - Handle sales and payments
4. **stock_keeper** - Manage stock and receiving goods

---

## Postman Testing Guide

### Step 1: Get Available Roles
1. Method: `GET`
2. URL: `http://localhost:5500/roles`
3. Headers: `Authorization: Bearer <token>` (ya pehle login karke token lelo)
4. Ya seed roles check karne ke liye database me directly check karo

### Step 2: Register a User
1. Method: `POST`
2. URL: `http://localhost:5500/auth/register`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "username": "admin",
  "password": "admin123",
  "full_name": "Admin User",
  "role_id": 1
}
```

**Role IDs:**
- `1` = admin
- `2` = manager
- `3` = cashier
- `4` = stock_keeper

### Step 3: Login
1. Method: `POST`
2. URL: `http://localhost:5500/auth/login`
3. Headers: `Content-Type: application/json`
4. Body:
```json
{
  "username": "admin",
  "password": "admin123"
}
```
5. Response me `access_token` copy karo

### Step 4: Test Protected Endpoint
1. Method: `GET`
2. URL: `http://localhost:5500/auth/profile`
3. Headers: 
   - `Authorization: Bearer <your_access_token>`
   - `Content-Type: application/json`

---

## Using Roles Guard in Your Controllers

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('products')
export class ProductsController {
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  findAll() {
    // Only admin and manager can access
  }
}
```

---

## Password Requirements

- Minimum 6 characters
- Stored as bcrypt hash in database

---

## JWT Token

- **Expires In:** 24 hours
- **Algorithm:** HS256
- **Secret:** Set in `.env` file as `JWT_SECRET`

---

## Example: Complete Registration Flow

1. **Register Admin User:**
```bash
POST http://localhost:5500/auth/register
{
  "username": "admin",
  "password": "admin123",
  "full_name": "System Administrator",
  "role_id": 1
}
```

2. **Login:**
```bash
POST http://localhost:5500/auth/login
{
  "username": "admin",
  "password": "admin123"
}
```

3. **Use Token in Protected Routes:**
```
Authorization: Bearer <token_from_login_response>
```



