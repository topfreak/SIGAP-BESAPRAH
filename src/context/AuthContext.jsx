import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export const DEMO_USERS = {
  tim_kerja: {
    id: 'user-tim-001',
    nama_lengkap: 'Ahmad Fauzi, S.Tr.Stat.',
    nip: '199505122018011002',
    role: 'tim_kerja',
    tim_kerja: 'sosial',
    jabatan: 'PJ Kegiatan (Tim Statistik Sosial)',
    email: 'ahmad.fauzi@bps.go.id',
  },
  admin_tu: {
    id: 'user-tu-002',
    nama_lengkap: 'Siti Aminah, S.Sos.',
    nip: '198803152010122003',
    role: 'admin_tu',
    jabatan: 'Petugas Tata Usaha (Pemeriksa Berkas Awal)',
    email: 'siti.aminah@bps.go.id',
  },
  ppk: {
    id: 'user-ppk-003',
    nama_lengkap: 'Ir. Budi Santoso, M.Si.',
    nip: '197608202000031001',
    role: 'ppk',
    jabatan: 'Pejabat Pembuat Komitmen (PPK BPS)',
    email: 'budi.santoso@bps.go.id',
  },
  bendahara: {
    id: 'user-ben-004',
    nama_lengkap: 'Sri Wahyuni, S.E.',
    nip: '198411022008012005',
    role: 'bendahara',
    jabatan: 'Bendahara Pengeluaran (Pajak & Kuitansi)',
    email: 'sri.wahyuni@bps.go.id',
  },
  ppspm: {
    id: 'user-spm-005',
    nama_lengkap: 'Drs. Hendra Wijaya',
    nip: '197104101994031002',
    role: 'ppspm',
    jabatan: 'Pejabat Penandatangan SPM (PPSPM BPS)',
    email: 'hendra.wijaya@bps.go.id',
  },
}

export const BPS_ROLES = [
  { id: 'tim_kerja', label: 'Tim Kerja (Pengusul SPJ)', deskripsi: 'Penyusun berkas kegiatan & revisi fisik' },
  { id: 'admin_tu', label: 'Tata Usaha (Admin TU)', deskripsi: 'Pemeriksaan fisik awal & kelengkapan' },
  { id: 'ppk', label: 'PPK (Komitmen Anggaran)', deskripsi: 'Pengujian komitmen & beban DIPA' },
  { id: 'bendahara', label: 'Bendahara Pengeluaran', deskripsi: 'Pemeriksaan pajak, bukti bayar & kuitansi' },
  { id: 'ppspm', label: 'PPSPM', deskripsi: 'Pengujian SPM & penerbitan SP2D' },
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
    // Default awal: null (mengarahkan pengguna baru ke halaman Login)
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
            })
          }
        }
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  // Fungsi Login dengan Email & Password
  const loginWithEmail = async (email, password) => {
    setLoading(true)
    setAuthError(null)

    // Jika Supabase live terhubung
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
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

    // Mode Simulasi BPS (Sandbox)
    await new Promise((r) => setTimeout(r, 400)) // simulasi respons cepat
    const matched = Object.values(DEMO_USERS).find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    )

    if (matched) {
      setCurrentUser(matched)
      setLoading(false)
      return { success: true }
    }

    // Default jika email bebas: buatkan profil Tim Kerja
    const customUser = {
      id: 'user-' + Date.now(),
      nama_lengkap: email.split('@')[0].replace('.', ' ').toUpperCase(),
      nip: '199001012015011001',
      role: 'tim_kerja',
      jabatan: 'Pegawai BPS',
      email: email,
    }
    setCurrentUser(customUser)
    setLoading(false)
    return { success: true }
  }

  // Fungsi Registrasi Akun Baru dengan Role & Data BPS Pilihan
  const registerWithEmail = async ({ email, password, nama_lengkap, nip, role, tim_kerja, jabatan }) => {
    setLoading(true)
    setAuthError(null)

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nama_lengkap: nama_lengkap || email.split('@')[0],
            nip: nip || '-',
            role: role || 'tim_kerja',
            tim_kerja: tim_kerja || (role === 'tim_kerja' ? 'sosial' : null),
            jabatan: jabatan || 'Pegawai BPS',
          },
        },
      })

      if (error) {
        setLoading(false)
        setAuthError(error.message)
        return { success: false, error: error.message }
      }

      // Jika session langsung terbentuk (misal confirm email dimatikan)
      if (data?.session && data?.user) {
        const newProfile = {
          id: data.user.id,
          nama_lengkap: nama_lengkap || email.split('@')[0],
          nip: nip || '-',
          role: role || 'tim_kerja',
          tim_kerja: tim_kerja || (role === 'tim_kerja' ? 'sosial' : null),
          jabatan: jabatan || 'Pegawai BPS',
          email,
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

    // Fallback Mode Sandbox / Lokal
    await new Promise((r) => setTimeout(r, 400))
    const localUser = {
      id: 'user-' + Date.now(),
      nama_lengkap: nama_lengkap || email.split('@')[0],
      nip: nip || '199001012015011001',
      role: role || 'tim_kerja',
      tim_kerja: tim_kerja || (role === 'tim_kerja' ? 'sosial' : null),
      jabatan: jabatan || 'Pegawai BPS',
      email: email,
    }
    setCurrentUser(localUser)
    setLoading(false)
    return { success: true, hasSession: true }
  }

  // Masuk Cepat / Demo Akun (1-Klik untuk menguji tiap peran)
  const loginAsRole = (roleKey) => {
    const user = DEMO_USERS[roleKey]
    if (user) {
      setCurrentUser(user)
      return true
    }
    return false
  }

  // Switch role langsung dari header saat di dalam aplikasi
  const switchRole = (newRole) => {
    const user = DEMO_USERS[newRole]
    if (user) {
      setCurrentUser(user)
    } else {
      const roleInfo = BPS_ROLES.find((r) => r.id === newRole)
      setCurrentUser((prev) => ({
        ...prev,
        role: newRole,
        jabatan: roleInfo ? roleInfo.label : newRole,
      }))
    }
  }

  // Keluar / Logout
  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut()
    }
    sessionStorage.removeItem('sigap_user_session')
    sessionStorage.removeItem('sigap_navigation_state')
    setCurrentUser(null)
  }

  const value = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    loginWithEmail,
    registerWithEmail,
    loginAsRole,
    switchRole,
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
