import React from 'react'
import { Printer, ShieldCheck, Check, X, FileText, QrCode } from 'lucide-react'
import { getTimKerjaById } from '../../data/bpsStructure'

export function LembarKendaliCetak({ spj }) {
  if (!spj) return null

  const handlePrint = () => {
    window.print()
  }

  const formatRupiah = (nominal) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(nominal)
  }

  const formatTanggal = (dateStr) => {
    try {
      const d = dateStr ? new Date(dateStr) : new Date()
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(d)
    } catch (e) {
      return dateStr
    }
  }

  const checklist = spj.checklist || []

  return (
    <div className="space-y-4">
      
      {/* Tombol Cetak (Tidak ikut tercetak saat print) */}
      <div className="print:hidden flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-2xl">
        <div className="text-xs sm:text-sm text-blue-900">
          <strong>Lembar Kendali Fisik:</strong> Dokumen ini dapat dicetak pada kertas A4 untuk ditempel pada bagian depan map snelhechter/odner berkas fisik SPJ.
        </div>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex-shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak Lembar Kendali (A4 / PDF)</span>
        </button>
      </div>

      {/* DOKUMEN CETAK A4 RESMI BPS */}
      <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-300 shadow-sm print:shadow-none print:border-none print:p-0 max-w-4xl mx-auto text-slate-900 font-sans print:text-black">
        
        {/* KOP RESMI BPS */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6">
          <div className="flex items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              {/* Lambang Geometris BPS */}
              <div className="w-14 h-14 border-2 border-slate-900 rounded-xl flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-9 h-9 text-slate-900" />
              </div>
              <div>
                <div className="text-xs font-bold tracking-widest uppercase">
                  BADAN PUSAT STATISTIK
                </div>
                <h1 className="text-lg sm:text-xl font-black tracking-tight leading-tight uppercase">
                  LEMBAR KONTROL & VERIFIKASI FISIK BERKAS SPJ
                </h1>
                <p className="text-xs text-slate-600 font-mono">
                  Sistem SIGAP BESAPRAH • “Bersaprah dalam Kerja, Sepakat dalam Akuntabilitas.”
                </p>
              </div>
            </div>

            {/* Kode Batang Visual / QR Tag */}
            <div className="text-right border-l pl-4 border-slate-300 hidden sm:block">
              <div className="font-mono text-xs font-bold bg-slate-100 px-2 py-1 rounded border border-slate-300">
                {spj.id}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Tgl Cetak: {formatTanggal()}
              </div>
            </div>

          </div>
        </div>

        {/* TABEL IDENTITAS BERKAS */}
        <div className="mb-6 border border-slate-300 rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="w-1/4 p-2.5 bg-slate-50 font-bold border-r border-slate-200">
                  Nama Kegiatan
                </td>
                <td className="p-2.5 font-bold text-slate-900 text-sm" colSpan={3}>
                  {spj.nama_kegiatan}
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2.5 bg-slate-50 font-bold border-r border-slate-200">
                  Kode Akun (MAK)
                </td>
                <td className="p-2.5 font-mono font-bold text-slate-800">
                  {spj.kode_akun} — {spj.nama_akun}
                </td>
                <td className="w-1/5 p-2.5 bg-slate-50 font-bold border-r border-l border-slate-200">
                  Nominal SPJ
                </td>
                <td className="p-2.5 font-bold text-slate-900">
                  {formatRupiah(spj.nominal_pengajuan)}
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2.5 bg-slate-50 font-bold border-r border-slate-200">
                  Asal Tim Kerja / Fungsi
                </td>
                <td className="p-2.5 font-bold text-slate-800">
                  {getTimKerjaById(spj.tim_kerja).nama} ({getTimKerjaById(spj.tim_kerja).kode})
                </td>
                <td className="p-2.5 bg-slate-50 font-bold border-r border-l border-slate-200">
                  PJ Kegiatan
                </td>
                <td className="p-2.5 font-bold text-slate-900">
                  {spj.nama_pj || spj.pemohon}
                </td>
              </tr>
              <tr>
                <td className="p-2.5 bg-slate-50 font-bold border-r border-slate-200">
                  Pengusul Berkas
                </td>
                <td className="p-2.5 text-slate-800">
                  {spj.pemohon}
                </td>
                <td className="p-2.5 bg-slate-50 font-bold border-r border-l border-slate-200">
                  Metode & Status
                </td>
                <td className="p-2.5 font-bold uppercase">
                  <span className="font-mono text-blue-700 mr-2">[{spj.metode_bayar || 'LS'}]</span>
                  {spj.status_kelengkapan === 'hijau'
                    ? '🟢 LENGKAP / SP2D TERBIT'
                    : spj.status_kelengkapan === 'kuning'
                    ? '🟡 SEDANG VERIFIKASI'
                    : '🔴 PERLU PERBAIKAN'}
                  {spj.nomor_sp2d && ` (${spj.nomor_sp2d})`}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* TABEL DYNAMIC CHECKLIST DOKUMEN FISIK */}
        <div className="mb-8">
          <div className="text-xs font-bold uppercase tracking-wider mb-2">
            I. Checklist Verifikasi Kelengkapan Dokumen Fisik:
          </div>

          <table className="w-full text-xs border border-slate-300 border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-900 border-b border-slate-300">
                <th className="p-2 border-r border-slate-300 text-center w-10">No</th>
                <th className="p-2 border-r border-slate-300 text-left">Nama Dokumen Fisik yang Disyaratkan</th>
                <th className="p-2 border-r border-slate-300 text-center w-20">Sifat</th>
                <th className="p-2 border-r border-slate-300 text-center w-24">Ada Fisik</th>
                <th className="p-2 text-left w-36">Paraf Petugas</th>
              </tr>
            </thead>
            <tbody>
              {checklist.map((item, idx) => (
                <tr key={item.master_syarat_id || idx} className="border-b border-slate-200">
                  <td className="p-2 border-r border-slate-200 text-center font-mono font-bold">
                    {idx + 1}
                  </td>
                  <td className="p-2 border-r border-slate-200 font-medium">
                    {item.nama_syarat}
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center">
                    {item.is_wajib ? (
                      <span className="font-bold text-[10px]">WAJIB</span>
                    ) : (
                      <span className="text-slate-500 text-[10px]">Bila Ada</span>
                    )}
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center font-bold">
                    {item.is_checked ? '✓ LENGKAP' : '—'}
                  </td>
                  <td className="p-2 text-slate-400 text-[10px]">
                    {item.is_checked ? 'Terverifikasi' : 'Belum Ada'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* KOLOM TANDA TANGAN MEJA VERIFIKASI FISIK (4 MEJA) */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider mb-3">
            II. Lembar Pengesahan & Paraf Alur Berkas Fisik:
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-xs border border-slate-300 rounded-lg p-3">
            
            {/* Kolom 1: Pembuat SPJ */}
            <div className="border-r border-slate-200 pr-2 flex flex-col justify-between h-36">
              <div>
                <div className="font-bold text-[11px]">1. Pembuat SPJ</div>
                <div className="text-[10px] text-slate-500">Tim Kerja Pengusul</div>
              </div>
              <div>
                <div className="border-b border-slate-400 mx-4 mb-1" />
                <div className="font-bold text-[10px] truncate">{spj.pemohon?.split('(')[0] || 'Pembuat SPJ'}</div>
                <div className="text-[9px] text-slate-500">Tgl: {formatTanggal(spj.created_at)}</div>
              </div>
            </div>

            {/* Kolom 2: Tata Usaha */}
            <div className="border-r border-slate-200 pr-2 flex flex-col justify-between h-36">
              <div>
                <div className="font-bold text-[11px]">2. Pemeriksa Awal</div>
                <div className="text-[10px] text-slate-500">Tata Usaha (Admin TU)</div>
              </div>
              <div>
                <div className="border-b border-slate-400 mx-4 mb-1" />
                <div className="font-bold text-[10px]">Siti Aminah, S.Sos.</div>
                <div className="text-[9px] text-slate-500">Petugas Tata Usaha</div>
              </div>
            </div>

            {/* Kolom 3: PPK */}
            <div className="border-r border-slate-200 pr-2 flex flex-col justify-between h-36">
              <div>
                <div className="font-bold text-[11px]">3. Komitmen Anggaran</div>
                <div className="text-[10px] text-slate-500">PPK BPS</div>
              </div>
              <div>
                <div className="border-b border-slate-400 mx-4 mb-1" />
                <div className="font-bold text-[10px]">Ir. Budi Santoso, M.Si.</div>
                <div className="text-[9px] text-slate-500">Pejabat Pembuat Komitmen</div>
              </div>
            </div>

            {/* Kolom 4: Bendahara */}
            <div className="flex flex-col justify-between h-36">
              <div>
                <div className="font-bold text-[11px]">4. Pajak & Kas</div>
                <div className="text-[10px] text-slate-500">Bendahara Pengeluaran</div>
              </div>
              <div>
                <div className="border-b border-slate-400 mx-4 mb-1" />
                <div className="font-bold text-[10px]">Sri Wahyuni, S.E.</div>
                <div className="text-[9px] text-slate-500">Bendahara Pengeluaran</div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Cetak */}
        <div className="mt-6 pt-3 border-t border-slate-200 text-[10px] text-slate-400 flex items-center justify-between">
          <span>Dicetak secara otomatis melalui Sistem SIGAP BESAPRAH — Badan Pusat Statistik</span>
          <span>Dokumen Sah Pengendalian Mutu Administrasi SPJ</span>
        </div>

      </div>

    </div>
  )
}

export default LembarKendaliCetak
