import React, { useState, useMemo } from 'react'
import {
  FilePlus,
  Send,
  ArrowRight,
  TrendingUp,
  Search,
  Filter,
  SlidersHorizontal,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ChevronRight,
  MoreVertical,
  Eye,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react'
import { REAL_SPJ_DATA } from '../../data/bpsRealData'
import { DateRangeMonthFilter, getSpjDate } from '../common/DateRangeMonthFilter'

// Komponen Render Bar Chart Bersih (Simulasi Visual Bar Chart Sesuai Screenshot)
function ModernBarChart({ title, data, maxY, ySteps }) {
  const [hoveredIdx, setHoveredIdx] = useState(null)

  return (
    <div className="bg-white border border-gray-200/90 rounded-xl p-5 shadow-xs flex flex-col h-full">
      <h3 className="font-semibold text-gray-800 text-sm mb-4">{title}</h3>

      {/* Area Visual Chart */}
      <div className="flex-1 flex flex-col justify-end pt-2 pb-1">
        <div className="relative h-60 w-full flex items-end">
          
          {/* Garis Horizontal Grid & Label Sumbu Y */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {ySteps.map((val, idx) => (
              <div key={idx} className="w-full flex items-center">
                <span className="text-[10px] text-gray-400 font-mono w-10 text-right pr-2 select-none">
                  {val.toLocaleString()}
                </span>
                <div className="flex-1 border-b border-gray-100" />
              </div>
            ))}
          </div>

          {/* Kolom-kolom Bar Chart */}
          <div className="relative z-10 w-full pl-10 pr-2 h-full flex items-end justify-between gap-1 sm:gap-2">
            {data.map((item, index) => {
              // Hitung persentase tinggi bar
              const heightPercent = item.count > 0 ? Math.min(100, Math.max(4, (item.count / maxY) * 100)) : 0
              const isHovered = hoveredIdx === index

              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer relative"
                  onMouseEnter={() => setHoveredIdx(index)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* Tooltip Hover */}
                  {isHovered && (
                    <div className="absolute -top-10 z-30 bg-slate-900 text-white text-[11px] font-medium py-1 px-2 rounded-md shadow-lg whitespace-nowrap pointer-events-none">
                      {item.label}: <span className="font-bold text-indigo-300">{item.count.toLocaleString()}</span> berkas
                    </div>
                  )}

                  {/* Batang Grafik (Bar) dengan warna Indigo & Angka di Atas/Tengah */}
                  <div className="w-full max-w-[42px] flex flex-col items-center justify-end relative h-full">
                    {item.count > 0 && (
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-sm border-2 border-indigo-500 transition-all duration-300 flex items-center justify-center relative ${
                          isHovered ? 'bg-indigo-500/30 shadow-xs' : 'bg-indigo-50/60'
                        }`}
                      >
                        {/* Angka di tengah/atas batang grafik sesuai referensi */}
                        <span className="text-[10px] font-semibold text-indigo-700 select-none">
                          {item.count > 999 ? `${(item.count / 1000).toFixed(1)}k` : item.count}
                        </span>
                      </div>
                    )}
                    {item.count === 0 && (
                      <div className="w-full h-0.5 bg-gray-200 rounded-xs" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Label Sumbu X (Kategori Status) */}
        <div className="pl-10 pr-2 mt-2 pt-2 border-t border-gray-100 grid grid-cols-8 gap-1 text-center">
          {data.map((item, index) => (
            <div key={index} className="truncate" title={item.label}>
              <span className="text-[9px] sm:text-[10px] text-gray-500 block truncate group-hover:text-indigo-600">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Dashboard({ onNavigate, currentUser }) {
  const isAdmin = currentUser?.role === 'admin'
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('semua')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // 1. Filter Real SPJ Data berdasarkan Bulan & Range Tanggal Aktif
  const dateFilteredSpj = useMemo(() => {
    return REAL_SPJ_DATA.filter((row) => {
      const rowDate = getSpjDate(row)
      if (selectedMonth && selectedMonth !== 'semua') {
        if (rowDate.slice(5, 7) !== selectedMonth) return false
      }
      if (startDate && rowDate < startDate) return false
      if (endDate && rowDate > endDate) return false
      return true
    })
  }, [selectedMonth, startDate, endDate])

  // 2. Hitung Metrik 4 Tim Teknis BPS secara Dinamis dari Data Terfilter
  const dynamicTopMetrics = useMemo(() => {
    const categorize = (item) => {
      const u = (item.uraian || '').toLowerCase()
      if (u.includes('susenas') || u.includes('sakernas') || u.includes('podes') || u.includes('sosial') || u.includes('pes')) {
        return 'sosial'
      }
      if (u.includes('tani') || u.includes('pertanian') || u.includes('ubinan') || u.includes('sutas') || u.includes('ksa') || u.includes('produksi')) {
        return 'produksi'
      }
      if (u.includes('shk') || u.includes('harga') || u.includes('hotel') || u.includes('vhts') || u.includes('distribusi') || u.includes('pasar')) {
        return 'distribusi'
      }
      return 'umum'
    }

    const groups = {
      umum: { total: 0, selesai: 0 },
      produksi: { total: 0, selesai: 0 },
      distribusi: { total: 0, selesai: 0 },
      sosial: { total: 0, selesai: 0 },
    }

    dateFilteredSpj.forEach((item) => {
      const g = categorize(item)
      groups[g].total += 1
      const isSelesai =
        item.status_dokumen === 'Sudah diproses' ||
        item.posisi_berkas === 'selesai' ||
        Boolean(item.nomor_sp2d) ||
        Boolean(item.tgl_sp2d)
      if (isSelesai) {
        groups[g].selesai += 1
      }
    })

    return [
      {
        id: 'umum',
        title: 'Pengajuan Bagian Umum',
        total: groups.umum.total,
        selesai: groups.umum.selesai,
        percentage: groups.umum.total > 0 ? Math.round((groups.umum.selesai / groups.umum.total) * 100) : 0,
      },
      {
        id: 'produksi',
        title: 'Pengajuan Tim Produksi',
        total: groups.produksi.total,
        selesai: groups.produksi.selesai,
        percentage: groups.produksi.total > 0 ? Math.round((groups.produksi.selesai / groups.produksi.total) * 100) : 0,
      },
      {
        id: 'distribusi',
        title: 'Pengajuan Tim Distribusi',
        total: groups.distribusi.total,
        selesai: groups.distribusi.selesai,
        percentage: groups.distribusi.total > 0 ? Math.round((groups.distribusi.selesai / groups.distribusi.total) * 100) : 0,
      },
      {
        id: 'sosial',
        title: 'Pengajuan Tim Sosial',
        total: groups.sosial.total,
        selesai: groups.sosial.selesai,
        percentage: groups.sosial.total > 0 ? Math.round((groups.sosial.selesai / groups.sosial.total) * 100) : 0,
      },
    ]
  }, [dateFilteredSpj])

  // 3. Hitung Data Grafik Batang Total Kantor secara Dinamis
  const chartDataKantor = useMemo(() => {
    let dikirim = 0
    let dibatalkan = 0
    let perluRevisi = 0
    let ditolak = 0
    let disetujui = 0
    let dicetak = 0
    let dikumpulkan = 0
    let dicairkan = 0

    dateFilteredSpj.forEach((r) => {
      const isSelesai = r.status_dokumen === 'Sudah diproses' || r.posisi_berkas === 'selesai' || Boolean(r.nomor_sp2d)
      const isRevisi = r.kelengkapan === 'BELUM LENGKAP' || Boolean(r.kekurangan) || r.status_kelengkapan === 'merah'
      const isRejected = r.status_ppk === 'rejected' || r.status_ppspm === 'rejected' || r.status_bdh === 'rejected'
      const isApproved = r.status_ppk === 'approved' || r.status_ppspm === 'approved'

      if (isSelesai) dicairkan += 1
      if (isApproved) disetujui += 1
      if (isRevisi) perluRevisi += 1
      if (isRejected) ditolak += 1
      if (r.posisi_berkas === 'admin_tu' || r.posisi_berkas === 'tim_kerja') dikirim += 1
      if (r.posisi_berkas !== 'tim_kerja') {
        dikumpulkan += 1
        dicetak += 1
      }
    })

    return [
      { label: 'Dikirim', count: dikirim },
      { label: 'Dibatalkan', count: dibatalkan },
      { label: 'Perlu Revisi', count: perluRevisi },
      { label: 'Ditolak', count: ditolak },
      { label: 'Disetujui', count: disetujui },
      { label: 'Dicetak', count: dicetak },
      { label: 'Dikumpulkan', count: dikumpulkan },
      { label: 'Dicairkan', count: dicairkan },
    ]
  }, [dateFilteredSpj])

  // 4. Hitung Data Grafik Batang SPJ Anda secara Dinamis
  const chartDataAnda = useMemo(() => {
    const userSpj = dateFilteredSpj.filter((r) => {
      if (isAdmin) return true // Super admin memantau seluruh berkas
      return (
        (r.pengaju && currentUser?.nama_lengkap && r.pengaju.toLowerCase().includes(currentUser.nama_lengkap.toLowerCase().slice(0, 5))) ||
        (r.pj && currentUser?.nama_lengkap && r.pj.toLowerCase().includes(currentUser.nama_lengkap.toLowerCase().slice(0, 5)))
      )
    })

    let dikirim = 0
    let dibatalkan = 0
    let perluRevisi = 0
    let ditolak = 0
    let disetujui = 0
    let dicetak = 0
    let dikumpulkan = 0
    let dicairkan = 0

    userSpj.forEach((r) => {
      const isSelesai = r.status_dokumen === 'Sudah diproses' || r.posisi_berkas === 'selesai' || Boolean(r.nomor_sp2d)
      const isRevisi = r.kelengkapan === 'BELUM LENGKAP' || Boolean(r.kekurangan)
      const isRejected = r.status_ppk === 'rejected' || r.status_ppspm === 'rejected'
      const isApproved = r.status_ppk === 'approved'

      if (isSelesai) dicairkan += 1
      if (isApproved) disetujui += 1
      if (isRevisi) perluRevisi += 1
      if (isRejected) ditolak += 1
      if (r.posisi_berkas === 'admin_tu' || r.posisi_berkas === 'tim_kerja') dikirim += 1
      if (r.posisi_berkas !== 'tim_kerja') {
        dikumpulkan += 1
        dicetak += 1
      }
    })

    return [
      { label: 'Dikirim', count: dikirim },
      { label: 'Dibatalkan', count: dibatalkan },
      { label: 'Perlu Revisi', count: perluRevisi },
      { label: 'Ditolak', count: ditolak },
      { label: 'Disetujui', count: disetujui },
      { label: 'Dicetak', count: dicetak },
      { label: 'Dikumpulkan', count: dikumpulkan },
      { label: 'Dicairkan', count: dicairkan },
    ]
  }, [dateFilteredSpj, isAdmin, currentUser])

  // Skala sumbu Y dinamis
  const getChartScale = (data) => {
    const maxVal = Math.max(...data.map((d) => d.count), 0)
    if (maxVal === 0) return { maxY: 10, ySteps: [10, 8, 6, 4, 2, 0] }
    const stepBase = maxVal <= 10 ? 2 : maxVal <= 50 ? 10 : maxVal <= 200 ? 50 : 500
    const maxY = Math.max(10, Math.ceil((maxVal * 1.2) / stepBase) * stepBase)
    const step = maxY / 5
    const ySteps = [maxY, Math.round(maxY - step), Math.round(maxY - 2 * step), Math.round(maxY - 3 * step), Math.round(maxY - 4 * step), 0]
    return { maxY, ySteps }
  }

  const scaleKantor = useMemo(() => getChartScale(chartDataKantor), [chartDataKantor])
  const scaleAnda = useMemo(() => getChartScale(chartDataAnda), [chartDataAnda])

  // 5. Filter Riwayat Pengajuan SPJ di Tabel Dasbor
  const filteredSpj = useMemo(() => {
    const q = searchTerm.toLowerCase().trim()
    return dateFilteredSpj
      .filter((item) => {
        if (!q) return true
        return (
          (item.uraian && item.uraian.toLowerCase().includes(q)) ||
          String(item.no || '').includes(q) ||
          (item.pj && item.pj.toLowerCase().includes(q)) ||
          (item.pengaju && item.pengaju.toLowerCase().includes(q)) ||
          (item.spm && item.spm.toLowerCase().includes(q))
        )
      })
      .map((item) => {
        let posisi = 'Di Tata Usaha'
        let posisiColor = 'bg-slate-50 text-slate-700 border-slate-200'

        if (item.posisi_berkas === 'selesai' || item.status_dokumen === 'Sudah diproses') {
          posisi = 'Selesai (SP2D)'
          posisiColor = 'bg-emerald-50 text-emerald-700 border-emerald-200'
        } else if (item.posisi_berkas === 'ppspm') {
          posisi = 'Di PPSPM'
          posisiColor = 'bg-indigo-50 text-indigo-700 border-indigo-200'
        } else if (item.posisi_berkas === 'bendahara') {
          posisi = 'Di Bendahara'
          posisiColor = 'bg-purple-50 text-purple-700 border-purple-200'
        } else if (item.posisi_berkas === 'ppk') {
          posisi = 'Di PPK'
          posisiColor = 'bg-sky-50 text-sky-700 border-sky-200'
        }

        const ppk = item.status_ppk === 'approved' ? 'Disetujui' : item.status_ppk === 'rejected' ? 'Ditolak' : 'Menunggu'
        const ppspm = item.status_ppspm === 'approved' ? 'Disetujui' : item.status_ppspm === 'rejected' ? 'Ditolak' : 'Belum Sampai'
        const bdh = item.status_bdh === 'approved' ? 'Disetujui' : item.status_bdh === 'process' ? 'Verifikasi' : 'Belum Sampai'

        return {
          id: item.id || `spj-${item.no}`,
          no: item.no_berkas || item.no || '-',
          uraian: item.uraian,
          posisi,
          posisiColor,
          pj: item.pj,
          pengaju: item.pengaju || item.pj,
          ppk,
          ppkStatus: item.status_ppk || 'process',
          ppspm,
          ppspmStatus: item.status_ppspm || 'pending',
          bdh,
          bdhStatus: item.status_bdh || 'pending',
        }
      })
  }, [dateFilteredSpj, searchTerm])

  return (
    <div className="space-y-6">
      
      {/* 1. HEADER: Judul Dasbor Berukuran Besar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Dasbor Monitoring BPS Sambas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitoring Administrasi dan Pertanggungjawaban SPJ Berkas Fisik Satker 6101 / DIPA 1301
          </p>
        </div>

        {/* Quick Tag Status */}
        <div className="flex items-center gap-2">
          {isAdmin && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-200 text-purple-800 rounded-xl text-xs font-bold shadow-2xs">
              👑 Super Admin
            </span>
          )}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-200/90 rounded-xl text-xs font-semibold text-indigo-800 self-start sm:self-auto shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Tahun Anggaran 2026 • Realtime</span>
          </div>
        </div>
      </div>

      {/* FILTER BULAN & PERIODE DATA DASBOR */}
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
          setSearchTerm('')
        }}
        totalCount={REAL_SPJ_DATA.length}
        filteredCount={dateFilteredSpj.length}
      />

      {/* 2. TOP METRICS CARDS: 4 Card Sejajar Berdesain Bersih & Teks Tebal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {dynamicTopMetrics.map((metric) => (
          <div
            key={metric.id}
            className="bg-white border border-gray-200/90 rounded-xl p-5 shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                {metric.title}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-gray-900">
                  {metric.percentage}%
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  ({metric.selesai}/{metric.total} SPJ)
                </span>
              </div>
            </div>

            {/* Visual Progress Bar Mini */}
            <div className="mt-4">
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${metric.percentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. GRAFIK BATANG (BAR CHART): 2 Kotak Grafik Sejajar Sesuai Referensi DOKTER-V */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* Grafik Kiri: Jumlah Status SPJ (Total Kantor) */}
        <ModernBarChart
          title="Jumlah Status SPJ (Kantor)"
          data={chartDataKantor}
          maxY={scaleKantor.maxY}
          ySteps={scaleKantor.ySteps}
        />

        {/* Grafik Kanan: Jumlah Status SPJ Anda */}
        <ModernBarChart
          title="Jumlah Status SPJ Anda"
          data={chartDataAnda}
          maxY={scaleAnda.maxY}
          ySteps={scaleAnda.ySteps}
        />
      </div>

      {/* 4. AKSI CEPAT: Tombol CTA di Bawah Grafik (Sesuai Referensi) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="text-sm font-semibold text-gray-800">
          Riwayat SPJ {selectedMonth !== 'semua' ? `Bulan ${selectedMonth}` : 'Terbaru'}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* CTA: Pengajuan Surat Tugas / Buat SPJ Baru */}
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('pengajuan_baru')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs hover:shadow-sm transition-all cursor-pointer"
          >
            <FilePlus className="w-4 h-4" />
            <span>Pengajuan Surat Tugas</span>
          </button>

          {/* CTA: Pengajuan Laporan Perjadin / Ajukan Pembayaran */}
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('spj_table')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs hover:shadow-sm transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Pengajuan Laporan Perjadin</span>
          </button>
        </div>
      </div>

      {/* 5. TABEL RIWAYAT SPJ ANDA DENGAN SEARCH & FILTER ICONS (Sesuai Referensi Screenshot) */}
      <div className="bg-white border border-gray-200/90 rounded-xl shadow-xs overflow-hidden">
        
        {/* Search Bar & Filter Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-gray-500 font-medium">
            Menampilkan <span className="font-semibold text-gray-800">{filteredSpj.length}</span> pengajuan SPJ terfilter
          </div>

          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari no. ST, kegiatan, lokasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:bg-white w-48 sm:w-64 transition-all"
              />
            </div>

            {/* Filter & Column Toggle Icons */}
            <button
              type="button"
              className="p-1.5 text-gray-500 hover:text-indigo-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              title="Filter Lanjutan"
            >
              <Filter className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-1.5 text-gray-500 hover:text-indigo-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              title="Atur Kolom"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabel Mini */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50/70 border-b border-gray-200/80 text-[11px] font-semibold text-gray-700 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">No</th>
                <th className="px-4 py-3">Posisi Dokumen</th>
                <th className="px-4 py-3">Uraian Kegiatan SPJ</th>
                <th className="px-4 py-3">Pj.</th>
                <th className="px-4 py-3">Pengaju</th>
                <th className="px-4 py-3 text-center">PPK</th>
                <th className="px-4 py-3 text-center">PPSPM</th>
                <th className="px-4 py-3 text-center">Bdh.</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSpj.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-700 text-sm">Tidak ada berkas SPJ yang cocok</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Tidak ditemukan pengajuan SPJ untuk filter periode atau kata kunci pencarian aktif.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredSpj.slice(0, 15).map((row) => (
                  <tr key={row.id || row.no} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-900 font-mono">
                      {row.no}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${row.posisiColor}`}>
                        {row.posisi}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800 max-w-xs truncate">
                      {row.uraian}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{row.pj}</td>
                    <td className="px-4 py-3 text-gray-700">{row.pengaju}</td>
                    
                    {/* Status PPK */}
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${
                        row.ppkStatus === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : row.ppkStatus === 'rejected'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {row.ppk}
                      </span>
                    </td>

                    {/* Status PPSPM */}
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${
                        row.ppspmStatus === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : row.ppspmStatus === 'rejected'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {row.ppspm}
                      </span>
                    </td>

                    {/* Status Bendahara */}
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${
                        row.bdhStatus === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : row.bdhStatus === 'process'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {row.bdh}
                      </span>
                    </td>

                    {/* Tombol Aksi */}
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onNavigate && onNavigate('spj_table')}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <span>Detail</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* View All Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('spj_table')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 hover:underline cursor-pointer"
          >
            <span>Buka Tabel Manajemen Pengajuan Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  )
}

export default Dashboard

