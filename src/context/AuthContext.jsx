import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export const DEMO_USERS = {
  admin: {
    id: 'user-admin-000',
    username: 'superadmin',
    nama_lengkap: 'Super Admin',
    nip: '-',
    role: 'admin',
    inisial: 'SA',
    jabatan: 'Administrator Sistem (Super Admin)',
    email: 'superadmin@bps.go.id',
    satker: 'BPS Kabupaten Sambas (6101 / DIPA 1301)',
  },
  ppk: {
    id: 'user-ppk-001',
    username: 'ppk',
    nama_lengkap: 'Andi Noviantoni, S.P.',
    nip: '197911132011011004',
    role: 'ppk',
    inisial: 'AN',
    jabatan: 'Pejabat Pembuat Komitmen (PPK BPS)',
    email: 'andi.noviantoni@bps.go.id',
    satker: 'BPS Kabupaten Sambas (6101 / DIPA 1301)',
  },
  admin_tu: {
    id: 'user-tu-002',
    username: 'admin_tu',
    nama_lengkap: 'Nuri Hayana, S.Si.',
    nip: '198406102011012028',
    role: 'admin_tu',
    inisial: 'NH',
    jabatan: 'Petugas Tata Usaha (Pemeriksa Berkas 12 MAK)',
    email: 'nuri.hayana@bps.go.id',
    satker: 'BPS Kabupaten Sambas (6101 / DIPA 1301)',
  },
  tim_kerja: {
    id: 'user-tim-003',
    username: 'tim_kerja',
    nama_lengkap: 'Nurhidayatul Fitri, S.Tr.Stat.',
    nip: '199901182022012002',
    role: 'tim_kerja',
    inisial: 'NF',
    tim_kerja: 'sosial',
    jabatan: 'PJ Kegiatan Susenas (Tim Statistik Sosial)',
    email: 'nurhidayatul.fitri@bps.go.id',
    satker: 'BPS Kabupaten Sambas (6101 / DIPA 1301)',
  },
  bendahara: {
    id: 'user-ben-004',
    username: 'bendahara',
    nama_lengkap: 'Fitria Wulandari, S.Tr.Stat.',
    nip: '199702272019012001',
    role: 'bendahara',
    inisial: 'FW',
    jabatan: 'Bendahara Pengeluaran (Wulan TU)',
    email: 'fitria.wulandari@bps.go.id',
    satker: 'BPS Kabupaten Sambas (6101 / DIPA 1301)',
  },
  ppspm: {
    id: 'user-spm-005',
    username: 'ppspm',
    nama_lengkap: 'Solikhin, SST., M.Si',
    nip: '197908271999121001',
    role: 'ppspm',
    inisial: 'SL',
    jabatan: 'Kepala BPS Kabupaten Sambas (KPA & PPSPM)',
    email: 'solikhin@bps.go.id',
    satker: 'BPS Kabupaten Sambas (6101 / DIPA 1301)',
  },
}

export const BPS_ROLES = [
  { id: 'admin', label: 'Administrator (Super Admin)', deskripsi: 'Akses penuh seluruh meja kerja, manajemen pengguna & konfigurasi sistem' },
  { id: 'ppk', label: 'PPK (Komitmen Anggaran)', deskripsi: 'Pengujian komitmen & beban pagu DIPA 1301' },
  { id: 'admin_tu', label: 'Tata Usaha (Admin TU)', deskripsi: 'Pemeriksaan fisik awal & kelengkapan 12 MAK' },
  { id: 'tim_kerja', label: 'Tim Kerja (Pengusul SPJ)', deskripsi: 'Penyusun berkas kegiatan & revisi fisik kekurangan Sheet3' },
  { id: 'bendahara', label: 'Bendahara Pengeluaran', deskripsi: 'Pemeriksaan pajak PPh/PPN, bukti transfer CMS & kuitansi' },
  { id: 'ppspm', label: 'PPSPM', deskripsi: 'Pengujian formalitas dokumen SPM & penerbitan SP2D' },
]

export function AuthProvider({ children }) {
  // Inisialisasi status sesi dari sessionStorage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('sigap_user_session')
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (e) {
      console.warn('Gagal membaca sesi pengguna:', e)
    }
    // Default awal: null (mengarahkan pengguna baru ke portal Login resmi BPS)
    return null
  })

  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState(null)

  // Sinkronkan ke sessionStorage
  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('sigap_user_session', JSON.stringify(currentUser))
    } else {
      sessionStorage.removeItem('sigap_user_session')
    }
  }, [currentUser])

  // Listener session Supabase nyata jika .env dikonfigurasi
  useEffect(() => {
    if (!isSupabaseConfigured) return

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('users_profile')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (profile) {
            setCurrentUser(profile)
          } else {
            setCurrentUser({
              id: session.user.id,
              nama_lengkap: session.user.user_metadata?.nama_lengkap || session.user.email,
              role: session.user.user_metadata?.role || 'tim_kerja',
              tim_kerja: session.user.user_metadata?.tim_kerja || 'sosial',
              nip: session.user.user_metadata?.nip || '-',
              email: session.user.email,
              satker: 'BPS Kabupaten Sambas (6101 / DIPA 1301)',
            })
          }
        }
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  // Fungsi Login dengan Username & Password (resmi BPS Sambas)
  const loginWithUsername = async (username, password) => {
    setLoading(true)
    setAuthError(null)

    const cleanInput = (username || '').trim().toLowerCase()
    const cleanNip = cleanInput.replace(/\s+/g, '')

    // Jika Supabase live terhubung
    if (isSupabaseConfigured) {
      // Supabase biasanya menggunakan email, jika input bukan email jadikan domain satker
      const loginEmail = cleanInput.includes('@') ? cleanInput : `${cleanInput}@bps.go.id`
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
      })

      if (error) {
        setLoading(false)
        setAuthError(error.message)
        return { success: false, error: error.message }
      }

      setLoading(false)
      return { success: true }
    }

    // Mode Autentikasi Internal Satker BPS Sambas
    await new Promise((r) => setTimeout(r, 350))

    // 1. Cek kecocokan di DEMO_USERS (berdasarkan username, key peran, email, atau NIP)
    const matched = Object.entries(DEMO_USERS).find(([key, u]) => {
      const uUsername = (u.username || '').toLowerCase()
      const uEmail = (u.email || '').toLowerCase()
      const uNip = (u.nip || '').replace(/\s+/g, '')

      return (
        uUsername === cleanInput ||
        key.toLowerCase() === cleanInput ||
        uEmail === cleanInput ||
        (uNip && uNip === cleanNip && cleanNip.length > 5)
      )
    })

    if (matched) {
      setCurrentUser(matched[1])
      setLoading(false)
      return { success: true, user: matched[1] }
    }

    // 2. Default jika username terdaftar lainnya: buatkan profil Pegawai BPS Sambas
    const displayName = cleanInput
      .replace(/[-_.]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())

    const customUser = {
      id: 'user-' + Date.now(),
      username: cleanInput,
      nama_lengkap: displayName,
      nip: cleanNip.length >= 18 ? cleanNip : '199501012020011001',
      role: 'tim_kerja',
      inisial: cleanInput.slice(0, 2).toUpperCase(),
      jabatan: 'Pegawai Organik BPS Sambas',
      email: `${cleanInput}@bps.go.id`,
      satker: 'BPS Kabupaten Sambas (6101 / DIPA 1301)',
    }
    setCurrentUser(customUser)
    setLoading(false)
    return { success: true, user: customUser }
  }

  // Fungsi Login dengan Email (backward-compatibility)
  const loginWithEmail = async (emailOrUsername, password) => {
    return loginWithUsername(emailOrUsername, password)
  }

  // Fungsi Registrasi Akun Baru dengan Username, Role & Data BPS Pilihan
  const registerWithUsername = async ({ username, email, password, nama_lengkap, nip, role, tim_kerja, jabatan }) => {
    setLoading(true)
    setAuthError(null)

    const cleanUser = (username || email?.split('@')[0] || 'pegawai').trim().toLowerCase()
    const userEmail = email || `${cleanUser}@bps.go.id`

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email: userEmail,
        password,
        options: {
          data: {
            username: cleanUser,
            nama_lengkap: nama_lengkap || cleanUser,
            nip: nip || '-',
            role: role || 'tim_kerja',
            tim_kerja: tim_kerja || (role === 'tim_kerja' ? 'sosial' : null),
            jabatan: jabatan || 'Pegawai BPS Sambas',
          },
        },
      })

      if (error) {
        setLoading(false)
        setAuthError(error.message)
        return { success: false, error: error.message }
      }

      if (data?.session && data?.user) {
        const newProfile = {
          id: data.user.id,
          username: cleanUser,
          nama_lengkap: nama_lengkap || cleanUser,
          nip: nip || '-',
          role: role || 'tim_kerja',
          tim_kerja: tim_kerja || (role === 'tim_kerja' ? 'sosial' : null),
          inisial: (nama_lengkap || cleanUser).slice(0, 2).toUpperCase(),
          jabatan: jabatan || 'Pegawai BPS Sambas',
          email: userEmail,
          satker: 'BPS Kabupaten Sambas (6101 / DIPA 1301)',
        }
        setCurrentUser(newProfile)
      }

      setLoading(false)
      return { 
        success: true, 
        hasSession: Boolean(data?.session),
        user: data?.user 
      }
    }

    // Mode Sandbox Satker BPS Sambas
    await new Promise((r) => setTimeout(r, 350))
    const localUser = {
      id: 'user-' + Date.now(),
      username: cleanUser,
      nama_lengkap: nama_lengkap || cleanUser,
      nip: nip || '199501012020011001',
      role: role || 'tim_kerja',
      tim_kerja: tim_kerja || (role === 'tim_kerja' ? 'sosial' : null),
      inisial: (nama_lengkap || cleanUser).slice(0, 2).toUpperCase(),
      jabatan: jabatan || 'Pegawai BPS Sambas',
      email: userEmail,
      satker: 'BPS Kabupaten Sambas (6101 / DIPA 1301)',
    }
    setCurrentUser(localUser)
    setLoading(false)
    return { success: true, hasSession: true, user: localUser }
  }

  // Registrasi dengan Email (backward-compatibility)
  const registerWithEmail = registerWithUsername

  // Masuk Cepat Akun Uji Coba BPS (1-Klik untuk menguji tiap peran)
  const loginAsRole = (roleKey) => {
    const user = DEMO_USERS[roleKey]
    if (user) {
      setCurrentUser(user)
      return true
    }
    return false
  }

  // Keluar / Logout
  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut()
    }
    sessionStorage.removeItem('sigap_user_session')
    sessionStorage.removeItem('sigap_active_page')
    setCurrentUser(null)
  }

  const value = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    loginWithUsername,
    loginWithEmail,
    registerWithUsername,
    registerWithEmail,
    loginAsRole,
    logout,
    loading,
    authError,
    isSupabaseConfigured,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider')
  }
  return context
}
