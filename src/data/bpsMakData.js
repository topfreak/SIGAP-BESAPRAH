/**
 * DATA MASTER MATA ANGGARAN KEGIATAN (MAK) STANDAR BADAN PUSAT STATISTIK (BPS)
 * Sumber Referensi: Dokumen Resmi "Kelengkapan SPJ.xlsx" & "SPJ Proses 2026.xlsx" BPS
 */

export const KATEGORI_MAK = [
  { id: 'semua', label: 'Semua Kategori Belanja', icon: 'Layers' },
  { id: 'honor', label: 'Honorarium & Jasa Profesi', icon: 'Users', deskripsi: 'Honor mitra/petugas lapangan, tim pokja, dan narasumber' },
  { id: 'perjadin', label: 'Perjalanan Dinas & Paket Meeting', icon: 'Car', deskripsi: 'Transport lokal, supervisi, dinas luar kota, dan pelatihan di hotel' },
  { id: 'bahan', label: 'Bahan, ATK & Persediaan', icon: 'ShoppingBag', deskripsi: 'Konsumsi rapat, ATK survei, barang cetakan, dan APD' },
  { id: 'jasa_sewa', label: 'Sewa, Pengiriman & Publisitas', icon: 'Building2', deskripsi: 'Sewa gudang/gedung, ekspedisi paket survei, iklan/videotron' },
]

export const MASTER_AKUN_BPS = [
  // 1. 521211 - Belanja Bahan
  {
    id: 'mak-521211',
    kode_akun: '521211',
    kategori_id: 'bahan',
    nama_akun: 'Belanja Bahan',
    singkatan: 'Konsumsi & Bahan Rapat',
    deskripsi: 'Konsumsi rapat koordinasi/evaluasi sensus survei, bahan pencetakan, dan perlengkapan kegiatan.',
    kegiatan_contoh: 'Konsumsi Pelatihan Sakernas, Susenas, Rapat Evaluasi Sensus, Bahan Cetak Kuesioner',
    aturan_pajak: 'PPN & PPh 22 jika transaksi > Rp 2 juta (toko/warung). PPh 23 untuk jasa katering (tanpa batas minimal). Materai 10.000 jika > Rp 5 juta.',
    syarat: [
      { id: 's-521211-1', nama_syarat: 'Identifikasi Kebutuhan & Form Perencanaan', is_wajib: true, urutan: 1 },
      { id: 's-521211-2', nama_syarat: 'Surat Penetapan Perencanaan & KAK (Kerangka Acuan Kerja)', is_wajib: true, urutan: 2 },
      { id: 's-521211-3', nama_syarat: 'Form Permintaan / Nota Dinas (SM ke PPK)', is_wajib: true, urutan: 3 },
      { id: 's-521211-4', nama_syarat: 'Surat Undangan, Daftar Hadir & Notulen Rapat (khusus belanja konsumsi)', is_wajib: true, urutan: 4 },
      { id: 's-521211-5', nama_syarat: 'Kuitansi Pembelian Asli & Nota Toko bermeterai cukup', is_wajib: true, urutan: 5 },
      { id: 's-521211-6', nama_syarat: 'Berita Acara Serah Terima (BAST) & Tanda Terima Distribusi Barang', is_wajib: true, urutan: 6 },
      { id: 's-521211-7', nama_syarat: 'Faktur Pajak & Bukti Setor Pajak (SSP PPN, PPh 22, atau PPh 23 katering)', is_wajib: true, urutan: 7 },
      { id: 's-521211-8', nama_syarat: 'Foto Dokumentasi Fisik Penerimaan Bahan / Makanan Rapat', is_wajib: false, urutan: 8 },
    ],
  },

  // 2. 521213 - Belanja Honor Output Kegiatan
  {
    id: 'mak-521213',
    kode_akun: '521213',
    kategori_id: 'honor',
    nama_akun: 'Belanja Honor Output Kegiatan',
    singkatan: 'Honor Petugas & Pokja',
    deskripsi: 'Honor Petugas Lapangan (PCL/PML/Mitra), Honor Tim Pokja, Honor Innas/Inda Pelatihan, Honor Camat/Kades, Honor Penunjuk Jalan.',
    kegiatan_contoh: 'Honor Pencacah Sakernas, Podes, Susenas, Survei Ubinan Padi, KSA, Tim Pengolah Data',
    aturan_pajak: 'PNS Gol IV=15%, Gol III=5%, Gol II=0%. Mitra Non-PNS: PTKP Rp 4,5 juta/bulan (di atas PTKP ber-NPWP 5%, non-NPWP 6%).',
    syarat: [
      { id: 's-521213-1', nama_syarat: 'Kerangka Acuan Kerja (KAK) & Form Permintaan Honor', is_wajib: true, urutan: 1 },
      { id: 's-521213-2', nama_syarat: 'Surat Keputusan (SK) KPA / SK Tim Pokja / Surat Tugas Resmi', is_wajib: true, urutan: 2 },
      { id: 's-521213-3', nama_syarat: 'Surat Perjanjian Kerja (SPK / Kontrak Mitra) & Surat Pernyataan Kesanggupan', is_wajib: true, urutan: 3 },
      { id: 's-521213-4', nama_syarat: 'Jadwal Kegiatan & Daftar Hadir (Innas/Inda/Peserta/Petugas)', is_wajib: true, urutan: 4 },
      { id: 's-521213-5', nama_syarat: 'Daftar Real Aktivitas / Laporan Output Capaian Beban Kerja Lapangan', is_wajib: true, urutan: 5 },
      { id: 's-521213-6', nama_syarat: 'Daftar Nominatif Penerima Honorarium & Rekapitulasi Belanja Honor', is_wajib: true, urutan: 6 },
      { id: 's-521213-7', nama_syarat: 'Bukti Pemotongan Pajak PPh Pasal 21', is_wajib: true, urutan: 7 },
      { id: 's-521213-8', nama_syarat: 'Bukti Pembayaran / Rekap Transfer Bank via CMS', is_wajib: true, urutan: 8 },
      { id: 's-521213-9', nama_syarat: 'Berita Acara Serah Terima (BAST) Penyelesaian Pekerjaan', is_wajib: true, urutan: 9 },
      { id: 's-521213-10', nama_syarat: '(Khusus Penunjuk Jalan) Suket KPA Tunai, Surat Pendelegasian Wewenang, Kuitansi & Foto', is_wajib: false, urutan: 10 },
    ],
  },

  // 3. 521219 - Belanja Barang Non Operasional Lainnya
  {
    id: 'mak-521219',
    kode_akun: '521219',
    kategori_id: 'jasa_sewa',
    nama_akun: 'Belanja Barang Non Operasional Lainnya',
    singkatan: 'Jasa Kirim & Premi Asuransi',
    deskripsi: 'Jasa pengiriman dokumen/kuesioner/paket survei serta pembayaran premi asuransi perlindungan kerja petugas (BPJS Ketenagakerjaan).',
    kegiatan_contoh: 'Ekspedisi Pengiriman Dokumen Sensus ke BPS RI/Provinsi, Premi BPJS Ketenagakerjaan Petugas Mitra Lapangan',
    aturan_pajak: 'PPN 11% dan PPh 23 (2%) untuk jasa ekspedisi/pengiriman. Premi BPJS Ketenagakerjaan dibayarkan penuh sesuai tagihan resmi tanpa potongan.',
    syarat: [
      { id: 's-521219-1', nama_syarat: 'Identifikasi Kebutuhan & Form Perencanaan', is_wajib: true, urutan: 1 },
      { id: 's-521219-2', nama_syarat: 'Kerangka Acuan Kerja (KAK) & Form Permintaan / Nota Dinas', is_wajib: true, urutan: 2 },
      { id: 's-521219-3', nama_syarat: 'Kuitansi Pembayaran Bermaterai & Nota Pembelian Asli', is_wajib: true, urutan: 3 },
      { id: 's-521219-4', nama_syarat: 'Surat Tanda Terima (STT) Ekspedisi & BAST Jasa Pengiriman', is_wajib: true, urutan: 4 },
      { id: 's-521219-5', nama_syarat: 'Faktur Pajak & Bukti Setor Pajak (SSP PPN 11% & PPh 23 2%)', is_wajib: true, urutan: 5 },
      { id: 's-521219-6', nama_syarat: 'Daftar Nama Peserta & Bukti Bayar Tagihan Premi BPJS Ketenagakerjaan (bila asuransi)', is_wajib: false, urutan: 6 },
    ],
  },

  // 4. 521241 - Belanja Non Operasional (Mitigasi Kesehatan / APD)
  {
    id: 'mak-521241',
    kode_akun: '521241',
    kategori_id: 'bahan',
    nama_akun: 'Belanja Non Operasional - Mitigasi / APD',
    singkatan: 'APD & Kit Kesehatan Petugas',
    deskripsi: 'Pengadaan perlengkapan Alat Pelindung Diri (APD), masker, hand sanitizer, dan kit kesehatan petugas sensus/survei di lapangan.',
    kegiatan_contoh: 'Pengadaan Masker dan Hand Sanitizer Petugas Survei Lapangan',
    aturan_pajak: 'PPN dan PPh 22 dikenakan untuk transaksi di atas Rp 2 juta oleh pihak ketiga. Materai 10.000 jika belanja > Rp 5 juta.',
    syarat: [
      { id: 's-521241-1', nama_syarat: 'Identifikasi Kebutuhan & Surat Penetapan Perencanaan', is_wajib: true, urutan: 1 },
      { id: 's-521241-2', nama_syarat: 'Kerangka Acuan Kerja (KAK) & Form Permintaan ke PPK', is_wajib: true, urutan: 2 },
      { id: 's-521241-3', nama_syarat: 'Kuitansi Bermaterai & Nota Pembelian Toko', is_wajib: true, urutan: 3 },
      { id: 's-521241-4', nama_syarat: 'Daftar Tanda Terima Alokasi APD kepada Petugas Lapangan', is_wajib: true, urutan: 4 },
      { id: 's-521241-5', nama_syarat: 'Faktur Pajak & Bukti Setor Pajak (SSP PPN & PPh 22 bila > 2 juta)', is_wajib: true, urutan: 5 },
      { id: 's-521241-6', nama_syarat: 'Foto Dokumentasi Fisik Penerimaan APD / Kit Kesehatan', is_wajib: false, urutan: 6 },
    ],
  },

  // 5. 521811 - Belanja Persediaan Barang Konsumsi
  {
    id: 'mak-521811',
    kode_akun: '521811',
    kategori_id: 'bahan',
    nama_akun: 'Belanja Persediaan Barang Konsumsi',
    singkatan: 'ATK & Computer Supplies',
    deskripsi: 'Pengadaan ATK perkantoran rutin, barang cetakan survei, toner printer, dan perlengkapan komputer (computer supplies).',
    kegiatan_contoh: 'Pengadaan Kertas HVS, Tinta/Toner Printer Sensus, Blocknote & Ballpoint Pelatihan, Map Snelhechter',
    aturan_pajak: 'PPN 11% dan PPh 22 (1,5%) untuk pembelian ATK & perlengkapan komputer > Rp 2 juta.',
    syarat: [
      { id: 's-521811-1', nama_syarat: 'Identifikasi Kebutuhan & Form Perencanaan Barang Persediaan', is_wajib: true, urutan: 1 },
      { id: 's-521811-2', nama_syarat: 'Surat Penetapan Perencanaan & KAK Pengadaan', is_wajib: true, urutan: 2 },
      { id: 's-521811-3', nama_syarat: 'Form Permintaan / Nota Dinas (SM ke PPK)', is_wajib: true, urutan: 3 },
      { id: 's-521811-4', nama_syarat: 'Kuitansi Bermaterai & Nota Rincian Pembelian Toko', is_wajib: true, urutan: 4 },
      { id: 's-521811-5', nama_syarat: 'Faktur Pajak & SSP PPN (11%) / PPh 22 (1,5%)', is_wajib: true, urutan: 5 },
      { id: 's-521811-6', nama_syarat: 'Berita Acara Serah Terima (BAST) Barang Persediaan', is_wajib: true, urutan: 6 },
      { id: 's-521811-7', nama_syarat: 'Daftar Alokasi / Tanda Terima Pendistribusian ATK', is_wajib: true, urutan: 7 },
    ],
  },

  // 6. 522141 - Belanja Sewa
  {
    id: 'mak-522141',
    kode_akun: '522141',
    kategori_id: 'jasa_sewa',
    nama_akun: 'Belanja Sewa',
    singkatan: 'Sewa Gudang & Gedung',
    deskripsi: 'Pembiayaan sewa gudang penyimpanan dokumen sensus/survei dan sewa ruangan/gedung non-hotel.',
    kegiatan_contoh: 'Sewa Gudang Dokumen Sensus Pertanian/Sensus Penduduk, Sewa Ruangan Aula Pertemuan',
    aturan_pajak: 'PPh Final Pasal 4 ayat 2 (10%) untuk sewa tanah/gedung. PPh 23 (2%) dan PPN 11% untuk sewa peralatan/kendaraan.',
    syarat: [
      { id: 's-522141-1', nama_syarat: 'Identifikasi Kebutuhan, Form Perencanaan & KAK Sewa', is_wajib: true, urutan: 1 },
      { id: 's-522141-2', nama_syarat: 'Form Permintaan / Nota Dinas ke PPK', is_wajib: true, urutan: 2 },
      { id: 's-522141-3', nama_syarat: 'Surat Perjanjian Kerja (SPK) / Kontrak Perjanjian Sewa', is_wajib: true, urutan: 3 },
      { id: 's-522141-4', nama_syarat: 'Berita Acara Serah Terima Hasil Pekerjaan (BASTHP)', is_wajib: true, urutan: 4 },
      { id: 's-522141-5', nama_syarat: 'Fotokopi NPWP & Rekening Koran / Buku Tabungan Pemilik Sewa', is_wajib: true, urutan: 5 },
      { id: 's-522141-6', nama_syarat: 'Kuesioner Kelayakan Sewa Gudang (TTD PPK & Kepala Satker)', is_wajib: true, urutan: 6 },
      { id: 's-522141-7', nama_syarat: 'Invoice, Kuitansi Pembayaran, & Berita Acara Pembayaran (BAP)', is_wajib: true, urutan: 7 },
      { id: 's-522141-8', nama_syarat: 'Faktur Pajak & Bukti Setor SSP PPh Final Pasal 4 ayat 2 (10%)', is_wajib: true, urutan: 8 },
    ],
  },

  // 7. 522151 - Belanja Jasa Profesi
  {
    id: 'mak-522151',
    kode_akun: '522151',
    kategori_id: 'honor',
    nama_akun: 'Belanja Jasa Profesi',
    singkatan: 'Narasumber & Pakar',
    deskripsi: 'Honorarium narasumber, pakar, moderator, atau instruktur keahlian khusus eksternal BPS.',
    kegiatan_contoh: 'Narasumber Bappeda / Diskominfo Pembinaan Statistik Sektoral (EPSS), Pakar Ekonomi Analisis PDRB',
    aturan_pajak: 'PPh 21 PNS Gol IV = 15%, Gol III = 5%, Gol II = 0%. Non-PNS sesuai ketentuan tarif Pasal 17 UU PPh.',
    syarat: [
      { id: 's-522151-1', nama_syarat: 'Identifikasi Kebutuhan, Perencanaan & KAK Jasa Profesi', is_wajib: true, urutan: 1 },
      { id: 's-522151-2', nama_syarat: 'Form Permintaan / Nota Dinas ke PPK', is_wajib: true, urutan: 2 },
      { id: 's-522151-3', nama_syarat: 'SK KPA tentang Belanja Jasa Profesi (Nama, Golongan, Rate Honor)', is_wajib: true, urutan: 3 },
      { id: 's-522151-4', nama_syarat: 'Surat Undangan Resmi Narasumber/Moderator & Jadwal Acara', is_wajib: true, urutan: 4 },
      { id: 's-522151-5', nama_syarat: 'Daftar Kehadiran Narasumber / Moderator bertandatangan basah', is_wajib: true, urutan: 5 },
      { id: 's-522151-6', nama_syarat: 'Fotokopi NPWP & Fotokopi Rekening Koran / Buku Tabungan Aktif', is_wajib: true, urutan: 6 },
      { id: 's-522151-7', nama_syarat: 'Kuitansi Belanja Jasa Profesi & SSP PPh 21 bertandatangan Bendahara', is_wajib: true, urutan: 7 },
      { id: 's-522151-8', nama_syarat: 'Bahan Tayang Paparan / Materi Slide Presentasi / Notulensi Tanya Jawab', is_wajib: true, urutan: 8 },
      { id: 's-522151-9', nama_syarat: 'Dokumentasi Foto Paparan & Curriculum Vitae (CV) Narasumber', is_wajib: true, urutan: 9 },
    ],
  },

  // 8. 522191 - Belanja Jasa Lainnya
  {
    id: 'mak-522191',
    kode_akun: '522191',
    kategori_id: 'jasa_sewa',
    nama_akun: 'Belanja Jasa Lainnya',
    singkatan: 'Publisitas & Iklan Media',
    deskripsi: 'Pengadaan jasa publisitas kegiatan sensus/survei (media cetak/elektronik, radio, videotron, baliho, sosialisasi).',
    kegiatan_contoh: 'Publisitas Sensus Pertanian di Videotron Kota, Sosialisasi Rilis Berita Resmi Statistik (BRS) di Media Massa',
    aturan_pajak: 'PPN 11% dan PPh 23 (2%) atas jasa publisitas dan penyedia jasa periklanan/penyiaran.',
    syarat: [
      { id: 's-522191-1', nama_syarat: 'Identifikasi Kebutuhan, Perencanaan & KAK Jasa Publisitas', is_wajib: true, urutan: 1 },
      { id: 's-522191-2', nama_syarat: 'Form Permintaan / Nota Dinas (SM ke PPK)', is_wajib: true, urutan: 2 },
      { id: 's-522191-3', nama_syarat: 'Surat Perjanjian Kerja (SPK) / Kontrak Kerja Pengadaan Publisitas', is_wajib: true, urutan: 3 },
      { id: 's-522191-4', nama_syarat: 'Kuitansi Bermaterai & Nota Pembelian / Bukti Tagihan Penyedia', is_wajib: true, urutan: 4 },
      { id: 's-522191-5', nama_syarat: 'Berita Acara Serah Terima (BAST) Hasil Pekerjaan Publisitas', is_wajib: true, urutan: 5 },
      { id: 's-522191-6', nama_syarat: 'Faktur Pajak & Bukti Setor Pajak (SSP PPN 11% & PPh 23 2%)', is_wajib: true, urutan: 6 },
      { id: 's-522191-7', nama_syarat: 'Dokumentasi Fisik Bukti Tayang (Kliping Koran / Foto Baliho / Video Rekaman)', is_wajib: true, urutan: 7 },
    ],
  },

  // 9. 524111 - Belanja Perjalanan Dinas Biasa
  {
    id: 'mak-524111',
    kode_akun: '524111',
    kategori_id: 'perjadin',
    nama_akun: 'Belanja Perjalanan Dinas Biasa',
    singkatan: 'Dinas Luar Kota / Supervisi',
    deskripsi: 'Perjalanan dinas luar kota, supervisi pimpinan/tim BPS Provinsi/Pusat, rapat koordinasi luar daerah.',
    kegiatan_contoh: 'Supervisi Lapangan Pimpinan BPS Provinsi, Perjalanan Dinas Konsolidasi PDRB ke Ibu Kota Provinsi',
    aturan_pajak: 'Uang harian dibayarkan lumpsum sesuai SBM. Biaya transport dan penginapan hotel dibayarkan at-cost (atau surat pernyataan tidak menginap 30% SBM).',
    syarat: [
      { id: 's-524111-1', nama_syarat: 'Kerangka Acuan Kerja (KAK) & Form Permintaan / Nota Dinas', is_wajib: true, urutan: 1 },
      { id: 's-524111-2', nama_syarat: 'Surat Tugas (Surtu) resmi bertandatangan Kepala BPS / KPA', is_wajib: true, urutan: 2 },
      { id: 's-524111-3', nama_syarat: 'Surat Perjalanan Dinas (SPD) Lembar I & II bertandatangan & cap basah (Visum)', is_wajib: true, urutan: 3 },
      { id: 's-524111-4', nama_syarat: 'Tiket & Boarding Pass Asli (Pesawat / Kereta / Travel Umum)', is_wajib: true, urutan: 4 },
      { id: 's-524111-5', nama_syarat: 'Bukti Penginapan Riil (Billing Hotel) atau Surat Pernyataan Tidak Menginap 30%', is_wajib: true, urutan: 5 },
      { id: 's-524111-6', nama_syarat: 'Daftar Rincian Biaya Perjalanan Dinas & Kuitansi Perjadin', is_wajib: true, urutan: 6 },
      { id: 's-524111-7', nama_syarat: 'Daftar Pengeluaran Riil (DPR) Transportasi Lokal / Taksi Bandara', is_wajib: true, urutan: 7 },
      { id: 's-524111-8', nama_syarat: 'Rekapitulasi Perjalanan Dinas Biasa (Bendahara)', is_wajib: true, urutan: 8 },
      { id: 's-524111-9', nama_syarat: 'Laporan Singkat Hasil Pelaksanaan Perjadin & Dokumentasi Foto', is_wajib: true, urutan: 9 },
    ],
  },

  // 10. 524113 - Belanja Perjalanan Dinas Dalam Kota
  {
    id: 'mak-524113',
    kode_akun: '524113',
    kategori_id: 'perjadin',
    nama_akun: 'Belanja Perjalanan Dinas Dalam Kota',
    singkatan: 'Transport Petugas Lapangan',
    deskripsi: 'Transport lokal petugas pendataan lapangan, transport pengawasan/supervisi kab/kota, transport daerah sulit.',
    kegiatan_contoh: 'Transport Petugas Survei Pertanian ke Desa, Transport Petugas Survei Harga Pasar, Supervisi Lapangan Kecamatan',
    aturan_pajak: 'Transport supervisi maksimal senilai SBM dalam kota. Transport daerah sulit at-cost. Perjadin > 8 jam dapat uang harian.',
    syarat: [
      { id: 's-524113-1', nama_syarat: 'Kerangka Acuan Kerja (KAK) & Form Permintaan / Nota Dinas', is_wajib: true, urutan: 1 },
      { id: 's-524113-2', nama_syarat: 'Surat Tugas (Surtu) resmi bertandatangan Kepala BPS / Atasan Langsung', is_wajib: true, urutan: 2 },
      { id: 's-524113-3', nama_syarat: 'Bukti Visum, Tanda Tangan & Cap Stempel dari Tempat yang Dikunjungi (Kades/Lurah/Responden)', is_wajib: true, urutan: 3 },
      { id: 's-524113-4', nama_syarat: 'Surat Pernyataan Tidak Menggunakan Kendaraan Dinas', is_wajib: true, urutan: 4 },
      { id: 's-524113-5', nama_syarat: 'Laporan Ringkas Hasil Pelaksanaan Perjalanan Dinas Dalam Kota', is_wajib: true, urutan: 5 },
      { id: 's-524113-6', nama_syarat: 'Kuitansi / Daftar Tanda Terima Uang Transportasi Petugas bertandatangan', is_wajib: true, urutan: 6 },
      { id: 's-524113-7', nama_syarat: 'Rekapitulasi Perjalanan Dinas Dalam Kota & Bukti Transfer Bank (CMS)', is_wajib: true, urutan: 7 },
      { id: 's-524113-8', nama_syarat: 'Jadwal Rinci Pelaksanaan (khusus jika pelaksanaan > 8 jam)', is_wajib: false, urutan: 8 },
    ],
  },

  // 11. 524114 - Belanja Perjadin Paket Meeting Dalam Kota
  {
    id: 'mak-524114',
    kode_akun: '524114',
    kategori_id: 'perjadin',
    nama_akun: 'Belanja Perjadin Paket Meeting Dalam Kota',
    singkatan: 'Pelatihan di Hotel Dalam Kota',
    deskripsi: 'Penyelenggaraan pelatihan petugas sensus/survei paket Fullboard, Fullday, atau Halfday meeting di hotel dalam kota.',
    kegiatan_contoh: 'Pelatihan Petugas Sakernas/Susenas Paket Fullboard di Hotel, Konsinyering Rekonsiliasi PDRB di Hotel',
    aturan_pajak: 'Paket meeting di hotel dipotong PPh 23. Melibatkan pihak eksternal/masyarakat. Surat pernyataan fasilitas kantor tidak mencukupi.',
    syarat: [
      { id: 's-524114-1', nama_syarat: 'Kerangka Acuan Kerja (KAK) & Form Permintaan / Nota Dinas', is_wajib: true, urutan: 1 },
      { id: 's-524114-2', nama_syarat: 'Surat Pernyataan PJ Kegiatan bahwa Fasilitas Aula/Ruang Kantor Tidak Mencukupi', is_wajib: true, urutan: 2 },
      { id: 's-524114-3', nama_syarat: 'Surat Undangan Kegiatan & Jadwal Acara (Fullboard / Fullday min 8 jam / Halfday min 5 jam)', is_wajib: true, urutan: 3 },
      { id: 's-524114-4', nama_syarat: 'Surat Tugas & Daftar Hadir Peserta Lengkap Setiap Hari', is_wajib: true, urutan: 4 },
      { id: 's-524114-5', nama_syarat: 'Notulensi / Laporan Pelaksanaan Kegiatan & Dokumentasi Foto', is_wajib: true, urutan: 5 },
      { id: 's-524114-6', nama_syarat: 'SPD Paket Meeting Dalam Kota & Pernyataan Tidak Menggunakan Kendaraan Dinas', is_wajib: true, urutan: 6 },
      { id: 's-524114-7', nama_syarat: 'Daftar Rincian Perhitungan Pembayaran Paket Meeting & Transport Peserta', is_wajib: true, urutan: 7 },
      { id: 's-524114-8', nama_syarat: 'Roomlist / Daftar Pembagian Kamar Hotel Dilegalisasi Pihak Hotel (khusus Fullboard)', is_wajib: true, urutan: 8 },
      { id: 's-524114-9', nama_syarat: 'Kuitansi Pembayaran Hotel, Faktur Pajak & SSP PPh 23', is_wajib: true, urutan: 9 },
    ],
  },

  // 12. 524119 - Belanja Perjadin Paket Meeting Luar Kota
  {
    id: 'mak-524119',
    kode_akun: '524119',
    kategori_id: 'perjadin',
    nama_akun: 'Belanja Perjadin Paket Meeting Luar Kota',
    singkatan: 'Pelatihan Hotel Luar Kota',
    deskripsi: 'Penyelenggaraan paket meeting / konsinyering pelatihan petugas di hotel luar kota (bila fasilitas hotel dalam kota tidak mencukupi).',
    kegiatan_contoh: 'Pelatihan Petugas Sensus Skala Besar di Hotel Luar Kota, Workshop Konsolidasi Nerwilis Regional',
    aturan_pajak: 'Paket meeting luar kota dipotong PPh 23. Wajib melampirkan roomlist hotel terlegalisasi dan surat pernyataan fasilitas tidak mencukupi.',
    syarat: [
      { id: 's-524119-1', nama_syarat: 'Kerangka Acuan Kerja (KAK) & Form Permintaan ke PPK', is_wajib: true, urutan: 1 },
      { id: 's-524119-2', nama_syarat: 'Surat Pernyataan PJ Kegiatan bahwa Fasilitas Kantor & Hotel Dalam Kota Tidak Mencukupi', is_wajib: true, urutan: 2 },
      { id: 's-524119-3', nama_syarat: 'Surat Tugas Resmi & SPD Perjalanan Dinas Luar Kota', is_wajib: true, urutan: 3 },
      { id: 's-524119-4', nama_syarat: 'Berita Acara Pemeriksaan Pekerjaan (BAPP) & BASTHP', is_wajib: true, urutan: 4 },
      { id: 's-524119-5', nama_syarat: 'Fotokopi NPWP & Rekening Koran / Buku Tabungan Penyedia Hotel', is_wajib: true, urutan: 5 },
      { id: 's-524119-6', nama_syarat: 'Invoice, Kuitansi Hotel Bermaterai, & Berita Acara Pembayaran (BAP)', is_wajib: true, urutan: 6 },
      { id: 's-524119-7', nama_syarat: 'Surat Undangan, Daftar Hadir Peserta Lengkap, & Jadwal Acara per Hari', is_wajib: true, urutan: 7 },
      { id: 's-524119-8', nama_syarat: 'Laporan Hasil Pelaksanaan Kegiatan & Dokumentasi Foto Lengkap', is_wajib: true, urutan: 8 },
      { id: 's-524119-9', nama_syarat: 'Roomlist / Daftar Kamar Hotel Asli Dilegalisasi Pihak Hotel', is_wajib: true, urutan: 9 },
      { id: 's-524119-10', nama_syarat: 'Faktur Pajak & Bukti Setor Pajak (SSP PPh 23)', is_wajib: true, urutan: 10 },
    ],
  },
]

// Helper untuk mencari MAK berdasarkan ID atau Kode
export function getMakByIdOrKode(idOrKode) {
  return (
    MASTER_AKUN_BPS.find((m) => m.id === idOrKode || m.kode_akun === idOrKode) ||
    MASTER_AKUN_BPS[0]
  )
}

// Opsi Metode Pembayaran (Sesuai Referensi SPJ Proses 2026 BPS)
export const METODE_PEMBAYARAN_BPS = [
  { id: 'LS', label: 'LS (Langsung KPPN)', deskripsi: 'Pencairan langsung dari Kas Negara / KPPN ke rekening penerima/mitra' },
  { id: 'GUP', label: 'GUP (Ganti Uang Persediaan)', deskripsi: 'Pencairan melalui Uang Persediaan di kas Bendahara Pengeluaran kantor BPS' },
]
