import React, { useState } from 'react'
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck, 
  Check, 
  MapPin, 
  Send, 
  Save, 
  Info, 
  Clock, 
  RotateCcw, 
  ArrowRight, 
  FileCheck2, 
  Receipt,
  History,
  Printer,
  Lock,
  Building2,
  UserCheck
} from 'lucide-react'
import { useNavigation } from '../../context/NavigationContext'
import { useAuth } from '../../context/AuthContext'
import { useSpj } from '../../context/SpjContext'
import { getTimKerjaById } from '../../data/bpsStructure'
import { getMakByIdOrKode } from '../../data/bpsMakData'
import { TrafficLightBadge } from '../common/TrafficLightBadge'
import { AlurProgress } from '../common/AlurProgress'
import { AuditTrailTimeline } from '../common/AuditTrailTimeline'
import { LembarKendaliCetak } from '../common/LembarKendaliCetak'

export function DetailSpjPage() {
  const { pageParams, goBack } = useNavigation()
  const { currentUser } = useAuth()
  const { getSpjById, toggleChecklist, alihkanPosisiBerkas } = useSpj()

  const spjId = pageParams?.selectedSpjId
  const spj = getSpjById(spjId)
  const makDetail = spj ? getMakByIdOrKode(spj.kode_akun || spj.master_akun_id) : null

  // Tab internal di halaman detail
  const [activeTab, setActiveTab] = useState('checklist') // 'checklist' | 'riwayat' | 'cetak'

  // State dialog aksi alur
  const [showRevisiModal, setShowRevisiModal] = useState(false)
  const [catatanRevisiInput, setCatatanRevisiInput] = useState('')
  const [showSp2dModal, setShowSp2dModal] = useState(false)
  const [nomorSp2dInput, setNomorSp2dInput] = useState('')
  const [notifSuccess, setNotifSuccess] = useState('')

  if (!spj) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 max-w-xl mx-auto space-y-4">
        <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-lg font-bold text-slate-800">Berkas SPJ Tidak Ditemukan</h3>
        <p className="text-sm text-slate-500">ID pengajuan tidak valid atau telah dihapus.</p>
        <button
          onClick={() => goBack('daftar_spj')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs cursor-pointer"
        >
          Kembali ke Daftar Berkas
        </button>
      </div>
    )
  }

  const checklist = spj.checklist || []
  const riwayat = spj.riwayat || []
  const checkedCount = checklist.filter((item) => item.is_checked).length
  const totalCount = checklist.length
  const percentage = Math.round((checkedCount / totalCount) * 100) || 0
  const allWajibChecked = checklist.filter((item) => item.is_wajib).every((item) => item.is_checked)

  const formatRupiah = (nominal) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(nominal)
  }

  // Hak Akses Meja
  const userRole = currentUser?.role
  const isPosisiMejaSaya = spj.posisi_berkas === userRole

  const roleNames = {
    tim_kerja: 'Tim Kerja (Pengusul)',
    admin_tu: 'Tata Usaha (Admin TU)',
    ppk: 'Pejabat Pembuat Komitmen (PPK)',
    bendahara: 'Bendahara Pengeluaran',
    ppspm: 'PPSPM',
    selesai: 'Selesai / Pengarsipan',
  }

  // Handler Centang Checklist Fisik (Hanya oleh pemilik meja berkas saat ini)
  const handleToggleChecklist = (masterSyaratId) => {
    if (!isPosisiMejaSaya) {
      setNotifSuccess(`Akses Terkunci: Checklist hanya dapat dicentang/diubah oleh petugas di meja yang bertanggung jawab (${roleNames[spj.posisi_berkas] || spj.posisi_berkas}).`)
      setTimeout(() => setNotifSuccess(''), 4500)
      return
    }
    toggleChecklist(spj.id, masterSyaratId)
  }

  // Handler Kirim ke Meja Berikutnya
  const handleTeruskanBerkas = (targetMeja, labelMeja) => {
    alihkanPosisiBerkas(spj.id, targetMeja)
    setNotifSuccess(`Berkas fisik berhasil diteruskan ke ${labelMeja}!`)
    setTimeout(() => setNotifSuccess(''), 4000)
  }

  // Handler Kembalikan untuk Revisi
  const handleKirimRevisi = () => {
    if (!catatanRevisiInput.trim()) {
      alert('Mohon tuliskan dokumen fisik apa yang belum lengkap atau perlu diperbaiki!')
      return
    }
    alihkanPosisiBerkas(spj.id, 'tim_kerja', catatanRevisiInput.trim())
    setShowRevisiModal(false)
    setCatatanRevisiInput('')
    setNotifSuccess('Berkas telah ditandai Perlu Perbaikan (Merah) dan dikembalikan ke Tim Kerja.')
    setTimeout(() => setNotifSuccess(''), 4000)
  }

  // Handler Terbitkan SP2D (PPSPM)
  const handleSelesaikanSp2d = () => {
    const noSp2d = nomorSp2dInput.trim() || `SP2D-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`
    alihkanPosisiBerkas(spj.id, 'selesai', '', noSp2d)
    setShowSp2dModal(false)
    setNomorSp2dInput('')
    setNotifSuccess(`Alhamdulillah! Berkas fisik SPJ telah tuntas dan SP2D (${noSp2d}) berhasil diterbitkan.`)
    setTimeout(() => setNotifSuccess(''), 4000)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Tombol Kembali (Disembunyikan saat cetak) */}
      <div className="print:hidden flex items-center justify-between">
        <button
          onClick={() => goBack('daftar_spj')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all cursor-pointer shadow-2xs hover:border-slate-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar & Pelacakan Berkas</span>
        </button>
      </div>

      {/* Banner Notifikasi Aksi Berhasil */}
      {notifSuccess && (
        <div className="print:hidden p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm font-semibold flex items-center gap-2.5 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{notifSuccess}</span>
        </div>
      )}

      {/* Kartu Ringkasan Berkas SPJ (Disembunyikan saat cetak lembar kendali) */}
      <div className="print:hidden bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-lg border ${getTimKerjaById(spj.tim_kerja).warnaBadge} flex items-center gap-1.5`}>
                <Building2 className="w-3.5 h-3.5" />
                <span>{getTimKerjaById(spj.tim_kerja).nama}</span>
              </span>
              <span className="font-mono text-xs font-bold px-3 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
                MAK {spj.kode_akun}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {spj.nama_akun}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-mono text-slate-500 font-bold">
                {spj.id}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                Pencairan: {spj.metode_bayar || 'LS'}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              {spj.nama_kegiatan}
            </h2>

            <div className="text-xs sm:text-sm text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>PJ Kegiatan: <strong className="text-slate-800">{spj.nama_pj || spj.pemohon}</strong></span>
              <span>Pengusul: <strong className="text-slate-700">{spj.pemohon}</strong></span>
              <span>Nominal: <strong className="text-slate-900 font-bold">{formatRupiah(spj.nominal_pengajuan)}</strong></span>
              {spj.nomor_sp2d && (
                <span className="text-emerald-700 font-bold font-mono">
                  No. SP2D: {spj.nomor_sp2d} (Tgl: {spj.tanggal_sp2d})
                </span>
              )}
            </div>
          </div>

          <div className="flex-shrink-0 self-start md:self-auto">
            <TrafficLightBadge status={spj.status_kelengkapan} size="lg" />
          </div>
        </div>

        {/* Pelacakan Alur 6 Meja Berkas Fisik */}
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Pelacakan Meja Berkas Fisik:
          </div>
          <AlurProgress currentPosition={spj.posisi_berkas} />
        </div>

      </div>

      {/* Peringatan Ramah jika Ada Catatan Perbaikan (Merah) */}
      {spj.status_kelengkapan === 'merah' && spj.catatan_revisi && activeTab === 'checklist' && (
        <div className="print:hidden bg-rose-50 border border-rose-200 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5 text-rose-600" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-rose-900">
                Catatan dari Petugas Pemeriksa:
              </h3>
              <p className="text-xs sm:text-sm text-rose-800 leading-relaxed font-medium">
                {spj.catatan_revisi}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB PILIHAN TAMPILAN DETAIL (Checklist, Jejak Audit, & Cetak Lembar Kendali) */}
      <div className="print:hidden flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('checklist')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'checklist'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>1. Checklist Fisik Dokumen</span>
        </button>

        <button
          onClick={() => setActiveTab('riwayat')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'riwayat'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <History className="w-4 h-4" />
          <span>2. Jejak Perjalanan Berkas ({riwayat.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('cetak')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'cetak'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>3. Lembar Kendali Map Fisik (Siap Cetak)</span>
        </button>
      </div>

      {/* TAMPILAN TAB 1: DYNAMIC CHECKLIST & KENDALI MEJA */}
      {activeTab === 'checklist' && (
        <div className="space-y-6">
          
          {/* KOTAK AKSI PENGENDALIAN ALUR MEJA */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-sky-400">
                  Panel Kendali Alur Berkas Fisik
                </div>
                <div className="text-sm text-slate-200">
                  Peran Anda Saat Ini: <strong className="text-white">{currentUser?.jabatan}</strong>
                </div>
              </div>

              <div>
                {isPosisiMejaSaya ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    Berkas Menunggu Tindakan Anda
                  </span>
                ) : spj.posisi_berkas === 'selesai' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
                    ✓ Berkas Telah Selesai (Arsip)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                    Sedang di Meja Lain
                  </span>
                )}
              </div>
            </div>

            {/* Tombol-Tombol Aksi Sesuai Posisi & Peran */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              
              {/* JIKA BERKAS DI MEJA SAYA: TAMPILKAN TOMBOL TINDAKAN MEJA BERSANGKUTAN */}
              {isPosisiMejaSaya && (
                <>
                  {/* Posisi di Tim Kerja */}
                  {spj.posisi_berkas === 'tim_kerja' && (
                    <div className="flex flex-wrap items-center gap-3 w-full">
                      <button
                        onClick={() => handleTeruskanBerkas('admin_tu', 'Meja Tata Usaha (Admin TU)')}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        <span>Kirimkan Berkas Fisik ke Loket Tata Usaha (Admin TU)</span>
                      </button>
                      <span className="text-xs text-slate-400">
                        *Pastikan dokumen fisik telah dirapikan ke dalam map sebelum diserahkan.
                      </span>
                    </div>
                  )}

                  {/* Posisi di Meja Admin TU */}
                  {spj.posisi_berkas === 'admin_tu' && (
                    <div className="flex flex-wrap items-center gap-3 w-full">
                      <button
                        onClick={() => handleTeruskanBerkas('ppk', 'Meja PPK')}
                        disabled={!allWajibChecked}
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer ${
                          allWajibChecked
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                        }`}
                        title={!allWajibChecked ? 'Semua syarat wajib fisik harus dicentang lengkap terlebih dahulu' : ''}
                      >
                        <ArrowRight className="w-4 h-4" />
                        <span>Teruskan ke Meja PPK (Berkas Lengkap)</span>
                      </button>

                      <button
                        onClick={() => setShowRevisiModal(true)}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-600/90 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Kembalikan ke Tim Kerja (Ada yang Kurang)</span>
                      </button>
                    </div>
                  )}

                  {/* Posisi di Meja PPK */}
                  {spj.posisi_berkas === 'ppk' && (
                    <div className="flex flex-wrap items-center gap-3 w-full">
                      <button
                        onClick={() => handleTeruskanBerkas('bendahara', 'Meja Bendahara Pengeluaran')}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                      >
                        <ArrowRight className="w-4 h-4" />
                        <span>Setujui Komitmen & Teruskan ke Bendahara Pengeluaran</span>
                      </button>

                      <button
                        onClick={() => setShowRevisiModal(true)}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-600/90 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Kembalikan untuk Revisi</span>
                      </button>
                    </div>
                  )}

                  {/* Posisi di Meja Bendahara */}
                  {spj.posisi_berkas === 'bendahara' && (
                    <div className="flex flex-wrap items-center gap-3 w-full">
                      <button
                        onClick={() => handleTeruskanBerkas('ppspm', 'Meja PPSPM')}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                      >
                        <ArrowRight className="w-4 h-4" />
                        <span>Kuitansi & Pajak Sesuai, Teruskan ke PPSPM</span>
                      </button>

                      <button
                        onClick={() => setShowRevisiModal(true)}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-600/90 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Kembalikan untuk Revisi Pajak/Kuitansi</span>
                      </button>
                    </div>
                  )}

                  {/* Posisi di Meja PPSPM */}
                  {spj.posisi_berkas === 'ppspm' && (
                    <div className="flex flex-wrap items-center gap-3 w-full">
                      <button
                        onClick={() => setShowSp2dModal(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                      >
                        <Receipt className="w-4 h-4" />
                        <span>Terbitkan SP2D & Selesaikan Berkas</span>
                      </button>

                      <button
                        onClick={() => setShowRevisiModal(true)}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-600/90 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Kembalikan Berkas</span>
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* JIKA BERKAS TELAH SELESAI (ARSIP) */}
              {spj.posisi_berkas === 'selesai' && (
                <div className="text-xs sm:text-sm text-emerald-300 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>
                    Seluruh tahapan verifikasi tuntas. SP2D telah terbit dan berkas fisik telah diarsipkan dengan rapi di Subbagian Umum BPS.
                  </span>
                </div>
              )}

              {/* JIKA BERKAS BUKAN DI MEJA PENGGUNA SAAT INI (MODE PANTAU / READ-ONLY) */}
              {!isPosisiMejaSaya && spj.posisi_berkas !== 'selesai' && (
                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 text-slate-300 w-full">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <span>Akses Mode Pantau (Hanya Baca / Read-Only)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-normal">
                        Bukan di Meja Anda
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Map fisik berkas saat ini berada di bawah tanggung jawab <strong>{roleNames[spj.posisi_berkas] || spj.posisi_berkas}</strong>. 
                      Sesuai SOP akuntabilitas BPS, hanya petugas di meja tersebut yang berhak memvalidasi checklist fisik atau meneruskan/mengembalikan berkas.
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Dynamic Checklist Dokumen Fisik */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
            
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-blue-600" />
                    <span>Dynamic Checklist Dokumen Fisik (MAK {spj.kode_akun})</span>
                  </h3>
                  {isPosisiMejaSaya ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                      ✓ Akses Verifikasi Aktif
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold inline-flex items-center gap-1">
                      <Lock className="w-3 h-3 text-slate-400" />
                      Mode Pantau (Hanya Baca)
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {isPosisiMejaSaya
                    ? 'Petugas pemeriksa mencentang fisik dokumen yang sudah diterima dan memenuhi syarat.'
                    : `Checklist terkunci untuk pengeditan karena berkas fisik sedang berada di meja ${roleNames[spj.posisi_berkas] || spj.posisi_berkas}.`}
                </p>
              </div>

              {/* Progress Bar Persentase */}
              <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800">
                    {checkedCount} dari {totalCount} Lengkap
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Kelengkapan Fisik: {percentage}%
                  </div>
                </div>
                <div className="w-16 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      percentage === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Box Ketentuan Pajak & Bukti Dukung Resmi BPS */}
            {makDetail?.aturan_pajak && (
              <div className="mx-6 my-4 p-4 rounded-2xl bg-gradient-to-r from-amber-50/90 to-orange-50/60 border border-amber-200/90 text-amber-900 flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <div className="font-bold text-amber-950 uppercase tracking-wider text-[11px] mb-0.5">
                    Ketentuan Pajak & Bukti Fisik Resmi (MAK {spj.kode_akun} - {makDetail.nama_akun}):
                  </div>
                  <p>{makDetail.aturan_pajak}</p>
                </div>
              </div>
            )}

            {/* List Checklist */}
            <div className="divide-y divide-slate-100">
              {checklist.map((item, idx) => (
                <div
                  key={item.master_syarat_id || idx}
                  onClick={() => handleToggleChecklist(item.master_syarat_id)}
                  title={!isPosisiMejaSaya ? `Akses hanya untuk petugas di ${roleNames[spj.posisi_berkas] || 'meja bersangkutan'}` : 'Klik untuk mengubah status kelengkapan fisik'}
                  className={`p-5 flex items-center justify-between gap-4 transition-colors ${
                    isPosisiMejaSaya ? 'cursor-pointer' : 'cursor-default'
                  } ${
                    item.is_checked ? 'bg-emerald-50/20 hover:bg-emerald-50/40' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all flex-shrink-0 ${
                        item.is_checked
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-white border-slate-300 hover:border-blue-500'
                      }`}
                    >
                      {item.is_checked && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm sm:text-base font-semibold text-slate-900">
                          {item.nama_syarat}
                        </span>
                        {item.is_wajib ? (
                          <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-bold text-[10px] border border-rose-200">
                            Wajib Ada
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px]">
                            Bila Ada
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {item.is_checked ? '✓ Fisik dokumen sudah diterima dan sesuai' : 'Dokumen fisik belum diserahkan / belum diperiksa'}
                      </p>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    {item.is_checked ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-bold bg-emerald-100/70 px-3 py-1.5 rounded-xl">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Lengkap</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1.5 rounded-xl">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>Belum Lengkap</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
              <span>* Klik langsung pada baris untuk mencentang fisik dokumen yang sudah Anda terima.</span>
              <span className="font-semibold text-blue-700">Tersinkronisasi Otomatis</span>
            </div>

          </div>

        </div>
      )}

      {/* TAMPILAN TAB 2: AUDIT TRAIL / JEJAK PERJALANAN BERKAS */}
      {activeTab === 'riwayat' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs">
          <AuditTrailTimeline riwayat={riwayat} />
        </div>
      )}

      {/* TAMPILAN TAB 3: LEMBAR KENDALI MAP FISIK (SIAP CETAK) */}
      {activeTab === 'cetak' && (
        <LembarKendaliCetak spj={spj} />
      )}

      {/* MODAL: Kembalikan Berkas untuk Revisi */}
      {showRevisiModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Kembalikan Berkas ke Tim Kerja
                </h3>
                <p className="text-xs text-slate-500">
                  Status berkas akan menjadi 🔴 Merah (Perlu Perbaikan).
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Tuliskan Catatan Kekurangan Dokumen Fisik: <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={catatanRevisiInput}
                onChange={(e) => setCatatanRevisiInput(e.target.value)}
                placeholder="Contoh: Kuitansi penginapan belum bermeterai 10.000 dan lembar SPD II cap basah belum lengkap. Harap segera dilengkapi."
                className="w-full p-3.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowRevisiModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs sm:text-sm font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleKirimRevisi}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold shadow-md cursor-pointer"
              >
                Kirim Catatan & Kembalikan Berkas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Penerbitan SP2D (PPSPM) */}
      {showSp2dModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-emerald-600">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Penerbitan SP2D (Selesai)
                </h3>
                <p className="text-xs text-slate-500">
                  Status berkas akan menjadi 🟢 Hijau (Selesai).
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Nomor SP2D dari KPPN:
              </label>
              <input
                type="text"
                value={nomorSp2dInput}
                onChange={(e) => setNomorSp2dInput(e.target.value)}
                placeholder="Contoh: SP2D-261019-8812 (Kosongkan untuk nomor otomatis)"
                className="w-full p-3.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSp2dModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs sm:text-sm font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSelesaikanSp2d}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md cursor-pointer"
              >
                Simpan & Terbitkan SP2D
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default DetailSpjPage
