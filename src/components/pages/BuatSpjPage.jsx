import React, { useState } from 'react'
import { 
  ArrowLeft, 
  ArrowRight, 
  Check,
  Building2,
  UserCheck,
  CreditCard,
  Wallet,
  Info,
  ShieldCheck,
  FileCheck2,
  Layers,
  Sparkles
} from 'lucide-react'
import { useNavigation } from '../../context/NavigationContext'
import { useAuth } from '../../context/AuthContext'
import { useSpj } from '../../context/SpjContext'
import { TIM_KERJA_BPS } from '../../data/bpsStructure'
import { KATEGORI_MAK, METODE_PEMBAYARAN_BPS, getMakByIdOrKode } from '../../data/bpsMakData'

export function BuatSpjPage() {
  const { navigateTo, goBack } = useNavigation()
  const { currentUser } = useAuth()
  const { masterAkunList, tambahPengajuan } = useSpj()

  // State Form
  const [selectedKategori, setSelectedKategori] = useState('semua')
  const [selectedMakId, setSelectedMakId] = useState(masterAkunList[0]?.id || 'mak-521213')
  const [selectedTimKerja, setSelectedTimKerja] = useState(currentUser?.tim_kerja || 'sosial')
  const [namaPj, setNamaPj] = useState(currentUser?.nama_lengkap || '')
  const [namaKegiatan, setNamaKegiatan] = useState('')
  const [metodeBayar, setMetodeBayar] = useState('LS')
  const [nominalPengajuan, setNominalPengajuan] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filter daftar MAK berdasarkan dropdown kategori
  const availableMakList = selectedKategori === 'semua'
    ? masterAkunList
    : masterAkunList.filter((m) => m.kategori_id === selectedKategori)

  // MAK aktif yang sedang dipilih
  const activeMak = masterAkunList.find((m) => m.id === selectedMakId) || availableMakList[0] || masterAkunList[0]

  // Handler jika ganti kategori: otomatis set MAK pertama di kategori tsb jika MAK aktif di luar kategori
  const handleKategoriChange = (newKat) => {
    setSelectedKategori(newKat)
    if (newKat !== 'semua') {
      const firstInKat = masterAkunList.find((m) => m.kategori_id === newKat)
      if (firstInKat) {
        setSelectedMakId(firstInKat.id)
      }
    }
  }

  const formatRupiahPreview = (val) => {
    if (!val) return 'Rp 0'
    const num = Number(val)
    if (isNaN(num)) return 'Rp 0'
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!namaKegiatan.trim()) {
      alert('Mohon isi nama kegiatan survei/sensus!')
      return
    }
    if (!nominalPengajuan || Number(nominalPengajuan) <= 0) {
      alert('Mohon isi nominal pengajuan dengan angka yang valid!')
      return
    }

    setIsSubmitting(true)

    const newSpj = await tambahPengajuan({
      master_akun_id: activeMak.id,
      nama_kegiatan: namaKegiatan.trim(),
      tim_kerja: selectedTimKerja,
      nama_pj: namaPj.trim() || currentUser?.nama_lengkap || 'PJ Kegiatan',
      metode_bayar: metodeBayar,
      nominal_pengajuan: Number(nominalPengajuan),
      nominal_rpd: Number(nominalPengajuan),
    })

    setIsSubmitting(false)

    if (newSpj) {
      alert(
        `Pengajuan SPJ "${newSpj.nama_kegiatan}" berhasil dicatat!\n\n` +
        `Nomor Berkas: ${newSpj.id}\n` +
        `Posisi Berkas Fisik: Meja Tata Usaha (Admin TU)\n\n` +
        `Silakan cetak lembar kendali A4 dan bawa dokumen fisik ke loket Tata Usaha.`
      )
      navigateTo('daftar_spj')
    } else {
      alert('Gagal menyimpan pengajuan. Silakan coba kembali.')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Tombol Navigasi Kembali */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => goBack('beranda')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-2xs hover:border-slate-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>
      </div>

      {/* Header Formulir */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
          <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
          <span>Perekaman Berkas Fisik Baru</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Formulir Pengajuan SPJ Kegiatan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl">
          Isi seluruh identitas pengajuan secara terstruktur di bawah ini. Setelah disimpan, sistem akan menerbitkan lembar kendali A4 untuk ditempel pada bagian depan map berkas fisik.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* ============================================================== */}
        {/* BAGIAN 1: IDENTITAS ASAL TIM KERJA & PENANGGUNG JAWAB (PJ)      */}
        {/* ============================================================== */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
              1
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Bagian 1: Identitas Pengusul & Tim Kerja BPS
              </h2>
              <p className="text-xs text-slate-500">
                Fungsi teknis BPS yang bertanggung jawab atas kegiatan survei / sensus.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dropdown Asal Tim Kerja / Fungsi Teknis */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Asal Tim Kerja / Fungsi Teknis</span>
                <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedTimKerja}
                onChange={(e) => setSelectedTimKerja(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-slate-800 bg-white shadow-2xs"
              >
                {TIM_KERJA_BPS.map((tim) => (
                  <option key={tim.id} value={tim.id}>
                    {tim.nama} ({tim.kode})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500">
                Pilih fungsi teknis atau bagian yang bertanggung jawab atas kegiatan ini.
              </p>
            </div>

            {/* Nama Penanggung Jawab (PJ) Kegiatan */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span>Nama Penanggung Jawab (PJ) Kegiatan / Ketua Tim</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={namaPj}
                onChange={(e) => setNamaPj(e.target.value)}
                placeholder="Contoh: Ahmad Fauzi, S.Tr.Stat."
                required
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800 bg-white shadow-2xs"
              />
              <p className="text-[11px] text-slate-500">
                Nama ketua tim atau pejabat penanggung jawab teknis pelaksanaan kegiatan di BPS.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* BAGIAN 2: KLASIFIKASI ANGGARAN (MAK) & METODE PENCAIRAN         */}
        {/* ============================================================== */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
              2
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Bagian 2: Klasifikasi Anggaran (MAK) & Metode Pembayaran
              </h2>
              <p className="text-xs text-slate-500">
                Pilih jenis belanja sesuai kode akun DIPA BPS dan mekanisme pencairan dananya.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            
            {/* 2 Dropdown Bersebelahan: Kategori & MAK (Sesuai Permintaan Dropdown Modern & Bersih) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Dropdown 1: Kategori Belanja */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Kategori Belanja BPS</span>
                </label>
                <select
                  value={selectedKategori}
                  onChange={(e) => handleKategoriChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-slate-800 bg-white shadow-2xs"
                >
                  {KATEGORI_MAK.map((kat) => (
                    <option key={kat.id} value={kat.id}>
                      {kat.label}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500">
                  Filter pilihan MAK untuk mempercepat pencarian.
                </p>
              </div>

              {/* Dropdown 2: Pilihan Kode Akun MAK */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span>Mata Anggaran Kegiatan (MAK)</span>
                  <span className="text-rose-500">*</span>
                </label>
                <select
                  value={activeMak.id}
                  onChange={(e) => setSelectedMakId(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-blue-400 bg-blue-50/40 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold text-blue-900 shadow-2xs"
                >
                  {availableMakList.map((mak) => (
                    <option key={mak.id} value={mak.id}>
                      MAK {mak.kode_akun} - {mak.nama_akun} ({mak.singkatan})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500">
                  Tersedia <strong>{availableMakList.length} akun MAK</strong> pada kategori ini.
                </p>
              </div>

            </div>

            {/* PANEL INFORMASI LENGKAP MAK TERPILIH (TERSTRUKTUR, ELEGAN & TIDAK ADA TEKS MENGAMBANG) */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-black px-3 py-1 rounded-xl bg-blue-600 text-white shadow-xs">
                    MAK {activeMak.kode_akun}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {activeMak.nama_akun}
                  </h3>
                </div>
                <span className="text-xs font-semibold text-blue-700 bg-blue-100/70 px-2.5 py-1 rounded-lg self-start sm:self-auto">
                  {activeMak.singkatan}
                </span>
              </div>

              {/* Deskripsi MAK */}
              <p className="text-xs text-slate-600 leading-relaxed">
                {activeMak.deskripsi}
              </p>

              {/* BOX CONTOH KEGIATAN RIIL (DITEMPATKAN DI DALAM CONTAINER RAPI) */}
              {activeMak.kegiatan_contoh && (
                <div className="p-3.5 rounded-xl bg-white border border-blue-200 text-xs text-blue-950 flex items-start gap-2.5 shadow-2xs">
                  <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold text-[11px] uppercase tracking-wider text-blue-800">
                      Contoh Kegiatan Riil di BPS:
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {activeMak.kegiatan_contoh}
                    </p>
                  </div>
                </div>
              )}

              {/* BOX KETENTUAN PERPAJAKAN RESMI BPS */}
              {activeMak.aturan_pajak && (
                <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-300 text-xs text-amber-950 flex items-start gap-2.5 shadow-2xs">
                  <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold text-[11px] uppercase tracking-wider text-amber-900">
                      Ketentuan Pajak & Bukti Fisik Resmi:
                    </span>
                    <p className="text-xs text-amber-900/90 leading-relaxed">
                      {activeMak.aturan_pajak}
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Pilihan Metode Pencairan Dana (LS vs GUP) */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Metode Pembayaran / Pencairan:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {METODE_PEMBAYARAN_BPS.map((metode) => {
                  const isSelected = metodeBayar === metode.id
                  return (
                    <div
                      key={metode.id}
                      onClick={() => setMetodeBayar(metode.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-500/20 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-slate-900">
                          {metode.label}
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {metode.deskripsi}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        </section>

        {/* ============================================================== */}
        {/* BAGIAN 3: RINCIAN KEGIATAN & NILAI ANGGARAN                     */}
        {/* ============================================================== */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
              3
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Bagian 3: Rincian Nama Kegiatan & Nilai Anggaran
              </h2>
              <p className="text-xs text-slate-500">
                Uraian lengkap kegiatan survei/sensus serta nominal SPJ yang diajukan.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Nama Kegiatan */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Nama Lengkap Kegiatan Survei / Sensus / Rapat
                <span className="text-rose-500 ml-1">*</span>
              </label>
              <textarea
                rows={2}
                value={namaKegiatan}
                onChange={(e) => setNamaKegiatan(e.target.value)}
                placeholder="Contoh: Pelaksanaan Pendataan Lapangan Survei Angkatan Kerja Nasional (SAKERNAS) Triwulan I"
                required
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800 bg-white shadow-2xs"
              />
              <p className="text-[11px] text-slate-500">
                Tuliskan nama kegiatan dengan jelas dan lengkap sesuai Kerangka Acuan Kerja (KAK) / DIPA BPS.
              </p>
            </div>

            {/* Nominal Pengajuan */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Nominal Nilai SPJ yang Diajukan (Rupiah)
                <span className="text-rose-500 ml-1">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                  Rp
                </span>
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  value={nominalPengajuan}
                  onChange={(e) => setNominalPengajuan(e.target.value)}
                  placeholder="Contoh: 18500000"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono font-bold text-slate-900 bg-white shadow-2xs"
                />
              </div>

              {/* Pratinjau Terbilang Rupiah */}
              <div className="flex items-center justify-between text-xs pt-1 px-1">
                <span className="text-slate-500">Pratinjau Format Rupiah:</span>
                <span className="font-mono font-black text-blue-700 text-sm">
                  {formatRupiahPreview(nominalPengajuan)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* BAGIAN 4: PRATINJAU CHECKLIST SYARAT DOKUMEN FISIK              */}
        {/* ============================================================== */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
              4
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Bagian 4: Pratinjau Dokumen Fisik yang Wajib Disiapkan
              </h2>
              <p className="text-xs text-slate-500">
                Daftar dokumen fisik resmi untuk MAK {activeMak.kode_akun} yang wajib disertakan ke dalam map snelhechter.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            {activeMak.syarat.map((item, idx) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5 text-xs"
              >
                <div className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                  {idx + 1}
                </div>
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-800">
                    {item.nama_syarat}
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    item.is_wajib ? 'bg-rose-50 text-rose-700' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {item.is_wajib ? 'Wajib Ada' : 'Opsional / Kondisional'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-400 italic pt-2">
            *Daftar di atas akan dicetak otomatis ke lembar kendali A4 untuk dicentang oleh petugas verifikasi di tiap meja fisik BPS.
          </p>
        </section>

        {/* ============================================================== */}
        {/* BAGIAN 5: TOMBOL AKSI SUBMIT                                    */}
        {/* ============================================================== */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => goBack('beranda')}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-bold hover:bg-slate-100 transition-all cursor-pointer"
          >
            Batal & Kembali
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-lg shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Menyimpan...' : 'Simpan & Siapkan Lembar Kendali'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>

    </div>
  )
}

export default BuatSpjPage
