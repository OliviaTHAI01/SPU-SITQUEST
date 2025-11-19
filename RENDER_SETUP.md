# 🚀 คู่มือตั้งค่า Render สำหรับ SPU Activity Hub

## ปัญหาที่พบ: MongoDB Connection Error

**Error:** `connect ECONNREFUSED ::1:27017, connect ECONNREFUSED 127.0.0.1:27017`

**สาเหตุ:** MongoDB connection string ยังชี้ไปที่ localhost ซึ่งไม่ทำงานบน Render

---

## ✅ วิธีแก้ไข (ขั้นตอนละเอียด)

### ขั้นตอนที่ 1: สร้าง MongoDB Database บน Render

1. ไปที่ [render.com](https://render.com) และ login
2. คลิก **"New +"** → **"MongoDB"**
3. ตั้งค่า:
   - **Name**: `spu-mongodb` (หรือชื่อที่ต้องการ)
   - **Plan**: เลือก **Free** (หรือ Starter ถ้าต้องการ)
   - **Database**: `spu-activity-hub` (หรือชื่อที่ต้องการ)
   - **User**: จะสร้างให้อัตโนมัติ
   - **Password**: จะสร้างให้อัตโนมัติ
4. คลิก **"Create Database"**
5. **รอให้สร้างเสร็จ** (ประมาณ 2-3 นาที)

### ขั้นตอนที่ 2: คัดลอก Connection String

1. หลังจาก MongoDB สร้างเสร็จ คลิกเข้าไปที่ MongoDB service
2. ไปที่ tab **"Info"**
3. คัดลอก **"Internal Database URL"** (สำหรับใช้ใน Render)
   - ตัวอย่าง: `mongodb://mongo:27017/spu-activity-hub`
   - หรือ **"Connection String"** (ถ้ามี)
   - ตัวอย่าง: `mongodb://username:password@dns-name:27017/spu-activity-hub`

### ขั้นตอนที่ 3: ตั้งค่า Environment Variables

1. ไปที่ **Web Service** ของคุณ (SPU Activity Hub)
2. ไปที่ **"Environment"** tab
3. เพิ่ม Environment Variables:

```
MONGODB_URI=mongodb://mongo:27017/spu-activity-hub
```

**หรือ** ถ้าใช้ External Database URL:

```
MONGODB_URI=mongodb://username:password@dns-name:27017/spu-activity-hub
```

**หมายเหตุ:** 
- ใช้ **Internal Database URL** ถ้า Web Service และ MongoDB อยู่ใน Render เดียวกัน
- ใช้ **Connection String** ถ้าใช้ MongoDB Atlas หรือ external database

### ขั้นตอนที่ 4: เพิ่ม Environment Variables อื่นๆ

เพิ่ม Environment Variables เพิ่มเติม:

```
NODE_ENV=production
PORT=3000
MAX_BODY_SIZE=20mb
```

### ขั้นตอนที่ 5: Restart Web Service

1. ไปที่ Web Service
2. คลิก **"Manual Deploy"** → **"Deploy latest commit"**
3. หรือรอให้ auto-deploy (ถ้าเปิดไว้)

---

## 🔍 ตรวจสอบการทำงาน

### ดู Logs

1. ไปที่ Web Service → **"Logs"** tab
2. ตรวจสอบว่าเห็น:
   ```
   ✅ Connected to MongoDB
   📊 MongoDB URI: mongodb://***:***@...
   🚀 Server running on http://localhost:3000
   ```

### ทดสอบ API

เปิดเบราว์เซอร์ไปที่:
```
https://your-app.onrender.com/api/activities
```

ควรเห็น JSON response หรือ array ของ activities

---

## ⚠️ ปัญหาที่พบบ่อย

### 1. Error: ECONNREFUSED

**สาเหตุ:** Connection string ไม่ถูกต้อง

**แก้ไข:**
- ตรวจสอบว่าใช้ **Internal Database URL** (ถ้า MongoDB อยู่ใน Render เดียวกัน)
- ตรวจสอบว่า MongoDB service ทำงานอยู่ (Status = "Available")
- ตรวจสอบว่า Environment Variable `MONGODB_URI` ถูกตั้งค่าแล้ว

### 2. Error: Authentication failed

**สาเหตุ:** Username/Password ไม่ถูกต้อง

**แก้ไข:**
- ตรวจสอบ connection string ว่ามี username และ password ถูกต้อง
- ลอง reset password ใน MongoDB service

### 3. Error: 503 Service Unavailable

**สาเหตุ:** Database ไม่เชื่อมต่อ

**แก้ไข:**
- ตรวจสอบว่า MongoDB service ทำงานอยู่
- ตรวจสอบ connection string
- Restart Web Service

---

## 📝 ตัวอย่าง Connection String

### สำหรับ Render Internal Database:
```
mongodb://mongo:27017/spu-activity-hub
```

### สำหรับ MongoDB Atlas:
```
mongodb+srv://username:password@cluster.mongodb.net/spu-activity-hub?retryWrites=true&w=majority
```

### สำหรับ External MongoDB:
```
mongodb://username:password@host:27017/spu-activity-hub
```

---

## 🎯 Checklist

- [ ] สร้าง MongoDB service บน Render
- [ ] คัดลอก Internal Database URL
- [ ] ตั้งค่า Environment Variable `MONGODB_URI`
- [ ] ตั้งค่า Environment Variables อื่นๆ (NODE_ENV, PORT)
- [ ] Restart Web Service
- [ ] ตรวจสอบ Logs ว่าเชื่อมต่อ MongoDB สำเร็จ
- [ ] ทดสอบ API endpoint

---

## 🔗 Links

- [Render Dashboard](https://dashboard.render.com)
- [Render MongoDB Docs](https://render.com/docs/databases)

---

## 💡 Tips

1. **ใช้ Internal Database URL** - เร็วกว่าและไม่ต้องเปิด network access
2. **ตรวจสอบ Logs** - จะบอกปัญหาได้ชัดเจน
3. **Restart Service** - แก้ปัญหาส่วนใหญ่ได้
4. **Free Tier** - มีข้อจำกัด bandwidth และ sleep เมื่อไม่ใช้งาน

---

## ✅ หลังจากตั้งค่าเสร็จ

ถ้าทุกอย่างถูกต้อง คุณจะเห็น:
- ✅ MongoDB connected
- ✅ Server running
- ✅ API endpoints ทำงานได้

ลองเปิด: `https://your-app.onrender.com/api/activities`

