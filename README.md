# Thai Hajj Health API

Backend API for Thai Hajj Health System

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Setup Database
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Seed database
npm run prisma:seed
```

### 4. Start Development Server
```bash
npm run dev
```

Server will run on `http://localhost:4000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout (requires auth)
- `POST /api/auth/refresh-token` - Refresh access token
- `GET /api/auth/me` - Get current user (requires auth)
- `PUT /api/auth/change-password` - Change password (requires auth)

### Users (Admin only)
- `GET /api/users` - Get all users (with pagination)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PUT /api/users/:id/role` - Update user role
- `PUT /api/users/:id/status` - Update user status

## 🔐 Authentication

### Login Request
```json
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Response
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "admin",
      "email": "admin@example.com",
      "fullName": "Admin User",
      "role": "ADMIN"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### Using Access Token
Add to request headers:
```
Authorization: Bearer <accessToken>
```

## 👥 User Roles

- **ADMIN** - Full access to all endpoints
- **STAFF** - Access to patient management
- **EXECUTIVE** - Read-only access to reports

## 📦 Tech Stack

- **Node.js** + **Express** + **TypeScript**
- **Prisma** ORM with **PostgreSQL**
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Winston** for logging
- **Joi** for validation

## 📁 Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Custom middleware
├── routes/          # API routes
├── utils/           # Utility functions
├── validators/      # Request validation schemas
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

## 🛠️ Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:seed` - Seed database

## 📝 Environment Variables

See `.env.example` for required environment variables.

## 🔒 Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting
- CORS configuration
- Helmet security headers
- Input validation
- Role-based access control

## 📄 License

MIT
