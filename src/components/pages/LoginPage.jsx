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
  Hash,
  Building2
} from 'lucide-react'
import { useAuth, DEMO_USERS, BPS_ROLES } from '../../context/AuthContext'
import { useNavigation } from '../../context/NavigationContext'
import { TIM_KERJA_BPS } from '../../data/bpsStructure'

export function LoginPage() {
  const { loginWithEmail, registerWithEmail, loginAsRole, loading, authError } = useAuth()
  const { navigateTo } = useNavigation()

  // Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState('login')

  // Form States
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [namaLengkap, setNamaLengkap] = useState('')
  const [nip, setNip] = useState('')
  const [selectedRole, setSelectedRole] = useState('tim_kerja')
  const [selectedTimKerja, setSelectedTimKerja] = useState('sosial')
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault()
    setLocalError('')
    setSuccessMsg('')

    if (!email.trim()) {
      setLocalError('Silakan masukkan email dinas BPS Anda!')
      return
    }

    const res = await loginWithEmail(email, password)
    if (res.success) {
      navigateTo('dashboard')
    } else {
      setLocalError(res.error || 'Email atau kata sandi tidak sesuai.')
    }
  }

  // Handle Registrasi Akun Baru dengan Role Pilihan
  const handleRegister = async (e) => {
    e.preventDefault()
    setLocalError('')
    setSuccessMsg('')

    if (!namaLengkap.trim()) {
      setLocalError('Nama lengkap pegawai BPS wajib diisi!')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setLocalError('Format email dinas BPS tidak valid!')
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

    const res = await registerWithEmail({
      email: email.trim(),
      password,
      nama_lengkap: namaLengkap.trim(),
      nip: nip.trim() || '-',
      role: selectedRole,
      tim_kerja: selectedRole === 'tim_kerja' ? selectedTimKerja : null,
      jabatan: jabatanTitle,
    })

    if (res.success) {
      if (res.hasSession) {
        // Langsung masuk ke dashboard jika sesi langsung aktif
        navigateTo('dashboard')
      } else {
        setSuccessMsg(
          `Akun resmi berhasil dibuat dengan Role: "${roleObj?.label}"! Silakan masuk dengan email dan kata sandi Anda.`
        )
        setAuthMode('login')
      }
    } else {
      setLocalError(res.error || 'Gagal mendaftarkan akun baru di Supabase.')
    }
  }

  const handleQuickLogin = (roleKey) => {
    loginAsRole(roleKey)
    navigateTo('dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Logo Emblem BPS */}
        <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-blue-700 via-sky-600 to-indigo-700 p-0.5 shadow-xl shadow-blue-500/15 flex items-center justify-center">
          <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center">
            <ShieldCheck className="w-9 h-9 text-blue-700" />
          </div>
        </div>

        <div className="mt-4">
          <span className="text-[11px] font-bold tracking-widest uppercase text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/80">
            BADAN PUSAT STATISTIK
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
            SIGAP BESAPRAH
          </h1>
          <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto mt-1">
            Sistem Integrasi dan Gerakan Administrasi Pertanggungjawaban yang Rapi dan Akuntabel
          </p>
          <p className="text-xs text-blue-700 italic font-semibold mt-1">
            “Bersaprah dalam Kerja, Sepakat dalam Akuntabilitas.”
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0 space-y-6">
        
        {/* Kartu Formulir Login / Registrasi Utama */}
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          
          {/* Tab Pilihan Mode: Masuk vs Buat Akun Baru */}
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setLocalError(''); setSuccessMsg('') }}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Masuk (Login)
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('register'); setLocalError(''); setSuccessMsg('') }}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Daftar Akun Baru (Pilih Role)
            </button>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900">
              {authMode === 'login' ? 'Masuk ke Akun Anda' : 'Buat Akun Pegawai BPS Baru'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {authMode === 'login'
                ? 'Gunakan email dinas BPS dan kata sandi Anda.'
                : 'Pilih role atau jabatan yang sesuai untuk menguji hak akses verifikasi.'}
            </p>
          </div>

          {/* Notifikasi Sukses */}
          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Notifikasi Error */}
          {(localError || authError) && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              {localError || authError}
            </div>
          )}

          {/* FORM LOGIN */}
          {authMode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Input Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Dinas BPS
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contoh: ahmad.fauzi@bps.go.id"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Input Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Tombol Submit Login */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  <span>{loading ? 'Memproses Masuk...' : 'Masuk ke Sistem SPJ'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          )}

          {/* FORM DAFTAR AKUN BARU (DENGAN PILIHAN ROLE) */}
          {authMode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              
              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nama Lengkap & Gelar
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={namaLengkap}
                    onChange={(e) => setNamaLengkap(e.target.value)}
                    placeholder="contoh: Ir. Budi Santoso, M.Si."
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* NIP */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  NIP (Nomor Induk Pegawai)
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                    placeholder="contoh: 197608202000031001"
                    maxLength={18}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Pilihan Role / Peran BPS */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Role / Tanggung Jawab di BPS
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white font-medium text-slate-800"
                  >
                    {BPS_ROLES.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label} - ({r.deskripsi})
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  *Role ini menentukan meja mana yang dapat Anda verifikasi di alur berkas fisik.
                </p>
              </div>

              {/* Kotak Pilihan Tambahan: Asal Fungsi / Tim Kerja Teknis BPS jika role tim_kerja dipilih */}
              {selectedRole === 'tim_kerja' && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/90 to-sky-50 border border-blue-200/90 space-y-2.5 transition-all animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-blue-700" />
                      <span>Asal Fungsi / Tim Kerja Teknis BPS</span>
                    </label>
                    <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-md">
                      Pengusul SPJ
                    </span>
                  </div>

                  <div className="relative">
                    <select
                      value={selectedTimKerja}
                      onChange={(e) => setSelectedTimKerja(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm bg-white font-semibold text-slate-800"
                    >
                      {TIM_KERJA_BPS.map((tim) => (
                        <option key={tim.id} value={tim.id}>
                          {tim.nama} ({tim.kode})
                        </option>
                      ))}
                    </select>
                  </div>

                  <p className="text-[11px] text-blue-800/80 leading-relaxed">
                    💡 <em>{TIM_KERJA_BPS.find((t) => t.id === selectedTimKerja)?.kegiatanContoh}</em>
                  </p>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Dinas BPS
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contoh: budi.santoso@bps.go.id"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Kata Sandi (Minimal 6 Karakter)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Tombol Submit Registrasi */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{loading ? 'Mendaftarkan Akun...' : 'Daftarkan Akun & Tetapkan Role'}</span>
                </button>
              </div>

            </form>
          )}

        </div>

        {/* Kotak Masuk Cepat untuk Uji Coba Peran (Sangat Ramah Penguji & Gaptek) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              Uji Coba Cepat (Pilih Peran Tanpa Ketik Sandi):
            </h3>
          </div>

          <p className="text-xs text-slate-500 -mt-2">
            Klik salah satu pejabat di bawah ini untuk langsung mencoba alur kerja dan izin akses verifikasi:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {Object.entries(DEMO_USERS).map(([roleKey, user]) => (
              <button
                key={roleKey}
                onClick={() => handleQuickLogin(roleKey)}
                className="p-3 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left flex items-start gap-2.5 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-800 truncate">
                    {user.nama_lengkap}
                  </div>
                  <div className="text-[11px] text-blue-700 font-medium truncate">
                    {user.jabatan.split('(')[0]}
                  </div>
                </div>
              </button>
            ))}
          </div>

        </div>

        {/* Footer info keamanan BPS */}
        <div className="text-center text-xs text-slate-400">
          Sistem Terlindungi Keamanan Row Level Security (RLS) & Jaringan BPS © 2026
        </div>

      </div>

    </div>
  )
}

export default LoginPage
