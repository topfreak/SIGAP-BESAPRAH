import React, { useState } from 'react'
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  UserCheck,
  CheckCircle2,
  Sparkles,
  User,
  UserPlus,
  Briefcase,
  Building2,
  Check
} from 'lucide-react'
import { useAuth, DEMO_USERS, BPS_ROLES } from '../../context/AuthContext'
import { TIM_KERJA_BPS } from '../../data/bpsStructure'

export function LoginPage({ onLoginSuccess }) {
  const { loginWithUsername, registerWithUsername, loginAsRole, loading, authError } = useAuth()

  // Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState('login')

  // Form States (Berdasarkan Username & Kata Sandi)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [namaLengkap, setNamaLengkap] = useState('')
  const [nip, setNip] = useState('')
  const [selectedRole, setSelectedRole] = useState('tim_kerja')
  const [selectedTimKerja, setSelectedTimKerja] = useState('sosial')
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Handle Login Manual dengan Username
  const handleLogin = async (e) => {
    e.preventDefault()
    setLocalError('')
    setSuccessMsg('')

    if (!username.trim()) {
      setLocalError('Silakan masukkan username atau NIP Anda!')
      return
    }

    const res = await loginWithUsername(username.trim(), password)
    if (res.success) {
      if (onLoginSuccess) onLoginSuccess()
    } else {
      setLocalError(res.error || 'Username atau kata sandi tidak sesuai.')
    }
  }

  // Handle Registrasi Akun Baru dengan Username
  const handleRegister = async (e) => {
    e.preventDefault()
    setLocalError('')
    setSuccessMsg('')

    if (!username.trim()) {
      setLocalError('Username akun BPS wajib diisi!')
      return
    }
    if (!namaLengkap.trim()) {
      setLocalError('Nama lengkap pegawai BPS wajib diisi!')
      return
    }
    if (password.length < 6) {
      setLocalError('Kata sandi minimal 6 karakter!')
      return
    }

    const roleObj = BPS_ROLES.find((r) => r.id === selectedRole)
    const timObj = TIM_KERJA_BPS.find((t) => t.id === selectedTimKerja)
    const jabatanTitle = selectedRole === 'tim_kerja'
      ? `PJ Kegiatan (${timObj?.nama || 'Tim Kerja Teknis'})`
      : roleObj?.label || 'Pegawai BPS'

    const res = await registerWithUsername({
      username: username.trim(),
      password,
      nama_lengkap: namaLengkap.trim(),
      nip: nip.trim() || '-',
      role: selectedRole,
      tim_kerja: selectedRole === 'tim_kerja' ? selectedTimKerja : null,
      jabatan: jabatanTitle,
    })

    if (res.success) {
      if (res.hasSession) {
        if (onLoginSuccess) onLoginSuccess()
      } else {
        setSuccessMsg(
          `Akun resmi berhasil dibuat untuk username "${username.trim()}" dengan Role: "${roleObj?.label}"! Silakan masuk menggunakan username tersebut.`
        )
        setAuthMode('login')
      }
    } else {
      setLocalError(res.error || 'Gagal mendaftarkan akun baru.')
    }
  }

  // Quick Login Uji Coba Peran
  const handleQuickLogin = (roleKey) => {
    loginAsRole(roleKey)
    if (onLoginSuccess) onLoginSuccess()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      
      {/* Header Portal Login */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Emblem Satker BPS */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-600 p-1 shadow-lg shadow-indigo-600/20 flex items-center justify-center">
          <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-9 h-9 text-indigo-600" />
          </div>
        </div>

        <div className="mt-4">
          <span className="text-[11px] font-bold tracking-widest uppercase text-indigo-800 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            BADAN PUSAT STATISTIK KABUPATEN SAMBAS
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-2">
            SIGAP BESAPRAH
          </h1>
          <p className="text-xs text-gray-500 font-medium max-w-xs mx-auto mt-1">
            Sistem Integrasi dan Gerakan Administrasi Pertanggungjawaban yang Rapi dan Akuntabel
          </p>
          <p className="text-xs text-indigo-600 italic font-semibold mt-1">
            “Bersaprah dalam Kerja, Sepakat dalam Akuntabilitas.”
          </p>
        </div>
      </div>

      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-xl space-y-6">
        
        {/* Kartu Formulir Login / Registrasi Utama */}
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          
          {/* Tab Pilihan Mode: Masuk vs Buat Akun Baru */}
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setLocalError(''); setSuccessMsg('') }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-white text-indigo-800 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Masuk Akun Resmi
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('register'); setLocalError(''); setSuccessMsg('') }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'bg-white text-indigo-800 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Registrasi Pegawai BPS
            </button>
          </div>

          {/* Feedback Notifikasi */}
          {localError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 animate-in fade-in">
              {localError}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ============================================================== */}
          {/* FORM LOGIN (BERDASARKAN USERNAME)                              */}
          {/* ============================================================== */}
          {authMode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Username Pengguna BPS / NIP
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="contoh: superadmin, ppk, admin_tu, bendahara, ppspm, tim_kerja"
                    required
                    autoFocus
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 text-xs sm:text-sm bg-gray-50/50"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Gunakan username peran (misal: <span className="font-mono text-indigo-600 font-semibold">superadmin</span>) atau NIP resmi Anda.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 text-xs sm:text-sm bg-gray-50/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  <span>{loading ? 'Memeriksa Kredensial...' : 'Masuk ke Sistem SIGAP'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            /* ============================================================== */
            /* FORM REGISTRASI AKUN BARU (BERDASARKAN USERNAME)               */
            /* ============================================================== */
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Username Akun Baru BPS
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="contoh: budi_santoso / ria_hayatun"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Nama Lengkap & Gelar Pegawai
                </label>
                <input
                  type="text"
                  value={namaLengkap}
                  onChange={(e) => setNamaLengkap(e.target.value)}
                  placeholder="Contoh: Rahmat Hidayat, S.Tr.Stat."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  NIP (18 Digit)
                </label>
                <input
                  type="text"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  placeholder="1995xxxx 2021xx x xxx"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Pilih Role / Peran Pejabat
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm bg-white"
                >
                  {BPS_ROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Kata Sandi Baru
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  required
                  minLength={6}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{loading ? 'Mendaftarkan Akun...' : 'Daftarkan Akun & Tetapkan Role'}</span>
                </button>
              </div>
            </form>
          )}

        </div>

        {/* ============================================================== */}
        {/* PILIH AKUN UJI COBA CEPAT (6 ROLE BPS)                          */}
        {/* ============================================================== */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs sm:text-sm font-bold text-gray-900">
              Pilih Akun Uji Coba Cepat (6 Role BPS):
            </h3>
          </div>

          <p className="text-xs text-gray-500 -mt-2">
            Klik salah satu pejabat di bawah ini untuk langsung masuk dan menguji batasan hak akses navbar samping:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(DEMO_USERS).map(([roleKey, user]) => {
              const isSuperAdmin = user.role === 'admin'
              return (
                <button
                  key={roleKey}
                  type="button"
                  onClick={() => handleQuickLogin(roleKey)}
                  className={`p-3.5 rounded-xl border transition-all text-left flex items-start gap-3 cursor-pointer group hover:shadow-xs ${
                    isSuperAdmin
                      ? 'border-indigo-300 bg-indigo-50/40 hover:bg-indigo-50 hover:border-indigo-500'
                      : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50/40'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white flex-shrink-0 shadow-2xs ${
                      isSuperAdmin ? 'bg-slate-900' : 'bg-indigo-600'
                    }`}
                  >
                    {user.inisial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-gray-900 truncate flex items-center justify-between">
                      <span>{user.nama_lengkap}</span>
                      {isSuperAdmin && (
                        <span className="text-[10px] px-1.5 py-0.2 bg-indigo-100 text-indigo-900 font-bold rounded-sm">
                          FULL
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-semibold text-indigo-600 truncate mt-0.5">
                      {user.role === 'admin' ? 'Superadmin (Akses Penuh)' : user.jabatan.split('(')[0]}
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono truncate mt-0.5 flex items-center gap-1">
                      <span className="text-gray-400">username:</span>
                      <span className="font-bold text-indigo-800 bg-indigo-50 px-1 rounded">{user.username || roleKey}</span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer info keamanan BPS */}
        <div className="text-center text-xs text-gray-400">
          Badan Pusat Statistik Kabupaten Sambas (Satker 6101) © 2026
        </div>

      </div>

    </div>
  )
}

export default LoginPage
