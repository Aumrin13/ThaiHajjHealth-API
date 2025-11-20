import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { config } from './config';
import logger from './config/logger';
import { errorHandler } from './middleware/error.middleware';
import { swaggerSpec } from './config/swagger';

// Import routes
import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';
import hospitalRoutes from './routes/hospital.routes';
import districtRoutes from './routes/district.routes';
import amphurRoutes from './routes/amphur.routes';
import provinceRoutes from './routes/province.routes';
import auditlogRoutes from './routes/auditlog.routes';
import subdistrictRoutes from './routes/subdistrict.routes';

const app: Express = express();

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: `
    .swagger-ui .topbar { background: #00695c; }
    .swagger-ui .topbar .topbar-wrapper img {
      content: url('https://upload.wikimedia.org/wikipedia/commons/6/6b/Thai_Emblem_Garuda.svg');
      height: 40px;
      margin-right: 16px;
    }
    .swagger-ui .topbar .topbar-wrapper span { font-size: 1.2rem; color: #fff; }
    .swagger-ui .info { margin-bottom: 30px; }
    .swagger-ui .scheme-container { background: #e0f2f1; }
    .swagger-ui .opblock.opblock-post { border-left: 5px solid #43a047; }
    .swagger-ui .opblock.opblock-get { border-left: 5px solid #1976d2; }
    .swagger-ui .opblock.opblock-put { border-left: 5px solid #ffa000; }
    .swagger-ui .opblock.opblock-delete { border-left: 5px solid #e53935; }
    .swagger-ui .btn.authorize { background: #00695c; }
    .swagger-ui .info .title { font-size: 2rem; color: #00695c; }
    .swagger-ui .info .base-url { color: #00695c; }
  `,
  customSiteTitle: 'Thai Hajj Health API Docs',
}));

// Security middleware
app.use(helmet());
app.use(cors(config.cors));
// Manual CORS header fallback (for custom needs)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  return next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
}));

// Root endpoint - API Landing Page
app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'Thai Hajj Health System API',
    version: '1.0.0',
    description: 'Backend API for managing Thai Hajj pilgrims health records and documentation',
    status: 'running',
    timestamp: new Date().toISOString(),
    documentation: {
      swagger: '/api-docs',
      api: '/api/docs',
    },
    contact: {
      organization: 'ศูนย์บริหารการพัฒนาสุขภาพจังหวัดชายแดนภาคใต้ (ศบ.สต)',
      email: 'support@southhealthcenter.com',
    }
  });
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Documentation endpoint
app.get('/api/docs', (_req: Request, res: Response) => {
  res.json({
    title: 'Thai Hajj Health System API Documentation',
    version: '1.0.0',
    baseUrl: process.env.NODE_ENV === 'production' 
      ? 'http://api-thaihajjhealth.southhealthcenter.com' 
      : 'http://localhost:4000',
    authentication: {
      type: 'Bearer Token (JWT)',
      header: 'Authorization: Bearer <token>',
      tokenExpiry: {
        accessToken: '15 minutes',
        refreshToken: '7 days',
      },
      howToGetToken: {
        step1: 'POST /api/auth/login with email and password',
        step2: 'Receive accessToken and refreshToken in response',
        step3: 'Include accessToken in Authorization header for protected routes',
        step4: 'Use refreshToken to get new accessToken when expired',
      }
    },
    endpoints: [
      {
        group: 'Authentication',
        routes: [
          {
            method: 'POST',
            path: '/api/auth/login',
            description: 'Login with email and password',
            body: { email: 'string', password: 'string' },
            response: { user: 'object', accessToken: 'string', refreshToken: 'string' }
          },
          {
            method: 'POST',
            path: '/api/auth/register',
            description: 'Register new user account',
            body: { username: 'string', email: 'string', password: 'string', fullName: 'string', role: 'UserRole' },
            response: { user: 'object' }
          },
          {
            method: 'GET',
            path: '/api/auth/me',
            description: 'Get current user profile',
            auth: 'required',
            response: { user: 'object' }
          },
        ]
      },
      {
        group: 'Users Management',
        routes: [
          {
            method: 'GET',
            path: '/api/users',
            description: 'Get all users with pagination and filters',
            auth: 'required (ADMIN or EXECUTIVE)',
            query: { page: 'number', limit: 'number', search: 'string', role: 'string', status: 'string' },
            response: { data: 'array', pagination: 'object' }
          },
          {
            method: 'POST',
            path: '/api/users',
            description: 'Create new user',
            auth: 'required (ADMIN only)',
            body: { username: 'string', email: 'string', password: 'string', fullName: 'string', role: 'UserRole' },
            response: { user: 'object' }
          },
        ]
      }
    ],
    examples: {
      login: {
        request: {
          method: 'POST',
          url: '/api/auth/login',
          headers: { 'Content-Type': 'application/json' },
          body: { email: 'admin@thh.com', password: 'admin123' }
        },
        response: {
          success: true,
          data: {
            user: { id: 'uuid', email: 'admin@thh.com', role: 'ADMIN' },
            accessToken: 'eyJhbG...',
            refreshToken: 'eyJhbG...'
          }
        }
      },
      getUsers: {
        request: {
          method: 'GET',
          url: '/api/users?page=1&limit=10&role=STAFF',
          headers: { Authorization: 'Bearer <accessToken>' }
        },
        response: {
          success: true,
          data: [{ id: 'uuid', username: 'staff1', email: 'staff@thh.com', role: 'STAFF' }],
          pagination: { page: 1, limit: 10, total: 25, totalPages: 3 }
        }
      }
    },
    errorCodes: {
      400: 'Bad Request - Invalid input',
      401: 'Unauthorized - Invalid or missing token',
      403: 'Forbidden - Insufficient permissions',
      404: 'Not Found - Resource not found',
      500: 'Internal Server Error',
    },
    notes: [
      'All timestamps are in ISO 8601 format',
      'Passwords must be at least 8 characters',
      'Rate limit: 100 requests per 15 minutes per IP',
      'Max file upload size: 10MB',
    ]
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api', hospitalRoutes);
app.use('/api', districtRoutes);
app.use('/api', amphurRoutes);
app.use('/api', provinceRoutes);
app.use('/api', auditlogRoutes);
app.use('/api', subdistrictRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
