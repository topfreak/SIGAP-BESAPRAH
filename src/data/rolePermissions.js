/**
 * ROLE-BASED ACCESS CONTROL (RBAC) - BPS KABUPATEN SAMBAS
 * SIGAP BESAPRAH (Satker 6101 / DIPA 1301)
 * 
 * Pengelompokan Menu Logis:
 * 1. Utama: Dasbor
 * 2. Perjalanan Dinas: Kalender Perjadin, Matriks Penugasan Pegawai, Rekap Biaya Perjadin
 * 3. Administrasi & SPJ: Pengajuan SPJ, Posisi Fisik Dokumen, Status Pembayaran, Status Pengajuan, Standar Dokumen (12 MAK), Checklist Rekon SE2026, SOP Pengajuan SPJ
 * 4. Honor Mitra: Monitoring Honor Mitra, Kegiatan Manmit, Pembayaran Honor
 * 5. Master Data & Wilayah: Master SLS, Direktori Pegawai
 * 6. Sistem & Pusat Informasi: Riwayat PPK, Jadwal Terpadu, Microsite BPS, Manajemen Pengguna, Pengaturan Satker
 */

export const ROLE_PERMISSIONS = {
  // 1. SUPERADMIN (Super Admin - username: superadmin) - FULL ACCESS KE SELURUH MENU
  admin: [
    'dashboard',
    'kalender_perjadin',
    'matriks_perjadin',
    'rekap_perjadin',
    'spj_table',
    'pengajuan',
    'daftar_pengajuan',
    'pengajuan_baru',
    'buat_spj',
    'posisi_dokumen',
    'status_pembayaran',
    'status_pengajuan',
    'jenis_dokumen',
    'checklist_kelengkapan',
    'custom_page',
    'sop_spj',
    'monitor_honor_mitra',
    'kegiatan_manmit',
    'honor_mitra',
    'master_sls',
    'pegawai',
    'riwayat_ppk',
    'jadwal_terpadu',
    'microsite',
    'pengguna',
    'pengaturan',
  ],

  // 2. PEJABAT PEMBUAT KOMITMEN (Andi Noviantoni, S.P. - PPK)
  ppk: [
    'dashboard',
    'kalender_perjadin',
    'matriks_perjadin',
    'rekap_perjadin',
    'spj_table',
    'pengajuan',
    'daftar_pengajuan',
    'posisi_dokumen',
    'status_pembayaran',
    'status_pengajuan',
    'jenis_dokumen',
    'checklist_kelengkapan',
    'sop_spj',
    'custom_page',
    'riwayat_ppk',
    'jadwal_terpadu',
  ],

  // 3. TATA USAHA (Nuri Hayana, S.Si. - Admin TU / Verifikator Fisik)
  admin_tu: [
    'dashboard',
    'kalender_perjadin',
    'matriks_perjadin',
    'rekap_perjadin',
    'spj_table',
    'pengajuan',
    'daftar_pengajuan',
    'posisi_dokumen',
    'status_pengajuan',
    'jenis_dokumen',
    'checklist_kelengkapan',
    'sop_spj',
    'custom_page',
    'pegawai',
    'monitor_honor_mitra',
    'jadwal_terpadu',
  ],

  // 4. TIM KERJA (Nurhidayatul Fitri, S.Tr.Stat. - Pengusul SPJ Kegiatan)
  tim_kerja: [
    'dashboard',
    'kalender_perjadin',
    'spj_table',
    'pengajuan',
    'daftar_pengajuan',
    'pengajuan_baru',
    'buat_spj',
    'status_pengajuan',
    'jenis_dokumen',
    'checklist_kelengkapan',
    'sop_spj',
    'custom_page',
    'monitor_honor_mitra',
    'jadwal_terpadu',
  ],

  // 5. BENDAHARA PENGELUARAN (Fitria Wulandari, S.Tr.Stat.)
  bendahara: [
    'dashboard',
    'rekap_perjadin',
    'spj_table',
    'pengajuan',
    'daftar_pengajuan',
    'posisi_dokumen',
    'status_pembayaran',
    'jenis_dokumen',
    'checklist_kelengkapan',
    'sop_spj',
    'custom_page',
    'monitor_honor_mitra',
    'kegiatan_manmit',
    'honor_mitra',
  ],

  // 6. PPSPM (Solikhin, SST., M.Si - Kepala BPS & Pejabat Penandatangan SPM)
  ppspm: [
    'dashboard',
    'spj_table',
    'pengajuan',
    'daftar_pengajuan',
    'posisi_dokumen',
    'status_pembayaran',
    'riwayat_ppk',
    'sop_spj',
    'custom_page',
  ],
}

/**
 * Memeriksa apakah halaman tertentu diizinkan untuk role yang sedang aktif.
 */
export function isPageAllowed(pageId, role = 'admin') {
  if (!pageId) return true
  if (role === 'admin') return true
  const allowedList = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.tim_kerja
  return allowedList.includes(pageId)
}

/**
 * Mendapatkan daftar halaman yang diizinkan untuk role tertentu.
 */
export function getAllowedPages(role = 'admin') {
  if (role === 'admin') return ROLE_PERMISSIONS.admin
  return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.tim_kerja
}
