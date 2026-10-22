import React from 'react'
import { 
  FileText, 
  PlusCircle, 
  BarChart3, 
  HelpCircle, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Send, 
  ShieldCheck,
  Check,
  Search,
  ExternalLink,
  ChevronRight
} from 'lucide-react'
import { useNavigation } from '../../context/NavigationContext'
import { useAuth } from '../../context/AuthContext'
import { useSpj } from '../../context/SpjContext'
import { getTimKerjaById } from '../../data/bpsStructure'
import { TrafficLightBadge } from '../common/TrafficLightBadge'

export function BerandaPage() {
  const { navigateTo } = useNavigation()
  const { currentUser } = useAuth()
  const { spjList } = useSpj()

  // Berkas yang sedang menunggu di meja pengguna saat ini
  const berkasDiMejaSaya = currentUser
    ? spjList.filter((s) => s.posisi_berkas === currentUser.role)
    : []

  // Statistik Cepat
  const totalSpj = spjList.length
  const totalSelesai = spjList.filter((s) => s.status_kelengkapan === 'hijau').length
  const totalProses = spjList.filter((s) => s.status_kelengkapan === 'kuning').length
  const totalRevisi = spjList.filter((s) => s.status_kelengkapan === 'merah').length

  const roleLabels = {
    tim_kerja: 'Tim Kerja (Pengusul SPJ)',
    admin_tu: 'Tata Usaha (Admin TU)',
    ppk: 'Pejabat Pembuat Komitmen (PPK)',
    bendahara: 'Bendahara Pengeluaran',
    ppspm: 'PPSPM',
  }

  const formatRupiah = (nominal) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(nominal)
  }

  // 5 Tahapan Alur Fisik Meja BPS
  const alurMejaSteps = [
    {
      nomor: '1',
      meja: 'Tim Kerja',
      peran: 'Pengusulan Berkas',
      deskripsi: 'Menyiapkan dokumen fisik, input SPJ & cetak lembar kendali A4.',
      warna: 'blue',
    },
    {
      nomor: '2',
      meja: 'Tata Usaha',
      peran: 'Loket & Checklist',
      deskripsi: 'Pemeriksaan fisik awal & kelengkapan administrasi.',
      warna: 'sky',
    },
    {
      nomor: '3',
      meja: 'PPK',
      peran: 'Komitmen Anggaran',
      deskripsi: 'Penelitian kepatuhan norma, DIPA & penandatanganan.',
      warna: 'indigo',
    },
    {
      nomor: '4',
      meja: 'Bendahara',
      peran: 'Verifikasi & Pajak',
      deskripsi: 'Pemeriksaan kuitansi, faktur, SSP pajak, & buku kas.',
      warna: 'amber',
    },
    {
      nomor: '5',
      meja: 'PPSPM & KPPN',
      peran: 'Penerbitan SP2D',
      deskripsi: 'Penerbitan SPM hingga dana cair via SP2D Kas Negara.',
      warna: 'emerald',
    },
  ]

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-12">
      
      {/* 1. SECTION: HERO / WELCOME BANNER (Sangat Bersih & Menenangkan) */}
      <section className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-2xs relative overflow-hidden">
        {/* Latar Belakang Gradien Halus */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-50/80 via-sky-50/40 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200/70">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>Portal Layanan SPJ Badan Pusat Statistik</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Selamat Datang, <br className="hidden sm:inline" />
              <span className="text-blue-700">{currentUser?.nama_lengkap || 'Pegawai BPS'}</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Anda masuk sebagai <strong>{roleLabels[currentUser?.role] || currentUser?.role}</strong>
              {currentUser?.tim_kerja && (
                <span> • {getTimKerjaById(currentUser.tim_kerja).nama}</span>
              )}. 
              Sistem ini memfasilitasi pelacakan pergerakan berkas fisik SPJ melalui 5 meja kerja secara transparan dan akuntabel.
            </p>
          </div>

          {/* Ringkasan Cepat Angka SPJ */}
          <div className="flex items-center gap-3 self-start md:self-center bg-slate-50/90 p-4 rounded-2xl border border-slate-200/80">
            <div className="text-center px-3 border-r border-slate-200">
              <div className="text-2xl font-black text-slate-900">{totalSpj}</div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total SPJ</div>
            </div>
            <div className="text-center px-3 border-r border-slate-200">
              <div className="text-2xl font-black text-emerald-600">{totalSelesai}</div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Cair</div>
            </div>
            <div className="text-center px-3">
              <div className="text-2xl font-black text-amber-600">{totalProses}</div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Diproses</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION: BERKAS PERLU TINDAKAN DI MEJA ANDA (Hanya Muncul Jika Ada Tugas) */}
      {berkasDiMejaSaya.length > 0 && (
        <section className="bg-gradient-to-r from-amber-50 to-orange-50/50 rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-amber-950">
                  Perhatian: Ada {berkasDiMejaSaya.length} Berkas Fisik Menunggu di Meja Anda!
                </h3>
                <p className="text-xs text-amber-800">
                  Berkas fisik berada di meja kerja Anda ({roleLabels[currentUser?.role]}) untuk diteliti dan diverifikasi.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigateTo('daftar_spj', { filterMeja: currentUser?.role })}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm self-start sm:self-auto"
            >
              <span>Periksa Berkas Meja Ini</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Cuplikan Berkas Menunggu */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {berkasDiMejaSaya.slice(0, 2).map((item) => (
              <div 
                key={item.id}
                onClick={() => navigateTo('detail_spj', { selectedSpjId: item.id })}
                className="p-4 bg-white rounded-2xl border border-amber-200/80 hover:border-amber-400 cursor-pointer transition-all shadow-2xs space-y-2 group"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    MAK {item.kode_akun}
                  </span>
                  <TrafficLightBadge status={item.status_kelengkapan} size="sm" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                  {item.nama_kegiatan}
                </h4>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                  <span>Nominal: <strong>{formatRupiah(item.nominal_pengajuan)}</strong></span>
                  <span className="text-blue-600 font-semibold group-hover:underline flex items-center gap-1">
                    Buka Detail <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. SECTION: MENU UTAMA SISTEM (KARTU NAVIGASI BERSIH, LEGA, & FOKUS) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Menu Layanan Utama
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Pilih tindakan yang ingin Anda lakukan sesuai kebutuhan pekerjaan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* MENU 1: DAFTAR & PELACAKAN BERKAS */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between space-y-5 group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xs">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                Lacak & Daftar Berkas
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pantau posisi fisik seluruh berkas SPJ, verifikasi checklist meja, dan periksa status lampu lalu lintas dokumen.
              </p>
            </div>

            <button
              onClick={() => navigateTo('daftar_spj')}
              className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900 group-hover:bg-blue-600 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <span>Buka Pelacakan</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* MENU 2: AJUKAN SPJ BARU */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between space-y-5 group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-all shadow-xs">
                <PlusCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                Ajukan SPJ Baru
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Catat pengajuan kegiatan survei/sensus baru, pilih 12 MAK standar BPS, metode bayar (LS/GUP), lalu cetak lembar kendali fisik.
              </p>
            </div>

            <button
              onClick={() => navigateTo('buat_spj')}
              className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <span>Isi Pengajuan</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* MENU 3: LAPORAN & UNDUH EXCEL */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-400 transition-all flex flex-col justify-between space-y-5 group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-xs">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Laporan & Rekap Excel
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Lihat ringkasan eksekutif realisasi belanja per MAK dan fungsi, serta unduh rekap resmi dalam format Microsoft Excel (.xlsx).
              </p>
            </div>

            <button
              onClick={() => navigateTo('laporan')}
              className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900 group-hover:bg-emerald-600 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <span>Buka Laporan</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* MENU 4: PANDUAN ALUR BESAPRAH */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-400 transition-all flex flex-col justify-between space-y-5 group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xs">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                Buku Panduan Besaprah
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pelajari SOP alur fisik 5 meja BPS, batasan hak akses tiap peran, dan ketentuan kelengkapan perpajakan resmi.
              </p>
            </div>

            <button
              onClick={() => navigateTo('panduan_alur')}
              className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900 group-hover:bg-indigo-600 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <span>Pelajari Alur</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </section>

      {/* 4. SECTION: ALUR KERJA 5 MEJA FISIK BPS (JELAS, TERPISAH, & INFORMATIF) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 mb-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>Standard Operating Procedure (SOP) BPS</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Alur Perjalanan Berkas Fisik SPJ (5 Meja Kerja)
            </h2>
          </div>
          <button
            onClick={() => navigateTo('panduan_alur')}
            className="text-xs text-blue-600 font-bold hover:underline self-start sm:self-auto flex items-center gap-1 cursor-pointer"
          >
            <span>Lihat Panduan Lengkap</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Timeline Visual Alur 5 Meja */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {alurMejaSteps.map((step, idx) => (
            <div 
              key={step.nomor}
              className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-2 flex flex-col justify-between relative group hover:bg-blue-50/50 hover:border-blue-200 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center">
                    {step.nomor}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Meja {idx + 1}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  {step.meja}
                </h4>
                <div className="text-[11px] font-semibold text-blue-700">
                  {step.peran}
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {step.deskripsi}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 text-[10px] text-slate-400">
                {idx < 4 ? 'Teruskan ➔ Meja Berikutnya' : '🏁 Selesai (SP2D Kas Negara)'}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}

export default BerandaPage
