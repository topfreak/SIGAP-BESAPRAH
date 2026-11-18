import React, { useState, useMemo } from 'react'
import { CreditCard, Download, Search, CheckCircle2, Clock, ChevronLeft, ChevronRight, DollarSign, ArrowDownRight, Layers } from 'lucide-react'
import { REAL_SPJ_DATA } from '../../data/bpsRealData'
import { DateRangeMonthFilter, getSpjDate } from '../common/DateRangeMonthFilter'
import * as XLSX from 'xlsx'

export function StatusPembayaranPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterMetode, setFilterMetode] = useState('Semua')
  const [selectedMonth, setSelectedMonth] = useState('semua')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 20

  const filtered = useMemo(() => {
    return REAL_SPJ_DATA.filter((d) => {
      // 1. Metode
      const matchMetode = filterMetode === 'Semua' || d.metode === filterMetode

      // 2. Bulan & Rentang Tanggal
      const rowDate = getSpjDate(d)
      let matchDate = true
      if (selectedMonth && selectedMonth !== 'semua') {
        if (rowDate.slice(5, 7) !== selectedMonth) matchDate = false
      }
      if (startDate && rowDate < startDate) matchDate = false
      if (endDate && rowDate > endDate) matchDate = false

      // 3. Search
      const q = searchTerm.toLowerCase().trim()
      const matchSearch =
        q === '' ||
        d.uraian.toLowerCase().includes(q) ||
        d.spm.toLowerCase().includes(q) ||
        (d.pj && d.pj.toLowerCase().includes(q))

      return matchMetode && matchDate && matchSearch
    })
  }, [filterMetode, selectedMonth, startDate, endDate, searchTerm])

  // Ringkasan Keuangan Dinamis Sesuai Filter
  const summaryTotals = useMemo(() => {
    return filtered.reduce(
      (acc, curr) => {
        acc.pengeluaran += curr.pengeluaran || 0
        acc.potongan += curr.potongan || 0
        acc.pembayaran += curr.pembayaran || 0
        return acc
      },
      { pengeluaran: 0, potongan: 0, pembayaran: 0 }
    )
  }, [filtered])

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
    XLSX.utils.book_append_sheet(wb, ws, 'Status Pembayaran SPJ')
    XLSX.writeFile(wb, `Status_Pembayaran_SPJ_BPS_Sambas_${selectedMonth !== 'semua' ? 'Bulan_' + selectedMonth : '2026'}.xlsx`)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2.5">
            <CreditCard className="w-7 h-7 text-indigo-600" />
            <span>Status Pembayaran & Pencairan SP2D</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Monitoring realisasi pencairan anggaran belanja mekanisme LS dan GUP DIPA 1301 BPS Kabupaten Sambas
          </p>
        </div>

        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Excel ({filtered.length} Berkas)</span>
        </button>
      </div>

      {/* 3 Metric Cards Ringkasan Keuangan Dinamis */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Total Pengeluaran SPJ
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono">
            {formatRupiah(summaryTotals.pengeluaran)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Dari {filtered.length} transaksi terfilter
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200/90 shadow-xs">
          <span className="text-xs font-semibold text-amber-700 block mb-1">
            Total Potongan Pajak PPh/PPN
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-amber-700 font-mono">
            {formatRupiah(summaryTotals.potongan)}
          </div>
          <span className="text-[11px] text-amber-600/80 mt-1 block">
            Diverifikasi Bendahara Pengeluaran
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200/90 shadow-xs">
          <span className="text-xs font-semibold text-emerald-700 block mb-1">
            Total Pembayaran Bersih Cair
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 font-mono">
            {formatRupiah(summaryTotals.pembayaran)}
          </div>
          <span className="text-[11px] text-emerald-600/80 mt-1 block">
            Telah diterbitkan SP2D KPPN
          </span>
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
          setFilterMetode('Semua')
          setSearchTerm('')
          setCurrentPage(1)
        }}
        totalCount={REAL_SPJ_DATA.length}
        filteredCount={filtered.length}
        extraFilters={
          <div className="flex flex-wrap items-center gap-3 w-full text-xs pt-1">
            <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wide">Metode:</span>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              {['Semua', 'LS', 'GUP'].map((m) => (
                <button
                  key={m}
                  onClick={() => { setFilterMetode(m); setCurrentPage(1) }}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    filterMetode === m
                      ? 'bg-indigo-600 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {m === 'Semua' ? 'Semua Metode' : `Metode ${m}`}
                </button>
              ))}
            </div>

            <div className="relative ml-auto flex-1 sm:max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari uraian, no SPM, atau PJ..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
                className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg w-full focus:ring-2 focus:ring-indigo-600 focus:outline-hidden"
              />
            </div>
          </div>
        }
      />

      {/* Tabel Status Pembayaran */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/90 border-b border-slate-200/80 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              <tr>
                <th className="px-3.5 py-3.5">No</th>
                <th className="px-4 py-3.5">Uraian Berkas Belanja</th>
                <th className="px-3 py-3.5">No. SPM</th>
                <th className="px-3 py-3.5 text-center">Metode</th>
                <th className="px-3.5 py-3.5 text-right">Pengeluaran</th>
                <th className="px-3.5 py-3.5 text-right">Potongan Pajak</th>
                <th className="px-3.5 py-3.5 text-right">Pembayaran Bersih</th>
                <th className="px-3.5 py-3.5 text-center">Status Pencairan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                    Tidak ada transaksi pembayaran pada rentang tanggal/bulan ini.
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-3.5 py-3 font-mono font-semibold text-slate-700">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900 max-w-sm">
                      <div className="truncate">{row.uraian}</div>
                      <div className="text-[10px] text-indigo-600 font-semibold mt-0.5">
                        PJ: {row.pj} • {row.kategori}
                      </div>
                    </td>
                    <td className="px-3 py-3 font-mono text-[11px] text-slate-600">{row.spm}</td>
                    <td className="px-3 py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                        row.metode === 'LS'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {row.metode}
                      </span>
                    </td>
                    <td className="px-3.5 py-3 text-right font-mono text-[11px] text-slate-800">
                      {formatRupiah(row.pengeluaran)}
                    </td>
                    <td className="px-3.5 py-3 text-right font-mono text-[11px] text-amber-700 font-medium">
                      {formatRupiah(row.potongan)}
                    </td>
                    <td className="px-3.5 py-3 text-right font-mono text-[11px] font-bold text-slate-900">
                      {formatRupiah(row.pembayaran)}
                    </td>
                    <td className="px-3.5 py-3 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {row.status_dokumen === 'Sudah diproses' ? 'Cair SP2D' : 'Dalam Proses'}
                      </span>
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
            <span className="font-bold text-slate-800">{filtered.length}</span> transaksi terfilter
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

export default StatusPembayaranPage
