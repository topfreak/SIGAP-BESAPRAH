import React, { useState, useMemo } from 'react'
import { CheckCircle2, AlertTriangle, Search, Filter, Download, ChevronLeft, ChevronRight, FileCheck, Layers } from 'lucide-react'
import { REAL_SPJ_DATA } from '../../data/bpsRealData'
import { DateRangeMonthFilter, getSpjDate } from '../common/DateRangeMonthFilter'
import * as XLSX from 'xlsx'

export function StatusPengajuanPage() {
  const [activeFilter, setActiveFilter] = useState('kurang') // 'kurang' | 'lengkap' | 'semua'
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('semua')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 15

  // Filter tanggal & bulan
  const dateFiltered = useMemo(() => {
    return REAL_SPJ_DATA.filter((d) => {
      const rowDate = getSpjDate(d)
      if (selectedMonth && selectedMonth !== 'semua') {
        if (rowDate.slice(5, 7) !== selectedMonth) return false
      }
      if (startDate && rowDate < startDate) return false
      if (endDate && rowDate > endDate) return false
      return true
    })
  }, [selectedMonth, startDate, endDate])

  const deficientRows = useMemo(() => {
    return dateFiltered.filter((d) => d.kelengkapan === 'BELUM LENGKAP' || Boolean(d.kekurangan))
  }, [dateFiltered])

  const completeRows = useMemo(() => {
    return dateFiltered.filter((d) => d.kelengkapan === 'LENGKAP' && !d.kekurangan)
  }, [dateFiltered])

  const displayedRows = useMemo(() => {
    let base = dateFiltered
    if (activeFilter === 'kurang') base = deficientRows
    if (activeFilter === 'lengkap') base = completeRows

    const q = searchTerm.toLowerCase().trim()
    if (!q) return base

    return base.filter((d) =>
      d.uraian.toLowerCase().includes(q) ||
      d.pj.toLowerCase().includes(q) ||
      d.spm.toLowerCase().includes(q) ||
      (d.kekurangan && d.kekurangan.toLowerCase().includes(q))
    )
  }, [dateFiltered, deficientRows, completeRows, activeFilter, searchTerm])

  // Pagination
  const totalPages = Math.ceil(displayedRows.length / pageSize) || 1
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return displayedRows.slice(start, start + pageSize)
  }, [displayedRows, currentPage])

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(displayedRows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Status Pengajuan SPJ')
    XLSX.writeFile(wb, `Status_Kelengkapan_SPJ_BPS_Sambas_${activeFilter}.xlsx`)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2.5">
            <FileCheck className="w-7 h-7 text-indigo-600" />
            <span>Status Pengajuan & Kelengkapan Berkas Fisik</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Monitoring kepatuhan fisik berkas SPJ (Catatan Form Permintaan, KAK, BAST, SK, dsb.) BPS Kabupaten Sambas
          </p>
        </div>

        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Excel ({displayedRows.length} Berkas)</span>
        </button>
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
          setActiveFilter('kurang')
          setSearchTerm('')
          setCurrentPage(1)
        }}
        totalCount={REAL_SPJ_DATA.length}
        filteredCount={displayedRows.length}
      />

      {/* Tabs Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200/90 shadow-xs">
          <button
            onClick={() => { setActiveFilter('kurang'); setCurrentPage(1) }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
              activeFilter === 'kurang'
                ? 'bg-rose-50 text-rose-800 border border-rose-200/80 shadow-2xs font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>Perlu Dilengkapi / Revisi</span>
            <span className="bg-rose-600 text-white font-bold px-1.5 py-0.2 rounded-full text-[10px]">
              {deficientRows.length}
            </span>
          </button>

          <button
            onClick={() => { setActiveFilter('lengkap'); setCurrentPage(1) }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
              activeFilter === 'lengkap'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>Lengkap & Terverifikasi</span>
            <span className="bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded-full text-[10px]">
              {completeRows.length}
            </span>
          </button>

          <button
            onClick={() => { setActiveFilter('semua'); setCurrentPage(1) }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
              activeFilter === 'semua'
                ? 'bg-indigo-50 text-indigo-800 border border-indigo-200/80 shadow-2xs font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>Semua</span>
            <span className="bg-indigo-600 text-white font-bold px-1.5 py-0.2 rounded-full text-[10px]">
              {dateFiltered.length}
            </span>
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari uraian, PJ, kekurangan..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
            className="pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl w-full sm:w-64 focus:ring-2 focus:ring-indigo-600 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Tabel Data */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/90 border-b border-slate-200/80 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              <tr>
                <th className="px-3.5 py-3.5">No</th>
                <th className="px-4 py-3.5">Uraian Berkas SPJ</th>
                <th className="px-3 py-3.5">No. SPM</th>
                <th className="px-3.5 py-3.5">Penanggung Jawab</th>
                <th className="px-4 py-3.5">Kekurangan Kelengkapan Fisik (12 MAK)</th>
                <th className="px-3.5 py-3.5 text-center">Status Fisik</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                    Tidak ada berkas yang cocok dengan filter kelengkapan ini.
                  </td>
                </tr>
              ) : (
                paginatedRows.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-3.5 py-3 font-mono font-semibold text-slate-700">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900 max-w-sm">
                      <div>{r.uraian}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Kategori: {r.kategori} • Metode: {r.metode}
                      </div>
                    </td>
                    <td className="px-3 py-3 font-mono text-slate-600 font-semibold">{r.spm}</td>
                    <td className="px-3.5 py-3 text-slate-800 font-medium">{r.pj}</td>
                    <td className="px-4 py-3 text-xs">
                      {r.kekurangan ? (
                        <div className="text-rose-700 bg-rose-50 border border-rose-200/80 px-2.5 py-1.5 rounded-xl font-medium leading-relaxed whitespace-pre-line">
                          {r.kekurangan}
                        </div>
                      ) : (
                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-lg text-[11px] font-semibold inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Seluruh dokumen persyaratan fisik lengkap</span>
                        </span>
                      )}
                    </td>
                    <td className="px-3.5 py-3 text-center">
                      {r.kekurangan ? (
                        <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                          Belum Lengkap
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Lengkap Sah
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer & Pagination */}
        <div className="p-3.5 bg-slate-50/80 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Menampilkan <span className="font-bold text-slate-800">{paginatedRows.length}</span> dari{' '}
            <span className="font-bold text-slate-800">{displayedRows.length}</span> berkas SPJ terfilter
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
  )
}

export default StatusPengajuanPage
