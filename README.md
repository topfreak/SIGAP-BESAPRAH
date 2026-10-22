# SIGAP BESAPRAH (Badan Pusat Statistik)
> **Sistem Integrasi dan Gerakan Administrasi Pertanggungjawaban yang Rapi dan Akuntabel**  
> *Tagline:* **“Bersaprah dalam Kerja, Sepakat dalam Akuntabilitas.”**

Aplikasi monitoring internal Badan Pusat Statistik (BPS) untuk pelacakan posisi fisik berkas SPJ kegiatan sensus/survei, verifikasi kelengkapan berkas berbasis Kode Akun Belanja (MAK) melalui **Dynamic Checklist**, dan sistem status visual **Lampu Lalu Lintas** (🔴 Merah, 🟡 Kuning, 🟢 Hijau).

---

## 🏛️ Arsitektur & Spesifikasi Keamanan

1. **Front-End:** React 19 + Vite 8 + Tailwind CSS v4 + Lucide React.
2. **Back-End & Database:** Supabase (PostgreSQL) dengan Row Level Security (RLS) dan Trigger Otomatis.
3. **Session-Persistent State-Based Routing (Tanpa React Router):**
   * URL browser selalu statis dan bersih (`domain.com` atau `http://localhost:5173/`).
   * Navigasi sepenuhnya dikendalikan oleh state `activePage` (`'login'`, `'dashboard'`, `'buat_spj'`, `'detail_spj'`, `'laporan'`, `'panduan_alur'`).
   * Sinkronisasi data ke `sessionStorage` sehingga tahan terhadap *refresh* browser (F5), namun otomatis terhapus saat tab ditutup demi keamanan instansi.
4. **Scope Data:** Rekapitulasi, checklist verifikasi dokumen fisik, dan pelacakan posisi 6 meja (tanpa upload dokumen fisik).

---

## 🚦 Sistem Status Lampu Lalu Lintas
* 🔴 **Merah (Perlu Perbaikan):** Ada dokumen fisik yang belum lengkap atau dikembalikan pemeriksa untuk diperbaiki.
* 🟡 **Kuning (Sedang Diproses):** Dokumen fisik wajib telah lengkap dan berkas sedang diteliti di meja verifikasi.
* 🟢 **Hijau (Sudah Selesai):** Seluruh tahapan tuntas dan nomor SP2D resmi telah diterbitkan oleh KPPN.

---

## 📍 6 Meja Alur Pelacakan Berkas Fisik
1. **Tim Kerja:** Penyusunan berkas & pengajuan ke loket TU.
2. **Tata Usaha (Admin TU):** Pemeriksaan fisik awal dengan Dynamic Checklist MAK.
3. **PPK (Pejabat Pembuat Komitmen):** Pengujian kesesuaian anggaran DIPA BPS.
4. **Bendahara Pengeluaran:** Verifikasi kuitansi riil, bukti transfer, dan potongan pajak (PPN/PPh).
5. **PPSPM:** Pengujian SPM dan pengajuan ke KPPN.
6. **Selesai (Arsip):** Penerbitan SP2D resmi dan penyimpanan berkas fisik.

---

## 🚀 Petunjuk Menghubungkan ke Supabase Live

Aplikasi ini dapat langsung dijalankan dalam **Mode Sandbox / Uji Coba Cepat** secara otomatis. Jika Anda ingin menghubungkannya ke proyek Supabase asli BPS, ikuti 3 langkah berikut:

### Langkah 1: Eksekusi Skema SQL
1. Buka dashboard proyek Supabase Anda: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Masuk ke menu **SQL Editor** ➔ **New Query**.
3. Buka file `supabase/schema.sql` di proyek ini, salin seluruh kodenya, lalu klik **Run**.
4. Skema tabel, enums, triggers, RLS policies, dan master MAK standar BPS (524111, 521211, 521213) akan terpasang otomatis.

### Langkah 2: Konfigurasi File `.env`
Buka file `.env` di root proyek ini dan isi dengan kredensial dari menu **Project Settings ➔ API**:
```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-public-key-anda>
```

### Langkah 3: Jalankan Aplikasi
```bash
# Jalankan server pengembangan
npm run dev

# Atau build untuk versi produksi
npm run build
```

---

## 📂 Struktur Direktori Proyek

```text
SIGAP BESAPRAH/
├── supabase/
│   └── schema.sql              # DDL SQL, Enum, RLS, & Master MAK BPS
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── TrafficLightBadge.jsx      # Status 🔴 🟡 🟢
│   │   │   ├── AlurProgress.jsx           # Garis Waktu 6 Meja Fisik
│   │   │   ├── AuditTrailTimeline.jsx     # Log Kronologis Audit
│   │   │   └── LembarKendaliCetak.jsx     # Format Cetak A4 Map SPJ
│   │   ├── layout/
│   │   │   ├── Header.jsx                 # Header Resmi BPS & Badge Jabatan
│   │   │   └── Navbar.jsx                 # Navigasi Tab State-Based
│   │   └── pages/
│   │       ├── DashboardPage.jsx          # Dasbor & Filter "Menunggu di Meja Saya"
│   │       ├── DetailSpjPage.jsx          # Dynamic Checklist & Panel Alur
│   │       ├── BuatSpjPage.jsx            # Formulir Terpandu 3 Langkah
│   │       ├── LaporanPage.jsx            # Laporan Eksekutif & Ekspor CSV
│   │       ├── PanduanAlurPage.jsx        # Filosofi Besaprah & Panduan Alur
│   │       └── LoginPage.jsx              # Login Resmi & Masuk Cepat Demo
│   ├── context/
│   │   ├── AuthContext.jsx                # Autentikasi & Sesi
│   │   ├── NavigationContext.jsx          # State Router & Session Storage
│   │   └── SpjContext.jsx                 # State SPJ, Checklist, & Log Audit
│   ├── lib/
│   │   └── supabaseClient.js              # Klien Supabase & Fallback
│   ├── services/
│   │   └── spjService.js                  # Query Database Supabase
│   ├── data/
│   │   └── mockData.js                    # Data Master MAK & Sampel SPJ
│   ├── App.jsx                            # Shell Utama & Page Router
│   └── index.css                          # Konfigurasi Tailwind CSS v4
├── .env.example
├── .env
└── package.json
```

---
*© 2026 Badan Pusat Statistik — Sistem Informasi Monitoring Internal SPJ*
