/**
 * DATA MASTER MATA ANGGARAN KEGIATAN (MAK) STANDAR BADAN PUSAT STATISTIK (BPS)
 * Sumber Data Riil: Dokumen Resmi "Kelengkapan SPJ.xlsx" (Sheet 521211 s.d. 524119)
 * Satker BPS Kabupaten Sambas (Kode BPS 6101 / DIPA 1301)
 */

export const KATEGORI_MAK = [
  { id: 'semua', label: 'Semua Kategori Belanja', icon: 'Layers' },
  { id: 'honor', label: 'Honorarium & Jasa Profesi', icon: 'Users', deskripsi: 'Honor mitra/petugas lapangan, tim pokja, dan narasumber' },
  { id: 'perjadin', label: 'Perjalanan Dinas & Paket Meeting', icon: 'Car', deskripsi: 'Transport lokal, supervisi, dinas luar kota, dan pelatihan di hotel' },
  { id: 'bahan', label: 'Bahan, ATK & Persediaan', icon: 'ShoppingBag', deskripsi: 'Konsumsi rapat, ATK survei, barang cetakan, dan APD' },
  { id: 'jasa_sewa', label: 'Sewa, Pengiriman & Jasa Lainnya', icon: 'Building2', deskripsi: 'Sewa gudang/gedung, ekspedisi paket survei, PPNPN' },
]

export const MASTER_AKUN_BPS = [
  // 1. 521211 - Belanja Bahan
  {
    id: 'mak-521211',
    kode: '521211',
    kode_akun: '521211',
    nama: 'Belanja Bahan',
    nama_akun: 'Belanja Bahan',
    kategori_id: 'bahan',
    singkatan: 'Konsumsi, Pencetakan & Perlengkapan',
    deskripsi: 'Pengadaan konsumsi rapat koordinasi/evaluasi sensus survei, pencetakan kuesioner/buku pedoman, dan perlengkapan kegiatan.',
    kegiatan_contoh: 'Konsumsi Pelatihan Sakernas, Susenas, Rapat Evaluasi Sensus, Bahan Cetak Kuesioner Survei',
    aturan_pajak: '1. PPN dikenakan atas PKP untuk transaksi > Rp 2 juta. 2. PPh 22 dikenakan untuk pembelian barang > Rp 2 juta (toko/warung). 3. PPh 23 dikenakan untuk jasa catering tanpa batas minimal. 4. Pembelian > Rp 5.000.000 wajib bermeterai Rp 10.000. 5. Rapat dapat diberikan konsumsi jika dilaksanakan offline minimal 2 jam dengan melibatkan pihak eksternal/masyarakat umum.',
    sub_kategori: [
      {
        nama: 'Konsumsi Rapat / Pelatihan',
        syarat_wajib: [
          'Identifikasi Kebutuhan',
          'Form Perencanaan',
          'Surat Penetapan Perencanaan',
          'Kerangka Acuan Kerja (KAK)',
          'Form Permintaan / Nota Dinas (SM ke PPK)',
          'Surat Undangan Rapat',
          'Kuitansi Bermeterai',
          'Nota Pembelian / Invoice Toko',
          'Notulensi Rapat',
          'Daftar Hadir Peserta',
          'SSP PPh 22 (toko/warung) atau SSP PPh 23 (jasa catering)',
        ],
      },
      {
        nama: 'Pencetakan dan Perlengkapan',
        syarat_wajib: [
          'Identifikasi Kebutuhan',
          'Form Perencanaan',
          'Surat Penetapan Perencanaan',
          'Kerangka Acuan Kerja (KAK)',
          'Form Permintaan / Nota Dinas (SM ke PPK)',
          'Kuitansi Bermeterai',
          'Nota Pembelian / Kwitansi Toko',
          'Daftar Alokasi / Tanda Terima Distribusi Barang',
          'Berita Acara Serah Terima (BAST)',
          'Faktur Pajak & SSP PPN (jika PKP > Rp 2 juta)',
          'SSP PPh 22',
        ],
      },
    ],
    syarat: [
      { id: 's-521211-1', nama_syarat: 'Identifikasi Kebutuhan & Form Perencanaan', is_wajib: true, urutan: 1 },
      { id: 's-521211-2', nama_syarat: 'Surat Penetapan Perencanaan & KAK (Kerangka Acuan Kerja)', is_wajib: true, urutan: 2 },
      { id: 's-521211-3', nama_syarat: 'Form Permintaan / Nota Dinas (SM ke PPK)', is_wajib: true, urutan: 3 },
      { id: 's-521211-4', nama_syarat: 'Surat Undangan, Daftar Hadir & Notulen Rapat (khusus konsumsi)', is_wajib: true, urutan: 4 },
      { id: 's-521211-5', nama_syarat: 'Kuitansi Pembelian Asli & Nota Toko bermeterai cukup', is_wajib: true, urutan: 5 },
      { id: 's-521211-6', nama_syarat: 'Daftar Alokasi (Tanda Terima) & BAST (khusus pencetakan)', is_wajib: true, urutan: 6 },
      { id: 's-521211-7', nama_syarat: 'Faktur Pajak, SSP PPN & SSP PPh 22 / PPh 23 catering', is_wajib: true, urutan: 7 },
    ],
  },

  // 2. 521213 - Belanja Honor Output Kegiatan
  {
    id: 'mak-521213',
    kode: '521213',
    kode_akun: '521213',
    nama: 'Belanja Honor Output Kegiatan',
    nama_akun: 'Belanja Honor Output Kegiatan',
    kategori_id: 'honor',
    singkatan: 'Honor Mitra Lapangan, Tim Pokja & Camat/Kades',
    deskripsi: 'Honor Petugas Lapangan (PCL/PML/Mitra), Honor Tim Pokja Kegiatan, Honor Camat/Kades/Lurah, dan Honor Penunjuk Jalan Sensus.',
    kegiatan_contoh: 'Honor Pencacah Susenas, Sakernas, Podes, SUTAS Pertanian, Ubinan Padi, Tim Pokja Pengolah Data',
    aturan_pajak: '1. PNS: Gol IV = 15%, Gol III = 5%, Gol II = 0%. 2. Mitra Non-PNS: PTKP Rp 4.500.000/bulan (di atas PTKP ber-NPWP 5%, non-NPWP 6%). 3. Honor tim harus melibatkan pihak eksternal (Bappeda/Dinsos). 4. Batasan pokja maksimal 2 kegiatan dalam 1 tahun anggaran. 5. Honor penunjuk jalan diberikan kepada ketua/pengurus SLS.',
    sub_kategori: [
      {
        nama: 'Honor Tim Pelaksana (Pokja)',
        syarat_wajib: [
          'Identifikasi Kebutuhan & Form Perencanaan',
          'Surat Penetapan Perencanaan & KAK',
          'Form Permintaan Honor ke PPK',
          'SK KPA/SK KBPS (tugas, fungsi, besaran rate, kedudukan pokja)',
          'Laporan Tim / Output Capaian Pekerjaan',
          'Daftar rincian penerima honor output kegiatan / kuitansi per orang',
          'Rekapitulasi sesuai jabatan dalam keanggotaan Pokja',
          'Bukti Pemotongan Pajak PPh Pasal 21',
          'Bukti transfer via CMS Bank Kalbar / BRI',
        ],
      },
      {
        nama: 'Honor Camat / Kades / Lurah',
        syarat_wajib: [
          'Identifikasi Kebutuhan, Form Perencanaan & KAK',
          'Form Permintaan Honor',
          'SK KPA / SK Penetapan Camat & Kades',
          'Daftar rincian penerima honor / tanda terima kuitansi',
          'Bukti Setor PPh Pasal 21',
          'Bukti transfer manual bank / via CMS',
        ],
      },
      {
        nama: 'Honor Penunjuk Jalan (Ketua SLS)',
        syarat_wajib: [
          'Identifikasi Kebutuhan, Form Perencanaan & KAK',
          'Form Permintaan Honor Penunjuk Jalan',
          'SK KPA / SK Penetapan Penunjuk Jalan',
          'Surat Pernyataan KPA untuk pembayaran tunai',
          'Surat Pendelegasian Wewenang Bendahara',
          'Kuitansi bermeterai ditandatangani penunjuk jalan',
          'Bukti foto penyerahan tanda terima uang tunai',
          'SSP PPh Pasal 21',
        ],
      },
    ],
    syarat: [
      { id: 's-521213-1', nama_syarat: 'Identifikasi Kebutuhan, Form Perencanaan & KAK', is_wajib: true, urutan: 1 },
      { id: 's-521213-2', nama_syarat: 'SK KPA/KBPS (Honor Tim Pokja / Camat / Kades / Penunjuk Jalan)', is_wajib: true, urutan: 2 },
      { id: 's-521213-3', nama_syarat: 'Surat Perjanjian Kerja (SPK Kontrak Mitra) & Surat Kesanggupan', is_wajib: true, urutan: 3 },
      { id: 's-521213-4', nama_syarat: 'Laporan Output Beban Kerja Lapangan & BAST Hasil Pekerjaan', is_wajib: true, urutan: 4 },
      { id: 's-521213-5', nama_syarat: 'Daftar Nominatif Penerima Honorarium & Rekapitulasi Pokja', is_wajib: true, urutan: 5 },
      { id: 's-521213-6', nama_syarat: 'Bukti Pemotongan Pajak PPh Pasal 21', is_wajib: true, urutan: 6 },
      { id: 's-521213-7', nama_syarat: 'Bukti Transfer Bank via CMS / Suket KPA Tunai (Penunjuk Jalan)', is_wajib: true, urutan: 7 },
    ],
  },

  // 3. 521219 - Belanja Barang Non Operasional Lainnya
  {
    id: 'mak-521219',
    kode: '521219',
    kode_akun: '521219',
    nama: 'Belanja Barang Non Operasional Lainnya',
    nama_akun: 'Belanja Barang Non Operasional Lainnya',
    kategori_id: 'jasa_sewa',
    singkatan: 'Pengiriman & Asuransi BPJS Mitra',
    deskripsi: 'Jasa ekspedisi/pengiriman kuesioner dan dokumen sensus/survei, serta premi asuransi BPJS Ketenagakerjaan petugas lapangan.',
    kegiatan_contoh: 'Ekspedisi Dokumen Survei ke BPS Provinsi Kalbar / BPS RI, Premi Asuransi BPJS Mitra Lapangan',
    aturan_pajak: '1. Pengiriman barang dikenakan PPN 11% dan PPh 23 (2%). 2. Premi BPJS Ketenagakerjaan dibayarkan penuh sesuai tagihan resmi tanpa potongan.',
    syarat: [
      { id: 's-521219-1', nama_syarat: 'Identifikasi Kebutuhan, Form Perencanaan & KAK', is_wajib: true, urutan: 1 },
      { id: 's-521219-2', nama_syarat: 'Form Permintaan / Nota Dinas (SM ke PPK)', is_wajib: true, urutan: 2 },
      { id: 's-521219-3', nama_syarat: 'Kuitansi Bermaterai & Nota Pembelian Asli', is_wajib: true, urutan: 3 },
      { id: 's-521219-4', nama_syarat: 'Resi Pengiriman Barang / Daftar Peserta BPJS Ketenagakerjaan', is_wajib: true, urutan: 4 },
      { id: 's-521219-5', nama_syarat: 'Faktur Pajak, SSP PPN & SSP PPh 23 (khusus jasa pengiriman)', is_wajib: true, urutan: 5 },
    ],
  },

  // 4. 521241 - Belanja Penanganan Pandemi / APD
  {
    id: 'mak-521241',
    kode: '521241',
    kode_akun: '521241',
    nama: 'Belanja Penanganan Pandemi / APD',
    nama_akun: 'Belanja Penanganan Pandemi / APD',
    kategori_id: 'bahan',
    singkatan: 'Pengadaan APD & Sanitasi',
    deskripsi: 'Pengadaan masker, hand sanitizer, dan perlengkapan perlindungan kesehatan petugas sensus di lapangan.',
    kegiatan_contoh: 'Pengadaan Masker Medis, Face Shield, Hand Sanitizer Petugas Lapangan',
    aturan_pajak: 'Pengadaan barang operasional sesuai ketentuan perpajakan PPN & PPh 22 jika memenuhi ambang batas.',
    syarat: [
      { id: 's-521241-1', nama_syarat: 'Identifikasi Kebutuhan, Form Perencanaan & KAK', is_wajib: true, urutan: 1 },
      { id: 's-521241-2', nama_syarat: 'Form Permintaan / Nota Dinas ke PPK', is_wajib: true, urutan: 2 },
      { id: 's-521241-3', nama_syarat: 'Kuitansi Bermaterai & Nota Pembelian Toko', is_wajib: true, urutan: 3 },
      { id: 's-521241-4', nama_syarat: 'Berita Acara Serah Terima (BAST) & Tanda Terima Distribusi', is_wajib: true, urutan: 4 },
      { id: 's-521241-5', nama_syarat: 'SSP PPN & SSP PPh 22 (jika transaksi > Rp 2 juta)', is_wajib: true, urutan: 5 },
    ],
  },

  // 5. 521811 - Belanja Persediaan Barang Konsumsi
  {
    id: 'mak-521811',
    kode: '521811',
    kode_akun: '521811',
    nama: 'Belanja Persediaan Barang Konsumsi',
    nama_akun: 'Belanja Persediaan Barang Konsumsi',
    kategori_id: 'bahan',
    singkatan: 'ATK, Barang Cetakan & Computer Supplies',
    deskripsi: 'Pengadaan persediaan alat tulis kantor (ATK), kertas, tinta printer, map kuesioner, dan barang cetakan administrasi.',
    kegiatan_contoh: 'Pengadaan ATK Survei Susenas/Sakernas, Toner Printer Pengolahan Data, Buku Agenda Satker',
    aturan_pajak: '1. PPN 11% untuk transaksi > Rp 2 juta pada Pengusaha Kena Pajak. 2. PPh 22 dipungut jika belanja barang > Rp 2 juta.',
    syarat: [
      { id: 's-521811-1', nama_syarat: 'Identifikasi Kebutuhan, Form Perencanaan & KAK', is_wajib: true, urutan: 1 },
      { id: 's-521811-2', nama_syarat: 'Form Permintaan / Nota Dinas (SM ke PPK)', is_wajib: true, urutan: 2 },
      { id: 's-521811-3', nama_syarat: 'Kuitansi Bermaterai & Nota Pembelian Toko Asli', is_wajib: true, urutan: 3 },
      { id: 's-521811-4', nama_syarat: 'Berita Acara Serah Terima (BAST) Barang Persediaan', is_wajib: true, urutan: 4 },
      { id: 's-521811-5', nama_syarat: 'Pencatatan Buku Persediaan / Tanda Terima Pendistribusian', is_wajib: true, urutan: 5 },
      { id: 's-521811-6', nama_syarat: 'Faktur Pajak, SSP PPN & SSP PPh 22', is_wajib: true, urutan: 6 },
    ],
  },

  // 6. 522141 - Belanja Sewa
  {
    id: 'mak-522141',
    kode: '522141',
    kode_akun: '522141',
    nama: 'Belanja Sewa',
    nama_akun: 'Belanja Sewa',
    kategori_id: 'jasa_sewa',
    singkatan: 'Sewa Gudang & Ruangan',
    deskripsi: 'Sewa gudang penyimpanan dokumen sensus/kuesioner, sewa ruang rapat, atau sewa sarana mobilitas.',
    kegiatan_contoh: 'Sewa Gudang Dokumen Sensus Pertanian / SE, Sewa Aula Pertemuan Koordinasi',
    aturan_pajak: 'Sewa tanah dan/atau bangunan dikenakan PPh Final Pasal 4 ayat (2) sebesar 10% dan PPN 11%.',
    syarat: [
      { id: 's-522141-1', nama_syarat: 'Identifikasi Kebutuhan, Form Perencanaan & KAK', is_wajib: true, urutan: 1 },
      { id: 's-522141-2', nama_syarat: 'Surat Perjanjian Kerja (SPK Sewa) / Kontrak Perjanjian', is_wajib: true, urutan: 2 },
      { id: 's-522141-3', nama_syarat: 'Berita Acara Serah Terima Hasil Pekerjaan (BASTHP)', is_wajib: true, urutan: 3 },
      { id: 's-522141-4', nama_syarat: 'Kuitansi Bermaterai, Faktur Pajak & SSP PPh Final Pasal 4 ayat (2)', is_wajib: true, urutan: 4 },
    ],
  },

  // 7. 522151 - Belanja Jasa Profesi
  {
    id: 'mak-522151',
    kode: '522151',
    kode_akun: '522151',
    nama: 'Belanja Jasa Profesi',
    nama_akun: 'Belanja Jasa Profesi',
    kategori_id: 'honor',
    singkatan: 'Narasumber, Moderator & Pakar',
    deskripsi: 'Honorarium narasumber, instruktur pelatihan (Innas/Inda), moderator, dan pakar statistik dari luar instansi.',
    kegiatan_contoh: 'Honor Narasumber Pelatihan Sensus, Moderator Workshop Diseminasi Daerah',
    aturan_pajak: '1. PNS: Gol IV = 15%, Gol III = 5%. 2. Non-PNS: PPh 21 tarif Pasal 17 (ber-NPWP 5%, non-NPWP 6% x 50% honor).',
    syarat: [
      { id: 's-522151-1', nama_syarat: 'Identifikasi Kebutuhan, Form Perencanaan & KAK', is_wajib: true, urutan: 1 },
      { id: 's-522151-2', nama_syarat: 'SK KPA tentang Belanja Jasa Profesi (nama, golongan, rate honor)', is_wajib: true, urutan: 2 },
      { id: 's-522151-3', nama_syarat: 'Surat Undangan, Biodata Narasumber & Surat Tugas Narasumber', is_wajib: true, urutan: 3 },
      { id: 's-522151-4', nama_syarat: 'Jadwal Acara Rinci, Materi/Bahan Paparan & Notulensi', is_wajib: true, urutan: 4 },
      { id: 's-522151-5', nama_syarat: 'Daftar Hadir Peserta, Kuitansi Bermaterai & Bukti Potong PPh 21', is_wajib: true, urutan: 5 },
      { id: 's-522151-6', nama_syarat: 'Bukti Transfer Bank via CMS', is_wajib: true, urutan: 6 },
    ],
  },

  // 8. 522191 - Belanja Jasa Lainnya (PPNPN)
  {
    id: 'mak-522191',
    kode: '522191',
    kode_akun: '522191',
    nama: 'Belanja Jasa Lainnya',
    nama_akun: 'Belanja Jasa Lainnya',
    kategori_id: 'jasa_sewa',
    singkatan: 'Honorarium PPNPN, Keamanan & Kebersihan',
    deskripsi: 'Gaji dan honorarium bulanan Pegawai Pemerintah Non Pegawai Negeri (PPNPN), satpam, dan cleaning service BPS Sambas.',
    kegiatan_contoh: 'Pembayaran Honor PPNPN Pramubakti, Satpam Kantor, Tenaga Kebersihan',
    aturan_pajak: 'Sesuai ketentuan PTKP pemotongan PPh 21 dan penyetoran iuran BPJS Kesehatan dan BPJS Ketenagakerjaan pemberi kerja.',
    syarat: [
      { id: 's-522191-1', nama_syarat: 'Kontrak Kerja / SPK PPNPN BPS Kabupaten Sambas', is_wajib: true, urutan: 1 },
      { id: 's-522191-2', nama_syarat: 'Daftar Kehadiran Bulanan (Rekap Absensi Fingerprint)', is_wajib: true, urutan: 2 },
      { id: 's-522191-3', nama_syarat: 'Laporan Kinerja Bulanan & BAST Pekerjaan', is_wajib: true, urutan: 3 },
      { id: 's-522191-4', nama_syarat: 'Daftar Nominatif Pembayaran Honor & Bukti Transfer Bank', is_wajib: true, urutan: 4 },
      { id: 's-522191-5', nama_syarat: 'Bukti Setor Iuran BPJS Kesehatan & Ketenagakerjaan', is_wajib: true, urutan: 5 },
    ],
  },

  // 9. 524111 - Belanja Perjalanan Dinas Biasa (Luar Kota)
  {
    id: 'mak-524111',
    kode: '524111',
    kode_akun: '524111',
    nama: 'Belanja Perjalanan Dinas Biasa',
    nama_akun: 'Belanja Perjalanan Dinas Biasa',
    kategori_id: 'perjadin',
    singkatan: 'Perjadin Luar Kota / Antar Daerah',
    deskripsi: 'Biaya transportasi, uang harian, dan penginapan perjalanan dinas luar kota (Pontianak, Singkawang, Jakarta, dll).',
    kegiatan_contoh: 'Rekonsiliasi LPJ ke KPPN Singkawang, Konsinyering PDRB di BPS Provinsi Kalbar, Rapat Koordinasi Nasional',
    aturan_pajak: 'Uang harian dan transport perjalanan dinas jabatan tidak dikenakan PPh 21 (Non-Objek Pajak). Penginapan hotel berdasar bukti riil / at cost.',
    syarat: [
      { id: 's-524111-1', nama_syarat: 'Identifikasi Kebutuhan, Form Perencanaan & KAK', is_wajib: true, urutan: 1 },
      { id: 's-524111-2', nama_syarat: 'Surat Tugas Resmi (Surtu) ditandatangani Kepala BPS / PPK', is_wajib: true, urutan: 2 },
      { id: 's-524111-3', nama_syarat: 'Surat Perjalanan Dinas (SPD) Lembar I & II ditandatangani PPK & Pejabat Kota Tujuan', is_wajib: true, urutan: 3 },
      { id: 's-524111-4', nama_syarat: 'Kuitansi Bermaterai & Rincian Biaya Riil (Uang Harian, Transport, Hotel)', is_wajib: true, urutan: 4 },
      { id: 's-524111-5', nama_syarat: 'Tiket Transportasi Asli (Pesawat/Speedboat/Bus), Boarding Pass & Invoice Hotel Asli', is_wajib: true, urutan: 5 },
      { id: 's-524111-6', nama_syarat: 'Laporan Hasil Pelaksanaan Perjalanan Dinas & Dokumentasi Foto', is_wajib: true, urutan: 6 },
    ],
  },

  // 10. 524113 - Belanja Perjalanan Dinas Dalam Kota
  {
    id: 'mak-524113',
    kode: '524113',
    kode_akun: '524113',
    nama: 'Belanja Perjalanan Dinas Dalam Kota',
    nama_akun: 'Belanja Perjalanan Dinas Dalam Kota',
    kategori_id: 'perjadin',
    singkatan: 'Supervisi Lapangan 19 Kecamatan',
    deskripsi: 'Uang transport riil dan uang harian pelaksanaan supervisi dan pengawasan pencacahan lapangan ke 19 kecamatan se-Kabupaten Sambas.',
    kegiatan_contoh: 'Supervisi Susenas ke Paloh & Sajingan Besar, Pengawasan Sakernas di Tebas, Ubinan di Subah',
    aturan_pajak: 'Pembayaran uang transport lokal dan uang harian supervisi lapangan dibayarkan sesuai SBM Kementerian Keuangan tanpa potongan pajak.',
    syarat: [
      { id: 's-524113-1', nama_syarat: 'Identifikasi Kebutuhan, Form Perencanaan & KAK', is_wajib: true, urutan: 1 },
      { id: 's-524113-2', nama_syarat: 'Surat Tugas (Surtu) ditandatangani Kepala BPS / PPK', is_wajib: true, urutan: 2 },
      { id: 's-524113-3', nama_syarat: 'SPD Dalam Kota ditandatangani Camat / Kades / Mitra setempat (Visum)', is_wajib: true, urutan: 3 },
      { id: 's-524113-4', nama_syarat: 'Kuitansi / Daftar Tanda Terima Uang Transportasi Petugas bertandatangan', is_wajib: true, urutan: 4 },
      { id: 's-524113-5', nama_syarat: 'Laporan Ringkas Hasil Pelaksanaan Perjalanan Dinas Dalam Kota', is_wajib: true, urutan: 5 },
      { id: 's-524113-6', nama_syarat: 'Rekapitulasi Perjalanan Dinas Dalam Kota & Bukti Transfer Bank (CMS)', is_wajib: true, urutan: 6 },
      { id: 's-524113-7', nama_syarat: 'Dokumentasi Foto di Lokasi Supervisi', is_wajib: true, urutan: 7 },
    ],
  },

  // 11. 524114 - Belanja Perjadin Paket Meeting Dalam Kota
  {
    id: 'mak-524114',
    kode: '524114',
    kode_akun: '524114',
    nama: 'Belanja Perjadin Paket Meeting Dalam Kota',
    nama_akun: 'Belanja Perjadin Paket Meeting Dalam Kota',
    kategori_id: 'perjadin',
    singkatan: 'Pelatihan Petugas di Hotel Dalam Kota',
    deskripsi: 'Penyelenggaraan pelatihan petugas sensus/survei paket Fullboard, Fullday, atau Halfday meeting di hotel dalam kota Sambas.',
    kegiatan_contoh: 'Pelatihan Petugas Sakernas/Susenas Paket Fullboard di Hotel, Konsinyering Rekonsiliasi PDRB',
    aturan_pajak: '1. Paket meeting dapat dilaksanakan apabila melibatkan instansi lain dan/atau masyarakat umum. 2. Penyelenggaraan kegiatan paket meeting (hotel) dikenakan PPh 23. 3. Wajib melampirkan surat pernyataan fasilitas kantor tidak mencukupi.',
    syarat: [
      { id: 's-524114-1', nama_syarat: 'Identifikasi Kebutuhan, Form Perencanaan & KAK', is_wajib: true, urutan: 1 },
      { id: 's-524114-2', nama_syarat: 'Surat Pernyataan Fasilitas Aula/Ruang Kantor Tidak Mencukupi', is_wajib: true, urutan: 2 },
      { id: 's-524114-3', nama_syarat: 'Surat Undangan Kegiatan & Jadwal Acara Rinci per Hari', is_wajib: true, urutan: 3 },
      { id: 's-524114-4', nama_syarat: 'Surat Tugas Panitia & Peserta, Daftar Hadir Lengkap Setiap Hari', is_wajib: true, urutan: 4 },
      { id: 's-524114-5', nama_syarat: 'Notulensi / Laporan Pelaksanaan Kegiatan & Dokumentasi Foto', is_wajib: true, urutan: 5 },
      { id: 's-524114-6', nama_syarat: 'SPD Paket Meeting Dalam Kota & Pernyataan Tidak Menggunakan Kendaraan Dinas', is_wajib: true, urutan: 6 },
      { id: 's-524114-7', nama_syarat: 'Daftar Rincian Perhitungan Pembayaran Paket Meeting & Transport Peserta', is_wajib: true, urutan: 7 },
      { id: 's-524114-8', nama_syarat: 'Roomlist / Daftar Pembagian Kamar Hotel Asli Dilegalisasi Pihak Hotel', is_wajib: true, urutan: 8 },
      { id: 's-524114-9', nama_syarat: 'Kuitansi Pembayaran Hotel, Faktur Pajak & SSP PPh 23', is_wajib: true, urutan: 9 },
    ],
  },

  // 12. 524119 - Belanja Perjadin Paket Meeting Luar Kota
  {
    id: 'mak-524119',
    kode: '524119',
    kode_akun: '524119',
    nama: 'Belanja Perjadin Paket Meeting Luar Kota',
    nama_akun: 'Belanja Perjadin Paket Meeting Luar Kota',
    kategori_id: 'perjadin',
    singkatan: 'Pelatihan Petugas di Hotel Luar Kota',
    deskripsi: 'Penyelenggaraan paket meeting pelatihan petugas di hotel luar kota bila fasilitas hotel dalam kota tidak mencukupi.',
    kegiatan_contoh: 'Pelatihan Petugas Sensus Skala Besar di Hotel Luar Kota (Singkawang / Pontianak)',
    aturan_pajak: 'Paket meeting luar kota dikenakan PPh 23. Wajib melampirkan roomlist hotel terlegalisasi dan surat pernyataan fasilitas kantor tidak mencukupi.',
    syarat: [
      { id: 's-524119-1', nama_syarat: 'Identifikasi Kebutuhan, Form Perencanaan & KAK', is_wajib: true, urutan: 1 },
      { id: 's-524119-2', nama_syarat: 'Surat Pernyataan Fasilitas Kantor & Hotel Dalam Kota Tidak Mencukupi', is_wajib: true, urutan: 2 },
      { id: 's-524119-3', nama_syarat: 'Surat Tugas Resmi & SPD Perjalanan Dinas Luar Kota', is_wajib: true, urutan: 3 },
      { id: 's-524119-4', nama_syarat: 'Berita Acara Pemeriksaan Pekerjaan (BAPP) & BASTHP', is_wajib: true, urutan: 4 },
      { id: 's-524119-5', nama_syarat: 'Fotokopi NPWP & Rekening Koran Penyedia Hotel', is_wajib: true, urutan: 5 },
      { id: 's-524119-6', nama_syarat: 'Invoice, Kuitansi Hotel Bermaterai & Berita Acara Pembayaran (BAP)', is_wajib: true, urutan: 6 },
      { id: 's-524119-7', nama_syarat: 'Surat Undangan, Daftar Hadir Peserta Lengkap & Jadwal Acara per Hari', is_wajib: true, urutan: 7 },
      { id: 's-524119-8', nama_syarat: 'Laporan Hasil Kegiatan, Dokumentasi Foto & Roomlist Hotel Asli Legal', is_wajib: true, urutan: 8 },
      { id: 's-524119-9', nama_syarat: 'Faktur Pajak & Bukti Setor Pajak (SSP PPh 23)', is_wajib: true, urutan: 9 },
    ],
  },
]

export const METODE_PEMBAYARAN_BPS = [
  {
    id: 'LS',
    label: 'LS (Langsung ke Rekening Rekanan / Mitra / Pegawai)',
    deskripsi: 'Penerbitan SP2D langsung dari KPPN ke rekening tujuan tanpa melalui kas bendahara.',
  },
  {
    id: 'UP/GUP',
    label: 'UP / GUP (Uang Persediaan / Ganti Uang Persediaan)',
    deskripsi: 'Dibayarkan terlebih dahulu menggunakan kas Uang Persediaan Bendahara Pengeluaran BPS.',
  },
]

export const getMakByIdOrKode = (idOrKode) => {
  return MASTER_AKUN_BPS.find((m) => m.id === idOrKode || m.kode_akun === idOrKode || m.kode === idOrKode) || MASTER_AKUN_BPS[0]
}
