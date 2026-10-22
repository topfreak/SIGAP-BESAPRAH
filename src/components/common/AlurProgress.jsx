import React from 'react'
import { Check, MapPin, Clock, ArrowRight } from 'lucide-react'

export const MEJA_VERIFIKASI = [
  { key: 'tim_kerja', no: 1, nama: 'Tim Kerja', peran: 'Pembuat SPJ' },
  { key: 'admin_tu', no: 2, nama: 'Tata Usaha', peran: 'Cek Kelengkapan' },
  { key: 'ppk', no: 3, nama: 'PPK', peran: 'Uji Anggaran' },
  { key: 'bendahara', no: 4, nama: 'Bendahara', peran: 'Cek Pajak & Kuitansi' },
  { key: 'ppspm', no: 5, nama: 'PPSPM', peran: 'Penerbitan SPM' },
  { key: 'selesai', no: 6, nama: 'Selesai', peran: 'SP2D Diterbitkan' },
]

export function AlurProgress({ currentPosition, compact = false }) {
  const currentIndex = MEJA_VERIFIKASI.findIndex((m) => m.key === currentPosition)
  const currentStep = MEJA_VERIFIKASI[currentIndex] || MEJA_VERIFIKASI[0]

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50/80 border border-blue-200/80 text-blue-900 text-xs font-medium">
        <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 animate-bounce" />
        <span>Posisi Fisik: <strong>Meja {currentStep.nama}</strong></span>
        <span className="text-blue-500 font-normal">({currentStep.no}/6)</span>
      </div>
    )
  }

  return (
    <div className="w-full py-4">
      {/* Current Position Banner for non-tech users */}
      <div className="mb-4 p-3 bg-blue-50/90 border border-blue-200 rounded-xl flex items-center justify-between text-xs sm:text-sm text-blue-900">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
            {currentStep.no}
          </div>
          <span>
            Posisi fisik berkas saat ini berada di: <strong>Meja {currentStep.nama} ({currentStep.peran})</strong>
          </span>
        </div>
        <span className="text-xs text-blue-600 font-semibold hidden md:inline">
          Tahap {currentStep.no} dari 6
        </span>
      </div>

      {/* Modern Minimalist Step Road */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {MEJA_VERIFIKASI.map((meja, idx) => {
          const isPassed = idx < currentIndex
          const isCurrent = idx === currentIndex
          const isFuture = idx > currentIndex

          return (
            <div
              key={meja.key}
              className={`p-3 rounded-xl border transition-all text-center relative ${
                isCurrent
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md ring-4 ring-blue-100 scale-102 z-10'
                  : isPassed
                  ? 'bg-slate-50 border-slate-200 text-slate-700'
                  : 'bg-white border-slate-100 text-slate-400'
              }`}
            >
              {/* Step indicator circle */}
              <div className="flex items-center justify-center mb-1.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCurrent
                      ? 'bg-white text-blue-700'
                      : isPassed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isPassed ? <Check className="w-3.5 h-3.5" /> : meja.no}
                </div>
              </div>

              <div className={`font-bold text-xs sm:text-sm ${isCurrent ? 'text-white' : isPassed ? 'text-slate-800' : 'text-slate-400'}`}>
                {meja.nama}
              </div>

              <div className={`text-[11px] mt-0.5 truncate ${isCurrent ? 'text-blue-100' : 'text-slate-400'}`}>
                {meja.peran}
              </div>

              {isCurrent && (
                <div className="mt-2 text-[10px] font-bold uppercase tracking-wider bg-white/20 py-0.5 rounded-full text-white">
                  📍 Posisi Berkas
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AlurProgress
