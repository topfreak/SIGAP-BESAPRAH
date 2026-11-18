import React, { useState } from 'react'
import {
  Calendar,
  CalendarDays,
  Filter,
  RotateCcw,
  ChevronDown,
  Sparkles,
  Search,
  Check
} from 'lucide-react'

// 12 Bulan Resmi Kalender DIPA BPS TA 2026
export const BULAN_BPS = [
  { value: 'semua', label: 'Semua Bulan', short: 'Semua' },
  { value: '01', label: 'Januari', short: 'Jan' },
  { value: '02', label: 'Februari', short: 'Feb' },
  { value: '03', label: 'Maret', short: 'Mar' },
  { value: '04', label: 'April', short: 'Apr' },
  { value: '05', label: 'Mei', short: 'Mei' },
  { value: '06', label: 'Juni', short: 'Jun' },
  { value: '07', label: 'Juli', short: 'Jul' },
  { value: '08', label: 'Agustus', short: 'Ags' },
  { value: '09', label: 'September', short: 'Sep' },
  { value: '10', label: 'Oktober', short: 'Okt' },
  { value: '11', label: 'November', short: 'Nov' },
  { value: '12', label: 'Desember', short: 'Des' },
]

/**
 * Komponen Filter Tanggal, Bulan & Periode Modern untuk SIGAP BESAPRAH
 * Desain modern, intuitif, dan responsif dengan preset bulan cepat & input rentang tanggal.
 */
export function DateRangeMonthFilter({
  selectedMonth = 'semua',
  onMonthChange,
  startDate = '',
  endDate = '',
  onDateRangeChange,
  onReset,
  totalCount = 0,
  filteredCount = 0,
  extraFilters = null,
  compact = false,
}) {
  const [showCustomDate, setShowCustomDate] = useState(Boolean(startDate || endDate))

  const hasFilterActive =
    (selectedMonth && selectedMonth !== 'semua') ||
    Boolean(startDate) ||
    Boolean(endDate)

  const handleReset = () => {
    if (onMonthChange) onMonthChange('semua')
    if (onDateRangeChange) onDateRangeChange({ startDate: '', endDate: '' })
    if (onReset) onReset()
  }

  const currentMonthLabel =
    BULAN_BPS.find((b) => b.value === selectedMonth)?.label || 'Semua Bulan'

  return (
    <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
      {/* Baris Atas: Selector Bulan Cepat & Status Ringkasan */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Preset Cepat Bulan (Chip / Pill Horisontal) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 custom-scrollbar text-xs">
          <div className="flex items-center gap-1 text-slate-500 font-semibold mr-1 flex-shrink-0 text-[11px] uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>Bulan:</span>
          </div>

          {BULAN_BPS.slice(0, 7).map((b) => {
            const isSelected = selectedMonth === b.value && !startDate && !endDate
            return (
              <button
                key={b.value}
                type="button"
                onClick={() => {
                  if (onMonthChange) onMonthChange(b.value)
                  if (onDateRangeChange) onDateRangeChange({ startDate: '', endDate: '' })
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80'
                }`}
              >
                {b.short}
              </button>
            )
          })}

          {/* Dropdown untuk Bulan Semester 2 (Jul - Des) */}
          <div className="relative inline-block flex-shrink-0">
            <select
              value={['07', '08', '09', '10', '11', '12'].includes(selectedMonth) ? selectedMonth : ''}
              onChange={(e) => {
                if (e.target.value) {
                  if (onMonthChange) onMonthChange(e.target.value)
                  if (onDateRangeChange) onDateRangeChange({ startDate: '', endDate: '' })
                }
              }}
              className={`text-xs px-2 py-1 rounded-lg border font-semibold cursor-pointer ${
                ['07', '08', '09', '10', '11', '12'].includes(selectedMonth)
                  ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              <option value="" disabled className="text-slate-700 bg-white">
                Bulan Lainnya...
              </option>
              {BULAN_BPS.slice(7).map((b) => (
                <option key={b.value} value={b.value} className="text-slate-800 bg-white">
                  {b.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Indikator Status & Tombol Reset */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-shrink-0 text-xs">
          {/* Badge Menampilkan Data */}
          <span className="text-[11px] font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/70">
            Menampilkan <strong className="text-indigo-700 font-bold">{filteredCount}</strong> dari{' '}
            <strong className="text-slate-700">{totalCount}</strong> data
          </span>

          {/* Tombol Toggle Rentang Tanggal Manual */}
          <button
            type="button"
            onClick={() => setShowCustomDate(!showCustomDate)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              showCustomDate || startDate || endDate
                ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5 text-indigo-600" />
            <span>Rentang Tanggal</span>
          </button>

          {/* Tombol Reset Cepat */}
          {hasFilterActive && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
              title="Reset seluruh filter tanggal"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Baris Kedua: Input Rentang Tanggal Kalender (Jika dibuka) */}
      {showCustomDate && (
        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 flex flex-wrap items-center gap-3 text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
              Dari Tanggal:
            </span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                if (onDateRangeChange) {
                  onDateRangeChange({ startDate: e.target.value, endDate })
                }
              }}
              className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-hidden font-medium"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
              Sampai Tanggal:
            </span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                if (onDateRangeChange) {
                  onDateRangeChange({ startDate, endDate: e.target.value })
                }
              }}
              className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-hidden font-medium"
            />
          </div>

          {/* Preset Periode Triwulan BPS */}
          <div className="flex items-center gap-1 ml-auto text-[11px]">
            <span className="text-slate-400 font-medium mr-1">Triwulan 2026:</span>
            <button
              type="button"
              onClick={() => {
                if (onDateRangeChange) onDateRangeChange({ startDate: '2026-01-01', endDate: '2026-03-31' })
              }}
              className="px-2 py-0.5 rounded bg-white hover:bg-indigo-50 border border-slate-200 text-slate-700 font-semibold cursor-pointer"
            >
              Triwulan I
            </button>
            <button
              type="button"
              onClick={() => {
                if (onDateRangeChange) onDateRangeChange({ startDate: '2026-04-01', endDate: '2026-06-30' })
              }}
              className="px-2 py-0.5 rounded bg-white hover:bg-indigo-50 border border-slate-200 text-slate-700 font-semibold cursor-pointer"
            >
              Triwulan II
            </button>
            <button
              type="button"
              onClick={() => {
                if (onDateRangeChange) onDateRangeChange({ startDate: '2026-07-01', endDate: '2026-09-30' })
              }}
              className="px-2 py-0.5 rounded bg-white hover:bg-indigo-50 border border-slate-200 text-slate-700 font-semibold cursor-pointer"
            >
              Triwulan III
            </button>
            <button
              type="button"
              onClick={() => {
                if (onDateRangeChange) onDateRangeChange({ startDate: '2026-10-01', endDate: '2026-12-31' })
              }}
              className="px-2 py-0.5 rounded bg-white hover:bg-indigo-50 border border-slate-200 text-slate-700 font-semibold cursor-pointer"
            >
              Triwulan IV
            </button>
          </div>
        </div>
      )}

      {/* Extra Filters (Jika ada filter tambahan dari parent seperti Metode / Kategori / Kecamatan) */}
      {extraFilters && (
        <div className="pt-1 border-t border-slate-100 flex flex-wrap items-center gap-2">
          {extraFilters}
        </div>
      )}
    </div>
  )
}

/**
 * Helper Utility untuk Memfilter Array Data berdasarkan Bulan & Range Tanggal
 * @param {Array} items
 * @param {Function} dateExtractor - function(item): returns 'YYYY-MM-DD' or Date
 * @param {string} selectedMonth - 'semua' | '01'..'12'
 * @param {string} startDate - 'YYYY-MM-DD'
 * @param {string} endDate - 'YYYY-MM-DD'
 */
export function filterByDateRangeAndMonth(items, dateExtractor, selectedMonth, startDate, endDate) {
  if (!items || !items.length) return []

  return items.filter((item) => {
    const rawDate = dateExtractor(item)
    if (!rawDate) {
      // Jika data tidak memiliki tanggal eksplisit tapi user memilih 'semua' dan no date range
      if ((!selectedMonth || selectedMonth === 'semua') && !startDate && !endDate) {
        return true
      }
      return false
    }

    const dateStr = String(rawDate).slice(0, 10) // 'YYYY-MM-DD'
    const itemMonth = dateStr.slice(5, 7) // 'MM'

    // 1. Cek Bulan jika dipilih (selain 'semua')
    if (selectedMonth && selectedMonth !== 'semua') {
      if (itemMonth !== selectedMonth) {
        return false
      }
    }

    // 2. Cek Tanggal Mulai (startDate)
    if (startDate) {
      if (dateStr < startDate) {
        return false
      }
    }

    // 3. Cek Tanggal Selesai (endDate)
    if (endDate) {
      if (dateStr > endDate) {
        return false
      }
    }

    return true
  })
}

/**
 * Helper Ekstraksi Tanggal Riil Dokumen SPJ BPS
 * Mengambil tgl_sp2d, atau mengekstraksi bulan dari teks uraian jika tgl_sp2d belum terbit.
 */
export function getSpjDate(item) {
  if (!item) return ''
  if (item.tgl_sp2d) return item.tgl_sp2d
  if (item.tanggal_mulai) return item.tanggal_mulai
  if (item.waktu) return item.waktu.slice(0, 10)
  if (item.created_at) return item.created_at.slice(0, 10)

  const u = (item.uraian || item.nama_kegiatan || item.kegiatan || '').toLowerCase()
  if (u.includes('januari') || u.includes('jan')) return '2026-01-15'
  if (u.includes('februari') || u.includes('feb')) return '2026-02-15'
  if (u.includes('maret') || u.includes('mar')) return '2026-03-15'
  if (u.includes('april') || u.includes('apr')) return '2026-04-15'
  if (u.includes('mei')) return '2026-05-15'
  if (u.includes('juni') || u.includes('jun')) return '2026-06-15'
  return '2026-02-20'
}

export default DateRangeMonthFilter
