import React, { useState, useEffect, useMemo } from 'react'
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  PieChart,
  Search,
  Download,
  CheckCircle2,
  Calendar,
  Users,
  Layers,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { REAL_SPJ_DATA } from '../../data/bpsRealData'
import { DateRangeMonthFilter, getSpjDate } from '../common/DateRangeMonthFilter'
import * as XLSX from 'xlsx'

// DATA MASTER KEGIATAN MANMIT DENGAN PERIODE & BULAN AKTIVITAS
const KEGIATAN_MANMIT_DATA = [
  {
    id: 'KGT-01',
    nama: 'Survei Sosial Ekonomi Nasional (Susenas) Maret 2026',
    pj: 'Nurhidayatul Fitri, S.Tr.Stat.',
    mitra: 48,
    pagu_honor: 124800000,
    realisasi_honor: 124800000,
    status: 'Selesai Pencairan',
    mak: '521213',
    bulan_list: ['03'],
    tanggal_mulai: '2026-03-01',
    tanggal_selesai: '2026-03-31',
    keywords: ['susenas'],
  },
  {
    id: 'KGT-02',
    nama: 'Survei Angkatan Kerja Nasional (Sakernas) Februari 2026',
    pj: 'Diva Maharani Basuki, S.Tr.Stat.',
    mitra: 24,
    pagu_honor: 62400000,
    realisasi_honor: 62400000,
    status: 'Selesai Pencairan',
    mak: '521213',
    bulan_list: ['02'],
    tanggal_mulai: '2026-02-01',
    tanggal_selesai: '2026-02-28',
    keywords: ['sakernas'],
  },
  {
    id: 'KGT-03',
    nama: 'Survei Potensi Desa (Podes) 2026',
    pj: 'Mega Lisantri, S.Tr.Stat.',
    mitra: 38,
    pagu_honor: 98800000,
    realisasi_honor: 25000000,
    status: 'Tahap Pelaksanaan',
    mak: '521213',
    bulan_list: ['05'],
    tanggal_mulai: '2026-05-01',
    tanggal_selesai: '2026-05-31',
    keywords: ['podes'],
  },
  {
    id: 'KGT-04',
    nama: 'Survei Pertanian Terpadu (SUTAS / Ubinan Subround I)',
    pj: 'Muhammad Reynaldi, A.Md',
    mitra: 22,
    pagu_honor: 57200000,
    realisasi_honor: 34320000,
    status: 'Tahap Pelaksanaan',
    mak: '521213',
    bulan_list: ['01', '02', '03', '04'],
    tanggal_mulai: '2026-01-15',
    tanggal_selesai: '2026-04-30',
    keywords: ['pertanian', 'ubinan', 'sutas', 'subround', 'ksa'],
  },
  {
    id: 'KGT-05',
    nama: 'Survei Harga Konsumen & Perdagangan (SHK/HKD Rutin)',
    pj: 'Hamzah, S.E.',
    mitra: 8,
    pagu_honor: 20800000,
    realisasi_honor: 18720000,
    status: 'Rutin Bulanan',
    mak: '521213',
    bulan_list: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    tanggal_mulai: '2026-01-01',
    tanggal_selesai: '2026-12-31',
    keywords: ['shk', 'hkd', 'harga', 'konsumen', 'pasar'],
  },
  {
    id: 'KGT-06',
    nama: 'Pemutakhiran Peta & Muatan Wilkerstat / PES 2026',
    pj: 'Andi Noviantoni, S.P.',
    mitra: 16,
    pagu_honor: 36000000,
    realisasi_honor: 36000000,
    status: 'Selesai Pencairan',
    mak: '521213',
    bulan_list: ['01', '02'],
    tanggal_mulai: '2026-01-05',
    tanggal_selesai: '2026-02-15',
    keywords: ['pes', 'wilkerstat', 'geospasial'],
  },
  {
    id: 'KGT-07',
    nama: 'Survei Tingkat Penghunian Kamar Hotel (VHTS) Rutin',
    pj: 'Hamzah, S.E.',
    mitra: 6,
    pagu_honor: 15600000,
    realisasi_honor: 15600000,
    status: 'Rutin Bulanan',
    mak: '521213',
    bulan_list: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    tanggal_mulai: '2026-01-01',
    tanggal_selesai: '2026-12-31',
    keywords: ['vhts', 'hotel'],
  },
]

export function HonorMitraPage({ mode = 'monitor_honor_mitra' }) {
  const normalizeTab = (m) => {
    if (m === 'kegiatan_manmit') return 'kegiatan'
    if (m === 'honor_mitra' || m === 'honor' || m === 'alokasi_honor') return 'honor'
    return 'monitor'
  }

  const [activeTab, setActiveTab] = useState(normalizeTab(mode))
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('semua')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 15

  useEffect(() => {
    setActiveTab(normalizeTab(mode))
  }, [mode])

  // Filter pengeluaran khusus honor mitra dari dataset riil
  const rawHonorRecords = useMemo(() => {
    return REAL_SPJ_DATA.filter(
      (d) =>
        d.kategori.toLowerCase().includes('honor') ||
        d.uraian.toLowerCase().includes('honor') ||
        d.uraian.toLowerCase().includes('petugas') ||
        d.uraian.toLowerCase().includes('pes') ||
        d.uraian.toLowerCase().includes('vhts') ||
        d.uraian.toLowerCase().includes('podes')
    )
  }, [])

  // Filter honor records dengan bulan dan tanggal
  const honorRecords = useMemo(() => {
    return rawHonorRecords.filter((d) => {
      const rowDate = getSpjDate(d)
      if (selectedMonth && selectedMonth !== 'semua') {
        if (rowDate.slice(5, 7) !== selectedMonth) return false
      }
      if (startDate && rowDate < startDate) return false
      if (endDate && rowDate > endDate) return false
      return true
    })
  }, [rawHonorRecords, selectedMonth, startDate, endDate])

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase().trim()
    if (!q) return honorRecords
    return honorRecords.filter(
      (d) =>
        d.uraian.toLowerCase().includes(q) ||
        d.spm.toLowerCase().includes(q) ||
        d.pj.toLowerCase().includes(q)
    )
  }, [honorRecords, searchTerm])

  // Filter Kegiatan Manajemen Mitra secara dinamis sesuai Bulan, Tanggal & Search
  const filteredManmit = useMemo(() => {
    return KEGIATAN_MANMIT_DATA.filter((k) => {
      // 1. Filter Bulan
      if (selectedMonth && selectedMonth !== 'semua') {
        if (!k.bulan_list.includes(selectedMonth)) return false
      }
      // 2. Filter Rentang Tanggal
      if (startDate && k.tanggal_selesai < startDate) return false
      if (endDate && k.tanggal_mulai > endDate) return false

      // 3. Filter Search
      const q = searchTerm.toLowerCase().trim()
      if (q) {
        const match =
          k.nama.toLowerCase().includes(q) ||
          k.pj.toLowerCase().includes(q) ||
          k.mak.includes(q) ||
          k.status.toLowerCase().includes(q)
        if (!match) return false
      }
      return true
    }).map((k) => {
      // Hitung realisasi dinamis dari transaksi honor yang terfilter
      const relatedSpj = filtered.filter((s) => {
        const u = s.uraian.toLowerCase()
        return k.keywords.some((kw) => u.includes(kw)) || s.pj.toLowerCase().includes(k.pj.toLowerCase().slice(0, 5))
      })
      const realisasiTerhitung = relatedSpj.reduce((sum, s) => sum + (s.pembayaran || s.pengeluaran || 0), 0)
      return {
        ...k,
        realisasi_honor: realisasiTerhitung > 0 ? realisasiTerhitung : (selectedMonth !== 'semua' ? 0 : k.realisasi_honor),
        transaksi_count: relatedSpj.length,
      }
    })
  }, [selectedMonth, startDate, endDate, searchTerm, filtered])

  const totalHonor = useMemo(() => filtered.reduce((acc, curr) => acc + curr.pengeluaran, 0), [filtered])
  const totalPotongan = useMemo(() => filtered.reduce((acc, curr) => acc + curr.potongan, 0), [filtered])
  const totalNetto = useMemo(() => filtered.reduce((acc, curr) => acc + curr.pembayaran, 0), [filtered])

  // Pagination
  const totalPages = Math.ceil(filtered.length / pageSize) || 1
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, currentPage])

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num || 0)
  }

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(filtered)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Honor Mitra BPS')
    XLSX.writeFile(wb, `Rekap_Honor_Mitra_BPS_Sambas_${selectedMonth !== 'semua' ? 'Bulan_' + selectedMonth : '2026'}.xlsx`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2.5">
            <DollarSign className="w-7 h-7 text-indigo-600" />
            <span>
              {activeTab === 'kegiatan'
                ? 'Kegiatan Manajemen Mitra (Manmit)'
                : activeTab === 'honor'
                ? 'Daftar Pembayaran Honor Petugas'
                : 'Monitoring Honor Petugas & Mitra'}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Pelacakan honorarium sensus, survei bulanan (PES, VHTS, Sakernas, Podes) & potongan PPh 21 Satker BPS Sambas
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-gray-100 rounded-xl border border-gray-200 text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('monitor')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'monitor'
                ? 'bg-white text-indigo-700 shadow-xs font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
            <span>Monitor</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('kegiatan')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'kegiatan'
                ? 'bg-white text-indigo-700 shadow-xs font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
            <span>Kegiatan Manmit</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('honor')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'honor'
                ? 'bg-white text-indigo-700 shadow-xs font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-indigo-600" />
            <span>Pembayaran Honor</span>
          </button>
        </div>
      </div>

      {/* FILTER BULAN & RANGE TANGGAL */}
      <DateRangeMonthFilter
        selectedMonth={selectedMonth}
        onMonthChange={(m) => { setSelectedMonth(m); setCurrentPage(1) }}
        startDate={startDate}
        endDate={endDate}
        onDateRangeChange={({ startDate: s, endDate: e }) => {
          setStartDate(s)
          setEndDate(e)
          setCurrentPage(1)
        }}
        onReset={() => {
          setSelectedMonth('semua')
          setStartDate('')
          setEndDate('')
          setSearchTerm('')
          setCurrentPage(1)
        }}
        totalCount={activeTab === 'kegiatan' ? KEGIATAN_MANMIT_DATA.length : rawHonorRecords.length}
        filteredCount={activeTab === 'kegiatan' ? filteredManmit.length : filtered.length}
      />

      {/* Metric Cards Honor */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Total Alokasi Bruto</span>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">{formatRupiah(totalHonor)}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Dari {filtered.length} transaksi terfilter</span>
        </div>
        <div className="bg-white border border-amber-200/90 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-amber-700 block mb-1">Potongan Pajak (PPh 21)</span>
          <div className="text-2xl font-extrabold text-amber-700 font-mono">{formatRupiah(totalPotongan)}</div>
          <span className="text-[11px] text-amber-600/80 mt-1 block">Disetor ke Kas Negara</span>
        </div>
        <div className="bg-white border border-emerald-200/90 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-emerald-700 block mb-1">Total Cair Bersih (CMS Bank)</span>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono">{formatRupiah(totalNetto)}</div>
          <span className="text-[11px] text-emerald-600/80 mt-1 block">Transfer rekening mitra BPS</span>
        </div>
      </div>

      {/* VIEW: KEGIATAN MANMIT */}
      {activeTab === 'kegiatan' && (
        <div className="space-y-4">
          {/* Toolbar Search untuk Kegiatan Manmit */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari kegiatan manmit, PJ, atau status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            <div className="text-xs text-gray-500 font-medium">
              Menampilkan <span className="font-bold text-indigo-700">{filteredManmit.length}</span> dari {KEGIATAN_MANMIT_DATA.length} kegiatan
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-gray-200 bg-gray-50/70 flex items-center justify-between">
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Daftar Kegiatan Manajemen Mitra (Manmit) BPS Sambas TA 2026
              </h2>
              <span className="text-xs text-indigo-700 font-bold bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                {filteredManmit.length} Kegiatan Terfilter
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-gray-50 text-[11px] font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3">Nama Kegiatan Survei / Sensus</th>
                    <th className="px-4 py-3">PJ Kegiatan</th>
                    <th className="px-4 py-3 text-center">Jumlah Mitra</th>
                    <th className="px-4 py-3 text-right">Pagu Honor</th>
                    <th className="px-4 py-3 text-right">Realisasi SPJ</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredManmit.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <Briefcase className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p className="font-semibold text-slate-700 text-sm">Tidak ada kegiatan manajemen mitra</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Tidak ditemukan kegiatan survei/sensus yang cocok dengan filter periode atau pencarian aktif.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredManmit.map((k) => (
                      <tr key={k.id} className="hover:bg-gray-50/70">
                        <td className="px-4 py-3">
                          <div className="font-bold text-gray-900">{k.nama}</div>
                          <div className="text-[11px] font-mono text-gray-400 mt-0.5">MAK {k.mak}</div>
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-800">{k.pj}</td>
                        <td className="px-4 py-3 text-center font-medium">{k.mitra} Orang</td>
                        <td className="px-4 py-3 text-right font-mono">{formatRupiah(k.pagu_honor)}</td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">{formatRupiah(k.realisasi_honor)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {k.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: TABEL HONOR MITRA & MONITOR & ALOKASI */}
      {activeTab !== 'kegiatan' && (
        <div className="space-y-4">
          {/* Toolbar Search & Export */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari kegiatan honor, SPM, atau PJ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors self-end sm:self-auto cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Excel Honor</span>
            </button>
          </div>

          {/* Tabel Rincian Honor */}
          <div className="bg-white border border-gray-200/90 rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-semibold text-gray-700 uppercase tracking-wider">
                  <tr>
                    <th className="px-3 py-3">No</th>
                    <th className="px-4 py-3">Uraian Kegiatan Honor</th>
                    <th className="px-3 py-3">No. SPM</th>
                    <th className="px-3 py-3">PJ Kegiatan</th>
                    <th className="px-3 py-3 text-right">Bruto</th>
                    <th className="px-3 py-3 text-right">Potongan PPh</th>
                    <th className="px-3 py-3 text-right">Netto</th>
                    <th className="px-3 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedRows.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                        Tidak ada data pembayaran honor mitra yang cocok dengan filter tanggal/bulan ini.
                      </td>
                    </tr>
                  ) : (
                    paginatedRows.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-3.5 py-3 font-mono font-semibold text-slate-700">
                          {(currentPage - 1) * pageSize + idx + 1}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-900 max-w-sm">
                          <div>{item.uraian}</div>
                          <div className="text-[10px] text-indigo-600 font-semibold mt-0.5">
                            Kategori: {item.kategori}
                          </div>
                        </td>
                        <td className="px-3 py-3 font-mono text-[11px] text-slate-600">{item.spm}</td>
                        <td className="px-3 py-3 text-slate-800 font-medium">{item.pj}</td>
                        <td className="px-3.5 py-3 text-right font-mono text-[11px] text-slate-900">{formatRupiah(item.pengeluaran)}</td>
                        <td className="px-3.5 py-3 text-right font-mono text-[11px] text-amber-700 font-medium">{formatRupiah(item.potongan)}</td>
                        <td className="px-3.5 py-3 text-right font-mono text-[11px] font-bold text-slate-900">{formatRupiah(item.pembayaran)}</td>
                        <td className="px-3.5 py-3 text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Cair CMS
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-3.5 bg-slate-50/80 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
              <div>
                Menampilkan <span className="font-bold text-slate-800">{paginatedRows.length}</span> dari{' '}
                <span className="font-bold text-slate-800">{filtered.length}</span> pembayaran honor mitra terfilter
              </div>

              <div className="flex items-center gap-1.5 self-center sm:self-auto">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 py-1 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg">
                  Hal {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HonorMitraPage
