# 🚀 คู่มือ Deploy แบบเร็ว (Quick Start)

## สรุปขั้นตอนสั้นๆ

### 1. เชื่อมต่อ VPS
```bash
ssh root@YOUR_VPS_IP
```

### 2. รัน Deployment Script
```bash
# อัปโหลด deploy.sh ไปยัง VPS
chmod +x deploy.sh
sudo ./deploy.sh
```

### 3. อัปโหลดโค้ด
```bash
# จากเครื่อง local
scp -r * root@YOUR_VPS_IP:/var/www/spu-activity-hub/
```

### 4. ตั้งค่า Environment
```bash
cd /var/www/spu-activity-hub
nano .env
```

เพิ่ม:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/spu-activity-hub
NODE_ENV=production
```

### 5. ติดตั้ง Dependencies
```bash
cd /var/www/spu-activity-hub
npm install
```

### 6. ตั้งค่า Nginx
```bash
# คัดลอกไฟล์ config
sudo cp nginx.conf.example /etc/nginx/sites-available/spu-activity-hub

# แก้ไข IP address
sudo nano /etc/nginx/sites-available/spu-activity-hub
# แก้ไข YOUR_VPS_IP เป็น IP address จริง

# Enable site
sudo ln -s /etc/nginx/sites-available/spu-activity-hub /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

### 7. เริ่มแอปพลิเคชัน
```bash
cd /var/www/spu-activity-hub

# ใช้ PM2
pm2 start ecosystem.config.js --env production
pm2 save

# หรือใช้คำสั่งธรรมดา
pm2 start server.js --name spu-activity-hub
pm2 save
```

### 8. ทดสอบ
เปิดเบราว์เซอร์: `http://YOUR_VPS_IP`

---

## คำสั่งที่มีประโยชน์

```bash
# ดู logs
pm2 logs spu-activity-hub

# รีสตาร์ท
pm2 restart spu-activity-hub

# ดูสถานะ
pm2 status

# ตรวจสอบ Nginx
sudo systemctl status nginx
sudo nginx -t

# ตรวจสอบ MongoDB
sudo systemctl status mongod
```

---

## การอัปเดต

```bash
cd /var/www/spu-activity-hub
# อัปโหลดไฟล์ใหม่
npm install  # ถ้ามี dependencies ใหม่
pm2 restart spu-activity-hub
```

---

## แก้ไขปัญหา

### Port ถูกใช้งานแล้ว
```bash
sudo lsof -i :3000
sudo kill -9 PID
```

### Nginx ไม่ทำงาน
```bash
sudo nginx -t  # ตรวจสอบ config
sudo systemctl restart nginx
sudo tail -f /var/log/nginx/error.log
```

### MongoDB ไม่ทำงาน
```bash
sudo systemctl start mongod
sudo systemctl status mongod
```

### PM2 ไม่ทำงาน
```bash
pm2 restart spu-activity-hub
pm2 logs spu-activity-hub
```

