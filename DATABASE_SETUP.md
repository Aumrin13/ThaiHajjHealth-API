# Thai Hajj Health API - Database Connection Guide

## 🗄️ MySQL Database via SSH Tunnel

เนื่องจาก MySQL Database อยู่บน Remote Server จำเป็นต้องใช้ SSH Tunnel เพื่อเชื่อมต่อ

### ✅ Option 1: Using SSH Command (Recommended)

```bash
# Windows PowerShell
ssh -L 3306:localhost:3306 southhealthcenter@27.254.143.152

# เมื่อถามรหัสผ่าน ให้ใส่: vi8dPiJ$6b5@yAgn
```

**Keep this terminal running!** อย่าปิด terminal นี้ตลอดเวลาที่ทำงานกับ API

### ✅ Option 2: Using PuTTY (Windows)

1. Open PuTTY
2. **Session Tab:**
   - Host Name: `27.254.143.152`
   - Port: `22`
   - Connection type: SSH

3. **Connection > SSH > Tunnels:**
   - Source port: `3306`
   - Destination: `localhost:3306`
   - Click "Add"

4. **Connection > Data:**
   - Auto-login username: `southhealthcenter`

5. Click "Open" และใส่รหัสผ่าน: `vi8dPiJ$6b5@yAgn`

### ✅ Option 3: Using VS Code Extension

1. Install extension: **Remote - SSH** by Microsoft
2. Press `Ctrl+Shift+P` → `Remote-SSH: Add New SSH Host`
3. Enter: `ssh southhealthcenter@27.254.143.152`
4. Edit SSH config → Add port forwarding:
```
Host thh-server
  HostName 27.254.143.152
  User southhealthcenter
  LocalForward 3306 localhost:3306
```

---

## 🚀 Setup Steps

### 1. Install Dependencies
```bash
cd d:\งานDevนอก\thaiHajjHealth\THH-API
npm install
```

### 2. Setup SSH Tunnel (เลือก 1 วิธีข้างบน)
```bash
ssh -L 3306:localhost:3306 southhealthcenter@27.254.143.152
# Password: vi8dPiJ$6b5@yAgn
```

**Important:** เปิด Terminal ใหม่สำหรับขั้นตอนถัดไป (อย่าปิด SSH Tunnel)

### 3. Generate Prisma Client
```bash
npx prisma generate
```

### 4. Create Database Tables
```bash
npx prisma migrate dev --name init
```

### 5. Seed Default Users
```bash
npm run prisma:seed
```

### 6. Start Development Server
```bash
npm run dev
```

Server will run at: **http://localhost:4000**

---

## 🔑 Default Login Credentials

| Role | Email | Password | Hospital |
|------|-------|----------|----------|
| ADMIN | admin@thh.com | admin123 | - |
| STAFF | staff@thh.com | staff123 | ศบ.สต. |
| EXECUTIVE | executive@thh.com | exec123 | - |
| DOCTOR | dr.somchai@thh.com | doctor123 | รพ.ปัตตานี |
| DOCTOR | dr.wanida@thh.com | doctor123 | รพ.ยะลา |
| DOCTOR | dr.anucha@thh.com | doctor123 | รพ.นราธิวาส |

---

## 🛠️ Useful Commands

### Prisma Commands
```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name your_migration_name

# Open Prisma Studio (Database GUI)
npx prisma studio

# Reset database (Warning: Deletes all data!)
npx prisma migrate reset

# Seed database
npm run prisma:seed
```

### Development
```bash
# Run dev server (with auto-reload)
npm run dev

# Build for production
npm run build

# Run production server
npm start
```

---

## 🧪 Testing API

### Test Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@thh.com\",\"password\":\"admin123\"}"
```

### Test Get Users (need token)
```bash
curl -X GET http://localhost:4000/api/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📊 Database Connection Info

```
Host: localhost (via SSH tunnel)
Port: 3306
Database: shc_hajjhealth
User: shc_hajjhealth
Password: pMn53AvH*js@dnk6
```

**SSH Server:**
```
Host: 27.254.143.152
Port: 22
User: southhealthcenter
Password: vi8dPiJ$6b5@yAgn
```

---

## ⚠️ Troubleshooting

### "Can't reach database server"
- ตรวจสอบว่า SSH Tunnel ยังทำงานอยู่หรือไม่
- ลอง restart SSH Tunnel

### "Authentication failed"
- ตรวจสอบ DATABASE_URL ในไฟล์ `.env`
- ตรวจสอบว่า password ถูกต้อง (ระวัง special characters)

### "Port 3306 already in use"
- มี process อื่นใช้ port 3306 อยู่ (อาจเป็น MySQL local)
- ปิด MySQL local หรือเปลี่ยน port ใน SSH tunnel:
```bash
ssh -L 3307:localhost:3306 southhealthcenter@27.254.143.152
# แล้วแก้ DATABASE_URL เป็น port 3307
```

---

## 📝 Notes

- **Access Token** หมดอายุใน 15 นาที
- **Refresh Token** หมดอายุใน 7 วัน
- Rate Limit: 100 requests ต่อ 15 นาที ต่อ IP
- Max File Upload: 10MB

---

## 🔗 API Documentation

Full API documentation: [API_DOCS.md](./API_DOCS.md)
