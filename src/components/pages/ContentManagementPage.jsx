import React, { useState, useEffect } from 'react'
import {
  Calendar,
  FileText,
  Globe,
  ExternalLink,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  FolderOpen,
  ArrowRight,
  BookOpen,
  Share2,
  Layers,
  Sparkles,
  ChevronRight
} from 'lucide-react'

// DATA JADWAL TERPADU SURVEI & SENSUS BPS SAMBAS 2026
const JADWAL_TERPADU_DATA = [
  {
    id: 'JT-01',
    nama: 'Survei Sosial Ekonomi Nasional (Susenas) Maret 2026',
    tim: 'Tim Statistik Sosial',
    periode: '01 Feb 2026 - 31 Mar 2026',
    pj: 'Nurhidayatul Fitri, S.Tr.Stat.',
    mitra: 48,
    status: 'Sedang Berjalan',
    statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    deadlineSpj: '05 Apr 2026',
    progress: 72,
    mak: '524111 / 521213',
  },
  {
    id: 'JT-02',
    nama: 'Survei Angkatan Kerja Nasional (Sakernas) Februari 2026',
    tim: 'Tim Statistik Sosial',
    periode: '01 Feb 2026 - 28 Feb 2026',
    pj: 'Diva Maharani Basuki, S.Tr.Stat.',
    mitra: 24,
    status: 'Selesai Lapangan (Pemeriksaan SPJ)',
    statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
    deadlineSpj: '10 Mar 2026',
    progress: 100,
    mak: '521213 / 524113',
  },
  {
    id: 'JT-03',
    nama: 'Survei Potensi Desa (Podes) 2026',
    tim: 'Tim Statistik Ketahanan & Wilayah',
    periode: '01 Mei 2026 - 31 Mei 2026',
    pj: 'Mega Lisantri, S.Tr.Stat.',
    mitra: 38,
    status: 'Persiapan & Alokasi SLS',
    statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
    deadlineSpj: '15 Jun 2026',
    progress: 25,
    mak: '521213',
  },
  {
    id: 'JT-04',
    nama: 'Survei Harga Konsumen (SHK / HKD / HKP) Rutin 2026',
    tim: 'Tim Statistik Distribusi',
    periode: '01 Jan 2026 - 31 Des 2026',
    pj: 'Hamzah, S.E.',
    mitra: 8,
    status: 'Rutin Bulanan (Aktif)',
    statusColor: 'bg-purple-50 text-purple-700 border-purple-200',
    deadlineSpj: 'Tiap Akhir Bulan',
    progress: 88,
    mak: '524113',
  },
  {
    id: 'JT-05',
    nama: 'Rekonfisik & Rekapitulasi SE2026 Kab. Sambas',
    tim: 'Tim Integrasi Pengolahan & Diseminasi (IPDS)',
    periode: '15 Jan 2026 - 20 Feb 2026',
    pj: 'Jumadi, A.Md.',
    mitra: 15,
    status: 'Verifikasi SPJ Lengkap',
    statusColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    deadlineSpj: '25 Feb 2026',
    progress: 95,
    mak: '522151 / 524111',
  },
  {
    id: 'JT-06',
    nama: 'Survei Pertanian Terpadu (SUTAS / Ubinan Subround I)',
    tim: 'Tim Statistik Produksi',
    periode: '01 Jan 2026 - 30 Apr 2026',
    pj: 'Muhammad Reynaldi, A.Md',
    mitra: 22,
    status: 'Sedang Berjalan',
    statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    deadlineSpj: '10 Mei 2026',
    progress: 60,
    mak: '521213 / 524111',
  },
]

// DATA MICROSITE & LINK SISTEM INTERNAL BPS & KEMENKEU
const MICROSITE_LINKS = [
  {
    id: 'MS-01',
    nama: 'FASIH BPS RI',
    desc: 'Flexible & Authentic Survey Instruments Hub untuk pelaksanaan Computer Assisted Personal Interviewing (CAPI) mitra lapangan.',
    url: 'https://fasih.bps.go.id',
    kategori: 'Survei & Sensus',
    badge: 'CAPI Lapangan',
    color: 'from-blue-600 to-indigo-700',
    iconBg: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'MS-02',
    nama: 'Simwaskor BPS',
    desc: 'Sistem Pengawasan dan Koordinasi Lapangan Survei/Sensus real-time Badan Pusat Statistik.',
    url: 'https://simwaskor.bps.go.id',
    kategori: 'Pengawasan Lapangan',
    badge: 'Monitoring Mitra',
    color: 'from-indigo-600 to-indigo-900',
    iconBg: 'bg-indigo-100 text-indigo-700',
  },
  {
    id: 'MS-03',
    nama: 'SAKTI Kemenkeu',
    desc: 'Sistem Aplikasi Keuangan Tingkat Instansi untuk penerbitan SPP, SPM, dan pencatatan LPJ Bendahara.',
    url: 'https://sakti.kemenkeu.go.id',
    kategori: 'Keuangan Negara',
    badge: 'Kemenkeu SP2D',
    color: 'from-amber-600 to-orange-700',
    iconBg: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'MS-04',
    nama: 'Portal BPS Kabupaten Sambas',
    desc: 'Website resmi publikasi rilis Berita Resmi Statistik (BRS), publikasi Kabupaten Sambas Dalam Angka.',
    url: 'https://sambaskab.bps.go.id',
    kategori: 'Publikasi & Diseminasi',
    badge: 'Website Satker',
    color: 'from-cyan-600 to-blue-700',
    iconBg: 'bg-cyan-100 text-cyan-700',
  },
  {
    id: 'MS-05',
    nama: 'Webentry BPS',
    desc: 'Aplikasi entri dan validasi data kuesioner survei BPS berbasis web.',
    url: 'https://webentry.bps.go.id',
    kategori: 'Pengolahan Data',
    badge: 'Entri Data',
    color: 'from-indigo-600 to-purple-700',
    iconBg: 'bg-indigo-100 text-indigo-700',
  },
  {
    id: 'MS-06',
    nama: 'OM-SPAN Kemenkeu',
    desc: 'Online Monitoring Sistem Perbendaharaan dan Anggaran Negara untuk verifikasi status SP2D dan realisasi pagu DIPA.',
    url: 'https://spanint.kemenkeu.go.id',
    kategori: 'Perbendaharaan',
    badge: 'SPAN Realisasi',
    color: 'from-rose-600 to-pink-700',
    iconBg: 'bg-rose-100 text-rose-700',
  },
]

// SOP PANDUAN PENGAJUAN SPJ (CUSTOM PAGE)
const SOP_ITEMS = [
  {
    step: '1',
    meja: 'Meja 1: Tim Kerja / Pengusul',
    title: 'Penyusunan & Pengunggahan Berkas SPJ',
    desc: 'Ketua Tim Kerja mengumpulkan kuitansi fisik, kuitansi honor, rekap daftar hadir, notulen rapat/laporan, dan surat tugas. Petugas menyusun sesuai urutan MAK (521213, 524111, dll) lalu menginput nomor berkas di SIGAP BESAPRAH.',
    dokumen: ['Surat Tugas / SPD', 'Kuitansi bermeterai', 'Daftar hadir & Notulen', 'BAST Kegiatan'],
  },
  {
    step: '2',
    meja: 'Meja 2: Subbagian Tata Usaha (Admin TU)',
    title: 'Verifikasi Fisik & Validasi Checklist 12 MAK',
    desc: 'Staf TU menerima bundel map fisik, mencocokkan jumlah berkas dengan checklist 12 MAK di aplikasi SIGAP BESAPRAH. Jika berkas kurang (misal kuitansi belum ditandatangani camat atau belum ada BAST), status diset "Perlu Perbaikan (Kekurangan Sheet3)".',
    dokumen: ['Lembar Kendali SPJ', 'Checklist Kelengkapan MAK', 'Pemeriksaan TTD & Cap'],
  },
  {
    step: '3',
    meja: 'Meja 3: Pejabat Pembuat Komitmen (PPK)',
    title: 'Pengujian Komitmen & Beban Pagu Anggaran DIPA',
    desc: 'PPK memeriksa kesesuaian uraian belanja dengan Rencana Kerja Satker (DIPA 2026), ketersediaan dana pada MAK, dan ketepatan penerima honor/uang saku. PPK membubuhkan paraf persetujuan komitmen di lembar SPJ.',
    dokumen: ['Ketersediaan Pagu DIPA', 'Surat Penetapan PPK', 'Verifikasi Keabsahan'],
  },
  {
    step: '4',
    meja: 'Meja 4: Pejabat Penandatangan SPM (PPSPM)',
    title: 'Pengujian Dokumen Pembayaran & Penerbitan SPM',
    desc: 'PPSPM melakukan verifikasi akhir formalitas dokumen SPJ, menandatangani Surat Perintah Membayar (SPM) baik tipe LS (Langsung) ke rekening mitra/pihak ketiga maupun GUP (Ganti Uang Persediaan) melalui SAKTI Kemenkeu.',
    dokumen: ['Draft SPM SAKTI', 'Kesesuaian No. SPM', 'Lampiran Rekening Penerima'],
  },
  {
    step: '5',
    meja: 'Meja 5: Bendahara Pengeluaran',
    title: 'Pemeriksaan Bukti Potong Pajak & Pencairan SP2D',
    desc: 'Bendahara memotong PPh 21 / PPh 23 / PPN jika ada, menyetorkan ke kas negara via e-Billing, mencairkan dana bersih ke rekening pelaksana/mitra, dan mencatat nomor SP2D ke dalam buku kas dan LPJ Bendahara.',
    dokumen: ['NTPN Bukti Setor Pajak', 'Bukti Transfer Bank Kalbar/BRI', 'Catatan SP2D Kemenkeu'],
  },
]

export function ContentManagementPage({ mode = 'jadwal_terpadu', onNavigate }) {
  const normalizeTab = (m) => {
    if (m === 'custom_page' || m === 'sop_spj') return 'custom_page'
    if (m === 'microsite') return 'microsite'
    return 'jadwal_terpadu'
  }

  const [activeTab, setActiveTab] = useState(normalizeTab(mode))
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setActiveTab(normalizeTab(mode))
  }, [mode])

  const filteredJadwal = JADWAL_TERPADU_DATA.filter((item) =>
    item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tim.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.pj.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredMicrosite = MICROSITE_LINKS.filter((item) =>
    item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.kategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-indigo-600" />
            <span>
              {activeTab === 'custom_page'
                ? 'SOP Pengajuan & Verifikasi SPJ'
                : activeTab === 'microsite'
                ? 'Portal & Microsite BPS'
                : 'Jadwal Terpadu Sensus & Survei'}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {activeTab === 'custom_page'
              ? 'Standar Operasional Prosedur (SOP) alur penyerahan dan pengujian berkas fisik SPJ melewati 5 meja verifikasi BPS Sambas'
              : activeTab === 'microsite'
              ? 'Pusat tautan cepat ke sistem informasi internal BPS dan perbendaharaan Kemenkeu'
              : 'Kalender terpadu pelaksanaan sensus dan survei Badan Pusat Statistik Kabupaten Sambas TA 2026'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-gray-100 rounded-xl border border-gray-200 text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('jadwal_terpadu')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'jadwal_terpadu'
                ? 'bg-white text-indigo-700 shadow-xs font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>Jadwal Terpadu</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom_page')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'custom_page'
                ? 'bg-white text-indigo-700 shadow-xs font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>SOP Pengajuan SPJ</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('microsite')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'microsite'
                ? 'bg-white text-indigo-700 shadow-xs font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            <span>Microsite</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: JADWAL TERPADU */}
      {activeTab === 'jadwal_terpadu' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari kegiatan sensus / survei / PJ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-gray-500 font-medium">
              <span>Total: {filteredJadwal.length} Kegiatan Terjadwal Tahun 2026</span>
            </div>
          </div>

          {/* Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredJadwal.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md font-semibold">
                      {item.id}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${item.statusColor}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900 leading-snug hover:text-indigo-600 transition-colors">
                    {item.nama}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-1 font-medium">{item.tim}</p>

                  <div className="mt-4 space-y-2 text-xs text-gray-600 border-t border-gray-100 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-[11px]">Periode Lapangan:</span>
                      <span className="font-medium text-gray-800">{item.periode}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-[11px]">PJ Kegiatan:</span>
                      <span className="font-semibold text-slate-800">{item.pj}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-[11px]">Jumlah Mitra:</span>
                      <span className="font-medium text-gray-800">{item.mitra} Orang Petugas</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-[11px]">Batas SPJ:</span>
                      <span className="font-bold text-rose-600">{item.deadlineSpj}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3.5">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-gray-500 font-medium">Progress SPJ & Lapangan</span>
                      <span className="font-bold text-indigo-700">{item.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-1.5 rounded-full"
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-gray-400">MAK: {item.mak}</span>
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('spj_table')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    <span>Cek SPJ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: CUSTOM PAGE - SOP ALUR PENYERAHAN BERKAS SPJ FISIK */}
      {activeTab === 'custom_page' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-indigo-200 backdrop-blur-xs mb-3">
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                <span>Standard Operating Procedure (SOP) Internal</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Alur Pengajuan & Verifikasi Berkas Fisik SPJ BPS Kab. Sambas
              </h2>
              <p className="text-indigo-100/90 text-xs sm:text-sm mt-2 leading-relaxed">
                Panduan tata kelola penyerahan berkas fisik Surat Pertanggungjawaban (SPJ) dari Tim Kerja
                melewati 5 meja verifikasi fisik hingga pencairan SP2D oleh KPPN Singkawang dan pelaporan LPJ Bendahara.
              </p>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="relative pl-6 sm:pl-8 border-l-2 border-indigo-200/80 space-y-8 my-6">
            {SOP_ITEMS.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Circle Marker */}
                <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-8 h-8 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center font-bold text-xs text-indigo-700 shadow-xs group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  {item.step}
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs hover:border-indigo-300 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md self-start">
                      {item.meja}
                    </span>
                    <span className="text-xs font-semibold text-gray-500">Tahap {item.step} dari 5</span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 mt-2.5">{item.title}</h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{item.desc}</p>

                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <p className="text-[11px] font-bold text-gray-700 mb-2">Dokumen Wajib Diverifikasi:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.dokumen.map((doc, dIdx) => (
                        <span
                          key={dIdx}
                          className="text-[11px] bg-gray-50 border border-gray-200/80 text-gray-700 px-2.5 py-1 rounded-md flex items-center gap-1 font-medium"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: MICROSITE BPS */}
      {activeTab === 'microsite' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari tautan aplikasi / sistem..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            <p className="text-xs text-gray-500">
              Menampilkan {filteredMicrosite.length} portal sistem internal & eksternal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMicrosite.map((site) => (
              <div
                key={site.id}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
                      {site.kategori}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400">{site.badge}</span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <span>{site.nama}</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">{site.desc}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-gray-400 truncate max-w-[160px]">
                    {site.url.replace('https://', '')}
                  </span>
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    <span>Buka Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ContentManagementPage
