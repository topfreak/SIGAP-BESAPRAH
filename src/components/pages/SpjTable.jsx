import React, { useState, useMemo } from 'react'
import {
  Search,
  Filter,
  SlidersHorizontal,
  Download,
  CheckSquare,
  PlusCircle,
  MoreVertical,
  Check,
  X,
  Clock,
  AlertCircle,
  Eye,
  FileCheck2,
  Printer,
  ChevronLeft,
  ChevronRight,
  Send,
  Layers,
  Sparkles,
  Trash2,
  FileText,
  Calendar,
  CalendarDays,
  RotateCcw
} from 'lucide-react'
import * as XLSX from 'xlsx'
import { REAL_SPJ_DATA } from '../../data/bpsRealData'
import { DateRangeMonthFilter, getSpjDate } from '../common/DateRangeMonthFilter'
import { LembarKendaliCetak } from '../common/LembarKendaliCetak'

// Top Metrics Cards di atas tabel sesuai Screenshot DOKTER-V
const TOP_METRICS_DATA = [
  { label: 'Pengajuan Umum Selesai', value: '66%', bg: 'from-indigo-500/10 to-indigo-500/5', border: 'border-indigo-200' },
  { label: 'Pengajuan Produksi Selesai', value: '61%', bg: 'from-emerald-500/10 to-emerald-500/5', border: 'border-emerald-200' },
  { label: 'Pengajuan Distribusi Selesai', value: '57%', bg: 'from-sky-500/10 to-sky-500/5', border: 'border-sky-200' },
  { label: 'Pengajuan Sosial Selesai', value: '59%', bg: 'from-amber-500/10 to-amber-500/5', border: 'border-amber-200' },
  { label: 'Pengajuan Neraca Selesai', value: '68%', bg: 'from-indigo-500/10 to-indigo-500/5', border: 'border-indigo-200' },
  { label: 'Pengajuan IPDS Selesai', value: '74%', bg: 'from-purple-500/10 to-purple-500/5', border: 'border-purple-200' },
]

export function SpjTable({ onNavigate, currentUser }) {
  const isAdmin = currentUser?.role === 'admin'
  const [rows, setRows] = useState(REAL_SPJ_DATA)
  const [activeTab, setActiveTab] = useState('Semua')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('semua')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedMetode, setSelectedMetode] = useState('Semua')
  const [selectedKategori, setSelectedKategori] = useState('Semua')
  const [selectedRowIds, setSelectedRowIds] = useState([])
  const [activeActionMenuId, setActiveActionMenuId] = useState(null)
  const [detailModalItem, setDetailModalItem] = useState(null)
  const [printModalItem, setPrintModalItem] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 15

  const triggerToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Hitung jumlah per tab secara dinamis bersinkronisasi dengan filter bulan & tanggal aktif
  const counts = useMemo(() => {
    const dateFiltered = rows.filter((row) => {
      const rowDate = getSpjDate(row)
      if (selectedMonth && selectedMonth !== 'semua') {
        if (rowDate.slice(5, 7) !== selectedMonth) return false
      }
      if (startDate && rowDate < startDate) return false
      if (endDate && rowDate > endDate) return false
      if (selectedMetode !== 'Semua' && row.metode !== selectedMetode) return false
      return true
    })

    const total = dateFiltered.length
    const perbaikan = dateFiltered.filter((r) => r.kelengkapan === 'BELUM LENGKAP' || r.kekurangan).length
    const ppk = dateFiltered.filter((r) => r.posisi_berkas === 'ppk').length
    const ppspm = dateFiltered.filter((r) => r.posisi_berkas === 'ppspm').length
    const bendahara = dateFiltered.filter((r) => r.posisi_berkas === 'bendahara').length
    const selesai = dateFiltered.filter((r) => r.posisi_berkas === 'selesai' || r.status_dokumen === 'Sudah diproses').length
    return { total, perbaikan, ppk, ppspm, bendahara, selesai }
  }, [rows, selectedMonth, startDate, endDate, selectedMetode])

  // Filter Data Komprehensif
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      // 1. Tab Status
      let matchesTab = true
      if (activeTab === 'Perlu Perbaikan') {
        matchesTab = row.kelengkapan === 'BELUM LENGKAP' || Boolean(row.kekurangan)
      } else if (activeTab === 'PPK') {
        matchesTab = row.posisi_berkas === 'ppk'
      } else if (activeTab === 'PPSPM') {
        matchesTab = row.posisi_berkas === 'ppspm'
      } else if (activeTab === 'Bendahara') {
        matchesTab = row.posisi_berkas === 'bendahara'
      } else if (activeTab === 'Selesai') {
        matchesTab = row.posisi_berkas === 'selesai' || row.status_dokumen === 'Sudah diproses'
      }

      // 2. Bulan & Rentang Tanggal
      const rowDate = getSpjDate(row)
      let matchesDate = true
      if (selectedMonth && selectedMonth !== 'semua') {
        if (rowDate.slice(5, 7) !== selectedMonth) matchesDate = false
      }
      if (startDate && rowDate < startDate) matchesDate = false
      if (endDate && rowDate > endDate) matchesDate = false

      // 3. Filter Metode (LS / GUP)
      let matchesMetode = true
      if (selectedMetode !== 'Semua') {
        matchesMetode = row.metode === selectedMetode
      }

      // 4. Filter Kategori Belanja
      let matchesKategori = true
      if (selectedKategori !== 'Semua') {
        const kat = (row.kategori || '').toLowerCase()
        if (selectedKategori === 'Honor') {
          matchesKategori = kat.includes('honor')
        } else if (selectedKategori === 'Perjadin') {
          matchesKategori = kat.includes('perjadin') || kat.includes('transport')
        } else if (selectedKategori === 'Non Gaji') {
          matchesKategori = kat.includes('gaji') || kat.includes('makan') || kat.includes('tukin') || kat.includes('kinerja')
        } else if (selectedKategori === 'Bahan & Konsumsi') {
          matchesKategori = kat.includes('bahan') || kat.includes('konsumsi') || kat.includes('atk')
        } else if (selectedKategori === 'Operasional') {
          matchesKategori = kat.includes('operasional') || kat.includes('internet') || kat.includes('paket') || kat.includes('building')
        }
      }

      // 5. Pencarian Teks
      let matchesSearch = true
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase()
        matchesSearch =
          String(row.no).includes(q) ||
          row.uraian.toLowerCase().includes(q) ||
          row.spm.toLowerCase().includes(q) ||
          row.kategori.toLowerCase().includes(q) ||
          row.pj.toLowerCase().includes(q) ||
          (row.pengaju && row.pengaju.toLowerCase().includes(q))
      }

      return matchesTab && matchesDate && matchesMetode && matchesKategori && matchesSearch
    })
  }, [rows, activeTab, selectedMonth, startDate, endDate, selectedMetode, selectedKategori, searchQuery])

  // Pagination
  const totalPages = Math.ceil(filteredRows.length / pageSize) || 1
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredRows.slice(start, start + pageSize)
  }, [filteredRows, currentPage])

  const handleToggleSelectRow = (id) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleToggleSelectAll = () => {
    if (selectedRowIds.length === paginatedRows.length) {
      setSelectedRowIds([])
    } else {
      setSelectedRowIds(paginatedRows.map((r) => r.id))
    }
  }

  const handleTerimaMassal = () => {
    if (selectedRowIds.length === 0) {
      triggerToast('Pilih minimal 1 baris pengajuan untuk diproses.')
      return
    }

    setRows((prev) =>
      prev.map((r) => {
        if (selectedRowIds.includes(r.id)) {
          return {
            ...r,
            posisi_berkas: 'selesai',
            status_dokumen: 'Sudah diproses',
            kelengkapan: 'LENGKAP',
            status_ppk: 'approved',
            status_ppspm: 'approved',
            status_bdh: 'approved',
            kekurangan: null,
          }
        }
        return r
      })
    )

    triggerToast(`Berhasil menerima dan menyetujui ${selectedRowIds.length} berkas SPJ secara massal.`)
    setSelectedRowIds([])
  }

  const handleExportExcel = () => {
    try {
      const exportData = filteredRows.map((r) => ({
        'No.': r.no,
        'Kategori Belanja': r.kategori,
        'Uraian Kegiatan SPJ': r.uraian,
        'No. SPM/SPP': r.spm,
        'Jumlah Pengeluaran (Rp)': r.pengeluaran,
        'Jumlah Potongan (Rp)': r.potongan,
        'Jumlah Pembayaran Bersih (Rp)': r.pembayaran,
        'Metode (LS/GUP)': r.metode,
        'Status Dokumen': r.status_dokumen,
        'Kelengkapan Fisik': r.kelengkapan,
        'Posisi Meja': r.posisi_berkas,
        'Catatan / Kekurangan': r.kekurangan || '-',
      }))

      const worksheet = XLSX.utils.json_to_sheet(exportData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'SPJ BPS Sambas 2026')
      XLSX.writeFile(workbook, `Monitoring_SPJ_BPS_Sambas_2026.xlsx`)
      triggerToast('File Excel resmi BPS Sambas berhasil diunduh!')
    } catch (err) {
      console.error(err)
      triggerToast('Gagal mengekspor file Excel.')
    }
  }

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num || 0)
  }

  return (
    <div className="space-y-5">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold py-3 px-5 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-gray-400 hover:text-white ml-2">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* HEADER SECTION: Judul Halaman & Tombol Aksi Kanan (Sesuai Screenshot) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Pengajuan
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Monitoring kelengkapan berkas fisik & alur 5 meja SPJ BPS Kabupaten Sambas TA 2026
          </p>
        </div>

        {/* 3 Tombol Utama Sesuai Referensi Screenshot DOKTER-V */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('pengajuan_baru')}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs hover:shadow-sm transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Ajukan Pembayaran</span>
          </button>

          <button
            type="button"
            onClick={handleExportExcel}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs hover:shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Excel</span>
          </button>

          <button
            type="button"
            onClick={handleTerimaMassal}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs hover:shadow-sm transition-all"
          >
            <CheckSquare className="w-4 h-4" />
            <span>Terima Massal</span>
          </button>
        </div>
      </div>

      {/* ADMIN PRIVILEGE BANNER */}
      {isAdmin && (
        <div className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/80 rounded-xl flex items-center justify-between gap-3 text-xs text-purple-900 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
              👑
            </div>
            <div>
              <span className="font-bold">Mode Super Admin Aktif: </span>
              <span className="text-purple-800 text-[11px]">
                Akses penuh lintas 5 meja: verifikasi kelengkapan, approve massal, bypass SP2D, dan override berkas.
              </span>
            </div>
          </div>
          <span className="text-[10px] bg-purple-700 text-white font-bold px-2 py-0.5 rounded">
            Full Access
          </span>
        </div>
      )}

      {/* TOP METRICS CARDS: Sesuai Screenshot DOKTER-V */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {TOP_METRICS_DATA.map((item, idx) => (
          <div
            key={idx}
            className={`bg-white border ${item.border || 'border-slate-200'} rounded-2xl p-3.5 shadow-xs hover:shadow-sm transition-all`}
          >
            <span className="text-[11px] font-semibold text-slate-500 block mb-0.5 truncate" title={item.label}>
              {item.label}
            </span>
            <div className="text-xl font-extrabold text-slate-900 tracking-tight flex items-baseline justify-between">
              <span>{item.value}</span>
              <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" />
            </div>
          </div>
        ))}
      </div>

      {/* FILTER BULAN & RANGE TANGGAL MODERN (SIGAP BESAPRAH) */}
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
          setSelectedMetode('Semua')
          setSelectedKategori('Semua')
          setSearchQuery('')
          setCurrentPage(1)
        }}
        totalCount={rows.length}
        filteredCount={filteredRows.length}
        extraFilters={
          <div className="flex flex-wrap items-center gap-3 w-full text-xs pt-1">
            {/* Filter Metode Pembayaran */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wide">Metode:</span>
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                {['Semua', 'LS', 'GUP'].map((met) => (
                  <button
                    key={met}
                    type="button"
                    onClick={() => { setSelectedMetode(met); setCurrentPage(1) }}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      selectedMetode === met
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {met}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Kategori Belanja */}
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wide">Kategori:</span>
              <select
                value={selectedKategori}
                onChange={(e) => { setSelectedKategori(e.target.value); setCurrentPage(1) }}
                className="text-xs bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-lg px-2.5 py-1 focus:ring-2 focus:ring-indigo-600 cursor-pointer"
              >
                <option value="Semua">Semua Kategori Belanja</option>
                <option value="Honor">Honor & Petugas Mitra</option>
                <option value="Perjadin">Perjadin & Transport</option>
                <option value="Non Gaji">Non Gaji / Uang Makan / Tukin</option>
                <option value="Bahan & Konsumsi">Bahan, ATK & Konsumsi</option>
                <option value="Operasional">Operasional & Daya Jasa</option>
              </select>
            </div>
          </div>
        }
      />

      {/* FILTER TABS & SEARCH BAR (Sesuai Referensi Desain) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
        
        {/* Tabs Filter dengan Badge Angka Berwarna */}
        <div className="flex items-center overflow-x-auto pb-1 lg:pb-0 gap-1 bg-white p-1 rounded-xl border border-gray-200/90 shadow-xs">
          <button
            type="button"
            onClick={() => { setActiveTab('Semua'); setCurrentPage(1) }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'Semua'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60 shadow-2xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Semua ({counts.total})
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('Perlu Perbaikan'); setCurrentPage(1) }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap inline-flex items-center gap-1.5 transition-all ${
              activeTab === 'Perlu Perbaikan'
                ? 'bg-amber-50 text-amber-800 border border-amber-200/60 shadow-2xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span>Perlu Perbaikan</span>
            <span className="text-amber-600 font-bold">{counts.perbaikan}</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('PPK'); setCurrentPage(1) }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap inline-flex items-center gap-1.5 transition-all ${
              activeTab === 'PPK'
                ? 'bg-blue-50 text-blue-800 border border-blue-200/60 shadow-2xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span>PPK</span>
            <span className="text-blue-600 font-bold">{counts.ppk}</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('PPSPM'); setCurrentPage(1) }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap inline-flex items-center gap-1.5 transition-all ${
              activeTab === 'PPSPM'
                ? 'bg-indigo-50 text-indigo-800 border border-indigo-200/60 shadow-2xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span>PPSPM</span>
            <span className="text-indigo-600 font-bold">{counts.ppspm}</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('Bendahara'); setCurrentPage(1) }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap inline-flex items-center gap-1.5 transition-all ${
              activeTab === 'Bendahara'
                ? 'bg-purple-50 text-purple-800 border border-purple-200/60 shadow-2xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span>Bendahara</span>
            <span className="text-purple-700 font-bold">{counts.bendahara}</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('Selesai'); setCurrentPage(1) }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap inline-flex items-center gap-1.5 transition-all ${
              activeTab === 'Selesai'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60 shadow-2xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span>Selesai</span>
            <span className="text-emerald-600 font-bold">{counts.selesai}</span>
          </button>
        </div>

        {/* Search Bar di Kanan */}
        <div className="relative flex-1 lg:max-w-xs">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari uraian, no SPM, kegiatan..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gray-200/90 rounded-xl shadow-xs focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-all placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* FLOATING ACTION SELECTION */}
      {selectedRowIds.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 p-2.5 rounded-xl flex items-center justify-between text-xs text-indigo-950 animate-in fade-in">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
              {selectedRowIds.length}
            </span>
            <span>berkas SPJ terpilih</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTerimaMassal}
              className="px-3 py-1 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Terima & Teruskan Massal
            </button>
            <button
              type="button"
              onClick={() => setSelectedRowIds([])}
              className="px-2.5 py-1 text-gray-600 hover:text-gray-900 font-medium"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* TABEL DATA UTAMA */}
      <div className="bg-white border border-gray-200/90 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto min-h-[350px]">
          <table className="w-full text-left text-xs text-gray-600">
            {/* Header Kolom Sesuai Referensi DOKTER-V */}
            <thead className="bg-gray-50/80 border-b border-gray-200/80 text-[11px] font-semibold text-gray-700">
              <tr>
                <th className="w-10 px-3 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={
                      paginatedRows.length > 0 &&
                      selectedRowIds.length === paginatedRows.length
                    }
                    onChange={handleToggleSelectAll}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 cursor-pointer"
                  />
                </th>
                <th className="w-16 px-2 py-3">Aksi</th>
                <th className="px-3 py-3">Posisi Dokumen</th>
                <th className="w-12 px-3 py-3">No</th>
                <th className="px-3 py-3">Uraian Kegiatan SPJ</th>
                <th className="px-3 py-3">No. SPM</th>
                <th className="px-3 py-3">Pj.</th>
                <th className="px-3 py-3 text-right">Pengeluaran</th>
                <th className="px-3 py-3">PPK</th>
                <th className="px-3 py-3">PPSPM</th>
                <th className="px-3 py-3">Bdh.</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-12 text-center text-gray-400">
                    Tidak ada berkas SPJ yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row) => {
                  const isSelected = selectedRowIds.includes(row.id)
                  const isMenuOpen = activeActionMenuId === row.id
                  const isDeficient = row.kelengkapan === 'BELUM LENGKAP' || Boolean(row.kekurangan)

                  return (
                    <tr
                      key={row.id}
                      className={`hover:bg-gray-50/70 transition-colors ${
                        isSelected ? 'bg-indigo-50/40' : ''
                      }`}
                    >
                      <td className="px-3 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectRow(row.id)}
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 cursor-pointer"
                        />
                      </td>

                      <td className="px-2 py-3 relative">
                        <button
                          type="button"
                          onClick={() => setActiveActionMenuId(isMenuOpen ? null : row.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded text-gray-600 hover:text-indigo-600 hover:bg-gray-100 font-medium text-xs cursor-pointer"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                          <span>Aksi</span>
                        </button>

                        {isMenuOpen && (
                          <>
                            <div onClick={() => setActiveActionMenuId(null)} className="fixed inset-0 z-30" />
                            <div className="absolute left-2 top-9 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-40 text-xs">
                              <button
                                type="button"
                                onClick={() => { setDetailModalItem(row); setActiveActionMenuId(null) }}
                                className="w-full text-left px-3.5 py-1.5 hover:bg-gray-50 flex items-center gap-2 text-gray-700 hover:text-indigo-600 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5 text-gray-400" />
                                <span>Lihat Detail & Dokumen</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setPrintModalItem(row)
                                  setActiveActionMenuId(null)
                                }}
                                className="w-full text-left px-3.5 py-1.5 hover:bg-gray-50 flex items-center gap-2 text-gray-700 hover:text-indigo-600 cursor-pointer"
                              >
                                <Printer className="w-3.5 h-3.5 text-gray-400" />
                                <span>Cetak Kendali A4</span>
                              </button>

                              <div className="border-t border-gray-100 my-1" />

                              <button
                                type="button"
                                onClick={() => {
                                  setRows((prev) =>
                                    prev.map((r) =>
                                      r.id === row.id
                                        ? { ...r, kelengkapan: 'LENGKAP', kekurangan: null, status_dokumen: 'Sudah diproses', posisi_berkas: 'selesai' }
                                        : r
                                    )
                                  )
                                  triggerToast(`Status berkas No. ${row.no} berhasil disetujui.`)
                                  setActiveActionMenuId(null)
                                }}
                                className="w-full text-left px-3.5 py-1.5 hover:bg-gray-50 flex items-center gap-2 text-indigo-700 font-semibold cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5 text-indigo-600" />
                                <span>Verifikasi Berkas</span>
                              </button>

                              {isAdmin && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setRows((prev) => prev.filter((r) => r.id !== row.id))
                                    triggerToast(`[Admin] Berkas No. ${row.no} berhasil dihapus.`)
                                    setActiveActionMenuId(null)
                                  }}
                                  className="w-full text-left px-3.5 py-1.5 hover:bg-red-50 flex items-center gap-2 text-red-600 font-medium"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                  <span>Hapus Pengajuan</span>
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </td>

                      {/* Posisi Dokumen Badge */}
                      <td className="px-3 py-3">
                        {isDeficient ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            Perlu Perbaikan
                          </span>
                        ) : row.posisi_berkas === 'selesai' ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Selesai SP2D
                          </span>
                        ) : row.posisi_berkas === 'ppspm' ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            Di PPSPM
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            Di PPK
                          </span>
                        )}
                      </td>

                      {/* No */}
                      <td className="px-3 py-3 font-semibold text-gray-900 font-mono">
                        {row.no}
                      </td>

                      {/* Uraian */}
                      <td
                        onClick={() => setDetailModalItem(row)}
                        className="px-3 py-3 font-medium text-gray-800 max-w-xs truncate cursor-pointer hover:text-indigo-600 hover:underline"
                        title={row.uraian}
                      >
                        <div>
                          <span>{row.uraian}</span>
                          {row.kekurangan && (
                            <span className="block text-[10px] text-rose-600 font-normal truncate mt-0.5">
                              ⚠️ {row.kekurangan}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* No SPM */}
                      <td className="px-3 py-3 font-mono text-[11px] text-gray-600 whitespace-nowrap">
                        {row.spm}
                      </td>

                      {/* Pj */}
                      <td className="px-3 py-3 text-gray-700 whitespace-nowrap">
                        {row.pj}
                      </td>

                      {/* Pengeluaran */}
                      <td className="px-3 py-3 text-right font-mono text-[11px] font-semibold text-gray-800 whitespace-nowrap">
                        {formatRupiah(row.pengeluaran)}
                      </td>

                      {/* Status PPK */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        {row.status_ppk === 'approved' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-medium text-[11px]">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>Disetujui</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-600 font-medium text-[11px]">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            <span>Catatan</span>
                          </span>
                        )}
                      </td>

                      {/* Status PPSPM */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        {row.status_ppspm === 'approved' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-medium text-[11px]">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>Disetujui</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-gray-400 font-medium text-[11px]">
                            <span className="w-2 h-2 rounded-full bg-gray-300" />
                            <span>Proses</span>
                          </span>
                        )}
                      </td>

                      {/* Status Bdh */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        {row.status_bdh === 'approved' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-medium text-[11px]">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>Cair</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-gray-400 font-medium text-[11px]">
                            <span className="w-2 h-2 rounded-full bg-gray-300" />
                            <span>-</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer: Counter & Pagination */}
        <div className="p-3 bg-gray-50/70 border-t border-gray-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-500">
          <div>
            Menampilkan <span className="font-semibold text-gray-800">{paginatedRows.length}</span> dari{' '}
            <span className="font-semibold text-gray-800">{filteredRows.length}</span> berkas SPJ (Total: {rows.length})
          </div>

          <div className="flex items-center gap-1 self-center sm:self-auto">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg">
              Hal {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL DIALOG */}
      {detailModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-xl w-full p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    No. SPM: {detailModalItem.spm}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                    Metode: {detailModalItem.metode}
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mt-2 leading-snug">
                  {detailModalItem.uraian}
                </h3>
              </div>
              <button onClick={() => setDetailModalItem(null)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-400 block font-medium">Kategori Belanja</span>
                <span className="font-semibold text-gray-800 text-sm mt-0.5 block">{detailModalItem.kategori}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-400 block font-medium">Penanggung Jawab (PJ)</span>
                <span className="font-semibold text-gray-800 text-sm mt-0.5 block">{detailModalItem.pj}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-400 block font-medium">Total Pengeluaran</span>
                <span className="font-semibold text-indigo-700 text-sm mt-0.5 block font-mono">{formatRupiah(detailModalItem.pengeluaran)}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-400 block font-medium">Pembayaran Bersih</span>
                <span className="font-semibold text-emerald-700 text-sm mt-0.5 block font-mono">{formatRupiah(detailModalItem.pembayaran)}</span>
              </div>
            </div>

            {detailModalItem.kekurangan && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs">
                <span className="font-bold text-rose-800 block mb-1">Kekurangan Berkas Fisik:</span>
                <p className="text-rose-900 leading-relaxed whitespace-pre-line">{detailModalItem.kekurangan}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setDetailModalItem(null)}
                className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50 cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerToast(`Dokumen No. ${detailModalItem.no} telah diverifikasi.`)
                  setDetailModalItem(null)
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 cursor-pointer"
              >
                Verifikasi Lengkap
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINT LEMBAR KENDALI A4 MODAL DIALOG */}
      {printModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-4xl w-full p-6 my-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Printer className="w-4 h-4 text-indigo-600" />
                  <span>Preview & Cetak Lembar Kendali SPJ</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  No. Berkas: {printModalItem.no} • {printModalItem.uraian}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPrintModalItem(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <LembarKendaliCetak
              spj={{
                id: `SPJ-${printModalItem.no}`,
                nama_kegiatan: printModalItem.uraian,
                kode_akun: printModalItem.mak || '524111',
                nama_akun: printModalItem.kategori || 'Belanja BPS Kabupaten Sambas',
                nominal_pengajuan: printModalItem.pengeluaran || 0,
                tim_kerja: printModalItem.tim_kerja || 'umum',
                nama_pj: printModalItem.pj || 'Penanggung Jawab',
                pemohon: printModalItem.pemohon || printModalItem.pj || 'Staf Pelaksana',
                metode_bayar: printModalItem.metode || 'LS',
                status_kelengkapan: printModalItem.kelengkapan === 'LENGKAP' ? 'hijau' : printModalItem.kekurangan ? 'merah' : 'kuning',
                nomor_sp2d: printModalItem.spm || printModalItem.sp2d,
                created_at: printModalItem.tgl_sp2d || '2026-02-15',
                checklist: [
                  { nama_syarat: 'Surat Tugas / Bukti Penugasan', is_wajib: true, is_checked: true },
                  { nama_syarat: 'Kuitansi Pembayaran / Bukti Transfer CMS', is_wajib: true, is_checked: !printModalItem.kekurangan },
                  { nama_syarat: 'Daftar Rincian Penerimaan / Honorarium', is_wajib: true, is_checked: true },
                  { nama_syarat: 'Faktur Pajak / Bukti Potong PPh / e-Billing', is_wajib: true, is_checked: printModalItem.status_dokumen === 'Sudah diproses' },
                  { nama_syarat: 'Laporan Pelaksanaan Kegiatan / Output Riil', is_wajib: false, is_checked: true }
                ]
              }}
            />
          </div>
        </div>
      )}

    </div>
  )
}

export default SpjTable
