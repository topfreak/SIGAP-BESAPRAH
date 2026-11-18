import React, { useState, useEffect, useMemo } from 'react'
import {
  Calendar,
  CalendarDays,
  FileSpreadsheet,
  FileText,
  MapPin,
  Clock,
  CheckCircle2,
  Download,
  Filter,
  Search,
  UserCheck,
  Building2,
  DollarSign,
  AlertCircle,
  ShieldCheck,
  Layers
} from 'lucide-react'
import * as XLSX from 'xlsx'
import { DateRangeMonthFilter } from '../common/DateRangeMonthFilter'

// Data Supervisi & Perjalanan Dinas Pegawai BPS Sambas TA 2026
const JADWAL_PERJADIN_SAMBAS = [
  {
    id: 'prd-01',
    nama_pegawai: 'Andi Noviantoni, S.P.',
    jabatan: 'PPK BPS Kabupaten Sambas',
    tujuan: 'Kecamatan Paloh & Sajingan Besar',
    kecamatans: ['Paloh', 'Sajingan Besar'],
    kegiatan: 'Supervisi Lapangan Pendataan Susenas & SUTAS Perbatasan',
    tanggal_mulai: '2026-02-18',
    tanggal_selesai: '2026-02-20',
    durasi: '3 Hari',
    status: 'Terjadwal',
    spd_no: 'SPD/6101/001/2026',
    uang_harian: 1290000,
    transport: 850000,
    penginapan: 600000,
    total_biaya: 2740000,
    mak: '524111 (Perjadin Biasa)',
  },
  {
    id: 'prd-02',
    nama_pegawai: 'Nuri Hayana, S.Si.',
    jabatan: 'Admin TU & Verifikator 12 MAK',
    tujuan: 'Kecamatan Tebas & Semparuk',
    kecamatans: ['Tebas', 'Semparuk'],
    kegiatan: 'Monitoring Kelengkapan Kuitansi & Berkas Fisik SLS Lapangan',
    tanggal_mulai: '2026-02-12',
    tanggal_selesai: '2026-02-13',
    durasi: '2 Hari',
    status: 'Selesai (SPJ Diuji)',
    spd_no: 'SPD/6101/002/2026',
    uang_harian: 860000,
    transport: 400000,
    penginapan: 0,
    total_biaya: 1260000,
    mak: '524113 (Perjadin Dalam Kota)',
  },
  {
    id: 'prd-03',
    nama_pegawai: 'Fauzan Azim, SST',
    jabatan: 'Ketua Tim Nerwilis',
    tujuan: 'Kecamatan Sambas & Subah',
    kecamatans: ['Sambas', 'Subah'],
    kegiatan: 'Pengumpulan Data Statistik PDRB & Potensi Ekonomi Daerah',
    tanggal_mulai: '2026-02-10',
    tanggal_selesai: '2026-02-11',
    durasi: '2 Hari',
    status: 'Selesai (SPJ Diuji)',
    spd_no: 'SPD/6101/003/2026',
    uang_harian: 860000,
    transport: 350000,
    penginapan: 0,
    total_biaya: 1210000,
    mak: '524113 (Perjadin Dalam Kota)',
  },
  {
    id: 'prd-04',
    nama_pegawai: 'Fitria Wulandari, S.Tr.Stat.',
    jabatan: 'Bendahara Pengeluaran (Wulan TU)',
    tujuan: 'KPPN Singkawang',
    kecamatans: ['Singkawang'],
    kegiatan: 'Rekonsiliasi LPJ Bendahara & Penerbitan SPM GUP ke KPPN',
    tanggal_mulai: '2026-02-16',
    tanggal_selesai: '2026-02-17',
    durasi: '2 Hari',
    status: 'Selesai (SPJ Diuji)',
    spd_no: 'SPD/6101/004/2026',
    uang_harian: 860000,
    transport: 500000,
    penginapan: 350000,
    total_biaya: 1710000,
    mak: '524111 (Perjadin Biasa)',
  },
  {
    id: 'prd-05',
    nama_pegawai: 'Nurhidayatul Fitri, S.Tr.Stat.',
    jabatan: 'PJ Susenas / Tim Sosial',
    tujuan: 'Kecamatan Jawai & Jawai Selatan',
    kecamatans: ['Jawai', 'Jawai Selatan'],
    kegiatan: 'Pengawasan Kualitas Pencacahan Rumah Tangga Susenas',
    tanggal_mulai: '2026-02-22',
    tanggal_selesai: '2026-02-24',
    durasi: '3 Hari',
    status: 'Terjadwal',
    spd_no: 'SPD/6101/005/2026',
    uang_harian: 1290000,
    transport: 600000,
    penginapan: 400000,
    total_biaya: 2290000,
    mak: '524111 (Perjadin Biasa)',
  },
  {
    id: 'prd-06',
    nama_pegawai: 'Diva Maharani Basuki, S.Tr.Stat.',
    jabatan: 'PJ Sakernas / Tim Sosial',
    tujuan: 'Kecamatan Teluk Keramat & Tangaran',
    kecamatans: ['Teluk Keramat', 'Tangaran'],
    kegiatan: 'Pemeriksaan Hasil Listing dan Cacah Sampel Sakernas',
    tanggal_mulai: '2026-02-25',
    tanggal_selesai: '2026-02-26',
    durasi: '2 Hari',
    status: 'Terjadwal',
    spd_no: 'SPD/6101/006/2026',
    uang_harian: 860000,
    transport: 450000,
    penginapan: 0,
    total_biaya: 1310000,
    mak: '524113 (Perjadin Dalam Kota)',
  },
  {
    id: 'prd-07',
    nama_pegawai: 'Muhammad Reynaldi, A.Md',
    jabatan: 'PJ Statistik Produksi',
    tujuan: 'Kecamatan Sejangkung & Galing',
    kecamatans: ['Sejangkung', 'Galing'],
    kegiatan: 'Ubinan Padi & Survei Komoditas Strategis Pertanian',
    tanggal_mulai: '2026-02-14',
    tanggal_selesai: '2026-02-15',
    durasi: '2 Hari',
    status: 'Selesai (SPJ Diuji)',
    spd_no: 'SPD/6101/007/2026',
    uang_harian: 860000,
    transport: 380000,
    penginapan: 0,
    total_biaya: 1240000,
    mak: '524113 (Perjadin Dalam Kota)',
  },
  {
    id: 'prd-08',
    nama_pegawai: 'Mega Lisantri, S.Tr.Stat.',
    jabatan: 'PJ Podes / Ketahanan Wilayah',
    tujuan: 'Kecamatan Selakau & Selakau Timur',
    kecamatans: ['Selakau', 'Selakau Timur'],
    kegiatan: 'Sosialisasi Koordinasi Updating Muatan SLS Podes 2026',
    tanggal_mulai: '2026-02-26',
    tanggal_selesai: '2026-02-27',
    durasi: '2 Hari',
    status: 'Terjadwal',
    spd_no: 'SPD/6101/008/2026',
    uang_harian: 860000,
    transport: 420000,
    penginapan: 0,
    total_biaya: 1280000,
    mak: '524113 (Perjadin Dalam Kota)',
  },
  {
    id: 'prd-09',
    nama_pegawai: 'Hamzah, S.E.',
    jabatan: 'PJ Statistik Distribusi',
    tujuan: 'Kecamatan Pemangkat & Salatiga',
    kecamatans: ['Pemangkat', 'Salatiga'],
    kegiatan: 'Pencacahan Rutin Survei Harga Konsumen Pasar Rakyat',
    tanggal_mulai: '2026-02-11',
    tanggal_selesai: '2026-02-12',
    durasi: '2 Hari',
    status: 'Selesai (SPJ Diuji)',
    spd_no: 'SPD/6101/009/2026',
    uang_harian: 860000,
    transport: 350000,
    penginapan: 0,
    total_biaya: 1210000,
    mak: '524113 (Perjadin Dalam Kota)',
  },
  {
    id: 'prd-10',
    nama_pegawai: 'Jumadi, A.Md.',
    jabatan: 'Pranata Komputer / IPDS',
    tujuan: 'Kecamatan Tekarang & Sebawi',
    kecamatans: ['Tekarang', 'Sebawi'],
    kegiatan: 'Pendampingan Teknis Aplikasi FASIH CAPI bagi Petugas Lapangan',
    tanggal_mulai: '2026-02-19',
    tanggal_selesai: '2026-02-20',
    durasi: '2 Hari',
    status: 'Terjadwal',
    spd_no: 'SPD/6101/010/2026',
    uang_harian: 860000,
    transport: 380000,
    penginapan: 0,
    total_biaya: 1240000,
    mak: '524113 (Perjadin Dalam Kota)',
  },
]

// 19 Kecamatan di Kabupaten Sambas
const KECAMATAN_SAMBAS = [
  'Sambas', 'Tebas', 'Jawai', 'Teluk Keramat', 'Sejangkung', 'Paloh',
  'Subah', 'Sajingan Besar', 'Selakau', 'Pemangkat', 'Semparuk', 'Galing',
  'Tekarang', 'Jawai Selatan', 'Sebawi', 'Sajad', 'Tangaran', 'Salatiga', 'Selakau Timur'
]

// Daftar Pegawai Organik BPS Sambas (Satker 6101 / DIPA 1301) - Data Resmi PAK Kepegawaian
const PEGAWAI_LIST = [
  'Solikhin, SST., M.Si',
  'Ade Wahyu Pratama Putri, SST',
  'Andi Noviantoni, S.P.',
  'Nuri Hayana, S.Si.',
  'Fitria Wulandari, S.Tr.Stat.',
  'Erika Anastasia Putri, A.Md.Ak',
  'Nurhidayatul Fitri, S.Tr.Stat.',
  'Diva Maharani Basuki, S.Tr.Stat.',
  'Muhammad Reynaldi, A.Md',
  'Talitha Nabila Saifana, S.Tr.Stat.',
  'Dhimas Yuzi Alfarizzi, S.Tr.Stat.',
  'Ria Hayatun Nur, S.Stat., M.Si',
  'Alifah Zalfa Azizah, S.Tr.Stat.',
  'Zahra Maharani, S.Tr.Stat',
  'Dermawati Rematos Siahaan, A.Md.T',
  'Samsuri Sp, S.E.',
  'Supardi, S.Mn.',
  'Adi Rakhmat Putranto, S.T',
  'Fauzan Azim, SST',
  'Firmansyah, S.Si',
  'Lasmi, A.Md.',
  'Suhaimi, S.Mn',
]

export function PerjadinPage({ mode = 'kalender_perjadin' }) {
  const normalizeMode = (m) => {
    if (m === 'matriks_perjadin' || m === 'matriks') return 'matriks'
    if (m === 'rekap_perjadin' || m === 'rekap' || m === 'rekap_biaya_perjadin') return 'rekap'
    return 'kalender'
  }

  const [activeTab, setActiveTab] = useState(normalizeMode(mode))
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('semua')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedKecamatan, setSelectedKecamatan] = useState('Semua')

  useEffect(() => {
    setActiveTab(normalizeMode(mode))
  }, [mode])

  const filtered = useMemo(() => {
    return JADWAL_PERJADIN_SAMBAS.filter((item) => {
      // 1. Bulan & Tanggal
      const tgl = item.tanggal_mulai || '2026-02-15'
      if (selectedMonth && selectedMonth !== 'semua') {
        if (tgl.slice(5, 7) !== selectedMonth) return false
      }
      if (startDate && tgl < startDate) return false
      if (endDate && tgl > endDate) return false

      // 2. Kecamatan
      if (selectedKecamatan !== 'Semua') {
        const matchesKec =
          item.tujuan.includes(selectedKecamatan) ||
          (item.kecamatans && item.kecamatans.includes(selectedKecamatan))
        if (!matchesKec) return false
      }

      // 3. Search
      const q = searchTerm.toLowerCase().trim()
      if (q) {
        const matchSearch =
          item.nama_pegawai.toLowerCase().includes(q) ||
          item.tujuan.toLowerCase().includes(q) ||
          item.kegiatan.toLowerCase().includes(q) ||
          item.spd_no.toLowerCase().includes(q)
        if (!matchSearch) return false
      }

      return true
    })
  }, [selectedMonth, startDate, endDate, selectedKecamatan, searchTerm])

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num || 0)
  }

  const totalBiayaSemua = useMemo(() => filtered.reduce((acc, curr) => acc + curr.total_biaya, 0), [filtered])
  const totalUangHarian = useMemo(() => filtered.reduce((acc, curr) => acc + curr.uang_harian, 0), [filtered])
  const totalTransport = useMemo(() => filtered.reduce((acc, curr) => acc + curr.transport, 0), [filtered])
  const totalPenginapan = useMemo(() => filtered.reduce((acc, curr) => acc + curr.penginapan, 0), [filtered])

  const formatMatrixDate = (isoStr) => {
    if (!isoStr) return '-'
    const d = new Date(isoStr)
    if (isNaN(d.getTime())) return isoStr.slice(8)
    const day = String(d.getDate()).padStart(2, '0')
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
    return `${day} ${months[d.getMonth()]}`
  }

  const getPeriodeLabel = () => {
    if (selectedMonth && selectedMonth !== 'semua') {
      const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
      const idx = parseInt(selectedMonth, 10) - 1
      return `Bulan ${monthNames[idx] || selectedMonth} 2026`
    }
    if (startDate && endDate) {
      return `${startDate} s.d. ${endDate}`
    }
    return 'Tahun Anggaran 2026'
  }

  const displayedPegawaiList = useMemo(() => {
    const q = searchTerm.toLowerCase().trim()
    if (!q && selectedKecamatan === 'Semua' && selectedMonth === 'semua' && !startDate && !endDate) {
      return PEGAWAI_LIST
    }
    return PEGAWAI_LIST.filter((p) => {
      if (q && p.toLowerCase().includes(q)) return true
      return filtered.some((j) => j.nama_pegawai === p)
    })
  }, [searchTerm, selectedKecamatan, selectedMonth, startDate, endDate, filtered])

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(filtered)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Rekap Perjadin 2026')
    XLSX.writeFile(wb, `Rekap_Biaya_Perjadin_BPS_Sambas_${selectedMonth !== 'semua' ? 'Bulan_' + selectedMonth : '2026'}.xlsx`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2.5">
            <Calendar className="w-7 h-7 text-indigo-600" />
            <span>
              {activeTab === 'matriks'
                ? 'Matriks Penugasan Pegawai (19 Kecamatan)'
                : activeTab === 'rekap'
                ? 'Rekap Biaya Perjadin'
                : 'Kalender Perjalanan Dinas'}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {activeTab === 'matriks'
              ? 'Tabel matriks silang (cross-tab) sebaran penugasan pegawai BPS Sambas ke 19 kecamatan untuk memantau sebaran dan mencegah bentrok jadwal'
              : activeTab === 'rekap'
              ? 'Rekapitulasi keuangan Surat Perjalanan Dinas (SPD): uang harian, transport riil, penginapan & beban MAK 524111/524113'
              : 'Agenda kronologis kegiatan perjalanan dinas dan supervisi sensus/survei lapangan pegawai BPS Kabupaten Sambas'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-gray-100 rounded-xl border border-gray-200 text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('kalender')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'kalender'
                ? 'bg-white text-indigo-700 shadow-xs font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>Kalender Agenda</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('matriks')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'matriks'
                ? 'bg-white text-indigo-700 shadow-xs font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5 text-indigo-600" />
            <span>Matriks Pegawai</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rekap')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'rekap'
                ? 'bg-white text-indigo-700 shadow-xs font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-600" />
            <span>Rekap Biaya Perjadin</span>
          </button>
        </div>
      </div>

      {/* FILTER BULAN, TANGGAL & KECAMATAN */}
      <DateRangeMonthFilter
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        startDate={startDate}
        endDate={endDate}
        onDateRangeChange={({ startDate: s, endDate: e }) => {
          setStartDate(s)
          setEndDate(e)
        }}
        onReset={() => {
          setSelectedMonth('semua')
          setStartDate('')
          setEndDate('')
          setSelectedKecamatan('Semua')
          setSearchTerm('')
        }}
        totalCount={JADWAL_PERJADIN_SAMBAS.length}
        filteredCount={filtered.length}
        extraFilters={
          <div className="flex flex-wrap items-center gap-3 w-full text-xs pt-1">
            <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wide">Filter Kecamatan:</span>
            <select
              value={selectedKecamatan}
              onChange={(e) => setSelectedKecamatan(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-lg px-2.5 py-1 focus:ring-2 focus:ring-indigo-600 cursor-pointer"
            >
              <option value="Semua">Semua 19 Kecamatan Sambas</option>
              {KECAMATAN_SAMBAS.map((kec) => (
                <option key={kec} value={kec}>
                  Kecamatan {kec}
                </option>
              ))}
            </select>
          </div>
        }
      />

      {/* VIEW 1: KALENDER PERJADIN (TAMPILAN AGENDA KRONOLOGIS) */}
      {activeTab === 'kalender' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari pegawai, tujuan, atau kegiatan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            <div className="text-xs text-gray-500">
              Total <span className="font-bold text-indigo-700">{filtered.length} Penugasan</span> Terjadwal di {getPeriodeLabel()}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded font-mono">
                      {item.durasi} ({item.tanggal_mulai} s.d. {item.tanggal_selesai})
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        item.status.includes('Selesai')
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900 mt-2">{item.nama_pegawai}</h3>
                  <p className="text-[11px] text-indigo-600 font-medium">{item.jabatan}</p>

                  <div className="mt-3 space-y-1.5 text-xs text-gray-600 border-t border-gray-100 pt-3">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 mt-0.5 flex-shrink-0" />
                      <span className="font-semibold text-gray-800">{item.tujuan}</span>
                    </div>
                    <p className="text-gray-500 text-[11px] leading-relaxed pl-5">{item.kegiatan}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="font-mono text-gray-400 text-[10px]">{item.spd_no}</span>
                  <span className="font-bold text-slate-900 font-mono">{formatRupiah(item.total_biaya)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: MATRIKS PENUGASAN PEGAWAI (TABEL SILANG NYATA: PEGAWAI X 19 KECAMATAN) */}
      {activeTab === 'matriks' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h2 className="text-xs sm:text-sm font-bold text-gray-900">
                  Matriks Sebaran Supervisi Wilayah Tugas (19 Kecamatan)
                </h2>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Memastikan setiap kecamatan tercakup pengawasan dan mendeteksi secara otomatis agar tidak ada penugasan ganda (zero conflict).
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 self-start sm:self-auto">
              ✓ Validasi Sistem: Tidak Ada Jadwal Tumpang Tindih
            </span>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs text-gray-600 border-collapse">
                <thead className="bg-gray-50 text-[10px] font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200 sticky top-0">
                  <tr>
                    <th className="px-3 py-3 w-48 bg-gray-100 sticky left-0 z-10 border-r border-gray-200">
                      Nama Pegawai BPS
                    </th>
                    {KECAMATAN_SAMBAS.map((kec) => {
                      const isSelectedKec = selectedKecamatan === kec
                      return (
                        <th
                          key={kec}
                          className={`px-2.5 py-3 text-center whitespace-nowrap border-r border-gray-100 ${
                            isSelectedKec ? 'bg-indigo-100 text-indigo-900 font-black' : ''
                          }`}
                        >
                          {kec}
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayedPegawaiList.length === 0 ? (
                    <tr>
                      <td colSpan={KECAMATAN_SAMBAS.length + 1} className="py-12 text-center text-slate-400">
                        <MapPin className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p className="font-semibold text-slate-700 text-sm">Tidak ada penugasan yang sesuai</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Tidak ditemukan data penugasan untuk filter periode / kecamatan / kata kunci aktif.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    displayedPegawaiList.map((pegawai) => {
                      // Cari penugasan untuk pegawai ini dari data yang sudah terfilter
                      const tugasPegawai = filtered.filter((j) => j.nama_pegawai === pegawai)

                      return (
                        <tr key={pegawai} className="hover:bg-gray-50/70 transition-colors">
                          <td className="px-3 py-2.5 font-bold text-gray-900 bg-gray-50/50 sticky left-0 z-10 border-r border-gray-200 whitespace-nowrap">
                            <div>{pegawai}</div>
                            <span className="text-[10px] text-indigo-600 font-normal">
                              {tugasPegawai.length > 0 ? `${tugasPegawai.length} Surat Tugas` : 'Standby Kantor'}
                            </span>
                          </td>

                          {KECAMATAN_SAMBAS.map((kec) => {
                            // Cek apakah ada penugasan ke kecamatan ini
                            const matchTugas = tugasPegawai.find(
                              (t) => t.kecamatans && t.kecamatans.includes(kec)
                            )

                            const isSelectedKec = selectedKecamatan === kec

                            return (
                              <td
                                key={kec}
                                className={`px-2 py-2 text-center border-r border-gray-100 text-[10px] ${
                                  matchTugas
                                    ? 'bg-indigo-50/60'
                                    : isSelectedKec
                                    ? 'bg-indigo-50/20'
                                    : ''
                                }`}
                              >
                                {matchTugas ? (
                                  <span
                                    className="inline-block px-1.5 py-0.5 rounded font-bold font-mono text-[9px] bg-indigo-600 text-white shadow-2xs whitespace-nowrap cursor-default"
                                    title={`${matchTugas.kegiatan} (${matchTugas.tanggal_mulai} s.d. ${matchTugas.tanggal_selesai})`}
                                  >
                                    {formatMatrixDate(matchTugas.tanggal_mulai)}
                                  </span>
                                ) : (
                                  <span className="text-gray-300">-</span>
                                )}
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: REKAP BIAYA PERJADIN (RINCIAN KEUANGAN & PERTANGGUNGJAWABAN SPD) */}
      {activeTab === 'rekap' && (
        <div className="space-y-4">
          {/* Metric Cards Keuangan Perjadin */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs font-semibold text-gray-500 block mb-1">Total Biaya Riil Dicairkan</span>
              <div className="text-xl font-bold text-slate-900 font-mono">{formatRupiah(totalBiayaSemua)}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs font-semibold text-gray-500 block mb-1">Alokasi Uang Harian</span>
              <div className="text-xl font-bold text-gray-900 font-mono">{formatRupiah(totalUangHarian)}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs font-semibold text-gray-500 block mb-1">Alokasi Transport Riil</span>
              <div className="text-xl font-bold text-amber-600 font-mono">{formatRupiah(totalTransport)}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs font-semibold text-gray-500 block mb-1">Alokasi Penginapan</span>
              <div className="text-xl font-bold text-indigo-600 font-mono">{formatRupiah(totalPenginapan)}</div>
            </div>
          </div>

          {/* Search & Export Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari No. SPD, nama pegawai, atau tujuan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors self-end sm:self-auto cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Excel Rekap Biaya</span>
            </button>
          </div>

          {/* Tabel Rekap Biaya Perjadin */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-gray-50/80 text-[11px] font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3">No. SPD & Pegawai</th>
                    <th className="px-4 py-3">Tujuan & MAK Belanja</th>
                    <th className="px-4 py-3 text-right">Uang Harian</th>
                    <th className="px-4 py-3 text-right">Transport Riil</th>
                    <th className="px-4 py-3 text-right">Penginapan</th>
                    <th className="px-4 py-3 text-right">Total Biaya</th>
                    <th className="px-4 py-3 text-center">Status Pertanggungjawaban</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/70">
                      <td className="px-4 py-3">
                        <div className="font-mono text-indigo-700 font-bold">{item.spd_no}</div>
                        <div className="font-semibold text-gray-900 mt-0.5">{item.nama_pegawai}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-800">{item.tujuan}</div>
                        <div className="text-[11px] font-mono text-gray-400 mt-0.5">{item.mak}</div>
                      </td>
                      <td className="px-4 py-3 text-right font-mono">{formatRupiah(item.uang_harian)}</td>
                      <td className="px-4 py-3 text-right font-mono">{formatRupiah(item.transport)}</td>
                      <td className="px-4 py-3 text-right font-mono">{formatRupiah(item.penginapan)}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                        {formatRupiah(item.total_biaya)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PerjadinPage
