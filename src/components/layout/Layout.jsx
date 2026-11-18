import React, { useState } from 'react'
import {
  LayoutDashboard,
  Calendar,
  CalendarDays,
  FileSpreadsheet,
  MapPin,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  FileText,
  Clock,
  CheckCircle2,
  DollarSign,
  Briefcase,
  FolderOpen,
  FileCheck,
  CreditCard,
  History,
  UserCheck,
  Globe,
  CheckSquare,
  LogOut,
  Menu,
  X,
  BookOpen,
  ShieldCheck,
  BookmarkCheck,
  Layers,
  Database
} from 'lucide-react'
import { isPageAllowed } from '../../data/rolePermissions'

const ROLE_BADGE_MAP = {
  admin: { label: '👑 Super Admin', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
  ppk: { label: 'PPK (Komitmen)', color: 'bg-slate-100 text-slate-800 border-slate-300' },
  admin_tu: { label: 'Admin TU', color: 'bg-blue-50 text-blue-800 border-blue-200' },
  tim_kerja: { label: 'Tim Kerja', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  bendahara: { label: 'Bendahara', color: 'bg-purple-50 text-purple-800 border-purple-200' },
  ppspm: { label: 'PPSPM', color: 'bg-rose-50 text-rose-800 border-rose-200' },
}

export function Layout({
  activePage = 'dashboard',
  onNavigate,
  currentUser = {
    username: 'superadmin',
    nama_lengkap: 'Super Admin',
    role: 'admin',
    inisial: 'SA',
    satker: 'BPS Kabupaten Sambas (6101 / DIPA 1301)',
  },
  onLogout,
  children,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Accordion Sections State
  const [openSections, setOpenSections] = useState({
    perjadin: true,
    spj: true,
    honorMitra: true,
    masterData: true,
    sistem: true,
  })

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleNavigate = (page) => {
    if (onNavigate) {
      onNavigate(page)
    }
    setIsMobileMenuOpen(false)
  }

  const userRole = currentUser?.role || 'admin'
  const isAdmin = userRole === 'admin'
  const canAccess = (pageId) => isPageAllowed(pageId, userRole)

  const roleBadge = ROLE_BADGE_MAP[userRole] || {
    label: userRole.toUpperCase(),
    color: 'bg-gray-100 text-gray-800 border-gray-200',
  }

  // Breadcrumb Generator Logis
  const getBreadcrumbs = () => {
    switch (activePage) {
      case 'dashboard':
        return [{ label: 'Dasbor', page: 'dashboard' }, { label: 'Ringkasan Eksekutif' }]
      case 'kalender_perjadin':
        return [{ label: 'Perjalanan Dinas' }, { label: 'Kalender Perjadin' }]
      case 'matriks_perjadin':
        return [{ label: 'Perjalanan Dinas' }, { label: 'Matriks Penugasan Pegawai' }]
      case 'rekap_perjadin':
      case 'rekap_biaya_perjadin':
        return [{ label: 'Perjalanan Dinas' }, { label: 'Rekap Biaya Perjadin' }]
      case 'spj_table':
      case 'pengajuan':
      case 'daftar_pengajuan':
        return [{ label: 'Administrasi & SPJ', page: 'spj_table' }, { label: 'Pengajuan SPJ' }]
      case 'posisi_dokumen':
        return [{ label: 'Administrasi & SPJ' }, { label: 'Posisi Fisik Dokumen (5 Meja)' }]
      case 'status_pembayaran':
        return [{ label: 'Administrasi & SPJ' }, { label: 'Status Pembayaran (LS / GUP)' }]
      case 'status_pengajuan':
        return [{ label: 'Administrasi & SPJ' }, { label: 'Status Pengajuan & Kelengkapan' }]
      case 'jenis_dokumen':
        return [{ label: 'Administrasi & SPJ' }, { label: 'Standar Dokumen (12 MAK)' }]
      case 'checklist_kelengkapan':
        return [{ label: 'Administrasi & SPJ' }, { label: 'Checklist Rekon SE2026' }]
      case 'custom_page':
      case 'sop_spj':
        return [{ label: 'Administrasi & SPJ' }, { label: 'SOP Pengajuan SPJ' }]
      case 'monitor_honor_mitra':
        return [{ label: 'Honor Mitra Statistik' }, { label: 'Monitoring Honor Mitra' }]
      case 'kegiatan_manmit':
        return [{ label: 'Honor Mitra Statistik' }, { label: 'Kegiatan Manmit' }]
      case 'honor_mitra':
        return [{ label: 'Honor Mitra Statistik' }, { label: 'Pembayaran Honor' }]
      case 'master_sls':
        return [{ label: 'Master Data & Wilayah' }, { label: 'Master SLS & Wilayah Tugas' }]
      case 'pegawai':
        return [{ label: 'Master Data & Wilayah' }, { label: 'Direktori Pegawai BPS' }]
      case 'riwayat_ppk':
        return [{ label: 'Sistem & Informasi' }, { label: 'Riwayat PPK' }]
      case 'jadwal_terpadu':
        return [{ label: 'Sistem & Informasi' }, { label: 'Jadwal Terpadu Sensus/Survei' }]
      case 'microsite':
        return [{ label: 'Sistem & Informasi' }, { label: 'Portal & Microsite BPS' }]
      case 'pengguna':
        return [{ label: 'Sistem & Informasi' }, { label: 'Manajemen Pengguna' }]
      case 'pengaturan':
        return [{ label: 'Sistem & Informasi' }, { label: 'Pengaturan Satker' }]
      case 'buat_spj':
      case 'pengajuan_baru':
        return [{ label: 'Administrasi & SPJ' }, { label: 'Pengajuan SPJ Baru' }]
      default:
        return [{ label: 'Dasbor', page: 'dashboard' }, { label: activePage }]
    }
  }

  const breadcrumbs = getBreadcrumbs()

  // Style Helper untuk Active Item Sidebar (Modern BPS Aesthetic)
  const getMenuItemClass = (isActive) => {
    return `group flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
      isActive
        ? 'bg-indigo-50 text-indigo-900 border-l-4 border-indigo-600 font-bold shadow-2xs pl-2.5'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
    }`
  }

  // Cek apakah section memiliki minimal 1 item yang diizinkan untuk role saat ini
  const showPerjadin = canAccess('kalender_perjadin') || canAccess('matriks_perjadin') || canAccess('rekap_perjadin')
  const showSpj = canAccess('spj_table') || canAccess('posisi_dokumen') || canAccess('status_pembayaran') || canAccess('status_pengajuan') || canAccess('jenis_dokumen') || canAccess('checklist_kelengkapan') || canAccess('custom_page') || canAccess('sop_spj')
  const showHonorMitra = canAccess('monitor_honor_mitra') || canAccess('kegiatan_manmit') || canAccess('honor_mitra')
  const showMasterData = canAccess('master_sls') || canAccess('pegawai')
  const showSistem = canAccess('riwayat_ppk') || canAccess('jadwal_terpadu') || canAccess('microsite') || canAccess('pengguna') || canAccess('pengaturan')

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col font-sans text-slate-800 antialiased">
      
      {/* MOBILE BACKDROP */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-row min-h-screen">
        
        {/* ============================================================== */}
        {/* SIDEBAR (NAVIGASI LOGIS RESMI BPS KABUPATEN SAMBAS)            */}
        {/* ============================================================== */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200/90 flex flex-col shadow-xs transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Header Sidebar: Branding BPS & SIGAP BESAPRAH */}
          <div className="h-16 px-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
            <button
              onClick={() => handleNavigate('dashboard')}
              className="flex items-center gap-2.5 text-left cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-700 transition-colors">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-tight text-slate-900 block leading-tight">
                  SIGAP BESAPRAH
                </span>
                <span className="text-[10px] text-indigo-600 font-bold tracking-wider block">
                  BPS KAB. SAMBAS
                </span>
              </div>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigasi Menu Sidebar (Scrollable & Terkelompok Rapi) */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
            
            {/* 1. DASBOR (UTAMA) */}
            {canAccess('dashboard') && (
              <button
                onClick={() => handleNavigate('dashboard')}
                className={`w-full text-left ${getMenuItemClass(activePage === 'dashboard')}`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                  <span>Dasbor</span>
                </div>
              </button>
            )}

            {/* ============================================================== */}
            {/* GRUP 1: PERJALANAN DINAS (PERJADIN)                            */}
            {/* ============================================================== */}
            {showPerjadin && (
              <div className="space-y-0.5 pt-2">
                <button
                  type="button"
                  onClick={() => toggleSection('perjadin')}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider hover:text-gray-700 cursor-pointer"
                >
                  <span>Perjalanan Dinas</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${
                      openSections.perjadin ? 'rotate-0' : '-rotate-90'
                    }`}
                  />
                </button>

                {openSections.perjadin && (
                  <div className="space-y-0.5 pl-1">
                    {canAccess('kalender_perjadin') && (
                      <button
                        onClick={() => handleNavigate('kalender_perjadin')}
                        className={`w-full text-left ${getMenuItemClass(activePage === 'kalender_perjadin')}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span>Kalender Perjadin</span>
                        </div>
                      </button>
                    )}

                    {canAccess('matriks_perjadin') && (
                      <button
                        onClick={() => handleNavigate('matriks_perjadin')}
                        className={`w-full text-left ${getMenuItemClass(activePage === 'matriks_perjadin')}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <CalendarDays className="w-4 h-4 text-gray-500" />
                          <span>Matriks Penugasan Pegawai</span>
                        </div>
                      </button>
                    )}

                    {canAccess('rekap_perjadin') && (
                      <button
                        onClick={() => handleNavigate('rekap_perjadin')}
                        className={`w-full text-left ${getMenuItemClass(
                          activePage === 'rekap_perjadin' || activePage === 'rekap_biaya_perjadin'
                        )}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <FileSpreadsheet className="w-4 h-4 text-gray-500" />
                          <span>Rekap Biaya Perjadin</span>
                        </div>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* GRUP 2: ADMINISTRASI & SPJ (TERMASUK SOP PENGALURAN BERKAS)     */}
            {/* ============================================================== */}
            {showSpj && (
              <div className="space-y-0.5 pt-2">
                <button
                  type="button"
                  onClick={() => toggleSection('spj')}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider hover:text-gray-700 cursor-pointer"
                >
                  <span>Administrasi & SPJ</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${
                      openSections.spj ? 'rotate-0' : '-rotate-90'
                    }`}
                  />
                </button>

                {openSections.spj && (
                  <div className="space-y-0.5 pl-1">
                    {canAccess('spj_table') && (
                      <button
                        onClick={() => handleNavigate('spj_table')}
                        className={`w-full text-left ${getMenuItemClass(
                          activePage === 'spj_table' || activePage === 'pengajuan' || activePage === 'daftar_pengajuan'
                        )}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <FolderOpen className="w-4 h-4 text-indigo-600" />
                          <span>Pengajuan SPJ</span>
                        </div>
                      </button>
                    )}

                    {canAccess('posisi_dokumen') && (
                      <button
                        onClick={() => handleNavigate('posisi_dokumen')}
                        className={`w-full text-left ${getMenuItemClass(activePage === 'posisi_dokumen')}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span>Posisi Fisik Dokumen (5 Meja)</span>
                        </div>
                      </button>
                    )}

                    {canAccess('status_pembayaran') && (
                      <button
                        onClick={() => handleNavigate('status_pembayaran')}
                        className={`w-full text-left ${getMenuItemClass(activePage === 'status_pembayaran')}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <CreditCard className="w-4 h-4 text-gray-500" />
                          <span>Status Pembayaran (LS / GUP)</span>
                        </div>
                      </button>
                    )}

                    {canAccess('status_pengajuan') && (
                      <button
                        onClick={() => handleNavigate('status_pengajuan')}
                        className={`w-full text-left ${getMenuItemClass(activePage === 'status_pengajuan')}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span>Status Pengajuan & Kelengkapan</span>
                        </div>
                      </button>
                    )}

                    {canAccess('jenis_dokumen') && (
                      <button
                        onClick={() => handleNavigate('jenis_dokumen')}
                        className={`w-full text-left ${getMenuItemClass(activePage === 'jenis_dokumen')}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <FileCheck className="w-4 h-4 text-gray-500" />
                          <span>Standar Dokumen (12 MAK)</span>
                        </div>
                      </button>
                    )}

                    {canAccess('checklist_kelengkapan') && (
                      <button
                        onClick={() => handleNavigate('checklist_kelengkapan')}
                        className={`w-full text-left ${getMenuItemClass(activePage === 'checklist_kelengkapan')}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <CheckSquare className="w-4 h-4 text-gray-500" />
                          <span>Checklist Rekon SE2026</span>
                        </div>
                      </button>
                    )}

                    {(canAccess('custom_page') || canAccess('sop_spj')) && (
                      <button
                        onClick={() => handleNavigate('custom_page')}
                        className={`w-full text-left ${getMenuItemClass(
                          activePage === 'custom_page' || activePage === 'sop_spj'
                        )}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <BookOpen className="w-4 h-4 text-indigo-600" />
                          <span>SOP Pengajuan SPJ</span>
                        </div>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* GRUP 3: HONOR MITRA STATISTIK                                  */}
            {/* ============================================================== */}
            {showHonorMitra && (
              <div className="space-y-0.5 pt-2">
                <button
                  type="button"
                  onClick={() => toggleSection('honorMitra')}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider hover:text-gray-700 cursor-pointer"
                >
                  <span>Honor Mitra Statistik</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${
                      openSections.honorMitra ? 'rotate-0' : '-rotate-90'
                    }`}
                  />
                </button>

                {openSections.honorMitra && (
                  <div className="space-y-0.5 pl-1">
                    {canAccess('monitor_honor_mitra') && (
                      <button
                        onClick={() => handleNavigate('monitor_honor_mitra')}
                        className={`w-full text-left ${getMenuItemClass(activePage === 'monitor_honor_mitra')}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <DollarSign className="w-4 h-4 text-gray-500" />
                          <span>Monitoring Honor Mitra</span>
                        </div>
                      </button>
                    )}

                    {canAccess('kegiatan_manmit') && (
                      <button
                        onClick={() => handleNavigate('kegiatan_manmit')}
                        className={`w-full text-left ${getMenuItemClass(activePage === 'kegiatan_manmit')}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Briefcase className="w-4 h-4 text-gray-500" />
                          <span>Kegiatan Manmit</span>
                        </div>
                      </button>
                    )}

                    {canAccess('honor_mitra') && (
                      <button
                        onClick={() => handleNavigate('honor_mitra')}
                        className={`w-full text-left ${getMenuItemClass(activePage === 'honor_mitra')}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <DollarSign className="w-4 h-4 text-gray-500" />
                          <span>Pembayaran Honor</span>
                        </div>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* GRUP 4: MASTER DATA & WILAYAH                                  */}
            {/* ============================================================== */}
            {showMasterData && (
              <div className="space-y-0.5 pt-2">
                <button
                  type="button"
                  onClick={() => toggleSection('masterData')}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider hover:text-gray-700 cursor-pointer"
                >
                  <span>Master Data & Wilayah</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${
                      openSections.masterData ? 'rotate-0' : '-rotate-90'
                    }`}
                  />
                </button>

                {openSections.masterData && (
                  <div className="space-y-0.5 pl-1">
                    {canAccess('master_sls') && (
                      <button
                        onClick={() => handleNavigate('master_sls')}
                        className={`w-full text-left ${getMenuItemClass(activePage === 'master_sls')}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span>Master SLS & Wilayah Tugas</span>
                        </div>
                      </button>
                    )}

                    {canAccess('pegawai') && (
                      <button
                        onClick={() => handleNavigate('pegawai')}
                        className={`w-full text-left ${getMenuItemClass(activePage === 'pegawai')}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span>Direktori Pegawai BPS</span>
                        </div>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* GRUP 5: SISTEM & PUSAT INFORMASI (API KEYS/LOG SUDAH DIHAPUS)   */}
            {/* ============================================================== */}
            {showSistem && (
              <div className="space-y-0.5 pt-2">
                <button
                  type="button"
                  onClick={() => toggleSection('sistem')}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider hover:text-gray-700 cursor-pointer"
                >
                  <span>Sistem & Informasi</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${
                      openSections.sistem ? 'rotate-0' : '-rotate-90'
                    }`}
                  />
                </button>

                {openSections.sistem && (
                  <div className="space-y-0.5 pl-1">
                    {/* Riwayat PPK dengan Badge Hijau 'Aktif' */}
                    {canAccess('riwayat_ppk') && (
                      <button
                        onClick={() => handleNavigate('riwayat_ppk')}
                        className={`w-full text-left ${getMenuItemClass(activePage === 'riwayat_ppk')}`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2.5">
                            <History className="w-4 h-4 text-gray-500" />
                            <span>Riwayat PPK</span>
                          </div>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Aktif
                          </span>
                        </div>
                      </button>
                    )}

                    {canAccess('jadwal_terpadu') && (
                      <button
                        onClick={() => handleNavigate('jadwal_terpadu')}
                        className={`w-full text-left ${getMenuItemClass(activePage === 'jadwal_terpadu')}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span>Jadwal Terpadu Sensus/Survei</span>
                        </div>
                      </button>
                    )}

                    {canAccess('microsite') && (
                      <button
                        onClick={() => handleNavigate('microsite')}
                        className={`w-full text-left ${getMenuItemClass(activePage === 'microsite')}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Globe className="w-4 h-4 text-gray-500" />
                          <span>Portal & Microsite BPS</span>
                        </div>
                      </button>
                    )}

                    {canAccess('pengguna') && (
                      <button
                        onClick={() => handleNavigate('pengguna')}
                        className={`w-full text-left ${getMenuItemClass(activePage === 'pengguna')}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <UserCheck className="w-4 h-4 text-gray-500" />
                          <span>Manajemen Pengguna</span>
                        </div>
                      </button>
                    )}

                    {canAccess('pengaturan') && (
                      <button
                        onClick={() => handleNavigate('pengaturan')}
                        className={`w-full text-left ${getMenuItemClass(activePage === 'pengaturan')}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Settings className="w-4 h-4 text-gray-500" />
                          <span>Pengaturan Satker</span>
                        </div>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

          </nav>

          {/* Footer Sidebar: Satker Metadata & Kode DIPA Resmi */}
          <div className="p-3 border-t border-gray-100 bg-gray-50/90 flex-shrink-0">
            <div className="flex items-center justify-between text-[10px] text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-gray-800">BPS: 6101 | DIPA: 1301</span>
              </span>
              <span className="font-mono text-gray-400">TA 2026</span>
            </div>
          </div>
        </aside>

        {/* ============================================================== */}
        {/* WRAPPER KONTEN UTAMA SEBELAH KANAN SIDEBAR                      */}
        {/* ============================================================== */}
        <div className="flex-1 flex flex-col lg:pl-64 min-w-0 transition-all duration-300">
          
          {/* TOPBAR (Sticky, Resmi BPS Sambas, Bersih & Modern) */}
          <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            
            {/* Breadcrumbs Kiri */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </button>

              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500">
                {breadcrumbs.map((item, idx) => {
                  const isLast = idx === breadcrumbs.length - 1
                  return (
                    <React.Fragment key={idx}>
                      {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />}
                      {item.page && !isLast ? (
                        <button
                          onClick={() => handleNavigate(item.page)}
                          className="hover:text-indigo-600 font-medium transition-colors"
                        >
                          {item.label}
                        </button>
                      ) : (
                        <span className={`${isLast ? 'font-semibold text-gray-800' : 'font-medium'}`}>
                          {item.label}
                        </span>
                      )}
                    </React.Fragment>
                  )
                })}
              </nav>
            </div>

            {/* Profil Kanan & Tombol Logout Asli */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Info Pengguna Aktif */}
              <div className="flex items-center gap-2 p-1.5 sm:px-2.5 rounded-xl bg-gray-50 border border-gray-200/70">
                <div
                  className={`w-7 h-7 rounded-full text-white font-bold text-xs flex items-center justify-center shadow-xs ring-2 ${
                    isAdmin ? 'bg-indigo-950 ring-indigo-600/30' : 'bg-slate-800 ring-slate-700/20'
                  }`}
                >
                  {currentUser?.inisial || (isAdmin ? 'SA' : 'BS')}
                </div>

                <div className="hidden sm:block text-left leading-tight pr-1">
                  <div className="text-xs font-bold text-gray-800 truncate max-w-[170px]">
                    {currentUser?.nama_lengkap || 'Pegawai BPS'}
                  </div>
                  <div className="text-[10px] mt-0.5">
                    <span className={`inline-block px-1.5 py-0.2 rounded-md font-semibold text-[10px] border ${roleBadge.color}`}>
                      {roleBadge.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tombol Logout Resmi */}
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 hover:border-rose-600 transition-all cursor-pointer shadow-2xs"
                title="Keluar dari sistem"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </header>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-50/70">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>

        </div>

      </div>

    </div>
  )
}

export default Layout
