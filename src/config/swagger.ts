import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Thai Hajj Health System API',
      version: '1.0.0',
      description: 'API สำหรับระบบจัดการข้อมูลสุขภาพผู้แสวงบุญชาวไทย - Thai Hajj Health Management System',
      contact: {
        name: 'ศูนย์บริหารการพัฒนาสุขภาพจังหวัดชายแดนภาคใต้ (ศบ.สต)',
        email: 'support@southhealthcenter.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development Server',
      },
      {
        url: 'http://api-thaihajjhealth.southhealthcenter.com',
        description: 'Production Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token in format: Bearer <token>',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            username: { type: 'string' },
            email: { type: 'string', format: 'email' },
            fullName: { type: 'string' },
            role: { 
              type: 'string', 
              enum: ['ADMIN', 'STAFF', 'EXECUTIVE', 'DOCTOR'],
              description: 'ADMIN=ผู้ดูแลระบบ, STAFF=เจ้าหน้าที่, EXECUTIVE=ผู้บริหาร, DOCTOR=แพทย์'
            },
            hospital: { type: 'string', nullable: true },
            phoneNumber: { type: 'string', nullable: true },
            address: { type: 'string', nullable: true },
            subdistrict: { type: 'string', nullable: true },
            district: { type: 'string', nullable: true },
            province: { type: 'string', nullable: true },
            workplace: { type: 'string', nullable: true },
            position: { type: 'string', nullable: true },
            status: { 
              type: 'string', 
              enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
            },
            lastLogin: { type: 'string', format: 'date-time', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'admin@thh.com' },
            password: { type: 'string', format: 'password', example: 'admin123' },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/User' },
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' },
              },
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['username', 'email', 'password', 'fullName'],
          properties: {
            username: { type: 'string', example: 'staff1' },
            email: { type: 'string', format: 'email', example: 'staff@thh.com' },
            password: { type: 'string', format: 'password', minLength: 8 },
            fullName: { type: 'string', example: 'นายทดสอบ ระบบ' },
            role: { type: 'string', enum: ['STAFF', 'DOCTOR'], default: 'STAFF' },
            hospital: { type: 'string', example: 'โรงพยาบาลปัตตานี' },
            phoneNumber: { type: 'string', example: '081-234-5678' },
            address: { type: 'string', example: '123 หมู่ 1 ถนนสุขภาพ' },
            subdistrict: { type: 'string', example: 'รูสะมิแล' },
            district: { type: 'string', example: 'เมืองปัตตานี' },
            province: { type: 'string', example: 'ปัตตานี' },
            workplace: { type: 'string', example: 'รพ.ปัตตานี' },
            position: { type: 'string', example: 'เจ้าหน้าที่' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', default: false },
            error: { type: 'string' },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', default: true },
            data: { type: 'object' },
          },
        },
        PaginationResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', default: true },
            data: { type: 'array', items: {} },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'integer' },
                limit: { type: 'integer' },
                total: { type: 'integer' },
                totalPages: { type: 'integer' },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      { name: 'Authentication', description: 'การยืนยันตัวตนและจัดการ Session' },
      { name: 'Users', description: 'จัดการข้อมูลผู้ใช้งานระบบ' },
      { name: 'Health', description: 'ตรวจสอบสถานะระบบ' },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Path to API docs
};

export const swaggerSpec = swaggerJsdoc(options);
