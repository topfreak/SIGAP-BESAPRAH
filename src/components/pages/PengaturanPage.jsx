import React, { useState, useMemo } from 'react'
import {
  Settings,
  ShieldCheck,
  Building2,
  Users,
  UserCheck,
  Sparkles,
  KeyRound,
  CheckCircle2,
  Lock,
  Plus,
  Search
} from 'lucide-react'
import { DEMO_USERS, BPS_ROLES } from '../../context/AuthContext'

export function PengaturanPage({ currentUser, onSwitchRole }) {
  const isAdmin = currentUser?.role === 'admin'
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [newUserName, setNewUserName] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserRole, setNewUserRole] = useState('tim_kerja')
  const [alertSuccess, setAlertSuccess] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    const entries = Object.entries(DEMO_USERS)
    if (!q) return entries
    return entries.filter(([key, u]) => {
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
  }, [searchQuery])

  const handleCreateUser = (e) => {
    e.preventDefault()
    if (!newUserName.trim() || !newUserEmail.trim()) {
      alert('Nama dan Email wajib diisi!')
      return
    }
    setAlertSuccess(`Pengguna baru "${newUserName}" dengan role "${newUserRole}" berhasil didaftarkan.`)
    setShowAddUserModal(false)
    setNewUserName('')
    setNewUserEmail('')
    setTimeout(() => setAlertSuccess(''), 4000)
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          Pengaturan Sistem
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Konfigurasi Satker BPS Kabupaten Sambas dan Manajemen Hak Akses Pengguna
        </p>
      </div>

      {alertSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{alertSuccess}</span>
        </div>
      )}

      {/* 1. KOTAK MANAJEMEN AKUN & ROLE PENGGUNA BPS (ADMIN PANEL) */}
      <div className="bg-white border border-gray-200/90 rounded-xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Manajemen Pengguna & Role BPS</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Daftar akun pejabat, petugas verifikasi berkas, dan administrator sistem.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama, NIP, username, role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowAddUserModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors self-start sm:self-auto cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Pengguna</span>
            </button>
          </div>
        </div>

        {/* Tabel Daftar Pengguna & Role */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50/80 text-[11px] font-semibold text-gray-700 uppercase tracking-wider border-y border-gray-200/70">
              <tr>
                <th className="px-4 py-3">Nama Pegawai & NIP</th>
                <th className="px-4 py-3">Role / Peran</th>
                <th className="px-4 py-3">Lingkup Meja Kerja</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Uji Coba Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                    Tidak ditemukan pengguna yang cocok dengan "{searchQuery}"
                  </td>
                </tr>
              ) : (
                filteredUsers.map(([key, u]) => {
                  const isSelected = currentUser?.role === u.role
                  const isItemAdmin = u.role === 'admin'

                return (
                  <tr
                    key={key}
                    className={`hover:bg-gray-50/70 transition-colors ${
                      isSelected ? 'bg-indigo-50/40' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-full text-white font-bold text-[11px] flex items-center justify-center flex-shrink-0 ${
                            isItemAdmin ? 'bg-purple-800' : 'bg-slate-800'
                          }`}
                        >
                          {u.inisial || 'U'}
                        </div>
                        <div>
                          <span className="font-bold text-gray-800 block text-xs">
                            {u.nama_lengkap}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            NIP. {u.nip}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      {isItemAdmin ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                          <Sparkles className="w-3 h-3 text-purple-600" />
                          <span>Administrator (Super Admin)</span>
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-700">
                          {BPS_ROLES.find((r) => r.id === u.role)?.label || u.role}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-gray-600 text-[11px]">
                      {isItemAdmin ? (
                        <strong className="text-purple-700">Akses Penuh Seluruh Meja (Bypass)</strong>
                      ) : u.role === 'tim_kerja' ? (
                        'Meja 1: Pengusul SPJ Kegiatan'
                      ) : u.role === 'admin_tu' ? (
                        'Meja 2: Pemeriksa Berkas Awal TU'
                      ) : u.role === 'ppk' ? (
                        'Meja 3: Pengujian Komitmen PPK'
                      ) : u.role === 'bendahara' ? (
                        'Meja 4: Pajak & Kuitansi Bendahara'
                      ) : u.role === 'ppspm' ? (
                        'Meja 5: Pengujian SPM & SP2D'
                      ) : (
                        '-'
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Aktif</span>
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      {isSelected ? (
                        <span className="text-indigo-600 font-bold text-[11px]">
                          Sedang Aktif
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onSwitchRole && onSwitchRole(u.role)}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded-md border border-gray-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 transition-colors cursor-pointer"
                        >
                          Masuk sebagai Ini
                        </button>
                      )}
                    </td>
                  </tr>
                )
              }))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. IDENTITAS SATKER & PARAMETER SISTEM */}
      <div className="bg-white border border-gray-200/90 rounded-xl p-6 shadow-xs space-y-6">
        <div>
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <span>Identitas Satuan Kerja (Satker)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-gray-500 font-medium mb-1">Nama Satuan Kerja</label>
              <input
                type="text"
                readOnly
                value="Badan Pusat Statistik Kabupaten Sambas"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-semibold cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-gray-500 font-medium mb-1">Kode BPS Kabupaten Sambas</label>
              <input
                type="text"
                readOnly
                value="6101"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-indigo-800 font-mono font-bold cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-gray-500 font-medium mb-1">Kode DIPA Satuan Kerja</label>
              <input
                type="text"
                readOnly
                value="1301"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-indigo-800 font-mono font-bold cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-gray-500 font-medium mb-1">Alamat Kantor</label>
              <input
                type="text"
                readOnly
                value="Jl. Pembangunan, Desa Pendawan, Kec. Sambas, Kab. Sambas, Kalbar 79462"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-gray-500 font-medium mb-1">Tahun Anggaran Berjalan</label>
              <input
                type="text"
                readOnly
                value="2026 (DIPA Induk)"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-indigo-700 font-bold cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Alur Verifikasi 5 Meja Kerja & Bypass Administrator</span>
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed mb-3">
            Sistem pengujian berjenjang aktif: <strong>Tim Kerja (Pengusul) → Tata Usaha (Pemeriksa Berkas) → PPK (Pengujian Komitmen) → Bendahara Pengeluaran (Pajak & Kuitansi) → PPSPM (Pengujian SPM & SP2D)</strong>.
          </p>
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-900 font-medium">
            👑 <strong>Role Administrator:</strong> Memiliki wewenang super-user untuk memantau seluruh proses, memverifikasi berkas di meja mana pun, melakukan bypass bila ada kendala operasional, dan mengelola konfigurasi akun.
          </div>
        </div>
      </div>

      {/* MODAL TAMBAH PENGGUNA BARU */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full p-6 space-y-4 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              Tambah Pengguna Baru BPS
            </h3>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Nama Lengkap Pegawai & Gelar
                </label>
                <input
                  type="text"
                  required
                  placeholder="contoh: Muhammad Rizky, S.Stat."
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Email Dinas BPS
                </label>
                <input
                  type="email"
                  required
                  placeholder="contoh: m.rizky@bps.go.id"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Pilih Role / Peran
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600 font-medium"
                >
                  {BPS_ROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label} - ({r.deskripsi})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-3.5 py-2 border border-gray-200 rounded-lg text-gray-600 font-semibold hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-xs cursor-pointer"
                >
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default PengaturanPage
