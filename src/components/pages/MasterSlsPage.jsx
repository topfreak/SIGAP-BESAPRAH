import React, { useState, useMemo } from 'react'
import { Map, MapPin, Search, Filter, AlertCircle, CheckCircle2, Download } from 'lucide-react'
import { REAL_SLS_DATA } from '../../data/bpsRealData'
import * as XLSX from 'xlsx'

export function MasterSlsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedKecamatan, setSelectedKecamatan] = useState('Semua')
  const [statusFilter, setStatusFilter] = useState('Semua') // 'Semua' | 'lengkap' | 'kurang'

  const kecamatans = useMemo(() => {
    return ['Semua', ...new Set(REAL_SLS_DATA.map((d) => d.kecamatan))]
  }, [])

  const filteredData = useMemo(() => {
    return REAL_SLS_DATA.filter((item) => {
      const matchKec = selectedKecamatan === 'Semua' || item.kecamatan === selectedKecamatan
      
      let matchStatus = true
      if (statusFilter === 'lengkap') matchStatus = item.kekurangan_sls === 0
      if (statusFilter === 'kurang') matchStatus = item.kekurangan_sls > 0

      const q = searchTerm.toLowerCase().trim()
      const matchSearch =
        !q ||
        item.nama.toLowerCase().includes(q) ||
        item.pj_kuda.toLowerCase().includes(q) ||
        item.kecamatan.toLowerCase().includes(q)

      return matchKec && matchStatus && matchSearch
    })
  }, [searchTerm, selectedKecamatan, statusFilter])

  const totalKurang = REAL_SLS_DATA.reduce((acc, curr) => acc + curr.kekurangan_sls, 0)

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Master SLS Sambas')
    XLSX.writeFile(wb, 'Master_SLS_BPS_Kabupaten_Sambas.xlsx')
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2.5">
            <Map className="w-7 h-7 text-indigo-600" />
            <span>Master SLS & Wilayah Tugas Lapangan</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Monitoring kelengkapan Satuan Lingkungan Setempat (SLS) per Kecamatan BPS Kabupaten Sambas
          </p>
        </div>

        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Excel SLS ({filteredData.length})</span>
        </button>
      </div>

      {/* Metric Cards SLS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Total Petugas Lapangan</span>
          <div className="text-2xl font-extrabold text-slate-900">{REAL_SLS_DATA.length} Petugas</div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Mitra & Pegawai BPS Sambas</span>
        </div>
        <div className="bg-white border border-rose-200/90 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-rose-700 block mb-1">Total Kekurangan SLS</span>
          <div className="text-2xl font-extrabold text-rose-700">{totalKurang} SLS Belum Lengkap</div>
          <span className="text-[11px] text-rose-600/80 mt-0.5 block">Perlu verifikasi fisik PJ Kuda</span>
        </div>
        <div className="bg-white border border-indigo-200/90 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-indigo-700 block mb-1">Cakupan Kecamatan</span>
          <div className="text-2xl font-extrabold text-indigo-900">{kecamatans.length - 1} Kecamatan</div>
          <span className="text-[11px] text-indigo-600/80 mt-0.5 block">Seluruh wilayah Kab. Sambas</span>
        </div>
      </div>

      {/* Filter Toolbar Modern */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
        {/* Status Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setStatusFilter('Semua')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                statusFilter === 'Semua' ? 'bg-indigo-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Status
            </button>
            <button
              onClick={() => setStatusFilter('kurang')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                statusFilter === 'kurang' ? 'bg-rose-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Perlu Dilengkapi
            </button>
            <button
              onClick={() => setStatusFilter('lengkap')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                statusFilter === 'lengkap' ? 'bg-emerald-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lengkap (0 SLS)
            </button>
          </div>

          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama, kecamatan, PJ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl w-full focus:ring-2 focus:ring-indigo-600 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Kecamatan Chip Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs custom-scrollbar pt-1 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex-shrink-0">
            Kecamatan:
          </span>
          {kecamatans.map((kec) => (
            <button
              key={kec}
              onClick={() => setSelectedKecamatan(kec)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedKecamatan === kec
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {kec}
            </button>
          ))}
        </div>
      </div>

      {/* Tabel Master SLS */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50/80 border-b border-gray-200/80 text-[11px] font-semibold text-gray-700">
              <tr>
                <th className="px-4 py-3">No</th>
                <th className="px-4 py-3">Nama Petugas / Mitra</th>
                <th className="px-4 py-3">Kecamatan</th>
                <th className="px-4 py-3">PJ Kuda BPS</th>
                <th className="px-4 py-3 text-center">Kekurangan SLS</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((row, idx) => (
                <tr key={row.id} className="hover:bg-gray-50/70">
                  <td className="px-4 py-3 font-mono font-semibold text-gray-800">{idx + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{row.nama}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-gray-700">
                      <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{row.kecamatan}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{row.pj_kuda}</td>
                  <td className="px-4 py-3 text-center font-mono font-bold">
                    {row.kekurangan_sls > 0 ? (
                      <span className="text-rose-600">{row.kekurangan_sls} SLS</span>
                    ) : (
                      <span className="text-gray-400">0</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {row.kekurangan_sls > 0 ? (
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        Belum Lengkap
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Lengkap
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default MasterSlsPage
