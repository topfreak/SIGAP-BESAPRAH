import React from 'react'
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react'

export function AccessRestricted({ currentUser, onNavigate }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 max-w-lg w-full text-center space-y-4">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 border border-rose-200 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">
            Hak Akses Dibatasi
          </span>
          <h2 className="text-xl font-bold text-gray-900 mt-2">
            Akses Halaman Dibatasi
          </h2>
          <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
            Halaman ini hanya dapat diakses oleh akun dengan wewenang khusus (Superadmin / Pejabat yang Berwenang).
            Role Anda saat ini adalah <span className="font-bold text-gray-800 uppercase">{currentUser?.role || 'Umum'}</span>.
          </p>
        </div>

        <div className="p-3 bg-gray-50 rounded-xl text-left text-xs space-y-1.5 border border-gray-100">
          <div className="flex justify-between">
            <span className="text-gray-400">Pegawai:</span>
            <span className="font-semibold text-gray-800">{currentUser?.nama_lengkap || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Jabatan:</span>
            <span className="font-medium text-indigo-700">{currentUser?.jabatan || '-'}</span>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('dashboard')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dasbor Utama</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AccessRestricted
