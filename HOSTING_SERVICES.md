# 🌐 Hosting Services สำหรับ SPU Activity Hub

## 🏆 แนะนำ: 3 ตัวเลือกที่ดีที่สุด

### 1. **Railway** ⭐⭐⭐⭐⭐ (แนะนำที่สุด!)

**ทำไมดี:**
- ✅ ฟรี $5/เดือน (พอใช้ได้)
- ✅ รองรับ Node.js + MongoDB
- ✅ Deploy จาก GitHub อัตโนมัติ
- ✅ ตั้งค่าเองน้อยมาก
- ✅ มี SSL/HTTPS ฟรี
- ✅ Custom domain ฟรี

**ราคา:**
- Free: $5 credit/เดือน (พอใช้สำหรับโปรเจคเล็ก)
- Pro: $20/เดือน

**วิธี Deploy:**
1. ไปที่ [railway.app](https://railway.app)
2. Sign up ด้วย GitHub
3. New Project → Deploy from GitHub
4. เลือก repository
5. เพิ่ม MongoDB service
6. เสร็จ! 🎉

**เหมาะกับ:** ทุกคนที่ต้องการง่ายและเร็ว

---

### 2. **Render** ⭐⭐⭐⭐

**ทำไมดี:**
- ✅ Free tier ดี
- ✅ รองรับ Node.js + MongoDB
- ✅ Deploy จาก GitHub
- ✅ SSL ฟรี
- ✅ Custom domain ฟรี

**ราคา:**
- Free: จำกัด bandwidth
- Starter: $7/เดือน

**วิธี Deploy:**
1. ไปที่ [render.com](https://render.com)
2. Sign up ด้วย GitHub
3. New Web Service → Connect GitHub
4. เลือก repository
5. เพิ่ม MongoDB database
6. เสร็จ! 🎉

**เหมาะกับ:** คนที่ต้องการ free tier ที่ดี

---

### 3. **Vercel (Frontend) + Railway/Render (Backend)** ⭐⭐⭐⭐

**ทำไมดี:**
- ✅ Vercel ฟรีสำหรับ frontend
- ✅ เร็วมาก
- ✅ CDN ทั่วโลก
- ✅ Deploy อัตโนมัติ

**ราคา:**
- Vercel: ฟรี
- Backend: ตามที่เลือก

**วิธี Deploy:**
1. Frontend → Vercel
2. Backend → Railway/Render
3. Database → MongoDB Atlas (ฟรี)

**เหมาะกับ:** คนที่ต้องการ performance สูงสุด

---

## 📊 เปรียบเทียบ

| Service | ราคา | ง่าย | MongoDB | SSL | Custom Domain |
|---------|------|------|---------|-----|---------------|
| **Railway** | $5/เดือน | ⭐⭐⭐⭐⭐ | ✅ | ✅ | ✅ |
| **Render** | Free/$7 | ⭐⭐⭐⭐ | ✅ | ✅ | ✅ |
| **Vercel + Railway** | Free/$5 | ⭐⭐⭐ | ⚠️ แยก | ✅ | ✅ |
| **Fly.io** | Free | ⭐⭐⭐ | ✅ | ✅ | ✅ |
| **Heroku** | $5/เดือน | ⭐⭐⭐⭐ | ✅ | ✅ | ✅ |

---

## 🚀 วิธี Deploy แบบละเอียด

### วิธีที่ 1: Railway (แนะนำ)

#### ขั้นตอนที่ 1: เตรียม GitHub Repository

```bash
# สร้าง repository บน GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/spu-activity-hub.git
git push -u origin main
```

#### ขั้นตอนที่ 2: Deploy บน Railway

1. ไปที่ [railway.app](https://railway.app)
2. คลิก "Start a New Project"
3. เลือก "Deploy from GitHub repo"
4. เชื่อมต่อ GitHub account
5. เลือก repository `spu-activity-hub`
6. Railway จะ detect Node.js อัตโนมัติ

#### ขั้นตอนที่ 3: เพิ่ม MongoDB

1. คลิก "+ New" → "Database" → "MongoDB"
2. Railway จะสร้าง MongoDB instance ให้
3. คัดลอก connection string

#### ขั้นตอนที่ 4: ตั้งค่า Environment Variables

1. ไปที่ Settings → Variables
2. เพิ่ม:
   ```
   MONGODB_URI=mongodb://mongo:27017/spu-activity-hub
   NODE_ENV=production
   PORT=3000
   ```

#### ขั้นตอนที่ 5: ตั้งค่า Custom Domain (ถ้าต้องการ)

1. ไปที่ Settings → Domains
2. เพิ่ม domain ของคุณ
3. Railway จะให้ SSL อัตโนมัติ

**เสร็จแล้ว!** 🎉

---

### วิธีที่ 2: Render

#### ขั้นตอนที่ 1: Deploy Web Service

1. ไปที่ [render.com](https://render.com)
2. Sign up ด้วย GitHub
3. คลิก "New +" → "Web Service"
4. เชื่อมต่อ GitHub repository
5. ตั้งค่า:
   - **Name**: spu-activity-hub
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`

#### ขั้นตอนที่ 2: เพิ่ม MongoDB

1. คลิก "New +" → "MongoDB"
2. เลือก Free tier
3. Render จะสร้าง MongoDB ให้
4. คัดลอก Internal Database URL

#### ขั้นตอนที่ 3: ตั้งค่า Environment Variables

1. ไปที่ Web Service → Environment
2. เพิ่ม:
   ```
   MONGODB_URI=<Internal Database URL>
   NODE_ENV=production
   PORT=3000
   ```

**เสร็จแล้ว!** 🎉

---

### วิธีที่ 3: Vercel (Frontend) + Railway (Backend)

#### Frontend (Vercel)

1. ไปที่ [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Vercel จะ detect และ deploy อัตโนมัติ
4. เสร็จ! (ได้ URL ฟรี)

#### Backend (Railway)

1. Deploy backend ตามวิธีที่ 1
2. ตั้งค่า CORS ให้รองรับ Vercel domain
3. อัปเดต API URL ใน frontend

---

## 🔧 ตั้งค่า CORS สำหรับ Production

แก้ไข `server.js`:

```javascript
// แก้ไข CORS ให้รองรับ domain ของ hosting
const allowedOrigins = [
  'https://your-app.railway.app',
  'https://your-app.onrender.com',
  'https://your-app.vercel.app',
  'http://localhost:3000' // สำหรับ development
];

app.use(cors({
  origin: function (origin, callback) {
    // อนุญาต requests ที่ไม่มี origin (เช่น mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

---

## 📝 ไฟล์ที่ต้องเพิ่มสำหรับ Hosting

### `railway.json` (สำหรับ Railway)

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node server.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### `render.yaml` (สำหรับ Render)

```yaml
services:
  - type: web
    name: spu-activity-hub
    env: node
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
      - key: MONGODB_URI
        fromDatabase:
          name: spu-mongodb
          property: connectionString

databases:
  - name: spu-mongodb
    plan: free
```

---

## 🎯 คำแนะนำ

### สำหรับโปรเจคนี้:

1. **ถ้าต้องการง่ายที่สุด** → ใช้ **Railway**
   - Deploy ทั้ง frontend + backend + database ในที่เดียว
   - ตั้งค่าเองน้อยมาก

2. **ถ้าต้องการฟรี** → ใช้ **Render**
   - Free tier ดี
   - แต่มีข้อจำกัด bandwidth

3. **ถ้าต้องการ performance สูงสุด** → ใช้ **Vercel + Railway**
   - Vercel สำหรับ frontend (CDN ทั่วโลก)
   - Railway สำหรับ backend

---

## 🔗 Links

- [Railway](https://railway.app) - แนะนำที่สุด!
- [Render](https://render.com) - ฟรีดี
- [Vercel](https://vercel.com) - สำหรับ frontend
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Database ฟรี

---

## ⚠️ หมายเหตุ

- **Railway**: ดีที่สุดสำหรับโปรเจคนี้
- **Render**: ดีถ้าต้องการฟรี
- **Vercel**: ดีสำหรับ frontend แต่ backend ต้องแยก

**แนะนำ: ใช้ Railway!** 🚂

