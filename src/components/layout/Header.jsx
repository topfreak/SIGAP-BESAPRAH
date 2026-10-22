import React from 'react'
import { ShieldCheck, User, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigation } from '../../context/NavigationContext'
import { getTimKerjaById } from '../../data/bpsStructure'

export function Header() {
  const { currentUser, logout } = useAuth()
  const { navigateTo } = useNavigation()

  const handleLogout = () => {
    logout()
    navigateTo('login')
  }

  // Label jabatan resmi untuk badge statis versi final
  const roleLabels = {
    tim_kerja: 'Tim Kerja BPS',
    admin_tu: 'Tata Usaha (Admin TU)',
    ppk: 'Pejabat Pembuat Komitmen (PPK)',
    bendahara: 'Bendahara Pengeluaran',
    ppspm: 'PPSPM',
  }

  return (
    <header className="bg-white border-b border-slate-200/90 shadow-2xs sticky top-0 z-30 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Clean Bar */}
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => navigateTo('dashboard')}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
            title="Klik untuk kembali ke Beranda"
          >
            {/* Minimalist Emblem */}
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 to-sky-500 p-0.5 shadow-md shadow-blue-500/15 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-blue-700" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-wider uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                  BADAN PUSAT STATISTIK
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
                SIGAP BESAPRAH
              </h1>
              <p className="text-xs text-slate-500 italic font-normal -mt-0.5 hidden sm:block">
                “Bersaprah dalam Kerja, Sepakat dalam Akuntabilitas.”
              </p>
            </div>
          </div>

          {/* User Profile & Badge Jabatan Resmi & Logout */}
          <div className="flex items-center gap-3">
            
            {/* Friendly Greeting Card */}
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-2">
              <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-sm">
                <User className="w-4 h-4" />
              </div>

              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-slate-800">
                  {currentUser?.nama_lengkap || 'Pegawai BPS'}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  NIP: {currentUser?.nip || '-'}
                </div>
              </div>

              <div className="h-6 w-px bg-slate-200 hidden md:block" />

              {/* Badge Jabatan Statis Resmi */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-100/70 border border-blue-200/80 text-blue-900 text-xs font-bold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>
                  {currentUser?.role === 'tim_kerja' && currentUser?.tim_kerja
                    ? `${getTimKerjaById(currentUser.tim_kerja).nama} (PJ)`
                    : roleLabels[currentUser?.role] || currentUser?.jabatan || 'Pegawai BPS'}
                </span>
              </div>

              <div className="h-6 w-px bg-slate-200" />

              {/* Tombol Logout Sederhana */}
              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                title="Keluar dari Akun (Logout)"
              >
                <LogOut className="w-4 h-4" />
              </button>

            </div>

          </div>

        </div>

      </div>
    </header>
  )
}

export default Header
