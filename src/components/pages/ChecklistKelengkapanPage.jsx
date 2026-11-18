import React, { useState, useEffect } from 'react'
import {
  CheckSquare,
  FileCode,
  CheckCircle2,
  AlertCircle,
  FileText,
  Layers,
  ChevronRight,
  Download,
  BookOpen,
  UserCheck,
  Search,
  Filter
} from 'lucide-react'
import { REAL_REKON_SE } from '../../data/bpsRealData'
import { MASTER_AKUN_BPS } from '../../data/bpsMakData'
import * as XLSX from 'xlsx'

export function ChecklistKelengkapanPage({ mode = 'checklist_kelengkapan' }) {
  const normalizeSubTab = (m) => {
    if (m === 'jenis_dokumen') return 'mak'
    return 'checklist'
  }

  const [activeSubTab, setActiveSubTab] = useState(normalizeSubTab(mode))
  const [activeMakCode, setActiveMakCode] = useState('521211')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    setActiveSubTab(normalizeSubTab(mode))
  }, [mode])

  // Cari objek MAK aktif dengan aman
  const currentMak =
    MASTER_AKUN_BPS.find((m) => m.kode_akun === activeMakCode || m.kode === activeMakCode) ||
    MASTER_AKUN_BPS[0]

  // Filter tabel Rekon SE2026
  const filteredRekon = REAL_REKON_SE.filter(
    (item) =>
      (item.pj_kuda && item.pj_kuda.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.keterangan && item.keterangan.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleExportRekon = () => {
    const ws = XLSX.utils.json_to_sheet(REAL_REKON_SE)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Rekon 2 SE2026')
    XLSX.writeFile(wb, 'Checklist_Kelengkapan_SPJ_BPS_Sambas.xlsx')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2.5">
            <CheckSquare className="w-7 h-7 text-indigo-600" />
            <span>
              {activeSubTab === 'mak'
                ? 'Standar Dokumen Persyaratan (12 MAK)'
                : 'Checklist Kelengkapan Fisik Rekon SE2026'}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {activeSubTab === 'mak'
              ? 'Standar kelengkapan bukti fisik SPJ DIPA BPS Kabupaten Sambas (Satker 6101 / DIPA 1301)'
              : 'Verifikasi berkas fisik lembar pertanggungjawaban per Penanggung Jawab (PJ Kuda) dari berkas riil Kelengkapan SPJ.xlsx'}
          </p>
        </div>

        {/* Toggle Sub Tab */}
        <div className="flex items-center p-1 bg-gray-100 rounded-xl border border-gray-200 text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveSubTab('checklist')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'checklist'
                ? 'bg-white text-indigo-700 shadow-xs font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Matriks Rekon SE2026</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('mak')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'mak'
                ? 'bg-white text-indigo-700 shadow-xs font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>Standar 12 MAK Belanja</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: STANDAR DOKUMEN 12 MAK */}
      {activeSubTab === 'mak' && (
        <div className="space-y-5">
          {/* Tabs Pilihan Akun MAK (Aman dari error undefined .split) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 custom-scrollbar">
            {MASTER_AKUN_BPS.map((mak) => {
              const code = mak.kode_akun || mak.kode || ''
              const title = mak.nama_akun || mak.nama || mak.singkatan || ''
              const isSelected = activeMakCode === code

              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setActiveMakCode(code)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-mono font-bold mr-1.5">{code}</span>
                  <span>{title.split(' ')[1] || title}</span>
                </button>
              )
            })}
          </div>

          {/* Kotak Rincian Syarat Fisik Akun Terpilih */}
          {currentMak && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-5">
              <div className="border-b border-gray-100 pb-4">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-md">
                    MAK {currentMak.kode_akun || currentMak.kode}
                  </span>
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded-md">
                    Kategori {currentMak.kategori_id || 'Belanja Operasional'}
                  </span>
                  {currentMak.singkatan && (
                    <span className="text-[11px] font-medium text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded-md">
                      {currentMak.singkatan}
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-bold text-gray-900">
                  {currentMak.nama_akun || currentMak.nama}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                  {currentMak.deskripsi}
                </p>

                {currentMak.kegiatan_contoh && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-xl text-xs text-gray-600 border border-gray-100">
                    <span className="font-bold text-gray-800 block mb-0.5">Contoh Kegiatan di BPS Sambas:</span>
                    <span>{currentMak.kegiatan_contoh}</span>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Daftar Dokumen Fisik Wajib Lengkap:
                  </h3>
                  <span className="text-xs text-gray-500 font-medium">
                    Total {currentMak.syarat?.length || 0} berkas persyaratan
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentMak.syarat &&
                    currentMak.syarat.map((s, idx) => {
                      const namaSyarat = typeof s === 'string' ? s : s?.nama_syarat || 'Persyaratan Berkas'
                      const isWajib = typeof s === 'object' ? s?.is_wajib !== false : true

                      return (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl border border-gray-200/90 bg-gray-50/50 flex items-start gap-3 hover:border-indigo-300 transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-bold text-gray-900 leading-snug">
                                {namaSyarat}
                              </span>
                              {isWajib && (
                                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200 flex-shrink-0">
                                  Wajib
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-gray-500 block mt-1">
                              Wajib dilampirkan dalam map bundel fisik SPJ sebelum paraf PPK.
                            </span>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>

              {currentMak.aturan_pajak && (
                <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900">
                  <span className="font-bold block mb-1">Ketentuan Pemotongan Pajak & Kuitansi:</span>
                  <p className="leading-relaxed">{currentMak.aturan_pajak}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: MATRIKS REKON SE2026 (KOLOM TIDAK ADA YANG KOSONG LAGI) */}
      {activeSubTab === 'checklist' && (
        <div className="space-y-4">
          {/* Toolbar Search & Export */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari Penanggung Jawab (PJ Kuda) atau catatan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs text-gray-500 font-medium">
                {filteredRekon.length} Berkas Pemeriksaan
              </span>
              <button
                type="button"
                onClick={handleExportRekon}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Excel</span>
              </button>
            </div>
          </div>

          {/* Tabel Matriks Rekon SE2026 */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-gray-50 text-[11px] font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-3 w-12 text-center">No</th>
                    <th className="px-4 py-3 min-w-[160px]">Penanggung Jawab (PJ Kuda)</th>
                    <th className="px-3 py-3 text-center">Undangan</th>
                    <th className="px-3 py-3 text-center">Daftar Hadir</th>
                    <th className="px-3 py-3 text-center">Notulen</th>
                    <th className="px-3 py-3 text-center">Surat Pesanan</th>
                    <th className="px-3 py-3 text-center">Surtu</th>
                    <th className="px-3 py-3 text-center">SPD</th>
                    <th className="px-3 py-3 text-center">Kuitansi</th>
                    <th className="px-3 py-3 text-center">BAST</th>
                    <th className="px-4 py-3 min-w-[220px]">Catatan Verifikasi Berkas Fisik</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRekon.map((item, idx) => {
                    const isLengkap = item.keterangan === 'Lengkap'
                    return (
                      <tr key={idx} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-3 py-3 text-center font-mono font-bold text-gray-800">
                          {item.no || idx + 1}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-gray-900 flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                            <span>{item.pj_kuda || `Petugas ${idx + 1}`}</span>
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono block mt-0.5">
                            Rekon 2 SE2026
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">{renderIconCheck(item.undangan)}</td>
                        <td className="px-3 py-3 text-center">{renderIconCheck(item.daftar_hadir)}</td>
                        <td className="px-3 py-3 text-center">{renderIconCheck(item.notulen)}</td>
                        <td className="px-3 py-3 text-center">{renderIconCheck(item.surat_pesanan)}</td>
                        <td className="px-3 py-3 text-center">{renderIconCheck(item.surtu)}</td>
                        <td className="px-3 py-3 text-center">{renderIconCheck(item.spd)}</td>
                        <td className="px-3 py-3 text-center">{renderIconCheck(item.kuitansi)}</td>
                        <td className="px-3 py-3 text-center">{renderIconCheck(item.bast)}</td>
                        <td className="px-4 py-3">
                          {isLengkap ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Lengkap (Siap SP2D)</span>
                            </span>
                          ) : (
                            <div className="text-[11px] text-rose-700 bg-rose-50/80 p-2 rounded-lg border border-rose-200/80 whitespace-pre-line leading-relaxed">
                              {item.keterangan}
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function renderIconCheck(val) {
  if (val === true || val === 'Ada' || val === 'Lengkap') {
    return (
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold" title="Ada & Sah">
        ✓
      </span>
    )
  }
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-400 text-xs font-bold" title="Tidak Ada">
      -
    </span>
  )
}

export default ChecklistKelengkapanPage
