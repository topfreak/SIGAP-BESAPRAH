import React from 'react'
import { GitFork, HeartHandshake, CheckCircle2, Clock, AlertCircle } from 'lucide-react'

export function PanduanAlurPage() {
  const panduanMeja = [
    {
      no: 1,
      nama: 'Tim Kerja (Pengusul)',
      apaYangDilakukan: 'Menyiapkan & Mengantar Berkas',
      penjelasan: 'Kumpulkan semua kuitansi, surat tugas, atau daftar hadir fisik sesuai jenis belanja (MAK). Lalu bawa berkas ke loket Tata Usaha.',
    },
    {
      no: 2,
      nama: 'Tata Usaha (Admin TU)',
      apaYangDilakukan: 'Pemeriksaan Awal Dokumen Fisik',
      penjelasan: 'Petugas memeriksa apakah berkas fisik lengkap. Jika ada yang tertinggal atau belum bertanda tangan, berkas diberi tanda 🔴 Merah untuk dilengkapi.',
    },
    {
      no: 3,
      nama: 'PPK (Pejabat Pembuat Komitmen)',
      apaYangDilakukan: 'Pengujian Anggaran DIPA',
      penjelasan: 'PPK memeriksa kesesuaian anggaran kegiatan dengan DIPA BPS dan menandatangani persetujuan beban dana.',
    },
    {
      no: 4,
      nama: 'Bendahara Pengeluaran',
      apaYangDilakukan: 'Pemeriksaan Pajak & Kuitansi',
      penjelasan: 'Bendahara memeriksa perhitungan pajak (PPh 21/PPN) dan memastikan kuitansi pembayaran sah sebelum diproses bayar.',
    },
    {
      no: 5,
      nama: 'PPSPM',
      apaYangDilakukan: 'Penerbitan Surat Perintah Membayar (SPM)',
      penjelasan: 'Pejabat Penandatangan SPM melakukan verifikasi akhir dan menerbitkan SPM untuk diteruskan ke Kantor Pelayanan Perbendaharaan Negara (KPPN).',
    },
    {
      no: 6,
      nama: 'Selesai (KPPN / SP2D Terbit)',
      apaYangDilakukan: 'Pencairan Dana & Pengarsipan',
      penjelasan: 'SP2D resmi diterbitkan oleh KPPN. Status berkas otomatis menjadi 🟢 Hijau dan berkas fisik disimpan rapi di arsip BPS.',
    },
  ]

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Filosofi Besaprah Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
          <HeartHandshake className="w-4 h-4 text-amber-600" />
          <span>Kearifan Lokal BPS</span>
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          Apa Arti "Besaprah"?
        </h2>
        
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          <strong>Besaprah</strong> adalah tradisi luhur Melayu di mana kita duduk melingkar bersama menikmati hidangan dalam satu wadah dengan penuh rasa kekeluargaan, keterbukaan, dan gotong royong.
        </p>

        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-sm font-semibold italic">
          “Bersaprah dalam Kerja, Sepakat dalam Akuntabilitas.”
        </div>
      </div>

      {/* Makna Lampu Lalu Lintas Sederhana */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-4">
        <h3 className="text-lg font-bold text-slate-900">
          Arti Warna Lampu Status Berkas:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-rose-800 text-sm sm:text-base">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span>🔴 Merah (Perlu Perbaikan)</span>
            </div>
            <p className="text-xs sm:text-sm text-rose-700 leading-relaxed">
              Ada dokumen fisik yang belum lengkap atau perlu diperbaiki. Lihat catatan petugas pemeriksa di halaman detail.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-800 text-sm sm:text-base">
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
              <span>🟡 Kuning (Sedang Diproses)</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-700 leading-relaxed">
              Berkas fisik Anda sedang berada di meja petugas (TU / PPK / Bendahara / PPSPM) untuk diteliti kelengkapannya.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm sm:text-base">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>🟢 Hijau (Sudah Selesai)</span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-700 leading-relaxed">
              Semua berkas fisik sudah lengkap, disetujui, dan nomor SP2D telah diterbitkan oleh KPPN.
            </p>
          </div>
        </div>
      </div>

      {/* 6 Tahapan Alur Fisik Berkas */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <GitFork className="w-5 h-5 text-blue-600" />
            <span>Alur Perjalanan Berkas Fisik SPJ (6 Meja)</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Berikut urutan meja yang dilalui oleh berkas fisik dari awal pengajuan hingga selesai:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {panduanMeja.map((meja) => (
            <div
              key={meja.no}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  {meja.no}
                </span>
                <span className="text-xs font-bold text-blue-700 bg-blue-100/60 px-2.5 py-0.5 rounded-lg">
                  Tahap {meja.no} dari 6
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900">
                {meja.nama}
              </h4>

              <div className="text-xs font-semibold text-blue-800">
                {meja.apaYangDilakukan}
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {meja.penjelasan}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default PanduanAlurPage
