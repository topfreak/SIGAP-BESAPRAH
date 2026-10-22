import React from 'react'
import { Clock, CheckCircle2, AlertCircle, User, ArrowRight, FileText } from 'lucide-react'

export function AuditTrailTimeline({ riwayat = [] }) {
  if (!riwayat || riwayat.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
        <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-sm font-semibold text-slate-700">Belum ada riwayat aktivitas tercatat.</p>
        <p className="text-xs text-slate-400 mt-0.5">
          Setiap pergerakan fisik dokumen akan otomatis dicatat di sini.
        </p>
      </div>
    )
  }

  const formatTanggalWaktu = (isoString) => {
    try {
      const date = new Date(isoString)
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      }).format(date)
    } catch (e) {
      return isoString
    }
  }

  const statusIcons = {
    merah: {
      icon: AlertCircle,
      dotBg: 'bg-rose-500',
      borderRing: 'ring-rose-100',
      badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
    },
    kuning: {
      icon: Clock,
      dotBg: 'bg-amber-500',
      borderRing: 'ring-amber-100',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    hijau: {
      icon: CheckCircle2,
      dotBg: 'bg-emerald-500',
      borderRing: 'ring-emerald-100',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
  }

  // Tampilkan riwayat urut dari yang paling baru di atas (chronological reverse)
  const sortedRiwayat = [...riwayat].reverse()

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Jejak Digital & Tanggung Jawab Fisik Berkas ({riwayat.length} Catatan)
        </div>
        <span className="text-[11px] text-blue-700 font-semibold bg-blue-50 px-2.5 py-0.5 rounded-md">
          Akuntabilitas BPS Terjamin
        </span>
      </div>

      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {sortedRiwayat.map((entry, idx) => {
          const config = statusIcons[entry.status] || statusIcons.kuning
          const IconComponent = config.icon

          return (
            <div key={entry.id || idx} className="relative group">
              
              {/* Dot Icon Timeline */}
              <div
                className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-white ring-4 ${
                  config.dotBg
                } ${config.borderRing} shadow-xs`}
              >
                <IconComponent className="w-3.5 h-3.5" />
              </div>

              {/* Card Konten Log Riwayat */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all space-y-2.5">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                    <span>{entry.aksi}</span>
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    {formatTanggalWaktu(entry.waktu)}
                  </div>
                </div>

                {/* Profil Petugas Pemroses */}
                <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 w-fit">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>Diproses oleh: <strong className="text-slate-800">{entry.petugas}</strong> ({entry.jabatan})</span>
                </div>

                {/* Catatan / Alasan jika ada */}
                {entry.catatan && (
                  <div className="text-xs text-slate-600 bg-blue-50/40 p-3 rounded-xl border border-blue-100/60 leading-relaxed italic">
                    "{entry.catatan}"
                  </div>
                )}

              </div>

            </div>
          )
        })}
      </div>

    </div>
  )
}

export default AuditTrailTimeline
