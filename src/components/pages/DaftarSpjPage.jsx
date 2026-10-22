import React, { useState } from 'react'
import { 
  Search, 
  Filter, 
  Building2, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  PlusCircle, 
  Printer, 
  FileText,
  MapPin,
  ArrowLeft
} from 'lucide-react'
import { useSpj } from '../../context/SpjContext'
import { useAuth } from '../../context/AuthContext'
import { useNavigation } from '../../context/NavigationContext'
import { TIM_KERJA_BPS, getTimKerjaById } from '../../data/bpsStructure'
import { TrafficLightBadge } from '../common/TrafficLightBadge'

export function DaftarSpjPage() {
  const { spjList } = useSpj()
  const { currentUser } = useAuth()
  const { navigateTo, pageParams } = useNavigation()

  // State Filter & Pencarian
  const [filterStatus, setFilterStatus] = useState('semua')
  const [filterTimKerja, setFilterTimKerja] = useState('semua')
  const [filterMeja, setFilterMeja] = useState(pageParams?.filterMeja || 'semua')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter daftar SPJ
  const filteredList = spjList.filter((item) => {
    const matchStatus = filterStatus === 'semua' || item.status_kelengkapan === filterStatus
    const matchTimKerja = filterTimKerja === 'semua' || item.tim_kerja === filterTimKerja
    const matchMeja = filterMeja === 'semua' || item.posisi_berkas === filterMeja
    const matchSearch =
      item.nama_kegiatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kode_akun.includes(searchQuery) ||
      (item.nama_akun && item.nama_akun.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.pemohon && item.pemohon.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.nama_pj && item.nama_pj.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.metode_bayar && item.metode_bayar.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchStatus && matchTimKerja && matchMeja && matchSearch
  })

  const formatRupiah = (nominal) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(nominal)
  }

  const namaMeja = {
    tim_kerja: 'Tim Kerja (Pengusul)',
    admin_tu: 'Meja Tata Usaha (Pemeriksaan Awal)',
    ppk: 'Meja PPK (Komitmen Anggaran)',
    bendahara: 'Meja Bendahara (Pajak & Kuitansi)',
    ppspm: 'Meja PPSPM (Penerbitan SPM)',
    selesai: 'Selesai (SP2D Terbit / Arsip)',
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      
      {/* 1. SECTION: HEADER HALAMAN DENGAN TOMBOL AKSI */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateTo('beranda')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda</span>
            </button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Pelacakan & Daftar Berkas SPJ
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            Pantau pergerakan fisik seluruh dokumen pertanggungjawaban kegiatan sensus dan survei di lingkungan BPS.
          </p>
        </div>

        {/* Tombol Buat Pengajuan Baru */}
        {(currentUser?.role === 'tim_kerja' || currentUser?.role === 'admin_tu') && (
          <button
            onClick={() => navigateTo('buat_spj')}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all cursor-pointer flex-shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Buat Pengajuan SPJ Baru</span>
          </button>
        )}
      </section>

      {/* 2. SECTION: FILTER & PENCARIAN TERSTRUKTUR (BERSIH & JELAS BATASNYA) */}
      <section className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-5">
        
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-3">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Filter & Pencarian Dokumen</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Filter Status Lampu Lalu Lintas */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Status Kelengkapan:
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="semua">Semua Status (Merah, Kuning, Hijau)</option>
              <option value="hijau">🟢 Hijau (Selesai / SP2D Cair)</option>
              <option value="kuning">🟡 Kuning (Sedang Diverifikasi)</option>
              <option value="merah">🔴 Merah (Perlu Perbaikan Fisik)</option>
            </select>
          </div>

          {/* Filter Meja Fisik */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Posisi Meja Fisik:
            </label>
            <select
              value={filterMeja}
              onChange={(e) => setFilterMeja(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="semua">Semua Meja Kerja (1 - 5)</option>
              <option value="tim_kerja">1. Tim Kerja (Pengusul / Revisi)</option>
              <option value="admin_tu">2. Tata Usaha (Pemeriksaan Awal)</option>
              <option value="ppk">3. PPK (Komitmen Anggaran)</option>
              <option value="bendahara">4. Bendahara (Pajak & Kuitansi)</option>
              <option value="ppspm">5. PPSPM (Penerbitan SPM)</option>
              <option value="selesai">6. Selesai (Arsip Kas Negara)</option>
            </select>
          </div>

          {/* Filter Asal Tim Kerja BPS */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Asal Tim Kerja BPS:
            </label>
            <select
              value={filterTimKerja}
              onChange={(e) => setFilterTimKerja(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="semua">Semua Fungsi Teknis BPS</option>
              {TIM_KERJA_BPS.map((tim) => (
                <option key={tim.id} value={tim.id}>
                  {tim.nama} ({tim.kode})
                </option>
              ))}
            </select>
          </div>

          {/* Pencarian Kata Kunci */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Pencarian Kata Kunci:
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama kegiatan, MAK, PJ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 3. SECTION: DAFTAR BERKAS SPJ (LEGA, BERSIH, PEMBATAS VISUAL JELAS) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>Menampilkan <strong>{filteredList.length}</strong> dari <strong>{spjList.length}</strong> total berkas SPJ</span>
          {(filterStatus !== 'semua' || filterTimKerja !== 'semua' || filterMeja !== 'semua' || searchQuery) && (
            <button
              onClick={() => {
                setFilterStatus('semua')
                setFilterTimKerja('semua')
                setFilterMeja('semua')
                setSearchQuery('')
              }}
              className="text-blue-600 font-bold hover:underline cursor-pointer"
            >
              Reset Semua Filter
            </button>
          )}
        </div>

        {filteredList.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Tidak Ada Berkas yang Sesuai Filter
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Silakan ubah kriteria pencarian atau pilih filter status dan meja kerja yang lain.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredList.map((spj) => (
              <div
                key={spj.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                {/* Informasi Utama Berkas */}
                <div className="space-y-2.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${getTimKerjaById(spj.tim_kerja).warnaBadge} flex items-center gap-1`}>
                      <Building2 className="w-3 h-3" />
                      <span>{getTimKerjaById(spj.tim_kerja).nama}</span>
                    </span>
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200/80">
                      MAK {spj.kode_akun}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {spj.nama_akun}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-mono text-slate-400">
                      {spj.id}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      spj.metode_bayar === 'GUP'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                    }`}>
                      {spj.metode_bayar === 'GUP' ? 'GUP' : 'LS'}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {spj.nama_kegiatan}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span>PJ Kegiatan: <strong className="text-slate-800">{spj.nama_pj || spj.pemohon}</strong></span>
                    <span>Pengusul: <strong className="text-slate-700">{spj.pemohon}</strong></span>
                    <span>Nominal: <strong className="text-slate-900 font-semibold">{formatRupiah(spj.nominal_pengajuan)}</strong></span>
                    {spj.nomor_sp2d && (
                      <span className="text-emerald-700 font-semibold font-mono">
                        No. SP2D: {spj.nomor_sp2d}
                      </span>
                    )}
                  </div>

                  {/* Lokasi Fisik Dokumen Saat Ini */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span>Lokasi Berkas Fisik: <strong className="text-slate-900 font-semibold">{namaMeja[spj.posisi_berkas] || spj.posisi_berkas}</strong></span>
                  </div>
                </div>

                {/* Status Lampu & Tombol Tindakan */}
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 flex-shrink-0">
                  <TrafficLightBadge status={spj.status_kelengkapan} />
                  
                  <button
                    onClick={() => navigateTo('detail_spj', { selectedSpjId: spj.id })}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-all cursor-pointer shadow-xs group"
                  >
                    <span>Periksa Berkas</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  )
}

export default DaftarSpjPage
