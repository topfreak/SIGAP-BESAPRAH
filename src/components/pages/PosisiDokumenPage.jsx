import React, { useState, useMemo } from 'react'
import { ArrowUpRight, CheckCircle2, Clock, MapPin, Search, AlertCircle, Users, Download, ArrowRight, Layers, Calendar } from 'lucide-react'
import { REAL_SPJ_DATA } from '../../data/bpsRealData'
import { DateRangeMonthFilter, getSpjDate } from '../common/DateRangeMonthFilter'
import * as XLSX from 'xlsx'

const MEJA_CONFIG = [
  { key: 'semua_aktif', label: 'Berkas Berjalan', sub: 'Total 5 Meja Proses', color: 'border-amber-400 bg-amber-500/10 text-amber-800' },
  { key: 'tim_kerja', label: '1. Meja Tim Kerja', sub: 'Penyusun & Revisi Fisik', color: 'border-blue-400 bg-blue-50/40 text-blue-800' },
  { key: 'admin_tu', label: '2. Meja Tata Usaha', sub: 'Verifikator 12 MAK', color: 'border-indigo-400 bg-indigo-50/40 text-indigo-800' },
  { key: 'ppk', label: '3. Meja PPK', sub: 'Pengujian Beban DIPA', color: 'border-sky-400 bg-sky-50/40 text-sky-800' },
  { key: 'ppspm', label: '4. Meja PPSPM', sub: 'Pengujian SPM', color: 'border-purple-400 bg-purple-50/40 text-purple-800' },
  { key: 'bendahara', label: '5. Meja Bendahara', sub: 'Pajak & Kuitansi', color: 'border-rose-400 bg-rose-50/40 text-rose-800' },
  { key: 'selesai', label: '6. Selesai / SP2D', sub: 'Pencairan KPPN', color: 'border-emerald-400 bg-emerald-50/40 text-emerald-800' },
]

export function PosisiDokumenPage() {
  const [selectedMeja, setSelectedMeja] = useState('semua_aktif')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('semua')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Filter baris data yang cocok dengan tanggal & bulan
  const dateFilteredData = useMemo(() => {
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

  // Hitung jumlah dinamis per meja kerja sesuai filter tanggal
  const counts = useMemo(() => {
    const res = { semua_aktif: 0, tim_kerja: 0, admin_tu: 0, ppk: 0, ppspm: 0, bendahara: 0, selesai: 0 }
    dateFilteredData.forEach((d) => {
      const pos = d.posisi_berkas || 'selesai'
      if (pos === 'selesai') {
        res.selesai += 1
      } else {
        res.semua_aktif += 1
        if (res[pos] !== undefined) {
          res[pos] += 1
        }
      }
    })
    return res
  }, [dateFilteredData])

  // Filter baris data yang tepat sesuai meja yang dipilih dan pencarian
  const filteredItems = useMemo(() => {
    return dateFilteredData.filter((d) => {
      let matchMeja = false
      if (selectedMeja === 'semua_aktif') {
        matchMeja = d.posisi_berkas !== 'selesai'
      } else if (selectedMeja === 'selesai') {
        matchMeja = d.posisi_berkas === 'selesai'
      } else {
        matchMeja = d.posisi_berkas === selectedMeja
      }

      const q = searchTerm.toLowerCase().trim()
      const matchSearch =
        q === '' ||
        d.uraian.toLowerCase().includes(q) ||
        d.spm.toLowerCase().includes(q) ||
        d.pj.toLowerCase().includes(q) ||
        (d.pengaju && d.pengaju.toLowerCase().includes(q)) ||
        (d.kekurangan && d.kekurangan.toLowerCase().includes(q))

      return matchMeja && matchSearch
    })
  }, [dateFilteredData, selectedMeja, searchTerm])

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num || 0)
  }

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(filteredItems)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, `Posisi_${selectedMeja}`)
    XLSX.writeFile(wb, `Posisi_Dokumen_SPJ_${selectedMeja}_BPS_Sambas.xlsx`)
  }

  const getPosisiLabel = (posKey) => {
    switch (posKey) {
      case 'tim_kerja':
        return 'Meja Tim Kerja'
      case 'admin_tu':
        return 'Meja Tata Usaha'
      case 'ppk':
        return 'Meja PPK'
      case 'ppspm':
        return 'Meja PPSPM'
      case 'bendahara':
        return 'Meja Bendahara'
      case 'selesai':
        return 'Selesai / SP2D'
      default:
        return posKey
    }
  }

  const activeMejaObj = MEJA_CONFIG.find((m) => m.key === selectedMeja) || MEJA_CONFIG[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2.5">
            <MapPin className="w-7 h-7 text-indigo-600" />
            <span>Posisi Fisik Dokumen SPJ (Alur 5 Meja)</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Pelacakan posisi fisik map berkas SPJ secara real-time antar meja kerja BPS Kabupaten Sambas (Satker 6101 / DIPA 1301)
          </p>
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Excel ({filteredItems.length} Berkas)</span>
        </button>
      </div>

      {/* FILTER BULAN & RENTANG TANGGAL */}
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
        filteredCount={filteredItems.length}
      />

      {/* PIPELINE MEJA KERJA DENGAN ANGKA DINAMIS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {MEJA_CONFIG.map((m) => {
          const isSelected = selectedMeja === m.key
          const count = counts[m.key] || 0

          return (
            <button
              key={m.key}
              type="button"
              onClick={() => setSelectedMeja(m.key)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md border-indigo-600 ring-2 ring-indigo-600/30'
                  : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold block uppercase tracking-wider ${isSelected ? 'text-indigo-100' : 'text-gray-400'}`}>
                  {m.label.includes('.') ? m.label.split('.')[0] : 'AKTIF'}
                </span>
                {isSelected && <span className="w-2 h-2 rounded-full bg-indigo-300 animate-pulse" />}
              </div>

              <span className="text-xs font-bold block mt-1 truncate">
                {m.label.includes('.') ? m.label.split('.')[1] : m.label}
              </span>

              <span className={`text-[10px] block mt-0.5 truncate ${isSelected ? 'text-indigo-100/80' : 'text-gray-400'}`}>
                {m.sub}
              </span>

              <div className="mt-2 text-xl font-extrabold font-mono flex items-baseline gap-1">
                <span>{count}</span>
                <span className="text-[11px] font-normal opacity-75">berkas</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* TOOLBAR FILTER & SEARCH */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari uraian belanja, No. SPM, PJ, atau catatan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        <div className="text-xs text-gray-600 font-medium self-end sm:self-auto">
          Menampilkan <span className="font-bold text-indigo-700">{filteredItems.length} berkas</span> di {activeMejaObj.label}
        </div>
      </div>

      {/* TABEL BERKAS PADA MEJA TERPILIH */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-[11px] font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-3 py-3 w-12 text-center">No</th>
                <th className="px-4 py-3">No. SPM / Tipe</th>
                <th className="px-4 py-3">Uraian Pertanggungjawaban SPJ</th>
                <th className="px-4 py-3">Penanggung Jawab (PJ)</th>
                <th className="px-4 py-3 text-right">Nilai Belanja</th>
                <th className="px-4 py-3 text-center">Status Kelengkapan</th>
                <th className="px-4 py-3 text-center">Posisi Fisik</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-3 py-3 text-center font-mono font-bold text-gray-800">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-mono font-bold text-indigo-700">{item.spm}</div>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-gray-100 text-gray-600 font-semibold font-mono">
                        {item.metode}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 leading-snug max-w-md">
                        {item.uraian}
                      </div>
                      {item.kekurangan && (
                        <div className="text-[11px] text-rose-700 font-medium mt-1 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 inline-block leading-relaxed">
                          <strong>Kekurangan:</strong> {item.kekurangan}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-semibold text-gray-800">{item.pj}</div>
                      {item.pengaju && item.pengaju !== item.pj && (
                        <div className="text-[10px] text-gray-400 mt-0.5">Pengaju: {item.pengaju}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-gray-900 whitespace-nowrap">
                      {formatRupiah(item.pengeluaran)}
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          item.kelengkapan === 'LENGKAP'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {item.kelengkapan}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {getPosisiLabel(item.posisi_berkas)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400 text-xs">
                    Tidak ada berkas yang tertahan di meja ini. Seluruh berkas telah diteruskan ke meja berikutnya.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default PosisiDokumenPage
