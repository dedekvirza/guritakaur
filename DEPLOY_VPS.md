# Panduan Deployment VPS (Guritakaur)

Aplikasi ini sekarang menggunakan **SQLite** dan **Express.js** untuk backend, sehingga memudahkan deployment di VPS (seperti Contabo, DigitalOcean, dll).

## Prasyarat
- Node.js (v18+)
- PM2 (`npm install -g pm2`)
- Nginx

## Langkah-langkah Deployment

1. **Clone Repositori di VPS**
   ```bash
   git clone <URL_REPO_ANDA> /var/www/guritakaur
   cd /var/www/guritakaur
   ```

2. **Install Dependensi**
   ```bash
   npm install
   ```

3. **Build Frontend**
   ```bash
   npm run build
   ```

4. **Konfigurasi Environment**
   Buat file `.env` di root folder:
   ```env
   PORT=5000
   JWT_SECRET=rahasia-anda-disini
   ```

5. **Jalankan Aplikasi dengan PM2**
   ```bash
   pm2 start ecosystem.config.cjs
   ```

6. **Konfigurasi Nginx**
   Buat file konfigurasi Nginx baru:
   ```nginx
   server {
       listen 80;
       server_name domain-anda.com; # Ganti dengan domain/IP Anda

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Catatan Penting
- Database SQLite disimpan di file `database.db` di root folder. Pastikan folder ini memiliki izin tulis (`chmod`).
- Username Admin: `guritakaur`
- Password Admin: `sukses`
