import React, { useState, useEffect } from 'react'
import Layout from './components/layout/Layout'
import Dashboard from './components/pages/Dashboard'
import SpjTable from './components/pages/SpjTable'
import MasterDataPage from './components/pages/MasterDataPage'
import PengaturanPage from './components/pages/PengaturanPage'
import BuatSpjPage from './components/pages/BuatSpjPage'
import MasterSlsPage from './components/pages/MasterSlsPage'
import PerjadinPage from './components/pages/PerjadinPage'
import ChecklistKelengkapanPage from './components/pages/ChecklistKelengkapanPage'
import HonorMitraPage from './components/pages/HonorMitraPage'
import PosisiDokumenPage from './components/pages/PosisiDokumenPage'
import StatusPembayaranPage from './components/pages/StatusPembayaranPage'
import StatusPengajuanPage from './components/pages/StatusPengajuanPage'
import RiwayatPpkPage from './components/pages/RiwayatPpkPage'
import ContentManagementPage from './components/pages/ContentManagementPage'
import PegawaiPage from './components/pages/PegawaiPage'
import LoginPage from './components/pages/LoginPage'
import AccessRestricted from './components/common/AccessRestricted'
import ErrorBoundary from './components/common/ErrorBoundary'
import { AuthProvider, useAuth } from './context/AuthContext'
import { SpjProvider } from './context/SpjContext'
import { NavigationProvider } from './context/NavigationContext'
import { isPageAllowed } from './data/rolePermissions'

const SESSION_PAGE_KEY = 'sigap_active_page'

function MainApp() {
  const { currentUser, isAuthenticated, logout } = useAuth()

  // Session-Persistent State-Based Routing menggunakan useState murni
  const [activePage, setActivePage] = useState(() => {
    try {
      const savedPage = sessionStorage.getItem(SESSION_PAGE_KEY)
      if (savedPage) return savedPage
    } catch (err) {
      console.warn('Gagal membaca activePage dari sessionStorage:', err)
    }
    return 'dashboard'
  })

  // Sinkronkan activePage ke sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_PAGE_KEY, activePage)
    } catch (err) {
      console.warn('Gagal menyimpan activePage ke sessionStorage:', err)
    }

    if (window.location.hash || window.location.search) {
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [activePage])

  // Handler Logout
  const handleLogout = async () => {
    sessionStorage.removeItem(SESSION_PAGE_KEY)
    await logout()
    setActivePage('dashboard')
  }

  // 1. JIKA BELUM LOGIN: TAMPILKAN PORTAL LOGIN ASLI RESMI BPS SAMBAS
  if (!isAuthenticated || !currentUser) {
    return <LoginPage onLoginSuccess={() => setActivePage('dashboard')} />
  }

  // 2. PEMBATASAN AKSES: HANYA SUPERADMIN YANG BISA BUKA FULL MENU
  const userRole = currentUser.role || 'tim_kerja'
  const isAllowed = isPageAllowed(activePage, userRole)

  // Render halaman dinamis sesuai state activePage
  const renderContent = () => {
    if (!isAllowed) {
      return (
        <AccessRestricted
          currentUser={currentUser}
          onNavigate={setActivePage}
        />
      )
    }

    switch (activePage) {
      case 'dashboard':
        return <Dashboard key="dashboard" onNavigate={setActivePage} currentUser={currentUser} />

      // Perjalanan Dinas (Kalender, Matriks Penugasan 19 Kecamatan, Rekap Biaya Perjadin)
      case 'kalender_perjadin':
      case 'matriks_perjadin':
      case 'rekap_perjadin':
      case 'rekap_biaya_perjadin':
        return <PerjadinPage key={activePage} mode={activePage} onNavigate={setActivePage} />

      // Administrasi & SPJ
      case 'spj_table':
      case 'pengajuan':
      case 'daftar_pengajuan':
        return (
          <SpjTable
            key="spj_table"
            onNavigate={setActivePage}
            currentUser={currentUser}
          />
        )
      case 'posisi_dokumen':
        return <PosisiDokumenPage key="posisi_dokumen" onNavigate={setActivePage} />
      case 'status_pembayaran':
        return <StatusPembayaranPage key="status_pembayaran" onNavigate={setActivePage} />
      case 'status_pengajuan':
        return <StatusPengajuanPage key="status_pengajuan" onNavigate={setActivePage} />
      case 'jenis_dokumen':
        return (
          <ChecklistKelengkapanPage
            key="jenis_dokumen"
            mode="jenis_dokumen"
            onNavigate={setActivePage}
          />
        )
      case 'checklist_kelengkapan':
        return (
          <ChecklistKelengkapanPage
            key="checklist_kelengkapan"
            mode="checklist_kelengkapan"
            onNavigate={setActivePage}
          />
        )
      case 'custom_page':
      case 'sop_spj':
        return (
          <ContentManagementPage
            key="sop_spj"
            mode="custom_page"
            onNavigate={setActivePage}
          />
        )

      // Honor Mitra Statistik
      case 'monitor_honor_mitra':
        return (
          <HonorMitraPage
            key="monitor_honor_mitra"
            mode="monitor_honor_mitra"
            onNavigate={setActivePage}
          />
        )
      case 'kegiatan_manmit':
        return (
          <HonorMitraPage
            key="kegiatan_manmit"
            mode="kegiatan_manmit"
            onNavigate={setActivePage}
          />
        )
      case 'honor_mitra':
      case 'alokasi_honor':
        return (
          <HonorMitraPage
            key="honor_mitra"
            mode="honor_mitra"
            onNavigate={setActivePage}
          />
        )

      // Master Data & Wilayah
      case 'master_sls':
        return <MasterSlsPage key="master_sls" onNavigate={setActivePage} />
      case 'pegawai':
        return <PegawaiPage key="pegawai" mode="pegawai" currentUser={currentUser} />

      // Sistem & Informasi
      case 'riwayat_ppk':
        return <RiwayatPpkPage key="riwayat_ppk" onNavigate={setActivePage} />
      case 'jadwal_terpadu':
        return (
          <ContentManagementPage
            key="jadwal_terpadu"
            mode="jadwal_terpadu"
            onNavigate={setActivePage}
          />
        )
      case 'microsite':
        return (
          <ContentManagementPage
            key="microsite"
            mode="microsite"
            onNavigate={setActivePage}
          />
        )
      case 'pengguna':
        return <PegawaiPage key="pengguna" mode="pengguna" currentUser={currentUser} />
      case 'pengaturan':
        return <PengaturanPage key="pengaturan" currentUser={currentUser} />

      // Form Pengajuan SPJ Baru
      case 'pengajuan_baru':
      case 'buat_spj':
        return <BuatSpjPage key="buat_spj" onNavigate={setActivePage} currentUser={currentUser} />
      case 'master_data':
        return <MasterDataPage key="master_data" currentUser={currentUser} />

      default:
        return <Dashboard key="default_dash" onNavigate={setActivePage} currentUser={currentUser} />
    }
  }

  return (
    <Layout
      activePage={activePage}
      onNavigate={setActivePage}
      currentUser={currentUser}
      onLogout={handleLogout}
    >
      <ErrorBoundary onReset={() => setActivePage('dashboard')}>
        {renderContent()}
      </ErrorBoundary>
    </Layout>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <SpjProvider>
        <NavigationProvider>
          <MainApp />
        </NavigationProvider>
      </SpjProvider>
    </AuthProvider>
  )
}
