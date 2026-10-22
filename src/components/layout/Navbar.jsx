import React from 'react'
import { LayoutDashboard, FileText, PlusCircle, BarChart3, HelpCircle } from 'lucide-react'
import { useNavigation } from '../../context/NavigationContext'
import { useAuth } from '../../context/AuthContext'

export function Navbar() {
  const { activePage, navigateTo } = useNavigation()
  const { currentUser } = useAuth()

  const navItems = [
    {
      id: 'beranda',
      label: 'Beranda',
      icon: LayoutDashboard,
      roles: ['tim_kerja', 'admin_tu', 'ppk', 'bendahara', 'ppspm'],
    },
    {
      id: 'daftar_spj',
      label: 'Daftar & Lacak SPJ',
      icon: FileText,
      roles: ['tim_kerja', 'admin_tu', 'ppk', 'bendahara', 'ppspm'],
    },
    {
      id: 'buat_spj',
      label: 'Ajukan SPJ Baru',
      icon: PlusCircle,
      roles: ['tim_kerja', 'admin_tu'],
    },
    {
      id: 'laporan',
      label: 'Laporan & Rekap Excel',
      icon: BarChart3,
      roles: ['tim_kerja', 'admin_tu', 'ppk', 'bendahara', 'ppspm'],
    },
    {
      id: 'panduan_alur',
      label: 'Panduan Alur',
      icon: HelpCircle,
      roles: ['tim_kerja', 'admin_tu', 'ppk', 'bendahara', 'ppspm'],
    },
  ]

  return (
    <nav className="bg-slate-50/80 border-b border-slate-200/80 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Main Navigation Segment */}
          <div className="flex space-x-1 sm:space-x-2">
            {navItems
              .filter((item) => !item.roles || item.roles.includes(currentUser?.role))
              .map((item) => {
                const Icon = item.icon
                const isActive = activePage === item.id || (item.id === 'beranda' && activePage === 'dashboard')
                return (
                  <button
                    key={item.id}
                    onClick={() => navigateTo(item.id)}
                    className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </button>
                )
              })}
          </div>

          {/* Slogan singkat ramah BPS */}
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-medium text-slate-600">
              Pelacakan Dokumen Fisik Terpadu
            </span>
          </div>

        </div>
      </div>
    </nav>
  )
}

export default Navbar
