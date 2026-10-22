# SIGAP BESAPRAH — BADAN PUSAT STATISTIK (BPS)

> **Sistem Integrasi dan Gerakan Administrasi Pertanggungjawaban yang Rapi dan Akuntabel**  
> *Tagline:* **“Bersaprah dalam Kerja, Sepakat dalam Akuntabilitas.”**

[![Vite](https://img.shields.io/badge/Vite-8.3.4-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.3.1-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Excel Export](https://img.shields.io/badge/SheetJS-Native_.XLSX-217346?style=flat-square&logo=microsoft-excel&logoColor=white)](https://sheetjs.com/)

Aplikasi monitoring internal Badan Pusat Statistik (BPS) untuk pelacakan posisi fisik berkas SPJ kegiatan sensus/survei, verifikasi kelengkapan berkas berbasis 12 Kode Akun Belanja (MAK) melalui **Dynamic Checklist**, pencatatan metode pencairan dana (`LS` vs `GUP`), serta sistem status visual **Lampu Lalu Lintas** (🔴 Merah, 🟡 Kuning, 🟢 Hijau).

---

## 📋 DAFTAR ISI
1. [Latar Belakang & Filosofi Besaprah](#1-latar-belakang--filosofi-besaprah)
2. [Arsitektur Teknis Sistem](#2-arsitektur-teknis-sistem)
3. [Skema Database (Supabase PostgreSQL)](#3-skema-database-supabase-postgresql)
4. [Master 12 Mata Anggaran Kegiatan (MAK) BPS](#4-master-12-mata-anggaran-kegiatan-mak-bps)
5. [Mekanisme Pencairan Dana (LS vs GUP)](#5-mekanisme-pencairan-dana-ls-vs-gup)
6. [Sistem Status Visual Lampu Lalu Lintas](#6-sistem-status-visual-lampu-lalu-lintas)
7. [Tata Cara Penggunaan Berdasarkan Peran (Role-Based SOP)](#7-tata-cara-penggunaan-berdasarkan-peran-role-based-sop)
   - [7.1. Tim Kerja (Pengusul / PJ Kegiatan Teknis)](#71-tim-kerja-pengusul--pj-kegiatan-teknis)
   - [7.2. Tata Usaha / Admin TU (Pemeriksaan Fisik Awal)](#72-tata-usaha--admin-tu-pemeriksaan-fisik-awal)
   - [7.3. Pejabat Pembuat Komitmen / PPK (Komitmen Anggaran)](#73-pejabat-pembuat-komitmen--ppk-komitmen-anggaran)
   - [7.4. Bendahara Pengeluaran (Verifikasi Kuitansi & Pajak)](#74-bendahara-pengeluaran-verifikasi-kuitansi--pajak)
   - [7.5. PPSPM (Pengujian SPM & Pengarsipan SP2D)](#75-pejabat-penandatangan-spm--ppspm-pengujian-spm--pengarsipan-sp2d)
8. [Fitur Unggulan Sistem](#8-fitur-unggulan-sistem)
   - [8.1. Beranda (Portal Hub Bersih)](#81-beranda-portal-hub-bersih)
   - [8.2. Formulir Pengajuan SPJ Baru Terstruktur](#82-formulir-pengajuan-spj-baru-terstruktur)
   - [8.3. Cetak Lembar Kendali Fisik A4](#83-cetak-lembar-kendali-fisik-a4)
   - [8.4. Dynamic Checklist Berkas Fisik](#84-dynamic-checklist-berkas-fisik)
   - [8.5. Ekspor Laporan Excel Multi-Sheet (.XLSX)](#85-ekspor-laporan-excel-multi-sheet-xlsx)
9. [Panduan Instalasi & Deployment Vercel](#9-panduan-instalasi--deployment-vercel)

---

## 1. Latar Belakang & Filosofi Besaprah

### 1.1. Latar Belakang
Pada instansi pemerintah seperti Badan Pusat Statistik (BPS), pertanggungjawaban keuangan (SPJ) kegiatan sensus dan survei melibatkan ratusan dokumen fisik kertas (kuitansi, SK tim pokja, surat tugas, KAK, BAST, bukti transfer bank, SSP pajak, dan SPD).

Persoalan yang sering muncul:
1. **Berkas Tercecer:** Map fisik tertumpuk di salah satu meja pemeriksa tanpa kejelasan siapa yang bertanggung jawab saat itu.
2. **Mitra Menanyakan Honor:** Petugas mitra sensus menanyakan kepastian pencairan honor, sementara staf BPS kesulitan mencari di meja mana berkas sedang diteliti.
3. **Pemeriksaan Berulang:** Dokumen yang cacat administrasi baru disadari setelah tiba di meja Bendahara/PPK, sehingga memicu penundaan lama.

**SIGAP BESAPRAH** bukan menggantikan fisik kertas, melainkan berfungsi sebagai **Sistem Pelacakan Digital Meja-ke-Meja** yang mengawal pergerakan map fisik SPJ secara transparan dan akuntabel.

### 1.2. Filosofi Besaprah
Nama **BESAPRAH** diangkat dari tradisi luhur adat Melayu Sambas (Kalimantan Barat). *Saprah* adalah tradisi makan bersama di mana sekelompok orang (5–6 orang) duduk bersila melingkari satu nampan berkaki empat yang sama.
- **Duduk Sama Rendah, Berdiri Sama Tinggi:** Menegaskan kesetaraan dan kebersamaan antara Tim Teknis, Tata Usaha, PPK, Bendahara, dan PPSPM dalam mengawal akuntabilitas keuangan negara.
- **Gotong Royong & Kesepakatan Mufakat:** Kekurangan berkas diselesaikan secara transparan lewat catatan revisi resmi.
- *Tagline Resmi:* **“Bersaprah dalam Kerja, Sepakat dalam Akuntabilitas.”**

---

## 2. Arsitektur Teknis Sistem

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   SIGAP BESAPRAH FRONT-END CLIENT                      │
│                                                                        │
│   React 19 + Vite 8 + Tailwind CSS v4 + SheetJS (xlsx) + Lucide        │
│   ├── Session-Persistent State-Based Routing (Clean URL '/')           │
│   ├── Reactive Context API (AuthContext, NavigationContext, SpjContext)│
│   └── Dual-Engine Architecture (Supabase Engine ↔ Fallback Mock)       │
└───────────────────▲────────────────────────────────▲───────────────────┘
                    │ REST API & Realtime            │ Static Build
┌───────────────────▼────────────────────────┐ ┌─────▼───────────────────┐
│          SUPABASE BACK-END CLOUD           │ │    VERCEL DEPLOYMENT    │
│                                            │ │                         │
│  PostgreSQL 15 Database                    │ │  Global CDN Edge        │
│  ├── Tables & Relational Constraints       │ │  Vite Production Dist  │
│  ├── Row Level Security (RLS) Policies     │ │  vercel.json Rewrites   │
│  └── Automated DB Triggers (Audit Trail)   │ │  Zero 404 Routing       │
└────────────────────────────────────────────┘ └─────────────────────────┘
```

- **Front-End:** React 19 + Vite 8 + Tailwind CSS v4 + Lucide React.
- **Pengolah Excel:** SheetJS (`xlsx`) versi terbaru untuk ekspor native `.xlsx` multi-sheet secara instan dari memori browser klien.
- **Pola Navigasi:** *Session-Persistent State-Based Routing*. URL browser selalu bersih dan statis (`/`). State sesi disimpan di `sessionStorage` (tahan reload F5, otomatis hilang saat tab ditutup demi privasi dan keamanan).
- **Dual-Engine (Smart Fallback):** Beroperasi penuh dengan database Supabase PostgreSQL, atau fallback otomatis ke engine mock interaktif bila koneksi database belum dikonfigurasi.

---

## 3. Skema Database (Supabase PostgreSQL)

Aplikasi didukung oleh skema relasional terstruktur pada database Supabase (`supabase/schema.sql`):

- **`master_akun`**: Menyimpan 12 MAK resmi BPS, singkatan, kategori belanja, aturan pajak, dan contoh kegiatan riil.
- **`master_syarat`**: Menyimpan persyaratan dokumen fisik resmi per MAK (apakah wajib atau opsional).
- **`pengajuan_spj`**: Menyimpan identitas berkas, MAK, asal tim kerja BPS, nama PJ kegiatan, metode pencairan (`LS`/`GUP`), nominal pengajuan, posisi meja fisik, status kelengkapan, catatan revisi, serta nomor/tanggal SP2D.
- **`checklist_pengajuan`**: Menyimpan status centang verifikasi fisik per syarat dokumen.
- **`riwayat_posisi`**: Menyimpan kronologis jejak audit (*audit trail*) pemindahan berkas, nama pemeriksa, jabatan, waktu, dan riwayat catatan revisi.

---

## 4. Master 12 Mata Anggaran Kegiatan (MAK) BPS

Berdasarkan dokumen resmi BPS (*Kelengkapan SPJ.xlsx* dan *SPJ Proses 2026.xlsx*), sistem mendukung 12 MAK dalam 4 kategori belanja:

| No | Kode MAK | Uraian Akun | Singkatan | Kategori | Ketentuan Pajak & Dokumen Utama |
| :---: | :---: | :--- | :--- | :--- | :--- |
| 1 | **521211** | Belanja Bahan | Konsumsi Rapat | Bahan & ATK | PPN & PPh 22 jika transaksi > Rp 2 juta. PPh 23 untuk jasa katering. Materai Rp 10.000 jika > Rp 5 juta. Undangan, Daftar Hadir, Notulen, Kuitansi, & BAST. |
| 2 | **521213** | Belanja Honor Output Kegiatan | Honor Petugas Lapangan | Honorarium | PPh 21 (PNS Gol IV: 15%, Gol III: 5%, Gol II: 0%; Mitra Non-PNS sesuai PTKP). SK Tim Pokja, Kontrak SPK Mitra, Bukti Transfer CMS, & BAST. |
| 3 | **521219** | Belanja Barang Non-Operasional | Ekspedisi & BPJS Mitra | Sewa & Ekspedisi | PPh 23 untuk jasa ekspedisi dokumen kuesioner. Billing dan bukti setor bank untuk premi BPJS Ketenagakerjaan mitra sensus. |
| 4 | **521241** | Belanja Mitigasi / APD | APD Survei Lapangan | Bahan & ATK | Pengadaan masker & hand sanitizer petugas lapangan. PPN/PPh 22 jika > Rp 2 juta. Kuitansi toko dan BAST penerimaan. |
| 5 | **521811** | Belanja Persediaan Konsumsi | ATK & Perlengkapan | Bahan & ATK | Kertas HVS, tinta printer sensus, blocknote, map. Nota toko bermeterai, BAST, dan bukti pencatatan ke aplikasi persediaan. |
| 6 | **522141** | Belanja Sewa | Sewa Gedung & Kendaraan | Sewa & Ekspedisi | PPh 23 (2%) untuk sewa kendaraan operasional survei. PPh Final Pasal 4 ayat 2 (10%) untuk sewa gedung/aula. Surat Perjanjian Sewa. |
| 7 | **522151** | Belanja Jasa Profesi | Honor Narasumber | Honorarium | PPh 21 bagi narasumber dari instansi eksternal (Diskominfo/Bappeda). SK/Surat Undangan, Biodata Narasumber, Materi Paparan, & Daftar Hadir. |
| 8 | **522191** | Belanja Jasa Lainnya | Publisitas & Iklan | Sewa & Ekspedisi | PPh 23 (2%) untuk jasa periklanan/videotron Sensus Pertanian/Ekonomi di media massa. Bukti tayang dan kontrak kerjasama. |
| 9 | **524111** | Belanja Perjalanan Dinas Biasa | Dinas Luar Kota | Perjalanan Dinas | Surat Tugas, Lembar SPD I & II bertanda tangan/cap basah instansi tujuan, Kuitansi riil tiket pesawat/hotel, dan Laporan Hasil Perjadin. |
| 10 | **524113** | Belanja Perjadin Dalam Kota | Transport Lokal | Perjalanan Dinas | Transport petugas survei lapangan ke desa/pasar (> 8 jam atau transpor lokal). Surat Tugas, Daftar Pengeluaran Riil (DPR) bermeterai, & SPD Dalam Kota. |
| 11 | **524114** | Belanja Paket Meeting Dalam Kota | Pelatihan Hotel Dalam Kota | Perjalanan Dinas | Paket Fullboard/Fullday meeting hotel dalam kota dipotong PPh 23. Surat Pernyataan Fasilitas Kantor Tidak Cukup, Roomlist hotel, & Daftar Hadir per hari. |
| 12 | **524119** | Belanja Paket Meeting Luar Kota | Pelatihan Hotel Luar Kota | Perjalanan Dinas | Konsinyering/workshop skala besar di hotel luar kota. Dipotong PPh 23. Suket Fasilitas Tidak Cukup, SPD Luar Kota, BAPP, BASTHP, & Roomlist legalisir hotel. |

---

## 5. Mekanisme Pencairan Dana (LS vs GUP)

Pengusul memilih metode pencairan pada formulir SPJ:
1. **LS (Langsung Kas Negara / KPPN):** Pencairan dana langsung dari Rekening Kas Umum Negara (RKUN) via KPPN ke rekening bank rekanan/mitra (digunakan untuk honor mitra massal CMS, pengadaan kontraktual, dan paket meeting hotel).
2. **GUP (Ganti Uang Persediaan via Bendahara):** Pencairan melalui kas tunai / rekening Bendahara Pengeluaran BPS untuk mengganti persediaan kas kantor yang telah dikeluarkan (digunakan untuk belanja bahan operasional kecil, konsumsi rapat, dan transpor lokal harian).

---

## 6. Sistem Status Visual Lampu Lalu Lintas

* 🔴 **Merah (Perlu Perbaikan):** Ada dokumen fisik yang belum lengkap, kurang materai, belum cap basah, atau dikembalikan pemeriksa untuk diperbaiki.
* 🟡 **Kuning (Sedang Diproses):** Seluruh dokumen fisik wajib telah lengkap dan berkas sedang diteliti di meja yang bertanggung jawab saat ini.
* 🟢 **Hijau (Sudah Selesai):** Seluruh pengujian administrasi tuntas, nomor SP2D resmi Kas Negara telah diterbitkan oleh KPPN, dan berkas diarsipkan.

---

## 7. Tata Cara Penggunaan Berdasarkan Peran (Role-Based SOP)

```text
[1. Tim Kerja (Pengusul)]
      │
      ▼ Bawa Map Fisik & Lembar Kendali A4
[2. Loket Tata Usaha (Admin TU)]  ──(Catatan Revisi)──> [Kembali ke Tim Kerja]
      │
      ▼ Dinyatakan Lengkap (Status Kuning)
[3. Pejabat Pembuat Komitmen (PPK)] ──(Catatan Revisi)──> [Kembali ke Tim Kerja]
      │
      ▼ Setujui Komitmen Anggaran
[4. Bendahara Pengeluaran] ─────────(Catatan Revisi)──> [Kembali ke Tim Kerja]
      │
      ▼ Validasi Pajak & Kuitansi Riil
[5. Pejabat Penandatangan SPM (PPSPM)] ──(Catatan Revisi)──> [Kembali ke Tim Kerja]
      │
      ▼ Input Nomor SP2D KPPN (Status Hijau)
[6. Selesai / Pengarsipan Kantor BPS]
```

### 7.1. Tim Kerja (Pengusul / PJ Kegiatan Teknis)
1. Buka menu **Ajukan SPJ Baru**.
2. Isi formulir terstruktur (Asal Tim Kerja, Nama PJ, Kategori Belanja, Kode MAK, Metode Bayar LS/GUP, Nama Kegiatan, dan Nominal SPJ).
3. Klik **Simpan & Siapkan Lembar Kendali**.
4. Cetak **Lembar Kendali Format A4**, tempelkan pada bagian depan map snelhechter berkas fisik, lalu serahkan map fisik ke **Loket Tata Usaha (Admin TU)**.

### 7.2. Tata Usaha / Admin TU (Pemeriksaan Fisik Awal)
1. Terima map berkas fisik dari Tim Kerja.
2. Buka menu **Daftar & Lacak SPJ**, lalu buka halaman detail berkas bersangkutan.
3. Cocokkan isi map fisik dengan **Dynamic Checklist** di layar:
   - **Jika Lengkap:** Centang seluruh syarat wajib, klik tombol biru **"Teruskan Berkas Fisik ke Meja PPK"**, lalu serahkan map ke meja PPK.
   - **Jika Tidak Lengkap:** Klik tombol merah **"Kembalikan Berkas ke Tim Kerja untuk Perbaikan"**, tuliskan catatan kekurangan secara spesifik. Status berkas otomatis berubah menjadi 🔴 **Merah**.

### 7.3. Pejabat Pembuat Komitmen / PPK (Komitmen Anggaran)
1. Terima berkas fisik dari Tata Usaha.
2. Teliti kesesuaian komitmen anggaran dengan DIPA BPS.
3. Jika disetujui, tanda tangani berkas fisik, lalu klik **"Teruskan Berkas Fisik ke Meja Bendahara Pengeluaran"**.
4. Jika tidak sesuai, klik **"Kembalikan Berkas ke Tim Kerja"** disertai alasan resmi.

### 7.4. Bendahara Pengeluaran (Verifikasi Kuitansi & Pajak)
1. Terima berkas fisik dari PPK.
2. Uji kebenaran nominal kuitansi, faktur, bukti potong PPh 21 mitra, serta SSP pajak sesuai kotak panduan pajak resmi pada sistem.
3. Jika valid, klik **"Teruskan Berkas Fisik ke Meja PPSPM"**.
4. Jika perhitungan pajak salah atau nomor rekening tidak cocok, kembalikan ke Tim Kerja dengan catatan perbaikan.

### 7.5. Pejabat Penandatangan SPM / PPSPM (Pengujian SPM & Pengarsipan SP2D)
1. Terima berkas fisik dari Bendahara Pengeluaran.
2. Uji SPM dan ajukan ke KPPN via aplikasi SAKTI.
3. Setelah KPPN mencairkan dana dan menerbitkan SP2D:
   - Klik tombol hijau **"Tandai Selesai & Terbitkan SP2D"**.
   - Masukkan Nomor SP2D resmi dan tanggal pencairan.
4. Status berkas otomatis berubah menjadi 🟢 **Hijau (Selesai)**.
5. Map fisik disimpan ke lemari arsip permanen kantor BPS.

---

## 8. Fitur Unggulan Sistem

### 8.1. Beranda (Portal Hub Bersih)
Antarmuka beranda yang lega dan fokus:
- Kartu sapaan dan identitas user yang sedang login.
- Widget baki tugas meja: Pengingat instan jika ada berkas fisik yang tertahan di meja user saat ini.
- Visualisasi alur 5 meja kerja fisik BPS.
- 4 tombol navigasi cepat menuju seluruh modul utama.

### 8.2. Formulir Pengajuan SPJ Baru Terstruktur
- Terbagi dalam **numbered sections** yang jelas dan berjarak lega.
- Dropdown modern dua tingkat: Kategori Belanja ➔ Kode MAK BPS.
- Kartu informasi MAK menyajikan deskripsi, ketentuan pajak resmi, serta **contoh kegiatan riil di BPS** yang tertata rapi di wadahnya.
- Pratinjau format Rupiah otomatis saat menginput nominal anggaran.

### 8.3. Cetak Lembar Kendali Fisik A4
- Didesain presisi untuk kertas standar **A4** dengan kop dinas dan lambang geometris resmi BPS.
- Memuat rincian kegiatan, kode MAK, metode bayar (`[LS]` / `[GUP]`), tabel verifikasi berkas, dan kotak paraf petugas dari Meja 1 hingga Meja 5.

### 8.4. Dynamic Checklist Berkas Fisik
- Persyaratan checklist menyesuaikan secara otomatis dengan standar MAK yang dipilih.
- **Proteksi Hak Akses (Role-Lock):** Hanya petugas di meja yang sedang memegang berkas yang dapat mencentang verifikasi fisik. Pengguna di meja lain berada pada mode pantau (*read-only*).

### 8.5. Ekspor Laporan Excel Multi-Sheet (.XLSX)
Tombol **"Unduh Rekap Excel (.XLSX)"** menghasilkan file workbook Microsoft Excel asli yang terdiri dari 3 lembar kerja:
1. `Rekap_Pengajuan_SPJ`: Rincian seluruh berkas, MAK, tim kerja, metode pencairan, posisi meja, dan nomor SP2D.
2. `Realisasi_per_MAK`: Agregasi realisasi untuk 12 MAK resmi BPS.
3. `Realisasi_per_Tim_Kerja`: Agregasi realisasi untuk 6 fungsi teknis BPS.

---

## 9. Panduan Instalasi & Deployment Vercel

### 9.1. Menjalankan di Komputer Lokal
```bash
# 1. Clone repository
git clone https://github.com/topfreak/SIGAP-BESAPRAH.git
cd SIGAP-BESAPRAH

# 2. Pasang dependensi
npm install

# 3. Jalankan server pengembangan
npm run dev
# Buka http://localhost:5173/ di browser
```

### 9.2. Menghubungkan ke Supabase Asli
1. Buka dashboard proyek Supabase Anda: [https://supabase.com/dashboard](https://supabase.com/dashboard).
2. Masuk ke **SQL Editor** ➔ **New Query**, salin seluruh kode dari `supabase/schema.sql`, lalu klik **Run**.
3. Buat file `.env` di root proyek:
   ```env
   VITE_SUPABASE_URL=https://<project-ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=<anon-public-key-anda>
   ```

### 9.3. Men-deploy ke Vercel (Produksi)
1. Buka [vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
2. Klik **Add New...** ➔ **Project**, lalu import repository **`topfreak/SIGAP-BESAPRAH`**.
3. Masukkan Environment Variables (`VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`).
4. Klik **Deploy**. Aplikasi akan online dalam ~1 menit dengan URL publik resmi yang siap dipresentasikan ke pimpinan.

---

> © 2026 Badan Pusat Statistik (BPS) — Tim Pengembang SIGAP BESAPRAH.  
> *“Bersaprah dalam Kerja, Sepakat dalam Akuntabilitas.”*
