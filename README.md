# Social Media Manager API

🚀 **REST API untuk Social Media Manager** yang memungkinkan pengelolaan postingan, media, serta otorisasi berbasis grup.

## Deployment

- API tersedia secara online pada [https://api.todo.h14.my.id/]
- Dokumentasi swagger tersedia di [https://api.todo.h14.my.id/api/docs]
- User dan password untuk Testing :
  - testuser1 : password123
  - testuser2 : password123

## ✨ Fitur Utama

- **Manajemen Postingan:** CRUD postingan dengan status, jadwal posting, dan status pembayaran.
- **Manajemen Media:** Upload gambar untuk postingan.
- **Autentikasi & Otorisasi:** JWT-based authentication, serta pembatasan akses berbasis user dan grup.

## 🛠️ Teknologi yang Digunakan

- **NestJS** – Framework modular berbasis TypeScript untuk backend.
- **TypeORM** – ORM yang digunakan untuk mengelola SQLite.
- **JWT Authentication** – Otentikasi berbasis JSON Web Token.
- **Swagger (OpenAPI)** – Dokumentasi otomatis untuk API.

## 🏗️ Arsitektur

- **Modular Architecture**: Setiap fitur memiliki modulnya sendiri (_PostModule, UserModule, GroupModule, AuthModule_).
- **Service & Repository Pattern**: Logika bisnis dikelompokkan dalam service layer untuk pemisahan concerns menggunakan _dependency injection pada nestjs_.
- **Database Relations**: Menggunakan _One-to-Many_ dan _Many-to-Many_ relationship dengan TypeORM.
- **Middleware & Guards**: Middleware dan guard untuk autentikasi berbasis JWT.

## 🚀 Cara Menjalankan Project

### 1. Clone Repository

```bash
 git clone https://github.com/hasanqqsp/todo-social-media-api.git
 cd todo-social-media-api
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Konfigurasi Environment

Buat file `.env` dan tambahkan konfigurasi berikut:

```env
PORT=3000
JWT_SECRET=your_secret_key
```

### 4. Jalankan Server

```bash
pnpm start
```

API akan berjalan di `http://localhost:3000` (atau sesuai konfigurasi pada env)

## 📜 Dokumentasi API

Swagger UI tersedia di:

```
http://localhost:3000/api/docs
```

Tersedia juga pada file api-spec.swagger.json

## 📌 Contoh Endpoints

### 🔐 Autentikasi

- `POST /auth/register` – Daftar user baru
- `POST /auth/login` – Login dan dapatkan token JWT

### 📝 Manajemen Postingan

- `POST /posts` – Buat postingan baru
- `GET /posts` – Lihat semua postingan
- `GET /posts/:id` – Lihat detail postingan
- `PUT /posts/:id` – Update postingan (hanya pemilik)
- `DELETE /posts/:id` – Hapus postingan (hanya pemilik)

### 📂 Manajemen Media

- `POST /posts/:id/upload` – Upload gambar ke postingan
- `GET /uploads/:filename` – Akses gambar

## 🔒 Otorisasi & Grup

- User hanya bisa mengakses (read, update) post miliknya atau yang ada dalam grupnya.
- Setiap user otomatis memiliki **grup default**.
- Grup bisa memiliki banyak anggota,user bisa bergabung ke banyak grup dan post bisa dimiliki oleh grup.

---

### 🎯 Dibuat oleh: **Hasan Ismail Abdulmalik**

**Backend Developer | Cloud & Security Enthusiast**

📩 Hubungi saya di: [hasanqqsp.dev@gmail.com]  
💼 LinkedIn: [linkedin.com/in/hasan-ismail-abdulmalik/](https://www.linkedin.com/in/hasan-ismail-abdulmalik/)
