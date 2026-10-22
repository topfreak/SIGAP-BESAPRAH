// Struktur Resmi Tim Kerja & Fungsi Teknis Badan Pusat Statistik (BPS)
export const TIM_KERJA_BPS = [
  {
    id: 'sosial',
    nama: 'Tim Statistik Sosial',
    kode: 'SOSIAL',
    deskripsi: 'Honor petugas pendataan/pelatihan Susenas, Sakernas, Podes, konsumsi rapat, transport responden',
    warnaBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  {
    id: 'produksi',
    nama: 'Tim Statistik Produksi',
    kode: 'PRODUKSI',
    deskripsi: 'Honor pendataan/transport survei pertanian, SKGB, ubinan padi, hortikultura, industri',
    warnaBadge: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  {
    id: 'distribusi',
    nama: 'Tim Statistik Distribusi',
    kode: 'DISTRIBUSI',
    deskripsi: 'Honor survei harga produsen/konsumen, VHTS (perhotelan), pariwisata, perdagangan',
    warnaBadge: 'bg-sky-50 text-sky-800 border-sky-200',
  },
  {
    id: 'ipds',
    nama: 'Tim IPDS (Integrasi Pengolahan & Diseminasi Statistik)',
    kode: 'IPDS',
    deskripsi: 'Belanja pengolahan data, publikasi BPS, diseminasi statistik, kegiatan TI & infrastruktur',
    warnaBadge: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  },
  {
    id: 'nerwilis',
    nama: 'Tim Nerwilis (Neraca Wilayah & Analisis Statistik)',
    kode: 'NERWILIS',
    deskripsi: 'Penyusunan PDRB tahunan/triwulanan, tabel input-output, konsolidasi data neraca ekonomi',
    warnaBadge: 'bg-purple-50 text-purple-800 border-purple-200',
  },
  {
    id: 'umum',
    nama: 'Bagian Umum / Tata Usaha (TU)',
    kode: 'UMUM',
    deskripsi: 'Belanja rutin operasional kantor sehari-hari, ATK, langganan daya/jasa, pemeliharaan gedung/kendaraan',
    warnaBadge: 'bg-slate-100 text-slate-800 border-slate-300',
  },
]

export const getTimKerjaById = (id) => {
  return TIM_KERJA_BPS.find((t) => t.id === id) || {
    id: id || 'sosial',
    nama: id || 'Tim Kerja Teknis BPS',
    kode: (id || 'TEKNIS').toUpperCase(),
    warnaBadge: 'bg-blue-50 text-blue-800 border-blue-200',
  }
}
