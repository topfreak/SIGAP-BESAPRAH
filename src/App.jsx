import React from 'react'
import { NavigationProvider, useNavigation } from './context/NavigationContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { SpjProvider } from './context/SpjContext'
import Header from './components/layout/Header'
import Navbar from './components/layout/Navbar'
import DashboardPage from './components/pages/DashboardPage'
import BerandaPage from './components/pages/BerandaPage'
import DaftarSpjPage from './components/pages/DaftarSpjPage'
import DetailSpjPage from './components/pages/DetailSpjPage'
import BuatSpjPage from './components/pages/BuatSpjPage'
import PanduanAlurPage from './components/pages/PanduanAlurPage'
import LaporanPage from './components/pages/LaporanPage'
import LoginPage from './components/pages/LoginPage'

// Router sederhana berbasis state tanpa React Router (URL statis & bersih)
function PageRouter() {
  const { activePage } = useNavigation()

  switch (activePage) {
    case 'beranda':
    case 'dashboard':
      return <BerandaPage />
    case 'daftar_spj':
      return <DaftarSpjPage />
    case 'detail_spj':
      return <DetailSpjPage />
    case 'buat_spj':
      return <BuatSpjPage />
    case 'laporan':
      return <LaporanPage />
    case 'panduan_alur':
      return <PanduanAlurPage />
    default:
      return <BerandaPage />
  }
}

// Layout Utama Modern Minimalist
function AppContent() {
  const { isAuthenticated } = useAuth()
  const { activePage } = useNavigation()

  // Jika belum login atau state halaman adalah login
  if (!isAuthenticated || activePage === 'login') {
    return <LoginPage />
  }

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* 1. Header Minimalis Resmi BPS */}
      <Header />

      {/* 2. Menu Navigasi Bersih & Ramah */}
      <Navbar />

      {/* 3. Kontainer Konten Utama */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageRouter />
      </main>

      {/* 4. Footer Bersih */}
      <footer className="bg-white border-t border-slate-200/80 py-6 mt-auto print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">SIGAP BESAPRAH</span>
            <span>•</span>
            <span>Badan Pusat Statistik</span>
          </div>

          <p className="text-slate-400 italic text-center sm:text-right">
            “Bersaprah dalam Kerja, Sepakat dalam Akuntabilitas.”
          </p>
        </div>
      </footer>

    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <SpjProvider>
        <NavigationProvider>
          <AppContent />
        </NavigationProvider>
      </SpjProvider>
    </AuthProvider>
  )
}
