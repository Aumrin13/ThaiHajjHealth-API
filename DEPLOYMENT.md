# Production Deployment Guide

## Server Configuration

**Server Details:**
- Node.js Version: 25.2.0
- Package Manager: npm
- Document Root: `/api-thaihajjhealth.southhealthcenter.com`
- Application Root: `/api-thaihajjhealth.southhealthcenter.com`
- Application URL: `http://api-thaihajjhealth.southhealthcenter.com`
- Application Startup File: `app.js`
- Application Mode: `production`

---

## Deployment Steps

### 1. Upload Code to Server

```bash
# On local machine
git add .
git commit -m "Production ready"
git push origin main

# On server
cd /api-thaihajjhealth.southhealthcenter.com
git clone https://github.com/Aumrin13/ThaiHajjHealth-API.git .
# or if already cloned
git pull origin main
```

### 2. Install Dependencies

```bash
cd /api-thaihajjhealth.southhealthcenter.com
npm install --production
```

### 3. Setup Environment Variables

```bash
# Copy production env file
cp .env.production .env

# Edit if needed
nano .env
```

**Required Environment Variables:**
```env
NODE_ENV=production
PORT=3000
DATABASE_URL="mysql://shc_hajjhealth:pMn53AvH*js@dnk6@localhost:3306/shc_hajjhealth"
JWT_ACCESS_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here
CORS_ORIGIN=http://api-thaihajjhealth.southhealthcenter.com
```

### 4. Build TypeScript

```bash
npm run build
```

This will compile TypeScript to JavaScript in `dist/` folder.

### 5. Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed default users (optional)
npm run prisma:seed
```

### 6. Create Required Directories

```bash
mkdir -p logs
mkdir -p uploads
chmod 755 logs uploads
```

### 7. Start Application

**Option 1: Using Node.js directly**
```bash
node app.js
```

**Option 2: Using PM2 (Recommended)**
```bash
# Install PM2 globally
npm install -g pm2

# Start app
pm2 start ecosystem.config.js --env production

# Save PM2 config
pm2 save

# Setup auto-restart on server reboot
pm2 startup
```

### 8. Verify Application

```bash
# Check if running
curl http://localhost:3000/health

# Expected response:
# {"status":"OK","timestamp":"...","uptime":...}
```

---

## Node.js App Panel Configuration

### Basic Settings
- **Application Mode**: `production`
- **Application Root**: `/api-thaihajjhealth.southhealthcenter.com`
- **Application URL**: `http://api-thaihajjhealth.southhealthcenter.com`
- **Application Startup File**: `app.js`

### Environment Variables (Add in panel)
```
NODE_ENV=production
PORT=3000
DATABASE_URL=mysql://shc_hajjhealth:pMn53AvH*js@dnk6@localhost:3306/shc_hajjhealth
JWT_ACCESS_SECRET=thh-super-secret-jwt-key-2024-hajj-health-system-production
JWT_REFRESH_SECRET=thh-super-secret-refresh-key-2024-hajj-health-system-production
CORS_ORIGIN=http://api-thaihajjhealth.southhealthcenter.com
```

### Document Root (if using web server)
Set to: `/api-thaihajjhealth.southhealthcenter.com/public`

Note: If no public folder exists, create it or use root directory.

---

## Nginx Configuration (Optional)

If using Nginx as reverse proxy:

```nginx
server {
    listen 80;
    server_name api-thaihajjhealth.southhealthcenter.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # File upload size limit
    client_max_body_size 10M;
}
```

---

## Monitoring & Maintenance

### View Logs
```bash
# PM2 logs
pm2 logs thh-api

# App logs
tail -f logs/combined.log
tail -f logs/error.log
```

### Restart Application
```bash
# PM2
pm2 restart thh-api

# Or manually
pm2 stop thh-api
pm2 start ecosystem.config.js
```

### Check Status
```bash
pm2 status
pm2 monit
```

### Update Application
```bash
cd /api-thaihajjhealth.southhealthcenter.com
git pull origin main
npm install --production
npm run build
npx prisma generate
npx prisma migrate deploy
pm2 restart thh-api
```

---

## Testing Production API

### Health Check
```bash
curl http://api-thaihajjhealth.southhealthcenter.com/health
```

### Login Test
```bash
curl -X POST http://api-thaihajjhealth.southhealthcenter.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@thh.com","password":"admin123"}'
```

### Get Users (with token)
```bash
curl http://api-thaihajjhealth.southhealthcenter.com/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000
# or
netstat -tulpn | grep 3000

# Kill process
kill -9 <PID>
```

### Database Connection Failed
- Check DATABASE_URL in .env
- Verify MySQL is running
- Check database credentials

### Build Errors
```bash
# Clean build
rm -rf dist node_modules
npm install
npm run build
```

### Permission Issues
```bash
chmod -R 755 /api-thaihajjhealth.southhealthcenter.com
chown -R www-data:www-data /api-thaihajjhealth.southhealthcenter.com
```

---

## Security Checklist

- ✅ Change default JWT secrets
- ✅ Use strong database passwords
- ✅ Enable HTTPS (SSL certificate)
- ✅ Set proper CORS origins
- ✅ Keep dependencies updated
- ✅ Enable rate limiting
- ✅ Setup firewall rules
- ✅ Regular backups
- ✅ Monitor logs for suspicious activity

---

## Contact

For issues or support, contact the development team.
