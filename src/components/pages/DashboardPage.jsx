import React, { useState } from 'react'
import { 
  FileText, 
  Search, 
  PlusCircle, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  MapPin, 
  Sparkles,
  X,
  Inbox,
  Building2
} from 'lucide-react'
import { useNavigation } from '../../context/NavigationContext'
import { useAuth } from '../../context/AuthContext'
import { useSpj } from '../../context/SpjContext'
import { TIM_KERJA_BPS, getTimKerjaById } from '../../data/bpsStructure'
import { TrafficLightBadge } from '../common/TrafficLightBadge'

export function DashboardPage() {
  const { navigateTo } = useNavigation()
  const { currentUser } = useAuth()
  const { spjList, getMetrics } = useSpj()

  const [filterStatus, setFilterStatus] = useState('all')
  const [filterHanyaMejaSaya, setFilterHanyaMejaSaya] = useState(false)
  const [filterTimKerja, setFilterTimKerja] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const stats = getMetrics()

  // Filter daftar berkas
  const filteredList = spjList.filter((item) => {
    // 1. Filter Meja Saya jika aktif
    if (filterHanyaMejaSaya && currentUser) {
      if (item.posisi_berkas !== currentUser.role) {
        return false
      }
    }

    // 2. Filter Status Lampu Lalu Lintas
    const matchStatus = filterStatus === 'all' || item.status_kelengkapan === filterStatus

    // 3. Filter Asal Tim Kerja / Fungsi Teknis
    const matchTimKerja = filterTimKerja === 'all' || item.tim_kerja === filterTimKerja

    // 4. Filter Pencarian
    const matchSearch =
      item.nama_kegiatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kode_akun.includes(searchQuery) ||
      (item.nama_akun && item.nama_akun.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.pemohon && item.pemohon.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.nama_pj && item.nama_pj.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.metode_bayar && item.metode_bayar.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchStatus && matchTimKerja && matchSearch
  })

  // Hitung jumlah berkas yang sedang menunggu di meja pengguna saat ini
  const berkasDiMejaSaya = currentUser
    ? spjList.filter((s) => s.posisi_berkas === currentUser.role).length
    : 0

  const formatRupiah = (nominal) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(nominal)
  }

  // Pemetaan nama meja fisik yang ramah
  const namaMeja = {
    tim_kerja: 'Tim Kerja (Pengusul)',
    admin_tu: 'Meja Tata Usaha (Pemeriksaan Awal)',
    ppk: 'Meja PPK (Pejabat Pembuat Komitmen)',
    bendahara: 'Meja Bendahara (Pajak & Kuitansi)',
    ppspm: 'Meja PPSPM (Penerbitan SPM)',
    selesai: 'Selesai (SP2D Terbit / Arsip)',
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* 1. Header Sambutan yang Ramah & Sederhana */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Sistem Pemantauan Berkas SPJ BPS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Halo, {currentUser?.nama_lengkap || 'Rekan BPS'} 👋
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Pantau posisi fisik berkas SPJ Anda secara langsung tanpa harus bolak-balik bertanya dari meja ke meja.
          </p>
        </div>

        {/* Tombol Aksi Utama yang Sangat Jelas */}
        <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3">
          {berkasDiMejaSaya > 0 && (
            <button
              onClick={() => setFilterHanyaMejaSaya(!filterHanyaMejaSaya)}
              className={`inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all cursor-pointer border ${
                filterHanyaMejaSaya
                  ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-4 ring-amber-200'
                  : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 shadow-xs'
              }`}
            >
              <Inbox className="w-4 h-4" />
              <span>Menunggu di Meja Saya ({berkasDiMejaSaya})</span>
            </button>
          )}

          <button
            onClick={() => navigateTo('buat_spj')}
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg transition-all cursor-pointer"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Ajukan SPJ Baru</span>
          </button>
        </div>
      </div>

      {/* 2. 4 Kartu Status Lampu Lalu Lintas (Bisa Diklik Langsung untuk Memfilter) */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
          Pilih Status untuk Menyaring Berkas:
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          
          {/* Kartu: Semua Berkas */}
          <div
            onClick={() => setFilterStatus('all')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              filterStatus === 'all'
                ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-400/40 shadow-xs'
                : 'bg-white border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Semua Berkas</span>
              <FileText className="w-4 h-4 text-slate-400" />
            </div>
            <div className="mt-2 text-3xl font-black text-slate-900">{stats.total}</div>
            <p className="mt-1 text-xs text-slate-500">Tampilkan seluruh pengajuan</p>
          </div>

          {/* Kartu: 🔴 Perlu Perbaikan */}
          <div
            onClick={() => setFilterStatus('merah')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              filterStatus === 'merah'
                ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-400/40 shadow-xs'
                : 'bg-white border-rose-200 hover:border-rose-300'
            }`}
          >
            <div className="flex items-center justify-between text-rose-700 text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                Perlu Perbaikan
              </span>
              <AlertCircle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="mt-2 text-3xl font-black text-rose-700">{stats.merah}</div>
            <p className="mt-1 text-xs text-rose-600/80">Ada berkas fisik yang kurang</p>
          </div>

          {/* Kartu: 🟡 Sedang Diproses */}
          <div
            onClick={() => setFilterStatus('kuning')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              filterStatus === 'kuning'
                ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400/40 shadow-xs'
                : 'bg-white border-amber-200 hover:border-amber-300'
            }`}
          >
            <div className="flex items-center justify-between text-amber-800 text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                Sedang Diproses
              </span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="mt-2 text-3xl font-black text-amber-800">{stats.kuning}</div>
            <p className="mt-1 text-xs text-amber-700/80">Sedang diverifikasi di meja petugas</p>
          </div>

          {/* Kartu: 🟢 Sudah Selesai */}
          <div
            onClick={() => setFilterStatus('hijau')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              filterStatus === 'hijau'
                ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/40 shadow-xs'
                : 'bg-white border-emerald-200 hover:border-emerald-300'
            }`}
          >
            <div className="flex items-center justify-between text-emerald-800 text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Sudah Selesai
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-3xl font-black text-emerald-800">{stats.hijau}</div>
            <p className="mt-1 text-xs text-emerald-700/80">SP2D sudah terbit & cair</p>
          </div>

        </div>
      </div>

      {/* 3. Kotak Pencarian yang Sangat Sederhana & Ramah */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400 flex-shrink-0 ml-1" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari berdasarkan nama kegiatan, kode MAK, atau nama pengusul..."
          className="w-full text-sm sm:text-base placeholder-slate-400 text-slate-800 focus:outline-none bg-transparent"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            title="Hapus pencarian"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 3b. Filter Cepat Berdasarkan Fungsi / Tim Kerja BPS */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-2 overflow-x-auto scrollbar-none">
        <div className="text-xs font-bold text-slate-500 whitespace-nowrap flex items-center gap-1.5 pl-1 pr-2 border-r border-slate-200">
          <Building2 className="w-3.5 h-3.5 text-blue-600" />
          <span>Fungsi BPS:</span>
        </div>

        <button
          onClick={() => setFilterTimKerja('all')}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
            filterTimKerja === 'all'
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          Semua Tim
        </button>

        {TIM_KERJA_BPS.map((tim) => (
          <button
            key={tim.id}
            onClick={() => setFilterTimKerja(tim.id)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
              filterTimKerja === tim.id
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {tim.nama.replace('Tim Statistik ', '').replace('Tim ', '')}
          </button>
        ))}
      </div>

      {/* 4. Daftar Berkas SPJ dalam Kartu Modern Minimalis */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="text-sm font-bold text-slate-800">
            Daftar Berkas SPJ ({filteredList.length} Ditemukan)
            {filterHanyaMejaSaya && (
              <span className="ml-2 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Khusus Meja: {currentUser?.jabatan}
              </span>
            )}
            {filterTimKerja !== 'all' && (
              <span className="ml-2 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                Tim: {getTimKerjaById(filterTimKerja).nama}
              </span>
            )}
          </div>
          {(filterStatus !== 'all' || filterHanyaMejaSaya || filterTimKerja !== 'all') && (
            <button
              onClick={() => {
                setFilterStatus('all')
                setFilterHanyaMejaSaya(false)
                setFilterTimKerja('all')
              }}
              className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
            >
              Hapus Semua Filter
            </button>
          )}
        </div>

        <div className="space-y-3.5">
          {filteredList.map((spj) => (
            <div
              key={spj.id}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              {/* Info Berkas */}
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

                {/* Lokasi Fisik Berkas */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  <span>Posisi Berkas Fisik: <strong className="text-blue-900">{namaMeja[spj.posisi_berkas] || spj.posisi_berkas}</strong></span>
                </div>

                {/* Peringatan jika status Perlu Perbaikan (Merah) */}
                {spj.status_kelengkapan === 'merah' && spj.catatan_revisi && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold">Catatan Petugas Pemeriksa:</strong> {spj.catatan_revisi}
                    </div>
                  </div>
                )}
              </div>

              {/* Status Visual & Tombol Buka */}
              <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 flex-shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                <TrafficLightBadge status={spj.status_kelengkapan} size="md" />

                <button
                  onClick={() => navigateTo('detail_spj', { selectedSpjId: spj.id })}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-2xs"
                >
                  <span>Buka & Cek Berkas</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {filteredList.length === 0 && (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200/80 space-y-2">
              <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="text-base font-bold text-slate-700">Tidak ada berkas yang cocok</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Silakan coba ubah kata kunci pencarian atau klik tombol "Semua Berkas" di atas.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default DashboardPage
