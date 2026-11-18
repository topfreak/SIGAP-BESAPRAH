import React, { useState, useEffect, useMemo } from 'react'
import {
  Users,
  UserCheck,
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  Building2,
  Shield,
  CheckCircle2,
  Download,
  Key,
  ShieldCheck,
  UserPlus
} from 'lucide-react'
import { DEMO_USERS, BPS_ROLES } from '../../context/AuthContext'

// PEGAWAI ORGANIK BPS KABUPATEN SAMBAS (Satker 6101 / DIPA 1301)
// Sumber Data Terbaru: Dokumen Resmi "PAK Pegawai BPS Kabupaten Sambas.xlsx" (Tab "Data Kepegawaian")
// Catatan: Pegawai atas nama "Uray Aldi Rivaldi, A.Md.Stat." dikecualikan karena telah mengundurkan diri.
const PEGAWAI_BPS_SAMBAS = [
  {
    id: 'PEG-01',
    nip: '19790827 199912 1 001',
    nama: 'Solikhin, SST., M.Si',
    jabatan: 'Kepala BPS Kabupaten Sambas / KPA & PPSPM',
    tim: 'Pimpinan Satker',
    gol: 'Pembina Tk.I/IV/b',
    status: 'PNS Organik',
    email: 'solikhin@bps.go.id',
    phone: '0811-5701-001',
    role: 'ppspm',
    roleLabel: 'Kepala Kantor / KPA & PPSPM',
  },
  {
    id: 'PEG-02',
    nip: '19940512 201701 2 001',
    nama: 'Ade Wahyu Pratama Putri, SST',
    jabatan: 'Kepala Subbagian Umum',
    tim: 'Subbagian Umum',
    gol: 'Penata/III/c',
    status: 'PNS Organik',
    email: 'ade.putri@bps.go.id',
    phone: '0812-5678-0001',
    role: 'admin_tu',
    roleLabel: 'Kasubbag Umum',
  },
  {
    id: 'PEG-03',
    nip: '19791113 201101 1 004',
    nama: 'Andi Noviantoni, S.P.',
    jabatan: 'Statistisi Ahli Muda / Pejabat Pembuat Komitmen (PPK)',
    tim: 'Subbagian Umum',
    gol: 'Penata Tingkat I/III/d',
    status: 'PNS Organik',
    email: 'andi.noviantoni@bps.go.id',
    phone: '0813-4567-8901',
    role: 'ppk',
    roleLabel: 'Pejabat Pembuat Komitmen (PPK)',
  },
  {
    id: 'PEG-04',
    nip: '19840610 201101 2 028',
    nama: 'Nuri Hayana, S.Si.',
    jabatan: 'Statistisi Ahli Muda / Admin TU & Verifikator Fisik 12 MAK',
    tim: 'Subbagian Umum',
    gol: 'Penata/III/c',
    status: 'PNS Organik',
    email: 'nuri.hayana@bps.go.id',
    phone: '0812-9876-5432',
    role: 'admin_tu',
    roleLabel: 'Admin TU & Verifikator Fisik',
  },
  {
    id: 'PEG-05',
    nip: '19970227 201901 2 001',
    nama: 'Fitria Wulandari, S.Tr.Stat.',
    jabatan: 'Statistisi Ahli Pertama / Bendahara Pengeluaran (Wulan TU)',
    tim: 'Subbagian Umum',
    gol: 'Penata Muda Tingkat I/III/b',
    status: 'PNS Organik',
    email: 'fitria.wulandari@bps.go.id',
    phone: '0821-7788-9900',
    role: 'bendahara',
    roleLabel: 'Bendahara Pengeluaran',
  },
  {
    id: 'PEG-06',
    nip: '20020729 202506 2 001',
    nama: 'Erika Anastasia Putri, A.Md.Ak',
    jabatan: 'Pranata Keuangan APBN',
    tim: 'Subbagian Umum',
    gol: 'Pengatur/II/c',
    status: 'PNS Organik',
    email: 'erika.putri@bps.go.id',
    phone: '0812-7766-5544',
    role: 'bendahara',
    roleLabel: 'Pranata Keuangan APBN',
  },
  {
    id: 'PEG-07',
    nip: '19990118 202201 2 002',
    nama: 'Nurhidayatul Fitri, S.Tr.Stat.',
    jabatan: 'Statistisi Ahli Pertama / Penanggung Jawab Susenas',
    tim: 'Tim Statistik Sosial',
    gol: 'Penata Muda Tingkat I/III/b',
    status: 'PNS Organik',
    email: 'nurhidayatul.fitri@bps.go.id',
    phone: '0813-1122-3344',
    role: 'tim_kerja',
    roleLabel: 'PJ Susenas (Sosial)',
  },
  {
    id: 'PEG-08',
    nip: '20020219 202603 2 001',
    nama: 'Diva Maharani Basuki, S.Tr.Stat.',
    jabatan: 'Statistisi Ahli Pertama / Penanggung Jawab Sakernas',
    tim: 'Tim Statistik Sosial',
    gol: 'Penata Muda/ III/a',
    status: 'CPNS',
    email: 'diva.maharani@bps.go.id',
    phone: '0812-4455-6677',
    role: 'tim_kerja',
    roleLabel: 'PJ Sakernas (Sosial)',
  },
  {
    id: 'PEG-09',
    nip: '19910810 201903 2 001',
    nama: 'Ria Hayatun Nur, S.Stat., M.Si',
    jabatan: 'Statistisi Ahli Pertama / Tim Statistik Sosial',
    tim: 'Tim Statistik Sosial',
    gol: 'Penata Muda Tingkat I/III/b',
    status: 'PNS Organik',
    email: 'ria.hayatun@bps.go.id',
    phone: '0812-1133-5577',
    role: 'tim_kerja',
    roleLabel: 'Tim Statistik Sosial',
  },
  {
    id: 'PEG-10',
    nip: '20010601 202412 2 001',
    nama: 'Zahra Maharani, S.Tr.Stat',
    jabatan: 'Statistisi Ahli Pertama / Tim Statistik Sosial',
    tim: 'Tim Statistik Sosial',
    gol: 'Penata Muda/ III/a',
    status: 'PNS Organik',
    email: 'zahra.maharani@bps.go.id',
    phone: '0812-9900-7766',
    role: 'tim_kerja',
    roleLabel: 'Tim Statistik Sosial',
  },
  {
    id: 'PEG-11',
    nip: '19990421 202203 1 005',
    nama: 'Muhammad Reynaldi, A.Md',
    jabatan: 'Statistisi Terampil / Penanggung Jawab Produksi & SUTAS',
    tim: 'Tim Statistik Produksi',
    gol: 'Pengatur/II/c',
    status: 'PNS Organik',
    email: 'm.reynaldi@bps.go.id',
    phone: '0853-6677-8899',
    role: 'tim_kerja',
    roleLabel: 'PJ Produksi (Pertanian)',
  },
  {
    id: 'PEG-12',
    nip: '19821020 201101 2 009',
    nama: 'Lasmi, A.Md.',
    jabatan: 'Statistisi Penyelia / Tim Statistik Produksi',
    tim: 'Tim Statistik Produksi',
    gol: 'Penata Muda Tk.I/III/b',
    status: 'PNS Organik',
    email: 'lasmi@bps.go.id',
    phone: '0813-8899-7711',
    role: 'tim_kerja',
    roleLabel: 'Tim Statistik Produksi',
  },
  {
    id: 'PEG-13',
    nip: '19820714 200604 1 002',
    nama: 'Adi Rakhmat Putranto, S.T',
    jabatan: 'Statistisi Ahli Muda / Tim Statistik Distribusi',
    tim: 'Tim Statistik Distribusi',
    gol: 'Penata Tingkat I/III/d',
    status: 'PNS Organik',
    email: 'adi.rakhmat@bps.go.id',
    phone: '0812-7788-3344',
    role: 'tim_kerja',
    roleLabel: 'Tim Statistik Distribusi',
  },
  {
    id: 'PEG-14',
    nip: '20001008 202302 2 002',
    nama: 'Alifah Zalfa Azizah, S.Tr.Stat.',
    jabatan: 'Statistisi Ahli Pertama / PJ VHTS & Distribusi',
    tim: 'Tim Statistik Distribusi',
    gol: 'Penata Muda/ III/a',
    status: 'PNS Organik',
    email: 'alifah.zalfa@bps.go.id',
    phone: '0812-6677-8899',
    role: 'tim_kerja',
    roleLabel: 'Tim Statistik Distribusi',
  },
  {
    id: 'PEG-15',
    nip: '19851020 200902 1 003',
    nama: 'Fauzan Azim, SST',
    jabatan: 'Statistisi Ahli Pertama / Tim Nerwilis',
    tim: 'Tim Neraca Wilayah & Analisis Statistik (Nerwilis)',
    gol: 'Penata Tingkat I/III/d',
    status: 'PNS Organik',
    email: 'fauzan.azim@bps.go.id',
    phone: '0852-5566-7788',
    role: 'tim_kerja',
    roleLabel: 'Tim Nerwilis',
  },
  {
    id: 'PEG-16',
    nip: '20000323 202302 2 003',
    nama: 'Talitha Nabila Saifana, S.Tr.Stat.',
    jabatan: 'Pranata Komputer Ahli Pertama / Tim Nerwilis',
    tim: 'Tim Neraca Wilayah & Analisis Statistik (Nerwilis)',
    gol: 'Penata Muda/ III/a',
    status: 'PNS Organik',
    email: 'talitha.saifana@bps.go.id',
    phone: '0812-3322-1100',
    role: 'tim_kerja',
    roleLabel: 'Tim Nerwilis',
  },
  {
    id: 'PEG-17',
    nip: '20000627 202201 1 006',
    nama: 'Dhimas Yuzi Alfarizzi, S.Tr.Stat.',
    jabatan: 'Statistisi Ahli Pertama / Verifikator Lapangan Rekon',
    tim: 'Tim Integrasi Pengolahan & Diseminasi (IPDS)',
    gol: 'Penata Muda Tingkat I/III/b',
    status: 'PNS Organik',
    email: 'dhimas.yuzi@bps.go.id',
    phone: '0813-5566-7788',
    role: 'tim_kerja',
    roleLabel: 'Tim Rekon IPDS',
  },
  {
    id: 'PEG-18',
    nip: '20000105 202310 2 001',
    nama: 'Dwi Karunia Syaputri, S.Tr.Stat.',
    jabatan: 'Pranata Komputer Ahli Pertama',
    tim: 'Tim Integrasi Pengolahan & Diseminasi (IPDS)',
    gol: 'Penata Muda/ III/a',
    status: 'PNS Organik',
    email: 'dwi.karunia@bps.go.id',
    phone: '0812-8899-0011',
    role: 'tim_kerja',
    roleLabel: 'Pranata Komputer IPDS',
  },
  {
    id: 'PEG-19',
    nip: '19981128 202203 2 007',
    nama: 'Dermawati Rematos Siahaan, A.Md.T',
    jabatan: 'Statistisi Terampil / PJ Lapangan Podes',
    tim: 'Tim Statistik Ketahanan & Wilayah',
    gol: 'Pengatur Tk I/II/d',
    status: 'PNS Organik',
    email: 'dermawati.siahaan@bps.go.id',
    phone: '0853-1122-3344',
    role: 'tim_kerja',
    roleLabel: 'PJ Podes Lapangan',
  },
  {
    id: 'PEG-20',
    nip: '19720419 199311 1 001',
    nama: 'Samsuri Sp, S.E.',
    jabatan: 'Statistisi Penyelia / Petugas Lapangan Komstrat',
    tim: 'Subbagian Umum',
    gol: 'Penata Tingkat I/III/d',
    status: 'PNS Organik',
    email: 'samsuri@bps.go.id',
    phone: '0852-4455-6677',
    role: 'tim_kerja',
    roleLabel: 'Statistisi Penyelia',
  },
  {
    id: 'PEG-21',
    nip: '19720407 199603 1 001',
    nama: 'Supardi, S.Mn.',
    jabatan: 'Statistisi Ahli Muda / Verifikator Fisik Berkas',
    tim: 'Subbagian Umum',
    gol: 'Penata Tingkat I/III/d',
    status: 'PNS Organik',
    email: 'supardi@bps.go.id',
    phone: '0813-2233-4455',
    role: 'tim_kerja',
    roleLabel: 'Statistisi Ahli Muda',
  },
  {
    id: 'PEG-22',
    nip: '19850704 201003 1 003',
    nama: 'Firmansyah, S.Si',
    jabatan: 'Statistisi Ahli Muda / Pengelola BMN & Pengadaan',
    tim: 'Subbagian Umum',
    gol: 'Penata Tingkat I/III/d',
    status: 'PNS Organik',
    email: 'firmansyah@bps.go.id',
    phone: '0813-9900-1122',
    role: 'tim_kerja',
    roleLabel: 'Statistisi Ahli Muda',
  },
  {
    id: 'PEG-23',
    nip: '19801023 202521 1 025',
    nama: 'Suhaimi, S.Mn',
    jabatan: 'Penata Layanan Operasional',
    tim: 'Subbagian Umum',
    gol: 'Golongan IX',
    status: 'PNS Organik',
    email: 'suhaimi@bps.go.id',
    phone: '0852-1122-8899',
    role: 'tim_kerja',
    roleLabel: 'Penata Layanan',
  },
  {
    id: 'PEG-24',
    nip: '19800704 202521 1 030',
    nama: 'Mursalin',
    jabatan: 'Operator Layanan Operasional',
    tim: 'Subbagian Umum',
    gol: 'Golongan V',
    status: 'PNS Organik',
    email: 'mursalin@bps.go.id',
    phone: '0813-6677-1122',
    role: 'tim_kerja',
    roleLabel: 'Operator Layanan',
  },
  {
    id: 'PEG-25',
    nip: '19860603 202521 1 064',
    nama: 'Nurdiyanto',
    jabatan: 'Operator Layanan Operasional',
    tim: 'Subbagian Umum',
    gol: 'Golongan V',
    status: 'PNS Organik',
    email: 'nurdiyanto@bps.go.id',
    phone: '0853-4455-2211',
    role: 'tim_kerja',
    roleLabel: 'Operator Layanan',
  },
]

export function PegawaiPage({ mode = 'pegawai', currentUser }) {
  const [activeTab, setActiveTab] = useState(mode)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTim, setSelectedTim] = useState('Semua')
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    setActiveTab(mode)
  }, [mode])

  const teams = [
    'Semua',
    'Pimpinan Satker',
    'Subbagian Umum',
    'Tim Statistik Sosial',
    'Tim Statistik Produksi',
    'Tim Statistik Distribusi',
    'Tim Neraca Wilayah & Analisis Statistik (Nerwilis)',
    'Tim Integrasi Pengolahan & Diseminasi (IPDS)',
    'Tim Statistik Ketahanan & Wilayah',
  ]

  const filteredPegawai = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return PEGAWAI_BPS_SAMBAS.filter((p) => {
      const matchSearch =
        !q ||
        p.nama.toLowerCase().includes(q) ||
        p.nip.toLowerCase().includes(q) ||
        p.jabatan.toLowerCase().includes(q)
      const matchTim = selectedTim === 'Semua' || p.tim === selectedTim
      return matchSearch && matchTim
    })
  }, [searchQuery, selectedTim])

  const userEntries = useMemo(() => Object.entries(DEMO_USERS), [])
  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return userEntries
    return userEntries.filter(([key, u]) => {
      const roleObj = BPS_ROLES.find((r) => r.id === u.role)
      const roleLabel = roleObj?.label || (u.role === 'admin' ? 'Super Admin' : u.role)
      return (
        (u.nama_lengkap && u.nama_lengkap.toLowerCase().includes(q)) ||
        (u.username && u.username.toLowerCase().includes(q)) ||
        (u.nip && u.nip.includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.jabatan && u.jabatan.toLowerCase().includes(q)) ||
        (roleLabel && roleLabel.toLowerCase().includes(q)) ||
        key.toLowerCase().includes(q)
      )
    })
  }, [userEntries, searchQuery])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2.5">
            <Users className="w-7 h-7 text-indigo-600" />
            <span>{activeTab === 'pegawai' ? 'Direktori Pegawai BPS Sambas' : 'Manajemen Pengguna & Hak Akses'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Data Pegawai Organik BPS Kabupaten Sambas (Satker 6101 / DIPA 1301) & Manajemen Wewenang SIGAP BESAPRAH
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-gray-100 rounded-xl border border-gray-200 text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('pegawai')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'pegawai'
                ? 'bg-white text-indigo-700 shadow-xs font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Daftar Pegawai</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pengguna')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'pengguna'
                ? 'bg-white text-indigo-700 shadow-xs font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Akun Pengguna Sistem ({filteredUsers.length})</span>
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={activeTab === 'pegawai' ? "Cari nama, NIP, atau jabatan..." : "Cari nama, username, NIP, atau role akun..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          {activeTab === 'pegawai' && (
            <select
              value={selectedTim}
              onChange={(e) => setSelectedTim(e.target.value)}
              className="w-full sm:w-auto text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 font-semibold focus:ring-2 focus:ring-indigo-600 cursor-pointer"
            >
              {teams.map((t, idx) => (
                <option key={idx} value={t}>
                  {t}
                </option>
              ))}
            </select>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-end md:self-auto cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Tambah {activeTab === 'pegawai' ? 'Pegawai' : 'Akun'}</span>
        </button>
      </div>

      {/* TABEL PEGAWAI */}
      {activeTab === 'pegawai' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50/80 text-[11px] font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3">Nama Pegawai & NIP</th>
                  <th className="px-4 py-3">Jabatan & Tim Kerja</th>
                  <th className="px-4 py-3">Golongan / Status</th>
                  <th className="px-4 py-3">Kontak Dinas</th>
                  <th className="px-4 py-3">Wewenang Sistem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPegawai.map((peg) => (
                  <tr key={peg.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-gray-900">{peg.nama}</div>
                      <div className="font-mono text-[11px] text-gray-500 mt-0.5">{peg.nip}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-800">{peg.jabatan}</div>
                      <div className="text-[11px] text-indigo-600 font-medium">{peg.tim}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-gray-800">{peg.gol}</span>
                      <span className="ml-2 text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md font-medium">
                        {peg.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span>{peg.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-600 mt-0.5">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span>{peg.phone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-md font-bold">
                        {peg.roleLabel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TABEL PENGGUNA SISTEM */}
      {activeTab === 'pengguna' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50/80 text-[11px] font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3">Profil Pengguna</th>
                  <th className="px-4 py-3">Role Hak Akses</th>
                  <th className="px-4 py-3 min-w-[280px]">Wewenang Meja Verifikasi</th>
                  <th className="px-4 py-3 text-center">Status Akun</th>
                  <th className="px-4 py-3 text-center">Satker / DIPA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p className="font-semibold text-slate-700 text-sm">Tidak ada pengguna yang cocok</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Tidak ditemukan akun pengguna dengan kata kunci "{searchQuery}"
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(([key, u]) => {
                    const isCurrent = currentUser?.role === u.role
                    const roleObj = BPS_ROLES.find((r) => r.id === u.role)
                    const roleLabel = roleObj?.label || (u.role === 'admin' ? 'Super Admin' : u.role.toUpperCase())
                    const wewenang = roleObj?.deskripsi || u.jabatan

                    return (
                      <tr
                        key={key}
                        className={`hover:bg-gray-50/70 transition-colors ${
                          isCurrent ? 'bg-indigo-50/40' : ''
                        }`}
                      >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl text-white font-bold flex items-center justify-center text-xs shadow-xs ${
                              u.role === 'admin' ? 'bg-indigo-950' : 'bg-slate-800'
                            }`}
                          >
                            {u.inisial}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 flex items-center gap-1.5">
                              <span>{u.nama_lengkap}</span>
                              {isCurrent && (
                                <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 font-bold rounded-sm border border-emerald-200">
                                  Aktif Saat Ini
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-gray-500 font-mono mt-0.5">{u.email}</div>
                            <div className="text-[10px] text-gray-400 font-mono">NIP: {u.nip}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-md font-bold border inline-block ${
                            u.role === 'admin'
                              ? 'bg-purple-50 text-purple-800 border-purple-200'
                              : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                          }`}
                        >
                          {roleLabel}
                        </span>
                        <div className="text-[10px] text-gray-400 mt-1">ID: {u.id}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-xs text-gray-700 leading-relaxed font-medium">{wewenang}</p>
                        <span className="text-[10px] text-indigo-600 font-medium block mt-0.5">{u.jabatan}</span>
                      </td>
                      <td className="px-4 py-3.5 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>SSO BPS Aktif</span>
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center whitespace-nowrap font-mono text-[11px] text-gray-600 font-semibold">
                        6101 / DIPA 1301
                      </td>
                    </tr>
                  )
                }))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Tambah Pegawai Dummy */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-gray-900">Tambah Pegawai / Akun BPS Sambas</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  placeholder="Contoh: Rahmat Hidayat, S.Tr.Stat."
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">NIP (18 Digit)</label>
                <input
                  type="text"
                  placeholder="1995xxxx 2021xx x xxx"
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Tim Kerja</label>
                <select className="w-full px-3 py-1.5 border border-gray-200 rounded-lg">
                  <option>Subbagian Umum</option>
                  <option>Tim Statistik Sosial</option>
                  <option>Tim Statistik Produksi</option>
                  <option>Tim Statistik Distribusi</option>
                  <option>Tim Neraca Wilayah & Analisis Statistik</option>
                  <option>Tim Integrasi Pengolahan & Diseminasi (IPDS)</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Data pegawai berhasil ditambahkan ke database Satker 6101.')
                  setShowAddModal(false)
                }}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Simpan Pegawai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PegawaiPage
