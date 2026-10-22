import fs from 'fs'
import path from 'path'
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  Header,
  Footer,
  PageNumber
} from 'docx'

// Warna Tema Resmi BPS
const COLOR_PRIMARY = '1E3A8A'   // Deep Blue BPS
const COLOR_SECONDARY = '0284C7' // Sky Blue
const COLOR_DARK = '0F172A'      // Slate 900
const COLOR_TEXT = '334155'      // Slate 700
const COLOR_BG_LIGHT = 'F8FAFC'  // Slate 50
const COLOR_HEADER_BG = '1E3A8A' // Blue Table Header
const COLOR_BORDER = 'CBD5E1'    // Slate 300
const COLOR_AMBER = 'B45309'     // Amber 700

// Helper Paragraph
function createTitle(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 120 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 36, // 18pt
        color: COLOR_PRIMARY,
        font: 'Arial',
      }),
    ],
  })
}

function createSubtitle(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 240 },
    children: [
      new TextRun({
        text,
        italics: true,
        size: 24, // 12pt
        color: COLOR_TEXT,
        font: 'Arial',
      }),
    ],
  })
}

function createHeading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 160 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 28, // 14pt
        color: COLOR_PRIMARY,
        font: 'Arial',
      }),
    ],
  })
}

function createHeading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 120 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 24, // 12pt
        color: COLOR_SECONDARY,
        font: 'Arial',
      }),
    ],
  })
}

function createHeading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 80 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 22, // 11pt
        color: COLOR_DARK,
        font: 'Arial',
      }),
    ],
  })
}

function createParagraph(text, options = {}) {
  return new Paragraph({
    spacing: { before: 80, after: 100, line: 280 }, // 1.15 line spacing
    alignment: options.alignment || AlignmentType.JUSTIFY,
    children: [
      new TextRun({
        text,
        size: options.size || 21, // ~10.5pt
        color: options.color || COLOR_TEXT,
        font: 'Arial',
        bold: options.bold || false,
        italics: options.italics || false,
      }),
    ],
  })
}

function createBullet(text, boldPrefix = '') {
  const children = []
  if (boldPrefix) {
    children.push(
      new TextRun({
        text: boldPrefix,
        bold: true,
        size: 21,
        color: COLOR_DARK,
        font: 'Arial',
      })
    )
  }
  children.push(
    new TextRun({
      text,
      size: 21,
      color: COLOR_TEXT,
      font: 'Arial',
    })
  )
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 60, after: 60, line: 260 },
    children,
  })
}

function createCalloutBox(title, text) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    margins: { top: 160, bottom: 160, left: 240, right: 240 },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: 'EFF6FF' }, // Light Blue
            borders: {
              left: { style: BorderStyle.SINGLE, size: 24, color: COLOR_PRIMARY },
              top: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                spacing: { before: 60, after: 60 },
                children: [
                  new TextRun({ text: title, bold: true, size: 21, color: COLOR_PRIMARY, font: 'Arial' }),
                ],
              }),
              new Paragraph({
                spacing: { before: 0, after: 60 },
                children: [
                  new TextRun({ text, size: 20, color: COLOR_DARK, font: 'Arial', italics: true }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  })
}

// Helper Pembuat Tabel yang Rapi
function createStyledTable(headers, rowsData, colWidths = []) {
  const tableRows = []

  // Header Row
  const headerCells = headers.map((headerText, i) => {
    return new TableCell({
      width: colWidths[i] ? { size: colWidths[i], type: WidthType.PERCENTAGE } : undefined,
      shading: { fill: COLOR_HEADER_BG },
      margins: { top: 120, bottom: 120, left: 140, right: 140 },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: headerText,
              bold: true,
              size: 20, // 10pt
              color: 'FFFFFF',
              font: 'Arial',
            }),
          ],
        }),
      ],
    })
  })

  tableRows.push(new TableRow({ children: headerCells }))

  // Data Rows
  rowsData.forEach((row, rowIdx) => {
    const isEven = rowIdx % 2 === 1
    const rowCells = row.map((cellText, cellIdx) => {
      const isFirstCol = cellIdx === 0
      const isAlignRight = !isFirstCol && !isNaN(Number(cellText.replace(/[^0-9]/g, ''))) && cellText.includes('Rp')
      return new TableCell({
        width: colWidths[cellIdx] ? { size: colWidths[cellIdx], type: WidthType.PERCENTAGE } : undefined,
        shading: { fill: isEven ? 'F8FAFC' : 'FFFFFF' },
        margins: { top: 100, bottom: 100, left: 120, right: 120 },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
          bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
          left: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
          right: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
        },
        children: [
          new Paragraph({
            alignment: isFirstCol ? AlignmentType.CENTER : isAlignRight ? AlignmentType.RIGHT : AlignmentType.LEFT,
            children: [
              new TextRun({
                text: cellText,
                size: 19, // ~9.5pt
                color: COLOR_DARK,
                font: 'Arial',
              }),
            ],
          }),
        ],
      })
    })
    tableRows.push(new TableRow({ children: rowCells }))
  })

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: tableRows,
  })
}

// Main Generator
async function generateDocx() {
  const doc = new Document({
    creator: 'Badan Pusat Statistik (BPS)',
    title: 'Dokumentasi Teknis & Panduan Penggunaan SIGAP BESAPRAH',
    description: 'Panduan lengkap arsitektur, 12 MAK, metode bayar LS/GUP, alur 5 meja, dan SOP sistem monitoring SPJ BPS',
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 }, // 1 inci
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'SIGAP BESAPRAH — Badan Pusat Statistik (BPS)',
                    size: 18,
                    color: '94A3B8',
                    font: 'Arial',
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: 'Halaman ', size: 18, color: '94A3B8', font: 'Arial' }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 18,
                    color: '94A3B8',
                    font: 'Arial',
                  }),
                  new TextRun({ text: ' dari ', size: 18, color: '94A3B8', font: 'Arial' }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 18,
                    color: '94A3B8',
                    font: 'Arial',
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // =================== COVER / JUDUL ===================
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 120 },
            children: [
              new TextRun({
                text: 'BADAN PUSAT STATISTIK (BPS)',
                bold: true,
                size: 26,
                color: COLOR_SECONDARY,
                font: 'Arial',
              }),
            ],
          }),
          createTitle('DOKUMENTASI TEKNIS & PANDUAN PENGGUNAAN SISTEM INFORMASI'),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 80, after: 120 },
            children: [
              new TextRun({
                text: 'SIGAP BESAPRAH',
                bold: true,
                size: 48, // 24pt
                color: COLOR_PRIMARY,
                font: 'Arial',
              }),
            ],
          }),
          createSubtitle('Sistem Integrasi dan Gerakan Administrasi Pertanggungjawaban yang Rapi dan Akuntabel Berbasis Meja Kerja Fisik'),
          createCalloutBox(
            'TAGLINE RESMI BPS:',
            '“Bersaprah dalam Kerja, Sepakat dalam Akuntabilitas.”'
          ),

          new Paragraph({ spacing: { before: 300, after: 200 }, children: [] }),

          // Tabel Metadata Dokumen
          createStyledTable(
            ['Parameter Dokumen', 'Keterangan'],
            [
              ['Nama Sistem', 'SIGAP BESAPRAH'],
              ['Versi Aplikasi', 'Versi 1.0.0 (Edisi Standar 12 MAK BPS & Multi-Sheet Excel)'],
              ['Instansi Pemilik', 'Badan Pusat Statistik (BPS)'],
              ['Sasaran Pengguna', 'Tim Kerja Teknis, Tata Usaha, PPK, Bendahara Pengeluaran, PPSPM'],
              ['Karakteristik', 'Pelacakan Berkas Fisik, Dynamic Checklist, & Ekspor Excel Asli'],
              ['Tanggal Efektif', 'Oktober 2026'],
            ],
            [35, 65]
          ),

          new Paragraph({ pageBreakBefore: true }),

          // =================== BAB I ===================
          createHeading1('BAB I. PENDAHULUAN & FILOSOFI BESAPRAH'),
          
          createHeading2('1.1. Latar Belakang Masalah'),
          createParagraph(
            'Pada instansi pemerintah seperti Badan Pusat Statistik (BPS), pertanggungjawaban keuangan negara (Surat Pertanggungjawaban / SPJ) atas pelaksanaan kegiatan sensus, survei berkala, pelatihan petugas lapangan, dan perjalanan dinas melibatkan ratusan dokumen fisik dalam bentuk kertas (kuitansi toko, SK KPA, kontrak mitra, daftar nominatif honor, BAST, bukti setor SSP pajak, lembar SPD, dan tiket perjalanan).'
          ),
          createParagraph(
            'Dalam praktiknya, pengelolaan berkas fisik sering kali menghadapi sejumlah kendala klasik yang menurunkan efisiensi kantor:'
          ),
          createBullet(' Dokumen fisik sering tertumpuk di salah satu meja pemeriksa tanpa kejelasan siapa petugas yang sedang meneliti.', '1. Berkas Fisik Tercecer:'),
          createBullet(' Petugas pencacah lapangan (mitra statistik) sering menanyakan kepastian waktu pencairan honor, sementara staf teknis BPS kesulitan mencari tahu posisi map fisik SPJ.', '2. Kepastian Pencairan Honor Mitra:'),
          createBullet(' Dokumen yang kurang meterai atau belum dicap basah baru diketahui setelah sampai di meja Bendahara atau PPK, yang memicu proses pengembalian berkas berulang-ulang.', '3. Pemeriksaan Berulang & Tidak Terstandar:'),
          createParagraph(
            'SIGAP BESAPRAH hadir bukan untuk menggantikan berkas fisik kertas, melainkan sebagai Sistem Pelacak Digital Meja-ke-Meja yang memantau pergerakan map fisik SPJ secara transparan, terukur, dan akuntabel.'
          ),

          createHeading2('1.2. Filosofi Tradisi Besaprah'),
          createParagraph(
            'Nama BESAPRAH diangkat dari tradisi luhur masyarakat Melayu Sambas (Kalimantan Barat). Tradisi Saprah adalah adat makan bersama di mana sekelompok orang (biasanya 5 hingga 6 orang) duduk bersila melingkari satu nampan berkaki empat yang sama.'
          ),
          createBullet(' Menegaskan kesetaraan dan kebersamaan antara Tim Kerja Teknis, Tata Usaha, PPK, Bendahara, dan PPSPM dalam mengawal akuntabilitas keuangan negara.', '• Duduk Sama Rendah, Berdiri Sama Tinggi:'),
          createBullet(' Setiap kekurangan atau koreksi berkas diselesaikan secara transparan lewat catatan revisi resmi, bukan saling menyalahkan.', '• Gotong Royong & Kesepakatan Mufakat:'),

          // =================== BAB II ===================
          createHeading1('BAB II. ARSITEKTUR TEKNIS SISTEM'),
          createParagraph(
            'SIGAP BESAPRAH dibangun menggunakan teknologi web modern berstandar enterprise yang menitikberatkan pada kecepatan, kebersihan kode, dan kemudahan bagi pengguna:'
          ),
          createBullet(' Framework berbasis komponen modern dengan performa tinggi dan reaktivitas instan.', '• Front-End (React 19 & Vite 8):'),
          createBullet(' Utility-first framework untuk tampilan antarmuka yang bersih, elegan, dan ramah pengguna instansi pemerintah.', '• Styling (Tailwind CSS v4):'),
          createBullet(' Library pengolah spreadsheet berkecepatan tinggi untuk menghasilkan file workbook Microsoft Excel asli (.xlsx) langsung dari memori peramban tanpa membebani server.', '• Pengolah Excel Native (SheetJS / xlsx):'),
          createBullet(' URL peramban selalu statis dan bersih (/) tanpa tanda pagar (#) atau path berbelit-belit. Navigasi dikendalikan oleh state reaktif yang disinkronkan ke sessionStorage sehingga tahan terhadap tombol Refresh (F5), namun sesi otomatis terhapus saat tab ditutup demi keamanan instansi.', '• Session-Persistent State-Based Routing:'),
          createBullet(' Sistem dapat berjalan penuh secara online dengan database Supabase PostgreSQL, atau otomatis beralih ke Mock Engine interaktif berfitur 100% lengkap bila koneksi database belum dikonfigurasi.', '• Dual-Engine Architecture (Smart Fallback):'),

          // =================== BAB III ===================
          createHeading1('BAB III. SKEMA DATABASE & MODEL DATA'),
          createParagraph(
            'Database Supabase (PostgreSQL 15) dirancang dengan skema relasional yang mematuhi integritas data keuangan negara:'
          ),
          createStyledTable(
            ['Nama Tabel', 'Fungsi Utama Tabel'],
            [
              ['master_akun', 'Menyimpan 12 MAK resmi BPS, singkatan, kategori belanja, aturan perpajakan, dan contoh kegiatan.'],
              ['master_syarat', 'Menyimpan rincian syarat dokumen fisik per MAK (menandai syarat wajib vs opsional).'],
              ['pengajuan_spj', 'Menyimpan master berkas SPJ, kode MAK, asal tim kerja BPS, nama PJ kegiatan, metode pencairan (LS/GUP), nominal pengajuan, posisi meja fisik, status kelengkapan, catatan revisi, dan nomor SP2D.'],
              ['checklist_pengajuan', 'Menyimpan status centang verifikasi fisik per syarat dokumen untuk setiap berkas pengajuan.'],
              ['riwayat_posisi', 'Menyimpan kronologis jejak audit (audit trail) pemindahan berkas, nama pemeriksa, jabatan, waktu, dan riwayat catatan revisi.'],
            ],
            [30, 70]
          ),

          new Paragraph({ pageBreakBefore: true }),

          // =================== BAB IV ===================
          createHeading1('BAB IV. MASTER 12 MATA ANGGARAN KEGIATAN (MAK) & PERPAJAKAN BPS'),
          createParagraph(
            'Sesuai dokumen referensi resmi BPS (Kelengkapan SPJ.xlsx & SPJ Proses 2026.xlsx), SIGAP BESAPRAH mengadopsi 12 MAK standar dalam 4 kategori belanja:'
          ),

          createStyledTable(
            ['Kode MAK', 'Uraian Akun', 'Kategori', 'Ketentuan Pajak & Bukti Dokumen Utama'],
            [
              ['521211', 'Belanja Bahan', 'Bahan & ATK', 'PPN & PPh 22 jika transaksi > Rp 2 juta (toko). PPh 23 untuk katering. Materai Rp 10.000 jika > Rp 5 juta. Undangan, Daftar Hadir, Notulen, Kuitansi, & BAST.'],
              ['521213', 'Honor Output Kegiatan', 'Honorarium', 'PPh 21 (PNS Gol IV: 15%, Gol III: 5%, Gol II: 0%; Mitra Non-PNS sesuai PTKP). SK Tim Pokja, Kontrak SPK Mitra, Bukti Transfer CMS, & BAST.'],
              ['521219', 'Barang Non-Operasional', 'Sewa & Kirim', 'PPh 23 untuk ekspedisi dokumen. Billing & bukti setor bank untuk premi BPJS Ketenagakerjaan mitra.'],
              ['521241', 'Belanja Mitigasi / APD', 'Bahan & ATK', 'Pengadaan masker/sanitizer petugas lapangan. PPN/PPh 22 jika > Rp 2 juta. Kuitansi toko dan BAST penerimaan.'],
              ['521811', 'Barang Persediaan Konsumsi', 'Bahan & ATK', 'ATK survei, kertas HVS, toner printer sensus, blocknote. Nota toko bermeterai, BAST, & bukti aplikasi persediaan.'],
              ['522141', 'Belanja Sewa', 'Sewa & Kirim', 'PPh 23 (2%) sewa kendaraan operasional. PPh Final Pasal 4(2) (10%) sewa gedung/aula. Surat Perjanjian Sewa.'],
              ['522151', 'Belanja Jasa Profesi', 'Honorarium', 'PPh 21 narasumber dari instansi eksternal (Diskominfo/Bappeda). SK, Undangan, Biodata, Materi, & Daftar Hadir.'],
              ['522191', 'Belanja Jasa Lainnya', 'Sewa & Kirim', 'PPh 23 (2%) iklan/videotron sosialisasi sensus di media massa. Bukti tayang dan kontrak kerjasama.'],
              ['524111', 'Perjadin Biasa', 'Perjalanan Dinas', 'Dinas luar kota. Surat Tugas, SPD I & II cap basah instansi tujuan, Kuitansi riil hotel/tiket pesawat, Laporan Hasil Perjadin.'],
              ['524113', 'Perjadin Dalam Kota', 'Perjalanan Dinas', 'Transport petugas survei ke desa/pasar (> 8 jam). Surat Tugas, Daftar Pengeluaran Riil (DPR) bermeterai, & SPD Dalam Kota.'],
              ['524114', 'Paket Meeting Dalam Kota', 'Perjalanan Dinas', 'Fullboard/Fullday meeting hotel dalam kota dipotong PPh 23. Suket Fasilitas Kantor Tidak Cukup, Roomlist hotel, Daftar Hadir.'],
              ['524119', 'Paket Meeting Luar Kota', 'Perjalanan Dinas', 'Konsinyering hotel luar kota. Dipotong PPh 23. Suket Fasilitas Tidak Cukup, SPD Luar Kota, BAPP, BASTHP, Roomlist legalisir.'],
            ],
            [12, 22, 18, 48]
          ),

          // =================== BAB V ===================
          createHeading1('BAB V. MEKANISME PENCAIRAN DANA (LS VS GUP)'),
          createParagraph(
            'Sistem SIGAP BESAPRAH mencatat metode pembayaran yang digunakan untuk pencairan dana SPJ:'
          ),
          createBullet(' Pencairan dana langsung dari Rekening Kas Umum Negara (RKUN) melalui KPPN ke rekening bank mitra/penyedia. Digunakan untuk pembayaran honor mitra sensus massal via CMS Bank, pengadaan kontraktual pihak ketiga, dan paket meeting hotel.', '1. LS (Langsung KPPN):'),
          createBullet(' Pencairan melalui kas tunai atau rekening Bendahara Pengeluaran BPS untuk mengganti uang persediaan kantor yang telah digunakan. Digunakan untuk konsumsi rapat kecil, belanja bahan operasional, dan transpor lokal petugas harian.', '2. GUP (Ganti Uang Persediaan via Bendahara):'),

          // =================== BAB VI ===================
          createHeading1('BAB VI. SISTEM STATUS VISUAL LAMPU LALU LINTAS'),
          createParagraph(
            'Status fisik dokumen dipantau secara transparan menggunakan analogi lampu lalu lintas yang mudah dipahami seluruh pegawai:'
          ),
          createBullet(' Menandakan dokumen fisik belum lengkap, kurang meterai, belum cap basah, atau dikembalikan pemeriksa untuk diperbaiki oleh Tim Kerja pengusul.', '🔴 1. Status Merah (Perlu Perbaikan):'),
          createBullet(' Menandakan seluruh dokumen fisik wajib telah lengkap memenuhi syarat dan berkas sedang diteliti di meja yang bertanggung jawab.', '🟡 2. Status Kuning (Sedang Diproses):'),
          createBullet(' Menandakan seluruh pengujian administrasi tuntas, nomor SP2D resmi Kas Negara telah diterbitkan oleh KPPN, dan berkas fisik telah diarsipkan permanen.', '🟢 3. Status Hijau (Sudah Selesai):'),

          new Paragraph({ pageBreakBefore: true }),

          // =================== BAB VII ===================
          createHeading1('BAB VII. STANDAR OPERASIONAL PROSEDUR (SOP) PERAN'),
          createParagraph(
            'Berikut adalah panduan operasional langkah demi langkah untuk setiap peran kerja di BPS:'
          ),

          createHeading2('7.1. Tim Kerja (Pengusul / PJ Kegiatan Teknis)'),
          createBullet(' Menyiapkan bukti fisik kertas (kuitansi, nota, surat tugas, daftar hadir).', 'Langkah 1:'),
          createBullet(' Membuka menu "Ajukan SPJ Baru", mengisi Asal Tim Kerja, Nama PJ, Kategori Belanja, Kode MAK, Metode Bayar (LS/GUP), Nama Kegiatan, dan Nominal SPJ.', 'Langkah 2:'),
          createBullet(' Mengklik "Simpan & Siapkan Lembar Kendali", lalu mencetak Lembar Kendali format A4 berlogo BPS.', 'Langkah 3:'),
          createBullet(' Menempelkan lembar kendali A4 pada map snelhechter dan menyerahkannya ke Loket Tata Usaha (Admin TU).', 'Langkah 4:'),

          createHeading2('7.2. Tata Usaha / Admin TU (Pemeriksaan Fisik Awal)'),
          createBullet(' Menerima map fisik berkas dari Tim Kerja.', 'Langkah 1:'),
          createBullet(' Membuka aplikasi pada menu "Daftar & Lacak SPJ", lalu membuka detail berkas.', 'Langkah 2:'),
          createBullet(' Mencocokkan isi fisik map dengan Dynamic Checklist di layar satu per satu.', 'Langkah 3:'),
          createBullet(' Jika lengkap: Centang seluruh syarat wajib, klik "Teruskan Berkas Fisik ke Meja PPK", dan bawa map ke meja PPK (status menjadi Kuning).', 'Langkah 4 (Lengkap):'),
          createBullet(' Jika kurang: Klik "Kembalikan Berkas ke Tim Kerja untuk Perbaikan" disertai catatan rincian kekurangan fisik (status menjadi Merah).', 'Langkah 4 (Kurang):'),

          createHeading2('7.3. Pejabat Pembuat Komitmen / PPK (Komitmen Anggaran)'),
          createBullet(' Menerima map fisik berkas dari Tata Usaha.', 'Langkah 1:'),
          createBullet(' Meneliti ketersediaan pagu DIPA BPS dan keabsahan komitmen pengadaan.', 'Langkah 2:'),
          createBullet(' Jika disetujui: Menandatangani dokumen fisik, lalu klik "Teruskan Berkas Fisik ke Meja Bendahara Pengeluaran".', 'Langkah 3:'),
          createBullet(' Jika tidak sesuai: Mengembalikan berkas ke Tim Kerja dengan catatan resmi.', 'Langkah 4:'),

          createHeading2('7.4. Bendahara Pengeluaran (Verifikasi Kuitansi & Pajak)'),
          createBullet(' Menerima map fisik berkas dari PPK.', 'Langkah 1:'),
          createBullet(' Menguji perhitungan nominal kuitansi riil dan memvalidasi bukti potong pajak (PPh 21, PPh 22, PPh 23, PPN, Materai) sesuai kotak panduan pajak resmi pada sistem.', 'Langkah 2:'),
          createBullet(' Jika valid: Mengklik "Teruskan Berkas Fisik ke Meja PPSPM".', 'Langkah 3:'),
          createBullet(' Jika pajak kurang atau rekening salah: Mengembalikan berkas ke Tim Kerja dengan catatan perbaikan.', 'Langkah 4:'),

          createHeading2('7.5. Pejabat Penandatangan SPM / PPSPM (Pengujian SPM & SP2D)'),
          createBullet(' Menerima berkas fisik dari Bendahara Pengeluaran.', 'Langkah 1:'),
          createBullet(' Menguji SPM dan mengajukan ke KPPN via aplikasi SAKTI.', 'Langkah 2:'),
          createBullet(' Setelah KPPN menerbitkan SP2D resmi: Mengklik tombol hijau "Tandai Selesai & Terbitkan SP2D", lalu menginput nomor dan tanggal SP2D.', 'Langkah 3:'),
          createBullet(' Status berkas otomatis berubah menjadi Hijau (Selesai), dan map fisik disimpan ke lemari arsip permanen BPS.', 'Langkah 4:'),

          // =================== BAB VIII ===================
          createHeading1('BAB VIII. PANDUAN PENGGUNAAN FITUR APLIKASI'),
          
          createHeading2('8.1. Halaman Beranda (Portal Hub Bersih)'),
          createParagraph(
            'Halaman beranda didesain bersih dan lega sebagai pusat kendali. Menampilkan sapaan nama pejabat, peran yang sedang aktif, visualisasi alur 5 meja kerja fisik BPS, baki tugas khusus ("Berkas Perlu Tindakan di Meja Anda"), serta 4 tombol navigasi utama yang mengarahkan langsung ke modul yang diinginkan.'
          ),

          createHeading2('8.2. Formulir Pengajuan SPJ Baru Terstruktur'),
          createParagraph(
            'Formulir terbagi ke dalam numbered sections yang jelas:'
          ),
          createBullet(' Memilih fungsi teknis penanggung jawab (bebas dipilih oleh staf TU maupun tim teknis).', '• Bagian 1 (Identitas):'),
          createBullet(' Dropdown modern dua tingkat (Kategori Belanja ➔ Kode MAK). Dilengkapi kartu info contoh kegiatan riil BPS yang tertata rapi, box ketentuan pajak resmi, dan pilihan kartu radio metode bayar (LS vs GUP).', '• Bagian 2 (Klasifikasi Anggaran):'),
          createBullet(' Input uraian nama kegiatan dan nominal anggaran dengan pratinjau format Rupiah otomatis.', '• Bagian 3 (Rincian Anggaran):'),
          createBullet(' Pratinjau daftar dokumen fisik yang wajib disiapkan sebelum menyerahkan berkas ke loket TU.', '• Bagian 4 (Checklist Fisik):'),

          createHeading2('8.3. Cetak Lembar Kendali Fisik A4'),
          createParagraph(
            'Lembar kendali A4 resmi berlogo geometris BPS memuat rincian kegiatan, kode MAK, metode bayar ([LS]/[GUP]), tabel checklist syarat dokumen, dan kolom paraf pengesahan dari Meja 1 hingga Meja 5. Siap dicetak langsung (Ctrl + P) pada kertas A4 untuk ditempel pada map snelhechter.'
          ),

          createHeading2('8.4. Laporan Eksekutif & Unduh Excel Multi-Sheet (.XLSX)'),
          createParagraph(
            'Halaman laporan menyajikan kartu KPI realisasi keuangan, sebaran dokumen di meja fisik, serta tabel rekapitulasi. Tombol hijau "Unduh Rekap Excel (.XLSX)" secara otomatis mengekspor workbook Microsoft Excel asli yang memuat 3 lembar kerja terpisah (Rekap Seluruh SPJ, Realisasi per MAK, dan Realisasi per Tim Kerja) dengan format lebar kolom yang rapi.'
          ),

          // =================== BAB IX ===================
          createHeading1('BAB IX. PANDUAN DEPLOYMENT KE VERCEL'),
          createParagraph(
            'Untuk mempublikasikan aplikasi ini agar dapat diakses pimpinan secara online:'
          ),
          createBullet(' Unggah kode sumber ke repository GitHub (misal: https://github.com/topfreak/SIGAP-BESAPRAH.git).', '1. Push ke GitHub:'),
          createBullet(' Buka vercel.com, klik "Add New Project", lalu pilih repository GitHub Anda (Preset otomatis terdeteksi sebagai Vite).', '2. Import di Vercel:'),
          createBullet(' Masukkan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY pada tab Environment Variables.', '3. Pengaturan Variabel:'),
          createBullet(' Klik Deploy. Vercel akan mem-build aplikasi dalam waktu sekitar 1 menit dan menyediakan tautan resmi (misal: https://sigap-besaprah.vercel.app).', '4. Publikasi Selesai:'),

          // =================== PENUTUP ===================
          createHeading1('BAB X. PENUTUP'),
          createParagraph(
            'Sistem SIGAP BESAPRAH merupakan wujud komitmen Badan Pusat Statistik dalam mewujudkan tata kelola keuangan yang transparan, akuntabel, dan bebas dari keterlambatan administrasi. Dengan memadukan kearifan lokal tradisi Besaprah dan inovasi teknologi digital, diharapkan koordinasi antar-meja verifikasi di BPS dapat terjalin harmonis, profesional, dan berintegritas tinggi.'
          ),
          new Paragraph({ spacing: { before: 200, after: 100 }, children: [] }),
          createCalloutBox(
            'KOMITMEN BPS:',
            '“Bersaprah dalam Kerja, Sepakat dalam Akuntabilitas. Melayani Negeri dengan Data Berkualitas dan Pertanggungjawaban yang Tuntas.”'
          ),
        ],
      },
    ],
  })

  const outputPath = path.resolve('d:/bps/SIGAP BESAPRAH/Dokumentasi_Teknis_dan_Panduan_Penggunaan_SIGAP_BESAPRAH.docx')
  const buffer = await Packer.toBuffer(doc)
  fs.writeFileSync(outputPath, buffer)
  console.log('SUCCESS: Word document created at:', outputPath)
}

generateDocx().catch((err) => {
  console.error('ERROR generating DOCX:', err)
  process.exit(1)
})
