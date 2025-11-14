# Thai Hajj Health API - Complete Documentation

## Base URL
```
http://localhost:4000/api
```

---

## 🔐 Authentication Endpoints

### 1. Register User
Create a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "fullName": "John Doe",
  "role": "STAFF",
  "hospital": "Bangkok Hospital",
  "phoneNumber": "081-234-5678"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "role": "STAFF",
    "hospital": "Bangkok Hospital",
    "phoneNumber": "081-234-5678",
    "status": "ACTIVE",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 2. Login
Authenticate user and get tokens.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "admin@thh.com",
  "password": "admin123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "admin",
      "email": "admin@thh.com",
      "fullName": "ผู้ดูแลระบบ",
      "role": "ADMIN",
      "hospital": null
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 3. Refresh Access Token
Get a new access token using refresh token.

**Endpoint:** `POST /auth/refresh-token`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 4. Logout
Invalidate refresh token.

**Endpoint:** `POST /auth/logout`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

### 5. Get Current User
Get authenticated user's information.

**Endpoint:** `GET /auth/me`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "admin",
    "email": "admin@thh.com",
    "fullName": "ผู้ดูแลระบบ",
    "role": "ADMIN",
    "hospital": null,
    "phoneNumber": null,
    "status": "ACTIVE",
    "lastLogin": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 6. Change Password
Change authenticated user's password.

**Endpoint:** `PUT /auth/change-password`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "message": "Password changed successfully"
  }
}
```

---

## 👥 Users Management Endpoints

### 1. Get All Users
Get paginated list of users with optional filters.

**Endpoint:** `GET /users`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `search` (string, optional) - Search by username, email, or fullName
- `role` (string, optional) - Filter by role: ADMIN, STAFF, EXECUTIVE
- `status` (string, optional) - Filter by status: ACTIVE, INACTIVE, SUSPENDED

**Example:**
```
GET /users?page=1&limit=10&role=STAFF&search=john
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "username": "john_doe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "role": "STAFF",
      "hospital": "Bangkok Hospital",
      "phoneNumber": "081-234-5678",
      "status": "ACTIVE",
      "lastLogin": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

---

### 2. Get User by ID
Get specific user details.

**Endpoint:** `GET /users/:id`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "role": "STAFF",
    "hospital": "Bangkok Hospital",
    "phoneNumber": "081-234-5678",
    "status": "ACTIVE",
    "lastLogin": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 3. Create User (Admin Only)
Create a new user.

**Endpoint:** `POST /users`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "username": "jane_smith",
  "email": "jane@example.com",
  "password": "SecurePass123!",
  "fullName": "Jane Smith",
  "role": "STAFF",
  "hospital": "Chiang Mai Hospital",
  "phoneNumber": "082-345-6789"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "jane_smith",
    "email": "jane@example.com",
    "fullName": "Jane Smith",
    "role": "STAFF",
    "hospital": "Chiang Mai Hospital",
    "phoneNumber": "082-345-6789",
    "status": "ACTIVE",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 4. Update User (Admin Only)
Update user information.

**Endpoint:** `PUT /users/:id`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "fullName": "Jane Doe",
  "hospital": "Phuket Hospital",
  "phoneNumber": "083-456-7890"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "jane_smith",
    "email": "jane@example.com",
    "fullName": "Jane Doe",
    "role": "STAFF",
    "hospital": "Phuket Hospital",
    "phoneNumber": "083-456-7890",
    "status": "ACTIVE",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 5. Update User Role (Admin Only)
Change user's role.

**Endpoint:** `PUT /users/:id/role`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "role": "EXECUTIVE"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "message": "User role updated successfully"
  }
}
```

---

### 6. Update User Status (Admin Only)
Change user's status.

**Endpoint:** `PUT /users/:id/status`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "status": "INACTIVE"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "message": "User status updated successfully"
  }
}
```

---

### 7. Delete User (Admin Only)
Delete a user.

**Endpoint:** `DELETE /users/:id`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "message": "User deleted successfully"
  }
}
```

---

## 🔒 Authorization Rules

### User Roles & Permissions

| Endpoint | ADMIN | STAFF | EXECUTIVE |
|----------|-------|-------|-----------|
| POST /auth/register | ✅ | ✅ | ✅ |
| POST /auth/login | ✅ | ✅ | ✅ |
| GET /auth/me | ✅ | ✅ | ✅ |
| PUT /auth/change-password | ✅ | ✅ | ✅ |
| GET /users | ✅ | ❌ | ✅ |
| GET /users/:id | ✅ | ❌ | ✅ |
| POST /users | ✅ | ❌ | ❌ |
| PUT /users/:id | ✅ | ❌ | ❌ |
| DELETE /users/:id | ✅ | ❌ | ❌ |
| PUT /users/:id/role | ✅ | ❌ | ❌ |
| PUT /users/:id/status | ✅ | ❌ | ❌ |

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Invalid token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "Forbidden: Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## 📝 Notes

1. **Access tokens** expire in 15 minutes
2. **Refresh tokens** expire in 7 days
3. All timestamps are in ISO 8601 format
4. Password must be at least 8 characters
5. Rate limit: 100 requests per 15 minutes per IP

---

## 🧪 Testing with cURL

### Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@thh.com","password":"admin123"}'
```

### Get Users (with token)
```bash
curl -X GET http://localhost:4000/api/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Create User
```bash
curl -X POST http://localhost:4000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "username":"test_user",
    "email":"test@example.com",
    "password":"Test123!",
    "fullName":"Test User",
    "role":"STAFF"
  }'
```
