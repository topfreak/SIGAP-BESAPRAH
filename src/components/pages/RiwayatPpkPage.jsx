import React, { useState, useMemo } from 'react'
import { History, ShieldCheck, CheckCircle2, UserCheck, Search, Filter, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import { REAL_SPJ_DATA } from '../../data/bpsRealData'
import { DateRangeMonthFilter } from '../common/DateRangeMonthFilter'
import * as XLSX from 'xlsx'

export function RiwayatPpkPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('semua')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [statusFilter, setStatusFilter] = useState('Semua')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 15

  const ppkLogs = useMemo(() => {
    return REAL_SPJ_DATA.map((item, idx) => {
      const monthNum = idx % 2 === 0 ? '01' : '02'
      const dayNum = String((idx % 25) + 1).padStart(2, '0')
      const logDate = item.tgl_sp2d || `2026-${monthNum}-${dayNum}`

      return {
        id: 'ppk-log-' + idx,
        waktu: `${logDate} 10:15 WIB`,
        dateOnly: logDate,
        no_spj: item.id,
        uraian: item.uraian,
        pejabat: 'Andi Noviantoni, S.P.',
        jabatan: 'Pejabat Pembuat Komitmen (PPK)',
        aksi: item.kelengkapan === 'LENGKAP' ? 'Persetujuan Komitmen & Uji Beban DIPA' : 'Catatan Kelengkapan Berkas Fisik',
        status: item.kelengkapan === 'LENGKAP' ? 'Disetujui' : 'Catatan Revisi',
        nominal: item.pengeluaran,
        catatan: item.kekurangan ? `Perlu perbaikan: ${item.kekurangan}` : 'Beban DIPA sesuai MAK, dokumen fisik diverifikasi sah.',
      }
    })
  }, [])

  const filtered = useMemo(() => {
    return ppkLogs.filter((l) => {
      // 1. Bulan & Tanggal
      if (selectedMonth && selectedMonth !== 'semua') {
        if (l.dateOnly.slice(5, 7) !== selectedMonth) return false
      }
      if (startDate && l.dateOnly < startDate) return false
      if (endDate && l.dateOnly > endDate) return false

      // 2. Status
      if (statusFilter !== 'Semua' && l.status !== statusFilter) return false

      // 3. Search
      const q = searchTerm.toLowerCase().trim()
      if (q) {
        const matchSearch =
          l.uraian.toLowerCase().includes(q) ||
          l.no_spj.toLowerCase().includes(q) ||
          l.catatan.toLowerCase().includes(q)
        if (!matchSearch) return false
      }

      return true
    })
  }, [ppkLogs, selectedMonth, startDate, endDate, statusFilter, searchTerm])

  const totalNominal = useMemo(() => filtered.reduce((acc, curr) => acc + curr.nominal, 0), [filtered])

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
    XLSX.utils.book_append_sheet(wb, ws, 'Riwayat PPK')
    XLSX.writeFile(wb, `Riwayat_PPK_BPS_Sambas_${selectedMonth !== 'semua' ? 'Bulan_' + selectedMonth : '2026'}.xlsx`)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2.5">
              <History className="w-7 h-7 text-indigo-600" />
              <span>Riwayat & Disposisi Meja PPK</span>
            </h1>
            <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              ● Audit Trail Aktif
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Audit trail penetapan komitmen anggaran, verifikasi beban DIPA & disposisi Pejabat Pembuat Komitmen (Andi Noviantoni, S.P.)
          </p>
        </div>

        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Excel ({filtered.length} Log)</span>
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
          setStatusFilter('Semua')
          setSearchTerm('')
          setCurrentPage(1)
        }}
        totalCount={ppkLogs.length}
        filteredCount={filtered.length}
        extraFilters={
          <div className="flex flex-wrap items-center gap-3 w-full text-xs pt-1">
            <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wide">Status Disposisi:</span>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              {['Semua', 'Disetujui', 'Catatan Revisi'].map((st) => (
                <button
                  key={st}
                  onClick={() => { setStatusFilter(st); setCurrentPage(1) }}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-indigo-600 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="relative ml-auto flex-1 sm:max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari log SPJ, catatan disposisi..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
                className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg w-full focus:ring-2 focus:ring-indigo-600 focus:outline-hidden"
              />
            </div>
          </div>
        }
      />

      {/* Timeline Riwayat PPK */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/90 border-b border-slate-200/80 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Waktu Disposisi</th>
                <th className="px-4 py-3.5">No. Berkas</th>
                <th className="px-4 py-3.5">Uraian Kegiatan SPJ</th>
                <th className="px-4 py-3.5">Pejabat Penguji</th>
                <th className="px-4 py-3.5 text-right">Nominal Komitmen</th>
                <th className="px-4 py-3.5 text-center">Status Disposisi</th>
                <th className="px-4 py-3.5">Catatan Disposisi PPK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    Tidak ada riwayat disposisi PPK yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                paginatedRows.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">{log.waktu}</td>
                    <td className="px-4 py-3 font-mono font-bold text-indigo-700 whitespace-nowrap">{log.no_spj}</td>
                    <td className="px-4 py-3 font-medium text-slate-900 max-w-xs truncate">{log.uraian}</td>
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{log.pejabat}</td>
                    <td className="px-4 py-3 text-right font-mono text-[11px] font-bold text-slate-900 whitespace-nowrap">
                      {formatRupiah(log.nominal)}
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      {log.status === 'Disetujui' ? (
                        <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Disetujui
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Catatan Revisi
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 max-w-sm truncate" title={log.catatan}>
                      {log.catatan}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-3.5 bg-slate-50/80 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Menampilkan <span className="font-bold text-slate-800">{paginatedRows.length}</span> dari{' '}
            <span className="font-bold text-slate-800">{filtered.length}</span> log disposisi terfilter (Total Komitmen: <strong className="text-indigo-700 font-mono">{formatRupiah(totalNominal)}</strong>)
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

export default RiwayatPpkPage
