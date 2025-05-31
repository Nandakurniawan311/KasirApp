# Aplikasi Kasir Web

Aplikasi kasir berbasis web yang dibangun menggunakan React.js dan JSON Server. Aplikasi ini memungkinkan pengguna untuk mengelola transaksi kasir dengan antarmuka yang intuitif dan responsif.

## Struktur Proyek

```
├── public/
│   ├── images/
│   │   └── products/     # Folder untuk gambar produk
│   └── index.html
├── src/
│   ├── components/       # Komponen React
│   ├── pages/           # Halaman aplikasi
│   ├── utils/           # Utilitas dan fungsi helper
│   ├── App.js
│   └── index.js
├── db.json              # Database JSON Server
├── package.json
└── README.md
```

## Persyaratan Sistem

- Node.js (versi 14.0.0 atau lebih baru)
- npm (versi 6.0.0 atau lebih baru)
- Web browser modern (Chrome, Firefox, Safari, Edge)

## Cara Menjalankan Aplikasi

Aplikasi ini membutuhkan dua terminal terpisah untuk menjalankan server database dan aplikasi React.

### Terminal 1: Menjalankan JSON Server

1. Buka terminal pertama
2. Pastikan Anda berada di direktori proyek
3. Jalankan perintah berikut:
   ```bash
   npx json-server --watch db.json --port 3001
   ```
4. Tunggu hingga muncul pesan:
   ```
   \{^_^}/ hi!
   
   Loading db.json
   Done
   
   Resources
   http://localhost:3001/categories
   http://localhost:3001/products
   http://localhost:3001/cart
   
   Home
   http://localhost:3001
   ```
5. Biarkan terminal ini tetap terbuka

### Terminal 2: Menjalankan Aplikasi React

1. Buka terminal kedua
2. Pastikan Anda berada di direktori proyek
3. Install dependencies (jika belum):
   ```bash
   npm install
   ```
4. Jalankan aplikasi React:
   ```bash
   npm start
   ```
5. Aplikasi akan otomatis terbuka di browser di `http://localhost:3000`

## Struktur Database (db.json)

Database menggunakan format JSON dengan struktur berikut:

### Categories (Kategori)
```json
{
  "categories": [
    {
      "id": "1",
      "name": "Makanan",
      "icon": "fas fa-utensils"
    },
    {
      "id": "2",
      "name": "Minuman",
      "icon": "fas fa-coffee"
    },
    {
      "id": "3",
      "name": "Cemilan",
      "icon": "fas fa-cookie-bite"
    }
  ]
}
```

### Products (Produk)
```json
{
  "products": [
    {
      "id": "1",
      "kode": "MKN001",
      "nama": "Nasi Goreng",
      "harga": 25000,
      "gambar": "https://images.pexels.com/photos/...",
      "kategori": 1
    }
  ]
}
```

### Cart (Keranjang)
```json
{
  "cart": [
    {
      "id": "2766",
      "productId": "2",
      "nama": "Mie Ayam",
      "harga": 20000,
      "jumlah": 1,
      "keterangan": ""
    }
  ]
}
```

## Fitur Aplikasi

1. **Manajemen Kategori**
   - Filter produk berdasarkan kategori
   - Tampilan kategori dengan ikon

2. **Manajemen Produk**
   - Tampilan produk dengan gambar
   - Informasi detail produk (nama, harga, kode)
   - Penambahan produk ke keranjang

3. **Keranjang Belanja**
   - Penambahan/pengurangan jumlah produk
   - Catatan per produk
   - Perhitungan total otomatis
   - Proses checkout

4. **Checkout**
   - Input nama pelanggan
   - Ringkasan pesanan
   - Konfirmasi pembayaran

## Troubleshooting

### Masalah Umum

1. **Port 3001 Sudah Digunakan**
   - Pastikan tidak ada aplikasi lain yang menggunakan port 3001
   - Atau gunakan port lain dengan menambahkan flag `--port`:
     ```bash
     npx json-server --watch db.json --port 3002
     ```

2. **Gambar Tidak Muncul**
   - Pastikan koneksi internet aktif
   - Gambar menggunakan CDN Pexels yang membutuhkan koneksi internet

3. **Aplikasi Tidak Merespons**
   - Pastikan kedua terminal tetap berjalan
   - Refresh halaman browser
   - Periksa console browser untuk error

### Tips Pengembangan

1. **Menggunakan Dua Terminal**
   - Gunakan terminal terpisah untuk JSON Server dan React
   - Jangan menutup terminal JSON Server saat mengembangkan
   - Gunakan `Ctrl + C` untuk menghentikan server

2. **Hot Reload**
   - Perubahan pada kode React akan otomatis di-refresh
   - Perubahan pada `db.json` akan otomatis di-refresh oleh JSON Server

3. **Debugging**
   - Gunakan browser developer tools (F12)
   - Periksa tab Console untuk error
   - Periksa tab Network untuk request API

## Kontribusi

1. Fork repository
2. Buat branch fitur (`git checkout -b fitur-baru`)
3. Commit perubahan (`git commit -m 'Menambahkan fitur baru'`)
4. Push ke branch (`git push origin fitur-baru`)
5. Buat Pull Request

## Lisensi

Proyek ini dilisensikan di bawah MIT License.
