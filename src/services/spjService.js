import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import { MOCK_PENGAJUAN_SPJ, MOCK_MASTER_AKUN } from '../data/mockData'

/**
 * Service Layer untuk Integrasi Supabase & Data SPJ SIGAP BESAPRAH
 */

// 1. Ambil Semua Data Master Akun (MAK) Beserta Syarat Dokumen Fisiknya
export async function getMasterAkunWithSyarat() {
  if (isSupabaseConfigured) {
    try {
      const { data: akunData, error: akunErr } = await supabase
        .from('master_akun')
        .select('*')
        .order('kode_akun', { ascending: true })

      if (akunErr) throw akunErr

      const { data: syaratData, error: syaratErr } = await supabase
        .from('master_syarat')
        .select('*')
        .order('urutan', { ascending: true })

      if (syaratErr) throw syaratErr

      // Gabungkan syarat ke dalam masing-masing akun jika data akun tersedia di Supabase
      if (akunData && akunData.length > 0) {
        return akunData.map((akun) => ({
          ...akun,
          syarat: (syaratData || []).filter((s) => s.master_akun_id === akun.id),
        }))
      }
    } catch (err) {
      console.warn('[SPJ Service] Gagal memuat master akun dari Supabase, fallback ke data lokal:', err)
    }
  }
  return MOCK_MASTER_AKUN
}

// 2. Ambil Daftar Pengajuan SPJ
export async function getPengajuanList(currentUser) {
  if (isSupabaseConfigured && currentUser) {
    try {
      let query = supabase
        .from('pengajuan_spj')
        .select(`
          *,
          master_akun:master_akun_id (kode_akun, nama_akun),
          users_profile:user_id (nama_lengkap, role)
        `)
        .order('created_at', { ascending: false })

      // Sesuai kebijakan RLS: Tim Kerja hanya melihat buatannya sendiri
      if (currentUser.role === 'tim_kerja') {
        query = query.eq('user_id', currentUser.id)
      }

      const { data, error } = await query
      if (error) throw error

      if (data && data.length > 0) {
        return data.map((item) => ({
          id: item.id,
          nama_kegiatan: item.nama_kegiatan,
          tim_kerja: item.tim_kerja || 'sosial',
          nama_pj: item.nama_pj || item.users_profile?.nama_lengkap || 'PJ Kegiatan',
          user_id: item.user_id,
          pemohon: item.users_profile?.nama_lengkap || 'Pegawai BPS',
          master_akun_id: item.master_akun_id,
          kode_akun: item.master_akun?.kode_akun || '-',
          nama_akun: item.master_akun?.nama_akun || '-',
          nominal_rpd: Number(item.nominal_rpd) || 0,
          nominal_pengajuan: Number(item.nominal_pengajuan) || 0,
          posisi_berkas: item.posisi_berkas,
          status_kelengkapan: item.status_kelengkapan,
          catatan_revisi: item.catatan_revisi,
          nomor_sp2d: item.nomor_sp2d,
          tanggal_sp2d: item.tanggal_sp2d,
          created_at: item.created_at,
        }))
      }
    } catch (err) {
      console.warn('[SPJ Service] Gagal mengambil SPJ dari Supabase, fallback ke state lokal:', err)
    }
  }

  // Fallback ke session storage atau mock data
  const saved = sessionStorage.getItem('sigap_local_spj_list')
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {
      // ignore
    }
  }
  return MOCK_PENGAJUAN_SPJ
}

// 3. Simpan Pengajuan SPJ Baru Beserta Inisialisasi Dynamic Checklist
export async function createPengajuanSpj(payload, currentUser, masterAkunList) {
  const mak = masterAkunList.find((m) => m.id === payload.master_akun_id) || masterAkunList[0]

  if (isSupabaseConfigured && currentUser) {
    try {
      // A. Insert ke pengajuan_spj
      const { data: newSpj, error: spjErr } = await supabase
        .from('pengajuan_spj')
        .insert({
          user_id: currentUser.id,
          master_akun_id: payload.master_akun_id,
          nama_kegiatan: payload.nama_kegiatan,
          tim_kerja: payload.tim_kerja || 'sosial',
          nama_pj: payload.nama_pj || currentUser.nama_lengkap || 'PJ Kegiatan',
          metode_bayar: payload.metode_bayar || 'LS',
          nominal_rpd: Number(payload.nominal_rpd) || 0,
          nominal_pengajuan: Number(payload.nominal_pengajuan) || 0,
          posisi_berkas: 'admin_tu', // Diserahkan ke meja TU
          status_kelengkapan: 'kuning', // Sedang diverifikasi
          catatan_revisi: null,
        })
        .select()
        .single()

      if (spjErr) throw spjErr

      // B. Otomatis buatkan baris di detail_syarat_spj untuk tiap syarat MAK
      if (mak && mak.syarat && mak.syarat.length > 0) {
        const detailRows = mak.syarat.map((s) => ({
          pengajuan_spj_id: newSpj.id,
          master_syarat_id: s.id,
          is_checked: false,
        }))

        const { error: detailErr } = await supabase
          .from('detail_syarat_spj')
          .insert(detailRows)

        if (detailErr) console.warn('[SPJ Service] Gagal membuat baris detail syarat:', detailErr)
      }

      return { success: true, data: newSpj }
    } catch (err) {
      console.error('[SPJ Service] Error createPengajuanSpj di Supabase:', err)
    }
  }

  // Fallback Simpan Lokal
  const newLocalSpj = {
    id: `SPJ-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`,
    nama_kegiatan: payload.nama_kegiatan,
    tim_kerja: payload.tim_kerja || 'sosial',
    nama_pj: payload.nama_pj || currentUser?.nama_lengkap || 'Ahmad Fauzi, S.Tr.Stat.',
    user_id: currentUser?.id || 'mock-user-001',
    pemohon: currentUser?.nama_lengkap || 'Ahmad Fauzi, S.Tr.Stat.',
    master_akun_id: payload.master_akun_id,
    kode_akun: mak.kode_akun,
    nama_akun: mak.nama_akun,
    metode_bayar: payload.metode_bayar || 'LS',
    nominal_rpd: Number(payload.nominal_rpd) || Number(payload.nominal_pengajuan) || 0,
    nominal_pengajuan: Number(payload.nominal_pengajuan) || 0,
    posisi_berkas: 'admin_tu',
    status_kelengkapan: 'kuning',
    catatan_revisi: null,
    nomor_sp2d: null,
    tanggal_sp2d: null,
    created_at: new Date().toISOString(),
    checklist: (mak.syarat || []).map((s) => ({
      master_syarat_id: s.id,
      nama_syarat: s.nama_syarat,
      is_wajib: s.is_wajib,
      is_checked: false,
    })),
  }

  return { success: true, data: newLocalSpj }
}
