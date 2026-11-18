import React, { useState } from 'react'
import { Database, Search, Download, Filter, Layers, CheckCircle2 } from 'lucide-react'
import { MASTER_AKUN_BPS, KATEGORI_MAK } from '../../data/bpsMakData'

export function MasterDataPage() {
  const [selectedKategori, setSelectedKategori] = useState('semua')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredMaks = MASTER_AKUN_BPS.filter((mak) => {
    const matchesKat = selectedKategori === 'semua' || mak.kategori_id === selectedKategori
    const matchesSearch =
      mak.kode.includes(searchTerm) ||
      mak.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mak.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesKat && matchesSearch
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          Master Data
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Daftar Klasifikasi Mata Anggaran Kegiatan (MAK) dan Dokumen Persyaratan DIPA BPS
        </p>
      </div>

      {/* Filter Kategori & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedKategori('semua')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedKategori === 'semua'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Semua Kategori ({MASTER_AKUN_BPS.length})
          </button>
          {KATEGORI_MAK.map((kat) => (
            <button
              key={kat.id}
              onClick={() => setSelectedKategori(kat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedKategori === kat.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {kat.nama}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kode akun atau nama..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-200/90 rounded-xl shadow-xs focus:outline-none focus:ring-1 focus:ring-indigo-600 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Grid Cards Master Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMaks.map((mak) => (
          <div
            key={mak.id}
            className="bg-white border border-gray-200/90 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-indigo-500/50 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-lg">
                  {mak.kode}
                </span>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  {mak.kategori_id}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1.5">
                {mak.nama}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                {mak.deskripsi}
              </p>
            </div>

            <div className="border-t border-gray-100 pt-3">
              <span className="text-[11px] font-semibold text-gray-600 block mb-2">
                Persyaratan Fisik ({mak.syarat?.length || 0} berkas):
              </span>
              <ul className="space-y-1">
                {mak.syarat?.slice(0, 3).map((s, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-[11px] text-gray-600 truncate">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                    <span className="truncate">{s.nama}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MasterDataPage

