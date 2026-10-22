import React, { createContext, useContext, useState, useEffect } from 'react'
import { MOCK_PENGAJUAN_SPJ, MOCK_MASTER_AKUN } from '../data/mockData'
import { createPengajuanSpj, getMasterAkunWithSyarat } from '../services/spjService'
import { useAuth } from './AuthContext'

const SpjContext = createContext(null)
const LOCAL_STORAGE_KEY = 'sigap_spj_database'

export function SpjProvider({ children }) {
  const { currentUser } = useAuth()

  // 1. Data Master Akun (MAK) & Syarat Fisik
  const [masterAkunList, setMasterAkunList] = useState(MOCK_MASTER_AKUN)

  // 2. Daftar Berkas Pengajuan SPJ
  const [spjList, setSpjList] = useState(() => {
    try {
      const saved = sessionStorage.getItem(LOCAL_STORAGE_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (e) {
      console.warn('Gagal membaca data SPJ lokal:', e)
    }
    return MOCK_PENGAJUAN_SPJ
  })

  // Sinkronkan ke sessionStorage setiap kali ada data SPJ berubah
  useEffect(() => {
    try {
      sessionStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(spjList))
    } catch (e) {
      console.warn('Gagal menyimpan database SPJ ke sessionStorage:', e)
    }
  }, [spjList])

  // Muat master akun saat inisialisasi
  useEffect(() => {
    getMasterAkunWithSyarat().then((data) => {
      if (data && data.length > 0) {
        setMasterAkunList(data)
      }
    })
  }, [])

  // Cari SPJ berdasarkan ID
  const getSpjById = (id) => {
    return spjList.find((item) => item.id === id) || null
  }

  // Buat Pengajuan SPJ Baru (Langkah 1 s.d 3)
  const tambahPengajuan = async (payload) => {
    const res = await createPengajuanSpj(payload, currentUser, masterAkunList)
    if (res.success && res.data) {
      const spjWithLog = {
        ...res.data,
        riwayat: [
          {
            id: 'rw-' + Date.now(),
            waktu: new Date().toISOString(),
            dari_posisi: null,
            ke_posisi: 'admin_tu',
            status: 'kuning',
            aksi: 'Pengajuan Berkas Fisik Baru',
            petugas: currentUser?.nama_lengkap || 'Pengusul BPS',
            jabatan: currentUser?.jabatan || 'Tim Kerja',
            catatan: 'Berkas fisik diserahkan ke loket Tata Usaha (Admin TU) untuk verifikasi awal.',
          },
        ],
      }
      setSpjList((prev) => [spjWithLog, ...prev])
      return spjWithLog
    }
    return null
  }

  // Centang / Batal Centang Syarat Dokumen Fisik (Dynamic Checklist)
  const toggleChecklist = (spjId, masterSyaratId) => {
    setSpjList((prevList) =>
      prevList.map((spj) => {
        if (spj.id !== spjId) return spj

        const updatedChecklist = spj.checklist.map((item) => {
          if (item.master_syarat_id === masterSyaratId) {
            return { ...item, is_checked: !item.is_checked }
          }
          return item
        })

        // Evaluasi otomatis kelengkapan syarat wajib
        const allWajibChecked = updatedChecklist
          .filter((item) => item.is_wajib)
          .every((item) => item.is_checked)

        let newStatus = spj.status_kelengkapan
        if (!allWajibChecked) {
          newStatus = 'merah'
        } else if (spj.posisi_berkas === 'selesai') {
          newStatus = 'hijau'
        } else {
          newStatus = 'kuning'
        }

        return {
          ...spj,
          checklist: updatedChecklist,
          status_kelengkapan: newStatus,
        }
      })
    )
  }

  // Mengubah Posisi Berkas Fisik Antar-Meja Verifikasi + Log Audit Trail Otomatis
  const alihkanPosisiBerkas = (spjId, targetMeja, catatan = '', nomorSp2d = null) => {
    setSpjList((prevList) =>
      prevList.map((spj) => {
        if (spj.id !== spjId) return spj

        const existingRiwayat = spj.riwayat || []
        const waktuSekarang = new Date().toISOString()
        const namaPetugas = currentUser?.nama_lengkap || 'Petugas BPS'
        const jabatanPetugas = currentUser?.jabatan || 'Pemeriksa'

        // Kasus A: Dikembalikan untuk revisi fisik ke Tim Kerja
        if (targetMeja === 'tim_kerja') {
          const newEntry = {
            id: 'rw-' + Date.now(),
            waktu: waktuSekarang,
            dari_posisi: spj.posisi_berkas,
            ke_posisi: 'tim_kerja',
            status: 'merah',
            aksi: 'Dikembalikan untuk Perbaikan Fisik',
            petugas: namaPetugas,
            jabatan: jabatanPetugas,
            catatan: catatan || 'Terdapat dokumen fisik yang belum lengkap atau perlu diperbaiki.',
          }

          return {
            ...spj,
            posisi_berkas: 'tim_kerja',
            status_kelengkapan: 'merah',
            catatan_revisi: catatan || 'Terdapat dokumen fisik yang belum lengkap atau perlu diperbaiki.',
            riwayat: [...existingRiwayat, newEntry],
          }
        }

        // Kasus B: Berkas tuntas diterbitkan SP2D di PPSPM / KPPN
        if (targetMeja === 'selesai') {
          const noSp2d = nomorSp2d || `SP2D-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`
          const tglSp2d = new Date().toISOString().split('T')[0]

          const newEntry = {
            id: 'rw-' + Date.now(),
            waktu: waktuSekarang,
            dari_posisi: spj.posisi_berkas,
            ke_posisi: 'selesai',
            status: 'hijau',
            aksi: 'Penerbitan SP2D & Penyelesaian Arsip',
            petugas: namaPetugas,
            jabatan: jabatanPetugas,
            catatan: `SP2D resmi diterbitkan dengan nomor: ${noSp2d}. Seluruh berkas fisik dinyatakan sah dan disimpan rapi di arsip BPS.`,
          }

          return {
            ...spj,
            posisi_berkas: 'selesai',
            status_kelengkapan: 'hijau',
            catatan_revisi: null,
            nomor_sp2d: noSp2d,
            tanggal_sp2d: tglSp2d,
            riwayat: [...existingRiwayat, newEntry],
          }
        }

        // Kasus C: Diteruskan ke meja berikutnya (Admin TU -> PPK -> Bendahara -> PPSPM)
        const labelMeja = {
          admin_tu: 'Tata Usaha (Admin TU)',
          ppk: 'PPK (Pejabat Pembuat Komitmen)',
          bendahara: 'Bendahara Pengeluaran',
          ppspm: 'PPSPM',
        }

        const allWajibChecked = (spj.checklist || [])
          .filter((item) => item.is_wajib)
          .every((item) => item.is_checked)

        const newEntry = {
          id: 'rw-' + Date.now(),
          waktu: waktuSekarang,
          dari_posisi: spj.posisi_berkas,
          ke_posisi: targetMeja,
          status: allWajibChecked ? 'kuning' : 'merah',
          aksi: `Diteruskan ke Meja ${labelMeja[targetMeja] || targetMeja}`,
          petugas: namaPetugas,
          jabatan: jabatanPetugas,
          catatan: catatan || 'Pemeriksaan fisik telah selesai dilakukan dan berkas diteruskan ke meja berikutnya.',
        }

        return {
          ...spj,
          posisi_berkas: targetMeja,
          status_kelengkapan: allWajibChecked ? 'kuning' : 'merah',
          catatan_revisi: null,
          riwayat: [...existingRiwayat, newEntry],
        }
      })
    )
  }

  // Hitung jumlah status untuk kartu metrik
  const getMetrics = () => {
    return {
      total: spjList.length,
      merah: spjList.filter((s) => s.status_kelengkapan === 'merah').length,
      kuning: spjList.filter((s) => s.status_kelengkapan === 'kuning').length,
      hijau: spjList.filter((s) => s.status_kelengkapan === 'hijau').length,
    }
  }

  const value = {
    spjList,
    masterAkunList,
    getSpjById,
    tambahPengajuan,
    toggleChecklist,
    alihkanPosisiBerkas,
    getMetrics,
  }

  return <SpjContext.Provider value={value}>{children}</SpjContext.Provider>
}

export function useSpj() {
  const context = useContext(SpjContext)
  if (!context) {
    throw new Error('useSpj harus digunakan di dalam SpjProvider')
  }
  return context
}
