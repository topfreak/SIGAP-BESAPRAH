import React from 'react'
import { 
  BarChart3, 
  Download, 
  Printer, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowUpRight, 
  Layers, 
  Building2,
  Calendar,
  FileSpreadsheet,
  ChevronRight,
  Users
} from 'lucide-react'
import { useSpj } from '../../context/SpjContext'
import { useNavigation } from '../../context/NavigationContext'
import { TIM_KERJA_BPS, getTimKerjaById } from '../../data/bpsStructure'
import { TrafficLightBadge } from '../common/TrafficLightBadge'
import * as XLSX from 'xlsx'

export function LaporanPage() {
  const { spjList, masterAkunList } = useSpj()
  const { navigateTo } = useNavigation()

  // 1. Hitung Agregasi Anggaran Realisasi
  const totalAnggaranUsulan = spjList.reduce((acc, curr) => acc + (Number(curr.nominal_pengajuan) || 0), 0)
  
  const totalCairHijau = spjList
    .filter((s) => s.status_kelengkapan === 'hijau')
    .reduce((acc, curr) => acc + (Number(curr.nominal_pengajuan) || 0), 0)

  const totalProsesKuning = spjList
    .filter((s) => s.status_kelengkapan === 'kuning')
    .reduce((acc, curr) => acc + (Number(curr.nominal_pengajuan) || 0), 0)

  const totalRevisiMerah = spjList
    .filter((s) => s.status_kelengkapan === 'merah')
    .reduce((acc, curr) => acc + (Number(curr.nominal_pengajuan) || 0), 0)

  const persentaseCair = totalAnggaranUsulan > 0 
    ? Math.round((totalCairHijau / totalAnggaranUsulan) * 100) 
    : 0

  // 2. Agregasi per MAK
  const rekapPerMak = masterAkunList.map((mak) => {
    const berkasMak = spjList.filter((s) => s.kode_akun === mak.kode_akun || s.master_akun_id === mak.id)
    const totalNominal = berkasMak.reduce((acc, curr) => acc + (Number(curr.nominal_pengajuan) || 0), 0)
    const selesaiCount = berkasMak.filter((s) => s.status_kelengkapan === 'hijau').length
    const prosesCount = berkasMak.filter((s) => s.status_kelengkapan === 'kuning').length
    const revisiCount = berkasMak.filter((s) => s.status_kelengkapan === 'merah').length

    return {
      mak,
      jumlahBerkas: berkasMak.length,
      totalNominal,
      selesaiCount,
      prosesCount,
      revisiCount,
    }
  })

  // 2b. Agregasi per Asal Tim Kerja / Fungsi Teknis BPS
  const rekapPerTimKerja = TIM_KERJA_BPS.map((tim) => {
    const berkasTim = spjList.filter((s) => s.tim_kerja === tim.id)
    const totalNominal = berkasTim.reduce((acc, curr) => acc + (Number(curr.nominal_pengajuan) || 0), 0)
    const selesaiCount = berkasTim.filter((s) => s.status_kelengkapan === 'hijau').length
    const prosesCount = berkasTim.filter((s) => s.status_kelengkapan === 'kuning').length
    const revisiCount = berkasTim.filter((s) => s.status_kelengkapan === 'merah').length

    return {
      tim,
      jumlahBerkas: berkasTim.length,
      totalNominal,
      selesaiCount,
      prosesCount,
      revisiCount,
    }
  })

  // 3. Agregasi Meja Berkas Fisik
  const mejaFisik = [
    { key: 'tim_kerja', label: '1. Tim Kerja (Pengusul / Revisi)', icon: '👤' },
    { key: 'admin_tu', label: '2. Tata Usaha (Pemeriksaan Awal)', icon: '🏢' },
    { key: 'ppk', label: '3. PPK (Komitmen Anggaran)', icon: '⚖️' },
    { key: 'bendahara', label: '4. Bendahara Pengeluaran (Pajak & Kas)', icon: '💰' },
    { key: 'ppspm', label: '5. PPSPM (Penerbitan SPM)', icon: '📜' },
    { key: 'selesai', label: '6. Selesai (SP2D Terbit / Arsip)', icon: '🟢' },
  ]

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val)
  }

  const formatTanggal = (dateStr) => {
    try {
      const d = dateStr ? new Date(dateStr) : new Date()
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(d)
    } catch (e) {
      return dateStr
    }
  }

  // 4. Fungsi Ekspor ke Format Resmi Microsoft Excel (.XLSX) Multi-Sheet
  const handleExportExcel = () => {
    const namaMeja = {
      tim_kerja: 'Tim Kerja (Pengusul)',
      admin_tu: 'Meja Tata Usaha',
      ppk: 'Meja PPK',
      bendahara: 'Meja Bendahara',
      ppspm: 'Meja PPSPM',
      selesai: 'Selesai (Arsip Kas Negara)',
    }

    // 1. Data Sheet 1: Rekap Seluruh Berkas SPJ
    const dataSpj = spjList.map((s, idx) => ({
      'No': idx + 1,
      'ID Berkas': s.id,
      'Nama Kegiatan BPS': s.nama_kegiatan,
      'Asal Tim Kerja / Fungsi': getTimKerjaById(s.tim_kerja).nama,
      'Penanggung Jawab (PJ)': s.nama_pj || s.pemohon,
      'Kode MAK': s.kode_akun,
      'Uraian Akun': s.nama_akun,
      'Metode Pencairan': s.metode_bayar || 'LS',
      'Pengusul Dokumen': s.pemohon,
      'Nominal Pengajuan (Rp)': Number(s.nominal_pengajuan) || 0,
      'Posisi Berkas Fisik': namaMeja[s.posisi_berkas] || s.posisi_berkas,
      'Status Kelengkapan': s.status_kelengkapan === 'hijau' ? 'Selesai (SP2D Terbit)' : s.status_kelengkapan === 'kuning' ? 'Sedang Diverifikasi' : 'Perlu Perbaikan Fisik',
      'Nomor SP2D': s.nomor_sp2d || '-',
      'Tanggal SP2D': s.tanggal_sp2d || '-',
      'Tanggal Pengajuan': formatTanggal(s.created_at),
    }))

    // 2. Data Sheet 2: Realisasi per MAK
    const dataMak = rekapPerMak.map((item, idx) => ({
      'No': idx + 1,
      'Kode MAK': item.mak.kode_akun,
      'Nama Akun': item.mak.nama_akun,
      'Singkatan': item.mak.singkatan || '-',
      'Kategori': item.mak.kategori_id,
      'Total Anggaran (Rp)': item.totalNominal,
      'Jumlah Pengajuan': item.jumlahBerkas,
      'Selesai (Hijau)': item.selesaiCount,
      'Dalam Proses (Kuning)': item.prosesCount,
      'Perlu Revisi (Merah)': item.revisiCount,
    }))

    // 3. Data Sheet 3: Realisasi per Tim Kerja / Fungsi Teknis BPS
    const dataTim = rekapPerTimKerja.map((item, idx) => ({
      'No': idx + 1,
      'Kode Tim': item.tim.kode,
      'Nama Fungsi BPS': item.tim.nama,
      'Total Anggaran (Rp)': item.totalNominal,
      'Jumlah Pengajuan': item.jumlahBerkas,
      'Selesai (Hijau)': item.selesaiCount,
      'Dalam Proses (Kuning)': item.prosesCount,
      'Perlu Revisi (Merah)': item.revisiCount,
    }))

    // Buat Workbook Baru
    const wb = XLSX.utils.book_new()
    
    const wsSpj = XLSX.utils.json_to_sheet(dataSpj)
    const wsMak = XLSX.utils.json_to_sheet(dataMak)
    const wsTim = XLSX.utils.json_to_sheet(dataTim)

    // Atur Lebar Kolom Lembar 1 agar Terbaca Rapi di Excel
    wsSpj['!cols'] = [
      { wch: 5 },  // No
      { wch: 16 }, // ID Berkas
      { wch: 45 }, // Nama Kegiatan BPS
      { wch: 25 }, // Tim Kerja
      { wch: 25 }, // PJ
      { wch: 12 }, // Kode MAK
      { wch: 32 }, // Uraian Akun
      { wch: 15 }, // Metode
      { wch: 25 }, // Pengusul
      { wch: 20 }, // Nominal
      { wch: 26 }, // Posisi Meja
      { wch: 24 }, // Status
      { wch: 22 }, // No SP2D
      { wch: 15 }, // Tgl SP2D
      { wch: 18 }, // Tgl Pengajuan
    ]

    wsMak['!cols'] = [
      { wch: 5 },
      { wch: 12 },
      { wch: 35 },
      { wch: 25 },
      { wch: 18 },
      { wch: 22 },
      { wch: 18 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
    ]

    wsTim['!cols'] = [
      { wch: 5 },
      { wch: 12 },
      { wch: 30 },
      { wch: 22 },
      { wch: 18 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
    ]

    XLSX.utils.book_append_sheet(wb, wsSpj, 'Rekap_Pengajuan_SPJ')
    XLSX.utils.book_append_sheet(wb, wsMak, 'Realisasi_per_MAK')
    XLSX.utils.book_append_sheet(wb, wsTim, 'Realisasi_per_Tim_Kerja')

    // Tulis dan unduh file .xlsx asli
    const filename = `Rekapitulasi_SPJ_BPS_SIGAP_BESAPRAH_${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(wb, filename)
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* 1. Header Halaman Laporan Eksekutif */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
            <span>Rekapitulasi Anggaran & Akuntabilitas SPJ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Laporan Realisasi & Pelacakan Berkas
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Ringkasan eksekutif realisasi belanja survei/sensus, status fisik berkas, serta penyebaran dokumen di tiap meja verifikasi BPS.
          </p>
        </div>

        {/* Tombol Ekspor Excel & Cetak */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            title="Unduh seluruh data pengajuan dalam format Microsoft Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Unduh Rekap Excel (.XLSX)</span>
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Ringkasan</span>
          </button>
        </div>
      </div>

      {/* 2. Kartu Ringkasan Realisasi Keuangan (Executive KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Usulan Anggaran */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Usulan SPJ
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900">
            {formatRupiah(totalAnggaranUsulan)}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Dari <strong>{spjList.length} berkas</strong> kegiatan BPS
          </p>
        </div>

        {/* SP2D Terbit (Selesai - Hijau) */}
        <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-800">
            <span>🟢 Selesai (SP2D Cair)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-emerald-700">
            {formatRupiah(totalCairHijau)}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-emerald-800">
            <span>Realisasi SP2D:</span>
            <span className="font-bold font-mono">{persentaseCair}% Tuntas</span>
          </div>
        </div>

        {/* Sedang Verifikasi (Kuning) */}
        <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-800">
            <span>🟡 Sedang Diproses</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-amber-700">
            {formatRupiah(totalProsesKuning)}
          </div>
          <p className="mt-2 text-xs text-amber-800/80">
            Sedang diteliti di meja verifikasi
          </p>
        </div>

        {/* Perlu Perbaikan (Merah) */}
        <div className="bg-white rounded-2xl p-6 border border-rose-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-rose-800">
            <span>🔴 Perlu Perbaikan</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-rose-700">
            {formatRupiah(totalRevisiMerah)}
          </div>
          <p className="mt-2 text-xs text-rose-700/80">
            Tertahan menunggu fisik dilengkapi
          </p>
        </div>

      </div>

      {/* 3. Distribusi Berkas per Meja Fisik & Rekap MAK */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Kolom Kiri: Beban Kerja di Meja Fisik */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Sebaran Berkas di Meja Fisik
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Posisi fisik dokumen saat ini di lingkungan kantor BPS.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
              {spjList.length} Total Berkas
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {mejaFisik.map((m) => {
              const count = spjList.filter((s) => s.posisi_berkas === m.key).length
              const pct = spjList.length > 0 ? Math.round((count / spjList.length) * 100) : 0

              return (
                <div key={m.key} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 flex items-center gap-2">
                      <span>{m.icon}</span>
                      <span>{m.label}</span>
                    </span>
                    <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {count} Berkas ({pct}%)
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        m.key === 'selesai'
                          ? 'bg-emerald-500'
                          : m.key === 'tim_kerja'
                          ? 'bg-rose-500'
                          : 'bg-blue-600'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Kolom Kanan: Rekapitulasi per Kode Akun Belanja (MAK) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Realisasi Berdasarkan Kode Akun (MAK)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Rincian anggaran kegiatan berdasarkan 12 MAK standar BPS.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
              {rekapPerMak.length} MAK
            </span>
          </div>

          <div className="space-y-3 pt-2 max-h-[500px] overflow-y-auto pr-1">
            {rekapPerMak.map(({ mak, jumlahBerkas, totalNominal, selesaiCount, prosesCount, revisiCount }) => (
              <div key={mak.id} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2.5 hover:border-blue-200 transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                        MAK {mak.kode_akun}
                      </span>
                      {mak.singkatan && (
                        <span className="text-[11px] font-semibold text-slate-500">
                          ({mak.singkatan})
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 mt-1">
                      {mak.nama_akun}
                    </h4>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-black text-slate-900">
                      {formatRupiah(totalNominal)}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {jumlahBerkas} Pengajuan
                    </div>
                  </div>
                </div>

                {/* Badge Status Lampu Lalu Lintas Mini */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-100 text-[11px]">
                  <span className="text-slate-400">Status:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                    🟢 {selesaiCount} Selesai
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-semibold border border-amber-200">
                    🟡 {prosesCount} Proses
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 font-semibold border border-rose-200">
                    🔴 {revisiCount} Revisi
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3b. Sebaran Realisasi SPJ Berdasarkan Asal Tim Kerja / Fungsi Teknis BPS */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
                <Users className="w-5 h-5" />
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Realisasi Berkas per Asal Tim Kerja / Fungsi Teknis BPS
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Distribusi pengajuan pertanggungjawaban dari 6 fungsi BPS (Sosial, Produksi, Distribusi, IPDS, Nerwilis, dan Bagian Umum / TU).
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            6 Fungsi BPS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {rekapPerTimKerja.map(({ tim, jumlahBerkas, totalNominal, selesaiCount, prosesCount, revisiCount }) => (
            <div 
              key={tim.id} 
              className="p-4 rounded-2xl border border-slate-200/90 bg-gradient-to-b from-slate-50/50 to-white hover:border-blue-300 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold border ${tim.badgeColor}`}>
                    {tim.nama}
                  </span>
                  <span className="font-mono text-[11px] font-semibold text-slate-400">
                    {tim.kode}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {tim.kegiatanContoh}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">{jumlahBerkas} Pengajuan</span>
                  <span className="text-sm font-black text-slate-900">{formatRupiah(totalNominal)}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[10px]">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                    🟢 {selesaiCount}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 font-semibold border border-amber-200">
                    🟡 {prosesCount}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-800 font-semibold border border-rose-200">
                    🔴 {revisiCount}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Tabel Daftar Lengkap Rekapitulasi Berkas */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Rincian Seluruh Berkas Pengajuan SPJ
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Data tabel di bawah ini terhubung langsung ke tombol ekspor CSV / Excel di atas.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-4">No / ID</th>
                <th className="p-4">Nama Kegiatan & MAK</th>
                <th className="p-4">Asal Tim & PJ</th>
                <th className="p-4 text-center">Pencairan</th>
                <th className="p-4 text-right">Nominal SPJ</th>
                <th className="p-4 text-center">Status Kelengkapan</th>
                <th className="p-4">Nomor SP2D</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {spjList.map((item, idx) => {
                const timInfo = getTimKerjaById(item.tim_kerja)
                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-500">
                      {idx + 1}. {item.id}
                    </td>
                    <td className="p-4 max-w-xs">
                      <div className="font-bold text-slate-900 line-clamp-1">{item.nama_kegiatan}</div>
                      <div className="text-[11px] font-mono text-blue-700 mt-0.5">MAK {item.kode_akun}</div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border ${timInfo.badgeColor}`}>
                          {timInfo.nama}
                        </span>
                        <div className="text-[11px] text-slate-600">
                          PJ: <span className="font-semibold text-slate-900">{item.nama_pj || item.pemohon}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${
                        item.metode_bayar === 'GUP'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                      }`}>
                        {item.metode_bayar === 'GUP' ? 'GUP' : 'LS'}
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold text-slate-900">
                      {formatRupiah(item.nominal_pengajuan)}
                    </td>
                    <td className="p-4 text-center">
                      <TrafficLightBadge status={item.status_kelengkapan} size="sm" />
                    </td>
                    <td className="p-4 font-mono text-emerald-800 font-medium">
                      {item.nomor_sp2d || '—'}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => navigateTo('detail_spj', { selectedSpjId: item.id })}
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 cursor-pointer transition-colors"
                        title="Lihat Detail Berkas"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  )
}

export default LaporanPage
